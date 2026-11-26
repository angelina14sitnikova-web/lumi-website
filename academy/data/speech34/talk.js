import {lessons,scene,task,frame,panel,token,say,choose} from './builders.js';

const room=(left='lumi',right='bunny',prop=null,move='wave')=>panel(
 [left,0,20,.63,move],[right,87,27,.50,'rise'],...(prop?[[prop,64,90,.36,'rise']]:[]));
const meeting=room(),leaving=room('lumi','bunny',null,'walk');
const help=panel(['lumi',1,29,.65],['box',92,65,.47],['adult',112,12,.39]);
const shelf=panel(['shelf',53,6,.79],['car',91,35,.32],['lumi',-6,71,.52]);
const floor=panel(['lumi',1,22,.65],['bunny',58,40,.61],['ball',79,105,.36]);
const search=panel(['lumi',4,31,.72],['ball',109,74,.37],['table',56,43,.65]);
const cup=room('lumi','bunny','cup'),toy=room('lumi','bunny','ball');
const scenes={
 hello:['Привет!','Привет, Луми!',meeting],
 greetAdult:['Здравствуйте!','Здравствуй, Луми!',room('lumi','adult')],
 goodbye:['Пока! До свидания!','До скорой встречи!',leaving],
 polite:['Дай, пожалуйста, мяч.','Конечно, вот мяч.',toy],
 thanks:['Спасибо, что помог!','Пожалуйста!',room('lumi','bunny','flower')],
 sorry:['Извини, пожалуйста.','Всё хорошо.',floor],
 box:['Помоги открыть коробку, пожалуйста.','Давай откроем вместе.',help],
 reach:['Помогите достать машинку, пожалуйста.','Сейчас достану машинку.',shelf],
 explain:['Объясни, пожалуйста, как начать игру.','Сначала поставь кубик сюда.',room('lumi','adult','block')],
 what:['Что это?','Это чашка.',cup],
 who:['Кто это?','Это зайчик.',meeting],
 where:['Где мяч?','Мяч под столом.',search],
 located:['Машинка на полке.','Теперь я знаю, где она.',shelf],
 answer:['Это мяч.','Да, это мяч.',toy],
 animal:['Кошка спит.','Да, она отдыхает.',panel(['lumi',0,21,.55],['sofa',67,71,.55],['cat',93,45,.40,'sleep'])],
 meet:['Как тебя зовут?','Я Зайчик. Можно просто помахать мне.',meeting],
 invite:['Давай поиграем вместе!','Давай покатаем мяч друг другу.',toy],
 discuss:['А что умеет твоя машинка?','Она быстро едет.',room('lumi','bunny','car')],
};
const art=id=>scenes[id][2];
const spoken=id=>scenes[id][0];
const show=(id,text)=>scene(text,spoken(id)+' '+scenes[id][1],frame('lumi','wave'),frame(art(id),'rise',{reset:true,says:spoken(id)}),
 frame(art(id),'turn',{reset:true,says:scenes[id][1]}));
const talkRound=(id,instruction,extra={})=>say(instruction,spoken(id),[token(id,art(id))],'dialogue',{
 modeButton:'Показать ответ героя',partner:scenes[id][1],result:frame(art(id),id==='goodbye'?'walk':'wave'),...extra,
});
const understand=(id,ids,instruction)=>choose(instruction,spoken(id),ids.map(x=>token(x,art(x))),id);
const askObject=say('Выбери, о чём спросить друга.','Что это?',['cup','car','doll'],'dialogue',{
 chooseVisual:true,modeButton:'Показать ответ героя',animateSelection:true,
 replies:{cup:'Это чашка.',car:'Это машинка.',doll:'Это кукла.'},models:{cup:'Что это?',car:'Что это?',doll:'Что это?'},
});
export const talk=lessons(7,[
 ['Приветствовать и прощаться в подходящих ситуациях.',[show('hello','Луми встречает зайчика.'),show('greetAdult','Луми здоровается со взрослым.'),show('goodbye','Встреча заканчивается.')],
 task('Встреча',understand('hello',['goodbye','hello','box'],'Покажи, где друзья только встретились.')),
 task('Поздоровайся',talkRound('greetAdult','Поздоровайся с появившимся персонажем.')),
 task('Прощание',understand('goodbye',['hello','thanks','goodbye'],'Покажи, где пора прощаться.')),
 task('Два друга',talkRound('hello','Разыграй встречу двух друзей.')),
 task('Прогулка по городу',talkRound('hello','Поздоровайся с другом.'),talkRound('greetAdult','Поздоровайся со взрослым.'),talkRound('goodbye','Попрощайся.')),
 ],
 ['Использовать вежливые слова в разных обстоятельствах.',[show('polite','Мы просим игрушку.'),show('thanks','Друг помог.'),show('sorry','Друзья нечаянно столкнулись.')],
 task('Когда благодарят?',understand('thanks',['thanks','box','goodbye'],'В какой сценке друг уже помог?')),
 task('Попроси игрушку',talkRound('polite','Попроси игрушку вежливо.')),
 task('Поблагодари',talkRound('thanks','Поблагодари за помощь.')),
 task('Извинись',talkRound('sorry','Извинись после случайной ошибки.')),
 task('Праздник добрых слов',...['hello','polite','thanks','sorry','goodbye'].map(id=>talkRound(id,'Скажи герою подходящую реплику.'))),
 ],
 ['Просить о помощи в бытовой ситуации.',[show('box','Луми сам не может открыть коробку.'),show('reach','Игрушка стоит высоко.'),show('explain','Луми не понял, как начать игру.')],
 task('Кому нужна помощь?',understand('box',['animal','box','hello'],'Покажи, кто не справляется с коробкой.')),
 task('Откройте коробку',talkRound('box','Попроси помочь открыть коробку.')),
 task('Помощь взрослого',talkRound('reach','Попроси взрослого достать игрушку.')),
 task('Попроси объяснить',talkRound('explain','Попроси объяснить непонятное.')),
 task('Город помощников',...['box','reach','explain'].map(id=>talkRound(id,'Попроси о помощи своими словами.'))),
 ],
 ['Задавать вопросы о предмете, герое и месте.',[show('what','Луми увидел новый предмет.'),show('who','Луми встретил героя.'),show('where','Луми ищет мяч.')],
 task('Вопрос о предмете',askObject),
 task('Вопрос о персонаже',talkRound('who','Спроси, кто перед тобой.')),
 task('Где игрушка?',talkRound('where','Спроси, где мяч.')),
 task('Подбери вопрос',understand('where',['what','who','where'],'Покажи картинку для вопроса «Где мяч?».')),
 task('Бюро маленьких вопросов',askObject,talkRound('who','Задай вопрос о герое.'),talkRound('where','Задай вопрос о месте.')),
 ],
 ['Отвечать по смыслу и расширять ответ с помощью взрослого.',[show('answer','Что это?'),show('animal','Что делает кошка?'),show('located','Где машинка?')],
 task('Как называется предмет?',talkRound('answer','Ответь на вопрос: «Что это?».')),
 task('Что делает герой?',talkRound('animal','Ответь, что делает кошка.')),
 task('Где машинка?',talkRound('located','Скажи, где находится машинка.')),
 task('Ответ подлиннее',talkRound('answer','Можно назвать предмет одним словом. Попробуйте вместе сказать фразу.',
  {adultPrompt:'Если ребёнок сказал «мяч», примите ответ. Спокойно предложите образец «Это мяч».'})),
 task('Интервью с Луми',...['answer','animal','located','what','discuss'].map(id=>talkRound(id,'Ответь на вопрос взрослого.'))),
 ],
 ['Вести короткий разговор с другом.',[show('meet','Луми знакомится с другом.'),show('invite','Друзья хотят поиграть.'),show('discuss','Луми спрашивает про игрушку.')],
 task('Приветствие',talkRound('hello','Поздоровайся с персонажем.')),
 task('Знакомство',talkRound('meet','Если хочешь, представься голосом или помаши.',
  {adultPrompt:'Ребёнок может назвать себя устно, придумать имя герою или просто помахать. Ничего вводить не нужно.'})),
 task('Давай играть',talkRound('invite','Предложи герою игру.')),
 task('Чья игрушка?',talkRound('discuss','Спроси друга про машинку.')),
 task('Встреча друзей',...['hello','meet','invite','discuss','goodbye'].map(id=>talkRound(id,'Скажи подходящую реплику.'))),
 ],
]);
