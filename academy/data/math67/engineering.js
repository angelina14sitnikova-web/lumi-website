import { num } from '../math56/digits.js';
import { measure, measurePick } from '../math45/magnitude.js';
import { token, scene, lesson, exercise, pick, stages } from '../math45/builders.js';
const ribbon='ribbon/pink', track='road/sky', bridge='bridge/blue';
const animation=(text,name,spec)=>scene('math67-engineering',text,[token('strip')],{engineering67:{name,...spec}});
const practice=(prompt,name,spec)=>exercise(prompt,'Проверь модель действием, затем выбери ответ.',
 pick([num(0)],0,null,{engineering67:{name,...spec}}));
export const lengths=(prompt,length,unit=1,axis='length')=>practice(prompt,'length',{length,unit,axis});
export const scales=(prompt,left,right,answer,weights=0)=>practice(prompt,'mass',{left,right,answer,weights});
export const liquid=(prompt,capacity,amount=capacity)=>practice(prompt,'liquid',{capacity,amount});
const steps=(title,...tasks)=>stages(title,...tasks);
const equalLengths=()=>exercise('Найди две равные по длине ленты','Сравни по одной линии начала.',
 pick([.73,.54,.54,.87].map(n=>measure(ribbon,'length',n)),[1,2]));
const fitBridge=(prompt,l,w)=>exercise(prompt,'Смотри отдельно на длину и ширину.',
 pick([[l-.14,w],[l,w],[l,w-.12],[l+.13,w+.2]].map(([length,width])=>({shape:'bridge',color:'blue',dimensions67:[length,width]})),1,
 {shape:'bridge',color:'sky',dimensions67:[l,w]}));
const error=(prompt,length,mode)=>practice(prompt,'measureError',{length,unit:1,mode});
const cupCompare=(prompt,capacityA,capacityB,answer)=>practice(prompt,'vessels',{capacityA,capacityB,answer});
const demoM=(text,left,right,weights=0)=>animation(text,'mass',{left,right,weights});
const demoL=(text,length,unit,axis='length')=>animation(text,'length',{length,unit,axis});
const demoV=(text,capacityA,capacityB,amount)=>animation(text,'transfer',{capacityA,capacityB,amount});
const lessons=[
 [[scene('align','При сравнении длины совместим начала лент.',[measure(ribbon,'length',.8),measure(ribbon,'length',.5)],{focus:0}),
 scene('align','Длины дорожек равны. Сравним ширину.',[measure(track,'width',.4),measure(track,'width',.8)],{focus:1}),
 animation('Синяя полоса длиннее розовой, но уже.','dimensions',{pairs:[[.85,.36],[.58,.74]]})],
 [measurePick('Найди самую длинную полоску',ribbon,'length',[.53,.68,.78,.94,.83,.61],3),
 measurePick('Выбери самый широкий мост',bridge,'width',[.69,.86,.47,.58],1),equalLengths(),
 exercise('Что длиннее и уже образца?','Сравни оба измерения.',pick([[.74,.45],[.67,.77],[.37,.29]].map(d=>({shape:'road',color:'blue',dimensions67:d})),0,{shape:'road',color:'sky',dimensions67:[.62,.63]})),
 fitBridge('Подбери мост для пролёта и прохода',.67,.55)]],
 [[demoL('Измерим дорожку: прикладываем плитки одну за другой.',4,1),
 demoL('Первую плитку ставим у левого края.',7,1),
 demoL('Начинаем от основания и поднимаемся без пробелов.',5,1,'height')],
 [lengths('Измерь дорожку четырьмя плитками',4),lengths('Измерь ленту семью мерками',7),lengths('Определи высоту башни',5,1,'height'),
 steps('Исправь промежутки и наложения',error('Найди ряд с промежутком',5,'gap'),error('Найди ряд с наложением',5,'overlap'),lengths('Разложи мерки вплотную',5)),
 steps('Измерь три предмета и выбери числа',lengths('Дорожка',4),lengths('Поперёк моста',6,1,'width'),lengths('Башня',7,1,'height'))]],
 [[demoL('В дорожке шесть коротких мерок.',6,1),demoL('Та же дорожка равна трём длинным меркам.',6,2),
 animation('Длина та же, но число мерок отличается.','twoLengths',{length:6})],
 [steps('Измерь одну дорожку двумя мерками',lengths('Короткая мерка',6,1),lengths('Длинная мерка',6,2)),
 practice('Как соотносятся результаты?','unitComparison',{length:6}),
 error('Где использованы мерки разной длины?',6,'mixed'),
 practice('Выбери одинаковые мерки для двух дорожек','unitsPair',{length:6}),
 steps('Проведи эксперимент',lengths('Короткая мерка',8,1),lengths('Длинная мерка',8,2),practice('Каких мерок понадобилось больше?','unitComparison',{length:8}))]],
 [[demoM('Поместим предметы на чаши весов.',[4],[2]),demoM('Тяжёлая чаша опускается ниже.',[1],[5]),demoM('Добавим одинаковые грузики, пока чаши не сравняются.',[5],[2],3)],
 [scales('Какой предмет тяжелее?',[5],[3],'left'),
 scales('Уравновешены ли предметы?',[3],[3],'equal'),
 scales('Большой предмет слева, маленький справа. Что тяжелее?',[2],[5],'right'),
 scales('Уравновесь весы грузиками',[6],[2],'equal',4),
 steps('Взвесь и упорядочь три предмета',scales('Первый предмет',[2],[],'equal',2),scales('Второй предмет',[5],[],'equal',5),scales('Третий предмет',[3],[],'equal',3),
 exercise('От лёгкого к тяжёлому','Сверься с измерениями.',pick(['2, 5, 3','5, 3, 2','2, 3, 5'].map(num),2)))]],
 [[animation('Наполним сосуд одинаковыми стаканчиками.','liquid',{capacity:4,amount:4}),demoV('У сосудов разные вместимости. В узком помещается больше.',3,5,3),demoV('Три стаканчика перелили целиком. Количество сохранилось.',6,4,3)],
 [liquid('Наполни сосуд тремя стаканчиками',3),liquid('Определи вместимость второго сосуда',5),
 cupCompare('Какой сосуд вмещает больше?',3,5,'right'),cupCompare('У этих сосудов разная форма. Равна ли вместимость?',4,4,'equal'),
 practice('Куда поместятся пять стаканчиков без перелива?','fitLiquid',{capacityA:4,capacityB:5,amount:5})]],
 [[demoL('Измерим пролёт между берегами.',6,1),demoM('Сравним массу двух грузов.',[3,2],[4]),
 demoV('Для напитка нужно перелить три стаканчика.',5,4,3)],
 [steps('Подбери мост к пролёту',lengths('Измерь пролёт',6),fitBridge('Подбери пролёт и ширину',.67,.55)),
 measurePick('Выбери ленту такой же длины',ribbon,'length',[.34,.72,.58],1,.72),
 scales('Добавь грузики до равновесия',[3,3],[1],'equal',5),liquid('Отмерь четыре стаканчика',6,4),
 steps('Инженерная миссия',lengths('Измерь мост',7),scales('Уравновесь груз',[4,2],[2],'equal',4),liquid('Измерь вместимость',5))]],
];
export const engineering=Object.fromEntries(lessons.map(([scenes,practice],i)=>[
 'math-67-lesson-6-'+(i+1),lesson('engineering-lab',scenes,practice),
]));
