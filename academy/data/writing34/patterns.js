import {line,curve,arch,ring,item,dot,trace,road,task,scene,moduleLessons} from './shape-kit.js';
const shift=(path,x,y)=>path.map(point=>({x:point.x+x,y:point.y+y}));
const neighboring=(paths,settings={})=>trace(paths.map(path=>dot(path,34)),{
  guide:'sample',samples:paths.map(path=>shift(path,0,-133)),sampleDivider:[{x:60,y:209},{x:580,y:209}],...settings,
});
const neighboringSide=(paths,settings={})=>trace(paths.map(path=>dot(path,33)),{
  guide:'sample',samples:paths.map(path=>shift(path,-250,0)),
  sampleDivider:[{x:319,y:69},{x:319,y:369}],...settings,
});
const shortHorizontal=neighboring([line(229,282,405,282)],{guide:'points'});
const shortVertical=neighboringSide([line(438,123,438,271)]);
const shortTilt=neighboring([line(237,282,401,320)]);
const shortPair=neighboring([line(140,281,254,281),line(383,282,499,282)]);
const longHorizontal=neighboring([line(111,287,525,287)],{guide:'points'});
const longVertical=neighboringSide([line(454,75,454,357)]);
const longTilt=neighboring([line(143,284,494,338)]);
const twoLengths=neighboring([line(108,288,216,288),line(309,288,537,288)]);
const horizontalRoad=neighboring([line(146,287,495,287)]);
const curveRoad=neighboring([curve(161,319,484,321,259,219,379,265)]);
const twinRoad=neighboring([line(117,285,258,285),curve(357,327,534,326,391,224,496,266)]);
const makeRibbon=(path,extra=[])=>neighboring([path],{items:[item('gift',100,278,98),item('gift',538,278,98),...extra]});
const thread=trace([dot(line(320,149,320,340),36)],{guide:'dots',items:[item('balloon',320,102,116)]});
const stalk=trace([dot(line(320,153,320,349),35)],{guide:'points',items:[item('flower',320,111,111)]});
const missingLine=trace([dot(line(314,221,522,221),39)],{guide:'points',outlines:[line(125,221,314,221)],items:[item('house',570,214,91)]});
const circularPiece=trace([dot(ring(320,223,122,112,Math.PI,Math.PI),33)],{
  guide:'dots',outlines:[ring(320,223,122,112,0,Math.PI)],items:[item('ball',320,224,115)],
});
const missingHandle=trace([dot(arch(322,219,120,103),32)],{guide:'dots',items:[item('basket',322,280,251)]});
const cart=road(line(130,221,519,221),'car','garage',{width:45});
const bunny=road(curve(116,280,514,205,231,148,391,117),'rabbit','carrot');
const bee=road(line(128,303,508,124),'bee','flower',{width:42});
const stonePath=curve(112,220,526,220,191,64,449,64), lowerStone=curve(112,220,526,220,181,367,459,367);
const snail=road(stonePath,'snail','leaf',{corridors:[],demoPaths:[stonePath,lowerStone],obstacles:[{x:320,y:219,r:62,name:'rock'}],guide:'hidden',width:39});
const longHome=road(curve(118,298,503,145,216,105,381,292),'lumi','house',{width:44});
const fishHome=road(curve(119,260,509,178,238,299,351,193),'fish','leaf',{paper:'clouds'});
const colors=neighboring([line(194,258,194,332),line(320,258,320,332),line(445,258,445,332)]);
const bars=neighboringSide([line(360,154,526,154),line(360,272,526,272)]);
const lengths=neighboring([line(232,267,232,329),line(409,247,409,361)]);
const arcRow=neighboring([line(148,277,240,277),arch(429,320,75,85)]);
const cloth=neighboring([line(126,267,126,339),arch(253,327,48,70),line(380,267,380,339),arch(515,328,55,71)],{
  outlines:[[ {x:70,y:240},{x:577,y:240},{x:577,y:372},{x:70,y:372},{x:70,y:240} ]],color:'#ab769b'
});

export const patterns=moduleLessons(5,'patterns',[
 [[scene('Короткий образец','Луми рассматривает короткую линию.',shortHorizontal),
   scene('Рядом с образцом','Похожую линию можно провести на соседнем листе.',shortTilt),
   scene('Короткая вертикаль','Посмотри, как Луми повторяет вертикальный штрих.',shortVertical)],
  task('Короткая горизонталь','Нарисуй похожую линию между точками.',shortHorizontal),
  task('Короткая вертикаль','Повтори короткую вертикаль рядом с образцом.',shortVertical),
  task('Соседний лист','Проведи такую же короткую линию на свободной половине.',shortTilt),
  task('Две короткие линии','Повтори обе линии по образцу.',shortPair),
  task('Ленточки мастера','Повтори короткие ленточки у коробок.',makeRibbon(line(241,288,389,288)),makeRibbon(line(267,285,405,300)),makeRibbon(line(252,276,379,276)))],
 [[scene('Длинный образец','Рассмотри длинную горизонтальную линию.',longHorizontal),
   scene('Место рядом','Луми проводит похожую длинную линию.',longTilt),
   scene('Длинная вертикаль','Повторим длинное движение в другом направлении.',longVertical)],
  task('Длинная горизонталь','Повтори длинный образец между двумя точками.',longHorizontal),
  task('Длинная вертикаль','Повтори длинную вертикаль рядом.',longVertical),
  task('Длинная линия рядом','Проведи длинную линию на свободной половине.',longTilt),
  task('Короткая и длинная','Повтори две линии разной длины.',twoLengths),
  task('Подарочные ленты','Укрась подарки длинными линиями по образцам.',makeRibbon(line(141,282,496,282)),makeRibbon(line(126,276,510,300)),makeRibbon(line(156,282,487,282)))],
 [[scene('Прямая дорожка','Луми рассматривает прямую дорожку.',horizontalRoad),
   scene('Похожая дорожка','Проведи дорожку рядом с образцом.',longVertical),
   scene('Плавная тропинка','Повтори изгиб, как на образце.',curveRoad)],
  task('Ровная дорожка рядом','Повтори ровную дорожку.',horizontalRoad),
  task('Вертикальная дорожка','Проведи похожую дорожку сбоку.',longVertical),
  task('Дорожка с изгибом','Воспроизведи плавный изгиб под образцом.',curveRoad),
  task('Два образца','Нарисуй обе дорожки, прямую и изогнутую.',twinRoad),
  task('Парные тропинки','Нарисуй похожие дорожки для героев.',{...horizontalRoad,items:[item('bee',97,286),item('flower',539,286)]},{...curveRoad,items:[item('rabbit',104,319),item('carrot',535,320)]},{...longVertical,items:[item('snail',455,375),item('leaf',453,53)]})],
 [[scene('Где ниточка?','Шарику не хватает ниточки.',thread),
   scene('Где стебель?','Цветку нужен стебелёк.',stalk),
   scene('Завершаем линию','Дорисуем кусочек дороги.',missingLine)],
  task('Ниточка','Дорисуй ниточку воздушного шарика.',thread),
  task('Стебель','Дорисуй недостающий стебель.',stalk),
  task('Конец дорожки','Продли начатую дорожку до домика.',missingLine),
  task('Дуга в рисунке','Дорисуй недостающую половинку края.',circularPiece),
  task('Мастерская потерянных деталей','Верни пять недостающих деталей.',thread,stalk,missingLine,circularPiece,missingHandle)],
 [[scene('Дорога в гараж','Соединим машинку с гаражом.',cart),
   scene('Путь к морковке','Для зайчика можно провести плавную тропинку.',bunny),
   scene('Два обхода','Камешек можно обойти с любой стороны.',snail)],
  task('Машинка и гараж','Нарисуй соединяющую дорогу.',cart),
  task('Зайчик и морковка','Нарисуй тропинку к морковке.',bunny),
  task('Пчёлка и цветок','Нарисуй линию к цветку.',bee),
  task('Улитка и камешек','Проложи дорожку вокруг камешка.',snail),
  task('Дороги домой','Найди дорогу к дому каждого героя.',cart,bunny,bee,longHome,fishHome)],
 [[scene('Ряд коротких штрихов','Повторяем отдельные вертикальные линии.',colors),
   scene('Чередование длин','Посмотри на короткий и длинный штрих.',lengths),
   scene('Разные элементы рядом','Линия может соседствовать с дугой.',arcRow)],
  task('Три короткие линии','Повтори три вертикальных штриха.',colors),
  task('Две полосы','Повтори две горизонтальные линии.',bars),
  task('Короткая и длинная','Повтори узор из двух штрихов разной длины.',lengths),
  task('Линия и дуга','Повтори два разных элемента.',arcRow),
  task('Волшебная ткань','Повтори крупный узор на ткани.',cloth)],
]);
