import {C,bundle,scene,say,task,spoken,sequence,matching,audioCards,repeat} from './builders.js';
const beat=(sound,count,pauses=[])=>Array.from({length:count},(_,i)=>pauses.includes(i)?['silence',sound]:[sound]).flat();
const tapRound=(sound,count,button='tap',pauses=[])=>({
  sounds:beat(sound,count,pauses),options:pauses.length?[button,'rest']:[button],
  answer:Array.from({length:count},(_,i)=>pauses.includes(i)?['rest',button]:[button]).flat(),
  choices:{[button]:sound,...(pauses.length?{rest:'silence'}:{})},
});
const wordRhythm=(word,count,button='clap')=>({...tapRound('claps',count,button),sounds:[C(word)]});
const rhythmChoice=(correct,a,b)=>audioCards(correct,{first:a,second:b},'first');
const rhythmClips=(sounds,options,answer)=>({sounds,options,answer,choices:{
  one:['claps'],two:['claps','claps'],three:['claps','claps','claps'],
}});
const imitation={cat:C('Мяу!'),dog:C('Гав!'),cow:C('Му-у!'),car:C('Би-би!'),knock:C('Тук-тук!'),drip:C('Кап-кап!')};
const voice=(id,options)=>({sounds:[imitation[id]],options,answer:id});
const phrases=[
 ['Кот спит.',['cat-sleep','cat-hop'],'cat-sleep'],
 ['Мишка идёт.',['bear-walk','bear-sleep','cat-sleep'],'bear-walk'],
 ['Луми играет.',['sleep','play','sit'],'play'],
 ['Красный мяч катится.',['red-ball-roll','red-ball-still','blue-ball-roll'],'red-ball-roll'],
 ['Маленькая птичка летит.',['bird-fly','bird-sit','fish-swim'],'bird-fly'],
];
const words=['Мяч.','Кукла.','Собака.','Малина.','Кот.'];
const wordRepeat=(name,instruction,...lines)=>task(name,'repeat',instruction,...lines.map(t=>repeat([C(t)])));
const wordsInOrder=sequence([C('Кукла.'),C('Машина.')],['doll','car','ball'],['doll','car']);

export const rhythm=bundle(4,'Музыкальная долина','Медаль мастера ритма',[
 ['Воспроизводить короткие последовательности хлопков.',[
  scene('Луми хлопает один раз.',['claps'],['hands-clap'],'actions'),
  scene('Теперь два хлопка подряд.',['claps','claps'],['hands-clap','hands-clap'],'actions'),
  scene('Два хлопка, небольшая пауза, ещё хлопок.',beat('claps',3,[2]),['hands-clap','hands-clap','hands-clap'],'actions'),
 ],
 task('Один хлопок','rhythm','Послушай и хлопни на экране один раз.',tapRound('claps',1,'clap')),
 task('Два хлопка','rhythm','Повтори два хлопка.',tapRound('claps',2,'clap')),
 task('Три хлопка','rhythm','Повтори три хлопка. Темп выбирай сам.',tapRound('claps',3,'clap')),
 task('Узнай ритм','choice','Найди дорожку с такими же хлопками.',rhythmChoice(beat('claps',2),beat('claps',2),beat('claps',3))),
 task('Музыкальные цветы','rhythm','Повтори пять коротких дорожек, нажимая на цветок.',tapRound('claps',1,'flower'),tapRound('claps',2,'flower'),tapRound('claps',3,'flower'),tapRound('claps',3,'flower',[2]),tapRound('claps',3,'flower',[1])),
 ],
 ['Различать число ударов и место паузы.',[
  scene('Луми играет два удара на барабане.',beat('drum',2),['drum'],'play'),
  scene('Два удара подряд, потом пауза и ещё один.',beat('drum',3,[2]),['drum'],'play'),
  scene('В этих дорожках одинаковое число ударов, но паузы в разных местах.',[...beat('drum',3,[1]),'silence',...beat('drum',3,[2])],['drum'],'play'),
 ],
 task('Два удара','rhythm','Воспроизведи два удара на барабане.',tapRound('drum',2)),
 task('Три удара подряд','choice','Выбери дорожку из трёх ударов без длинной паузы.',rhythmChoice(beat('drum',3),beat('drum',3),beat('drum',3,[2]))),
 task('Удар и пауза','rhythm','Сыграй удар, затем паузу и снова удар.',tapRound('drum',2,'tap',[1])),
 task('Ритм с паузой','choice','Послушай и найди ритм с паузой в том же месте.',rhythmChoice(beat('drum',3,[2]),beat('drum',3,[2]),beat('drum',3,[1]))),
 task('Оркестр Луми','rhythm','Сыграй четыре короткие дорожки в своём темпе.',tapRound('drum',2),tapRound('drum',3,'tap',[2]),tapRound('drum',3),tapRound('drum',4,'tap',[2])),
 ],
 ['Слышать ритм знакомых слов и сопровождать его хлопками.',[
  scene('Кот — один хлопок.',[C('Кот.'),'claps'],['cat','hands-clap'],'actions'),
  scene('Ма-ма — два хлопка.',[C('Мама.'),'claps','claps'],['hands-clap'],'actions'),
  scene('Ма-ши-на — три хлопка.',[C('Машина.'),'claps','claps','claps'],['car','hands-clap'],'actions'),
 ],
 task('Дом','rhythm','Послушай слово. Повтори один хлопок.',wordRhythm('Дом.',1)),
 task('Рыба','rhythm','Послушай слово и хлопни два раза.',wordRhythm('Рыба.',2)),
 task('Машина','rhythm','Послушай слово и хлопни три раза.',wordRhythm('Машина.',3)),
 task('Слово и ритм','match','Подбери к каждому слову дорожку хлопков.',rhythmClips([C('Мяч.'),C('Рыба.'),C('Машина.')],['one','two','three'],['one','two','three'])),
 task('Словесный барабан','rhythm','Отстучи ритм каждого слова на барабане.',...words.map((word,i)=>({...wordRhythm(word,[1,2,3,3,1][i],'tap'),choices:{tap:'drum'}}))),
 ],
 ['Слушать спокойную речь и повторять слова добровольно.',[
  say('Послушай знакомое слово в спокойном темпе.',['doll'],['Кукла.']),
  say('Между словами можно сделать естественную паузу.',['doll','car'],['Кукла.','Машина.']),
  say('Послушай короткую фразу. Можно повторить её по желанию.',['cat-sleep'],['Кот спит.'],'actions'),
 ],
 wordRepeat('Мама','Послушай слово. Можешь повторить.', 'Мама.'),
 wordRepeat('Два слова','Повтори слова, если хочется.','Кукла.','Машина.'),
 task('Спокойное слово','choice','Послушай оба варианта. Найди спокойное произнесение.',audioCards([C('Машина.','fast'),C('Машина.')],{first:C('Машина.','fast'),second:C('Машина.')},'second')),
 task('Слова по порядку','sequence','Послушай и выбери картинки по порядку.',wordsInOrder),
 wordRepeat('Прогулка без спешки','Пять остановок со словами. Можно послушать или повторить.',...words),
 ],
 ['Различать знакомые речевые звукоподражания.',[
  scene('Луми сам произносит голоса животных.',[imitation.cat,imitation.dog,imitation.cow],['cat','dog','cow'],'reveal'),
  scene('Луми подражает вещам и дождю.',[imitation.knock,imitation.drip,imitation.car],['knock','drip','car'],'reveal'),
  scene('Сначала звучит предмет. Потом Луми подражает ему.', ['rain',imitation.drip,'cat',imitation.cat],['drip','cat'],'reveal'),
 ],
 task('Мяу','choice','Кому подражает Луми?',voice('cat',['cat','dog'])),
 task('Би-би','choice','Какому предмету подражает Луми?',voice('car',['car','drum','bell'])),
 task('Четыре звукоподражания','match','Соедини звуки Луми с картинками.',matching([imitation.cat,imitation.dog,imitation.car,imitation.drip],['cat','dog','car','drip'],['cat','dog','car','drip'])),
 task('Тук-тук и кап-кап','sequence','Воспроизведи дорожку в том же порядке.',sequence([imitation.knock,imitation.drip],['knock','drip','car'],['knock','drip'],imitation)),
 task('Весёлый оркестр','compose','Выбери любые три звука. Затем сыграй свою дорожку.',{sounds:['silence'],options:['cat','dog','car','drip','knock'],answer:['cat','dog','car'],choices:imitation}),
 ],
 ['Узнавать и повторять короткие фразы по желанию.',[
  say('Луми рассказывает, что делает кот.',['cat-sleep'],['Кот спит.'],'actions'),
  say('Посмотри, как двигается мяч.',['red-ball-roll'],['Мяч катится.'],'actions'),
  say('Послушай фразу. Если захочешь, повтори.',['bird-fly'],['Маленькая птичка летит.'],'actions'),
 ],
 task('Кот спит','choice','Подбери картинку к фразе.',spoken(...phrases[0])),
 task('Мишка идёт','choice','Найди подходящее движение.',spoken(...phrases[1])),
 wordRepeat('Луми играет','Послушай фразу и повтори по желанию.','Луми играет.'),
 task('Красный мяч катится','choice','Послушай и найди подходящую картинку.',spoken(...phrases[3])),
 task('Музыкальный спектакль','discovery','Послушай фразы и подбери сцены. Можно повторить вслух.',...phrases.map(row=>spoken(...row))),
 ],
]);
