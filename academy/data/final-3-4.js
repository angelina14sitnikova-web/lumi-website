import {piece, lesson, scene, exercise, pick, connect} from './sensory-builders.js';

const art=(shape,color='sky',size)=>piece(shape,color,size);
const list=(...shapes)=>shapes.map(shape=>art(shape));
const group=(shape,count)=>({...art(shape),count});
const choose=(prompt,pieces,index,sample,extra)=>exercise(prompt,'Посмотри на рисунки и выбери подходящий.',pick(pieces,index,sample,extra));
const links=(prompt,pieces,targets,matches,extra)=>exercise(prompt,'Нажми на предмет, затем на подходящее место.',connect(pieces,targets,matches,extra));
const demo=(text,...pieces)=>scene('together',text,pieces);
const move=(text,pieces,targets,matches)=>scene('move',text,pieces,{targets,matches});
const pairs=(text,a,n,b,m)=>scene('correspond',text,[group(a,n),group(b,m)]);
const match=(prompt,a,n,b,m,answer)=>choose(prompt,[group(a,n),group(b,m)],answer,null,{pairCounts:[n,m]});
const deal=(prompt,item,recipient,n)=>links(prompt,[art(item)],[group(recipient,n)],[0],{repeat:n,recipient:group(recipient,n)});
const eq=(prompt,a,b,n,m,k,l,answer)=>choose(prompt,[{...group(a,n),other:m,otherShape:b},{...group(a,k),other:l,otherShape:b}],answer);
const balance=(prompt,a,n,b,m,action)=>choose(prompt,list('addOne','takeOne'),action==='add'?0:1,null,
 {balance:[group(a,n),group(b,m)],action});
const adjust=(text,a,n,b,m,action)=>scene('balance',text,[group(a,n),group(b,m)],{action});
const entries={};
const add=(module,n,room,scenes,practice)=>{entries[module+'-'+n]=lesson(room,scenes,practice);};
const meadow='pair-meadow';
add('pairs',1,meadow,[
 pairs('Зайчику — одна морковка.','bunny',1,'carrot',1),pairs('Пришёл второй зайчик. Сделаем ещё одну пару.','bunny',2,'carrot',2),pairs('У каждого зайчика теперь своя морковка.','bunny',2,'carrot',2),
],[
 deal('Соедини зайчика с морковкой','carrot','bunny',1),deal('Подбери чашку к блюдцу','mug','plate',1),deal('Каждому медведю — мяч','ball','bear',2),deal('Соедини цветы с вазами','flower','vase',3),deal('Раздай зверькам угощение','berry','bunny',4),
]);
add('pairs',2,meadow,[
 demo('Посмотри на чашки и блюдца.',group('mug',3),group('plate',3)),pairs('Каждой чашке — блюдце.','mug',3,'plate',3),pairs('Одной чашке пары не хватило.','mug',3,'plate',2),
],[
 deal('Подбери по тарелке к каждой чашке','plate','mug',2),deal('Соедини машинки с гаражами','car','garage',3),deal('Раздай шарики медвежатам','balloon','bear',3),match('Выбери ряд с предметом без пары','mug',3,'plate',2,0),deal('Найди домик каждой игрушке','bear','house',4),
]);
add('pairs',3,meadow,[
 demo('Здесь зайчики и морковки.',group('bunny',2),group('carrot',2)),pairs('Морковок столько же, сколько зайчиков.','bunny',2,'carrot',2),pairs('На каждый цветок есть ваза.','flower',3,'vase',3),
],[
 choose('Где столько же яблок, сколько на образце?',[1,2,3].map(n=>group('apple',n)),1,group('apple',2)),deal('Подбери столько же чашек, сколько блюдец','mug','plate',2),deal('Составь пары между двумя группами','ball','hoop',3),choose('Найди столько же игрушек',[group('bear',3),group('bear',2)],0,group('bear',3)),deal('Собери кубики по образцу','block','block',4),
]);
add('pairs',4,meadow,[
 pairs('Соединим мячи с обручами.','ball',2,'hoop',2),pairs('Лишних нет. Мячей и обручей поровну.','ball',2,'hoop',2),pairs('Здесь у каждой игрушки своя коробка.','bear',3,'box',3),
],[
 eq('Где яблок и корзинок поровну?','apple','basket',2,2,3,2,0),deal('Соедини чашки с блюдцами','mug','plate',3),eq('Найди равные группы','ball','hoop',3,2,3,3,1),deal('По одному цветку в каждую вазу','flower','vase',3),eq('Выбери стол, где всем хватило угощения','bunny','berry',3,2,3,3,1),
]);
add('pairs',5,meadow,[
 demo('Здесь зайчики и морковки.',group('bunny',3),group('carrot',2)),pairs('Один зайчик остался без морковки.','bunny',3,'carrot',2),pairs('Морковок и зайчиков не поровну.','bunny',3,'carrot',2),
],[
 eq('Где предметов не поровну?','apple','basket',2,2,3,2,1),match('Найди ряд с лишним мячом','hoop',2,'ball',3,1),eq('Где кукле не хватило кроватки?','doll','bed',3,2,3,3,0),eq('Найди неравные группы','star','box',2,2,2,3,1),eq('За каким столом угощений не поровну?','bunny','berry',3,3,2,3,1),
]);
add('pairs',6,meadow,[
 pairs('Каждому яблоку подбираем корзинку.','apple',3,'basket',2),pairs('Яблоко осталось. Яблок больше, корзинок меньше.','apple',3,'basket',2),pairs('Теперь предмет без пары в нижнем ряду. Мячей больше.','box',2,'ball',3),
],[
 match('Чего больше: мячей или коробок?','ball',3,'box',2,0),match('Каких игрушек меньше?','bear',2,'car',3,0),match('Чего больше: цветков или ваз?','vase',2,'flower',3,1),match('Где кубиков больше?','block',4,'block',3,0),match('Каких угощений меньше?','berry',4,'apple',3,1),
]);
add('pairs',7,meadow,[
 adjust('Добавим морковку, и её получит каждый зайчик.','bunny',3,'carrot',2,'add'),adjust('Уберём лишнюю чашку. Теперь поровну.','plate',2,'mug',3,'remove'),adjust('Можно добавить предмет к меньшей группе или убрать из большей.','flower',3,'vase',2,'add'),
],[
 balance('Добавь морковку в нижний ряд','bunny',3,'carrot',2,'add'),balance('Убери лишний мяч снизу','box',2,'ball',3,'remove'),balance('Что сделать с нижним рядом, чтобы стало поровну?','plate',3,'mug',2,'add'),balance('Сделай поровну, изменив нижний ряд','flower',2,'vase',3,'remove'),balance('Подготовь угощение поровну','bunny',4,'berry',3,'add'),
]);
const forest='trail';
const point=(shape,x,y)=>({...art(shape),x,y});
const location=(kind,anchor,shapes,answer,flip=false)=>{
 const coords={front:[[20,55],[78,55]],vertical:[[52,20],[52,83]],side:[[22,55],[79,55]],distance:[[38,76],[80,24]]}[kind];
 const centre=kind==='distance'?[15,76]:[50,53];
 const items=shapes.map((shape,i)=>point(shape,...coords[flip?1-i:i]));
 return {items,anchor:point(anchor,...centre),direction:kind==='front',focus:answer,kind};
};
const space=(text,kind,anchor,items,answer,flip)=>scene('locate',text,[],{place:location(kind,anchor,items,answer,flip)});
const locate=(prompt,kind,anchor,items,answer,flip)=>{
 const place=location(kind,anchor,items,answer,flip);
 return choose(prompt,place.items,answer,null,{place});
};
const stack=(prompt,...tasks)=>exercise(prompt,'Следуй за подсказкой на каждом шаге.',...tasks.flatMap(x=>x.rounds.map(round=>({...round,prompt:x.prompt}))));
const front=(prompt,a,items,i,flip)=>locate(prompt,'front',a,items,i,flip);
const level=(prompt,a,items,i,flip)=>locate(prompt,'vertical',a,items,i,flip);
const side=(prompt,items,i,flip)=>locate(prompt,'side','lumiBack',items,i,flip);
const near=(prompt,a,items,i,flip)=>locate(prompt,'distance',a,items,i,flip);
const placeToy=(prompt,kind,anchor,shape,index)=> {
 const place=location(kind,anchor,['spot','spot'],index);
 return links(prompt,[art(shape)],place.items,[index],{place});
};
add('space',1,forest,[
 space('Стрелка показывает, куда смотрит Луми. Мяч впереди.','front','lumiSide',['box','ball'],1),
 space('Коробка позади Луми.','front','lumiSide',['box','ball'],0),
 space('Смотрим сбоку: перед Луми мяч, а позади коробка.','front','lumiSide',['box','ball'],1),
],[
 front('Найди мяч впереди Луми','lumiSide',['box','ball'],1),front('Покажи коробку сзади Луми','lumiSide',['ball','box'],1,true),front('Что впереди машинки?','car',['ball','block'],1),front('Что позади медведя?','bear',['ball','box'],0),placeToy('Положи игрушку впереди Луми','front','lumiSide','bear',1),
]);
add('space',2,forest,[
 space('У шкафа есть верхняя и нижняя полки.','vertical','shelf',['ball','bear'],0),
 space('Птица над деревом, цветок под ним.','vertical','tree',['bird','flower'],1),
 space('Звёздочка спускается сверху вниз.','vertical','shelf',['spot','star'],1),
],[
 level('Что на верхней полке?','shelf',['bear','car'],0),level('Покажи предмет на нижней полке','shelf',['ball','block'],1),level('Выбери звёздочку сверху','shelf',['star','star'],0),level('Найди предмет под полкой','shelf',['car','box'],1),stack('Положи один предмет сверху, другой снизу',placeToy('Положи мяч сверху','vertical','shelf','ball',0),placeToy('Положи кубик снизу','vertical','shelf','block',1)),
]);
add('space',3,forest,[
 space('Луми смотрит туда же, куда ты. Он поднимает правую лапку.','side','lumiRight',['spot','spot'],1),
 space('Теперь Луми поднимает левую лапку.','side','lumiLeft',['spot','spot'],0),
 space('Мяч справа от Луми, кубик слева.','side','lumiBack',['block','ball'],1),
],[
 side('Что справа от Луми?',['block','ball'],1),side('Найди предмет слева',['bear','box'],0),placeToy('Положи мяч справа','side','lumiBack','ball',1),placeToy('Положи кубик слева','side','lumiBack','block',0),stack('Выбери нужную сторону',side('Найди игрушку слева',['bear','car'],0),side('Теперь найди игрушку справа',['ball','bear'],1)),
]);
add('space',4,forest,[
 space('Этот домик близко к Луми.','distance','lumiBack',['house','house'],0),
 space('Другой домик далеко, в конце дорожки.','distance','lumiBack',['house','house'],1),
 space('Сравним два одинаковых дерева: одно близко, другое далеко.','distance','lumiBack',['tree','tree'],0),
],[
 near('Найди домик близко к Луми','lumiBack',['house','house'],0),near('Выбери далёкое дерево','lumiBack',['tree','tree'],1),near('Покажи близкий мяч','lumiBack',['ball','ball'],0),near('Найди далёкую игрушку','lumiBack',['car','bear'],1),stack('Найди близкий и далёкий предметы',near('Какой цветок близко?','lumiBack',['flower','flower'],0),near('Какой кубик далеко?','lumiBack',['block','block'],1)),
]);
add('space',5,forest,[
 space('Этот мяч ближе к Луми.','distance','lumiBack',['ball','ball'],0),
 space('Другой мяч дальше от Луми.','distance','lumiBack',['ball','ball'],1),
 space('Поменяем мячи местами. Сравним от того же места.','distance','lumiBack',['ball','ball'],1,true),
],[
 near('Какой мяч ближе к Луми?','lumiBack',['ball','ball'],0),near('Какой домик дальше?','lumiBack',['house','house'],1),near('Какое дерево ближе к мостику?','bridge',['tree','tree'],0),near('Какая игрушка ближе к корзине?','basket',['bear','bear'],0),stack('Выбери более близкий предмет',near('Найди ближайший цветок','tree',['flower','flower'],0),near('Найди ближайшую машинку','garage',['car','car'],0),near('Найди ближайший мяч','box',['ball','ball'],0)),
]);
add('space',6,forest,[
 space('Мяч над коробкой.','vertical','box',['ball','bear'],0),
 space('Машинка впереди Луми.','front','lumiSide',['box','car'],1),
 space('Сначала ищем сверху, потом справа.','side','lumiBack',['ball','star'],1),
],[
 level('Найди игрушку над коробкой','box',['bear','car'],0),front('Что сзади Луми?','lumiSide',['box','ball'],0),near('Найди мяч близко к дереву','tree',['ball','ball'],0),side('Что справа от Луми?',['bear','ball'],1),stack('Выполни две команды',level('Найди верхний кубик','shelf',['block','ball'],0),side('Теперь найди игрушку слева',['car','bear'],0)),
]);
add('space',7,forest,[
 space('На карте есть дорожка, мостик и домик.','distance','bridge',['house','tree'],0),
 space('Одна игрушка впереди Луми, другая позади домика.','front','house',['bear','car'],0),
 space('Сначала смотрим рядом, потом ищем вдалеке.','distance','lumiBack',['box','ball'],1),
],[
 front('Что впереди Луми?','lumiSide',['box','car'],1),level('Что на верхней полке?','shelf',['bear','ball'],0),near('Какой домик ближе?','lumiBack',['house','house'],0),side('Найди игрушку слева от Луми',['bear','car'],0),stack('Найди три спрятанных предмета',near('Ищи рядом с мостиком','bridge',['box','star'],0),level('Посмотри под полкой','shelf',['ball','bear'],1),side('Посмотри справа',['car','block'],1)),
]);
const tower='time-tower';
const moment=(shape,phase)=>({...art(shape),phase});
const sky=phase=>moment('skyScene',phase);
const morning='morning', day='day', evening='evening', night='night';
const time=(text,...cards)=>demo(text,...cards);
const identify=(prompt,options,index,sample)=>choose(prompt,options,index,sample);
const orderRound=(...events)=>connect(events.slice().reverse(),events,[...events.keys()].reverse(),{ordered:true,sequence:true});
const order=(prompt,...events)=>exercise(prompt,'Выбери, что было сначала. Потом положи следующую картинку.',orderRound(...events));
const sorts=(prompt,cards,a,b,answers)=>links(prompt,cards,[sky(a),sky(b)],answers);
const m=(...shapes)=>shapes.map(s=>moment(s,morning));
const d=(...shapes)=>shapes.map(s=>moment(s,day));
const e=(...shapes)=>shapes.map(s=>moment(s,evening));
const n=(...shapes)=>shapes.map(s=>moment(s,night));
const [wake,wash,breakfast]=m('wake','wash','meal');
const [walk,play]=d('walk','play');
const [home,dinner,ready]=e('home','meal','ready');
const [sleep]=n('sleep');
add('time',1,tower,[
 time('Луми просыпается. За окном рассвет.',wake),time('В это утро Луми умывается и завтракает.',wash,breakfast),move('В истории сначала пробуждение, потом умывание и завтрак.',[wake,wash,breakfast],[wake,wash,breakfast],[0,1,2]),
],[
 identify('Где утро?',[sky(night),sky(morning)],1,sky(morning)),identify('Что сделал Луми после пробуждения?',[sleep,wash],1,wake),identify('Покажи восходящее солнце',[sky(morning),sky(evening)],0,sky(morning)),identify('Что Луми делал этим утром?',[breakfast,ready],0,wake),order('Разложи утренние картинки',wake,wash),
]);
add('time',2,tower,[
 time('Днём на улице светло, солнце выше. ',sky(day)),time('На этой дневной картинке Луми гуляет и играет.',walk,play),time('На рассвете солнце у края неба. Днём оно поднимается выше.',sky(morning),sky(day)),
],[
 identify('Выбери дневное небо',[sky(day),sky(night)],0,sky(day)),identify('Покажи дневную прогулку',[sleep,walk],1,sky(day)),identify('Где солнце высоко?',[sky(morning),sky(day)],1,sky(day)),identify('Найди день',[sky(night),sky(morning),sky(day)],2,sky(day)),sorts('Собери две дневные сцены',[walk,play],day,night,[0,0]),
]);
add('time',3,tower,[
 time('Вечером солнце опускается к горизонту.',sky(evening)),time('В этой истории Луми возвращается домой и ужинает.',home,dinner),time('Становится темнее. Луми готовится ко сну.',sky(evening),ready),
],[
 identify('Найди вечер',[sky(day),sky(evening)],1,sky(evening)),identify('Найди закат',[sky(evening),sky(morning)],0,sky(evening)),identify('Что Луми делал вечером в нашей истории?',[wash,ready],1,home),identify('Где вечер?',[sky(day),sky(night),sky(evening)],2,sky(evening)),order('Разложи вечерние картинки',home,dinner),
]);
add('time',4,tower,[
 time('Ночью небо тёмное, иногда видны звёзды.',sky(night)),time('Луми улёгся в уютной комнате.',sleep),time('Днём светло, а ночью темнее. Это одна и та же полянка.',sky(day),sky(night)),
],[
 identify('Выбери ночное небо',[sky(night),sky(day)],0,sky(night)),identify('Где Луми спит ночью?',[sleep,wake],0,sky(night)),identify('Покажи ночь',[sky(evening),sky(night),sky(day)],1,sky(night)),identify('Выбери ночные картинки',[walk,sleep,sky(night),wake],[1,2],sky(night)),identify('Выбери ночную сцену для сказки',[sleep,play],0,sky(night)),
]);
add('time',5,tower,[
 time('Утром в нашей истории Луми проснулся.',wake),time('Вечером Луми готовится ко сну.',ready),time('Освещение похоже. Посмотри, что делает Луми в каждой сцене.',wake,ready),
],[
 identify('Покажи утреннее умывание',[ready,wash],1,wake),identify('Где Луми готовится ко сну?',[ready,wake],0,ready),sorts('Разложи картинки на утро и вечер',[wash,home,wake,ready],morning,evening,[0,1,0,1]),identify('Где Луми только что проснулся?',[moment('ready','twilight'),moment('wake','twilight')],1,wake),exercise('Восстанови утро и вечер','Разложи картинки по порядку.',orderRound(wake,wash),orderRound(home,ready)),
]);
add('time',6,tower,[
 time('Днём на полянке светло.',sky(day)),time('На той же полянке ночью темно.',sky(night)),time('В нашей истории Луми гуляет днём и спит ночью.',walk,sleep),
],[
 identify('Покажи день',[sky(night),sky(day)],1,sky(day)),identify('Найди ночь',[sky(night),sky(day)],0,sky(night)),sorts('Разложи картинки на день и ночь',[walk,sleep,sky(night),play],day,night,[0,1,1,0]),identify('Где Луми гуляет днём?',[walk,moment('walk',night),sleep],0,sky(day)),links('Соедини дневные и ночные виды одного места',[moment('house',day),moment('tree',day)],[moment('tree',night),moment('house',night)],[1,0]),
]);
const [rinse,eat,boots,out,seed,water,grow]=list('rinse','eat','boots','walk','seed','water','grow');
add('time',7,tower,[
 move('Сначала Луми моет яблоко. Потом ест.',[rinse,eat],[rinse,eat],[0,1]),move('Сначала надевает сапоги. Потом выходит.',[boots,out],[boots,out],[0,1]),move('Посадили семечко, полили, вырос цветок.',[seed,water,grow],[seed,water,grow],[0,1,2]),
],[
 identify('Что было раньше?',[eat,rinse],1),identify('Что произошло позже?',[boots,out],1),order('Разложи картинки: сначала и потом',rinse,eat),order('Разложи этапы посадки цветка',seed,water,grow),order('Восстанови события из истории Луми',wake,walk,ready),
]);
const hall='discovery-hall';
const red='red', blue='blue', yellow='yellow', green='green';
const colored=(...items)=>items.map(([shape,color])=>art(shape,color));
const crayons=colored(['gift',red],['badge',yellow],['mitten',blue],['leaf',green]);
const paintTargets=colored(['block',yellow],['car',red],['ball',green],['boat',blue]);
const shapeSources=list('badge','tile','flag','door');
const shapeTargets=list('square','triangle','circle','rectangle');
const sizes=(shape,...values)=>values.map(size=>art(shape,'sky',size));
const extent=(shape,axis,value)=>({...art(shape),axis,value});
const ribbon=n=>extent('ribbon','length',n);
const height=n=>extent('tower','height',n);
const colorSort=()=>links('Разложи предметы по цвету',crayons,paintTargets,[1,0,3,2]);
const shapeSort=()=>links('Разложи детали по форме',shapeSources,shapeTargets,[2,0,1,3]);
const sizeSort=()=>links('Разложи по размеру',sizes('bear','large','small'),sizes('box','small','large'),[1,0]);
add('review',1,hall,[
 move('Красный мяч и красная машинка подходят друг другу.',colored(['ball',red]),colored(['car',red]),[0]),
 demo('Красный подарок и красный флажок разной формы, но одного цвета.',...colored(['gift',red],['flag',red])),
 move('Сравним каждую игрушку с образцом цвета.',crayons,paintTargets,[1,0,3,2]),
],[
 choose('Найди предмет цвета образца',colored(['car',yellow],['ball',blue],['gift',red]),2,art('badge',red)),
 links('Соедини красные игрушки',colored(['car',red]),colored(['bear',blue],['ball',red]),[1]),
 links('Собери две пары по цвету',crayons.slice(0,2),paintTargets.slice(0,2),[1,0]),
 choose('Найди ошибку в цветной паре',colored(['car',red],['gift',blue],['flag',red]),1,art('ball',red),{setting:'odd'}),
 colorSort(),
]);
add('review',2,hall,[
 move('Круглая деталь подходит к кругу.',list('badge'),list('circle'),[0]),
 demo('Плитка и квадрат разного цвета, но одной формы.',art('tile',yellow),art('square',blue)),
 move('Соединим детали с подходящими формами.',list('flag','plate'),list('circle','triangle'),[1,0]),
],[
 choose('Найди круглую пару',list('plate','tile'),0,art('badge')),
 choose('Подбери квадратную деталь',list('flag','tile','badge'),1,art('square')),
 links('Соедини треугольные фигуры',list('flag'),list('circle','triangle'),[1]),
 links('Собери три пары по форме',shapeSources.slice(0,3),shapeTargets.slice(0,3),[2,0,1]),
 shapeSort(),
]);
add('review',3,hall,[
 demo('Мячи одинакового размера.',...sizes('ball','middle','middle')),
 scene('align','Совместим начала лент. Концы тоже совпали.',[ribbon(2),ribbon(2)]),
 scene('align','Башни стоят на одном основании. Их верхушки на одной высоте.',[height(3),height(3)]),
],[
 choose('Найди мяч такого же размера',sizes('ball','large','small','middle'),1,art('ball','sky','small')),
 choose('Подбери ленту такой же длины',[ribbon(1),ribbon(3),ribbon(2)],2,ribbon(2)),
 choose('Найди башню такой же высоты',[height(3),height(1),height(2)],0,height(3)),
 links('Собери три пары одинаковых размеров',sizes('ball','small','large','middle'),sizes('bear','middle','small','large'),[1,2,0]),
 stack('Подбери предметы к образцам',choose('Подбери кубик по размеру',sizes('block','large','small'),1,art('block','sky','small')),choose('Подбери башню по высоте',[height(1),height(2)],1,height(2))),
]);
add('review',4,hall,[
 pairs('Составим пары: игрушка и коробка.','bear',2,'box',2),pairs('Пары есть у всех. Предметов поровну.','mug',3,'plate',3),pairs('Один мяч без пары. Мячей больше.','ball',3,'hoop',2),
],[
 deal('Соедини зайчиков и морковки','carrot','bunny',3),eq('Где чашек и блюдец поровну?','mug','plate',3,2,3,3,1),match('Где больше предметов?','bear',2,'ball',3,1),balance('Добавь предмет, чтобы стало поровну','flower',3,'vase',2,'add'),
 stack('Сравни группы и сделай поровну',match('Какой ряд больше?','ball',3,'box',2,0),balance('Что изменить в нижнем ряду?','ball',3,'box',2,'add')),
]);
add('review',5,hall,[
 move('Игрушки отправляются к меткам своего цвета.',crayons,paintTargets,[1,0,3,2]),
 move('Теперь проверяем форму каждой детали.',shapeSources,shapeTargets,[2,0,1,3]),
 move('Большим и маленьким игрушкам нужны разные коробки.',sizes('bear','large','small'),sizes('box','small','large'),[1,0]),
],[
 colorSort(),shapeSort(),sizeSort(),
 choose('Найди ошибку: здесь собирают круглые детали',list('plate','tile','wheel'),1,art('circle'),{setting:'odd'}),
 stack('Выполни три сортировки',colorSort(),shapeSort(),sizeSort()),
]);
add('review',6,hall,[
 space('Мяч перед домиком. Стрелка показывает, где перед.','front','house',['box','ball'],1),
 space('Игрушка на верхней полке.','vertical','shelf',['bear','car'],0),
 space('Кубик близко к дереву.','distance','tree',['block','ball'],0),
],[
 front('Найди мяч перед домиком','house',['box','ball'],1),level('Что на нижней полке?','shelf',['bear','ball'],1),near('Что ближе к Луми?','lumiBack',['car','bear'],0),side('Что справа от Луми?',['car','block'],1),
 stack('Найди три предмета',level('Ищи наверху','shelf',['ball','car'],0),near('Ищи рядом с деревом','tree',['bear','box'],0),side('Ищи слева',['block','star'],0)),
]);
const both=()=>choose('Найди пару по цвету и форме',colored(['badge',blue],['square',red],['badge',red]),2,art('circle',red));
add('review',7,hall,[
 move('Повторим цвета и формы.',colored(['badge',red],['tile',blue]),colored(['square',blue],['circle',red]),[1,0]),
 pairs('После сравнения величины посмотрим и на количество. Здесь всем хватило по коробке.','bear',3,'box',3),
 move('Сначала нашли яблоко справа от корзинки, потом вымыли его.',list('apple','rinse'),list('apple','rinse'),[0,1]),
],[
 both(),stack('Выбери большой предмет и длинную ленту',choose('Найди большого медведя',sizes('bear','small','large'),1,art('bear','sky','large')),choose('Найди длинную ленту',[ribbon(3),ribbon(1)],0,ribbon(3))),
 match('Где игрушек больше?','bear',2,'car',3,1),side('Найди предмет справа от Луми',['star','gift'],1),
 stack('Последние открытия Луми',both(),choose('Найди квадратную плитку',list('tile','flag'),0,art('square')),choose('Найди высокую башню',[height(3),height(1)],0,height(3)),match('Где мячей меньше?','ball',3,'ball',2,1),order('Покажи, что сначала, а что потом',seed,water,grow)),
]);
export const finalLessons=entries;
