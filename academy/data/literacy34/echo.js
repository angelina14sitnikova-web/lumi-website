import {C,bundle,scene,say,task,choice,spoken,sequence,matching,audioCards,repeat} from './builders.js';
const a='vowel-a',u='vowel-u',o='vowel-o',i='vowel-i',m='consonant-m';
const otherA='vowel-a-other',otherO='vowel-o-other',otherU='vowel-u-other';
const colors={gold:a,blue:u,pink:o,green:i};
const lights=Object.keys(colors);
const find=(sample,available,answer)=>audioCards([sample],Object.fromEntries(available.map(color=>[color,colors[color]])),answer);
const soundPair=(x,y,answer)=>({sounds:[x,y],options:['same','different'],answer});
const echoTrail=(heard,answer)=>sequence(heard,lights,answer,colors);
const voice=(sound,answer)=>choice(sound,['human','other'],answer);
const pairs=(spec)=>spec.map(([word,options,id])=>spoken(word,options,id));
const closeWords=[
 ['Дом.',['house','som'],'house'],
 ['Сом.',['house','som'],'som'],
 ['Миска.',['bowl','bear'],'bowl'],
 ['Мишка.',['bowl','bear'],'bear'],
 ['Коза.',['goat','braid'],'goat'],
 ['Коса.',['goat','braid'],'braid'],
];
const basicEcho=['syllable-ma','syllable-mu','syllable-pa'];
const syllables={first:basicEcho[0],second:basicEcho[1],third:basicEcho[2]};
const repeatTask=(name,instruction,...sounds)=>task(name,'repeat',instruction,...sounds.map(heard=>repeat([].concat(heard))));

export const echo=bundle(3,'Дворец волшебного эха','Медаль волшебного эха',[
 ['Различать речевые и неречевые звуки.',[
  scene('Вот звенит колокольчик. А этот звук произносит Луми.',['bell',a],['bell','vowel-a'],'reveal'),
  scene('Луми меняет положение губ. Послушай два разных звука.',[u,m],['vowel-u','consonant-m'],'mouth'),
  scene('Прислушайся: одни звуки произносит человек, другие слышны вокруг.',[o,'rattle',a,'stream'],['vowel-o','rattle','vowel-a','stream'],'reveal'),
 ],
 task('Голос и колокольчик','compare','Какой из двух звуков произносит человек?',{sounds:['bell',a],options:['first','second'],answer:'second'}),
 task('Голос или звон','choice','Это голос или другой звук?',voice(u,'human'),voice('bell','other')),
 task('Две звуковые группы','sort','Разложи звук в подходящую группу.',matching([a,'drum',m,'rattle'],['human','other'],['human','other','human','other'])),
 repeatTask('Звук вместе с Луми','Послушай. Можешь повторить звук вместе со взрослым.',o),
 task('Звуковые порталы','sort','Разложи шесть звуков по двум порталам.',matching([i,'cat','bell',u,'rain',a],['human','other'],['human','other','other','human','other','human'])),
 ],
 ['Слышать различия между гласными звуками.',[
  scene('Послушай первый протяжный звук.',[a],['vowel-a'],'mouth'),
  scene('Губы меняют форму. Послушай ещё два звука.',[u,o],['vowel-u','vowel-o'],'mouth'),
  scene('Каждый огонёк хранит свой звук.',[a,o,u],['gold','pink','blue'],'reveal'),
 ],
 task('Такой же звук','choice','Послушай образец и найди такой же.',find(a,['gold','blue'],'gold')),
 task('Три огонька','choice','Послушай образец и найди нужный звук.',find(u,['pink','blue','gold'],'blue')),
 task('Одинаково звучат','match','Сопоставь звуки. Можно переслушать каждый огонёк.',{...matching([a,o,u],['gold','pink','blue'],['gold','pink','blue']),choices:colors}),
 task('Два гласных по порядку','sequence','Повтори дорожку из двух звуков.',echoTrail([a,u],['gold','blue'])),
 task('Хор огоньков','sequence','Восстанови короткие звуковые дорожки.',echoTrail([u,o],['blue','pink']),echoTrail([o,a,u],['pink','gold','blue']),echoTrail([a,o,a],['gold','pink','gold'])),
 ],
 ['Добровольно подражать речевым звукам.',[
  scene('Послушай звук. Если хочется, повтори в паузе.',[a,'silence'],['vowel-a'],'mouth'),
  scene('Луми показывает три разных звука.',[u,o,i],['vowel-u','vowel-o','vowel-i'],'mouth'),
  scene('Попробуем услышать два звука друг за другом.',[a,u,'silence'],['gold','blue'],'reveal'),
 ],
 repeatTask('Первый звук','Послушай и по желанию повтори.',a),
 repeatTask('Два звука','Можешь повторить каждый звук за Луми.',u,o),
 task('Огонёк Луми','choice','Найди такой же звук.',find(i,['green','blue','gold'],'green')),
 task('Голосом или огоньками','sequence','Повтори огоньками. Можно также повторить звуки голосом.',echoTrail([a,u],['gold','blue'])),
 repeatTask('Волшебное эхо','Можешь повторить каждый образец или выбрать пропуск.',a,o,u,i,[o,a]),
 ],
 ['Сравнивать явно отличающиеся звуки и узнавать одинаковый звук в разных голосах.',[
  scene('Послушай два разных звука.',[a,u],['gold','blue'],'reveal'),
  scene('Здесь два одинаковых звука.',[o,o],['pink','pink'],'reveal'),
  scene('Голоса разные, а звук может совпадать.',[a,otherA,u],['gold','gold','blue'],'reveal'),
 ],
 task('Один и тот же звук','choice','Одинаково ли звучат эти два звука?',soundPair(a,a,'same')),
 task('Похожи или разные?','choice','Послушай и сравни два звука.',soundPair(a,u,'different')),
 task('Найди совпадение','choice','Найди огонёк с таким же звуком.',find(o,['pink','blue','gold'],'pink')),
 task('Три звуковые пары','match','Соедини записи одного звука.',{...matching([otherO,otherU,otherA],['pink','blue','gold'],['pink','blue','gold']),choices:colors}),
 task('Звуковой замок','choice','Сравни пять пар.',soundPair(otherA,a,'same'),soundPair(o,otherU,'different'),soundPair(u,otherU,'same'),soundPair(otherO,o,'same'),soundPair(otherA,i,'different')),
 ],
 ['Различать знакомые слова по звучанию.',[
  say('Кот и дом звучат по-разному.',['cat','house'],['Кот.','Дом.']),
  scene('Одно слово можно сказать чуть тише.',[C('Кот.'),{...C('Кот.'),gain:.48}],['cat'],'reveal'),
  say('Дом и сом звучат похоже. Посмотри на две разные картинки.',['house','som'],['Дом.','Сом.']),
 ],
 task('Слово «кот»','choice','Найди названную картинку.',spoken('Кот.',['cat','house'],'cat')),
 task('То же слово','choice','Найди карточку с тем же словом.',audioCards([C('Дом.')],{first:C('Сом.'),second:C('Дом.','other'),third:C('Кот.')},'second')),
 task('Дом и сом','choice','Послушай слово. Покажи картинку.',...pairs(closeWords.slice(0,2))),
 task('Миска и мишка','choice','Послушай слово. Покажи картинку.',...pairs(closeWords.slice(2,4))),
 task('Сундук похожих слов','choice','Различи похожие слова, которые назовёт Луми.',...pairs(closeWords)),
 ],
 ['Повторять на слух короткие звуки, слоги и слова по желанию.',[
  scene('Сначала звук, потом пауза для твоего эха.',[a,'silence'],['vowel-a'],'mouth'),
  scene('Послушай три коротких слога.',basicEcho,['gold','blue','pink'],'reveal'),
  say('А вот слово. Повтори его, если хочешь.',['cat'],['Кот.']),
 ],
 repeatTask('Один звук','Послушай и повтори звук по желанию.',u),
 repeatTask('Два слога','Послушай два слога по очереди.',basicEcho[0],basicEcho[1]),
 task('Найди такой же слог','choice','Сравни слог с карточками.',audioCards([basicEcho[2]],syllables,'third')),
 task('Слово и рисунок','choice','Выбери картинку. Можно повторить слово вслух.',spoken('Мяч.',['ball','car','cat'],'ball')),
 task('Верни эхо дворцу','choice','Пройди пять коротких звуковых испытаний.',
   {...repeat([a]),kind:'repeat'},audioCards([basicEcho[1]],syllables,'second'),
   {...echoTrail([u,o],['blue','pink']),kind:'sequence'},spoken('Кот.',['cat','house'],'cat'),
   {...repeat([C('Мяу!')]),kind:'repeat'}),
 ],
]);
