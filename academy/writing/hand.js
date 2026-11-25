import {button,el,reduced,svg} from './ui.js';

const names=['Большой','Указательный','Средний','Безымянный','Мизинец'];
// View the palm of a right hand with thumb, finger bases and knuckles in
// their actual order. These are human hand illustrations, separate from Lumi.
const open=[
  [[111,179],[81,160],[57,132]],
  [[124,131],[114,89],[108,58]],
  [[148,123],[150,71],[150,37]],
  [[172,127],[182,82],[185,52]],
  [[196,139],[210,105],[215,81]],
];
const curled=[
  [[108,174],[124,143],[153,151]],
  [[124,132],[120,106],[126,142]],
  [[148,123],[148,99],[150,135]],
  [[172,127],[175,107],[172,140]],
  [[194,140],[196,122],[190,149]],
];
const CONTACT=[[0,0],[105,115],[134,104],[157,112],[179,128]];
const skin='#e9b28f',rim='#946554',light='#ffcfac',amber='#f7cb69';
const path=([a,b,c])=>`M ${a} Q ${b.join(' ')} ${c.join(' ')}`;
function targets(move,index=-1){
  const pose=open.map(finger=>finger.map(p=>[...p]));
  if(move==='fist') return curled;
  if(move==='point') {
    for(const i of [0,2,3,4]) pose[i]=curled[i];
  }
  if(move==='wiggle') pose[1]=[[124,131],[132,91],[127,67]];
  if(move==='greet' && index>0){
    const tip=CONTACT[index];
    pose[index]=[open[index][0],[(open[index][0][0]+tip[0])/2+8,tip[1]-25],tip];
    pose[0]=[open[0][0],[83,tip[1]+12],tip];
  }
  if(move==='pinch') return targets('greet',1);
  return pose;
}

export function illustration({pick,accent}={}) {
  const sheet=svg('svg',{viewBox:'0 0 300 260',role:pick?'group':'img','aria-label':'Иллюстрированная человеческая ладонь'});
  let pose=structuredClone(open), frame, active=-1;
  const palm=svg('path',{d:'M112 223C109 203 89 189 95 166C99 145 107 137 116 124C137 104 177 111 193 128C210 146 213 165 204 185L188 220L185 243H118Z',fill:skin,stroke:rim,'stroke-width':3});
  const paths=open.map((_,i)=>{
    const under=svg('path',{fill:'none',stroke:rim,'stroke-width':i===0?23:i===4?19:23,'stroke-linecap':'round'});
    const over=svg('path',{fill:'none',stroke:light,'stroke-width':i===0?18:i===4?14:18,'stroke-linecap':'round'});
    const glow=svg('circle',{r:17,fill:amber,opacity:'0'});
    if(pick){
       glow.setAttribute('tabindex','0');glow.setAttribute('role','button');
       glow.setAttribute('aria-label',names[i]+' палец');glow.dataset.finger=i;
       glow.addEventListener('click',()=>pick(i));
       glow.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(i);}});
    } else glow.setAttribute('pointer-events','none');
    return {under,over,glow};
  });
  sheet.append(...paths.slice(1).flatMap(p=>[p.under,p.over]),palm,paths[0].under,paths[0].over);
  sheet.append(svg('path',{d:'M137 189Q151 165 179 168 M121 156Q129 172 124 189',stroke:'#bb866e','stroke-width':2,fill:'none','stroke-linecap':'round'}));
  sheet.append(...paths.map(p=>p.glow));
  const ornament=svg('g',{class:'write-hand-accent',opacity:0,'pointer-events':'none'});
  if(accent){
    for(let i=0;i<8;i++){
      const ray=svg('ellipse',{cx:246,cy:171,rx:5,ry:14,fill:accent==='sun'?'#edb745':'#e5a2b7',transform:`rotate(${i*45} 246 194)`});
      ornament.append(ray);
    }
    ornament.append(svg('circle',{cx:246,cy:194,r:18,fill:'#efc561'}));
    sheet.append(ornament);
  }
  function apply(){
    paths.forEach((item,i)=>{
      item.under.setAttribute('d',path(pose[i]));item.over.setAttribute('d',path(pose[i]));
      const [x,y]=pose[i][2];
      item.glow.setAttribute('cx',x);item.glow.setAttribute('cy',y);
      item.glow.setAttribute('opacity',i===active?'.64':'0');
      item.over.setAttribute('stroke',i===active?amber:light);
    });
  }
  function highlight(index){active=index;apply();}
  function motion(move,index){
    cancelAnimationFrame(frame);
    const from=pose, to=targets(move,index);
    const duration=reduced()?0:850;
    const started=performance.now();
    ornament.setAttribute('opacity',accent?'1':'0');
    ornament.setAttribute('transform',move==='fist'?'translate(98.4 77.6) scale(.6)':'translate(0 0) scale(1)');
    function ease(now){
      const ratio=duration?Math.min(1,(now-started)/duration):1;
      const t=ratio*ratio*(3-2*ratio);
      pose=to.map((finger,i)=>finger.map((point,j)=>point.map((v,k)=>from[i][j][k]+(v-from[i][j][k])*t)));
      apply();
      if(ratio<1) frame=requestAnimationFrame(ease);
    }
    ease(started);
  }
  apply();
  return {sheet,motion,highlight,destroy:()=>cancelAnimationFrame(frame)};
}

const symbols={
  open:'Ладошка',fist:'Кулачок',point:'Указательный палец',wiggle:'Указательный палец',
  greet1:'Большой и указательный',greet2:'Большой и средний',
  greet3:'Большой и безымянный',greet4:'Большой и мизинец',pinch:'Мягкий захват',
};
export function handBoard(spec,{finish,example=false}={}){
  const view=el('section','write-hand-board');
  const status=el('p','write-status');
  status.setAttribute('role','status');
  const caption=el('p','write-motion-title');
  let step=0,index=0,timer,paused=false;
  const sequence=spec.moves;
  const selected=spec.fingers;
  let hand;
  function play(move) {
    const contact=move.match(/^greet([1-4])$/);
    hand.motion(contact?'greet':move,contact?Number(contact[1]):-1);
    caption.textContent=symbols[move]??'';
  }
  function next(){
    clearTimeout(timer);
    if(selected){
      hand.motion('open');
      hand.highlight(selected[index%selected.length]);
      caption.textContent=names[selected[index%selected.length]]+' пальчик';
    }else play(sequence[index%sequence.length]);
    index++;
    if(!paused&&!reduced()&&index%((selected??sequence).length)!==0) timer=setTimeout(next,1450);
  }
  function start(){
    clearTimeout(timer);index=0;paused=false;
    if(spec.book)view.classList.add('is-unfolded');
    next();
  }
  function activate(pick){
    if(!selected||!finish||example||step>=selected.length) return;
    if(pick!==selected[step]){
      status.textContent='Попробуй пальчик, который подсвечен.';
      hand.highlight(selected[step]);
      return;
    }
    clearTimeout(timer);
    if(spec.greeting) hand.motion('greet',pick);
    status.textContent='Пальчик проснулся!';
    step++;
    hand.highlight(step<selected.length?selected[step]:-1);
    if(step===selected.length) finish();
  }
  hand=illustration({pick:!example&&selected?activate:null,accent:spec.accent});
  if(spec.book){
    const book=svg('svg',{viewBox:'0 0 300 260',class:'write-book','aria-hidden':'true'});
    book.append(svg('path',{d:'M72 100Q112 75 150 100Q188 75 228 100V211Q190 188 150 213Q110 188 72 211Z',fill:'#e5cca0',stroke:'#aa7550','stroke-width':4}),
      svg('path',{d:'M80 99Q117 77 150 104Q182 77 220 99V199Q181 180 150 207Q117 180 80 198Z',fill:'#ffefc7'}),
      svg('path',{d:'M150 104V205',stroke:'#c59462','stroke-width':3}));
    const stage=el('div','write-book-stage');stage.append(book,hand.sheet);
    view.append(stage);
  }else view.append(hand.sheet);
  view.append(caption,status);
  const controls=el('div','write-controls');
  controls.append(button('Показать движение',start,true),button('Пауза показа',()=>{paused=true;clearTimeout(timer);}),button('Следующий кадр',()=>{paused=true;next();}));
  if(!example&&selected){
    hand.highlight(selected[0]);
    controls.append(button('Подсказка',()=>{hand.motion('open');hand.highlight(selected[Math.min(step,selected.length-1)]);}));
  }
  if(!example&&!selected&&!spec.actions){
    controls.append(button('Готово',finish,true),button('Пропустить движение',finish));
  }
  if(!example&&spec.actions){
    const options=el('div','write-controls write-gesture');
    for(const value of spec.actions){
      const choice=button(symbols[value],()=>{
        play(value);
        if(value!==sequence[step]){
          status.textContent='Посмотри движение ещё раз.';
          step=0;
          return;
        }
        step++;
        if(step===sequence.length) finish();
      });
      choice.dataset.action=value;
      const mini=illustration();
      const match=value.match(/^greet([1-4])$/);
      mini.motion(match?'greet':value,match?Number(match[1]):-1);
      choice.prepend(mini.sheet);
      options.append(choice);
    }
    view.append(options);
  }
  view.append(controls);
  return {view,destroy(){clearTimeout(timer);hand.destroy();}};
}
