import {lessonSet,demo,step,visual,talk,choose,task,token,say} from './builders.js';

const oral=(prompt,model,...art)=>talk(prompt,model,art);
const marked=(art,line,voice)=>({...step(art,line),voice});
const spoken=(prompt,line,art,button,reply,result)=>say(prompt,line,[token('scene',art)],'dialogue',
 {modeButton:button,partner:reply,result});
const sample=(text,gain=1)=>({text,gain});
const listen=(prompt,model,cards,answer,samples)=>choose(prompt,model,cards,answer,{
 samples,requiresAdult:true,adultPrompt:'Прочитайте образцы по порядку. Предложите ребёнку выбрать картинку.',
});
const loudnessLine='Луми, подойди ко мне.';
const paceLine='Луми несёт книгу в театр.';
const slowSample=sample(paceLine+'|slow');
const question='Ты пришёл?';
const exclamation='Ты пришёл!';
const statement='Ты пришёл.';
const soundCards=['quiet','normal','louder'];
const paceCards=[
 token('first','theatre-one',{label:'Первый образец'}),
 token('second','theatre-two',{label:'Второй образец'}),
];
const theatreScenes=[
 ['book','Тихий голос подошёл для читального зала.','quiet','Луми читает в библиотеке.'],
 ['lumi','Обычным голосом удобно говорить с другом рядом.','normal','Зайчик стоит рядом с Луми.'],
 ['park','На площадке можно позвать друга чуть громче, спокойным голосом.','louder','Друг Луми на другом конце площадки.'],
];
const messages=[
 ['palace-cup:red','Красная чашка.','На столе красная чашка.'],
 ['ball','Синий шар.','У Луми синий шар.'],
 ['lumi','Луми.','Луми идёт на сцену.'],
];
const acting=[
 ['bunny','Привет, зайчик!','Привет, Луми!'],
 ['lumi','Ты принёс книгу?','Да, она здесь.'],
 ['book','Какой красивый рисунок!','Хочешь посмотреть поближе?'],
 ['flower','Мне нравится этот цветок.','Давай поставим его у окна.'],
 ['park','Увидимся на площадке!','До встречи!'],
];
const perform=(prompt,[art,line,reply])=>spoken(prompt,line,visual('lumi',art),'Сыграть реплику',reply,art);

export const theatre=lessonSet(7,[
 ['Произносить знакомые слова и короткие фразы отчётливо в удобном ритме.',[
  demo('Сначала произнесём знакомые слова.',step(['ball'],'Мяч.'),step(['book'],'Книга.'),step(['palace-cup:red'],'Чашка.')),
  demo('Короткие фразы помогают слушателю.',step(['lumi','table','book'],'Луми взял книгу. Потом Луми сел за стол.')),
  demo('Повторим спокойно.',step(['lumi','book'],'Книга Луми. Вот книга Луми.')),
 ],
 task('Три знакомых слова',oral('Повтори слова в удобном темпе.','Мяч. Книга. Чашка.',visual('ball','book','palace-cup:red'))),
 task('Фраза по картинке',oral('Посмотри на картинку и повтори фразу.','На столе красная чашка.',visual('table','palace-cup:red'))),
 task('Назови то, что видишь',oral('Назови каждый предмет. Сделай маленькую паузу между словами.',
  'Книга. Шар. Чашка.',visual('book','ball','palace-cup:red'))),
 task('Передай сообщение',perform('Скажи зайчику так, чтобы он услышал каждое слово.',['bunny','Зайчик, книга на столе.','Я услышал. Книга на столе.'])),
 task('Репетиция спектакля',...messages.map(([art,line,full])=>spoken(
  'Назови картинку, а затем отчётливо произнеси короткую фразу.',line+' '+full,visual('lumi',art),'Показать репетицию','Слова прозвучали отчётливо.',art)))],
 ['Отличать тихий, обычный и более громкий голос и выбирать звучание по ситуации.',[
  demo('В читальном зале говорим тихо.',marked(['book','lumi'],loudnessLine,sample(loudnessLine,.28))),
  demo('С другом рядом говорим обычным голосом.',marked(['lumi','bunny'],loudnessLine,sample(loudnessLine,.64))),
  demo('На площадке можно позвать чуть громче.',marked(['park','lumi','bunny'],loudnessLine,sample(loudnessLine,1.05))),
 ],
 task('Послушай три громкости',listen('Послушай одну фразу три раза. Какой голос был первым?','Первый голос был тихим.',
  soundCards,'quiet',[sample(loudnessLine,.28),sample(loudnessLine,.64),sample(loudnessLine,1.05)])),
 task('В читальном зале',choose('Как лучше обратиться к другу в читальном зале?','Здесь уместен тихий голос.',
  soundCards,'quiet',{context:visual('book','lumi')})),
 task('Друг рядом',oral('Скажи другу фразу обычным голосом.','Давай сядем рядом.',visual('lumi','bunny'))),
 task('Друг на площадке',oral('Позови друга с другого края площадки. Говори чуть громче, без напряжения.','Зайчик, иди к нам!',visual('park','bunny'))),
 task('Театр громкости',...theatreScenes.flatMap(([art,model,level,prompt])=>[
  choose(prompt+' Какая громкость подойдёт?',model,soundCards,level,{context:visual(art)}),
  oral('Попробуй позвать Луми подходящим голосом.',loudnessLine,art),
 ]))],
 ['Различать обычный и немного более медленный темп, пользоваться смысловыми паузами.',[
  demo('Послушаем фразу в обычном темпе.',step(['lumi','book','stage'],paceLine)),
  demo('Для уточнения можно сказать чуть медленнее.',marked(['lumi','book','stage'],paceLine,slowSample)),
  demo('Сделаем естественную паузу между мыслями.',step(['lumi','book'],'Луми несёт книгу.'),step(['stage'],'Скоро начнётся спектакль.')),
 ],
 task('Два темпа',say('Послушай два варианта одной фразы.','Смысл фразы сохраняется, хотя темп меняется.',
  ['lumi','book','stage'],'listen',{samples:[sample(paceLine),slowSample],adultPrompt:'Произнесите фразу обычно, затем немного медленнее.'})),
 task('Где медленнее?',listen('В каком образце Луми произносит фразу медленнее?','Второй образец звучит немного медленнее.',
  paceCards,'second',[sample(paceLine),slowSample])),
 task('Удобный темп',oral('Повтори фразу в удобном для тебя темпе.',paceLine,visual('lumi','book','stage'))),
 task('Две мысли с паузой',oral('Передай сообщение. Сделай короткую паузу между двумя мыслями.',
  'Луми несёт книгу. Скоро начнётся спектакль.',visual('lumi','book','stage'))),
 task('Сказочный диктор',...messages.map(([art,short,long])=>oral(
  'Посмотри на картинку. Назови предмет или героя, сделай паузу и добавь предложение.',short+' '+long,art)))],
 ['Произносить сочетания слов и постепенно расширять фразу без спешки.',[
  demo('Попробуем два словосочетания.',step(['balloon:blue'],'Синий шар.'),step(['winter'],'Белый снег.')),
  demo('Добавим слова для короткого сообщения.',step(['table','glass-cup'],'На столе стакан.'),step(['cat','chair'],'Кот спит на стуле.')),
  demo('Будем понемногу удлинять фразу.',step(['cat'],'Кот спит.'),step(['cat','chair'],'Кот спит на стуле.'),step(['cat','chair','pillow'],'Кот спит на мягком стуле.')),
 ],
 task('Два сочетания',oral('Повтори два словосочетания. Между ними можно сделать паузу.','Синий шар. Белый снег.',visual('balloon:blue','winter'))),
 task('Послушай и выбери картинку',listen('Выбери картинку к услышанной фразе.','На столе стакан.',[
  token('chair',visual('cat','chair'),{label:'Кот на стуле'}),
  token('table',visual('table','glass-cup'),{label:'Стакан на столе'}),
 ],'table',[sample('На столе стакан.')])),
 task('Короткое предложение',oral('Повтори короткое предложение.','Кот спит на стуле.',visual('cat','chair'))),
 task('Добавь слово',oral('Можно добавить слово «мягком». Как теперь звучит фраза?','Кот спит на мягком стуле.',visual('cat','chair'))),
 task('Актёрская мастерская',...messages.map(([art,short,long])=>oral(
  'Произнеси короткую реплику или удлини её, если тебе удобно.',short+' '+long,art)))],
 ['Различать вопрос, сообщение и восклицание по звучанию и ситуации.',[
  demo('Герой спрашивает.',step(['lumi','question','bunny'],question)),
  demo('Герой радостно встречает друга.',step(['lumi','happy','bunny'],exclamation)),
  demo('Сравним три реплики.',step(['question'],question),step(['lumi'],statement),step(['happy'],exclamation)),
 ],
 task('Когда спрашивают?',choose('Луми хочет узнать, пришёл ли друг. Выбери ситуацию с вопросом.','Ты пришёл?',
  [token('greet',visual('lumi','happy','bunny'),{label:'Друг уже здесь'}),token('ask',visual('lumi','question'),{label:'Луми спрашивает'})],'ask')),
 task('Послушай восклицание',say('Послушай радостную реплику.',exclamation,['lumi','bunny'],'listen',{samples:[sample(exclamation)]})),
 task('Спроси друга',oral('Спроси зайчика, пришёл ли он.',question,visual('lumi','question','bunny'))),
 task('Обрадуйся встрече',oral('Произнеси фразу так, будто ты рад встрече.',exclamation,visual('lumi','happy','bunny'))),
 task('Театр интонаций',...[['question',question,'Нужно спросить.'],['lumi',statement,'Нужно спокойно сообщить.'],['happy',exclamation,'Хочется обрадоваться.']].map(([id,line,prompt])=>
  listen('Послушай реплику. Подбери ситуацию.',prompt,[token('question','question',{label:'Вопрос'}),
   token('lumi','lumi',{label:'Сообщение'}),token('happy','happy',{label:'Восклицание'})],id,[sample(line)])))],
 ['Выразительно произносить короткие реплики и поддерживать сценический диалог.',[
  demo('Актёры начинают с приветствия и вопроса.',step(['lumi','bunny'],acting[0][1],'wave'),step(['lumi','book'],acting[1][1])),
  demo('Реплика может передавать удивление или спокойную радость.',step(['book'],acting[2][1]),step(['flower'],acting[3][1])),
  demo('Разыграем короткую сцену.',step(['lumi','bunny'],acting[0][1]),step(['bunny','lumi'],acting[0][2])),
 ],
 task('Поприветствуй друга',oral('Поприветствуй зайчика приветливым голосом.',acting[0][1],visual('lumi','bunny'))),
 task('Задай вопрос',oral('Спроси у героя о книге. Сделай так, чтобы он услышал вопрос.',acting[1][1],visual('lumi','book'))),
 task('Покажи удивление',oral('Удивись, когда увидишь рисунок.',acting[2][1],visual('book','palace-draw'))),
 task('Диалог на сцене',perform('Скажи первую реплику, а затем послушай героя.',acting[3])),
 task('Королевская премьера',...acting.map(item=>perform('Сыграй реплику. Подумай, как её произнести в этой сцене.',item)))],
]);
