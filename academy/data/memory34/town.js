const task=(title,...rounds)=>({title,kind:'memory34',rounds});
const demo=(text,example)=>({text,example});
const hidden=(picture,target,prompt)=>({
  kind:Array.isArray(target)?'hidden':'detail',picture,answer:target,options:[].concat(target),prompt,
});
const restore=(picture,sample,options,answer,prompt='Выбери и верни недостающую деталь.')=>
  ({kind:'repair',picture,sample:[sample],options,answer,prompt});
const added=(sample,index,item,setting,prompt='Запомни картинку. Какой предмет появится?')=>{
  const after=sample.map((id,i)=>i===index?item:id);
  return {kind:'recall',sample,after,setting,options:after.filter(Boolean),answer:item,prompt};
};
const find=(sample,options,prompt='Найди рисунок, как на образце.')=>({kind:'find',sample:[sample],options,answer:sample,prompt});
const differences=(left,right,answer,prompt='Найди отличия на картинках.')=>({kind:'difference',left,right,options:answer,answer,prompt});
const compare=(left,right,answer)=>({kind:'compare-images',left,right,options:['same','different'],answer,prompt:'Картинки одинаковые или разные?'});
const change=(sample,after,options,answer,prompt,setting='shelf')=>
  ({kind:'recall',sample,after,options,answer,prompt,setting});
const fruit=['apple','lemon','pear','plum'];
const toys=['doll','car','duck','bear','stack','ball','cup','apple'];
const mystery=(key,opts,answer,prompt)=>({kind:'recall',sample:[key[0]],after:[key[1]],options:opts,answer,prompt});
const lookout=(picture,sample,answer,prompt='Найди предмет на картинке.')=>({
  ...hidden(picture,answer,prompt),sample:[sample],
});
const lessons=[
  [
    [
      demo('Видишь ушки за кустом? Там спрятался зайчик.',hidden('hide-bush','rabbit','Найди ушки зайчика.')),
      demo('Из-за коробки выглядывает хвост. Там кошка.',hidden('hide-box','cat','Найди кошку.')),
      demo('Присмотрись. На поляне видны пушистые ушки и хвостики.',hidden('hide-forest',['rabbit','cat'],'Найди обоих зверей.')),
    ],
    task('Зайчик за кустом',hidden('hide-bush','rabbit','Найди зайчика. Смотри на ушки.')),
    task('Кошка за коробкой',hidden('hide-box','cat','Найди кошку за коробкой.')),
    task('Прятки на полянке',hidden('hide-forest',['rabbit','cat'],'Найди обоих зверей на полянке.')),
    task('Кто выглянул?',lookout('hide-garden','dog','dog','Найди, где выглядывает собака.')),
    task('Городские прятки',hidden('hide-market','duck','Найди уточку в городе.'),hidden('hide-garden','dog','Найди собаку у калитки.'),hidden('hide-bush','rabbit','Где зайчик?'),hidden('hide-box','cat','Где кошка?'),hidden('hide-market','bird','Найди птичку.')),
  ],
  [
    [
      demo('У одной машинки нет колеса. Посмотри на целую машинку.',restore('car-wheeloff','car',['wheel','door','ear'],'wheel','Верни колесо.')),
      demo('Домик остался без двери. Подберём нужную деталь.',restore('house-blue-dooroff','house-blue',['door','roof','window-blue'],'door','Верни дверь.')),
      demo('Целый рисунок подсказывает, какая деталь нужна.',restore('bear-earoff','bear',['ear','wheel','bow'],'ear','Верни ушко.')),
    ],
    task('Колесо машинки',restore('car-wheeloff','car',['wheel','door'],'wheel','Добавь колесо.')),
    task('Ушко мишки',restore('bear-earoff','bear',['bow','ear','wheel'],'ear','Найди недостающее ушко.')),
    task('Дверь домика',restore('house-blue-dooroff','house-blue',['window-blue','door','roof'],'door','Верни дверь, как на образце.')),
    task('Три детали',restore('house-blue-windowoff','house-blue',['door','roof','window-blue'],'window-blue','Выбери недостающую деталь.')),
    task('Мастерская детектива',restore('bear-plain','bear',['bow','ear','wheel'],'bow'),restore('car-wheeloff','car',['wheel','door','ear'],'wheel'),restore('house-blue-windowoff','house-blue',['roof','door','window-blue'],'window-blue'),restore('house-pink-dooroff','house-pink',['door','roof','window-blue'],'door'),restore('butterfly-gold','butterfly-gold-spot',['wing-spot','bow','ear'],'wing-spot','Верни пятнышки на крылья.')),
  ],
  [
    [
      demo('На полке две игрушки. Запомни, где они стоят.',added(['ball','bear',null],2,'doll','shelf')),
      demo('Занавеска открылась. Рядом стоит новая игрушка.',added(['ball','bear',null],2,'car','shelf')),
      demo('Старые игрушки остались на своих местах. Добавился мяч.',added(['doll','car',null],2,'ball','shelf')),
    ],
    task('Новая игрушка',added(['duck','ball',null],2,'bear','shelf')),
    task('Фрукт в корзинке',added(['pear',null,'apple'],1,'plum','basket','Какой фрукт добавили в корзинку?')),
    task('Предмет на столе',added(['cup',null,'apple'],1,'bell','shelf','Что появилось на столе?')),
    task('Кто новый на полянке?',added(['rabbit','bird',null],2,'dog','picnic','Кто появился на полянке?')),
    task('Таинственные витрины',added(['car',null,'bear'],1,'doll','shelf'),added(['cup','plate',null],2,'jug','shelf'),added([null,'pear','plum'],0,'lemon','basket'),added(['stack','doll',null],2,'duck','shelf'),added(['flower-gold',null,'leaf'],1,'butterfly-blue','picnic')),
  ],
  [
    [
      demo('На прилавке разные фрукты. Ищу яблоко по картинке.',find('apple',fruit.slice(0,3))),
      demo('Ищу красный мяч среди разных игрушек.',find('ball',['car','ball','cup','bear'])),
      demo('Машинки похожи. Сравню цвет и узор с образцом.',find('car-blue-star',['car-blue','car-star','car-blue-star'])),
    ],
    task('Четыре предмета',find('cup',['cup','jug','spoon','plate'])),
    task('Шесть игрушек',find('stack',toys.slice(0,6))),
    task('Бабочки',find('butterfly-gold-spot',['butterfly-gold','butterfly-pink-spot','butterfly-gold-spot','butterfly-blue'])),
    task('Все мячи',{kind:'set',sample:['ball'],options:['ball-a','berry','ball-b','duck','ball-c'],answer:['ball-a','ball-b','ball-c'],prompt:'Найди все мячи.'}),
    task('Детективная витрина',lookout('desk','cup','cup'),lookout('desk','apple','apple'),lookout('desk','leaf','leaf'),lookout('fair','ball','ball'),lookout('fair','house-blue','door','Найди дверь домика.')),
  ],
  [
    [
      demo('Смотри по частям. Все детали совпадают.',compare('fair','fair','same')),
      demo('Картинки похожи. У домов разные крыши.',differences('house-blue','house-pink',['roof'])),
      demo('Сравни крышу и окно. Нашлось два отличия.',differences('house-blue','house-pink-shut',['roof','window'])),
    ],
    task('Одинаковые картинки?',compare('desk','desk','same'),compare('house-blue','house-pink','different')),
    task('Цвет изменился',differences('ball','ball-blue',['center'],'Найди отличие в цвете.')),
    task('Предмет исчез',differences('fair','fair-no-ball',['ball'],'Найди, какого предмета нет.')),
    task('Две комнаты',differences('room','room-changed',['lamp','ball'],'Найди два отличия в комнате.')),
    task('Зеркальный город',differences('fair','fair-changed',['roof','ball','tree'],'Найди три отличия.')),
  ],
  [
    [
      demo('У мишки был розовый бантик. Теперь бантик голубой.',change(['bear','car'],['bear-blue','car'],['bear-blue','car'],'bear-blue','У кого изменился цвет?')),
      demo('Машинка ехала в одну сторону. Потом повернула в другую.',change(['car','duck'],['car-left','duck'],['car-left','duck'],'car-left','Кто повернулся?')),
      demo('Кукла осталась на месте, а мяч передвинулся.',change(['doll','ball',null],['doll',null,'ball'],['doll','ball'],'ball','Что передвинулось?')),
    ],
    task('Другой цвет',change(['ball','duck'],['ball-blue','duck'],['ball-blue','duck'],'ball-blue','У какой игрушки изменился цвет?')),
    task('Другое место',change(['bear',null,'car'],[null,'bear','car'],['bear','car'],'bear','Какая игрушка передвинулась?')),
    task('Повернулся',change(['duck','cat'],['duck-left','cat'],['duck-left','cat'],'duck-left','Кто повернулся в другую сторону?')),
    task('Деталь домика',mystery(['house-blue','house-pink'],['roof','door','window-blue'],'roof','Какая деталь домика изменилась?')),
    task('Главная загадка города',change(['bear','stack'],['bear-blue','stack'],['bear-blue','stack'],'bear-blue','У кого изменился цвет?'),change(['doll','car',null],['doll',null,'car'],['doll','car'],'car','Какой предмет переехал?'),change(['car','basket'],['car-left','basket'],['car-left','basket'],'car-left','Что повернулось?'),mystery(['house-pink','house-pink-shut'],['roof','door','window-blue'],'window-blue','Какая деталь изменилась?'),change(['butterfly-gold','bell'],['butterfly-gold-spot','bell'],['butterfly-gold-spot','bell'],'butterfly-gold-spot','У кого изменился рисунок?')),
  ],
];
export const town=Object.fromEntries(lessons.map(([scenes,...practice],index)=>[
  'memory-lesson-5-'+(index+1),{format:'memory34',world:'town',scenes,practice},
]));
