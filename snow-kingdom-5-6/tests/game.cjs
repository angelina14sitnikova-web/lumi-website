const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const root = path.resolve(__dirname, '..');
const key = 'lumi.snow-kingdom-5-6.progress.v1';
const medal = 'lumi.snow-kingdom-5-6.medal.v1';
const files = ['content.js', 'story.js', 'game.js'];
const otherGame = 'lumi.lost-pearl-4-5.progress.v1';
const events = [];
const audio = [];
const errors = [];
let dom, w, d;

function open(saved = {}) {
  dom?.window.close();
  const console = new VirtualConsole();
  console.on('jsdomError', error => errors.push(error.message));
  dom = new JSDOM(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), {
    url: 'https://example.test/lumi-website/snow-kingdom-5-6/index.html',
    runScripts: 'outside-only', virtualConsole: console, pretendToBeVisual: true,
  });
  w = dom.window;
  d = w.document;
  w.scrollTo = () => {};
  w.scrollBy = () => {};
  w.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  w.HTMLDialogElement.prototype.close = function () { this.open = false; };
  w.SnowSound = {
    say: (...args) => audio.push(['voice', ...args]),
    background: on => audio.push(['music', on]),
    effect: name => audio.push(['effect', name]),
    stop() {}, stopVoice() {},
  };
  w.LumiAnalytics = {
    begin: (...args) => events.push(['begin', ...args]),
    taskComplete: (...args) => events.push(['task', ...args]),
    complete: (...args) => events.push(['complete', ...args]),
  };
  Object.entries(saved).forEach(([k, v]) => w.localStorage.setItem(k, v));
  for (const file of files) w.eval(fs.readFileSync(path.join(root, file), 'utf8'));
}

const current = () => JSON.parse(w.localStorage.getItem(key));
const view = selector => {
  const element = d.querySelector(selector);
  assert(element, 'Missing ' + selector);
  return element;
};
const click = selector => view(selector).click();
const select = answer => click('[data-select="' + answer + '"]');
function checkImages() {
  for (const image of d.querySelectorAll('img[src]')) {
    const resource = image.getAttribute('src');
    assert(fs.existsSync(path.join(root, resource)), 'Missing resource ' + resource);
  }
}
const snapshot = () => Object.fromEntries(Object.keys(w.localStorage).map(k => [k, w.localStorage.getItem(k)]));

function pointer(name, target, x, y) {
  const event = new w.Event(name, {bubbles: true, cancelable: true});
  Object.assign(event, {pointerId: 5, isPrimary: true, button: 0, pointerType: 'touch', clientX: x, clientY: y});
  target.dispatchEvent(event);
}

open({[otherGame]: 'sentinel'});
const content = w.SnowContent;
assert.equal(content.tasks.length, 7);
assert.equal(content.tasks.reduce((count, task) => count + (task.rounds?.length || 0), 0), 33);
checkImages();
click('#begin');
assert(audio.find(([, lines]) => Array.isArray(lines) && lines.includes('phoneme:s')));
assert.equal(events[0][2], true);

let played = 0;
const rates = [];
for (const [stage, task] of Array.from(content.tasks).slice(0, 6).entries()) {
  const stageStart = played;
  for (const [index, round] of task.rounds.entries()) {
    assert.equal(current().stage, stage);
    assert.equal(current().round, index);
    checkImages();
    assert.equal(current().earned, stage);
    click('#hint');
    assert(view('.feedback').textContent.includes(task.hint));
    if (task.type === 'multiple') {
      const first = view('[data-hear]');
      first.click();
      assert.equal(view('#check').disabled, true);
      const wrong = round.options.find(id => !round.answers.includes(id));
      select(wrong);
      click('#check');
      assert.equal(current().done, false);
      select(wrong);
      assert.equal(view('#check').disabled, true);
      round.answers.forEach(select);
      click('#check');
    } else if (task.type === 'speech') {
      click('[data-hear]');
      assert.equal(view('#check').disabled, true);
      select((round.answer + 1) % 3);
      click('#check');
      assert.equal(current().done, false);
      select(round.answer);
      click('#check');
    } else if (task.type === 'syllables') {
      for (const button of d.querySelectorAll('[data-select]')) {
        assert.equal(button.querySelectorAll('.floe-lights img').length, Number(button.dataset.select));
      }
      select(round.answer % 4 + 1);
      assert.equal(current().done, false);
      select(round.answer);
      assert.equal(view('.river-lumi').classList.contains('jumping'), true);
    } else {
      select(round.options.find(id => id !== round.answer));
      assert.equal(current().done, false);
      select(round.answer);
      assert.equal(d.querySelectorAll('.crystals .lit').length, index + 1);
    }
    assert.equal(current().done, true);
    assert.equal(current().round, index);
    if (stage === 2 && index === 2) {
      open(snapshot());
      assert.match(view('#begin').textContent, /Продолжить/);
      click('#begin');
      assert.equal(current().round, index);
      assert.equal(current().done, true);
    }
    const advance = view('#next-round');
    advance.click();
    advance.click();
    played += 1;
  }
  assert.equal(current().earned, stage + 1);
  assert.equal(view('#reward').open, true);
  assert.equal(view('#reward-heading').textContent, 'ПРАВИЛЬНО!');
  assert.equal(current().stage, stage);
  click('#next-task');
  click('#next-task');
  assert.equal(current().stage, stage + 1);
  rates.push(played - stageStart);
}

checkImages();
assert.notEqual(current().order.join(), '1,2,3,4');
assert.equal(view('#check-story').disabled, true);
const card3 = view('[data-story-card="3"]');
const slot3 = view('[data-story-drop="2"]');
d.elementFromPoint = () => slot3;
pointer('pointerdown', card3, 16, 15);
pointer('pointermove', card3, 77, 74);
assert(d.querySelector('.story-ghost'));
pointer('pointerup', card3, 120, 120);
assert(!d.querySelector('.story-ghost'));
assert.equal(current().slots[2], 3);
click('[data-story-card="2"]');
click('[data-story-card="1"]');
click('[data-story-card="4"]');
assert.deepEqual(current().slots, [2, 1, 3, 4]);
click('#check-story');
assert.equal(current().storyPhase, 'sort');
click('[data-story-card="2"]');
click('[data-story-card="1"]');
click('[data-story-card="1"]');
click('[data-story-card="2"]');
click('#check-story');
assert.equal(current().storyPhase, 'tell');
assert.equal(d.querySelector('#story-example'), null);
assert(audio.some(([, lines]) => Array.isArray(lines) && content.story.prompts.every(item => lines.includes(item))));
click('#told');
click('#story-example');
assert(audio.at(-1)[1].includes(content.story.example));
click('#story-done');
click('#story-done');
assert.equal(current().earned, 7);
click('#next-task');
assert.equal(current().stage, 7);
checkImages();
assert.equal(view('h1').textContent, 'Ты спас Снежное королевство!');
assert.equal(d.querySelectorAll('.orbit-shard').length, 7);
assert.equal(w.localStorage.getItem(medal), 'earned');
assert.equal(view('.final .return-link').getAttribute('href'), '../crystal-world.html#age-5-6');
assert.deepEqual(events.filter(([kind]) => kind === 'task').map(row => row[2]), [1, 2, 3, 4, 5, 6, 7]);
assert.equal(events.filter(([kind]) => kind === 'complete').length, 1);
assert(events.every(([, id]) => id === 'snow-kingdom-5-6'));

click('#voice');
click('#music-toggle');
open(snapshot());
assert.equal(view('#voice').getAttribute('aria-pressed'), 'false');
assert.equal(view('#music-toggle').getAttribute('aria-pressed'), 'true');
click('#begin');
click('#replay');
assert.equal(current().stage, 0);
assert.equal(current().earned, 0);
assert.equal(w.localStorage.getItem(medal), 'earned');
assert.equal(w.localStorage.getItem(otherGame), 'sentinel');
assert.equal(events.at(-1)[0], 'begin');
assert.equal(events.at(-1)[2], true);
assert.deepEqual(errors, []);
dom.window.close();
console.log(JSON.stringify({ result: 'PASS', roundsByTask: rates, story: 'tap and synthetic touch pointer events', played }));
