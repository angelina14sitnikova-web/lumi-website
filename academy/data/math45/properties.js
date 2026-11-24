import { repair, exercise } from '../sensory-builders.js';
import { set, show, move, scene, choose, join, stages, keyed } from './builders.js';

const tones='leaf/paleGreen leaf/green leaf/deepGreen';
const colors='chip/red chip/yellow chip/blue chip/green';
const shelves='car/green star/red ball/yellow boat/blue leaf/green block/yellow flower/red bear/blue';
const colorSlots=[3,0,1,2,3,1,0,2];
const twoRule='square/red circle/red circle/blue square/blue';
const twoSources='circle/blue square/red square/blue circle/red square/red circle/blue';
const twoTargets=[2,0,3,1,0,2];
const describeColor=()=>choose('Выбери карточку цвета','chip/yellow chip/sky chip/green',1,'block/sky/small');
const describeShape=()=>choose('Выбери карточку формы','circle/pink square/pink triangle/pink',1,'block/sky/small');
const describeSize=()=>choose('Какой предмет соответствует по размеру?','square/pink/large square/pink/middle square/pink/small',2,'block/sky/small');
export const properties=keyed(1,'color-workshop',[
 [[
   show('Вспомним знакомые цвета: красный, жёлтый, синий и зелёный.','car/red star/yellow boat/blue leaf/green'),
   move('Положим предметы рядом с метками их цвета.','flower/pink balloon/sky pebble/gray paper/white cat/black','chip/pink chip/sky chip/gray chip/white chip/black',[0,1,2,3,4]),
   move('Мяч и цветок разные, но оба красные.','ball/red flower/red boat/blue','chip/red chip/blue',[0,0,1]),
 ],[
   choose('Найди игрушку цвета образца','car/yellow car/green car/blue',1,'chip/green'),
   join('Подбери четыре предмета к цветовым образцам','star/red ball/green car/yellow boat/blue',colors,[0,3,1,2]),
   join('Собери пары одного цвета','car/yellow boat/blue bear/red','flower/red ball/yellow block/blue',[1,2,0]),
   exercise('Исправь две ошибки в цветовых группах','Найди игрушки не на своём месте и переложи их.',repair(set('star/red car/blue block/blue ball/red'),set('chip/red chip/blue'),[0,0,1,1])),
   join('Рассортируй восемь игрушек',shelves,colors,colorSlots),
 ]],
 [[
   show('Повтори: оранжевые морковка, тыква и апельсин.','carrot/orange pumpkin/orange orangeFruit/orange'),
   show('Жёлудь, шоколад и медведь коричневые.','acorn/brown chocolate/brown bear/brown'),
   move('Оранжевый и коричневый отличаются от жёлтого и красного.','orangeFruit/orange bear/brown star/yellow flower/red','chip/yellow chip/orange chip/red chip/brown',[1,3,0,2]),
 ],[
   choose('Найди оранжевую игрушку','ball/yellow ball/orange ball/red',1,'chip/orange'),
   choose('Выбери коричневого медведя','bear/orange bear/yellow bear/brown',2,'chip/brown'),
   join('Подбери предметы к новым образцам','carrot/orange chocolate/brown pumpkin/orange acorn/brown','chip/brown chip/orange',[1,0,1,0]),
   choose('Найди оранжевые и коричневые предметы','ball/orange star/red acorn/brown ball/blue pumpkin/orange',[0,2,4],null,{cues:set('chip/orange chip/brown')}),
   join('Разложи игрушки по четырём цветам','car/orange bear/brown boat/blue star/yellow ball/brown pumpkin/orange','chip/yellow chip/orange chip/brown chip/blue',[1,2,3,0,2,1]),
 ]],
 [[
   show('Светло-зелёный и зелёный — разные оттенки.','leaf/paleGreen leaf/green'),
   show('Голубой шарик светлее, тёмно-синий — темнее.','balloon/sky balloon/blue'),
   move('Разложим от светлого к тёмному.',tones,'chip/paleGreen chip/green chip/deepGreen',[0,1,2]),
 ],[
   choose('Найди светло-зелёный лист','leaf/green leaf/paleGreen leaf/deepGreen',1,'chip/paleGreen'),
   choose('Выбери более тёмный шарик','balloon/blue balloon/sky',0,'chip/blue'),
   choose('Найди точно такой же оттенок','car/blue car/sky car/green',1,'chip/sky'),
   join('Собери три пары оттенков',tones,'ball/deepGreen ball/paleGreen ball/green',[1,2,0]),
   join('Разложи от светлого к тёмному','leaf/deepGreen leaf/green leaf/paleGreen','chip/paleGreen chip/green chip/deepGreen',[2,1,0],{ordered:true}),
 ]],
 [[
   scene('highlight','Выбираем красный круг: совпадают цвет и форма.',set('square/red circle/blue circle/red'),{focus:2}),
   scene('highlight','Зелёный мяч подходит, если он большой.',set('ball/green/small ball/blue/large ball/green/large'),{focus:2}),
   move('Красный квадрат совпадает только по цвету. Подходит красный круг.','circle/red','square/red circle/red',[1]),
 ],[
   choose('Найди красный круг','circle/blue square/red circle/red',2,'circle/red'),
   choose('Найди маленький жёлтый квадрат','square/yellow/large triangle/yellow/small square/yellow/small square/blue/small',2,'square/yellow/small'),
   choose('Найди большие синие предметы','circle/blue/large triangle/blue/small circle/green/large square/blue/large',[0,3],null,{cues:set('chip/blue ball/pink/large')}),
   choose('Учитывай обе карточки','square/red triangle/green triangle/red',2,null,{cues:set('chip/red triangle/pink')}),
   join('Рассортируй фигуры по цвету и форме',twoSources,twoRule,twoTargets),
 ]],
 [[
   show('Вот большой красный круг.','circle/red/large'),
   scene('highlight','Проверяем цвет, форму и размер. Подходит только один предмет.',set('circle/red/small square/red/large circle/blue/large circle/red/large'),{focus:3}),
   move('Правильная фигура совпадает со всеми тремя признаками.','circle/red/large','circle/blue/large circle/red/large',[1]),
 ],[
   choose('Найди большой синий квадрат','square/blue/large circle/blue/large square/blue/small square/green/large',0,'square/blue/large'),
   choose('Найди маленький жёлтый треугольник','triangle/yellow/large triangle/blue/small triangle/yellow/small square/yellow/small',2,'triangle/yellow/small'),
   choose('Проверь три карточки','square/red/small triangle/red/large triangle/red/small',2,null,{cues:set('chip/red triangle/pink ball/pink/small')}),
   choose('Какая фигура не подходит?','circle/blue/large circle/blue/large circle/blue/small circle/blue/large',2,'circle/blue/large',{setting:'odd'}),
   stages('Три комбинации свойств',choose('Где маленький зелёный круг?','circle/green/small square/green/small circle/green/large',0,'circle/green/small'),
    choose('Где большой красный квадрат?','square/blue/large square/red/large square/red/small',1,'square/red/large'),
    choose('Где маленький жёлтый треугольник?','triangle/yellow/large circle/yellow/small triangle/yellow/small',2,'triangle/yellow/small')),
 ]],
 [[
   move('Сначала найдём карточку цвета.','block/sky/small','chip/sky chip/yellow',[0]),
   move('У кубика квадратная грань. Найдём квадрат и маленький размер.','square/pink ball/pink/small','square/pink ball/pink/small',[0,1]),
   show('Три карточки рассказывают о кубике: голубой, квадратная грань, маленький.','chip/sky square/pink ball/pink/small block/sky/small'),
 ],[
   describeColor(),describeShape(),describeSize(),stages('Собери описание из трёх карточек',describeColor(),describeShape(),describeSize()),
   choose('Найди предмет по всем карточкам','block/sky/large block/green/small block/sky/small triangle/sky/small',2,null,{cues:set('chip/sky square/pink ball/pink/small')}),
 ]],
]);
