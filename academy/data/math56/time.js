import {keyed56} from './counting.js';
import {dawn,day,dusk,night,chooseEvent,orderEvents} from '../math45/calendar.js';
import {objects,count,groups,compare,balance} from '../math45/counting.js';
import {measurePick,series} from '../math45/magnitude.js';
import {token,choose,join,set,scene,exercise,connect,pick,stages} from '../math45/builders.js';
import {num,match} from './digits.js';
import {planRoute} from './spatial.js';
const phases=[dawn,day,dusk,night];
const weekdays=['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'];
const months=['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const seasonNames=['Зима','Весна','Лето','Осень'];
const seasonTags=['snowScene','springScene','summerScene','autumnScene'];
const seasons=seasonTags.map((tag,i)=>({...token(tag),calendarLabel:seasonNames[i]}));
const weekdaysArt=['star/yellow','mushroom/pink','ribbon/blue','crystal/sky','leaf/green','shell/pink','moon/blue'];
const days=weekdaysArt.map((tag,i)=>({...token(tag),calendarLabel:weekdays[i]}));
const seasonIndex=[0,0,1,1,1,2,2,2,3,3,3,0];
const year=months.map((name,i)=>({...token(seasonTags[seasonIndex[i]]),calendarLabel:name,calendarIndex:i+1}));
const teach=(text,cards)=>scene('counting',text,cards,{ordinal:true});
const pickCard=(prompt,cards,i,sample,cues)=>chooseEvent(prompt,cards,i,sample,cues);
const refer=(prompt,cards)=>exercise(prompt,'Посмотри на образец сверху. Начни у стрелки.',
 {...orderEvents(prompt,...cards).rounds[0],cues:cards});
const missing=(prompt,reference,correct,options)=>exercise(prompt,'Найди карточку по образцу.',pick(options,options.indexOf(correct),null,{ordinal:true,cues:reference}));
const dayMonthSort=()=>exercise('Разложи месяцы по временам года','Пользуйся календарём-образцом.',
 connect(year,seasons,seasonIndex,{cues:year}));
const neighbor=(n)=>exercise('Найди соседей числа '+n,'Поставь соседей по сторонам от числа.',
 connect([num(n+1),num(n-1)],[num(n-1),num(n+1)],[1,0],{sample:num(n),ordinal:true}));
const completeNumbers=()=>stages('Восстанови пропущенные числа',...[2,5,9].map(n=>{
 const answer=num(n);
 return missing('Какое число между соседями?',[num(n-1),token('spot'),num(n+1)],answer,[num(n+1),answer,num(n-1)]);
}));
const compare10=()=>compare('Где кристаллов больше?',groups('crystal/sky',[7])[0],groups('crystal/sky',[9])[0],1);
const countHouses=()=>stages('Заполни числовые домики',...[1,2,3,4,5].map(n=>exercise('Заполни окошки','По одному кристаллу на окошко.',connect(objects('crystal/sky',n),objects('spot',n),objects('spot',n).map((_,i)=>i),{interchangeable:true,ordinal:true,sample:num(n)}))));
const finishGeometry=()=>stages('Геометрическая башня',join('Разложи плоские фигуры и объёмные тела','sphere square cylinder triangle','circle cube',[1,0,1,0]),
 join('Собери круг из частей','halfBottom/blue halfTop/sky','halfTop halfBottom',[1,0],{assembly:true,mosaic:'splitCircle'}),
 choose('Найди все четырёхугольники','triangle/sky square/sky trapezoid/sky circle/sky',[1,2]));
const finishMeasure=()=>stages('Мост измерений',series('Упорядочь ленты','ribbon/pink','length',[.7,.35,.5],[.35,.5,.7]),exercise('Измерь длину тремя мерками','Приложи мерки одна за другой.',
 {...connect(objects('measureUnit',3),objects('measureUnit',3),[0,1,2],{interchangeable:true,ordered:true}),unitTrack:{n:3,axis:'length',tag:'road/sky'}}),measurePick('Какая дорожка длиннее?','road/sky','length',[.45,.6],1));
export const time56=keyed56(10,'time-palace',[
 [[teach('За утром наступает день.',phases.slice(0,2)),teach('После вечера наступает ночь.',phases.slice(2)),teach('После ночи снова утро.',[...phases,dawn])],
 [exercise('Соотнеси картинки с частями суток','Посмотри на образцы.',connect([night,dawn,dusk,day],phases,[3,0,2,1])),
 refer('Расположи части суток по порядку',phases),
 missing('Что пропущено?',[dawn,token('spot'),dusk],day,[night,day,dawn]),
 pickCard('Что наступает после вечера?',[dawn,night,day],1,null,[dusk,token('spot')]),
 refer('Восстанови полный цикл суток',phases)]],
 [[teach('Это семь карточек дней недели.',days),teach('Неделя начинается с понедельника.',days),teach('После воскресенья снова понедельник.',[days[6],days[0]])],
 [pickCard('Найди понедельник по карточке',days.slice(0,3),0,days[0]),refer('Расположи первые три дня',days.slice(0,3)),
 missing('Найди пропущенный день',days,days[3],[days[4],days[2],days[3]]),refer('Восстанови семь дней недели',days),
 exercise('Размести события показанной недели','Подбери каждому событию карточку.',connect(set('seed water sprout'),[days[1],days[3],days[5]],[0,1,2],{cues:[days[1],token('seed'),days[3],token('water'),days[5],token('sprout')]}))]],
 [[teach('В календаре четыре времени года.',seasons),scene('move','В каждом сезоне три месяца.',year,{targets:seasons,matches:seasonIndex}),teach('Посмотрим на двенадцать месяцев по порядку.',year)],
 [exercise('Соотнеси пейзажи с сезонами','Посмотри на признаки сезона.',connect([seasons[1],seasons[3],seasons[0],seasons[2]],seasons,[1,3,0,2])),
 refer('Упорядочь четыре времени года',seasons),dayMonthSort(),missing('Найди пропущенный месяц',year,year[4],[year[2],year[4],year[5]]),refer('Собери календарь из двенадцати карточек',year)]],
 [[teach('В году двенадцать месяцев.',year),scene('move','Разложим месяцы по четырём сезонам.',year,{targets:seasons,matches:seasonIndex}),teach('После декабря наступает январь.',[year[11],year[0]])],
 [refer('Собери круг из четырёх сезонов',seasons),dayMonthSort(),missing('Какой сезон пропущен?',[seasons[0],token('spot'),seasons[2],seasons[3]],seasons[1],[seasons[3],seasons[1],seasons[2]]),refer('Восстанови календарь по образцу',year.slice(6)),refer('Собери полный годовой календарь',year)]],
 [[teach('Вспомним числовой ряд от нуля до десяти.',Array.from({length:11},(_,i)=>num(i))),teach('Сравним соседние числа.',[num(8),num(9),num(10)]),teach('Каждый кристалл — отдельная единица.',objects('crystal/sky',5))],
 [completeNumbers(),match('Соотнеси числа и группы',[3,7,0,10],[0,3,7,10],'crystal/sky'),stages('Найди соседей',neighbor(3),neighbor(8)),stages('Сравни и уравняй группы',compare10(),balance('Добавь недостающий кристалл',groups('crystal/sky',[9])[0],groups('crystal/sky',[8])[0],'add')),countHouses()]],
 [[teach('На карте десять математических миров.',objects('crystal/sky',10)),teach('Вспомним формы, тела и мерки.',set('circle sphere cube square measureUnit')),teach('Вспомним маршруты и времена года.',[token('arrowup'),token('arrowright'),...seasons])],
 [stages('Врата чисел',count('Пересчитай десять кристаллов',objects('crystal/sky',10)),completeNumbers(),neighbor(7),compare10()),
 finishGeometry(),finishMeasure(),
 stages('Лабиринт картографа',join('Размести фигуры по образцам','triangle circle square','circle triangle square',[1,0,2]),planRoute('Проложи маршрут к сундуку',[0,2],['up','right','right','down'],[[1,2]])),
 stages('Дворец времени',refer('Восстанови части суток',phases),refer('Восстанови дни недели',days),refer('Восстанови времена года',seasons))]],
]);
