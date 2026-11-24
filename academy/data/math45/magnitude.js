import {token,scene,exercise,pick,connect,stages,keyed} from './builders.js';
export const measure=(tag,axis,value,extent)=>({...token(tag),axis,value,extent,directExtent:true});
const specimens=(tag,axis,values)=>values.map(value=>measure(tag,axis,value));
export const measurePick=(prompt,tag,axis,values,index,sample)=>exercise(prompt,'Посмотри на края предметов и сравни.',pick(specimens(tag,axis,values),index,sample?measure(tag,axis,sample):null));
export const series=(prompt,tag,axis,order,desired)=>exercise(prompt,'Выбирай предметы по порядку от стрелки.',connect(specimens(tag,axis,order),specimens(tag,axis,desired),order.map(n=>desired.indexOf(n)),{ordered:true,ordinal:true}));
const align=(text,tag,axis,values,focus)=>scene('align',text,specimens(tag,axis,values),{focus});
const demoSeries=(text,tag,axis,order,desired)=>scene('move',text,specimens(tag,axis,order),{targets:specimens(tag,axis,desired),matches:order.map(n=>desired.indexOf(n)),ordinal:true});
const lessons=[
 ['length','ribbon/pink','road/sky','strip/blue','ribbon/pink','Длинная лента выступает дальше при общем начале.','Найди более длинную ленту','Выбери более короткую дорожку','Подбери полоски одинаковой длины','Найди самую длинную ленту','Разложи полоски от короткой к длинной'],
 ['height','tower/blue','tree/green','house/pink','tower/blue','Ставим башни на одну линию. У высокой башни верхушка выше.','Найди высокую башню','Выбери низкое дерево','Подбери домики одинаковой высоты','Найди самую высокую башню','Расставь башни от низкой к высокой'],
 ['width','road/sky','ribbon/pink','strip/blue','bridge/sky','Дорожки одной длины. Сравниваем только ширину.','Найди широкую дорожку','Выбери узкую ленту','Подбери одинаковую ширину','Найди самый широкий мост','Расположи дорожки по ширине'],
 ['thickness','pencil/yellow','book/pink','book/pink','pencil/yellow','Два карандаша одной длины, но разной толщины.','Найди толстый карандаш','Выбери тонкую книгу','Подбери одинаковую толщину','Найди самый толстый предмет','Расположи книги по толщине'],
];
const dimensions=lessons.map(([axis,first,second,third,last,copy,p1,p2,p3,p4,p5])=>[
 [align(copy,first,axis,[.45,1]),align('Выделим предмет, который выступает дальше по нужному признаку.',axis==='thickness'?second:first,axis,[1,.45],0),
  demoSeries('Расположим предметы по величине.',first,axis,[.72,.45,1],[.45,.72,1])],
 [measurePick(p1,first,axis,[.45,1],1,1),measurePick(p2,second,axis,[1,.45],1,.45),measurePick(p3,third,axis,[.68,1,.68],[0,2]),
  measurePick(p4,last,axis,axis==='thickness'?[.75,1,.45]:[.75,1,.45,.59],1,1),
  series(p5,axis==='thickness'?second:axis==='width'?first:third,axis,[.85,.43,1,.64],[.43,.64,.85,1])]
]);
const double=(h,w)=>measure('tower/sky','height',h,w);
export const magnitude=keyed(7,'size-kingdom',[
 ...dimensions,
 [[align('Сравним четыре ленты, совместив начала.','ribbon/pink','length',[.4,.6,.8,1]),
   align('Сравним четыре башни на одной линии.','tower/blue','height',[.4,.6,.8,1]),
   scene('highlight','Высокая башня здесь уже низкой.',[double(1,.53),double(.55,1)],{focus:0})],
 [measurePick('Найди самую короткую ленту','ribbon/pink','length',[.6,1,.4,.8],2,.4),
  measurePick('Найди самую высокую башню','tower/blue','height',[.4,.7,.55,1,.85],3,1),
  measurePick('Найди самую узкую дорожку','road/sky','width',[.75,.42,1],1,.42),
  exercise('Найди такую же высоту и ширину','Сравни башни с образцом.',pick([double(1,1),double(.55,.55),double(1,.55)],2,double(1,.55))),
  stages('Сравни по трём признакам',measurePick('Найди длинную ленту','ribbon/pink','length',[.4,1],1,1),measurePick('Найди низкую башню','tower/blue','height',[.4,1],0,.4),measurePick('Найди широкий мост','bridge/blue','width',[1,.4],0,1))]],
 [[demoSeries('Положим мячи от маленького к большому.','ball/sky','overall',[.7,1,.45],[.45,.7,1]),
   demoSeries('Упорядочим четыре башни по высоте.','tower/blue','height',[.5,.65,1,.8],[.5,.65,.8,1]),
   align('В ряду не хватает средней ленты. Найдём подходящую длину.','ribbon/pink','length',[.4,.55,.85,1])],
 [series('Разложи мячи от маленького к большому','ball/sky','overall',[.5,1,.72],[.5,.72,1]),
  series('Поставь башни от высокой к низкой','tower/blue','height',[.5,1,.72,.86],[1,.86,.72,.5]),
  series('Разложи пять лент по длине','ribbon/pink','length',[.4,.7,1,.55,.85],[.4,.55,.7,.85,1]),
  exercise('Вставь недостающую ленту','Выбери длину между соседними.',pick(specimens('ribbon/pink','length',[.42,.7,1]),1,null,{cues:specimens('ribbon/pink','length',[.42,.56,.85,1])})),
  series('Исправь порядок пяти предметов','ball/sky','overall',[1,.42,.84,.56,.7],[.42,.56,.7,.84,1])]],
]);
