import {p,line,curve,waves,item,dot,trace,road,free,task,scene,moduleLessons} from './shape-kit.js';
const v=(x,y,h,tolerance=30,guide)=>dot(line(x,y,x,y+h),tolerance,{guide});
const h=(x,y,length,tolerance=29,guide)=>dot(line(x,y,x+length,y),tolerance,{guide});
const stem=(x,y,len,guide)=>trace([v(x,y,len,31,guide)],{items:[item('flower',x,y-31)]});
const balloonStrings=trace([v(198,142,149),v(441,142,205)],{items:[item('balloon',198,104),item('balloon',441,102)]});
const stems=(x,y)=>{const starts=[147,232,318,405,493];return trace(starts.map((a,i)=>v(a,y+i%2*30,x-i%2*35,23,i<2?'wide':'dots')),{items:starts.map((a,i)=>item(i%2?'flowerGold':'flower',a,y+i%2*30-22,59)),paper:'garden'});};
const fence=(upright)=>trace(upright?[v(183,140,174,29),v(316,140,174,29),v(455,140,174,29)]:[h(115,166,410),h(115,265,410)],{
  outlines:upright?[line(100,186,540,186),line(100,254,540,254)]:[line(160,112,160,325),line(316,112,316,325),line(469,112,469,325)],
  color:'#b77a58'
});
const compareLength=trace([h(114,233,162,28,'points'),h(346,234,205,28,'points')],{samples:[line(114,138,276,138),line(326,138,570,138)]});
const pointBoard=(points,objects=[])=>trace([dot(points,32)],{guide:'points',items:objects});
const rain=(count,props,settings={})=>({kind:'ink',mode:'marks',count,axis:'vertical',area:{x:103,y:139,w:438,h:170},
  demoPaths:Array.from({length:count},(_,i)=>line(173+i*62,166+i%2*28,173+i*62,213+i%2*28)),
  items:[item('cloud',319,88,150),...props],...settings,
});
const car=road(line(122,231,524,231),'car','garage',{width:42});
const rabbit=road(curve(116,271,518,211,230,143,406,144),'rabbit','carrot');
const houses=pointBoard(curve(136,259,508,195,249,109,372,222),[item('house',98,261),item('house',551,190)]);
const flowerWay=road(curve(101,271,532,271,179,62,475,62),'lumi','house',{obstacles:[{x:316,y:262,r:59,name:'flower'}],width:39});
const dots=[line(130,106,474,106),line(222,202,222,348),line(346,211,524,341)];
const constellation=trace([dot(line(135,144,457,144),34),dot(line(164,253,321,359),31),dot(line(382,329,521,241),32)],{
  items:[[135,144],[457,144],[164,253],[321,359],[382,329],[521,241]].map(([x,y])=>item('star',x,y,44)),guide:'points',paper:'clouds',reveal:true});
const bridge=(x,y,w)=>trace([h(x,y,w,29)],{items:[item('house',x-37,y-5),item('house',x+w+38,y-5)],paper:'clouds'});

export const pencils=moduleLessons(3,'pencils',[
 [[scene('Сверху вниз','Огонёк ведёт вертикальный след.',trace([v(319,82,257,43)])),
   scene('Стебелёк','Под цветком появляется стебелёк.',stem(320,156,173)),
   scene('Разная высота','Прямые линии могут быть короткими и длинными.',balloonStrings)],
  task('Короткая вертикальная линия','Проведи по широкому следу.',trace([v(319,145,145,41)])),
  task('Стебелёк цветка','Дорисуй под цветком стебелёк.',stem(320,149,192)),
  task('Ниточки шариков','Проведи отдельную ниточку для каждого шарика.',balloonStrings),
  task('Вертикали забора','Нарисуй три стойки забора.',fence(true)),
  task('Сад высоких цветов','Дорисуй стебельки пяти цветов.',stems(154,158))],
 [[scene('Ровно в сторону','Огонёк идёт по горизонтали.',trace([h(112,216,415,38)])),
   scene('Между домиками','Луми соединяет два домика ровной дорожкой.',bridge(130,222,370)),
   scene('Две длины','Линии на одной высоте бывают разной длины.',compareLength)],
  task('Короткая горизонтальная линия','Проведи короткую линию.',trace([h(222,218,195,38)])),
  task('Дорожка машинки','Проведи ровную дорогу для машинки.',car),
  task('Два предмета','Соедини два рисунка горизонтальной линией.',pointBoard(line(144,228,493,228),[item('flower',112,222),item('leaf',528,224)])),
  task('Перекладины забора','Дорисуй две горизонтальные перекладины.',fence(false)),
  task('Мостики королевства','Соедини островки ровными мостиками.',bridge(160,219,314),bridge(211,245,212),bridge(128,207,383))],
 [[scene('Точки рядом','Огонёк соединяет близкие точки.',pointBoard(line(256,215,387,215))),
   scene('Точки далеко','Когда точки далеко, линия получается длиннее.',pointBoard(line(117,217,520,217))),
   scene('Сравним линии','Посмотри на короткую и длинную линии рядом.',compareLength)],
  task('Близкие точки','Соедини две близкие точки.',pointBoard(line(239,217,402,217))),
  task('Длинная дорожка','Нарисуй длинную линию до далёкой точки.',pointBoard(line(89,215,551,215))),
  task('Короткая и длинная ниточка','Нарисуй обе ниточки.',balloonStrings),
  task('Две длины по образцу','Нарисуй короткую и длинную линии.',compareLength),
  task('Город длинных и коротких мостиков','Построй пять линий между островками.',bridge(240,210,158),bridge(126,220,383),bridge(252,239,143),bridge(143,203,353),bridge(174,228,289))],
 [[scene('Капли дождя','Посмотри, куда опускаются капельки.',rain(1,[])),
   scene('Штрихи под облаком','Короткие линии становятся дождиком.',rain(3,[])),
   scene('Дождик над садом','Размести штрихи под облаком свободно.',rain(5,[item('flower',269,350)]))],
  task('Одна капелька','Нарисуй один короткий штрих сверху вниз.',rain(1,[])),
  task('Три капельки','Проведи три короткие линии под облаком.',rain(3,[])),
  task('Дождик над клумбой','Нарисуй несколько капелек над цветами.',rain(4,[item('flowerGold',172,353),item('flower',328,365),item('flowerGold',480,357)])),
  task('Дождливая область','Заполни поле короткими вертикальными штрихами.',rain(5,[],{outlineColor:'#c5d8db',outlines:[[p(103,139),p(541,139),p(541,309),p(103,309),p(103,139)]]})),
  task('Дождик для волшебного сада','Нарисуй дождь, чтобы цветы раскрылись.',rain(5,[item('flower',169,356),item('flowerGold',321,356),item('flower',481,356)],{reveal:true}))],
 [[scene('Ровная дорога','Посмотри, как прямая соединяет дорогу и домик.',car),
   scene('В обход цветка','Путь может плавно огибать клумбу.',flowerWay),
   scene('От начала до конца','Огонёк проходит всю дорожку между домиками.',houses)],
  task('Машинка на дороге','Создай прямую дорожку для машинки.',car),
  task('Зайчик идёт к морковке','Проведи тропинку до морковки.',rabbit),
  task('Два домика','Нарисуй плавную дорогу между домиками.',houses),
  task('Вокруг клумбы','Нарисуй дорогу вокруг клумбы.',flowerWay),
  task('Город дорожек','Нарисуй свои дороги между домиками. Выбирай путь сам.',free({paper:'garden',items:[item('house',120,150),item('house',500,159),item('house',321,332)],demoPaths:[line(133,154,486,157),curve(130,163,311,322,170,244,252,285)]}))],
 [[scene('Две точки','Луми показывает начало и конец линии.',pointBoard(dots[0])),
   scene('Точки соединяются','Проведи от одной точки к другой.',pointBoard(line(263,211,411,211))),
   scene('Разные направления','Линии могут идти в сторону, вниз или наискосок.',trace(dots.map(path=>dot(path,30)),{guide:'points'}))],
  task('Точки рядом','Соедини точки, которые лежат на одной высоте.',pointBoard(line(153,214,497,214))),
  task('Точки друг под другом','Соедини верхнюю и нижнюю точки.',pointBoard(line(317,97,317,330))),
  task('Две точки наискосок','Соедини их плавной наклонной линией.',pointBoard(curve(158,308,499,102,262,287,362,123))),
  task('Три пары','Соедини каждую пару точек.',trace(dots.map(path=>dot(path,29)),{guide:'points'})),
  task('Созвездия Луми','Соедини три пары звёзд.',constellation)],
]);
