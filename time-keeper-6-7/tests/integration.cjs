const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const root = path.resolve(__dirname, '../..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const adventure = 'time-keeper-6-7';
const age = 'age-6-7';
const analyticsCode = read('analytics/lumi-analytics.js');

const catalogue = new JSDOM(read('crystal-world.html'), {
  url: 'https://example.test/lumi-website/crystal-world.html#' + age, runScripts: 'outside-only',
});
const scope = catalogue.window;
const document = scope.document;
scope.eval(read('site-sections/catalog-data.js'));
scope.eval(read('site-sections/catalog.js'));
const ids = () => [...document.querySelectorAll('[data-adventure]')].map(card => card.dataset.adventure);
assert.deepEqual(ids(), ['enchanted-library', adventure]);
assert.equal(document.querySelector('[data-age="age-6-7"]').getAttribute('aria-pressed'), 'true');
document.querySelector('[data-direction="speech"]').click();
assert.deepEqual(ids(), [adventure]);
assert.equal(document.querySelector('[data-adventure] a').getAttribute('href'), adventure + '/index.html');
document.querySelector('[data-age="age-4-5"]').click();
assert(ids().includes('lost-pearl-4-5'));
assert(!ids().includes(adventure));
document.querySelector('[data-age="age-5-6"]').click();
assert(ids().includes('snow-kingdom-5-6'));
catalogue.window.close();

function analytics(consent) {
  const dom = new JSDOM('<footer data-lumi-analytics-footer></footer>', {
    url: 'https://example.test/lumi-website/' + adventure + '/index.html?private=secret',
    runScripts: 'outside-only',
  });
  const w = dom.window;
  const d = w.document;
  if (consent) w.localStorage.setItem('lumi.analytics.consent.v1', consent);
  const script = d.createElement('script');
  script.src = 'https://example.test/lumi-website/analytics/lumi-analytics.js';
  Object.defineProperty(d, 'currentScript', {value: script});
  const sends = [];
  w.ym = (...args) => sends.push(args);
  w.eval(analyticsCode);
  d.dispatchEvent(new w.Event('DOMContentLoaded'));
  const sdk = d.querySelector('#lumi-metrika-sdk');
  const play = () => {
    const api = w.LumiAnalytics;
    api.begin(adventure, true);
    api.begin(adventure, true);
    for (let i = 1; i < 8; i++) {
      api.taskComplete(adventure, i);
      api.taskComplete(adventure, i);
    }
    api.complete(adventure);
    api.complete(adventure);
  };
  if (consent !== 'allowed') {
    assert.equal(sdk, null);
    play();
    assert.equal(sends.length, 0);
  } else {
    play();
    sdk.onload();
    let goals = sends.filter(call => call[1] === 'reachGoal');
    assert.equal(goals.length, 9);
    assert.deepEqual(goals.map(call => call[2]), ['adventure_start', ...Array(7).fill('task_complete'), 'adventure_complete']);
    assert.deepEqual(goals.slice(1, 8).map(call => call[3].task_number), [1, 2, 3, 4, 5, 6, 7]);
    for (const [counter, , goal, params] of goals) {
      assert.equal(counter, 114310945);
      assert.equal(params.adventure_id, adventure);
      assert.equal(params.age_group, '6-7');
      assert.deepEqual(Object.keys(params).sort(), goal === 'task_complete' ?
        ['adventure_id', 'age_group', 'task_number'] : ['adventure_id', 'age_group']);
    }
    const time = w.Date.now();
    w.Date.now = () => time + 2000;
    play();
    goals = sends.filter(call => call[1] === 'reachGoal');
    assert.equal(goals.length, 18);
    d.querySelector('[data-choice="denied"]').click();
    play();
    assert.equal(sends.filter(call => call[1] === 'reachGoal').length, 18);
  }
  assert(d.querySelector('footer #lumi-analytics-controls'));
  assert.equal(d.querySelector('#lumi-analytics-panel').hidden, true);
  dom.window.close();
}

const restored = new JSDOM('<body></body>', {
  url:'https://example.test/lumi-website/time-keeper-6-7/index.html',runScripts:'outside-only',
});
const restoredWindow = restored.window;
const runtimeDoc = restoredWindow.document;
const tag = runtimeDoc.createElement('script');
tag.src = 'https://example.test/lumi-website/analytics/lumi-analytics.js';
Object.defineProperty(runtimeDoc,'currentScript',{value:tag});
const resumedEvents = [];
restoredWindow.localStorage.setItem('lumi.analytics.consent.v1','allowed');
restoredWindow.ym = (...args)=>resumedEvents.push(args);
restoredWindow.eval(analyticsCode);
runtimeDoc.dispatchEvent(new restoredWindow.Event('DOMContentLoaded'));
runtimeDoc.querySelector('#lumi-metrika-sdk').onload();
const resumed = restoredWindow.LumiAnalytics;
resumed.complete(adventure);
assert.equal(resumedEvents.filter(row=>row[2]==='adventure_complete').length,0);
resumed.complete(adventure,true);
resumed.complete(adventure,true);
assert.equal(resumedEvents.filter(row=>row[2]==='adventure_complete').length,1);
assert(resumedEvents.filter(row=>row[2]==='adventure_complete').every(row=>Object.keys(row[3]).length===2));
restoredWindow.close();

for (const consent of [null, 'denied', 'allowed']) analytics(consent);
console.log('Catalogue, existing cards, allowlist, consent, deduplication and full replay: PASS');
