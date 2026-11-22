import { canOpen, checkAnswer, findCourse, findLesson, lessonUrl, practiceIsReady, programUrl, saveCompletion } from './course-model.js';

const params = new URLSearchParams(location.search);
const course = findCourse(params.get('course') ?? undefined);
const { module, lesson } = findLesson(course, params.get('module'), params.get('lesson'));
const content = document.querySelector('#lesson-content');
const context = document.querySelector('#lesson-context');
const title = document.querySelector('#lesson-title');
const returnLink = document.querySelector('#lesson-return');
let sceneIndex = 0;
let taskIndex = 0;
const answers = [];

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function button(label, handler, primary = false) {
  const control = element('button', primary ? 'academy-button lesson-primary' : 'lesson-secondary', label);
  control.type = 'button';
  control.addEventListener('click', handler);
  return control;
}

function show(panel, heading, moveFocus) {
  content.replaceChildren(panel);
  if (moveFocus) {
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    if (heading.getBoundingClientRect().top < 0 || heading.getBoundingClientRect().bottom > innerHeight) {
      heading.scrollIntoView({ block: 'start' });
    }
  }
}

function graphic(path, alt) {
  const image = element('img');
  image.src = path;
  image.alt = alt;
  return image;
}

function illustration(art) {
  const stage = element('div', 'lesson-stage');
  stage.setAttribute('role', 'img');
  stage.setAttribute('aria-label', art.label);
  if (art.image) stage.append(graphic(art.image, ''));
  for (const layer of art.layers || []) {
    const image = graphic(layer.image, '');
    image.className = 'lesson-layer';
    image.style.left = layer.x + '%';
    image.style.top = layer.y + '%';
    image.style.width = layer.width + '%';
    stage.append(image);
    if (layer.keyframes && image.animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      image.animate(layer.keyframes, { duration: layer.duration || 1000, fill: 'both' });
    }
  }
  return stage;
}

function showExplanation(moveFocus = true) {
  const scene = lesson.scenes[sceneIndex];
  const panel = element('section', 'lesson-step');
  const sectionTitle = element('h2', 'lesson-part', 'Объяснение Луми');
  const indicator = element('p', 'course-kicker lesson-count', 'Сцена ' + (sceneIndex + 1) + ' из ' + lesson.scenes.length);
  const stage = illustration(scene.illustration);
  const speech = element('div', 'lesson-speech');
  const lumi = graphic('../enchanted-library/assets/lumi-reading.png', '');
  lumi.width = 640;
  lumi.height = 585;
  const copy = element('div');
  const heading = element('h3', '', scene.title);
  copy.append(heading, element('p', '', scene.text));
  speech.append(lumi, copy);
  const controls = element('div', 'lesson-controls');
  const back = button('Назад', () => { sceneIndex -= 1; showExplanation(); });
  back.disabled = sceneIndex === 0;
  const next = sceneIndex === lesson.scenes.length - 1
    ? button('Перейти к практике', () => showPractice(), true)
    : button('Дальше', () => { sceneIndex += 1; showExplanation(); }, true);
  controls.append(back, next);
  panel.append(sectionTitle, indicator, stage, speech);

  if (scene.audio) {
    const audio = element('audio', 'lesson-audio');
    audio.src = scene.audio;
    audio.controls = true;
    audio.preload = 'none';
    audio.setAttribute('aria-label', 'Озвучка сцены «' + scene.title + '»');
    panel.append(audio);
  }
  panel.append(controls);
  show(panel, sectionTitle, moveFocus);
}

function options(task, feedback, next) {
  const choices = element('div', 'lesson-choices');
  let solved = answers[taskIndex] !== undefined;
  for (const choice of task.choices) {
    const control = button(choice.label, () => {
      if (solved) return;
      if (!checkAnswer(task, choice.id)) {
        feedback.textContent = task.hint;
        feedback.dataset.state = 'retry';
        return;
      }
      solved = true;
      answers[taskIndex] = choice.id;
      control.classList.add('is-correct');
      feedback.textContent = task.success || 'Верно!';
      feedback.dataset.state = 'correct';
      next.hidden = false;
    });
    if (choice.image) control.prepend(graphic(choice.image, ''));
    if (answers[taskIndex] === choice.id) control.classList.add('is-correct');
    choices.append(control);
  }
  return choices;
}

const practiceViews = new Map([['choice', options]]);

function showPractice() {
  const panel = element('section', 'lesson-step');
  const heading = element('h2', 'lesson-part', 'Практика');
  const controls = element('div', 'lesson-controls');
  controls.append(button('К объяснению', () => showExplanation()));

  const tasks = lesson.practice || [];
  panel.append(heading);
  if (!practiceIsReady(lesson)) {
    panel.append(element('p', 'lesson-pending', 'Задания для этого урока ещё готовятся.'));
    const listLink = element('a', 'academy-button', 'К списку уроков');
    listLink.href = programUrl(course, module);
    controls.append(listLink);
  } else {
    const task = tasks[taskIndex];
    const hint = element('p', 'lesson-feedback', answers[taskIndex] === undefined ? '' : (task.success || 'Верно!'));
    hint.setAttribute('role', 'status');
    const last = taskIndex === tasks.length - 1;
    const next = button(last ? 'Завершить урок' : 'Следующее задание', () => {
      if (last) showReward();
      else { taskIndex += 1; showPractice(); }
    }, true);
    next.hidden = answers[taskIndex] === undefined;
    panel.append(
      element('p', 'course-kicker lesson-count', 'Задание ' + (taskIndex + 1) + ' из ' + tasks.length),
      element('h3', 'lesson-question', task.prompt),
      practiceViews.get(task.kind)(task, hint, next),
      hint,
    );
    controls.append(next);
  }
  panel.append(controls);
  show(panel, heading, true);
}

function showReward() {
  if (!lesson.practice.every((task, index) => checkAnswer(task, answers[index]))) return;
  const saved = saveCompletion(course, module, lesson, answers);
  const panel = element('section', 'lesson-step lesson-reward');
  const star = element('span', 'lesson-reward-star');
  star.setAttribute('aria-hidden', 'true');
  const heading = element('h2', 'lesson-part', 'Урок пройден!');
  const listLink = element('a', 'academy-button', 'К списку уроков');
  listLink.href = programUrl(course, module);
  panel.append(star, heading, element('p', '', saved
    ? 'Ты выполнил все задания и получил золотую звезду!'
    : 'Ты выполнил все задания и получил золотую звезду! Браузер не смог сохранить результат.'), listLink);
  show(panel, heading, true);
}

if (course) {
  document.querySelector('#academy-main').dataset.courseTheme = course.theme;
  context.textContent = course.title + ' · ' + course.age;
  returnLink.href = programUrl(course, module);
}
if (lesson && module) {
  const number = (course.modules.indexOf(module) + 1) + '.' + (module.lessons.indexOf(lesson) + 1);
  title.textContent = number + ' ' + lesson.title;
  document.title = title.textContent + ' — Академия Луми';
}
if (canOpen(lesson)) {
  showExplanation(false);
} else {
  const pending = element('div', 'lesson-coming');
  const lumi = graphic('../enchanted-library/assets/lumi-reading.png', 'Луми с открытой книгой');
  lumi.width = 640;
  lumi.height = 585;
  const message = element('h2', 'lesson-part', lesson ? 'Занятие готовится' : 'Урок пока недоступен');
  pending.append(lumi, message);
  if (lesson) pending.append(element('p', '', 'Здесь появятся объяснение Луми и практика.'));
  const link = element('a', 'academy-button', 'К списку уроков');
  link.href = returnLink.href;
  pending.append(link);
  content.append(pending);
  if (lesson) {
    const ordered = course.modules.flatMap(entry => entry.lessons.map(item => ({ module: entry, lesson: item })));
    const current = ordered.findIndex(entry => entry.lesson === lesson);
    const navigation = element('nav', 'lesson-neighbors');
    navigation.setAttribute('aria-label', 'Соседние темы');
    for (const [offset, label] of [[-1, '← Предыдущая тема'], [1, 'Следующая тема →']]) {
      const entry = ordered[current + offset];
      if (!entry) continue;
      const neighbor = element('a', 'academy-return', label);
      neighbor.href = lessonUrl(course, entry.module, entry.lesson);
      neighbor.setAttribute('aria-label', label + ' — ' + entry.lesson.title);
      navigation.append(neighbor);
    }
    content.append(navigation);
  }
}
