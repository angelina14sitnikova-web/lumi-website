const task=(title,...rounds)=>({title,kind:'memory34',rounds});
const demo=(text,example,...extra)=>({text,example,extra});
const visual=(sample,options,prompt='Запомни предмет. Потом найди его.',answer=sample[0])=>({
  kind:Array.isArray(answer)?'memory-set':'recall',sample,options,prompt,answer,setting:'chest',
});
const remember=(sample,options,prompt='Запомни оба предмета. Потом найди их.')=>visual(sample,options,prompt,sample);
const paint=(sample,subject,prompt='Запомни цвет игрушки. Потом верни ей цвет.')=>({
  kind:'paint',sample:[sample],subjects:[subject],options:['red','blue','green'],answer:[sample.split('-').at(-1)],prompt,
});
const sound=(heard,options,prompt='Послушай. Что звучало?')=>({
  kind:'audio',audioMode:'objects',clips:[heard],options,answer:heard,prompt,
});
const count=(id,times)=>({kind:'audio',audioMode:'lantern',clips:Array(times).fill(id),options:['one','two'],
  answer:times===1?'one':'two',prompt:'Зажги столько огоньков, сколько звуков услышишь.'});
const spoken=(line,options,answer,prompt='Послушай слово. Найди этот предмет.')=>({
  kind:'audio',audioMode:'word',clips:[{voice:line}],options,answer,prompt,
});
const command=(line,options,answer)=>({
  kind:'audio',audioMode:'command',clips:[{voice:line}],options,answer,
  prompt:'Послушай просьбу. Сделай так, как скажет Луми.',
});
const order=(sample,family='images')=>({
  kind:'order',sample,family,options:family==='moves'?['reach','clap','hop','wave']:sample,
  answer:sample,prompt:family==='moves'?'Повтори движения Луми по порядку.':'Посмотри и собери картинки по порядку.',
});
const sounds=(clips,options=clips)=>({
  kind:'audio',audioMode:'repeat',clips,options,answer:clips,demos:Object.fromEntries(options.map(id=>[id,id])),
  prompt:'Повтори звуки в том же порядке.',
});
const missing=(sample,index,options,setting='shelf')=>({
  kind:'missing',sample,after:sample.map((id,i)=>i===index?null:id),slot:index,options,
  answer:sample[index],setting,prompt:'Запомни картинку. Потом найди, кто или что пропало.',
});
const find=(id,options)=>({kind:'find',sample:[id],options,answer:id,prompt:'Найди предмет по образцу.'});
const compare=(left,right,targets)=>({kind:'difference',left,right,options:targets,answer:targets,prompt:'Найди отличие.'});
const concealed=(picture,answer)=>({kind:'detail',picture,options:[answer],answer,prompt:'Найди спрятавшегося зверька.'});
const move={
  kind:'track',subject:'butterfly-blue',destinations:['flower-gold','flower-pink','flower-blue'],
  path:[1,0,2],options:['flower-gold','flower-pink','flower-blue'],answer:'flower-blue',prompt:'Посмотри, на какой цветок села бабочка.',
};

const lessons=[
 [
   [
    demo('Запомни одну игрушку. Закроем занавеску, когда будешь готов.',visual(['doll'],['ball','doll','bear'])),
    demo('Две игрушки тоже можно запомнить. Найди обе.',remember(['ball','duck'],['ball','duck','car','bear'])),
    demo('Запомни цвет. Такой же рисунок бывает другого цвета.',visual(['ball-blue'],['ball-red','ball-blue','ball-green'],'Найди мяч того же цвета.')),
   ],
   task('Одна игрушка',visual(['duck'],['duck','stack','bear'])),
   task('Два предмета',remember(['car','ball'],['doll','ball','car','bear'])),
   task('Верни цвет',paint('car-green','car')),
   task('Точный рисунок',visual(['car-blue-star'],['car','car-blue','car-star','car-blue-star'])),
   task('Кристаллы памяти',visual(['cup'],['spoon','cup','jug']),remember(['bear','doll'],['doll','duck','bear','ball']),paint('balloon-red','balloon'),visual(['butterfly-gold-spot'],['butterfly-gold','butterfly-pink-spot','butterfly-gold-spot','butterfly-blue']),remember(['apple','pear'],['pear','plum','apple','lemon'])),
 ],
 [
   [
    demo('Вспомни, какой предмет издаёт этот звук.',sound('rattle',['drum','rattle','bell'])),
    demo('Один удар зажигает один огонёк. Два удара зажигают два.',count('drum',2)),
    demo('Послушай короткую просьбу и выбери предмет.',command('Покажи мишку.',['bear','duck'],'bear')),
   ],
   task('Чей голос?',sound('dog',['dog','duck','cat'])),
   task('Что звучало?',sound('rattle',['drum','rattle','bell'])),
   task('Сколько сигналов?',count('bell',2)),
   task('Предмет по названию',spoken('Уточка.',['duck','doll','car'],'duck')),
   task('Звуковые сокровища',sound('cat',['dog','duck','cat']),count('rattle',1),spoken('Кукла.',['car','doll','ball'],'doll'),sound('drum',['drum','bell','rattle']),command('Нажми на яблоко.',['pear','plum','apple'],'apple')),
 ],
 [
   [
    demo('Две картинки можно разложить по порядку.',order(['ball','doll'])),
    demo('У звуков тоже есть порядок. Послушай дорожку.',sounds(['bell','drum'])),
    demo('А теперь повторим два движения.',order(['reach','wave'],'moves')),
   ],
   task('Две игрушки',order(['duck','car'])),
   task('Два звука',sounds(['drum','rattle'],['drum','rattle','bell'])),
   task('Два движения',order(['hop','clap'],'moves')),
   task('Две картинки одной истории',order(['book-take','book-open'],'events')),
   task('Мост воспоминаний',order(['cup','apple']),sounds(['dog','duck']),order(['clap','wave'],'moves'),order(['box-open','toy-out'],'events'),sounds(['bell','rattle'])),
 ],
 [
   [
    demo('На полке две игрушки. Одна исчезла.',missing(['ball','car'],0,['ball','car'])),
    demo('Три игрушки легче вспомнить, если посмотреть на каждую.',missing(['bear','duck','stack'],2,['bear','duck','stack'])),
    demo('Вернём пропавший предмет туда, где он был.',missing(['cup','apple','ball'],1,['apple','pear','lemon'],'picnic')),
   ],
   task('Пара игрушек',missing(['doll','stack'],0,['stack','doll'])),
   task('Из трёх игрушек',missing(['bear','ball','duck'],1,['bear','ball','duck'])),
   task('Фрукт в корзинке',missing(['apple','pear','lemon'],2,['apple','pear','lemon'],'basket')),
   task('Пропажа на картинке',missing(['plum','cup','ball'],1,['jug','bell','cup'],'picnic')),
   task('Сундуки исчезновений',missing(['duck','car'],0,['duck','bear'],'chest'),missing(['bear','ball','car'],2,['ball','car','stack'],'chest'),missing(['doll','duck','stack'],1,['duck','doll','stack'],'chest'),missing(['cup','ball'],0,['cup','ball'],'chest'),missing(['leaf','bell','apple'],0,['leaf','bell','apple'],'chest')),
 ],
 [
   [
    demo('В просьбе два дела. Сначала возьму мяч, потом положу его в корзинку.',command('Возьми мяч и положи его в корзинку.',['ball','doll','basket'],['ball','basket'])),
    demo('Сначала открою коробку, потом достану машинку.',command('Открой коробку и достань машинку.',['box','car','bear'],['box','car'])),
    demo('Сначала дослушаю указание. Потом выполню оба действия.',command('Нажми на мишку, потом на уточку.',['bear','doll','duck'],['bear','duck'])),
   ],
   task('Яблоко в корзинку',command('Возьми яблоко и положи его в корзинку.',['apple','pear','basket'],['apple','basket'])),
   task('Мишка в сундуке',command('Открой сундук и достань мишку.',['box','bear','doll'],['box','bear'])),
   task('Два инструмента',command('Нажми на колокольчик, потом на барабан.',['bell','rattle','drum'],['bell','drum'])),
   task('Машинка в гараж',command('Выбери машинку, потом поставь её в гараж.',['car','garage-blue','ball'],['car','garage-blue'])),
   task('Помощник хранителя воспоминаний',command('Нажми на шарик, потом на куклу.',['doll','balloon-blue','car'],['balloon-blue','doll']),command('Возьми грушу и положи её в корзинку.',['apple','basket','pear'],['pear','basket']),command('Открой коробку и достань утку.',['box','duck','car'],['box','duck']),command('Нажми на барабан, потом на погремушку.',['drum','rattle','bell'],['drum','rattle']),command('Покажи чашку, потом ложку.',['spoon','plate','cup'],['cup','spoon'])),
 ],
 [
   [
    demo('Вспомним игры наблюдателей. Найдём предмет и посмотрим на две картинки.',find('ball',['doll','ball']),compare('house-blue','house-pink',['roof'])),
    demo('Запоминаем глазами и ушами. Сначала игрушки, потом звуки.',remember(['car','bear'],['bear','duck','car']),sounds(['drum','bell'])),
    demo('Вспомним порядок и выполним два дела по просьбе Луми.',order(['wash','dry'],'events'),command('Покажи яблоко, потом чашку.',['pear','apple','cup'],['apple','cup'])),
   ],
   task('Испытание наблюдателя',find('car-blue-star',['car-blue','car-star','car-blue-star']),compare('ball','ball-star',['center']),move),
   task('Испытание памяти',remember(['doll','ball'],['ball','car','bear','doll']),missing(['bear','doll','duck'],0,['bear','duck','doll']),paint('ball-blue','ball')),
   task('Испытание звуков',sound('bell',['bell','drum','rattle']),count('drum',2),command('Выбери мишку.',['bear','duck','doll'],'bear')),
   task('Испытание порядка',order(['apple','cup']),sounds(['bell','rattle']),order(['reach','wave'],'moves')),
   task('Волшебный альбом',concealed('hide-box','cat'),compare('room','room-changed',['lamp','ball']),command('Возьми яблоко и положи его в корзинку.',['pear','apple','basket'],['apple','basket'])),
 ],
];
export const island=Object.fromEntries(lessons.map(([scenes,...practice],index)=>[
  'memory-lesson-6-'+(index+1),{format:'memory34',world:'island',scenes,practice},
]));
