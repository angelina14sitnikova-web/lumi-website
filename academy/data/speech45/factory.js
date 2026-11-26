import {lessonSet,demo,step,visual,talk,choose,place,match,task,token,say} from './builders.js';
import {panel} from '../speech34/builders.js';

const oral=(prompt,model,...art)=>talk(prompt,model,art);
const miniature=item=>panel([item,44,44,.51,'rise']);
const diminutives=[
 ['house','Дом.','Домик.'],['table','Стол.','Столик.'],
 ['spoon','Ложка.','Ложечка.'],['cup','Чашка.','Чашечка.'],
];
const smallCard=([id,,name])=>token(id+'-mini',miniature(id),{label:name});
const dishes=[
 ['factory-sugar','factory-sugar-cubes','Сахар кладут в сахарницу.'],
 ['factory-breadbox','bread','Хлеб хранят в хлебнице.'],
 ['factory-salt','factory-salt-pile','Соль насыпают в солонку.'],
 ['factory-butterdish','factory-butter','Масло хранят в маслёнке.'],
 ['kettle','factory-tea','Чай заваривают в чайнике.'],
];
const actions=[
 ['boy','palace-draw','palace-flower:red','рисует цветок','нарисовал цветок','draw'],
 ['girl','brick','brick-wall','строит стену','построила стену','touch'],
 ['boy','palace-box','factory-open-box','открывает коробку','открыл коробку','open'],
 ['boy','soap','hand','моет руки','вымыл руки','wash'],
 ['boy','block','pyramid','собирает пирамидку','собрал пирамидку','touch'],
];
function actionArt([person,illustration,result],finished=false){
 return panel([person,5,38,.62,finished?'show':'draw'],[finished?result:illustration,89,46,.47,finished?'rise':'touch']);
}
const requests=[
 ['palace-box','factory-open-box','Открой коробку, пожалуйста.','Я открыл коробку.','open'],
 ['book','book','Принеси книгу, пожалуйста.','Вот книга.','walk'],
 ['palace-ball:red','palace-ball:red','Принеси красный мяч, пожалуйста.','Вот красный мяч.','walk'],
 ['bear','shelf','Поставь медвежонка на полку, пожалуйста.','Медвежонок на полке.','touch'],
 ['cup','table','Поставь чашку на стол, пожалуйста.','Чашка на столе.','touch'],
];
const ask=([item,destination,model,reply,action],prompt)=>say(prompt,model,[item],'dialogue',{
 partner:reply,result:token('result',visual('lumi',destination),{action}),modeButton:'Сказали — покажи действие',
});
const links=[
 ['palace-draw','book','Луми рисует, а зайчик читает.'],
 ['factory-song','factory-dance','Луми поёт и танцует.'],
 ['umbrella','rain','Луми взял зонтик, потому что пошёл дождь.'],
 ['scarf','winter','Девочка надела шарф, потому что на улице холодно.'],
 ['sofa','park','Луми отдохнул на диване, потому что долго гулял.'],
];
const edits=[
 ['factory-wrong-cat','boy','Мальчик читает книгу.','На картинке мальчик. Скажи, кто читает.'],
 ['palace-cup:red','palace-cup:red','Красная чашка.','Исправь фразу «красный чашка».'],
 ['palace-draw','palace-draw','Девочка рисует цветок.','Исправь фразу «девочка читает цветок».'],
 ['bunny','bunny','Зайчик ест морковь.','Исправь фразу «зайчик пьёт морковь».'],
 ['bucket:blue','bucket:blue','Голубое ведро.','Исправь фразу «голубая ведро».'],
];

export const factory=lessonSet(6,[
 ['Образовывать и употреблять уменьшительно-ласкательные формы знакомых слов.',[
  ...[diminutives.slice(0,1),diminutives.slice(1,2),diminutives.slice(2)].map(group=>
   demo('На фабрике у слов появляются добрые формы.',...group.flatMap(([item,word,small])=>
    [step([item],word),step(miniature(item),small)]))),
 ],
 task('Повтори ласково',oral('Повтори ласковое слово про дом.','Домик.',miniature('house'))),
 task('Подбери пару',match('Найди маленькую пару для каждого предмета. Назови её ласково.',
  'Дом — домик, стол — столик, ложка — ложечка, чашка — чашечка.',diminutives.map(item=>[item[0],smallCard(item)]))),
 task('Назови несколько предметов ласково',oral('Назови все предметы ласково.','Столик, ложечка и чашечка.',visual(...diminutives.slice(1).map(([id])=>miniature(id))))),
 task('Составь предложение',oral('Придумай предложение со словом «чашечка».','На столике стоит чашечка.',visual(miniature('table'),miniature('cup')))),
 task('Фабрика добрых слов',...diminutives.map(item=>choose('Выбери маленькую картинку и скажи ласковое слово.',item[2],
  [item[0],smallCard(item)],smallCard(item).id,{context:visual(item[0]),animateSelection:true})),
  oral('Расскажи маленькую историю с ласковыми словами.','В домике Луми стоит столик. На столике чашечка и ложечка.',
   visual(...diminutives.map(([id])=>miniature(id)))) )],
 ['Называть предметы посуды и объяснять их назначение.',[
  demo('Подберём посуду для сахара и хлеба.',...dishes.slice(0,2).map(([dish,food,line])=>step([food,dish],line))),
  demo('Найдём посуду для соли, масла и чая.',...dishes.slice(2).map(([dish,food,line])=>step([food,dish],line))),
  demo('На кухне каждому продукту своё место.',step(['factory-salt','factory-sugar','kettle'],'Соль в солонке, сахар в сахарнице, чай в чайнике.')),
 ],
 task('Найди сахарницу',choose('Покажи сахарницу.','Сахар кладут в сахарницу.',dishes.slice(0,3).map(([dish])=>dish),'factory-sugar')),
 task('Хлеб и хлебница',match('Соедини хлеб с хлебницей.','Хлеб хранят в хлебнице.',[['bread','factory-breadbox']],['factory-salt','kettle'])),
 task('Куда положить соль и масло?',match('Поставь солонку рядом с солью, а маслёнку рядом с маслом.',
  'Соль насыпают в солонку. Масло хранят в маслёнке.',dishes.slice(2,4).map(([dish,food])=>[food,dish]),['kettle'])),
 task('Для чего нужна посуда?',...dishes.slice(0,2).map(([dish,food,line])=>oral('Закончи фразу и скажи, для чего нужна эта посуда.',line,visual(food,dish)))),
 task('Кухня волшебных названий',...dishes.map(([dish,food,line])=>place('Подбери посуду и поставь её на стол. Скажи, для чего она.',
  line,dishes.map(([item])=>item),[[food,dish,'Место на столе']],{result:visual(food,dish)})))],
 ['Различать действие в процессе и его завершённый результат.',[
  ...[actions.slice(0,1),actions.slice(1,2),actions.slice(2)].map(group=>
   demo('Что герой делает и что уже сделал?',...group.flatMap(item=>{
    const [person,,,doing,done,motion]=item;
    const who=person==='girl'?'Девочка':'Мальчик';
    return [step(actionArt(item),who+' '+doing+'.',motion),step(actionArt(item,true),who+' '+done+'.')];
   }))),
 ],
 task('Что происходит сейчас?',oral('Что сейчас делает мальчик?','Мальчик рисует цветок.',actionArt(actions[0]))),
 task('Найди, что получилось',choose('Девочка строит стену. Найди результат.','Девочка построила стену.',
  ['palace-flower:red','brick-wall','factory-open-box'],'brick-wall',{context:actionArt(actions[1])})),
 task('Закончи фразу',oral('Закончи фразу: «Мальчик уже…»','Мальчик уже открыл коробку.',actionArt(actions[2],true))),
 task('Что изменилось?',oral('Сравни картинки. Что мальчик делал и что сделал?','Сначала он мыл руки. Теперь он вымыл руки.',actionArt(actions[3]),actionArt(actions[3],true))),
 task('Фабрика действий',...actions.map(item=>{
  const [person,,,doing,done,motion]=item,who=person==='girl'?'Девочка':'Мальчик';
  return say('Скажи, что герой делает. Запусти действие и расскажи, что он уже сделал.',who+' '+doing+'. '+who+' '+done+'.',
   [token('before',actionArt(item))],'act',{modeButton:'Запустить действие',result:token('after',actionArt(item,true),{action:motion})});
 }))],
 ['Формулировать вежливые просьбы, уточняя предмет, признак или место.',[
  demo('Луми просит друга принести книгу.',step(['lumi','book'],'Принеси книгу, пожалуйста.','wave')),
  demo('Луми уточняет место для игрушки.',step(['lumi','bear','shelf'],'Поставь медвежонка на полку, пожалуйста.','touch')),
  demo('Как сделать просьбу понятнее?',step(['lumi','palace-ball:red','palace-ball:blue'],'Принеси мяч. Какой мяч?'),step(['lumi','palace-ball:red'],'Принеси красный мяч, пожалуйста.')),
 ],
 task('Попроси открыть коробку',ask(requests[0],'Попроси Луми открыть коробку.')),
 task('Попроси принести игрушку',ask(requests[2],'Попроси Луми принести мяч.')),
 task('Уточни признак',ask(requests[2],'Попроси принести мяч и назови его цвет.')),
 task('Уточни место',ask(requests[3],'Попроси поставить игрушку и скажи куда.')),
 task('Фабрика помощников',...requests.map(item=>ask(item,'Попроси героя о действии. Когда он поможет, поблагодари его.')))],
 ['Связывать две мысли союзами «и», «а» и «потому что».',[
  demo('Два героя заняты разными делами.',step(['lumi','palace-draw','bunny','book'],'Луми рисует, а зайчик читает.')),
  demo('Один герой делает сразу два дела.',step(['lumi','factory-song','factory-dance'],'Луми поёт и танцует.')),
  demo('Можно объяснить причину.',step(['umbrella','rain'],'Луми взял зонтик, потому что пошёл дождь.')),
 ],
 task('Два действия одного героя',oral('Соедини два действия одним предложением.','Луми поёт и танцует.',visual('lumi','factory-song','factory-dance'))),
 task('Дела двух героев',oral('Расскажи в одном предложении, что происходит у Луми и у зайчика.','Луми рисует, а зайчик читает.',visual('lumi','palace-draw','bunny','book'))),
 task('Почему взял зонтик?',choose('Почему Луми взял зонтик? Выбери причину.','Луми взял зонтик, потому что пошёл дождь.',
  ['sun','rain','bed'],'rain',{context:visual('lumi','umbrella')})),
 task('Закончи «потому что»',oral('Продолжи: «Девочка надела шарф, потому что…»','Девочка надела шарф, потому что на улице холодно.',visual('girl','scarf','winter'))),
 task('Мосты между мыслями',...links.map(([first,last,line],i)=>place('Соедини картинки и скажи про обе одним предложением.',
  line,[...new Set([last,links[(i+1)%links.length][1],links[(i+2)%links.length][1]])],[[first,last,'Первая часть мысли']],
  {result:visual(first,last)})))],
 ['Исправлять смысловые несоответствия и согласовывать слова, опираясь на контекст.',[
  demo('Сравним фразу с картинкой.',step(['boy','book','cat'],'Кошка читает книгу? На нашей картинке книгу читает мальчик.')),
  demo('Послушаем окончания.',step(['palace-cup:red'],'Красный чашка? Скажем правильно: красная чашка.')),
  demo('Подберём действие или предмет.',step(['bunny','carrot'],'Зайчик пьёт морковь? По картинке подходит: зайчик ест морковь.')),
 ],
 task('Услышь несоответствие',oral('Послушай: «Кошка читает книгу». Что не совпадает с картинкой?',
  'На картинке книгу читает мальчик. В сказке кошка тоже могла бы читать.',visual('boy','book','cat'))),
 task('Правильное действие',choose('Зайчик держит морковь. Какое действие подходит к картинке?','Зайчик ест морковь.',
  [token('eat','carrot',{label:'Ест'}),token('read','book',{label:'Читает'}),token('sleep','bed',{label:'Спит'})],'eat',{context:visual('bunny','carrot')})),
 task('Слова согласуются',oral('Повтори правильно: какая чашка?','Красная чашка.',visual('palace-cup:red'))),
 task('Исправь по картинке',oral('Луми сказал «девочка читает цветок». Как сказать по картинке?','Девочка рисует цветок.',visual('girl','palace-draw','palace-flower:red'))),
 task('Редактор волшебной газеты',...edits.map(([scene,card,model,prompt])=>oral(prompt+' Расскажи, что исправилось.',model,
  scene==='factory-wrong-cat'?visual(card,'book','cat'):visual(card,card==='bunny'?'carrot':card==='palace-draw'?'palace-flower:red':card))),
  oral('Придумай свою смешную фразу для сказки. Объясни, что в ней необычного.','В моей сказке кошка читает книгу под зонтиком.',visual('cat','book','umbrella')))],
]);
