(function () {
  'use strict';

  const C = window.SnowContent;
  const sound = window.SnowSound;
  const story = window.SnowStory;
  const key = 'lumi.snow-kingdom-5-6.progress.v1';
  const medalKey = 'lumi.snow-kingdom-5-6.medal.v1';
  const catalogue = '../crystal-world.html#age-5-6';
  const app = document.getElementById('game');
  const reward = document.getElementById('reward');
  const nextTask = document.getElementById('next-task');
  const voice = document.getElementById('voice');
  const music = document.getElementById('music-toggle');
  let state = read();
  let active = false;
  let feedback = '';
  let selected = [];
  let attempts = 0;

  function fresh() {
    return {
      version: 1, started: false, stage: 0, round: 0, earned: 0,
      done: false, pending: false, slots: [null, null, null, null],
      order: story.shuffled(), storyPhase: 'sort', voice: state?.voice ?? true, music: state?.music ?? false,
    };
  }

  function read() {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      if (!value || value.version !== 1 || !Number.isInteger(value.stage) || value.stage < 0 || value.stage > 7) return null;
      if (['started', 'done', 'pending', 'voice', 'music'].some(field => typeof value[field] !== 'boolean')) return null;
      const task = C.tasks[value.stage];
      if (!Number.isInteger(value.round) || value.round < 0 || value.round >= (task?.rounds?.length || 1) ||
          !Number.isInteger(value.earned) || value.earned !== value.stage + Number(value.pending === true)) return null;
      if (!Array.isArray(value.order) || [...value.order].sort().join() !== '1,2,3,4' ||
          !Array.isArray(value.slots) || value.slots.length !== 4 ||
          value.slots.some(id => id !== null && !value.order.includes(id)) ||
          new Set(value.slots.filter(Boolean)).size !== value.slots.filter(Boolean).length ||
          !['sort', 'tell', 'finish'].includes(value.storyPhase)) return null;
      return value;
    } catch {
      return null;
    }
  }

  function save() {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
  }

  function medalEarned() {
    try { return localStorage.getItem(medalKey) !== null; } catch { return false; }
  }

  function speech(lines, force = false) {
    return sound.say(lines, state?.voice ?? true, force);
  }

  function play(name) {
    sound.effect(name, state.voice);
  }

  function analytics(method, ...args) {
    window.LumiAnalytics?.[method]?.(C.id, ...args);
  }

  function setScene(id) {
    document.body.dataset.scene = id;
  }

  function focusGame() {
    app.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  function updateAudioButtons() {
    const voiceOn = state?.voice ?? true;
    const musicOn = state?.music ?? false;
    for (const [button, label, on] of [[voice, 'Голос', voiceOn], [music, 'Музыка', musicOn]]) {
      button.setAttribute('aria-pressed', String(on));
      button.textContent = label + ': ' + (on ? 'вкл.' : 'выкл.');
    }
  }

  function welcome() {
    setScene('start');
    const buttonText = state?.stage === 7 ? 'К награде' : state?.started ? 'Продолжить приключение' : 'Начать приключение';
    app.innerHTML = `
      <section class="welcome">
        <div class="welcome-copy glass">
          <p class="eyebrow">5–6 лет · Развитие речи</p>
          <h1>${C.title}</h1>
          <p>${C.intro}</p>
          <div class="actions">
            <button id="begin" type="button">${buttonText}</button>
            <button id="welcome-listen" class="quiet" type="button">Послушать вступление</button>
          </div>
          ${medalEarned() ? '<p class="medal-saved">Медаль «Хранитель Снежного королевства» сохранена.</p>' : ''}
        </div>
        <img class="welcome-lumi" src="assets/lumi/start.png" alt="Луми приветствует тебя">
      </section>`;
  }

  function begin(restart = false) {
    if (!restart && active) return;
    if (restart && state.stage !== 7) return;
    const isNew = restart || !state?.started;
    if (isNew) state = fresh();
    state.started = true;
    active = true;
    selected = [];
    feedback = '';
    attempts = 0;
    if (state.stage < 7) analytics('begin', isNew);
    save();
    sound.background(state.music);
    render();
    focusGame();
    if (isNew && !restart) speech([C.intro, C.journey, ...instructions(true)]);
    else if (state.pending) speech([C.feedback.fragment]);
    else if (state.stage === 7) speech([C.finish]);
    else if (!state.done) speech(instructions(true));
  }

  function current() {
    const task = C.tasks[state.stage];
    return { task, round: task.rounds?.[state.round] };
  }

  function instructions(includeGeneral = false) {
    const { task, round } = current();
    if (task.type === 'story') {
      return state.storyPhase === 'sort' ? [C.story.instruction] : [C.story.tell, ...C.story.prompts];
    }
    const lines = includeGeneral ? [task.instruction] : [];
    if (round.phoneme) lines.push('phoneme:' + round.phoneme);
    if (task.type === 'syllables') lines.push(C.pictures[round.picture]);
    if (round.question) lines.push(round.question);
    return lines.length ? lines : [task.instruction];
  }

  function progress() {
    const shards = Array.from({length: 7}, (_, index) =>
      `<img class="${index < state.earned ? 'earned' : 'unearned'}" src="assets/rewards/shard-${index + 1}.png" alt="">`).join('');
    return `<div class="shards" role="img" aria-label="Собрано ${state.earned} из 7 осколков">${shards}</div>`;
  }

  const objectAliases = { 'red-mitten': 'mitten', 'fluffy-snow': 'snow', 'blue-bucket': 'bucket', 'tall-fir': 'fir' };
  const object = (id, alt = '') => `<img src="assets/objects/${objectAliases[id] || id}.png" alt="${alt}" draggable="false">`;
  const scene = (id, alt = '') => `<img class="scene-picture" src="assets/scenes/${id}.webp" alt="${alt}" draggable="false">`;
  const check = () => `<button id="check" type="button" ${selected.length ? '' : 'disabled'}>Проверить</button>`;
  const next = () => '<button id="next-round" type="button">Дальше</button>';

  function pictureChoices(task, round) {
    const multiple = task.type === 'multiple';
    const order = [...round.options];
    if (!multiple) {
      const target = [2, 0, 3, 1, 3, 0][state.round];
      const answer = order.shift();
      order.splice(target, 0, answer);
    }
    const items = order.map(id => {
      const pressed = selected.includes(id);
      return `<div class="picture-choice">
        <button class="select-card" type="button" data-select="${id}" ${state.done ? 'disabled' : ''}
          aria-pressed="${pressed}" aria-label="Выбрать: ${C.pictures[id]}">${object(id)}</button>
        <button class="hear quiet" type="button" data-hear="${C.pictures[id]}" aria-label="Послушать: ${C.pictures[id]}">Слушать</button>
      </div>`;
    }).join('');
    const crystals = task.id === 'riddles' ?
      `<div class="crystals" role="img" aria-label="Зажглось ${state.round + Number(state.done)} из 6 кристаллов">${Array.from({length: 6}, (_, i) =>
        `<img class="${i < state.round + Number(state.done) ? 'lit' : ''}" src="assets/rewards/crystal.png" alt="">`).join('')}</div>` : '';
    return `${crystals}<div class="choice-grid">${items}</div>${multiple && !state.done ? check() : ''}`;
  }

  function syllableChoices(round) {
    const steps = state.round + Number(state.done);
    const pads = Array.from({length: 7}, (_, index) => `<div class="river-step">
      <img class="river-pad ${index <= steps ? 'reached' : ''}" src="assets/objects/ice-step.png" alt="">
      ${index === steps ? `<img class="river-lumi ${state.done ? 'jumping' : ''}" src="assets/lumi/syllables.png" alt="">` : ''}
    </div>`).join('');
    const options = [1, 2, 3, 4].map(number => {
      const lights = Array.from({length: number}, () => object('light-dot')).join('');
      return `<button class="select-card" type="button" data-select="${number}" aria-label="${number} ${number === 1 ? 'точка' : 'точки'}"
        aria-pressed="${selected.includes(number)}" ${state.done ? 'disabled' : ''}>${object('ice-step')}
        <span class="floe-lights" aria-hidden="true">${lights}</span></button>`;
    }).join('');
    return `<div class="syllable-word">${object(round.picture, C.pictures[round.picture])}
      <button class="quiet" type="button" data-hear="${C.pictures[round.picture]}">Послушать слово</button></div>
      <div class="river-path" role="img" aria-label="Пройдено ${steps} из 6 шагов">${pads}</div>
      <div class="choice-grid floes">${options}</div>`;
  }

  function speechChoices(task, round) {
    const picture = task.id === 'mittens' ?
      `<div class="big-object">${object(round.picture, C.pictures[round.picture])}</div>` :
      scene(round.picture, round.question ? 'Зимняя сцена к вопросу' : 'Иллюстрация к заклинанию');
    const ornaments = task.id === 'spells' ? ['spell-blue', 'spell-lilac', 'spell-gold'] :
      ['voice-blue', 'voice-lilac', 'voice-gold'];
    const options = round.options.map((line, index) =>
      `<div class="spoken-option ${selected.includes(index) ? 'selected' : ''}">
        <img class="voice-art" src="assets/objects/${ornaments[index]}.png" alt="">
        <button class="quiet" type="button" data-hear="${line}" aria-label="Послушать вариант ${index + 1}">Слушать</button>
        <button class="quiet" type="button" data-select="${index}" aria-pressed="${selected.includes(index)}"
          aria-label="Выбрать вариант ${index + 1}" ${state.done ? 'disabled' : ''}>Выбрать</button>
      </div>`).join('');
    return `<div class="${state.done && task.id === 'places' ? 'scene-found' : ''}">${picture}</div>
      ${task.id === 'spells' ? `<div class="spellbook ${state.done ? 'book-glow' : ''}"><img src="assets/rewards/book.png" alt=""></div>` : ''}
      <div class="speech-options">${options}</div>${!state.done ? check() : ''}`;
  }

  function storyBoard() {
    const sorting = state.storyPhase === 'sort';
    const card = (id, inSlot) => `<button class="story-card" type="button" data-story-card="${id}"
      ${sorting ? '' : 'disabled'} aria-label="${C.story.captions[id - 1]}">${scene('story-' + id)}${inSlot && sorting ? '<span class="remove-card" aria-hidden="true">Убрать</span>' : ''}</button>`;
    const slots = state.slots.map((id, index) => `<div class="story-slot"
      data-story-drop="${index}" aria-label="Место ${index + 1}">${id ? card(id, true) : `<span>${index + 1}</span>`}</div>`).join('');
    const pool = sorting ? `<div class="story-pool" data-story-drop="-1">${state.order
      .filter(id => !state.slots.includes(id)).map(id => card(id, false)).join('')}</div>` : '';
    const controls = sorting ? `<button id="check-story" type="button" ${state.slots.includes(null) ? 'disabled' : ''}>Проверить</button>` : `
      <p class="story-instruction">${C.story.tell}</p>
      <div class="story-prompts">${C.story.prompts.map(line => `<button type="button" class="quiet" data-hear="${line}">${line}</button>`).join('')}</div>
      <div class="actions">${state.storyPhase === 'tell' ?
        '<button id="told" type="button">Я рассказал историю</button>' :
        '<button id="story-example" class="quiet" type="button">Послушать пример</button><button id="story-done" type="button">Готово</button>'}</div>`;
    return `<div class="story-board ${sorting ? '' : 'story-solved'}"><div class="story-slots">${slots}</div>${pool}${controls}</div>`;
  }

  function render() {
    if (state.stage === 7) return renderFinal();
    const { task, round } = current();
    const question = round?.phoneme ? 'Звук [' + round.sound + ']' : round?.question || task.instruction;
    const board = task.type === 'story' ? storyBoard() :
      task.type === 'speech' ? speechChoices(task, round) :
      task.type === 'syllables' ? syllableChoices(round) : pictureChoices(task, round);
    setScene(task.id);
    app.innerHTML = `<section class="task ${task.id}">
      <header class="task-heading glass">${progress()}
        <p class="eyebrow">Задание ${state.stage + 1} из 7 · ${round ? 'Раунд ' + (state.round + 1) + ' из ' + task.rounds.length : '1 история'}</p>
        <h1>${task.title}</h1><p class="task-question">${question}</p>
        ${question !== task.instruction ? `<p class="task-instruction">${task.instruction}</p>` : ''}
      </header>
      <div class="task-layout">
        <aside class="guide">
          <img src="assets/lumi/${task.id}.png" alt="Луми помогает с заданием">
          <div class="guide-actions">
            <button id="repeat" class="quiet" type="button">${task.type === 'multiple' ? 'Послушать звук' : 'Послушать задание'}</button>
            <button id="hint" class="quiet" type="button">Подсказка</button>
          </div>
        </aside>
        <div class="board glass ${state.done ? 'round-done' : ''}">
          ${board}<p class="feedback" role="status" aria-live="polite">${feedback}</p>
          ${state.done && task.type !== 'story' ? next() : ''}
        </div>
      </div>
    </section>`;
    if (task.type === 'story' && state.storyPhase === 'sort') story.bind(app.querySelector('.story-board'), moveCard);
    if (state.pending) openReward();
  }

  function renderFinal() {
    setScene('final');
    const shards = Array.from({length: 7}, (_, index) =>
      `<img class="orbit-shard" style="--i:${index}" src="assets/rewards/shard-${index + 1}.png" alt="">`).join('');
    app.innerHTML = `<section class="final glass">
      <h1>Ты спас Снежное королевство!</h1>
      <p>${C.finish}</p>
      <div class="final-art">
        <img class="final-lumi" src="assets/lumi/final.png" alt="Луми радуется победе">
        <div class="snow-assembly" aria-hidden="true">${shards}
          <img class="magic-snowflake" src="assets/rewards/magic-snowflake.png" alt="">
        </div>
      </div>
      <img class="medal" src="assets/rewards/medal.png" alt="">
      <h2>Медаль «Хранитель Снежного королевства»</h2>
      <div class="actions">
        <button id="replay" type="button">Играть снова</button>
        <a class="quiet return-link" href="${catalogue}">В мир приключений</a>
      </div>
    </section>`;
  }

  function note(text) {
    feedback = text;
    const message = app.querySelector('.feedback');
    if (message) message.textContent = text;
  }

  function incorrect() {
    const { retry, listen, encourage } = C.feedback;
    const options = [retry, listen, encourage];
    note(options[attempts % options.length]);
    attempts += 1;
    speech([feedback]);
  }

  function confirm() {
    if (state.done || state.pending || !selected.length) return;
    const { task, round } = current();
    const ok = task.type === 'multiple' ?
      selected.length === round.answers.length && round.answers.every(id => selected.includes(id)) :
      selected[0] === round.answer;
    if (!ok) return incorrect();
    state.done = true;
    feedback = C.feedback.correct;
    save();
    render();
    play('correct');
    speech([feedback]);
    app.querySelector('#next-round')?.focus({preventScroll:true});
  }

  function choose(button) {
    if (state.done || state.pending) return;
    const { task } = current();
    const value = task.type === 'syllables' || task.type === 'speech' ? Number(button.dataset.select) : button.dataset.select;
    if (task.type === 'multiple') {
      selected = selected.includes(value) ? selected.filter(id => id !== value) : [...selected, value];
    } else selected = [value];
    note('');
    for (const target of app.querySelectorAll('[data-select]')) {
      const pressed = selected.some(id => String(id) === target.dataset.select);
      target.setAttribute('aria-pressed', String(pressed));
      target.closest('.spoken-option')?.classList.toggle('selected', pressed);
    }
    const checkButton = document.getElementById('check');
    if (checkButton) checkButton.disabled = selected.length === 0;
    if (task.type === 'picture' || task.type === 'syllables') confirm();
  }

  function advanceRound() {
    if (!state.done || state.pending) return;
    const { task } = current();
    if (state.round + 1 === task.rounds.length) return award();
    state.round += 1;
    state.done = false;
    selected = [];
    attempts = 0;
    feedback = '';
    save();
    render();
    focusGame();
    speech(instructions());
  }

  function moveCard(id, target) {
    if (state.storyPhase !== 'sort' || state.pending) return;
    state.slots = story.move(state.slots, id, target);
    feedback = '';
    save();
    render();
  }

  function tapCard(id) {
    const index = state.slots.indexOf(id);
    if (index >= 0) return moveCard(id, -1);
    const empty = state.slots.indexOf(null);
    if (empty >= 0) moveCard(id, empty);
  }

  function checkStory() {
    if (state.storyPhase !== 'sort' || state.slots.includes(null)) return;
    if (!story.solved(state.slots)) return incorrect();
    state.storyPhase = 'tell';
    feedback = C.feedback.correct;
    save();
    render();
    play('correct');
    speech([C.feedback.correct, C.story.tell, ...C.story.prompts]);
  }

  function award() {
    if (state.pending || state.earned !== state.stage) return;
    state.pending = true;
    state.earned += 1;
    save();
    analytics('taskComplete', state.stage + 1);
    openReward();
    play('award');
    speech([state.earned === 7 ? C.feedback.all : C.feedback.fragment]);
  }

  function openReward() {
    const shard = document.getElementById('reward-shard');
    shard.src = 'assets/rewards/shard-' + state.earned + '.png';
    document.getElementById('reward-caption').textContent = state.earned === 7 ? C.feedback.all : C.feedback.fragment;
    if (!reward.open) reward.showModal();
    nextTask.focus();
  }

  function advanceTask() {
    if (!state.pending) return;
    state.pending = false;
    state.stage += 1;
    state.round = 0;
    state.done = false;
    selected = [];
    attempts = 0;
    feedback = '';
    save();
    reward.close();
    render();
    focusGame();
    if (state.stage === 7) {
      try { localStorage.setItem(medalKey, 'earned'); } catch {}
      analytics('complete');
      play('final');
      speech([C.finish]);
    } else speech(instructions(true));
  }

  app.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (event.target.closest('.return-link')) sound.stop();
    if (!button || button.disabled) return;
    if (button.dataset.hear) return speech([button.dataset.hear], true);
    if (button.hasAttribute('data-select')) return choose(button);
    if (button.dataset.storyCard) return tapCard(Number(button.dataset.storyCard));
    switch (button.id) {
      case 'begin': begin(); break;
      case 'welcome-listen': speech([C.intro, C.journey], true); break;
      case 'repeat': speech(instructions(true), true); break;
      case 'hint': {
        const hint = current().task.hint;
        note(hint);
        speech([hint], true);
        break;
      }
      case 'check': confirm(); break;
      case 'next-round': advanceRound(); break;
      case 'check-story': checkStory(); break;
      case 'told':
        if (state.storyPhase !== 'tell') break;
        state.storyPhase = 'finish';
        save();
        render();
        break;
      case 'story-example': speech([C.story.example], true); break;
      case 'story-done': if (state.storyPhase === 'finish') award(); break;
      case 'replay': begin(true); break;
    }
  });

  voice.addEventListener('click', () => {
    state ||= fresh();
    state.voice = !state.voice;
    if (!state.voice) sound.stopVoice();
    save();
    updateAudioButtons();
  });
  music.addEventListener('click', () => {
    state ||= fresh();
    state.music = !state.music;
    sound.background(state.music);
    save();
    updateAudioButtons();
  });
  document.querySelector('.snow-top .return-link').addEventListener('click', sound.stop);
  nextTask.addEventListener('click', advanceTask);
  reward.addEventListener('cancel', event => event.preventDefault());
  updateAudioButtons();
  welcome();
})();
