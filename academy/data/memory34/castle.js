const task = (title,...rounds) => ({title,kind:'memory34',rounds});
const demo = (text,example) => ({text,example});
const recall = (sample,options,prompt='Запомни игрушку. Потом найди её.',answer=sample[0],setting='') =>
  ({kind:Array.isArray(answer)?'memory-set':'recall',sample,options,prompt,answer,setting});
const missing = (sample,index,options,prompt='Какая игрушка исчезла?',setting='shelf') => ({
  kind:'missing',sample,after:sample.map((id,i)=>i===index?null:id),
  slot:index,options,prompt,answer:sample[index],setting,
});
const layouts = (sample,variants,prompt) => ({
  kind:'layouts',sample,variants,prompt,options:variants.map((_,i)=>'layout'+i),
  answer:'layout'+variants.findIndex(v=>v.every((id,i)=>id===sample[i])),
});
const arrange = (sample,after,prompt='Верни игрушки на прежние места.') =>
  ({kind:'arrange',sample,after,options:sample,answer:sample,prompt,setting:'shelf'});
const changed = (sample,after) => ({
  kind:'changed',sample,after,prompt:'Игрушки остались на тех же местах?',
  options:['same','different'],answer:sample.every((id,i)=>id===after[i])?'same':'different',setting:'shelf',
});
const paint = (sample, subjects, colors, prompt='Вспомни цвет и раскрась предмет.') => ({
  kind:'paint',sample,subjects,options:colors,prompt,answer:sample.map(id=>id.split('-').at(-1)),
});
const ballColors=['ball-red','ball-blue','ball-green'];
const carColors=['car-red','car-blue','car-green'];
const balloonColors=['balloon-red','balloon-blue','balloon-green'];
const colors=['red','blue','green'];
const tokens=['ball','doll','car','bear','stack','duck'];
const group = (sample,options,prompt='Запомни оба предмета. После занавески найди их.',setting='') =>
  recall(sample,options,prompt,sample,setting);
const picture = (objects,options,target,setting,prompt) => recall(objects,options,prompt,target,setting);

const lessons=[
  [
    [
      demo('Смотри, мяч. Занавеска закроется, когда ты будешь готов.',recall(['ball'],['duck','ball'])),
      demo('Вспомни, что было за занавеской. Среди двух игрушек найдём мяч.',recall(['ball'],['bear','ball'])),
      demo('Запомним одну игрушку. Потом найдём её среди трёх.',recall(['duck'],['ball','duck','bear'])),
    ],
    task('Один мяч',recall(['ball'],['bear','ball'])),
    task('Кукла за занавеской',recall(['doll'],['ball','doll','car'])),
    task('Машинка исчезает',recall(['car'],['car','duck','stack'])),
    task('Какой был мишка?',recall(['bear-blue'],['bear','bear-blue','bear-plain'],'Запомни мишку. Потом найди того же.')),
    task('Волшебные сундучки',...['stack','duck','car','ball','doll'].map(id=>recall([id],['bear',id,id==='car'?'ball':'car'],'Запомни игрушку из сундука.',id,'chest'))),
  ],
  [
    [
      demo('На полке мяч и мишка. Запомним обе игрушки.',missing(['ball','bear'],0,['ball','bear'])),
      demo('Смотрим на полку снова. Мишка остался. Мяча больше нет.',missing(['ball','bear'],0,['ball','bear'])),
      demo('На другой полке три игрушки. Одна спряталась.',missing(['doll','car','duck'],2,['car','duck'])),
    ],
    task('Две игрушки',missing(['ball','bear'],0,['ball','bear'])),
    task('Два ответа',missing(['duck','car'],1,['car','ball'])),
    task('Три игрушки',missing(['stack','doll','bear'],1,['stack','doll','bear'])),
    task('Верни на полку',missing(['doll','car','ball'],1,['car','stack','doll'],'Верни игрушку на пустое место.')),
    task('Комната исчезновений',missing(['ball','duck'],1,['duck','bear']),missing(['bear','car','stack'],0,['doll','bear','stack']),missing(['car','doll'],1,['car','doll']),missing(['duck','stack','ball'],2,['ball','duck','stack']),missing(['doll','ball','bear'],0,['doll','car','bear'])),
  ],
  [
    [
      demo('Мяч на одном краю полки, мишка на другом. Запомним их места.',arrange(['ball','bear'],['bear','ball'])),
      demo('За занавеской игрушки поменялись местами.',changed(['ball','bear'],['bear','ball'])),
      demo('Три игрушки на полке. Поменялись две. Расставим их, как в начале.',arrange(['doll','car','stack'],['doll','stack','car'])),
    ],
    task('Где они были?',layouts(['ball','bear'],[['bear','ball'],['ball','bear']],'Найди картинку, где игрушки на прежних местах.')),
    task('Верни обе игрушки',arrange(['doll','duck'],['duck','doll'])),
    task('Поменялись или нет?',changed(['car','ball'],['car','ball']),changed(['bear','stack'],['stack','bear'])),
    task('Три места на полке',arrange(['ball','car','bear'],['bear','car','ball'])),
    task('Перепутанные полочки',arrange(['duck','car'],['car','duck']),arrange(['doll','bear','stack'],['stack','bear','doll']),arrange(['ball','car','duck'],['ball','duck','car'])),
  ],
  [
    [
      demo('Запомним сразу две игрушки: мяч и машинку.',group(['ball','car'],['bear','car','ball'])),
      demo('За занавеской игрушек не видно. Вспомним мяч и машинку.',group(['ball','car'],['car','bear','ball'])),
      demo('Обе игрушки в корзинке. Можно выбрать любую из них первой.',group(['ball','duck'],['duck','ball','bear'],'Положи обе игрушки в корзинку.','basket')),
    ],
    task('Мяч и кукла',group(['ball','doll'],['duck','doll','ball'])),
    task('Яблоко и груша',group(['apple','pear'],['pear','lemon','plum','apple'])),
    task('Корзинка игрушек',group(['bear','duck'],['duck','stack','bear','doll'],'Вспомни обе игрушки. Перенеси их в корзинку.','basket')),
    task('Два предмета в сундуке',group(['car','ball'],['ball','stack','car','doll'],'Запомни, что в сундуке. Потом собери оба предмета.','chest')),
    task('Коллекция воспоминаний',group(['doll','car'],['stack','car','ball','doll']),group(['pear','plum'],['lemon','apple','pear','plum']),group(['bear','stack'],['duck','bear','stack','doll']),group(['duck','ball'],['car','stack','ball','duck']),group(['apple','lemon'],['lemon','pear','apple','plum'])),
  ],
  [
    [
      demo('Запомни цвет мяча. Скоро он спрячется.',recall(['ball-red'],ballColors,'Вспомни цвет мяча.')),
      demo('У всех мячей одна форма. Выберем тот же цвет.',recall(['ball-red'],ballColors,'Найди мяч того же цвета.')),
      demo('Запомним цвет машинки. После занавески вернём ей краску.',paint(['car-blue'],['car'],colors)),
    ],
    task('Цвет шарика',recall(['balloon-blue'],balloonColors,'Вспомни цвет шарика.')),
    task('Машинка того же цвета',recall(['car-green'],carColors,'Найди машинку того же цвета.')),
    task('Раскрась мяч',paint(['ball-red'],['ball'],colors)),
    task('Две краски',paint(['car-blue','ball-red'],['car','ball'],colors,'Запомни цвета машинки и мяча. Потом раскрась их.')),
    task('Исчезнувшие краски',paint(['balloon-green'],['balloon'],colors),paint(['car-red'],['car'],colors),paint(['cup-blue'],['cup'],colors),paint(['ball-green'],['ball'],colors),paint(['butterfly-green'],['butterfly'],colors)),
  ],
  [
    [
      demo('На картинке две игрушки. Рассмотрим их и закроем занавеску.',picture(['duck','ball'],['ball','car'],'ball','shelf','Что было на картинке?')),
      demo('На полке были утка и мяч. Луми вспоминает обе игрушки.',group(['duck','ball'],['ball','car','duck'],'Найди обе игрушки.','shelf')),
      demo('На пикнике за пледом лежит мяч. В корзинке яблоко. Что было в корзинке?',picture(['apple','ball'],['apple','pear','ball'],'apple','picnic','Что было в корзинке?')),
    ],
    task('Два предмета на картинке',picture(['ball','stack'],['car','stack','doll'],'stack','shelf','Найди игрушку, которую ты видел.')),
    task('Игрушки на полке',group(['duck','bear'],['bear','doll','duck'],'Какие игрушки были на полке?','shelf')),
    task('Фрукт на пикнике',picture(['pear','cup','ball'],['lemon','pear','apple'],'pear','picnic','Вспомни фрукт в корзинке.')),
    task('Вся картинка',picture(['bear','ball','stack'],tokens.slice(0,6),['bear','ball','stack'],'shelf','Выбери всё, что было на картинке.')),
    task('Альбом воспоминаний',picture(['apple','ball','cup'],['apple','pear','lemon'],'apple','picnic','Какой фрукт был в корзинке?'),picture(['car','doll'],['car','stack','doll'],['doll','car'],'chest','Что было в сундуке?'),picture(['duck','bear','car'],['duck','bear','car','stack'],['duck','bear','car'],'shelf','Вспомни игрушки на полке.')),
  ],
];
export const castle=Object.fromEntries(lessons.map(([scenes,...practice],index)=>[
  'memory-lesson-2-'+(index+1),{format:'memory34',world:'castle',scenes,practice},
]));
