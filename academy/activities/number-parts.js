import { sensoryArt } from './sensory-art.js';

const crystal = color => sensoryArt({ shape:'crystal',color });
const element = (tag,css,text) => {
  const node = document.createElement(tag);
  if (css) node.className=css;
  if (text) node.textContent=text;
  return node;
};
const control = (text,callback) => {
  const node = element('button','lesson-secondary',text);
  node.type='button';
  node.addEventListener('click',callback);
  return node;
};
function showParts(total,left,grid) {
  const panel=element('div','math67-parts');
  panel.toggleAttribute('data-grid',grid);
  for (const [count,color,label] of [[left,'sky','Синяя часть'],[total-left,'pink','Розовая часть']]) {
    const row=element('div','math67-part');
    row.setAttribute('aria-label',label+' · '+count);
    for(let i=0;i<count;i++) row.append(crystal(color));
    panel.append(row);
  }
  return panel;
}
export function demonstrateParts(total,lefts,animate) {
  const display=element('div','math67-parts-scene');
  for (const [i,left] of lefts.entries()) {
    const row=showParts(total,left,total===10);
    display.append(row);
    animate(row,[{opacity:.2,transform:'translateY(12px)'},{opacity:1,transform:'none'}],{duration:360,delay:i*610});
  }
  return display;
}
export function practiceParts(rule,feedback,complete,alreadyDone) {
  const board=element('div','math67-split-task');
  const active=element('div','math67-parts-live');
  const found=element('ul','math67-parts-found');
  found.setAttribute('aria-label','Найденные способы');
  const counts=new Set();
  let left=0;
  let mistakes=0;
  const render=()=>active.replaceChildren(showParts(rule.total,left,rule.grid));
  const forward=control('← Перенести в синюю часть',()=>{left=Math.min(rule.total,left+1);render();});
  const back=control('Перенести в розовую часть →',()=>{left=Math.max(0,left-1);render();});
  forward.dataset.part='forward';
  back.dataset.part='back';
  const check=control('Проверить части',()=>{
    if (!rule.allowed.includes(left) || counts.has(left)) {
      mistakes++;
      feedback.dataset.state='retry';
      feedback.textContent=counts.has(left)?'Этот способ уже найден. Попробуй изменить части.':'Попробуй по-другому разделить кристаллы.';
      if(mistakes>=2) {
        const next=rule.allowed.find(n=>!counts.has(n));
        const hint=showParts(rule.total,next,rule.grid);
        hint.dataset.hint='true';
        active.append(hint);
      }
      return;
    }
    counts.add(left);
    mistakes=0;
    found.append(element('li',null,left+' и '+(rule.total-left)));
    render();
    if(counts.size===rule.distinct) {
      for(const key of [forward,back,check]) key.disabled=true;
      complete();
    } else {
      feedback.dataset.state='info';
      feedback.textContent='Получилось! Найди ещё один способ.';
    }
  });
  if(alreadyDone) {
    for(const key of [forward,back,check]) key.disabled=true;
  }
  board.append(active,forward,back,check,found);
  render();
  return board;
}
