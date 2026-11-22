const object = (shape, color) => ({ shape, color });
const row = (shape, colors) => colors.map(color => object(shape, color));
const lesson = (room, scenes, practice) => ({ format: 'colors', room, scenes, practice });
const scene = (effect, title, text, pieces, focus, bins) => ({ effect, title, text, pieces, focus, bins });
const paint = (title, text, shape, color) => scene('paint', title, text, [object(shape, color)], color);
const appear = (title, text, pieces) => scene('appear', title, text, pieces);
const compare = (title, text, shape, colors, focus) => scene('compare', title, text, row(shape, colors), focus);
const demonstrate = (title, text, pieces, bins) => scene('sort', title, text, pieces, null, bins);

const exercise = (mode, prompt, guide, pieces, settings) => ({ kind: 'colors', mode, prompt, guide, pieces, ...settings });
const pick = (prompt, shape, colors, color) => exercise('find', prompt,
  'Посмотри на цветной кружок. Нажми на предмет такого же цвета.', row(shape, colors), { color });
const findAll = (prompt, pieces, color, setting) => exercise('find', prompt,
  'Сравни каждый предмет с цветным кружком. Нажми на все предметы такого цвета.', pieces, { color, setting });
const sort = (prompt, pieces, bins, mode = 'sort') => exercise(mode, prompt,
  mode === 'match' ? 'Нажми на игрушку, затем на кружок такого же цвета.'
    : 'Нажми на игрушку, затем на корзину с таким же цветным кружком.',
  pieces, { bins });
const gather = (prompt, pieces, color) => exercise('gather', prompt,
  'Выбери игрушку цвета корзины. Нажми на игрушку, потом на корзину.', pieces, { bins: [color], color });

const red = 'red', yellow = 'yellow', blue = 'blue', green = 'green';
const white = 'white', black = 'black', pink = 'pink', sky = 'sky', gray = 'gray';

export const colorLessons = {
  'colors-1': lesson('red', [
    paint('Красная краска', 'Луми берёт красную краску. Посмотри, как белый шарик становится красным.', 'balloon', red),
    appear('Всё красное', 'Яблоко, машинка и цветок выглядят по-разному. Цвет у них один — красный.',
      [object('apple', red), object('car', red), object('flower', red)]),
    compare('Красный и синий', 'Шарики одинаковой формы. Красный шарик выделен рамкой, рядом синий.',
      'balloon', [red, blue], red),
  ], [
    pick('Выбери красный шарик', 'balloon', [blue, red], red),
    pick('Найди красное яблоко', 'apple', [red, green, yellow], red),
    findAll('Нажми на все красные цветы', row('flower', [yellow, red, blue, red, green, red]), red),
    gather('Положи красные игрушки в красную корзину',
      [object('car', red), object('block', green), object('ball', red), object('car', blue), object('block', red)], red),
    findAll('Найди красные предметы на полках',
      [object('car', yellow), object('apple', red), object('block', blue), object('ball', red), object('boat', green), object('flower', red)], red, 'shelves'),
  ]),
  'colors-2': lesson('yellow', [
    paint('Жёлтое солнышко', 'Луми выбрал жёлтую краску. Солнышко становится жёлтым.', 'sun', yellow),
    appear('Всё жёлтое', 'Лимон, мяч и звёздочка имеют разные формы. Все они жёлтые.',
      [object('lemon', yellow), object('ball', yellow), object('star', yellow)]),
    compare('Жёлтый и красный', 'На столе два одинаковых цветка. Жёлтый выделен рамкой, рядом красный.',
      'flower', [red, yellow], yellow),
  ], [
    pick('Выбери жёлтый шарик', 'balloon', [yellow, red], yellow),
    pick('Найди жёлтый лимон', 'lemon', [green, blue, yellow], yellow),
    findAll('Нажми на все жёлтые звёздочки', row('star', [yellow, red, yellow, blue, yellow, green]), yellow),
    gather('Собери жёлтые игрушки в корзину',
      [object('block', blue), object('boat', yellow), object('ball', yellow), object('car', red), object('block', yellow)], yellow),
    findAll('Найди жёлтые предметы на полках',
      [object('lemon', yellow), object('ball', red), object('car', yellow), object('star', blue), object('block', green), object('flower', yellow)], yellow, 'shelves'),
  ]),
  'colors-3': lesson('blue', [
    paint('Синяя лодочка', 'Луми касается лодочки кисточкой. Лодочка становится синей.', 'boat', blue),
    appear('Всё синее', 'Лодочка, кубик и машинка разной формы, но все синие.',
      [object('boat', blue), object('block', blue), object('car', blue)]),
    compare('Синий среди других цветов', 'Синий шарик выделен рамкой. Красный и жёлтый шарики рядом.',
      'balloon', [red, blue, yellow], blue),
  ], [
    pick('Выбери синий шарик', 'balloon', [yellow, blue], blue),
    pick('Найди синюю машинку', 'car', [blue, red, yellow], blue),
    findAll('Нажми на все синие кубики', row('block', [blue, yellow, red, blue, yellow, blue]), blue),
    sort('Разложи игрушки по трём корзинам',
      [object('block', blue), object('car', red), object('boat', yellow), object('block', red), object('car', blue), object('ball', yellow)], [red, yellow, blue]),
    findAll('Найди все синие предметы на полках',
      [object('boat', blue), object('block', red), object('ball', blue), object('car', blue), object('apple', yellow),
        object('star', blue), object('ball', red), object('block', blue)], blue, 'shelves'),
  ]),
  'colors-4': lesson('green', [
    paint('Зелёный листочек', 'Луми раскрашивает листочек. Теперь он зелёный.', 'leaf', green),
    appear('Всё зелёное', 'Лягушка, кубик и шар отличаются формой. Все они зелёные.',
      [object('frog', green), object('block', green), object('ball', green)]),
    compare('Четыре цвета', 'У всех шариков одинаковая форма. Посмотри, как рамка выделяет зелёный.',
      'balloon', [yellow, blue, green, red], green),
  ], [
    pick('Найди зелёный шарик', 'balloon', [green, blue, yellow], green),
    pick('Выбери зелёный лист', 'leaf', [red, blue, yellow, green], green),
    findAll('Нажми на все зелёные кубики', row('block', [blue, green, green, red, green, yellow]), green),
    sort('Разложи игрушки по четырём корзинам',
      [object('car', blue), object('ball', green), object('block', yellow), object('boat', red),
        object('block', green), object('car', red), object('ball', blue), object('boat', yellow)], [red, yellow, blue, green]),
    findAll('Найди зелёные предметы в саду',
      [object('flower', yellow), object('leaf', green), object('apple', red), object('frog', green), object('flower', blue), object('apple', green)], green, 'garden'),
  ]),
  'colors-5': lesson('contrast', [
    appear('Белый и чёрный', 'Посмотри, как появляются белый лист бумаги и чёрная машинка.',
      [object('paper', white), object('car', black)]),
    compare('Два котёнка', 'У котят одинаковые ушки и лапы. Один котёнок белый, другой чёрный.', 'cat', [white, black]),
    demonstrate('У каждой игрушки своя корзина', 'Белые предметы идут к белому кружку. Чёрные — к чёрному.',
      [object('block', white), object('ball', black), object('car', white), object('star', black)], [white, black]),
  ], [
    pick('Выбери белый шарик', 'balloon', [black, white], white),
    pick('Выбери чёрную машинку', 'car', [white, black, gray], black),
    findAll('Найди все белые фигуры', row('circle', [white, black, white, gray, black, white]), white),
    findAll('Найди все чёрные фигуры', row('triangle', [white, black, gray, black, white, black]), black),
    sort('Разложи белые и чёрные предметы',
      [object('paper', white), object('car', black), object('cat', white), object('block', black), object('ball', white), object('star', black)], [white, black]),
  ]),
  'colors-6': lesson('shades', [
    compare('Розовый и красный', 'Розовый цветок светлее. Красный цветок яркий и насыщенный.', 'flower', [pink, red], pink),
    compare('Голубой и синий', 'Голубой шар светлее синего. Голубой шар выделен рамкой.', 'ball', [blue, sky], sky),
    compare('Серый, белый и чёрный', 'Серый камешек темнее белого и светлее чёрного. Найди его в рамке.',
      'pebble', [white, gray, black], gray),
  ], [
    pick('Найди розовый цветок', 'flower', [red, pink, white], pink),
    pick('Найди голубой шар', 'ball', [sky, blue, green], sky),
    pick('Найди серый камешек', 'pebble', [white, black, gray], gray),
    sort('Подбери игрушки к цветным кружкам',
      [object('ball', sky), object('car', pink), object('block', gray), object('flower', pink), object('boat', sky), object('pebble', gray)], [pink, sky, gray], 'match'),
    sort('Разложи предметы по розовой, голубой и серой корзинам',
      [object('flower', pink), object('boat', gray), object('block', sky), object('car', sky), object('star', pink), object('ball', gray)], [pink, sky, gray]),
  ]),
  'colors-7': lesson('rainbow', [
    demonstrate('Две корзины', 'Смотри, куда Луми кладёт красный кубик и жёлтую звёздочку.',
      [object('block', red), object('star', yellow)], [red, yellow]),
    demonstrate('Три корзины', 'Луми сравнивает цвет каждой игрушки с кружком на корзине.',
      [object('boat', blue), object('flower', red), object('ball', yellow)], [red, yellow, blue]),
    demonstrate('Один цвет, разные формы', 'Мяч круглый, а у кубика есть уголки. Оба зелёные, поэтому Луми кладёт их вместе.',
      [object('ball', green), object('block', green), object('boat', blue)], [green, blue]),
  ], [
    sort('Разложи красные и жёлтые игрушки',
      [object('ball', yellow), object('car', red), object('car', yellow), object('ball', red)], [red, yellow]),
    sort('Разложи синие и зелёные предметы',
      [object('block', blue), object('frog', green), object('car', green), object('boat', blue), object('boat', green), object('car', blue)], [blue, green]),
    sort('Разложи игрушки по трём корзинам',
      [object('apple', red), object('star', yellow), object('frog', green), object('ball', green), object('star', red), object('apple', yellow)], [yellow, green, red]),
    exercise('odd', 'Найди игрушку, которая попала не в свою корзину',
      'Посмотри на кружок на корзине. Нажми на игрушку другого цвета.',
      [object('car', blue), object('block', blue), object('ball', yellow), object('boat', blue)], { color: blue }),
    sort('Помоги Луми рассортировать все игрушки',
      [object('cat', white), object('flower', pink), object('pebble', gray), object('car', blue),
        object('block', blue), object('cat', gray), object('flower', white), object('car', pink)], [blue, pink, gray, white]),
  ]),
};
