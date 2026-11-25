import { programUrl,saveCompletion,moduleStars,lessonUrl } from '../course-model.js';
import {readWritingProgress} from './model.js';
import {handBoard} from './hand.js';
import {objectsBoard} from './objects.js';
import {inkBoard} from './ink.js';
import {el,button} from './ui.js';

const media=new URL('./media/',import.meta.url);
function art(file,alt){
  const img=el('img');img.src=new URL(file+'.webp',media);img.alt=alt;return img;
}
function link(label,href){
  const item=el('a','academy-button',label);item.href=href;return item;
}
function boardFor(spec,settings){
  if(spec.kind==='hand')return handBoard(spec,settings);
  if(spec.kind==='ink')return inkBoard(spec,settings);
  return objectsBoard(spec,settings);
}

export function startWritingLesson({root,course,module,lesson}){
  const css=el('link');
  css.rel='stylesheet';css.href=new URL('writing.css',import.meta.url);
  document.head.append(css);
  root.classList.add('write-lesson');
  const key='lumi.academy.writing34.lesson.'+lesson.id;
  let scene=0,answers=[],rounds=[],stage='scene',view,back,draft=[];
  const status=el('p','write-feedback');
  status.setAttribute('role','status');
  const pause=button('Сделать паузу',()=>{
    store();
    back=stage;
    replace(el('h2','','Перерыв'),button('Продолжить',resume,true),link('К урокам',programUrl(course,module)));
  });
  function store(){
    try{localStorage.setItem(key,JSON.stringify({scene,answers,rounds,stage,draft}));}
    catch{status.textContent='Браузер не сохранил этап. Можно продолжать урок на этой странице.';}
  }
  function replace(...children){
    view?.destroy?.();
    view=null;
    root.replaceChildren(...children);
  }
  function resume(){
    if((back??stage)==='practice')showPractice();
    else showScene();
  }
  function actionNav(...actions){
    const nav=el('div','write-controls');nav.append(...actions);return nav;
  }
  function showScene(){
    stage='scene';
    const info=lesson.scenes[scene];
    const hero=el('div','write-location');
    hero.style.backgroundImage=`url("${new URL(lesson.world+'.webp',media)}")`;
    hero.append(art(lesson.world==='garden'&&scene===1?'lumi-watch':'lumi-'+lesson.world,'Луми'));
    replace(el('p','course-kicker','Сцена '+(scene+1)+' из 3'),hero,
      el('h2','lesson-part',info.title),el('p','write-prompt',info.description));
    view=boardFor(info.board,{example:true});
    const next=button(scene===2?'Перейти к упражнениям':'Следующая сцена',()=>{
      if(scene===2)showPractice();else {scene++;showScene();}
    },true);
    const previous=scene>0?[button('Назад',()=>{scene--;showScene();})]:[];
    root.append(view.view,actionNav(...previous,pause,next));
    store();
  }
  function showPractice(){
    stage='practice';
    const task=lesson.practice[answers.length],spec=task.rounds[rounds.length];
    status.textContent='';
    let finished=false;
    const next=button('Дальше',()=>{
      if(!finished)return;
      draft=[];
      rounds.push(spec.kind);
      if(rounds.length===task.rounds.length){answers.push(rounds);rounds=[];}
      if(answers.length===lesson.practice.length)showReward();
      else showPractice();
    },true);
    next.hidden=true;
    pause.hidden=false;
    replace(el('p','course-kicker','Упражнение '+(answers.length+1)+' из 5'),el('h2','lesson-part',task.title),
      el('p','write-prompt',task.instruction));
    view=boardFor(spec,{strokes:draft,onChange(lines){draft=lines;store();},finish(){
      if(finished)return;
      finished=true;
      status.textContent=spec.kind==='hand'&&!spec.fingers&&!spec.actions?'Можно переходить дальше.':'Получилось!';
      next.hidden=false;
      pause.hidden=true;
    }});
    root.append(view.view,status,actionNav(pause,next));
    store();
  }
  function showReward(){
    pause.hidden=false;
    const saved=saveCompletion(course,module,lesson,answers);
    if(saved)try{localStorage.removeItem(key);}catch{}
    const stars=moduleStars(course,module);
    const completed=stars===module.lessons.length;
    const header=el('h2','lesson-part','Урок завершён!');
    const reward=el('div','write-reward');
    const moduleNext=module.lessons[module.lessons.indexOf(lesson)+1];
    reward.append(art(completed?lesson.world+'-medal':'lumi-'+lesson.world,completed?module.reward:'Луми'),
      el('p','',saved?'Звёздочки модуля: '+stars+' из '+module.lessons.length:'Браузер не смог сохранить звёздочку.'));
    if(completed)reward.append(el('p','','Открыты '+module.reward.toLowerCase()+' и '+module.writingPaint+' краска.'));
    replace(header,reward,actionNav(
      ...(moduleNext?.scenes?.length?[link('Следующий урок',lessonUrl(course,module,moduleNext))]:[]),
      link('К урокам',programUrl(course,module)),button('Повторить урок',()=>{
        answers=[];rounds=[];draft=[];scene=0;showScene();
      })));
  }
  try{
    const saved=readWritingProgress(lesson,JSON.parse(localStorage.getItem(key)));
    if(saved){
      ({scene,answers,rounds,stage}=saved);
      if(Array.isArray(saved.draft))draft=saved.draft;
    }
  }catch{}
  resume();
}
