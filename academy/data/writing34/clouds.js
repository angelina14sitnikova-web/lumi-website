import {waves,ring,arch,routeLine,item,dot,trace,road,free,task,scene,moduleLessons} from './shape-kit.js';
const wave=(a,b,y,amp,count,guide,props=[])=>trace([dot(waves(a,b,y,amp,count),33)],{guide,paper:'clouds',items:props});
const bigWave=wave(112,524,223,72,1,'wide');
const fishWave=road(waves(117,525,224,60,1),'fish','star',{width:46,paper:'clouds'});
const doubleWave=wave(84,556,225,55,2,'wide');
const smallWaves=wave(80,566,221,49,3,'dots');
const sea=trace([dot(waves(82,555,176,30,2),27),dot(waves(82,555,316,33,2),27)],{
  guide:'dots',items:[item('boat',245,105,118),item('boat',410,249,91)],paper:'clouds',color:'#538aab',
});
const bigArch=trace([dot(arch(320,307,215,172),36)],{paper:'clouds'});
const bridge=trace([dot(arch(322,309,188,133),34)],{items:[item('leaf',121,311,84),item('leaf',517,312,85),item('fish',322,349,82)],paper:'clouds'});
const rainbow=(count,guide)=>trace(Array.from({length:count},(_,i)=>dot(arch(319,324,224-i*57,201-i*57),24)),{
  guide,items:[item('cloud',87,320,100),item('cloud',551,320,110)],paper:'clouds',reveal:true,color:'#aa77ae',
});
const basketArches=trace([dot(arch(179,250,76,87),28),dot(arch(463,252,87,101),29)],{
 items:[item('basket',179,278,153),item('basket',463,284,164)],
});
const around=(radius,icon,closed=false,guide)=>trace([dot(ring(320,222,radius),32,closed?{closed:true}:{openCircle:true})],{
  items:icon?[item(icon,320,222,145)]:[],guide,paper:'clouds',reveal:true,
});
const twoCircles=(closed)=>trace([dot(ring(179,230,94),26,{closed,openCircle:!closed}),dot(ring(458,230,107),27,{closed,openCircle:!closed})],{paper:'clouds'});
const wheels=trace([dot(ring(221,275,62),24,{closed:true}),dot(ring(426,275,62),24,{closed:true})],{
  items:[item('car',324,177,247)],color:'#5e859e',
});
const multiBalloons=trace([dot(ring(181,227,88,107),30,{closed:true,guide:'wide'}),dot(ring(460,199,99,113),28,{closed:true,guide:'dots'})],{
  items:[item('balloon',180,226,135),item('balloon',460,201,157)],reveal:true,
});
const square=routeLine([161,100],[480,100],[480,356],[161,356],[161,100]);
const triangle=routeLine([319,70],[525,344],[119,344],[319,70]);
const figure=(shape)=>trace([dot(shape,35,{closed:true})],{paper:'clouds'});
const squareRound=trace([dot(routeLine([81,164],[282,164],[282,334],[81,334],[81,164]),28,{closed:true}),dot(ring(453,248,100),29,{closed:true})],{guide:'dots'});
const puff=around(141,'cloud',true,'wide');
const finalPicture=trace([dot(arch(320,180,130,96),28),dot(waves(116,529,323,45,1.5),29),dot(ring(92,204,49),22,{openCircle:true}),dot(ring(550,190,50),22,{openCircle:true})],{
  guide:'dots',paper:'clouds',items:[item('boat',316,279,111)],reveal:true,
});

export const clouds=moduleLessons(4,'clouds',[
 [[scene('Морские волны','Луми смотрит на мягкие волны.',sea),
   scene('Широкая волна','Огонёк поднимается и опускается по волне.',bigWave),
   scene('Волна за волной','Посмотри на два плавных изгиба.',doubleWave)],
  task('Большая волна','Обведи одну большую волну.',bigWave),
  task('Рыбка и волна','Нарисуй волнистую тропинку для рыбки.',fishWave),
  task('Две волны','Восстанови дорожку из двух волн.',doubleWave),
  task('Волны по точкам','Проведи плавную линию вдоль пунктира.',smallWaves),
  task('Волшебное море','Нарисуй две волнистые линии под корабликами.',sea)],
 [[scene('Радуга над облаками','У радуги несколько плавных дуг.',rainbow(3,'wide')),
   scene('Одна большая дуга','Огонёк поднимается по дуге и снова опускается.',bigArch),
   scene('Похожие дуги','Дуги могут быть большими и маленькими.',rainbow(2,'wide'))],
  task('Большая дуга','Проведи пальчиком вдоль дуги.',bigArch),
  task('Мостик через ручей','Нарисуй мостик над рыбкой.',bridge),
  task('Две полоски радуги','Проведи две дуги.',rainbow(2,'dots')),
  task('Ручки корзинок','Дорисуй две дугообразные ручки.',basketArches),
  task('Радуга Луми','Нарисуй три полосы радуги.',rainbow(3,'dots'))],
 [[scene('Игрушечное колесо','Пальчик может двигаться вокруг колеса.',around(146,'wheel')),
   scene('Круговое движение','Посмотри, как огонёк движется вокруг цветка.',around(144,'flower')),
   scene('Круг за кругом','Попробуй два круговых движения.',twoCircles(false))],
  task('Вокруг колеса','Проведи по круглой дорожке вокруг колеса.',around(145,'wheel')),
  task('Круг вокруг цветка','Нарисуй округлую дорожку вокруг цветка.',around(139,'flower')),
  task('Мыльный пузырь','Проведи округлую линию для пузырька.',around(121,null,false,'dots')),
  task('Два круговых движения','Нарисуй два отдельных круговых движения.',twoCircles(false)),
  task('Танец пузырьков','Нарисуй свои пузыри. Можешь выбирать цвета.',free({paper:'clouds',demoPaths:[ring(213,181,92),ring(448,255,117)]}))],
 [[scene('Край большого круга','Рассмотри округлый край.',around(155,null,true)),
   scene('Возвращаемся к началу','Пальчик обходит круг и возвращается к огоньку.',around(130,'wheel',true)),
   scene('Два разных круга','Обведём круги разного размера.',twoCircles(true))],
  task('Большой круг','Обведи круг по широкой дорожке.',around(156,null,true)),
  task('Круглый мяч','Верни мячику круглый край.',around(126,'ball',true,'dots')),
  task('Два колеса','Обведи оба колеса игрушечной машинки.',wheels),
  task('Круг по пунктиру','Соедини пунктирные отметки в круг.',around(145,null,true,'dots')),
  task('Воздушные шарики','Обведи шарики и замкни края.',multiBalloons)],
 [[scene('Круг','Посмотри, как обводят круг.',around(142,null,true)),
   scene('Квадрат с уголками','В уголках можно остановиться и продолжить.',figure(square)),
   scene('Треугольник','У треугольника три широких стороны.',figure(triangle))],
  task('Круглый контур','Обведи круг.',around(143,null,true)),
  task('Большой квадрат','Обведи четыре стороны. Можно рисовать по одной.',figure(square)),
  task('Крупный треугольник','Проведи по трём сторонам треугольника.',figure(triangle)),
  task('Две фигуры','Обведи рядом круг и квадрат.',squareRound),
  task('Геометрические облака','Обведи три фигуры и посмотри, что появится.',{...figure(square),reveal:true,rewardItems:[item('gift',320,221,150)]},{...figure(triangle),reveal:true,rewardItems:[item('house',320,221,150)]},puff)],
 [[scene('Волна снова','Вспомним, как плавно подниматься и опускаться.',doubleWave),
   scene('Плавная дуга','Дуга поднимается над островками.',bridge),
   scene('Картина округлых линий','В одной картине могут быть волны, дуги и круги.',finalPicture)],
  task('Волна для рыбки','Нарисуй волнистую линию.',fishWave),
  task('Дуга радуги','Нарисуй дугу радуги над облаками.',rainbow(1,'dots')),
  task('Круглое облачко','Обведи округлый край облачка.',puff),
  task('Плавные линии','Повтори волну, дугу и круг в трёх раундах.',bigWave,bridge,around(139,null,false,'dots')),
  task('Воздушная картина','Добавь волны, дугу и круговые линии.',finalPicture)],
]);
