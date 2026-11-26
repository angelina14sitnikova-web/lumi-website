import {lessons,scene,task,frame,panel,token,say,choose,place} from './builders.js';
import {phrase} from '../../speech/words.js';
const red='ball:red',blue='car:blue',small='car:blue:small',green='leaf:mint';
const choices=(instruction,model,ids,id,extra)=>choose(instruction,model,ids,id,extra);
const describe=(instruction,model,imgs,extra)=>say(instruction,model,imgs,'speak',extra);
const sayColor=(id,c)=>phrase(id,c)+'.';
const sizes=['ball:red:small',red,'bear:cream:small','bear:cream'];
const findSize=(target,ids,noun,size)=>choices('Найди '+(size==='small'?'маленькую машинку':'большой мяч')+'.',phrase(noun,size)+'.',ids,target);
const colors=['red','blue','gold','mint'];
const palettes=colors.map(c=>token(c,c,{label:{red:'Красный',blue:'Синий',gold:'Жёлтый',mint:'Зелёный'}[c]}));
const paint=place('Подбери краску для каждой вещи.','Красный мяч, синяя машинка, жёлтая чашка.',palettes,
 [['ball:gray','red','Мяч'],['car:gray','blue','Машинка'],['cup:gray','gold','Чашка']],{responseMode:'paint',paintItems:['ball','car','cup']});
const texture=(id)=>frame(panel([id,28,42,.73],['hand',2,53,.50,'touch']));
const real=(instructions,model,options)=>say(instructions,model,options,'tactile',{requiresAdult:true,
 adultPrompt:'Подберите дома два крупных безопасных предмета без острых краёв. Дайте ребёнку сравнить их на ощупь и опишите ощущения вместе.'});
const sort=(instruction,model,items,targets)=>place(instruction,model,items,targets);
const pickTrait=(base,trait,choices,model)=>choose('Подбери признак предмета.',model,choices,trait,{context:base});
const touchSoft=panel(['pillow',62,63,.60,'squeeze'],['hand',39,11,.63,'touch']);
const touchHard=panel(['block',58,63,.62],['hand',39,11,.63,'touch']);
const roundExamples=['plate','napkin','box'];
const chosenToys=['car','ball','bear','doll'];
export const traits=lessons(2,[
 ['Называть цвет знакомого предмета.',[
  scene('Посмотри на цвета.','Красный мяч. Синий кубик. Жёлтый цветок. Зелёный лист.',
   frame(red),frame('block:blue'),frame('flower:gold'),frame(green)),
  scene('Предметы одинаковые, а цвета разные.','Красный мяч. Синий мяч.',frame(red),frame('ball:blue')),
  scene('Назовём цвет вместе с предметом.','Красная машинка. Синее ведёрко. Зелёный мяч.',frame('car:red'),frame('bucket:blue'),frame('ball:mint')),
 ],
 task('Красный мяч',choices('Найди красный мяч.',sayColor('ball','red'),['ball:blue',red,'ball:mint'],red)),
 task('Синяя машинка',choices('Покажи синюю машинку.',sayColor('car','blue'),['car:red','car:gold',blue],blue)),
 task('Жёлтый предмет',choices('Найди жёлтую чашку и назови её.',sayColor('cup','gold'),['cup:blue','cup:gold','cup:mint'],'cup:gold')),
 task('Подбери краску',paint),
 task('Радужная витрина',...[[red,'ball','red'],[blue,'car','blue'],['cup:gold','cup','gold'],[green,'leaf','mint'],['bucket:blue','bucket','blue']]
  .map(([art,id,t])=>describe('Назови предмет и его цвет.',sayColor(id,t),[art]))),
 ],
 ['Сравнивать и называть размер.',[
  scene('Посмотри на два мяча.','Большой мяч и маленький мяч.',frame(red),frame(sizes[0])),
  scene('Сравним машинки.','Большая машинка и маленькая машинка.',frame(blue),frame(small)),
  scene('Назовём размер разных вещей.','Большой медвежонок. Маленькая кукла. Большое ведёрко.',frame('bear'),frame('doll:rose:small'),frame('bucket')),
 ],
 task('Большой мяч',findSize(red,[sizes[0],red],'ball','large')),
 task('Маленькая машинка',findSize(small,[blue,small],'car','small')),
 task('Коробка для большой игрушки',place('Помести большой мяч в большую коробку.','Большой мяч в большой коробке.',[sizes[0],red],[['box:cream',red,'Большая коробка']])),
 task('Назови размер',...[[red,'ball','large'],[small,'car','small'],['doll:rose:small','doll','small']]
  .map(([art,id,t])=>describe('Какого размера предмет?',phrase(id,t)+'.',[art],{context:panel([art,4,37,.55],[id,86,37,.54])}))),
 task('Магазин великанов и малышей',sort('Большие и маленькие игрушки положи отдельно.',
  'Большой мяч и маленький мяч. Большой медвежонок и маленький медвежонок.',sizes,
  [['box:cream',red,'Большая коробка'],['box:cream:small',sizes[0],'Маленькая коробка'],
   ['box:blue','bear:cream','Большая коробка'],['box:blue:small','bear:cream:small','Маленькая коробка']])),
 ],
 ['Узнавать и называть геометрическую форму.',[
  scene('Взгляни на тарелку.','Круглая тарелка.',frame('plate','turn')),
  scene('Сравни салфетку и коробку.','Квадратная салфетка и прямоугольная коробка.',frame('napkin'),frame('box')),
  scene('Такие формы бывают у разных вещей.','Круглый мяч. Квадратная салфетка. Прямоугольная коробка.',frame(red),frame('napkin'),frame('box')),
 ],
 task('Круглая тарелка',choices('Покажи круглую тарелку.',phrase('plate','round')+'.',['napkin','plate','box'],'plate')),
 task('Квадратная салфетка',choices('Найди квадратную салфетку.',phrase('napkin','square')+'.',['plate','box','napkin'],'napkin')),
 task('Подходящий силуэт',sort('Подложи предметы к подходящим силуэтам.','Тарелка круглая, салфетка квадратная, коробка прямоугольная.',
  roundExamples,[['rectangle','box','Прямоугольник'],['round','plate','Круг'],['square','napkin','Квадрат']])),
 task('Форма знакомых вещей',...roundExamples.map((id,i)=>describe('Назови форму.',phrase(id,['round','square','rectangle'][i])+'.',[id]))),
 task('Выставка форм',sort('Размести предметы по витринам формы.','Круглые, квадратные и прямоугольные предметы.',[...roundExamples,red,'block'],
  [['round','plate','Круглое'],['square','napkin','Квадратное'],['rectangle','box','Прямоугольное'],['round',red,'Круглое'],['square','block','Квадратное']])),
 ],
 ['Узнавать мягкое и твёрдое через демонстрацию.',[
  scene('Луми нажимает на подушку.','Подушка мягкая, она сжалась.',frame(touchSoft)),
  scene('Луми нажимает на кубик.','Деревянный кубик твёрдый и сохранил форму.',frame(touchHard)),
  scene('Сравни игрушку и дерево.','Мягкий медвежонок. Твёрдый деревянный кубик.',frame('bear','squeeze'),frame('block')),
 ],
 task('Что мягкое?',choices('После показа выбери мягкое.','Мягкая подушка.',[token('hard',touchHard),token('soft',touchSoft)],'soft',{context:touchSoft})),
 task('Что твёрдое?',choices('После показа выбери твёрдое.','Твёрдый кубик.',[token('soft',touchSoft),token('hard',touchHard)],'hard',{context:touchHard})),
 task('Мягкие и твёрдые',sort('Разложи после того, как посмотрели опыт.','Медвежонок и подушка мягкие. Кубик и доска твёрдые.',
  [token('pillow',touchSoft),token('block',touchHard),token('bear',panel(['bear',4,4,.95,'squeeze'])),'wood'],
  [['soft','pillow','Мягкое'],['hard','block','Твёрдое'],['soft','bear','Мягкое'],['hard','wood','Твёрдое']])),
 task('Назови свойство',describe('Назови свойства материалов.','Подушка мягкая, кубик твёрдый.',[token('a',touchSoft),token('b',touchHard)])),
 task('Сенсорная мастерская',real('Вместе потрогайте знакомые предметы.','Эта подушка мягкая. Этот деревянный кубик твёрдый.',['pillow','block'])),
 ],
 ['Различать и называть особенности поверхности.',[
  scene('Луми смотрит на гладкое дерево.','У полированного дерева гладкая поверхность.',texture('wood')),
  scene('Рассмотрим кору дерева.','Кора шершавая.',texture('bark')),
  scene('Одинаковое движение по двум поверхностям.','Гладкая поверхность. Шершавая кора.',texture('wood'),{...texture('bark'),reset:true}),
 ],
 task('Гладкий образец',choices('Покажи образец из демонстрации про гладкое.','Гладкое дерево.',['bark','wood'],'wood',{context:texture('wood').art})),
 task('Шершавый образец',choices('Покажи образец из демонстрации про шершавое.','Шершавая кора.',['wood','bark'],'bark',{context:texture('bark').art})),
 task('Поверхности',sort('Соедини образцы из опыта с карточками.','Доска гладкая. Кора шершавая.',[token('bark',texture('bark').art),token('wood',texture('wood').art)],
  [['smooth','wood','Гладкое'],['rough','bark','Шершавое']])),
 task('Сравни на ощупь',real('Сравните два безопасных материала.','Эта поверхность гладкая, а эта шершавая.',['wood','bark'])),
 task('Волшебные поверхности',real('Потрогайте образцы и опишите их.','На этой поверхности пальцы скользят. Она гладкая.',['wood','bark'])),
 ],
 ['Пользоваться наглядным планом описания.',[
  scene('Я назову мяч и скажу, какой он.','Это мяч. Он красный и круглый.',frame(red),frame('red'),frame('round')),
  scene('Теперь скажу про медвежонка.','Это медвежонок. Он маленький и мягкий.',frame('bear:cream:small'),frame('small'),frame('soft')),
  scene('Покажем план по карточкам.','Сначала назови игрушку. Затем скажи про цвет, размер или свойство.',frame('ball'),frame('red'),frame('small'),frame('round')),
 ],
 task('Назови игрушку',describe('Назови игрушку.','Это мяч.',[red])),
 task('Цвет игрушки',pickTrait(red,'red',['gold','red','blue'],'Мяч красный.')),
 task('Сравни размер',pickTrait('bear:cream:small','small',['large','small'],'Медвежонок маленький.')),
 task('Составь описание',sort('Подбери подходящие карточки для мяча.','Это красный круглый мяч.',
  ['red','round','square','gold'],[['ball','red','Цвет'],['ball','round','Форма']])),
 task('Экскурсовод мастерской',say('Выбери игрушку и расскажи о ней.','Это мяч. Он круглый. Его можно катить.',chosenToys,'speak',{chooseVisual:true,
 models:{car:'Это машинка. Она синяя. Её можно катать.',ball:'Это мяч. Он красный и круглый.',bear:'Это медвежонок. Он мягкий.',doll:'Это кукла. У неё розовое платье.'}})),
 ],
]);
