import {lessonSet,demo,step,visual,talk,choose,multi,place,match,task,token} from './builders.js';

const object=(word,action,art,options)=>choose(action,word,options,art);
const explain=(prompt,model,art)=>talk(prompt,model,[art]);
const part=(base,instruction,model,options,correct)=>choose(instruction,model,options,correct,{context:base});
const collect=(instruction,model,items,others)=>multi(instruction,model,[...items.slice(0,1),...others,...items.slice(1)],items);
const customer=(request,model,arts,correct,context)=>choose(request,model,arts,correct,{context,animateSelection:true});
const use=[
 ['flower','watering','Поливать цветы'],['rain','umbrella','Укрыться от дождя'],['book','shelf','Поставить книги'],
 ['water','towel','Вытереть воду'],['paper','brush','Рисовать'],
];
const rainKit=['umbrella','boot','jacket'];
const kettleParts=['lid','spout','handle','kettle-body'];
const bikeParts=['wheel','handlebar','pedal','bike-seat'];
const cupboardParts=['door','shelf','handle','drawer'];
const diagrams={
 kettle:[[32,14,36,19],[6,42,24,25],[71,40,26,28],[34,47,36,36]],
 bike:[[6,53,34,40],[67,10,28,23],[48,53,23,26],[34,27,25,21]],
 cupboard:[[22,14,30,32],[54,14,28,29],[43,46,22,22],[28,71,46,23]],
};
const restore=(name,model,base,items)=>place('Восстанови '+name+' по образцу.',model,[...items].reverse(),
 items.map((id,index)=>['arrow',id,undefined,diagrams[base][index]]),
 {context:base,map:'assembly-board',result:{art:base,action:'turn'}});
const materials=[
 ['wood','block','Деревянный кубик'],['metal','spoon','Металлическая ложка'],['glass','glass-cup','Стеклянный стакан'],
 ['cloth','cloth-bag','Тканевая сумка'],['paper','paper-box','Бумажная коробка'],['plastic','watering','Пластмассовая лейка'],
];
const fruit=['apple','pear','plum','orange'],veg=['carrot','cucumber','potato','cabbage'];
const categories=[
 ['fruit-stand','Фрукты',fruit],['veg-stand','Овощи',veg],['shelf','Мебель',['chair','table','bed']],
 ['plate','Посуда',['kettle','bowl','cup']],['jacket','Одежда',['pants','shirt','dress']],
 ['box','Игрушки',['ball','doll','bear']],['road','Транспорт',['bike','train','car']],
];
const props=(a,b)=>visual(a,b);

export const town=lessonSet(1,[
 ['Рассказывать о назначении предметов.',[
  demo('Заглянем на кухню.',step(['kettle','cup'],'В чайнике кипятят воду, а из чашки пьют.','pour'),step(['pot','ladle'],'В кастрюле варят суп. Половником его разливают.','stir'),step(['colander','water'],'Через отверстия дуршлага стекает вода.','pour')),
  demo('Посмотрим, как взрослые работают в мастерской.',step(['adult','hammer'],'Молотком забивают гвозди.','touch'),step(['adult','brush','ruler'],'Кистью наносят краску. Линейкой измеряют длину.','draw'),step(['adult','scissors','paper'],'Ножницами режут бумагу.','touch')),
  demo('Для чего нужны эти вещи?',step(['rain','umbrella'],'Зонтик нужен для защиты от дождя.','open'),step(['adult','comb'],'Расчёской расчёсывают волосы.','groom')),
 ],
 task('Цветам нужна вода',object('Лейкой поливают цветы.','Чем можно полить цветы?','watering',['pot','watering','comb'])),
 task('Вещи в деле',match('Подбери к каждому делу нужную вещь.','Лейкой поливают, полотенцем вытирают, кистью рисуют.',use)),
 task('На прогулку под дождём',collect('Выбери вещи, которые защитят от дождя и луж.','Под дождём пригодятся зонт, куртка и сапоги.',rainKit,['book','plate'])),
 task('Объясни свой выбор',customer('Луми пролил воду. Чем её вытереть?','Воду можно вытереть тряпкой или полотенцем.',['cloth','brush','towel'],['cloth','towel'],props('lumi','water')),explain('Расскажи, чем ты уберёшь воду.','Я вытру воду полотенцем, потому что оно впитывает воду.',props('water','towel'))),
 task('Магазин полезных вещей',
  ...use.map(([context,id,label])=>customer(label+'. Что нужно покупателю?','Предмет помогает выполнить работу.',[id,'spoon',id==='brush'?'towel':'brush'],id,props('adult',context))),
  explain('Расскажи, что ты предложил покупателю.','Я предложил лейку. Из неё поливают цветы.',props('adult','watering')))],
 ['Узнавать детали и объяснять, зачем они нужны.',[
  demo('Рассмотрим чайник.',step(['kettle','kettle-body','lid'],'Корпус чайника накрывают крышкой.','close'),step(['handle','spout','cup'],'За ручку чайник держат. Через носик выливают воду.','pour')),
  demo('Рассмотрим велосипед.',step(['bike','wheel','handlebar'],'Колёса крутятся. Рулём поворачивают.','roll'),step(['bike','pedal','bike-seat'],'На сиденье сидят, а на педали нажимают ногами.','touch')),
  demo('Откроем шкаф.',step(['cupboard','door','handle'],'За ручку открывают дверцу.','open'),step(['shelf','drawer','shirt'],'Вещи лежат на полках или в ящиках.','rise')),
 ],
 task('Носик чайника',choose('Покажи носик чайника.','Вода льётся через носик.',
  [token('lid','lid',{area:[33,15,35,25]}),token('spout','spout',{area:[5,43,28,25]}),token('handle','handle',{area:[69,40,28,28]})],'spout',
  {responseMode:'parts',diagram:'kettle-diagram'})),
 task('Деталь велосипеда',part('bike-no-pedal','Велосипед без педалей. Чего не хватает?','На педали нажимают ногами.',bikeParts,'pedal')),
 task('Собери шкаф',restore('шкаф','У шкафа есть дверцы, полки, ручки и ящики.','cupboard',cupboardParts)),
 task('Зачем эта деталь?',match('Соедини детали с тем, что с их помощью делают.','За ручку держат, на сиденье сидят, крышкой накрывают.',[['hand','handle'],['box','lid'],['seat','bike-seat'],['cup','spout']])),
 task('Мастерская реставратора',restore('чайник','За ручку чайник держат.','kettle',kettleParts),restore('велосипед','У велосипеда есть руль и колёса.','bike',bikeParts),restore('шкаф','Шкаф открывают за ручку.','cupboard',cupboardParts),explain('Выбери один предмет. Назови детали и расскажи, зачем они нужны.','У чайника есть ручка. За неё его держат.',visual('kettle','bike','cupboard')))],
 ['Называть материалы и подбирать подходящие прилагательные.',[
  demo('Из дерева можно сделать игрушку.',step(['wood','block'],'Из дерева сделали кубик. Это деревянный кубик.','touch')),
  demo('Посмотрим на ложку и стакан.',step(['metal','spoon'],'Ложку сделали из металла. Она металлическая.','touch'),step(['glass','glass-cup'],'Стакан сделали из стекла. Это стеклянный стакан.','rise')),
  demo('Сравним ещё три материала.',step(['cloth','cloth-bag'],'Сумка из ткани. Это тканевая сумка.','squeeze'),step(['paper','paper-box'],'Коробку сложили из бумаги. Она бумажная.','close'),step(['plastic','watering'],'Лейку сделали из пластмассы.','pour')),
 ],
 task('Из материала в предмет',match('Вспомни, как делали вещи. Соедини материал с предметом.','Дерево, металл и стекло могут превращаться в полезные вещи.',materials.slice(0,3))),
 task('Разложи образцы',match('Положи каждую вещь к её материалу.','Тканевая сумка, бумажная коробка, пластмассовая лейка.',materials.slice(3))),
 task('Выбираем материал',choose('Из чего в нашей мастерской делают деревянный стул?','Стул сделали из дерева.',['metal','cloth','wood'],'wood',{context:'chair'})),
 task('Назови предметы вместе с материалом',explain('Как назвать каждый предмет вместе с его материалом?','Деревянный стул. Металлическая ложка. Стеклянный стакан.',visual('chair','spoon','glass-cup'))),
 task('Фабрика вещей',sayMaterial())],
 ['Объединять предметы по назначению и находить замену.',[
  demo('Из чего можно пить?',step(['cup','mug','glass-cup'],'Из чашки, кружки и стакана можно пить.','drink')),
  demo('Чем можно рисовать?',step(['pencil','marker','brush'],'Карандашом, фломастером и кистью рисуют.','draw')),
  demo('Сравним посуду.',step(['cup:rose','glass-cup','mug:blue'],'Форма, цвет и материал у них разные, но из всех этих предметов можно пить.','drink')),
 ],
 task('Выбери посуду для питья',collect('Из чего можно пить?','Можно пить из чашки, кружки или стакана.',['cup','mug','glass-cup'],['fork','book'])),
 task('Собери набор художника',collect('Найди вещи для рисования.','Карандаш, фломастер и кисть оставляют след на бумаге.',['pencil','marker','brush'],['comb','spoon'])),
 task('На столе вода',collect('Что может впитать воду? Найди два предмета.','Воду можно вытереть салфеткой или полотенцем.',['napkin','towel'],['glass-cup','fork'])),
 task('Что взять вместо чашки?',choose('Чашки нет. Из чего ещё можно попить?','Вместо чашки подойдёт кружка или стакан.',['mug','plate','glass-cup'],['mug','glass-cup'])),
 task('Магазин находчивых покупателей',
  collect('Подбери набор для питья.','Из этих предметов можно пить.',['cup','mug','glass-cup'],['spoon']),
  collect('Подбери набор для рисования.','Этими предметами можно рисовать.',['brush','pencil','marker'],['spoon']),
  collect('Подбери вещи для уборки воды.','Они впитывают воду.',['napkin','towel'],['book']),
  collect('Подбери вещи для защиты от дождя.','Зонтик и дождевик защищают от дождя.',['umbrella','jacket'],['plate']),
  explain('Расскажи, что общего у двух вещей из одного набора.','У чашки и стакана разная форма. Из них можно пить.',props('cup','glass-cup')))],
 ['Называть обобщающие понятия в знакомых ситуациях.',[
  demo('На прилавке с фруктами.',step(fruit,'Яблоко, груша, слива и апельсин — фрукты.')),
  demo('На прилавке с овощами.',step(veg,'Морковь, огурец, картофель и капуста — овощи.')),
  demo('Зайдём в другие магазины.',...categories.slice(2).map(([,word,items])=>step(items,word+'.'))),
 ],
 task('Фрукты в корзину',collect('Собери фрукты.','В корзине фрукты.',fruit,['carrot','chair'])),
 task('Два прилавка',place('Разложи овощи и фрукты по прилавкам.','Яблоко и груша — фрукты. Морковь и огурец — овощи.',['carrot','pear','apple','cucumber'],[['fruit-stand','apple','Фруктовый прилавок'],['fruit-stand','pear','Фруктовый прилавок'],['veg-stand','carrot','Овощной прилавок'],['veg-stand','cucumber','Овощной прилавок']])),
 task('Кто из другого магазина?',choose('Что здесь не посуда?','Чайник и тарелка — посуда. Стул — мебель.',['kettle','chair','plate'],'chair')),
 task('Скажи одним словом',...categories.slice(2).map(([,word,items])=>explain('Как назвать всё это одним словом?',word+'.',visual(...items)))),
 task('Большой городской рынок',
  place('Разложи покупки по трём магазинам.', 'Чашка — посуда, машинка — транспорт, кукла — игрушка.',
   ['car','doll','cup'],[['plate','cup','Посуда'],['road','car','Транспорт'],['box','doll','Игрушки']]),
  place('Разложи вещи ещё по четырём магазинам.', 'Яблоко — фрукт, капуста — овощ, куртка — одежда, стул — мебель.',
   ['jacket','apple','chair','cabbage'],[['fruit-stand','apple','Фрукты'],['veg-stand','cabbage','Овощи'],['jacket','jacket','Одежда'],['shelf','chair','Мебель']]),
  explain('Назови магазины, в которые ты положил вещи.','На рынке есть овощи и фрукты. В других магазинах есть мебель, посуда, одежда, игрушки и транспорт.',visual('fruit-stand','veg-stand','toyshop')))],
 ['Связывать несколько признаков предмета в описании.',[
  demo('Опишем кубик.',step(['block:red','block:blue:small'],'Кубик красный и большой. У него есть углы.','turn'),step(['wood','block:red'],'Кубик деревянный, его сделали из дерева.','roll')),
  demo('Опишем мишку.',step(['bear','cloth'],'Это маленький коричневый медвежонок. Он мягкий.','squeeze'),step(['lumi','bear'],'С мишкой можно играть. Его приятно обнимать.','touch')),
  demo('Расскажем по картинкам.',step(['block:red','square','wood'],'Это большой красный кубик. Он деревянный.','turn'),step(['bear','pillow','lumi'],'Мой мишка мягкий. Мне нравится играть с ним.','touch')),
 ],
 task('Предмет и цвет',explain('Назови игрушку и её цвет.','Это красный кубик.','block:red')),
 task('Форма и размер',match('Подбери форму и размер большого кубика.','У кубика квадратные грани. Этот кубик больше второго.',[['block:red','large'],['block:red','square']],['round','small'])),
 task('Откуда взялся кубик?',choose('Какой материал использовали, чтобы сделать этот кубик?','Кубик вырезали из дерева.',['glass','wood','metal'],'wood',{context:props('wood','block')})),
 task('План из четырёх карточек',place('Собери план описания кубика.','Большой красный кубик сделан из дерева. Его грани квадратные.',['wood','square','large','red'],[['red','red','Цвет'],['large','large','Размер'],['square','square','Форма'],['wood','wood','Материал']]),explain('Теперь опиши кубик по плану.','Это большой красный кубик. У него квадратные грани. Кубик деревянный.',visual('block:red','square','wood'))),
 task('Музей говорящих вещей',talk('Выбери экспонат музея. Расскажи, какой он и зачем нужен.','Мой экспонат — мягкий медвежонок. Он небольшой и коричневый. С ним можно играть.',['bear','block:red','kettle'],{chooseVisual:true,
  models:{'block:red':'Это красный деревянный кубик. Из кубиков строят башни.',kettle:'Это чайник. У него есть крышка и ручка. В чайнике кипятят воду.'}}))],
]);
function sayMaterial(){
 return talk('Выбери материал и запусти изготовление предмета. Расскажи, из чего он сделан.',
  'Из дерева сделали кубик.',materials.map(([id])=>id),{chooseVisual:true,animateSelection:true,
   modeButton:'Запустить фабрику',results:Object.fromEntries(materials.map(([id,art])=>[id,{art,action:'turn'}])),
   models:Object.fromEntries(materials.map(([id,,model])=>[id,model+'.']))});
}
