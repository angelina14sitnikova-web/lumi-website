const toy = (shape, color, size = 'medium', detail = '') => ({ shape, color, size, detail });
const ball = (color, size) => toy('ball', color, size);
const cube = (color, size) => toy('cube', color, size);
const triangle = (color, size) => toy('triangle', color, size);
const car = (color, size, detail) => toy('car', color, size, detail);
const house = (color, size) => toy('house', color, size);
const bear = (color, size) => toy('bear', color, size);
const flower = (color, size) => toy('flower', color, size);
const mark = name => ({ mark: name });
const objects = toys => ({ toys });
const compare = (toys, feature) => ({ toys, feature });
const sample = (example, feature) => ({ sample: example, feature, aim: 'match' });
const chosen = (options, correct, view) => ({ options, correct, view });
const steps = (prompt, hint, ...rounds) => ({ kind: 'comparison', prompt, hint, rounds });
const pick = (prompt, hint, options, correct, view) => steps(prompt, hint, chosen(options, correct, view));
const join = (prompt, options, pairs) => ({ kind: 'comparison', prompt, hint: 'Посмотри на форму, цвет и размер обеих игрушек.', options, pairs });
const demo = (title, text, board, effect = 'compare') => ({ title, text, board, effect });
const change = (before, after, feature) => ({ before, after, feature });
const featureOptions = ['color', 'size', 'shape'].map(mark);
const matchHint = 'Сравни форму, цвет и размер с образцом.';
const oddHint = 'Посмотри, чем один предмет отличается от остальных.';
const changeHint = 'Посмотри на полки по очереди. Что теперь выглядит иначе?';
const attributeHint = 'Сравни игрушки по очереди: цвет, форму и размер.';

export const comparisonLessons = {
  'compare-1': {
    format: 'comparison',
    scenes: [
      demo('Две одинаковые игрушки', 'У этих мячей одинаковые цвет, форма и размер. Луми ставит их рядом.', objects([ball('blue'), ball('blue')]), 'join'),
      demo('А какая отличается?', 'У третьей игрушки другой цвет. Она остаётся за рамкой пары.', { toys: [cube('rose'), cube('blue'), cube('rose')], highlights: [0, 2] }, 'group'),
      demo('Соединим пару', 'К двум одинаковым машинкам ведёт одна дорожка. Получилась пара!', { toys: [car('green'), bear('gold'), car('green')], highlights: [0, 2] }, 'join'),
    ],
    practice: [
      pick('Выбери такой же мяч', matchHint, [ball('blue'), ball('rose')], 0, sample(ball('blue'))),
      pick('Найди такую же игрушку среди трёх', matchHint, [bear('gold'), bear('blue'), ball('rose')], 1, sample(bear('blue'))),
      join('Соедини пару. Коснись двух одинаковых игрушек.', [car('green'), car('blue'), car('green')], [[0, 2]]),
      join('Найди два одинаковых предмета среди четырёх', [house('rose'), cube('gold'), flower('blue'), cube('gold')], [[1, 3]]),
      join('Собери три пары одинаковых игрушек', [ball('rose'), flower('blue'), bear('gold'), bear('gold'), ball('rose'), flower('blue')], [[0, 4], [1, 5], [2, 3]]),
    ],
  },
  'compare-2': {
    format: 'comparison',
    scenes: [
      demo('Цвет может отличаться', 'Форма и размер мячей совпали. У одного мяча другой цвет.', compare([ball('rose'), ball('blue')], 'color')),
      demo('Размер может отличаться', 'Домики одного цвета и формы. Один домик больше другого.', compare([house('gold', 'small'), house('gold', 'large')], 'size'), 'measure'),
      demo('Форма может отличаться', 'Эти игрушки голубые. Одна круглая, а другая угловатая.', compare([ball('blue'), triangle('blue')], 'shape'), 'silhouette'),
    ],
    practice: [
      pick('Найди предмет другого цвета', 'Посмотри на цвет. Форма у всех мячей одинаковая.', [ball('green'), ball('rose'), ball('green')], 1, { feature: 'color', aim: 'odd' }),
      pick('Найди предмет другого размера', 'Сравни, сколько места занимают домики.', [house('blue', 'large'), house('blue', 'small'), house('blue', 'small')], 0, { feature: 'size', aim: 'odd' }),
      pick('Найди предмет другой формы', 'Найди форму с углами среди круглых предметов.', [ball('gold'), ball('gold'), cube('gold')], 2, { feature: 'shape', aim: 'odd' }),
      pick('Какая из трёх игрушек отличается?', oddHint, [car('blue'), car('blue'), car('rose')], 2, { aim: 'odd' }),
      pick('Что у предметов разное?', attributeHint, featureOptions, 1, compare([bear('gold', 'small'), bear('gold', 'large')])),
    ],
  },
  'compare-3': {
    format: 'comparison',
    scenes: [
      demo('Игрушка на подставке', 'Сначала Луми ставит образец на подставку. Ищем такую же игрушку.', { sample: house('rose'), toys: [house('rose')] }, 'sample'),
      demo('Посмотри на варианты', 'У этих домиков совпадает форма. Только один совпадает ещё и по цвету с образцом.', { sample: house('rose'), toys: [house('green'), house('rose'), house('blue')], highlights: [1] }, 'group'),
      demo('Нашлась точная копия', 'Луми соединяет образец и его копию. Совпали цвет, форма и размер.', { sample: car('blue'), toys: [car('rose'), car('blue'), car('blue', 'small')], highlights: [1] }, 'join'),
    ],
    practice: [
      pick('Выбери копию из двух игрушек', matchHint, [cube('gold'), cube('rose')], 1, sample(cube('rose'))),
      pick('Выбери копию из трёх игрушек', matchHint, [house('green'), house('blue'), house('green', 'small')], 0, sample(house('green'))),
      pick('Выбери копию из четырёх игрушек', matchHint, [flower('blue', 'small'), flower('blue', 'large'), ball('blue', 'large'), flower('rose', 'large')], 1, sample(flower('blue', 'large'))),
      pick('Найди точную копию машинки', 'У точной копии совпадает и маленький значок.', [car('green', 'medium', 'moon'), car('green', 'small', 'star'), car('blue', 'medium', 'star'), car('green', 'medium', 'star')], 3, sample(car('green', 'medium', 'star'))),
      steps('Собери набор по образцам', matchHint,
        chosen([cube('rose'), cube('blue'), ball('rose')], 0, sample(cube('rose'))),
        chosen([bear('green'), bear('gold'), bear('green', 'small')], 1, sample(bear('gold'))),
        chosen([car('green'), flower('green'), car('rose')], 0, sample(car('green')))),
    ],
  },
  'compare-4': {
    format: 'comparison',
    scenes: [
      demo('Одна игрушка исчезла', 'Сначала на полке были мяч и мишка. Мишка исчез, и его место стало пустым.', change([ball('rose'), bear('gold')], [ball('rose'), null], 'vanish'), 'vanish'),
      demo('Игрушка появилась', 'Луми ставит домик на пустое место. Теперь на полке на одну игрушку больше.', change([cube('green'), null], [cube('green'), house('blue')], 'appear'), 'appear'),
      demo('У игрушки изменился цвет', 'Мяч остался на месте, а вместо голубого цвета стал розовым.', change([ball('blue'), flower('gold')], [ball('rose'), flower('gold')], 'color'), 'recolor'),
    ],
    practice: [
      pick('Какая игрушка исчезла?', changeHint, [cube('green'), bear('gold'), ball('rose')], 1, change([cube('green'), bear('gold'), ball('rose')], [cube('green'), null, ball('rose')], 'vanish')),
      pick('Какая игрушка появилась?', changeHint, [house('blue'), flower('rose'), cube('gold')], 1, change([house('blue'), null, cube('gold')], [house('blue'), flower('rose'), cube('gold')], 'appear')),
      pick('Каким стал цвет мяча?', changeHint, [ball('gold'), ball('blue'), ball('green')], 2, change([ball('blue'), car('rose')], [ball('green'), car('rose')], 'color')),
      pick('Куда переместилась машинка?', 'Найди новое место машинки на второй полке.', [mark('left'), mark('middle'), mark('right')], 2, change([car('blue'), null, null], [null, null, car('blue')], 'move')),
      pick('Найди одно изменение между полками', changeHint, [mark('move'), mark('appear'), mark('color')], 2, change([house('gold'), car('rose'), cube('green')], [house('gold'), car('blue'), cube('green')])),
    ],
  },
  'compare-5': {
    format: 'comparison',
    scenes: [
      demo('Сравним цвет', 'Два мяча круглые и одинаковые по размеру. Красочный знак показывает отличие по цвету.', compare([ball('rose'), ball('green')], 'color')),
      demo('Сравним размер', 'Луми ставит домики на одну линию. Синий домик слева меньше.', compare([house('blue', 'small'), house('blue', 'large')], 'size'), 'measure'),
      demo('Сравним форму', 'Круглый и угловатый контуры показывают, чем эти предметы отличаются.', compare([ball('gold'), triangle('gold')], 'shape'), 'silhouette'),
    ],
    practice: [
      pick('Чем отличаются эти мячи?', attributeHint, featureOptions, 0, compare([ball('blue'), ball('rose')])),
      pick('Чем отличаются эти домики?', attributeHint, [mark('shape'), mark('size'), mark('color')], 1, compare([house('green', 'small'), house('green', 'large')])),
      pick('Чем отличаются эти фигуры?', attributeHint, [mark('size'), mark('color'), mark('shape')], 2, compare([cube('gold'), triangle('gold')])),
      pick('Чем отличаются эти машинки?', attributeHint, [mark('color'), mark('shape'), mark('size')], 0, compare([car('rose'), car('green')])),
      pick('Какая деталь изменилась?', 'Рассмотри значки на дверцах обеих машинок.', [mark('size'), mark('star'), mark('moon')], 2, { ...compare([car('blue', 'medium', 'star'), car('blue', 'medium', 'moon')]), aim: 'new-detail' }),
    ],
  },
  'compare-6': {
    format: 'comparison',
    scenes: [
      demo('Три игрушки похожи', 'Три мяча голубые. Розовый мяч отличается только цветом.', { ...compare([ball('blue'), ball('blue'), ball('rose'), ball('blue')], 'color'), highlights: [0, 1, 3], odd: 2 }, 'group'),
      demo('Сначала выбираем правило', 'Посмотрим только на форму. Три кубика угловатые, а мяч круглый.', { ...compare([cube('gold'), ball('gold'), cube('gold'), cube('gold')], 'shape'), highlights: [0, 2, 3], odd: 1 }, 'group'),
      demo('Почему предмет лишний?', 'Три мишки одинакового размера. Луми отодвигает одного мишку: он больше.', { ...compare([bear('blue', 'small'), bear('blue', 'small'), bear('blue', 'small'), bear('blue', 'large')], 'size'), highlights: [0, 1, 2], odd: 3 }, 'group'),
    ],
    practice: [
      pick('Найди лишний по цвету', 'Три мяча одного цвета, а у четвёртого цвет другой.', [ball('rose'), ball('blue'), ball('rose'), ball('rose')], 1, { feature: 'color', aim: 'odd', explainOdd: true }),
      pick('Найди лишний по форме', 'Посмотри, какая фигура по форме отличается от трёх других.', [triangle('green'), triangle('green'), ball('green'), triangle('green')], 2, { feature: 'shape', aim: 'odd', explainOdd: true }),
      pick('Найди лишний по размеру', 'Найди один домик другого размера.', [house('gold', 'large'), house('gold', 'small'), house('gold', 'small'), house('gold', 'small')], 0, { feature: 'size', aim: 'odd', explainOdd: true }),
      pick('Найди игрушку, которая не похожа на три другие', 'Три игрушки — машинки. Какая игрушка другой формы?', [car('blue'), car('rose'), bear('blue'), car('gold')], 2, { feature: 'shape', aim: 'odd', explainOdd: true }),
      pick('Выбери один лишний предмет', oddHint, [flower('gold'), flower('gold'), flower('gold'), flower('blue')], 3, { aim: 'odd', explainOdd: true }),
    ],
  },
  'compare-7': {
    format: 'comparison',
    scenes: [
      demo('Сначала сравним цвет', 'Мяч и домик разной формы. Цвет у двух игрушек одинаковый.', compare([ball('blue'), house('blue')], 'color'), 'join'),
      demo('Теперь сравним форму', 'У этих кубиков разные цвета, но контур у них одинаковый.', compare([cube('rose'), cube('gold')], 'shape'), 'silhouette'),
      demo('Сравним размер', 'Если поставить двух мишек рядом, видно, какой занимает больше места.', compare([bear('green', 'small'), bear('green', 'large')], 'size'), 'measure'),
    ],
    practice: [
      pick('Найди игрушку такого же цвета', 'Форма может быть другой. Сравни только цвет.', [bear('rose'), cube('green'), ball('gold')], 1, sample(house('green'), 'color')),
      pick('Найди игрушку такой же формы', 'Цвет может быть другим. Сравни контур.', [triangle('blue'), house('rose'), flower('rose')], 1, sample(house('blue'), 'shape')),
      pick('Выбери больший предмет', 'Обе машинки одинакового цвета. Посмотри, какая занимает больше места.', [car('green', 'small'), car('green', 'large')], 1, { feature: 'size', aim: 'larger' }),
      join('Выбери две полностью одинаковые игрушки', [flower('rose', 'large'), flower('gold', 'large'), flower('rose', 'large'), flower('rose', 'small')], [[0, 2]]),
      steps('Сравни три пары игрушек. В каждой паре найди отличие.', attributeHint,
        chosen([mark('shape'), mark('color'), mark('size')], 1, compare([ball('rose'), ball('green')])),
        chosen([mark('size'), mark('shape'), mark('color')], 1, compare([cube('blue'), triangle('blue')])),
        chosen([mark('color'), mark('shape'), mark('size')], 2, compare([bear('gold', 'small'), bear('gold', 'large')]))),
    ],
  },
};
