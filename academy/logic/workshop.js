import {findCourse,programUrl} from '../course-model.js';
import {mountBoard} from './board.js';
import {styles,link,hero} from './ui.js';
import {icon} from './art.js';
import {el,button} from '../writing/ui.js';

const course=findCourse('logic-3-4'),root=document.querySelector('#logic-workshop');
const choices=[
 ['Сравниваем предметы','image',0,0],['Сортируем коллекции','color',1,0],
 ['Находим пары','shape',2,0],['Ищем лишний предмет','size',3,0],['Собираем пазлы','part',4,0],
 ['Продолжаем закономерности','next',5,3],['Решаем сюжетные задачи','watering',6,3],
];
styles();
root.classList.add('logic-lesson');
let board;
function menu(){
 board?.dispose();
 const list=el('div','logic-workshop-options');
 for(const [title,picture,module,lesson] of choices){
  const b=button(title,()=>play(title,module,lesson,0));
  b.prepend(icon(picture));
  list.append(b);
 }
 root.replaceChildren(hero(7),el('h1','','Мастерская головоломок'),list,link('К курсу',programUrl(course)));
}
function play(title,module,lesson,index){
 board?.dispose();
 const rounds=course.modules[module].lessons[lesson].practice.flatMap(task=>task.rounds);
 const panel=el('div'),nav=el('div','lesson-actions');
 nav.append(button('Выбрать другую игру',menu),button('Начать заново',()=>play(title,module,lesson,index)));
 root.replaceChildren(el('h1','',title),el('p','logic-step','Вариант '+(index+1)+' из '+rounds.length),panel,nav);
 board=mountBoard(panel,rounds[index],{next:()=>play(title,module,lesson,(index+1)%rounds.length)});
}
menu();
