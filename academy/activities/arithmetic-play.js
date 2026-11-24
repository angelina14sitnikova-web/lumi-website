import { sensoryArt } from './sensory-art.js';
const plus='+';
const total=({a,b,sign})=>sign===plus?a+b:a-b;
const create=(tag,css,text)=>{
 const el=document.createElement(tag);
 if(css)el.className=css;
 if(text!==undefined)el.textContent=String(text);
 return el;
};
const button=(text,action)=>{
 const el=create('button','lesson-secondary',text);
 el.type='button';
 el.addEventListener('click',action);
 return el;
};
const art=(tag,added=false)=>{
 const [shape,color='sky']=tag.split('/');
 return sensoryArt({shape,color:added && shape==='crystal'?'pink':color});
};
function items(tag,n,delta=0){
 const row=create('div','math67-arithmetic-items');
 for(let i=0;i<n;i++) row.append(art(tag,i>=n-delta));
 return row;
}
export function arithmeticDemo(model,animate){
 const {a,b,tag,sign}=model;
 const panel=create('div','math67-arithmetic');
 const before=create('div','math67-arithmetic-row');
 before.append(items(tag,a),create('b',null,sign),items(tag,b,b));
 const after=items(tag,total(model),sign===plus?b:0);
 after.setAttribute('aria-label','Количество после действия');
 const record=create('span','math67-expression',a+' '+sign+' '+b+' = '+total(model));
 panel.append(before,after);
 if(model.show)panel.append(record);
 animate(after,[{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{duration:750,delay:700,fill:'both'});
 if(model.show)animate(record,[{opacity:0},{opacity:1}],{duration:500,delay:1430,fill:'both'});
 return panel;
}
function feedbackTools(feedback) {
 let mistakes=0;
 return (expected,message)=>{
  mistakes++;
  feedback.dataset.state='retry';
  feedback.textContent=message;
  if(mistakes>=2 && expected) expected.dataset.hint='true';
 };
}
export function buildExpression(model,feedback,complete) {
 const {a,b,sign,tag,answer}=model;
 const panel=create('div','math67-arithmetic');
 const reference=create('div','math67-arithmetic-row');
 reference.append(items(tag,a),create('b',null,sign),items(tag,b,b));
 const slots=create('div','math67-arithmetic-row');
 const tray=create('div','math67-arithmetic-row');
 const selected=[];
 const cards=[...new Set([a,b,total(model),a===0?1:a-1,'−','+','='])];
 const bad=feedbackTools(feedback);
 const controls=new Map();
 const draw=()=>slots.replaceChildren(...answer.map((_,i)=>create('span','math67-expression-slot',selected[i]??'□')));
 for(const card of cards){
  const choice=button(card,()=>{
   if(selected.length<answer.length){selected.push(card);draw();}
  });
  choice.dataset.expression=String(card);
  controls.set(card,choice);
  tray.append(choice);
 }
 const back=button('Убрать последнюю',()=>{selected.pop();draw();});
 const check=button('Проверить запись',()=>{
  if(answer.every((value,index)=>selected[index]===value)){
   for(const el of [...controls.values(),back,check])el.disabled=true;
   complete();return;
  }
  tray.querySelectorAll('[data-hint]').forEach(el=>delete el.dataset.hint);
  const index=answer.findIndex((value,i)=>selected[i]!==value);
  bad(controls.get(answer[index]),'Проверь порядок карточек и попробуй ещё раз.');
  selected.splice(index);
  draw();
 });
 panel.append(reference,slots,tray,back,check);
 draw();
 return panel;
}
export function practiceOperation(model,feedback,complete) {
 const {a,b,sign,tag,track,frame}=model;
 const panel=create('div','math67-arithmetic');
 const visual=create('div','math67-operation');
 const controls=create('div','math67-arithmetic-row');
 const action=button(sign===plus?'Добавить один предмет':'Убрать один предмет',()=>{
  if(acted>=b){bad(check,'Действие выполнено. Теперь выбери число.');return;}
  acted++;draw();
 });
 const undo=button('Вернуть шаг',()=>{if(acted>0){acted--;draw();}});
 const check=button('Проверить ответ',()=>{if(acted!==b) bad(action,'Сначала выполни все шаги.'); else bad(choices.get(total(model)),'Выбери число, которое показывает результат.');});
 const bad=feedbackTools(feedback);
 const choices=new Map();
 let acted=0;
 const result=total(model);
 const distractors=result===0?[1,0,2]:result===10?[8,10,9]:[result+1,result,result-1];
 for(const candidate of distractors){
  const key=button(candidate,()=>{
   if(acted!==b){bad(action,'Сначала выполни действие с предметами.');return;}
   if(candidate!==result){bad(choices.get(result),'Пересчитай предметы и попробуй ещё раз.');return;}
   for(const el of [action,undo,check,...choices.values()])el.disabled=true;
   complete();
  });
  key.dataset.result=String(candidate);
  choices.set(candidate,key);
 }
 const task=create('b','math67-expression',a+' '+sign+' '+b+' = ?');
 const draw=()=>{
  const n=sign===plus?a+acted:a-acted;
  let visible;
  if(track){
   visible=create('div','math67-number-track');
   for(let number=0;number<=10;number++){
    const step=create('span',number===n?'here':null,number);
    visible.append(step);
   }
  }else{
   visible=items(tag,n,sign===plus?acted:0);
   if(frame){
    visible.classList.add('math67-ten-frame');
    for(let index=n;index<10;index++)visible.append(create('span'));
   }
  }
  visual.replaceChildren(visible,items(tag,b-acted,b-acted));
 };
 action.dataset.operation='step';
 panel.append(task,visual,action,undo,check);
 controls.append(...choices.values());
 panel.append(controls);
 draw();
 return panel;
}
