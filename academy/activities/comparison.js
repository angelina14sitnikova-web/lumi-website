import { isPair, nextPair } from './comparison-model.js';
import { checkAnswer, lessonUrl, moduleStars, programUrl, saveCompletion } from '../course-model.js';

const shapes = ['ball', 'cube', 'triangle', 'house', 'car', 'bear', 'flower'];
const colors = ['blue', 'rose', 'green', 'gold'];
const shapeNames = {
  ball: 'мяч', cube: 'кубик', triangle: 'треугольник',
  house: 'домик', car: 'машинка', bear: 'мишка', flower: 'цветок',
};
const swatches = { blue: '#79bce3', rose: '#e68fae', green: '#7bb893', gold: '#e6b45f' };
const colorNames = { blue: 'голубой', rose: 'розовый', green: 'зелёный', gold: 'жёлтый' };
const sizeNames = { small: 'маленький', medium: 'средний', large: 'большой' };
const marks = {
  color: 'цвет', size: 'размер', shape: 'форма', star: 'звезда', moon: 'месяц',
  move: 'перемещение', appear: 'появился', vanish: 'исчез',
  left: 'слева', middle: 'посередине', right: 'справа',
  match: 'найди копию', odd: 'отличается', larger: 'больший предмет',
  pair: 'соедини пару', 'new-detail': 'новая деталь',
};

function node(tag, className, text) {
  const item = document.createElement(tag);
  if (className) item.className = className;
  if (text) item.textContent = text;
  return item;
}

function control(text, action, primary = false) {
  const item = node('button', primary ? 'cmp-button cmp-primary' : 'cmp-button', text);
  item.type = 'button';
  item.addEventListener('click', action);
  return item;
}

function link(text, href, primary = false) {
  const item = node('a', primary ? 'cmp-button cmp-primary' : 'cmp-button', text);
  item.href = href;
  return item;
}

function icon(name) {
  const visual = node('span', 'cmp-icon');
  visual.dataset.mark = name;
  visual.setAttribute('role', 'img');
  visual.setAttribute('aria-label', marks[name] || name);
  for (let i = 0; i < 3; i += 1) visual.append(node('i'));
  return visual;
}

function label(piece) {
  return piece.mark ? marks[piece.mark] : [
    shapeNames[piece.shape], 'цвет ' + colorNames[piece.color],
    'размер ' + sizeNames[piece.size], piece.detail ? 'значок ' + marks[piece.detail] : '',
  ].filter(Boolean).join(', ');
}

function pieceArt(piece) {
  if (!piece) {
    const empty = node('span', 'cmp-empty');
    empty.setAttribute('role', 'img');
    empty.setAttribute('aria-label', 'пустое место');
    return empty;
  }
  if (piece.mark) return icon(piece.mark);
  const art = node('span', 'cmp-toy');
  art.dataset.size = piece.size;
  art.setAttribute('role', 'img');
  art.setAttribute('aria-label', label(piece));
  art.style.backgroundPosition = (shapes.indexOf(piece.shape) * 100 / (shapes.length - 1)) + '% ' +
    (colors.indexOf(piece.color) * 100 / (colors.length - 1)) + '%';
  if (piece.detail) {
    const mark = icon(piece.detail);
    mark.classList.add('cmp-sticker');
    mark.setAttribute('aria-hidden', 'true');
    art.append(mark);
  }
  return art;
}

function shelf(pieces, caption, before, effect) {
  const tray = node('div', 'cmp-shelf');
  if (caption) tray.append(node('span', 'cmp-shelf-label', caption));
  const slots = node('div', 'cmp-shelf-slots');
  pieces.forEach((piece, index) => {
    const slot = node('div', 'cmp-slot');
    slot.append(pieceArt(piece));
    if (before && effect && JSON.stringify(piece) !== JSON.stringify(before[index])) {
      if (piece) slot.classList.add('cmp-reveal');
      if (before[index]) {
        const ghost = pieceArt(before[index]);
        ghost.classList.add('cmp-ghost');
        ghost.setAttribute('aria-hidden', 'true');
        slot.append(ghost);
      }
    }
    slots.append(slot);
  });
  tray.append(slots);
  return tray;
}

function board(view = {}, effect) {
  const stage = node('div', 'cmp-stage');
  if (effect) stage.dataset.effect = effect;
  const { toys, sample, feature, before, after, aim, highlights, odd } = view;
  if (sample) {
    const pedestal = node('div', 'cmp-pedestal');
    pedestal.append(pieceArt(sample));
    pedestal.setAttribute('aria-label', 'Образец');
    stage.append(pedestal);
  }
  if (feature || aim) {
    const key = node('div', 'cmp-visual-key');
    if (feature) key.append(icon(feature));
    if (aim && aim !== feature && (!compareIsShown(view) || aim === 'new-detail')) key.append(icon(aim));
    stage.append(key);
  }
  if (before && after) {
    const changes = node('div', 'cmp-change');
    changes.append(shelf(before, 'Сначала'), node('span', 'cmp-direction', '→'), shelf(after, 'Потом', before, effect));
    stage.append(changes);
  }
  if (toys) {
    const display = node('div', 'cmp-display');
    toys.forEach((toy, index) => {
      const cell = node('div', 'cmp-display-item');
      if (highlights?.includes(index) || (!highlights && effect === 'join')) cell.classList.add('cmp-demo-match');
      if (odd === index) cell.classList.add('cmp-demo-odd');
      cell.dataset.size = toy.size;
      cell.append(pieceArt(toy));
      if (feature === 'color' && effect) {
        const swatch = node('span', 'cmp-swatch');
        swatch.style.backgroundColor = swatches[toy.color];
        swatch.setAttribute('aria-hidden', 'true');
        cell.append(swatch);
      }
      display.append(cell);
    });
    if (effect === 'join') {
      const matched = highlights || toys.map((_, index) => index);
      const trail = node('span', 'cmp-trail');
      trail.setAttribute('aria-hidden', 'true');
      if (sample) {
        stage.classList.add('cmp-sample-join');
        trail.style.left = (50 - (toys.length - 1 - matched[0] * 2) * 12) + '%';
        trail.classList.add('cmp-trail-up');
      } else {
        const first = matched[0];
        const last = matched[matched.length - 1];
        const space = toys.length === 2 ? 26 : 25;
        trail.style.left = (50 + (first - (toys.length - 1) / 2) * space) + '%';
        trail.style.width = ((last - first) * space) + '%';
      }
      display.append(trail);
    }
    stage.append(display);
  }
  return stage;
}

function compareIsShown(view) {
  return Boolean(view.toys || view.before);
}

function dots(count, index, name) {
  const item = node('div', 'cmp-dots');
  item.setAttribute('role', 'group');
  item.setAttribute('aria-label', name + ' ' + (index + 1) + ' из ' + count);
  for (let i = 0; i < count; i += 1) {
    const dot = node('span', i < index ? 'is-done' : i === index ? 'is-current' : '');
    dot.setAttribute('aria-hidden', 'true');
    item.append(dot);
  }
  return item;
}

function mascot() {
  const mascotImage = node('img', 'cmp-lumi');
  mascotImage.src = '../enchanted-library/assets/lumi-reading.png';
  mascotImage.alt = 'Луми';
  mascotImage.width = 640;
  mascotImage.height = 585;
  return mascotImage;
}

export function mountComparison(content, course, module, lesson) {
  let sceneIndex = 0;
  let exerciseIndex = 0;
  let roundIndex = 0;
  let allAnswers = [];
  let roundAnswers = [];
  const courseUrl = programUrl(course, module);
  content.classList.add('cmp-lesson');

  function show(panel, heading, moveFocus = true) {
    content.replaceChildren(panel);
    if (moveFocus) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
      const bounds = heading.getBoundingClientRect();
      if (bounds.top < 10 || bounds.bottom > innerHeight) heading.scrollIntoView({ block: 'start' });
    }
  }

  function explain(moveFocus = true) {
    const scene = lesson.scenes[sceneIndex];
    const panel = node('section', 'cmp-panel cmp-explanation');
    const title = node('h2', 'cmp-heading', 'Объяснение Луми');
    let stage = board(scene.board, scene.effect);
    const note = node('div', 'cmp-note');
    const words = node('div');
    words.append(node('h3', '', scene.title), node('p', '', scene.text));
    note.append(mascot(), words);
    const nav = node('div', 'cmp-actions');
    const back = control('← Назад', () => { sceneIndex -= 1; explain(); });
    back.disabled = sceneIndex === 0;
    const replay = control('↻ Повторить сцену', () => {
      const nextStage = board(scene.board, scene.effect);
      stage.replaceWith(nextStage);
      stage = nextStage;
    });
    const forward = sceneIndex === lesson.scenes.length - 1
      ? control('К практике →', practice, true)
      : control('Дальше →', () => { sceneIndex += 1; explain(); }, true);
    nav.append(back, replay, forward);
    panel.append(title, dots(lesson.scenes.length, sceneIndex, 'Сцена'), stage, note);
    if (scene.audio) {
      const audio = node('audio', 'cmp-audio');
      audio.src = scene.audio;
      audio.controls = true;
      audio.preload = 'none';
      audio.setAttribute('aria-label', 'Озвучка сцены');
      panel.append(audio);
    }
    panel.append(nav);
    show(panel, title, moveFocus);
  }

  function practice() {
    const exercise = lesson.practice[exerciseIndex];
    const pairMode = Boolean(exercise.pairs);
    const round = pairMode ? null : exercise.rounds[roundIndex];
    const pieces = pairMode ? exercise.options : round.options;
    const view = pairMode ? { aim: 'pair' } : round.view;
    const panel = node('section', 'cmp-panel cmp-practice');
    panel.dataset.exercise = String(exerciseIndex + 1);
    panel.dataset.round = String(roundIndex + 1);
    const title = node('h2', 'cmp-heading', 'Практика');
    const prompt = node('p', 'cmp-prompt', exercise.prompt);
    const status = node('div', 'cmp-response');
    const response = node('p');
    response.setAttribute('role', 'status');
    status.append(response);
    const grid = node('div', 'cmp-options');
    grid.dataset.tiles = String(pieces.length);
    const matched = new Set();
    const pairAnswers = [];
    let selected = -1;
    let selectedAnswer = null;
    let errors = 0;
    let solved = false;

    const lastRound = pairMode || roundIndex === exercise.rounds.length - 1;
    const lastExercise = exerciseIndex === lesson.practice.length - 1;
    const nav = node('div', 'cmp-actions');
    const next = control(lastExercise && lastRound ? 'Получить звёздочку ★' : 'Дальше →', advance, true);
    next.disabled = true;
    nav.append(link('К модулю', courseUrl), next);

    const choices = pieces.map((piece, index) => {
      const item = control('', () => choose(index));
      item.className = 'cmp-option';
      item.dataset.option = String(index);
      item.setAttribute('aria-label', label(piece));
      if (pairMode) item.setAttribute('aria-pressed', 'false');
      item.append(pieceArt(piece), node('span', 'cmp-choice-check', '✓'));
      item.lastChild.setAttribute('aria-hidden', 'true');
      grid.append(item);
      return item;
    });

    function showHint(message, hints = []) {
      status.dataset.feedback = 'retry';
      response.textContent = message;
      choices.forEach((choice, index) => choice.classList.toggle('cmp-hint', hints.includes(index)));
    }

    function wrong() {
      errors += 1;
      const hint = pairMode ? nextPair(exercise, matched) : [round.correct];
      showHint(errors >= 2 ? exercise.hint : 'Попробуй ещё раз.', errors >= 2 ? hint : []);
    }

    function right(indices, finished) {
      errors = 0;
      choices.forEach(choice => choice.classList.remove('cmp-hint'));
      indices.forEach(index => {
        const choice = choices[index];
        choice.classList.add('cmp-correct');
        choice.setAttribute('aria-disabled', 'true');
        if (pairMode) choice.setAttribute('aria-pressed', 'true');
      });
      status.dataset.feedback = 'correct';
      response.textContent = pairMode ? 'Получилась пара!' : 'Верно!';
      if (view.explainOdd) {
        choices.forEach((choice, index) => {
          if (index !== indices[0]) choice.classList.add('cmp-confirm-group');
        });
      }
      solved = finished;
      next.disabled = !finished;
      if (finished && document.activeElement?.matches('.cmp-option')) next.focus({ preventScroll: true });
    }

    function choose(index) {
      if (solved || matched.has(index)) return;
      if (!pairMode) {
        if (index === round.correct) {
          selectedAnswer = index;
          right([index], true);
        }
        else wrong();
        return;
      }
      if (selected === index) {
        choices[index].setAttribute('aria-pressed', 'false');
        selected = -1;
        return;
      }
      if (selected < 0) {
        selected = index;
        choices[index].setAttribute('aria-pressed', 'true');
        return;
      }
      const first = selected;
      selected = -1;
      if (!isPair(exercise, first, index)) {
        choices[first].setAttribute('aria-pressed', 'false');
        wrong();
        return;
      }
      matched.add(first);
      matched.add(index);
      pairAnswers.push([first, index]);
      right([first, index], pairAnswers.length === exercise.pairs.length);
    }

    function advance() {
      if (!solved) return;
      if (!pairMode) roundAnswers.push(selectedAnswer);
      if (!lastRound) {
        roundIndex += 1;
        practice();
        return;
      }
      const answer = pairMode ? pairAnswers : roundAnswers;
      if (!checkAnswer(exercise, answer)) return;
      allAnswers.push(answer);
      if (lastExercise) {
        reward(saveCompletion(course, module, lesson, allAnswers));
        return;
      }
      exerciseIndex += 1;
      roundIndex = 0;
      roundAnswers = [];
      practice();
    }

    panel.append(title, dots(lesson.practice.length, exerciseIndex, 'Упражнение'), prompt, board(view), grid);
    if (!lastRound || roundIndex) panel.append(dots(exercise.rounds.length, roundIndex, 'Ход'));
    panel.append(status, nav);
    show(panel, title);
  }

  function reward(saved) {
    const panel = node('section', 'cmp-panel cmp-reward');
    const heading = node('h2', 'cmp-heading', 'Урок пройден!');
    const stars = moduleStars(course, module);
    const complete = stars === module.lessons.length;
    const medal = node('span', complete ? 'cmp-medal' : 'cmp-reward-star', '★');
    medal.setAttribute('aria-hidden', 'true');
    panel.append(medal, heading);
    if (complete) panel.append(node('h3', '', 'Медаль внимательного исследователя'));
    panel.append(node('p', '', saved ? 'Звёздочки модуля: ' + stars + ' из ' + module.lessons.length
      : 'Ты заработал звёздочку! Браузер не сохранил прогресс.'));
    const nav = node('div', 'cmp-actions');
    const nextLesson = module.lessons[module.lessons.indexOf(lesson) + 1];
    nav.append(link('К модулю', courseUrl), control('↻ Пройти ещё раз', () => {
      sceneIndex = 0;
      exerciseIndex = 0;
      roundIndex = 0;
      allAnswers = [];
      roundAnswers = [];
      explain();
    }));
    if (nextLesson?.format === 'comparison') {
      nav.append(link('Следующий урок →', lessonUrl(course, module, nextLesson), true));
    }
    panel.append(nav);
    show(panel, heading);
  }

  explain(false);
}
