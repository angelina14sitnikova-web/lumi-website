'use strict';
window.GardenContent = (()=> {
const card=(id,label,size='')=>({id,label,size});
const round=(id,question,answer,options,say)=>({id,question,answer,options,say});
const sounds=[card('bird','Птичка'),card('frog','Лягушка'),card('bee','Пчёлка')];
const actions=[card('rabbit-sleep','Зайчик спит'),card('squirrel-eat','Белочка ест орешек'),card('butterfly-fly','Бабочка летит'),card('frog-jump','Лягушка прыгает')];
const snails=[card('snail-under','Улитка под грибом'),card('snail-on','Улитка на камне'),card('snail-behind','Улитка за цветком'),card('snail-near','Улитка рядом с деревом')];
const moms=[card('duck','Утка'),card('cat','Кошка'),card('rabbit-mom','Крольчиха'),card('hen','Курица')];
const tasks=[
{title:'Чей голос?',lumi:'listen',intro:'Послушай внимательно. Кто издаёт этот звук?',rounds:[
round('voice-bird','Кто издаёт этот звук?','bird',sounds,'Правильно! Это птичка. Она поёт: чик-чирик! Давай повторим: чик-чирик!'),
round('voice-frog','Кто издаёт этот звук?','frog',sounds,'Это лягушка! Она квакает: ква-ква! Повтори: ква-ква!'),
round('voice-bee','Кто издаёт этот звук?','bee',sounds,'Правильно! Это пчёлка. Она жужжит. Давай пожужжим: ж-ж-ж!') ]},
{title:'Что делает герой?',lumi:'watch',intro:'Посмотри на героев. Найди того, о ком я спрошу.',rounds:[
round('action-sleep','Кто спит?','rabbit-sleep',actions,'Зайчик спит. Повтори: зайчик спит.'),
round('action-eat','Кто ест?','squirrel-eat',actions,'Белочка ест орешек. Повтори: белочка ест орешек.'),
round('action-fly','Кто летит?','butterfly-fly',actions,'Бабочка летит. Повтори: бабочка летит.'),
round('action-jump','Кто прыгает?','frog-jump',actions,'Лягушка прыгает. Повтори: лягушка прыгает.') ]},
{title:'Один и много',lumi:'flowers',intro:'Посмотри на картинки и послушай, что нужно найти.',rounds:[
...[
['flower','цветок','цветы','Покажи, где цветок.',false],
['butterfly','бабочка','бабочки','Покажи, где бабочки.',true],
['mushroom','гриб','грибы','Где гриб?',false],
['leaf','лист','листья','Где листья?',true],
['apple','яблоко','яблоки','Покажи яблоко.',false],
['beetle','жук','жуки','Где жуки?',true]
].map(([id,one,many,q,plural])=>round('number-'+id,q,id+(plural?'-many':'-one'),[card(id+'-one',one),card(id+'-many',many)],one[0].toUpperCase()+one.slice(1)+' — '+many+'. Повтори вместе со мной.')) ]},
{title:'Где спряталась улитка?',lumi:'search',intro:'Улитка любит прятаться. Помоги мне её найти.',rounds:[
...['Найди улитку под грибом.','Где улитка на камне?','Покажи улитку за цветком.','Найди улитку рядом с деревом.'].map((q,i)=>round('snail-'+i,q,snails[i].id,snails,snails[i].label+'! Повтори вместе со мной.')) ]},
{title:'Какой? Какая? Какое?',lumi:'apple',intro:'Послушай описание. Найди картинку по двум признакам.',rounds:[
round('describe-apple','Найди большое красное яблоко.','red-apple',[card('red-apple','Большое красное яблоко','large'),card('red-apple','Маленькое красное яблоко','small'),card('green-apple','Большое зелёное яблоко','large'),card('green-apple','Маленькое зелёное яблоко','small')],'Большое красное яблоко! Повтори вместе со мной.'),
round('describe-butterfly','Где маленькая жёлтая бабочка?','yellow-butterfly',[card('yellow-butterfly','Маленькая жёлтая бабочка','small'),card('yellow-butterfly','Большая жёлтая бабочка','large'),card('blue-butterfly','Маленькая голубая бабочка','small'),card('blue-butterfly','Большая голубая бабочка','large')],'Маленькая жёлтая бабочка! Повтори вместе со мной.'),
round('describe-rabbit','Покажи пушистого белого зайчика.','white-fluffy',[card('white-fluffy','Пушистый белый зайчик'),card('gray-fluffy','Пушистый серый зайчик'),card('white-smooth','Белый зайчик с гладкой шерстью'),card('gray-smooth','Серый зайчик с гладкой шерстью')],'Пушистый белый зайчик! Повтори вместе со мной.'),
round('describe-flower','Найди большой розовый цветок.','pink-flower',[card('pink-flower','Большой розовый цветок','large'),card('pink-flower','Маленький розовый цветок','small'),card('blue-flower','Большой голубой цветок','large'),card('blue-flower','Маленький голубой цветок','small')],'Большой розовый цветок! Повтори вместе со мной.') ]},
{title:'Мама и малыш',lumi:'babies',intro:'Чей это малыш? Помоги ему найти маму!',rounds:[
...[
['duckling','duck','Это утёнок. Его мама — утка. Утка и утёнок.'],
['kitten','cat','Это котёнок. Его мама — кошка. Кошка и котёнок.'],
['bunny','rabbit-mom','Это крольчонок. Его мама — крольчиха. Крольчиха и крольчонок.'],
['chick','hen','Это цыплёнок. Его мама — курица. Курица и цыплёнок.']
].map(([baby,mom,say],i)=>({...round('family-'+baby,'Чей это малыш? Помоги ему найти маму!',mom,moms.filter(m=>m.id!==moms[(i+2)%4].id),say),baby})) ]},
{title:'Расскажи историю',lumi:'story',intro:'Давай узнаем, как вырос волшебный цветочек. Что было сначала?',rounds:[
...['Давай узнаем, как вырос волшебный цветочек. Что было сначала?','Что медвежонок сделал потом?','А что произошло в конце?'].map((q,i)=>round('story-'+i,q,'story-'+(i+1),[card('story-1','Медвежонок сажает семечко'),card('story-2','Медвежонок поливает землю'),card('story-3','Вырос красивый цветок')],['Медвежонок посадил семечко.','Потом он полил землю.','И вырос красивый цветок!'][i])) ]}
];
// The two traits are both part of the answer, not just the asset name.
tasks[4].rounds[0].answerSize='large'; tasks[4].rounds[1].answerSize='small';tasks[4].rounds[3].answerSize='large';
const common={intro:'Привет! Волшебный сад потерял свой голос. Помоги мне вернуть его! Нас ждут семь удивительных заданий!',wrong:'Попробуй ещё раз. Послушай внимательно.',success:'Правильно! Ещё одна часть сада ожила. Ты получил золотую звёздочку!',story:'Медвежонок посадил семечко. Потом он полил землю. И вырос красивый цветок! А теперь попробуй рассказать эту историю сам.',final:'Ура! Мы вернули саду его волшебный голос! Теперь птицы снова поют, пчёлки жужжат, а лягушки квакают. Спасибо за помощь!',audioError:'Звук не загрузился. Нажми «Послушать» ещё раз.'};
const matches=(r,c)=>c.id===r.answer&&(!r.answerSize||r.answerSize===c.size);
return {tasks,common,matches};
})();
