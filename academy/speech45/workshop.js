import {findCourse,programUrl} from '../course-model.js';
import {el,button} from '../writing/ui.js';
import {mountRound} from '../speech/board.js';
import {style,link} from '../speech/ui.js';
import {picture} from '../speech/art.js';
import {courseHero} from './hero.js';
import {openVoice} from './voice.js';
import {mountStories} from './stories.js';

const course=findCourse('speech-4-5');
const root=document.querySelector('#speech-workshop');
const modes=[
 ['Музей предметов','cup'],['Город профессий','hammer'],['Сад описаний','flower'],
 ['Зеркало противоположностей','palace-window'],['Грамматические превращения','kitten'],
 ['Фабрика предложений','palace-draw'],['Театральная студия','stage'],['Диалоги с персонажами','bunny'],
 ['Конструктор историй','paper'],['Сказочная библиотека','book'],
];
let board,version=0;
const voices=new Map();
style();root.classList.add('speech-lesson');
document.body.classList.add('speech-finale-page');
function reset(title){
 board?.dispose();board=null;version++;
 root.replaceChildren(el('h1','',title));
}
function menu(){
 reset('Свободная речевая мастерская');
 root.prepend(courseHero(6));
 const group=el('div','speech-workshop-menu');
 for(const [i,[text,art]] of modes.entries()){
  const option=button(text,()=>i<8?void play(i,0):stories(i===8));option.classList.add('speech-menu-choice');
  option.prepend(picture(art));group.append(option);
 }
 root.append(group,link('К урокам курса',programUrl(course)));
}
async function play(index,cursor){
 reset(modes[index][0]);
 const current=version,world=index+1;
 const tasks=(index===5?course.modules[index].lessons.slice(4):course.modules[index].lessons)
  .flatMap(lesson=>(lesson.practice??[]).flatMap(task=>task.rounds));
 const host=el('div'),nav=el('div','lesson-actions');
 const next=()=>void play(index,(cursor+1)%tasks.length);
 nav.append(button('В мастерскую',menu),button('Следующее упражнение',next));
 root.append(host,nav);
 if(!tasks.length){host.textContent='Игры этого раздела ещё готовятся.';return;}
 if(!voices.has(world))voices.set(world,openVoice(world));
 const voice=await voices.get(world);
 if(current!==version)return;
 board=mountRound(host,tasks[cursor],next,{voice});
}
function stories(edit){
 reset(edit?'Новая сказка':'Мои сказки');
 mountStories(root,{editorFirst:edit});
 root.append(button('В мастерскую',menu));
}
menu();
