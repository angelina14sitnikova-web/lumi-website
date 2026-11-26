import {answer,expected,fits,arrangement,placements,solutions,matches} from './model.js';
import {card,name,landscape,marker,image,multiple,icon} from './art.js';
import {el,button,reduced} from '../writing/ui.js';

const figure=(visual,alt='')=>{const n=el('figure','logic-figure');n.setAttribute('aria-label',alt);n.append(visual);return n;};
const field=()=>el('div','logic-field');
const wait=()=>new Promise(resolve=>setTimeout(resolve,reduced()?145:450));
const tile=(art,alt,click)=>{
 const n=button('',click);
 n.className='logic-tile';n.setAttribute('aria-label',alt??'Карточка');
 if(art)n.append(art);return n;
};
export const cuts={
 twoVertical:[[0,0,90,180],[90,0,90,180]],twoHorizontal:[[0,0,180,90],[0,90,180,90]],
 threeVertical:[[0,0,60,180],[60,0,60,180],[120,0,60,180]],
 threeHorizontal:[[0,0,180,60],[0,60,180,60],[0,120,180,60]],
 four:[[0,0,90,90],[90,0,90,90],[0,90,90,90],[90,90,90,90]],
 curved:[[0,0,107,180,'M0 0h90v52c22-16 22 90 0 74v54H0z'],[89,0,91,180,'M90 0h90v180H90v-54c22 16 22-90 0-74z']],
 shaped:[[0,0,180,69,'M0 0h180v56L120 63 60 58 0 68z'],[0,56,180,69,'M0 68l60-10 60 5 60-7v61l-60 7-60-10-60 9z'],[0,114,180,66,'M0 123l60-9 60 10 60-7v63H0z']],
};
let counter=0;
function fragment(r,piece,placeholder=false){
 const [x,y,w,h,d]=cuts[r.layout][piece], id='logic-clip-'+(++counter);
 const clip=d?'<path d="'+d+'"/>':'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'"/>';
 return image('<defs><clipPath id="'+id+'">'+clip+'</clipPath></defs><g clip-path="url(#'+id+')">'+
  (placeholder?'<rect width="180" height="180" fill="#cbd4de"/><g opacity=".27">':'<rect width="180" height="180" fill="#fff1d7"/><g>')+
  landscape(r.picture)+'</g></g>',[x,y,w,h].join(' '));
}
function drag(node,surface,index,onDrop){
 let state, suppress=false;
 function stop(){state?.ghost?.remove();state=null;}
 node.addEventListener('pointerdown',e=>{
  if(e.isPrimary&&e.button===0){state={x:e.clientX,y:e.clientY,id:e.pointerId};node.setPointerCapture(e.pointerId);}
 });
 node.addEventListener('pointermove',e=>{
  if(state?.id!==e.pointerId)return;
  if(!state.ghost&&Math.hypot(e.clientX-state.x,e.clientY-state.y)>8){
   state.ghost=node.cloneNode(true);state.ghost.classList.add('logic-ghost');
   state.ghost.style.width=node.offsetWidth+'px';surface.append(state.ghost);
  }
  if(state.ghost){state.ghost.style.left=e.clientX+'px';state.ghost.style.top=e.clientY+'px';}
 });
 node.addEventListener('pointerup',e=>{
  if(state?.id!==e.pointerId)return;
  if(state.ghost){
   const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-slot]');
   suppress=true;setTimeout(()=>suppress=false,0);
   if(target&&surface.contains(target))onDrop(index,Number(target.dataset.slot));
  }
  stop();
 });
 node.addEventListener('pointercancel',stop);
 node.addEventListener('lostpointercapture',stop);
 return ()=>suppress;
}

export function mountBoard(host,r,{next=()=>{},demo=false}={}){
 const board=el('section','logic-board'),stage=el('div','logic-stage'),feedback=el('p','logic-feedback');
 const controls=el('div','lesson-actions');
 const model=expected(r),choices=solutions(r);
 const slots=r.slots??[];
 let placementsNow=Array(r.kind==='group'?r.items.length:slots.length).fill(null);
 let done=false,tries=0,selected=null,picked=null,story=null,hits=[],value,whole=Boolean(r.support),generation=0;
 const visual=id=>r.frames?.[id]?image(landscape(r.frames[id])):card(id);
 const label=id=>r.frames?.[id]?.label??name(id);
 const answerTile=(id,art,alt,handler,good=false,active=false)=>{
  const b=tile(art,alt,handler);b.dataset.option=id;b.disabled=done||demo;
  b.setAttribute('aria-pressed',String(active));
  if(active)b.classList.add('logic-chosen');
  if(tries>=2&&good)b.classList.add('logic-hint');
  return b;
 };
 function miss(message='Попробуй ещё раз.'){
  tries++;render();feedback.textContent=tries>=2?'Посмотри на подсказку и попробуй ещё раз.':message;
 }
 function finish(result){
  if(!answer(r,result)){miss();return;}
  value=result;done=true;render();
  feedback.textContent=demo?'Вот как Луми решил задачу.':'Получилось!';
  advance.hidden=demo;
 }
 function place(i,j){
  if(done||demo)return;
  const candidate=[...placementsNow];
  if(r.kind==='group')candidate[i]=j;
  else{
   const prev=candidate.indexOf(i);
   if(prev>=0)candidate[prev]=null;
   candidate[j]=i;
  }
  if(!r.manual&&(!fits(r,i,j)||(r.kind!=='group'&&!arrangement(r,candidate)))){miss();return;}
  placementsNow=candidate;selected=null;
  if(!r.manual&&answer(r,placementsNow))finish([...placementsNow]);
  else {render();feedback.textContent='';}
 }
 function placeArt(id){
  if(r.kind==='puzzle')return fragment(r,id);
  return r.pairs?multiple(id):visual(id);
 }
 function layout(){
  const source=field(),targets=field();
  for(const [i,id] of r.items.entries()){
   const found=r.kind==='group'?placementsNow[i]!=null:placementsNow.includes(i);
   if(found)continue;
   const desc=r.kind==='puzzle'?'Фрагмент '+(id+1):r.pairs?id.map(label).join(' и '):label(id);
   const good=r.kind==='group'?model[i]!=null:model.includes(i);
   const n=answerTile(i,placeArt(id),desc,()=>{
    if(ignore())return;
    selected=selected===i?null:i;render();
    stage.querySelector('[data-option="'+i+'"]')?.focus({preventScroll:true});
   },good,selected===i);
   n.classList.add('logic-movable');
   const ignore=drag(n,board,i,place);
   source.append(n);
  }
  for(const [j,s] of slots.entries()){
   const isGroup=r.kind==='group';
   const taken=isGroup?placementsNow.flatMap((v,i)=>v===j?[i]:[]):placementsNow[j]==null?[]:[placementsNow[j]];
   let [art,alt]=isGroup?marker(r.rule,s.value):[icon('next'),'Место '+(j+1)];
   if(isGroup&&r.rule==='size'&&s.object)art=card(s.object);
   if(r.kind==='puzzle')[art,alt]=[fragment(r,s.piece,true),'Место фрагмента '+(s.piece+1)];
   if(r.kind==='pattern')[art,alt]=[s.bad?card(s.bad):icon('part'),s.bad?'Замени элемент':'Пустое место'];
   if(s.object&&!isGroup)[art,alt]=[card(s.object),label(s.object)];
   if(r.kind==='construct')[art,alt]=[card(s.accepts[0]),label(s.accepts[0])];
   if(taken.length&&!isGroup)art=placeArt(r.items[taken[0]]);
   const target=tile(art,alt,()=>{
    if(selected!=null){place(selected,j);return;}
    if(taken.length){
     if(isGroup)placementsNow[taken.at(-1)]=null;
     else placementsNow[j]=null;
     render();
    }
   });
   if(taken.length&&isGroup){
    const chips=el('span','logic-filled');
    chips.append(...taken.map(i=>placeArt(r.items[i])));target.append(chips);
   }
   target.dataset.slot=j;target.classList.add('logic-slot');target.disabled=demo||done;
   if((r.silhouette||r.kind==='construct')&&!taken.length)target.classList.add('logic-silhouette');
   if(tries>=2&&selected!=null&&fits(r,selected,j))target.classList.add('logic-hint');
   targets.append(target);
  }
  if(r.preview)stage.append(figure(r.order?multiple(r.order):card(r.preview),'Образец'));
  if(r.kind==='order'&&r.showOrder){
   const modelRow=field();
   for(const id of r.order)modelRow.append(figure(visual(id),label(id)));
   stage.append(modelRow);
  }
  if(r.kind==='puzzle'||r.kind==='construct'){
   if(r.kind==='puzzle'&&(whole||done))stage.append(figure(image(landscape(r.picture)),'Целое изображение'));
   if(!done&&!demo&&r.kind==='puzzle')stage.append(button(whole?'Скрыть образец':'Показать целое',()=>{whole=!whole;render();}));
   const frame=el('div','logic-frame');
   if(r.kind==='construct'&&r.picture)frame.append(image(landscape(r.picture)));
   const nodes=[...targets.children];
   for(const [j,n] of nodes.entries()){
    const [x,y,w,h]=r.kind==='puzzle'?cuts[r.layout][slots[j].piece].map((v,i)=>i<4?v/1.8:v):slots[j].area;
    Object.assign(n.style,{left:x+'%',top:y+'%',width:w+'%',height:h+'%'});
    frame.append(n);
   }
   if(done&&r.kind==='puzzle')frame.replaceChildren(image(landscape(r.picture)));
   if(done&&r.result){frame.replaceChildren(card(r.result));frame.classList.add('logic-motion');}
   stage.append(frame);
  }else if(r.kind==='pattern'){
   stage.append(figure(multiple([...r.seed,...r.seed]),'Повторяющаяся пара'));
   const row=field(),nodes=[...targets.children];row.classList.add('logic-pattern');
   for(const [i,id] of r.row.entries()){
    const j=slots.findIndex(s=>s.position===i);
    row.append(j<0?figure(card(id)):nodes[j]);
   }
   stage.append(row);
  }else stage.append(targets);
  stage.append(source);
  if(!done&&!demo){
   if(placementsNow.some(x=>x!=null))stage.append(button('Начать заново',()=>{placementsNow.fill(null);selected=null;tries=0;render();feedback.textContent='';}));
   if(r.manual)stage.append(button('Проверить',()=>{
    if(answer(r,placementsNow))finish([...placementsNow]);else miss('Проверь, подходит ли предмет к своему месту.');
   },true));
  }
 }
 function differences(){
  const row=field();
  for(const source of r.images){
   const panel=el('div','logic-picture');panel.append(image(landscape(source)));
   panel.addEventListener('click',e=>{if(!done&&!demo&&!e.target.closest('button'))miss();});
   for(const {id,label:alt,area} of r.spots){
    const point=answerTile(id,null,alt,()=>{
     if(!hits.includes(id))hits.push(id);
     if(hits.length===r.spots.length)finish([...hits]);else render();
    },true,hits.includes(id));
    const [x,y,w,h]=area;
    Object.assign(point.style,{left:x+'%',top:y+'%',width:w+'%',height:h+'%'});point.dataset.spot=id;
    panel.append(point);
   }
   row.append(panel);
  }
  stage.append(row);
 }
 function pick(i){
  if(!choices.includes(i)){miss();return;}
  if(r.kind==='odd'&&(r.reason||r.rehome)){
   picked=i;render();feedback.textContent=r.reason?'Какой признак общий у остальных?':'Куда отнести найденный предмет?';
  }else finish(i);
 }
 function choicesBoard(){
  const row=field();
  if(r.sample)stage.append(figure(card(r.sample),'Образец'));
  if(r.kind==='compare')stage.append(figure(multiple(r.items),'Две картинки для сравнения'));
  if(r.kind==='event'&&r.step)stage.append(figure(visual(r.steps[0]),'Начало истории'));
  if(r.kind==='chooseOrder')stage.append(figure(multiple(r.order),'Образец порядка'));
  const pairs=r.pairs??r.rows;
  const options=r.kind==='compare'?[['same',icon('image'),'Одинаковые'],['different',icon('different'),'Разные']]:
   pairs?pairs.map((p,i)=>[i,multiple(p),p.map(label).join(' и ')]):r.items.map((id,i)=>[i,visual(id),label(id)]);
  for(const [id,art,alt] of options){
   const node=answerTile(id,art,alt,()=>pick(id),choices.includes(id),(done&&(value?.choice??value)===id)||picked===id);
   if(picked!=null&&r.kind==='odd')node.disabled=true;
   row.append(node);
  }
  stage.append(row);
  if(r.kind==='odd'&&picked!=null&&(r.reason||r.rehome)){
   const options=field();
   for(const option of r.options){
    const [art,alt]=marker(r.rehome?'category':r.rule,option);
    options.append(answerTile(option,art,alt,()=>finish({choice:picked,reason:option}),option===model.reason,done&&option===value.reason));
   }
   stage.append(options);
   if(done&&r.reason)stage.append(figure(multiple(r.items.filter((_,i)=>i!==picked)),'Общая группа'));
  }
 }
 function pairs(){
  const row=field();
  for(const [i,id] of r.items.entries()){
   const b=answerTile(i,card(id),label(id),()=>{
    if(picked===i){picked=null;render();return;}
    if(picked===null){picked=i;render();return;}
    if(!matches(r.items[picked],id,r.rule)){picked=null;miss();return;}
    hits.push(picked,i);picked=null;
    if(hits.length===r.count*2)finish([...hits]);else {render();feedback.textContent='Пара найдена!';}
   },model.slice(hits.length,hits.length+2).includes(i),picked===i||hits.includes(i));
   if(hits.includes(i))b.disabled=true;row.append(b);
  }
  stage.append(row);
  if(hits.length){
   const connections=field();
   for(let i=0;i<hits.length;i+=2)connections.append(figure(multiple(hits.slice(i,i+2).map(n=>r.items[n])),'Соединённая пара'));
   stage.append(connections);
  }
 }
 function storyBoard(){
  const row=field(),scene=el('div','logic-story');
  if(r.kind==='actions'){
   const instruction=field();
   instruction.append(...r.steps.map(s=>figure(visual(s.preview??s.choice),label(s.preview??s.choice))));stage.append(instruction);
   scene.append(visual(hits.length?r.steps[hits.length-1].preview??hits.at(-1):r.initial));
   stage.append(scene);
   if(done)return;
   const step=r.steps[hits.length];
   for(const id of step.options)row.append(answerTile(id,visual(id),label(id),()=>{
    if(id!==step.choice){miss();return;}
    hits.push(id);
    if(hits.length===r.steps.length)finish([...hits]);else{render();feedback.textContent='Теперь следующий шаг.';}
   },id===step.choice));
  }else{
   scene.append(visual(done?'result':'start'));
   if(story!=null){
    const installed=figure(card(r.items[story]),label(r.items[story]));
    installed.className='logic-installed';
    if(done)scene.classList.add('logic-motion');
    scene.append(installed);
   }
   stage.append(scene);
   if(done)return;
   for(const [i,id] of r.items.entries())row.append(answerTile(i,card(id),label(id),()=>{
    story=i;render();feedback.textContent='Теперь можно проверить.';
   },choices.includes(i),story===i));
  }
  stage.append(row);
  if(r.kind==='story')stage.append(button('Проверить',()=>{
   if(story==null){feedback.textContent='Сначала выбери предмет.';return;}
   if(!choices.includes(story)){miss(r.failure??'Предмет пока не подходит. Попробуй другой.');return;}
   finish({choice:story,checked:true});
  },true));
 }
 function render(){
  stage.replaceChildren();
  if(placements.has(r.kind))layout();
  else if(r.kind==='diff')differences();
  else if(r.kind==='pair')pairs();
  else if(['story','actions'].includes(r.kind))storyBoard();
  else choicesBoard();
 }
 const advance=button('Дальше',()=>next(value),true);
 advance.hidden=true;
 if(!demo)controls.append(button('Подсказка',()=>{tries=2;render();feedback.textContent='Подсказка уже на экране.';}),advance);
 const rulebar=el('div','logic-rulebar');
 for(const key of [].concat(r.rule??[])){
  const n=el('span','logic-rule');n.append(icon(key));rulebar.append(n);
 }
 board.append(el('p','logic-instruction',r.prompt),rulebar,stage,feedback,controls);
 feedback.setAttribute('role','status');
 host.replaceChildren(board);render();

 return {
  async play(){
   if(!demo)return;
   const trigger=++generation;
   done=false;tries=0;picked=null;hits=[];story=null;selected=null;placementsNow.fill(null);render();feedback.textContent='';
   const alive=()=>trigger===generation&&board.isConnected;
   async function highlight(selector){
    stage.querySelector(selector)?.classList.add('logic-focus');
    await wait();
    return alive();
   }
   if(placements.has(r.kind)){
    const moves=r.kind==='group'?model.map((j,i)=>[i,j]).filter(([,j])=>j!=null):model.map((i,j)=>[i,j]).filter(([i])=>i!=null);
    for(const [i,j] of moves){
     if(!await highlight('[data-option="'+i+'"]'))return;
     stage.querySelector('[data-slot="'+j+'"]')?.classList.add('logic-focus');
     if(!await highlight('[data-slot="'+j+'"]'))return;
     if(r.kind==='group')placementsNow[i]=j;else placementsNow[j]=i;
     render();
    }
   }else if(r.kind==='actions'){
    for(const id of model){if(!await highlight('[data-option="'+id+'"]'))return;hits.push(id);render();}
   }else if(r.kind==='diff'||r.kind==='pair'){
    for(const id of model){if(!await highlight('[data-option="'+id+'"]'))return;hits.push(id);render();}
   }else{
    const id=model?.choice??model;
    if(!await highlight('[data-option="'+id+'"]'))return;
    if(r.kind==='story')story=id;
    if(r.kind==='odd'&&typeof model==='object')picked=id;
   }
   if(alive())finish(model);
  },
  dispose(){generation++;}
 };
}
