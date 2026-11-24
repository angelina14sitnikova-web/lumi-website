import {token,set,show,move,scene,exercise,pick,connect,choose,join,stages,keyed} from './builders.js';
import { count, countScene, gather, group, compare, balance } from './counting.js';
import { measurePick, series } from './magnitude.js';
import { routeTask, where } from './routes.js';
import { orderEvents, chooseEvent, calendarStrip, storyEvents, dawn, day, dusk, night } from './calendar.js';

const treasure=set('star/yellow treasure/orange badge/pink boat/blue gift/red block/green');
const groupEqual=()=>chooseEvent('Найди столько же сокровищ',[group('star/yellow',3),group('star/yellow',4),group('star/yellow',5)],1,group('badge/pink',4));
const third=()=>exercise('Найди третий предмет','Начни у стрелки.',pick(treasure.slice(0,5),2,group('star/yellow',3),{ordinal:true}));
const sort=()=>join('Разложи по форме и цвету','circle/blue square/red circle/red square/blue','circle/red square/red circle/blue square/blue',[2,1,0,3],{matrix:true});
const build=()=>join('Собери корабль из деталей','triangle/yellow rectangle/blue circle/pink oval/green','circle/pink triangle/yellow oval/green rectangle/blue',[1,3,0,2],{assembly:true,mosaic:'ship'});
const route=()=>routeTask('Проведи Луми к сундуку','lumiBack',[1,2],['up','right','right','down'],[[2,2]]);
const dayOrder=()=>orderEvents('Разложи части суток',dawn,day,dusk,night);
const long=()=>measurePick('Выбери самую длинную ленту','ribbon/pink','length',[.4,.7,1,.55],2,1);
const sizeRow=()=>series('Упорядочь пять мячей','ball/sky','overall',[1,.38,.7,.54,.85],[.38,.54,.7,.85,1]);
const countGems=()=>gather('Отсчитай пять сокровищ',treasure,5);
const locate=()=>where('Что справа от Луми?','side','lumiBack','ball treasure',1);
const known=()=>choose('Найди фигуру по образцу','circle/pink rectangle/sky oval/yellow triangle/red',2,'oval/green');
const history=()=>orderEvents('Собери историю путешествия',...set('boots walk treasure home'));
const sequenceScene=(text,pieces)=>scene('move',text,pieces,{targets:pieces,matches:pieces.map((_,i)=>i),ordinal:true});
export const journey=keyed(10,'math-archipelago',[
 [[countScene('Посчитаем пять сокровищ по одному.',treasure.slice(0,5)),
 scene('correspond','У каждой звёздочки есть пара. Остался один значок.',[group('star/yellow',3),group('badge/pink',4)]),
 scene('highlight','Считаем от начала ряда. Выделим третий предмет.',treasure.slice(0,5),{ordinal:true,focus:2})],
 [count('Пересчитай разные игрушки',treasure.slice(0,5)),countGems(),groupEqual(),third(),balance('Сделай две группы равными',group('ball/sky',4),group('box/blue',3),'add')]],
 [[show('Вспомним круг, квадрат и треугольник.','circle/sky square/pink triangle/yellow'),show('Вот вытянутый прямоугольник и овал.','rectangle/blue oval/green'),
 sequenceScene('Совместим детали с местами корабля.',set('triangle/yellow rectangle/blue circle/pink oval/green'))],
 [known(),choose('Найди синий квадрат','square/red circle/blue square/blue',2,'square/blue'),
 join('Подбери фигуры к знакомым предметам','wheel tile roof door ovalFrame','oval rectangle triangle circle square',[3,4,2,1,0]),sort(),build()]],
 [[scene('highlight','Нужны цвет, форма и размер.',set('square/pink/large circle/pink/large square/pink/small'),{focus:0}),
 scene('align','Совмещаем начала лент, а башни ставим на один пол.',[token('ribbon/pink'),token('tower/blue')]),
 sequenceScene('Разложим игрушки от маленькой к большой.',set('ball/sky/small ball/sky/middle ball/sky/large'))],
 [choose('Учитывай три свойства','square/blue/large circle/blue/large square/pink/large square/blue/small',0,'square/blue/large'),long(),
 measurePick('Найди две башни одинаковой высоты','tower/blue','height',[.61,1,.61],[0,2]),sizeRow(),
 choose('Исправь ошибку: здесь собирают большие синие круги','circle/blue/large circle/blue/large circle/red/large',2,'circle/blue/large',{setting:'odd'})]],
 [[show('Вспомним наши ориентиры. Луми стоит рядом с домиком.','lumiBack house treasure'),
 scene('route','Три команды ведут нас к сокровищу.',[token('lumiBack')],{route:{actor:'lumiBack',at:[1,2],goal:[3,1],path:[[1,2],[1,1],[2,1],[3,1]],steps:['up','right','right']}}),
 scene('route','Маршрут обходит дерево.',[token('lumiBack')],{route:{actor:'lumiBack',at:[1,2],goal:[3,2],path:[[1,2],[1,1],[2,1],[3,1],[3,2]],steps:['up','right','right','down'],barriers:[[2,2]]}})],
 [where('Что под полкой?','vertical','shelf','ball treasure',1),locate(),
 routeTask('Выполни две команды','lumiBack',[1,2],['right','up']),
 routeTask('Восстанови маршрут','lumiBack',[1,2],['up','right','right']),route()]],
 [[sequenceScene('Утро, день, вечер, ночь.',[dawn,day,dusk,night]),
 sequenceScene('В нашей истории: вчера посадили семечко, сегодня полили, завтра посмотрим на росток.',storyEvents),
 sequenceScene('Восстановим четыре события путешествия.',set('boots walk treasure home'))],
 [dayOrder(),chooseEvent('Что было вчера?',[storyEvents[2],storyEvents[0]],1,null,[calendarStrip[0],storyEvents[0]]),
 chooseEvent('Что запланировано на завтра?',[storyEvents[2],storyEvents[0]],0,null,[calendarStrip[2],storyEvents[2]]),
 orderEvents('Восстанови четыре этапа выращивания',...set('seed water sprout grow')),history()]],
 [[countScene('Начинаем путешествие. Пересчитаем сокровища.',treasure.slice(0,5)),
 show('Повторим фигуры и размеры.','circle/blue square/pink/small triangle/yellow/large oval/green rectangle/sky'),
 sequenceScene('Вспомним стрелки и порядок событий.',set('arrowright boots walk home'))],
 [stages('Остров чисел',countGems(),compare('Где предметов больше?',group('star/yellow',4),group('gift/red',3),0),third()),
 stages('Остров фигур',known(),sort(),build()),
 stages('Остров величин',long(),sizeRow()),
 route(),
 stages('Остров времени',history(),choose('Открой финальное сокровище','box/blue treasure/yellow gift/red',1,'treasure/yellow'))]],
]);
