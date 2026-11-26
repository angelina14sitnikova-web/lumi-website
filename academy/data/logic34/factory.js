import {lessons,t,d,group,pickValue,r} from './builders.js';

const red=['ball:red','car:red','block:red'],blue=['ball:blue','car:blue','block:blue'],gold=['ball:gold','car:gold','block:gold'];
const circles=['circle:red','circle:blue:small','circle:gold'];
const squares=['square:blue','square:gold:small','square:mint'];
const triangles=['triangle:blue','triangle:mint:small','triangle:red'];
const basics=['ball:red','ball:red:small','ball:blue:small','ball:blue'];
const bears=['bear:cream:small','bear:cream','bear:rose:small','bear:rose'];
const blocks=['block:gold','block:gold:small','block:blue','block:blue:small'];
const clothes=['hat','scarf','boot','shirt'],dishes=['cup','plate','spoon','kettle'];
const fruit=['apple','pear','banana','plum'],toys=['car','bear','ball','doll'];
const code=['circle:red','square:blue','square:red','circle:blue'];
const color=(items,values,partial=false)=>group(items,values,'color','Разложи по цвету.',{partial});
const form=(items,values,partial=false)=>group(items,values,'shape','Разложи по форме.',{partial});
const size=(items,values)=>group(items,values.map(v=>[v,'box::'+v]),'size','Разложи по размеру.',{partial:values.length===1});
const category=(items,values,partial=false)=>group(items,values,'category','Размести предметы по группам.',{partial});
const big=items=>size(items,['big']),small=items=>size(items,['small']);
const change=[color(code,['red','blue']),form(code,['square','circle'])];
const switchRule=[change[0],{...change[1],ruleChange:true,prompt:'Новое правило. Те же предметы теперь разложи по форме.'}];
export const factory=lessons(2,[
 ['Объединять предметы одного цвета.',[
  d('Красный мяч отправляется к красным игрушкам.',color([red[0],blue[0]],['red'],true)),
  d('Форма разная, цвет общий.',color([red[1],red[0],blue[1]],['red'],true)),
  d('Для каждого цвета своя корзина.',color([red[2],blue[1],red[0]],['red','blue'])),
 ],t('Красные предметы',color([red[0],blue[0],red[1]],['red'],true)),
 t('Синие игрушки',color([gold[0],blue[1],red[0],blue[0]],['blue'],true)),t('Две корзины',color([red[2],gold[1],gold[0],red[0]],['red','gold'])),
 t('Цвет у разных форм',color(['triangle:red:small','circle:red','square:mint','square:red:small'],['red'],true)),
 t('Цветная фабрика',color([red[0],blue[1],gold[2],red[2],blue[0],gold[1],red[1],blue[2]],['red','blue','gold']))],
 ['Сортировать фигуры по форме.',[
  d('Цвет кругов разный. Форма одна.',form([...circles,squares[0]],['circle'],true)),
  d('Большой и маленький квадрат в одной группе.',form([...squares,triangles[0]],['square'],true)),
  d('Круги, квадраты и треугольники идут каждый в свой контейнер.',form([triangles[1],circles[0],squares[1]],['circle','square','triangle'])),
 ],t('Все круги',form([circles[0],squares[0],circles[1]],['circle'],true)),
 t('Собери квадраты',form([squares[0],triangles[1],squares[1]],['square'],true)),
 t('Круги и треугольники',form([...circles,...triangles.slice(0,2)],['circle','triangle'])),
 t('Разноцветные фигуры',form([...squares.slice(0,2),...circles.slice(0,2)],['square','circle'])),
 t('Фабрика фигур',form([circles[0],squares[1],triangles[1],circles[1],squares[0],triangles[0],circles[2]],['circle','square','triangle']))],
 ['Собирать крупные рисунки по видимому образцу.',[
  d('Один мяч больше другого.',pickValue(basics.slice(0,2),'size','big','Покажи большой мяч.')),
  d('Большие игрушки помещаются на отдельную полку.',big([basics[1],basics[0],bears[1]])),
  d('На большой полке игрушки разных цветов.',big(basics)),
 ],t('Большие мячи',big(basics)),t('Большие медвежата',big(bears)),t('Большие кубики',big(blocks)),
 t('Две величины',big(['circle:blue:small','circle:blue','square:blue','square:blue:small'])),
 t('Склад великанов',big([basics[0],bears[0],bears[1],blocks[1],blocks[2],basics[2]]))],
 ['Группировать маленькие предметы.',[
  d('Покажем маленькую игрушку.',pickValue(basics.slice(0,2),'size','small','Найди маленькую.')),
  d('Маленькие игрушки бывают разных цветов.',small(basics)),
  d('У каждого размера своя коробка.',size(bears,['big','small'])),
 ],t('Маленькие шарики',small(['balloon:rose','balloon:rose:small','balloon:mint:small'])),
 t('Маленькие машинки',small(['car:blue:small','car:blue','car:red:small','car:red'])),
 t('Ячейки для кубиков',small(blocks)),t('Две группы игрушек',size([...basics,...bears.slice(0,2)],['big','small'])),
 t('Мастерская малышей',size([...blocks,...bears],['small','big']))],
 ['Объединять предметы в знакомые группы.',[
  d('Яблоко, груша и банан — фрукты.',category([...fruit.slice(0,3),'cup'],['fruit'],true)),
  d('Чашка, тарелка и ложка относятся к посуде.',category([...dishes.slice(0,3),'bear'],['dish'],true)),
  d('Игрушки, одежда и посуда разложены по разным местам.',category(['car','cup','hat','bear'],['toy','dish','clothes'])),
 ],t('Корзинка фруктов',category([...fruit.slice(0,3),'car'],['fruit'],true)),
 t('Ящик игрушек',category([...toys.slice(0,3),'cup'],['toy'],true)),
 t('Одежда и посуда',category([...clothes.slice(0,2),...dishes.slice(0,2)],['dish','clothes'])),
 t('Кто подходит?',pickValue(['book','pear','hat'],'category','fruit','Что относится к фруктам?')),
 t('Магазин коллекций',category(['apple','car','hat','cup','pear','bear','boot','spoon'],['toy','fruit','clothes','dish']))],
 ['Менять правило после сортировки того же набора.',[
  d('Сначала по цвету.',change[0]),d('Теперь сортируем те же фигуры по форме.',switchRule[1]),
  d('Те же фигуры можно разложить иначе.',size(['circle:red:small','circle:red','square:blue:small','square:blue'],['big','small'])),
 ],t('Правило цвета',color([red[0],blue[0],red[2]],['red','blue'])),t('Правило формы',form([circles[0],triangles[0],triangles[1]],['circle','triangle'])),
 t('Правило размера',size(basics,['big','small'])),t('Смысловые отделы',category([clothes[3],dishes[2],fruit[2],toys[2]],['toy','fruit','clothes','dish'])),
 t('Волшебный сортировщик',...switchRule)],
]);
