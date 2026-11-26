import {lessons,adultScene,task,frame,token,say,choose,multi,place,order} from './builders.js';
import {book} from './texts.js';

const story=(name,index)=>book[name].episodes[index];
const show=(line,name,...indexes)=>{
 const parts=indexes.map(i=>story(name,i));
 return adultScene(line,parts.map(p=>p.text).join(' '),parts.map((p,i)=>frame(p.art,'rise',{says:p.text,reset:i>0})),parts.map(p=>p.text).join('\n\n'));
};
const cue=ep=>token(ep.id,ep.art,{label:ep.text.slice(0,ep.text.indexOf('.')+1)||'Эпизод'});
const oral=(mode,instruction,model,art,extra={})=>say(instruction,model,[token('scene',art)],mode,{
 requiresAdult:true,adultPrompt:'Прочитайте текст выразительно. Можно проговорить вместе, ответить жестом или одним словом.',...extra,
});
const listen=name=>{
 const s=story(name,0);
 return oral('listen','Послушай произведение вместе со взрослым.',s.text,s.art,{transcript:s.text});
};
const imitate=name=>{
 const s=story(name,0);
 return oral('act','Покажи жесты вместе со взрослым. Слова можно повторить.',s.text,s.art,
  {modeButton:'Оживить сценку',result:frame(s.art,'wave')});
};
const retell=(name,index,instruction)=>oral('retell',instruction,story(name,index).text,story(name,index).art);
const reps=book.repka.episodes;
const chooseEp=(instruction,name,index,candidates)=>{
 const correct=story(name,index);
 return choose(instruction,correct.text,candidates.map(i=>cue(story(name,i))),correct.id,
  {requiresAdult:true});
};
const epOrder=(name,indexes)=>{
 const parts=indexes.map(i=>story(name,i));
 return order('Разложи картинки по ходу сказки.',parts.map(p=>p.text).join(' '),parts.map(cue).reverse(),parts.map(p=>p.id),{
  requiresAdult:true,review:parts[0].art,adultPrompt:'Если нужно, перечитайте эти эпизоды в библиотеке. Затем предложите разложить картинки.'});
};
const heroes=(name,ids,n)=>multi('Покажи героев этой сказки.',book[name].title+'. Назови знакомых героев.',ids,book[name].heroes.filter(id=>ids.includes(id)),n,
 {requiresAdult:true,adultPrompt:'Вспомните именно эту сказку. Герои могут встречаться в нескольких историях.'});
const matchBooks=place('Соедини героя с одной из сказок, где он появляется.','Дед тянул репку. Лягушка жила в теремке. Колобок катился по дорожке.',
 ['frog','kolobok','grandpa'],[[story('repka',1).art,'grandpa','Репка'],[story('terem',1).art,'frog','Теремок'],[story('kolobok',1).art,'kolobok','Колобок']],{requiresAdult:true});
const perform=()=>reps.map(ep=>oral('act','Разыграйте следующий эпизод. Расскажите его своими словами.',ep.text,ep.art,
 {modeButton:'Оживить эпизод',result:frame(ep.art,'rise'),transcript:ep.text,
 adultPrompt:'Прочитайте сцену. Ребёнок может показать действие, произнести одну реплику или помочь вам пересказать.'}));
const rainPlay=order('Дождик, зонтик, потом солнце. Запусти картинки по очереди.',book.rain.episodes[0].text,
 [token('sun','sun',{action:'rise'}),token('rain','rain',{action:'pour'}),token('umbrella','umbrella:red',{action:'open'})],['rain','umbrella','sun'],
 {requiresAdult:true,result:frame(story('rain',1).art,'rise'),transcript:book.rain.episodes[0].text});
export const library=lessons(10,[
 ['Слушать потешку и добровольно двигаться или проговаривать.',[
  show('Ладушки вместе со взрослым.','hands',0),show('Послушаем про сороку.','magpie',0),
  adultScene('Повторим короткий фрагмент.','Ладушки, ладушки! Где были? У бабушки.',[frame(story('hands',0).art,'wave')]),
 ],
 task('Послушай потешку',listen('hands')),task('Повтори движения',imitate('hands')),
 task('Картинка к потешке',choose('После чтения покажи подходящую картинку.','Сорока-белобока кашку варила.',
  [cue(story('hands',0)),cue(story('magpie',0))],'magpie',{requiresAdult:true,transcript:story('magpie',0).text})),
 task('Дополни фрагмент',oral('echo','Дополни потешку по желанию.','Где были? У бабушки.',story('hands',0).art)),
 task('Весёлая полянка',imitate('hands'),imitate('magpie')),
 ],
 ['Знакомиться с ритмом стиха и понимать его образ.',[
  show('Послушай стихотворение.','rain',0),show('Что было потом?','rain',0,1),
  adultScene('Назови любимую строку.','Кап-кап-кап, идёт дождик.',[frame(story('rain',0).art,'pour')]),
 ],
 task('Слушаем стихотворение',listen('rain')),
 task('Герой стихотворения',choose('Кто спрятался под зонтик?','Луми спрятался под зонтик.',['bunny','lumi','cat'],'lumi',
  {requiresAdult:true,transcript:story('rain',0).text})),
 task('Предмет из стихотворения',choose('Покажи предмет, о котором прочитал взрослый.','Луми спрятался под зонтик.',['umbrella:red','cup','book'],'umbrella:red',
  {requiresAdult:true,transcript:story('rain',0).text})),
 task('Любимая строка',oral('echo','Повтори понравившуюся строку.','Кап-кап-кап, идёт дождик.',story('rain',0).art)),
 task('Ожившие стихи',rainPlay,listen('ball'),listen('colors')),
 ],
 ['Узнавать героев разных сказок.',[
  show('Знакомимся с героями «Репки».','repka',1,3),show('Знакомимся с «Теремком».','terem',1,2),show('Вспомним «Колобка».','kolobok',0,2),
 ],
 task('Колобок',choose('Найди Колобка.','Это Колобок.',['ball','kolobok','turnip'],'kolobok',{requiresAdult:true})),
 task('Герои «Репки»',heroes('repka',['grandpa','dog','cat','frog'],3)),
 task('Герои «Теремка»',heroes('terem',['frog','mouse','fox','grandpa'],3)),
 task('Герои и сказки',matchBooks),
 task('Сказочный парад',retell('repka',3,'Назови знакомых героев.'),retell('terem',2,'Назови, кто жил в теремке.'),retell('kolobok',2,'Вспомни, кого встретил Колобок.')),
 ],
 ['Рассказывать о действиях героев в выбранной редакции.',[
  show('Кто первым тянул репку?','repka',1),show('Друзья помогают деду.','repka',2,3),show('Колобок встречает зайца.','kolobok',2),
 ],
 task('Кто тянул первым?',choose('Кто тянул репку первым?','Дед первым тянул репку.',['grandma','dog','grandpa'],'grandpa',
  {context:story('repka',1).art,requiresAdult:true})),
 task('Кто помог?',choose('Кто пришёл после деда, в этом эпизоде?','К деду пришла бабка.',['grandma','girl','mouse'],'grandma',
  {context:story('repka',2).art,requiresAdult:true})),
 task('Кто что делал?',place('Соедини героя с показанным действием.','Дед тянет репку. Колобок катится.',
  ['kolobok','grandpa'],[[story('repka',1).art,'grandpa','Тянет'],[story('kolobok',1).art,'kolobok','Катится']],{requiresAdult:true})),
 task('Предложение о герое',retell('repka',1,'Скажи одно предложение про деда.')),
 task('Ожившая сказка',...perform().slice(1)),
 ],
 ['Восстанавливать события «Репки».',[
  show('Вот начало сказки.','repka',0,1),show('Кто пришёл помочь?','repka',2),show('Чем всё закончилось?','repka',3),
 ],
 task('Начало «Репки»',chooseEp('Покажи начало сказки.','repka',0,[2,0,3])),
 task('Продолжение',chooseEp('Что было после того, как дед попробовал тянуть один?','repka',2,[1,0,2])),
 task('Два эпизода',epOrder('repka',[0,1])),
 task('Три эпизода',epOrder('repka',[0,2,3])),
 task('Волшебная книга',epOrder('repka',[0,2,3]),retell('repka',3,'Расскажи сначала и потом.')),
 ],
 ['Пересказывать знакомую сказку вместе со взрослым.',[
  show('Откроем книгу и вспомним героев.','repka',3),
  show('Три картинки для пересказа.','repka',0,2,3),
  adultScene('Скажем знакомую фразу вместе.','Тянут-потянут — вытянули репку!',[frame(story('repka',3).art,'jump')]),
 ],
 task('Назови героев',retell('repka',3,'Назови знакомых героев «Репки».')),
 task('Восстанови начало',chooseEp('Покажи, с чего началась сказка.','repka',0,[0,3,1])),
 task('Подбери продолжение',chooseEp('Найди, когда пришли помощники.','repka',2,[0,2,3])),
 task('Расскажи эпизод',retell('repka',1,'Расскажи эпизод с помощью взрослого.')),
 task('Большой сказочный спектакль',...perform()),
 ],
]);
