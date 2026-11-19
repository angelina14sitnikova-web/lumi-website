(function () {
  'use strict';

  const C = window.TimeContent;
  const sound = window.TimeSound;
  const tiles = window.TimeTiles;
  const view = window.TimeView;
  const progressKey = 'lumi.time-keeper-6-7.progress.v1';
  const medalKey = 'lumi.time-keeper-6-7.medal.v1';
  const pictureOrder = ['1','2','3','4','5'];
  const app = document.getElementById('game');
  const reward = document.getElementById('reward');
  const nextTask = document.getElementById('next-task');
  const voice = document.getElementById('voice');
  const music = document.getElementById('music-toggle');
  let state = read();
  let active = false;
  let feedback = '';
  let misses = 0;
  let reveal = true;

  function current(saved = state) {
    const task = C.tasks[saved.stage];
    return {task, round: task?.rounds?.[saved.round]};
  }

  function sequenceFor(saved) {
    const {task, round} = current(saved);
    if (task?.id === 'cipher') return {pool:[...round.answer,...round.extras], answer:round.answer};
    if (task?.id === 'sentence') return {pool:round.scrambled, answer:round.answers[0].split(' ')};
    if (task?.id === 'story') return {pool:pictureOrder, answer:pictureOrder};
    return {pool:[], answer:[]};
  }

  function read() {
    try {
      const saved = JSON.parse(localStorage.getItem(progressKey));
      if (!saved || saved.version !== 1 || !Number.isInteger(saved.stage) || saved.stage < 0 || saved.stage > 7) return null;
      if (['started','done','pending','voice','music','launched'].some(key=>typeof saved[key] !== 'boolean')) return null;
      const {task} = current(saved);
      if (!Number.isInteger(saved.round) || saved.round < 0 || saved.round >= (task?.rounds?.length ?? 1)) return null;
      if (saved.earned !== saved.stage + Number(saved.pending) || (saved.stage === 7 && saved.pending)) return null;
      if (!Array.isArray(saved.clockSlots) || saved.clockSlots.length !== 7 ||
        saved.clockSlots.some(value=>typeof value !== 'boolean') ||
        (saved.stage < 7 && (saved.launched || saved.clockSlots.some(Boolean))) ||
        (saved.launched && !saved.clockSlots.every(Boolean))) return null;
      if (!['sort','tell','sample'].includes(saved.storyPhase)) return null;
      const {pool, answer} = sequenceFor(saved);
      if (!Array.isArray(saved.order) || !tiles.same([...saved.order].sort(), [...pool].sort())) return null;
      if (!Array.isArray(saved.slots) || saved.slots.length !== answer.length) return null;
      const filled = saved.slots.filter(value=>value!==null);
      if (filled.some(value=>!pool.includes(value)) || new Set(filled).size!==filled.length) return null;
      const selection = saved.stage===7 ? /^[1-7]$/ : /^[0-3]$/;
      if (saved.selected !== null && (typeof saved.selected !== 'string' || !selection.test(saved.selected))) return null;
      return saved;
    } catch {
      return null;
    }
  }

  function fresh() {
    return {
      version:1, started:false, stage:0, round:0, earned:0, done:false, pending:false,
      voice:state?.voice ?? true, music:state?.music ?? false, launched:false, selected:null,
      order:[], slots:[], storyPhase:'sort', clockSlots:Array(7).fill(false),
    };
  }

  function save() {
    try { localStorage.setItem(progressKey, JSON.stringify(state)); } catch { /* Play still works. */ }
  }

  function hasMedal() {
    try { return localStorage.getItem(medalKey) === 'earned'; } catch { return false; }
  }

  function prepareRound() {
    const {pool,answer} = sequenceFor(state);
    state.slots = answer.map(()=>null);
    state.order = pool.length ? tiles.shuffle(pool,answer) : [];
    state.selected = null;
    state.done = false;
    feedback = '';
    misses = 0;
  }

  function analytics(method, ...args) {
    window.LumiAnalytics?.[method]?.(C.id,...args);
  }

  function speech(lines, explicit = false) {
    return sound.say(lines,state?.voice ?? true,explicit);
  }

  function effect(name) {
    sound.effect(name,state.voice);
  }

  function focusGame() {
    app.focus({preventScroll:true});
    window.scrollTo(0,0);
  }

  function settings() {
    for (const [button,label,on] of [[voice,'Голос',state?.voice ?? true],[music,'Музыка',state?.music ?? false]]) {
      button.setAttribute('aria-pressed',String(on));
      button.textContent = label + ': ' + (on?'вкл.':'выкл.');
    }
  }

  function instructions(general = false) {
    if (state.stage===7) return [state.launched?C.finale:C.feedback.assemble];
    const {task,round} = current();
    if (task.id==='story') return state.storyPhase==='sort'?[task.instruction]:[C.story.tell,...C.story.prompts];
    const prompts = general?[task.instruction]:[];
    if (round.word) prompts.push(round.word);
    if (round.phoneme) prompts.push('phoneme:'+round.phoneme);
    if (round.sentence) prompts.push(round.sentence);
    if (round.context) prompts.push(round.context);
    return prompts.length?prompts:[task.instruction];
  }

  function render() {
    if (!active) {
      document.body.dataset.scene = 'start';
      app.innerHTML = view.welcome(state,hasMedal());
      return;
    }
    const {task,round} = current();
    document.body.dataset.scene = task?.id ?? 'finish';
    if (!task) {
      app.innerHTML = view.finish(state,feedback,reveal);
      if (!state.launched) tiles.bind(app.querySelector('[data-assembly]'),(item,target)=>placeGear(Number(item),target+1));
      return;
    }
    app.innerHTML = view.game(task,round,state,feedback);
    if (!state.done && task.id==='letter') tiles.bind(app.querySelector('.board'), item=>choose(item,true));
    if (!state.done && state.slots.length && (task.id!=='story' || state.storyPhase==='sort')) {
      tiles.bind(app.querySelector('.sequence'),moveTile);
    }
    if (state.pending) openReward();
  }

  function begin(replay = false) {
    if (replay ? !state?.launched : active) return;
    const freshRun = replay || !state?.started;
    if (freshRun) {
      state = fresh();
      prepareRound();
    }
    state.started = true;
    active = true;
    reveal = true;
    save();
    if (freshRun) analytics('begin',true);
    sound.background(state.music);
    render();
    focusGame();
    if (freshRun && !replay) speech([C.intro,C.journey,...instructions(true)]);
    else if (state.pending) speech([C.feedback.gear]);
    else if (!state.done || state.stage===7) speech(instructions(true));
  }

  function note(text) {
    feedback = text;
    const status = app.querySelector('.feedback');
    if (status) status.textContent = text;
  }

  function wrong() {
    const {task} = current();
    const lines = [C.feedback.tryAgain,C.feedback.listen,C.feedback.chooseWord,C.feedback.together];
    const text = task?.id==='position'?task.hint:lines[misses++ % lines.length];
    note(text);
    speech([text]);
  }

  function choose(item, dropped = false) {
    if (state.done || state.pending) return;
    const {task,round} = current();
    const count = task?.id==='letter' ? round.choices.length : 3;
    if (dropped && task?.id !== 'letter') return;
    if (!Number.isInteger(Number(item)) || Number(item)<0 || Number(item)>=count) return;
    state.selected = item;
    feedback = '';
    save();
    if (task.id==='position') confirm();
    else {
      render();
      app.querySelector('[data-choose="'+item+'"]')?.focus({preventScroll:true});
    }
  }

  function confirm() {
    if (state.done || state.pending) return;
    const {task,round} = current();
    let valid;
    let line;
    switch (task.id) {
      case 'cipher':
        valid = tiles.same(state.slots,round.answer);
        line = round.word;
        break;
      case 'sentence':
        valid = !state.slots.includes(null) && round.answers.includes(state.slots.join(' '));
        line = C.sentenceText(state.slots.join(' '));
        break;
      case 'story':
        if (state.storyPhase!=='sort' || state.slots.includes(null)) return;
        if (!tiles.same(state.slots,pictureOrder)) return wrong();
        state.storyPhase = 'tell';
        feedback = C.feedback.correct;
        save();
        render();
        effect('correct');
        speech([C.feedback.correct,C.story.tell,...C.story.prompts]);
        return;
      case 'letter':
        valid = round.choices[Number(state.selected)]===round.answer;
        line = round.word;
        break;
      default:
        valid = Number(state.selected)===round.answer;
        line = round.explanation;
    }
    if (!valid) return wrong();
    state.done = true;
    feedback = C.feedback.correct;
    save();
    render();
    effect('correct');
    speech([C.feedback.correct,line]);
    app.querySelector('#next-round')?.focus({preventScroll:true});
  }

  function moveTile(item,target) {
    if (state.done || state.pending || !state.order.includes(item) || target >= state.slots.length ||
      (current().task.id==='story' && state.storyPhase!=='sort')) return;
    state.slots = tiles.move(state.slots,item,target);
    feedback = '';
    save();
    render();
    // Retain keyboard focus after the button moves.
    [...app.querySelectorAll('[data-tile]')].find(button=>button.dataset.tile===item)?.focus({preventScroll:true});
  }

  function tapTile(item) {
    if (state.slots.includes(item)) moveTile(item,-1);
    else if (state.slots.includes(null)) moveTile(item,state.slots.indexOf(null));
  }

  function nextRound() {
    if (!state.done || state.pending) return;
    const {task} = current();
    if (state.round + 1 === task.rounds.length) return award();
    state.round += 1;
    prepareRound();
    save();
    render();
    focusGame();
    speech(instructions());
  }

  function openReward() {
    document.getElementById('reward-gear').src = 'assets/rewards/gear-' + state.earned + '.webp';
    if (!reward.open) reward.showModal();
    nextTask.focus();
  }

  function award() {
    if (state.pending || state.earned!==state.stage) return;
    state.pending = true;
    state.earned += 1;
    save();
    analytics('taskComplete',state.stage+1);
    openReward();
    effect('award');
    speech([C.feedback.gear]);
  }

  function advance() {
    if (!state.pending) return;
    state.pending = false;
    state.stage += 1;
    state.round = 0;
    prepareRound();
    save();
    reward.close();
    render();
    focusGame();
    speech(instructions(true));
  }

  function selectGear(id) {
    if (state.stage!==7 || state.launched || state.clockSlots[Number(id)-1]) return;
    state.selected = state.selected===id?null:id;
    feedback = '';
    save();
    render();
    app.querySelector('[data-gear="'+id+'"]')?.focus({preventScroll:true});
  }

  function placeGear(id,seat) {
    if (state.stage!==7 || state.launched || !Number.isInteger(id) || id<1 || id>7 ||
      !Number.isInteger(seat) || seat<1 || seat>7 || state.clockSlots[id-1]) return;
    const origin = app.querySelector('[data-gear="'+id+'"] img')?.getBoundingClientRect();
    state.selected = null;
    if (id!==seat || state.clockSlots[seat-1]) {
      feedback = C.feedback.misplaced;
    } else {
      state.clockSlots[id-1] = true;
      feedback = state.clockSlots.every(Boolean)?C.feedback.ready:C.feedback.placed;
      effect('correct');
    }
    save();
    render();
    if (id===seat && origin && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      const image = app.querySelector('[data-seat="'+seat+'"] img');
      const target = image.getBoundingClientRect();
      image.animate?.([{transform:'translate('+(origin.left-target.left)+'px,'+(origin.top-target.top)+'px) scale(.82)'},
        {transform:'translate(0,0) scale(1)'}],{duration:360,easing:'ease-out'});
    }
    speech([feedback]);
  }

  function launch() {
    if (state.stage!==7 || state.launched || !state.clockSlots.every(Boolean)) return;
    state.launched = true;
    reveal = false;
    feedback = '';
    save();
    try { localStorage.setItem(medalKey,'earned'); } catch { /* Session reward remains visible. */ }
    analytics('complete',true);
    render();
    effect('final');
    const delay = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 0 : 1600;
    window.setTimeout(() => {
      reveal = true;
      render();
      speech([C.finale]);
    },delay);
  }

  app.addEventListener('click',event=>{
    if (event.target.closest('a.exit')) sound.stop();
    const button = event.target.closest('button');
    if (!button || button.disabled) return;
    if (button.dataset.hear) return speech([button.dataset.hear],true);
    if (button.hasAttribute('data-choose')) return choose(button.dataset.choose);
    if (button.dataset.tile) return tapTile(button.dataset.tile);
    if (button.dataset.gear) return selectGear(button.dataset.gear);
    if (button.dataset.seat) return placeGear(Number(state.selected),Number(button.dataset.seat));
    switch (button.id) {
      case 'begin': begin(); break;
      case 'intro': speech([C.intro,C.journey],true); break;
      case 'repeat': speech(instructions(true),true); break;
      case 'hint': {
        const hint = current().task.hint;
        note(hint);
        speech([hint],true);
        break;
      }
      case 'check': confirm(); break;
      case 'next-round': nextRound(); break;
      case 'told':
        if (state.storyPhase==='tell') {
          state.storyPhase = 'sample';
          save();
          render();
        }
        break;
      case 'story-done': if (state.storyPhase==='sample') award(); break;
      case 'launch': launch(); break;
      case 'replay': begin(true); break;
    }
  });

  voice.addEventListener('click',()=>{
    state ||= fresh();
    state.voice = !state.voice;
    if (!state.voice) sound.stopVoice();
    save();
    settings();
  });
  music.addEventListener('click',()=>{
    state ||= fresh();
    state.music = !state.music;
    sound.background(state.music);
    save();
    settings();
  });
  document.querySelector('.time-top .exit').addEventListener('click',sound.stop);
  reward.addEventListener('cancel',event=>event.preventDefault());
  nextTask.addEventListener('click',advance);
  settings();
  render();
})();
