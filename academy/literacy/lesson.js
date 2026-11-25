import { checkAnswer, moduleStars, programUrl, saveCompletion, lessonUrl } from '../course-model.js';
import { celebrationUrl, courseCompleted } from '../activities/celebration.js';
import { button,el } from '../writing/ui.js';
import { mountForestLesson } from './forest-lesson.js';

const media=new URL('./media/',import.meta.url);
function link(label,href){
  const anchor=el('a','academy-button',label);
  anchor.href=href;
  return anchor;
}
export function startListeningLesson({root,course,module,lesson}){
  const css=el('link');
  css.rel='stylesheet';css.href=new URL('forest.css',import.meta.url);
  document.head.append(css);
  const key='lumi.academy.literacy34.lesson.'+lesson.id;
  let saved=null,active;
  try{
    saved=JSON.parse(localStorage.getItem(key));
    if(!saved||!Array.isArray(saved.answers)||saved.answers.length>=lesson.practice.length||
      saved.answers.some((answer,i)=>!checkAnswer(lesson.practice[i],answer))) saved=null;
  }catch{saved=null;}
  const settings={save(state){
    saved=structuredClone(state);
    try{localStorage.setItem(key,JSON.stringify(saved));}catch{}
  },finish(answers){
    active?.dispose();
    const completed=saveCompletion(course,module,lesson,answers);
    if(completed)try{localStorage.removeItem(key);}catch{}
    const stars=moduleStars(course,module);
    const earned=stars===module.lessons.length;
    const current=el('section','lesson-step literacy-reward');
    const art=el('img');
    art.width=170;art.alt=earned?module.reward:'Луми';
    art.src=earned?new URL(lesson.world+'/medal.webp',media):new URL('../../images/lumi-transparent.png',import.meta.url);
    const nav=el('div','lesson-actions');
    const next=module.lessons[module.lessons.indexOf(lesson)+1];
    if(next?.scenes?.length)nav.append(link('Следующий урок',lessonUrl(course,module,next)));
    if (courseCompleted(course)) nav.append(link('Открыть праздник звуков', celebrationUrl(course)));
    nav.append(link('К урокам',programUrl(course,module)),button('Повторить урок',()=>{saved=null;start();}));
    current.append(el('h2','lesson-part','Урок завершён!'),art,
      el('p','',completed?'Звёздочки: '+stars+' из '+module.lessons.length:'Браузер не сохранил звёздочку.'),nav);
    root.replaceChildren(current);
  }};
  function start(){
    active=mountForestLesson(root,lesson,{...settings,saved});
    root.append(button('Сделать паузу',()=>{
      active?.dispose();
      const panel=el('div','lesson-step literacy-reward');
      panel.append(el('h2','lesson-part','Перерыв'),button('Продолжить',start,true),link('К урокам',programUrl(course,module)));
      root.replaceChildren(panel);
    }));
  }
  start();
}
