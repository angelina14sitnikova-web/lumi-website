import {keyed56} from './counting.js';
import {group,objects,countScene,gather,balance} from '../math45/counting.js';
import {token,set,scene,exercise,pick,connect,stages} from '../math45/builders.js';
export const num=n=>({...token('chip'),numeral:n});
const nums=(...numbers)=>numbers.map(num);
const gt=(n,shape='star/yellow')=>group(shape,n);
const find=(prompt,n,options)=>exercise(prompt,'Сравни знаки с карточкой.',pick(nums(...options),options.indexOf(n),num(n)));
const findMany=(prompt,n,options)=>exercise(prompt,'Выбери все одинаковые знаки.',pick(nums(...options),options.flatMap((v,i)=>v===n?[i]:[]),num(n)));
const amount=(prompt,n,options,shape)=>exercise(prompt,'Подбери группу к числовой карточке.',pick(options.map(k=>gt(k,shape)),options.indexOf(n),num(n)));
const numeral=(prompt,n,options,shape)=>exercise(prompt,'Пересчитай предметы и подбери карточку.',pick(nums(...options),options.indexOf(n),gt(n,shape)));
export const match=(prompt,order,targets,shape)=>exercise(prompt,'Выбери группу и подбери к ней числовую карточку.',connect(order.map(n=>gt(n,shape)),nums(...targets),order.map(n=>targets.indexOf(n))));
const trace=n=>exercise('Обведи цифру '+n,'Веди пальцем по дорожке или нажимай на точки по порядку.',pick([num(n)],0,null,{trace:n}));
const traceScene=(n)=>scene('digit-trace','Посмотри, как обвести цифру '+n+'.',[num(n)],{digit:n});
const show=(text,...pieces)=>scene('together',text,pieces);
const link=(text,order,targets)=>scene('move',text,order.map(n=>gt(n)),{targets:nums(...targets),matches:order.map(n=>targets.indexOf(n))});
const mismatch=(prompt,n,m)=>exercise(prompt,'На какой карточке количество не совпадает с записью?',pick(nums(n,m),1,null,{cues:[gt(n),gt(n)]}));
const before5=[0,1,2,3,4,5];
const all=[0,1,2,3,4,5,6,7,8,9,10];
export const sequence=(prompt,ordered)=>exercise(prompt,'Выложи карточки по порядку.',connect(nums(...ordered.slice().reverse()),nums(...ordered),ordered.map((_,i)=>ordered.length-i-1),{sequence:true,ordered:true,ordinal:true}));
const letter=(mark)=>num(mark);
export const digitLow=keyed56(2,'number-library',[
 [[show('Один фонарик. Рядом цифра 1.',gt(1,'lantern/yellow'),num(1)),traceScene(1),link('Карточка 1 подходит к одиночным предметам.',[1,1,1],[1])],
 [find('Найди цифру 1',1,[7,1,'А','✦']),amount('Подбери один предмет',1,[2,1,3],'lantern/yellow'),findMany('Выбери все карточки с цифрой 1',1,[1,2,1,7,1]),trace(1),match('Соедини группы по одному предмету с цифрой 1',[1,1,1],[1,2])]],
 [[show('Два яблока обозначаем цифрой 2.',gt(2,'apple/red'),num(2)),show('Три яблока обозначаем цифрой 3.',gt(3,'apple/red'),num(3)),link('Сравни цифры 2 и 3 и их группы.',[2,3],[3,2])],
 [find('Найди цифру 2',2,[3,5,2]),find('Найди цифру 3',3,[3,2,5]),match('Подбери цифры к двум группам',[3,2],[2,3],'apple/red'),stages('Обведи цифры 2 и 3',trace(2),trace(3)),match('Разложи количества от одного до трёх',[3,1,2,3,2],[1,2,3])]],
 [[show('Четыре звезды и цифра 4.',gt(4),num(4)),countScene('Добавили пятую звезду. Пять обозначим цифрой 5.',objects('star/yellow',5),{added:true}),link('У каждой цифры своё количество.',[1,2,3,4,5],[1,2,3,4,5])],
 [find('Найди цифру 4',4,[4,2,5]),find('Найди цифру 5',5,[3,4,5]),numeral('Подбери цифру к четырём предметам',4,[3,4,5]),stages('Обведи цифры 4 и 5',trace(4),trace(5)),match('Соедини пять групп и цифры',[4,3,5,1,2],[1,2,3,4,5])]],
 [[show('В корзине одно яблоко.',gt(1,'apple/red')),scene('balance','Уберём яблоко. Корзина пустая.',[gt(0,'apple/red'),gt(1,'apple/red')],{action:'remove'}),link('Ни одного яблока — ноль.',[0],[0])],
 [amount('Найди пустую корзину',0,[1,0,2],'apple/red'),numeral('Подбери цифру к пустой коробке',0,[1,0,2],'car/blue'),
 exercise('Убери все игрушки с полки','Нажми на каждую игрушку.',pick(set('car/blue bear/brown block/green'),[0,1,2],num(0),{removePicked:true})),
 find('Найди цифру 0',0,[6,0,9,1]),match('Подбери цифры к шести корзинам',[3,0,5,1,4,2],before5,'apple/red')]],
 [[link('Три предмета — это цифра 3.',[3],[3]),link('Цифра 5 обозначает пять предметов.',[5],[5]),link('Пустая группа тоже получает карточку.',before5,before5)],
 [numeral('Подбери цифру к группе',3,[2,3,4]),gather('Собери пять предметов',objects('crystal/sky',7),5),mismatch('Найди ошибочную пару',3,4),
 stages('Заполни шесть коробок',...before5.map(n=>amount('Выбери содержимое для коробки',n,n===0?[1,0,2]:[n-1,n,n+1]))),
 match('Восстанови пары от 0 до 5',[3,5,1,0,4,2],before5)]],
 [[show('Сравним знакомые цифры и буквы.',...nums(1,'А',2,'М')),show('Цифры отличаются от условных знаков.',...nums(5,'✦',4,'○')),show('Разложим цифры по ячейкам.',...nums(...before5))],
 [find('Найди цифру 1 среди букв',1,['А','М',1,'Н']),exercise('Выбери все цифры','Отличи цифры от других знаков.',pick(nums('А',3,'✦',0,5,'○'),[1,3,4])),
 find('Найди заданную цифру на панели',4,['А',1,0,3,'○',5,4,'М']),
 exercise('Разложи цифры и другие знаки','У каждой карточки своя группа.',connect(nums('А',1,'✦',3,'М',0),nums(2,'А'),[1,0,1,0,1,0])),
 sequence('Верни цифры в библиотеку',before5)]],
]);
const nightRows=[6,7,8,9].map(n=>[
 [countScene('Посчитаем небесные сокровища.',objects(n===7?'ball/sky':'star/yellow',n)),traceScene(n),
  n===9?show('Сравни 6 и 9: обе стоят прямо.',num(6),num(9)):link('Карточка подсказывает количество.',[n-1,n],[n,n-1])],
 n===9?[find('Найди цифру 9',9,[6,8,9]),find('Отличи 9 от 6',9,[9,6]),amount('Подбери девять предметов',9,[8,9,10]),trace(9),match('Соотнеси группы с цифрами от 6 до 9',[8,6,9,7],[6,7,8,9])]:
 [find('Найди цифру '+n,n,[n-1,n+1,n]),amount('Подбери столько предметов',n,[n+1,n,n-1]),trace(n),
  n===6?mismatch('Найди ошибочную пару с цифрой 6',6,7):match('Подбери цифры к группам',n===7?[7,6]:[7,8,6],n===7?[6,7]:[6,7,8]),
  gather('Заполни созвездие',objects('star/yellow',n+2),n)]
]);
export const digitHigh=keyed56(3,'number-observatory',[
 ...nightRows,
 [[countScene('Пересчитаем десять звёзд.',objects('star/yellow',10)),show('Десять записывается так: 10.',num(10)),show('Сначала цифра 1, справа от неё цифра 0.',num(1),num(0),num(10))],
 [find('Найди число десять',10,[0,10,1,'01']),amount('Подбери десять предметов',10,[8,10,9]),sequence('Собери запись числа 10',[1,0]),find('Где запись 10?',10,['01',1,10,0]),numeral('Выбери число к десяти сокровищам',10,[9,10,8],'crystal/sky')]],
 [[show('Числовой ряд начинается с нуля.',...nums(...all)),link('Сопоставим числа и группы.',[0,4,7,10],[0,4,7,10]),show('Если карточка потерялась, найдём её по соседям.',...nums(5,6,'?',8,9))],
 [find('Найди заданное число',8,[4,6,8,9]),match('Подбери числа к группам',[9,0,5,10,7],[0,5,7,9,10]),
 stages('Восстанови три числа',find('Что пропустили между 2 и 4?',3,[2,3,4]),find('Что пропустили между 6 и 8?',7,[6,7,8]),find('Что пропустили между 8 и 10?',9,[8,9,10])),
 sequence('Разложи от нуля до десяти',all),stages('Открой космический сундук',find('Найди число 10',10,[1,10,9]),amount('Подбери восемь сокровищ',8,[9,8,7],'crystal/sky'))]],
]);
