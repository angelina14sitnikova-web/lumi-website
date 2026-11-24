import {keyed56} from './counting.js';
import {measure,measurePick,series} from '../math45/magnitude.js';
import {token,scene,exercise,connect,pick,stages} from '../math45/builders.js';
import {num} from './digits.js';
const sizes=[23,35,47,59,71,83,95];
const orderSize=(prompt,tag,axis,values,desired)=>series(prompt,tag,axis,values.map(n=>n/100),desired.map(n=>n/100));
const line=(tag,axis,values)=>values.map(v=>measure(tag,axis,v/100));
const demoOrder=(text,tag,axis,values)=>{
 const ordered=[...values].sort((a,b)=>a-b);
 return scene('move',text,line(tag,axis,values),{targets:line(tag,axis,ordered),matches:values.map(n=>ordered.indexOf(n)),ordinal:true});
};
const slot=(tag,axis,index)=>{
 const values=sizes.slice(0,5), sample=measure(tag,axis,values[index]/100);
 return exercise('Вставь недостающий предмет','Посмотри на соседние предметы в ряду.',
 pick([token('spot'),token('spot'),token('spot'),token('spot'),token('spot')].map((t,i)=>i===index?t:measure(tag,axis,values[i]/100)),index,sample,{ordinal:true,sequence:true}));
};
const seriesLesson=(axis,tag,alternate,upper,lower,alignment)=>[
 [scene('align',alignment,line(tag,axis,[35,59,83,47,71]),{focus:1}),
 demoOrder('Расположим пять предметов по порядку.',tag,axis,[71,23,47,35,59]),
 scene('highlight','Новый предмет встанет между двумя соседними по величине.',line(tag,axis,[35,47,59]),{focus:1,ordinal:true})],
 [measurePick(upper? 'Найди самый большой по этому признаку':'Найди самый маленький по этому признаку',tag,axis,[.59,.95,.35,.71],upper?1:2),
 orderSize(lower,tag,axis,[71,23,47,35,59],[23,35,47,59,71]),
 orderSize('В обратном порядке',alternate,axis,[59,83,35,71,47,23],[83,71,59,47,35,23]),
 slot(tag,axis,2),
 orderSize('Исправь порядок семи предметов',tag,axis,[59,83,35,71,95,47,23],sizes)]
];
const ruler=(n,axis,tag,offsets)=>({shape:tag,color:'sky',unitDiagram:{n,axis,offsets}});
const useUnits=(prompt,n,axis,tag)=>exercise(prompt,'Приложи одинаковые мерки от начала до конца.',
 {...connect(Array.from({length:n},()=>token('measureUnit')),Array.from({length:n},()=>token('measureUnit')),Array.from({length:n},(_,i)=>i),{interchangeable:true,ordered:true}),unitTrack:{n,axis,tag},unitOrder:axis==='height'?'reverse':'forward'});
const broken=(axis,tag,offsets)=>ruler(offsets.length,axis,tag,offsets);
const correctMeasure=(prompt,n,axis,tag)=>exercise(prompt,'Проверь стыки мерок.',pick([broken(axis,tag,[0,.4,0]),ruler(n,axis,tag),broken(axis,tag,[0,-.4,0])],1));
const demonstration=(text,n,axis,tag)=>scene('highlight',text,[ruler(n,axis,tag)],{focus:0});
const length='length', width='width', height='height', ribbon='ribbon/pink', road='road/sky', tower='tower/blue', bridge='bridge/blue';
const showMeasure=(prompt,tag,values,index,sample)=>measurePick(prompt,tag,length,values.map(n=>n/100),index,sample/100);
export const measurement=keyed56(8,'measurement-lab',[
 seriesLesson(length,ribbon,'strip/blue',true,'Расположи пять полосок от короткой к длинной','Совместим начала лент. Смотрим, где заканчивается каждая.'),
 seriesLesson(height,tower,'tree/green',false,'Расставь пять башен от низкой к высокой','Поставим башни на одну линию основания.'),
 seriesLesson(width,road,bridge,true,'Расположи пять полосок от узкой к широкой','Сравним ширину полосок одинаковой длины.'),
 [[scene('align','Ленты далеко друг от друга. Возьмём переносную мерку.',line(ribbon,length,[47,71]),{focus:1}),
 scene('overlay','Первая мерка равна длине одной ленты.',line('strip/blue',length,[47]),{targets:line(ribbon,length,[47]),matches:[0]}),
 scene('overlay','Приложим ту же мерку ко второй ленте.',line('strip/blue',length,[47]),{targets:line(ribbon,length,[71]),matches:[0]})],
 [showMeasure('Подбери мерку к образцу','strip/blue',[35,71,59],2,59),
 exercise('Перенеси мерку к ленте','Совмести начало мерки и ленты.',connect(line('strip/blue',length,[47]),line(ribbon,length,[47]),[0],{overlay:true})),
 showMeasure('Какая лента длиннее мерки?',ribbon,[35,71,47],1,47),
 showMeasure('Найди вторую ленту той же длины',ribbon,[35,71,47],2,47),
 stages('Сравни три предмета с одной меркой',showMeasure('Найди предмет короче мерки',ribbon,[35,71],0,47),showMeasure('Найди предмет одной длины с меркой',ribbon,[59,47],1,47),showMeasure('Найди предмет длиннее мерки',ribbon,[47,83],1,47))]],
 [[demonstration('Прикладываем первую мерку к началу дорожки.',1,length,'road'),
 demonstration('Следующая мерка начинается там, где заканчивается предыдущая.',3,length,'road'),
 demonstration('Считаем: в дорожке ровно три одинаковые мерки.',3,length,'road')],
 [useUnits('Измерь дорожку тремя мерками',3,length,'road'),useUnits('Измерь ленту пятью мерками',5,length,'ribbon'),
 stages('Исправь промежуток между мерками',correctMeasure('Найди дорожку без промежутков',3,length,'road'),useUnits('Теперь уложи мерки рядом',3,length,'road')),
 exercise('Где мерки наложены?', 'Мерки должны только касаться краями.',pick([ruler(3,length,'road'),broken(length,'road',[0,-.4,0])],1)),
 stages('Измерь обе дорожки одной меркой',useUnits('Первая дорожка',3,length,'road'),useUnits('Вторая дорожка',4,length,'road'),exercise('Какая дорожка длиннее?','Сравни мерки.',pick([ruler(3,length,'road'),ruler(4,length,'road')],1)))]],
 [[demonstration('Измерим мостик поперёк, чтобы узнать ширину.',3,width,'bridge'),
 demonstration('Начнём измерять башню от основания.',4,height,'tower'),
 scene('highlight','Сравним ширину двух мостиков одной меркой.',[ruler(3,width,'bridge'),ruler(4,width,'bridge')],{focus:1})],
 [useUnits('Измерь ширину дорожки',3,width,'road'),useUnits('Измерь высоту башни',4,height,'tower'),correctMeasure('Найди правильное измерение',3,height,'tower'),
 stages('Сравни ширину мостиков',useUnits('Первый мостик',2,width,'bridge'),useUnits('Второй мостик',4,width,'bridge'),exercise('Какой мостик шире?','Сравни мерки.',pick([ruler(2,width,'bridge'),ruler(4,width,'bridge')],1))),
 stages('Измерь две башни и подбери числа',useUnits('Низкая башня',3,height,'tower'),useUnits('Высокая башня',5,height,'tower'),exercise('Подбери числа к башням','Сосчитай мерки.',connect([ruler(3,height,'tower'),ruler(5,height,'tower')],[num(5),num(3)],[1,0])))]],
]);
