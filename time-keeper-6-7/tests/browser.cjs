const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '../..');
const mount = '/lumi-website/';
const store = 'lumi.time-keeper-6-7.progress.v1';
const stages = ['position', 'cipher', 'letter', 'tense', 'twins', 'sentence', 'story', 'finish'];
const profiles = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1280, height: 720 },
  { name: 'iPad portrait', width: 820, height: 1180, touch: true },
  { name: 'iPad landscape', width: 1180, height: 820, touch: true },
  { name: 'iPhone', width: 390, height: 844, touch: true },
  { name: 'Android', width: 360, height: 800, touch: true },
];
const type = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.webp': 'image/webp', '.mp3': 'audio/mpeg',
};

function serve(request, response) {
  const url = new URL(request.url, 'http://localhost');
  const file = path.join(root, url.pathname.slice(mount.length));
  if (!url.pathname.startsWith(mount) || !file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    response.writeHead(404).end();
    return;
  }
  const size = fs.statSync(file).size;
  const contentType = type[path.extname(file)] || 'application/octet-stream';
  const range = /^bytes=(\d+)-(\d*)$/.exec(request.headers.range || '');
  if (range) {
    const start = Number(range[1]);
    const end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    response.writeHead(206, {'Content-Type': contentType, 'Content-Length': end - start + 1,
      'Content-Range': 'bytes ' + start + '-' + end + '/' + size, 'Accept-Ranges': 'bytes'});
    fs.createReadStream(file, { start, end }).pipe(response);
  } else {
    response.writeHead(200, {'Content-Type': contentType, 'Content-Length': size, 'Accept-Ranges': 'bytes'});
    fs.createReadStream(file).pipe(response);
  }
}

async function checkImages(page, name) {
  const result = await page.evaluate(async () => {
    const all = await Promise.all([...document.images].map(img => img.decode().then(() => null, () => img.getAttribute('src'))));
    return { broken: all.filter(Boolean), scrollWidth: document.documentElement.scrollWidth, width: innerWidth };
  });
  assert.deepEqual(result.broken, [], name + ' successful image decodes');
  assert(result.scrollWidth <= result.width + 1, name + ' horizontal overflow');
}

async function touchDrag(page, card, slot) {
  await card.scrollIntoViewIfNeeded();
  const from = await card.boundingBox();
  const to = await slot.boundingBox();
  const [start, end] = [from, to].map(box => ({
    x: Math.round(box.x + box.width / 2), y: Math.round(box.y + box.height / 2), id: 1,
  }));
  const session = await page.context().newCDPSession(page);
  await session.send('Input.dispatchTouchEvent', {type:'touchStart', touchPoints:[start]});
  for (const fraction of [.25, .5, .75, 1]) {
    await session.send('Input.dispatchTouchEvent', {type:'touchMove',
      touchPoints:[{x:start.x+(end.x-start.x)*fraction, y:start.y+(end.y-start.y)*fraction, id:1}]});
  }
  await session.send('Input.dispatchTouchEvent', {type:'touchEnd', touchPoints:[]});
  assert.equal(await page.locator('.drag-ghost').count(),0);
  await session.detach();
}

async function testTiles(page, stage, touch) {
  const first = page.locator('.tile-pool [data-tile]').first();
  const value = await first.getAttribute('data-tile');
  const slot = page.locator('.slot-grid [data-drop="0"]');
  if (touch) await touchDrag(page,first,slot);
  else await first.click();
  assert.equal(await slot.locator('[data-tile]').getAttribute('data-tile',{timeout:3000}),value,stage);
}

async function verifyProfile(browser, origin, profile) {
  const { name, width, height, touch } = profile;
  const page = await browser.newPage({ viewport: { width, height }, isMobile: !!touch, hasTouch: !!touch });
  const errors = [];
  const bad = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400 && !response.url().endsWith('/favicon.ico')) bad.push(response.url()); });
  await page.addInitScript(() => localStorage.setItem('lumi.analytics.consent.v1', 'denied'));
  await page.goto(origin + mount + 'time-keeper-6-7/index.html');
  await page.getByRole('button', {name:'Начать приключение'}).waitFor();
  await checkImages(page, name + ' start');
  if (name === 'desktop') await page.locator('#music-toggle').click();
  await page.locator('#begin').click();
  if (name === 'desktop') {
    await page.waitForFunction(() => document.getElementById('narration').currentTime > .4, undefined, {timeout:7000});
    const audio = await page.evaluate(() => {
      const music = document.getElementById('music');
      return { playing: !music.paused, volume: music.volume };
    });
    assert(audio.playing && audio.volume > 0 && audio.volume < .04, 'music ducks during Russian narration');
    const consonants = await page.evaluate(async () => {
      const narrator = document.getElementById('narration');
      const results = [];
      for (const phoneme of ['s','m','l','t','k','r','n','a','o','u','i','y']) {
        await window.TimeSound.say(['phoneme:' + phoneme], true);
        results.push(narrator.currentTime > .12 && narrator.error === null && narrator.src.endsWith('phoneme-' + phoneme + '.mp3'));
      }
      return results;
    });
    assert.deepEqual(consonants, Array(12).fill(true), 'Chromium plays all twelve isolated sound files');
  }
  await page.locator('#voice').click();
  if (name === 'desktop') {
    await page.locator('.time-top .exit').evaluate(link => link.addEventListener('click', event => event.preventDefault(), {once:true}));
    await page.locator('.time-top .exit').click();
    assert(await page.evaluate(() => ['music','narration','chime'].every(id => document.getElementById(id).paused)));
    await page.locator('#music-toggle').click();
  }
  for (const [index, stage] of stages.entries()) {
    await page.evaluate(({ key, index }) => {
      const state = JSON.parse(localStorage.getItem(key));
      const task = window.TimeContent.tasks[index];
      const round = task?.rounds?.[0];
      let pool = [];
      let count = 0;
      if (task?.id==='cipher') { pool=[...round.answer,...round.extras]; count=round.answer.length; }
      if (task?.id==='sentence') { pool=round.scrambled; count=pool.length; }
      if (task?.id==='story') { pool=['3','1','5','2','4']; count=5; }
      Object.assign(state, {stage:index, round:0, earned:index, done:false, pending:false,
        selected:null, storyPhase:'sort', slots:Array(count).fill(null), order:pool,
        launched:false, clockSlots:Array(7).fill(false)});
      localStorage.setItem(key, JSON.stringify(state));
    }, { key:store, index });
    await page.reload();
    await page.locator('#begin').click();
    await page.locator('body[data-scene="' + stage + '"]').waitFor();
    await checkImages(page, name + ' ' + stage);
    const placed = await page.evaluate(() =>
      document.querySelector('#lumi-analytics-controls').getBoundingClientRect().top >=
      document.querySelector('#game').getBoundingClientRect().bottom - 1);
    assert(placed, name + ' analytics footer under the game');
    if (['cipher','sentence','story'].includes(stage)) await testTiles(page,stage,touch);
    if (stage==='letter') {
      const item = page.getByRole('button',{name:'Выбрать букву О'});
      if (touch) await touchDrag(page,item,page.locator('.letter-slot'));
      else await item.click();
      assert.equal(await page.locator('.letter-slot').textContent(),'О');
    }
    if (stage==='tense') {
      await page.locator('[data-choose="0"]').click();
      await page.getByRole('button',{name:'Проверить'}).click();
      assert.equal(await page.locator('[data-choose="0"] .portal-transfer').count(),1);
      await checkImages(page,name+' portal arrival');
    }
    if (stage==='finish') {
      const gear = page.locator('[data-gear="1"]');
      const seat = page.locator('[data-seat="1"]');
      if (touch) await touchDrag(page,gear,seat);
      else { await gear.click(); await seat.click(); }
      assert(await page.locator('[data-seat="1"].installed').count());
      for (let i=2;i<=7;i+=1) {
        await page.locator('[data-gear="'+i+'"]').click();
        await page.locator('[data-seat="'+i+'"]').click();
      }
      await page.getByRole('button',{name:'Запустить часы'}).click();
      await page.getByRole('heading',{name:'Ты вернул времени его силу!'}).waitFor();
      await page.getByRole('link',{name:'В мир приключений'}).waitFor();
    }
  }
  await page.getByRole('link', {name:'В мир приключений'}).click();
  await page.locator('[data-adventure="time-keeper-6-7"]').waitFor();
  assert(page.url().endsWith('#age-6-7'));
  assert.deepEqual(errors, [], name + ' JavaScript errors');
  assert.deepEqual(bad, [], name + ' failed resources');
  console.log(name + ' ' + width + '×' + height + ': 9 screens, resources, layout, catalogue' + (touch ? ', touch drag' : ''));
  if (name==='desktop') {
    const previous = await page.evaluate(() => window.LumiCatalogData.adventures
      .filter(entry=>entry.id!=='time-keeper-6-7').map(entry=>entry.game));
    assert.equal(previous.length,7);
    for (const route of previous) {
      const response = await page.goto(origin+mount+route);
      assert.equal(response.status(),200,route);
      assert((await page.title()).length>0,route);
    }
    assert.deepEqual(errors,[], 'existing adventures open without JavaScript errors');
    console.log('All seven existing catalogue routes opened in Chromium');
  }
  await page.close();
}

(async () => {
  const server = http.createServer(serve);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    const origin = 'http://127.0.0.1:' + server.address().port;
    const executablePath = process.env.LUMI_BROWSER_PATH;
    for (const profile of profiles) {
      const browser = await chromium.launch({ executablePath, args: executablePath ?
        ['--no-sandbox', '--single-process', '--disable-dev-shm-usage', '--no-zygote'] : [] });
      try {
        await verifyProfile(browser, origin, profile);
      } finally {
        await browser.close();
      }
    }
  } finally {
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
