import {createDrawing} from './canvas.js';
import {BOARD,drawnRoute,pathPosition,samplePath,traceProgress} from './geometry.js';
import {mark,polyline} from './pictures.js';
import {button,el,reduced,svg} from './ui.js';

export const paperColors={plain:'#fffdf6',garden:'#f3fbec',clouds:'#f4f2ff',sunshine:'#fff1d8'};
const colors=[['#437eb5','Синий'],['#bd6885','Розовый'],['#538b73','Зелёный'],['#b96a48','Оранжевый'],['#8664ad','Фиолетовый'],['#a47a20','Жёлтый']];
const tools=[['pencil','Карандаш'],['brush','Кисть'],['wax','Мелок'],['eraser','Ластик']];
const viewBox=`0 0 ${BOARD.width} ${BOARD.height}`;
const circle=(point,r,fill)=>svg('circle',{cx:point.x,cy:point.y,r,fill});

function atPosition(ids,node,point,size){
  node.replaceChildren(mark(ids,point.x,point.y,size));
}

function addMarkers(layer,path,kind){
  if(kind==='points'){
    layer.append(circle(path[0],12,'#c78491'),circle(path.at(-1),12,'#6998aa'));
  }else if(kind==='dots'){
    for(const point of samplePath(path,25)) layer.append(circle(point,4.5,'#bba0b1'));
  }else if(kind!=='sample'&&kind!=='hidden') {
    layer.append(circle(path[0],12,'#d9997c'));
    if(path[0]!==path.at(-1))layer.append(circle(path.at(-1),7,'#6897a4'));
  }
}

export function inkBoard(spec,{finish,example=false,strokes=[],onChange=()=>{},exportControls}={}){
  const scene=el('section','write-ink');
  const pad=el('div','write-pad ym-hide-content');
  const backdrop=svg('svg',{class:'write-pad-bg',viewBox,'aria-hidden':'true'});
  const canvas=el('canvas','write-ink-canvas ym-hide-content');
  canvas.setAttribute('aria-label','Холст для рисования');
  const overlay=svg('svg',{class:'write-pad-overlay',viewBox,'aria-hidden':'true'});
  const border=svg('g'), guides=svg('g'), permanent=svg('g'), revealLayer=svg('g'), moving=svg('g'), demo=svg('g');
  const instructions=el('p','write-status');
  instructions.setAttribute('role','status');
  const toolbar=el('div','write-controls write-toolbar');
  const palette=el('div','write-controls write-palette');
  const routeMode=spec.mode==='route';
  const drawingMode=spec.mode==='free';
  const markMode=spec.mode==='marks';
  const landmarks=spec.items??[];
  const corridors=spec.corridors??[];
  const targets=spec.targets??[];
  const templates=routeMode?corridors:targets.map(t=>t.points);
  const styles={tool:'brush',color:spec.color??colors[0][0],width:18};
  let routed=null,frame,step=0,sampleIndex=0,playing=null,assist=false,ink,complete=false;
  let selectedPaper=spec.paper??'plain';
  pad.style.background=paperColors[selectedPaper]??paperColors.plain;
  backdrop.append(border,revealLayer,guides,permanent);
  overlay.append(demo,moving);
  pad.append(backdrop,canvas,overlay);
  scene.append(pad,instructions,toolbar);
  const actor=spec.actor??'lumi';
  const actorMark=routeMode?mark(actor,spec.start.x,spec.start.y,74):null;
  if(routeMode){
    permanent.append(circle(spec.start,40,'#f3dba6'),circle(spec.end,40,'#cce4de'),actorMark,mark(spec.goal,spec.end.x,spec.end.y,79));
    for(const obstacle of spec.obstacles??[]){
      permanent.append(circle(obstacle,obstacle.r,'#dbe3c4'),mark(obstacle.name??'rock',obstacle.x,obstacle.y,obstacle.r*1.52));
    }
  }
  if(spec.paper==='clouds')permanent.append(mark('cloud',94,73,110),mark('cloud',537,87,100));
  if(spec.paper==='garden')permanent.append(mark('flowerGold',550,352,77),mark('leaf',605,382,71),mark('flower',72,357,70));
  if(spec.paper==='sunshine')permanent.append(mark('sun',526,85,113),mark('cloud',143,87,93));
  for(const {name,x,y,size} of landmarks)permanent.append(mark(name,x,y,size));
  for(const outline of spec.outlines??[])border.append(polyline(outline,{'stroke':spec.outlineColor??'#d7aebd','stroke-width':spec.area?14:9}));
  if(spec.sampleDivider)border.append(polyline(spec.sampleDivider,{stroke:'#d6c2c0','stroke-width':3,'stroke-dasharray':'9 11'}));
  for(const sample of spec.samples??[])border.append(polyline(sample,{stroke:'#a66e90','stroke-width':13}));
  function guide(active=[]){
    guides.replaceChildren();
    templates.forEach((path,index)=>{
      const style=routeMode?(spec.guide??'wide'):(targets[index].guide??spec.guide??'wide');
      if(style==='wide'||assist){
        guides.append(polyline(path,{stroke:active[index]?'#b8dfc6':'#eee5d9','stroke-width':routeMode?spec.width*1.68:targets[index].tolerance*1.62}));
      }
      if(style==='wide'||style==='dots'||style==='points'||assist)
        addMarkers(guides,path,style==='wide'?'wide':style);
    });
    if(routeMode&&spec.branches)for(const path of spec.branches)
      guides.append(polyline(path,{stroke:'#eee5d9','stroke-width':spec.width*1.68}));
  }
  guide();
  function reveal(){
    if(!spec.reveal)return;
    pad.classList.add('write-reveal');
    const closed=targets.filter(t=>t.closed).map(t=>polyline(t.points,{fill:'#cadfc4','fill-opacity':'.78'}));
    const rewards=(spec.rewardItems??[]).map(({name,x,y,size})=>mark(name,x,y,size));
    revealLayer.replaceChildren(...closed,...rewards);
    if(!reduced())revealLayer.animate([{opacity:0},{opacity:1}],{duration:680});
  }
  function change(lines){
    if(example||complete)return;
    onChange(lines);
    demo.replaceChildren();
    if(routeMode){
      routed=drawnRoute(lines,{...spec,width:spec.width*(assist?1.22:1)});
      go.hidden=!routed;
      instructions.textContent=routed?'Путь готов. Запусти героя.':lines.length?'Можно продолжить дорожку.':'';
      return;
    }
    if(drawingMode){return;}
    if(markMode){
      const {x,y,w,h}=spec.area;
      const within=p=>p.x>=x-14&&p.x<=x+w+14&&p.y>=y-14&&p.y<=y+h+14;
      const marks=lines.filter(stroke=>{
        const first=stroke.points[0],last=stroke.points.at(-1);
        if(stroke.tool==='eraser'||!first||!last)return false;
        const dx=Math.abs(last.x-first.x),dy=Math.abs(last.y-first.y);
        return within(first)&&within(last)&&dy>=22&&dy<=132&&dy>=dx*(assist?.75:1.22);
      }).length;
      instructions.textContent=marks?'Капельки появляются под облаком.':'Нарисуй короткие штрихи под облаком.';
      if(marks>=spec.count){
        complete=true;
        if(spec.reveal){
          reveal();
          if(!reduced())permanent.animate([{opacity:.55},{opacity:1}],700);
        }
        finish?.();
      }
      return;
    }
    const completed=targets.map(target=>traceProgress(lines,target,assist));
    guide(completed);
    instructions.textContent=lines.length&&!completed.every(Boolean)?'Продолжи линию. Подсказка рядом.':'';
    if(completed.every(Boolean)){
      complete=true;
      reveal();
      finish?.();
    }
  }
  const go=button('В путь',()=>animateRoute(routed,true),true);
  go.hidden=true;
  function stopMotion(){
    if(frame)cancelAnimationFrame(frame);
    frame=0;playing=null;
  }
  function completeRoute(){
    complete=true;
    instructions.textContent='Добрались!';
    finish?.();
  }
  function animateRoute(points,success=false){
    if(!points?.length) return;
    stopMotion();
    demo.replaceChildren();
    playing={points,success};
    step=0;
    moving.replaceChildren();
    if(routeMode)actorMark.setAttribute('visibility','hidden');
    const start=performance.now();
    function update(t){
      const location=pathPosition(points,t);
      atPosition(routeMode?actor:'pencil',moving,location,routeMode?73:57);
      if(!routeMode){
        const count=Math.max(2,Math.ceil(points.length*t));
        demo.replaceChildren(polyline(points.slice(0,count),{stroke:'#d18eab','stroke-width':12}));
      }
    }
    playing.update=update;
    if(reduced()){update(0);return;}
    const duration=success?2300:2250;
    function draw(now){
      if(!scene.isConnected||!playing)return;
      const t=Math.min(1,(now-start)/duration);
      update(t);
      if(t<1)frame=requestAnimationFrame(draw);
      else {
        stopMotion();
        if(success)completeRoute();
      }
    }
    frame=requestAnimationFrame(draw);
  }
  function nextFrame(){
    if(!playing)return;
    step++;
    playing.update(Math.min(1,step/4));
    if(step>=4){
      const success=playing.success;
      stopMotion();if(success) completeRoute();
    }
  }
  function show(){
    const parts=templates.length?templates:(spec.demoPaths??[]);
    if(!parts.length)return;
    const list=samplePath(parts[sampleIndex++%parts.length],11);
    animateRoute(list);
  }
  toolbar.append(button('Показать движение',show,true),button('Следующий кадр',nextFrame));
  if(!example){
    ink=createDrawing(canvas,{strokes,change});
    toolbar.append(button('Подсказка',()=>{
      assist=true;guide();
      if(!drawingMode)show();
    }),button('Вернуть штрих',()=>ink.undo()),button('Очистить',()=>ink.clear()));
    if(routeMode)toolbar.append(go);
    if(drawingMode){
      scene.insertBefore(palette,pad);
      function select(group,node,settings) {
        ink.setStyle(settings);
        for(const option of group) option.setAttribute('aria-pressed',String(option===node));
      }
      const swatches=el('div','write-controls');
      const moreColors=spec.extraColors??[];
      for(const [color,name] of [...colors,...moreColors]){
        const choice=button('',()=>select(swatches.children,choice,{color,tool:'brush'}));
        choice.style.setProperty('--swatch',color);
        choice.setAttribute('aria-label',name);
        choice.className='write-swatch';
        swatches.append(choice);
      }
      palette.append(swatches);
      const penTools=el('div','write-controls');
      for(const [tool,label] of tools){
        const choice=button(label,()=>select(penTools.children,choice,{tool}));
        penTools.append(choice);
      }
      palette.append(penTools);
      const sizes=el('div','write-controls');
      for(const [width,label] of [[9,'Тонкий'],[18,'Средний'],[32,'Широкий']]){
        const choice=button('',()=>select(sizes.children,choice,{width}));
        choice.setAttribute('aria-label',label);
        choice.style.setProperty('--size',String(width*.67)+'px');
        choice.className='write-width';
        sizes.append(choice);
      }
      palette.append(sizes);
      toolbar.append(button('Повторить штрих',()=>ink.redo()));
      if(finish)toolbar.append(button('Готово',finish,true));
    }
    ink.setStyle(styles);
    if(strokes.length&&!drawingMode)queueMicrotask(()=>{if(scene.isConnected)change(strokes);});
  }else{
    canvas.hidden=true;
  }
  exportControls?.({toolbar,pad,backdrop,ink,
    setPaper(name){selectedPaper=name;pad.style.background=paperColors[name];},
    readPaper:()=>selectedPaper});
  return {view:scene,destroy(){stopMotion();ink?.destroy();}};
}
