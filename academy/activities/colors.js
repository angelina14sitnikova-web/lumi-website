import { checkAnswer, lessonUrl, moduleStars, programUrl, saveCompletion } from '../course-model.js';
import { colorTargets, palette } from './colors-model.js';
import { toy, toyName } from './colors-art.js';

const medalName = 'Радужная медаль Луми';

function element(tag, className, text) {
  const item = document.createElement(tag);
  if (className) item.className = className;
  if (text) item.textContent = text;
  return item;
}

function action(text, handler, primary = false) {
  const button = element('button', primary ? 'academy-button lesson-primary' : 'lesson-secondary', text);
  button.type = 'button';
  button.addEventListener('click', handler);
  return button;
}

function link(text, href, primary = false) {
  const anchor = element('a', primary ? 'academy-button' : 'academy-return', text);
  anchor.href = href;
  return anchor;
}

function sample(color) {
  const dot = element('span', 'color-sample');
  dot.style.setProperty('--sample', palette[color].paint);
  dot.setAttribute('aria-hidden', 'true');
  return dot;
}

function basket(color, mode, handler) {
  const bin = element(handler ? 'button' : 'div', 'color-bin');
  bin.dataset.color = color;
  bin.dataset.mode = mode;
  bin.style.setProperty('--bin', palette[color].paint);
  if (handler) {
    bin.type = 'button';
    bin.setAttribute('aria-label', (mode === 'match' ? 'Образец' : 'Корзина') + ' · ' + palette[color].name);
    bin.addEventListener('click', () => handler(color));
  }
  bin.append(sample(color), element('span', 'color-basket-items'));
  return bin;
}

function animate(node, frames, options) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    node.dataset.still = 'true';
    return;
  }
  return node.animate(frames, options);
}

function moveToy(image, from, dest, delay = 0) {
  const start = from.getBoundingClientRect();
  const contents = dest.querySelector('.color-basket-items');
  contents.append(image);
  const end = image.getBoundingClientRect();
  const dx = start.left + start.width / 2 - end.left - end.width / 2;
  const dy = start.top + start.height / 2 - end.top - end.height / 2;
  const scale = Math.min(start.width / end.width, 3);
  animate(image, [
    { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + scale + ')' },
    { transform: 'translate(' + dx * .45 + 'px,' + (dy * .55 - 35) + 'px) scale(1.3)', offset: .56 },
    { transform: 'none' },
  ], { duration: 635, delay, fill: 'both', easing: 'ease-in-out' });
}

function board(room, className = '') {
  const stage = element('div', 'color-board ' + className);
  const background = element('img', 'color-room');
  background.src = 'assets/colors/' + room + '.webp';
  background.alt = '';
  stage.append(background);
  return stage;
}

function illustration(scene, room) {
  const stage = board(room, 'color-demo');
  stage.dataset.effect = scene.effect;
  stage.setAttribute('role', 'img');
  stage.setAttribute('aria-label', scene.text);
  const props = element('div', 'color-scene-props');
  const character = element('img', 'color-lumi');
  character.src = '../enchanted-library/assets/lumi-reading.png';
  character.alt = '';
  stage.append(character, props);
  const visuals = scene.pieces.map(piece => {
    const slot = element('span', 'color-prop');
    slot.append(toy(piece));
    props.append(slot);
    return slot;
  });

  if (scene.effect === 'paint') {
    const pot = element('span', 'color-paint');
    const brush = element('span', 'color-brush');
    pot.style.setProperty('--paint', palette[scene.focus].paint);
    brush.style.setProperty('--paint', palette[scene.focus].paint);
    pot.append(sample(scene.focus));
    props.prepend(pot);
    props.append(brush);
    const slot = visuals[0];
    const unpainted = toy({ ...scene.pieces[0], color: 'white' });
    slot.prepend(unpainted);
    animate(slot.lastChild, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }],
      { duration: 1050, delay: 550, fill: 'both', easing: 'ease-in-out' });
    animate(brush, [
      { transform: 'translate(0,0) rotate(24deg)', opacity: 0 },
      { transform: 'translate(-105px,6px) rotate(50deg)', opacity: 1, offset: .33 },
      { transform: 'translate(-20px,21px) rotate(30deg)', opacity: 1, offset: .8 },
      { transform: 'translate(8px,9px) rotate(18deg)', opacity: 0 },
    ], { duration: 1750, fill: 'both' });
  } else if (scene.effect === 'sort') {
    const bins = element('div', 'color-bins color-demo-bins');
    const byColor = new Map(scene.bins.map(color => [color, basket(color, 'sort')]));
    bins.append(...byColor.values());
    stage.append(bins);
    requestAnimationFrame(() => {
      if (!stage.isConnected) return;
      const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
      scene.pieces.forEach((piece, index) => {
        const slot = visuals[index];
        const destination = byColor.get(piece.color);
        if (still) slot.replaceChildren();
        else animate(slot.firstChild, [{ opacity: 1 }, { opacity: 0, offset: .015 }, { opacity: 0 }],
          { duration: 665, delay: 440 + index * 680, fill: 'forwards' });
        moveToy(toy(piece), slot, destination, 440 + index * 680);
        if (!still) {
          const moved = destination.querySelector('.color-basket-items').lastChild;
          animate(moved, [{ opacity: 0 }, { opacity: 0, offset: .94 }, { opacity: 1 }],
            { duration: 450 + index * 680, fill: 'backwards' });
        }
      });
    });
  } else {
    visuals.forEach((slot, index) => {
      animate(slot, [{ opacity: 0, transform: 'translateY(12px) scale(.9)' },
        { opacity: 1, transform: 'none' }], { duration: 440, delay: index * 250, fill: 'both', easing: 'ease-out' });
      if (scene.pieces[index].color === scene.focus) {
        slot.classList.add('color-compared');
        animate(slot, [{ outlineColor: 'transparent' }, { outlineColor: '#8455a4' }],
          { duration: 470, delay: 650, fill: 'both' });
      }
    });
  }
  return stage;
}

export function mountColors(content, course, module, lesson) {
  const courseUrl = programUrl(course, module);
  let sceneIndex = 0;
  let exerciseIndex = 0;
  let answers = [];

  function display(heading, panel, focus = true) {
    content.replaceChildren(panel);
    if (!focus) return;
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    const bounds = heading.getBoundingClientRect();
    if (bounds.top < 0 || bounds.bottom > innerHeight) heading.scrollIntoView({ block: 'start' });
  }

  function header(panel, title, index, count, label) {
    const heading = element('h2', 'lesson-part', title);
    const step = element('div', 'color-steps');
    step.setAttribute('role', 'img');
    step.setAttribute('aria-label', label + ' ' + (index + 1) + ' из ' + count);
    for (let i = 0; i < count; i += 1) {
      const dot = element('span');
      dot.dataset.state = i === index ? 'current' : i < index ? 'done' : 'next';
      step.append(dot);
    }
    panel.append(heading, step);
    return heading;
  }

  function explanation(focus = true) {
    const scene = lesson.scenes[sceneIndex];
    const panel = element('section', 'color-lesson');
    const heading = header(panel, 'Объяснение Луми', sceneIndex, lesson.scenes.length, 'Сцена');
    let stage = illustration(scene, lesson.room);
    const words = element('div', 'color-words');
    words.append(element('h3', '', scene.title), element('p', '', scene.text));
    const back = action('← Назад', () => { sceneIndex -= 1; explanation(); });
    back.disabled = sceneIndex === 0;
    const replay = action('↻ Повторить сцену', () => {
      const next = illustration(scene, lesson.room);
      stage.replaceWith(next);
      stage = next;
    });
    const forward = sceneIndex + 1 === lesson.scenes.length ? action('К практике →', practice, true)
      : action('Дальше →', () => { sceneIndex += 1; explanation(); }, true);
    const nav = element('div', 'lesson-controls');
    nav.append(back, replay, forward);
    panel.append(stage, words);
    if (scene.audio) {
      const audio = element('audio', 'lesson-audio');
      audio.src = scene.audio;
      audio.controls = true;
      audio.preload = 'none';
      audio.setAttribute('aria-label', 'Озвучка сцены');
      panel.append(audio);
    }
    panel.append(nav);
    display(heading, panel, focus);
  }

  function practice() {
    const task = lesson.practice[exerciseIndex];
    const targets = colorTargets(task);
    const steps = [...(answers[exerciseIndex] || [])];
    const panel = element('section', 'color-lesson');
    panel.dataset.exercise = String(exerciseIndex + 1);
    const heading = header(panel, 'Практика', exerciseIndex, lesson.practice.length, 'Задание');
    const prompt = element('h3', 'color-prompt', task.prompt);
    const guide = element('p', 'color-guide', task.guide);
    guide.id = 'color-guide';
    const stage = board(task.setting === 'garden' ? 'garden' : lesson.room, 'color-play');
    const pieces = element('div', 'color-pieces');
    pieces.dataset.setting = task.setting || task.mode;
    pieces.setAttribute('role', 'group');
    pieces.setAttribute('aria-label', 'Игрушки');
    pieces.setAttribute('aria-describedby', guide.id);
    const feedback = element('p', 'color-feedback');
    feedback.setAttribute('role', 'status');
    const last = exerciseIndex + 1 === lesson.practice.length;
    const next = action(last ? 'Получить звёздочку ★' : 'Дальше →', () => {
      if (!checkAnswer(task, steps)) return;
      if (last) reward(saveCompletion(course, module, lesson, answers));
      else { exerciseIndex += 1; practice(); }
    }, true);
    const controls = element('div', 'lesson-controls');
    controls.append(link('К модулю', courseUrl), action('К объяснению', () => explanation()), next);
    const destinations = new Map();
    let mistakes = 0;
    let selected = null;

    function remaining() {
      return targets.filter(index => !steps.some(step => step.index === index));
    }

    function update(message) {
      const done = remaining().length === 0;
      next.disabled = !done;
      feedback.dataset.state = done ? 'correct' : 'info';
      feedback.textContent = done ? 'Верно! Можно идти дальше.' : message;
      for (const bin of destinations.values()) bin.disabled = done;
    }

    function clearHint() {
      panel.querySelectorAll('[data-hint]').forEach(node => delete node.dataset.hint);
    }

    function mistake(button, message) {
      mistakes += 1;
      clearHint();
      feedback.dataset.state = 'retry';
      feedback.textContent = mistakes < 2 ? message : 'Подсказка: посмотри, что обведено рамкой.';
      animate(button, [{ transform: 'none' }, { transform: 'translateX(4px)' },
        { transform: 'translateX(-4px)' }, { transform: 'none' }], { duration: 240 });
      if (mistakes < 2) return;
      if (destinations.size && selected !== null) destinations.get(task.pieces[selected].color).dataset.hint = 'true';
      else buttons[remaining()[0]].dataset.hint = 'true';
    }

    function accept(index, destination = null, animated = true) {
      const button = buttons[index];
      const bonusFocus = animated && button === document.activeElement;
      button.classList.add('color-found');
      button.disabled = true;
      button.setAttribute('aria-pressed', 'true');
      if (destination) {
        const bin = destinations.get(destination);
        if (animated) moveToy(toy(task.pieces[index]), button, bin);
        else bin.querySelector('.color-basket-items').append(toy(task.pieces[index]));
        button.classList.add('color-placed');
      } else if (animated) {
        animate(button.firstChild, [{ transform: 'none' }, { transform: 'scale(1.12)' }, { transform: 'none' }],
          { duration: 330, easing: 'ease-out' });
      }
      if (bonusFocus) {
        const nextTarget = buttons.slice(index + 1).find(item => !item.disabled) || buttons.find(item => !item.disabled);
        (remaining().length ? nextTarget : next)?.focus({ preventScroll: true });
      }
    }

    function record(index, destination) {
      steps.push({ index, destination });
      answers[exerciseIndex] = steps;
      mistakes = 0;
      clearHint();
      selected = null;
      update(destination ? 'Игрушка на месте! Выбери следующую.' : 'Получилось! Поищи ещё.');
      accept(index, destination);
      if (next.disabled === false && destinations.size) next.focus({ preventScroll: true });
    }

    function choose(index) {
      if (next.disabled === false) return;
      if (!remaining().includes(index)) {
        if (selected !== null) buttons[selected].setAttribute('aria-pressed', 'false');
        selected = null;
        mistake(buttons[index], task.mode === 'odd'
          ? 'У этой игрушки такой же цвет, как у кружка. Поищи другую.'
          : 'Сравни цвет с кружком и попробуй ещё раз.');
        return;
      }
      if (!destinations.size) {
        record(index, null);
        return;
      }
      if (selected !== null) buttons[selected].setAttribute('aria-pressed', 'false');
      selected = index;
      buttons[index].setAttribute('aria-pressed', 'true');
      clearHint();
      feedback.dataset.state = 'info';
      feedback.textContent = task.mode === 'match' ? 'Теперь нажми на кружок такого же цвета.'
        : 'Теперь нажми на корзину с кружком такого же цвета.';
    }

    function place(color) {
      const bin = destinations.get(color);
      if (selected === null) {
        mistake(bin, 'Сначала нажми на игрушку.');
      } else if (task.pieces[selected].color !== color) {
        mistake(bin, 'Кружок другого цвета. Попробуй ещё раз.');
      } else {
        record(selected, color);
        if (next.disabled && bin === document.activeElement) {
          buttons.find(button => !button.disabled)?.focus({ preventScroll: true });
        }
      }
    }

    const buttons = task.pieces.map((piece, index) => {
      const button = element('button', 'color-choice');
      button.type = 'button';
      button.setAttribute('aria-label', toyName(piece));
      button.setAttribute('aria-pressed', 'false');
      button.append(toy(piece));
      button.addEventListener('click', () => choose(index));
      return button;
    });
    pieces.append(...buttons);
    if (task.bins) {
      const row = element('div', 'color-bins');
      row.setAttribute('role', 'group');
      row.setAttribute('aria-label', task.mode === 'match' ? 'Цветовые образцы' : 'Корзины');
      task.bins.forEach(color => {
        const bin = basket(color, task.mode, place);
        destinations.set(color, bin);
        row.append(bin);
      });
      stage.append(pieces, row);
    } else if (task.mode === 'odd') {
      const wrongBin = element('div', 'color-odd-bin');
      wrongBin.style.setProperty('--bin', palette[task.color].paint);
      const mismatch = element('span', 'color-mismatch', '≠');
      mismatch.setAttribute('aria-hidden', 'true');
      const binCue = element('span', 'color-odd-cue');
      binCue.append(sample(task.color), mismatch);
      wrongBin.append(binCue, pieces);
      stage.append(wrongBin);
    } else {
      const cue = element('div', 'color-cue', 'Образец');
      cue.setAttribute('aria-label', 'Образец · ' + palette[task.color].name);
      cue.setAttribute('role', 'img');
      cue.prepend(sample(task.color));
      stage.append(cue, pieces);
    }
    for (const step of steps) accept(step.index, step.destination, false);
    update('');
    panel.append(prompt, guide, stage, feedback, controls);
    display(heading, panel);
  }

  function reward(saved) {
    const panel = element('section', 'color-lesson color-reward');
    const stars = moduleStars(course, module);
    const complete = stars === module.lessons.length;
    const mark = element('span', complete ? 'color-medal' : 'cmp-reward-star', '★');
    mark.setAttribute('aria-hidden', 'true');
    const heading = element('h2', 'lesson-part', 'Урок пройден!');
    const next = module.lessons[module.lessons.indexOf(lesson) + 1];
    panel.append(mark, heading);
    if (complete) panel.append(element('h3', '', medalName));
    panel.append(element('p', '', saved ? 'Звёздочки модуля: ' + stars + ' из ' + module.lessons.length
      : 'Ты заработал звёздочку! Браузер не сохранил прогресс.'));
    const controls = element('div', 'lesson-controls');
    controls.append(link('К модулю', courseUrl), action('↻ Пройти ещё раз', () => {
      sceneIndex = 0;
      exerciseIndex = 0;
      answers = [];
      explanation();
    }));
    if (next?.format === 'colors') controls.append(link('Следующий урок →', lessonUrl(course, module, next), true));
    panel.append(controls);
    display(heading, panel);
  }

  explanation(false);
}
