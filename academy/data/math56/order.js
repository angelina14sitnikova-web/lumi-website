import {keyed56} from './counting.js';
import {num,sequence} from './digits.js';
import {objects,group,count,countScene,pickGroup} from '../math45/counting.js';
import {token,set,show,scene,exercise,pick,connect,choose,stages} from '../math45/builders.js';
const rows='wagon/blue wagon/red wagon/green wagon/yellow wagon/pink wagon/sky wagon/gray wagon/brown wagon/orange wagon/paleGreen';
const cards=set(rows);
const seats=Array.from({length:10},(_,i)=>num(i+1));
const range=(a,b)=>Array.from({length:b-a+1},(_,i)=>i+a);
const train='number-express';
const showRow=(text,pieces,focus)=>scene(focus===undefined?'counting':'highlight',text,pieces,{ordinal:true,focus});
const ordinal=(prompt,pieces,index)=>exercise(prompt,'Начинай от стрелки слева.',pick(pieces,index,num(index+1),{ordinal:true}));
const place=(prompt,tag,i,places=seats)=>exercise(prompt,'Нажми на предмет, потом на подходящее место.',connect([token(tag)],places,[i],{ordinal:true}));
const which=(prompt,index)=>exercise(prompt,'Определи место выделенного вагона от стрелки.',pick(seats,index,null,{ordinal:true,cues:cards.map((p,i)=>({...p,marked:i===index}))}));
const neighbor=(prompt,n,delta)=> {
 const options=range(Math.max(0,n-2),Math.min(10,n+2)).filter(k=>k!==n);
 const cues=range(Math.max(0,n-2),Math.min(10,n+2)).map(k=>num(k===n+delta?'?':k));
 return exercise(prompt,'Посмотри на ряд, идущий от стрелки.',pick(options.map(num),options.indexOf(n+delta),num(n),{ordinal:true,cues}));
};
const both=(n)=>exercise('Найди соседей числа '+n,'Выбери карточки перед числом и после него.',
 pick([n-1,n,n+1,n===1?4:n===9?7:n-2].map(num),[0,2],num(n),{ordinal:true,cues:[num('?'),num(n),num('?')]}));
export const orderTen=keyed56(4,train,[
 [[countScene('Пересчитаем семь вагонов в ряду.',cards.slice(0,7)),
 countScene('Пересчитаем десять билетов после перестановки.',objects('paper/white',10),{arrangement:'loose'}),
 countScene('Помечаем уже посчитанные предметы. Каждый — один раз.',objects('box/sky',8))],
 [count('Пересчитай шесть вагонов',cards.slice(0,6)),count('Сколько чемоданов?',objects('box/sky',8)),
  count('Пересчитай разбросанные билеты',objects('paper/white',10),{arrangement:'loose'}),
  choose('Найди билет с двойной отметкой','paper/white doubleTicket paper/white',1,'doubleTicket'),
  stages('Сосчитай четыре группы',...range(6,9).map(n=>count('Пересчитай игрушки',objects('car/blue',n))))]],
 [[showRow('Поезд из десяти вагонов.',cards),showRow('Начинаем слева и отмечаем места по порядку.',cards),
 showRow('Всего десять вагонов, а этот вагон — восьмой.',cards,7)],
 [ordinal('Найди шестой вагон',cards,5),ordinal('Выбери восьмого пассажира',objects('bear/brown',10),7),
 place('Поставь чемодан на девятое место','box/sky',8),which('На каком месте выделенный вагон?',3),
 stages('Рассади пять пассажиров',...[[1,'bunny'],[6,'bear'],[2,'cat'],[5,'frog'],[9,'dogToy']].map(([i,tag])=>place('Посади пассажира на отмеченное место',tag,i,seats.map((p,j)=>({...p,marked:i===j})))))]],
 [[showRow('Первый вагон стоит у стрелки.',cards,0),showRow('Этот вагон между красным и жёлтым.',cards,2),showRow('Вагоны сменили места. Смотрим снова от начала.',[...cards].reverse(),9)],
 [ordinal('Найди первый предмет',cards.slice(0,5),0),ordinal('Покажи последний предмет',cards.slice(0,7),6),
  ordinal('Что между красным и жёлтым?',cards.slice(1,4),1),
  place('Поставь вагон между двумя вагонами','wagon/green',1,[cards[1],token('spot'),cards[3]]),
  exercise('Восстанови ряд из семи вагонов','Сверяйся с образцом.',connect(cards.slice(0,7).reverse(),cards.slice(0,7),[6,5,4,3,2,1,0],{ordinal:true}))]],
 [[showRow('Посмотрим на числовой ряд.',range(0,10).map(num)),showRow('Перед числом пять стоит четыре.',range(2,8).map(num),2),
 showRow('Сделай шаг назад от восьми или от десяти.',range(6,10).map(num),1)],
 [neighbor('Найди число перед четырьмя',4,-1),neighbor('Выбери число перед семью',7,-1),
 neighbor('Вставь предыдущее число',8,-1),sequence('Исправь последовательность',range(3,8)),
 stages('Открой пять замков',...[2,4,6,8,10].map(n=>neighbor('Найди предыдущее число',n,-1)))]],
 [[showRow('После трёх идёт четыре.',range(2,7).map(num),2),showRow('После шести идёт семь.',range(5,9).map(num),2),
 scene('balance','Добавим один предмет и перейдём к следующему числу.',[group('ball/sky',7),group('ball/sky',6)],{action:'add'})],
 [neighbor('Что после двух?',2,1),neighbor('Что после шести?',6,1),neighbor('Что после девяти?',9,1),
 stages('Восстанови четыре числа',...[1,3,5,7].map(n=>neighbor('Вставь следующее число',n,1))),
 sequence('Проведи поезд по числовому маршруту',range(4,10))]],
 [[showRow('Соседи четырёх: три и пять.',[3,4,5].map(num),1),showRow('Соседи семи: шесть и восемь.',[6,7,8].map(num),1),
 scene('move','Заполним домик числа пять.',[4,6].map(num),{targets:[4,5,6].map(num),matches:[0,2],ordinal:true})],
 [both(3),both(6),neighbor('Вставь число между 7 и 9',7,1),
 stages('Исправь три домика',...[2,5,8].map(both)),stages('Заполни пять домиков',...[1,3,5,7,9].map(both))]],
]);
