import {p,routeLine,line,curve,waves,ring,item,dot,trace,road,task,scene,moduleLessons} from './shape-kit.js';

const flowerRoad=road(line(122,218,515,218),'lumi','flower',{width:53});
const carrotRoad=road(line(119,244,516,188),'rabbit','carrot',{width:51});
const butterflyRoad=road(curve(117,273,526,189,238,126,399,144),'butterfly','flowerGold',{width:49});
const shortCar=road(line(180,225,455,225),'car','garage',{width:46});
const beeRoad=road(line(320,346,320,82),'bee','flower',{width:48});
const flowerBridge=trace([dot(line(136,229,502,229),36)],{items:[item('flower',93,229),item('flowerGold',543,229)]});
const trails=trace([dot(line(196,92,430,92),32),dot(line(119,215,520,215),35),dot(line(238,345,398,345),31)],
  {items:[item('flower',157,92),item('butterfly',485,92),item('leaf',78,215),item('chest',568,215),item('bee',195,345),item('flowerGold',446,345)]});
const shortSnail=road(curve(119,262,520,227,222,90,373,123),'snail','leaf');
const aroundFlower=road(curve(105,281,531,281,181,77,447,77),'butterfly','flowerGold',
  {obstacles:[{x:317,y:271,r:55,name:'flower'}],width:42});
const fishRoad=road(curve(100,271,528,176,210,329,356,122),'fish','star',{width:43, paper:'clouds'});
const twoCurves=trace([dot(waves(92,552,208,45,2),35)],{items:[item('leaf',95,286),item('flower',549,130)]});
const flowerRing=trace([dot(ring(318,208,140),35,{openCircle:true})],{items:[item('flower',318,209,118)],color:'#b78a50'});
const gardenRing=trace([dot(ring(320,221,156,117),33,{openCircle:true})],{items:[item('flowerGold',267,231,76),item('flower',364,200,74),item('leaf',318,253,70)]});
const pondRing=trace([dot(ring(318,211,155,113),35,{openCircle:true})],{items:[item('fish',320,212,130),item('butterfly',482,210,65)],paper:'clouds'});
const twoRings=trace([dot(ring(175,216,92),27,{openCircle:true}),dot(ring(470,220,126),28,{openCircle:true})],{items:[item('flower',176,215),item('flowerGold',470,220,88)]});
const balloonOutline=ring(318,192,117,141);
const appleOutline=curve(320,83,321,345,45,5,82,384).concat(curve(321,345,320,83,556,385,600,35));
const cloudOutline=curve(156,254,264,120,79,185,170,113).concat(curve(264,120,482,218,418,2,570,167),curve(482,218,156,254,471,319,216,353));
const leafOutline=curve(153,305,486,101,149,166,380,58).concat(curve(486,101,153,305,475,259,312,360));
const outline=(points,icon)=>trace([dot(points,33,{closed:true})],{reveal:true,items:[item(icon,320,224,116)]});
const housePath=road(curve(107,242,541,212,223,120,400,120),'lumi','house',{width:54});
const bedPaths=[
 curve(110,234,532,234,180,47,457,47),
 curve(110,234,532,234,175,383,462,383),
];
const bedMaze=road(bedPaths[0],'rabbit','carrot',{corridors:bedPaths,width:35,obstacles:[{x:321,y:230,r:65,name:'flower'}]});
const leafMaze=road(curve(101,315,522,128,333,313,344,151),'snail','leaf',{width:39});
const chestRoute=routeLine([108,310],[215,310],[297,229],[350,165],[525,165]);
const chestMaze=road(chestRoute,'lumi','chest',{width:34,branches:[routeLine([215,310],[291,335],[407,336])]});
const secretRoute=curve(109,315,536,130,274,344,350,100);
const secretMaze=road(secretRoute,'lumi','chest',{
  width:34,branches:[routeLine([231,290],[268,355],[376,352]),routeLine([397,164],[365,91],[297,79])],
  obstacles:[{x:328,y:302,r:39,name:'rock'}],
});

export const garden=moduleLessons(2,'garden',[
  [[
    scene('Начало и конец','Посмотри, как огонёк показывает широкую дорожку.',trace([dot(line(115,223,525,223),49)])),
    scene('Луми идёт к цветку','Теперь по тропинке идёт Луми.',flowerRoad),
    scene('Цветной след','Движение оставляет на дорожке цветную линию.',trace([dot(curve(114,259,519,199,261,133,381,142),43)])),
  ],task('Луми и цветок','Проведи Луми по широкой дорожке к цветку.',flowerRoad),
    task('Зайчик хочет морковку','Проведи дорожку к морковке.',carrotRoad),
    task('Тропинка бабочки','Проведи бабочку по небольшой плавной тропинке.',butterflyRoad),
    task('Две цветные дорожки','Проведи обе дорожки между рисунками.',trace([dot(line(125,135,515,135),41),dot(line(125,303,515,303),41)],{items:[item('flower',89,137),item('leaf',555,131),item('bee',90,308),item('flowerGold',554,301)]})),
    task('Волшебный сад','Нарисуй отдельную дорожку для каждого героя.',flowerRoad,carrotRoad,butterflyRoad),
  ],
  [[
    scene('Точка гуляет','Огонёк движется по ровной тропинке.',trace([dot(line(120,225,520,225),44)])),
    scene('Точка поднимается','По прямой можно двигаться вверх.',beeRoad),
    scene('Длинная и короткая тропинки','Посмотри на несколько прямых в саду.',trails),
  ],task('Машинка едет прямо','Нарисуй короткую прямую дорогу.',shortCar),
    task('Пчёлка поднимается','Проведи прямую линию вверх к цветку.',beeRoad),
    task('Два цветка','Соедини цветы прямой линией.',flowerBridge),
    task('Разные дороги','Нарисуй три дорожки разной длины.',trails),
    task('Прямые мостики','Соедини пары предметов прямыми линиями.',flowerBridge,trace([dot(line(143,268,503,137),34)],{items:[item('star',110,268),item('chest',540,130)]}),trace([dot(line(312,100,312,327),35)],{items:[item('bee',312,61),item('flower',312,368)]})),
  ],
  [[
    scene('Улитка за поворотом','Улитка поворачивает плавно.',shortSnail),
    scene('Один изгиб','Огонёк показывает плавный изгиб.',trace([dot(curve(136,271,506,271,246,113,391,113),34)])),
    scene('Два изгиба','Посмотри, как дорожка меняет направление.',twoCurves),
  ],task('Медленная улитка','Проведи улитку к листочку.',shortSnail),
    task('Вокруг цветка','Помоги бабочке облететь цветок.',aroundFlower),
    task('Подводная тропинка','Нарисуй плавный путь для рыбки.',fishRoad),
    task('Два широких изгиба','Восстанови плавную дорожку.',twoCurves),
    task('Сад извилистых тропинок','Проведи каждого героя по его маршруту.',shortSnail,aroundFlower,fishRoad),
  ],
  [[
    scene('Светлячок кружится','Светлячок облетает цветок по кругу.',{...flowerRing,items:[item('flower',318,209,118),item('firefly',318,57,57)]}),
    scene('Круг целиком','Огонёк огибает круг и возвращается.',gardenRing),
    scene('Разные круги','Посмотри на маленькую и большую дорожки.',twoRings),
  ],task('Светлячок и большой цветок','Веди пальчиком вокруг цветка.',{...flowerRing,items:[item('flower',318,209,118),item('firefly',318,57,57)]}),
    task('Круглая клумба','Обведи клумбу с цветами.',gardenRing),
    task('Круглое озеро','Нарисуй путь бабочки вокруг озера.',pondRing),
    task('Большой и маленький круг','Проведи две круговые дорожки.',twoRings),
    task('Хоровод цветов','Проведи круги вокруг разных картинок.',flowerRing,gardenRing,pondRing),
  ],
  [[
    scene('Воздушный шар','У шарика есть округлый край.',outline(balloonOutline,'balloon')),
    scene('Контур яблока','Огонёк движется вокруг большого яблока.',outline(appleOutline,'apple')),
    scene('Мягкий контур','Обведём облачко по краю.',outline(cloudOutline,'cloud')),
  ],task('Большой шарик','Обведи шарик по широкой дорожке.',outline(balloonOutline,'balloon')),
    task('Яблоко','Проведи пальцем по контуру яблока.',outline(appleOutline,'apple')),
    task('Облачко','Обведи большой контур облачка.',outline(cloudOutline,'cloud')),
    task('Листочек','Проведи по крупному контуру листочка.',outline(leafOutline,'leaf')),
    task('Ожившие рисунки','Обведи три предмета. Они засветятся.',outline(balloonOutline,'balloon'),outline(appleOutline,'apple'),outline(leafOutline,'leaf')),
  ],
  [[
    scene('Домик впереди','Луми идёт по широкой дорожке к домику.',housePath),
    scene('Один поворот','Улитка поворачивает к листочку.',leafMaze),
    scene('Две тропинки','Зайчик может обойти клумбу с двух сторон.',bedMaze),
  ],task('К домику','Проведи пальчиком по дороге к домику.',housePath),
    task('Вокруг клумбы','Выбери любую дорожку вокруг клумбы.',bedMaze),
    task('Улитка и листочек','Поверни на широкой тропинке к листочку.',leafMaze),
    task('Сундук и тупик','Найди дорожку к сундуку. Можно вернуться назад.',chestMaze),
    task('Секретный сад','Доведите Луми до сундука с мятной краской.',secretMaze),
  ],
]);
