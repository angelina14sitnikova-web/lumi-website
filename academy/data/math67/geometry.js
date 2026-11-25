import { num } from '../math56/digits.js';
import { token, scene, exercise, pick, stages, lesson } from '../math45/builders.js';

const show=(text,mode,spec)=>scene('math67-geometry',text,[token('triangle')],{geometry67:{mode,...spec}});
const play=(prompt,mode,spec)=>exercise(prompt,'Посмотри на фигуры и выполни задание.',pick([num(0)],0,null,{geometry67:{mode,...spec}}));
const outlines=(text,...shapes)=>show(text,'outlines',{shapes});
const choose=(prompt,choices,correct,extra={})=>play(prompt,'choose',{choices,correct,...extra});
const byNumber=(prompt,shape,count)=>choose(prompt,[count-1,count,count+1],1,{shapes:[shape]});
const connect=(shape)=>play('Соедини точки по порядку','connect',{shape});
const puzzle=(prompt,tiles,rotate=false,example=false)=>play(prompt,'puzzle',{tiles,rotate,example});
const solid=(text,...shapes)=>show(text,'body',{shapes});
const shapes=['tri','four','five','six'];
const flat=['circle','tri','oval','square','six','open'];
const construction=(pattern)=>stages('Построй объёмную конструкцию по образцу',...pattern.map((shape,index)=>{
 const options=['ball','cube','cylinder','cone'];
 return choose('Подбери тело для места '+(index+1),options,options.indexOf(shape),{body:pattern});
}));
const shapeSort=(title,names,expected)=>stages(title,...names.map((shape,index)=>choose('Куда подойдёт фигура?',expected.map(([name])=>name),expected.findIndex(([,accept])=>accept(shape)),{shapes:[shape]})));
const boxes=[['3 стороны',s=>['tri','wideTri'].includes(s)],['4 стороны',s=>['four','square','rectangle'].includes(s)],['5 сторон',s=>s==='five'],['6 сторон',s=>s==='six']];
const curved=[['Круг',s=>s==='circle'],['Овал',s=>s==='oval'],['Многоугольник',s=>['tri','four','six'].includes(s)]];
const squareTwo=[['half',16,16,66,0],['half',16,16,66,2]];
const rectThree=[['rect',10,22,36,0],['square',10,58,36],['square',46,58,36]];
const house=[['roof',20,5,30],['square',20,35,30],['square',50,35,30],['square',20,65,30],['square',50,65,30]];
const rocket=[['roof',28,7,22],['rect',28,29,22],['square',28,51,22],['square',50,51,22],['half',6,51,22,1],['half',72,51,22,0]];
const seven=[['roof',23,2,26],['half',23,28,26,0],['half',23,28,26,2],['square',49,28,26],['rect',23,54,26],['half',23,80,14,3],['half',61,80,14,2]];
const portions=(prompt,choices,correct,reference)=>choose(prompt,choices,correct,{reference});
const labs=[
 [[outlines('У многоугольников граница замкнута и состоит из прямых отрезков.','tri','four','open','oval'),
   outlines('Три стороны у треугольника, четыре у четырёхугольника, пять у пятиугольника.','tri','four','five'),
   outlines('Сосчитай шесть сторон шестиугольника.','six')],
  [choose('Найди все многоугольники',flat,[1,3,4]),choose('Найди все треугольники',['tri','square','wideTri','five'],[0,2]),
   shapeSort('Разложи фигуры по количеству сторон',shapes,boxes),connect('five'),
   stages('Восстанови ворота',...shapes.map((shape,i)=>choose('Подбери фигуру: сторон '+(i+3),shapes,i)))]],
 [[outlines('Проследи границу треугольника по трём сторонам.','tri'),
   show('Вершины — точки, где встречаются соседние стороны.','vertices',{shapes:['tri']}),
   show('У каждого из этих многоугольников столько же вершин, сколько сторон.','vertices',{shapes:['four','five','six']})],
  [play('Отметь три вершины','vertices',{shape:'tri',decoys:[[50,47],[22,42]]}),byNumber('Сколько сторон?', 'four',4),
   choose('Найди фигуру с пятью вершинами',shapes,2),
   stages('Сосчитай стороны и вершины четырёх фигур',...shapes.flatMap((shape,i)=>[byNumber('Сколько сторон?',shape,i+3),byNumber('Сколько вершин?',shape,i+3)])),
   stages('Восстанови фигуры по точкам',...shapes.map(connect))]],
 [[outlines('У круга плавная граница.','circle'),outlines('Круг одинаково широк в любом направлении, а овал здесь вытянут.','circle','oval'),
   outlines('У многоугольника прямые стороны.','circle','oval','tri','square')],
  [choose('Найди все круги',['circle','oval','circle','five'],[0,2]),choose('Найди все овалы',['oval','circle','tri','oval'],[0,3]),
   choose('Подбери фигуры с прямыми сторонами',flat,[1,3,4]),shapeSort('Разложи фигуры по типам',['circle','oval','tri','four','six'],curved),
   stages('Заполни мозаику',choose('Для круглого окна',['circle','tri','oval'],0),choose('Для вытянутой бусины',['oval','circle','five'],0),puzzle('Собери квадрат из фигур с прямыми сторонами',squareTwo))]],
 [[solid('Посмотри на шар и куб с разных сторон.','ball','cube'),solid('У цилиндра два круглых основания и боковая поверхность.','cylinder'),
   solid('У конуса одно круглое основание и вершина.','cone','cylinder')],
  [choose('Найди шар и куб',['cone','ball','cylinder','cube'],[1,3]),choose('Найди конус',['cylinder','cone'],1),
   stages('Подбери форму к предмету',...['orangeFruit','block','can','roof'].map((item,i)=>choose(['Какой формы апельсин?','Какой формы кубик?','Какой формы банка?','Какой формы праздничный колпак?'][i],['ball','cube','cylinder','cone'],i))),
   stages('Проверь, где опора, а где тело катится',choose('Какие тела стоят на плоском основании?',['ball','cube','cylinder','cone'],[1,2,3]),choose('Какие тела способны катиться боком?',['ball','cube','cylinder','cone'],[0,2,3])),
   construction(['cube','cylinder','cone','ball'])]],
 [[show('Два подходящих треугольника заполняют квадрат.','puzzle',{tiles:squareTwo}),
   show('Соберём крышу и стены из многоугольников.','puzzle',{tiles:house}),
   show('Поворачиваем детали, чтобы заполнить контур ракеты.','puzzle',{tiles:rocket})],
  [puzzle('Собери прямоугольник из трёх деталей',rectThree,false,true),puzzle('Собери домик из пяти деталей',house,false,true),
   puzzle('Поворачивай детали и собери ракету',rocket,true),puzzle('Заполни новый силуэт из шести частей',[['rect',10,16,26],['square',62,16,26],['half',10,42,26,0],['half',10,42,26,2],['square',36,42,26],['square',36,68,26]],true),
   puzzle('Реши головоломку из семи деталей',seven,true)]],
 [[show('Линия через центр делит круг на две равные половины.','parts',{examples:[['circle',2]]}),
   show('Четыре одинаковые полоски вместе составляют квадрат.','parts',{examples:[['square',4]]}),
   show('Если сместить линию, площади частей могут стать разными.','parts',{examples:[['circle',2],['circle',2,12]]})],
  [portions('Найди две равные половины',[['circle',2,13],['circle',2],['circle',2,-17]],1),
   puzzle('Собери целый квадрат из двух половин',squareTwo,true),
   portions('Выбери линии, делящие прямоугольник на четыре равные части',[['rectangle',4,8],['rectangle',4],['rectangle',4,-9]],1),
   portions('Отметь фигуры, разделённые на неравные части',[['circle',2,12],['rectangle',4],['square',4,-6],['circle',2]],[0,2]),
   stages('Подели угощения поровну',portions('Двум друзьям поровну',[['circle',2,10],['circle',2]],1),portions('Четырём друзьям поровну',[['square',4],['square',4,4]],0),portions('Двум друзьям поровну ещё одно угощение',[['rectangle',2,11],['rectangle',2]],1))]],
];

export { puzzle, seven, choose as geometryChoice, construction, portions };
export const geometry67=Object.fromEntries(labs.map(([scenes,practice],i)=>['math-67-lesson-7-'+(i+1),lesson('geometry-temple',scenes,practice)]));
