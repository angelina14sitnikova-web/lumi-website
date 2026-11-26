import {lessonSet,demo,step,visual,talk,choose,multi,place,match,task,token,say} from './builders.js';
import {panel} from '../speech34/builders.js';

const flowers=['flower:rose','flower:lilac','flower:blue','flower:dark-blue','flower:light-green','flower:dark-green'];
const chips=['shade-rose','shade-lilac','shade-blue','shade-dark-blue','shade-light-green','shade-dark-green'];
const words=['розовый','сиреневый','голубой','тёмно-синий','светло-зелёный','тёмно-зелёный'];
const speech=(prompt,model,...items)=>talk(prompt,model,items);
const looks=(id,label)=>token(id,id,{label});
const flowerCards=flowers.map((id,i)=>looks(id,words[i]+' цветок'));
const chipCards=chips.map((id,i)=>looks(id,words[i]));
const enough=(prompt,line,choices)=>talk(prompt,line,choices,{chooseVisual:true});
const tint=(prompt,answer,reference)=>place(prompt,'Выбран нужный оттенок.',chipCards,[[reference,answer,'Цветок']],{responseMode:'paint',paintItems:['flower']});
const weighs=[
 ['sponge','stone',12,85,'Губка легче камня. Камень тяжелее губки.'],
 ['apple','feather',120,1,'Яблоко тяжелее пера. Перо легче яблока.'],
 ['stone','balloon',85,3,'Камень тяжелее воздушного шара. Шар легче камня.'],
 ['paper','cup',5,130,'Бумага легче чашки. Чашка тяжелее бумаги.'],
 ['cork','spoon',6,28,'Ложка тяжелее пробки. Пробка легче ложки.'],
];
const balance=([a,b,m1,m2])=>({scale:{a,b,tilt:m1>m2?-1:1}});
const testMass=([a,b,m1,m2,line],heavier=true)=>choose('Посмотри на весы. Какой предмет '+(heavier?'тяжелее?':'легче?'),line,[a,b],(m1>m2)===heavier?a:b,
 {context:balance([a,b,m1,m2]),contextLabel:'Чашечные весы с двумя предметами'});
const cases=[
 {id:'tired',art:panel(['park',8,9,.91],['lumi',35,60,.49,'rest']),line:'Я устал после прогулки. Хочу немного отдохнуть.',help:['chair','sofa'],reply:'Спасибо! Я немного посижу.'},
 {id:'cold',art:visual('boy','winter','scarf'),line:'Мне холодно. Я надену шарф.',help:['scarf','jacket'],reply:'Спасибо. Теперь мне теплее.'},
 {id:'nervous',art:visual('girl','stage'),line:'Я волнуюсь перед выступлением. Можно немного побыть рядом?',help:['hand','sofa'],reply:'Спасибо, что побыл со мной.'},
];
const moods=[
 {id:'glad',art:visual('lumi','bunny','flower'),line:'Я рад, что зайчик пришёл ко мне в гости!'},
 {id:'upset',art:visual('bunny','broken-car'),line:'У моей машинки отвалилось колесо. Мне грустно.'},
 {id:'angry',art:visual('girl','closed-box','block'),line:'Я сержусь. Мне хотелось закончить игру, а коробку закрыли.'},
];
const storyCard=item=>token(item.id,item.art,{label:'Сюжетная картинка'});
const listenStory=(sample,group)=>choose('Послушай героя. Потом покажи его историю.',sample.line,group.map(storyCard),sample.id,{samples:[{text:sample.line}],requiresAdult:true,adultPrompt:'Прочитайте слова героя до того, как ребёнок будет выбирать картинку.'});
const respond=(item,prompt,line)=>say(prompt,line,[storyCard(item)],'dialogue',{partner:item.reply, audioPhrases:[item.line]});
const taste=[['apple','sweet','Это яблоко сладкое.'],['lemon','sour','Этот лимон кислый.'],['salt-cracker','salty','Этот крекер солёный.']];
const hints=(target,phrase)=>speech('Опиши предмет по показанным признакам.',phrase,target);
export const garden=lessonSet(3,[
 ['Различать заметно отличающиеся цветовые оттенки и называть их.',[
  demo('Сравним два оттенка синего.',step(['flower:blue','flower:dark-blue'],'Этот цветок голубой. Этот цветок тёмно-синий.','turn')),
  demo('Сравним зелёные листья.',step(['leaf:light-green','leaf:dark-green'],'Один лист светло-зелёный, другой тёмно-зелёный.','touch')),
  demo('Посмотрим на цветы в саду.',step(['flower:rose','flower:lilac','flower:blue'],'В саду есть розовый, сиреневый и голубой цветы.','rise')),
 ],
 task('Названный оттенок',choose('Найди тёмно-синий цветок.','Это тёмно-синий цветок.',flowerCards.slice(1,4),flowers[3])),
 task('От светлого к тёмному',match('Соедини листья с их оттенками.','Светло-зелёный лист и тёмно-зелёный лист.',[['leaf:light-green',chipCards[4]],['leaf:dark-green',chipCards[5]]])),
 task('Цветок по описанию',tint('Раскрась цветок сиреневым.',chips[1],'flower')),
 task('Расскажи о цветах',speech('Назови цвета или оттенки этих трёх предметов.','Цветок сиреневый, этот лист тёмно-зелёный, а тот цветок голубой.',visual('flower:lilac','leaf:dark-green','flower:blue'))),
 task('Сад художника',...['голубым','розовым','тёмно-синим'].map((name,i)=>tint('Раскрась следующий цветок '+name+'.',chips[[2,0,3][i]],'flower')),
  speech('Расскажи, какие оттенки ты использовал.','На клумбе есть голубой, розовый и тёмно-синий цветы.',visual('flower:blue','flower:rose','flower:dark-blue')))],
 ['Употреблять слова о вкусе и запахе с опорой на описания и опыт.',[
  demo('Представим знакомые продукты.',...taste.map(([art,sense,phrase])=>step([art,sense],phrase,'rise'))),
  demo('У каждого может быть свой опыт.',step(['flower','apple'],'Можно вспомнить запах цветка или яблока.','touch'),step(['bread','lumi'],'Из пекарни Луми чувствует запах свежего хлеба.','walk')),
  demo('Опишем своё ощущение.',step(['lumi','apple'],'Мне кажется, что это яблоко сладкое. Другое яблоко может быть кислым.','eat')),
 ],
 task('Картинка к описанию',choose('Луми только что описал кислый лимон. Покажи его.','Этот лимон кислый.',['apple','lemon','salt-cracker'],'lemon')),
 task('Вкусовые пары',match('Соедини знакомые картинки: попробованные Луми лимон, яблоко и крекер.','Его яблоко сладкое, лимон кислый, крекер солёный.',taste.map(([art,id])=>[id,art]))),
 task('Знакомый запах',enough('Выбери то, запах чего тебе знаком. Опиши его, если хочешь.','Я помню запах свежего хлеба.',['bread','flower','orange','apple'])),
 task('Ощущение вместе',say('Вместе со взрослым опиши безопасный знакомый продукт. Можно вспомнить его вкус или запах.','Мне кажется, что это яблоко сладкое.',['apple','bread'],'tactile',{requiresAdult:true,adultPrompt:'Выберите знакомый продукт, который ребёнку можно есть. Можно вспомнить вкус, рассмотреть или понюхать продукт.'})),
 task('Лавка ароматов',...['apple','orange','bread'].map((art,i)=>speech('Вспомни продукт. Как можно описать его вкус или запах?',['Это яблоко сладкое.','Я помню запах апельсина.','Мне нравится запах свежего хлеба.'][i],art)))],
 ['Сравнивать массу по показаниям чашечных весов.',[
  demo('Поставим предметы на чаши весов.',step(balance(weighs[0]),'Чаша с камнем опустилась. Камень тяжелее.','rise')),
  demo('Большое бывает лёгким.',step(balance(weighs[2]),'Большой шар легче небольшого камня.','rise')),
  demo('Скажем двумя способами.',step(balance(weighs[0]),'Губка легче камня. Камень тяжелее губки.','rise')),
 ],
 task('Где тяжелее?',testMass(weighs[0])),
 task('Где легче?',testMass(weighs[1],false)),
 task('Сравни предметы',testMass(weighs[2]),speech('Объясни, что показали весы.','Камень тяжелее шара. На весах чаша с камнем опустилась.',balance(weighs[2]))),
 task('Легче и тяжелее',speech('Продолжи обе фразы. Бумага легче… Чашка тяжелее…',weighs[3][4],balance(weighs[3]))),
 task('Лаборатория весов',...weighs.flatMap((kit,i)=>[testMass(kit,i%2===0),speech('Расскажи о результате взвешивания.',kit[4],balance(kit))]))],
 ['Называть знакомые ощущения со слов героя и предлагать помощь.',[
  demo('Луми пришёл с прогулки.',step(cases[0].art,cases[0].line,'rest')),
  demo('Друг Луми собирается утеплиться.',step(cases[1].art,cases[1].line,'touch')),
  demo('Скоро начнётся выступление.',step(cases[2].art,cases[2].line,'rise')),
 ],
 task('Послушай Луми',listenStory(cases[0],cases)),
 task('После прогулки',choose('Луми хочет отдохнуть. Куда можно сесть?','Можно посидеть на стуле или отдохнуть на диване.',['chair','sofa','spoon'],['chair','sofa'],{context:cases[0].art})),
 task('Мне холодно',speech('Что можно сказать, когда хочется надеть шарф?','Мне холодно. Я надену шарф.',cases[1].art)),
 task('Перед выступлением',speech('Что может чувствовать герой перед выходом на сцену?','Герой может волноваться. Он может и радоваться выступлению.',cases[2].art)),
 task('Дом заботы',...cases.map((item,i)=>respond(item,'Предложи герою, чем ты можешь помочь.',['Давай немного отдохнём.','Хочешь надеть тёплый шарф?','Хочешь, я побуду рядом?'][i])))],
 ['Обсуждать возможные чувства персонажа на основе событий и реплик.',[
  demo('К Луми пришёл друг.',step(moods[0].art,moods[0].line,'wave')),
  demo('У игрушки сломалось колесо.',step(moods[1].art,moods[1].line,'hide')),
  demo('Игру прервали.',step(moods[2].art,moods[2].line,'close')),
 ],
 task('Реплика героя',speech('Послушай Луми: «Я рад, что зайчик пришёл». Как он себя чувствует?','Луми радуется встрече.',moods[0].art)),
 task('Покажи историю друга',listenStory(moods[1],moods)),
 task('Несколько возможных чувств',enough('Выбери картинку и расскажи, какие чувства может испытывать герой.','Я думаю, друг может грустить или сердиться из-за сломанной машинки.',moods.map(storyCard))),
 task('Поддержка друга',speech('Что можно сказать другу, у которого сломалась игрушка?','Мне жаль, что машинка сломалась. Хочешь, посмотрим на неё вместе?',moods[1].art)),
 task('Театр чувств',...moods.map((item,i)=>respond({...item,reply:'Спасибо, что выслушал меня.'},
  'Разыграй сценку и расскажи, что может чувствовать каждый герой.',['Я тоже рад тебя видеть!','Тебе может быть грустно. Давай посмотрим на колесо.','Понимаю. Может, мы сможем закончить игру потом?'][i])))],
 ['Описывать объекты и персонажей по нескольким признакам.',[
  demo('Опишем цветок.',step(['flower:rose','leaf:dark-green'],'У цветка розовые округлые лепестки и зелёные листья. Представим его приятный запах.','rise')),
  demo('Опишем игрушку.',step(['bear','cloth','pillow'],'Медвежонок маленький. Он сшит из ткани и мягкий на ощупь.','squeeze')),
  demo('Опишем персонажа в истории.',step(cases[0].art,'Это Луми. У него голубой шарфик. Он устал после прогулки.','rest')),
 ],
 task('Подбери признаки цветка',multi('Какие признаки видны у этого цветка?','У него розовые лепестки и тёмно-зелёный лист.',['shade-rose','shade-lilac','shade-dark-green','shade-blue'],['shade-rose','shade-dark-green'],2,{context:visual('flower:rose','leaf:dark-green')})),
 task('Признаки игрушки',multi('Вспомни медвежонка и выбери признаки.','Маленький медвежонок сшит из ткани.',['large','small','cloth','glass'],['small','cloth'],2,{context:visual('bear','cloth')})),
 task('Свойства после демонстрации',hints(visual('bear','pillow'),'Мягкого медвежонка можно обнимать. Он немного сжимается.')),
 task('План о персонаже',speech('Кто это? Как он выглядит? Что с ним случилось?','У Луми голубой шарфик. Он долго гулял и теперь устал.',cases[0].art)),
 task('Сад рассказчиков',hints('flower:rose','Это розовый цветок с широкими лепестками.'),hints('bear','Это небольшой мягкий медвежонок из ткани.'),hints(cases[1].art,'Герою стало холодно. Он надел тёплый шарф.'))],
]);
