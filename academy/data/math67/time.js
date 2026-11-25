import { num } from '../math56/digits.js';
import { event, orderEvents } from '../math45/calendar.js';
import { token, scene, exercise, pick, connect, stages, lesson } from '../math45/builders.js';

const weekdayArt = ['star/yellow','mushroom/pink','ribbon/blue','crystal/sky','leaf/green','shell/pink','moon/blue'];
const seasonArt = ['snowScene','springScene','summerScene','autumnScene'];
const calendarCard = (tag,label)=>({...token(tag),calendarLabel:label});
const weekdays = ['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'].map((label,i)=>calendarCard(weekdayArt[i],label));
const seasonByMonth = [0,0,1,1,1,2,2,2,3,3,3,0];
const months = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'].map((label,i)=>calendarCard(seasonArt[seasonByMonth[i]],label));
const seasons = ['Зима','Весна','Лето','Осень'].map((label,i)=>calendarCard(seasonArt[i],label));
const clock = (...args)=>({...token('circle'),clock67:args});
const face = (text,hour,advance=false)=>scene('math67-clock',text,[token('circle')],{clock67:{hour,advance}});
const show=(text,cards)=>scene('together',text,cards,{ordinal:true});
const choose=(prompt,cards,index,cues)=>exercise(prompt,'Посмотри на карточки.',pick(cards,index,null,{cues,ordinal:true}));
const words=labels=>labels.map(label=>({...num(label),word67:true}));
const ask=(prompt,answers,index)=>choose(prompt,words(answers),index);
const missing=(prompt,items,index,options)=>choose(prompt,options.map(i=>items[i]),options.indexOf(index),items.map((item,i)=>i===index?num('□'):item));
const hours=(hour,options)=>choose(`Найди часы, на которых ровно ${hour}.`,options.map(n=>clock(n)),options.indexOf(hour));
export const setClock=(prompt,hour,start)=>exercise(prompt,'Следи за короткой стрелкой.',pick([num(0)],0,null,{clock67:{hour,start}}));
export const daySequence=()=>orderEvents('Собери неделю, начиная с понедельника.',...weekdays);
const meal=['wake','wash','bread','sandwich','eat'].map(tag=>event(tag,'morning'));
const schedule=[2,4,6,8].map(n=>clock(n));
const seasonSort=()=>exercise('Распредели месяцы по календарным сезонам.','В каждом сезоне по три месяца.',connect(months,seasons,seasonByMonth,{ordinal:true}));
const hourRun=(label,values)=>stages(label,...values.map(n=>hours(n,[n===12?1:n+1,n,n===1?12:n-1])));
const lessons=[
 [[face('Циферблат состоит из двенадцати чисел. Вверху двенадцать.',null),
   face('Короткая синяя стрелка показывает часы, длинная зелёная — минуты.',7),
   face('Стрелки движутся вместе. Минутная стрелка движется быстрее.',3,true)],
  [choose('Какая стрелка показывает часы?',words(['Короткая синяя','Длинная зелёная']),0,[clock(4)]),
   choose('Какая стрелка показывает минуты?',words(['Короткая синяя','Длинная зелёная']),1,[clock(8)]),
   stages('Восстанови два числа на циферблате.',...[[3,2,4],[9,8,10]].map(([n,a,b])=>choose('Какое число закрыто?', [a,n,b].map(num),1,[clock(null,0,[n])]))),
   exercise('Заполни циферблат числами от одного до двенадцати.','Верхнее место предназначено для двенадцати.',pick([num(0)],0,null,{clockLayout67:true})),
   setClock('Запусти стрелки. Установи ровно два часа.',2,12)]],
 [[face('За один час минутная стрелка проходит полный оборот. В одном часе шестьдесят минут.',3,true),
   face('Пока длинная стрелка делает круг, короткая переходит от трёх к четырём.',3,true),
   show('Когда длинная стрелка наверху, короткая показывает, который час.',[clock(2),clock(5),clock(10)])],
  [hours(3,[2,3,4]),setClock('Установи пять часов.',5,3),
   hourRun('Определи время на трёх часах.',[1,8,12]),
   stages('Переведи часы с двух на три и скажи, сколько времени прошло.',setClock('Переведи часы вперёд на один час.',3,2),ask('Сколько времени прошло?', ['Два часа','Один час','Три часа'],1)),
   stages('Соедини пять дел Луми со временем.',...['Завтрак в 8','Прогулка в 10','Обед в 12','Игра в 3','Ужин в 6'].map((label,i)=>{
     const correct=[8,10,12,3,6][i];
     return choose(label,[clock(correct===12?1:correct+1),clock(correct),clock(correct-1)],1);
   }))]],
 [[show('В неделе семь дней. Начнём с понедельника.',weekdays),
   show('Перед средой был вторник. После среды будет четверг.',weekdays.slice(1,4)),
   show('После воскресенья снова наступает понедельник.',[weekdays[6],weekdays[0]])],
  [daySequence(),choose('Какой день после четверга?',weekdays.slice(2,5),2),
   choose('Какой день перед вторником?',weekdays.slice(0,3),0),
   stages('Сегодня воскресенье.',choose('Какой день был вчера?',weekdays,5),choose('Какой день будет завтра?',weekdays,0)),
   stages('Собери расписание недели.',choose('Тренировка за день до пятницы. Когда?',weekdays,3),choose('Пикник через день после пятницы. Когда?',weekdays,6))]],
 [[show('В календарном году двенадцать месяцев. Первый — январь, последний — декабрь.',months),
   show('В каждом календарном сезоне три месяца. Вот весна.',months.slice(2,5)),
   show('После декабря наступает январь нового года.',[months[11],months[0]])],
  [stages('Найди начало и конец календарного года.',choose('Первый месяц?',months.slice(0,3),0),choose('Последний месяц?',months.slice(9),2)),
   missing('Какой месяц скрыт?',months.slice(0,5),2,[1,2,3]),
   choose('Какой месяц перед июлем?',months.slice(4,8),1),
   choose('Какой месяц после ноября?',months.slice(8),3),
   orderEvents('Собери год, начиная с января.',...months)]],
 [[show('Год проходит через четыре времени года: зиму, весну, лето и осень.',seasons),
   scene('move','Распределим двенадцать месяцев по четырём сезонам.',months,{targets:seasons,matches:seasonByMonth,ordinal:true}),
   show('После осени наступает зима. Январь начинает новый календарный год.',[seasons[3],months[11],months[0]])],
  [seasonSort(),orderEvents('Расположи сезоны, начиная с зимы.',...seasons),
   missing('Какой летний месяц пропущен?',months.slice(5,8),1,[0,2,1]),
   choose('Какой сезон приходит после осени?',seasons,0),
   stages('Собери календарь праздников Луми.',seasonSort(),choose('В каком сезоне праздник в мае?',seasons,1),choose('В каком сезоне праздник в декабре?',seasons,0))]],
 [[show('Луми проснулся, умылся, достал хлеб, сделал бутерброд и позавтракал.',meal),
   show('Посмотрим на часы. Прогулка длилась с двух до четырёх, перекус с четырёх до пяти.',[clock(2),clock(4),clock(5)]),
   show('На линии времени сначала два часа, потом четыре, шесть и восемь.',schedule)],
  [orderEvents('Разложи пять картинок из истории о завтраке.',...meal),
   choose('Что сделал Луми раньше: умылся или позавтракал?',[meal[1],meal[4]],0,meal),
   choose('Что длилось дольше: прогулка с 2 до 4 или перекус с 4 до 5?',words(['Прогулка','Перекус']),0,[clock(2),clock(4),clock(5)]),
   orderEvents('Восстанови расписание после обеда: встреча в 2, игра в 4, ужин в 6, чтение в 8.',...schedule),
   stages('Составь план дня Луми.',setClock('Завтрак в восемь. Установи часы.',8,6),setClock('Прогулка через час после завтрака.',9,8),setClock('Обед в полдень.',12,10))]],
];
export const time67=Object.fromEntries(lessons.map(([scenes,practice],i)=>[
  `math-67-lesson-9-${i+1}`,lesson('time-observatory',scenes,practice),
]));
