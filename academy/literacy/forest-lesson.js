import { createLessonAudio } from './audio.js';
import { createListeningRound } from './listening-round.js';
import {speech,recordings} from './speech-index.js';
import {artLabel,canIllustrate,literacyArt} from './art.js';

const labels = {
  cat: 'Кошка', dog: 'Собака', cow: 'Корова', duck: 'Утка', bird: 'Птица',
  rain: 'Дождь', stream: 'Ручей', leaves: 'Шелест листьев', bell: 'Колокольчик',
  drum: 'Барабан', paper: 'Бумага', rattle: 'Погремушка',
  audible: 'Был звук', quiet: 'Было тихо', move: 'Двигаться', stop: 'Замереть',
  first: 'Первый', second: 'Второй', third: 'Третий', softer: 'Тише', stronger: 'Громче',
  animals: 'Животные', nature: 'Природа', objects: 'Предметы',
  ready:'Готово',skip:'Пропустить повторение',human:'Голос человека',other:'Другой звук',same:'Похожи',different:'Разные',
  clap:'Хлопнуть',rest:'Пауза',one:'Один хлопок',two:'Два хлопка',three:'Три хлопка',tap:'Ударить в барабан',beat:'Сыграть',blue:'Голубой огонёк',gold:'Золотистый огонёк',pink:'Розовый огонёк',
};
const illustrated = new Set(['cat', 'dog', 'cow', 'duck', 'bird', 'rain', 'stream', 'leaves', 'bell', 'drum', 'paper', 'rattle']);
const indexed = ['first', 'second', 'third'];
const itemAudioKinds = new Set(['match', 'sort']);
const folder = new URL('./media/forest/', import.meta.url);
const imageFor = name => new URL(name + '.webp', folder).href;
const soundIds = ['cat', 'dog', 'cow', 'duck', 'bird', 'rain', 'stream', 'leaves', 'bell', 'drum', 'paper', 'rattle', 'music', 'success'];
const manifest = Object.fromEntries(soundIds.map(name => [name, new URL(name + '.mp3', folder).href]));
const adultWarning = 'Взрослым: проверьте громкость и звук устройства. Для этой игры нужно услышать образец.';

function element(tag, styles, text) {
  const result = document.createElement(tag);
  result.className = styles;
  if (text) result.textContent = text;
  return result;
}

function control(label, handler, prominent = false) {
  const result = element('button', prominent ? 'academy-button lesson-primary' : 'lesson-secondary', label);
  result.type = 'button';
  result.addEventListener('click', handler);
  return result;
}

function sprite(path, className = '') {
  const image = element('img', className);
  image.src = path;
  image.alt = '';
  image.draggable = false;
  return image;
}

function soundId(clip) { return typeof clip === 'string' ? clip : clip.sound; }

function makeStage({ objects = [], pose = 'lumi-listen', world = 'forest' } = {}) {
  const stage = element('div', 'literacy-stage');
  stage.style.backgroundImage = 'url("' + (world==='forest'?imageFor('forest'):new URL('./media/'+world+'/cover.webp',import.meta.url).href) + '")';
  const lumi = sprite(new URL('../../images/lumi-transparent.png', import.meta.url).href, 'literacy-lumi');
  lumi.dataset.pose = pose;
  const contents = element('div', 'literacy-objects');
  const icons = objects.map(id => {
    const image = illustrated.has(id)?sprite(imageFor(id),'literacy-object'):literacyArt(id);
    image.classList.add('literacy-object');
    image.dataset.object = id;
    return image;
  });
  stage.append(lumi);
  contents.append(...icons);
  stage.append(contents);
  return { stage, lumi, icons };
}

function move(image, motion) {
  if (!image || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  image.getAnimations().forEach(animation => animation.cancel());
  image.animate(motion, { duration: 540, easing: 'ease-in-out' });
}
const hop = [{ transform: 'translateY(0)' }, { transform: 'translateY(-10%)' }, { transform: 'translateY(0)' }];
const listen = [{ transform: 'rotate(0)' }, { transform: 'rotate(-7deg)' }, { transform: 'rotate(0)' }];
const shake = [{ transform: 'rotate(0)' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0)' }];

export function mountForestLesson(root, lesson, {
  saved = null, save = () => {}, finish = () => {}, createAudio = createLessonAudio,
} = {}) {
  const world=lesson.world??'forest';
  const audioManifest={...manifest};
  for(const [id,link] of Object.entries(recordings))audioManifest[id]=new URL(link,import.meta.url).href;
  if(speech[world])audioManifest.speech=new URL('./media/'+world+'/speech.mp3',import.meta.url).href;
  const audio = createAudio(audioManifest);
  function clipsFor(clips){
    return clips.map(clip=>{
      if(!clip?.voice)return clip;
      const values=speech[world]?.[(clip.variant??'clear')+'|'+clip.voice];
      return values?{sound:'speech',offset:values[0],duration:values[1],gain:clip.gain}:{sound:'missing-voice'};
    });
  }
  const taskAnswers = Array.isArray(saved?.answers) ? saved.answers : [];
  let sceneIndex = Math.min(Math.max(saved?.scene ?? 0, 0), 2);
  let taskIndex = Math.min(Math.max(saved?.task ?? 0, 0), 4);
  let roundIndex = Math.max(0, Math.min(saved?.round ?? 0, lesson.practice[taskIndex].rounds.length - 1));
  let roundAnswers = Array.isArray(saved?.roundAnswers) ? [...saved.roundAnswers].slice(0, roundIndex) : [];
  let viewId = 0;
  const shell = element('section', 'lesson-step literacy-lesson');
  const settings = element('details', 'literacy-settings');
  settings.append(element('summary', '', 'Громкость и помощь взрослого'));
  const volume = element('input', '');
  volume.type = 'range';
  volume.min = '0';
  volume.max = '1';
  volume.step = '0.05';
  volume.value = String(audio.getVolume());
  volume.setAttribute('aria-label', 'Громкость звуков урока');
  const volumeStatus = element('p', '', '');
  volumeStatus.setAttribute('role', 'status');
  volume.addEventListener('input', () => {
    audio.setVolume(Number(volume.value));
    volumeStatus.textContent = Number(volume.value) ? '' : adultWarning;
  });
  settings.append(volume, volumeStatus, element('p', '', 'Прочитайте короткую инструкцию вслух. Во время образца дайте ребёнку спокойно послушать, а затем предложите ответить.'));
  const view = element('div', 'literacy-view');
  shell.append(view, settings);
  root.replaceChildren(shell);

  async function play(clips, status, options) {
    const id = viewId;
    try {
      const result = await audio.play(clipsFor(clips), options);
      return viewId === id && result.status === 'finished';
    } catch (error) {
      if (viewId === id) status.textContent = error.code === 'muted' ? adultWarning :
        'Звук не загрузился. Взрослым: проверьте подключение и нажмите «Послушать» ещё раз.';
      return false;
    }
  }

  function showScene() {
    viewId++;
    audio.stop();
    const scene = lesson.scenes[sceneIndex];
    save({ mode: 'scene', scene: sceneIndex, task: taskIndex, answers: taskAnswers });
    const { stage, lumi, icons } = makeStage({ objects: scene.objects,world });
    const heading = element('h2', 'lesson-part', 'Объяснение Луми');
    const count = element('p', 'course-kicker lesson-count', 'Сцена ' + (sceneIndex + 1) + ' из 3');
    const caption = element('p', 'literacy-caption', scene.text);
    const status = element('p', 'literacy-message');
    status.setAttribute('role', 'status');
    const controls = element('div', 'lesson-actions literacy-actions');
    const hidden = scene.action === 'reveal' || scene.action === 'reveal-last';
    const reset = () => { for (const icon of icons) icon.classList.toggle('literacy-veiled', hidden); };
    reset();
    const next = control(sceneIndex < 2 ? 'Следующая сцена' : 'Перейти к играм', () => {
      if (sceneIndex < 2) { sceneIndex++; showScene(); }
      else showPractice();
    }, true);
    next.disabled = true;
    const replay = control('Послушать сцену', async () => {
      reset();
      status.textContent = '';
      const done = await play(scene.sounds, status, {
        onClip(index, sound) {
          if (scene.action === 'listen' || (scene.action === 'listen-after' && sound === 'silence')) move(lumi, listen);
          const mayReveal = scene.action !== 'reveal-last' || index === scene.sounds.length - 1;
          const icon = (sound==='speech'?icons[Math.min(index,icons.length-1)]:null)??icons.find(piece => piece.dataset.object === sound);
          if(scene.action==='actions'&&icon)icon.classList.add('literacy-performing');
          if (mayReveal && icon) {
            icon.classList.remove('literacy-veiled');
            move(icon, scene.action === 'play' || scene.action === 'switch' ? shake : hop);
          }
        },
      });
      if (done) { next.disabled = false; replay.textContent = 'Послушать ещё раз'; }
    });
    if (sceneIndex) controls.append(control('Предыдущая сцена', () => { sceneIndex--; showScene(); }));
    controls.append(replay, next);
    view.replaceChildren(heading, count, stage, caption, controls, status);
    void audio.preload(clipsFor(scene.sounds).map(soundId));
  }

  function showPractice() {
    viewId++;
    audio.stop();
    const task = lesson.practice[taskIndex];
    const round = task.rounds[roundIndex];
    const kind = round.kind ?? task.activity ?? task.kind;
    const state = createListeningRound(kind, round);
    save({ mode: 'practice', scene: sceneIndex, task: taskIndex, round: roundIndex, answers: taskAnswers, roundAnswers });
    const individual = itemAudioKinds.has(kind) || kind === 'multi' || kind === 'compare';
    const perItem = itemAudioKinds.has(kind);
    const heading = element('h2', 'lesson-part', task.name);
    const counter = element('p', 'course-kicker lesson-count', 'Игра ' + (taskIndex + 1) + ' из 5');
    const instruction = element('p', 'literacy-caption', task.instruction);
    const status = element('p', 'literacy-message');
    status.setAttribute('role', 'status');
    const buttons = element('div', 'literacy-cards');
    const samples = element('div', 'literacy-samples');
    const controls = element('div', 'lesson-actions literacy-actions');
    const isSleeping = task.name === 'Луми спит';
    const stage = ['move-stop', 'discovery'].includes(kind) || isSleeping
      ? makeStage({ pose: isSleeping ? 'lumi-sleep' : 'lumi-listen',world }) : null;
    const heard = new Set();
    const choices = new Map();
    let playingChoice=false;
    const auditions=new Set();
    const progress=element('div','literacy-progress');
    if (kind === 'theatre') progress.classList.add('literacy-theatre');
    else progress.setAttribute('aria-hidden','true');
    let answered = false;
    let moveAnimation;
    let audioRequest = 0;

    function advance() {
      audio.stop();
      if (roundIndex + 1 < task.rounds.length) {
        roundIndex++;
        showPractice();
        return;
      }
      taskAnswers[taskIndex] = [...roundAnswers];
      if (taskIndex + 1 >= lesson.practice.length) {
        finish([...taskAnswers]);
        return;
      }
      taskIndex++;
      roundIndex = 0;
      roundAnswers = [];
      showPractice();
    }

    const next = control('Дальше', advance, true);
    next.hidden = true;
    function showOutcome(result) {
      if(kind!=='theatre')progress.textContent = ['rhythm','compose','sequence'].includes(kind) ? '● '.repeat(state.selection().length) : '';
      for (const [id, choice] of choices) {
        choice.classList.toggle('literacy-selected', state.selection().includes(id) && kind === 'multi');
        if (kind === 'multi') choice.setAttribute('aria-pressed', String(state.selection().includes(id)));
        choice.classList.remove('literacy-hint');
      }
      if (result.status === 'wait') {
        status.textContent = answered ? '' : 'Сначала послушай образец.';
      } else if (result.status === 'picking') {
        if (kind === 'move-stop' && stage && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
          stage.lumi.dataset.pose = 'lumi-hop';
          moveAnimation = stage.lumi.animate(hop, { duration: 640, iterations: Infinity });
        }
        if (perItem) status.textContent = 'Теперь послушай следующую карточку.';
      } else if (result.status === 'try-again') {
        status.textContent = result.hint ? 'Послушай ещё раз. Подсказка уже на экране.' : 'Попробуй ещё раз.';
        for (const id of [].concat(result.hint ?? [])) choices.get(id)?.classList.add('literacy-hint');
      } else if (result.status === 'correct') {
        audioRequest++;
        answered = true;
        moveAnimation?.cancel();
        if (stage && kind === 'move-stop') stage.lumi.dataset.pose = 'lumi-listen';
        roundAnswers[roundIndex] = result.answer;
        for (const choice of choices.values()) choice.disabled = true;
        for (const sample of samples.querySelectorAll('button')) sample.disabled = true;
        status.textContent = 'Получилось!';
        next.hidden = false;
        if (stage && kind === 'discovery') move(stage.lumi, hop);
        if (!['rhythm', 'sequence', 'compose'].includes(kind) || !round.choices) {
          void play(['success'], element('span', ''));
        }
      }
    }

    function openSound(index, total = false) {
      if (answered) return;
      const request = ++audioRequest;
      status.textContent = '';
      const clips = total ? state.sample : [state.sample[index]];
      void play(clips, status, { onClip(clipIndex) {
        if (total) state.playClip(clipIndex);
      } }).then(done => {
        if (!done || answered || request !== audioRequest) return;
        if (total) state.sample.forEach((_, clipIndex) => heard.add(clipIndex));
        else heard.add(index);
        if (heard.size === state.sample.length) { state.finishListening(); sampleButton.dataset.ready = 'yes'; }
      });
    }

    if (individual) {
      state.sample.forEach((_, index) => {
        const sound = control((perItem ? 'Звук ' : 'Послушать ') + (index + 1), () => {
          openSound(index);
        });
        sound.dataset.soundIndex = String(index);
        samples.append(sound);
      });
    }

    function preview(id){
      const clip=round.choices?.[id];
      if(!clip)return Promise.resolve(true);
      return play([].concat(clip),status).then(done=>{if(done)auditions.add(id);return done;});
    }
    for (const id of state.options) {
      const art = illustrated.has(id)||(!round.listenChoices&&canIllustrate(id));
      const choice = control(labels[id] ?? (round.listenChoices?'Выбрать карточку '+(choices.size+1):artLabel(id)), async () => {
        if (answered) return;
        if (perItem && !heard.has(state.selection().length)) {
          status.textContent = 'Послушай следующую карточку.';
          return;
        }
        if(playingChoice)return;
        const waitForPreview = (round.listenChoices && !auditions.has(id)) || kind === 'theatre';
        if (waitForPreview) {
          playingChoice=true;
          choices.forEach(node=>node.disabled=true);
          const heardChoice=await preview(id);
          playingChoice=false;
          if(!answered)choices.forEach(node=>node.disabled=false);
          if(!heardChoice)return;
        }
        if(kind==='theatre'){
          progress.replaceChildren();
          const selected={ 'story-lad':'hands-clap','story-sor':'magpie','story-water':'wash' }[id];
          const enact=control('Оживить сценку',()=>{
            progress.querySelector('.literacy-action')?.classList.add('literacy-performing');
            showOutcome(state.select(id));
          });
          enact.dataset.enact=id;
          progress.append(literacyArt(selected),enact);
          return;
        }
        if (!waitForPreview && !round.listenChoices && round.choices?.[id] && sampleButton.dataset.ready === 'yes') {
          void preview(id);
        }
        showOutcome(state.select(id));
        if(['compose','rhythm','sequence','discovery','choice'].includes(kind))choice.querySelector('.literacy-action')?.classList.add('literacy-performing');
      });
      choice.dataset.choice = id;
      choice.classList.add('literacy-card');
      if (art) choice.prepend(illustrated.has(id)?sprite(imageFor(id)):literacyArt(id));
      if ((kind === 'compare' || kind === 'multi') && indexed.includes(id)) {
        const token = element('span', 'literacy-token', '●'.repeat(indexed.indexOf(id) + 1));
        token.setAttribute('aria-hidden', 'true');
        choice.prepend(token);
      }
      choices.set(id, choice);
      if(round.listenChoices){
        const group=element('div','literacy-choice-group');
        const audition=control('Слушать карточку '+choices.size,()=>void preview(id));
        audition.dataset.preview=id;
        group.append(audition,choice);buttons.append(group);
      }else buttons.append(choice);
    }

    const sampleButton = control('Послушать', () => openSound(0, true), true);
    sampleButton.classList.add('literacy-sample-ready');
    if (kind !== 'theatre') controls.append(sampleButton);
    if(speech[world]?.['clear|'+task.instruction])controls.append(control('Послушать инструкцию',()=>{void play([{voice:task.instruction}],status);}));
    if(['explore','compose','theatre'].includes(kind)){state.finishListening();sampleButton.dataset.ready='yes';}
    if (kind === 'multi'||kind==='rhythm') controls.append(control('Проверить', () => showOutcome(state.submit())));
    if(kind==='compose')controls.append(control('Проиграть оркестр',async()=>{
      if(state.selection().length!==round.answer.length){status.textContent='Выбери три звука.';return;}
      if(await play(state.selection().flatMap(id=>[].concat(round.choices[id])),status))showOutcome(state.submit());
    }));
    if (['sequence', 'match', 'sort', 'multi', 'compose', 'rhythm'].includes(kind)) controls.append(control('Сбросить выбор', () => {
      state.resetSelection();
      status.textContent = '';
      showOutcome({ status: 'picking' });
      status.textContent = '';
    }));
    controls.append(next);
    view.replaceChildren(heading, counter, instruction, ...(stage ? [stage.stage] : []), samples, buttons, progress, controls, status);
    void audio.preload([...clipsFor([...state.sample,...Object.values(round.choices??{}).flat()]).map(soundId), 'success']);
  }

  if (saved?.mode === 'practice') showPractice();
  else showScene();
  return { dispose: () => audio.dispose() };
}
