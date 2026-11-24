import {set,token,show,move,scene,exercise,pick,choose,join,stages,keyed} from './builders.js';
import {objects,group,groups,countScene,pickGroup,count,gather,fill,compare,balance} from './counting.js';

const mixed=set('block/blue/small ball/sky/large car/green/middle bear/brown/small boat/blue/large');
const shapes=set('square/sky triangle/pink oval/green rectangle/blue circle/yellow');
const sizes=(tag,...counts)=>counts.map(n=>group(tag,n));
const oneEach=(prompt,tag,n)=>count(prompt,objects(tag,n));
const spread=(tag,n,arrangement)=>({...group(tag,n),arrangement});
const equal=(prompt,a,b,c,d,answer)=>exercise(prompt,'Составь пары на каждой карточке.',
 pick([{...a,other:b.count,otherShape:b.shape,otherSize:b.size},{...c,other:d.count,otherShape:d.shape,otherSize:d.size}],answer));
const checkSize=()=>compare('Где больше предметов?',group('ball/sky/large',2),group('ball/sky/small',4),1);
const spreadTask=(prompt,arrangement)=>count(prompt,objects('car/green',4),{arrangement});
const markError=(text,tag,number,highlight)=>scene('counting',text,objects(tag,number),{duplicate:highlight});
export const quantityNumber=keyed(3,'treasure-shop',[
 [
  [move('Отсчитаем два яблока и переложим в корзину.','apple/red apple/red','basket/yellow',[0,0]),
   move('Перекладываем кубики по одному.','block/blue block/blue block/blue block/blue','box/yellow',[0,0,0,0]),
   countScene('Нужное количество собрано. Останавливаемся.',objects('block/blue',4))],
  [gather('Возьми два яблока',objects('apple/red',4),2),fill('Положи три мяча в коробку','ball/sky',3,'box'),
   gather('Собери четыре цветка',objects('flower/pink',5),4),gather('Отсчитай пять кубиков',objects('block/blue',7),5),
   stages('Наполни три корзины',fill('Собери яблоки','apple/red',2),fill('Собери мячи','ball/sky',3),fill('Собери цветы','flower/pink',4))]
 ],
 [
  [show('Есть большие и маленькие мячи.','ball/sky/large ball/sky/large ball/sky/large ball/sky/small ball/sky/small ball/sky/small'),
   countScene('Пересчитай большие и маленькие мячи.',[...objects('ball/sky/large',3),...objects('ball/sky/small',3)]),
   scene('correspond','Каждому большому мячу — маленький. Их поровну.',sizes('ball/sky/large',3).concat(sizes('ball/sky/small',3)))],
  [oneEach('Пересчитай большие мячи','ball/sky/large',3),oneEach('Пересчитай маленькие кубики','block/blue/small',4),
   equal('Где поровну больших и маленьких мячей?',group('ball/sky/large',3),group('ball/sky/small',2),group('ball/sky/large',3),group('ball/sky/small',3),1),
   gather('Собери четыре игрушки',mixed,4),checkSize()]
 ],
 [
  [countScene('Здесь три круга.',objects('circle/sky',3)),countScene('Здесь тоже три, но это треугольники.',objects('triangle/sky',3)),countScene('Посчитаем пять разных фигур.',shapes)],
  [oneEach('Пересчитай квадраты','square/sky',3),oneEach('Определи количество треугольников','triangle/pink',4),count('Пересчитай смешанную группу',shapes),
   equal('Где поровну кругов и треугольников?',group('circle/sky',3),group('triangle/sky',3),group('circle/sky',3),group('triangle/sky',2),0),
   gather('Собери пять предметов разных форм',shapes,5)]
 ],
 [
  [countScene('Четыре игрушки стоят в ряд.',objects('car/green',4)),countScene('Разложим те же игрушки по кругу.',objects('car/green',4),{arrangement:'ring'}),countScene('Раздвинем игрушки. Их всё равно четыре.',objects('car/green',4),{arrangement:'loose'})],
  [spreadTask('Пересчитай ряд','row'),spreadTask('Пересчитай игрушки по кругу','ring'),spreadTask('Пересчитай разбросанные игрушки','loose'),
   exercise('Найди столько же игрушек, сколько на образце','Расположение может отличаться.',pick([spread('car/green',4,'ring'),spread('car/green',3,'loose')],0,spread('car/green',4,'row'))),
   stages('Проверь количество до и после перемещения',spreadTask('До перемещения','row'),spreadTask('После перемещения','loose'))]
 ],
 [
  [scene('correspond','По три игрушки: у каждой есть пара.',groups('bear/brown',3,3)),
   scene('balance','Добавили ещё одну игрушку в нижний ряд.',groups('bear/brown',3,3),{action:'add'}),
   scene('correspond','У четырёх предметов остаются два без пары.',groups('block/blue',2,4))],
  [pickGroup('Найди столько же игрушек','bear/brown',[4,3,2],1),compare('Где больше?',group('block/blue',2),group('block/blue',4),1),
   compare('Где меньше?',group('ball/sky',5),group('ball/sky',4),1),balance('Сделай группы равными',group('berry/pink',4),group('berry/pink',3),'add'),
   stages('Сравни три пары групп',compare('Где больше яблок?',group('apple/red',2),group('apple/red',3),1),
    compare('Где меньше мячей?',group('ball/sky',4),group('ball/sky',3),1),compare('Где больше цветов?',group('flower/pink',5),group('flower/pink',4),0))]
 ],
 [
  [countScene('Пересчитаем четыре яблока.',objects('apple/red',4)),markError('Второе яблоко ошибочно отметили ещё раз.', 'apple/red',4,1),
   countScene('Проверяем снова: у каждого яблока только одна отметка.',objects('apple/red',4))],
  [oneEach('Проверь количество трёх игрушек','bear/brown',3),
   choose('Найди пропущенный кубик','markedCube block/blue markedCube',1,'block/blue'),
   oneEach('Исправь двойной пересчёт: считай заново','apple/red',4),
   pickGroup('Проверь, какая корзина наполнена по образцу','berry/pink',[4,5,3],1,5),
   stages('Проверь пять групп',oneEach('Яблоки','apple/red',1),oneEach('Ягоды','berry/pink',2),oneEach('Кубики','block/blue',3),oneEach('Мячи','ball/sky',4),oneEach('Цветы','flower/pink',5))]
 ],
]);
