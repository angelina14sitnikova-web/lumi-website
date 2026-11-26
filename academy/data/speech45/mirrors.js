import {lessonSet,demo,step,visual,talk,choose,multi,place,match,order,task,token} from './builders.js';
import {panel} from '../speech34/builders.js';
const illustrate=(a,b)=>visual(a,b);
const say=(prompt,line,...art)=>talk(prompt,line,art);
const compare=(a,b)=>panel([a,1,27,.51],[b,91,27,.51]);
const cards=(a,b,actA,actB)=>[token('first',a,{action:actA}),token('second',b,{action:actB})];
const pick=(prompt,line,values,correct,extra={})=>choose(prompt,line,values,correct,extra);
const pairs=[
 ['ball','ball::small','Большой мяч — маленький мяч.'],
 ['tower-high','tower-low','Высокая башня — низкая башня.'],
 ['fast-wheel','slow-wheel','Быстро — медленно.'],
 ['tea-hot','icy-glass','Горячий чай — холодная вода.'],
 ['happy','sad','Весёлый — грустный.'],
 ['plate','dirty-plate','Чистая тарелка — грязная тарелка.'],
 ['opened-box','closed-box','Открытая коробка — закрытая коробка.'],
 ['full-jar','empty-jar','Полная банка — пустая банка.'],
 ['pillow','block','Мягкий — твёрдый.'],
 ['smooth','rough','Гладкий — шершавый.'],
];
const opposite=(pair,i)=>pick('Подбери противоположность к показанному признаку.',pair[2],
 [pairs[(i+3)%10][1],pair[0],pair[1]],pair[1],{context:pair[0]});
const sizePairs=[['ball','ball::small','Большой и маленький мячи.'],['block','block::small','Большой и маленький кубики.'],
 ['bear','bear::small','Большой и маленький медвежата.'],['doll','doll::small','Большая и маленькая куклы.'],['car','car::small','Большая и маленькая машинки.']];
const turn=(a,b,line,i=0)=>choose('Выбери, что изменилось в зеркале.',line,[b,pairs[(i+2)%10][1]],b,{context:a,result:{art:b,action:'turn'}});
const fast='fast-wheel',slow='slow-wheel';
const races=panel(['road',15,40,.83],['car:blue',25,60,.5,'fast'],['car:blue',20,102,.5,'slow']);
const run=(id,label,action)=>token(id,panel(['road',12,45,.85],['car:blue',28,60,.60,action]),{label,action:'rise'});
const faster=run(fast,'Быстрое движение','fast'),slower=run(slow,'Медленное движение','slow');
const speedModel='Машинка едет быстро. Потом машинка едет медленно.';
const tea=['icy-glass','tea-cool','tea-warm','tea-hot'];
const moodStory=[
 [visual('lumi','bunny','bouquet'),'Я очень рад. Зайчик пришёл ко мне в гости!','happy'],
 [visual('bunny','broken-car'),'Мне грустно. У моей машинки сломалось колесо.','sad'],
 [visual('lumi','rain','park'),'Я расстроился из-за дождя, но обрадовался, когда друг предложил поиграть дома.','happy'],
];
export const mirrors=lessonSet(4,[
 ['Сравнивать размер относительно другого предмета.',[
  demo('Посмотрим на два одинаковых мяча разного размера.',step(compare('ball','ball::small'),'Один мяч большой, другой маленький.','turn')),
  demo('Сравним средний мяч сначала с маленьким, потом с большим.',step(compare('ball::medium','ball::small'),'Этот мяч больше маленького мяча.','turn'),step(compare('ball::medium','ball'),'Теперь тот же мяч меньше другого.','turn')),
  demo('Скажем, чем различаются игрушки.',step(compare('doll','doll::small'),'Эта кукла большая, а эта маленькая.','rise'),step(compare('block','block::small'),'Этот кубик большой, а этот маленький.','rise')),
 ],
 task('Другой размер',pick('К большому мячу подбери маленький мяч.','Большой мяч — маленький мяч.',['ball','ball::small','doll::small'],'ball::small',{context:'ball'})),
 task('Как закончить фразу?',say('Этот мяч большой, а этот…','Этот мяч маленький.',compare('ball','ball::small'))),
 task('Сравни и назови размеры',say('Назови размеры двух кубиков.','Этот кубик больше, а этот меньше.',compare('block','block::small'))),
 task('Противоположные сочетания',match('Подбери к каждой крупной игрушке такую же маленькую.','Большая кукла — маленькая кукла. Большой мишка — маленький мишка.',sizePairs.slice(2,4))),
 task('Зеркальная мастерская',...sizePairs.flatMap(([a,b,line])=>[pick('Выбери другую по размеру такую же игрушку.',line,[a,b],b,{context:a}),say('Расскажи, чем игрушки различаются.',line,compare(a,b))]))],
 ['Сравнивать высоту при общей опоре.',[
  demo('Поставим башни на одну землю.',step(compare('tower-high','tower-low'),'Высокая башня выше низкой.','rise')),
  demo('Посмотрим на деревья.',step(compare('tree-high','tree-low'),'Это дерево высокое. Это дерево низкое.','rise')),
  demo('Сравним двумя способами.',step(compare('tower-high','tower-low'),'Первая башня выше второй. Вторая башня ниже первой.','rise')),
 ],
 task('Низкая башня',pick('Покажи низкую башню.','Вот низкая башня.',['tower-high','tower-low'],'tower-low')),
 task('Противоположная высота',pick('У этого дерева большая высота. Подбери низкое дерево.','Это низкое дерево.',['tree-high','tree-low','tower-low'],'tree-low',{context:'tree-high'})),
 task('Выше или ниже?',say('Закончи: высокая башня… низкой.','Высокая башня выше низкой.',compare('tower-high','tower-low'))),
 task('Две башни',place('Слева собери низкую башню, справа высокую.','Высокая башня выше низкой.',['tower-high','tower-low'],[['arrow','tower-low'],['arrow','tower-high']],{result:compare('tower-low','tower-high')}),
  say('Расскажи о высоте двух башен.','Левая башня ниже, правая выше.',compare('tower-low','tower-high'))),
 task('Город башен',...[[ 'tower-high','tower-low'],['tower-medium','tower-low'],['tower-medium','tower-high']].map(([a,b])=>say('Какая башня выше? Какая ниже?','Сравни верхушки. Скажи, какая башня выше.',compare(a,b))))],
 ['Обозначать скорость движения словами «быстро» и «медленно».',[
  demo('Две одинаковые машинки едут по дорожкам.',step(races,'Одна машинка едет быстро, а другая медленно.','show')),
  demo('Посмотрим, как одна и та же машинка меняет скорость.',step(faster.art,'Сначала машинка едет быстро.','show'),step(slower.art,'Потом машинка едет медленно.','show')),
  demo('Расскажем о движении.',step(faster.art,'Машинка едет быстро.','show'),step(slower.art,'Машинка едет медленно.','show')),
 ],
 task('Кто движется быстрее?',pick('Посмотри на две одинаковые машины. Какая движется быстрее?',speedModel,[slower,faster],fast)),
 task('Медленное движение',pick('Запусти медленное движение машины.','Машинка едет медленно.',[faster,slower],slow,{result:slower.art})),
 task('Противоположное движение',pick('Эта машинка едет быстро. Выбери движение наоборот.','Противоположное слово — медленно.',[slower,faster],slow,{context:faster.art})),
 task('Два предложения',say('Расскажи, как двигались две машины.',speedModel,races)),
 task('Волшебный регулятор скорости',talk('Выбери, с какой скоростью поедет машинка. Запусти и расскажи об этом.',
  speedModel,[slower,faster],{chooseVisual:true,modeButton:'Запустить',results:{[fast]:faster.art,[slow]:slower.art},models:{[fast]:'Машинка едет быстро.',[slow]:'Машинка едет медленно.'}}))],
 ['Различать условно показанную температуру и называть её.',[
  demo('Взрослый заварил чай.',step(['adult','tea-hot'],'Чай горячий, над ним поднимается пар.','pour')),
  demo('Сравним лёд и воду.',step(['ice','icy-glass'],'Лёд и вода со льдом холодные.','touch')),
  demo('Понаблюдаем, как меняется температура.',step('tea-hot','Сначала чай горячий.','rise'),step('tea-warm','Он остыл и стал тёплым.','rise'),step('tea-cool','Чай стал прохладным.','rise')),
 ],
 task('Что показали холодным?',pick('Вспомни, какая вода была холодной. Покажи её.','В стакане со льдом была холодная вода.',['tea-hot','icy-glass','tea-warm'],'icy-glass')),
 task('Слово наоборот',pick('Выбери противоположность слову «горячий».','Горячий — холодный.',['tea-warm','icy-glass','tea-hot'],'icy-glass',{context:'tea-hot'})),
 task('От холодного к горячему',order('Сначала холодный, потом прохладный, тёплый и горячий. Разложи по порядку.','Холодный, прохладный, тёплый, горячий.',tea.slice().reverse(),tea)),
 task('Расскажи о температуре',say('Скажи, какой чай и какая вода на этих картинках.','Чай горячий, а вода со льдом холодная.',illustrate('tea-hot','icy-glass'))),
 task('Кафе Луми',...[
  ['горячий чай','tea-hot','Взрослый заказал горячий чай.'],
  ['тёплый чай','tea-warm','Это чашка тёплого чая.'],
  ['холодную воду','icy-glass','Гость заказал холодную воду со льдом.'],
 ].map(([what,id,line])=>pick('По просьбе гостя выбери '+what+'.',line,tea,id,{context:'adult'})),
  say('Объясни, как ты выбрал воду со льдом.','Гость попросил холодную воду. На картинке в воде лёд.',illustrate('adult','icy-glass')))],
 ['Называть контрастные настроения по словам и событиям.',[
  demo('Луми рассказывает о радости.',step(moodStory[0][0],moodStory[0][1],'wave')),
  demo('Зайчик рассказывает о грусти.',step(moodStory[1][0],moodStory[1][1],'rise')),
  demo('Настроение бывает разным.',step(moodStory[2][0],moodStory[2][1],'rise')),
 ],
 task('Слова персонажа',pick('Послушай Луми и выбери слово о настроении.', 'Луми рад встрече с зайчиком.',['sad','happy'],'happy',{samples:[{text:moodStory[0][1]}],requiresAdult:true})),
 task('Слово противоположное по смыслу',pick('Подбери противоположное слово к «весёлый».','Весёлый — грустный.',['happy','sad'],'sad')),
 task('Почему герой рад?',say('Как ты думаешь, чему Луми мог обрадоваться?','Луми рад, потому что зайчик пришёл в гости.',moodStory[0][0])),
 task('Почему герой грустит?',say('Что могло огорчить зайчика?','Зайчик может грустить, потому что машинка сломалась.',moodStory[1][0])),
 task('Зеркало настроений',...moodStory.map(([art,line])=>talk('Разыграй сценку. Что мог почувствовать каждый герой?',line,[art])))],
 ['Соотносить противоположные слова и использовать их в речи.',[
  demo('Вспомним размер и высоту.',step(compare('ball','ball::small'),pairs[0][2]),step(compare('tower-high','tower-low'),pairs[1][2])),
  demo('Вспомним скорость и температуру.',step(races,pairs[2][2]),step(compare('tea-hot','icy-glass'),pairs[3][2])),
  demo('Посмотрим, как меняются знакомые вещи.',...pairs.slice(5,8).map(([a,b,line])=>step(compare(a,b),line,'turn'))),
 ],
 task('Соедини противоположные признаки',match('Подбери пары противоположностей.', 'Большой — маленький, высокий — низкий, чистый — грязный.',[pairs[0],pairs[1],pairs[5]])),
 task('Слово наоборот',pick('Подбери противоположность к услышанному слову «полный».','Полный — пустой.',['full-jar','empty-jar','closed-box'],'empty-jar')),
 task('Измени состояние',turn('opened-box','closed-box','Коробка была открыта и стала закрытой.',6),
  say('Что изменилось?','Теперь коробка закрыта.','closed-box')),
 task('Дополни пять предложений',...pairs.slice(0,5).map(([a,b,line],i)=>say('Закончи: '+['один мяч большой, а другой…','первая башня высокая, а вторая…','сначала машина ехала быстро, а потом…','чай горячий, а вода со льдом…','один герой весёлый, а другой…'][i],line,compare(a,b)))),
 task('Дворец зеркал',...pairs.map(opposite),
  talk('Выбери картинку и расскажи о двух противоположностях.','Чашка полная, а стакан пустой. Одна коробка открыта, другая закрыта.',[compare('full-jar','empty-jar'),compare('opened-box','closed-box')],{chooseVisual:true}))],
]);
