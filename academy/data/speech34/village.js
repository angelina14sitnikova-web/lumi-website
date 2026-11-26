import {lessons,scene,adultScene,task,frame,panel,token,say,choose,place} from './builders.js';
import {words,offspring} from '../../speech/words.js';
const many=id=>panel([id,1,53,.45],[id,56,22,.44],[id,105,66,.39]);
const count=(id,multiple=false)=>token(id+(multiple?'-many':'-one'),multiple?many(id):id,{label:multiple?words[id].plural:words[id].lemma});
const morph=id=>words[id].lemma+' — '+words[id].plural+'.';
const viewCounts=id=>scene('Сравним один предмет и несколько таких предметов.',morph(id),frame(id,'rise',{says:words[id].lemma}),frame(many(id),'rise',{says:words[id].plural,reset:true}));
const getNumber=(id,multiple,alternatives=[])=>choose(multiple?'Покажи, где несколько.':'Покажи, где один предмет.',morph(id),
 [count(id,true),...alternatives,count(id)],count(id,multiple).id);
const numbers=(...ids)=>place('Соедини один предмет и несколько таких же.',ids.map(morph).join(' '),
 ids.map(id=>count(id)),[...ids].reverse().map(id=>[many(id),count(id).id,words[id].plural]));
const describeCount=id=>say('Назови один предмет и несколько таких предметов.',morph(id),[count(id),count(id,true)]);
const turn=id=>say('Назови предмет, затем добавь ещё такие предметы.',morph(id),[id],'act',
 {modeButton:'Добавить предметы',result:frame(many(id),'rise')});
const families=[
 ['cat','kitten','У кошки котёнок.'],['dog','puppy','У собаки щенок.'],['cow','calf','У коровы телёнок.'],
 ['horse','foal','У лошади жеребёнок.'],['duck','duckling','У утки утёнок.'],['hen','chick','У курицы цыплёнок.'],
];
const showFamily=([parent,baby,phrase])=>frame(panel([parent,5,30,.63],[baby,95,82,.44,'rise']),'show',{says:phrase,reset:true});
const family=(group,other=[])=>place('Найди детёныша для каждого животного.',group.map(x=>x[2]).join(' '),
 [...other,...group.map(x=>x[1])],group.map(x=>[x[0],offspring[x[0]],words[x[0]].lemma]));
const affection=id=>words[id].lemma+' — '+words[id].affection+'.';
const tender=id=>say('Назови ласково.',affection(id),[id],'echo',{requiresAdult:true,
 adultPrompt:'Скажите обе формы вслух. Примите уместный разговорный вариант и повторите нормативную форму в своей фразе.'});
const affectionIds=['ball','house','tomcat','bunny','flower'];
const artFor=id=>frame(id,'wave',{says:affection(id)});
const tone=(id,list)=>choose('Взрослый назовёт предмет ласково. Покажи его.',affection(id),list,id,
 {requiresAdult:true,transcript:words[id].affection,adultPrompt:'Прочитайте только ласковое слово из текста озвучки. Полный образец произнесите после выбора.'});
const absentSets=[
 ['ball','car','bear'],['doll','ball','car'],['block','doll','bear'],['car','block','doll'],['bear','ball','block'],
];
const absent=(items,said='Нет')=>{
 const id=items[0];
 return said+' '+words[id].cases.genitive+'.';
};
const setup=ids=>panel(...ids.map((id,i)=>[id,i*57+2,47,.36]));
const hide=items=>frame(panel(...items.map((id,i)=>[id,i*57+2,47,.36,i===0?'hide':'show'])),'show',{reset:true,says:absent(items)});
const missing=items=>choose('Какой предмет исчез? Скажи «нет…».',absent(items),[items[2],items[0],items[1]],items[0],
 {context:setup(items.slice(1)),review:setup(items),result:frame(items[0],'rise')});
const sayMissing=(items,prefix='Нет')=>say('Закончи фразу: «'+prefix+'…».',absent(items,prefix),[token('x',setup(items))],'speak',
 {adultPrompt:'Покажите полный набор. Затем укажите, какой предмет спрятался, и предложите закончить фразу.'});
export const village=lessons(5,[
 ['Употреблять формы единственного и множественного числа.',[
  viewCounts('ball'),viewCounts('doll'),scene('Ещё две пары слов.','Кубик — кубики. Машинка — машинки.',frame('block'),frame(many('block')),frame('car','rise',{reset:true}),frame(many('car'))),
 ],
 task('Один мяч',getNumber('ball',false)),task('Несколько мячей',getNumber('ball',true)),
 task('Один и много',numbers('ball','doll','block')),task('Назови предметы',describeCount('car'),describeCount('doll')),
 task('Волшебное превращение',turn('ball'),turn('doll'),turn('block')),
 ],
 ['Употреблять названия одного и нескольких детёнышей.',[viewCounts('kitten'),viewCounts('puppy'),viewCounts('duckling')],
 task('Котёнок',getNumber('kitten',false)),task('Котята',getNumber('kitten',true)),
 task('Один щенок и щенки',numbers('puppy')),task('Назови детёнышей',describeCount('duckling')),
 task('Детский сад зверят',numbers('kitten','puppy','duckling'),describeCount('kitten')),
 ],
 ['Подбирать названия детёнышей знакомых животных.',families.slice(0,3).map((_,i)=>
  scene('Посмотри на две семьи животных.',families.slice(2*i,2*i+2).map(x=>x[2]).join(' '),...families.slice(2*i,2*i+2).map(showFamily))),
 task('Кошка и котёнок',family([families[0]],['puppy','duckling'])),
 task('Собака и щенок',family([families[1]],['kitten','calf'])),
 task('Корова и телёнок',family([families[2]],['foal','chick'])),
 task('Семьи животных',family(families.slice(3))),
 task('Семейная прогулка',family(families.slice(0,3)),family(families.slice(3)),say('Назови взрослых животных и их детёнышей.','У собаки щенок. У утки утёнок.',['dog','puppy','duck','duckling'])),
 ],
 ['Знакомиться с распространёнными ласковыми словами.',[
  adultScene('Послушай ласковое слово.',affection('ball'),[artFor('ball')]),
  adultScene('Назовём дом ласково.',affection('house'),[artFor('house')]),
  adultScene('Послушай другие пары.',affectionIds.slice(2).map(affection).join(' '),affectionIds.slice(2).map(artFor)),
 ],
 task('Мячик',tender('ball')),task('Котик',tone('tomcat',['house','tomcat','bunny'])),
 task('Ласковые названия',...['house','bunny','flower'].map(id=>tone(id,['house','bunny','flower']))),
 task('Три ласковых слова',tender('ball'),tender('house'),tender('flower')),
 task('Почта добрых слов',say('Выбери героя и назови ласково.','Кот — котик. Заяц — зайчик.',['tomcat','bunny'],'speak',
  {chooseVisual:true,models:{tomcat:affection('tomcat'),bunny:affection('bunny')},adultPrompt:'Ласковое слово может относиться и к большому, и к маленькому предмету.'})),
 ],
 ['Употреблять обороты «нет…» и «не стало…».',[
  scene('Мяч спрятался.',absent(absentSets[0]),frame(setup(absentSets[0])),hide(absentSets[0])),
  scene('Кукла спряталась.',absent(absentSets[1]),frame(setup(absentSets[1])),hide(absentSets[1])),
  scene('Кубик и машинка исчезают по очереди.','Был кубик — нет кубика. Была машинка — нет машинки.',
   frame(setup(absentSets[2])),hide(absentSets[2]),frame(setup(absentSets[3]),'rise',{reset:true}),hide(absentSets[3])),
 ],
 task('Что исчезло?',missing(absentSets[0])),task('Нет…',sayMissing(absentSets[1])),
 task('Найди спрятанную игрушку',missing(absentSets[2])),task('Не стало…',sayMissing(absentSets[3],'Не стало')),
 task('Сундучок исчезающих игрушек',...absentSets.map(missing)),
 ],
 ['Закреплять изученные грамматические конструкции.',[
  viewCounts('ball'),scene('Вспомним пары животных.','У кошки котёнок. У собаки щенок.',showFamily(families[0]),showFamily(families[1])),
  adultScene('Назовём предмет ласково, а затем спрячем его.','Мяч — мячик. Нет мяча.',[artFor('ball'),hide(absentSets[0])]),
 ],
 task('Один и несколько',describeCount('ball')),task('Как зовут детёныша?',family([families[2]],['kitten','puppy'])),
 task('Назови ласково',tender('bunny')),task('Закончи фразу',sayMissing(absentSets[4])),
 task('Праздник волшебных слов',getNumber('block',true),family([families[4]],['foal']),tender('flower'),missing(absentSets[3]),describeCount('puppy')),
 ],
]);
