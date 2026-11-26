import {lessonSet,demo,step,visual,talk,choose,multi,place,match,order,task,token,say} from './builders.js';
import {professions} from './professions.js';
import {panel} from '../speech34/builders.js';
const role=id=>professions.find(job=>job.id===id);
const work=(id,action='touch')=>{
 const j=role(id);
 return panel([j.place,15,14,.85],[j.person,7,78,.52,action],[j.tools[0],98,86,.42,'rise']);
};
const active=(id,action)=>token(id,work(id,action),{label:role(id).title});
const speak=(prompt,phrase,...art)=>talk(prompt,phrase,art);
const imagine=(prompt,phrase,art,extra)=>say(prompt,phrase,[token('scene',art)],'dialogue',extra);
const jobs=['cook','doctor','builder','seller','postie','florist'];
const outings=['seller','postie','educator','driver'];
const selectJob=(prompt,model,ids,answer,context)=>choose(prompt,model,ids.map(id=>active(id)),answer,{context});
const matchJobs=(prompt,model,ids,feature)=>place(prompt,model,ids.map(id=>active(id)).reverse(),
 ids.map(id=>[typeof feature==='function'?feature(role(id)):role(id)[feature],id]));
const supplies=(id,options)=>multi('Что пригодится для этой работы?',role(id).line,options,role(id).tools.slice(0,2),2,{context:work(id)});
const cooking=[
 token('wash-fruit',visual('apple','water'),{label:'Вымыть фрукты',action:'wash'}),
 token('slice-fruit',visual('apple','knife'),{label:'Нарезать фрукты',action:'touch'}),
 token('mix-fruit',visual('bowl','cut-fruit'),{label:'Смешать фрукты',action:'stir'}),
 token('serve-salad',visual('salad','plate'),{label:'Подать салат',action:'rise'}),
];
const house=[
 token('wall-build','brick-wall',{label:'Уложить кирпичи'}),
 token('frame-build','wood-frame',{label:'Сделать деревянную раму'}),
 token('paint-build','paint-wall',{label:'Покрасить готовую стену'}),
];
const consult=[
 token('talk-visit',visual('lumi','doctor'),{label:'Беседа с врачом'}),
 token('listen-visit',visual('lumi','stethoscope'),{label:'Осмотр со стетоскопом'}),
 token('end-visit','checkup',{label:'Врач объясняет, что дальше'}),
];
export const masters=lessonSet(2,[
 ['Называть профессии, рабочие места, инструменты и результаты труда.',[
  demo('Познакомимся с мастерами.',...jobs.slice(0,3).map(id=>step(work(id),role(id).line,'touch'))),
  demo('Заглянем в магазин, на почту и к мастеру букетов.',...jobs.slice(3).map(id=>step(work(id),role(id).line,'touch'))),
  demo('Сравним, что получается у разных мастеров.',step(['kitchen','salad'],'Повар готовит блюдо.','stir'),step(['post-office','delivered-letter'],'Почтальон доставляет письмо.','walk'),step(['flower-shop','bouquet'],'Флорист собирает букет.','touch')),
 ],
 task('Найди повара',selectJob('Кто готовит еду? Покажи повара.','Повар смешивает продукты в миске.',['postie','cook','mason'],'cook')),
 task('Куда идёт врач?',choose('Найди рабочее место врача.','Врач принимает пациентов в кабинете.',['kitchen','clinic','post-office'],'clinic',{context:work('doctor')})),
 task('Инструменты мастеров',supplies('cook',['pot','brush','ladle']),supplies('doctor',['thermometer','brick','stethoscope']),supplies('mason',['stethoscope','trowel','brick'])),
 task('Результаты работы',matchJobs('Соедини мастеров с результатами работы.','Повар приготовил салат. Каменщик построил стену. Флорист собрал букет.',['cook','mason','florist'],'result')),
 task('Город мастеров',matchJobs('Помоги мастерам найти рабочие места.','Врач принимает в кабинете. Повар работает на кухне, а почтальон — на почте.',['doctor','cook','postie','florist'],'place'),
  speak('Назови одного мастера. Расскажи, что он делает.','Флорист работает с цветами. Он собирает красивые букеты.',work('florist')))],
 ['Называть кулинарные действия и рассказывать об их порядке.',[
  demo('Как готовят продукты?',step(['apple','water'],'Повар моет яблоко и грушу.','wash'),step(['pear','knife'],'Взрослый разрезает фрукты.','touch')),
  demo('Как готовят еду?',step(['bowl','ladle'],'Повар смешивает продукты.','stir'),step(['pot','bread'],'В кастрюле варят суп. В печи выпекают хлеб.','rise')),
  demo('Приготовим фруктовый салат.',...cooking.map((t,i)=>step(t.art,['Сначала повар вымыл фрукты.','Потом он нарезал их.','Затем смешал кусочки.','В конце подал салат.'][i],t.action))),
 ],
 task('Инструменты повара',supplies('cook',['brick','pot','ladle','paint-tin'])),
 task('Что делает повар?',speak('Назови действия повара на картинках.','Повар моет, режет и смешивает фрукты.',...cooking.slice(0,3).map(t=>t.art))),
 task('Как пользуются посудой?',match('Соедини посуду с действиями.','Суп варят в кастрюле, наливают половником и едят ложкой.',[['soup','pot'],['bowl','ladle'],['hand','spoon']])),
 task('Как готовится салат?',order('Разложи картинки по порядку.','Вымыли, нарезали, смешали и подали.',[cooking[2],cooking[0],cooking[3],cooking[1]],cooking.map(t=>t.id))),
 task('Ресторан Луми',...cooking.map(t=>choose('Выбери действие: '+t.label.toLowerCase()+'.','Повар готовит фруктовый салат.',[cooking[(cooking.indexOf(t)+2)%4],t],t.id,{result:{art:t.art,action:t.action}})),
  speak('Что повар сделал сначала, потом и в конце?','Сначала повар вымыл фрукты. Потом нарезал и смешал их. В конце подал салат.',visual('apple','knife','bowl','salad')))],
 ['Узнавать действия врача на обычном плановом осмотре.',[
  demo('Луми пришёл на плановый осмотр.',step(['lumi','clinic'],'Врач принимает в кабинете.','walk'),step(['doctor','lumi'],'Он приглашает Луми поговорить.','wave')),
  demo('Что делает врач на осмотре?',step(consult[0].art,'Врач спрашивает Луми, как он себя чувствует.','wave'),step(consult[1].art,'Стетоскоп помогает врачу слушать дыхание.','touch')),
  demo('Осмотр закончился.',step(consult[2].art,'Врач объясняет, что будет дальше.','rise'),step(['doctor','lumi'],'Луми благодарит врача.','wave')),
 ],
 task('Что есть в кабинете?',supplies('doctor',['stethoscope','ladle','thermometer','brick'])),
 task('Для чего эти инструменты?',match('Соедини предмет с тем, что делает врач.','Стетоскопом слушают дыхание. Термометром измеряют температуру.',[[visual('doctor','lumi'),'stethoscope','Послушать дыхание'],['temperature','thermometer','Измерить температуру']])),
 task('Как ты себя чувствуешь?',imagine('Представь, что ты Луми. Расскажи врачу, как ты себя чувствуешь.','Сегодня я чувствую себя хорошо.',work('doctor'),{partner:'Спасибо, что рассказал. Теперь я проведу обычный осмотр.'})),
 task('Обычный осмотр',order('Вспомни, как проходил осмотр Луми. Разложи картинки.','Сначала врач поговорил с Луми, затем послушал дыхание, в конце объяснил, что дальше.',[consult[2],consult[0],consult[1]],consult.map(t=>t.id))),
 task('Кабинет доброго врача',imagine('Поздоровайся с врачом.','Здравствуйте!',consult[0].art,{partner:'Здравствуй! Как ты себя чувствуешь?'}),
  imagine('От имени Луми ответь на вопрос.','Я чувствую себя хорошо.',consult[1].art,{partner:'Спасибо, Луми. Давай подведём итог осмотру.'}),
  imagine('Поблагодари врача и попрощайся.','Спасибо. До свидания!',consult[2].art,{partner:'До свидания, Луми!' }))],
 ['Называть строительные профессии, материалы и шаги общей работы.',[
  demo('Как кладут кирпичи?',step(work('mason'),'Каменщик укладывает кирпичи рядами.','touch'),step(house[0].art,'Из кирпичей получилась стена.','rise')),
  demo('Что умеют маляр и плотник?',step(work('painter'),'Маляр красит стену.','draw'),step(work('carpenter'),'Плотник соединяет деревянные детали.','touch')),
  demo('Мастера делают дом вместе.',step(['brick-wall','wood-frame'],'Стены и рамы сделали разные специалисты.','rise'),step(['house','paint-wall'],'После окраски наш дом готов.','rise')),
 ],
 task('Инструменты маляра',supplies('painter',['roller','ladle','paint-tin','comb'])),
 task('Материалы стройки',multi('Что пригодится для стены и оконной рамы?','Кирпичи и доски — строительные материалы.',['brick','banana','plank','cup'],['brick','plank'],2)),
 task('Что чем делают?',match('Соедини инструмент с показанной работой.','Каменщик кладёт кирпичи, маляр красит валиком, плотник работает с молотком.',[['brick-wall','trowel'],['paint-wall','roller'],['wood-frame','hammer']])),
 task('Порядок стройки',order('Сначала стена, затем рама, в конце отделка. Расставь картинки.','Каменщик построил стену. Плотник сделал раму. Маляр покрасил стену.',[house[2],house[0],house[1]],house.map(t=>t.id))),
 task('Строим город',...house.map((t,i)=>choose('Найди часть дома: '+['кирпичная стена','деревянная рама','покрашенная стена'][i]+'.','Этот этап делает отдельный специалист.',[t,house[(i+1)%3]],t.id,{result:{art:i===2?'house':t.art,action:'rise'}})),
  speak('Кто помог построить виртуальный дом?','Каменщик сложил стену, плотник сделал раму, а маляр покрасил стену.','house'))],
 ['Рассказывать, какую пользу городу приносит труд взрослых.',[
  demo('Зайдём на рынок и на почту.',...outings.slice(0,2).map(id=>step(work(id),role(id).line,'touch'))),
  demo('Кто работает с детьми и пассажирами?',...outings.slice(2).map(id=>step(work(id),role(id).line,'walk'))),
  demo('Как жители помогают друг другу?',step(['delivered-letter','groceries'],'Письма доставляют, а покупки помогают подобрать.','rise'),step(['bus-trip','group-play'],'Водитель везёт пассажиров. Воспитатель помогает детям играть вместе.','drive')),
 ],
 task('Где трудятся мастера?',matchJobs('Соедини мастеров с рабочими местами.','Почтальон работает на почте. Воспитатель работает в детском саду.',outings,'place')),
 task('Что нужно для работы?',supplies('postie',['envelope','plate','cloth-bag']),supplies('educator',['pot','book','doll'])),
 task('Кто доставит письмо?',selectJob('Письмо нужно доставить в соседний дом. Кто это делает?','Почтальон доставляет письма.',['seller','postie','cook'],'postie','envelope')),
 task('Предложение о работе',talk('Выбери мастера и составь о его работе предложение.','Водитель везёт пассажиров в автобусе.',outings.map(id=>active(id)),{chooseVisual:true,models:Object.fromEntries(outings.map(id=>[id,role(id).line]))})),
 task('Один день города',...outings.map(id=>speak('Посмотри, чем занят мастер. Как это помогает людям?',role(id).line,work(id))))],
 ['Объяснять, как действия, инструменты и результаты помогают узнать профессию.',[
  demo('Кто готовит блюдо?',step(work('cook','stir'),'Повар моет, нарезает и смешивает продукты.','rise'),step('salad','Повар приготовил салат.','rise')),
  demo('Кто строит стену?',step(work('mason','touch'),'Каменщик укладывает кирпичи.','touch'),step('brick-wall','Получилась кирпичная стена.','rise')),
  demo('Соберём подсказки о профессии.',step(['envelope','post-office'],'Есть письма и почтовое отделение.','rise'),step(work('postie','walk'),'Человек относит письма по адресам. Это почтальон.','walk')),
 ],
 task('Угадай по движению',selectJob('Кто укладывает кирпичи, чтобы выросла стена?','Это каменщик. Он выкладывает стену из кирпичей.',['florist','mason','doctor'],'mason',work('mason','touch'))),
 task('Подходящие инструменты',supplies('mason',['ladle','trowel','brick'])),
 task('Угадай по результату',selectJob('Здесь готов свежий букет для покупателя. Кто собирает букеты?','В цветочной мастерской букеты собирает флорист.',['postie','florist','driver'],'florist','bouquet')),
 task('Я думаю, потому что…',speak('Как ты догадался, кто это?','Я думаю, что это почтальон, потому что он доставляет письма.',work('postie'))),
 task('Парад профессий',...['cook','mason','driver','postie','florist'].map((id,i)=>selectJob(
  ['Кто приготовил салат на кухне?','Кто построил стену из кирпичей?','Кто привёз пассажиров на автобусе?','Кто доставил письмо?','Кто собрал букет в цветочной мастерской?'][i],
  role(id).line,['cook','mason','driver','postie','florist'].filter((_,j)=>[i,(i+1)%5,(i+3)%5].includes(j)),id,role(id).result)),
  speak('Придумай загадку о профессии для взрослого.','Кто работает на кухне и варит суп в большой кастрюле?',visual('pot','ladle','kitchen')))],
]);
