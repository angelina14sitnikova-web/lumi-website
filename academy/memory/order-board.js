import { artTitle,picture } from './art.js';
import { shuffleOptions } from './model.js';
import { events } from '../data/memory34/railway.js';

const moves={reach:'Поднять лапки',clap:'Хлопнуть',hop:'Подпрыгнуть',wave:'Помахать лапкой'};
const dir=new URL('./media/',import.meta.url);
function el(tag,style,text='') {
  const node=document.createElement(tag);
  node.className=style; node.textContent=text;
  return node;
}
function button(text,action,style='lesson-secondary mem-button') {
  const node=el('button',style,text);
  node.type='button';
  node.addEventListener('click',action);
  return node;
}
function reduced() {return matchMedia('(prefers-reduced-motion: reduce)').matches;}

const movements={
  clap:[{transform:'scale(1)'},{transform:'scale(0.93)'},{transform:'scale(1)'}],
  hop:[{transform:'translateY(0)'},{transform:'translateY(-18px)'},{transform:'translateY(0)'}],
  reach:[{transform:'translateY(9px)'},{transform:'translateY(-6px)'},{transform:'translateY(0)'}],
  wave:[{transform:'rotate(-5deg)'},{transform:'rotate(6deg)'},{transform:'rotate(0)'}],
  roll:[{transform:'translateX(-35%) rotate(-120deg)'},{transform:'translateX(35%) rotate(20deg)'}],
  stir:[{transform:'rotate(-16deg)'},{transform:'rotate(25deg)'},{transform:'rotate(-1deg)'}],
  drop:[{transform:'translateY(-22px)'},{transform:'translateY(12px)'}],
  default:[{transform:'translateY(9px) scale(.90)',opacity:.55},{transform:'translateY(0) scale(1)',opacity:1}],
};
function moveArt(id) {
  const art=el('img','mem-movement');
  art.src=new URL('lumi-'+id+'.webp',dir);
  art.alt='';
  art.draggable=false;
  return art;
}
function tile(id,family,animated=false) {
  const card=el('div','mem-event-tile');
  const event=events[id];
  if (family==='moves') {
    const art=moveArt(id);
    card.append(art);
    if(animated&&!reduced()) art.animate(movements[id],{duration:530,easing:'ease-in-out'});
    return card;
  }
  if (event && family==='events') {
    const anchor=el('div','mem-event-object');
    const prop=el('div','mem-event-primary');
    anchor.append(picture(event.object));
    prop.append(picture(event.art));
    card.append(anchor,prop);
    if(animated&&!reduced()) prop.animate(movements[event.action]??movements.default,{duration:540,easing:'ease-in-out'});
  } else card.append(picture(id));
  return card;
}
const titleFor=id=>moves[id]??events[id]?.name??artTitle(id);

export function makeOrderBoard(round,{answer,options=new Map(),example=false}={}) {
  const part=el('section','mem-order-board');
  const player=el('div','mem-order-player');
  const stage=el('div','mem-order-stage');
  const choices=el('div','mem-options');
  const slots=el('div','mem-order-slots');
  const commands=el('div','mem-order-actions lesson-actions');
  const optionOrder=shuffleOptions(round.options);
  const chosen=[];
  let frame=0;
  let serial=0;
  let phase='watch';
  const watch=button('Смотреть порядок',()=>{void play();},'academy-button mem-button');
  const frameButton=button('Следующий кадр',()=>{
    frame++;
    showFrame(frame);
    if (frame===round.sample.length-1) ready();
  });
  const confirm=button('Готово. Показать варианты',hide,'academy-button mem-button');
  frameButton.hidden=confirm.hidden=true;
  commands.append(watch,frameButton,confirm);
  player.append(stage,commands);
  part.append(player,slots,choices);
  slots.hidden=choices.hidden=true;

  function showFrame(i) {
    stage.replaceChildren(tile(round.sample[i],round.family,true));
  }
  function reset() {
    serial++;
    phase='watch';
    chosen.length=0;
    stage.replaceChildren(tile(round.sample[0],round.family));
    choices.replaceChildren();
    options.clear();
    slots.replaceChildren();
    choices.hidden=slots.hidden=true;
    stage.hidden=false;
    frameButton.hidden=confirm.hidden=true;
  }
  function ready() {
    frameButton.hidden=true;
    confirm.hidden=false;
    phase='ready';
  }
  async function play() {
    reset();
    const run=serial;
    watch.textContent='Смотреть ещё раз';
    showFrame(0);
    if(reduced()) {
      frame=0;
      if(round.sample.length>1) frameButton.hidden=false;
      else ready();
      return;
    }
    for(let i=1;i<round.sample.length;i++){
      await new Promise(resolve=>setTimeout(resolve,780));
      if(run!==serial||!part.isConnected) return;
      showFrame(i);
    }
    if(run===serial&&part.isConnected) ready();
  }

  function renderSlots(items) {
    const list=round.variants?.[round.answer]??[].concat(round.answer);
    const nodes=list.map((_,index)=>{
      const slot=el('div','mem-order-slot');
      if(items[index]) slot.append(tile(items[index],round.family,true));
      return slot;
    });
    slots.replaceChildren(...nodes);
  }

  function hide() {
    if(phase!=='ready') return;
    phase='answer';
    stage.replaceChildren();
    stage.hidden=true;
    confirm.hidden=true;
    choices.hidden=slots.hidden=false;
    if(example) {
      renderSlots(round.variants?.[round.answer]??[].concat(round.answer));
      return;
    }
    renderSlots([]);
    for(const id of optionOrder){
      const card=button('',()=>{
        if(phase!=='answer') return;
        if(!Array.isArray(round.answer)) {
          answer(id);
          return;
        }
        if(chosen.includes(id)) return;
        chosen.push(id);
        renderSlots(chosen);
        card.disabled=true;
        if(chosen.length===round.answer.length){
          const correct=chosen.every((entry,i)=>entry===round.answer[i]);
          const response=[...chosen];
          if(!correct) {
            chosen.length=0;
            renderSlots(chosen);
            for(const buttons of options.values()) buttons.forEach(btn=>btn.disabled=false);
          }
          answer(response);
        }
      },round.variants?'mem-layout-option mem-order-variant':'mem-card');
      card.dataset.choice=id;
      const pictureIds=round.variants?.[id]??[id];
      card.setAttribute('aria-label',pictureIds.map(titleFor).join(', затем '));
      for(const id of pictureIds) card.append(tile(id,round.family));
      options.set(id,[card]);
      choices.append(card);
    }
  }

  reset();
  return {part,play,finish(){
    phase='done';
    watch.disabled=true;
  }};
}
