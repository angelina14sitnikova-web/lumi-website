import { num, match, sequence } from '../math56/digits.js';
import { group, objects, gather, countScene, fill, balance } from '../math45/counting.js';
import { token, scene, lesson, exercise, pick, connect, stages } from '../math45/builders.js';

const crystal = 'crystal/sky';
const crystals = n => group(crystal,n);
const range = (a,b) => Array.from({length:b-a+1},(_,i)=>a+i);
const all = range(0,10);
const low = all.slice(0,6);
const high = all.slice(6);
const cards = values => values.map(num);
const show = (text,pieces,extra={}) => scene('counting',text,pieces,extra);
const links = (text,values) => scene('move',text,values.map(crystals),{targets:cards(values),matches:values.map((_,i)=>i)});
const chooseNumber = (prompt,answer,options,extra={}) => exercise(prompt,'Выбери подходящую числовую карточку.',pick(cards(options),options.indexOf(answer),null,extra));
const selectAmount = n => exercise('Открой портал '+n,'Выбери подходящее количество.',pick([n===0?2:n-1,n,n===10?8:n+1].map(crystals),1,num(n)));
const portals = (prompt,values) => stages(prompt,match('Подбери карточки',values.slice().reverse(),values,crystal),...values.map(selectAmount));
const holes = (a,b,missing) => exercise('Заполни пропуски в числовом ряду','Посмотри на соседние числа.',connect(cards(missing.slice().reverse()),cards(range(a,b).map(n=>missing.includes(n)?'?':n)),missing.slice().reverse().map(n=>n-a),{ordinal:true}));
const repair = (prompt,values,positions) => exercise(prompt,'Переложи карточки, у которых перепутаны места.',
 {...connect(cards(positions.map(i=>values[i])),cards(values),positions,{starts:positions.map((_,i)=>positions[(i+1)%positions.length]),ordinal:true})});
const wrongPairs = (prompt,values) => exercise(prompt,'Посчитай кристаллы и перемести карточки к верным числам.',
 connect(values.map(crystals),cards(values),values.map((_,i)=>i),{starts:values.map((_,i)=>(i+1)%values.length),ordinal:true}));
const neighbors = n => exercise('Заполни домик числа '+n,'Поставь предыдущее число слева и следующее справа.',
 connect(cards([n+1,n-1]),cards(['?','?']),[1,0],{sample:num(n),ordinal:true,cues:cards([n-1,n,n+1])}));
const signs = ['<','=','>'];
const relation = (a,b) => signs[a===b?1:a<b?0:2];
const compare = (a,b,withObjects=false) => exercise('Вставь знак между '+a+' и '+b,'Сравни левую и правую карточки.',pick(cards(signs),signs.indexOf(relation(a,b)),null,{cues:withObjects?[crystals(a),num('?'),crystals(b)]:cards([a,'?',b])}));
const ten = Array.from({length:12},()=>token(crystal));
const lessons = [
 [[show('Луми открывает шесть порталов от нуля до пяти.',cards(low)),
 links('К каждому порталу подходит своё количество. У нуля кристаллов нет.',low),
 scene('move','Вернём два пропущенных числа на свои места.',cards([4,2]),{targets:cards([0,1,'?',3,'?',5]),matches:[4,2],ordinal:true})],
 [match('Соедини числа и группы',[3,0,4,2,5,1],low,crystal),
 stages('Наполни четыре сундука',...[2,5,1,4].map(n=>fill('Сундук для '+n+' кристаллов',crystal,n,'treasure'))),
 holes(0,5,[1,4]),wrongPairs('Исправь три неверные пары',[1,3,5]),portals('Открой шесть порталов',low)]],
 [[show('Добавляем кристаллы по одному. Получаем числа от шести до десяти.',high.map(crystals)),
 links('Каждая запись обозначает количество кристаллов в группе.',high),
 scene('move','Для записи числа десять ставим сначала цифру 1, потом цифру 0.',cards([1,0]),{targets:cards([1,0]),matches:[0,1],ordinal:true})],
 [match('Подбери карточки к пяти группам',[8,6,10,7,9],high,crystal),
 gather('Отсчитай восемь из двенадцати',ten,8),
 exercise('Дополни семь кристаллов до десяти','Перенеси кристаллы по одному.',connect([token(crystal)],[crystals(7)],[0],{repeat:3,sample:num(10)})),
 sequence('Выложи числа от шести до десяти',high),portals('Распредели сокровища по пяти порталам',high)]],
 [[links('Семь звёзд обозначаем цифрой 7.',[7]),
 show('По карточке 9 отсчитываем девять предметов.',[num(9),...objects('star/yellow',9)]),
 scene('correspond','Размер и расположение отличаются, а количество одинаковое.',[group('star/yellow/small',5),group('star/yellow/large',5)])],
 [chooseNumber('Сколько предметов в смешанной группе?',5,[6,4,5],{cues:['apple/red','star/yellow','shell/pink','crystal/sky','flower/green'].map(token)}),
 gather('Собери шесть предметов разных размеров',ten.map((p,i)=>({...p,size:i%2?'small':'large'})),6),
 exercise('Выбери две группы для карточки 8','Пересчитай предметы в каждой группе.',pick([group('star/yellow',8),crystals(7),group('shell/pink',8)], [0,2],num(8))),
 wrongPairs('Исправь четыре неверные пары',[2,6,8,10]),match('Заполни числовое хранилище',[5,0,9,2,7,10,3,1,4,8,6],all,crystal)]],
 [[show('У числовой лестницы ступени от нуля до десяти.',cards(all),{ordinal:true}),
 show('Поднимаемся. На каждой следующей ступени на один кристалл больше.',all.map(crystals),{ordinal:true}),
 show('Спускаемся. На каждой ступени на один кристалл меньше.',cards(all.slice().reverse()),{ordinal:true})],
 [sequence('От нуля до десяти',all),sequence('От десяти до нуля',all.slice().reverse()),holes(0,10,[1,4,6,9]),
 repair('Исправь перепутанные ступени',all,[2,5,8]),
 stages('Проведи Луми по числовой лестнице',...[3,4,5,6,7,8].map(n=>chooseNumber('Следующая ступень',n,[n+1,n,n-1],{cues:cards([n-1,'?'])}))) ]],
 [[show('Число 6 находится между числами 5 и 7.',cards([5,6,7]),{ordinal:true}),
 show('К шести добавили один. Получилось семь.',objects(crystal,7),{added:true}),
 scene('balance','Если убрать один из шести, останется пять.',[crystals(5),crystals(6)],{action:'remove'})],
 [chooseNumber('Какое число перед 8?',7,[6,9,7],{cues:cards(['?',8])}),
 chooseNumber('Какое число после 4?',5,[5,6,3],{cues:cards([4,'?'])}),
 stages('Заполни пять домиков',...[1,3,5,7,9].map(neighbors)),
 chooseNumber('Какое число между 7 и 9?',8,[6,8,10],{cues:cards([7,'?',9])}),
 stages('Восстанови цепочку',...[3,4,5,4,3].map((n,i)=>chooseNumber(i<3?'На один больше':'На один меньше',n,[n-1,n+1,n],{cues:cards([i<3?n-1:n+1,'?'])})))]],
 [[scene('correspond','У восьми кристаллов останутся три без пары. Восемь больше пяти.',[crystals(5),crystals(8)]),
 show('На лестнице восемь стоит дальше от начала, чем пять.',cards(all),{ordinal:true}),
 show('Острый конец знака обращён к меньшему числу. Знак равно соединяет равные значения.',[num('5 < 8'),num('8 > 5'),num('5 = 5')])],
 [chooseNumber('Выбери большее число',8,[5,8],{cues:[crystals(5),crystals(8)]}),
 chooseNumber('Выбери меньшее число',4,[4,7],{cues:[crystals(4),crystals(7)]}),compare(3,7,true),
 stages('Заполни пять пропусков',...[[0,2],[9,5],[3,3],[5,7],[10,8]].map(([a,b])=>compare(a,b))),
 stages('Открой числовые порталы',...[[1,6],[7,2],[4,4],[8,9],[10,10],[10,0]].map(([a,b])=>compare(a,b)))]],
];
export const numberPortals=Object.fromEntries(lessons.map(([scenes,practice],index)=>[
 'math-67-lesson-1-'+(index+1),lesson('number-portals',scenes,practice),
]));
