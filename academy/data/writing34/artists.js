import {p,line,curve,waves,ring,arch,routeLine,item,dot,trace,road,free,task,scene,moduleLessons} from './shape-kit.js';

const balloon=ring(320,205,163,152);
const rug=routeLine([81,105],[560,105],[560,334],[81,334],[81,105]);
const decorate=(shape,paths,guide='wide',settings={})=>trace(paths.map(path=>dot(path,26)),{
  outlines:[shape],guide,outlineColor:'#d1a2bb',...settings,
});
const balloonLines=decorate(balloon,[line(264,109,264,302),line(381,105,381,306)]);
const balloonBars=decorate(balloon,[line(216,157,424,157),line(197,245,442,245)]);
const balloonWaves=decorate(balloon,[waves(209,433,162,23,1),waves(199,444,239,31,1.5)],'dots');
const balloonPattern=decorate(balloon,[line(236,226,236,318),arch(342,294,69,48)],'sample',{
  samples:[line(236,117,236,208),arch(342,185,69,48)],sampleDivider:[p(204,214),p(430,214)],
});
const balloonFree=free({outlines:[balloon,line(320,358,320,404)],outlineColor:'#c99abd',
  demoPaths:[line(255,124,255,297),waves(208,429,211,31),ring(386,262,30)]});
const sunRadius=78,sunX=321,sunY=221;
const sunCore=ring(sunX,sunY,sunRadius);
const ray=(angle,length)=>line(
  sunX+Math.cos(angle)*(sunRadius+12),sunY+Math.sin(angle)*(sunRadius+12),
  sunX+Math.cos(angle)*(sunRadius+12+length),sunY+Math.sin(angle)*(sunRadius+12+length)
);
const sunBoard=(rays,guide='wide')=>trace(rays.map(([angle,length])=>dot(ray(angle,length),22)),{
  guide,outlines:[sunCore],outlineColor:'#e4b15e',items:[item('sun',321,221,137)],color:'#b57c42',reveal:true,
});
const sunTop=sunBoard([[-Math.PI/2,75]]);
const sunSides=sunBoard([[0,105],[Math.PI,83]]);
const sunFive=sunBoard([[-1.56,67],[-.7,82],[0,98],[.72,78],[2.43,99]],'dots');
const sunMixed=sunBoard([[-1.57,72],[-.83,42],[.05,122],[.88,48],[2.55,101]],'points');
const sunFree=free({outlines:[sunCore],outlineColor:'#dfa64d',items:[item('sun',321,221,133),item('flower',98,357)],demoPaths:[ray(-1.58,92),ray(0,93),ray(.66,74)],paper:'sunshine'});
const startCar=road(line(174,224,463,224),'car','garage',{width:45});
const carGarage=road(curve(107,273,535,176,257,283,306,166),'car','garage',{width:41,guide:'dots'});
const treeTop=curve(107,242,535,242,200,62,441,62);
const treeBottom=curve(107,242,535,242,178,385,464,385);
const aroundTree=road(treeTop,'car','garage',{corridors:[],demoPaths:[treeTop,treeBottom],
  obstacles:[{x:320,y:221,r:56,name:'tree'}],guide:'hidden',width:39});
const turningCar=road(waves(107,533,224,74,1),'car','garage',{width:39});
const ownCar=road(treeTop,'car','garage',{corridors:[],demoPaths:[treeTop,treeBottom],
  obstacles:[{x:321,y:219,r:62,name:'flower'}],guide:'hidden',width:42});
const snailLeaf=road(line(101,236,537,233),'snail','leaf',{width:47});
const snailFlower=road(curve(101,267,534,236,219,137,394,149),'snail','flower',{guide:'dots',width:42});
const snailTop=curve(106,226,530,226,198,59,426,59);
const snailBottom=curve(106,226,530,226,187,377,459,377);
const snailStone=road(snailTop,'snail','house',{corridors:[],demoPaths:[snailTop,snailBottom],
  obstacles:[{x:321,y:220,r:58,name:'rock'}],guide:'hidden',width:38});
const snailRoute=routeLine([111,330],[228,330],[228,225],[366,225],[366,128],[532,128]);
const snailMaze=road(snailRoute,'snail','flowerGold',{width:37,branches:[routeLine([228,225],[160,152],[97,148])]});
const snailHome=road(snailBottom,'snail','house',{corridors:[],demoPaths:[snailBottom,snailTop],
  obstacles:[{x:321,y:222,r:63,name:'flower'}],guide:'hidden',width:40,paper:'garden'});
const rugVertical=decorate(rug,[line(239,133,239,306),line(412,133,412,306)]);
const rugHorizontal=decorate(rug,[line(106,159,537,159),line(106,267,537,267)]);
const rugWaves=decorate(rug,[waves(114,529,166,25,1.5),waves(114,529,262,28,1.5)],'dots');
const rugPattern=decorate(rug,[line(210,251,272,251),arch(396,276,65,50)],'sample',{
  samples:[line(210,164,272,164),arch(396,189,65,50)],sampleDivider:[p(113,212),p(533,212)],
});
const rugFree=free({outlines:[rug],outlineColor:'#b789a8',demoPaths:[line(201,140,201,299),waves(102,540,210,37,1.5)]});
const meadow=trace([dot(line(159,155,159,313),26),dot(line(318,176,318,337),27),dot(line(482,147,482,297),25)],{
  guide:'dots',items:[item('flower',159,131,72),item('flowerGold',319,145,83),item('flower',482,118,73)],paper:'garden',reveal:true});
const solarDrawing=trace([dot(ring(321,221,79),25,{closed:true}),...[-1.58,-.56,.6,2.45].map(a=>dot(ray(a,58),23))],{guide:'dots',paper:'sunshine',color:'#b57c42'});
const picture=free({demoPaths:[line(139,131,246,133),waves(87,543,251,43,1.7),ring(403,135,62)],paper:'clouds'});
const blank=free({paper:'plain',demoPaths:[line(161,139,249,138),arch(314,242,119,83),ring(406,205,72)],exportable:true});

export const artists=moduleLessons(6,'artists',[
 [[scene('Большой шарик','Посмотри, сколько места на шарике для рисунка.',balloonFree),
   scene('Полоски','Шарик можно украсить прямыми линиями.',balloonBars),
   scene('Волны и кружки','Добавь округлые детали.',balloonFree)],
  task('Вертикальные полоски','Проведи две полоски на шарике.',balloonLines),
  task('Полоски в сторону','Укрась шарик горизонтальными линиями.',balloonBars),
  task('Плавные волны','Нарисуй на шарике две волны.',balloonWaves),
  task('Узор на шарике','Повтори узор в свободной половине.',balloonPattern),
  task('Праздничные шарики','Выбери цвета и укрась шарик так, как хочется.',balloonFree)],
 [[scene('Солнце ждёт','Рассмотри круг солнца без лучей.',sunTop),
   scene('От круга наружу','Линии расходятся от солнышка в разные стороны.',sunSides),
   scene('Разные лучики','Лучики бывают короткими и длинными.',sunMixed)],
  task('Верхний лучик','Дорисуй один лучик вверх.',sunTop),
  task('Лучики сбоку','Добавь по лучику с каждой стороны.',sunSides),
  task('Лучи по ориентирам','Добавь лучики по точкам.',sunFive),
  task('Длинные и короткие лучи','Проведи лучики разной длины.',sunMixed),
  task('Солнышко для Луми','Укрась утреннее солнце своими лучиками.',sunFree)],
 [[scene('Прямая дорога','Посмотри, как машинка проезжает по прямой.',startCar),
   scene('Клумба на пути','Дорога может огибать клумбу.',ownCar),
   scene('Едем по рисунку','Машинка поедет по твоему следу, когда он соединит начало и конец.',turningCar)],
  task('Короткая дорога','Нарисуй прямую дорогу.',startCar),
  task('Машинка и гараж','Соедини машинку с гаражом.',carGarage),
  task('Дерево на пути','Нарисуй дорогу вокруг дерева.',aroundTree),
  task('Два плавных поворота','Проведи дорогу с двумя изгибами.',turningCar),
  task('Город маленьких машинок','Придумай и нарисуй свой путь вокруг клумбы.',ownCar)],
 [[scene('Широкая тропинка','Улитка ползёт к листочку.',snailLeaf),
   scene('Камешек','Улитка огибает камешек.',snailStone),
   scene('След улитки','Улитка повторяет нарисованный путь.',snailMaze)],
  task('Улитка к листочку','Нарисуй тропинку к листочку.',snailLeaf),
  task('Путь к цветку','Нарисуй плавную дорогу.',snailFlower),
  task('Обход камешка','Помоги улитке обогнуть препятствие.',snailStone),
  task('Садовый лабиринт','Найди дорогу к цветку.',snailMaze),
  task('Путешествие улитки','Придумай дорожку к домику улитки.',snailHome)],
 [[scene('Коврик с вертикалями','Начнём с двух полос вдоль коврика.',rugVertical),
   scene('Полосы и волны','На коврике можно сочетать разные линии.',rugWaves),
   scene('Узор на ткани','Посмотри, как повторить линию и дугу.',rugPattern)],
  task('Полоски вдоль коврика','Укрась коврик вертикальными линиями.',rugVertical),
  task('Две полосы поперёк','Добавь горизонтальные линии.',rugHorizontal),
  task('Волны на коврике','Нарисуй плавные волны.',rugWaves),
  task('Образец коврика','Повтори узор рядом.',rugPattern),
  task('Коврик для Луми','Придумай свой рисунок и выбери цвета.',rugFree)],
 [[scene('Вспомним линии','Прямые линии, волны, дуги и круги могут быть рядом.',picture),
   scene('Цветок, солнце и дорожка','Из знакомых линий можно создавать предметы.',meadow),
   scene('Чистый лист','На чистом листе можно нарисовать то, что захотелось.',blank)],
  task('Цветочная полянка','Дорисуй стебельки трём цветам.',meadow),
  task('Солнечный день','Нарисуй круг солнца и его лучики.',solarDrawing),
  task('Маленькое путешествие','Создай дорожку для улитки.',snailHome),
  task('Картина из линий','Нарисуй свою композицию из линий.',picture),
  task('Мой первый шедевр','Нарисуй что захочешь. Рисунок можно сохранить.',blank)],
]);
