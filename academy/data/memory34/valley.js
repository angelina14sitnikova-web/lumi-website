const task=(title,...rounds)=>({title,kind:'memory34',rounds});
const demo=(text,example)=>({text,example});
const base=(audioMode,clips,options,answer,prompt,extra={})=>({kind:'audio',audioMode,clips,options,answer,prompt,...extra});
const sound=(id,gain)=>({sound:id,gain});
const speech=text=>({voice:text});
const buttons=['crystal-a','crystal-b','crystal-c'];
const acoustic=(ids,options=ids)=>Object.fromEntries(ids.map((id,i)=>[options[i],id]));
const match=(id,choices,prompt='Послушай образец. Найди такой же звук.')=>base('cards',[id],buttons.slice(0,choices.length),
  buttons[choices.indexOf(id)],prompt,{demos:acoustic(choices,buttons)});
const findSound=(id,options,prompt='Послушай и найди, что звучало.')=>base('objects',[id],options,id,prompt);
const yesNo=(clips,heard)=>base('yes-no',clips,['yes','no'],heard?'yes':'no','Послушай. Было ли слышно кошку?');
const count=(id,n)=>base('count',Array(n).fill(id),['one','two'],n===1?'one':'two','Сколько звуков ты услышал?');
const beats=(id,n)=>base('lantern',Array(n).fill(id),['one','two'],n===1?'one':'two','Зажги столько огоньков, сколько звуков услышишь.');
const volume=(id,levels,answer,prompt)=>base('volume',levels.map(gain=>sound(id,gain)),buttons.slice(0,2),buttons[answer],prompt,{
  demos:{'crystal-a':sound(id,levels[0]),'crystal-b':sound(id,levels[1])},
});
const equal=(id,level)=>base('cards',[sound(id,level)],buttons.slice(0,2),level>.5?'crystal-a':'crystal-b','Найди звук такой же громкости.',{
  demos:{'crystal-a':sound(id,.76),'crystal-b':sound(id,.32)},
});
const repeat=(clips,options,answer,prompt='Послушай и повтори звуки в том же порядке.',levels)=>base('repeat',clips,options,answer,prompt,{demos:levels??acoustic(options)});
const command=(voice,options,answer)=>base('command',[speech(voice)],options,answer,'Послушай Луми и выполни просьбу.');
const word=(voice,options,answer=options[0])=>base('word',[speech(voice)],options,answer,'Послушай слово. Найди этот предмет.');
const sequenceRecognize=(ids,answer)=>base('volume',ids,buttons.slice(0,ids.length),buttons[answer],'Послушай всю дорожку. Где был звон?',{demos:acoustic(ids,buttons)});
const objects=['bell','drum','rattle'];
const bedroom=['crystal-a','crystal-b'];
const levels=id=>({'crystal-a':sound(id,.32),'crystal-b':sound(id,.76)});
const optionsForWords=['ball','doll','bear','car','apple','cup','bell','duck'];
const levelsRound=(id,list)=>repeat(list.map(item=>levels(id)[item]),bedroom,list,'Повтори тихие звуки и звуки чуть громче.',levels(id));

const lessons=[
 [
   [
    demo('Послушай, как звенит колокольчик.',findSound('bell',['bell'])),
    demo('Колокольчик звенит, барабан стучит. Послушай оба.',base('volume',['bell','drum'],buttons.slice(0,2),buttons[0],'Послушай оба звука.',{demos:acoustic(['bell','drum'],buttons)})),
    demo('В дорожке разные звуки. Узнаешь звон колокольчика?',sequenceRecognize(['rattle','bell','drum'],1)),
   ],
   task('Звон в кристалле',match('bell',['drum','bell'])),
   task('Барабан',match('drum',['bell','drum','rattle'])),
   task('Было мяуканье?',yesNo(['rattle','cat'],true),yesNo(['dog','bell'],false)),
   task('Колокольчик в дорожке',sequenceRecognize(['dog','drum','bell'],2)),
   task('Хрустальные кристаллы',match('rattle',['drum','rattle','bell']),match('cat',['cat','dog','duck']),match('duck',['bird','cat','duck']),match('bell',['bell','drum','rattle']),match('dog',['duck','dog','cat'])),
 ],
 [
   [
    demo('Это один колокольчик. Первый звон тихий, второй чуть громче.',volume('bell',[.32,.76],0,'Послушай два звона.')),
    demo('Барабан может звучать тише или чуть громче.',volume('drum',[.76,.32],0,'Послушай два удара.')),
    demo('Один и тот же звук можно сделать тише или громче.',volume('rattle',[.32,.76],1,'Послушай погремушку.')),
   ],
   task('Тихий звон',volume('bell',[.76,.32],1,'Найди более тихий звон.')),
   task('Удар барабана',volume('drum',[.76,.32],0,'Выбери удар чуть громче.')),
   task('Одинаковая громкость',equal('rattle',.32),equal('bell',.76)),
   task('Не разбуди Луми',volume('bell',[.32,.76],0,'Найди тихий звук для спящего Луми.')),
   task('Музыкальный мост',levelsRound('bell',['crystal-a','crystal-b']),levelsRound('drum',['crystal-b','crystal-a']),levelsRound('rattle',['crystal-a','crystal-a','crystal-b'])),
 ],
 [
   [
    demo('Слышишь? Это один удар барабана.',count('drum',1)),
    demo('Теперь два удара. Между ними пауза.',count('drum',2)),
    demo('Один звон — один огонёк. Два звона — два огонька.',beats('bell',2)),
   ],
   task('Один звон',count('bell',1)),
   task('Два удара',count('drum',2)),
   task('Погремушка',count('rattle',1),count('rattle',2)),
   task('Зажги огоньки',beats('bell',2),beats('drum',1)),
   task('Звуковые фонарики',beats('rattle',1),beats('drum',2),beats('bell',1),beats('bell',2),beats('rattle',2)),
 ],
 [
   [
    demo('Слушаю барабан и нажимаю на такой же барабан.',repeat(['drum'],objects,['drum'],'Повтори один звук.')),
    demo('Слышу звон. Теперь сам нажимаю на колокольчик.',repeat(['bell'],objects,['bell'],'Повтори звон.')),
    demo('Тук-тук. Можешь повторить голосом или нажать на барабан.',repeat([speech('Тук-тук.')],objects,['drum'],'Повтори звук.')),
   ],
   task('Повтори барабан',repeat(['drum'],objects,['drum'],'Выбери барабан и повтори звук.')),
   task('Найди инструмент',findSound('bell',objects)),
   task('Такой же голос',match('duck',['bird','duck','dog'])),
    task('Тук-тук',{...repeat([speech('Тук-тук.')],objects,['drum'],'Повтори голосом, если хочешь. Можно нажать на барабан.',{...acoustic(objects),drum:speech('Тук-тук.')}), optionalVoice:true}),
   task('Музыкальная мастерская',repeat(['bell'],objects,['bell']),repeat(['rattle'],objects,['rattle']),repeat(['drum'],objects,['drum']),findSound('dog',['dog','cat','duck']),findSound('cat',['dog','cat','duck'])),
 ],
 [
   [
    demo('Сначала слушаю просьбу. Потом беру нужную игрушку.',command('Возьми мяч.',['ball','car'],'ball')),
    demo('Послушаю, что нужно положить в корзинку.',command('Положи яблоко в корзинку.',['apple','pear','basket'],['apple','basket'])),
    demo('Можно подумать и выполнить просьбу в своём темпе.',command('Нажми на колокольчик.',['bell','rattle'],'bell')),
   ],
   task('Нажми на мяч',command('Нажми на мяч.',['ball','car'],'ball')),
   task('Нужная игрушка',command('Выбери куклу.',['bear','doll','car'],'doll')),
   task('Предмет в корзинке',command('Положи яблоко в корзинку.',['apple','pear','basket'],['apple','basket'])),
   task('Открой домик',command('Открой домик с голубой крышей.',['house-blue','house-pink','garage-blue'],'house-blue')),
   task('Помощник Луми',command('Положи мяч в корзинку.',['bear','ball','basket'],['ball','basket']),command('Нажми на машинку.',['car','stack','doll'],'car'),command('Выбери мишку.',['doll','bear','duck'],'bear'),command('Покажи мне чашку.',['plate','cup','jug'],'cup'),command('Позвони в колокольчик.',['drum','rattle','bell'],'bell')),
 ],
 [
   [
    demo('Я слышу слово. Оно подсказывает, какую игрушку выбрать.',word('Это мяч.',['ball','doll'])),
    demo('На столе фрукты. Услышим название и найдём нужный.',word('Яблоко.',['apple','pear','plum'])),
    demo('Слушай слово до конца.',word('Чашка.',['cup','jug','plate'])),
   ],
   task('Названная игрушка',word('Это мяч.',['ball','car'])),
   task('Названный фрукт',word('Груша.',['apple','pear','lemon'],'pear')),
   task('Вещи на полке',word('Шапка.',['hat','boot','scarf','coat'])),
   task('Предмет на картинке',base('picture',[speech('Лист.')],['apple','cup','leaf','ball','bell'],'leaf','Послушай название и найди предмет на столе.',{picture:'desk'})),
   task('Сокровища долины',word('Кукла.',optionsForWords,'doll'),word('Мишка.',optionsForWords,'bear'),word('Яблоко.',optionsForWords,'apple'),word('Чашка.',optionsForWords,'cup'),word('Уточка.',optionsForWords,'duck')),
 ],
];
export const valley=Object.fromEntries(lessons.map(([scenes,...practice],index)=>[
  'memory-lesson-3-'+(index+1),{format:'memory34',world:'valley',scenes,practice},
]));
