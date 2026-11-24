import { sensoryArt } from './sensory-art.js';
import { arithmeticDemo, practiceOperation } from './arithmetic-play.js';

const questions={join:'Сколько стало вместе?',remove:'Сколько осталось?',needed:'Сколько не хватает?'};
const meanings={join:['Было','Добавили'],remove:['Было','Убрали'],needed:['Нужно','Уже есть']};
const action = kind => kind==='join'?'+':'−';
const total = ({a,b,kind})=>kind==='join'?a+b:a-b;
const node=(kind,css,label)=>{
 const el=document.createElement(kind);
 if(css)el.className=css;
 if(label!==undefined)el.textContent=label;
 return el;
};
const button=(label,callback)=>{
 const b=node('button','lesson-secondary',label);
 b.type='button';
 b.addEventListener('click',callback);
 return b;
};
function items(tag,count){
 const [shape,color]=tag.split('/');
 const el=node('span','math67-arithmetic-items');
 for(let i=0;i<count;i++)el.append(sensoryArt({shape,color}));
 return el;
}
function panels(story,show){
 const {a,b,kind,tag}=story;
 const row=node('div','math67-arithmetic-row math67-story-panels');
 for(const [index,n] of [a,b].entries()){
  const panel=node('section','math67-story-panel');
  panel.append(node('b',null,meanings[kind][index]),items(tag,n));
  row.append(panel);
 }
 const question=node('section','math67-story-panel');
 question.append(node('b',null,questions[kind]),show?items(tag,total(story)):node('span','math67-expression','?'));
 row.append(question);
 return row;
}
export function showStory(story,animate){
 const view=panels(story,story.mode==='answer');
 if (story.mode==='plot' || story.mode==='answer') {
  const actionModel={...story,sign:action(story.kind),show:story.mode==='answer'};
  view.append(arithmeticDemo(actionModel,animate));
 }
 for(const [i,panel] of Array.from(view.children).entries()){
  animate(panel,[{opacity:0,translate:'0 10px'},{opacity:1,translate:'0'}],{duration:350,delay:i*700,fill:'both'});
 }
 if(story.mode==='action')view.append(node('span','math67-expression',action(story.kind)));
 if(story.mode==='decoration')view.append(items('flower/pink',3));
 return view;
}
export function practiceStory(story,feedback,complete){
 const {a,b,kind,mode}=story;
 const panel=node('div','math67-arithmetic');
 const view=panels(story,false);
 const choices=node('div','math67-arithmetic-row');
 const expected=mode==='action'?action(kind):mode==='unknown'?'?':mode==='question'?questions[kind]:mode==='first'?String(a):mode==='second'?String(b):a+' и '+b;
 const away=mode==='action'?[expected==='+'?'−':'+']:
  mode==='unknown'?[String(a),String(b)]:mode==='question'?Object.values(questions).filter(q=>q!==expected):
  mode==='first'||mode==='second'?[String((Number(expected)+1)%11),String((Number(expected)+3)%11)]:
  [a+' и '+(b===10?8:b+1),(a===10?8:a+1)+' и '+b];
 if(mode==='question')view.lastElementChild.querySelector('b').textContent='Вопрос';
 const sequence=[away[0],expected,...away.slice(1)].filter((value,index,all)=>all.indexOf(value)===index);
 let mistakes=0;
 let hint;
 for(const value of sequence){
  const control=button(value,()=>{
   if(value===expected){Array.from(choices.children).forEach(x=>x.disabled=true);complete();return;}
   feedback.dataset.state='retry';
   feedback.textContent='Посмотри ещё раз на группы и действие.';
   if(++mistakes>=2)hint.dataset.hint='true';
  });
  control.dataset.storyChoice=value;
  if(value===expected)hint=control;
  choices.append(control);
 }
 panel.append(view);
 if(mode==='decoration')panel.append(items('flower/pink',3));
 panel.append(choices);
 return panel;
}
export function constructStory(spec,feedback,complete){
 const {options,onlyJoin=false,onBuild=null}=spec;
 const panel=node('div','math67-arithmetic');
 const setting=node('div','math67-arithmetic-row');
 const chooseSetting=(label,choices,key)=>{
  const field=node('label','math67-story-field',label);
  const select=node('select','lesson-secondary');
  select.dataset.storyField=key;
  for(const [value,name] of choices){
   const option=node('option',null,name);
   option.value=value;
   select.append(option);
  }
  field.append(select);
  setting.append(field);
  return select;
 };
 const who=chooseSetting('Предметы',options.map(o=>[o.tag,o.name]),'tag');
 const quantities=Array.from({length:10},(_,i)=>[i+1,String(i+1)]);
 const first=chooseSetting('В первой группе',quantities,'first');
 const second=chooseSetting('В другой группе',quantities,'second');
 const sign=chooseSetting('Действие',onlyJoin?[['+','Объединить']]:[['+','Объединить'],['−','Убрать']],'sign');
 let errors=0;
 const construct=button('Составить историю',()=>{
  const a=Number(first.value),b=Number(second.value),plus=sign.value==='+';
  if((plus && a+b>10)||(!plus && b>a)){
   feedback.dataset.state='retry';
   feedback.textContent=plus?'Возьми меньше предметов, чтобы получилось не больше десяти.':'Убрать можно лишь предметы, которые уже есть.';
   if(++errors>=2)second.dataset.hint='true';
   return;
  }
  const story={a,b,kind:plus?'join':'remove',tag:who.value};
  const model={a,b,sign:sign.value,tag:who.value};
  if(onBuild){onBuild(story);complete();return;}
  panel.replaceChildren(panels(story,false),practiceOperation(model,feedback,complete));
 });
 panel.append(setting,construct);
 return panel;
}
