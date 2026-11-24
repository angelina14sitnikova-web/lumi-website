import { num } from '../math56/digits.js';
import { group } from '../math45/counting.js';
import { token, scene, lesson, exercise, pick, connect, stages } from '../math45/builders.js';

const room='number-houses';
const loot='crystal/sky';
const range=(a,b)=>Array.from({length:b-a+1},(_,i)=>i+a);
const coin=(color=loot)=>token(color);
const groupOf=(n,tag)=>group(tag,n);
const division=(text,total,...lefts)=>scene('math67-split',text,[coin()],{total,lefts});
export const split=(prompt,total,{allowed,distinct=1,grid=false}={})=>exercise(prompt,'Размести предметы в двух группах и проверь.',
 pick([coin()],0,null,{split67:{total,allowed:allowed ?? range(1,total-1),distinct,grid}}));
const pair=(total,left)=>exercise('Дополни этаж домика '+total,'Сколько не хватает к известной части?',
 pick([left===1?0:total-left-1,total-left,total-left+1].map(num),1,null,{cues:[num(total),groupOf(left,loot),num('?')]}));
const given=(total,left)=>exercise('Дополни '+left+' до '+total,'Добавляй по одному в правое окошко.',
 connect([coin()],[groupOf(0,loot)],[0],{repeat:total-left,sample:num(total),cues:[groupOf(left,loot),num('?')]}));
const houses=(prompt,...totals)=>stages(prompt,...totals.flatMap(n=>range(1,n-1).map(a=>pair(n,a))));
const fix=(total,pairs)=>stages('Исправь неверные составы',...pairs.map(([left,right])=>exercise('Сохрани левую часть '+left+' и исправь правую','Сверь две части с числом на крыше.',
 pick([num(right),num(total-left)],1,num(total),{cues:[groupOf(left,loot),groupOf(right,'crystal/pink')]}))));
const lessons=[
 [[division('У двух одна часть из одного кристалла, и другая тоже из одного.',2,1),division('Три можно разделить на один и два.',3,1),
 division('Поменяем части местами. Вместе их по-прежнему три.',3,1,2)],
 [split('Размести два кристалла в двух домиках',2),given(3,1),given(3,2),houses('Заполни домики 2 и 3',2,3),split('Найди оба способа',3,{distinct:2})]],
 [[division('У четырёх есть пары 1 и 3, 2 и 2.',4,1,2),division('Пять можно разделить на 1 и 4 или 2 и 3.',5,1,2),
 division('У пары можно поменять местами левую и правую части.',5,1,4,2,3)],
 [given(4,1),pair(4,2),split('Раздели пять двумя способами',5,{distinct:2}),stages('Восстанови пропуски',pair(4,3),pair(5,1),pair(5,3)),houses('Собери все пары для четырёх и пяти',4,5)]],
 [[division('Отделим один кристалл от шести.',6,1),division('Перенесём ещё один: две части — 2 и 4.',6,1,2),
 division('Разделим шесть поровну: 3 и 3.',6,2,3)],
 [given(6,2),pair(6,5),split('Раздели шесть поровну',6,{allowed:[3]}),houses('Заполни пять этажей',6),fix(6,[[2,3],[5,2],[3,4]])]],
 [[division('Семь состоит из одного и шести.',7,1),division('Ещё способы: 2 и 5, 3 и 4.',7,2,3),
 division('Меняем части местами. Сумма не изменится.',7,1,6,2,5,3,4)],
 [given(7,1),pair(7,3),split('Раздели семь тремя способами',7,{distinct:3}),houses('Заполни шесть этажей',7),split('Восстанови все пары семи',7,{distinct:6})]],
 [[division('Восемь можно разделить по-разному.',8,1,2,3,4),division('Девять тоже можно разложить на две части.',9,1,2,3,4),
 division('Переносим по одному. Всего остаётся девять.',9,4,5,6)],
 [given(8,3),pair(9,4),split('Раздели восемь поровну',8,{allowed:[4]}),stages('Заполни пропуски домиков',pair(8,2),pair(8,5),pair(9,3),pair(9,8)),stages('Исправь и восстанови модели',fix(8,[[4,3],[2,7]]),fix(9,[[3,5],[8,2]]),houses('Все этажи',8,9))]],
 [[division('В рамке ровно десять ячеек, в каждой по кристаллу.',10,5),division('Меняем цвет одной ячейки. Всего всё ещё десять.',10,2,3,4),
 division('Посмотрим на все пары числа десять.',10,1,2,3,4,5,6,7,8,9)],
 [given(10,4),pair(10,7),split('Заполни рамку двумя цветами',10,{grid:true}),houses('Заполни девять этажей',10),stages('Открой замки числового города',pair(10,2),pair(10,6),pair(10,9),pair(10,3),pair(10,5))]],
];
export const numberHouses=Object.fromEntries(lessons.map(([scenes,practice],index)=>[
 'math-67-lesson-2-'+(index+1),lesson(room,scenes,practice),
]));
