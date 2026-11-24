import {keyed56} from './counting.js';
import {num,match} from './digits.js';
import {objects,group,groups,count,countScene,pickGroup,gather,compare,balance} from '../math45/counting.js';
import {token,set,show,scene,exercise,pick,connect,choose,stages} from '../math45/builders.js';
const tag='crystal/sky';
const gs=(n,extras={})=>group(tag,n,extras);
const compareTwo=(prompt,a,b,answer)=>compare(prompt,gs(a),gs(b),answer);
const pair=(text,a,b)=>scene('correspond',text,[gs(a),gs(b)]);
const same=(prompt,left,right,answer=0)=>exercise(prompt,'Сравни каждый ряд с образцом.',pick(left,answer,right));
const equalSets=(prompt,n,wrong)=>exercise(prompt,'Найди карточку, где всем хватило пары.',pick([
 {...gs(n),other:n},{...gs(n),other:wrong}],0));
const addOrRemove=(prompt,a,b,action)=>balance(prompt,gs(a),gs(b),action);
const makeEqual=(prompt,target,current)=>{
 const actions=[];
 while(current<target){actions.push(addOrRemove('Добавь один предмет',target,current,'add'));current++;}
 while(current>target){actions.push(addOrRemove('Убери лишний предмет',target,current,'remove'));current--;}
 return stages(prompt,...actions);
};
const relation=(prompt,pairs)=>stages(prompt,...pairs.map(([n,m],i)=>n===m?equalSets('Где поровну?',n,n-1):compareTwo(i%2?'Найди меньшую группу':'Найди большую группу',n,m,i%2?+(n>m):+(n<m))));
const compareSize=(prompt,n,m,answer)=>compare(prompt,group('ball/sky/large',n),group('ball/sky/small',m),answer);
const ranked=(prompt,n,m,answer)=>exercise(prompt,'Подбери карточку по количеству.',pick([num(n),num(m)],answer,null,{cues:[gs(n),gs(m)],ordinal:true}));
export const comparing=keyed56(5,'balance-kingdom',[
 [[pair('Сопоставим по пять предметов. Всем хватило пары.',5,5),scene('balance','Добавим один предмет. Снизу стало больше.',[gs(5),gs(5)],{action:'add'}),pair('Там, где остаются предметы без пары, их больше.',5,6)],
 [equalSets('Найди две равные группы',5,6),compareTwo('Где больше кристаллов?',5,6,1),compareTwo('Где меньше кристаллов?',6,4,1),
 relation('Сравни три пары',[ [4,4],[6,7],[8,7] ]),makeEqual('Распредели сокровища поровну',6,5)]],
 [[countScene('Пересчитаем группы из шести и восьми предметов.',[gs(6),gs(8)]),pair('У восьми два предмета останутся без пары.',6,8),pair('Сравним девять и десять.',9,10)],
 [compareTwo('Где игрушек больше?',6,7,1),compareTwo('Где меньше?',8,10,0),equalSets('Найди равные группы из девяти',9,10),
 relation('Сравни три пары',[[7,6],[9,10],[9,9]]),match('Подбери числа к пяти корзинам',[8,6,10,7,9],[6,7,8,9,10],tag)]],
 [[countScene('В ряду восемь кристаллов.',objects(tag,8)),countScene('Раздвинем те же кристаллы.',objects(tag,8),{arrangement:'loose'}),pair('Пересчёт подтверждает: их по-прежнему поровну.',8,8)],
 [same('Выбери ряд, где столько же кристаллов',[gs(8,{arrangement:'loose'}),gs(7)],gs(8)),count('Пересчитай после перемещения',objects(tag,8),{arrangement:'loose'}),
 equalSets('Где поровну?',7,8),same('Где количество изменилось?',[gs(6),gs(8,{arrangement:'loose'})],gs(8)),relation('Проверь четыре сравнения',[[6,6],[8,7],[8,8],[9,10]])]],
 [[show('Большие и маленькие шары различаются по размеру.','ball/sky/large ball/sky/small'),scene('correspond','Сравним шесть больших и шесть маленьких шаров.',[group('ball/sky/large',6),group('ball/sky/small',6)]),
 scene('correspond','Сравним четыре больших и восемь маленьких.',[group('ball/sky/large',4),group('ball/sky/small',8)])],
 [same('Найди столько же маленьких мячей',[group('ball/sky/small',6),group('ball/sky/small',7)],group('ball/sky/large',6)),
 compareSize('Где больше предметов?',4,8,1),stages('Пересчитай обе группы',count('Большие мячи',objects('ball/sky/large',6)),count('Маленькие мячи',objects('ball/sky/small',6))),
 compareSize('Исправь ошибку: сравни количество',5,8,1),
 stages('Сравни пять пар',...[6,7,8,9,10].map(n=>compareSize('Где предметов больше?',n-2,n,1)))]],
 [[scene('correspond','Шесть яблок и семь корзинок.',[group('apple/red',6),group('basket/yellow',7)]),
 scene('balance','Добавим яблоко и уравняем группы.',[group('basket/yellow',7),group('apple/red',6)],{action:'add'}),
 scene('balance','Можно и убрать лишнюю корзинку.',[group('apple/red',6),group('basket/yellow',7)],{action:'remove'})],
 [makeEqual('Добавь один предмет',7,6),makeEqual('Убери лишний предмет',7,8),makeEqual('Уравняй пять и семь',5,7),
 stages('Найди два способа уравнять восемь и девять',makeEqual('Добавь к меньшей группе',9,8),makeEqual('Убери из большей группы',8,9)),
 stages('Подготовь угощение поровну',makeEqual('Для шести гостей',6,5),makeEqual('Для восьми гостей',8,9))]],
 [[pair('Шесть на один больше пяти.',5,6),scene('balance','Добавим один и получим следующее число.',[gs(7),gs(6)],{action:'add'}),pair('Соседние числа: восемь и девять, девять и десять.',9,10)],
 [ranked('Выбери большее число',4,5,1),ranked('Выбери меньшее число',7,8,0),compareTwo('В каком ряду один предмет без пары?',8,9,1),
 ranked('Найди число на один больше шести',6,7,1),
 stages('Сравни соседние числа',...[4,5,6,8,9].map(n=>ranked('Какое число больше?',n,n+1,1)))]],
]);

const home='unit-houses';
const loot=set('star/yellow pearl/sky crystal/pink flower/green shell/pink');
const build=(prompt,n,tag='crystal/sky')=>gather(prompt,objects(tag,n+1),n);
const windowRow=n=>objects('window',n);
const windows=(prompt,n,tag='crystal/sky')=>exercise(prompt,'Помести по одному предмету в каждое окошко.',
 connect(objects(tag,n),windowRow(n),Array.from({length:n},(_,i)=>i),{sample:num(n),interchangeable:true}));
const shift=(n)=>scene('move','Один предмет в каждом окошке.',objects(tag,n),{targets:windowRow(n),matches:Array.from({length:n},(_,i)=>i)});
const assembled=(n)=>[countScene('У каждого предмета свой цвет и своё место.',loot.slice(0,n)),countScene('Соберём отдельные предметы в одну группу.',objects(tag,n)),shift(n)];
export const unitHouses=keyed56(6,home,[
 ...[2,3,4,5].map(n=>[assembled(n),[
 build('Собери предметы по одному',n),windows('Заполни окошки домика',n),
 makeEqual('Добавь недостающий предмет',n,n-1),
 n===4?makeEqual('Убери лишний предмет',4,5):equalSets('Найди правильную модель',n,n+1),
 n===2||n===3?windows('Восстанови домик числа '+n,n):gather('Собери разные сокровища',loot,n)
 ]]),
 [[countScene('Числа два и три можно собрать по одному.',[gs(2),gs(3)]),countScene('Можно собрать четыре или пять.',[gs(4),gs(5)]),shift(5)],
 [build('Собери модель числа 2',2),build('Собери модель числа 4',4),match('Подбери число к модели',[5,3,2],[2,3,5],tag),
 stages('Исправь три модели',makeEqual('Число два',2,1),makeEqual('Число четыре',4,5),makeEqual('Число пять',5,4)),
 stages('Построй модели от одного до пяти',...[1,2,3,4,5].map(n=>windows('Заполни окошки',n)))]],
 [[show('Домики ждут своих жителей.','house/pink house/yellow house/blue house/sky house/green'),shift(3),countScene('Сколько жителей в каждом домике?',groups(tag,1,2,3,4,5))],
 [windows('Засели домик числа 2',2,'bunny'),windows('Засели домик числа 3',3,'bear'),makeEqual('Найди недостающих жителей числа четыре',4,2),makeEqual('Исправь домик числа пять',5,6),
 stages('Восстанови город',...[1,2,3,4,5].map(n=>windows('Засели домик',n,'bunny')))]],
]);
