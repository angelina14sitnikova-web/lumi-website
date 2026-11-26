import {lessons,t,d,odd} from './builders.js';

const color=(items,extra={})=>odd(items,'color','Что отличается по цвету?',extra);
const form=(items,extra={})=>odd(items,'shape','Что отличается по форме?',extra);
const size=(items,extra={})=>odd(items,'size','Что отличается по размеру?',extra);
const kinds=(items,extra={})=>odd(items,'category','Какой предмет из другой группы?',extra);
const put=items=>kinds(items,{rehome:true,options:['toy','fruit','dish','clothes','animal']});
const redBalls=['ball:red','ball:blue','ball:red'];
const cars=['car:mint','car:gold','car:mint'];
const squares=['square:blue','triangle:blue','square:blue'];
const round=['circle:rose','square:rose','circle:rose'];
const smallBall=['ball:blue:small','ball:blue','ball:blue'];
const bigBlock=['block:gold:small','block:gold:small','block:gold'];
const toyApple=['ball','apple','car'],toyCup=['cup','car','ball'],toyHat=['car','bear','hat'];
const fruitCar=['apple','car','pear'],coatApple=['scarf','boot','apple'],dishToy=['car','cup','plate'],animalCup=['cat','cup','duck'];
const colorChoice=color(redBalls,{reason:true,options:['red','blue','gold']});
const shapeChoice=form(round,{reason:true,options:['circle','square','triangle']});
const sizeChoice=size(smallBall,{reason:true,options:['small','big']});
const groupChoice=kinds(fruitCar,{reason:true,options:['toy','fruit','clothes']});

export const detectives=lessons(4,[
 ['Выделять единственный отличающийся цвет.',[
  d('Два красных мяча и один голубой.',color(redBalls)),
  d('У двух предметов цвет одинаковый.',color(cars)),
  d('Сравниваем цвет, даже когда формы разные.',color(['square:red','circle:mint','triangle:red'])),
 ],t('Голубой мяч',color(redBalls)),t('Жёлтая машинка',color(cars)),
 t('Предмет другого цвета',color(['block:gold','block:gold','block:blue'])),
 t('Цвет фигур',color(['square:red','circle:mint','triangle:red'])),
 t('Цветные загадки',color(['bear:rose','bear:blue','bear:blue']),color(['doll:red','doll:red','doll:gold']),
 color(['balloon:rose','balloon:mint','balloon:rose']),color(['triangle:blue','square:gold','circle:gold']),
 color(['square:mint','circle:mint','triangle:rose','square:mint']))],
 ['Находить единственную отличающуюся форму.',[
  d('Два круга рядом с квадратом.',form(round)),d('Треугольник отличается формой.',form(squares)),
  d('У разных по цвету фигур может быть одна форма.',form(['circle:gold','square:rose','circle:blue'])),
 ],t('Квадрат среди кругов',form(round)),t('Треугольник среди квадратов',form(squares)),t('Чужая фигура',form(['triangle:red','triangle:red','circle:red'])),
 t('Форма разноцветных фигур',form(['square:gold','circle:blue','circle:mint'])),
 t('Геометрические загадки',form(['square:red','square:blue','oval:mint']),form(['oval:blue','circle:blue','oval:blue']),
 form(['triangle:mint','square:blue','triangle:rose']),form(['triangle:gold','circle:blue','circle:mint']),form(['square:rose','square:blue','triangle:mint','square:mint']))],
 ['Выделять отличающийся размер среди двух групп.',[
  d('Один мяч меньше остальных.',size(smallBall)),d('Найдём один большой кубик.',size(bigBlock)),
  d('Лишний по размеру бывает и большой, и маленький.',size(['bunny:cream:small','bunny','bunny'])),
 ],t('Маленький мяч',size(smallBall)),t('Большой кубик',size(bigBlock)),
 t('Размер игрушки',size(['top:red','top:red:small','top:red'])),
 t('Величина фигур',size(['triangle:rose:small','triangle:rose:small','triangle:rose'])),
 t('Загадки великанов и малышей',size(['circle:gold:small','circle:gold','circle:gold']),
 size(['square:blue:small','square:blue','square:blue:small']),size(['bear','bear:cream:small','bear']),
 size(['car:mint:small','car:mint:small','car:mint']),size(['block:blue','block:blue','block:blue','block:blue:small']))],
 ['Находить предмет другой группы среди игрушек.',[
  d('У мяча и машинки общее назначение. Яблоко — фрукт.',kinds(toyApple)),
  d('Перенесём яблоко в отдел фруктов.',put(toyApple)),
  d('Шапка здесь из другой группы.',kinds(toyHat)),
 ],t('Фрукт среди игрушек',kinds(toyApple)),t('Чашка на игрушечной полке',kinds(toyCup)),
 t('Одежда среди игрушек',kinds(toyHat)),t('Игрушечная витрина',kinds(['pyramid','car','spoon','doll'])),
 t('Перепутанный магазин',put(toyApple),put(toyCup),put(toyHat),put(['doll','pear','ball']),put(['bear','mitten','block']))],
 ['Узнавать знакомые смысловые категории.',[
  d('Машинка не в группе фруктов.',kinds(fruitCar)),d('Найдём предмет, который не надевают.',kinds(coatApple)),
  d('Чашка из группы посуды.',put(animalCup)),
 ],t('Фруктовая полка',kinds(fruitCar)),t('Одежда на полке',kinds(coatApple)),t('Разложи посуду',kinds(dishToy)),
 t('Кто не животное?',kinds(animalCup)),t('Городские загадки',put(fruitCar),put(coatApple),put(dishToy),put(animalCup),put(['banana','pear','plate','plum']))],
 ['Выбирать основание решения на картинке.',[
  d('Выберем предмет и покажем общий цвет остальных.',colorChoice),d('Покажем общую форму оставшихся.',shapeChoice),
  d('Посмотрим, что изменится, если выбрать другое правило.',form(['circle:red','circle:blue','square:red'],{reason:true,options:['circle','square']})),
 ],t('Общий цвет',colorChoice),t('Общая форма',shapeChoice),t('Общая величина',sizeChoice),
 t('Общая группа',groupChoice),t('Главная загадка детектива',colorChoice,shapeChoice,sizeChoice,groupChoice,
 kinds(['cup','hat','spoon','bowl'],{reason:true,options:['clothes','dish','fruit']}))],
]);
