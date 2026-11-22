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
const steps = (prompt, guide, hint, ...rounds) => ({ kind: 'comparison', prompt, guide, hint, rounds });
const pick = (prompt, guide, hint, options, correct, view) => steps(prompt, guide, hint, chosen(options, correct, view));
const join = (prompt, guide, options, pairs) => ({ kind: 'comparison', prompt, guide, hint: 'Сравни две подсвеченные игрушки. Нажми сначала на одну, потом на другую.', options, pairs });
const demo = (title, text, board, effect = 'compare') => ({ title, text, board, effect });
const change = (before, after, feature) => ({ before, after, feature });
const featureOptions = ['color', 'size', 'shape'].map(mark);
const matchHint = 'Посмотри на игрушку вверху, потом на подсвеченную игрушку внизу. Они одинаковые?';
const oddHint = 'Посмотри, чем один предмет отличается от остальных.';
const changeHint = 'Посмотри на одно и то же место на обеих полках. Подсвечена карточка с ответом.';
const attributeHint = 'Сначала сравни цвет, потом размер и форму. Обрати внимание на подсвеченную карточку.';

export const comparisonLessons = {
  'compare-1': {
    format: 'comparison',
    scenes: [
      demo('Две одинаковые игрушки', 'Посмотри на два голубых мяча. Оба круглые и одного размера. Они одинаковые.', objects([ball('blue'), ball('blue')]), 'join'),
      demo('А какая отличается?', 'Посмотри на средний кубик. Он голубой, а кубики по краям розовые. Два розовых кубика — пара.', { toys: [cube('rose'), cube('blue'), cube('rose')], highlights: [0, 2] }, 'group'),
      demo('Соединим пару', 'Проследи за дорожкой. Она соединяет две одинаковые зелёные машинки.', { toys: [car('green'), bear('gold'), car('green')], highlights: [0, 2] }, 'join'),
    ],
    practice: [
      pick('Выбери такой же мяч', 'Посмотри на мяч на подставке. Внизу нажми на мяч такого же цвета.', matchHint, [ball('blue'), ball('rose')], 0, sample(ball('blue'))),
      pick('Найди такого же мишку', 'Посмотри на мишку вверху. Внизу нажми на мишку такого же цвета.', matchHint, [bear('gold'), bear('blue'), ball('rose')], 1, sample(bear('blue'))),
      join('Соедини пару машинок', 'Нажми на одну машинку, а потом на точно такую же.', [car('green'), car('blue'), car('green')], [[0, 2]]),
      join('Найди два одинаковых предмета', 'Посмотри на все игрушки. Нажми по очереди на две, которые совпадают по форме, цвету и размеру.', [house('rose'), cube('gold'), flower('blue'), cube('gold')], [[1, 3]]),
      join('Собери три пары игрушек', 'Нажми на игрушку и на такую же. Потом повтори с игрушками без галочек.', [ball('rose'), flower('blue'), bear('gold'), bear('gold'), ball('rose'), flower('blue')], [[0, 4], [1, 5], [2, 3]]),
    ],
  },
  'compare-2': {
    format: 'comparison',
    scenes: [
      demo('Цвет может отличаться', 'Оба мяча круглые и одного размера. Один розовый, а другой голубой. У них разный цвет.', compare([ball('rose'), ball('blue')], 'color')),
      demo('Размер может отличаться', 'У домиков одинаковый цвет. Поставим их рядом. Слева домик маленький, справа большой.', compare([house('gold', 'small'), house('gold', 'large')], 'size'), 'measure'),
      demo('Форма может отличаться', 'Обе игрушки голубые. Мяч круглый, а у треугольника есть углы. У них разная форма.', compare([ball('blue'), triangle('blue')], 'shape'), 'silhouette'),
    ],
    practice: [
      pick('У какого мяча другой цвет?', 'Два мяча одного цвета. Нажми на мяч, у которого цвет другой.', 'Посмотри на цвет. Форма у всех мячей одинаковая.', [ball('green'), ball('rose'), ball('green')], 1, { feature: 'color', aim: 'odd' }),
      pick('Какой домик другого размера?', 'Сравни, какие домики большие, а какие маленькие. Нажми на домик, который по размеру не похож на два других.', 'Сравни, сколько места занимают домики.', [house('blue', 'large'), house('blue', 'small'), house('blue', 'small')], 0, { feature: 'size', aim: 'odd' }),
      pick('У какой игрушки другая форма?', 'Две игрушки круглые. Нажми на игрушку другой формы.', 'Найди форму с углами среди круглых предметов.', [ball('gold'), ball('gold'), cube('gold')], 2, { feature: 'shape', aim: 'odd' }),
      pick('Какая машинка отличается?', 'Сравни три машинки. Нажми на ту, которая выглядит иначе, чем две другие.', oddHint, [car('blue'), car('blue'), car('rose')], 2, { aim: 'odd' }),
      pick('Чем отличаются мишки?', 'Посмотри на двух мишек. Внизу выбери, что у них разное: цвет, размер или форма.', attributeHint, featureOptions, 1, compare([bear('gold', 'small'), bear('gold', 'large')])),
    ],
  },
  'compare-3': {
    format: 'comparison',
    scenes: [
      demo('Игрушка на подставке', 'Домик вверху — образец. Посмотри на него. Внизу будем искать точно такой же.', { sample: house('rose'), toys: [house('rose')] }, 'sample'),
      demo('Посмотри на варианты', 'Вверху розовый домик. Внизу тоже есть розовый домик. У них совпадают цвет, форма и размер.', { sample: house('rose'), toys: [house('green'), house('rose'), house('blue')], highlights: [1] }, 'group'),
      demo('Нашлась точная копия', 'Посмотри на машинку вверху. Дорожка ведёт к такой же машинке внизу. Она такого же цвета и размера.', { sample: car('blue'), toys: [car('rose'), car('blue'), car('blue', 'small')], highlights: [1] }, 'join'),
    ],
    practice: [
      pick('Найди такой же кубик', 'Посмотри на кубик на подставке. Среди двух кубиков внизу нажми на точно такой же.', matchHint, [cube('gold'), cube('rose')], 1, sample(cube('rose'))),
      pick('Найди такой же домик', 'Сравни домики внизу с домиком на подставке. Нажми на домик такого же цвета и размера.', matchHint, [house('green'), house('blue'), house('green', 'small')], 0, sample(house('green'))),
      pick('Найди такой же цветок', 'Посмотри на цветок вверху. Внизу нажми на такой же цветок: проверь его цвет и размер.', matchHint, [flower('blue', 'small'), flower('blue', 'large'), ball('blue', 'large'), flower('rose', 'large')], 1, sample(flower('blue', 'large'))),
      pick('Найди точную копию машинки', 'Посмотри на машинку на подставке. Внизу выбери машинку такого же цвета и размера, с таким же значком на дверце.', 'У точной копии совпадает и маленький значок.', [car('green', 'medium', 'moon'), car('green', 'small', 'star'), car('blue', 'medium', 'star'), car('green', 'medium', 'star')], 3, sample(car('green', 'medium', 'star'))),
      steps('Собери набор по образцам', 'Посмотри на игрушку вверху и выбери такую же внизу. Нажми «Дальше», чтобы увидеть следующий образец.', matchHint,
        chosen([cube('rose'), cube('blue'), ball('rose')], 0, sample(cube('rose'))),
        chosen([bear('green'), bear('gold'), bear('green', 'small')], 1, sample(bear('gold'))),
        chosen([car('green'), flower('green'), car('rose')], 0, sample(car('green')))),
    ],
  },
  'compare-4': {
    format: 'comparison',
    scenes: [
      demo('Одна игрушка исчезла', 'На левой полке есть мишка. На правой на его месте пусто. Мишка исчез.', change([ball('rose'), bear('gold')], [ball('rose'), null], 'vanish'), 'vanish'),
      demo('Игрушка появилась', 'На левой полке рядом с кубиком пусто. На правой там стоит домик. Домик появился.', change([cube('green'), null], [cube('green'), house('blue')], 'appear'), 'appear'),
      demo('У игрушки изменился цвет', 'Посмотри на мяч на обеих полках. Сначала он голубой, потом розовый. Место осталось прежним.', change([ball('blue'), flower('gold')], [ball('rose'), flower('gold')], 'color'), 'recolor'),
    ],
    practice: [
      pick('Какая игрушка исчезла?', 'Посмотри на пустое место на полке «Потом». Найди, какая игрушка стояла там сначала, и нажми на неё внизу.', changeHint, [cube('green'), bear('gold'), ball('rose')], 1, change([cube('green'), bear('gold'), ball('rose')], [cube('green'), null, ball('rose')], 'vanish')),
      pick('Какая игрушка появилась?', 'Найди пустое место на полке «Сначала». Посмотри, какая игрушка там теперь, и нажми на неё внизу.', changeHint, [house('blue'), flower('rose'), cube('gold')], 1, change([house('blue'), null, cube('gold')], [house('blue'), flower('rose'), cube('gold')], 'appear')),
      pick('Какого цвета мяч теперь?', 'Посмотри на мяч на полке «Потом». Внизу нажми на мяч такого же цвета.', changeHint, [ball('gold'), ball('blue'), ball('green')], 2, change([ball('blue'), car('rose')], [ball('green'), car('rose')], 'color')),
      pick('Где машинка теперь?', 'Посмотри на полку «Потом». Внизу нажми на карточку с таким же местом: слева, посередине или справа.', 'Найди новое место машинки на второй полке.', [mark('left'), mark('middle'), mark('right')], 2, change([car('blue'), null, null], [null, null, car('blue')], 'move')),
      pick('Что изменилось на полке?', 'Сравни полки. Внизу выбери, что случилось: игрушка переехала, появилась новая или поменялся цвет.', changeHint, [mark('move'), mark('appear'), mark('color')], 2, { ...change([house('gold'), car('rose'), cube('green')], [house('gold'), car('blue'), cube('green')]), answerLabels: { move: 'Игрушка переехала', appear: 'Появилась игрушка', color: 'Поменялся цвет' } }),
    ],
  },
  'compare-5': {
    format: 'comparison',
    scenes: [
      demo('Сравним цвет', 'Оба мяча круглые и одного размера. Розовый и зелёный — это два разных цвета.', compare([ball('rose'), ball('green')], 'color')),
      demo('Сравним размер', 'Посмотри, какой домик выше. Домик справа больше. Их цвет и форма одинаковые.', compare([house('blue', 'small'), house('blue', 'large')], 'size'), 'measure'),
      demo('Сравним форму', 'Посмотри на края фигур. У мяча нет углов, а у треугольника есть. Их форма разная.', compare([ball('gold'), triangle('gold')], 'shape'), 'silhouette'),
    ],
    practice: [
      pick('Чем отличаются эти мячи?', 'Посмотри на оба мяча. Внизу выбери, что у них разное: цвет, размер или форма.', attributeHint, featureOptions, 0, compare([ball('blue'), ball('rose')])),
      pick('Чем отличаются эти домики?', 'Посмотри на оба домика. Внизу выбери, что у них разное: цвет, размер или форма.', attributeHint, [mark('shape'), mark('size'), mark('color')], 1, compare([house('green', 'small'), house('green', 'large')])),
      pick('Чем отличаются эти фигуры?', 'Посмотри на обе фигуры. Внизу выбери, что у них разное: цвет, размер или форма.', attributeHint, [mark('size'), mark('color'), mark('shape')], 2, compare([cube('gold'), triangle('gold')])),
      pick('Чем отличаются эти машинки?', 'Посмотри на обе машинки. Внизу выбери, что у них разное: цвет, размер или форма.', attributeHint, [mark('color'), mark('shape'), mark('size')], 0, compare([car('rose'), car('green')])),
      pick('Какой значок на машинке справа?', 'Посмотри на дверцы обеих машинок. Нажми на значок с машинки справа.', 'Посмотри на подсвеченный значок внизу и сравни его со значком на правой машинке.', [mark('moon'), mark('star')], 0, { ...compare([car('blue', 'medium', 'star'), car('blue', 'medium', 'moon')]), aim: 'new-detail', captions: ['Слева', 'Справа'] }),
    ],
  },
  'compare-6': {
    format: 'comparison',
    scenes: [
      demo('Три игрушки похожи', 'Посмотри на цвет мячей. Три голубых мяча в одной группе, а розовый мяч отличается.', { ...compare([ball('blue'), ball('blue'), ball('rose'), ball('blue')], 'color'), highlights: [0, 1, 3], odd: 2 }, 'group'),
      demo('Сначала выбираем правило', 'Смотрим на форму. Три кубика с углами подходят друг к другу. Круглый мяч отличается.', { ...compare([cube('gold'), ball('gold'), cube('gold'), cube('gold')], 'shape'), highlights: [0, 2, 3], odd: 1 }, 'group'),
      demo('Почему предмет лишний?', 'Сравни размер мишек. Три мишки маленькие. Большой мишка отличается, поэтому он лишний.', { ...compare([bear('blue', 'small'), bear('blue', 'small'), bear('blue', 'small'), bear('blue', 'large')], 'size'), highlights: [0, 1, 2], odd: 3 }, 'group'),
    ],
    practice: [
      pick('Какой мяч лишний по цвету?', 'У трёх мячей один цвет. Нажми на мяч другого цвета.', 'Три мяча одного цвета, а у четвёртого цвет другой.', [ball('rose'), ball('blue'), ball('rose'), ball('rose')], 1, { feature: 'color', aim: 'odd', explainOdd: true }),
      pick('Какая игрушка лишняя по форме?', 'Посмотри на контуры игрушек. Нажми на ту, у которой форма отличается от трёх других.', 'Посмотри, какая фигура по форме отличается от трёх других.', [triangle('green'), triangle('green'), ball('green'), triangle('green')], 2, { feature: 'shape', aim: 'odd', explainOdd: true }),
      pick('Какой домик лишний по размеру?', 'Сравни большие и маленькие домики. Нажми на домик, который по размеру не похож на три других.', 'Найди один домик другого размера.', [house('gold', 'large'), house('gold', 'small'), house('gold', 'small'), house('gold', 'small')], 0, { feature: 'size', aim: 'odd', explainOdd: true }),
      pick('Какая игрушка здесь лишняя?', 'Посмотри, какие игрушки похожи по форме. Нажми на ту, которая другой формы.', 'Три игрушки — машинки. Какая игрушка другой формы?', [car('blue'), car('rose'), bear('blue'), car('gold')], 2, { feature: 'shape', aim: 'odd', explainOdd: true }),
      pick('Какой цветок здесь лишний?', 'Посмотри на все цветы. Найди три одинаковых и нажми на тот, что отличается.', oddHint, [flower('gold'), flower('gold'), flower('gold'), flower('blue')], 3, { aim: 'odd', explainOdd: true }),
    ],
  },
  'compare-7': {
    format: 'comparison',
    scenes: [
      demo('Сначала сравним цвет', 'Форма у мяча и домика разная. Но если смотреть на цвет, оба голубые.', compare([ball('blue'), house('blue')], 'color'), 'join'),
      demo('Теперь сравним форму', 'Один кубик розовый, другой жёлтый. Посмотри на их края: форма у них одинаковая.', compare([cube('rose'), cube('gold')], 'shape'), 'silhouette'),
      demo('Сравним размер', 'Оба мишки зелёные. Поставим их рядом: левый маленький, правый большой.', compare([bear('green', 'small'), bear('green', 'large')], 'size'), 'measure'),
    ],
    practice: [
      pick('Найди игрушку такого же цвета', 'Посмотри на цвет домика вверху. Нажми внизу на игрушку такого же цвета.', 'Форма может быть другой. Сравни только цвет.', [bear('rose'), cube('green'), ball('gold')], 1, sample(house('green'), 'color')),
      pick('Найди игрушку такой же формы', 'Посмотри на форму домика вверху. Нажми внизу на игрушку такой же формы. Цвет может быть другим.', 'Цвет может быть другим. Сравни контур.', [triangle('blue'), house('rose'), flower('rose')], 1, sample(house('blue'), 'shape')),
      pick('Какая машинка больше?', 'Сравни две машинки. Нажми на ту, которая больше.', 'Обе машинки одинакового цвета. Посмотри, какая занимает больше места.', [car('green', 'small'), car('green', 'large')], 1, { feature: 'size', aim: 'larger' }),
      join('Найди два точно одинаковых цветка', 'Нажми по очереди на два цветка, у которых совпадают и цвет, и размер.', [flower('rose', 'large'), flower('gold', 'large'), flower('rose', 'large'), flower('rose', 'small')], [[0, 2]]),
      steps('Сравни три пары игрушек', 'Посмотри на пару вверху. Выбери, чем игрушки отличаются. Нажми «Дальше», чтобы увидеть новую пару.', attributeHint,
        chosen([mark('shape'), mark('color'), mark('size')], 1, compare([ball('rose'), ball('green')])),
        chosen([mark('size'), mark('shape'), mark('color')], 1, compare([cube('blue'), triangle('blue')])),
        chosen([mark('color'), mark('shape'), mark('size')], 2, compare([bear('gold', 'small'), bear('gold', 'large')]))),
    ],
  },
};
