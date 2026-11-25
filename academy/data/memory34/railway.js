const task=(title,...rounds)=>({title,kind:'memory34',rounds});
const demo=(text,example)=>({text,example});
const story=(sample,prompt='Сначала посмотри, потом собери картинки по порядку.')=>
  ({kind:'order',sample,options:sample,answer:sample,prompt,family:'events'});
const move=(sample,prompt='Посмотри. Повтори движения кнопками в том же порядке.')=>
  ({kind:'order',sample,options:['reach','clap','hop','wave'],answer:sample,prompt,family:'moves'});
const which=(sample,index,prompt)=>({kind:'order',sample,options:sample,answer:sample[index],prompt,family:'events'});
const recallOrder=(sample,prompt='Запомни порядок картинок и поставь их в вагоны.')=>
  ({kind:'order',sample,options:sample,answer:sample,prompt,family:'images'});
const alternatives=(sample,family,prompt='Найди тот же порядок.')=>({
  kind:'order',sample,options:['track-a','track-b'],answer:'track-b',prompt,family,
  variants:{'track-a':[...sample].reverse(),'track-b':sample},
});
const audible=(sample,options=sample,prompt='Послушай. Повтори звуки по порядку.')=>({
  kind:'audio',audioMode:'repeat',clips:sample,options,answer:sample,prompt,
  demos:Object.fromEntries(options.map(id=>[id,id])),
});
const acousticChoice=(sample)=>({
  kind:'audio',audioMode:'cards',clips:sample,options:['crystal-a','crystal-b'],answer:'crystal-b',
  prompt:'Найди дорожку с таким же порядком звуков.',
  demos:{'crystal-a':[...sample].reverse(),'crystal-b':sample},
});

export const events={
  'box-open':{art:'open-box',name:'Открыть коробку',object:'box'},
  'toy-out':{art:'car',name:'Достать игрушку',object:'open-box'},
  'boots-on':{art:'boot',name:'Надеть ботинки',object:'mat'},
  'walk':{art:'garden-door',name:'Выйти гулять',object:'boot'},
  'wash':{art:'faucet',name:'Вымыть руки',object:'water'},
  'dry':{art:'towel',name:'Вытереть руки',object:'hands'},
  'can-take':{art:'watering',name:'Взять лейку',object:'plant'},
  'water-plant':{art:'water',name:'Полить цветок',object:'plant'},
  'door-open':{art:'open-door',name:'Открыть дверь',object:'house-blue'},
  'enter':{art:'welcome',name:'Войти',object:'open-door'},
  'ball-take':{art:'ball',name:'Взять мяч',object:'hands'},
  'ball-roll':{art:'ball',name:'Бросить мяч',object:'basket',action:'roll'},
  'cup-put':{art:'cup',name:'Поставить чашку',object:'desk'},
  'tea-pour':{art:'jug',name:'Налить чай',object:'cup'},
  'book-take':{art:'book',name:'Взять книгу',object:'hands'},
  'book-open':{art:'book-open',name:'Открыть книгу',object:'book'},
  'garage-open':{art:'garage-blue',name:'Открыть гараж',object:'house-blue'},
  'car-park':{art:'car',name:'Заехать в гараж',object:'garage-blue'},
  'basket-take':{art:'basket',name:'Взять корзинку',object:'leaf'},
  'fruit-put':{art:'apple',name:'Положить яблоко',object:'basket'},
  'find-spoon':{art:'spoon',name:'Найти ложку',object:'plate'},
  'stir-tea':{art:'spoon',name:'Размешать чай',object:'cup',action:'stir'},
  'paint-take':{art:'paint-brush',name:'Взять кисточку',object:'paper'},
  'paint-star':{art:'star',name:'Нарисовать звезду',object:'paper'},
  'pick-seed':{art:'seed',name:'Взять зёрнышко',object:'hands'},
  'plant-seed':{art:'seed',name:'Посадить зёрнышко',object:'plant',action:'drop'},
};
const box=['box-open','toy-out'],walk=['boots-on','walk'],wash=['wash','dry'],garden=['can-take','water-plant'];
const tea=['cup-put','tea-pour'],door=['door-open','enter'],ball=['ball-take','ball-roll'],book=['book-take','book-open'];
const garage=['garage-open','car-park'],basket=['basket-take','fruit-put'],stir=['find-spoon','stir-tea'],draw=['paint-take','paint-star'],grow=['pick-seed','plant-seed'];
const cueFirst='Что Луми сделал сначала?';
const cueLast='Что Луми сделал потом?';

const lessons=[
 [
   [
    demo('Сначала я открываю коробку. Потом достаю игрушку.',story(box)),
    demo('Я надеваю ботинки. Потом выхожу гулять.',story(walk)),
    demo('Поставим две картинки по порядку. Начнём с того, что было сначала.',story(wash)),
   ],
   task('Коробка и игрушка',story(box)),
   task('Собираемся гулять',story(walk)),
   task('Чистые руки',story(wash)),
   task('Два дела Луми',story(garden)),
   task('Первые вагоны',...[tea,door,book,basket,draw].map(pair=>story(pair))),
 ],
 [
   [
    demo('Поднимаю лапки. Теперь хлопаю.',move(['reach','clap'])),
    demo('Сначала прыгаю, потом машу лапкой.',move(['hop','wave'])),
    demo('Если поменять порядок, получится другой танец.',move(['wave','hop'])),
   ],
   task('Лапки и хлопок',move(['reach','clap'])),
   task('Прыжок и взмах',move(['hop','wave'])),
   task('Как танцевал Луми?',alternatives(['clap','hop'],'moves')),
   task('Управляй Луми',move(['wave','reach'],'Управляй Луми. Повтори движения по порядку.')),
   task('Танцевальная станция',...[
     ['hop','clap'],['wave','hop'],['clap','reach'],['reach','wave'],['wave','clap'],
   ].map(pair=>move(pair))),
 ],
 [
   [
    demo('Послушай один звон. Следом услышишь удар барабана.',audible(['bell','drum'])),
    demo('Сначала повторю звон, а потом стук барабана.',audible(['bell','drum'])),
    demo('Звуки те же, но можно услышать их в другом порядке.',acousticChoice(['drum','bell'])),
   ],
   task('Колокольчик и барабан',audible(['bell','drum'])),
   task('Барабан и погремушка',audible(['drum','rattle'])),
   task('Два голоса',audible(['cat','duck'],['cat','duck','dog'])),
   task('Та же дорожка',acousticChoice(['rattle','bell'])),
   task('Музыкальный паровоз',...[
     ['rattle','drum'],['bird','cat'],['bell','rattle'],['dog','duck'],['drum','bell'],
   ].map(pair=>audible(pair))),
 ],
 [
   [
    demo('В этот вагон положим мяч, а в следующий яблоко.',recallOrder(['ball','apple'])),
    demo('Картинок больше не видно. Вспомним, в каком вагоне каждая.',recallOrder(['ball','apple'])),
    demo('Картинки те же. Если поменять их местами, порядок станет другим.',recallOrder(['apple','ball'])),
   ],
   task('Мяч и кукла',recallOrder(['ball','doll'])),
   task('Вагоны зверят',recallOrder(['cat','duck'])),
   task('Две цветные фигуры',recallOrder(['circle-blue','square-pink'])),
   task('Правильная дорожка',alternatives(['stack','car'],'images')),
   task('Перепутанные вагоны',...[
     ['cup','bell'],['bear','ball'],['doll','duck'],['apple','pear'],['star','leaf'],
   ].map(pair=>recallOrder(pair))),
 ],
 [
   [
    demo('Сначала я беру лейку. Потом поливаю цветок.',which(garden,0,cueFirst)),
    demo('Первым было то, что мы увидели в начале. Я взял лейку.',which(garden,0,cueFirst)),
    demo('В другой истории я открываю книгу. Посмотри, что было сначала.',which(book,0,cueFirst)),
   ],
   task('У двери',which(door,0,cueFirst)),
   task('Мячик',which(ball,0,cueFirst)),
   task('Игрушечное чаепитие',which(tea,0,cueFirst)),
   task('Первая картинка',which(basket,0,cueFirst)),
   task('Станция начала',...[walk,box,grow,draw,stir].map(pair=>which(pair,0,cueFirst))),
 ],
 [
   [
    demo('Сначала беру книгу. Потом открываю её.',which(book,1,cueLast)),
    demo('Вторым делом я открыл книгу. Это случилось потом.',which(book,1,cueLast)),
    demo('Начало и конец истории разные. Посмотри, как она заканчивается.',which(garage,1,cueLast)),
   ],
   task('Книга',which(book,1,cueLast)),
   task('После мыла',which(wash,1,cueLast)),
   task('История машинки',which(garage,1,cueLast)),
   task('Продолжи картинку',which(garden,1,'Какая картинка была второй?')),
   task('Конечная станция',...[tea,ball,stir,grow,basket].map(pair=>which(pair,1,cueLast))),
 ],
];
export const railway=Object.fromEntries(lessons.map(([scenes,...practice],index)=>[
  'memory-lesson-4-'+(index+1),{format:'memory34',world:'railway',scenes,practice},
]));
