import {check} from './model.js';
import {mountBoard} from './board.js';
import {worlds} from '../data/logic34/builders.js';
import {lessonUrl,programUrl,saveCompletion,moduleStars} from '../course-model.js';
import {courseCompleted,celebrationUrl} from '../activities/celebration.js';
import {el,button} from '../writing/ui.js';

export function styles(){
 if(document.querySelector('[data-logic-styles]'))return;
 const link=el('link');
 link.rel='stylesheet';link.href=new URL('logic.css',import.meta.url);link.dataset.logicStyles='';
 document.head.append(link);
}
export function link(text,href){
 const n=el('a','academy-button',text);n.href=href;return n;
}
export function graphic(src,alt=''){
 const img=el('img');img.src=src;img.alt=alt;return img;
}
export function hero(world){
 const n=el('div','logic-hero');
 n.append(graphic(new URL('./media/world-'+world+'.webp',import.meta.url)),
  graphic(new URL('../../images/lumi-transparent.png',import.meta.url),'Луми'));
 if(worlds[world-1])n.append(el('p','',worlds[world-1]));
 return n;
}
export function startLogic({root,course,module,lesson}){
 styles();
 const key='lumi.academy.logic.lesson.'+lesson.id;
 let saved;
 try{saved=JSON.parse(localStorage.getItem(key));}catch{}
 const answers=[];
 for(const [i,a] of (Array.isArray(saved?.answers)?saved.answers:[]).entries()){
  if(!lesson.practice[i]||!check(lesson.practice[i],a))break;
  answers.push(a);
 }
 if(answers.length===lesson.practice.length){answers.length=0;saved=null;}
 let i=answers.length,scene=Math.max(0,Math.min(2,saved?.scene||0));
 let round=Math.max(0,Math.min(lesson.practice[i].rounds.length-1,saved?.round||0));
 let prior=Array.isArray(saved?.prior)&&saved.prior.length===round?saved.prior:[],board;
 if(prior.length!==round)round=0;
 function persist(phase){try{localStorage.setItem(key,JSON.stringify({phase,scene,round,answers,prior}));}catch{}}
 function panel(title,caption,withHero=false){
  board?.dispose();
  const n=el('section','lesson-step logic-lesson');
  if(withHero)n.append(hero(lesson.world));
  n.append(el('h2','lesson-part',title),el('p','lesson-count',caption));root.replaceChildren(n);return n;
 }
 function pause(restore){
  const n=panel('Перерыв','');n.append(button('Продолжить',restore,true),link('К урокам',programUrl(course,module)));
 }
 function explain(){
  persist('scene');
  const current=lesson.scenes[scene],n=panel('Объяснение Луми','Сцена '+(scene+1)+' из 3',true);
  const area=el('div'),nav=el('div','lesson-actions');
  n.append(el('p','logic-caption',current.text),area,nav);
  board=mountBoard(area,current.example,{demo:true});
  if(scene)nav.append(button('Предыдущая сцена',()=>{scene--;explain();}));
  nav.append(button('Посмотреть ещё раз',()=>board.play()),
   button(scene===2?'Перейти к практике':'Следующая сцена',()=>{if(scene===2)play();else{scene++;explain();}},true),
   button('Сделать паузу',()=>pause(explain)));
  void board.play();
 }
 function play(){
  persist('practice');
  const task=lesson.practice[i],n=panel(task.title,'Игра '+(i+1)+' из '+lesson.practice.length);
  if(task.rounds.length>1)n.append(el('p','logic-step','Этап '+(round+1)+' из '+task.rounds.length));
  const area=el('div'),nav=el('div','lesson-actions');
  nav.append(button('Сделать паузу',()=>pause(play)));
  n.append(area,nav);
  board=mountBoard(area,task.rounds[round],{next:value=>{
   prior.push(value);
   if(round+1<task.rounds.length){round++;play();return;}
   answers[i]=prior;
   if(i+1===lesson.practice.length){finish();return;}
   i++;round=0;prior=[];play();
  }});
 }
 function finish(){
  const ok=saveCompletion(course,module,lesson,answers);
  if(ok)try{localStorage.removeItem(key);}catch{}
  const stars=moduleStars(course,module),n=panel('Урок завершён!',stars+' из '+module.lessons.length+' звёзд модуля',true);
  if(ok&&stars===module.lessons.length){
   const rewards=el('div','logic-rewards');
   rewards.append(graphic(module.logicMedal,module.reward),graphic(module.logicKeyArt,module.logicKey));
   n.append(rewards,el('p','logic-caption',module.reward+' · '+module.logicKey));
  }else n.append(el('p','logic-caption',ok?'Ты получил звезду!':'Браузеру не удалось сохранить звезду.'));
  const nav=el('div','lesson-actions'),next=module.lessons[module.lessons.indexOf(lesson)+1];
  if(next?.scenes.length)nav.append(link('Следующий урок',lessonUrl(course,module,next)));
  if(courseCompleted(course))nav.append(link('Праздник открытий',celebrationUrl(course)));
  nav.append(link('К урокам',programUrl(course,module)),button('Повторить урок',()=>{
   scene=0;round=0;i=0;prior=[];answers.length=0;explain();
  }));
  n.append(nav);
 }
 if(saved?.phase==='practice')play();else explain();
}
