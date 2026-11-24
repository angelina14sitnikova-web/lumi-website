import {objects,group,groups,countScene,pickGroup,count,gather,fill,balance} from '../math45/counting.js';
import {set,scene,exercise,pick,choose,stages,lesson,connect} from '../math45/builders.js';

export function keyed56(module,room,items) {
  return Object.fromEntries(items.map(([scenes,practice],i)=>['math-56-lesson-'+module+'-'+(i+1),lesson(room,scenes,practice)]));
}
const added=(tag,n)=>balance('Добавь один предмет в нижний ряд',group(tag,n),group(tag,n-1),'add');
const crystals='crystal/sky';
const colorful=(n)=>Array.from({length:n},(_,i)=>set('crystal/sky crystal/pink crystal/blue crystal/yellow crystal/green')[i%5]);
const chooseCount=(prompt,tag,n,order)=>pickGroup(prompt,tag,order,order.indexOf(n));
const rows=[
 [6,crystals,'flower/pink','berry/pink',8],
 [7,'star/yellow','lantern/yellow','pearl/sky',9],
 [8,'firefly/yellow','mushroom/pink',crystals,10],
 [9,'shell/pink','star/yellow','pearl/sky',10],
 [10,crystals,'car/blue',crystals,12],
];
const special=[
 n=>gather('Собери шесть сокровищ на поляне',colorful(9),n),
 n=>exercise('Раздай семи зверятам по угощению','Выбери ягоду, потом зверька, у которого её ещё нет.',connect(objects('berry/pink',n),objects('bunny',n),Array.from({length:n},(_,i)=>i),{interchangeable:true})),
 n=>chooseCount('В какой корзине восемь кристаллов?',crystals,n,[7,9,8]),
 n=>stages('Исправь три группы: в каждой нужно девять',added(crystals,n),
  balance('Убери лишнюю бусину',group('pearl/sky',n),group('pearl/sky',n+1),'remove'),added('shell/pink',n)),
 n=>stages('Наполни сундук десятью кристаллами и проверь количество',fill('Наполни сундук',crystals,n,'treasure'),count('Пересчитай кристаллы в сундуке',objects(crystals,n))),
];
export const countTen=keyed56(1,'ten-crystals',[
 [[countScene('Отмечаем кристаллы по одному: один, два, три, четыре, пять.',colorful(5)),
 countScene('Последнее число — пять. Оно говорит, сколько кристаллов всего.',colorful(5)),
 countScene('Раздвигаем те же кристаллы. Их по-прежнему пять.',colorful(5),{arrangement:'loose'})],
 [count('Пересчитай четыре кристалла',colorful(4)),fill('Собери пять звёзд в сундук','star/yellow',5,'treasure'),
 chooseCount('Найди группу из трёх предметов',crystals,3,[4,3,5]),
 choose('Найди кристалл, который Луми пропустил','markedCrystal crystal/sky markedCrystal markedCrystal',1,'crystal/sky'),
 stages('Наполни три сундука',fill('Первый сундук',crystals,3,'treasure'),fill('Второй сундук','star/yellow',4,'treasure'),fill('Третий сундук','pearl/sky',5,'treasure'))]],
 ...rows.map(([n,intro,tally,pool,total],i)=>[
  [countScene('Сначала пересчитаем предметы, которые уже есть.',objects(intro,n-1)),
   countScene('Появляется ещё один предмет. Теперь их '+n+'.',objects(intro,n),{added:true}),
   countScene('У каждого предмета одна отметка. Всего '+n+'.',
    n===6?set('flower/pink star/yellow crystal/sky shell/pink car/blue block/green'):
    n===9?objects(intro,n).map((value,k)=>({...value,size:['small','middle','large'][k%3]})):objects(intro,n),
    {arrangement:n===7?'orbit':n===8||n===10?'loose':'row'})],
  [added(intro,n),count('Пересчитай предметы по одному',objects(tally,n)),
   n===7?exercise('Найди все группы из семи','Сравни группы с образцом.',pick(groups(intro,6,7,8,7),[1,3],group('star/yellow',7))):
    chooseCount('Найди группу с нужным количеством',intro,n,n===10?[8,9,10]:[n-1,n+1,n]),
   gather('Отсчитай '+n+' предметов',objects(pool,total),n),special[i](n)]
 ]),
]);
