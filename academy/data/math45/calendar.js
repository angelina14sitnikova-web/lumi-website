import {token,set,show,move,scene,exercise,pick,connect,choose,join,stages,keyed} from './builders.js';
export const event=(tag,phase)=>({...token(tag),phase});
export const dawn=event('skyScene','morning'),day=event('skyScene','day'),dusk=event('skyScene','evening'),night=event('skyScene','night');
const phases=[dawn,day,dusk,night];
const wake=event('wake','morning'),wash=event('wash','morning'),meal=event('meal','morning');
const home=event('home','evening'),dinner=event('meal','evening'),ready=event('ready','evening');
const demo=(text,...cards)=>scene('together',text,cards);
const teachOrder=(text,...cards)=>scene('move',text,cards,{targets:cards,matches:cards.map((_,i)=>i),ordinal:true});
export const chooseEvent=(prompt,cards,index,sample,cues)=>exercise(prompt,'Вспомни историю Луми и посмотри на картинки.',pick(cards,index,sample,cues?{cues,ordinal:true}:{}));
export const orderEvents=(prompt,...cards)=>exercise(prompt,'Выбери, что было сначала, и продолжи по стрелке.',
 connect(cards.slice().reverse(),cards,cards.map((_,i)=>cards.length-i-1),{ordered:true,sequence:true,ordinal:true}));
const group=(prompt,cards,targets,matches)=>exercise(prompt,'Подбери место для каждой картинки.',connect(cards,targets,matches,{ordinal:true}));
export const calendarStrip=set('previousDay todayDay nextDay');
export const storyEvents=[event('seed','day'),event('water','day'),event('grow','day')];
const calendarStories=[
 ['Вчера Луми посадил семечко. Это предыдущая карточка.','Найди вчерашний день','Что Луми делал вчера?',0],
 ['Сегодня Луми поливает семечко. Выделена текущая карточка.','Найди сегодня','Что Луми делает сегодня?',1],
 ['Завтра Луми посмотрит, появился ли росток. Это следующая карточка.','Найди завтра','Что Луми надеется увидеть завтра?',2],
];
const calendarLessons=calendarStories.map(([description,prompt,ask,index])=>[
 [
  scene('highlight','Посередине карточка сегодняшнего дня.',calendarStrip,{focus:1,ordinal:true}),
  scene('highlight',description,calendarStrip,{focus:index,ordinal:true}),
  scene('move','В нашей истории дни отмечены этими картинками.',storyEvents,{targets:calendarStrip,matches:[0,1,2],ordinal:true}),
 ],
 [
  chooseEvent(prompt,calendarStrip,index,calendarStrip[index]),
  chooseEvent(ask,[storyEvents[2],storyEvents[0],storyEvents[1]],[1,2,0][index],null,[calendarStrip[index],storyEvents[index]]),
  index===0?orderEvents('Расположи вчера перед сегодня',...calendarStrip.slice(0,2)):
   index===1?group('Разложи события: вчера и сегодня',storyEvents.slice(0,2),calendarStrip.slice(0,2),[0,1]):
   orderEvents('Расположи завтра после сегодня',...calendarStrip.slice(1)),
  index===0?chooseEvent('Найди карточку, поставленную не первой',[calendarStrip[1],calendarStrip[0]],0,calendarStrip[0],calendarStrip.slice(0,2)):
   index===1?chooseEvent('Что наступает после вчера?',calendarStrip,1,calendarStrip[1]):
   orderEvents('Собери вчера, сегодня и завтра',...calendarStrip),
  index===0?orderEvents('Восстанови вчерашние события',token('seed'),token('water')):index===1?
   orderEvents('Восстанови сегодняшние события',wake,storyEvents[1],event('play','day')):
   group('Разложи три события по дням',[storyEvents[2],storyEvents[0],storyEvents[1]],calendarStrip,[2,0,1]),
 ]
]);
const garden=set('seed water sprout grow');
const sandwich=set('bread cheese sandwich eat');
export const calendar=keyed(9,'calendar-tower',[
 [[demo('Утро сменяется днём.',dawn,day),demo('За вечером приходит ночь.',dusk,night),teachOrder('Вот смена частей суток.',...phases)],
 [chooseEvent('Найди утро',[day,dawn,night],1,dawn),chooseEvent('Найди день',[day,dusk],0,day),chooseEvent('Выбери вечер',[night,dusk],1,dusk),
 group('Соотнеси картинки с частями суток',[wake,event('walk','day'),ready,event('sleep','night')],phases,[0,1,2,3]),
 orderEvents('Разложи части суток, начни с утра',...phases)]],
 [[demo('В нашем сюжете Луми утром проснулся, умылся и позавтракал.',wake,wash,meal),demo('Вечером он вернулся домой и приготовился ко сну.',home,ready),demo('Сравни события утренней и вечерней истории.',wake,ready)],
 [chooseEvent('Найди утреннее событие',[ready,wash],1,dawn),chooseEvent('Выбери вечернюю сцену',[meal,home],1,dusk),
 group('Разложи утренние и вечерние картинки',[wake,home,meal,ready],[dawn,dusk],[0,1,0,1]),
 orderEvents('Восстанови утро',wake,wash,meal),orderEvents('Восстанови вечер',home,dinner,ready)]],
 ...calendarLessons,
 [[teachOrder('Сначала семечко, после полива появится росток.',...garden.slice(0,3)),
 teachOrder('Хлеб, сыр, готовый бутерброд.',...sandwich.slice(0,3)),
 teachOrder('Посмотрим на четыре этапа выращивания растения.',...garden)],
 [chooseEvent('Что произошло раньше?',[garden[2],garden[0]],1),
 chooseEvent('Что произошло после хлеба?',[sandwich[3],sandwich[1]],1,sandwich[0]),
 orderEvents('Разложи три этапа выращивания',...garden.slice(0,3)),
 orderEvents('Восстанови четыре картинки',...sandwich),
 orderEvents('Собери историю Луми',wake,wash,event('walk','day'),ready)]],
]);
