import {keyed56} from './counting.js';
import {token,scene,exercise,pick,connect,stages} from '../math45/builders.js';
import {where,routeTask} from '../math45/routes.js';
const right='right',left='left',up='up',down='down';
export const vectors56={right:[1,0],left:[-1,0],up:[0,-1],down:[0,1]};
const pathOf=(at,steps)=>steps.reduce((path,step)=>{
 const [x,y]=path.at(-1),[dx,dy]=vectors56[step];return [...path,[x+dx,y+dy]];
},[at]);
const walk=(text,at,steps,barriers=[])=>{
 const path=pathOf(at,steps);
 return scene('route',text,[token('lumiBack')],{route:{actor:'lumiBack',at,path,goal:path.at(-1),steps,barriers}});
};
const coords=[[19,21],[80,21],[50,50],[19,81],[80,81]];
const place=(kind,tags,indices=coords.map((_,i)=>i))=>({
 kind,anchor:{...token(kind==='paper'?'paperMap':'lumiBack'),x:50,y:50},
 items:indices.map((index,i)=>({...token(tags[i]),x:coords[index][0],y:coords[index][1]}))
});
const paper=(text,tags,indices)=>scene('locate',text,[],{place:place('paper',tags,indices)});
const mark=(prompt,tag,index,indices=[0,1,2,3,4])=>{
 const map=place('paper',indices.map(()=>'spot'),indices);
 return exercise(prompt,'Выбери фигуру, затем место на листе.',connect([token(tag)],map.items,[indices.indexOf(index)],{place:map}));
};
const paperPick=(prompt,tags,index,sample)=>{const map=place('paper',tags);
 return exercise(prompt,'Посмотри на лист.',pick(map.items,index,sample?token(sample):null,{place:map}));
};
const restore=(prompt,tags,positions)=>stages(prompt,...tags.map((tag,i)=>mark('Положи деталь на отмеченное место',tag,positions[i])));
const sideShow=(text,kind,anchor,first,second,focus)=>{
 const items = (kind==='between' ? [[49,54],[83,74]] : [[20,55],[78,55]]).map(([x,y],i)=>({...token(i?second:first),x,y}));
 return scene('locate',text,[],{place:{kind,items,anchor:{...token(anchor),x:kind==='between'?26:50,y:53},second:kind==='between'?{...token(anchor),x:70,y:53}:null,direction:kind==='front',focus}});
};
const position=(prompt,kind,anchor,tag,index)=>{
 const map=sideShow('',kind,anchor,'spot','spot',index).place;
 return exercise(prompt,'Выбери игрушку, затем её место.',connect([token(tag)],map.items,[index],{place:map}));
};
const guided=(prompt,at,steps,barriers=[])=>routeTask(prompt,'lumiBack',at,steps,barriers);
export const planRoute=(prompt,at,steps,barriers=[],maxSteps=steps.length)=>{
 const path=pathOf(at,steps);
 return exercise(prompt,'Собери стрелки и нажми проверку.',
 pick([token('arrow'+steps[0])],0,null,{plan:{actor:'lumiBack',at,goal:path.at(-1),barriers,maxSteps,hint:steps}}));
};
const compareRoutes=(prompt,at,good,bad)=>{
 const path=pathOf(at,good),card=steps=>({...token('arrowright'),commands:steps});
 return exercise(prompt,'Сравни стрелки с путём на карте.',
 pick([card(bad),card(good)],prompt.startsWith('Найди ошибку')?0:1,null,{route:{actor:'lumiBack',at,goal:path.at(-1),barriers:[],steps:[],trail:path}}));
};
const R='lumiBack', L='lumiSide';
export const spatial56=keyed56(9,'secret-archipelago',[
 [[sideShow('Луми смотрит туда же, куда и мы. Поднимем правую лапку.','side',R,'leftPaw','rightPaw',1),sideShow('Кубик слева, мяч справа.','side',R,'cube','ball',0),paper('Сравним правую и левую половины листа.',['treasure','star'],[0,1])],
 [where('Что справа от Луми?','side',R,'cube ball',1),where('Что слева от Луми?','side',R,'star ball',0),
 stages('Размести игрушки по обе стороны',position('Положи мяч справа','side',R,'ball',1),position('Положи кубик слева','side',R,'cube',0)),
 guided('Выполни три команды',[2,2],[left,right,right]),stages('Собери сокровища с обеих сторон',where('Возьми сокровище слева','side',R,'treasure crystal',0),where('Возьми сокровище справа','side',R,'star crystal',1))]],
 [[sideShow('Впереди Луми мяч.','front',L,'box','ball',1),sideShow('Позади Луми коробка.','front',L,'box','ball',0),sideShow('Сундук теперь между деревьями.','between','tree','treasure','ball',0)],
 [where('Найди предмет впереди','front',L,'box ball',1),where('Выбери предмет позади','front',L,'star apple',0),
 position('Поставь сундук между деревьями','between','tree','treasure',0),
 paperPick('Найди предмет вверху слева',['star','triangle','square','circle','oval'],0,'spot'),
 restore('Расставь пять объектов',['star','triangle','square','circle','oval'],[0,1,2,3,4])]],
 [[paper('У листа есть верхняя и нижняя части.',['star','circle'],[0,3]),paper('Посмотри на середину листа.',['square'],[2]),paper('Звезда сверху, квадрат в середине, круг снизу.',['star','square','circle'],[0,2,3])],
 [mark('Положи звезду в верхнюю часть','star',0,[0,2,3]),mark('Размести круг внизу','circle',3,[0,2,3]),mark('Положи квадрат в середину','square',2,[0,2,3]),
 restore('Восстанови три позиции',['star','square','circle'],[0,2,3]),restore('Собери картинку по пяти указаниям',['star','triangle','square','circle','oval'],[0,1,2,3,4])]],
 [[paper('Верхний левый и верхний правый углы.',['star','triangle'],[0,1]),paper('Нижний левый и нижний правый углы.',['circle','oval'],[3,4]),paper('У каждого уголка своя фигура.',['star','triangle','circle','oval'],[0,1,3,4])],
 [mark('Помести звезду в верхний левый угол','star',0),mark('Размести круг в нижнем правом углу','circle',4),
 paperPick('Что в верхнем правом углу?',['star','triangle','square','circle','oval'],1),
 restore('Восстанови четыре угла',['star','triangle','circle','oval'],[0,1,3,4]),
 restore('Заполни углы и середину',['star','triangle','square','circle','oval'],[0,1,2,3,4])]],
 [[walk('По одной стрелке делаем один шаг.',[1,3],[right]),walk('По трём стрелкам сделаем три шага.',[1,3],[up,right,right]),walk('Теперь пройдём пятишаговый маршрут.',[0,4],[right,up,up,right,right])],
 [guided('Выполни две команды',[1,3],[up,right]),guided('Пройди три шага',[1,3],[up,right,right]),guided('Выполни пять стрелок',[0,4],[right,up,up,right,right]),compareRoutes('Найди ошибку в маршруте',[1,3],[up,right,right],[right,up,left]),guided('Дойди до сундука, обойди дерево',[0,4],[up,right,right,down],[[1,4]])]],
 [[walk('Отметим старт и сундук.',[1,3],[up,right]),walk('Составим путь из стрелок.',[1,3],[up,right,right]),walk('Если впереди дерево, построим обход.',[0,2],[up,right,right,down],[[1,2]])],
 [planRoute('Выбери одну подходящую стрелку',[2,2],[right]),planRoute('Составь маршрут из трёх команд',[1,3],[up,right,right]),compareRoutes('Дополни маршрут нужной стрелкой',[1,3],[up,right,up],[up,right,left]),planRoute('Обойди дерево',[0,2],[up,right,right,down],[[1,2]]),planRoute('Составь и запусти свой маршрут',[0,3],[up,right,right,up,right],[[1,3],[2,3]],7)]],
]);
