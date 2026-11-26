import {lessons,t,d,match} from './builders.js';

const fit=(a,b,rule,extra)=>match(a,b,rule,{image:'Соедини одинаковые картинки.',color:'Соедини по цвету.',shape:'Соедини по форме.',size:'Соедини по размеру.',part:'Верни детали к предметам.'}[rule],extra);
const exact=(a,b)=>fit(a,b,'image');
const color=(a,b)=>fit(a,b,'color');
const shape=(a,b)=>fit(a,b,'shape',{silhouette:true});
const size=(a,b)=>fit(a,b,'size',{silhouette:true});
const part=(a,b)=>fit(a,b,'part');
const ball=exact(['ball'],['ball:blue','ball']);
const wing=exact(['butterfly:blue:big:spots'],['butterfly:blue:big:dots','butterfly:blue:big:spots']);
const glow=color(['butterfly:red'],['flower:blue','flower:red']);
const round=shape(['circle:mint'],['square:red','circle:gold']);
const cover=size(['lid:mint','lid:mint:small'],['box:cream']);
const wheel=part(['wheel','ear'],['car:blue:big:no-wheel']);
const lid=part(['handle','lid'],['kettle:mint:big:no-lid']);
const handle=part(['petal','handle'],['cup:rose:big:no-handle']);
export const garden=lessons(3,[
 ['Соотносить одинаковые рисунки.',[
  d('Яблоко к такому же яблоку.',exact(['apple'],['apple','pear'])),
  d('У одинаковых машинок совпадает цвет.',exact(['car'],['car:red','car'])),
  d('Соединим несколько пар, все картинки остаются видны.',exact(['ball','bear','car'],['bear','car','ball'])),
 ],t('Пара для мяча',ball),t('Одинаковая бабочка',wing),t('Две пары',exact(['car','flower'],['flower','car'])),
 t('Три пары',exact(['plate','cup','spoon'],['cup','spoon','plate'])),
 t('Сад двойников',exact(['butterfly:blue:big:spots','butterfly:blue:big:dots','butterfly:mint:big:spots','butterfly:mint:big:dots'],['butterfly:mint:big:dots','butterfly:blue:big:dots','butterfly:blue:big:spots','butterfly:mint:big:spots']))],
 ['Соотносить разные предметы общего цвета.',[
  d('Красная бабочка и красный цветок.',glow),d('Голубая игрушка и голубая коробка.',color(['car:blue'],['box:red','box:blue'])),
  d('У разных предметов бывает общий цвет.',color(['flower:mint','balloon:gold','butterfly:rose'],['ribbon:rose','box:mint','car:gold'])),
 ],t('Цветок и бабочка',glow),t('Шарик и ленточка',color(['balloon:rose'],['ribbon:mint','ribbon:rose'])),
 t('Цветные коробки',color(['car:red','ball:blue'],['box:blue','box:red'])),
 t('Три цветовые пары',color(['ball:mint','car:gold','flower:purple'],['box:purple','ribbon:mint','balloon:gold'])),
 t('Радужный сад',color(['ball:red','ball:blue','car:mint','balloon:gold','bear:rose'],['box:rose','ribbon:blue','flower:gold','doll:red','leaf:mint']))],
 ['Соотносить формы с крупными силуэтами.',[
  d('Посмотри, оба рисунка круглые.',round),d('Квадрат помещается в квадратное место.',shape(['square:red'],['triangle:mint','square:gold'])),
  d('Цвет здесь не мешает подобрать форму.',shape(['ball:red','block:gold','top:mint'],['triangle:blue','circle:blue','square:blue'])),
 ],t('Пара для круга',round),t('Квадратный силуэт',shape(['square:rose'],['circle:blue','square:blue'])),
 t('Два треугольника',shape(['triangle:gold'],['square:red','triangle:mint'])),
 t('Предметы и силуэты',shape(['ball','block','top'],['square','triangle','circle'])),
 t('Геометрический сад',shape(['oval:mint:small','triangle:rose','circle:gold:small','square:red'],['square:gray:small','circle:gray','oval:gray','triangle:gray:small']))],
 ['Подбирать пару по величине.',[
  d('К большой коробке подходит большая крышка.',cover),
  d('У маленькой игрушки маленький силуэт.',size(['bear:cream:small','bear'],['bear:cream:small'])),
  d('У каждого размера своя ячейка.',size(['ball:blue','ball:blue:small'],['ball:gray:small','ball:gray'])),
 ],t('Крышка для коробки',cover),t('Силуэт игрушки',size(['car:blue','car:blue:small'],['car:gray:small'])),
 t('Два углубления',size(['ball:red:small','ball:red'],['ball:gray','ball:gray:small'])),
 t('Три образца',size(['block:blue:medium','block:blue','block:blue:small'],['block:gray','block:gray:small','block:gray:medium'])),
 t('Домики для игрушек',size(['car:blue','bear:cream:medium','block:gold:small'],['box:gray:small','box:gray','box:gray:medium']))],
 ['Находить характерную часть предмета.',[
  d('У машинки есть колесо.',wheel),d('Крышка закрывает чайник.',lid),d('Ручка снова на чашке.',handle),
 ],t('Колесо машинки',wheel),t('Крышка чайника',lid),t('Ручка чашки',handle),
 t('Три детали',part(['handle','wheel','ear'],['bear:cream:big:no-ear','cup:rose:big:no-handle','car:blue:big:no-wheel'])),
 t('Мастерская потерянных деталей',wheel,lid,handle,part(['handle','roof'],['house:cream:big:no-roof']),part(['ear','petal'],['flower:rose:big:no-petal']))],
 ['Подбирать пару по разным правилам.',[
  d('Перед нами точная копия.',wing),d('По цвету и форме ищем по разным признакам.',glow),d('Предмету можно подобрать часть.',wheel),
 ],t('Одинаковые картинки',exact(['car'],['car:gold','car','car:blue:small','car:red'])),
 t('Цветовая пара',glow),t('Форма пары',round),t('Пара по размеру',cover),
 t('Волшебный мост дружбы',ball,glow,round,cover,handle)],
]);
