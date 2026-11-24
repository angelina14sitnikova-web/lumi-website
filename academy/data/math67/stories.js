import { num } from '../math56/digits.js';

import { token, scene, lesson, exercise, pick, stages } from '../math45/builders.js';
import { expression, act } from './arithmetic.js';
const plus='+', minus='−';
const book='book/sky', bird='bird/blue', apple='apple/red', gem='crystal/sky', flower='flower/pink', lantern='lantern/yellow';
const story=(a,b,kind,tag)=>({a,b,kind,tag});
const join=(a,b,tag)=>story(a,b,'join',tag);
const remove=(a,b,tag)=>story(a,b,'remove',tag);
const needed=(a,b,tag)=>story(a,b,'needed',tag);
const op=s=>s.kind==='join'?plus:minus;
const demo=(text,s,mode)=>scene('math67-story',text,[token(s.tag)],{story67:{...s,mode}});
const test=(prompt,s,mode)=>exercise(prompt,'Посмотри на действие. Если нужно, попроси взрослого прочитать условие.',
 pick([num(0)],0,null,{story67:{...s,mode}}));
const build=(prompt,options,settings={})=>exercise(prompt,'Выбери предметы, количества и действие. Затем реши получившуюся задачу.',
 pick([num(0)],0,null,{storyBuilder67:{options,...settings}}));
const solve=(prompt,s)=>stages(prompt,test('Выдели известные количества',s,'facts'),test('О чём вопрос?',s,'question'),
 test('Какое действие поможет решить задачу?',s,'action'),act('Проверь ответ предметами',s.a,s.b,op(s),s.tag));
const a=join(4,2,book), b=remove(7,2,gem), c=needed(8,5,lantern), d=join(3,2,apple);
const options=[{tag:apple,name:'Яблоки'},{tag:gem,name:'Кристаллы'},{tag:flower,name:'Цветы'}];
const many=(prompt,tasks)=>stages(prompt,...tasks);
const lessons=[
 [[demo('На полке четыре книги. На полку ставят ещё две.',a,'plot'),demo('Известны две группы: четыре книги и две книги.',a,'facts'),
 demo('Для вопроса о книгах нужны количества книг.',a,'decoration')],
 [test('Выбери начальное количество',a,'first'),test('Сколько добавили?',d,'second'),test('Найди известные числа',b,'facts'),
 test('Найди данные среди деталей',a,'decoration'),many('Собери три карточки условия',[a,b,c].map(s=>test('Что известно?',s,'facts')))]],
 [[demo('Числа обозначают известные группы, вопрос — неизвестную.',a,'unknown'),demo('При объединении спросим, сколько получилось.',a,'question'),demo('После удаления выясним, сколько осталось.',b,'question')],
 [test('Покажи место неизвестного',a,'unknown'),test('Подбери вопрос об объединении',d,'question'),test('Подбери вопрос об остатке',b,'question'),
 test('Подбери вопрос о недостающем количестве',c,'question'),many('Восстанови вопросы трёх историй',[b,a,c].map(s=>test('О чём история?',s,'question')))]],
 [[demo('Для двух групп, которые собираем вместе, подходит плюс.',a,'action'),demo('Когда убираем часть, выбираем минус.',b,'action'),
 demo('Чтобы найти, сколько не хватает, сравним нужное количество и то, что уже есть.',c,'action')],
 [test('Как решить задачу о прилетевших птицах?',join(3,4,bird),'action'),
 test('Как решить задачу об отданных яблоках?',remove(6,2,apple),'action'),
 expression('Собери модель к сцене',4,2,plus,book),test('Найди действие для недостающего количества',c,'action'),
 many('Разложи шесть задач по действиям',[a,b,c,d,remove(10,6,lantern),join(2,5,flower)].map(s=>test('Подбери действие',s,'action')))]],
 [[demo('Есть две группы игрушек.',join(3,4,'bear/brown'),'facts'),demo('Спросим, сколько игрушек в обеих группах.',join(3,4,'bear/brown'),'question'),
 demo('На картинках видно, что часть кристаллов убрали.',b,'question')],
 [test('Подбери числа к картинке',a,'facts'),test('Выбери подходящий вопрос',b,'question'),
 test('Собери условие из карточек',d,'facts'),expression('Запиши действие по двум картинкам',7,2,minus,gem),
 build('Создай и реши задачу по выбранным предметам',options)]],
 [[demo('В корзине три яблока. Добавим два.',d,'plot'),demo('Спросим, сколько яблок теперь в корзине.',d,'question'),
 demo('Уберём часть и спросим, сколько осталось.',b,'question')],
 [test('Выбери данные из сцены',d,'facts'),test('Подбери вопрос',b,'question'),
 expression('Составь математическую запись',3,2,plus,apple),
 build('Выбери действие и создай задачу',options,{saveStory:true}),
 exercise('Реши свою задачу и проверь по предметам','Выполни действие и пересчитай предметы.',pick([num(0)],0,null,{solveOwnStory:true}))]],
 [[demo('Выделим известные числа и вопрос.',a,'facts'),demo('Выберем действие по сюжету.',a,'action'),
 demo('Проверим получившийся ответ по картинке.',a,'answer')],
 [solve('К четырём цветам посадили ещё три.',join(4,3,flower)),
 solve('Из девяти кристаллов пять забрали.',remove(9,5,gem)),
 solve('Нужно восемь фонариков. Уже есть пять.',c),
 build('Реши задачу на объединение с выбранной моделью',options,{onlyJoin:true}),
 many('Раскрой математическое дело',[a,b,c].map(s=>solve('Реши историю',s)))]],
];
export { solve, build, join, remove, needed };
export const detectives=Object.fromEntries(lessons.map(([scenes,practice],index)=>[
 'math-67-lesson-5-'+(index+1),lesson('detective-office',scenes,practice),
]));
