import { sensoryArt } from './sensory-art.js';

const moves={'↑':[0,-1],'↓':[0,1],'←':[-1,0],'→':[1,0]};
const coordinate=(index,size)=>[index%size,Math.floor(index/size)];
const markerNames={tree:'Дерево',road:'Дорожка',house:'Домик',treasure:'Сундук',bed:'Кровать',table:'Стол',wardrobe:'Шкаф',chair:'Стул',star:'Звезда',stone:'Камень',crystal:'Кристалл',flower:'Цветок',bridge:'Мост',lumi:'Луми'};
const codes={tree:'△',road:'═',house:'⌂',treasure:'◇',bed:'▤',table:'▭',wardrobe:'▯',chair:'⊞',star:'✦',stone:'●',crystal:'⬡',flower:'✿',bridge:'▬',lumi:'☾'};
const colors={bed:'pink',tree:'green',road:'yellow',house:'pink',treasure:'yellow',star:'yellow',stone:'blue',crystal:'sky',flower:'pink',bridge:'blue'};
function element(tag,css,value){
 const el=document.createElement(tag);
 if(css)el.className=css;
 if(value!==undefined)el.textContent=String(value);
 return el;
}
function placeName(index,size){
 const [x,y]=coordinate(index,size);
 return `Строка ${y+1}, столбец ${x+1}`;
}
function icon(item,plan=false){
 if(!item)return document.createTextNode('');
 if(!plan && item==='lumi'){
  const image=element('img','math67-map-lumi');
  image.src='../enchanted-library/assets/lumi-welcome.png';
  image.alt='';
  return image;
 }
 if(!plan && ['table','chair','wardrobe'].includes(item)){
  const styles={
   table:'<rect x="10" y="24" width="80" height="19" rx="6"/><path d="M19 43v41m61-41v41" fill="none" stroke-width="7"/>',
   chair:'<rect x="20" y="11" width="25" height="50" rx="5"/><rect x="22" y="50" width="58" height="15" rx="4"/><path d="M28 61v25m46-25v25" fill="none" stroke-width="6"/>',
   wardrobe:'<rect x="14" y="9" width="73" height="77" rx="5"/><path d="M50 10v77m-7-41v11m14-11v11" fill="none"/>'
  };
  const art=document.createElementNS('http://www.w3.org/2000/svg','svg');
  art.setAttribute('viewBox','0 0 100 100');
  art.setAttribute('aria-hidden','true');
  art.innerHTML='<g fill="#dba9c8" stroke="#483266" stroke-width="4">'+styles[item]+'</g>';
  return art;
 }
 if(plan || !colors[item]) {
  const sign=element('span','math67-map-code',codes[item]);
  sign.setAttribute('aria-hidden','true');
  return sign;
 }
 return sensoryArt({shape:item==='stone'?'ball':item,color:colors[item]});
}
function grid({size,items={},plan=true,blocked=[],target,visited=[],active,trace,label='Игровое поле'},onCell){
 const board=element('div','math67-map-board');
 board.style.setProperty('--columns',size);
 board.setAttribute('role','group');
 board.setAttribute('aria-label',label);
 for(let index=0;index<size*size;index++){
  const cell=element(onCell?'button':'div','math67-map-cell');
  cell.dataset.cell=index;
  const item=items[index]|| (blocked.includes(index)?'stone':null);
  cell.append(icon(item,plan));
  if(target===index){cell.dataset.goal='true';cell.append(element('span','math67-cell-goal','✦'));}
  if(visited.includes(index))cell.dataset.visited='true';
  if(active===index){cell.dataset.active='true';cell.append(element('span','math67-cell-player','☾'));}
  if(onCell){
   cell.type='button';
   cell.setAttribute('aria-label',placeName(index,size)+(item?' · '+markerNames[item]:'')+(target===index?' · Цель':''));
   cell.addEventListener('click',()=>onCell(index));
  }
  board.append(cell);
 }
 if(trace?.length>1){
  const namespace='http://www.w3.org/2000/svg';
  const overlay=document.createElementNS(namespace,'svg');
  overlay.setAttribute('viewBox',`0 0 ${size} ${size}`);
  overlay.setAttribute('aria-hidden','true');
  overlay.classList.add('math67-route-line');
  const path=document.createElementNS(namespace,'polyline');
  path.setAttribute('points',trace.map(index=>coordinate(index,size).map(x=>x+.5).join(',')).join(' '));
  path.setAttribute('stroke','#6c53a4');
  path.setAttribute('stroke-width','.09');
  path.setAttribute('fill','none');
  overlay.append(path);
  board.append(overlay);
 }
 return board;
}
function option(heading,action,artwork){
 const button=element('button','lesson-secondary',heading);
 button.type='button';
 if(artwork)button.prepend(artwork);
 button.addEventListener('click',action);
 return button;
}
function commandStrip(commands){
 const panel=element('div','math67-arithmetic-row math67-map-steps');
 panel.append(...commands.map(c=>element('span','math67-expression',c)));
 return panel;
}
function stepFrom(index,command,size,blocked){
 if(!moves[command])return null;
 const [x,y]=coordinate(index,size);
 const [dx,dy]=moves[command];
 const nx=x+dx,ny=y+dy;
 if(nx<0||nx>=size||ny<0||ny>=size)return null;
 const next=nx+size*ny;
 return blocked.includes(next)?null:next;
}
export function walk67({start,size,blocked=[]},commands){
 const positions=[start];
 for(const command of commands){
  const next=stepFrom(positions.at(-1),command,size,blocked);
  if(next===null)return null;
  positions.push(next);
 }
 return positions;
}
function validRoute(spec,commands){
 const route=walk67(spec,commands);
 return Boolean(route&&route.at(-1)===spec.target&&commands.length>=(spec.min||0)&&
  (spec.via||[]).every(point=>route.includes(point))&&(!spec.commands||spec.commands.join('')===commands.join('')));
}
export function spatialDemo(spec,animate){
 const wrapper=element('div','math67-arithmetic math67-spatial');
 if(spec.commands){
  const route=walk67(spec,spec.commands)||[spec.start];
  const frames=element('div','math67-map-frames');
  route.forEach((active,i)=>{
   const board=grid({...spec,active,visited:route.slice(0,i),trace:spec.draw?route.slice(0,i+1):undefined});
   if(matchMedia('(prefers-reduced-motion: reduce)').matches&&i<route.length-1)return;
   frames.append(board);
   animate(board,[{opacity:0},{opacity:1,offset:.06},{opacity:1,offset:.96},{opacity:i===route.length-1?1:0}],{duration:480,delay:480*i});
  });
  wrapper.append(frames,commandStrip(spec.commands));
 }else{
  const maps=spec.maps||[spec];
  for(const [i,map] of maps.entries()){
   const board=grid(map);
   if(map.caption)wrapper.append(element('b','math67-map-caption',map.caption));
   wrapper.append(board);
   animate(board,[{opacity:.15,translate:'0 8px'},{opacity:1,translate:'0 0'}],{duration:550,delay:i*630});
  }
 }
 return wrapper;
}
export function practiceSpatial(spec,feedback,complete){
 const panel=element('div','math67-arithmetic math67-spatial');
 let mistakes=0;
 const finish=()=>{
  panel.querySelectorAll('button').forEach(b=>b.disabled=true);
  complete();
 };
 const retry=(hint,message='Сверься с полем и попробуй снова.')=>{
  mistakes++;
  feedback.dataset.state='retry';
  feedback.textContent=message;
  if(mistakes>=2&&hint)hint.dataset.hint='true';
 };
 const row=element('div','math67-arithmetic-row');
 if(spec.caption)panel.append(element('b','math67-map-caption',spec.caption));
 if(spec.reference)panel.append(grid(spec.reference));
 if(spec.mode==='route'){
  const planned=[];
  const field=element('div','math67-map-route');
  const sequence=commandStrip([]);
  let hint;
  const redraw=()=>{
   const path=walk67(spec,planned);
   field.replaceChildren(grid({...spec,active:path.at(-1),visited:path.slice(0,-1),trace:spec.draw?path:undefined},index=>{
    const now=coordinate(path.at(-1),spec.size),there=coordinate(index,spec.size);
    const command=Object.keys(moves).find(key=>moves[key][0]===there[0]-now[0]&&moves[key][1]===there[1]-now[1]);
    if(command)append(command);
   }));
   sequence.replaceChildren(...commandStrip(planned).children);
  };
  const reveal=()=>{
   if(mistakes>=2&&!hint){
    hint=commandStrip(spec.hint||spec.commands);
    hint.dataset.hint='true';
    panel.append(hint);
   }
  };
  const append=command=>{
   if(planned.length>=32||!walk67(spec,[...planned,command])){retry(null,'Здесь граница или препятствие. Выбери другой шаг.');reveal();return;}
   planned.push(command);
   redraw();
  };
  for(const key of Object.keys(moves)){
   const control=option(key,()=>append(key));
   control.dataset.direction=key;
   row.append(control);
  }
  const undo=option('Назад на шаг',()=>{planned.pop();redraw();});
  const check=option('Проверить путь',()=>{
   if(validRoute(spec,planned))finish();else{retry(null);reveal();}
  });
  panel.append(field);
  if(spec.commands)panel.append(commandStrip(spec.commands));
  panel.append(sequence,row,undo,check);
  redraw();
 }else if(spec.mode==='place'){
  const original={...spec.items};
  const placed=new Set();
  const field=element('div','math67-map-route');
  let item=null;
  const tray=new Map();
  const redraw=()=>{
   field.replaceChildren(grid({...spec,items:original},cell=>{
    const rule=spec.places[item];
    if(!item||original[cell]||!rule.includes(cell)){
     retry(item?field.querySelector(`[data-cell="${rule.find(id=>!original[id])}"]`):[...tray.values()].find(b=>!b.disabled));
     return;
    }
    original[cell]=item;
    placed.add(item);
    tray.get(item).disabled=true;
    item=null;
    redraw();
    if(placed.size===Object.keys(spec.places).length)finish();
   }));
  };
  for(const token of Object.keys(spec.places)){
   const key=option(markerNames[token],()=>{
    item=token;
    for(const [value,button] of tray)button.setAttribute('aria-pressed',String(value===token));
   },icon(token,spec.plan));
   key.dataset.mapItem=token;
   tray.set(token,key);
   row.append(key);
  }
  panel.append(field,row);
  redraw();
 }else if(spec.mode==='find'){
  let board;
  board=grid(spec,index=>{
   if(index===spec.correct)finish();
   else retry(board.querySelector(`[data-cell="${spec.correct}"]`));
  });
  panel.append(board);
 }else{
  if(spec.board)panel.append(grid(spec.board));
  const keys=spec.choices.map((item,i)=>option(item.name||String(item),()=>{
   if(i===spec.correct)finish();
   else retry(keys[spec.correct]);
  },item.map?grid(item.map):item.icon?icon(item.icon,item.plan):null));
  keys.forEach((key,i)=>key.dataset.mapChoice=i);
  row.append(...keys);
  panel.append(row);
 }
 return panel;
}
