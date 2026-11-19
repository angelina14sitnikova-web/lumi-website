(function () {
  'use strict';

  const C = window.TimeContent;
  const catalogue = '../crystal-world.html#age-6-7';
  const entities = {'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'};
  const safe = text => String(text).replace(/[&<>"']/g, char => entities[char]);
  const img = (dir, id, format, alt = '', cls = '') =>
    `<img class="${cls}" src="assets/${dir}/${safe(id)}.${format}" alt="${safe(alt)}" draggable="false">`;
  const object = (id, alt, cls) => img('objects', id, 'webp', alt, cls);
  const scene = (id, alt) => img('scenes', id, 'webp', alt, 'scene-picture');
  const lumi = (id, alt, cls = '') => img('lumi', id, 'png', alt, cls);
  const gear = (id, cls = '') => img('rewards', 'gear-' + id, 'webp', '', cls);
  const list = count => Array.from({length:count}, (_, i) => i + 1);
  const check = ready => `<button id="check" type="button" ${ready?'':'disabled'}>Проверить</button>`;
  const listen = (line, label = 'Слушать') =>
    `<button class="quiet listen" type="button" data-hear="${safe(line)}">${safe(label)}</button>`;
  const wordArt = round => `<div class="word-art">${object(round.art, round.word)}${listen(round.word,'Послушать слово')}</div>`;

  function progress(earned) {
    return `<div class="gears-progress" role="img" aria-label="Собрано ${earned} из 7 шестерёнок">
      ${list(7).map(i=>gear(i,i<=earned?'earned':'waiting')).join('')}</div>`;
  }

  function welcome(state, medal) {
    const label = state?.launched ? 'К награде' : state?.started ? 'Продолжить приключение' : 'Начать приключение';
    return `<section class="time-welcome">
      <div class="welcome-copy panel">
        <p class="eyebrow">6–7 лет · Развитие речи и обучение грамоте</p>
        <h1>${C.title}</h1><p class="lead">${C.intro}</p>
        <div class="actions"><button id="begin" type="button">${label}</button>
        <button id="intro" class="quiet" type="button">Послушать вступление</button></div>
        ${medal ? '<p class="medal-note">Медаль «Хранитель времени» сохранена.</p>' : ''}
      </div>
      <div class="welcome-art">${gear(2,'floating cog-one')}${gear(6,'floating cog-two')}
      ${lumi('start','Луми с карманными часами','welcome-lumi')}</div>
    </section>`;
  }

  function choices(items, state, type, linkedArt = null) {
    return `<div class="option-grid ${type}">${items.map((item,index)=>{
      const selected = String(index) === state.selected;
      const diagram = type === 'positions' ?
        `<span class="scheme" aria-hidden="true">${[0,1,2].map(i=>`<i class="${i===index?'lit':''}"></i>`).join('')}</span>` : '';
      const illustration = type === 'portals' ?
        `<span class="portal-art">${object(['portal-past','portal-now','portal-future'][index],'','portal')}
        ${state.done && selected ? img('scenes',linkedArt,'webp','','portal-transfer') : ''}</span>` : '';
      const wheel = type === 'positions' ? gear(index + 1, state.done && selected ? 'working-gear' : '') : '';
      return `<div class="option"><button class="choice" type="button" data-choose="${index}" aria-pressed="${selected}"
        ${state.done?'disabled':''}>${wheel}${illustration}${diagram}<span>${safe(item)}</span></button>
        ${listen(item,'Слушать')}</div>`;
    }).join('')}</div>`;
  }

  function position(round, state) {
    const symbol = round.phoneme === 's' ? 'с' : 'м';
    return `${wordArt(round)}${listen('phoneme:'+round.phoneme, 'Послушать звук ['+symbol+']')}
      ${choices(C.positions,state,'positions')}`;
  }

  function letter(round, state) {
    const value = state.selected === null ? '' : round.choices[Number(state.selected)];
    const [prefix,suffix] = round.pattern.split('_');
    const tiles = round.choices.map((symbol,index) =>
      `<div class="option"><button class="letter-tile choice" type="button" data-choose="${index}" data-drag="${index}"
        aria-label="Выбрать букву ${symbol}" aria-pressed="${state.selected===String(index)}" ${state.done?'disabled':''}>${symbol}</button>
        ${listen('phoneme:'+C.phonemes[symbol], 'Послушать звук')}</div>`).join('');
    return `${wordArt(round)}<div class="letter-word ${state.done?'repaired':''}" aria-label="${state.done?round.word:'Слово с пропуском'}">
      ${prefix}<span data-drop="0" class="letter-slot ${value?'filled':''}">${value}</span>${suffix}</div>
      <div class="option-grid letters">${tiles}</div>${state.done?'':check(!!value)}`;
  }

  function time(round, state) {
    const labels = C.portals[state.round < 6 ? 0 : 1];
    return `${state.done?'':`<div class="story-illustration">${scene(round.art,round.sentence)}</div>`}
      ${listen(round.sentence,'Послушать предложение')}
      ${choices(labels,state,'portals',round.art)}${state.done?'':check(state.selected!==null)}`;
  }

  function twins(round, state) {
    return `${scene(round.art,round.context)}<p class="context">${round.context}</p>${listen(round.context,'Послушать словосочетание')}
      ${choices(round.choices,state,'synonyms')}${state.done ? `<p class="explain">${round.explanation}</p>${listen(round.explanation,'Послушать объяснение')}` : check(state.selected!==null)}`;
  }

  function sequence(task, round, state) {
    const story = task.id === 'story';
    const locked = story ? state.storyPhase !== 'sort' : state.done;
    const name = value => story ? C.story.captions[Number(value)-1] : value;
    const item = (value, slot = -1) => {
      const inSlot = slot >= 0;
      const displayed = task.id==='sentence' && slot===0 ? value[0].toUpperCase()+value.slice(1) : value;
      const punctuation = task.id==='sentence' && locked && slot===state.slots.length-1 ? '.' : '';
      const art = story ? scene('story-'+value, '') : safe(displayed + punctuation);
      const label = locked ? name(value) : (inSlot ? 'Убрать: ' : 'Выбрать: ') + name(value);
      const button = `<button class="tile ${story?'picture-tile':''}" type="button" data-drag="${safe(value)}"
        data-tile="${safe(value)}" aria-label="${safe(label)}" ${locked?'disabled':''}>${art}</button>`;
      if (inSlot || story) return button;
      const text = task.id==='sentence' ? value[0].toUpperCase()+value.slice(1) : value;
      return `<div class="tile-option">${button}${listen(text,'Слушать')}</div>`;
    };
    const slots = state.slots.map((value,index) =>
      `<div class="tile-slot" data-drop="${index}" aria-label="Ячейка ${index+1}">
        ${value===null?`<span aria-hidden="true">${index+1}</span>`:item(value,index)}</div>`).join('');
    const pool = state.order.filter(value=>!state.slots.includes(value)).map(value=>item(value)).join('');
    const illustration = story ? '<h2>«Маленькие часы»</h2>' :
      task.id==='cipher' ? wordArt(round) : scene(round.art,C.sentenceText(round.answers[0]));
    const result = task.id==='cipher' ? listen(round.word,'Послушать собранное слово') :
      !story ? listen(C.sentenceText(state.slots.join(' ')),'Послушать собранное предложение') : '';
    const oral = `<p class="context">${C.story.tell}</p><div class="story-questions">${C.story.prompts
      .map(line=>listen(line,line)).join('')}</div><div class="actions">${state.storyPhase==='tell' ?
      '<button id="told" type="button">Я рассказал историю</button>' :
      `${listen(C.story.example,'Послушать образец')}<button id="story-done" type="button">Готово</button>`}</div>`;
    const running = state.round + Number(state.done);
    const movement = task.id==='cipher' ? `<div class="cipher-train" role="img" aria-label="Запущено ${running} из 6 шестерёнок">
      ${list(6).map(i=>gear(i,i<=running?'working-gear':'waiting')).join('')}</div>` : '';
    return `${illustration}${movement}<div class="sequence ${story?'picture-sequence':''} ${locked?'ordered':''}">
      <div class="slot-grid" style="--count:${state.slots.length}">${slots}</div>
      ${locked?'':`<div class="tile-pool" data-drop="-1">${pool}</div>`}
    </div>${locked ? (story?oral:result) : check(!state.slots.includes(null))}`;
  }

  const boards = {position, letter, tense:time, twins};
  function game(task, round, state, feedback) {
    const board = boards[task.id] ? boards[task.id](round,state) : sequence(task,round,state);
    const question = task.id==='tense' ? `<p class="task-question">${round.sentence}</p>` : '';
    return `<section class="time-task ${task.id}">
      <header class="task-header panel">
        ${progress(state.earned)}
        <p class="eyebrow">Задание ${state.stage+1} из 7 ·
          ${round ? 'Раунд '+(state.round+1)+' из '+task.rounds.length : 'История «Маленькие часы»'}</p>
        <h1>${task.title}</h1><p>${task.instruction}</p>${question}
      </header>
      <div class="task-layout">
        <aside class="guide">
          ${lumi(task.id,'Луми помогает с заданием')}
          <div class="guide-buttons">
            <button id="repeat" class="quiet" type="button">Послушать задание</button>
            <button id="hint" class="quiet" type="button">Подсказка</button>
          </div>
        </aside>
        <div class="board panel ${state.done?'correct-board':''}">
          ${board}
          <p class="feedback" role="status" aria-live="polite">${feedback}</p>
          ${state.done && task.id!=='story'?'<button id="next-round" type="button">Дальше</button>':''}
        </div>
      </div>
    </section>`;
  }

  const shapes = ['кругом','квадратом','треугольником','звездой','ромбом','полумесяцем','крестом'];
  function finish(state, feedback, reveal) {
    const allPlaced = state.clockSlots.every(Boolean);
    const title = state.launched ? 'Ты вернул времени его силу!' : 'Собери часовой механизм';
    const seats = list(7).map(id => {
      const installed = state.clockSlots[id-1];
      const label = installed ? 'Установлена шестерёнка с ' : 'Место для шестерёнки с ';
      return `<button class="seat ${installed?'installed':''}" type="button" data-seat="${id}" data-drop="${id-1}"
        aria-label="${label+shapes[id-1]}" ${installed||state.launched?'disabled':''}>${gear(id,installed?'working-gear':'silhouette')}</button>`;
    }).join('');
    const pool = state.clockOrder.filter(id=>!state.clockSlots[id-1]).map(id=>
      `<button type="button" class="loose-gear" data-drag="${id}" data-gear="${id}"
      aria-pressed="${state.selected===String(id)}" aria-label="Шестерёнка с ${shapes[id-1]}">${gear(id)}</button>`).join('');
    const prizeState = reveal ? '' : 'hidden';
    return `<section class="finish panel ${state.launched?'running':''}">
      ${progress(state.earned)}<h1>${title}</h1>
      ${state.launched ? '' : `<p>${C.feedback.assemble}</p>${listen(C.feedback.assemble,'Послушать задание')}`}
      <div class="assembly" ${state.launched?'':'data-assembly'}>
        <div class="clockwork">
          ${img('rewards','mechanism','webp','Большие часы Башни времени','clock-face')}
          <div class="hands dial-minute"></div><div class="hands dial-hour"></div>
          <div class="pendulum"></div>
        </div>
        <div class="seats">${seats}</div>
        ${pool?`<div class="gear-pool">${pool}</div>`:''}
      </div>
      ${lumi('finish','Луми радуется восстановлению часов','finish-lumi')}
      <p class="feedback" role="status" aria-live="polite">${feedback}</p>
      ${allPlaced&&!state.launched?'<button id="launch" type="button">Запустить часы</button>':''}
      ${state.launched?`<div class="final-prize" ${prizeState}>
        <p>${C.finale}</p>${listen(C.finale,'Послушать поздравление')}
        ${img('rewards','medal','webp','Золотая медаль с часами и кристаллами','medal')}
        <h2>Медаль «Хранитель времени»</h2>
        <div class="actions"><button id="replay" type="button">Играть снова</button>
        <a class="quiet exit" href="${catalogue}">В мир приключений</a></div></div>`:''}
    </section>`;
  }

  window.TimeView = Object.freeze({welcome, game, finish});
})();
