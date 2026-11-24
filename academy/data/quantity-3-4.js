import { piece, lesson, scene, exercise, pick, connect } from './sensory-builders.js';

const colors={apple:'red',ball:'sky',berry:'pink',carrot:'yellow',flower:'pink',bunny:'gray',block:'sky',bear:'yellow',star:'yellow',mug:'sky',plate:'sky'};
const unit=shape=>piece(shape,colors[shape]||'sky');
const group=(shape,count)=>({...unit(shape),count});
const groups=(shape,counts)=>counts.map(count=>group(shape,count));
const table=(text,shape,counts)=>scene('quantity',text,groups(shape,counts));
const pairDemo=(text,left,n,right,m)=>scene('correspond',text,[group(left,n),group(right,m)],{pairCounts:[n,m]});
const select=(prompt,shape,counts,answer,sample)=>exercise(prompt,'Посмотри на предметы в каждой рамке.',pick(groups(shape,counts),answer,sample?group(shape,sample):null));
const multiple=(prompt,shape,counts,targets,matches)=>exercise(prompt,'Нажми на картинку и выбери подходящий образец.',
  connect(groups(shape,counts),groups(shape,targets),matches));
const fill=(shape,count,target='basket',extra={})=>connect([unit(shape)],[target==='sample'?group(shape,count):unit(target)],[0],
  {repeat:count,...extra});
const add=(prompt,shape,count,target)=>exercise(prompt,'Нажми на предмет и положи его на место.',fill(shape,count,target));
const copy=(prompt,shape,count)=>exercise(prompt,'Положи по одному предмету напротив каждого предмета образца.',fill(shape,count,'sample'));
const compare=(shape,counts,answer)=>pick(groups(shape,counts),answer,null,{pairCounts:counts});
const comparison=(prompt,shape,counts,answer)=>exercise(prompt,'Совмести группы попарно и посмотри, что получилось.',compare(shape,counts,answer));
const distribute=(prompt,shape,people,n)=>exercise(prompt,'Раздай каждому по одному предмету.',
  fill(shape,n,'sample',{recipient:group(people,n)}));

export const quantityLessons={
  'quantity-1':lesson('orchard',[
    table('На столе одно яблоко. Вот оно.', 'apple',[1]),
    table('На полке стоит одна машинка.', 'car',[1]),
    scene('move','Луми берёт одну игрушку из корзины и кладёт её на подставку.',[unit('ball'),group('ball',3)],{targets:[unit('plate'),unit('basket')],matches:[0,1]}),
  ],[
    select('Найди картинку с одним яблоком','apple',[3,1],1,1),
    select('Выбери тарелку с одной ягодой','berry',[1,3,2],0,1),
    exercise('Дай Луми одну машинку','Нажми на машинку.',pick([unit('ball'),unit('car'),unit('bear')],1,unit('car'))),
    add('Положи одну морковку в корзину','carrot',1,'basket'),
    exercise('Оставь по одному предмету на подставках','Положи на каждую подставку по одному предмету.',
      fill('apple',1,'plate'),fill('ball',1,'plate')),
  ]),
  'quantity-2':lesson('flower-garden',[
    table('Сначала один цветок. Рядом появляется несколько цветов.','flower',[1,4]),
    table('В этой корзине несколько яблок.','apple',[4]),
    table('На одной полке одна игрушка, на другой — несколько.','car',[1,4]),
  ],[
    select('Найди, где много яблок','apple',[1,4],1,4),
    select('Выбери корзину с несколькими мячами','ball',[4,1],0,4),
    select('Покажи полку, где много игрушек','car',[1,5],1,4),
    select('Найди все группы с несколькими предметами','block',[3,1,4,1],[0,2],3),
    add('Собери несколько цветов в букет','flower',4,'vase'),
  ]),
  'quantity-3':lesson('flower-garden',[
    table('Вот одна звёздочка. Рядом несколько звёздочек.','star',[1,4]),
    scene('move','Картинки с одним предметом идут к одному образцу, с несколькими — к другому.',groups('star',[3,1]),{targets:groups('star',[1,4]),matches:[1,0]}),
    table('Картинки поменялись местами. Один предмет всё равно можно найти.','star',[4,1]),
  ],[
    select('Выбери картинку с одним зайчиком','bunny',[3,1],1,1),
    select('Выбери картинку с несколькими зайчиками','bunny',[3,1],0,3),
    multiple('Разложи картинки «один» и «много»','apple',[1,4,3,1],[1,3],[0,1,1,0]),
    select('Найди ошибку в группе «один»','ball',[1,3,1],1,1),
    multiple('Распредели игрушки по двум полкам','bear',[3,1,4,1],[4,1],[0,1,0,1]),
  ]),
  'quantity-4':lesson('orchard',[
    table('В обеих корзинах яблоки. В одной их мало, в другой много.','apple',[2,6]),
    scene('highlight','Здесь яблок заметно больше.',groups('apple',[2,6]),{focus:1}),
    scene('swap','Корзины поменялись местами, а яблок в них осталось столько же.',groups('apple',[2,6]),{focus:1}),
  ],[
    select('Выбери корзину, где много яблок','apple',[2,6],1,6),
    select('Найди тарелку, где мало ягод','berry',[2,6],0,2),
    comparison('Сравни кубики. Покажи, где больше','block',[5,2],0),
    select('Покажи, в каком букете много цветов','flower',[2,5],1,5),
    multiple('Разложи картинки «мало» и «много»','ball',[2,6,2,5],[6,2],[1,0,1,0]),
  ]),
  'quantity-5':lesson('flower-garden',[
    scene('together','Посмотри на зайчиков и морковки.',[group('bunny',2),group('carrot',2)]),
    pairDemo('Каждому зайчику досталась одна морковка. Всем хватило.','bunny',2,'carrot',2),
    pairDemo('Пришёл ещё зайчик. Одному зайчику морковки не хватило.','bunny',3,'carrot',2),
  ],[
    distribute('Раздай каждому зайчику морковку','carrot','bunny',3),
    distribute('Подбери чашку к каждому блюдцу','mug','plate',3),
    comparison('Покажи ряд, где предмет остался без пары','block',[2,3],1),
    exercise('Выбери картинку, где у каждого есть пара','Посмотри, где все предметы нашли пару.',
      pick([{...group('berry',2),other:3},{...group('berry',3),other:3}],1)),
    distribute('Дай каждому медведю по игрушке','ball','bear',3),
  ]),
  'quantity-6':lesson('orchard',[
    table('Вот образец из яблок. Посмотри внимательно.','apple',[2]),
    pairDemo('Луми кладёт напротив каждого яблока ещё одно яблоко. Получились одинаковые группы.','apple',2,'apple',2),
    pairDemo('Теперь Луми повторяет образец из цветов. У каждого цветка есть пара.','flower',3,'flower',3),
  ],[
    copy('Собери такую же группу яблок','apple',2),
    copy('Положи столько же мячей','ball',3),
    copy('Собери группу игрушек по образцу','car',2),
    copy('Повтори группу цветов','flower',3),
    exercise('Повтори три маленькие группы','Заполни каждое место напротив образца.',
      fill('berry',2,'sample'),fill('block',3,'sample'),fill('apple',2,'sample')),
  ]),
  'quantity-7':lesson('flower-garden',[
    table('На столе две группы одинаковых игрушек.','ball',[3,2]),
    pairDemo('Луми соединяет мячи парами. Один мяч остался без пары.','ball',3,'ball',2),
    pairDemo('В ряду, где остался мяч без пары, мячей больше.','ball',2,'ball',3),
  ],[
    comparison('Составь пары и покажи, где больше мячей','ball',[3,2],0),
    comparison('Покажи, где больше яблок после сопоставления','apple',[2,4],1),
    comparison('Покажи, где меньше игрушек','car',[2,3],0),
    exercise('Найди картинку, где предметов поровну','Смотри, где все предметы соединились попарно.',
      pick([{...group('star',3),other:2},{...group('star',2),other:2}],1)),
    exercise('Раздай угощения и покажи, где больше','Сначала раздай яблоки, потом сравни группы попарно.',
      fill('apple',3,'sample',{recipient:group('bunny',3)}),compare('apple',[3,4],1)),
  ]),
};
