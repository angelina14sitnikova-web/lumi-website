import { createLessonAudio } from './audio.js';
import { createListeningRound } from './listening-round.js';

const labels = {
  cat: 'Кошка', dog: 'Собака', cow: 'Корова', duck: 'Утка', bird: 'Птица',
  rain: 'Дождь', stream: 'Ручей', leaves: 'Шелест листьев', bell: 'Колокольчик',
  drum: 'Барабан', paper: 'Бумага', rattle: 'Погремушка',
  audible: 'Был звук', quiet: 'Было тихо', move: 'Двигаться', stop: 'Замереть',
  first: 'Первый', second: 'Второй', third: 'Третий', softer: 'Тише', stronger: 'Громче',
  animals: 'Животные', nature: 'Природа', objects: 'Предметы',
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

function makeStage({ objects = [], pose = 'lumi-listen' } = {}) {
  const stage = element('div', 'literacy-stage');
  stage.style.backgroundImage = 'url("' + imageFor('forest') + '")';
  const lumi = sprite(imageFor(pose), 'literacy-lumi');
  const contents = element('div', 'literacy-objects');
  const icons = objects.map(id => {
    const image = sprite(imageFor(id), 'literacy-object');
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
  const audio = createAudio(manifest);
  const taskAnswers = Array.isArray(saved?.answers) ? saved.answers : [];
  let sceneIndex = Math.min(Math.max(saved?.scene ?? 0, 0), 2);
  let taskIndex = Math.min(Math.max(saved?.task ?? 0, 0), 4);
  let roundIndex = 0;
  let roundAnswers = [];
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
      const result = await audio.play(clips, options);
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
    const { stage, lumi, icons } = makeStage({ objects: scene.objects });
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
          const icon = icons.find(piece => piece.dataset.object === sound);
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
    void audio.preload(scene.sounds.map(soundId));
  }

  function showPractice() {
    viewId++;
    audio.stop();
    const task = lesson.practice[taskIndex];
    const round = task.rounds[roundIndex];
    const state = createListeningRound(task.kind, round);
    save({ mode: 'practice', scene: sceneIndex, task: taskIndex, answers: taskAnswers });
    const individual = itemAudioKinds.has(task.kind) || task.kind === 'multi' || task.kind === 'compare';
    const perItem = itemAudioKinds.has(task.kind);
    const heading = element('h2', 'lesson-part', task.name);
    const counter = element('p', 'course-kicker lesson-count', 'Игра ' + (taskIndex + 1) + ' из 5');
    const instruction = element('p', 'literacy-caption', task.instruction);
    const status = element('p', 'literacy-message');
    status.setAttribute('role', 'status');
    const buttons = element('div', 'literacy-cards');
    const samples = element('div', 'literacy-samples');
    const controls = element('div', 'lesson-actions literacy-actions');
    const isSleeping = task.name === 'Луми спит';
    const stage = ['move-stop', 'discovery'].includes(task.kind) || isSleeping
      ? makeStage({ pose: isSleeping ? 'lumi-sleep' : 'lumi-listen' }) : null;
    const heard = new Set();
    const choices = new Map();
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
      for (const [id, choice] of choices) {
        choice.classList.toggle('literacy-selected', state.selection().includes(id) && task.kind === 'multi');
        if (task.kind === 'multi') choice.setAttribute('aria-pressed', String(state.selection().includes(id)));
        choice.classList.remove('literacy-hint');
      }
      if (result.status === 'wait') {
        status.textContent = answered ? '' : 'Сначала послушай образец.';
      } else if (result.status === 'picking') {
        if (task.kind === 'move-stop' && stage && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
          stage.lumi.src = imageFor('lumi-hop');
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
        if (stage && task.kind === 'move-stop') stage.lumi.src = imageFor('lumi-listen');
        roundAnswers[roundIndex] = result.answer;
        for (const choice of choices.values()) choice.disabled = true;
        for (const sample of samples.querySelectorAll('button')) sample.disabled = true;
        status.textContent = 'Получилось!';
        next.hidden = false;
        if (stage && task.kind === 'discovery') move(stage.lumi, hop);
        void play(['success'], element('span', ''));
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
        if (heard.size === state.sample.length) state.finishListening();
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

    for (const id of state.options) {
      const art = illustrated.has(id);
      const choice = control(labels[id], () => {
        if (answered) return;
        if (perItem && !heard.has(state.selection().length)) {
          status.textContent = 'Послушай следующую карточку.';
          return;
        }
        showOutcome(state.select(id));
      });
      choice.dataset.choice = id;
      choice.classList.add('literacy-card');
      if (art) choice.prepend(sprite(imageFor(id)));
      if ((task.kind === 'compare' || task.kind === 'multi') && indexed.includes(id)) {
        const token = element('span', 'literacy-token', '●'.repeat(indexed.indexOf(id) + 1));
        token.setAttribute('aria-hidden', 'true');
        choice.prepend(token);
      }
      choices.set(id, choice);
      buttons.append(choice);
    }

    const sampleButton = control('Послушать', () => openSound(0, true), true);
    controls.append(sampleButton);
    if (task.kind === 'multi') controls.append(control('Проверить', () => showOutcome(state.submit())));
    if (['sequence', 'match', 'sort', 'multi'].includes(task.kind)) controls.append(control('Сбросить выбор', () => {
      state.resetSelection();
      status.textContent = '';
      showOutcome({ status: 'picking' });
      status.textContent = '';
    }));
    controls.append(next);
    view.replaceChildren(heading, counter, instruction, ...(stage ? [stage.stage] : []), samples, buttons, controls, status);
    void audio.preload([...state.sample.map(soundId), 'success']);
  }

  if (saved?.mode === 'practice') showPractice();
  else showScene();
  return { dispose: () => audio.dispose() };
}
