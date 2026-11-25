import { num } from '../math56/digits.js';
import { token, scene, exercise, pick, stages, lesson } from '../math45/builders.js';

const show=(text,spec)=>scene('math67-space',text,[token('star')],{spatial67:spec});
const task=(prompt,mode,spec)=>exercise(prompt,'При необходимости попроси взрослого прочитать указания.',pick([num(0)],0,null,{spatial67:{mode,...spec}}));
const route=(prompt,spec)=>task(prompt,'route',spec);
const field=(size,items={},plan=true)=>({size,items,plan});
const choice=(prompt,choices,correct,extras={})=>task(prompt,'choice',{choices,correct,...extras});
const locate=(prompt,board,correct)=>task(prompt,'find',{...board,correct});
const place=(prompt,board,places,reference)=>task(prompt,'place',{...board,places,reference});
const arrows=text=>[...text];
const walk=(size,start,target,commands,blocked=[])=>({size,start,target,commands:arrows(commands),blocked});
const roam=(size,start,target,hint,extra={})=>({size,start,target,hint:arrows(hint),...extra});
const signs=(name,items,index)=>choice(name,items.map(item=>({name:({tree:'Дерево',road:'Дорожка',house:'Домик',treasure:'Сундук',bed:'Кровать',table:'Стол',wardrobe:'Шкаф',chair:'Стул',bridge:'Мост'})[item],icon:item,plan:true})),index);
const maps=(prompt,actual,variants,index)=>choice(prompt,variants.map((map,i)=>({name:'Схема '+(i+1),map})),index,{reference:actual});
const garden=field(4,{0:'tree',1:'house',5:'road',10:'treasure',15:'tree'});
const gardenView={...garden,plan:false};
const room=field(3,{0:'bed',2:'wardrobe',4:'table',7:'chair'});
const roomView={...room,plan:false};
const island=field(5,{0:'lumi',2:'tree',7:'stone',14:'bridge',22:'treasure'});
const islandView={...island,plan:false};
const fromBack=field(3,{3:'crystal',4:'lumi',5:'star'},false);
const fromFront=field(3,{3:'star',4:'lumi',5:'crystal'},false);
const drawSquare={...walk(4,5,5,'→↓←↑'),draw:true};
const drawStairs={...walk(5,20,4,'→↑→↑→↑→↑'),draw:true};
const missing=(prompt,spec,pattern,index)=>choice(prompt,['↑','↓','←','→'],['↑','↓','←','→'].indexOf(spec.commands[index]),
 {board:{...spec,active:spec.start},caption:pattern});
const lessons=[
 [[show('Луми стоит спиной. Его правая сторона совпадает с правой стороной экрана.',{maps:[{...fromBack,caption:'Луми смотрит от нас ↑'}]}),
   show('Луми повернулся к нам. Его правая сторона теперь слева на экране.',{maps:[{...fromBack,caption:'Со спины ↑'},{...fromFront,caption:'Лицом к нам ↓'}]}),
   show('Сверяйся, о чьей правой стороне идёт речь.',{maps:[{...fromFront,caption:'Справа от Луми — звезда. Справа на экране — кристалл.'}]})],
  [locate('Что справа от Луми? Он стоит спиной.',{...fromBack,caption:'Со спины ↑'},5),
   locate('Где правая лапка Луми? Он стоит к нам лицом.',{...field(3,{3:'star',4:'lumi',5:'star'}),caption:'Лицом к нам ↓'},3),
   place('Звезда справа от кристалла, цветок слева.',field(3,{4:'crystal'}),{star:[5],flower:[3]}),
   stages('Следуй указаниям',place('Мост справа от дома',field(3,{4:'house'}),{bridge:[5]}),place('Дерево слева от дома, клад справа.',field(3,{4:'house'}),{tree:[3],treasure:[5]})),
   place('От верхнего Луми, который стоит спиной, положи справа звезду. От нижнего, который смотрит на тебя, положи справа кристалл.',field(4,{1:'lumi',13:'lumi'}),{star:[2],crystal:[12]})]],
 [[show('Клетка ограничена четырьмя линиями. Соседние клетки имеют общую сторону.',{...field(4,{5:'star',6:'crystal'}),active:5}),
   show('Перемещаем фишку на две клетки вправо и одну вверх.',walk(4,8,6,'→→↑')),
   show('Отмечаем центры клеток и получаем рисунок.',drawSquare)],
  [route('Перемести звезду на две клетки вправо',walk(4,4,6,'→→')),route('Выполни четыре команды',walk(4,0,10,'→→↓↓')),
   place('Положи звезду, кристалл и цветок как в образце.',field(4),{star:[1],crystal:[6],flower:[13]},field(4,{1:'star',6:'crystal',13:'flower'})),
   route('Повтори рисунок по командам. Считай шаги между центрами клеток.',{...drawSquare,reference:{...drawSquare,visited:[5,6,10,9]}}),
   route('Нарисуй ступеньки. Двигайся между центрами клеток.',drawStairs)]],
 [[show('Четыре стрелки задают четыре шага.',walk(4,0,10,'→→↓↓')),
   show('Камень перекрывает путь. Через занятую клетку идти нельзя.',{...field(4),blocked:[1],active:0,target:2,caption:'Камень — препятствие'}),
   show('Обойдём камень по соседнему ряду.',walk(4,0,2,'↓→→↑',[1]))],
  [route('Пройди четыре шага',walk(4,0,10,'↓↓→→')),
   route('Пройди шесть шагов',walk(4,0,15,'→→→↓↓↓')),
   missing('Какой стрелки не хватает?',walk(4,4,14,'↓→↓→'),'↓ □ ↓ →',1),
   missing('Замени первую стрелку, чтобы обойти камень.',walk(4,0,2,'↓→→↑',[1]),'□ → → ↑',0),
   route('Пройди лабиринт по стрелкам',walk(5,0,19,'↓↓→→↓→→',[1,6,8,13,16]))]],
 [[show('У сада есть карта с условными знаками.',{maps:[{...gardenView,caption:'Сад'},{...garden,caption:'Карта'}]}),
   show('Треугольник отмечает дерево, двойная линия — дорожку, домик — строение, ромб — сундук.',{maps:[garden]}),
   show('Найдём сундук: сначала на карте, потом на местности.',{maps:[{...garden,target:10},{...gardenView,target:10}]} )],
  [stages('Соотнеси обозначения с четырьмя объектами',...['Дерево','Дорожка','Домик','Сундук'].map((name,i)=>signs('Как обозначить '+name.toLowerCase()+'?', ['tree','road','house','treasure'],i))),
   locate('Отметь сундук на карте сада',garden,10),
   maps('Подбери карту сада',gardenView,[field(4,{0:'tree',1:'house',5:'road',14:'treasure',15:'tree'}),garden,field(4,{0:'house',1:'tree',5:'road',10:'treasure',15:'tree'})],1),
   place('Заполни пропуски на карте сада',field(4,{0:'tree',1:'house',15:'tree'}),{road:[5],treasure:[10]},gardenView),
   locate('Клад находится под дорожкой на одну клетку вниз и на одну вправо.',field(4,{0:'tree',1:'house',5:'road',15:'tree'}),10)]],
 [[show('В комнате кровать, шкаф, стол и стул.',{maps:[{...roomView,caption:'Мебель комнаты'}]}),
   show('На плане мы смотрим на комнату сверху.',{maps:[{...roomView,caption:'Комната'},{...room,caption:'План сверху'}]}),
   show('Заменим мебель знаками и сохраним её положение.',{maps:[room]})],
  [signs('Подбери обозначение кровати. Кровать отмечаем прямоугольником с полосками.',['table','bed','wardrobe','chair'],1),
   place('Отметь стол на плане',field(3,{0:'bed',2:'wardrobe'}),{table:[4]},roomView),
   place('Восстанови четыре объекта по комнате',field(3),{bed:[0],wardrobe:[2],table:[4],chair:[7]},roomView),
   locate('На плане один предмет сдвинут. Найди его.',{...field(3,{0:'bed',2:'wardrobe',5:'table',7:'chair'}),reference:roomView},5),
   place('Поставь кровать в верхнем ряду, шкаф в среднем, стол в нижнем.',field(3),{bed:[0,1,2],wardrobe:[3,4,5],table:[6,7,8]})]],
 [[show('Сначала отметим старт на карте острова.',{...island,active:0,caption:'Старт отмечен месяцем'}),
   show('Доберёмся до дерева за два шага.',walk(5,0,2,'→→',[7])),
   show('Камень занял ближний проход. Обойдём его справа.',walk(5,2,12,'→↓↓←',[7]))],
  [locate('Найди на острове мост, он обозначен широкой полосой.',island,14),
   place('Добавь недостающие знаки на карту острова.',field(5,{0:'lumi',7:'stone'}),{tree:[2],bridge:[14],treasure:[22]},islandView),
   route('Построй маршрут к сундуку из шести или более шагов.',roam(5,0,22,'↓↓↓↓→→',{blocked:[7],min:6})),
   choice('Какой путь от старта до звезды самый короткий?',[
    {name:'Шесть шагов: ↓ ↓ → → ↑ ↑'},{name:'Два шага: → →'},{name:'Четыре шага: ↓ → → ↑'}
   ],1,{board:{size:4,active:0,target:2}}),
   route('Посети дерево, мост и цветок, затем доберись до сундука. Обойди камни.',roam(5,0,22,'→→→→↓↓↓↓←←',{blocked:[7,12,16],via:[2,14,24],items:{2:'tree',14:'bridge',24:'flower'}}))]],
];
export { route, roam, place, locate, field, island };
export const spatial67=Object.fromEntries(lessons.map(([scenes,practice],i)=>['math-67-lesson-8-'+(i+1),lesson('cartographers-guild',scenes,practice)]));
