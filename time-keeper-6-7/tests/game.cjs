const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const root = path.join(__dirname,'..');
const id = 'time-keeper-6-7';
const key = 'lumi.'+id+'.progress.v1';
const medal = 'lumi.'+id+'.medal.v1';
const previous = 'lumi.snow-kingdom-5-6.progress.v1';
const errors = [];
const events = [];
const narration = [];
let dom, w, d;

function open(data = {}) {
  dom?.window.close();
  const log = new VirtualConsole();
  log.on('jsdomError', error=>errors.push(error.message));
  dom = new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8'), {
    url:'https://example.test/lumi-website/time-keeper-6-7/index.html',
    runScripts:'outside-only', pretendToBeVisual:true, virtualConsole:log,
  });
  w = dom.window;
  d = w.document;
  w.scrollTo = w.scrollBy = ()=>{};
  w.matchMedia = ()=>({matches:true});
  w.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  w.HTMLDialogElement.prototype.close = function () { this.open = false; };
  w.TimeSound = {say:lines=>narration.push(lines), effect(){}, background(){}, stop(){}, stopVoice(){}};
  w.LumiAnalytics = Object.fromEntries(['begin','taskComplete','complete'].map(name=>[name,(...args)=>events.push([name,...args])]));
  Object.entries(data).forEach(([name,value])=>w.localStorage.setItem(name,value));
  for (const file of ['content.js','tiles.js','view.js','game.js']) w.eval(fs.readFileSync(path.join(root,file),'utf8'));
}

function find(selector) {
  const element = d.querySelector(selector);
  assert(element,'Missing '+selector);
  return element;
}
const click = selector => find(selector).click();
const saved = () => JSON.parse(w.localStorage.getItem(key));
const values = () => Object.fromEntries(Object.keys(w.localStorage).map(name=>[name,w.localStorage.getItem(name)]));
const choose = i => click('[data-choose="'+i+'"]');
const tile = token => click('[data-tile="'+token+'"]');
const next = () => {
  const button = find('#next-round');
  button.click();
  button.click();
};

function pointer(name,element,x,y) {
  const event = new w.Event(name,{bubbles:true,cancelable:true});
  Object.assign(event,{pointerId:3,isPrimary:true,button:0,pointerType:'touch',clientX:x,clientY:y});
  element.dispatchEvent(event);
}
function drag(selector,target) {
  const source = find(selector);
  const destination = find('[data-drop="'+target+'"]');
  d.elementFromPoint = ()=>destination;
  pointer('pointerdown',source,25,30);
  pointer('pointermove',source,140,240);
  assert(d.querySelector('.drag-ghost'));
  pointer('pointerup',source,168,260);
  assert(!d.querySelector('.drag-ghost'));
}
function award(stage) {
  assert.equal(saved().earned,stage+1);
  assert.equal(find('#reward').open,true);
  assert.equal(find('#reward-title').textContent,'ПРАВИЛЬНО!');
  click('#next-task');
  click('#next-task');
  assert.equal(saved().stage,stage+1);
}

(async()=>{
  open({[previous]:'KEEP'});
  click('#begin');
  assert.deepEqual(events[0],['begin',id,true]);
  const material = w.TimeContent;
  assert.equal(material.tasks.length,7);
  assert.equal(material.tasks.reduce((sum,task)=>sum+(task.rounds?.length??0),0),36);
  assert(narration.some(lines=>lines.includes('phoneme:s')));
  const counts = [];
  for (let stage=0;stage<6;stage++) {
    const task = material.tasks[stage];
    for (const [roundNumber,round] of task.rounds.entries()) {
      assert.equal(saved().stage,stage);
      assert.equal(saved().round,roundNumber);
      assert.equal(saved().earned,stage);
      click('#hint');
      assert.equal(find('.feedback').textContent,task.hint);
      if (task.id==='position') {
        choose((round.answer+1)%3);
        assert.equal(saved().done,false);
        assert(!d.querySelector('.working-gear'));
        choose(round.answer);
        assert(find('.working-gear'));
      } else if (task.id==='cipher') {
        assert.notDeepEqual(saved().order.filter(x=>round.answer.includes(x)),Array.from(round.answer));
        click('.tile-option [data-hear]');
        assert(saved().slots.every(x=>x===null));
        const wrong = [...round.answer].reverse();
        wrong.forEach(tile);
        click('#check');
        assert.equal(saved().done,false);
        wrong.forEach(tile);
        if (roundNumber===0) {
          drag('[data-tile="'+round.answer[0]+'"]',0);
          assert.equal(saved().slots[0],round.answer[0]);
          round.answer.slice(1).forEach(tile);
        } else round.answer.forEach(tile);
        click('#check');
        assert(narration.at(-1).includes(round.word));
      } else if (task.id==='letter') {
        const correct = round.choices.indexOf(round.answer);
        click('.letters [data-hear]');
        assert.equal(saved().selected,null);
        assert(narration.at(-1)[0].startsWith('phoneme:'));
        choose((correct+1)%4);
        click('#check');
        assert.equal(saved().done,false);
        if (roundNumber===2) drag('[data-drag="'+correct+'"]',0);
        else choose(correct);
        assert.equal(find('.letter-slot').textContent,round.answer);
        click('#check');
      } else if (task.id==='sentence') {
        const answer = round.answers.at(-1).split(' ');
        if (roundNumber===3) {
          for (const word of ['Бабочка','летит','цветком','над'].map(x=>x.toLowerCase())) tile(word);
          click('#check');
          assert.equal(saved().done,false);
          [...saved().slots].forEach(tile);
        }
        answer.forEach(tile);
        click('#check');
        assert(narration.at(-1).includes(material.sentenceText(answer.join(' '))));
      } else {
        const options = task.id==='tense'?material.portals[roundNumber<6?0:1]:round.choices;
        const label = find('[data-choose="0"]').textContent.trim();
        assert(label.includes(options[0]));
        click('.option [data-hear]');
        assert.equal(saved().selected,null);
        choose((round.answer+1)%3);
        click('#check');
        assert.equal(saved().done,false);
        choose(round.answer);
        click('#check');
        if (task.id==='tense') assert(find('.portal-transfer'));
        else assert.equal(find('.explain').textContent,round.explanation);
      }
      assert.equal(saved().done,true);
      if (stage===2 && roundNumber===2) {
        open(values());
        assert.match(find('#begin').textContent,/Продолжить/);
        click('#begin');
        assert.equal(saved().round,2);
        assert.equal(saved().done,true);
      }
      next();
    }
    counts.push(task.rounds.length);
    award(stage);
  }
  assert.notDeepEqual(saved().order,['1','2','3','4','5']);
  drag('[data-tile="4"]',3);
  for (const token of ['2','1','3','5']) tile(token);
  click('#check');
  assert.equal(saved().storyPhase,'sort');
  tile('1');tile('2');tile('1');tile('2');
  assert.deepEqual(saved().slots,['1','2','3','4','5']);
  click('#check');
  assert.equal(saved().storyPhase,'tell');
  assert.equal(d.querySelector('[data-hear*="Однажды"]'),null);
  assert(material.story.prompts.every(text=>narration.at(-1).includes(text)));
  click('#told');
  assert(find('[data-hear*="Однажды"]'));
  click('#story-done');
  award(6);

  assert.equal(saved().stage,7);
  assert.equal(d.querySelector('#launch'),null);
  assert.notDeepEqual(saved().clockOrder,[1,2,3,4,5,6,7]);
  click('[data-gear="1"]');click('[data-seat="2"]');
  assert(!saved().clockSlots.some(Boolean));
  assert.equal(find('.feedback').textContent,material.feedback.misplaced);
  drag('[data-gear="1"]',0);
  assert(saved().clockSlots[0]);
  open(values());
  click('#begin');
  assert(saved().clockSlots[0]);
  for (let i=2;i<=7;i++) {
    click('[data-gear="'+i+'"]');
    click('[data-seat="'+i+'"]');
  }
  assert(saved().clockSlots.every(Boolean));
  assert.equal(events.filter(([name])=>name==='complete').length,0);
  const start = find('#launch');
  start.click();start.click();
  assert(saved().launched);
  assert.equal(events.filter(([name])=>name==='complete').length,1);
  assert(find('.finish.running'));
  assert.equal(find('.final-prize').hidden,true);
  assert.equal(w.localStorage.getItem(medal),'earned');
  await new Promise(resolve=>setTimeout(resolve,10));
  assert(find('.final-prize .medal'));
  assert.equal(find('.final-prize').hidden,false);
  assert.equal(find('.final-prize .exit').getAttribute('href'),'../crystal-world.html#age-6-7');
  assert.deepEqual(events.filter(([name])=>name==='taskComplete').map(event=>event[2]),[1,2,3,4,5,6,7]);
  click('#voice');click('#music-toggle');
  open(values());
  assert.equal(find('#voice').getAttribute('aria-pressed'),'false');
  assert.equal(find('#music-toggle').getAttribute('aria-pressed'),'true');
  click('#begin');click('#replay');
  assert.equal(saved().stage,0);
  assert.equal(saved().earned,0);
  assert.equal(w.localStorage.getItem(medal),'earned');
  assert.equal(w.localStorage.getItem(previous),'KEEP');
  assert.deepEqual(events.filter(([name])=>name==='begin'),[['begin',id,true],['begin',id,true]]);
  assert.deepEqual(errors,[]);
  dom.window.close();
  console.log(JSON.stringify({result:'PASS',rounds:counts,storyCards:5,clockGears:7,analytics:events.length}));
})().catch(error=>{console.error(error);process.exitCode=1;});
