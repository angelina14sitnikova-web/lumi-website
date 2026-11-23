import { piece, chip, colors, lesson, scene, exercise, pick, connect, sortBy, repair } from './sensory-builders.js';

const red = 'red', yellow = 'yellow', blue = 'blue', green = 'green';
const sky = 'sky', pink = 'pink', gray = 'gray', black = 'black', white = 'white';
const four = [red, yellow, blue, green];
const objects = (...entries) => entries.map(([shape, color]) => piece(shape, color));
const bins = (paints, shape = 'basket') => colors(shape, paints);
const byColor = (pieces, targets, extra = {}) => ({ ...sortBy(pieces, targets, 'color'), ...extra });
const showMatch = (text, sample, pieces, focus) => scene('highlight', text, pieces, { sample, focus });
const showSort = (text, pieces, targets, matches) => scene('move', text, pieces, { targets, matches });
const find = (prompt, ...rounds) => exercise(prompt,
  'Посмотри на образец. Нажми на предмет такого же цвета.', ...rounds);
const pair = (prompt, ...rounds) => exercise(prompt,
  'Нажми на предмет, затем на пару такого же цвета.', ...rounds);
const sort = (prompt, round) => exercise(prompt,
  'Нажми на игрушку, потом на место с кружком такого же цвета.', round);
const odd = (prompt, shape, paints, wrong, paint) => exercise(prompt,
  'Сравни игрушки с меткой. Нажми на игрушку другого цвета.',
  pick(colors(shape, paints), wrong, chip(paint), { setting: 'odd' }));

export const colorWorldLessons = {
  'color-world-1': lesson('fair', [
    showMatch('Красный шарик и красная машинка одного цвета.', piece('balloon', red), colors('car', [blue, red]), 1),
    showMatch('Жёлтая звезда подсказывает, какой подарок выбрать.', piece('star', yellow), colors('gift', [yellow, red, green]), 0),
    showMatch('Смотри только на цвет карточки. Вот синяя лодочка.', chip(blue), objects(['car', green], ['boat', blue], ['block', red]), 1),
  ], [
    find('Найди красный шарик', pick(colors('balloon', [blue, red, yellow]), 1, chip(red))),
    find('Найди жёлтую машинку', pick(colors('car', four), 1, chip(yellow))),
    exercise('Выбери все синие кубики', 'Нажми на каждый кубик цвета образца.',
      pick(colors('block', [green, blue, red, blue, blue, yellow]), [1,3,4], chip(blue))),
    find('Найди зелёный предмет на полке', pick(objects(['boat', blue], ['car', red], ['ball', green], ['ball', yellow]), 2, chip(green), { setting: 'shelves' })),
    find('Найди цвета по очереди',
      pick(colors('gift', [yellow, red, blue]), 1, chip(red)),
      pick(colors('flower', [blue, yellow, green]), 2, chip(green)),
      pick(colors('ball', [blue, red, yellow]), 0, chip(blue))),
  ]),
  'color-world-2': lesson('fair', [
    scene('together', 'Яблоко и мяч разные. Оба красные.', objects(['apple', red], ['ball', red])),
    scene('together', 'Жёлтый цветок и жёлтая машинка тоже одного цвета.', objects(['flower', yellow], ['car', yellow])),
    showSort('Синий кубик и синюю лодочку можно соединить в пару.', colors('block', [blue]), colors('boat', [blue]), [0]),
  ], [
    find('Подбери машинку к красному мячу', pick(colors('car', [blue, red, yellow]), 1, piece('ball', red))),
    find('Найди предмет цвета жёлтого цветка', pick(objects(['star', yellow], ['apple', red], ['flower', green]), 0, piece('flower', yellow))),
    pair('Соедини синий кубик и синюю лодочку', byColor(colors('block', [blue]), colors('boat', [red, blue, yellow]))),
    exercise('Собери три разных зелёных предмета', 'Нажми на каждый предмет цвета кружка.',
      pick(objects(['ball', green], ['ball', red], ['boat', green], ['gift', yellow], ['leaf', green], ['leaf', blue]), [0,2,4], chip(green))),
    pair('Собери три пары одного цвета', byColor(objects(['car', red], ['ball', yellow], ['block', blue]), objects(['star', yellow], ['boat', blue], ['apple', red]))),
  ]),
  'color-world-3': lesson('fair', [
    scene('together', 'Форма шариков одинаковая. Цвета разные.', colors('balloon', [green, blue, red])),
    scene('paint', 'Одинаковые машинки становятся синей, жёлтой и красной.', colors('car', [blue, yellow, red])),
    scene('together', 'Кубики одной формы. Смотри, как отличаются их цвета.', colors('block', [blue, yellow, green])),
  ], [
    find('Найди красный шарик', pick(colors('balloon', [red, yellow, blue]), 0, chip(red))),
    find('Выбери синюю машинку', pick(colors('car', [green, yellow, red, blue]), 3, chip(blue))),
    find('Найди жёлтый кубик', pick(colors('block', [green, yellow, red, blue]), 1, chip(yellow))),
    find('Выбери зелёный цветок', pick(colors('flower', [yellow, red, blue, green]), 3, chip(green))),
    sort('Разложи одинаковые игрушки по цвету', byColor(colors('car', [red, yellow, blue, red, blue, yellow]), bins([blue, yellow, red]))),
  ]),
  'color-world-4': lesson('gate', [
    showMatch('Красная карточка помогает найти красную машинку.', chip(red), colors('car', [yellow, red, blue]), 1),
    showMatch('Голубая карточка подходит к голубому шарику.', chip(sky), colors('balloon', [sky, blue, pink]), 0),
    showMatch('Карточка и цветок разной формы. Важно, что оба жёлтые.', chip(yellow), objects(['car', blue], ['flower', yellow], ['balloon', green]), 1),
  ], [
    find('Подбери шарик к красной карточке', pick(colors('balloon', [green, red]), 1, chip(red))),
    find('Подбери цветок к жёлтой карточке', pick(colors('flower', [yellow, red, blue]), 0, chip(yellow))),
    find('Выбери игрушку под синий образец', pick(objects(['car', sky], ['gift', red], ['boat', blue], ['ball', yellow]), 2, chip(blue))),
    pair('Подбери предметы к четырём карточкам', byColor(objects(['car', red], ['star', yellow], ['boat', blue], ['leaf', green]), four.slice().reverse().map(chip))),
    pair('Собери набор по трём образцам', byColor(objects(['ball', sky], ['flower', pink], ['pebble', gray], ['boat', sky], ['car', pink], ['gift', gray]), [pink, gray, sky].map(chip))),
  ]),
  'color-world-5': lesson('gate', [
    showSort('Три красные игрушки идут в корзину с красной меткой.', objects(['ball', red], ['block', red], ['car', red]), bins([red]), [0,0,0]),
    scene('mistake', 'В красной корзине оказалась синяя лодочка. Она другого цвета.',
      objects(['ball', red], ['car', red], ['boat', blue]), { targets: bins([red]), matches: [0,0,0], focus: 2 }),
    scene('repair', 'Луми перекладывает синюю лодочку в корзину с синей меткой.',
      objects(['ball', red], ['car', red], ['boat', blue]), { targets: bins([red, blue]), starts: [0,0,0], matches: [0,0,1] }),
  ], [
    odd('Найди игрушку другого цвета в красной корзине', 'car', [red, blue, red], 1, red),
    odd('Найди ошибку среди жёлтых игрушек', 'ball', [green, yellow, yellow, yellow], 0, yellow),
    odd('Найди лишний предмет в синей группе', 'boat', [blue, blue, blue, red], 3, blue),
    exercise('Исправь ошибку в двух корзинах', 'Нажми на игрушку другого цвета. Переложи её к подходящей метке.',
      repair(objects(['car', red], ['boat', blue], ['block', red], ['ball', blue]), bins([red, blue]), [0,0,0,1])),
    exercise('Исправь две ошибки в трёх корзинах', 'Сверь игрушки с метками. Переложи те, что оказались не на своём месте.',
      repair(objects(['car', red], ['ball', yellow], ['star', yellow], ['block', blue], ['boat', red]), bins([red, yellow, blue]), [0,0,1,2,2])),
  ]),
  'color-world-6': lesson('fair', [
    showSort('Красный мяч подходит к красному кубику.', colors('ball', [red]), colors('block', [red]), [0]),
    showSort('Жёлтый цветок соединяем с жёлтой звездой, синий кубик — с синей лодочкой.',
      objects(['flower', yellow], ['block', blue]), objects(['boat', blue], ['star', yellow]), [1,0]),
    showSort('Луми собирает пары по очереди и каждый раз сверяет цвет.',
      colors('mitten', [red, green, blue]), colors('hat', [green, blue, red]), [2,0,1]),
  ], [
    pair('Соедини два красных предмета', byColor(colors('ball', [red]), colors('block', [blue, red]))),
    pair('Составь жёлтую и синюю пары', byColor(colors('star', [yellow, blue]), colors('gift', [blue, yellow]))),
    pair('Подбери варежки к шапочкам', byColor(colors('mitten', [pink, green, sky]), colors('hat', [sky, pink, green]))),
    pair('Подбери коробки для четырёх игрушек', byColor(objects(['car', red], ['boat', blue], ['ball', yellow], ['block', green]), bins([blue, yellow, green, red], 'box'))),
    pair('Собери четыре пары одинакового цвета', byColor(objects(['boat', blue], ['apple', red], ['flower', pink], ['ball', green]), objects(['gift', pink], ['star', green], ['car', red], ['block', blue]))),
  ]),
  'color-world-7': lesson('gate', [
    scene('gates', 'Луми открывает радужные ворота. Рядом видны знакомые цветовые образцы.', [red, yellow, blue, green, pink, sky, white, gray, black].map(chip)),
    showMatch('Посмотри на карточку. Подходящая игрушка такого же цвета.', chip(pink), colors('gift', [red, pink, sky]), 1),
    showSort('Разные игрушки могут попасть в одну корзину, если цвет совпадает.',
      objects(['car', yellow], ['star', yellow], ['boat', blue], ['leaf', green]), bins([green, yellow, blue]), [1,1,2,0]),
  ], [
    find('Найди красный, жёлтый, синий и зелёный предметы', ...four.map((paint, i) => {
      const order = [four[(i + 1) % 4], paint, four[(i + 2) % 4], four[(i + 3) % 4]];
      const shift = [0, 2, 3, 1][i];
      const paints = [...order.slice(shift), ...order.slice(0, shift)];
      return pick(colors(['ball','car','boat','gift'][i], paints), paints.indexOf(paint), chip(paint));
    })),
    pair('Подбери три игрушки к карточкам', byColor(objects(['car', black], ['paper', white], ['pebble', gray]), [white, gray, black].map(chip))),
    odd('Найди ошибку в цветной группе', 'ball', [sky, sky, blue, sky], 2, sky),
    pair('Собери три пары одинакового цвета', byColor(objects(['ball', green], ['car', yellow], ['gift', pink]), objects(['flower', pink], ['star', yellow], ['leaf', green]))),
    sort('Разложи игрушки по цветным прилавкам', byColor(objects(['gift', red], ['star', yellow], ['boat', blue], ['leaf', green], ['hat', pink], ['balloon', sky]), bins([pink, blue, green, red, sky, yellow], 'stall'))),
  ]),
};
