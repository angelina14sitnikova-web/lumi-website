const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '../..');
const mount = '/lumi-website/';
const store = 'lumi.snow-kingdom-5-6.progress.v1';
const stages = ['sounds', 'syllables', 'mittens', 'riddles', 'places', 'spells', 'story', 'final'];
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

async function touchDrag(page) {
  const card = page.locator('.story-pool [data-story-card]').first();
  await card.scrollIntoViewIfNeeded();
  const slot = page.locator('[data-story-drop="0"]');
  const from = await card.boundingBox();
  const to = await slot.boundingBox();
  const values = [from, to].map(box => ({
    x: Math.round(box.x + box.width / 2),
    y: Math.round(box.y + box.height / 2),
    id: 1,
  }));
  const [start, end] = values;
  const id = Number(await card.getAttribute('data-story-card'));
  const session = await page.context().newCDPSession(page);
  await session.send('Input.dispatchTouchEvent', {type:'touchStart', touchPoints:[start]});
  for (const fraction of [.25, .5, .75, 1]) {
    await session.send('Input.dispatchTouchEvent', {type:'touchMove',
      touchPoints:[{x:start.x+(end.x-start.x)*fraction, y:start.y+(end.y-start.y)*fraction, id:1}]});
  }
  await session.send('Input.dispatchTouchEvent', {type:'touchEnd', touchPoints:[]});
  assert.equal(Number(await slot.locator('[data-story-card]').getAttribute('data-story-card', {timeout:3000})), id);
  assert.equal(await page.locator('.story-ghost').count(), 0);
  await session.detach();
}

async function verifyProfile(browser, origin, profile) {
  const { name, width, height, touch } = profile;
  const page = await browser.newPage({ viewport: { width, height }, isMobile: !!touch, hasTouch: !!touch });
  const errors = [];
  const bad = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400 && !response.url().endsWith('/favicon.ico')) bad.push(response.url()); });
  await page.addInitScript(() => localStorage.setItem('lumi.analytics.consent.v1', 'denied'));
  await page.goto(origin + mount + 'snow-kingdom-5-6/index.html');
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
      for (const phoneme of ['s','l','m','sh','k']) {
        await window.SnowSound.say(['phoneme:' + phoneme], true);
        results.push(narrator.currentTime > .12 && narrator.error === null && narrator.src.endsWith('phoneme-' + phoneme + '.mp3'));
      }
      return results;
    });
    assert.deepEqual(consonants, [true, true, true, true, true], 'Chromium plays all five isolated consonant files');
  }
  await page.locator('#voice').click();
  if (name === 'desktop') {
    await page.locator('.snow-top .return-link').evaluate(link => link.addEventListener('click', event => event.preventDefault(), {once:true}));
    await page.locator('.snow-top .return-link').click();
    assert(await page.evaluate(() => ['music','narration','chime'].every(id => document.getElementById(id).paused)));
    await page.locator('#music-toggle').click();
  }
  for (const [index, stage] of stages.entries()) {
    await page.evaluate(({ key, index }) => {
      const state = JSON.parse(localStorage.getItem(key));
      Object.assign(state, {stage:index, round:0, earned:index, done:false, pending:false,
        slots:[null, null, null, null], storyPhase:'sort'});
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
    if (stage === 'story') {
      if (touch) await touchDrag(page);
      const card = page.locator('.story-pool [data-story-card]').first();
      await card.click();
      const count = await page.locator('.story-slots [data-story-card]').count();
      assert.equal(count, touch ? 2 : 1);
    }
  }
  await page.getByRole('link', {name:'В мир приключений'}).click();
  await page.locator('[data-adventure="snow-kingdom-5-6"]').waitFor();
  assert(page.url().endsWith('#age-5-6'));
  assert.deepEqual(errors, [], name + ' JavaScript errors');
  assert.deepEqual(bad, [], name + ' failed resources');
  console.log(name + ' ' + width + '×' + height + ': 9 screens, resources, layout, catalogue' + (touch ? ', touch drag' : ''));
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
