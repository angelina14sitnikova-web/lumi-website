import { checkAnswer, lessonUrl, moduleStars, programUrl, saveCompletion } from '../course-model.js';
import { courseCompleted, celebrationUrl } from './celebration.js';
import { palette } from './colors-model.js';
import { sensoryArt, sensoryName } from './sensory-art.js';

function node(tag, css, text) {
  const el = document.createElement(tag);
  if (css) el.className = css;
  if (text) el.textContent = text;
  return el;
}
function button(text, click, primary = false) {
  const el = node('button', primary ? 'academy-button lesson-primary' : 'lesson-secondary', text);
  el.type = 'button';
  el.addEventListener('click', click);
  return el;
}
function link(text, href, primary = false) {
  const el = node('a', primary ? 'academy-button' : 'academy-return', text);
  el.href = href;
  return el;
}
function dots(index, total, name) {
  const el = node('div', 'color-steps');
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', name + ' ' + (index + 1) + ' из ' + total);
  for (let i = 0; i < total; i += 1) {
    const dot = node('span');
    dot.dataset.state = i < index ? 'done' : i === index ? 'current' : 'next';
    el.append(dot);
  }
  return el;
}
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
function animate(el, frames, options) {
  if (!reduced()) el.animate(frames, { fill: 'both', ...options });
}
function picture(piece) {
  const frame = node('span', 'sensory-picture');
  frame.dataset.size = piece.size || 'default';
  frame.dataset.shape = piece.shape;
  if (piece.axis) {
    frame.dataset.axis = piece.axis;
    frame.style.setProperty('--extent', [.44, .71, 1][piece.value - 1]);
  }
  if (piece.turn) frame.style.setProperty('--turn', piece.turn + 'deg');
  if (piece.count !== undefined) {
    frame.classList.add('quantity-picture');
    const strip = (count, connected = 0, shape = piece.shape) => {
      const row = node('span', 'quantity-items');
      for (let i = 0; i < count; i += 1) {
        const item = node('span', i < connected ? 'quantity-paired' : '');
        item.append(sensoryArt({...piece, shape}));
        row.append(item);
      }
      frame.append(row);
    };
    strip(piece.count, Math.min(piece.count, piece.other || 0));
    if (piece.other) strip(piece.other, 0, piece.otherShape);
  } else frame.append(sensoryArt(piece));
  return frame;
}
function pairDisplay(left, right) {
  const pairs = node('div', 'quantity-pairs');
  pairs.setAttribute('aria-label', 'Два ряда предметов. Предметы друг напротив друга образуют пару.');
  for (let i = 0; i < Math.max(left.count, right.count); i += 1) {
    const column = node('span', 'quantity-column');
    column.append(i < left.count ? picture({...left, count: undefined}) : node('span', 'quantity-empty'));
    const connector = node('span', 'quantity-connector');
    if (i < Math.min(left.count, right.count)) connector.classList.add('quantity-linked');
    column.append(connector, i < right.count ? picture({...right, count: undefined}) : node('span', 'quantity-empty'));
    animate(column, [{opacity: .25, transform: 'translateY(-8px)'}, {opacity: 1, transform: 'none'}],
      {duration: 450, delay: 200 + i * 180});
    pairs.append(column);
  }
  return pairs;
}

function balanceAfter(groups, action) {
  return [groups[0], {...groups[1], count: groups[1].count + (action === 'add' ? 1 : -1)}];
}

function spatialPanel(place, pieces) {
  const map = node('div', 'lesson-map');
  map.dataset.kind = place.kind;
  const anchor = picture(place.anchor);
  anchor.classList.add('lesson-anchor');
  anchor.setAttribute('role', 'img');
  anchor.setAttribute('aria-label', sensoryName(place.anchor));
  const position = (el, point) => {
    el.style.left = point.x + '%';
    el.style.top = point.y + '%';
  };
  position(anchor, place.anchor);
  map.append(anchor);
  if (place.direction) {
    const arrow = node('span','lesson-map-arrow','➜');
    arrow.setAttribute('aria-label', 'Направление вперёд — вправо');
    map.append(arrow);
  }
  pieces.forEach((element, i) => {
    position(element, place.items[i]);
    map.append(element);
  });
  return map;
}

function sample(piece) {
  const el = node('div', 'sensory-sample');
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', 'Образец · ' + sensoryName(piece));
  el.append(picture(piece), node('span', '', 'Образец'));
  return el;
}
function board(room, demo = false) {
  const el = node('div', 'color-board sensory-board' + (demo ? ' sensory-demo' : ''));
  const bg = node('img', 'color-room');
  bg.src = 'assets/sensory/' + room + '.webp';
  bg.alt = '';
  el.append(bg);
  if (demo) {
    const lumi = node('img', 'color-lumi');
    lumi.src = '../enchanted-library/assets/lumi-reading.png';
    lumi.alt = '';
    el.append(lumi);
  }
  return el;
}
function mark(piece) {
  const label = node('span', 'sensory-mark');
  label.style.setProperty('--sample', palette[piece.color].paint);
  return label;
}
function layout(row, pieces) {
  if (pieces.every(piece => piece.axis === 'length')) row.dataset.measure = 'length';
  if (pieces.every(piece => piece.axis === 'height')) row.dataset.measure = 'height';
  if (pieces.every(piece => piece.axis === 'width')) row.dataset.measure = 'width';
}
function slot(piece, interactive) {
  const el = node(interactive ? 'button' : 'div', 'sensory-target');
  if (interactive) {
    el.type = 'button';
    el.setAttribute('aria-label', sensoryName(piece));
  }
  const visual = node('span', 'sensory-slot-figure');
  visual.append(picture(piece));
  if (['box', 'basket', 'stall'].includes(piece.shape) && !piece.size) visual.append(mark(piece));
  el.append(visual, node('span', 'sensory-contents'));
  return el;
}

function travel(piece, source, target, delay = 0, overlay = false) {
  const before = source.querySelector('.sensory-picture').getBoundingClientRect();
  const destination = target.querySelector(overlay ? '.sensory-slot-figure' : '.sensory-contents');
  const moving = picture(piece);
  if (overlay || target.closest('.sensory-assembly')) {
    moving.classList.add('sensory-overlay');
    const top = moving.querySelector('svg');
    if (!target.closest('[data-effect="drive"], .sensory-assembly')) {
      top.style.stroke = '#fffdf4';
      top.style.strokeDasharray = '5 2';
    }
  }
  destination.append(moving);
  source.classList.add('sensory-moved');
  const after = moving.getBoundingClientRect();
  const dx = before.left + before.width / 2 - after.left - after.width / 2;
  const dy = before.top + before.height / 2 - after.top - after.height / 2;
  const ratio = before.width / Math.max(1, after.width);
  animate(moving, [
    { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + ratio + ')' },
    { transform: 'translate(' + dx * .5 + 'px,' + (dy * .45 - 18) + 'px) scale(' + Math.max(1, ratio * .7) + ')', offset: .55 },
    { transform: 'none' },
  ], { duration: 580, delay, easing: 'ease-in-out' });
  if (target.closest('[data-effect="drive"]')) {
    animate(moving.firstChild, [{ translate: '-22px 0' }, { translate: '22px 0' }, { translate: '0 0' }],
      { duration: 1000, delay: delay + 580, easing: 'ease-in-out' });
  }
  if (delay && !reduced()) {
    source.classList.remove('sensory-moved');
    source.querySelector('.sensory-picture').animate([
      { visibility: 'visible' }, { visibility: 'hidden', offset: .02 }, { visibility: 'hidden' },
    ], { duration: 580, delay, fill: 'forwards' });
    moving.animate([{ visibility: 'hidden' }, { visibility: 'visible', offset: .01 }, { visibility: 'visible' }],
      { duration: 580, delay, fill: 'both' });
  }
}

function illustrate(room, scene) {
  const stage = board(room, true);
  stage.dataset.effect = scene.effect;
  stage.setAttribute('role', 'img');
  stage.setAttribute('aria-label', scene.text);
  const pieces = node('div', 'sensory-row');
  layout(pieces, scene.pieces);
  const props = scene.pieces.map(piece => {
    const el = node('div', 'sensory-card');
    el.append(picture(piece));
    pieces.append(el);
    return el;
  });
  if (scene.sample) stage.append(sample(scene.sample));
  stage.append(pieces);

  if (scene.effect === 'locate') {
    const cards = scene.place.items.map((piece, index) => {
      const el = node('div', 'sensory-card');
      if (index === scene.place.focus) el.classList.add('sensory-emphasis');
      el.append(picture(piece));
      animate(el, [{opacity: 0, transform: 'translateY(18px)'}, {opacity: 1, transform: 'none'}],
        {duration: 550, delay: index * 250});
      return el;
    });
    pieces.replaceWith(spatialPanel(scene.place,cards));
  } else if (scene.effect === 'balance') {
    const before = pairDisplay(...scene.pieces);
    const after = pairDisplay(...balanceAfter(scene.pieces,scene.action));
    const comparison = node('div','balance-demo');
    comparison.append(before,picture({shape: scene.action==='add'?'addOne':'takeOne',color:'sky'}),after);
    animate(after,[{opacity:.15,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:600,delay:900});
    pieces.replaceWith(comparison);
  } else if (scene.effect === 'correspond') {
    pieces.replaceWith(pairDisplay(...scene.pieces));
  } else if (['spin', 'roll', 'face'].includes(scene.effect)) {
    const prop = props[0].firstChild;
    if (scene.pieces[0].shape === 'cube') {
      const cube = node('span', 'world-cube');
      for (let i = 0; i < 6; i += 1) cube.append(node('span', 'world-face'));
      if (scene.effect === 'face') cube.classList.add('world-face-focus');
      prop.replaceChildren(cube);
      animate(cube, [{ transform: 'rotateX(-22deg) rotateY(24deg)' },
        { transform: 'rotateX(-22deg) rotateY(384deg)' }], { duration: 2600 });
    } else {
      const art = prop.firstChild;
      animate(art, [{ rotate: '0deg' }, { rotate: '360deg' }], {duration: 2200, easing: 'ease-in-out'});
      if (scene.effect === 'roll') {
        const road = node('span', 'world-road');
        props[0].append(road);
        animate(prop, [{translate: '-75% 0'}, {translate: '75% 0'}], {duration: 2200, easing: 'ease-in-out'});
      }
    }
  } else if (scene.targets) {
    const row = node('div', 'sensory-row sensory-targets');
    if (scene.effect === 'assemble') row.classList.add('sensory-assembly');
    const targets = scene.targets.map(piece => slot(piece, false));
    row.append(...targets);
    stage.append(row);
    if (scene.starts) {
      pieces.hidden = true;
      props.forEach((prop, index) => targets[scene.starts[index]].querySelector('.sensory-contents').append(prop));
    }
    requestAnimationFrame(() => {
      if (!stage.isConnected) return;
      scene.matches.forEach((to, from) => {
        if (scene.starts?.[from] === to) return;
        travel(scene.pieces[from], props[from], targets[to], 370 + from * 570, scene.effect === 'overlay' || scene.effect === 'drive');
      });
      if (scene.effect === 'mistake') {
        const wrong = targets[0].querySelector('.sensory-contents').lastChild;
        wrong.classList.add('sensory-wrong');
        animate(wrong, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 2090 });
      }
    });
  } else if (scene.effect === 'trace') {
    const svg = props[0].querySelector('svg');
    const shape = svg.querySelector('g').firstElementChild;
    const trace = shape.cloneNode();
    trace.setAttribute('fill', 'none');
    trace.setAttribute('stroke', '#45275f');
    trace.setAttribute('stroke-width', '5');
    trace.setAttribute('pathLength', '100');
    trace.setAttribute('stroke-dasharray', '100');
    svg.append(trace);
    animate(trace, [{ strokeDashoffset: 100 }, { strokeDashoffset: 0 }], { duration: 1400, delay: 200 });
  } else if (scene.effect === 'align') {
    props.forEach((prop, index) => animate(prop.firstChild, [
      { transform: scene.pieces[0].axis === 'height' ? 'translateY(' + (index * -14) + 'px)' : 'translateX(' + (index * 18) + 'px)' },
      { transform: 'none' },
    ], { duration: 820, delay: 240, easing: 'ease-in-out' }));
    if (scene.focus !== undefined) {
      const focus = props[scene.focus];
      focus.classList.add('sensory-emphasis');
      animate(focus, [{ outlineColor: 'transparent' }, { outlineColor: '#795499' }], { duration: 420, delay: 1040 });
    }
  } else if (scene.effect === 'paint') {
    props.forEach((prop, index) => {
      const previous = picture({ ...scene.pieces[index], color: scene.before?.[index] || 'white' });
      previous.classList.add('sensory-paint-base');
      prop.prepend(previous);
      if (reduced()) previous.remove();
      animate(prop.lastChild, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }],
        { duration: 780, delay: 300 + index * 320 });
    });
  } else if (scene.effect === 'swap') {
    const first = props[0], second = props[1];
    pieces.prepend(second);
    requestAnimationFrame(() => {
      const distance = first.offsetLeft - second.offsetLeft;
      props.forEach((prop, index) => animate(prop, [
        { transform: 'translateX(' + (index === 0 ? -distance : distance) + 'px)' }, { transform: 'none' },
      ], { duration: 900, delay: 380, easing: 'ease-in-out' }));
    });
    second.classList.add('sensory-emphasis');
  } else {
    props.forEach((prop, index) => animate(prop, [
      { opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' },
    ], { duration: 360, delay: index * 165, easing: 'ease-out' }));
    if (scene.focus !== undefined) {
      const focus = props[scene.focus];
      focus.classList.add('sensory-emphasis');
      animate(focus, [{ outlineColor: 'transparent' }, { outlineColor: '#795499' }], { delay: 610, duration: 400 });
    }
    if (scene.effect === 'gates') {
      const doors = node('div', 'sensory-doors');
      doors.setAttribute('aria-hidden', 'true');
      for (const end of [-1, 1]) {
        const door = node('span');
        doors.append(door);
        animate(door, [{ transform: 'none' }, { transform: 'translateX(' + end * 105 + '%)' }], { duration: 850, delay: 440 });
      }
      if (!reduced()) stage.append(doors);
    }
  }
  return stage;
}

export function mountSensory(content, course, module, lesson) {
  const moduleUrl = programUrl(course, module);
  let sceneIndex = 0;
  let exerciseIndex = 0;
  let roundIndex = 0;
  let answers = [];
  const transferred = new Map();

  function display(panel, heading, focus = true) {
    content.replaceChildren(panel);
    if (!focus) return;
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    const bounds = heading.getBoundingClientRect();
    if (bounds.top < 0 || bounds.bottom > innerHeight) heading.scrollIntoView({ block: 'start' });
  }

  function explain(focus = true) {
    const scene = lesson.scenes[sceneIndex];
    const panel = node('section', 'sensory-lesson');
    const heading = node('h2', 'lesson-part', 'Объяснение Луми');
    let stage = illustrate(lesson.room, scene);
    const nav = node('div', 'lesson-controls');
    const back = button('← Назад', () => { sceneIndex -= 1; explain(); });
    back.disabled = sceneIndex === 0;
    nav.append(back, button('↻ Повторить сцену', () => {
      const nextStage = illustrate(lesson.room, scene);
      stage.replaceWith(nextStage);
      stage = nextStage;
    }), sceneIndex + 1 === lesson.scenes.length
      ? button('К практике →', practice, true)
      : button('Дальше →', () => { sceneIndex += 1; explain(); }, true));
    panel.append(heading, dots(sceneIndex, lesson.scenes.length, 'Сцена'), stage, node('p', 'color-words', scene.text));
    if (scene.audio) {
      const audio = node('audio', 'lesson-audio');
      audio.src = scene.audio;
      audio.controls = true;
      audio.preload = 'none';
      audio.setAttribute('aria-label', 'Озвучка сцены');
      panel.append(audio);
    }
    panel.append(nav);
    display(panel, heading, focus);
  }

  function practice() {
    const task = lesson.practice[exerciseIndex];
    const round = task.rounds[roundIndex];
    const response = answers[exerciseIndex] ||= [];
    const steps = response[roundIndex] ||= [];
    const panel = node('section', 'sensory-lesson');
    panel.dataset.exercise = String(exerciseIndex + 1);
    panel.dataset.round = String(roundIndex + 1);
    const heading = node('h2', 'lesson-part', 'Практика');
    const stage = board(lesson.room);
    const row = node('div', 'sensory-row sensory-choices');
    layout(row, round.pieces);
    row.dataset.setting = round.setting || '';
    const axisGuide = { length: 'Сравни по длине.', height: 'Сравни по высоте.', width: 'Сравни по ширине.' };
    const dimension = round.pieces[0].axis;
    const guide = node('p', 'color-guide', round.align ? 'Нажми на стрелку, чтобы начала лент совпали.'
      : dimension ? axisGuide[dimension] + ' ' + task.guide : task.guide);
    guide.id = 'sensory-guide';
    stage.setAttribute('aria-describedby', guide.id);
    const feedback = node('p', 'color-feedback');
    feedback.setAttribute('role', 'status');
    const lastRound = roundIndex + 1 === task.rounds.length;
    const lastExercise = exerciseIndex + 1 === lesson.practice.length;
    const next = button(lastRound && lastExercise ? 'Получить звёздочку ★' : 'Дальше →', () => {
      if (steps.length !== round.answers.length) return;
      if (!lastRound) {
        roundIndex += 1;
        practice();
      } else if (checkAnswer(task, response)) {
        if (lastExercise) reward(saveCompletion(course, module, lesson, answers));
        else {
          exerciseIndex += 1;
          roundIndex = 0;
          practice();
        }
      }
    }, true);
    const nav = node('div', 'lesson-controls');
    nav.append(link('К модулю', moduleUrl), button('К объяснению', () => explain()), next);
    let selected = null, mistakes = 0;
    const buttons = round.pieces.map((piece, index) => {
      const el = node('button', 'color-choice sensory-card');
      el.type = 'button';
      el.dataset.from = String(index);
      el.setAttribute('aria-label', sensoryName(piece));
      el.setAttribute('aria-pressed', 'false');
      el.append(picture(piece));
      el.addEventListener('click', () => choose(index));
      return el;
    });
    const targets = (round.targets || []).map((piece, index) => {
      const el = slot(piece, !round.starts);
      el.dataset.to = String(index);
      if (round.starts) {
        const marker = button('Сюда', () => connect(index));
        marker.classList.add('sensory-place');
        marker.setAttribute('aria-label', 'Переложить сюда · ' + sensoryName(piece));
        el.append(marker);
      } else el.addEventListener('click', () => connect(index));
      return el;
    });
    const roundKey = exerciseIndex + ':' + roundIndex;
    let transferCount = transferred.get(roundKey) || 0;

    if (round.pairCounts) {
      const pairButton = button('↕ Составить пары', () => {

        pairButton.replaceWith(pairDisplay(...round.pieces));
        buttons.forEach(control => { control.disabled = false; });
        buttons[0].focus();
      });
      if (!steps.length) {
        buttons.forEach(control => { control.disabled = true; });
        stage.append(pairButton);
      }
    }
    let distribution;
    function showDistribution(count) {
      const paired = pairDisplay(round.recipient, {...round.pieces[0], count});
      if (distribution) distribution.replaceWith(paired);
      else stage.append(paired);
      distribution = paired;
    }
    if (round.recipient && ['pair-meadow', 'discovery-hall'].includes(lesson.room)) {
      showDistribution(steps.length ? round.repeat : transferCount);
    } else if (round.recipient) stage.append(sample(round.recipient));
    let balancePreview;
    if (round.balance) {
      balancePreview = pairDisplay(...round.balance);
      stage.append(balancePreview);
    }
    const targetRow = node('div', 'sensory-row sensory-targets');
    if (round.assembly) targetRow.classList.add('sensory-assembly');
    targetRow.append(...targets);
    if (round.align) {
      const alignment = button('↤ Совместить начала', () => {
        row.dataset.aligned = 'true';
        buttons.forEach((control, index) => {
          control.disabled = false;
          animate(control.firstChild, [{ transform: 'translateX(' + index * 14 + 'px)' }, { transform: 'none' }],
            { duration: 420, easing: 'ease-out' });
        });
        alignment.hidden = true;
        buttons[0].focus();
      });
      if (!steps.length) {
        buttons.forEach((control, index) => {
          control.disabled = true;
          control.firstChild.style.setProperty('--offset', index * 14 + 'px');
        });
        stage.append(alignment);
      }
    }
    if (round.sample) stage.append(sample(round.sample));
    if (round.cues) {
      const cues = node('div', 'sensory-row');
      cues.setAttribute('aria-label', 'Карточки-признаки');
      round.cues.forEach(item => cues.append(picture(item)));
      stage.append(cues);
    }
    if (round.starts) {
      buttons.forEach((el, index) => targets[round.starts[index]].querySelector('.sensory-contents').append(el));
    } else {
      row.append(...buttons);
      stage.append(round.place && !round.targets ? spatialPanel(round.place,buttons) : row);
    }
    if (targets.length) {
      if (!round.starts) {
        const direction = node('span', 'sensory-direction', '↓');
        direction.setAttribute('aria-hidden', 'true');
        stage.append(direction);
      }
      if (round.sequence) {
        targetRow.classList.add('event-sequence');
        targets.forEach(target => target.querySelector('.sensory-slot-figure').replaceChildren());
      }
      stage.append(round.place ? spatialPanel(round.place,targets) : targetRow);
    }

    function remaining() {
      return round.answers.filter(step => !steps.some(answer => answer.from === step.from));
    }
    function clearHint() {
      panel.querySelectorAll('[data-hint]').forEach(el => delete el.dataset.hint);
    }
    function wrong(el) {
      mistakes += 1;
      clearHint();
      feedback.dataset.state = 'retry';
      feedback.textContent = mistakes < 2 ? 'Попробуй ещё раз.' : 'Подсказка: посмотри на рамку.';
      animate(el, [{ transform: 'none' }, { transform: 'translateX(4px)' },
        { transform: 'translateX(-4px)' }, { transform: 'none' }], { duration: 250 });
      if (mistakes >= 2) {
        const step = remaining().find(answer => answer.from === selected);
        const ordered = round.ordered ? remaining().sort((a, b) => a.to - b.to)[0] : remaining()[0];
        const hint = step ? targets[step.to] : buttons[ordered.from];
        hint.dataset.hint = 'true';
      }
    }
    function choose(index) {
      if (!next.disabled) return;
      if (!remaining().some(step => step.from === index) && (round.starts || !round.targets)) {
        wrong(buttons[index]);
        return;
      }
      if (!round.targets) {
        record({ from: index });
        return;
      }
      if (selected !== null) buttons[selected].setAttribute('aria-pressed', 'false');
      if (round.ordered && remaining().sort((a, b) => a.to - b.to)[0].from !== index) {
        wrong(buttons[index]);
        return;
      }
      selected = index;
      buttons[index].setAttribute('aria-pressed', 'true');
      clearHint();
      feedback.dataset.state = 'info';
      feedback.textContent = 'Теперь выбери подходящее место.';
    }
    function connect(to) {
      if (!next.disabled) return;
      const step = remaining().find(answer => answer.from === selected && answer.to === to);
      if (!step) {
        wrong(targets[to]);
        return;
      }
      if (round.repeat && ++transferCount < round.repeat) {
        transferred.set(roundKey, transferCount);
        if (distribution) showDistribution(transferCount);
        const source = buttons[step.from];
        travel(round.pieces[step.from], source, targets[to]);
        source.classList.remove('sensory-moved');
        source.setAttribute('aria-pressed', 'false');
        clearHint();
        mistakes = 0;
        selected = null;
        feedback.textContent = 'Получилось! Возьми ещё один предмет.';
        source.focus();
        return;
      }
      record(step);
    }
    function showStep({ from, to }) {
      const el = buttons[from];
      el.classList.add('color-found');
      el.setAttribute('aria-pressed', 'true');
      el.disabled = true;
      if (round.targets) {
        travel(round.pieces[from], el, targets[to], 0, round.overlay);
        if (round.starts) el.hidden = true;
      } else {
        animate(el.firstChild, [{ transform: 'none' }, { transform: 'scale(1.08)' }, { transform: 'none' }],
          { duration: 350, easing: 'ease-out' });
      }
    }
    function update(message) {
      const done = remaining().length === 0;
      next.disabled = !done;
      feedback.dataset.state = done ? 'correct' : 'info';
      feedback.textContent = done ? round.result || 'Верно! Можно дальше.' : message;
      if (done && balancePreview) {
        const after = pairDisplay(...balanceAfter(round.balance,round.action));
        balancePreview.replaceWith(after);
        balancePreview = null;
        feedback.textContent = 'Теперь у каждого предмета есть пара.';
      }
      if (done && round.compareFound && !stage.querySelector('.sensory-result')) {
        const comparison = node('div', 'sensory-result sensory-row');
        const base = slot(round.pieces[steps[0].from], false);
        comparison.append(base);
        stage.append(comparison);
        travel(round.pieces[steps[1].from], buttons[steps[1].from], base, 0, true);
      }
    }
    function record(step) {
      const hadFocus = panel.contains(document.activeElement);
      selected = null;
      mistakes = 0;
      clearHint();
      steps.push(step);
      if (distribution) showDistribution(round.repeat);
      showStep(step);
      update('Получилось! Продолжай.');
      if (hadFocus) {
        const nextFocus = next.disabled ? buttons.find(el => !el.disabled && !el.hidden) : next;
        nextFocus?.focus({ preventScroll: true });
      }
    }
    panel.append(heading, dots(exerciseIndex, lesson.practice.length, 'Задание'),
      node('h3', 'color-prompt', round.prompt || task.prompt), guide);
    if (task.rounds.length > 1) panel.append(dots(roundIndex, task.rounds.length, 'Часть задания'));
    panel.append(stage, feedback, nav);
    display(panel, heading);
    if (round.repeat) {
      const destination = targets[0].querySelector('.sensory-contents');
      for (let i = 0; i < (steps.length ? round.repeat - 1 : transferCount); i += 1) destination.append(picture(round.pieces[0]));
    }
    steps.forEach(showStep);
    update('');
  }

  function reward(saved) {
    const panel = node('section', 'sensory-lesson sensory-reward');
    const heading = node('h2', 'lesson-part', 'Урок пройден!');
    const stars = moduleStars(course, module);
    const medal = stars === module.lessons.length;
    const icon = node('span', medal && module.id === 'color-world' ? 'color-medal' : medal ? 'cmp-medal' : 'cmp-reward-star', medal && module.id === 'shape-world' ? '◆' : medal && module.id === 'quantity' ? '✿' : '★');
    if (medal) icon.dataset.medal = module.id;
    icon.setAttribute('aria-hidden', 'true');
    panel.append(icon, heading);
    if (medal) panel.append(node('h3', '', module.reward));
    panel.append(node('p', '', saved ? 'Звёздочки модуля: ' + stars + ' из ' + module.lessons.length : 'Звёздочка получена, но браузер не сохранил прогресс.'));
    const nav = node('div', 'lesson-controls');
    nav.append(link('К модулю', moduleUrl), button('↻ Пройти ещё раз', () => {
      sceneIndex = exerciseIndex = roundIndex = 0;
      answers = [];
      transferred.clear();
      explain();
    }));
    const nextLesson = module.lessons[module.lessons.indexOf(lesson) + 1];
    if (courseCompleted(course)) nav.prepend(link('Праздник открытий ✨', celebrationUrl, true));
    if (nextLesson?.format === 'sensory') nav.append(link('Следующий урок →', lessonUrl(course, module, nextLesson), true));
    panel.append(nav);
    display(panel, heading);
  }

  explain(false);
}
