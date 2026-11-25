import { sensoryArt } from './sensory-art.js';

const ns='http://www.w3.org/2000/svg';
const colors=['#69c2e0','#ed99c8','#efd06c','#b4a0e7','#84d6a5','#edab83','#93a5e7'];
const regular=n=>Array.from({length:n},(_,i)=>{
  const angle=2*Math.PI*i/n-Math.PI/2;
  return [50+40*Math.cos(angle),50+40*Math.sin(angle)];
});
const names={circle:'Круг',oval:'Овал',tri:'Треугольник',wideTri:'Треугольник',four:'Четырёхугольник',five:'Пятиугольник',six:'Шестиугольник',square:'Квадрат',rectangle:'Прямоугольник',open:'Незамкнутая линия'};
export const corners={tri:regular(3),wideTri:[[10,74],[40,20],[88,76]],four:[[14,18],[86,29],[74,83],[21,77]],five:regular(5),six:regular(6),square:[[18,18],[82,18],[82,82],[18,82]],rectangle:[[10,28],[90,28],[90,72],[10,72]],open:[[15,75],[25,22],[78,20],[90,74]]};
const art=(shape,attrs={})=>{const el=document.createElementNS(ns,shape);for(const [key,value] of Object.entries(attrs))el.setAttribute(key,value);return el;};
const poly=(points,fill,attrs={})=>art('polygon',{points:points.map(pair=>pair.join(',')).join(' '),fill,stroke:'#3c2c55','stroke-width':2,...attrs});
const draw=(content,viewBox='0 0 100 100')=>{const el=art('svg',{viewBox,class:'math67-geometry-art','aria-hidden':'true'});el.append(...content);return el;};
const geom=(shape,fill=colors[0])=>{
 if(shape==='circle'||shape==='oval') return art('ellipse',{cx:50,cy:50,rx:40,ry:shape==='circle'?40:27,fill,stroke:'#3c2c55','stroke-width':2});
 return shape==='open'?art('polyline',{points:corners.open.join(' '),fill:'none',stroke:'#3c2c55','stroke-width':3}):poly(corners[shape],fill);
};
const body=(shape,angle=25)=>{
 const color=colors[['ball','cube','cylinder','cone'].indexOf(shape)];
 if(shape==='ball')return sensoryArt({shape:'ball',color:'sky'});
 if(shape==='cube'){
  const d=13+10*Math.sin(angle*Math.PI/180);
  return draw([poly([[15,33],[42,12],[88,12+d/3],[63,33]],'#b6e9ff'),poly([[63,33],[88,12+d/3],[88,61],[63,83]],'#4978b0'),poly([[15,33],[63,33],[63,83],[15,83]],color)]);
 }
 const top=shape==='cone'?14:25;
 const ry=9+5*Math.sin(angle*Math.PI/180);
 const profile=shape==='cone'?`M20 73 L50 ${top} L80 73 A30 ${ry} 0 0 1 20 73Z`:`M20 25H80V73 A30 ${ry} 0 0 1 20 73Z`;
 const nodes=[art('path',{d:profile,fill:color,stroke:'#3c2c55','stroke-width':2}),
  art('path',{d:`M20 73 A30 ${ry} 0 0 0 80 73`,fill:'none',stroke:'#3c2c55','stroke-width':2})];
 if(shape==='cylinder') nodes.push(art('ellipse',{cx:50,cy:25,rx:30,ry,fill:'#e6f6ff',stroke:'#3c2c55','stroke-width':2}));
 return draw(nodes);
};
function tilePoints([type,x,y,size,turn=0]){
 const base={
  square:[[0,0],[1,0],[1,1],[0,1]],rect:[[0,0],[2,0],[2,1],[0,1]],half:[[0,0],[1,0],[0,1]],roof:[[0,1],[1,0],[2,1]]
 }[type];
 const angle=turn*Math.PI/2;
 const rotated=base.map(([px,py])=>[Math.round(px*Math.cos(angle)-py*Math.sin(angle)),Math.round(px*Math.sin(angle)+py*Math.cos(angle))]);
 const minX=Math.min(...rotated.map(p=>p[0])),minY=Math.min(...rotated.map(p=>p[1]));
 return rotated.map(([a,b])=>[x+(a-minX)*size,y+(b-minY)*size]);
}
const sameOutline=(first,second)=>first.map(String).sort().join('|')===second.map(String).sort().join('|');

function element(tag,css,text){
 const el=document.createElement(tag);
 if(css)el.className=css;
 if(text!==undefined)el.textContent=text;
 return el;
}
const view=(...items)=>{const wrap=element('div','math67-arithmetic-row');wrap.append(...items);return wrap;};
const figure=shape=>draw([geom(shape)]);
const label=shape=>names[shape]||({ball:'Шар',cube:'Куб',cylinder:'Цилиндр',cone:'Конус',square:'Квадрат',rect:'Прямоугольник',half:'Треугольник',roof:'Треугольная крыша'})[shape];
const countParts=(shape,parts,offset=0)=>{
 const w=shape==='square'?64:80,h=shape==='square'?64:48,x=(100-w)/2,y=(100-h)/2;
 if(shape==='circle'){
  const cx=50+offset, dy=Math.sqrt(Math.max(0,1600-offset*offset));
  return draw([geom('circle'),art('line',{x1:cx,x2:cx,y1:50-dy,y2:50+dy,stroke:'#3c2c55','stroke-width':3})]);
 }
 const pieces=[];
 for(let i=0;i<parts;i++){
  const step=w/parts;
  const a=x+i*step+(i?offset:0),b=x+(i+1)*step+(i+1===parts?0:offset);
  pieces.push(poly([[a,y],[b,y],[b,y+h],[a,y+h]],colors[i]));
 }
 return draw(pieces);
};

export function geometryDemo(spec,animate){
 const choices=element('div','math67-arithmetic-row math67-geometry-demo');
 if(spec.mode==='puzzle'){
  const segments=spec.tiles.map((tile,i)=>poly(tilePoints(tile),colors[i],{'stroke-width':1.4}));
  choices.append(draw(segments));
  segments.forEach((segment,i)=>animate(segment,[{opacity:.1,translate:'8px 6px'},{opacity:1,translate:'0 0'}],{duration:550,delay:400*i}));
 }else if(spec.mode==='body'){
  for(const shape of spec.shapes){
   const model=body(shape);
   choices.append(model);
   animate(model,[{transform:'perspective(180px) rotateY(-22deg)'},{transform:'perspective(180px) rotateY(22deg)'},{transform:'perspective(180px) rotateY(0deg)'}],{duration:1100});
  }
 }else if(spec.mode==='parts'){
  const panels=spec.examples.map(item=>countParts(...item));
  choices.append(...panels);
  panels.forEach((shape,i)=>animate(shape,[{opacity:.15},{opacity:1}],{duration:430,delay:i*450}));
 }else {
  for(const [i,name] of spec.shapes.entries()){
   const outline=geom(name);
   const model=draw([outline]);
   choices.append(model);
   const points=corners[name];
   if(spec.mode==='vertices'&&points){
    points.forEach(([cx,cy],index)=>{
     const mark=art('circle',{cx,cy,r:4,fill:'#a33566'});
     model.append(mark);
     animate(mark,[{opacity:.05},{opacity:1}],{duration:420,delay:i*320+index*280});
    });
   }else{
    const length=100;
    outline.setAttribute('pathLength',length);
    outline.style.strokeDasharray=length;
    animate(outline,[{strokeDashoffset:length,fillOpacity:.25},{strokeDashoffset:0,fillOpacity:1}],{duration:950,delay:i*300});
   }
  }
 }
 return choices;
}

export function practiceGeometry(spec,feedback,complete){
 const panel=element('div','math67-arithmetic math67-geometry');
 let errors=0;
 const button=(name,action,image)=>{
  const key=element('button','lesson-secondary',name);
  key.type='button';
  key.addEventListener('click',action);
  if(image)key.prepend(image);
  return key;
 };
 const win=()=>{
  panel.querySelectorAll('button').forEach(key=>key.disabled=true);
  complete();
 };
 const retry=hint=>{
  errors++;
  feedback.dataset.state='retry';
  feedback.textContent='Посмотри на фигуру и попробуй ещё.';
  if(errors>=2&&hint)hint.dataset.hint='true';
 };

 if(spec.mode==='vertices'||spec.mode==='connect'){
  const points=corners[spec.shape];
  const selected=[];
  const outline=draw(spec.mode==='vertices'?[geom(spec.shape)]:[]);
  const segment=art('polyline',{fill:'none',stroke:'#744eca','stroke-width':4});
  outline.append(segment);
  const field=element('div','math67-geometry-points');
  const positions=(spec.decoys||[]).concat(points);
  const active=[];
  for(let i=0;i<positions.length;i++){
   const index=i-(spec.decoys?.length||0);
   const [x,y]=positions[i];
   const key=button(spec.mode==='connect'?String(index+1):'•',()=>{
    if(index<0||selected.includes(index)||(spec.mode==='connect'&&index!==selected.length)){
     retry(active.find((control,i)=>i>=(spec.decoys?.length||0)&&!control.disabled));
     return;
    }
    key.disabled=true;
    selected.push(index);
    if(spec.mode==='connect')segment.setAttribute('points',[...selected.map(i=>points[i]),...(selected.length===points.length?[points[0]]:[])].join(' '));
    if(selected.length===points.length)win();
   });
   key.style.left=x+'%';key.style.top=y+'%';
   key.setAttribute('aria-label',spec.mode==='connect'?'Точка '+(index+1):'Отметить точку '+(i+1));
   active.push(key);
  }
  field.append(outline,...active);
  panel.append(field);
  return panel;
 }

 if(spec.mode==='puzzle'){
  const used=new Set(),placed=new Set();
  let selected=-1;
  const turns=spec.tiles.map((tile,i)=>((tile[4]||0)+(spec.rotate?((i%3)+1):0))%4);
  const tray=view(),targets=view();
  const board=draw(spec.tiles.map(tile=>poly(tilePoints(tile),'#f7ebd6',{'stroke-dasharray':'3 2','stroke-width':1})));
  const example=draw(spec.tiles.map((tile,i)=>poly(tilePoints(tile),colors[i],{'stroke-width':1.4})));
  example.classList.add('math67-geometry-example');
  if(spec.example)panel.append(example);
  const pieceButtons=spec.tiles.map((tile,i)=>button(String(i+1),()=>{
   selected=i;
   pieceButtons.forEach((key,index)=>key.setAttribute('aria-pressed',String(index===i)));
  },draw([poly(tilePoints([tile[0],12,12,33,turns[i]]),colors[i])])));
  const targetButtons=spec.tiles.map((tile,i)=>button('Место '+(i+1),()=>{
   if(selected<0||used.has(selected)){retry(pieceButtons.find(key=>!key.disabled));return;}
   const [type,,,size]=spec.tiles[selected];
   const [target,x,y,targetSize]=tile;
   if(type!==target || size!==targetSize || !sameOutline(tilePoints([type,x,y,size,turns[selected]]),tilePoints(tile))){
    retry(targetButtons.find((key,index)=>!placed.has(index)&&spec.tiles[index][0]===type));
    return;
   }
   board.children[i].setAttribute('fill',colors[selected]);
   board.children[i].removeAttribute('stroke-dasharray');
   used.add(selected);placed.add(i);
   pieceButtons[selected].disabled=true;
   targetButtons[i].disabled=true;
   selected=-1;
   if(used.size===spec.tiles.length)win();
  },draw([poly(tilePoints([tile[0],12,12,33,tile[4]]),'#f4dfb4')])));
  const rotate=button('Повернуть на четверть',()=>{
   if(selected<0){retry(pieceButtons.find(key=>!key.disabled));return;}
   turns[selected]=(turns[selected]+1)%4;
   pieceButtons[selected].firstChild.replaceWith(draw([poly(tilePoints([spec.tiles[selected][0],12,12,33,turns[selected]]),colors[selected])]));
  });
  tray.append(...pieceButtons);
  targets.append(...targetButtons);
  panel.append(board,tray);
  if(spec.rotate)panel.append(rotate);
  panel.append(targets);
  return panel;
 }

 if(spec.shapes)panel.append(view(...spec.shapes.map(figure)));
 if(spec.body)panel.append(view(...spec.body.map(shape=>body(shape))));
 if(spec.reference)panel.append(view(...spec.reference.map(item=>countParts(...item))));
 const row=view();
 const selected=new Set();
 const ok=Array.isArray(spec.correct)?spec.correct:[spec.correct];
 const buttons=spec.choices.map((option,i)=>{
  const picture=Array.isArray(option)?countParts(...option):names[option]?figure(option):['ball','cube','cylinder','cone'].includes(option)?body(option):spec.icons?.[i]?sensoryArt({shape:spec.icons[i],color:'sky'}):null;
  const accessible=picture?'Вариант '+(i+1):String(option);
  const choice=button(accessible,()=>{
   if(!ok.includes(i)||selected.has(i)){retry(buttons[ok.find(index=>!selected.has(index))]);return;}
   selected.add(i);
   choice.disabled=true;
   if(selected.size===ok.length)win();
  },picture);
  choice.dataset.geometryChoice=String(i);
  return choice;
 });
 row.append(...buttons);
 panel.append(row);
 return panel;
}
