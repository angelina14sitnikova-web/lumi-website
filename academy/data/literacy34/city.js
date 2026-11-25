import {C,bundle,scene,say,task,spoken,each,sequence,matching,audioCards} from './builders.js';
const toys=['ball','doll','car'];
const market=['ball','apple','cup','bear','car'];
const actions=['sleep','hop','sit','run','play','fly','swim'];
const properties=['ball-big','ball-small','ball-blue-small','ball-red-big','balloon','balloon-blue','square','circle'];
const itemAudio=ids=>Object.fromEntries(ids.map(([id,name])=>[id,C(name)]));
const word=(text,id,options)=>spoken(text,options,id);
const action=(text,id)=>word(text,id,actions);
const ball=word('Мяч.','ball',['doll','ball']);
const apple=word('Яблоко.','apple',['pear','apple','car']);
const things=[['Мяч.','ball'],['Яблоко.','apple'],['Чашка.','cup'],['Мишка.','bear'],['Машинка.','car']];
const moves=[['Прыгает.','hop'],['Бежит.','run'],['Сидит.','sit'],['Спит.','sleep'],['Играет.','play']];
const descriptors=[['Большой мяч.','ball-big'],['Красный шарик.','balloon'],['Круглый предмет.','circle'],
  ['Маленький синий мяч.','ball-blue-small'],['Квадратный предмет.','square']];
const compare=(a,b,answer)=>audioCards([C(a),C(b)],{first:C(a),second:C(b)},answer);
const length=(word,answer)=>spoken(word,['short','long'],answer);
const cityReview=[
  spoken('Чашка.',market,'cup'),action('Прыгает.','hop'),spoken('Маленький синий мяч.',properties,'ball-blue-small'),
  spoken('Красный мяч.', ['ball','ball-blue','balloon'],'ball'),spoken('Кошка спит.', ['cat-sleep','cat-hop','dog-sleep'],'cat-sleep'),
];

export const city=bundle(2,'Город оживших слов','Медаль хранителя слов',[
 ['Замечать, что словами можно назвать предмет.',[
    say('Луми показывает игрушку и называет её.',['ball'],['Вот мяч.','Мяч.']),
    say('А как зовут этот фрукт?',['apple'],['Это яблоко.','Яблоко.']),
    say('Сначала слышим слово. Потом появляется предмет.',['cup'],['Чашка.'],'reveal-last'),
  ],
  task('Где мяч?','choice','Послушай слово и найди предмет.',ball),
  task('Где яблоко?','choice','Послушай слово и выбери одну из трёх картинок.',apple),
  task('Названия предметов','explore','Нажми на каждый предмет и послушай его название.',{sounds:['silence'],options:['ball','apple','cup'],answer:['ball','apple','cup'],choices:itemAudio([['ball','Мяч.'],['apple','Яблоко.'],['cup','Чашка.']])}),
  task('Слова и картинки','match','Послушай каждое слово и найди соответствующую картинку.',matching(things.slice(0,4).map(([word])=>C(word)),market.slice(0,4),market.slice(0,4))),
  task('Волшебный магазин','discovery','Собери пять предметов, которые назовёт Луми.',...each(things,market)),
 ],
 ['Узнавать названия игрушек, одежды и предметов.',[
    say('Луми показывает три игрушки.',['ball','doll','car'],['Мяч.','Кукла.','Машинка.']),
    say('На полке одежда.',['hat','coat','boots'],['Шапка.','Куртка.','Ботинки.']),
    say('Эти три мяча выглядят по-разному. Название у них одно.',['ball-big','ball-red-big','ball-blue-small'],['Мяч.','Тоже мяч.','И это мяч.']),
  ],
  task('Назови игрушку','choice','Послушай и покажи то, что назвал Луми.',spoken('Кукла.',toys,'doll')),
  task('Все мячи','multi','Выбери все мячи.',{sounds:[C('Покажи все мячи.')],options:['ball-big','doll','ball-blue-small','car','ball-red-big'],answer:['ball-big','ball-blue-small','ball-red-big']}),
  task('Четыре названия','match','Соедини четыре услышанных названия с картинками.',matching(['Шапка.','Куртка.','Машинка.','Ботинки.'].map(word=>C(word)),['hat','coat','car','boots'],['hat','coat','car','boots'])),
  task('На полке с одеждой','choice','Найди нужную вещь среди одежды.',spoken('Ботинки.',['coat','boots','hat'],'boots')),
  task('Собери посылки','match','Найди домик для каждого услышанного названия.',matching(things.map(([word])=>C(word)),market,market)),
 ],
 ['Узнавать действия по словам.',[
    say('Посмотри, что делает Луми.',['hop','run','sit'],['Прыгает.','Бежит.','Сидит.'],'actions'),
    say('Посмотри, что делают зверята.',['cat-sleep','fly','swim'],['Кошка спит.','Птичка летит.','Рыбка плывёт.'],'actions'),
    say('Луми и зайчик могут прыгать.',['hop','rabbit-hop'],['Луми прыгает.','Зайчик прыгает.'],'actions'),
  ],
  task('Кто спит?','choice','Выбери того, кто спит.',spoken('Спит.',['cat-sleep','rabbit-hop'],'cat-sleep')),
  task('Кто прыгает?','choice','Найди движение, которое назвал Луми.',spoken('Прыгает.',['sleep','sit','hop'],'hop')),
  task('Четыре движения','match','Сопоставь слово и движение.',matching(moves.slice(0,4).map(([word])=>C(word)),actions.slice(0,4),['hop','run','sit','sleep'])),
  task('Все, кто бежит','multi','Найди всех персонажей, которые бегут.',{sounds:[C('Кто бежит?')],options:['run','cat-sleep','dog-run','rabbit-hop'],answer:['run','dog-run']}),
  task('Оживи Луми','sequence','Включи движения по порядку. Можно переслушать.',sequence(moves.map(([word])=>C(word)),actions,moves.map(([,id])=>id))),
 ],
 ['Узнавать цвет, форму и размер по услышанным словам.',[
    say('Один мяч большой, другой маленький.',['ball-big','ball-small'],['Большой мяч.','Маленький мяч.']),
    say('Шарики бывают разных цветов.',['balloon','balloon-blue'],['Красный шарик.','Синий шарик.']),
    say('У предметов бывает разная форма.',['circle','square'],['Круглый.','Квадратный.']),
  ],
  task('Большой мяч','choice','Найди мяч нужного размера.',spoken('Большой.',['ball-big','ball-small'],'ball-big')),
  task('Шарики','choice','Выбери названный шарик.',spoken('Красный шарик.',['balloon','balloon-blue'],'balloon')),
  task('Круглая форма','choice','Послушай и выбери подходящую форму.',spoken('Круглый предмет.',['circle','square','triangle'],'circle')),
  task('Цвет и размер вместе','choice','Послушай два признака и найди мяч.',spoken('Маленький синий мяч.',['ball-red-big','ball-blue-small','ball-blue-big','ball-small'],'ball-blue-small')),
  task('Мастерская описаний','discovery','Найди пять предметов по услышанным признакам.',...each(descriptors,properties)),
 ],
 ['Замечать разную звуковую протяжённость слов.',[
    say('Слова звучат разное время.',['house','car'],['Дом.','Машина.']),
    say('Послушай ещё два слова.',['cat','turtle'],['Кот.','Черепаха.']),
    say('Слон большой, но его название звучит короче.',['elephant','butterfly'],['Слон.','Бабочка.']),
  ],
  task('Мак и малина','compare','Какое слово звучит короче?',compare('Мак.','Малина.','first')),
  task('Кот и черепаха','compare','Какое слово звучит дольше?',compare('Кот.','Черепаха.','second')),
  task('Мяч и пирамидка','compare','Какое слово звучит дольше?',compare('Мяч.','Пирамидка.','second')),
  task('Словесные дорожки','choice','Найди короткую или длинную дорожку по звучанию слова.',length('Дом.','short'),length('Машина.','long'),length('Черепаха.','long'),length('Кот.','short')),
  task('Необычные названия','compare','Какое слово звучит дольше?',compare('Слон.','Бабочка.','second'),compare('Дом.','Пуговица.','second'),compare('Земляника.','Кит.','first')),
 ],
 ['Применять слова о предметах, действиях и признаках.',[
    say('Луми вспоминает названия предметов.',['bear','cup','ball'],['Мишка.','Чашка.','Мяч.']),
    say('У каждого движения своё слово.',['run','hop','sleep'],['Бежит.','Прыгает.','Спит.'],'actions'),
    say('Можно назвать предмет, его цвет и действие.',['red-ball-roll'],['Красный мяч катится.'],'actions'),
  ],
  task('Находим предмет','choice','Выбери названный предмет.',cityReview[0]),
  task('Движение Луми','choice','Выбери нужное движение.',cityReview[1]),
  task('Два признака','choice','Послушай размер и цвет.',cityReview[2]),
  task('Короткое описание','choice','Подбери картинку к короткому описанию.',cityReview[3]),
  task('Верни слова городу','discovery','Пройди пять остановок со знакомыми словами.',...cityReview),
 ],
]);
