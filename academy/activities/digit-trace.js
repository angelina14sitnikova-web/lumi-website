const paths = {
  0:'M50 19C26 19 24 36 24 50S25 81 50 81 76 65 76 50 75 19 50 19Z',
  1:'M34 34 54 19V81',
  2:'M26 33C29 13 73 11 74 34 75 48 42 61 26 81H75',
  3:'M28 23H72L51 48C82 46 84 81 50 81 38 81 30 77 24 70',
  4:'M62 19 24 60H80M62 19V81',
  5:'M75 19H31L27 50C36 42 72 43 74 64 75 85 38 88 24 72',
  6:'M72 24C42 7 24 34 26 59 28 86 72 89 75 60 77 38 43 38 27 55',
  7:'M25 19H77L45 81',
  8:'M50 19C24 19 24 43 50 50 81 59 84 81 50 81 16 81 19 59 50 50 76 43 76 19 50 19Z',
  9:'M73 48C56 61 22 56 26 33 29 10 74 12 75 43 77 68 60 88 31 79',
};
export const numeralPath = digit => paths[digit];

export function makeTrace(digit, onFinish, onMistake, demonstration = false) {
  const ns='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(ns,'svg');
  svg.setAttribute('viewBox','0 0 100 100');
  svg.classList.add('math56-trace');
  svg.setAttribute('aria-label','Контур цифры '+digit);
  const shape=document.createElementNS(ns,'path');
  shape.setAttribute('d',numeralPath(digit));
  shape.setAttribute('fill','none');
  shape.setAttribute('stroke','#d9c3ec');
  shape.setAttribute('stroke-width','11');
  shape.setAttribute('stroke-linecap','round');
  shape.setAttribute('stroke-linejoin','round');
  svg.append(shape);
  const active=shape.cloneNode();
  active.setAttribute('stroke','#7a4fb0');
  active.setAttribute('stroke-width','4');
  const length=shape.getTotalLength();
  active.setAttribute('stroke-dasharray',length);
  active.setAttribute('stroke-dashoffset',demonstration?'0':length);
  svg.append(active);
  if (demonstration) {
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      active.animate([{strokeDashoffset:length},{strokeDashoffset:0}],{duration:2300,fill:'both'});
    }
    return svg;
  }
  const markerPositions=Array.from({length:9},(_,i)=>shape.getPointAtLength(i*length/8));
  let completed=0;
  let drawing=false;
  const markers=markerPositions.map((point,index)=>{
    const circle=document.createElementNS(ns,'circle');
    circle.setAttribute('cx',point.x);
    circle.setAttribute('cy',point.y);
    circle.setAttribute('r',4.7);
    circle.setAttribute('fill','#fff9dd');
    circle.setAttribute('stroke','#8862aa');
    circle.dataset.tracePoint=String(index);
    circle.addEventListener('click',()=>{
      if (index===completed) advance();
      else if (index>completed) onMistake();
    });
    svg.append(circle);
    return circle;
  });
  markers[0].classList.add('trace-next');
  svg.append(markers[0]);
  function advance() {
    if(completed>=markers.length)return;
    markers[completed].classList.replace('trace-next','trace-done');
    completed+=1;
    active.setAttribute('stroke-dashoffset',Math.max(0,length*(1-(completed-1)/8)));
    if(completed===markers.length)onFinish();
    else { markers[completed].classList.add('trace-next'); svg.append(markers[completed]); }
  }
  function track(event) {
    const matrix=svg.getScreenCTM();
    const expected=markerPositions[completed];
    if (!matrix || !expected) return;
    const point=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());
    if(Math.hypot(point.x-expected.x,point.y-expected.y)<=11) advance();
  }
  svg.addEventListener('pointerdown',event=>{drawing=true;});
  svg.addEventListener('pointermove',event=>{if(drawing)track(event);});
  for(const name of ['pointerup','pointercancel','pointerleave'])svg.addEventListener(name,()=>{drawing=false;});
  return svg;
}
