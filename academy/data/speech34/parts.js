import {lessons,scene,task,frame,panel,token,say,choose,place,language} from './builders.js';

const diagram=(instruction,model,base,regions,correct)=>({
 ...language(instruction,model,'parts'),diagram:base,correct:[correct],
 cards:regions.map(([id,label,area])=>token(id,id,{label,area})),
});
const oral=(instruction,model,visual)=>say(instruction,model,visual);
const human=[
 ['head','Голова',[30,9,40,34]],['hand','Руки',[17,42,19,27]],
 ['torso','Туловище',[36,46,28,21]],['leg','Ноги',[31,69,42,27]],
];
const face=panel(['girl',-65,-25,1.74]);
const facePoints=[
 ['eye','Глаза',[34,26,36,12]],['nose','Нос',[43,39,17,12]],
 ['mouth','Рот',[39,53,25,13]],['ear','Уши',[17,27,13,22]],
];
const cat=[
 ['head','Голова',[20,20,57,38]],['leg','Лапы',[31,64,40,28]],['tail','Хвост',[73,48,24,34]],
];
const rabbit=[
 ['ear','Уши',[26,0,47,34]],['head','Голова',[29,34,44,25]],['leg','Лапы',[29,71,49,23]],
];
const car=[
 ['wheel','Колесо',[18,58,21,29]],['door','Дверь',[42,46,30,24]],['window','Окно',[35,26,47,17]],['body','Кузов',[43,64,36,20]],
];
const jacket=[
 ['sleeve','Рукав',[15,30,21,36]],['pocket','Карман',[35,54,16,20]],
 ['collar','Воротник',[37,15,27,21]],['zip','Молния',[48,34,8,39]],['button','Пуговица',[57,53,12,11]],
];
const chair=[
 ['back','Спинка',[29,14,39,36]],['seat','Сиденье',[25,53,49,14]],['legs','Ножки',[27,68,49,24]],
];
const table=[['tabletop','Столешница',[7,39,87,18]],['legs','Ножки',[14,62,74,25]]];
const cabinet=[['door','Дверцы',[30,17,41,62]],['handle','Ручки',[47,44,10,17]]];
const roomsTop=panel(['cupboard',29,34,.65],['shelf',46,42,.43]);
const show=(instruction,model,base,...layers)=>scene(instruction,model,frame(base),...layers.map(([id,label,action])=>frame(id,action??'rise',{says:label})));
const build=(instruction,model,base,items,layout,result)=>place(instruction,model,items,
 layout.map(([id,label,area])=>[id,id,label,area]),{map:base,context:result,result:frame(result)});
const toypeople=build('Собери персонажа по образцу.','Голова, туловище, руки, ноги.',
  'girl',['leg','head','torso','hand'],human,'girl');
const circles=panel(['car:blue:big:no-wheel',0,0,1]);
const wheels=build('Верни колесо машинке.','У машинки есть колёса.',circles,['wheel','head','button'],[car[0]],'car');
const carAssemble=build('Собери машинку из деталей.','У машины есть кузов, окна, двери и колёса.','car:blue:big:no-wheel',
 ['body','door','wheel','window'],car,'car');
const coat=build('Добавь недостающие части куртки.','У куртки есть карман, воротник и застёжка.','jacket',
 ['pocket','collar','zip'],jacket.filter(([id])=>['pocket','collar','zip'].includes(id)),'jacket');
const button=build('Подбери пуговицу.','Это пуговица. Ею застёгивают одежду.','jacket',['button','wheel','leg'],[jacket[4]],'jacket');
const seat=build('Собери стул.','У стула есть спинка, сиденье и ножки.','chair',
 ['seat','legs','back'],chair,'chair');
const missingEar=build('Верни ушко медвежонку.','У медвежонка есть уши.','bear:cream:big:no-ear',['ear','wing','beak'],
 [['ear','Ухо',[20,13,22,22]]],'bear');
const missingTail=build('Подбери хвост кошке.','У кошки есть хвост.','cat',['tail','wing','beak'],
 [['tail','Хвост',[73,48,24,36]]],'cat');
const bird=build('Помести крыло на место.','У птицы есть крылья.','bird',['wing','leg','tail'],
 [['wing','Крыло',[30,39,48,38]]],'bird');
const handle=build('Подбери ручку дверцы.','За ручку открывают дверцу.','cupboard',['handle','back','wheel'],[cabinet[1]],'cupboard');
const tabletop=build('Поставь столешницу на ножки.','У стола есть столешница и ножки.','legs',
 ['tabletop','seat'],[table[0]],'table');
export const parts=lessons(3,[
 ['Называть крупные части тела и лица.',[
  show('Посмотри на ребёнка.','Голова, руки, ноги и туловище.','girl',['head','Голова'],['hand','Руки'],['leg','Ноги'],['torso','Туловище']),
  show('Рассмотри лицо.','Глаза, нос, рот и уши.',face,['eye','Глаза'],['nose','Нос'],['mouth','Рот'],['ear','Уши']),
  show('Что делают глаза, уши и ноги?','Глазами смотрят. Ушами слышат. Ногами ходят.','boy',['eye','Смотрит'],['ear','Слышит'],['leg','Идёт','walk']),
 ],
 task('Голова персонажа',diagram('Покажи голову.','Это голова.','girl',human,'head')),
 task('Найди части лица',...facePoints.slice(0,3).map(([id,name])=>diagram('Покажи '+{eye:'глаза',nose:'нос',mouth:'рот'}[id]+'.','Вот '+name.toLowerCase()+'.',face,facePoints,id))),
 task('Что делают части тела?',place('Соедини части тела с действиями.','Глазами смотрят. Ушами слышат. Ногами ходят.',
  ['eye','ear','leg'],[[panel(['boy',8,8,.88],['eye',110,24,.33]),'eye','Смотрит'],
  [panel(['girl',0,1,.89],['voice',117,20,.37]),'ear','Слышит'],[panel(['boy',5,5,.89,'walk']),'leg','Ходит']])),
 task('Собери персонажа',toypeople),
 task('Повтори за Луми',say('Покажи у себя голову, руки и ноги. Назови их.','Вот моя голова. Вот мои руки. Вот мои ноги.',['girl'],'act',{requiresAdult:true})),
 ],
 ['Находить характерные части животных.',[
  show('Какие части есть у кошки?','У кошки есть голова, лапы, уши и хвост.','cat',['head','Голова'],['leg','Лапы'],['tail','Хвост']),
  show('Посмотри на птицу.','У птицы есть клюв, крылья и лапки.','bird',['beak','Клюв'],['wing','Крыло','wave']),
  show('У кошки лапы, у птицы крылья.','У зайца длинные уши, у кошки есть хвост.','bunny',['ear','Уши'],['tail','Хвост']),
 ],
 task('Хвост кошки',diagram('Покажи хвост кошки.','У кошки есть хвост.','cat',cat,'tail')),
 task('Уши зайца',diagram('Найди уши зайца.','У зайца длинные уши.','bunny',rabbit,'ear')),
 task('Крыло птицы',bird),task('Потерянные части',missingEar,missingTail),
 task('Маленький зоолог',oral('Назови части кошки, зайца и птицы.','У кошки хвост, у зайца длинные уши, у птицы крылья.',['cat','bunny','bird'])),
 ],
 ['Называть детали игрушечной машины.',[
  show('Посмотри на машинку.','Это колёса, двери, окна и кузов.','car',['wheel','Колёса'],['door','Дверь'],['window','Окно'],['body','Кузов']),
  show('Что можно делать с деталями?','Колёса вращаются, двери открываются.','car',['wheel','Колесо','turn'],['door','Дверь','open']),
  show('Добавим детали по очереди.','К кузову добавим колёса, дверь и окно.','body',['wheel','Колесо'],['door','Дверь'],['window','Окно']),
 ],
 task('Найди колесо',diagram('Покажи колесо.','Это колесо.','car',car,'wheel')),
 task('Найди дверь',diagram('Покажи дверь машины.','Это дверь.','car',car,'door')),
 task('Потерянное колесо',wheels),task('Собери машинку',carAssemble),
 task('Автомастерская',carAssemble,oral('Какие части есть у машины?','У машины есть колёса и двери.',['car'])),
 ],
 ['Называть детали одежды.',[
  show('Рассмотри куртку.','У куртки есть рукава, воротник и карманы.','jacket',['sleeve','Рукав'],['collar','Воротник'],['pocket','Карман']),
  show('Посмотрим на застёжки.','Это пуговица. Это молния.','jacket',['button','Пуговица'],['zip','Молния']),
  show('Карманы для вещей.','Карман хранит мелочи. Пуговица и молния застёгивают одежду.','pocket',['button','Застегнём пуговицу','turn'],['zip','Застегнём молнию','open']),
 ],
 task('Рукав куртки',diagram('Покажи рукав.','Это рукав.','jacket',jacket,'sleeve')),
 task('Карман куртки',diagram('Покажи карман.','Это карман.','jacket',jacket,'pocket')),
 task('Потерянная пуговица',button),task('Собери куртку',coat),
 task('Мастерская портного',oral('Назови две части одежды.','У куртки есть рукава и карманы.',['jacket','shirt','dress'])),
 ],
 ['Называть детали мебели.',[
  show('Из чего состоит стул?','У стула есть спинка, сиденье и ножки.','chair',['back','Спинка'],['seat','Сиденье'],['legs','Ножки']),
  show('Из чего состоит стол?','У стола есть столешница и ножки.','table',['tabletop','Столешница'],['legs','Ножки']),
  show('Из чего состоит шкаф?','У шкафа есть дверцы, полки и ручки.',roomsTop,['door','Дверца'],['shelf','Полки'],['handle','Ручка']),
 ],
 task('Спинка стула',diagram('Покажи спинку стула.','У стула есть спинка.','chair',chair,'back')),
 task('Ножки стола',diagram('Покажи ножки стола.','У стола есть ножки.','table',table,'legs')),
 task('Ручка для шкафа',handle),task('Сборка стула',seat),
 task('Мебельная мастерская',handle,tabletop,seat),
 ],
 ['Восстанавливать и описывать знакомые предметы.',[
  show('Собираем машинку.','У машины есть кузов, колёса, окна и двери.','body',['wheel','Колёса'],['door','Дверь'],['window','Окно']),
  show('Восстановим медвежонка.','Вернём медвежонку ушко.','bear:cream:big:no-ear',['ear','Ухо']),
  show('Сложим части стула.','У стула есть спинка, ножки и сиденье.','chair',['back','Спинка'],['seat','Сиденье'],['legs','Ножки']),
 ],
 task('Восстанови персонажа',toypeople),task('Восстанови машинку',carAssemble),
 task('Добавь детали одежды',coat),task('Собери мебель',seat),
 task('Главная мастерская',say('Выбери предмет и назови знакомые части.','У стула есть спинка и ножки.',['car','chair','jacket'],'speak',
  {chooseVisual:true,models:{car:'У машины колёса и окна.',chair:'У стула есть спинка и ножки.',jacket:'У куртки есть рукава и карманы.'}})),
 ],
]);
