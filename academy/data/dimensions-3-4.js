import { piece, lesson, scene, exercise, pick, connect } from './sensory-builders.js';

const L = 'length', H = 'height', W = 'width';
const item = (shape, axis, value) => ({ ...piece(shape, 'sky'), axis, value });
const row = (shape, axis, values) => values.map(value => item(shape, axis, value));
const choose = (shape, axis, values, answer, sample) => pick(row(shape, axis, values), answer,
  sample === undefined ? undefined : item(shape, axis, sample));
const show = (text, shape, axis, values, focus, effect = 'align') =>
  scene(effect, text, row(shape, axis, values), { focus });
const match = (shape, axis, values, targetShape, targets, matches) =>
  connect(row(shape, axis, values), row(targetShape, axis, targets), matches);
const move = (text, shape, axis, values, targetShape, targets, matches, effect = 'move') =>
  scene(effect, text, row(shape, axis, values), { targets: row(targetShape, axis, targets), matches });
const task = (prompt, ...rounds) => exercise(prompt,
  rounds[0].targets ? 'Нажми на предмет, затем на подходящий образец внизу.' : 'Посмотри на края предметов и нажми на подходящий.', ...rounds);

export const dimensionsLessons = {
  'dimensions-1': lesson('ribbons', [
    show('Ленты одного цвета. Одна длиннее, другая короче.', 'ribbon', L, [1,3]),
    show('Начала лент на одной линии. Длинная лента выступает дальше.', 'ribbon', L, [1,3], 1),
    move('Короткая лента помещается в маленькую коробочку.', 'ribbon', L, [1], 'box', [1], [0]),
  ], [
    task('Найди длинную ленту', choose('ribbon', L, [1,3], 1,3)),
    task('Выбери короткий карандаш', choose('pencil', L, [1,3], 0,1)),
    task('Покажи длинную дорожку', choose('road', L, [3,1], 0,3)),
    task('Найди короткую верёвочку', choose('rope', L, [2,3,1], 2,1)),
    task('Разложи ленты по коробкам', match('ribbon', L, [3,1,1,3], 'box', [1,3], [1,0,0,1])),
  ]),
  'dimensions-2': lesson('ribbons', [
    show('Совместим начала полосок. Теперь их удобно сравнить.', 'strip', L, [3,1]),
    show('Длинная полоска выступает за край короткой.', 'strip', L, [3,1], 0),
    show('Поменяем полоски местами и снова совместим их начала.', 'strip', L, [1,3], 1),
  ], [
    task('Выбери более длинную полоску', choose('strip', L, [3,1], 0,3)),
    task('Найди более короткую дорожку', choose('road', L, [3,1], 1,1)),
    task('Выровняй начала лент, затем выбери длинную', { ...choose('ribbon', L, [1,3], 1,3), align: true }),
    task('Найди самую длинную ленту', choose('ribbon', L, [1,3,2], 1,3)),
    task('Подбери ленту такой же длины', choose('ribbon', L, [3,1,2], 2,2)),
  ]),
  'dimensions-3': lesson('towers', [
    show('Башни стоят на одном полу. Одна выше, другая ниже.', 'tower', H, [3,1]),
    show('Посмотри, как высоко находится верхушка этой башни.', 'tower', H, [3,1], 0),
    show('Деревья тоже можно сравнивать от общей линии земли.', 'tree', H, [1,3], 1),
  ], [
    task('Выбери высокую башню', choose('tower', H, [1,3], 1,3)),
    task('Найди низкое дерево', choose('tree', H, [1,3], 0,1)),
    task('Покажи высокий домик', choose('house', H, [3,1], 0,3)),
    task('Выбери самую низкую башню', choose('tower', H, [2,3,1], 2,1)),
    task('Разложи башни по высоте', match('tower', H, [1,3,3,1], 'tower', [3,1], [1,0,0,1])),
  ]),
  'dimensions-4': lesson('towers', [
    show('Поставим домики на одну линию.', 'house', H, [3,1]),
    show('У высокого домика крыша выше.', 'house', H, [1,3], 1),
    show('Среди трёх башен найдём самую высокую.', 'tower', H, [2,3,1], 1),
  ], [
    task('Найди более высокую башню', choose('tower', H, [3,1], 0,3)),
    task('Выбери более низкий домик', choose('house', H, [3,1], 1,1)),
    task('Сравни деревья. Нажми на более высокое', choose('tree', H, [1,3], 1,3)),
    task('Найди самую высокую башню', choose('tower', H, [1,2,3], 2,3)),
    exercise('Расставь башни от низкой к высокой', 'Сначала поставь низкую башню, затем среднюю и высокую.',
      { ...match('tower', H, [2,3,1], 'tower', [1,2,3], [1,2,0]), ordered: true }),
  ]),
  'dimensions-5': lesson('towers', [
    show('Дорожки одинаково длинные. Посмотри, какая шире.', 'road', W, [3,1]),
    show('У широкой дорожки между краями больше места.', 'road', W, [1,3], 1),
    move('Машинка едет по широкой дорожке: колёса помещаются между краями.', 'car', W, [2], 'road', [3], [0], 'drive'),
  ], [
    task('Найди широкую дорожку', choose('road', W, [1,3], 1,3)),
    task('Выбери узкую ленту', choose('ribbon', W, [1,3], 0,1)),
    task('Покажи широкий мост', choose('bridge', W, [3,1], 0,3)),
    task('Подбери дорожку для большой машинки', match('car', W, [2], 'road', [1,3], [1])),
    task('Разложи полоски по ширине', match('strip', W, [3,1,3,1], 'strip', [3,1], [0,1,0,1])),
  ]),
  'dimensions-6': lesson('ribbons', [
    show('Совместим начала полосок. Их концы совпали: длина одинаковая.', 'strip', L, [2,2]),
    show('На общей линии видно, что верхушки башен на одной высоте.', 'tower', H, [3,3]),
    show('Края дорожек на одном расстоянии друг от друга. Ширина одинаковая.', 'road', W, [2,2]),
  ], [
    task('Найди две полоски одинаковой длины', choose('strip', L, [2,3,2], [0,2])),
    task('Подбери башню такой же высоты', choose('tower', H, [1,3,2], 1,3)),
    task('Найди две дорожки одинаковой ширины', choose('road', W, [1,1,3], [0,1])),
    task('Выбери ленту такой же длины', choose('ribbon', L, [3,1,2], 2,2)),
    task('Собери пары по длине, высоте и ширине',
      choose('strip', L, [1,2,1], [0,2]), choose('tower', H, [3,2,2], [1,2]), choose('road', W, [3,1,3], [0,2])),
  ]),
  'dimensions-7': lesson('towers', [
    show('Сравниваем длину: начало общее, конец длинной ленты дальше.', 'ribbon', L, [3,1], 0),
    show('Сравниваем высоту: основание общее, высокая башня поднимается выше.', 'tower', H, [1,3], 1),
    show('Сравниваем ширину: широкая дорожка занимает больше места поперёк.', 'road', W, [3,1], 0),
  ], [
    task('Найди длинную ленту', choose('ribbon', L, [1,3], 1,3)),
    task('Выбери низкую башню', choose('tower', H, [1,3], 0,1)),
    task('Найди широкий мост', choose('bridge', W, [1,3], 1,3)),
    task('Найди два карандаша одинаковой длины', choose('pencil', L, [2,3,2], [0,2])),
    task('Сравни по длине, высоте и ширине', choose('rope', L, [3,1], 1,1),
      choose('tree', H, [1,3], 1,3), choose('bridge', W, [3,1], 0,3)),
  ]),
};
