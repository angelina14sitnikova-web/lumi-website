import { piece, sizes, sizeMark, lesson, scene, exercise, pick, connect, sortBy } from './sensory-builders.js';

const small = 'small', middle = 'middle', large = 'large';
const pink = 'pink', blue = 'blue', yellow = 'yellow', green = 'green';
const pairSizes = (shape, color, reverse = false) => sizes(shape, color, reverse ? [large, small] : [small, large]);
const objects = (...entries) => entries.map(entry => piece(...entry));
const bySize = (items, targets) => sortBy(items, targets, 'size');
const choose = (prompt, guide, ...rounds) => exercise(prompt, guide, ...rounds);
const largest = (shape, color, reverse = false) => pick(pairSizes(shape, color, reverse), reverse ? 0 : 1, sizeMark(large));
const smallest = (shape, color, reverse = false) => pick(pairSizes(shape, color, reverse), reverse ? 1 : 0, sizeMark(small));
const join = (prompt, ...rounds) => exercise(prompt,
  'Нажми на предмет сверху, затем на подходящий предмет снизу.', ...rounds);
const arrange = (prompt, round) => exercise(prompt,
  'Нажми на игрушку, затем на место с подходящим размером.', round);
const demoSort = (text, pieces, targets, matches) => scene('move', text, pieces, { targets, matches });
const showSize = (text, pieces, focus) => scene('highlight', text, pieces, { focus });
const flat = (shape, scales, color = blue) => sizes(shape, color, scales);
const overlap = (prompt, pieces, targets, overlayAnswers, result) =>
  exercise(prompt, 'Нажми на фигуру сверху, затем на фигуру снизу. Посмотри, как совпадут края.',
    { ...connect(pieces, targets, overlayAnswers), overlay: true, result });

export const sizeLessons = {
  'sizes-1': lesson('workshop', [
    showSize('Вот маленький медведь, а рядом большой. Форма у них одинаковая.', pairSizes('bear', yellow), 1),
    scene('together', 'Эти мячи одинаковые по цвету и форме, но один больше, а другой меньше.', pairSizes('ball', blue, true)),
    demoSort('Большой мяч идёт в большую коробку, маленький — в маленькую.',
      pairSizes('ball', blue), pairSizes('box', yellow, true), [1,0]),
  ], [
    choose('Выбери большого медведя', 'Посмотри на двух медведей. Нажми на большего.', largest('bear', yellow)),
    choose('Выбери маленький мяч', 'Посмотри на два мяча. Нажми на меньший.', smallest('ball', pink, true)),
    choose('Найди большую машинку', 'Сравни машинки и нажми на большую.', largest('car', blue, true)),
    arrange('Подбери коробки для игрушек', bySize(pairSizes('bear', yellow), pairSizes('box', green, true))),
    arrange('Разложи четыре игрушки по размеру', bySize(
      objects(['car', blue, small], ['car', blue, large], ['ball', pink, large], ['ball', pink, small]), pairSizes('basket', yellow))),
  ]),
  'sizes-2': lesson('workshop', [
    scene('together', 'Два домика одной формы и одного цвета. Посмотри, сколько места занимает каждый.', pairSizes('house', yellow)),
    showSize('Рамка выделяет домик, который больше.', pairSizes('house', yellow), 1),
    scene('swap', 'Домики поменялись местами. Больший домик теперь слева.', pairSizes('house', yellow), { focus: 1 }),
  ], [
    choose('Найди больший из двух мячей', 'Нажми на мяч, который больше другого.', largest('ball', green, true)),
    choose('Выбери большую из двух машинок', 'Нажми на машинку, которая занимает больше места.', largest('car', pink)),
    choose('Найди больший домик', 'Сравни домики. Нажми на больший.', largest('house', yellow, true)),
    choose('Выбери больший цветок', 'Сравни два цветка одного цвета.', largest('flower', pink)),
    choose('Выбери больший предмет в каждой паре', 'В каждой новой паре нажми на предмет побольше.',
      largest('bear', yellow), largest('mug', blue, true), largest('gift', pink)),
  ]),
  'sizes-3': lesson('workshop', [
    scene('together', 'Обе чашки одинакового цвета. Одна меньше, другая больше.', pairSizes('mug', blue)),
    showSize('Посмотри на рамку. Она выделяет маленькую чашку.', pairSizes('mug', blue), 0),
    showSize('Теперь чашек три. Найдём самую маленькую среди всех.', sizes('mug', blue, [middle, large, small]), 2),
  ], [
    choose('Выбери меньший из двух кубиков', 'Сравни два кубика и нажми на меньший.', smallest('block', blue)),
    choose('Найди маленькую машинку', 'Нажми на меньшую из двух машинок.', smallest('car', green, true)),
    choose('Выбери самый маленький мяч', 'Посмотри на все мячи, затем нажми на самый маленький.',
      pick(sizes('ball', pink, [middle, small, large]), 1, sizeMark(small))),
    choose('Найди маленького медведя среди трёх', 'Сравни всех медведей. Нажми на самого маленького.',
      pick(sizes('bear', yellow, [large, middle, small]), 2, sizeMark(small))),
    choose('Собери маленькую игрушку из каждой пары', 'В каждой паре нажми на меньшую игрушку.',
      smallest('gift', pink, true), smallest('mug', green), smallest('car', blue, true)),
  ]),
  'sizes-4': lesson('bench', [
    scene('together', 'Эти кубики занимают одинаковое место. Они одинаковые по размеру.', sizes('block', blue, [small, small])),
    scene('together', 'Появился третий кубик. Он больше, а первые два по-прежнему равны.', sizes('block', blue, [small, small, large])),
    demoSort('Луми соединяет два кубика одинакового размера.', sizes('block', blue, [small]), sizes('block', blue, [large, small]), [1]),
  ], [
    choose('Найди два мяча одинакового размера', 'Нажми на оба мяча одинаковой величины.',
      pick(sizes('ball', pink, [small, large, small]), [0,2])),
    choose('Найди домик размера образца', 'Сравни домики с образцом наверху.',
      pick(sizes('house', yellow, [large, middle, small]), 1, piece('house', yellow, middle))),
    join('Соедини машинки одинаковой величины', bySize(sizes('car', blue, [large]), sizes('car', blue, [small, large]))),
    choose('Найди пару среди четырёх предметов', 'Нажми на две чашки одинакового размера.',
      pick(sizes('mug', green, [middle, small, large, middle]), [0,3])),
    join('Собери три пары одинакового размера', bySize(
      sizes('block', blue, [small, large, middle]), sizes('block', blue, [middle, small, large]))),
  ]),
  'sizes-5': lesson('bench', [
    scene('overlay', 'Луми переносит маленький круг прямо на середину большого.', flat('circle', [small]), { targets: flat('circle', [large]), matches: [0] }),
    scene('overlay', 'Маленький круг целиком внутри. Вокруг виден край большого.', flat('circle', [middle]), { targets: flat('circle', [large]), matches: [0] }),
    scene('overlay', 'У двух одинаковых кругов края полностью совпали.', flat('circle', [middle]), { targets: flat('circle', [middle]), matches: [0] }),
  ], [
    overlap('Наложи маленький круг на большой', flat('circle', [small]), flat('circle', [large]), [0], 'Маленький круг внутри. Край большого виден.'),
    choose('Выбери круг больше образца', 'Сравни круги с образцом. Нажми на больший.', pick(flat('circle', [large, small, middle]), 0, piece('circle', blue, middle))),
    overlap('Совмести два одинаковых квадрата', flat('square', [middle]), flat('square', [large, middle]), [1], 'Края квадратов совпали.'),
    overlap('Проверь размер тарелок наложением', flat('plate', [small]), flat('plate', [large]), [0], 'Маленькая тарелка помещается внутри большой.'),
    choose('Найди две фигуры одинаковой величины', 'Нажми на две фигуры одинакового размера.',
      pick(flat('square', [large, middle, large, small]), [0,2], null, { compareFound: true })),
  ]),
  'sizes-6': lesson('bench', [
    scene('together', 'Луми ставит рядом большую и маленькую коробки.', pairSizes('box', yellow, true)),
    demoSort('Большой мяч подходит к большой коробке.', sizes('ball', pink, [large]), pairSizes('box', yellow), [1]),
    demoSort('Маленькая машинка подходит к маленькой коробке.', sizes('car', blue, [small]), pairSizes('box', yellow, true), [1]),
  ], [
    arrange('Подбери коробку для большого мяча', bySize(sizes('ball', pink, [large]), pairSizes('box', yellow, true))),
    arrange('Подбери кроватку для маленькой куклы', bySize(sizes('doll', pink, [small]), pairSizes('bed', blue))),
    arrange('Найди домик для большого медведя', bySize(sizes('bear', yellow, [large]), pairSizes('house', green))),
    arrange('Размести три предмета по размеру', bySize(
      objects(['doll', pink, middle], ['ball', blue, small], ['bear', yellow, large]), sizes('box', green, [large, middle, small]))),
    arrange('Подбери коробки для игрушек', bySize(
      objects(['ball', green, large], ['car', pink, small], ['car', pink, large], ['ball', green, small]), pairSizes('box', blue))),
  ]),
  'sizes-7': lesson('workshop', [
    scene('together', 'Здесь место для маленьких и место для больших игрушек.', pairSizes('basket', yellow)),
    demoSort('Большую машинку кладём к большим, маленькую — к маленьким.', pairSizes('car', blue, true), pairSizes('basket', yellow), [1,0]),
    scene('paint', 'Цвета мячей изменились. Большой мяч остался большим, маленький — маленьким.',
      objects(['ball', pink, large], ['ball', green, small]), { before: ['green', 'pink'] }),
  ], [
    arrange('Разложи большие и маленькие мячи', bySize(
      objects(['ball', pink, small], ['ball', blue, large], ['ball', pink, large], ['ball', blue, small]), pairSizes('basket', yellow, true))),
    arrange('Рассортируй машинки по размеру', bySize(
      objects(['car', blue, large], ['car', green, small], ['car', blue, small], ['car', green, large]), pairSizes('basket', yellow))),
    choose('Найди ошибку в группе больших предметов', 'Нажми на предмет, который меньше остальных.',
      pick(sizes('bear', yellow, [large, large, small, large]), 2, sizeMark(large), { setting: 'odd' })),
    join('Соедини большой предмет с маленьким такой же формы', connect(
      objects(['car', blue, large], ['block', blue, large], ['ball', blue, large]),
      objects(['ball', blue, small], ['car', blue, small], ['block', blue, small]), [1,2,0])),
    arrange('Рассортируй игрушки и подбери коробки', bySize(
      objects(['mug', blue, large], ['ball', pink, small], ['bear', yellow, large], ['mug', blue, small],
        ['bear', yellow, small], ['ball', pink, large]), pairSizes('box', green, true))),
  ]),
};
