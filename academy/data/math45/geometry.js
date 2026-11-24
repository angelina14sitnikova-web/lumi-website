import {set,token,show,move,scene,choose,join,stages,keyed,exercise,connect} from './builders.js';
const trace=(text,tag)=>scene('trace',text,set(tag));
const rotate=(text,tag)=>scene('turn',text,set(tag));
const select=(prompt,options,index,cue)=>choose(prompt,options,index,cue);
const objects='wheel/sky tile/pink roof/yellow door/green ovalFrame/blue';
const landmarks='triangle/yellow square/pink oval/blue circle/sky rectangle/green';
const landmarksLink=()=>join('Соотнеси пять предметов с формами',objects,landmarks,[3,1,0,4,2]);
const fit=(prompt,source,targets,matches,pattern)=>join(prompt,source,targets,matches,{assembly:true,mosaic:pattern});
const buildHouse=()=>fit('Собери домик','square/pink triangle/yellow','triangle/yellow square/pink',[1,0],'house');
const buildCar=()=>join('Добавь машинке колёса','circle/blue circle/blue','circle/blue circle/blue',[0,1],{assembly:true,mosaic:'car',interchangeable:true});
const buildFlower=()=>fit('Собери цветок','circle/yellow oval/pink oval/blue','oval/pink circle/yellow oval/blue',[1,0,2],'flower');
const buildRocket=()=>fit('Собери ракету','rectangle/blue triangle/yellow triangle/pink circle/sky','triangle/yellow rectangle/blue circle/sky triangle/pink',[1,0,3,2],'rocket');
const buildPicture=()=>fit('Собери картинку из пяти деталей','circle/yellow square/pink triangle/blue oval/green rectangle/sky','triangle/blue square/pink circle/yellow rectangle/sky oval/green',[2,1,0,4,3],'picture');
const twoRule='circle/red square/red circle/blue square/blue';
const twoSource='circle/blue circle/red square/red square/blue';
const twoSort=()=>join('Разложи по цвету и форме',twoSource,twoRule,[2,0,1,3],{matrix:true});
const fixTwo=()=>exercise('Исправь две ошибки','Найди фигуры, которые лежат в чужой ячейке.',
 {...connect(set(twoSource),set(twoRule),[3,0,2,1],{starts:[0,0,1,1],matrix:true}),answers:[{from:0,to:2},{from:3,to:3}]});
const assemblyScene=(text,task)=>{const r=task.rounds[0];return scene('assemble',text,r.pieces,{targets:r.targets,matches:r.answers.map(x=>x.to),mosaic:r.mosaic});};

export const geometry=keyed(5,'geometry-castle',[
 [[trace('Обводим плавный край круга.','circle/sky/large'),trace('У квадрата видны стороны и уголки.','square/pink/large'),trace('Проведём по трём сторонам треугольника.','triangle/yellow/large')],
 [select('Найди все круги','circle/blue triangle/sky circle/pink square/yellow',[0,2],'circle/pink'),
 select('Выбери квадраты разных размеров','square/blue/small circle/blue square/pink/large triangle/yellow',[0,2],'square/pink'),
 select('Найди треугольники','triangle/yellow/large circle/blue triangle/sky/small square/pink',[0,2],'triangle/pink'),
 join('Подбери детали к трём контурам','circle/sky triangle/pink square/yellow','square/blue circle/green triangle/yellow',[1,2,0]),
 join('Рассортируй набор фигур','square/sky circle/pink triangle/yellow square/green','circle/blue triangle/sky square/pink',[2,0,1,2])]],
 [[show('Посмотри на вытянутый прямоугольник.','rectangle/sky/large'),trace('Обходим его стороны и уголки.','rectangle/sky/large'),rotate('Повернём фигуру. Её форма та же.','rectangle/sky/large')],
 [select('Выбери вытянутый прямоугольник','circle/blue rectangle/sky triangle/pink',1,'rectangle/sky'),
 select('Найди прямоугольники разных размеров','rectangle/blue/small circle/sky rectangle/green/large',[0,2],'rectangle/sky'),
 select('Найди прямоугольную дверь','roundWindow door squareFrame',1,'doorShape'),
 join('Подбери прямоугольник к контуру','rectangle/sky','circle doorShape',[1]),
 fit('Собери прямоугольные детали для замка','rectangle/sky door/green rectangle/blue','rectangle/sky doorShape/green rectangle/blue',[0,1,2],'castle')]],
 [[show('Овал похож на вытянутый круг.','oval/sky/large'),trace('Идём вдоль плавного контура.','oval/pink/large'),show('У овала одна сторона длиннее поперечной. Круг одинаков во всех направлениях.','oval/sky circle/sky')],
 [select('Найди овал','square/sky oval/pink circle/yellow',1,'oval/sky'),select('Выбери все овалы','oval/blue circle/sky oval/green triangle/sky',[0,2],'oval/sky'),
 join('Подбери овал к контуру','oval/pink','circle oval',[1]),select('Найди предмет с овальным очертанием','badge ovalFrame tile',1,'oval'),
 fit('Собери овальные детали мозаики','oval/pink oval/green oval/blue','oval/blue oval/pink oval/green',[1,2,0],'flower')]],
 [[show('Сравним квадрат и вытянутый прямоугольник.','square/sky rectangle/sky'),show('Полоски показывают: у квадрата соседние стороны равны. У вытянутого прямоугольника одна длиннее другой.','square ribbon/pink rectangle ribbon/yellow'),rotate('Фигура остаётся такой же при повороте.','rectangle/blue')],
 [select('Найди квадрат по образцу','rectangle/sky square/blue circle/yellow',1,'square'),
 select('Выбери вытянутый прямоугольник','square/blue rectangle/sky oval/pink',1,'rectangle'),
 join('Подбери детали к контурам','rectangle/blue square/sky','square/sky rectangle/blue',[1,0]),
 select('У какой фигуры соседние стороны одной длины?','square/sky rectangle/sky',0,'square/sky'),
 fit('Заполни окна замка','square/pink rectangle/blue square/sky','rectangle/blue square/sky square/pink',[2,0,1],'castle')]],
 [[show('Круг и овал могут быть одного цвета.','circle/sky oval/sky'),scene('overlay','Совместим центры и увидим разные края.',set('oval/sky'),{targets:set('circle/sky'),matches:[0]}),rotate('Повернём овал. Это всё тот же овал.','oval/sky')],
 [select('Найди круг','oval/sky circle/sky',1,'circle'),select('Найди овал','circle/blue oval/blue',1,'oval'),
 join('Собери пары одинаковой формы','circle/blue oval/sky','oval/blue circle/sky',[1,0]),
 join('Разложи круги и овалы','circle/sky oval/pink oval/blue circle/green','oval/sky circle/sky',[1,0,0,1]),
 fit('Заполни круглые и овальные рамки','oval/sky circle/blue','circle/blue oval/sky',[1,0],'castle')]],
 [[show('Колесо круглое, а плитка квадратная.','wheel tile'),show('У крыши треугольный контур, у двери — вытянутый прямоугольный.','roof door'),move('Овальная рамка подходит к овалу.','ovalFrame','oval',[0])],
 [select('Найди предмет с круглым очертанием','tile wheel door',1,'circle'),select('Найди квадратную деталь','door wheel tile',2,'square'),
 join('Подбери форму к двери','door','square rectangle',[1]),landmarksLink(),
 stages('Найди формы в сказочном городе',select('Найди круглое окно','roundWindow window tallWindow',0,'circle'),select('Найди треугольную крышу','flatRoof roof roundRoof',1,'triangle'),select('Найди овальную рамку','squareFrame roundFrame ovalFrame',2,'oval'))]],
]);
export const mosaic=keyed(6,'mosaic-workshop',[
 [[move('Круглый предмет совмещаем с кругом.','wheel','circle',[0]),move('Квадратная деталь — к квадрату.','tile','square',[0]),show('Если цвет один, сравниваем форму.','oval/sky circle/sky square/sky')],
 [select('Подбери предмет к кругу','wheel tile door',0,'circle'),select('Найди деталь для треугольного контура','tile roof wheel',1,'triangle'),
 select('Найди предмет для овального контура','roundFrame ovalFrame squareFrame',1,'oval'),landmarksLink(),
 fit('Заполни пять фигурных ячеек',objects,landmarks,[3,1,0,4,2],'picture')]],
 [[show('Круги бывают большими и маленькими.','circle/sky/small circle/pink/large'),show('Квадраты здесь трёх размеров.','square/sky/small square/blue/middle square/pink/large'),move('Сортируем по форме, даже когда размер отличается.','circle/sky/small square/pink/large triangle/yellow/middle','square circle triangle',[1,0,2])],
 [select('Найди круги разных размеров','circle/sky/small triangle/yellow/large circle/blue/large square',[0,2],'circle'),
 select('Найди маленькую фигуру той же формы','square/sky/small circle/blue/small square/green/large',0,'square/pink/large'),
 join('Собери три пары по форме','triangle/sky/small square/pink/large circle/blue/middle','square triangle circle',[1,0,2]),
 select('Найди ошибку в группе квадратов','square/blue/small square/pink/large circle/blue/small square/sky/middle',2,'square'),
 join('Разложи детали трёх форм','square/blue/small circle/sky/large triangle/yellow/middle triangle/pink/small square/pink/large','triangle square circle',[1,2,0,0,1])]],
 [[show('Круг и квадрат красные.','circle/red square/red'),show('Треугольник тоже красный.','circle/red square/red triangle/red'),move('Фигуры разных форм идут к своим цветам.','circle/red square/blue triangle/red','chip/red chip/blue',[0,1,0])],
 [select('Найди все синие фигуры','circle/blue square/red triangle/blue oval/pink',[0,2],'chip/blue'),
 select('Подбери красную фигуру другой формы','circle/red square/blue triangle/red',2,'circle/red'),
 select('Выбери три зелёные фигуры','square/green triangle/green circle/blue oval/green rectangle/pink',[0,1,3],'chip/green'),
 select('Какая фигура другого цвета?','circle/red square/red triangle/blue oval/red',2,'chip/red'),
 join('Разложи по четырём цветам','circle/red square/blue triangle/yellow oval/green rectangle/red','chip/green chip/red chip/blue chip/yellow',[1,2,3,0,1])]],
 [[show('Собираем красные круги.','circle/red circle/red circle/red'),show('Отдельно лежат синие круги и красные квадраты.','circle/blue square/red'),move('Каждая ячейка сочетает цвет и форму.',twoSource,twoRule,[2,0,1,3])],
 [select('Выбери красные квадраты','square/red circle/red square/blue square/red',[0,3],'square/red'),
 select('Выбери большие круги','circle/sky/small circle/blue/large square/sky/large circle/pink/large',[1,3],'circle/sky/large'),
 twoSort(),fixTwo(),join('Заполни таблицу по цвету и форме','square/red circle/blue square/blue circle/red',twoRule,[1,2,3,0],{matrix:true})]],
 [[assemblyScene('Треугольник — крыша, квадрат — стены.',buildHouse()),assemblyScene('У машинки есть два круглых колеса.',buildCar()),assemblyScene('Круг в середине, овалы — лепестки.',buildFlower())],
 [buildHouse(),buildCar(),buildFlower(),buildRocket(),buildPicture()]],
 [[show('Вспомним знакомые фигуры.','circle square triangle rectangle oval'),move('Группируем сразу по цвету и форме.',twoSource,twoRule,[2,0,1,3]),assemblyScene('Соберём домик из деталей.',buildHouse())],
 [select('Найди фигуру по цвету и форме','circle/blue square/red square/blue',2,'square/blue'),
 join('Составь пары по форме','circle/blue triangle/pink oval/green','triangle/blue oval/pink circle/yellow',[2,0,1]),
 fixTwo(),buildRocket(),buildPicture()]],
]);
