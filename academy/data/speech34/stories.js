import {lessons,scene,task,frame,panel,token,say,choose,order,language,place} from './builders.js';
import {moment} from './actions.js';
const garden=moment('water',false);
const dog=panel(['boy',7,15,.76],['dog',94,77,.49]);
const alone=panel(['girl',34,7,.83]);
const several=panel(['boy',-1,29,.62],['girl',73,24,.61],['dog',114,103,.43],['ball',56,112,.32]);
const play=panel(['boy',4,30,.65],['girl',92,25,.61],['ball',68,98,.42,'roll']);
const seek=panel(['lumi',1,20,.74],['box',99,85,.45]);
const open=panel(['lumi',1,20,.74],['box:cream:big:open',99,85,.45,'open']);
const find=panel(['lumi',1,20,.74],['box:cream:big:open',99,90,.45],['bear',109,52,.31,'rise']);
const fill=panel(['lumi',2,17,.76],['watering',91,59,.43],['water',86,94,.46]);
const flower=panel(['lumi',1,9,.76],['flower',113,62,.39],['watering',79,78,.43,'pour']);
const planted=panel(['lumi',1,19,.72],['pot',104,97,.42],['leaf',104,65,.31]);
const sprout=panel(['lumi',2,14,.74],['pot',100,101,.46],['flower:gold',98,59,.48,'rise']);
const events={
 open:['Луми открыл коробку.',open],find:['Луми достал медвежонка.',find],
 wash:['Луми вымыл руки.',moment('wash')],dry:['Луми вытер руки.',moment('dry')],
 fill:['Луми налил воду в лейку.',fill],flower:['Луми полил цветок.',flower],
 planted:['Луми посадил маленький росток.',planted],sprout:['Позже вырос цветок.',sprout],
 walk:['Мальчик вышел гулять.',moment('walk')],roll:['Мальчик покатил мяч.',moment('roll')],
};
const turn=id=>token(id,events[id][1],{label:events[id][0]});
const retell=(instruction,model,imgs,extra={})=>say(instruction,model,imgs,'retell',
 {adultPrompt:'Задайте один короткий вопрос, дайте время ответить. Можно принять одно слово или рассказать вместе.',...extra});
const sample=(first,last)=>'Сначала '+events[first][0]+' Потом '+events[last][0];
const stages=(text,...ids)=>scene(text,ids.length===2?sample(...ids):ids.map(id=>events[id][0]).join(' '),
 ...ids.map((id,i)=>frame(events[id][1],'rise',{reset:i>0,says:events[id][0]})));
const first=(a,b)=>choose('Покажи, что было сначала.',sample(a,b),[turn(b),turn(a)],a,
 {review:panel([events[a][1],0,30,.52],[events[b][1],85,30,.52])});
const later=(a,b,extras=[])=>choose('Найди продолжение показанного эпизода.',sample(a,b),[turn(a),turn(b),...extras.map(turn)],b,{context:events[a][1]});
const sequence=(ids)=>order('Разложи картинки по порядку.',ids.length===2?sample(...ids):ids.map(id=>events[id][0]).join(' '),ids.map(turn).reverse(),ids);
const frames=ids=>ids.map(turn);
const talkAbout=(first,last)=>retell('Расскажи, что было сначала и что потом.',sample(first,last),frames([first,last]));
const three=['planted','flower','sprout'];
const describeToys=['ball','car','bear'];
const affinities={
 ball:'Это мяч. Он красный и круглый. Я люблю катить мяч.',
 car:'Это машинка. Она синяя. Я люблю катать машинку.',
 bear:'Это медвежонок. Он мягкий. Мне нравится его обнимать.',
};
const favorites=(instruction,extra={})=>retell(instruction,affinities.ball,describeToys,{chooseVisual:true,allowReal:true,models:affinities,
 adultPrompt:'Ребёнок может показать настоящую любимую игрушку. Можно выбрать картинку только для опоры.',...extra});
export const stories=lessons(9,[
 ['Замечать и называть персонажей картины.',[
  scene('Один герой.','На картинке девочка.',frame(alone)),
  scene('На картине двое.','Здесь мальчик и собака.',frame(dog)),
  scene('Рассмотрим всех героев.','Здесь мальчик, девочка и собака.',frame(several),frame('boy'),frame('girl'),frame('dog')),
 ],
 task('Кто на картине?',retell('Назови героя.','На картинке девочка.',[token('alone',alone)])),
 task('Найди животное',{...language('Покажи животное на картинке.','На картинке собака.','parts'),diagram:dog,correct:['dog'],
  cards:[token('dog','dog',{area:[55,53,40,41]}),token('boy','boy',{area:[22,18,34,67]})]}),
 task('Все герои',place('Подбери всех, кто был на картинке.','Мальчик, девочка и собака.',
  ['dog','boy','cat','girl'],[['question','boy','Герой'],['question','girl','Героиня'],['question','dog','Животное']],{context:several})),
 task('Два героя',retell('Назови обоих героев.','Здесь мальчик и собака.',[token('dog',dog)])),
 task('Галерея героев',...[['Девочка.',alone],['Мальчик и собака.',dog],['Мальчик, девочка и собака.',several]]
 .map(([line,art],i)=>retell('Назови героев картины.',line,[token('picture-'+i,art)]))),
 ],
 ['Формулировать высказывание по сюжетной картине.',[
  scene('Кто в саду?','Девочка поливает цветы.',frame(garden)),scene('Во что играют дети?','Дети играют с мячом.',frame(play)),
  scene('Что можно рассказать?','Девочка в саду. Она поливает цветок.',frame(garden),frame(moment('water'),'rise',{reset:true})),
 ],
 task('Герой картины',retell('Назови героя.','Это девочка.',[token('garden',garden)])),
 task('Действие героя',retell('Назови действие.','Девочка поливает.',[token('garden',garden)])),
 task('Предложение по картине',retell('Скажи, кто и что делает.','Девочка поливает цветок.',[token('garden',garden)])),
 task('Где играют?',retell('Расскажи, где или с чем играют дети.','Дети играют на полянке. Они катают мяч.',[token('play',play)])),
 task('Ожившая картина',retell('Расскажи о картине. Если хочется, добавь ещё одну фразу.','Девочка в саду. Она поливает цветок.',[token('garden',garden)],
  {modeButton:'Оживить картину',result:frame(moment('water'))})),
 ],
 ['Выделять начало короткой истории.',[
  stages('Что было сначала?','open','find'),stages('Сначала руки моют.','wash','dry'),
  stages('Назовём первый эпизод.','fill','flower'),
 ],
 task('Первое событие',first('open','find')),task('Порядок двух картинок',sequence(['wash','dry'])),
 task('Что было первым?',retell('Назови первое действие.','Сначала Луми открыл коробку.',frames(['open','find']))),
 task('Сначала Луми…',retell('Закончи фразу «Сначала Луми…».','Сначала Луми вымыл руки.',frames(['wash','dry']))),
 task('Начало истории',first('fill','flower'),first('wash','dry'),retell('Скажи, что Луми сделал первым.','Сначала Луми налил воду в лейку.',frames(['fill','flower']))),
 ],
 ['Описывать продолжение причины и результата.',[
  stages('Коробка открылась. Что дальше?','open','find'),stages('Зачем Луми налил воду?','fill','flower'),
  stages('Свяжем два события.','wash','dry'),
 ],
 task('Продолжение',later('open','find',['dry'])),task('Вторая картинка',later('fill','flower',['wash'])),
 task('Потом Луми…',retell('Закончи фразу «Потом Луми…».','Потом Луми достал медвежонка.',frames(['open','find']))),
 task('Два события',talkAbout('fill','flower')),
 task('Галерея продолжений',sequence(['open','find']),talkAbout('open','find'),sequence(['wash','dry']),talkAbout('wash','dry')),
 ],
 ['Рассказывать о знакомой игрушке по плану.',[
  scene('Луми показывает свой любимый мяч.','Это мой мяч.',frame(seek),frame('ball','roll')),
  scene('Какой он?','Он красный и круглый.',frame('ball'),frame('red'),frame('round')),
  scene('Что можно делать с мячом?',affinities.ball,frame('ball'),frame(moment('roll'),'show',{reset:true})),
 ],
 task('Любимая игрушка',favorites('Выбери игрушку. Можно взять свою настоящую.')),
 task('Назови её',favorites('Назови игрушку, которую выбрал.')),
 task('Наглядный план',place('Подбери цвет и форму красного мяча.','Мяч красный и круглый.', ['red','blue','round','square'],
  [['ball','red','Цвет'],['ball','round','Форма']],{context:'ball'})),
 task('Любимое действие',favorites('Расскажи, что можно делать с любимой игрушкой.')),
 task('Моя любимая игрушка',favorites('Назови игрушку, опиши её и скажи, как любишь играть.')),
 ],
 ['Рассказывать небольшую историю с иллюстрациями.',[
  stages('Три картинки про цветок.',...three),stages('Начало, действие и результат.',...three),
  stages('Свяжем события короткими фразами.',...three),
 ],
 task('Герой истории',retell('Назови героя истории.','Луми посадил росток.',frames(['planted']))),
 task('Картинки по порядку',sequence(three)),task('Что было сначала?',retell('Расскажи начало.','Сначала Луми посадил росток.',frames(three))),
 task('Чем закончилось?',retell('Расскажи, что было потом и в конце.','Потом Луми полил росток. В конце вырос цветок.',frames(three))),
 task('Маленький автор',retell('Расскажи историю по картинкам вместе со взрослым.',
 'Сначала Луми посадил росток. Потом он его полил. Позже вырос цветок.',frames(three),
 {adultPrompt:'Показывайте по одной картинке. Можно рассказать историю вместе. Количество фраз не проверяется.'})),
 ],
]);
