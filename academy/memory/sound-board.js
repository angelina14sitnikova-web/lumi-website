import { artTitle,picture } from './art.js';
import { shuffleOptions } from './model.js';

const crystals=['crystal-a','crystal-b','crystal-c'];
const aria={one:'Один огонёк',two:'Два огонька',yes:'Звук был',no:'Звука не было'};
export const namedSounds=['bell','drum','rattle','cat','dog','duck','bird'];

function node(tag,name,text='') {
  const el=document.createElement(tag);
  el.className=name;
  el.textContent=text;
  return el;
}
function control(label,action,style='lesson-secondary mem-button') {
  const el=node('button',style,label);
  el.type='button';
  el.addEventListener('click',action);
  return el;
}
function cardImage(id,style) {
  const el=node('span','mem-glyph '+style);
  el.setAttribute('aria-hidden','true');
  const number=crystals.indexOf(id);
  if (number>=0) el.textContent='◆'.repeat(number+1);
  else if(id==='one' || id==='two') el.textContent=id==='one'?'●':'● ●';
  else if(id==='yes' || id==='no') el.textContent=id==='yes'?'≈':'—';
  else el.append(picture(id));
  return el;
}

export function makeSoundBoard(round,{play,answer,options=new Map(),announce=()=>{},example=false,hotZones}={}) {
  const view=node('section','mem-sound-board');
  const message=node('p','mem-sound-note');
  message.setAttribute('role','status');
  const cards=node('div','mem-options');
  const state=node('div','mem-sound-step');
  const preview=new Map();
  const heard=new Set();
  const chosen=[];
  let ready=false;
  let finished=false;
  let playingChoice=false;
  let busy=0;
  let voiceDone;
  const order=round.audioMode==='volume'?round.options:shuffleOptions(round.options);
  const paired=round.audioMode==='cards';
  function triggerOptions() {
    for (const [id,buttons] of options) for(const item of buttons) item.disabled=finished || playingChoice || !ready || (paired && !heard.has(id));
    if(voiceDone) voiceDone.disabled=finished || playingChoice || !ready;
  }
  async function listen() {
    const request=++busy;
    ready=false;
    playingChoice=false;
    heard.clear();
    chosen.length=0;
    state.replaceChildren();
    triggerOptions();
    for(const sample of preview.values()) sample.disabled=true;
    trigger.textContent='Послушать ещё раз';
    message.textContent='Слушаем';
    const result=await play(round.clips);
    if(request!==busy || !view.isConnected) return;
    ready=result==='finished';
    if (ready) {
      for(const sample of preview.values()) sample.disabled=finished;
      if(example) showExample();
      message.textContent='';
    } else {
      message.textContent=result==='muted'?'Взрослым: верните громкость, чтобы выполнить задание.':'Повтори прослушивание.';
    }
    triggerOptions();
  }
  const trigger=control('Послушать образец',()=>{void listen();},'academy-button mem-button mem-listen');
  view.append(trigger,cards,state,message);
  if(round.optionalVoice && !example) {
    voiceDone=control('Я повторил голосом',()=>{ if(ready&&!finished) answer(round.answer); });
    view.append(voiceDone,node('p','mem-sound-note','Можно повторить вслух или нажать на инструмент.'));
  }
  function showExample() {
    const revealed=[].concat(round.answer);
    state.replaceChildren(...revealed.map(id=>cardImage(id,'mem-example-glyph')));
    for(const id of revealed) options.get(id)?.forEach(option=>option.classList.add('mem-found'));
  }
  async function audition(id) {
    if(!ready||finished) return;
    const request=++busy;
    const result=await play([round.demos[id]]);
    if(request!==busy||result!=='finished') return;
    heard.add(id);
    triggerOptions();
  }
  async function select(id,shouldPlay=true) {
    if(!ready||finished||example) return;
    if(paired && !heard.has(id)) return;
    const list=Array.isArray(round.answer);
    if(list && chosen.length>=round.answer.length) return;
    if(shouldPlay&&round.audioMode==='repeat'&&round.demos[id]) {
      if(playingChoice) return;
      playingChoice=true;
      triggerOptions();
      const request=++busy;
      const result=await play([round.demos[id]]);
      if(request!==busy) return;
      playingChoice=false;
      triggerOptions();
      if(result!=='finished') return;
    }
    if(!list) {
      answer(id);
      return;
    }
    chosen.push(id);
    state.append(cardImage(id,'mem-example-glyph'));
    if(chosen.length===round.answer.length) {
      const completed=chosen.splice(0);
      if(!completed.every((choice,index)=>choice===round.answer[index])) state.replaceChildren();
      answer(completed);
    }
  }
  if(hotZones) {
    const region=hotZones(id=>{void select(id,false);});
    for(const [id,group] of region.hotSpots) options.set(id,group);
    cards.append(region.board);
  } else {
    for(const id of order){
      const group=node('div','mem-acoustic-card');
      const option=control('',()=>{void select(id);},'mem-card');
      option.setAttribute('aria-label',aria[id] ?? (crystals.includes(id)?'Карточка '+(crystals.indexOf(id)+1):artTitle(id)));
      option.dataset.choice=id;
      option.append(cardImage(id,'mem-answer-art'));
      if((paired||round.audioMode==='volume')&&round.demos?.[id]){
        const sample=control('Слушать',()=>{void audition(id);},'lesson-secondary mem-button');
        sample.dataset.preview=id;
        sample.disabled=true;
        preview.set(id,sample);
        group.append(sample);
      }
      options.set(id,[option]);
      group.append(option);
      cards.append(group);
    }
  }
  if(round.audioMode==='lantern') {
    const bulbs=[node('span','mem-lamp'),node('span','mem-lamp')];
    cards.prepend(node('div','mem-lamps'));
    cards.firstElementChild.append(...bulbs);
    for(const [key,amount] of [['one',1],['two',2]]) {
      options.get(key)?.[0].addEventListener('click',()=>bulbs.forEach((bulb,i)=>bulb.classList.toggle('lit',i<amount)));
    }
  }
  triggerOptions();
  return {view,listen,
    finish() {
      finished=true;
      trigger.disabled=true;
      for(const sample of preview.values()) sample.disabled=true;
      triggerOptions();
    },
  };
}
