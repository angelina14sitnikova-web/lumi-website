import {el,button,reduced} from '../writing/ui.js';
import {accepted,example,isSpoken} from './model.js';
import {picture,caption} from './art.js';

function graphic(art,label,action='show'){
 const wrapper=el('div','speech-graphic');
 wrapper.setAttribute('role','img');wrapper.setAttribute('aria-label',label??caption(art));
 wrapper.classList.add('speech-'+action,'speech-animated');
 if(art==='lumi'){
  const original=el('img');original.src=new URL('../../images/lumi-transparent.png',import.meta.url);
  original.alt='';wrapper.append(original);
 }else wrapper.append(picture(art));
 return wrapper;
}
function adultPanel(item,withTranscript=false){
 const notes=el('details','speech-adult ym-hide-content');
 notes.append(el('summary','','Подсказка взрослому'),el('p','',item.instructionText),
  el('p','','Речевой образец. '+item.speechModel),el('p','',item.adultPrompt));
 if(withTranscript&&item.transcript!==item.speechModel)notes.append(el('p','speech-transcript',item.transcript));
 return notes;
}
function audioControl(item,controls){
 let audio;
 if(item.audioSrc){
  audio=new Audio(item.audioSrc);
  audio.preload='none';
  const error=el('span','speech-status');
  error.setAttribute('role','status');
  controls.append(button('Послушать',async()=>{
   try{audio.currentTime=0;await audio.play();error.textContent='';}
   catch{error.textContent='Откройте подсказку взрослому, чтобы прочитать образец.';}
  }),error);
 }
 return ()=>audio?.pause();
}
function ease(){return new Promise(resolve=>setTimeout(resolve,reduced()?90:620));}

export function mountScene(host,scene,{next,last}){
 const stage=el('div','speech-demo'),ctrl=el('div','lesson-actions');
 const replay=button('Посмотреть ещё раз',()=>void play());
 const forward=button(last?'Перейти к практике':'Следующая сцена',next,true);
 const stopAudio=audioControl(scene,ctrl);
 ctrl.append(replay,forward);
 const notes=adultPanel(scene,true);
 if(scene.requiresAdult&&!scene.audioSrc)notes.open=true;
 const guidance=el('p','speech-grown',scene.requiresAdult&&!scene.audioSrc?'Прочитайте вместе со взрослым.':'');
 const instruction=el('p','speech-instruction',scene.instructionText);
 const line=el('p','speech-model');
 host.replaceChildren(instruction,stage,line,guidance,notes,ctrl);
 let version=0;
 async function play(){
  const latest=++version;
  stage.replaceChildren();line.textContent='';forward.disabled=true;
  for(const current of scene.frames){
   if(version!==latest)return;
   const tile=graphic(current.art,current.label,current.action);
   if(current.reset)stage.replaceChildren();
   stage.append(tile);line.textContent=current.says??'';
   await ease();
  }
  if(version===latest){line.textContent=scene.speechModel;forward.disabled=false;}
 }
 void play();
 return {dispose(){version++;stopAudio();}};
}

function draggable(item,view,id,drop){
 let pointer=null,hideClick=false;
 function stop(){pointer?.ghost?.remove();pointer=null;}
 item.addEventListener('pointerdown',e=>{
  if(!e.isPrimary||e.button!==0)return;
  pointer={id:e.pointerId,x:e.clientX,y:e.clientY};
  item.setPointerCapture(e.pointerId);
 });
 item.addEventListener('pointermove',e=>{
  if(pointer?.id!==e.pointerId)return;
  if(!pointer.ghost&&Math.hypot(e.clientX-pointer.x,e.clientY-pointer.y)>9){
   pointer.ghost=item.cloneNode(true);pointer.ghost.classList.add('speech-ghost');
   pointer.ghost.style.width=item.offsetWidth+'px';view.append(pointer.ghost);
  }
  if(pointer.ghost){pointer.ghost.style.left=e.clientX+'px';pointer.ghost.style.top=e.clientY+'px';}
 });
 item.addEventListener('pointerup',e=>{
  if(pointer?.id!==e.pointerId)return;
  if(pointer.ghost){
   const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-destination]');
   hideClick=true;setTimeout(()=>hideClick=false,0);
   if(target&&view.contains(target))drop(id,Number(target.dataset.destination));
  }
  stop();
 });
 item.addEventListener('pointercancel',stop);item.addEventListener('lostpointercapture',stop);
 return ()=>hideClick;
}

export function mountRound(host,round,next){
 const wrap=el('section','speech-board'),display=el('div','speech-game'),reply=el('div','speech-feedback');
 const status=el('p','speech-status');status.setAttribute('role','status');
 const controls=el('div','lesson-actions'),mode=round.responseMode;
 let selected=null,picks=[],placed=Array(round.slots?.length??0).fill(null),correct=false,attempts=0,spoken=false;
 let value;
 const notes=adultPanel(round,true);
 notes.open=round.requiresAdult&&!round.audioSrc;
 const proceed=button('Продолжить',()=>next(value),true);proceed.hidden=true;
 const stopAudio=audioControl(round,controls);
 function card(item,click,matching=false){
  const b=button('',click);b.className='speech-card';b.dataset.card=item.id;
  b.setAttribute('aria-label',item.label??caption(item.art));
  b.setAttribute('aria-pressed',String(selected===item.id||picks.includes(item.id)));
  b.append(graphic(item.art,item.label,item.action));
  if(item.action)b.classList.add('speech-card-motion');
  if(matching)b.classList.add('speech-target');
  if(selected===item.id||picks.includes(item.id))b.classList.add('speech-selected');
  if(attempts>=2&&(round.correct?.includes(item.id)||round.slots?.some((s,i)=>!placed[i]&&s.accept.includes(item.id))))b.classList.add('speech-hint');
  b.disabled=correct;
  return b;
 }
 function hint(){
  attempts=2;
  status.textContent='Подсказка на картинке. Можно попробовать ещё раз.';
  draw();
 }
 function miss(){
  attempts++;
  status.textContent=attempts>=2?'Посмотри на подсветку и попробуй снова.':'Давай попробуем ещё раз.';
  draw();
 }
 function finish(answer){
  if(!accepted(round,answer)){miss();return;}
  correct=true;value=answer;draw();reply.replaceChildren();
  if(round.result){
   for(const item of [].concat(round.result))reply.append(graphic(item.art??item,item.label,item.action??'rise'));
  }
  const model=round.models?.[selected]??round.speechModel;
  reply.append(el('p','speech-model',model));
  if(round.partner)reply.append(el('p','speech-partner',round.partner));
  status.textContent=isSpoken(round)?'Можно продолжать.':'Игровое действие выполнено. Можно сказать вместе.';
  proceed.hidden=false;
  if(isSpoken(round)&&spoken)proceed.focus({preventScroll:true});
 }
 function drop(id,index){
  if(correct)return;
  const slot=round.slots[index];
  if(!slot.accept.includes(id)){miss();return;}
  const move=placed.indexOf(id);
  if(mode!=='paint'&&move>=0)placed[move]=null;
  placed[index]=id;selected=null;status.textContent='';
  if(placed.every(Boolean))finish([...placed]);else draw();
 }
 function showContext(){
  if(!round.context)return;
  const scene=el('div','speech-context');scene.append(graphic(round.context,round.contextLabel));
  display.append(scene);
 }
 function draw(){
  display.replaceChildren();
  if(round.review&&!isSpoken(round))display.append(button('Показать исходную картинку',()=>{
   const before=graphic(round.review,'Исходная картинка','rise');
   display.querySelector('[data-review]')?.remove();before.dataset.review='';display.prepend(before);
  }));
  showContext();
  if(round.slots){
   const slots=el('div',round.map?'speech-map':'speech-row speech-slots');
   if(round.map)slots.append(graphic(round.map,'Место для игрушки'));
   round.slots.forEach((slot,index)=>{
    const a=placed[index]!=null?(mode==='paint'&&round.paintItems?.[index]
     ? round.paintItems[index]+':'+placed[index]:round.cards.find(x=>x.id===placed[index]).art):slot.art;
    const target=card({id:'slot-'+index,art:a,label:slot.label??'Место '+(index+1)},()=>{
     if(selected!=null){drop(selected,index);return;}
     if(placed[index]!=null&&!correct){placed[index]=null;draw();}
    },true);
    target.dataset.destination=index;
    if(round.map&&slot.area){
     const [x,y,w,h]=slot.area;Object.assign(target.style,{left:x+'%',top:y+'%',width:w+'%',height:h+'%'});
    }
    if(placed[index]!=null)target.classList.add('speech-selected');
    if(attempts>=2&&selected!=null&&slot.accept.includes(selected))target.classList.add('speech-hint');
    slots.append(target);
   });
   display.append(slots);
  }
  const bank=el('div','speech-row');
  for(const item of round.cards){
   if(round.slots&&mode!=='paint'&&placed.includes(item.id))continue;
   if(isSpoken(round)&&!round.chooseVisual){
    bank.append(graphic(item.art,item.label,item.action));continue;
   }
   const node=card(item,()=>{
    if(isSpoken(round)){selected=item.id;draw();return;}
    if(mode==='choose'||mode==='parts'){selected=item.id;finish(item.id);return;}
    if(mode==='multi'){
     if(picks.includes(item.id))picks=picks.filter(id=>id!==item.id);else picks.push(item.id);
     draw();return;
    }
    if(ignore())return;
    selected=selected===item.id?null:item.id;draw();
    display.querySelector('[data-card="'+item.id+'"]')?.focus({preventScroll:true});
   });
   const ignore=round.slots?draggable(node,wrap,item.id,drop):()=>false;
   if(round.slots)node.classList.add('speech-draggable');
   if(mode==='parts'&&item.area){
    const [x,y,w,h]=item.area;
    Object.assign(node.style,{left:x+'%',top:y+'%',width:w+'%',height:h+'%'});node.classList.add('speech-hotspot');
   }
   bank.append(node);
  }
  if(mode==='parts'&&round.diagram){
   bank.classList.add('speech-diagram');bank.prepend(graphic(round.diagram,'Схема'));
  }
  display.append(bank);
 }
 if(isSpoken(round)){
  const cue=button(round.modeButton??(mode==='listen'?'Прочитали вместе':'Продолжить'),()=>{
   if(round.chooseVisual&&selected==null){status.textContent='Выбери картинку, чтобы показать свой вариант.';return;}
   spoken=true;cue.hidden=true;finish('continue');
  },true);
  if(!round.result&&!round.partner&&!round.chooseVisual){
   controls.append(button('Рассказали вместе',()=>next('continue'),true));
  }else controls.append(cue);
 }else{
  controls.append(button('Подсказка',hint));
  if(mode==='multi'){
   const verify=button('Проверить',()=>{if(!correct)finish([...picks]);});
   controls.append(verify);
  }
 }
 controls.append(proceed);
 wrap.append(el('p','speech-instruction',round.instructionText),
  ...(round.requiresAdult&&!round.audioSrc?[el('p','speech-grown','Вместе со взрослым')]:[]),
  display,reply,status,notes,controls);
 host.replaceChildren(wrap);draw();
 return {dispose(){stopAudio();}};
}
