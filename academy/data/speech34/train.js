import {lessons,scene,task,frame,panel,token,say,choose,place} from './builders.js';
import {phrase} from '../../speech/words.js';
import {moment,cue} from './actions.js';

const nameColor=(id,c)=>say('Назови предмет с его цветом.',phrase(id,c)+'.',[id+':'+c]);
const present=(id,c)=>frame(id+':'+c,'rise',{says:phrase(id,c)+'.'});
const agree=(ids,trait)=>place('Подбери предметы для показанного признака.',ids.map(id=>phrase(id,trait)+'.').join(' '),
 ids.map(id=>token(id,trait==='large'?id:id+':'+trait)),
 ids.map(id=>[trait,id,'Назови сочетание с '+id]),{responseMode:'compose'});
const article={ball:'мяч',block:'кубик',car:'машинку',bear:'медвежонка'};
const resultNoun={ball:'Мяч',block:'Кубик',car:'Машинка',bear:'Медвежонок'};
const directions={
 'on-table':['на стол','на столе','table',[27,13,45,29]],
 'under-table':['под стол','под столом','table',[33,58,36,30]],
 'in-box':['в коробку','в коробке','box:cream:big:open',[28,47,45,36]],
 'on-box':['на коробку','на коробке','box',[32,18,43,29]],
 'behind-screen':['за ширму','за ширмой','screen',[55,23,36,42]],
};
function where(id,key,withToy=true){
 const [,,furniture,[x,y,w]]=directions[key];
 const cover=[furniture,0,0,1],toy=[id,x*1.8,y*1.8,w*.0104,'rise'];
 if(key==='behind-screen')return panel(...(withToy?[[id,115,16,.32,'rise']]:[]),['screen',-13,0,.98]);
 if(key==='in-box'){
  return panel(cover,...(withToy?[toy,['box',0,22,1]]:[]));
 }
 return panel(cover,...(withToy?[toy]:[]));
}
function put(id,key){
 const [direction,location,base,area]=directions[key];
 const others=Object.entries(directions).filter(([k,entry])=>k!==key&&entry[2]===base);
 const extra=others.length?others:[[null,[null,null,null,area[1]<45?[29,60,41,29]:[20,9,47,29]]]];
 const slotList=[[id,id,direction,area],...extra.map(([,d])=>['arrow',[],'Другое место',d[3]])];
 if(key==='on-box'||key==='in-box'){
  slotList[1]=key==='on-box'?['arrow',[],'Внутри',[32,53,43,32]]:['arrow',[],'Сверху',[30,9,44,29]];
 }
 return place('Помести '+article[id]+' '+direction+'.',resultNoun[id]+' '+location+'.',[id],slotList,
  {map:where(id,key,false),targetCount:1,result:frame(where(id,key),'rise')});
}
const locationScene=(id,key)=>scene('Посмотри, куда Луми ставит игрушку.',resultNoun[id]+' '+directions[key][1]+'.',
 frame(where(id,key,false)),frame(where(id,key),'show',{reset:true}));
const findWhere=(id,key,options)=>choose('Покажи, где '+resultNoun[id].toLowerCase()+' '+directions[key][1]+'.',resultNoun[id]+' '+directions[key][1]+'.',
 options.map(k=>token(k,where(id,k),{label:directions[k][1]})),key);
const sayWhere=(id,key)=>say('Где игрушка? Скажи своими словами.',resultNoun[id]+' '+directions[key][1]+'.',
 [token('here',where(id,key))]);
const result={
 build:['Луми построил башню.',panel(['block',72,97,.52],['block:mint',76,59,.44],['block:blue',80,28,.38])],
 draw:['Девочка нарисовала цветок.',panel(['paper',25,14,.77],['flower',55,42,.48])],
 open:['Мальчик открыл коробку.',panel(['box:cream:big:open',19,15,.84])],
};
const complete=id=>scene('Досмотри до результата.',result[id][0],frame(moment(id)),frame(result[id][1],'rise',{reset:true,says:result[id][0]}));
const completeTalk=id=>say('Расскажи, что герой сделал.',result[id][0],[cue(id),token('outcome',result[id][1])]);
const request=(ask,model,object,animation,answer)=>say(ask,model,[object],'dialogue',
 {modeButton:'Показать действие героя',partner:answer,result:frame(animation,'rise')});
const favors=[
 request('Попроси друга дать мяч.','Дай, пожалуйста, мяч.','ball',moment('roll'),'Вот мяч!'),
 request('Попроси поставить кубик на стол.','Поставь кубик на стол, пожалуйста.','block',where('block','on-table'),'Кубик на столе.'),
 request('Попроси открыть коробку.','Открой коробку, пожалуйста.','box',moment('open'),'Коробка открыта.'),
 request('Попроси поставить игрушку на полку.','Поставь машинку на полку, пожалуйста.','car',
 panel(['shelf',16,21,.82],['car',83,65,.44,'drive']),'Машинка на полке.'),
];
export const buildSentence=(person,action,model,object,extra={})=>{
 const list=[person,'bird',cue(action),cue(action==='read'?'jump':'read')].filter((id,i,a)=>i===a.indexOf(id));
 const slots=[['question',person,'Кто?'],['arrow',action,'Что делает?']];
 if(object){list.push(object,object==='cup'?'ball':'cup');slots.push([object,object,extra.where?'Где?':'Что?']);}
 return place('Собери смысловые карточки и скажи предложение.',model,list,slots,
  {responseMode:'compose',context:moment(action,false),result:frame(extra.result??moment(action))});
};
const cat=buildSentence('cat','sleep','Кошка спит.');
const flower=buildSentence('girl','draw','Девочка рисует цветок.','flower');
const sofa=buildSentence('cat','sleep','Кошка спит на диване.','sofa',{where:true});
const match=place('Соедини героя с его действием.','Кошка спит. Птица летит.',['bird','cat'],[[moment('sleep'),'cat','Спит'],[moment('fly'),'bird','Летит']]);
export const train=lessons(6,[
 ['Согласовывать слова в коротких сочетаниях.',[
  scene('Какого цвета мяч?',phrase('ball','red')+'.',present('ball','red')),
  scene('Какого цвета машинка?',phrase('car','red')+'.',present('car','red')),
  scene('Какого цвета ведёрко?',phrase('bucket','red')+'.',present('bucket','red'),present('car','red'),present('ball','red')),
 ],
 task('Цвет мяча',nameColor('ball','red')),task('Цвет машинки',nameColor('car','red')),task('Цвет ведёрка',nameColor('bucket','red')),
 task('Слова про размер',agree(['ball','car','bucket'],'large')),
 task('Поезд красивых слов',agree(['ball','car','bucket'],'red'),agree(['cup','ball','bucket'],'blue')),
 ],
 ['Понимать и называть местоположение игрушки.',[locationScene('ball','on-table'),locationScene('car','under-table'),locationScene('block','in-box')],
 task('Игрушка на столе',findWhere('ball','on-table',['under-table','on-table','in-box'])),
 task('Машинка под столом',findWhere('car','under-table',['on-table','under-table','behind-screen'])),
 task('Кубик в коробке',put('block','in-box')),task('Где мяч?',sayWhere('ball','on-table')),
 task('Прятки с Луми',...[['ball','on-table'],['block','in-box'],['car','under-table'],['bear','behind-screen'],['block','on-box']].map(([id,key])=>sayWhere(id,key))),
 ],
 ['Различать конструкцию действия и местоположения.',[
  scene('Мяч можно положить в коробку или поставить на неё.','Мяч в коробке. Кубик на коробке.',frame(where('ball','in-box')),frame(where('block','on-box'),'show',{reset:true})),
  locationScene('car','under-table'),locationScene('bear','behind-screen'),
 ],
 task('Мяч в коробку',put('ball','in-box')),task('Кубик на коробку',put('block','on-box')),task('Машинка под стол',put('car','under-table')),
 task('Медвежонок за ширму',put('bear','behind-screen')),
 task('Станция предлогов',put('car','on-table'),put('bear','in-box'),put('ball','under-table'),put('block','behind-screen')),
 ],
 ['Называть завершившиеся действия.',[complete('build'),complete('draw'),complete('open')],
 task('Назови результат',completeTalk('build')),
 task('Картинка результата',choose('Подбери готовый рисунок.','Девочка нарисовала цветок.',
  Object.entries(result).map(([id,[m,a]])=>token(id,a,{label:m})),'draw',{context:moment('draw')})),
 task('Девочка нарисовала…',say('Закончи фразу «Девочка нарисовала…».','Девочка нарисовала цветок.',[token('drawing',result.draw[1])])),
 task('Законченное действие',completeTalk('open')),
 task('Станция завершённых дел',...['build','draw','open'].map(completeTalk)),
 ],
 ['Формулировать простую просьбу.',[
  scene('Луми просит мяч у друга.','Дай, пожалуйста, мяч.',frame('lumi','wave'),frame(moment('roll'),'rise')),
  scene('Луми просит поставить кубик.','Поставь кубик на стол, пожалуйста.',frame('lumi'),frame(where('block','on-table'))),
  scene('Друг услышал понятную просьбу.','Открой коробку, пожалуйста. Коробка открыта.',frame('box'),frame(moment('open'),'show',{reset:true})),
 ],
 task('Что попросить?',say('Выбери предмет и попроси его.','Дай, пожалуйста, мяч.',['ball','car','doll'],'dialogue',
  {chooseVisual:true,animateSelection:true,models:{ball:'Дай, пожалуйста, мяч.',car:'Дай, пожалуйста, машинку.',doll:'Дай, пожалуйста, куклу.'},partner:'Конечно. Вот игрушка.'})),
 task('Вежливая просьба',favors[0]),task('Открой коробку',favors[2]),task('Положи на полку',favors[3]),
 task('Помощники Луми',...favors),
 ],
 ['Соединять смысловые части предложения.',[
  scene('Кто и что делает?','Кошка спит.',frame('cat'),frame(moment('sleep'))),
  scene('Добавляем предмет действия.','Девочка рисует цветок.',frame('girl'),frame(moment('draw')),frame('flower')),
  scene('Теперь добавим место.','Кошка спит на диване.',frame('cat'),frame(moment('sleep')),frame('sofa')),
 ],
 task('Герой и действие',match),task('Два вагончика',cat),task('Предмет действия',flower),task('Место действия',sofa),
 task('Поезд предложений',cat,flower,sofa,buildSentence('boy','read','Мальчик читает книгу.','book'),
  buildSentence('girl','drink','Девочка пьёт из чашки.','cup',{result:panel(['girl',28,12,.80],['cup',103,64,.45,'drink'])})),
 ],
]);
