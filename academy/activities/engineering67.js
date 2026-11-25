const svgNS = 'http://www.w3.org/2000/svg';

function element(tag, css, text) {
  const node = document.createElement(tag);
  if (css) node.className = css;
  if (text !== undefined) node.textContent = text;
  return node;
}

function svg(tag, attrs) {
  const node = document.createElementNS(svgNS, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  return node;
}

const rect = (x,y,width,height,fill,stroke) => svg('rect',{x,y,width,height,fill,stroke:stroke||'none'});
const line = (x1,y1,x2,y2) => svg('line',{x1,y1,x2,y2,stroke:'#483266','stroke-width':3});
const mass = values => values.reduce((sum,value) => sum + value, 0);

export function dimensionPicture([length,width], color) {
  const figure = svg('svg',{viewBox:'0 0 100 75',role:'img','aria-label':'Полоса'});
  figure.append(rect(3,3,92*length,65*width,color,'#483266'));
  return figure;
}

function measure({length,unit=1,axis='length',tiles=length/unit,mode}) {
  const height = axis === 'height' || axis === 'width';
  const span = 180;
  const step = span * unit / length;
  const art = svg('svg',{viewBox:height?'0 0 100 206':'0 0 204 78',class:'math67-measure',role:'img','aria-label':`Модель измерения, мерок уложено: ${tiles}`});
  art.append(height ? rect(8,10,32,span,'#daf3fa','#483266') : rect(12,12,span,24,'#daf3fa','#483266'));
  for (let i=0;i<tiles;i++) {
    const shift = i >= 1 ? (mode === 'gap' ? 5 : mode === 'overlap' ? -5 : mode === 'mixed' ? -step/2 : 0) : 0;
    const size = mode === 'mixed' && i === 0 ? step/2 : step;
    const pos = step*i + shift;
    art.append(height ? rect(40,190-pos-size,26,size,'#ffe0a0','#483266') : rect(12+pos,36,size,25,'#ffe0a0','#483266'));
  }
  return art;
}

function scale(left,right,weights=0) {
  const d = Math.sign(mass(left)-mass(right)-weights)*21;
  const art = svg('svg',{viewBox:'0 0 240 135',class:'math67-measure',role:'img','aria-label':d>0?'Левая чаша ниже':d<0?'Правая чаша ниже':'Чаши на одной высоте'});
  art.append(svg('path',{d:'M120 59 102 122 138 122 Z',fill:'#9b73c0'}),line(49,51+d,191,51-d));
  for (const [x,y,pieces] of [[49,84+d,left],[191,84-d,[...right,...Array(weights).fill(1)]]]) {
    art.append(line(x,y-33,x-25,y),line(x,y-33,x+25,y),rect(x-30,y,60,6,'#e8b85c','#483266'));
    for (let i=0;i<pieces.length;i++) {
      const small = x===191 && i>=right.length;
      const w = small?9:x===49?22:15;
      art.append(rect(x-24+(i%5)*10,y-(small?10:19)-Math.floor(i/5)*10,w,small?10:19,small?'#c9bfd6':x===49?'#6ec7e6':'#ef90ba','#483266'));
    }
  }
  return art;
}

function vessels(spec, left=spec.amount??0, right=0) {
  const {capacityA=spec.capacity,capacityB}=spec;
  const art = svg('svg',{viewBox:'0 0 240 120',class:'math67-measure',role:'img','aria-label':`Мерок слева: ${left}${capacityB?', справа: '+right:''}`});
  const maxHeight=84;
  const unit=44;
  const maxCapacity=Math.max(capacityA,capacityB||0);
  const draw=(capacity,count,position,width,paint) => {
    const step=maxHeight*unit/(maxCapacity*width);
    const bottom=106;
    const rim=bottom-capacity*step;
    art.append(rect(position,rim,width,capacity*step,'#fff2e1','#483266'));
    art.append(rect(position+1,bottom-count*step,width-2,Math.max(0,count*step-1),paint));
    for(let i=1;i<capacity;i++) art.append(line(position,bottom-i*step,position+7,bottom-i*step));
  };
  draw(capacityA,left,capacityB?25:93,56,'#85d7ed');
  if(capacityB) draw(capacityB,right,160,44,'#85d7ed');
  return art;
}

function board() {
  return element('div','math67-arithmetic math67-engineering');
}

export function engineeringDemo(spec, animate) {
  const panel=board();
  if(spec.name==='length') {
    const steps=spec.length/spec.unit;
    for(let i=0;i<=steps;i++) panel.append(measure({...spec,tiles:i}));
  } else if(spec.name==='dimensions') {
    panel.append(...spec.pairs.map((pair,i)=>dimensionPicture(pair,i?'#f3a5c4':'#9bd9ef')));
    return panel;
  } else if(spec.name==='twoLengths') {
    panel.append(measure({...spec,unit:1}),measure({...spec,unit:2}));
    return panel;
  } else if(spec.name==='mass') {
    for(let i=0;i<=(spec.weights ?? 0);i++) panel.append(scale(spec.left,spec.right,i));
    if(!spec.weights) panel.prepend(scale([],[]));
  } else if(spec.name==='liquid') {
    for(let i=0;i<=spec.amount;i++) panel.append(vessels(spec,i));
  } else if(spec.name==='transfer') {
    for(let i=0;i<=spec.amount;i++) panel.append(vessels(spec,spec.amount-i,i));
  }
  panel.classList.add('math67-engineering-demo');
  const frames=[...panel.children];
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) {
    panel.replaceChildren(frames.at(-1));
  } else {
    frames.forEach((frame,i)=>animate(frame,[{opacity:0},{opacity:1,offset:.05},{opacity:1,offset:.98},{opacity:i===frames.length-1?1:0}],{duration:540,delay:i*540,fill:'both'}));
  }
  return panel;
}

export function practiceEngineering(spec,feedback,complete) {
  const panel=board();
  const view=element('div','math67-arithmetic-row');
  const controls=element('div','math67-arithmetic-row');
  panel.append(view,controls);
  let count=0, mistakes=0;
  const check=(right,hint) => {
    if(right){
      controls.querySelectorAll('button').forEach(control=>control.disabled=true);
      complete();
    }else{
      mistakes++;
      feedback.dataset.state='retry';
      feedback.textContent='Посмотри на модель и попробуй ещё.';
      if(mistakes>=2) hint?.setAttribute('data-hint','true');
    }
  };
  const addButton=(label,run,parent=controls) => {
    const button=element('button','lesson-secondary',label);
    button.type='button';
    button.addEventListener('click',run);
    parent.append(button);
    return button;
  };
  const counter=(label,limit,draw)=>{
    const add=addButton(label,()=>{if(count<limit) count++;draw();});
    addButton('Убрать одну',()=>{if(count>0)count--;draw();});
    draw();
    return add;
  };
  const choose=(values,correct,present=String,ready=()=>true,prerequisite) => {
    const keys=new Map();
    for(const value of values){
      const control=addButton(present(value),()=>check(ready()&&value===correct,ready()?keys.get(correct):prerequisite));
      keys.set(value,control);
    }
  };
  const smaller=(answer)=>answer===1?3:answer-1;
  const quantities = answer => [smaller(answer),answer,answer===10?8:answer+1];
  const sideName=side=>({left:'Слева',equal:'Поровну',right:'Справа'})[side];
  if(spec.name==='length'){
    const answer=spec.length/spec.unit;
    const draw=()=>view.replaceChildren(measure({...spec,tiles:count}));
    const add=counter('Приложить мерку',answer,draw);
    choose(quantities(answer),answer,String,()=>count===answer,add);
  }else if(spec.name==='mass'){
    const draw=()=>view.replaceChildren(scale(spec.left,spec.right,count));
    if(spec.weights){
      const add=counter('Добавить грузик справа',spec.weights+1,draw);
      const confirm=addButton('Проверить равновесие',()=>check(mass(spec.left)===mass(spec.right)+count,count<spec.weights?add:controls.children[1]));
      confirm.dataset.engineering='balance';
    }else{
      draw();
      choose(['left','equal','right'],spec.answer,sideName);
    }
  }else if(spec.name==='liquid'){
    const draw=()=>view.replaceChildren(vessels(spec,count));
    const add=counter('Влить стаканчик',spec.capacity,draw);
    choose(quantities(spec.amount),spec.amount,String,()=>count===spec.amount,add);
  }else if(spec.name==='vessels' || spec.name==='fitLiquid'){
    const {capacityA,capacityB,amount}=spec;
    view.append(vessels(spec,0,0));
    let filled=false;
    const fill=addButton('Проверить одинаковой меркой',()=>{
      view.replaceChildren(vessels(spec,amount?Math.min(amount,capacityA):capacityA,amount?Math.min(amount,capacityB):capacityB));
      filled=true;
    });
    choose(amount?['left','right']:['left','equal','right'],amount?(amount<=capacityA?'left':'right'):spec.answer,sideName,()=>filled,fill);
  }else if(spec.name==='measureError'){
    const rows=['gap','overlap','mixed'].filter(mode=>mode!==spec.mode);
    rows.splice(1,0,spec.mode);
    for(const [i,mode] of rows.entries()){
      const button=addButton('Ряд '+(i+1),()=>check(mode===spec.mode,controls.children[1]));
      button.prepend(measure({...spec,mode}));
    }
  }else if(spec.name==='unitComparison'){
    view.append(measure({...spec,unit:1}),measure({...spec,unit:2}));
    choose(['Длинных','Коротких','Поровну'],'Коротких');
  }else if(spec.name==='unitsPair'){
    const pairs=[[1,2],[1,1],[2,1],[2,2]];
    for(const [i,[a,b]] of pairs.entries()){
      const button=addButton('Пара '+(i+1),()=>check(a===b,controls.children[1]));
      button.prepend(measure({...spec,unit:a}),measure({...spec,unit:b}));
    }
  }
  return panel;
}
