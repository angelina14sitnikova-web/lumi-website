import {lessons,t,d,r,picture,group,match,odd,pair,pick,pickValue} from './builders.js';
import {puzzle,repairCar,repairCup,buildCar,buildHouse} from './castle.js';
import {order,pattern,frames as railwayFrames} from './railway.js';

const scene=(label,bg,...objects)=>({label,...picture(bg,...objects)});
const parchment='#f7ead2', mint='#e4f0da', sky='#dfeefa', clay='#f1e2d8';
const make=(use,prompt,items,start,result,extra={})=>r('story',prompt,{use,items,frames:{start,result},...extra});
const watering=make('water','Полей цветок.', ['brush','watering','pitcher'],
 scene('Цветок ждёт воды',mint,['flower',74,29,.60]),
 scene('Цветок поднялся после полива',mint,['flower:gold',68,16,.66],['water',30,120,.64]),{effect:'water',place:[7,44,38]});
const combing=make('comb','Помоги причесать гриву.', ['comb','cloth','brush'],
 scene('Растрёпанная грива',clay,['bear',63,24,.67],['ribbon:gray',98,5,.31]),
 scene('Грива уложена',clay,['bear:cream:big:bow',54,24,.71]),{effect:'comb',place:[22,19,34]});
const spooning=make('eat','Выбери, чем можно есть кашу.', ['hat','spoon','brush'],
 scene('Миска с кашей',parchment,['bowl',51,15,.79]),
 scene('Кашу взяли ложкой',parchment,['bowl',51,15,.79]),{effect:'eat',place:[19,28,47]});
const cleaning=make('wipe','Вытри пролитую воду.', ['basket','cloth','towel'],
 scene('На столе разлилась вода',sky,['water',32,51,.73]),
 scene('Стол сухой и чистый',sky,['platform:cream',10,23,.87]),{effect:'wipe',place:[41,40,35]});
const collecting=make('collect','Собери игрушки в корзинку.', ['plate:blue:small','basket','lid:mint:small'],
 scene('Игрушки рассыпались',parchment,['ball',13,68,.48],['bear',76,19,.49],['car',78,95,.47]),
 scene('Игрушки в корзине',parchment,['basket',44,45,.60],['ball',61,35,.28],['bear',100,35,.27]),{effect:'collect',place:[40,41,35]});
const bridging=make('cross','Сделай переправу для машинки.', ['lid','bridge','plank'],
 scene('Машинка перед разрывом дороги',mint,['road',-16,85,.57],['road',94,83,.55],['water',51,72,.43],['car',-4,69,.41]),
 scene('Машинка проехала через разрыв',mint,['road',-16,85,.57],['road',94,83,.55],['water',51,72,.43]),
 {effect:'drive',place:[29,45,43],failure:'Машинке нужен предмет, который перекрывает разрыв.'});
const closing=make('close','Подбери крышку и проверь коробку.', ['lid:mint:small','lid:mint','flower'],
 scene('Открытая коробка',parchment,['box:cream:big:open',8,40,.91]),
 scene('Крышка закрыла коробку',parchment,['box',8,40,.91]),{fit:['size','big'],effect:'close',place:[21,31,60],
  failure:'Маленькая крышка оставляет края коробки открытыми.'});
const buildRoad=puzzle(picture(mint,['road',1,2,.98],['house',116,12,.37],['car',4,84,.42]),'twoVertical',true);
const split=(ids,values,rule,extra)=>group(ids,values,rule,'Разложи по правилу.',extra);
const shapeSort=split(['circle:rose','square:blue','circle:gold','square:mint'],['circle','square'],'shape');
const fruitSort=split(['car','apple','pear','bear'],['toy','fruit'],'category');
const manualSort={...fruitSort,manual:true};
const ab=pattern('color','train:rose','train:mint','two');
const manualAB={...ab,manual:true};
const rooms={
 ...railwayFrames,
 'ball-on-floor':scene('Мяч лежит на полу',mint,['ball',17,59,.56],['basket',85,25,.50]),
 'ball-in-basket':scene('Мяч в корзинке',mint,['basket',55,39,.66],['ball',74,65,.43]),
 'bear-in-basket':scene('Медвежонок в корзинке',mint,['basket',55,39,.66],['bear',73,58,.43]),
 'apple-floor':scene('Яблоко рядом с корзинкой',parchment,['apple',11,62,.55],['basket',75,32,.55]),
 'choose-apple':scene('Взять яблоко',parchment,['hand',28,47,.61],['apple',78,31,.43]),
 'apple-in-basket':scene('Положить яблоко в корзинку',parchment,['basket',57,37,.64],['apple',82,64,.40]),
 'choose-ball':scene('Взять мяч',mint,['hand',18,56,.61],['ball',75,31,.46]),
 'one-block':scene('Поставить кубик на подставку',sky,['platform',15,49,.85],['block',57,40,.40]),
 'no-block':scene('Подставка свободна',sky,['platform',15,49,.85]),
 'two-blocks':scene('Поставить второй кубик сверху',sky,['platform',15,49,.85],['block',57,40,.40],['block:rose',61,10,.33]),
 'bear-on-mark':scene('Медвежонок на помеченной подставке',sky,['platform',15,49,.85],['bear',57,29,.47]),
 'car-on-mark':scene('Машинка на подставке',sky,['platform',15,49,.85],['car',57,29,.47]),
 'skip-open':scene('Поставить машинку у закрытого гаража',sky,['house',17,19,.81],['car',54,71,.49]),
};
const act=(prompt,initial,...steps)=>r('actions',prompt,{initial,frames:rooms,steps:steps.map(([choice,...alternatives])=>({choice,preview:choice,options:[...alternatives.slice(0,1),choice,...alternatives.slice(1)]}))});
const ballIn=act('Сделай так же. Положи мяч в корзинку.','ball-on-floor',['ball-in-basket','bear-in-basket']);
const blockOn=act('Поставь кубик на подставку.','no-block',['one-block','car-on-mark']);
const bearOn=act('Поставь фигурку на указанное место.','no-block',['bear-on-mark','car-on-mark']);
const open=act('Открой коробку, затем достань игрушку.','closed-box',['open-box','closed-box'],['take-toy','open-book']);
const appleIn=act('Возьми яблоко и положи в корзинку.','apple-floor',['choose-apple','choose-ball'],['apple-in-basket','ball-in-basket']);
const stack=act('Поставь один кубик, а потом второй.','no-block',['one-block','two-blocks'],['two-blocks','no-block']);
const park=act('Открой гараж и поставь машинку.','skip-open',['open-garage','open-book'],['park-car','skip-open']);
const ballSteps=act('Выбери мяч, затем положи его в корзинку.','ball-on-floor',['choose-ball','choose-apple'],['ball-in-basket','bear-in-basket']);
const tri=puzzle('house','threeHorizontal');
const list=[watering,combing,spooning,cleaning,collecting];
const chooseSize=pickValue(['ball:red:small','ball:red'],'size','big','Найди большой мяч.');
const oddShape=odd(['circle:red','circle:red','square:red'],'shape','Что отличается по форме?',{reason:true,options:['circle','square']});

export const academy=lessons(7,[
 ['Выполнять действие после наглядного образца.',[
  d('Луми кладёт мяч в корзинку.',ballIn),d('Кубик можно поставить на подставку.',blockOn),d('Из двух деталей соберём домик.',buildHouse),
 ],t('Игрушка в корзинке',ballIn),t('Кубик на подставке',blockOn),t('Фигурка на месте',bearOn),t('Две детали домика',buildHouse),
 t('Мастерская исследователя',ballIn,blockOn,bearOn,buildHouse,act('Как в образце, положи яблоко в корзинку.','apple-floor',['apple-in-basket','ball-in-basket']))],
 ['Выполнять два связанных шага.',[
  d('Чтобы взять игрушку, сначала открываем коробку.',open),
  d('Сначала берём мяч, затем кладём в корзинку.',ballSteps),d('Открываем гараж перед тем, как ставить машинку.',park),
 ],t('Сундук и игрушка',open),t('Яблоко в корзинке',appleIn),t('Кубики друг на друге',stack),t('Машинка в гараже',park),
 t('Помощник исследователя',open,appleIn,stack,park,ballSteps)],
 ['Выбирать предмет, который помогает в знакомом деле.',[
  d('Лейка помогает полить цветок.',watering),d('Кашу удобно есть ложкой.',spooning),d('Щётка помогает причесать игрушку.',combing),
 ],t('Полить цветок',watering),t('Расчесать волосы',combing),t('Взять кашу',spooning),
 t('Вытереть воду',cleaning),t('Чемодан помощника',...list)],
 ['Проверять решение через результат действия.',[
  d('Через разрыв нужен мостик.',bridging),d('Корзинка собирает игрушки.',collecting),d('Колесо помогает починить машинку.',repairCar),
 ],t('Переправа для машинки',bridging),t('Игрушки в корзинку',collecting),
 t('Две части дорожки',buildRoad),t('Починка машинки',repairCar),t('Маленькие спасатели',bridging,collecting,buildRoad,repairCar,watering)],
 ['Самостоятельно запускать проверку после действия.',[
  d('Проверим, подходит ли крышка.',closing),d('Проверим картинку с образцом.',{...tri,manual:true}),
  d('Проверим повторяющуюся пару.',manualAB),
 ],t('Проверка крышки',closing),t('Картинка и образец',{...tri,manual:true}),
 t('Проверка корзинок',manualSort),t('Проверка ряда',manualAB),
 t('Лаборатория решений',closing,{...tri,manual:true},manualSort,manualAB,bridging)],
 ['Использовать способы из семи миров в новых игровых ситуациях.',[
  d('На карте вспомним сравнение, группы и пары.',pair(['ball:red','ball:blue','ball:red'])),
  d('Заметим лишнее и соберём целое.',oddShape),d('Проверим, как продолжается ряд.',manualAB),
 ],t('Испытание исследователя',pair(['car:mint','car:blue','car:mint']),chooseSize,pick(['doll','bear','doll:blue'],'doll')),
 t('Испытание коллекционера',shapeSort,fruitSort,match(['ball:red','car:blue'],['ribbon:blue','block:red'],'color')),
 t('Испытание детектива',odd(['car','apple','bear'],'category','Найди предмет из другой группы.'),oddShape,repairCup),
 t('Испытание мастера',tri,buildCar,ab),t('Главная загадка королевства',park,bridging,closing,order(['open-box','take-toy'],railwayFrames,true))],
]);
