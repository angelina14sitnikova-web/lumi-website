import { num, sequence } from '../math56/digits.js';
import { group, gather, objects } from '../math45/counting.js';
import { measurePick, series } from '../math45/magnitude.js';
import { token, scene, exercise, pick, stages, lesson } from '../math45/builders.js';
import { act } from './arithmetic.js';
import { solve, build, join, remove, needed } from './stories.js';
import { lengths, scales, liquid } from './engineering.js';
import { construction, geometryChoice, portions, puzzle, seven } from './geometry.js';
import { route, roam, locate, island } from './spatial.js';
import { daySequence, setClock } from './time.js';
import { numberHouses } from './parts.js';
import { numberPortals } from './numbers.js';

const crystal='crystal/sky', fruit='apple/red', flower='flower/pink', ribbon='ribbon/pink';
const money='chip/yellow';
const cards = values => values.map(value=>({...num(value),word67:typeof value==='string' && value.length>1}));
const show=(text,values)=>scene('together',text,values,{ordinal:true});
const select=(prompt,values,index,cues)=>exercise(prompt,'Посмотри на образец и проверь свой выбор.',pick(cards(values),index,null,{cues,ordinal:true}));
const pattern=(rule,values,answer,alternatives)=>select(rule,[...alternatives.slice(0,1),answer,...alternatives.slice(1)],1,cards([...values,'□']));
const goods=[['Перо',2],['Книжка',3],['Фонарь',4],['Игрушка',5],['Пазл',6]];
const shop=exercise('Собери корзину ровно на восемь монет.','Можно подобрать разные товары.',pick([num(0)],0,null,{shop67:{goal:8,products:goods}}));
const storyOptions=[{tag:fruit,name:'Яблоки'},{tag:crystal,name:'Кристаллы'},{tag:flower,name:'Цветы'}];
const shownStory=(text,s,mode)=>scene('math67-story',text,[token(s.tag)],{story67:{...s,mode}});
const action=(text,a,b,sign,tag)=>scene('math67-action',text,[token(tag)],{arithmetic:{a,b,sign,tag,show:true}});
const geo=(text,mode,spec)=>scene('math67-geometry',text,[token('triangle')],{geometry67:{mode,...spec}});
const engineering=(text,name,spec)=>scene('math67-engineering',text,[token('strip')],{engineering67:{name,...spec}});
const recap=(text,panels,pieces=[])=>scene('math67-recap',text,pieces,{panels,ordinal:true});
const easyPuzzle=[['half',18,18,64,0],['half',18,18,64,2]];
const symmetry=[['half',12,10,28,0],['half',40,10,28,1],['square',12,38,28],['square',40,38,28]];
const quarters=()=>portions('Найди четыре равные части.',[['square',4,7],['square',4],['square',4,-7]],1);
const mixedShape=()=>geometryChoice('Выбери фигуру с четырьмя сторонами и четырьмя вершинами.',['tri','four','five','six'],1);
const shapeBuild=()=>stages('Собери механизм',mixedShape(),puzzle('Собери контур из семи частей.',seven,true),quarters());
const sizeOrder=()=>series('Разложи шесть лент от короткой к длинной.',ribbon,'length',[.9,.5,.3,.7,.4,.6],[.3,.4,.5,.6,.7,.9]);
const measures=()=>stages('Измерь длину, массу и вместимость.',
  lengths('Измерь длину моста.',6),scales('Уравновесь груз.',[4],[],'equal',4),liquid('Проверь вместимость сосуда.',6));
const compare=()=>stages('Измерь две дорожки и сравни.',
  lengths('Первая дорожка.',6),lengths('Вторая дорожка.',4),select('Какая дорожка длиннее?',['Первая','Вторая','Одинаковые'],0));
const makeOwn=()=>build('Создай и реши свою задачу в пределах десяти.',storyOptions);
const list=[
 [[show('Каждое следующее число на один больше.',cards([1,2,3,4])),
   show('При обратном счёте каждое следующее число на один меньше.',cards([10,9,8,7])),
   show('В узоре повторяется пара: два, четыре.',cards([2,4,2,4]))],
  [pattern('Добавляй по одному.',[3,4,5],6,[4,7]),pattern('Уменьшай на один.',[9,8,7],6,[5,8]),
   pattern('Повтори пару 2, 4.',[2,4,2,4],2,[4,6]),
   select('Числа растут на один. Какая карточка лишняя в ряду 4, 5, 8, 7?',[5,8,7],1,cards([4,5,8,7])),
   stages('Продолжи пять узоров.',
     pattern('Добавляй по одному.',[0,1,2],3,[2,4]),pattern('Уменьшай на один.',[5,4,3],2,[4,1]),
     pattern('Повтори пару 1, 3.',[1,3,1,3],1,[3,2]),pattern('Повтори тройку 2, 4, 6.',[2,4,6,2,4],6,[2,4]),
     pattern('Добавляй по два.',[2,4,6,8],10,[8,9]))]],
 [[shownStory('Из двух групп яблок получится задача на сложение.',join(2,4,fruit),'question'),
   shownStory('Из сундука убрали часть кристаллов. Спросим, сколько осталось.',remove(8,3,crystal),'question'),
   shownStory('Проверяем результат по предметной модели.',remove(8,3,crystal),'answer')],
  [build('Составь задачу о двух группах предметов.',storyOptions,{onlyJoin:true}),
   solve('Подбери вопрос и действие для истории об объединении.',join(3,2,flower)),
   solve('У Луми было девять яблок. Четыре он отдал. Сколько осталось?',remove(9,4,fruit)),
   makeOwn(),stages('Реши три истории.',solve('Собери цветы вместе.',join(4,4,flower)),
     solve('Убери часть яблок.',remove(7,3,fruit)),solve('Выясни, сколько кристаллов ещё нужно.',needed(10,6,crystal)))]],
 [[show('Каждый золотой жетон — одна игровая монета.',objects(money,4)),
   action('Предметы стоят три и четыре монеты. Всего семь.',3,4,'+',money),
   action('Из десяти монет шесть уходит на покупку. Остаётся четыре монеты сдачи.',10,6,'−',money)],
  [gather('Отсчитай четыре монеты для игрушки.',objects(money,8),4),
   act('Узнай стоимость двух товаров за две и пять монет.',2,5,'+',money),
   select('Хватит ли восьми монет на игрушку за девять?',['Да','Нет'],1,[group(money,8),num(9)]),
   act('Заплати за покупку ценой шесть из десяти монет. Сколько вернут?',10,6,'−',money),shop]],
 [[engineering('Приложим мерки от края дорожки.', 'length',{length:6,unit:1}),
   engineering('Сравним грузы на двух чашах.', 'mass',{left:[2],right:[5]}),
   engineering('Одинаковыми стаканчиками измерим вместимость сосудов.', 'transfer',{capacityA:5,capacityB:6,amount:4})],
  [sizeOrder(),compare(),scales('Определи массу груза в мерных грузиках.',[5],[],'equal',5),
   stages('Измерь два сосуда.',liquid('Первый сосуд.',4),liquid('Второй сосуд.',6)),
   stages('Подготовь материалы для домика.',measurePick('Выбери самую длинную балку.',ribbon,'length',[.42,.72,.6],1),
     lengths('Измерь выбранную балку.',7),scales('Уравновесь стройматериалы.',[3],[],'equal',3),liquid('Отмерь четыре стаканчика воды.',6,4))]],
 [[geo('Сосчитаем стороны и вершины многоугольников.','vertices',{shapes:['tri','four','five']}),
   geo('Переместим и повернём детали, чтобы заполнить силуэт.','puzzle',{tiles:seven}),
   geo('Четыре равные части заполняют целый квадрат.','parts',{examples:[['square',4]]})],
  [mixedShape(),construction(['cube','cylinder','ball','cone']),puzzle('Восстанови зеркальные половины рисунка.',symmetry,true,true),
   puzzle('Собери силуэт из семи деталей.',seven,true),shapeBuild()]],
 [[recap('Перед нами карта десяти миров. Разложим десять на четыре и шесть. Соберём десять обратно, а затем уберём шесть.',[
    action('',4,6,'+',crystal),action('',10,6,'−',crystal),
   ],cards([1,2,3,4,5,6,7,8,9,10])),
   recap('Квадрат и треугольник различаются числом сторон. Длину дорожки можно проверить мерками: укладываем их подряд от самого края.',[
    geo('','vertices',{shapes:['tri','square']}),engineering('','length',{length:4,unit:1}),
   ]),
   recap('Отметим старт и проложим путь к мосту. По часам видно, что уже семь. По календарю видно, что после понедельника наступит вторник.',[
    {spatial67:{...island,start:0,target:14,blocked:[7],commands:['→','→','→','→','↓','↓']}},
    {clock67:{hour:7}},
   ],cards(['Понедельник','Вторник']))],
  [stages('Испытание числового дворца.',sequence('Восстанови ряд от нуля до десяти.',Array.from({length:11},(_,i)=>i)),
    numberHouses['math-67-lesson-2-6'].practice[1],numberPortals['math-67-lesson-1-6'].practice[3],
    act('Сложи четыре и три.',4,3,'+',crystal),act('Вычти три из семи.',7,3,'−',crystal)),
   stages('Испытание математического детектива.',solve('Сколько стало цветов?',join(3,5,flower)),
     solve('Сколько осталось яблок?',remove(10,4,fruit)),solve('Сколько ещё кристаллов нужно?',needed(9,7,crystal))),
   measures(),
   stages('Испытание геометрического храма.',mixedShape(),geometryChoice('Выбери цилиндр.',['ball','cube','cylinder','cone'],2),
     puzzle('Восстанови квадрат из двух деталей.',easyPuzzle,true),quarters()),
   stages('Испытание великого путешественника.',locate('Найди мост по карте.',island,14),
     route('Доберись до клада, обходя камень.',roam(5,0,22,'↓↓↓↓→→',{blocked:[7]})),
     setClock('Установи время отправления: семь часов.',7,5),daySequence())]],
];
export const workshop67=Object.fromEntries(list.map(([scenes,practice],i)=>[
  `math-67-lesson-10-${i+1}`,lesson('math-academy-hall',scenes,practice),
]));
