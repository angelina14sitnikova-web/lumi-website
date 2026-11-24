import { piece, lesson, scene, exercise, pick, connect } from './sensory-builders.js';

const C='circle', S='square', T='triangle', B='sphere', K='cube';
const paints=['sky','pink','green','yellow','blue'];
const items=(...shapes)=>shapes.map((shape,index)=>{
  const [name,size,turn]=[].concat(shape);
  return {...piece(name,paints[index%paints.length],size),turn};
});
const cue=shape=>piece(shape,'pink');
const trace=(text,shape)=>scene('trace',text,items([shape,'large']));
const show=(text,...shapes)=>scene('together',text,items(...shapes));
const find=(prompt,shape,options,answer)=>exercise(prompt,'Нажми на предметы подходящей формы.',
  pick(items(...options),answer,cue(shape)));
const move=(text,from,to,destinations)=>scene('move',text,items(...from),{targets:items(...to),matches:destinations});
const sort=(prompt,from,to,matches)=>exercise(prompt,'Нажми на предмет, затем на подходящий контур.',
  connect(items(...from),items(...to),matches));
const spin=(text,shape,effect='spin')=>scene(effect,text,items([shape,'large']));

export const shapeWorldLessons={
  'shape-world-1':lesson('living-city',[
    trace('Луми обводит плавный край круга.',C),
    move('Если посмотреть прямо, край колеса и край тарелки похожи на круг.',['wheel','plate'],[C],[0,0]),
    show('Край круглого окна плавный. У квадратного видны уголки.','roundWindow','window'),
  ],[
    find('Найди круглое окно',C,['window','roundWindow'],1),
    find('Выбери круглую тарелку',C,['squarePlate','plate','longPlate'],1),
    find('Найди все круглые колёса',C,['wheel','tile','roof',['wheel','small']], [0,3]),
    find('Подбери круглый значок',C,[T,'badge',S],1),
    sort('Укрась домик круглыми окошками',['roundWindow',['roundWindow','small']],[S,C],[1,1]),
  ]),
  'shape-world-2':lesson('living-city',[
    trace('Луми ведёт по краю квадрата от уголка к уголку.',S),
    move('Край плитки и край окна похожи на квадрат.',['tile','window'],[S],[0,0]),
    show('У квадратной рамки есть уголки. У круглой край плавный.','squareFrame','roundFrame'),
  ],[
    find('Выбери квадратное окно',S,['roundWindow','window'],1),
    find('Найди квадратную плитку',S,['plate','longPlate','tile'],2),
    find('Отметь все квадратные рамки',S,['squareFrame','roundFrame',['squareFrame','small',25]], [0,2]),
    find('Подбери квадратную деталь к образцу',S,[T,C,[S,'small',30]],2),
    sort('Собери квадратные плитки для дорожки',['tile',['tile','small'],'tile'],[C,S],[1,1,1]),
  ]),
  'shape-world-3':lesson('living-city',[
    trace('Луми обводит треугольник вдоль его сторон.',T),
    move('Если посмотреть на домик спереди, крыша похожа на треугольник.',['roof'],[T],[0]),
    show('Флажки разные: один похож на треугольник, другой — на квадрат.','flag','squareFlag'),
  ],[
    find('Выбери треугольный флажок',T,['flag','squareFlag'],0),
    find('Найди треугольную крышу',T,['flatRoof','roundRoof','roof'],2),
    find('Отметь все треугольные детали',T,[S,T,C,['roof','small',20]], [1,3]),
    find('Подбери треугольную фигуру',T,[[T,'small',35],C,S],0),
    exercise('Укрась три домика треугольными деталями','На каждой площадке подбери деталь к крыше.',
      connect(items('roof'),items(S,'houseTriangle'),[1]),
      connect(items('flag'),items('houseTriangle',C),[0]),
      connect(items([T,'small']),items(C,'houseTriangle'),[1])),
  ]),
  'shape-world-4':lesson('toy-shop',[
    spin('Это объёмный шар. При повороте он остаётся таким же округлым.',B),
    spin('Шар плавно катится: на нём нет уголков.',B,'roll'),
    show('Мяч и шарик похожи на шар. Рядом плоский круг.','ball',B,C),
  ],[
    find('Найди шар',B,[K,B],1),
    find('Найди предмет, похожий на шар',B,['wheel','ball','block'],1),
    find('Найди все шарообразные игрушки',B,['ball',C,'block',[B,'small']], [0,3]),
    sort('Собери шарообразные предметы в корзину',['ball',B],['sphereBasket'],[0,0]),
    sort('Разложи игрушки по образцам',['ball','block',B,'wheel'],[B,'basket'],[0,1,0,1]),
  ]),
  'shape-world-5':lesson('toy-shop',[
    spin('Посмотри, как поворачивается куб и открывает разные стороны.',K),
    spin('У куба плоские квадратные грани. Посмотри на подсвеченную грань.',K,'face'),
    show('У кубика есть грани и уголки. У шара поверхность округлая.',K,B),
  ],[
    find('Найди куб',K,[K,B],0),
    find('Выбери игрушечный кубик',K,['ball','tile','block'],2),
    find('Найди все предметы, похожие на куб',K,['block',S,[K,'small'],'ball'],[0,2]),
    find('Подбери предмет к объёмному образцу',K,[S,'block',B],1),
    sort('Разложи кубики и шарики',['block','ball',B,K],[B,K],[1,0,0,1]),
  ]),
  'shape-world-6':lesson('living-city',[
    move('Круг подходит к круглому окну.',[C],['roundWindow'],[0]),
    move('Квадрат подходит к квадратной плитке.',[S],['tile'],[0]),
    move('Треугольник подходит к треугольному флажку.',['flag'],[T],[0]),
  ],[
    exercise('Подбери фигуру к круглому окну','Нажми на фигуру подходящей формы.',pick(items(S,C,T),1,cue('roundWindow'))),
    exercise('Найди образец для квадратной плитки','Нажми на фигуру подходящей формы.',pick(items(S,T,C),0,cue('tile'))),
    exercise('Выбери фигуру для треугольного флажка','Нажми на фигуру подходящей формы.',pick(items(C,S,T),2,cue('flag'))),
    sort('Соедини предметы с фигурами',['roundWindow','tile','flag'],[S,T,C],[2,0,1]),
    sort('Восстанови вывески',['badge','squareFrame','flag'],[T,C,S],[1,2,0]),
  ]),
  'shape-world-7':lesson('toy-shop',[
    move('Круглые и квадратные детали идут к своим меткам.',['wheel','tile','plate'],[C,S],[0,1,0]),
    move('Добавим корзину для треугольных деталей.',['tile','roof','wheel'],[T,S,C],[1,0,2]),
    move('Цвет кругов меняется, а форма остаётся одинаковой.', ['wheel','plate',C],[C,S],[0,0,0]),
  ],[
    sort('Разложи круглые и квадратные детали',['wheel','tile','plate','window'],[S,C],[1,0,1,0]),
    sort('Разложи квадратные и треугольные детали',['tile','roof','flag','window'],[T,S],[1,0,0,1]),
    sort('Разложи предметы трёх форм',['wheel','window','roof','plate','tile','flag'],[S,C,T],[1,0,2,1,0,2]),
    exercise('Найди ошибку в корзине с круглыми деталями','Нажми на предмет другой формы.',
      pick(items('plate','window','wheel','badge'),1,cue(C),{setting:'odd'})),
    exercise('Восстанови порядок в Городе оживших фигур','Разложи предметы по подходящим меткам.',
      connect(items('badge','tile','flag','plate'),items(T,S,C),[2,1,0,2]),
      connect(items('ball','block',K,B),items(K,B),[1,0,0,1])),
  ]),
};
