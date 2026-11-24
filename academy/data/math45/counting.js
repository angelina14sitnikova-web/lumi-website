import {token,set,show,move,scene,exercise,pick,connect,choose,join,stages,keyed} from './builders.js';

export const objects=(tag,n)=>Array.from({length:n},()=>token(tag));
export const group=(tag,count,extra={})=>({...token(tag),count,...extra});
export const groups=(tag,...counts)=>counts.map(n=>group(tag,n));
const visual=(n)=>group('star/yellow',n);
const all=pieces=>pieces.map((_,i)=>i);
export const countScene=(text,pieces,extra={})=>scene('counting',text,pieces,extra);
export const pickGroup=(prompt,tag,counts,index,example=counts[index],extra={})=>
 exercise(prompt,'Сравни картинки с образцом.',pick(groups(tag,...counts),index,visual(example),extra));
export const count=(prompt,pieces,extra={})=>exercise(prompt,'Нажимай на предметы по одному.',pick(pieces,all(pieces),null,{tally:true,...extra}));
export const gather=(prompt,pieces,n)=>exercise(prompt,'Выбирай предметы, пока все места в образце не заполнены.',
 pick(pieces,pieces.slice(0,n).map((_,i)=>i),visual(n),{take:n,tally:true}));
export const fill=(prompt,tag,n,target='basket')=>exercise(prompt,'Нажимай на предмет, затем на корзину. Сверяйся с образцом.',
 connect([token(tag)],[token(target)],[0],{repeat:n,sample:visual(n)}));
export const compare=(prompt,a,b,index)=>exercise(prompt,'Составь пары и рассмотри группы.',pick([a,b],index,null,{pairCounts:[a.count,b.count]}));
export const balance=(prompt,a,b,action)=>exercise(prompt,'Выбери действие, подходящее для нижнего ряда.',
 pick(set('addOne takeOne'),action==='add'?0:1,null,{balance:[a,b],action}));
export const groupSort=(prompt,tag,counts,targets)=>exercise(prompt,'Соедини каждую группу с образцом количества.',
 connect(groups(tag,...counts),targets.map(visual),counts.map(n=>targets.indexOf(n))));
const events=(action,n)=>({action,n});
const actionScene=(text,action,n)=>scene('events',text,[token(action)],{events:events(action,n)});
const eventTask=(prompt,action,n,counts,index)=>exercise(prompt,'Посмотри на движения и отметки.',pick(counts.map(visual),index,null,{events:events(action,n)}));

export const countFive=keyed(2,'treasure-valley',[
 [[countScene('Вот одно яблоко.',objects('apple/red',1)),
   countScene('Добавилось ещё одно. Считаем: одно, два.',objects('apple/red',2)),
   countScene('На одной карточке одно яблоко, на другой два.',groups('apple/red',1,2))],
 [pickGroup('Найди один предмет','apple/red',[2,1],1),pickGroup('Найди две игрушки','bear/brown',[1,2,3],1),fill('Положи два яблока в корзину','apple/red',2),balance('Добавь к одному ещё один',group('apple/red',2),group('apple/red',1),'add'),groupSort('Разложи картинки: один и два','ball/sky',[2,1,2,1],[1,2])]],
 ...[
   [3,'ball/sky','apple/red','block/blue','flower/pink'],
   [4,'star/yellow','star/yellow','car/green','apple/red'],
   [5,'flower/pink','flower/pink','balloon/sky','berry/pink'],
 ].map(([n,demonstration,selection,tally,collect])=>[
   [countScene('Посмотри, сколько предметов было сначала.',objects(demonstration,n-1)),
   countScene('Добавим ещё один предмет.',objects(demonstration,n),{added:true}),
   countScene('Отмечаем каждый предмет один раз. Последняя отметка показывает количество всей группы.',objects(demonstration,n))],
   [pickGroup('Найди группу по образцу',selection,[n-1,n,n===5?3:n+1],1),
   count('Пересчитай каждый предмет',objects(tally,n)),
   fill('Собери предметы в корзину',collect,n),
   balance('Добавь недостающий предмет',group(collect,n),group(collect,n-1),'add'),
   n===3?stages('Собери три группы',fill('Собери яблоки','apple/red',3),fill('Собери кубики','block/sky',3),fill('Собери цветы','flower/pink',3)):
     n===4?exercise('Найди все группы из четырёх', 'Сравни каждый ряд с образцом.',pick(groups('ball/sky',4,2,4,3),[0,2],visual(4))):
       gather('Выбери пять сокровищ',set('star/yellow gift/red badge/pink block/blue ball/green boat/blue'),5)]
 ]),
 [[countScene('Пересчитай три игрушки слева направо.',set('bear/brown car/sky block/green')),
   countScene('Каждая игрушка получит одну отметку.',set('bear/brown car/sky block/green boat/blue ball/yellow')),
   countScene('Последнее число говорит, сколько всего игрушек.',objects('ball/sky',5))],
 [count('Пересчитай два мяча',objects('ball/sky',2)),count('Пересчитай четыре яблока',objects('apple/red',4)),
  count('Определи количество игрушек',set('bear/brown car/sky block/green boat/blue ball/yellow')),
  groupSort('Подбери количественные образцы','ball/sky',[3,1,5,4,2],[1,2,3,4,5]),
  stages('Пересчитай содержимое корзинок',count('Яблоки',objects('apple/red',3)),count('Ягоды',objects('berry/pink',4)),count('Мячи',objects('ball/sky',5)))]],
 [[actionScene('После каждого прыжка Луми появляется отметка.','lumiSide',3),actionScene('Каждый хлопок отмечен вспышкой.','clap',4),actionScene('Считай вспышки возле барабана.','drum',5)],
 [eventTask('Сколько было прыжков?','lumiSide',3,[2,3,4],1),eventTask('Сколько было хлопков?','clap',4,[4,3,5],0),
  exercise('Ударь в барабан три раза','Нажимай на барабан, пока образец не заполнится.',pick(set('drum'),0,visual(3),{presses:3,tally:true})),
  stages('Повтори четыре движения',choose('Прыжок','lumiSide clap',0,'lumiSide'),choose('Хлопок','lumiSide clap',1,'clap'),choose('Хлопок','clap lumiSide',0,'clap'),choose('Прыжок','clap lumiSide',1,'lumiSide')),
  eventTask('Подбери образец по вспышкам','drum',5,[3,4,5],2)]],
]);
