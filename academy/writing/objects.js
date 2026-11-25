import {button,el,reduced,svg} from './ui.js';

const palette=['#c86987','#3c9ca0','#d99534','#8867ad','#659266'];
const setNames={pom:'Помпоны',button:'Пуговицы',stone:'Камешки',bead:'Бусины',shape:'Фигурки',keys:'Клавиши'};

function piece(type,color,index,slot=false) {
  const art=svg('svg',{viewBox:'0 0 88 88','aria-hidden':'true'});
  if(slot){
    if(type==='pom'){
      art.append(svg('path',{d:'M23 43Q24 13 44 13Q64 13 65 43',stroke:'#ae8557','stroke-width':6,fill:'none'}),
        svg('path',{d:'M10 42H78L67 73H21Z',fill:'#d8ac73',stroke:'#ae8557','stroke-width':3}),
        svg('path',{d:'M18 52H70M20 61H68',stroke:'#f4d7a4','stroke-width':3}));
    }else if(type==='bead'){
      art.append(svg('path',{d:'M3 44H85',stroke:'#bd8a58','stroke-width':7}),
        svg('circle',{cx:44,cy:44,r:28,fill:'none',stroke:color,'stroke-width':3,'stroke-dasharray':'5 7'}));
    }else{
      art.append(svg('rect',{x:9,y:9,width:70,height:70,rx:20,fill:color,'fill-opacity':'.20',stroke:color,'stroke-width':3,'stroke-dasharray':'6 5'}));
    }
    return art;
  }
  const round=svg('circle',{cx:44,cy:44,r:31,fill:color,stroke:'#5d405459','stroke-width':2});
  if(type==='pom'){
    for(let i=0;i<11;i++){
      const angle=i*Math.PI*2/11;
      art.append(svg('circle',{cx:44+24*Math.cos(angle),cy:44+24*Math.sin(angle),r:11,fill:color}));
    }
    art.append(round,svg('ellipse',{cx:34,cy:29,rx:11,ry:6,fill:'#ffffff70'}));
  }else if(type==='button'||type==='bead'){
    art.append(round,svg('circle',{cx:44,cy:44,r:23,fill:'none',stroke:'#ffffff60','stroke-width':3}));
    const holes=type==='button'?[[37,37],[51,37],[37,51],[51,51]]:[[44,44]];
    for(const [cx,cy] of holes) art.append(svg('circle',{cx,cy,r:4,fill:'#4b4058'}));
  }else if(type==='stone'){
    art.append(svg('path',{d:'M15 47Q16 23 41 18Q64 12 75 36Q85 61 58 72Q25 83 15 47Z',fill:color,stroke:'#67577350','stroke-width':2}),
      svg('path',{d:'M20 40Q36 25 51 29',fill:'none',stroke:'#ffffff85','stroke-width':4,'stroke-linecap':'round'}));
  }else if(type==='keys'){
    art.append(svg('rect',{x:20,y:8,width:48,height:70,rx:12,fill:color,stroke:'#63507090','stroke-width':2}),
      svg('path',{d:'M30 23V59',stroke:'#ffffff78','stroke-width':4,'stroke-linecap':'round'}));
  }else{
    const d=['M44 7l11 25 27 2-20 18 7 27-25-15-25 15 7-27-20-18 27-2Z','M44 12L77 72H11Z','M15 15H73V73H15Z'][index%3];
    art.append(svg('path',{d,fill:color,stroke:'#5e49645e','stroke-width':2,'stroke-linejoin':'round'}));
  }
  return art;
}

let soundContext;
function playNote(index){
  try{
    const Context=window.AudioContext??window.webkitAudioContext;
    soundContext??=new Context();
    void soundContext.resume().catch(()=>{});
    const os=soundContext.createOscillator(), vol=soundContext.createGain(), time=soundContext.currentTime;
    os.type='sine';os.frequency.value=[392,440,494,523,587][index%5];
    vol.gain.setValueAtTime(0,time);vol.gain.linearRampToValueAtTime(.08,time+.04);
    vol.gain.exponentialRampToValueAtTime(.001,time+.3);
    os.connect(vol);vol.connect(soundContext.destination);
    os.start(time);os.stop(time+.31);
    os.addEventListener('ended',()=>{os.disconnect();vol.disconnect();});
  }catch{}
}

export function objectsBoard(spec,{finish,example=false}={}){
  const view=el('section','write-objects');
  const row=el('div','write-items');
  const bins=el('div','write-slots');
  const controls=el('div','write-controls');
  const status=el('p','write-status');
  status.setAttribute('role','status');
  status.textContent=setNames[spec.object];
  const itemButtons=[],slotButtons=[],solved=new Set();
  let selected=-1,drag=null,progress=0,timer, suppressClick=false;
  const indices=Array.from({length:spec.count},(_,i)=>i);
  const isMusic=spec.object==='keys';
  function select(index){
    if(example||solved.has(index))return;
    selected=index;
    itemButtons.forEach((node,i)=>node.classList.toggle('is-picked',i===index));
    status.textContent='Теперь выбери место.';
  }
  function validate(index,slot){
    if(index<0)return;
    const expected=spec.object==='pom'?0:spec.object==='bead'?progress:index;
    if(slot!==expected||(spec.object==='bead'&&index!==progress)){
      status.textContent='Попробуй другое место.';
      slotButtons[expected]?.classList.add('write-hint');
      return;
    }
    solved.add(index);progress++;
    itemButtons[index].disabled=true;
    itemButtons[index].classList.remove('is-picked');
    const target=slotButtons[slot];target.classList.remove('write-hint');
    target.replaceChildren(piece(spec.object,palette[index],index));
    if(!reduced()) target.animate([{transform:'scale(.86)'},{transform:'scale(1)'}],260);
    if(spec.object==='pom')target.setAttribute('aria-label','Корзинка с помпонами: '+progress);
    else target.disabled=true;
    selected=-1;
    status.textContent='На месте!';
    if(progress===spec.count)finish?.();
  }
  function activeKey(index){
    if(example||progress>=spec.pattern.length)return;
    playNote(index);
    if(spec.pattern[progress]!==index){
      status.textContent='Посмотри на подсвеченную клавишу.';
      return;
    }
    itemButtons[index].classList.remove('write-hint');
    progress++;
    if(progress===spec.pattern.length) finish?.();
    else itemButtons[spec.pattern[progress]].classList.add('write-hint');
  }
  for(const index of indices) {
    const tile=button('',()=>{if(!suppressClick){if(isMusic) activeKey(index);else select(index);}});
    tile.setAttribute('aria-label',setNames[spec.object]+' · '+(index+1));
    tile.dataset.item=index;
    tile.append(piece(spec.object,palette[index],index));
    itemButtons.push(tile);
    row.append(tile);
    if(example||isMusic)continue;
    tile.addEventListener('pointerdown',event=>{
      if(drag||event.button!==0||(event.pointerType==='touch'&&!event.isPrimary))return;
      drag={id:event.pointerId,index,x:event.clientX,y:event.clientY,tile,moved:false};
      try{tile.setPointerCapture(event.pointerId);}catch{}
    });
    tile.addEventListener('pointermove',event=>{
      if(drag?.id!==event.pointerId) return;
      const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
      if(Math.hypot(dx,dy)>9)drag.moved=true;
      if(drag.moved)tile.style.transform=`translate(${dx}px,${dy}px)`;
    });
    const stop=event=>{
      if(drag?.id!==event.pointerId)return;
      const move=drag;
      drag=null;
      tile.style.transform='';
      if(!move.moved||event.type!=='pointerup')return;
      suppressClick=true;
      setTimeout(()=>{suppressClick=false;},0);
      select(index);
      const goal=slotButtons.findIndex(node=>{
        const r=node.getBoundingClientRect();
        return event.clientX>=r.left&&event.clientX<=r.right&&event.clientY>=r.top&&event.clientY<=r.bottom;
      });
      if(goal>=0)validate(index,goal);
    };
    for(const name of ['pointerup','pointercancel','lostpointercapture'])tile.addEventListener(name,stop);
  }
  if(!isMusic)for(const index of indices.slice(0,spec.object==='pom'?1:spec.count)){
    const slot=button('',()=>validate(selected,index));
    slot.dataset.slot=index;
    slot.setAttribute('aria-label',spec.object==='pom'?'Корзинка':'Место '+(index+1));
    slot.append(piece(spec.object,palette[index],index,true));
    slotButtons.push(slot);bins.append(slot);
  }
  function show(){
    clearTimeout(timer);
    const list=isMusic?spec.pattern:indices;
    let i=0;
    function frame(){
      if(!view.isConnected)return;
      itemButtons.forEach(node=>node.classList.remove('write-hint'));
      const index=list[i];
      itemButtons[index].classList.add('write-hint');
      if(isMusic)playNote(index);
      else if(example){
        const slot=spec.object==='pom'?0:index;
        slotButtons[slot].replaceChildren(piece(spec.object,palette[index],index));
        if(!reduced()){
          const from=itemButtons[index].getBoundingClientRect(),to=slotButtons[slot].getBoundingClientRect();
          const dx=to.left-from.left,dy=to.top-from.top;
          itemButtons[index].animate([{transform:'none'},{transform:`translate(${dx}px,${dy}px)`,opacity:.55}],{duration:680,easing:'ease-in-out'});
          slotButtons[slot].animate([{opacity:.25},{opacity:1}],{duration:740,easing:'ease-in'});
        }
      }
      i++;
      if(i<list.length&&!reduced())timer=setTimeout(frame,850);
    }
    frame();
  }
  controls.append(button('Показать образец',show,true));
  if(!example){
    controls.append(button('Подсказка',()=>{
      if(isMusic) itemButtons[spec.pattern[progress]]?.classList.add('write-hint');
      else {
        const next=indices.find(index=>!solved.has(index));
        itemButtons[next]?.classList.add('write-hint');
        slotButtons[spec.object==='pom'?0:next]?.classList.add('write-hint');
      }
    }));
    if(isMusic)itemButtons[spec.pattern[0]].classList.add('write-hint');
  }
  view.append(row,bins,status,controls);
  return {view,destroy:()=>clearTimeout(timer)};
}
