import { piece, lesson, scene, exercise, pick, connect, sortBy } from './sensory-builders.js';

const C = 'circle', S = 'square', T = 'triangle', R = 'rectangle';
const paints = ['sky', 'pink', 'yellow', 'green', 'blue'];
const row = (...names) => names.map((name, i) => {
  const [shape, size, turn, paint] = [].concat(name);
  return { ...piece(shape, paint || paints[i % paints.length], size), turn };
});
const cue = shape => piece(shape, 'pink');
const find = (prompt, shape, names, correct) => exercise(prompt,
  'Сравни форму с образцом и нажми на подходящие детали.', pick(row(...names), correct, cue(shape)));
const outline = (text, shape) => scene('trace', text, row([shape, 'large']));
const show = (text, ...names) => scene('together', text, row(...names));
const group = (pieces, shapes) => sortBy(pieces, shapes.map(cue), 'shape');
const sort = (prompt, names, shapes) => exercise(prompt,
  'Нажми на деталь, потом на окошко с такой же формой.', group(row(...names), shapes));
const move = (text, names, targets, matches, effect = 'move') =>
  scene(effect, text, row(...names), { targets: row(...targets), matches });
const build = (prompt, names, targets, matches) => exercise(prompt,
  'Нажми на деталь и выбери место с подходящим контуром.',
  connect(row(...names), row(...targets), matches, { assembly: true }));
const home = [T,S,C], parts = [C,T,S];

export const shapesLessons = {
  'shapes-1': lesson('city', [
    outline('Смотри, как Луми обводит плавный край круга.', C),
    show('Маленький розовый и большой голубой — оба круги.', [C,'large'], [C,'small']),
    move('Колесо и циферблат часов похожи на круг.', ['wheel','clock'], [C], [0,0]),
  ], [
    find('Найди круг', C, [S,C], 1),
    find('Выбери все круги', C, [C,T,S,C], [0,3]),
    find('Подбери фигуру к круглому образцу', C, [T,C,R], 1),
    find('Найди круги разных размеров', C, [[C,'small'], [S,'large'],[C,'large'],[T,'small']], [0,2]),
    build('Собери круглые детали для машинки', ['wheel',[C,'small']], [S,C], [1,1]),
  ]),
  'shapes-2': lesson('city', [
    outline('Луми обводит квадрат. Вот его прямые края и уголки.', S),
    show('У квадрата заметны уголки. У круга край плавный.', S,C),
    show('Квадратные плитки бывают разного цвета.', 'tile','tile','tile'),
  ], [
    find('Найди квадрат', S, [S,C], 0),
    find('Выбери квадрат среди фигур', S, [C,T,S], 2),
    find('Найди все квадраты разных цветов', S, [S,C,[S,'small',25],T,S], [0,2,4]),
    find('Подбери квадрат к образцу', S, [[T,'large'],[S,'small',30],[R,'middle']], 1),
    build('Собери квадратные плитки для дорожки', ['tile','tile','tile'], [C,S], [1,1,1]),
  ]),
  'shapes-3': lesson('city', [
    outline('Луми проводит по краям треугольника и обходит его уголки.', T),
    show('Сравни треугольник и квадрат. Их контуры разные.', T,S),
    move('Крыши этих домиков похожи по форме на треугольники.', ['roof','roof'], [T], [0,0]),
  ], [
    find('Найди треугольник', T, [C,T], 1),
    find('Выбери все треугольники', T, [[T,'small',35],S,C,T,R], [0,3]),
    find('Найди треугольник другого цвета', T, [[S,'middle',0,'pink'],[T,'middle',24,'blue'],C], 1),
    build('Подбери треугольную крышу к домику', ['roof'], [S,T], [1]),
    find('Собери треугольники для украшения города', T, [T,[T,'small',28],C,[T,'middle',-26]], [0,1,3]),
  ]),
  'shapes-4': lesson('geometry', [
    outline('Посмотри на вытянутый прямоугольник и его контур.', R),
    show('Слева вытянутый прямоугольник. Справа квадрат. Сравни их длину и ширину.', R,S),
    move('Дверь и обложка книги похожи на вытянутый прямоугольник.', ['door','paper'], ['doorShape'], [0,0]),
  ], [
    find('Найди вытянутый прямоугольник', R, [R,C], 0),
    find('Выбери прямоугольник среди фигур', R, [C,[R,'large',90],T], 1),
    find('Найди все вытянутые прямоугольники', R, [R,S,[R,'small',90],T,R], [0,2,4]),
    build('Подбери прямоугольную дверь к домику', ['door'], [S,'doorShape'], [1]),
    sort('Отсортируй вытянутые прямоугольники и круги', [C,[R,'middle',90],R,[C,'small']], [R,C]),
  ]),
  'shapes-5': lesson('city', [
    move('Колесо похоже на круг.', ['wheel'], [C], [0]),
    move('Окно похоже на квадрат.', ['window'], [S], [0]),
    move('Крыша похожа на треугольник.', ['roof'], [T], [0]),
  ], [
    find('Найди предмет, похожий на круг', C, ['door','wheel','window'], 1),
    find('Выбери квадратное окно', S, ['roundWindow','tallWindow','window'], 2),
    find('Найди треугольную крышу', T, ['roof','flatRoof','roundRoof'], 0),
    build('Подбери прямоугольную дверь', ['door'], [C,'doorShape',S], [1]),
    build('Соедини предметы с образцами фигур', ['window','wheel','roof','door'], [C,'doorShape',T,S], [3,0,2,1]),
  ]),
  'shapes-6': lesson('geometry', [
    move('Круги идут к круглому образцу, квадраты — к квадратному.', [C,S,C,S], [C,S], [0,1,0,1]),
    move('Добавим место для треугольников.', [T,S,C], [S,T,C], [1,0,2]),
    move('Круги любого цвета подходят к круглой метке.', [C,[C,'small'],[C,'large']], [C,S], [0,0,0]),
  ], [
    sort('Разложи круги и квадраты', [C,S,[S,'small',25],C], [S,C]),
    sort('Разложи круги и треугольники', [T,C,[T,'large',20],[C,'small']], [C,T]),
    sort('Разложи фигуры трёх видов', [C,S,[T,'small',-25],T,[S,'middle',30],C], [T,S,C]),
    exercise('Найди ошибку в коробке с квадратами', 'Сравни каждую деталь с квадратной меткой.', pick(row(S,T,S,S),1,cue(S),{setting:'odd'})),
    sort('Разложи четыре вида деталей по образцам', [C,S,[R,'large',90],T,[S,'small',25],R], [S,C,R,T]),
  ]),
  'shapes-7': lesson('geometry', [
    show('Повторим знакомые формы: круг, квадрат и треугольник.', C,S,T),
    move('В домике можно увидеть треугольную крышу, квадратную стену и круглое окно.',
      ['roof','wall','roundWindow'], home, [0,1,2], 'assemble'),
    move('Из готовых фигур складываем ещё один домик.', parts, home, [2,0,1], 'assemble'),
  ], [
    find('Найди треугольник среди четырёх фигур', T, [C,R,[T,'small',25],S], 2),
    find('Подбери фигуру по образцу', S, [R,C,[S,'small',25]], 2),
    exercise('Найди лишнюю фигуру', 'Здесь собирают круги. Нажми на деталь другой формы.', pick(row(C,C,T,C),2,cue(C),{setting:'odd'})),
    build('Собери домик из трёх фигур', parts, home, [2,0,1]),
    exercise('Восстанови геометрический город', 'Подбери детали к контурам мастерской, часовой башни и ворот.',
      connect(row(T,S,C),row(...home),[0,1,2],{assembly:true}),
      connect(row('clock','door','window','roof'),row(S,C,T,'doorShape'),[1,3,0,2],{assembly:true})),
  ]),
};
