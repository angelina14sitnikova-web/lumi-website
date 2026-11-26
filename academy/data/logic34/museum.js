import {lessons,t,d,compare,pair,pairChoice,pick,pickValue,match,group,diff,spot,picture} from './builders.js';

const red='ball:red',blue='ball:blue',gold='ball:gold',green='ball:mint',redCar='car:red',car='car:blue';
const bow='bear:cream:big:bow',blueBow='bear:cream:big:blue-bow',small='ball:red:small';
const model=(sample,...other)=>pick([other[0],sample,other[1]],sample,'image','Найди точную копию.');
const sort=(...items)=>group(items,[true,false],'image','Разложи одинаковые и разные пары.',{pairs:true});
const sizes=(items,value)=>pickValue(items,'size',value,value==='big'?'Покажи большой.':'Покажи маленький.');
const sortSize=(items,box)=>group(items,[['big',box],['small',box+'::small']],'size','Разложи по размеру.');
const roof=spot('roof','Крыша',[11,10,79,34]),door=spot('door','Дверь',[43,58,17,32]);
const roofDemo=diff('house','house:cream:big:blue-roof',[roof]);
const houses=diff('house','house:cream:big:blue-roof-gold-door',[roof,door],'Найди два отличия.');
const scarves=diff('bear:cream:big:scarf','bear:cream:big:no-scarf',[spot('scarf','Шарфик',[28,60,48,28])],'Где не хватает шарфика?');
const cars=diff(car,redCar,[spot('body','Кузов',[12,26,77,43])]);
const balloons=diff('balloon:rose','balloon:rose:big:round',[spot('balloon','Форма шарика',[18,8,65,61])]);
const scenes=[
 [
  picture('#e8f0de',['house',12,12,.68],['flower',108,102,.38],['ball:red',7,104,.35]),
  picture('#e8f0de',['house:cream:big:blue-roof',12,12,.68],['flower:gold',108,102,.38],['ball:red',7,104,.35]),
  [spot('roof','Крыша',[14,12,54,22]),spot('flower','Цветок',[64,61,32,33])],
 ],
 [
  picture('#f7ebce',['basket',10,25,.53],['cup:blue',94,20,.48],['apple',59,101,.43]),
  picture('#f7ebce',['basket',10,25,.53],['cup:rose',94,20,.48],['pear',59,101,.43]),
  [spot('cup','Чашка',[57,17,40,33]),spot('fruit','Фрукт',[35,64,37,33])],
 ],
 [
  picture('#e1ecf7',['car',1,43,.59],[bow,104,12,.43],[red,77,103,.40]),
  picture('#e1ecf7',['car',1,43,.59],[blueBow,104,12,.43],[gold,77,103,.40]),
  [spot('bow','Бантик',[69,31,22,18]),spot('ball','Мяч',[47,65,35,31])],
 ],
].map(data=>diff(...data));
const color=pick([car,redCar,'triangle:gold'],red,'color','Найди такой же цвет.');
const shape=pick(['triangle:blue','circle:mint','square:red'],'circle:red','shape','Найди такую же форму.');
const size=pick(['bear','bear:cream:small','block'],small,'size','Найди такой же размер.');
const together=pick(['car:blue','car:red:small','car:blue:small'],'ball:blue:small',['color','size'],'Найди такой же цвет и размер.');

export const museum=lessons(1,[
 ['Понимать сходство и различие.',[
  d('Форма, цвет и размер совпадают.',compare(red,red)),d('Цвет у мячей разный.',compare(red,blue)),
  d('У каждой пары своя полка.',sort([red,red],[blue,gold],[car,car])),
 ],t('Одинаковая пара',pairChoice([red,blue],['bear','bear'])),t('Два шарика',compare('balloon:rose','balloon:mint')),
 t('Две полки',sort([red,red],[bow,blueBow],[redCar,redCar],[small,red])),t('Копия экспоната',model(bow,blueBow,'bear')),
 t('Музей двойников',compare(red,red),compare('balloon:gold','balloon:blue'),compare(car,car),compare(bow,blueBow),compare('apple','apple'))],
 ['Находить два одинаковых предмета.',[
  d('Среди трёх машинок найдём две одинаковые.',pair([car,redCar,car])),
  d('Смотрим на цвет бантиков.',pair([bow,blueBow,bow])),
  d('Пары остаются перед глазами.',match([red,car],[car,red])),
 ],t('Пара мячей',pair([red,blue,red])),t('Пара машинок',pair([redCar,'car:gold',car,car])),
 t('Пара бабочек',pair(['butterfly:gold:big:spots','butterfly:gold:big:dots','butterfly:blue:big:spots','butterfly:gold:big:spots'])),
 t('Три пары игрушек',match([car,'bear',red],[red,'bear',car])),
 t('Зеркальная витрина',match([bow,'butterfly:gold:big:spots',small,'car:mint','doll'],['doll',small,'car:mint',bow,'butterfly:gold:big:spots']))],
 ['Видеть изменения в крупных деталях.',[
  d('Цвет крыш изменился.',roofDemo),d('Шарфик есть только на одной картинке.',scarves),d('У сада два отличия.',scenes[0]),
 ],t('Кузов машинки',cars),t('Шарфик',scarves),t('Форма шарика',balloons),t('Два домика',houses),t('Картины с секретом',...scenes)],
 ['Сравнивать относительную величину рисунков.',[
  d('Два мяча различаются размером.',sizes([small,red],'big')),
  d('Большому мячу нужна большая коробка.',sortSize([small,red],'box')),
  d('Цвет разный, размер можно сравнить.',pick([blue,'ball:mint:small'],small,'size')),
 ],t('Большой мяч',sizes([small,red],'big')),t('Маленький медвежонок',sizes(['bear','bear:cream:small'],'small')),
 t('Две коробки',sortSize([blue,'ball:blue:small'],'box')),t('Подходящие силуэты',match([red,small],[small,red],'size','Подбери силуэты по размеру.',{silhouette:true})),
 t('Витрина великанов и малышей',sortSize(['block','ball:blue:small','bear','car:blue:small',blue,'block:gold:small'],'shelf'))],
 ['Выделять один заданный признак.',[d('У разных предметов может быть общий цвет.',color),d('Сравним форму.',shape),d('Сравним размер.',size)],
 t('Одинаковый цвет',color),t('Одинаковая форма',shape),t('Одинаковый размер',size),
 t('Три пары признаков',match([redCar],[red],'color'),match(['circle:mint'],['circle:red'],'shape'),match([small],['bear:cream:small'],'size')),
 t('Волшебная лупа признаков',pick(['apple','leaf','bear'],'car:mint','color'),pick(['triangle:gold','square:rose','circle:blue'],'triangle:rose','shape'),pick([green,'bear','block:gold:small'],'car:blue:small','size'))],
 ['Подбирать по видимому образцу.',[d('Вот точная копия машинки.',model(car,redCar,'car:mint')),d('Здесь смотрим на один признак.',color),d('Ищем совпадение цвета и размера.',together)],
 t('Копия игрушки',model('doll','bear','doll:blue')),t('Цвет образца',color),t('Форма образца',shape),t('Два признака',together),
 t('Коллекция исследователя',model('top','pyramid','block'),model(blueBow,bow,'bear'),model('butterfly:rose','butterfly:blue','flower'),model('balloon:mint','balloon:gold','balloon:rose'),model('cup','kettle','cup:mint'))],
]);
