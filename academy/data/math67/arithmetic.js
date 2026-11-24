import { num } from '../math56/digits.js';
import { group, countScene } from '../math45/counting.js';
import { token, scene, lesson, exercise, pick, stages } from '../math45/builders.js';
import { split } from './parts.js';

const plus='+', minus='−', equals='=';
const loot='crystal/sky', stars='star/yellow', apples='apple/red', books='book/sky';
const range=(a,b)=>Array.from({length:b-a+1},(_,i)=>i+a);
const parts=(a,b,sign)=>sign===plus?a+b:a-b;
const statement=(a,b,sign)=>[a,sign,b,equals,parts(a,b,sign)];
const formula=(a,b,sign)=>statement(a,b,sign).join(' ');
const groupCards=(a,b,sign,tag)=>[group(tag,a),num(sign),group(tag,b)];
const model=(text,a,b,sign,tag=loot,show=true,extra={})=>scene('math67-action',text,[token(tag)],{arithmetic:{a,b,sign,tag,show,...extra}});
const film=(text,a,b,sign,tag)=>model(text,a,b,sign,tag,false);
const pickCard=(prompt,value,choices,cues,demo67)=>exercise(prompt,'Сравни карточки с моделью.',pick(choices.map(num),choices.indexOf(value),null,{cues,demo67}));
const missing=(a,b,sign,index,tag=loot,repair=false)=>{
 const row=statement(a,b,sign), answer=row[index];
 const choices=typeof answer==='number'?[answer===0?2:answer-1,answer,answer===10?8:answer+1]:[...new Set([minus,answer,plus,equals])].filter(value=>value!==answer).concat(answer);
 row[index]=repair ? choices[0] : '?';
 return pickCard(repair ? 'Исправь неверный результат' : 'Вставь пропущенную карточку',answer,choices,[...groupCards(a,b,sign,tag),...row.map(num)]);
};
export const expression=(prompt,a,b,sign,tag=loot)=>exercise(prompt,'Сначала посмотри на предметы, затем собери запись.',
 pick([num(0)],0,null,{expression67:{a,b,sign,tag,answer:statement(a,b,sign)}}));
export const act=(prompt,a,b,sign,tag=loot,track=false,frame=false)=>exercise(prompt,'Выполни действие с предметами и подбери ответ.',
 pick([num(0)],0,null,{operation67:{a,b,sign,tag,track,frame}}));
const modelSelect=(a,b,sign,tag=loot)=>{
 const answer=formula(a,b,sign);
 const result=parts(a,b,sign);
 const wrongResult=[result===10?8:result+1,result===0?2:result-1];
 return pickCard('Подбери запись к показанному действию',answer,
 [answer.replace(/\d+$/,String(wrongResult[0])),answer,answer.replace(/\d+$/,String(wrongResult[1]))],null,{a,b,sign,tag,show:false});
};
const arithmeticMany=(prompt,pairs,sign,kind=act,tag=loot)=>stages(prompt,...pairs.map(([a,b])=>kind('Выполни шаг',a,b,sign,tag)));
const actionChoice=(prompt,a,b,sign,tag)=>pickCard(prompt,sign,[plus,minus],[group(tag,a),num('→'),group(tag,parts(a,b,sign)),num('?')]);
const story=(prompt,a,b,sign,tag)=>stages(prompt,actionChoice('Какое действие подходит?',a,b,sign,tag),act('Проверь ответ предметами',a,b,sign,tag));
const pictureChoice=(a,b,sign,tag)=>exercise('Выбери рисунок к действию','Сравни группы до и после.',
 pick([Math.abs(a-b),a+b,a].map(n=>({shape:"group",color:"sky",pictureSequence67:[group(tag,a),num('→'),group(tag,n)]})),sign===plus?1:0,null,
 {demo67:{a,b,sign,tag,show:false}}));
const bird='bird/blue';
const keyed=(n,room,content)=>Object.fromEntries(content.map(([scenes,practice],i)=>['math-67-lesson-'+n+'-'+(i+1),lesson(room,scenes,practice)]));

export const addition=keyed(3,'arithmetic-alchemy',[
 [[film('Соберём красные и синие кристаллы вместе.',2,3,plus),model('Пересчитаем все кристаллы. Их пять.',2,3,plus),model('Четыре и два вместе дают шесть.',4,2,plus)],
 [act('Объедини один и два предмета',1,2,plus),act('Собери вместе три и четыре звезды',3,4,plus,stars),act('Сколько всего после объединения?',4,3,plus,apples),pictureChoice(2,3,plus,loot),split('Создай две группы из восьми предметов вместе',8)]],
 [[film('Слева два кристалла. В другой группе три.',2,3,plus),model('Между числами ставим плюс, когда объединяем две группы.',2,3,plus),model('Запись 2 + 3 соответствует объединению.',2,3,plus)],
 [pickCard('Найди знак плюс',plus,[equals,minus,plus]),pictureChoice(2,3,plus,loot),missing(2,3,plus,1),
 arithmeticMany('Соотнеси четыре записи с группами',[[2,4],[3,3],[5,2],[4,4]],plus,(_,a,b)=>modelSelect(a,b,plus)),
 arithmeticMany('Собери пять записей',[[1,2],[2,3],[3,4],[4,4],[6,2]],plus,expression)]],
 [[scene('correspond','Четыре кристалла слева, четыре справа. Значения равны.',[group(loot,4),group(loot,4)]),
 model('Два плюс три и число пять обозначают одинаковое количество.',2,3,plus),
 countScene('Записи 2 + 3 и 4 + 1 обозначают одно количество.',[num('2 + 3'),num(equals),num('4 + 1')])],
 [pickCard('Найди знак равно',equals,[plus,equals,minus]),
 exercise('Выбери равную группу','Пересчитай обе группы.',pick([group(stars,4),group(stars,5),group(stars,3)],0,group(loot,4))),
 missing(2,2,plus,3),exercise('Выбери все верные равенства','Сравни правую и левую стороны.',pick(['5 = 5','2 + 3 = 6','2 + 2 = 4','3 = 4'].map(num),[0,2])),
 stages('Восстанови равенства',expression('Первое равенство',3,4,plus),expression('Второе равенство',4,5,plus))]],
 [[film('Объединим три яблока и два яблока.',3,2,plus,apples),model('Запишем 3 + 2 = 5.',3,2,plus,apples),model('Запишем объединение другой пары групп.',4,3,plus,stars)],
 [expression('Собери запись 1 + 3 = 4',1,3,plus),missing(2,5,plus,2),modelSelect(4,3,plus,apples),missing(5,3,plus,4),
 arithmeticMany('Составь три примера',[[3,1],[2,6],[7,2]],plus,expression)]],
 [[model('К трём добавляем четыре. Всего семь.',3,4,plus),model('К шести присчитываем ещё два: семь, восемь.',6,2,plus),model('Три кристалла занимают три свободные ячейки. Всего десять.',7,3,plus,loot,true,{frame:true})],
 [act('Сложи 2 и 3 яблока',2,3,plus,apples),act('Сложи 4 и 4 кристалла',4,4,plus),
 act('Сделай три шага от шести',6,3,plus,loot,true),
 arithmeticMany('Четыре примера в рамке',[[3,4],[6,3],[7,3],[4,4]],plus,(p,a,b)=>act(p,a,b,plus,loot,false,true)),
 arithmeticMany('Открой пять сосудов',[[2,2],[2,3],[5,1],[6,2],[4,6]],plus)]],
 [[film('У Луми было три яблока. Ему подарили ещё два.',3,2,plus,apples),model('Объединяем обе группы яблок. Получилось пять.',3,2,plus,apples),
 model('Четыре фонаря и ещё три — всего семь.',4,3,plus,'lantern/yellow')],
 [story('Было две птицы. Прилетели ещё три. Сколько теперь птиц?',2,3,plus,bird),story('Луми нашёл четыре кристалла, затем ещё два.',4,2,plus,loot),
 story('Пять яблок в корзине и ещё три. Сколько стало?',5,3,plus,apples),modelSelect(3,2,plus,'bear/brown'),
 stages('Реши три истории',story('Фонари',4,3,plus,'lantern/yellow'),story('Фигуры',2,4,plus,'triangle/blue'),story('Сокровища',1,8,plus,loot))]],
]);

export const subtraction=keyed(4,'vanishing-vault',[
 [[film('Уберём два из пяти яблок.',5,2,minus,apples),model('После удаления осталось три яблока.',5,2,minus,apples),model('Из восьми кристаллов уберём три. Остаётся пять.',8,3,minus)],
 [act('Убери один из четырёх',4,1,minus),act('Убери два из шести',6,2,minus),act('Посчитай, сколько осталось',7,2,minus,stars),pictureChoice(6,3,minus,loot),
 arithmeticMany('Уменьши три группы',[[4,2],[6,3],[7,4]],minus)]],
 [[film('Погасим две звезды из шести.',6,2,minus,stars),model('Запись 6 − 2 обозначает удаление двух звёзд.',6,2,minus,stars,'expression'),
 model('Осталось четыре. Полная запись — 6 − 2 = 4.',6,2,minus,stars)],
 [pickCard('Найди знак минус',minus,[plus,equals,minus]),pickCard('Выбери минус рядом с плюсом',minus,[minus,plus]),
 modelSelect(7,3,minus),stages('Вставь четыре пропущенных знака',missing(7,3,minus,1),missing(5,3,minus,1),missing(4,2,minus,1),missing(8,2,minus,1)),
 arithmeticMany('Собери пять записей',[[3,1],[4,2],[6,3],[8,4],[10,3]],minus,expression)]],
 [[film('Из семи убираем три.',7,3,minus),model('Составим запись 7 − 3 = 4.',7,3,minus),
 model('Первое число — было, второе — убрали, третье — осталось.',7,3,minus)],
 [expression('Собери пример 5 − 2 = 3',5,2,minus),missing(8,3,minus,2),modelSelect(7,2,minus,apples),missing(10,3,minus,4,loot,true),
 arithmeticMany('Составь три примера',[[6,3],[7,5],[9,4]],minus,expression)]],
 [[model('Из восьми убираем три, остаётся пять.',8,3,minus),model('От семи делаем два шага назад, получаем пять.',7,2,minus,loot,true,{track:true}),
 model('Если убрать все пять, останется ноль.',5,5,minus)],
 [act('Вычти 2 из 6',6,2,minus),act('Вычти 4 из 9',9,4,minus),act('Сделай три шага назад от десяти',10,3,minus,loot,true),
 arithmeticMany('Ноль и удаление всех предметов',[[5,0],[5,5]],minus),
 arithmeticMany('Открой пять сундуков',[[5,2],[4,1],[7,2],[8,2],[10,4]],minus)]],
 [[model('Соберём три и два кристалла.',3,2,plus),model('Если из пяти убрать два, снова останется три.',5,2,minus),
 countScene('Связанные записи используют одни и те же количества.',[num('3 + 2 = 5'),num('5 − 2 = 3'),num('5 − 3 = 2')])],
 [act('Убери добавленные два кристалла',5,2,minus),exercise('Какие вычитания связаны с 4 + 3 = 7?','Из семи убери одну из двух частей.',pick(
 ['7 − 3 = 4','6 − 3 = 3','7 − 4 = 3'].map(num),[0,2],num('4 + 3 = 7'))),stages('Восстанови пропуски',missing(4,3,plus,4),missing(7,3,minus,4),missing(7,4,minus,4)),
 stages('Семейство 2, 6 и 8',expression('Объедини части',2,6,plus),expression('Убери шесть',8,6,minus),expression('Убери два',8,2,minus)),
 stages('Восстанови три семьи',...[[2,3],[3,4],[4,5]].flatMap(([a,b])=>[expression('Объединение',a,b,plus),expression('Удаление первой части',a+b,a,minus),expression('Удаление второй части',a+b,b,minus)]))]],
 [[film('Из семи ягод Луми отдал три.',7,3,minus,'berry/pink'),model('Запишем вычитание. Получилось четыре.',7,3,minus,'berry/pink'),
 model('Из десяти ламп погасли четыре. Осталось шесть.',10,4,minus,'lantern/yellow')],
 [story('С дерева улетели две из пяти птиц. Сколько осталось?',5,2,minus,bird),
 story('Из восьми яблок взяли три. Сколько осталось?',8,3,minus,apples),
 story('Из десяти кристаллов четыре подарили.',10,4,minus,loot),modelSelect(8,3,minus,'lantern/yellow'),
 stages('Реши три истории',story('О фонариках',5,2,minus,'lantern/yellow'),story('О звёздах',9,3,minus,stars),story('О книгах',6,4,minus,books))]],
]);
