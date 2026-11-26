import {lessons,t,d,r,match,picture} from './builders.js';

const sizes={twoVertical:2,twoHorizontal:2,threeVertical:3,threeHorizontal:3,curved:2,shaped:3,four:4};
export function puzzle(picture,layout,support=true,extra={}){
 const count=sizes[layout];
 const items=count===2?[1,0]:count===3?[2,0,1]:[2,0,3,1];
 return r('puzzle','Положи каждый фрагмент на его место.',{items,slots:Array.from({length:count},(_,piece)=>({piece})),
 picture,layout,support,...extra});
}
const moment=(accepts,area)=>({accepts:[].concat(accepts),area});
function construct(result,items,slots,picture,preview=result){
 return r('construct','Установи детали, чтобы собрать предмет.',{result,items,slots,picture,preview});
}
export const repairCar=construct('car',['wheel','petal','lid'],[moment('wheel',[19,55,22,28])],'car:blue:big:no-wheel');
const repairEar=construct('bear',['ear','window','lid'],[moment('ear',[21,13,20,27])],'bear:cream:big:no-ear');
export const repairCup=construct('cup',['handle','wheel','bow'],[moment('handle',[65,37,29,32])],'cup:rose:big:no-handle');
const repairFlower=construct('flower',['petal','window','wheel'],[moment('petal',[40,11,20,30])],'flower:rose:big:no-petal');
const repairHouse=construct('house',['roof','lid','wheel'],[moment('roof',[9,12,79,35])],'house:cream:big:no-roof');
const fixers=[repairCar,repairEar,repairCup,repairFlower,repairHouse];
export const buildCar=construct('car',['wheel','body','wheel'],
 [moment('body',[8,20,83,52]),moment('wheel',[17,58,24,25]),moment('wheel',[61,58,24,25])]);
const buildBear=construct('bear',['paw','head','bearBody','paw'],
 [moment('head',[27,12,45,35]),moment('bearBody',[25,41,50,40]),moment('paw',[15,67,24,25]),moment('paw',[62,67,24,25])]);
const buildTower=construct('pyramid',['ring:mint:medium','base','ring:rose:small','ring:gold'],
 [moment('base',[17,73,66,15]),moment('ring:gold',[21,57,58,20]),moment('ring:mint:medium',[28,43,44,20]),moment('ring:rose:small',[35,28,30,22])]);
export const buildHouse=construct('house',['wall','roof'],[moment('wall',[16,42,68,47]),moment('roof',[10,9,80,42])]);
const socket=(shape,others)=>match([shape,...others],[shape+':gray'],['shape','size'],'Поставь деталь в подходящее углубление.',{silhouette:true});
const paintings=[
 picture('#e3ebfa',['house',23,12,.70],['bunny',107,100,.40],['flower',6,103,.40]),
 picture('#ede2f4',['butterfly:rose:big:spots',2,15,.68],['flower',100,83,.45],['flower:gold',17,107,.38]),
 picture('#e4f1e6',['bear',8,14,.64],['ball:gold',100,69,.44],['flower',4,103,.38]),
];
export const castle=lessons(5,[
 ['Соединять две крупные части изображения.',[
  d('Посмотри на целое яблоко и две его половинки.',puzzle('apple','twoVertical')),
  d('Две половинки соединяются в целый рисунок.',puzzle('apple','twoHorizontal')),
  d('Луми проверяет по целому образцу.',puzzle('car','curved')),
 ],t('Две половинки яблока',puzzle('apple','twoVertical')),t('Мяч',puzzle('ball','twoHorizontal')),
 t('Бабочка',puzzle('butterfly:purple:big:spots','curved')),t('Машинка по образцу',puzzle('car','twoVertical')),
 t('Первые картины замка',puzzle('house','twoHorizontal'),puzzle('pear','twoVertical'),puzzle('flower','twoHorizontal'),
 puzzle('bear','curved'),puzzle('duck','twoVertical'))],
 ['Складывать целое из трёх крупных фрагментов.',[
  d('Посмотри, как выглядит целый домик.',puzzle('house','threeHorizontal')),
  d('Три части подходят друг к другу.',puzzle('house','shaped')),
  d('Проверим каждую часть по целой картине.',puzzle('flower','threeVertical')),
 ],t('Цветок',puzzle('flower','threeHorizontal')),t('Машинка',puzzle('car','threeVertical')),
 t('Медвежонок',puzzle('bear','threeVertical')),t('Домик и фигурные части',puzzle('house','shaped')),
 t('Галерея замка',puzzle('butterfly','threeHorizontal'),puzzle('cup','threeVertical',false),puzzle(paintings[0],'shaped',false))],
 ['Замечать пропавшую часть целого предмета.',[
  d('Сравним целую машинку и машинку без колеса.',repairCar),d('Медвежонку нужно второе ушко.',repairEar),
  d('Вернём деталь на её место.',repairCup),
 ],t('Колесо машинки',repairCar),t('Ушко медвежонка',repairEar),t('Ручка чашки',repairCup),t('Лепесток',repairFlower),t('Мастерская потерянных деталей',...fixers)],
 ['Сопоставлять форму и размер детали с углублением.',[
  d('Круглое углубление подходит кругу.',socket('circle',['square','triangle'])),
  d('Квадрат и треугольник занимают разные места.',match(['square','triangle'],['triangle:gray','square:gray'],'shape','Установи фигуры.',{silhouette:true})),
  d('Фрагмент возвращается на своё место в картине.',puzzle('flower','twoVertical')),
 ],t('Круглое отверстие',socket('circle',['square','triangle'])),t('Квадратное углубление',socket('square',['circle','triangle'])),
 t('Углубление для треугольника',socket('triangle',['circle','square'])),t('Пропавший фрагмент',puzzle(paintings[1],'twoHorizontal')),
 t('Волшебный витраж',match(['triangle:rose','square:red','circle:blue','oval:mint'],['circle:gray','oval:gray','triangle:gray','square:gray'],['shape','size'],'Заполни все углубления.',{silhouette:true}))],
 ['Собирать игрушку с учётом расположения её частей.',[
  d('У пирамидки есть основание и кольца.',buildTower),d('Корпус сверху, колёса снизу.',buildCar),d('Крыша подходит к стенам домика.',buildHouse),
 ],t('Машинка из деталей',buildCar),t('Игрушечный медвежонок',buildBear),t('Пирамидка',buildTower),t('Игрушечный домик',buildHouse),
 t('Фабрика игрушек',buildCar,buildTower,buildHouse)],
 ['Объединять фрагменты в сюжетную картину.',[
  d('Найдём друг к другу две части.',puzzle('ball','twoHorizontal')),d('Теперь вместе три части.',puzzle('bear','threeHorizontal')),
  d('Добавим детали к картине.',puzzle(paintings[1],'threeVertical')),
 ],t('Две детали картины',puzzle('duck','twoVertical')),t('Три фрагмента',puzzle('butterfly','threeHorizontal',false)),
 t('Особая деталь',repairFlower),t('Картинка с зайчиком',puzzle(paintings[0],'four',true)),
 t('Главная картина замка',puzzle(paintings[2],'four',true))],
]);
