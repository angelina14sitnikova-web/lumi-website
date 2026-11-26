import {lessons,t,d,r,picture} from './builders.js';

const stage=(label,bg,...items)=>({label,...picture(bg,...items)});
export const frames={
 'closed-box':stage('Коробка ещё закрыта','#efe1c9',['box',10,24,.85]),
 'open-box':stage('Открыть коробку','#efe1c9',['box:cream:big:open',10,28,.85]),
 'take-toy':stage('Достать игрушку','#efe1c9',['box:cream:big:open',3,52,.66],['bear',92,8,.44]),
 'wash':stage('Вымыть руки с мылом','#dceef6',['water',5,56,.9],['hand',28,3,.67],['soap',100,31,.42]),
 'dry':stage('Вытереть мокрые руки','#e6e4f4',['towel',53,11,.79],['hand',0,51,.59]),
 'put-boots':stage('Надеть ботинки','#f4e8d9',['boot',5,20,.63],['boot',67,47,.6]),
 'go-out':stage('Выйти гулять в ботинках','#e4efdb',['house',46,13,.74],['boot',0,100,.39],['boot',29,108,.34]),
 'open-book':stage('Открыть книгу','#f0e5d4',['book:mint',6,39,.91]),
 'look-book':stage('Рассмотреть картинки в книге','#f0e5d4',['book:mint',3,15,.98],['butterfly',29,57,.28],['flower',103,61,.27]),
 'fill-can':stage('Налить воду в лейку','#dceeee',['water',29,71,.73],['watering',14,15,.78]),
 'water-flower':stage('Полить цветок','#e3efdc',['flower',88,27,.54],['watering',3,15,.69],['water',62,101,.49]),
 'open-garage':stage('Открыть гараж','#e8eef4',['house:cream:big:no-door',18,16,.80]),
 'park-car':stage('Поставить машинку в открытый гараж','#e8eef4',['house:cream:big:no-door',17,19,.81],['car',54,71,.49]),
};
const stories=[['open-box','take-toy'],['wash','dry'],['put-boots','go-out'],['open-book','look-book'],['fill-can','water-flower'],['open-garage','park-car']];
const event=(steps,step,extra=[])=>r('event',step?'Что происходит потом?':'Что происходит сначала?',{
 steps,step,items:[steps[1],...extra,steps[0]],frames,
});
export const order=(ids,examples=null,showOrder=false)=>r('order','Положи картинки по порядку.',{
 items:[...ids].reverse(),slots:ids.map(()=>({})),order:ids,frames:examples,showOrder,
});
const compareRow=(order,other)=>r('chooseOrder','Найди ряд как на образце.',{order,rows:[other,order]});
export function pattern(rule,a,b,mode='one',extra={}){
 const seed=[a,b], row=[a,b,a,b],positions=[];
 if(mode==='inner'){row.push(a,null,a,b);positions.push(5);}
 else if(mode==='wrong'){row.push(a,a,a,b);positions.push(5);}
 else{row.push(null);positions.push(4);if(mode==='two'){row.push(null);positions.push(5);}}
 return r('pattern',mode==='wrong'?'Найди сбой и исправь ряд.':'Продолжи чередование.',{
  seed,rule,row,items:[b,a],slots:positions.map(position=>({position,bad:row[position]})),locate:mode==='wrong',...extra,
 });
}
const carAB=(a,b,mode,x)=>pattern('color','train:'+a,'train:'+b,mode,x);
const ballAB=(a,b,mode,x)=>pattern('color','ball:'+a,'ball:'+b,mode,x);
const shapeAB=(a,b,mode,x)=>pattern('shape',a+':mint',b+':mint',mode,x);
const red=carAB('red','blue'), shape=shapeAB('circle','square');
const mirror=[['ball','block'],['circle:rose','square:gold'],['train:mint','train:blue'],['car','bear'],['apple','pear']];
export const railway=lessons(6,[
 ['Выделять первое действие в причинно связанной истории.',[
  d('Чтобы достать игрушку, сначала открываем коробку.',event(stories[0],0)),
  d('Сначала ботинки, потом прогулка.',event(stories[2],0)),
  d('У истории есть начало и продолжение.',order(stories[1],frames,true)),
 ],t('Коробка и игрушка',event(stories[0],0)),t('Руки',event(stories[1],0)),
 t('Прогулка',event(stories[2],0)),t('Две картинки',order(stories[5],frames)),
 t('Первая станция',...stories.slice(0,5).map(s=>event(s,0)))],
 ['Выбирать естественное продолжение короткой истории.',[
  d('После открытия книги смотрим картинки.',event(stories[3],1)),
  d('После наполнения лейки можно полить цветок.',event(stories[4],1)),
  d('Второе действие продолжает первое.',order(stories[0],frames,true)),
 ],t('После коробки',event(stories[0],1)),t('После воды',event(stories[1],1)),t('Готовы гулять',event(stories[2],1)),
 t('Вторая картинка',event(stories[5],1,['open-book'])),
 t('Станция продолжений',...stories.slice(1).map(s=>event(s,1)))],
 ['Воспроизводить показанный порядок двух предметов.',[
  d('Мяч раньше кубика.',order(mirror[0],null,true)),d('На другом поезде порядок такой же.',order(mirror[2],null,true)),
  d('Если поменять местами, получится другой ряд.',compareRow(mirror[0],[...mirror[0]].reverse())),
 ],t('Две игрушки',order(mirror[0],null,true)),t('Две фигуры',order(mirror[1],null,true)),
 t('Вагончики',order(mirror[2],null,true)),t('Ряд как у Луми',compareRow(mirror[1],[...mirror[1]].reverse())),
 t('Поезда-близнецы',...mirror.map(ids=>order(ids,null,true)))],
 ['Продолжать чередование двух цветов.',[
  d('Красный, голубой, красный, голубой.',red),d('Выделим пару повторяющихся цветов.',ballAB('gold','mint')),
  d('Место следующего вагона определяет повторяющаяся пара.',carAB('rose','purple','two')),
 ],t('Следующий шарик',ballAB('red','blue')),t('Следующий вагон',carAB('gold','mint')),
 t('Два пустых места',ballAB('rose','mint','two')),
 t('Цветная ленточка',pattern('color','ribbon:gold','ribbon:purple','two')),
 t('Радужный поезд',red,carAB('gold','mint'),carAB('purple','rose'),carAB('mint','red','two'),carAB('blue','gold','two'))],
 ['Продолжать чередование двух форм одного цвета.',[
  d('Круг, квадрат. Эта пара повторяется.',shape),d('Посмотрим на пару фигур.',shapeAB('triangle','circle')),
  d('По правилу можно поставить две следующие фигуры.',shapeAB('square','triangle','two')),
 ],t('Круги и квадраты',shape),t('Треугольники и круги',shapeAB('triangle','circle')),
 t('Две фигуры в конце',shapeAB('square','triangle','two')),
 t('Фигура внутри ряда',shapeAB('circle','triangle','inner')),
 t('Геометрический поезд',shape,shapeAB('triangle','circle'),shapeAB('square','triangle'),shapeAB('oval','circle','two'),shapeAB('triangle','square','inner'))],
 ['Замечать и исправлять одно нарушение указанного чередования.',[
  d('Этот ряд повторяет два цвета.',red),d('Сравни: какой вагон поменял цвет?',carAB('red','blue','wrong')),
  d('Восстановим повторяющуюся пару.',shapeAB('square','circle','wrong')),
 ],t('Цвет вагона',carAB('red','blue','wrong')),t('Замена фигуры',shapeAB('circle','square','wrong')),
 t('Проверка шариков',ballAB('rose','gold','wrong')),t('Одно нарушение',shapeAB('triangle','square','wrong')),
 t('Ремонт волшебной железной дороги',carAB('red','blue','wrong'),carAB('mint','gold','wrong'),
 shapeAB('triangle','circle','wrong'),ballAB('purple','rose','wrong'),shapeAB('square','oval','wrong'))],
]);
