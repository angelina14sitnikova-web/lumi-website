import {token,set,scene,pick,exercise,connect,stages,keyed} from './builders.js';
import {objects,group} from './counting.js';
const cars='wagon/green wagon/sky wagon/pink wagon/yellow wagon/blue';
const animals='bunny/gray bear/brown cat/white frog/green dogToy/yellow';
const toys='ball/sky car/red boat/blue bear/brown block/green';
const slots=n=>Array.from({length:n},(_,i)=>group('star/yellow',i+1));
const highlight=(text,tags,index)=>scene('highlight',text,set(tags),{focus:index,ordinal:true});
const order=(text,tags)=>scene('counting',text,set(tags),{ordinal:true});
const find=(prompt,tags,index)=>exercise(prompt,'Начинай у стрелки. Ищи нужное место.',pick(set(tags),index,slots(index+1).at(-1),{ordinal:true}));
const place=(prompt,tag,index,n=5)=>exercise(prompt,'Нажми на игрушку, затем на нужное место в ряду.',connect([token(tag)],slots(n),[index],{ordinal:true}));
const which=(prompt,tags,index)=>exercise(prompt,'Найди место выделенного предмета от стрелки.',pick(slots(set(tags).length),index,null,{ordinal:true,cues:set(tags).map((p,i)=>({...p,marked:i===index}))}));
const row=(prompt,from,to,matches)=>exercise(prompt,'Расставь игрушки так же, как на образце.',connect(set(from),set(to),matches,{ordinal:true}));
export const ordinal=keyed(4,'rail-station',[
 [[order('Этот знак показывает начало поезда и направление.',cars),highlight('Первый вагон стоит сразу после знака.',cars,0),highlight('Последний вагон — в самом конце.',cars,4)],
 [find('Найди первый вагон',cars,0),find('Покажи последний вагон',cars,4),find('Выбери первого зверька',animals,0),find('Покажи последнюю машинку','car/red car/blue car/green',2),stages('Начало и конец ряда',place('Мяч в начало','ball/sky',0,3),place('Кубик в конец','block/blue',2,3))]],
 [[order('Вот три игрушки в ряду.','car/red boat/blue bear/brown'),highlight('Слева направо: первая, вторая, третья.','car/red boat/blue bear/brown',1),highlight('Поменяем игрушки. Второе место теперь у медведя.','car/red bear/brown boat/blue',1)],
 [find('Найди первого зайчика','bunny/gray bunny/white bunny/brown',0),find('Выбери второго медведя','bear/brown bear/yellow bear/pink',1),find('Найди третий вагон','wagon/pink wagon/green wagon/sky',2),place('Поставь игрушку на второе место','car/red',1,3),row('Восстанови три игрушки по образцу','car/red boat/blue bear/brown','bear/brown car/red boat/blue',[1,2,0])]],
 [[order('Перед нами ряд из пяти вагонов.',cars),highlight('Четвёртый вагон — перед последним.',cars,3),highlight('Пятый вагон стоит в конце ряда.',cars,4)],
 [find('Найди четвёртый вагон',cars,3),find('Выбери пятого зверька',animals,4),place('Поставь игрушку на четвёртое место','bear/brown',3),find('Найди пятый предмет',toys,4),stages('Найди несколько мест',find('Первый',cars,0),find('Третий',cars,2),find('Пятый',cars,4),find('Второй',cars,1),find('Четвёртый',cars,3))]],
 [[highlight('Выделим красную машинку.','car/blue car/red car/green',1),order('Считаем от стрелки: красная машинка вторая.','car/blue car/red car/green'),highlight('Поменяем места. Теперь красная машинка третья.','car/blue car/green car/red',2)],
 [which('Какое место у красного вагона?','wagon/sky wagon/red wagon/yellow',1),which('На каком месте зайчик?',animals,0),which('Выбери место выделенной игрушки',toys,3),stages('Найди места двух предметов',which('Где выделенный вагон?',cars,2),which('Где выделенный зверёк?',animals,3)),stages('Найди пассажиров',find('Найди второго',animals,1),find('Найди пятого',animals,4))]],
 [[order('На полке есть места. Начинаем у стрелки.', 'spot spot spot spot spot'),highlight('Игрушка заняла третье место.','spot spot bear/brown spot spot',2),highlight('Другую игрушку ставим на пятое место.','spot spot bear/brown spot car/red',4)],
 [place('Поставь медведя на первое место','bear/brown',0),place('Поставь машинку на третье место','car/red',2),find('Найди игрушку на четвёртом месте',toys,3),place('Перемести зайчика на пятое место','bunny/gray',4),stages('Расставь три игрушки',place('Кубик на второе','block/blue',1),place('Мяч на четвёртое','ball/red',3),place('Медведя на первое','bear/brown',0))]],
 [[order('Зверята встали в очередь. Считаем от начала.',animals),order('У каждого зверька своё место.',animals),order('Запомним этот образец.',toys)],
 [exercise('Выбери первый и последний предмет','Начни у стрелки и отметь оба края.',pick(set(toys),[0,4],null,{ordinal:true})),which('Определи место выделенного вагона',cars,3),
  exercise('Найди, что стоит не на своём месте','Сравни с рядом-образцом.',pick(set('ball/sky car/red block/green bear/brown'),2,null,{ordinal:true,cues:set('ball/sky car/red boat/blue bear/brown')})),
  row('Восстанови ряд из пяти игрушек','bear/brown boat/blue block/green ball/sky car/red',toys,[3,2,4,0,1]),
  row('Рассади пассажиров на пять мест','bear/brown frog/green bunny/gray dogToy/yellow cat/white',animals,[1,3,0,4,2])]],
]);
