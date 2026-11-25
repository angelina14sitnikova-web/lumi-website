import { artTitle,picture } from './art.js';
import { shuffleOptions } from './model.js';

export const visualRecallKinds = new Set(['recall','memory-set','missing','layouts','arrange','changed','paint']);
const colorNames={red:'красный',blue:'голубой',green:'зелёный'};
const colors={red:'#dc796c',blue:'#63add6',green:'#77aa78'};

function node(tag,styles,text='') {
  const el=document.createElement(tag);
  el.className=styles;
  el.textContent=text;
  return el;
}
function control(name,action,styles='lesson-secondary mem-button') {
  const el=node('button',styles,name);
  el.type='button';
  el.addEventListener('click',action);
  return el;
}
function artOption(id,action) {
  const el=control('',action,'mem-card');
  el.dataset.choice=id;
  el.setAttribute('aria-label',artTitle(id));
  el.append(picture(id));
  return el;
}

function objects(ids, setting, makeButton) {
  const outer=node('div','mem-recall-row');
  if(setting) outer.classList.add('mem-setting-'+setting);
  ids.forEach((id,index)=>{
    const slot=makeButton?makeButton(id,index):node('div','mem-sample mem-slot');
    if(id) {
      slot.setAttribute('aria-label',artTitle(id));
      slot.append(picture(id));
    } else {
      slot.classList.add('mem-empty-slot');
      slot.setAttribute('aria-label','Пустое место');
    }
    outer.append(slot);
  });
  return outer;
}

export function makeRecallBoard(round,{answer,choose,options=new Map(),announce=()=>{},reset=()=>{},example=false}={}) {
  const view=node('section','mem-recall-stage');
  const sample=node('div','mem-recall-original');
  const layer=node('div','mem-curtain');
  layer.setAttribute('aria-hidden','true');
  const answers=node('div','mem-recall-answers');
  const controls=node('div','lesson-actions mem-controls');
  const paintArea=node('div','mem-recall-palette');
  const optionOrder=shuffleOptions(round.options);
  const lockChoices=()=>{
    for(const buttons of options.values()) for(const btn of buttons) btn.disabled=true;
  };
  let phase='study',serial=0;
  let placement=[...(round.after??[])];
  let pickedSlot=null;
  let paintIndex=0;
  let marks=[];
  const sampleLabel=node('p','mem-phase', 'Рассмотри и запомни');
  sample.append(sampleLabel,objects(round.sample,round.setting));
  const ready=control('Я запомнил. Закрыть занавеску',()=>{ void hide(); },'academy-button mem-button');
  const replay=control('Показать образец ещё раз',restore);
  replay.hidden=true;
  controls.append(ready,replay);
  view.append(sample,layer,answers,controls);
  answers.hidden=true;

  function restore() {
    serial++;
    phase='study';
    placement=[...(round.after??[])];
    pickedSlot=null;
    paintIndex=0;
    marks=[];
    reset();
    options.clear();
    answers.replaceChildren();
    answers.hidden=true;
    layer.classList.remove('mem-curtain-closed');
    sample.hidden=false;
    ready.hidden=false;
    replay.hidden=true;
    announce('');
  }
  async function hide() {
    if(phase!=='study') return;
    phase='curtain';
    const run=++serial;
    ready.hidden=true;
    layer.classList.add('mem-curtain-closed');
    await new Promise(resolve=>setTimeout(resolve,matchMedia('(prefers-reduced-motion: reduce)').matches?0:280));
    if(run!==serial || !view.isConnected) return;
    sample.hidden=true;
    layer.classList.remove('mem-curtain-closed');
    if(example) {
      showExampleAnswer();
    } else {
      renderAnswer();
    }
    answers.hidden=false;
    replay.hidden=false;
    phase='answer';
  }
  function showExampleAnswer() {
    const display=round.kind==='changed' ? round.after :
      round.kind==='missing' ? round.after : round.sample;
    const illustrated=objects(display,round.setting);
    answers.replaceChildren(node('p','mem-phase',round.kind==='missing'?'Одна игрушка исчезла':'Вспомним образец'),illustrated);
    if(round.kind==='missing') answers.append(objects([round.answer]));
    if(round.kind==='recall' || round.kind==='memory-set') {
      const cards=objects(round.options);
      for(const [index,card] of Array.from(cards.children).entries()) {
        if([].concat(round.answer).includes(round.options[index])) card.classList.add('mem-found');
      }
      answers.append(cards);
    }
  }
  function select(id,el) {
    if(phase!=='answer') return;
    if(round.kind==='memory-set') el.classList.toggle('mem-selected');
    choose(id);
  }
  function renderPalette() {
    const subjects=round.subjects.map((id,index)=>id+'-'+(marks[index]??'neutral'));
    const figures=objects(subjects);
    figures.children[paintIndex]?.classList.add('mem-paint-focus');
    paintArea.replaceChildren(figures);
    const palette=node('div','mem-options');
    options.clear();
    optionOrder.forEach(key=>{
      const item=control('',()=>{
        if(phase!=='answer') return;
        marks[paintIndex]=key;
        paintIndex++;
        if(paintIndex>=round.subjects.length) {
          const current=[...marks];
          paintIndex=0;
          marks=[];
          const valid=current.every((value,index)=>value===round.answer[index]);
          if(valid) {
            const finalDrawing=objects(round.subjects.map((id,index)=>id+'-'+current[index]));
            paintArea.replaceChildren(finalDrawing);
            answer(current);
          } else {
            renderPalette();
            answer(current);
          }
        } else renderPalette();
      },'mem-card mem-color');
      item.dataset.choice=key;
      item.setAttribute('aria-label',colorNames[key]);
      item.style.setProperty('--paint',colors[key]);
      palette.append(item);
      options.set(key,[item]);
    });
    paintArea.append(palette);
  }

  function makeArrangement() {
    const board=objects(placement,round.setting,(id,index)=>{
      const slot=control('',()=>{
        if(phase!=='answer') return;
        if(pickedSlot===null) pickedSlot=index;
        else {
          [placement[pickedSlot],placement[index]]=[placement[index],placement[pickedSlot]];
          pickedSlot=null;
        }
        makeArrangement();
      },'mem-card mem-slot');
      slot.dataset.slot=String(index);
      slot.classList.toggle('mem-selected',index===pickedSlot);
      options.set(id,[slot]);
      return slot;
    });
    const confirm=control('Готово. Проверить',()=>{if(phase==='answer') answer([...placement]);},'academy-button mem-button');
    answers.replaceChildren(board,confirm);
  }

  function renderAnswer() {
    options.clear();
    answers.replaceChildren();
    if(round.kind==='arrange') {
      makeArrangement();
    } else if(round.kind==='paint') {
      renderPalette();
      answers.append(paintArea);
    } else {
      if(round.after) answers.append(objects(round.after,round.setting));
      const candidates=node('div','mem-options');
      let resultBar=null;
      if(round.kind==='memory-set' && ['basket','chest'].includes(round.setting)) {
        resultBar=objects(new Array(round.answer.length).fill(null),round.setting);
        answers.append(resultBar);
      }
      for(const id of optionOrder) {
        let el;
        if(round.kind==='layouts') {
          el=control('',()=>select(id,el),'mem-layout-option');
          el.append(objects(round.variants[Number(id.slice(6))], 'shelf'));
          el.dataset.choice=id;
          el.setAttribute('aria-label','Полка '+(Number(id.slice(6))+1));
        } else if(round.kind==='changed') {
          el=control(id==='same'?'Так же':'По-другому',()=>select(id,el),'mem-card mem-compare');
          el.dataset.choice=id;
          el.setAttribute('aria-label',id==='same'?'Игрушки остались на местах':'Игрушки поменялись местами');
          const sign=node('span','mem-symbol',id==='same'?'=':'↔');
          sign.setAttribute('aria-hidden','true');
          el.prepend(sign);
        } else {
          el=artOption(id,()=>{
            if(round.kind==='missing' && id===round.answer) {
              const filled=[...round.after];
              filled[round.slot]=id;
              answers.firstElementChild.replaceWith(objects(filled,round.setting));
            }
            if(resultBar) {
              const slot=[...resultBar.children].find(item=>item.dataset.item===id || !item.dataset.item);
              if(slot) {
                const present=slot.dataset.item===id;
                slot.replaceChildren(...(present?[]:[picture(id)]));
                slot.dataset.item=present?'':id;
                slot.classList.toggle('mem-empty-slot',present);
              }
            }
            select(id,el);
          });
        }
        candidates.append(el);
        options.set(id,[el]);
      }
      answers.append(candidates);
    }
  }

  function finish() {
    phase='done';
    ready.hidden=true;
    replay.hidden=true;
    lockChoices();
    for(const btn of answers.querySelectorAll('button')) btn.disabled=true;
  }
  return {
    view,
    finish,
    replayExample() { restore(); },
    clearResult() {
      if(round.kind==='memory-set') renderAnswer();
    },
  };
}
