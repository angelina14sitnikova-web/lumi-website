import {C,bundle,scene,say,task,choice,spoken,sequence,matching,audioCards,repeat} from './builders.js';

const a='vowel-a',u='vowel-u',o='vowel-o';
const groups=['cat','dog','cow','duck'];
const voices={cat:C('Мяу!'),dog:C('Гав!'),cow:C('Му-у!'),duck:C('Кря-кря!')};
const props={bell:'bell',drum:'drum',rattle:'rattle'}, lights={gold:a,blue:u,pink:o};
const trail=(sounds,options,answer=sounds,choices)=>sequence(sounds,options,answer,choices);
const winged=[['Мяч.','ball'],['Яблоко.','apple'],['Машинка.','car'],['Кукла.','doll'],['Чашка.','cup']];
const school=['ball','car','doll','apple','cup','bear'];
const ladKids='Ладушки, ладушки! Где были? У бабушки. Что ели? Кашку! Полетели, полетели, на головку сели.';
const soroka='Сорока-белобока кашку варила, деток кормила. Этому дала, этому дала, этому дала, этому дала.';
const water='Водичка, водичка, умой моё личико. Чтобы глазки блестели, чтобы щёчки краснели.';
const stories={'story-lad':C(ladKids),'story-sor':C(soroka),'story-water':C(water)};
const ending=(full,start,clip,other,answer='first')=>audioCards([C(full),C(start)],{first:C(clip),second:C(other)},answer);
const endings=[
 ending('Кошка говорит: мяу.','Кошка говорит…','Мяу!','Гав!'),
 ending('Собака говорит: гав.','Собака говорит…','Му-у!','Гав!','second'),
 ending('Корова говорит: му.','Корова говорит…','Му-у!','Мяу!'),
 ending('Дождик капает: кап-кап.','Дождик капает…','Кап-кап!','Тук-тук!'),
 ending('Зайчик прыгает.','Зайчик…','Спит.','Прыгает.','second'),
];
const finale=[
 [choice('duck',groups),choice('rain',['rain','stream','leaves']),choice('rattle',['rattle','bell','drum'])],
 [spoken('Мяч.',school,'ball'),spoken('Прыгает.',['hop','sit','sleep'],'hop'),
  spoken('Маленький синий мяч.',['ball-blue-small','ball-red-big','ball-blue-big'],'ball-blue-small')],
 [audioCards([u],lights,'blue'),{sounds:[a,a],options:['same','different'],answer:'same'},{...repeat([o]),kind:'repeat'}],
 [
  {kind:'rhythm',sounds:['drum','drum'],options:['tap'],answer:['tap','tap'],choices:{tap:'drum'}},
  {kind:'rhythm',sounds:[C('Машина.')],options:['clap'],answer:['clap','clap','clap'],choices:{clap:'claps'}},
  {...trail([C('Тук-тук!'),C('Кап-кап!')],['knock','drip','car'],['knock','drip'],{knock:C('Тук-тук!'),drip:C('Кап-кап!'),car:C('Би-би!')}),kind:'sequence'},
 ],
 [spoken('Чашка.',school,'cup'),endings[0],{...trail(['bell','drum'],Object.keys(props),['bell','drum'],props),kind:'sequence'}],
];
export const island=bundle(5,'Остров речевых сокровищ','Золотая медаль исследователя звуков',[
 ['Различать настоящие голоса животных и речевое подражание.',[
  scene('Прислушайся к настоящим голосам животных.',['cat','dog','cow'],['cat','dog','cow'],'reveal'),
  scene('Теперь Луми сам подражает животным.',[voices.cat,voices.dog,voices.cow],['cat','dog','cow'],'reveal'),
  scene('За ракушками спрятались животные. Луми узнаёт голоса.',['duck','cat','cow'],['duck','cat','cow'],'reveal'),
 ],
 task('Настоящее мяуканье','choice','Кто подал настоящий голос?',choice('cat',groups)),
 task('Подражание Луми','choice','Кому подражает Луми?',choice(voices.dog,groups,'dog')),
 task('Четыре голоса','match','Сопоставь голоса и животных.',matching(groups,groups,groups)),
 task('Два голоса','sequence','Выбери животных в том же порядке.',trail(['cow','duck'],groups)),
 task('Остров голосов','discovery','Найди пять спрятавшихся животных по голосам и подражаниям.',choice('duck',groups),choice(voices.cat,groups,'cat'),choice('cow',groups),choice(voices.duck,groups,'duck'),choice('dog',groups)),
 ],
 ['Запоминать порядок нескольких знакомых звуков.',[
  scene('Колокольчик, потом барабан.',['bell','drum'],['bell','drum'],'play'),
  scene('Переставим эти звуки.',['drum','bell'],['drum','bell'],'play'),
  scene('А теперь три звука друг за другом.',['bell','rattle','drum'],['bell','rattle','drum'],'play'),
 ],
 task('Два предметных звука','sequence','Повтори дорожку инструментов.',trail(['bell','drum'],Object.keys(props),['bell','drum'],props)),
 task('Два голоса животных','sequence','Восстанови порядок голосов.',trail(['cat','duck'],groups,['cat','duck'])),
 task('Два речевых звука','sequence','Повтори звуки огоньками.',trail([a,u],Object.keys(lights),['gold','blue'],lights)),
 task('Три звука','sequence','Выбери звуки в услышанном порядке.',trail(['rattle','bell','drum'],Object.keys(props),['rattle','bell','drum'],props)),
 task('Мост звуков','sequence','Собери три звуковые дорожки.',trail(['drum','rattle'],Object.keys(props)),trail(['dog','cow'],groups),trail([u,o,a],Object.keys(lights),['blue','pink','gold'],lights)),
 ],
 ['Слушать короткие народные потешки и играть с их движениями.',[
  scene('Послушай «Ладушки». Можно двигать ладошками вместе с Луми.',[stories['story-lad']],['hands-clap'],'actions'),
  scene('Это история про сороку.',[stories['story-sor']],['magpie'],'actions'),
  scene('Луми слушает потешку про водичку.',[stories['story-water']],['wash'],'actions'),
 ],
 task('Картинка к «Ладушкам»','choice','Послушай и выбери подходящий рисунок.',choice(stories['story-lad'],['hands-clap','magpie','wash'],'hands-clap')),
 task('Движения ладошек','repeat','Можно повторить движение, когда услышишь потешку.',repeat([stories['story-lad']])),
 task('Сорока-белобока','choice','Послушай и найди героя потешки.',choice(stories['story-sor'],['magpie','cat','duck'],'magpie')),
 task('Водичка','choice','Найди сценку, о которой говорится в потешке.',choice(stories['story-water'],['car-go','wash','hands-clap'],'wash')),
 task('Театр потешек','theatre','Выбери потешку. Послушай её и оживи сценку.',{sounds:['silence'],options:Object.keys(stories),answer:'story-lad',choices:stories,accepts:Object.keys(stories)}),
 ],
 ['Достраивать услышанную фразу с опорой на образец.',[
  say('Послушай, что говорит кошка.',['cat'],['Кошка говорит: мяу.','Кошка говорит: мяу.']),
  say('А что говорит собака?',['dog'],['Собака говорит: гав.']),
  say('Сначала послушай фразу целиком. Затем услышишь паузу в конце.',['cat'],['Кошка говорит: мяу.','Кошка говорит…']),
 ],
 task('Кошка говорит…','choice','Выбери подходящее звучащее окончание.',endings[0]),
 task('Корова говорит…','choice','Продолжи фразу подходящим звуком.',endings[2]),
 task('Дождик капает…','choice','Вспомни, как заканчивается фраза.',endings[3]),
 task('Что делает зайчик?','choice','Выбери ранее услышанное действие.',endings[4]),
 task('Волшебные речевые облачка','choice','Дослушай и восстанови каждое окончание.',...endings),
 ],
 ['Узнавать знакомые слова без показа ответа заранее.',[
  say('Сначала слово, потом картинка.',['fish'],['Рыба.'],'reveal-last'),
  say('Послушай два похожих слова.',['cat','whale'],['Кот.','Кит.']),
  say('Повтори прослушивание, если нужно, и выбери картинку.',['ball','doll','car'],['Мяч.'],'reveal-last'),
 ],
 task('Три предмета','choice','Выбери названный предмет.',spoken('Мяч.',['ball','car','doll'],'ball')),
 task('Кот или кит','choice','Различи похожие слова.',spoken('Кит.',['cat','whale'],'whale'),spoken('Кот.',['cat','whale'],'cat')),
 task('Дом или сом','choice','Послушай слово и найди рисунок.',spoken('Дом.',['house','som'],'house'),spoken('Сом.',['house','som'],'som')),
 task('Два слова','sequence','Покажи рисунки в услышанном порядке.',trail([C('Кукла.'),C('Мяч.')],['ball','doll','car'],['doll','ball'])),
 task('Сундук слов','discovery','Найди пять предметов по услышанному слову.',...winged.map(([word,id],i)=>spoken(word,[...new Set([id,...school.filter(x=>x!==id).slice(0,Math.min(3,i+1))])],id))),
 ],
 ['Соединять навыки из пяти миров в коротких игровых испытаниях.',[
  scene('Луми вспоминает лес и город слов.',['cat','stream',C('Мяч.')],['cat','stream','ball'],'reveal'),
  scene('Послушаем речевые звуки, подражание и простой ритм.',[a,C('Тук-тук!'),'claps','claps'],['gold','knock','hands-clap'],'actions'),
  say('Вспомним короткие фразы и послушаем дорожку.',['cat-sleep','red-ball-roll'],['Кот спит.','Красный мяч катится.'],'actions'),
 ],
 task('Испытание леса','choice','Узнай животное, природный звук и предмет.',...finale[0]),
 task('Испытание города слов','choice','Найди предмет, действие и названный признак.',...finale[1]),
 task('Испытание дворца эха','choice','Сравни звуки и повтори по желанию.',...finale[2]),
 task('Испытание музыкальной долины','choice','Повтори ритм, ритм слова и дорожку звукоподражаний.',...finale[3]),
 task('Главное сокровище','choice','Узнай слово, закончи фразу и повтори дорожку.',...finale[4]),
 ],
]);
