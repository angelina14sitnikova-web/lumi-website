import {lessons,scene,task,frame,panel,token,say,choose,place,multi} from './builders.js';

export const moves={
 walk:['boy','Идёт','Мальчик идёт.','Я иду.'],
 run:['girl','Бежит','Девочка бежит.','Я бегу.'],
 jump:['boy','Прыгает','Мальчик прыгает.','Я прыгаю.'],
 draw:['girl','Рисует','Девочка рисует цветок.','Я рисую.',[['paper',87,94,.43],['crayon',112,87,.27,'draw']]],
 read:['boy','Читает','Мальчик читает книгу.','Я читаю.',[['book',86,73,.42,'open']]],
 eat:['girl','Ест','Девочка ест.','Я ем.',[['bowl',93,104,.47],['spoon',105,66,.28,'eat']]],
 drink:['boy','Пьёт','Мальчик пьёт.','Я пью.',[['cup',104,62,.36,'drink']]],
 sleep:['cat','Спит','Кошка спит.','Я сплю.',[['sofa',24,80,.68]]],
 groom:['cat','Умывается','Кошка умывается.','Я умываюсь.'],
 hop:['bunny','Прыгает','Заяц прыгает.','Я прыгаю.'],
 fly:['bird','Летит','Птица летит.','Птичка летит.'],
 swim:['fish','Плывёт','Рыба плывёт.','Рыба плавает.',[['water',8,77,.88]]],
 roll:['boy','Катит мяч','Мальчик катит мяч.','Я качу мяч.',[['ball',96,89,.46,'roll']]],
 throw:['girl','Бросает мяч','Девочка бросает мяч.','Я бросаю мяч.',[['ball',104,55,.40,'jump']]],
 build:['boy','Строит башню','Мальчик строит башню.','Я строю башню.',[['block:gold',94,96,.43],['block:mint',96,71,.40,'rise'],['block:blue',99,48,.37,'rise']]],
 drive:['lumi','Катает машинку','Луми катает машинку.','Я катаю машинку.',[['car',86,94,.47,'drive']]],
 rest:['girl','Укладывает куклу','Девочка укладывает куклу спать.','Я укладываю куклу спать.',[['bed',85,93,.47],['doll',100,65,.33,'sleep']]],
 water:['girl','Поливает цветок','Девочка поливает цветок.','Я поливаю цветок.',[['flower',110,77,.44],['watering',91,62,.41,'pour']]],
 wash:['lumi','Моет руки','Луми моет руки.','Я мою руки.',[['hand',93,72,.45,'wash'],['water',83,103,.5]]],
 dry:['lumi','Вытирает руки','Луми вытирает руки.','Я вытираю руки.',[['hand',92,83,.44],['towel',99,66,.50,'dry']]],
 sing:['girl','Поёт','Девочка поёт.','Я пою.',[['voice',99,29,.38,'rise']]],
 play:['lumi','Играет','Луми играет с мячом.','Я играю.',[['ball',100,91,.43,'roll']]],
 open:['boy','Открывает коробку','Мальчик открывает коробку.','Я открываю коробку.',[['box:cream:big:open',104,88,.45,'open']]],
 close:['boy','Закрывает коробку','Мальчик закрывает коробку.','Я закрываю коробку.',[['box',104,88,.45,'close']]],
};
const ensure={hop:'jump',build:'rest',water:'rest',sing:'show',play:'wave'};
const animate={roll:'show',throw:'show',build:'show',water:'show',drive:'show',rest:'show',dry:'show',wash:'show',play:'show'};
export function moment(id,acting=true){
 const [who,,,,props=[]]=moves[id];
 const action=acting?(animate[id]??ensure[id]??id):'show';
 const actor=[who,10,17,.75,action];
 const base=acting?props:props.map(([art,x,y,s])=>[art,x,y,s]);
 if(['sleep','swim'].includes(id)) return panel(...base,actor);
 return panel(actor,...base);
}
export const cue=(id,acting=true)=>token(id,moment(id,acting),{label:moves[id][1],action:'show'});
const model=id=>moves[id][2];
const frameAct=id=>frame(moment(id),'show',{says:model(id),reset:true});
const show=(text,...ids)=>scene(text,ids.map(model).join(' '),...ids.map(frameAct));
const know=(text,id,opts,extra={})=>choose(text,model(id),opts.map(id=>cue(id)),id,extra);
const talk=(text,id,extra={})=>say(text,model(id),[cue(id)],'speak',extra);
const enable=(text,ids,models=Object.fromEntries(ids.map(id=>[id,model(id)])))=>say(text,model(ids[0]),ids.map(id=>cue(id)),'act',
 {chooseVisual:true,models,animateSelection:true,modeButton:'Оживить картинку'});
const matchMoves=(items,ids,modelText)=>place('Соедини героя или предмет с его действием.',modelText,items,
 ids.map(([action,id])=>[moment(action),id,moves[action][1]]));
const firstPerson=Object.fromEntries(Object.entries(moves).map(([id,v])=>[id,v[3]]));
export const actions=lessons(4,[
 ['Называть знакомые действия человека.',[show('Что делают дети?','walk','run','jump'),show('Что делает каждый?','draw','read','eat','drink'),show('Назовём героя и действие.','draw','jump')],
 task('Кто бежит?',know('Покажи, кто бежит.','run',['jump','walk','run'])),task('Кто рисует?',know('Покажи, кто рисует.','draw',['draw','read','eat'])),
 task('Действие и картинка',place('Соедини анимацию с таким же действием на картинке.','Мальчик читает. Девочка рисует. Мальчик прыгает.',
 ['draw','read','jump'].map(id=>cue(id)),['read','jump','draw'].map(id=>[moment(id,false),id,moves[id][1]]))),
 task('Назови действие',talk('Посмотри и назови действие.','drink')),
 task('Ожившая площадка',enable('Выбери действие для героя и расскажи, что он делает.',['walk','jump','run','draw'])),
 ],
 ['Называть действия животных в показанной ситуации.',[show('Посмотри на кошку.','sleep','groom'),show('Кто прыгает, летит и плывёт?','hop','fly','swim'),show('Расскажем, что сейчас делают животные.','fly','hop')],
 task('Кто летит?',know('Покажи, кто здесь летит.','fly',['hop','fly','swim'])),
 task('Кто плывёт?',know('Найди того, кто сейчас плывёт.','swim',['fly','swim','sleep'])),
 task('Животные и действия',matchMoves(['cat','bunny','bird','fish'],[['swim','fish'],['sleep','cat'],['hop','bunny'],['fly','bird']],
 'Кошка спит, птица летит, рыба плывёт, заяц прыгает.')),
 task('Действие зверька',talk('Скажи, что делает животное.','groom')),
 task('Оживший лес',enable('Выбери животное, оживи его и скажи, что оно делает.',['groom','hop','fly','swim'])),
 ],
 ['Называть действия с игрушками.',[show('Что можно сделать с мячом?','roll','throw'),show('Что можно построить из кубиков?','build'),show('Поиграем с машинкой и куклой.','drive','rest')],
 task('Что сделать с мячом?',multi('Покажи оба действия с мячом.','Мяч можно катить и бросать.',['roll','build','throw'].map(id=>cue(id)),['roll','throw'],2)),
 task('Из чего башня?',choose('Выбери игрушки для башни.','Из кубиков строят башню.',['car','block','doll'],'block',{result:frame(moment('build'))})),
 task('Прокати машинку',say('Покажи, как можно катать машинку, и произнеси фразу.','Я катаю машинку.',['car'],'act',{modeButton:'Прокатить',result:frame(moment('drive'))})),
 task('Игрушки и действия',matchMoves(['ball','car','block','doll'],[['build','block'],['roll','ball'],['rest','doll'],['drive','car']],
 'Мяч катят, из кубиков строят, куклу укладывают спать, машинку катают.')),
 task('Игровая комната',...['roll','build','rest'].map(id=>say('Оживи игрушку и скажи, что делаешь.',firstPerson[id],[cue(id)],'act',{result:frame(moment(id)),modeButton:'Оживить игрушку'}))),
 ],
 ['Выделять действие и героя на картинке.',[show('Рассмотри девочку в саду.','water'),show('Что происходит с кубиками?','build'),show('Назовём героя и его действие.','water','build')],
 task('Герой картинки',choose('Кто поливает цветок?','Девочка поливает цветок.',['boy','girl','cat'],'girl',{context:moment('water',false)})),
 task('Действие героя',know('Что делает герой на картинке?','build',['roll','build','drink'],{context:moment('build',false)})),
 task('Подходящая анимация',know('Подбери анимацию к картинке.','water',['wash','water','draw'],{context:moment('water',false)})),
 task('Кто и что делает?',place('Собери карточки героя и его действия.','Девочка поливает цветок.',
 ['girl','boy',cue('water'),cue('build')],[['question','girl','Кто?'],['arrow','water','Что делает?']],
 {responseMode:'compose',context:moment('water',false),result:frame(moment('water'))})),
 task('Ожившие картинки',...['drink','water','build'].map(id=>talk('Расскажи, что происходит.',id))),
 ],
 ['Называть доступные героям действия.',[show('Посмотри, как летает птица.','fly'),show('Кто плавает и кто прыгает?','swim','hop'),show('Посмотри, что умеет ребёнок.','walk','draw','sing')],
 task('Кто умеет летать?',choose('Кто из этих героев умеет летать?','Птица умеет летать.',['bunny','cat','bird'],'bird',{result:frame(moment('fly'))})),
 task('Кто умеет плавать?',choose('Кто из этих героев умеет плавать?','Рыба и утка умеют плавать.',['fish','duck','block'],['fish','duck'])),
 task('Умения героев',matchMoves(['bird','fish','bunny'],[['hop','bunny'],['fly','bird'],['swim','fish']],'Заяц прыгает, птица летает, рыба плавает.')),
 task('Что умеют дети?',multi('Выбери два действия, которые может сделать ребёнок.','Ребёнок может идти, рисовать и петь.',['fly','walk','draw','sing'].map(id=>cue(id)),['walk','draw','sing'],2)),
 task('Школа удивительных умений',enable('Расскажи, что умеет герой и что умеешь ты.',['fly','hop','sing','draw'])),
 ],
 ['Говорить о себе от первого лица.',[
  scene('Посмотри, чем занимается Луми.','Я рисую. Я играю.',frame(panel(['lumi',9,26,.80],['crayon',102,87,.32,'draw'])),frame(moment('play'),'show',{reset:true})),
  scene('Руки сначала моют, потом вытирают.','Я мою руки. Я вытираю руки.',frame(moment('wash')),frame(moment('dry'),'show',{reset:true})),
  scene('О герое и о себе.','Луми рисует. Я рисую.',frame(panel(['lumi',13,19,.84],['crayon',97,79,.37,'draw'])),frame('girl','rise',{reset:true})),
 ],
 task('Что ты умеешь?',enable('Выбери своё действие и расскажи о нём.',['draw','run','read'],firstPerson)),
 task('Повтори действие',say('Покажи действие и назови его.','Я мою руки.',[cue('wash')],'act',{result:frame(moment('wash')),modeButton:'Действие показали'})),
 task('Я и моё действие',enable('Выбери действие и скажи «я…».',['play','wash','dry'],firstPerson)),
 task('Два занятия',say('Выбери и назови два своих занятия.','Я рисую. Я играю.',['draw','play','read','sing'].map(id=>cue(id)))),
 task('Мой маленький день',say('Расскажи, что ты любишь делать.','Я люблю рисовать. Ещё я люблю играть с мячом.',['draw','play','read'].map(id=>cue(id)))),
 ],
]);
