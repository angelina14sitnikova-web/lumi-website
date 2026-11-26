import {lessons,adultScene,task,frame,panel,token,say,choose} from './builders.js';
import {moment} from './actions.js';
const words=['Это мой мяч.','Луми идёт гулять.','Птичка летит.','Девочка рисует цветок.',
 'Машинка на полке.','Кошка спит. Мяч лежит рядом.'];
const stage={
 ball:panel(['lumi',0,12,.83],['ball',103,71,.47]),
 walk:panel(['lumi',5,12,.82,'walk'],['house',100,47,.39]),
 sleep:panel(['bed',66,72,.61],['cat',91,45,.43,'sleep'],['lumi',0,28,.64]),
 normal:panel(['lumi',0,20,.70,'wave'],['bunny',92,25,.52]),
 far:panel(['lumi',2,24,.70,'wave'],['bunny',126,3,.34]),
 joy:panel(['lumi',0,13,.81,'jump'],['chest:brown:big:open',102,63,.38,'open'],['happy',117,12,.28]),
 sad:panel(['lumi',0,21,.81],['ball',109,95,.38,'hide'],['sad',115,21,.34]),
 ask:panel(['lumi',0,14,.79],['ball',102,66,.46],['question',117,3,.30]),
 answer:panel(['bunny',16,14,.79,'wave'],['ball',104,70,.44]),
 shelf:panel(['shelf',7,12,.90],['car',49,60,.43,'rise']),
};
const guides={
 normal:'Произнесите фразу естественно. Можно повторить целиком или сказать вместе с вами.',
 tempo:'Скажите фразу в спокойном темпе. Сделайте обычную паузу между двумя фразами. Дайте ребёнку время ответить.',
 quiet:'Покажите тихий комфортный голос. Избегайте длительного шёпота и крика.',
 loud:'Позовите друга чуть заметнее, сохраняя комфортную громкость. Ребёнок может ответить обычным голосом.',
 feeling:'Произнесите реплику с заданным настроением. Ребёнок может показать сценку жестом и потом услышать речевой образец ещё раз.',
 question:'Произнесите сначала вопрос, затем ответ. Передайте разницу голосом.',
 echo:'Сначала произнесите фразу целиком. При затруднении дайте короткий вариант из двух смысловых слов.',
};
const show=(instruction,line,items,guide=guides.normal)=>{
 const s=adultScene(instruction,line,items.map((art,i)=>frame(art,'rise',{reset:i>0})),line);
 return {...s,adultPrompt:guide};
};
const speak=(instruction,line,art,guide=guides.normal,extra={})=>say(instruction,line,[token('scene',art)],extra.responseMode??'echo',
 {requiresAdult:true,adultPrompt:guide,transcript:line,...extra});
const drama=(instruction,line,art,partner,guide=guides.normal)=>speak(instruction,line,art,guide,
 {responseMode:'dialogue',modeButton:'Оживить сценку',partner,result:frame(art,'turn')});
const setVoice=(which,art)=>choose('После примера взрослого выбери подходящую громкость.',
 {quiet:'Скажем тихо: «Кошка спит».',normal:'Скажем обычным голосом: «Привет!».',louder:'Позовём друга: «Зайчик, подойди!».'
 }[which],['quiet','normal','louder'],which,{context:art,requiresAdult:true,adultPrompt:which==='louder'?guides.loud:guides.quiet});
const mood=(kind,art,line)=>speak('Произнеси реплику с подходящим настроением.',line,art,guides.feeling,
 {responseMode:'act',modeButton:'Разыграть реплику',result:frame(art,kind==='joy'?'jump':'turn')});
const question=(line,art=stage.ask)=>speak('Повтори вопрос вместе со взрослым.',line,art,guides.question);
const answer=(line,art=stage.answer)=>speak('Скажи ответ.',line,art,guides.question);
const allVoices=[
 drama('Поздоровайся.','Привет, зайчик!',stage.normal,'Привет, Луми!'),
 drama('Задай вопрос.','Это твой мяч?',stage.ask,'Да, это мой мяч.',guides.question),
 drama('Ответь на вопрос.','Да, это мой мяч.',stage.answer,'Давай поиграем вместе.',guides.question),
 drama('Вырази радость.','Как я рад!',stage.joy,'И я рад, что мы вместе!',guides.feeling),
];
export const theatre=lessons(8,[
 ['Говорить в удобном темпе и делать естественные паузы.',[
  show('Взрослый говорит спокойно.',words[0],[stage.ball],guides.tempo),
  show('Между фразами есть пауза.','Это мой мяч. Луми идёт гулять.',[stage.ball,stage.walk],guides.tempo),
  show('Повторим короткую фразу вместе.',words[1],[stage.walk],guides.tempo),
 ],
 task('Это мой мяч',speak('Повтори короткую фразу.',words[0],stage.ball,guides.tempo)),
 task('Луми идёт гулять',speak('Скажи в своём темпе.',words[1],stage.walk,guides.tempo)),
 task('Три предмета',speak('Назови три вещи в удобном темпе.','Мяч. Кукла. Машинка.',
  panel(['ball',0,56,.40],['doll',51,44,.40],['car',107,60,.42]),guides.tempo)),
 task('Две фразы с паузой',speak('Повтори две фразы. Между ними можно сделать паузу.',words[0]+' '+words[1],stage.walk,guides.tempo)),
 task('Спокойный рассказчик',speak('Расскажи о картинке.','У Луми есть мяч. Луми идёт гулять.',stage.walk,guides.tempo,{responseMode:'retell'})),
 ],
 ['Подбирать уместную комфортную громкость.',[
  show('В комнате кто-то спит.','Кошка спит.',[stage.sleep],guides.quiet),
  show('Друг стоит рядом.','Привет, зайчик!',[stage.normal]),
  show('Друг немного подальше.','Зайчик, подойди!',[stage.far],guides.loud),
 ],
 task('Рядом спят',setVoice('quiet',stage.sleep)),
 task('Обычным голосом',speak('Поздоровайся обычным голосом.','Привет, зайчик!',stage.normal)),
 task('Друг подальше',speak('Позови друга, который стоит дальше.','Зайчик, подойди!',stage.far,guides.loud)),
 task('Два голоса',speak('Скажи фразу тихо, затем обычным голосом.','Вот мой мяч.',stage.ball,guides.quiet)),
 task('Театр голосов',setVoice('quiet',stage.sleep),setVoice('normal',stage.normal),setVoice('louder',stage.far)),
 ],
 ['Вслушиваться в радостную и грустную интонацию.',[
  show('Луми рад подарку.','Как я рад!',[stage.joy],guides.feeling),
  show('Луми огорчился.','Мой мяч потерялся.',[stage.sad],guides.feeling),
  show('Одну фразу можно произнести по-разному.','Вот мой мяч.',[stage.joy,stage.sad],guides.feeling),
 ],
 task('Как прозвучало?',choose('Взрослый произнесёт реплику. Найди подходящую сцену.','Как я рад!',
  [token('sad',stage.sad),token('joy',stage.joy)],'joy',{requiresAdult:true,transcript:'Как я рад!',adultPrompt:'Произнесите «Как я рад!» радостно. Затем дайте выбрать картинку.'})),
 task('Радостная фраза',mood('joy',stage.joy,'Как я рад!')),task('Грустная фраза',mood('sad',stage.sad,'Мой мяч потерялся.')),
 task('Голос для ситуации',mood('joy',stage.joy,'Спасибо за подарок!')),
 task('Театр настроений',mood('joy',stage.joy,'Как хорошо!'),mood('sad',stage.sad,'Мне грустно.'),mood('joy',stage.normal,'Мы снова вместе!')),
 ],
 ['Слышать и пробовать интонацию вопроса и ответа.',[
  show('Луми спрашивает.','Это мяч?',[stage.ask],guides.question),
  show('Друг отвечает.','Это мяч.',[stage.answer],guides.question),
  show('Послушай вопрос и ответ.','Где игрушка? Машинка на полке.',[stage.ask,stage.shelf],guides.question),
 ],
 task('Послушай вопрос',speak('Взрослый спросит. Ответь как можешь.','Это мяч.',stage.ball,guides.question,{transcript:'Это мяч?'})),
 task('Повтори вопрос',question('Это мяч?')),task('Произнеси ответ',answer('Это мяч.')),
 task('Два героя',drama('Спроси друга, где машинка.','Где машинка?',stage.shelf,'Машинка на полке.',guides.question)),
 task('Театральный диалог',drama('Спроси о мяче.','Это мяч?',stage.ask,'Да, это мяч.',guides.question),
  drama('Спроси о машинке.','Где машинка?',stage.shelf,'Машинка на полке.',guides.question),
  drama('Спроси о друге.','Кто это?',stage.normal,'Это зайчик.',guides.question)),
 ],
 ['Повторять короткие фразы с помощью взрослого.',[
  show('Начнём с короткой фразы.','Кошка спит.',[moment('sleep')],guides.echo),
  show('Добавим предмет.','Мальчик катит мяч.',[moment('roll')],guides.echo),
  show('Добавим место.','Кошка спит на диване.',[moment('sleep')],guides.echo),
 ],
 task('Птичка летит',speak('Послушай и повтори.',words[2],moment('fly'),guides.echo)),
 task('Девочка рисует цветок',speak('Послушай и повтори.',words[3],moment('draw'),guides.echo)),
 task('Где игрушка?',speak('Повтори короткую фразу о месте.',words[4],stage.shelf,guides.echo)),
 task('Две связанные фразы',speak('Повтори фразы вместе со взрослым.',words[5],stage.sleep,guides.echo)),
 task('Театральная репетиция',say('Выбери сцену. Взрослый произнесёт реплику для выбранного героя.','Птичка летит.',
  [token('flight',moment('fly')),token('painting',moment('draw')),token('sleep',moment('sleep'))],'echo',
  {requiresAdult:true,chooseVisual:true,animateSelection:true,modeButton:'Показать сцену',adultPrompt:guides.echo,
   models:{flight:words[2],painting:words[3],sleep:'Кошка спит.'}})),
 ],
 ['Разыгрывать сценки с подходящей интонацией.',[
  show('Вспомним спокойный голос.','Это мой мяч.',[stage.ball],guides.tempo),
  show('Вопрос, ответ и радость.','Это мяч? Да, это мяч. Как здорово!',[stage.ask,stage.answer,stage.joy],guides.question),
  show('Сыграем встречу.','Привет! Это твой мяч? Да. Давай играть!',[stage.normal,stage.ask,stage.joy],guides.feeling),
 ],
 task('Приветствие',allVoices[0]),task('Вопрос',allVoices[1]),task('Ответ',allVoices[2]),task('Радостная реплика',allVoices[3]),
 task('Первый спектакль Луми',...allVoices),
 ],
]);
