import {accepted,check} from './model.js';
import {mountScene,mountRound} from './board.js';
import {style,graphic,link,hero} from './ui.js';
import {lessonUrl,programUrl,moduleStars,saveCompletion} from '../course-model.js';
import {courseCompleted,celebrationUrl} from '../activities/celebration.js';
import {el,button} from '../writing/ui.js';
import {feedback} from '../speech45/voice-text.js';

export function startSpeech({root,course,module,lesson,voice,courseHero=hero}){
 style();
 const key='lumi.academy.'+lesson.format+'.lesson.'+lesson.id;
 let data;
 try{data=JSON.parse(localStorage.getItem(key));}catch{}
 const answers=[];
 for(const [i,a] of (Array.isArray(data?.answers)?data.answers:[]).entries()){
  if(!lesson.practice[i]||!check(lesson.practice[i],a))break;
  answers.push(a);
 }
 if(answers.length===lesson.practice.length){answers.length=0;data=null;}
 let task=answers.length,scene=Math.min(2,Math.max(0,Number(data?.scene)||0));
 let round=0,history=[],board;
 for(const [i,a] of (Array.isArray(data?.history)?data.history:[]).entries()){
  const view=lesson.practice[task].rounds[i];
  if(i>=lesson.practice[task].rounds.length-1||!accepted(view,a))break;
  round++;history.push(a);
 }
 function persist(phase){try{localStorage.setItem(key,JSON.stringify({phase,scene,answers,history}));}catch{}}
 function screen(title,count,hasHero=false){
  board?.dispose();
  const wrapper=el('section','lesson-step speech-lesson');
  if(hasHero)wrapper.append(courseHero(lesson.world));
  if(voice){
   const settings=el('div','speech-audio-settings');
   const label=el('label','','Громкость');
   const range=el('input');range.type='range';range.min='0';range.max='1';range.step='.05';
   range.value=String(voice.getVolume());label.append(range);
   const mute=button(voice.getVolume()?'Выключить звук':'Включить звук',()=>{
    voice.mute(Boolean(voice.getVolume()));range.value=String(voice.getVolume());
    mute.textContent=voice.getVolume()?'Выключить звук':'Включить звук';
   });
   range.addEventListener('input',()=>{voice.setVolume(Number(range.value));mute.textContent=voice.getVolume()?'Выключить звук':'Включить звук';});
   settings.append(label,mute);wrapper.append(settings);
  }else if(lesson.format==='speech45')wrapper.append(el('p','speech-grown','Режим со взрослым. Откройте подсказку и прочитайте реплики.'));

  const heading=el('h2','lesson-part',title);
  wrapper.append(heading,el('p','lesson-count',count));
  root.replaceChildren(wrapper);
  return wrapper;
 }
 function pause(restore){
  const n=screen('Перерыв','');
  n.append(button('Продолжить',restore,true),link('К урокам',programUrl(course,module)));
 }
 function explanation(){
  persist('scene');
  const n=screen('Объяснение Луми','Сцена '+(scene+1)+' из 3',true);
  const stage=el('div','speech-scene');
  const nav=el('div','lesson-actions');
  if(scene)nav.append(button('Предыдущая сцена',()=>{scene--;explanation();}));
  nav.append(button('Сделать паузу',()=>pause(explanation)));
  n.append(stage,nav);
  board=mountScene(stage,lesson.scenes[scene],{voice,last:scene===2,next:()=>{if(scene===2)practice();else{scene++;explanation();}}});
 }
 function practice(){
  persist('practice');
  const current=lesson.practice[task],n=screen(current.title,'Игра '+(task+1)+' из '+lesson.practice.length);
  const area=el('div');
  if(current.rounds.length>1)n.append(el('p','speech-grown','Этап '+(round+1)+' из '+current.rounds.length));
  n.append(area,button('Сделать паузу',()=>pause(practice)));
  board=mountRound(area,current.rounds[round],response=>{
   history.push(response);
   if(round+1<current.rounds.length){round++;practice();return;}
   answers.push(history);
   if(task+1===lesson.practice.length){finish();return;}
   task++;round=0;history=[];practice();
  },{voice});
 }
 function finish(){
  const saved=saveCompletion(course,module,lesson,answers);
  if(saved)try{localStorage.removeItem(key);}catch{}
  const stars=moduleStars(course,module),n=screen('Урок завершён!','Звёзды модуля: '+stars+' из '+module.lessons.length,true);
  if(stars===module.lessons.length&&module.speechMedal){
   const prizes=el('div','speech-row');
   for(const [src,alt] of [[module.speechMedal,module.reward],[module.speechLantern,module.speechLanternName]]){
    const img=graphic(src,alt);img.width=95;img.height=95;prizes.append(img);
   }
   n.append(prizes,el('p','speech-model',module.reward+' · '+module.speechLanternName));
  }else n.append(el('p','speech-model',saved?'Ты получил звезду!':'Браузер не сохранил звезду.'));
  if(voice)n.append(button('Послушать поздравление',()=>void voice.play(stars===module.lessons.length?feedback.world:feedback.star).catch(()=>{})));
  const nav=el('div','lesson-actions'),next=module.lessons[module.lessons.indexOf(lesson)+1];
  if(next?.scenes.length)nav.append(link('Следующий урок',lessonUrl(course,module,next)));
  if(courseCompleted(course))nav.append(link(lesson.format==='speech45'?'Королевство живых историй':'Праздник слов',celebrationUrl(course)));
  nav.append(link('К урокам',programUrl(course,module)),button('Повторить урок',()=>{
   scene=0;task=0;round=0;history=[];answers.length=0;explanation();
  }));
  n.append(nav);
 }
 if(data?.phase==='practice')practice();else explanation();
}
