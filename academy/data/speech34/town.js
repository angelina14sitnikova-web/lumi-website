import {lessons,scene,task,frame,panel,token,say,choose,multi,place} from './builders.js';
import {words} from '../../speech/words.js';

const toys=['ball','doll','car','block','bear'];
const furniture=['table','chair','bed','cupboard','sofa'];
const clothes=['shirt','pants','dress','hat','jacket','boot'];
const dishes=['cup','plate','spoon','fork','pot','kettle'];
const show=list=>list.map(id=>frame(id,'rise',{says:'Это '+words[id].lemma+'.'}));
const get=(instruction,id,others,extra={})=>choose(instruction,'Это '+words[id].lemma+'.',others,id,extra);
const use=(id,items,model=words[id].speechModel,action='rise')=>choose('Что пригодится герою?',model,items,id,{result:frame(id,action)});
const resolve=(a,b,model='Назови каждую пару.',instruction='Соедини подходящие картинки.')=>
 place(instruction,model,a,b.map(([view,id,label])=>[view,id,label]));
const matchIds=(ids,targets,model,instruction)=>resolve(ids,targets.map(id=>[id,id]),model,instruction);
const firstToys=scene('Луми открывает сундук.','Мяч, кукла, машинка, кубики и медвежонок.',frame('chest:brown:big:open','open'),
 ...show(toys).map((entry,i)=>i===3?{...entry,says:'Это кубики.'}:entry));
const toyAction=panel(['ball',4,79,.46,'roll'],['car',92,75,.45,'drive'],['block',59,74,.34],
 ['block:blue',61,44,.32,'rise'],['block:mint',65,16,.28,'rise']);
const fun=scene('Посмотри, как оживают игрушки.','Мяч катится. Машинка едет. Из кубиков строят башню.',frame(toyAction));
const category=scene('Соберём игрушки вместе.','Это игрушки.',frame(panel(['chest:brown:big:open',2,39,.72],
 ['car',103,105,.34,'drive'],['ball',23,38,.36,'roll'],['bear',96,17,.43,'rise'])));
const room=panel(['cupboard',1,-3,.50],['chair',127,65,.28],['table',66,32,.50],['bed',1,87,.50],['sofa',87,99,.47]);
const roomsParts=[
 ['cupboard','cupboard',[3,3,27,44]],['bed','bed',[3,60,38,35]],['table','table',[47,44,48,38]],
];
const roomFamily=place('Расставь мебель в пустой комнате.','В комнате шкаф, кровать и стол.',
 ['chair','table','bed','cupboard'],roomsParts.map(([show,id,area])=>[show,id,words[id].lemma,area]),{
 map:panel(['house:cream:big:no-roof',0,0,1]),result:frame(room),
});
const sit=panel(['chair',61,45,.62],['boy',43,17,.64,'rest']);
const sleep=panel(['bed',27,77,.76],['girl',51,19,.62,'sleep']);
const putAway=panel(['cupboard',34,21,.73],['shirt',102,54,.31,'rise']);
const furnitureActions=[
 ['chair',sit,'Сидит на стуле'],['bed',sleep,'Спит на кровати'],['cupboard',putAway,'Убирает одежду'],
];
const clothActions=panel(['adult',38,12,.80],['hat',72,8,.30,'rise'],['boot',67,108,.29],['boot',98,108,.29]);
const storeClothes=panel(['cupboard',7,29,.71],['shirt',29,59,.33,'rise'],['shelf',106,91,.42],['boot',122,95,.32,'rise']);
const getDressed=resolve(['boot','hat','jacket'],[
 [panel(['boy',0,0,1],['hat',61,10,.32]),'hat','Голова'],
 [panel(['boy',0,0,1],['jacket',46,73,.48]),'jacket','Руки и туловище'],
 [panel(['boy',0,0,1],['boot',70,132,.30]),'boot','Ноги'],
],'Я надеваю шапку и куртку. На ногах ботинки.','Одень героя, как на образце.');
const setting=panel(['table',0,47,1],['plate',28,59,.44,'rise'],['cup',96,32,.31,'rise'],['spoon',114,59,.38,'rise']);
const kitchenMap=place('Накрой стол по образцу.','Поставим тарелку и чашку. Рядом положим ложку.',
 ['plate','cup','spoon','comb'],[
 ['plate','plate','Для тарелки',[13,36,33,33]],['cup','cup','Для чашки',[60,24,28,32]],['spoon','spoon','Для ложки',[55,51,25,31]],
 ],{map:panel(['table',0,32,1]),context:setting,result:frame(setting)});
const drink=panel(['girl',37,4,.72],['cup',91,52,.36,'drink']);
const eat=panel(['boy',39,10,.71],['plate',81,68,.49],['spoon',102,41,.40,'eat']);
const cook=panel(['adult',23,5,.74],['pot',78,72,.53,'rise']);
const comb=panel(['girl',21,12,.81],['comb',97,17,.52,'groom']);
const towel=panel(['hand',27,46,.61],['towel',80,49,.46,'dry']);
const flower=panel(['flower',81,40,.56],['watering',13,48,.58,'pour']);
const helper=[
 use('comb',['spoon','comb','plate']),use('towel',['towel','pot','boot']),use('watering',['kettle','watering','plate']),
 use('spoon',['comb','boot','spoon']),use('chair',['chair','block','flower']),
];
const helperPairs=resolve(['comb','towel','watering','spoon'],[
 [comb,'comb','Расчёсывается'],[towel,'towel','Вытирает руки'],[flower,'watering','Поливает цветок'],[eat,'spoon','Ест'],
],'Расчёской расчёсывают, полотенцем вытирают руки, лейкой поливают, ложкой едят.');
const excursion=[
 say('Что ты выберешь в магазине игрушек?','Это мяч. Его можно катить.',toys,'speak',{chooseVisual:true,models:Object.fromEntries(toys.map(id=>[id,words[id].speechModel]))}),
 say('Что стоит в комнате?','Это стул. На нём сидят.',furniture,'speak',{chooseVisual:true,models:Object.fromEntries(furniture.map(id=>[id,words[id].speechModel]))}),
 say('Что можно надеть?','Это шапка. Её надевают на голову.',['hat','jacket','boot'],'speak',{chooseVisual:true,models:{hat:'Это шапка. Её надевают на голову.',jacket:'Это куртка. Её надевают на прогулку.',boot:'Это ботинки. Их надевают на ноги.'}}),
 say('Что пригодится на кухне?','Это чашка. Из неё пьют.',dishes,'speak',{chooseVisual:true,models:Object.fromEntries(dishes.map(id=>[id,words[id].speechModel]))}),
];

export const town=lessons(1,[
 ['Узнавать и называть знакомые игрушки.',[firstToys,fun,category],
  task('Покажи мяч',get('Покажи мяч.','ball',['bear','ball','doll'])),
  task('Найди машинку',get('Найди машинку и назови её.','car',['block','doll','car'])),
  task('Одинаковые игрушки',matchIds(['car','ball','doll'],['ball','doll','car'],'Это мяч, кукла и машинка.','Соедини одинаковые игрушки и назови их.')),
  task('Игрушки в сундуке',multi('Собери игрушки в сундук.','Это игрушки.',['chair','car','cup','bear','ball'],['car','bear','ball'],3,{
   context:'chest:brown:big:open',result:frame(panel(['chest:brown:big:open',3,33,.84],['car',13,42,.35],['bear',71,30,.38],['ball',97,63,.32]))})),
  task('Игрушечный магазин',multi('Выбери три игрушки и расскажи, что взял.','Я выбрал три игрушки. Назови каждую из них.',toys,toys,3)),
 ],
 ['Узнавать мебель и понимать её назначение.',[
  scene('Знакомимся с мебелью.','Стол, стул, кровать, шкаф, диван.',...show(furniture)),
  scene('Посмотри, как пользуются мебелью.','На стуле сидят. На кровати спят. В шкаф кладут одежду.',frame(sit),frame(sleep,'show',{reset:true}),frame(putAway,'show',{reset:true})),
  scene('В комнате появится мебель.','В комнате стол, стул, кровать, шкаф и диван.',frame(room)),
 ],
  task('Покажи стул',get('Покажи стул.','chair',['sofa','table','chair'])),
  task('Кровать для Луми',get('На чём можно спать?','bed',['cupboard','bed','chair'],{result:frame(sleep)})),
  task('Зачем нужна мебель?',resolve(['cupboard','chair','bed'],furnitureActions.map(([id,art,label])=>[art,id,label]),'На стуле сидят, на кровати спят, в шкаф убирают одежду.')),
  task('Мебель в комнате',roomFamily),
  task('Домик Луми',say('Выбери предмет мебели и расскажи, что есть в комнате.','В комнате стоит стол.',furniture,'speak',{chooseVisual:true,
    models:{table:'В комнате стоит стол.',chair:'В комнате стоит стул.',bed:'В комнате стоит кровать.',cupboard:'В комнате стоит шкаф.',sofa:'В комнате стоит диван.'}})),
 ],
 ['Узнавать одежду и обувь.',[
  scene('Рассмотрим одежду и обувь.','Это футболка, брюки, платье, шапка, куртка и ботинки.',...show(clothes)),
  scene('Куда надевают шапку?','Я надеваю шапку. На ногах ботинки.',frame(clothActions)),
  scene('Найдём место для одежды и обуви.','Одежда в шкафу, обувь на полке.',frame(storeClothes)),
 ],
  task('Шапка',get('Найди шапку.','hat',['dress','boot','hat'])),
  task('Ботинки',get('Покажи ботинки.','boot',['boot','shirt','jacket'],{speechModel:'Это ботинки.'})),
  task('Одеваем героя',getDressed),
  task('Шкаф и обувная полка',resolve(['boot','jacket','shirt'],[['cupboard','jacket','Шкаф'],['shelf','boot','Обувная полка'],['cupboard','shirt','Шкаф']],
   'Куртка и футболка в шкафу. Ботинки на полке.')),
  task('Собираемся гулять',multi('На улице холодно. Выбери тёплые вещи и назови их.','Я надеваю шапку, куртку и ботинки.',clothes,['hat','jacket','boot'],3,{context:'winter',result:frame(clothActions)})),
 ],
 ['Узнавать и называть посуду.',[
  scene('Посмотри, что стоит на кухне.','Чашка, тарелка, ложка, вилка, кастрюля, чайник.',...show(dishes)),
  scene('Посмотрим, как используют посуду.','Из чашки пьют. Ложкой едят. В кастрюле готовят.',frame(drink),frame(eat,'show',{reset:true}),frame(cook,'show',{reset:true})),
  scene('Накрываем стол.','Поставим тарелку и чашку. Рядом положим ложку.',frame(setting)),
 ],
  task('Чашка',get('Покажи чашку.','cup',['fork','cup','plate'])),
  task('Ложка для каши',use('spoon',['fork','pot','spoon'],'Ложкой едят кашу.','eat')),
  task('Дела на кухне',resolve(['pot','spoon','cup'],[[eat,'spoon','Ест кашу'],[cook,'pot','Готовит'],[drink,'cup','Пьёт']],'Из чашки пьют. Ложкой едят. В кастрюле готовят.')),
  task('Накроем стол',kitchenMap),
  task('Чаепитие с Луми',multi('Подбери посуду для чая. Чай из чайника нальём в чашку.','Это чайник и чашка.',['cup','fork','kettle','pot'],['cup','kettle'],2,{result:frame(drink)})),
 ],
 ['Понимать, для чего нужны предметы.',[
  scene('Луми хочет причесаться.','Расчёской расчёсывают волосы.',frame(comb)),
  scene('Руки мокрые.','Полотенцем вытирают руки.',frame(towel)),
  scene('Подберём вещи для разных дел.','Лейкой поливают цветы. Ложкой едят.',frame(flower),frame(eat,'show',{reset:true})),
 ],
  task('Чем расчесаться?',helper[0]),task('Чем вытереть руки?',helper[1]),task('Чем полить цветок?',helper[2]),
  task('Подходящие инструменты',helperPairs),task('Чемодан помощника',...helper),
 ],
 ['Называть предмет и его назначение.',[
  scene('Для чего нужна чашка?','Это чашка. Из неё пьют.',frame('cup'),frame(drink,'show',{reset:true})),
  scene('Для чего нужна кровать?','Это кровать. На ней спят.',frame('bed'),frame(sleep,'show',{reset:true})),
  scene('Скажем про разные вещи.','Это шапка. Её надевают. Это мяч. Его можно катить.',frame('hat'),frame('ball','roll')),
 ],
  task('Назови игрушку',say('Как называется игрушка?','Это медвежонок.',['bear'])),
  task('Что делают на кровати?',choose('Подбери действие для кровати.','На кровати спят.',[token('drink',drink),token('sleep',sleep),token('comb',comb)],'sleep',{context:'bed'})),
  task('Одежда и части тела',resolve(['hat','boot'],[['head','hat','Голова'],['leg','boot','Ноги']],'Шапку надевают на голову. Ботинки надевают на ноги.')),
  task('Предмет посуды',say('Назови предмет и скажи, для чего он нужен.','Это кастрюля. В ней готовят.',['pot'])),
  task('Экскурсия по городу',...excursion),
 ],
]);
