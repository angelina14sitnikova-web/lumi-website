import {lessonSet,demo,step,visual,talk,choose,place,match,task,token} from './builders.js';
import {panel} from '../speech34/builders.js';

const pile=(item,count=3)=>panel(...Array.from({length:count},(_,i)=>[item,5+i*55,35+(i%2)*15,.61,'rise']));
const pic=(id,art,label)=>token(id,art,{label});
const many=(item,label)=>pic(item+'-many',pile(item),label);
const speak=(prompt,model,...art)=>talk(prompt,model,art);
const pair=(one,multiple,manyWord,plural=one)=>({one,multiple,manyWord,plural});
const objects=[
 pair('chair','стулья','Стулья стоят.'),
 pair('palace-tree','деревья','Деревья растут.'),
 pair('leaf','листья','Листья лежат.'),
 pair('palace-window','окна','Окна открыты.','palace-open-window'),
];
const food=[
 ['apple','яблок','Яблоки'],
 ['palace-pear','груш','Груши'],
 ['pencil','карандашей','Карандаши'],
 ['block','кубиков','Кубики'],
 ['ball','мячей','Мячи'],
];
const families=[
 ['cat','kitten','кошки','котёнок','котята'],
 ['dog','puppy','собаки','щенок','щенки'],
 ['cow','calf','коровы','телёнок','телята'],
 ['horse','foal','лошади','жеребёнок','жеребята'],
];
const [chair,tree,leaf]=objects;
const castleRoom=panel(['palace-room',0,0,1]);
const spots={
 inside:[8,53,20,25],on:[8,30,20,21],between:[39,57,18,23],under:[61,62,20,27],beside:[81,66,18,23],
};
const positions=[
 ['inside','bear','в коробке','в коробку'],
 ['on','ball','на коробке','на коробку'],
 ['between','ball','между стульями','между стульями'],
 ['under','car','под столом','под стол'],
 ['beside','bunny','около шкафа','около шкафа'],
];
function at(where,item){
 const [x,y,w,h]=spots[where];
 return panel(['palace-room',0,0,1],[item,1.8*(x+(w-17)/2),1.8*(y+(h-17)/2),.30,'rise']);
}
const whereRound=([where,item,label,instruction])=>place(
 'Поставь игрушку '+instruction+'.','Игрушка '+label+'.',[item],
 Object.entries(spots).map(([id,area])=>[id==='inside'?'palace-box':'empty-space',id===where?item:[],{
  inside:'В коробке',on:'На коробке',between:'Между стульями',under:'Под столом',beside:'Около шкафа',
 }[id],area]),{map:castleRoom,targetCount:1,result:at(where,item)});
function taskFind(where,item,label){
 const art=at(where,item);
 const spotsToInspect=Object.entries(spots).map(([name,area])=>
  pic(name,name===where?item:'empty-space','Игровое место '+(Object.keys(spots).indexOf(name)+1)));
 spotsToInspect.forEach((card,i)=>{card.area=Object.values(spots)[i];});
 return choose('Нажми на спрятанную игрушку. Расскажи, где она.','Игрушка '+label+'.',spotsToInspect,where,
  {responseMode:'parts',diagram:art,result:art});
}
const redCards=['palace-ball:red','palace-cup:red','bucket:red'];
const blueCards=['palace-ball:blue','palace-cup:blue','bucket:blue'];
const descriptions=['Красный мяч','Красная чашка','Красное ведро'];
const shelves=[
 {art:redCards[0],model:'Красный круглый мяч.'},
 {art:blueCards[1],model:'Голубая маленькая чашка.'},
 {art:redCards[2],model:'Красное большое ведро.'},
];
const stories=[
 ['boy','palace-draw','palace-flower','red','table','Мальчик рисует красный цветок за столом.'],
 ['girl','book','book','blue','sofa','Девочка читает голубую книгу на диване.'],
 ['adult','apple','apple','red','kitchen','Взрослая моет красное яблоко на кухне.'],
 ['boy','watering','palace-flower','blue','park','Мальчик поливает голубой цветок в саду.'],
 ['girl','palace-play','palace-ball','red','park','Девочка играет с красным мячом в парке.'],
];
const drawing=stories[0];
const sentenceArt=([person,action,object,color,location])=>panel(
 [location,50,33,.67], [person,6,49,.67], [action,68,70,.47], [object+':'+color,113,80,.45],
);
const sentenceSlot=(instruction,model,context,target,alternates)=>choose(instruction,model,[...alternates,target],target,
 {context,animateSelection:true});
const buildStory=story=>{
 const [person,action,object,color,location,model]=story;
 return place('Поставь на свои места героя, действие, предмет, цвет и место. Потом расскажи, что происходит.',model,
  [location,color,pic('story-object',object),pic('story-action',action),person],[
   ['boy',person,'Кто?'],['palace-draw','story-action','Что делает?'],['flower','story-object','С чем?'],
   ['circle:gray',color,'Какого цвета?'],['table',location,'Где?'],
  ],{context:sentenceArt(story),result:sentenceArt(story)});
};

export const palace=lessonSet(5,[
 ['Образовывать множественное число существительных и согласовывать с ним глаголы.',[
  demo('Во дворце предметы меняют количество.',step(['chair'],'Стул.'),step(pile('chair'),'Стулья.'),step(['palace-tree'],'Дерево.'),step(pile('palace-tree'),'Деревья.')),
  demo('Посмотрим на лист и окно.',step(['leaf'],'Лист.'),step(pile('leaf'),'Листья.'),step(['palace-window'],'Окно.'),step(pile('palace-open-window'),'Окна.')),
  demo('Когда предметов несколько, меняется и слово о действии.',step(['chair'],'Один стул стоит.'),step(pile('chair'),'Стулья стоят.')),
 ],
 task('Один предмет',speak('Назови один предмет на картинке.','Стул.',chair.one)),
 task('Несколько предметов',speak('Назови несколько таких же предметов.','Стулья.',pile(chair.one))),
 task('Один и много',match('Соедини один предмет с группой таких же предметов.','Стул — стулья, дерево — деревья, лист — листья, окно — окна.',
  objects.map(({one,multiple,plural})=>[one,many(plural,multiple)]))),
 task('Закончи обе фразы',speak('Продолжи: «Одно дерево… Деревья…»','Одно дерево растёт. Деревья растут.',visual(tree.one),pile(tree.one)),
  speak('Продолжи: «Лист… Листья…»','Лист лежит. Листья лежат.',visual(leaf.one),pile(leaf.one))),
 task('Дворец превращений',...objects.map(({one,multiple,manyWord,plural})=>choose(
  'Дотронься до группы, чтобы превратить один предмет в несколько. Скажи, что получилось.',manyWord,
  [pic(one,one,'Один предмет'),many(plural,multiple)],plural+'-many',{context:visual(one),animateSelection:true})))],
 ['Употреблять формы существительных после слов «много» и «нет».',[
  demo('Заглянем в корзину.',step(panel(['palace-basket',3,30,1],['apple',31,38,.46],['apple',61,30,.46],['apple',92,40,.46]),'В корзине много яблок.')),
  demo('А теперь другие находки.',step(pile('palace-pear'),'Много груш.'),step(pile('pencil'),'Много карандашей.')),
  demo('Сравним два способа сказать про кубики.',step(pile('block'),'Кубики лежат в коробке.'),step(pile('block'),'В коробке много кубиков.')),
 ],
 task('В корзине много…',speak('Закончи фразу: «В корзине много…»','В корзине много яблок.',pile('apple'))),
 task('Коробка с игрушками',speak('Расскажи, что в коробке с игрушками.','В коробке много кубиков.',panel(['palace-box',0,30,1],['block',30,39,.44],['block',64,30,.44],['block',94,39,.44]))),
 task('Слушай и выбирай',choose('Послушай и выбери картинку к фразе.','На картинке много груш.',
  food.slice(0,3).map(([id,,plural])=>many(id,plural)),'palace-pear-many',
  {samples:[{text:'Много груш.'}],requiresAdult:true,adultPrompt:'Прочитайте ребёнку фразу «Много груш» перед выбором.'})),
 task('Много и нет',speak('Скажи, чего много в первой коробке и чего нет во второй.','В первой коробке много карандашей. Во второй нет карандашей.',pile('pencil'),'palace-box')),
 task('Кладовая Луми',...food.map(([id,name,plural])=>place('Положи в корзину '+name+'. Потом скажи, чего в ней много.',
  'В корзине много '+name+'.',food.map(([item,,word])=>many(item,word)),[['palace-basket',id+'-many','Корзина для продуктов и вещей']],
  {result:pile(id)})))],
 ['Называть детёнышей животных и употреблять формы единственного и множественного числа.',[
  demo('Во дворце появились семьи животных.',...families.slice(0,2).flatMap(([,baby,,one,plural])=>[step([baby],one+'.'),step(pile(baby),plural+'.')])),
  demo('Заглянем на конюшню и на ферму.',...families.slice(2).flatMap(([,baby,,one,plural])=>[step([baby],one+'.'),step(pile(baby),plural+'.')])),
  demo('Расскажем про семьи.',...families.map(([adult,baby,whose,,plural])=>step(visual(adult,pile(baby)),'У '+whose+' '+plural+'.'))),
 ],
 task('Кто детёныш?',speak('Как называется детёныш лошади?','Детёныш лошади — жеребёнок.','horse','foal')),
 task('Несколько детёнышей',speak('Назови нескольких детёнышей собаки.','Щенки.',pile('puppy'))),
 task('Собери семьи',match('Поставь по одному детёнышу рядом со взрослым животным.','Кошка с котёнком, собака со щенком, корова с телёнком, лошадь с жеребёнком.',
  families.map(([adult,baby])=>[adult,baby]))),
 task('Расскажи о малышах',...families.map(([adult,baby,whose,,plural])=>speak('Закончи: «У '+whose+'…»','У '+whose+' '+plural+'.',adult,pile(baby)))),
 task('Питомник сказочных зверят',...families.map(([adult,baby,whose,,plural])=>place(
  'Найди семью для этих детёнышей. Скажи, к кому они прибежали.','У '+whose+' '+plural+'.',
  families.map(([animal])=>animal),[[pile(baby),adult,'Семья детёнышей']],{result:visual(adult,pile(baby))})))],
 ['Согласовывать прилагательные с существительными в роде и числе.',[
  demo('Предметы одинакового цвета называются по-разному.',...redCards.map((id,i)=>step([id],descriptions[i]+'.'))),
  demo('Если предметов несколько, признак тоже меняет форму.',step(pile(redCards[0]),'Красные мячи.'),step(pile(redCards[1]),'Красные чашки.')),
  demo('Один предмет можно описать двумя признаками.',step([redCards[0]],'Красный круглый мяч.'),step([redCards[2]],'Красное большое ведро.')),
 ],
 task('Назови цвет',speak('Какого цвета мяч? Скажи два слова вместе.','Красный мяч.',redCards[0])),
 task('Какая чашка?',speak('Скажи «чашка» вместе со словом о её цвете.','Голубая чашка.',blueCards[1])),
 task('Какое ведро?',speak('Скажи «ведро» вместе со словом о его цвете.','Голубое ведро.',blueCards[2])),
 task('Какие мячи?',speak('Опиши несколько одинаковых мячей.','Красные круглые мячи.',pile(redCards[0]))),
 task('Королевская витрина',...shelves.map(({art,model},i)=>talk('Выбери предмет для витрины и назови два его признака.',
  model,[pic(art,art,model),pic('shelf-choice',i===1?redCards[1]:blueCards[i],'Другой цвет')],
  {chooseVisual:true,animateSelection:true,models:{'shelf-choice':['Голубой круглый мяч.','Красная маленькая чашка.','Голубое большое ведро.'][i]}})))],
 ['Понимать и употреблять предлоги «в», «на», «под», «между», «около».',[
  demo('У игрушки несколько тайников.',step(at('inside','bear'),'Медвежонок в коробке.'),step(at('on','bear'),'Медвежонок на коробке.'),step(at('under','bear'),'Медвежонок под столом.')),
  demo('Найдём середину.',step(at('between','ball'),'Мяч между двумя стульями.')),
  demo('Сравним два положения.',step(at('beside','bunny'),'Зайчик около шкафа.'),step(at('under','bunny'),'А теперь зайчик под столом.')),
 ],
 task('Внутри коробки',whereRound(positions[0])),
 task('На поверхности',whereRound(positions[1])),
 task('Между двумя предметами',whereRound(positions[2])),
 task('Под столом и около шкафа',whereRound(positions[3]),whereRound(positions[4])),
 task('Дворец пряток',...positions.map(([where,item,label])=>taskFind(where,item,label)))],
 ['Составлять согласованные предложения, добавляя предмет, признак и место действия.',[
  demo('Начнём с героя и действия.',step(['boy','palace-draw'],'Мальчик рисует.')),
  demo('Добавим предмет и цвет.',step(['boy','palace-draw','palace-flower:red'],'Мальчик рисует красный цветок.')),
  demo('Уточним, где это происходит.',step(sentenceArt(drawing),'Мальчик рисует красный цветок за столом.')),
 ],
 task('Кто что делает?',match('Соедини каждого героя с его действием.','Мальчик рисует, девочка читает.',
  [['boy','palace-draw','Мальчик с карандашом'],['girl','book','Девочка с книгой']].map(([person,action,label])=>
   [visual(person,action),action,label]))),
 task('Добавь предмет',sentenceSlot('Что рисует мальчик?','Мальчик рисует цветок.',visual('boy','palace-draw','palace-flower:red'),'palace-flower:red',['ball','palace-cup'])),
 task('Добавь признак',speak('Какой цветок рисует мальчик? Скажи целиком.','Мальчик рисует красный цветок.',visual('boy','palace-draw','palace-flower:red'))),
 task('Добавь место действия',sentenceSlot('Где мальчик рисует? Потом скажи всё предложение.',
  'Мальчик рисует красный цветок за столом.',sentenceArt(drawing),'table',['sofa','park'])),
 task('Королевский конструктор предложений',...stories.map(buildStory))],
]);
