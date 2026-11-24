import {token,set,show,scene,exercise,pick,connect,choose,stages,keyed} from './builders.js';

const vectors={right:[1,0],left:[-1,0],up:[0,-1],down:[0,1]};
const directions=['left','up','down','right'];
const arrows=directions.map(key=>token('arrow'+key));
const walk=(begin,steps)=>steps.reduce((path,step)=>{
 const last=path.at(-1),delta=vectors[step];return [...path,[last[0]+delta[0],last[1]+delta[1]]];
},[begin]);
export const routeRound=(actor,begin,steps,barriers=[],free=false)=>{
 const path=walk(begin,steps),goal=path.at(-1);
 return steps.map((dir,index)=>pick(arrows,directions.indexOf(dir),null,{
  route:{actor,at:path[index],next:path[index+1],goal,steps:steps.slice(index),
    barriers:free ? Array.from({length:25},(_,cell)=>[cell%5,Math.floor(cell/5)])
      .filter(([x,y])=>!path.slice(index).some(([px,py])=>px===x && py===y)) : barriers,free}
 }));
};
export const routeTask=(prompt,actor,begin,steps,barriers=[],free=false)=>exercise(prompt,'Посмотри на стрелки и проведи героя.',
 ...routeRound(actor,begin,steps,barriers,free));
const routeScene=(text,actor,begin,steps,barriers=[])=>scene('route',text,[token(actor)],
 {route:{actor,path:walk(begin,steps),at:begin,goal:walk(begin,steps).at(-1),steps,barriers}});
const arrowsCard=(...steps)=>({...token('arrowright'),commands:steps});
const sequence=(prompt,good,bad)=>exercise(prompt,'Сравни маршрут с картинками стрелок.',
 pick([arrowsCard(...bad),arrowsCard(...good)],1,null,{route:{actor:'lumiBack',at:[1,2],goal:walk([1,2],good).at(-1),
  steps:[],barriers:[],trail:walk([1,2],good)}}));
const location=(kind,anchor,shapes,answer)=>{
 const coords={front:[[20,55],[78,55]],vertical:[[52,20],[52,83]],side:[[22,55],[79,55]],between:[[49,57],[84,72]]}[kind];
 return {items:shapes.map((shape,i)=>({...token(shape),x:coords[i][0],y:coords[i][1]})),
  anchor:{...token(anchor),x:kind==='between'?27:50,y:53},second:kind==='between'?{...token(anchor),x:70,y:53}:null,
  direction:kind==='front',focus:answer,kind};
};
export const where=(prompt,kind,anchor,tags,index)=>{
 const place=location(kind,anchor,tags.split(' '),index);
 return exercise(prompt,'Посмотри на ориентир в центре.',pick(place.items,index,null,{place}));
};
const showWhere=(text,kind,anchor,tags,index)=>scene('locate',text,[],{place:location(kind,anchor,tags.split(' '),index)});
const drop=(prompt,kind,actor,tag,index)=>{
 const place=location(kind,actor,['spot','spot'],index);
 return exercise(prompt,'Нажми на игрушку, потом на свободное место.',connect([token(tag)],place.items,[index],{place}));
};
const side='lumiSide', back='lumiBack';
const course='route-island';
const method=[
 [side,'right','left','вперёд','назад',[[1,2],[2,2]],'Дорожка идёт туда, куда смотрит Луми.'],
 ['lift','up','down','вверх','вниз',[[2,3],[2,1]],'У лифта есть уровни. Стрелки показывают вверх и вниз.'],
 [back,'right','left','направо','налево',[[1,2],[2,2]],'Луми стоит спиной к нам. Его правая сторона совпадает с нашей.'],
];
const basic=method.map(([actor,a,b,label,opposite,[start,end],intro],i)=>[
 [routeScene(intro,actor,start,[a]),routeScene('Двигаемся '+opposite+'.',actor,end,[b]),routeScene('Выполним два перемещения по порядку.',actor,start,[a,b])],
 [routeTask('Сделай шаг '+label,i===1?'star':actor,start,[a]),routeTask('Сделай шаг '+opposite,i===1?'balloon':actor,end,[b]),
  routeTask('Сделай два шага '+label,actor,start,[a,a]),routeTask('Сначала '+label+', затем '+opposite,actor,start,[a,b]),
  routeTask('Собери предметы по дороге',actor,start,[a,a,b,a])]
]);
export const routes=keyed(8,course,[
 ...basic,
 [[showWhere('Мяч перед домиком, коробка за домиком.','front','house','box ball',1),
 showWhere('Одна игрушка над полкой, другая под ней.','vertical','shelf','bear car',0),
 showWhere('Смотрим на Луми со спины. Мяч справа, кубик слева.','side',back,'block ball',1)],
 [where('Что перед домиком?','front','house','box ball',1),where('Найди игрушку под столом','vertical','shelf','ball car',1),
  where('Найди предмет между деревьями','between','tree','bear car',0),where('Что справа от Луми?','side',back,'bear ball',1),
  stages('Размести три предмета',drop('Мяч перед домом','front','house','ball',1),drop('Кубик под полкой','vertical','shelf','block',1),drop('Игрушка слева','side',back,'bear',0))]],
 [[routeScene('Одна стрелка — одно перемещение.',back,[1,2],['right']),
 routeScene('Выполняем две команды по порядку.',back,[1,2],['right','up']),
 routeScene('Теперь три команды подряд.',back,[1,2],['right','up','right'])],
 [routeTask('Выполни одну команду',back,[1,2],['right']),routeTask('Две команды',back,[1,2],['up','right']),
  routeTask('Выполни три шага',back,[1,2],['right','up','right']),
  sequence('Подбери правильные стрелки',['up','right'],['right','down']),
  routeTask('Дойди до сундука',back,[1,3],['right','up','up','right'])]],
 [[routeScene('На поле есть клетки. Луми движется от клетки к клетке.',back,[1,2],['right']),
 routeScene('Пройдём по стрелкам к сокровищу.',back,[1,3],['right','right','up']),
 routeScene('Обойдём препятствие сверху.',back,[1,2],['up','right','right','down'],[[2,2]])],
 [routeTask('Пройди два шага',back,[1,2],['right','up']),routeTask('Собери звезду',back,[1,3],['up','right','up']),
 routeTask('Обойди препятствие',back,[1,2],['up','right','right','down'],[[2,2]]),
 sequence('Подбери стрелки к пути',['up','right','up'],['right','right','up']),
 routeTask('Сам найди дорогу к сундуку',back,[1,2],['right','up','right'],[[1,1],[3,2],[2,3]],true)]],
]);
