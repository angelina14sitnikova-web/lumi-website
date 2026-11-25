const ns = 'http://www.w3.org/2000/svg';
function svg(name, attrs) {
  const element = document.createElementNS(ns, name);
  Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

export function clockFace(hour, minute = 0, missing = []) {
  const face = svg('svg', {viewBox:'0 0 200 200', class:'math67-clock', role:'img',
    'aria-label': hour == null ? 'Циферблат без стрелок' : `Часы показывают ${hour}:${String(minute).padStart(2,'0')}`});
  face.append(svg('circle',{cx:100,cy:100,r:96,fill:'#f5f9ff',stroke:'#5267a8','stroke-width':4}));
  for (let n=1; n<=12; n++) {
    const angle = Math.PI*n/6;
    const label = svg('text',{x:100+76*Math.sin(angle),y:100-76*Math.cos(angle),
      'text-anchor':'middle','dominant-baseline':'central',fill:'#20335e','font-size':17});
    label.textContent = missing.includes(n) ? '□' : String(n);
    face.append(label);
  }
  if (hour == null) return face;
  const hourHand = svg('line',{x1:100,y1:100,x2:100,y2:58,stroke:'#5364a5','stroke-width':8,'stroke-linecap':'round',transform:`rotate(${30*hour+minute/2} 100 100)`});
  const minuteHand = svg('line',{x1:100,y1:100,x2:100,y2:37,stroke:'#167967','stroke-width':4,'stroke-linecap':'round',transform:`rotate(${6*minute} 100 100)`});
  face.append(hourHand,minuteHand,svg('circle',{cx:100,cy:100,r:5,fill:'#20335e'}));
  return face;
}

export function clockDemo(spec, animate) {
  const face = clockFace(spec.hour,spec.minute,spec.missing);
  if (spec.advance) {
    const [hour,minute] = face.querySelectorAll('line');
    const beginning = (spec.hour%12)*30;
    animate(hour,[{transform:`rotate(${beginning}deg)`},{transform:`rotate(${beginning+30}deg)`}],{duration:1800,fill:'forwards'});
    animate(minute,[{transform:'rotate(0deg)'},{transform:'rotate(360deg)'}],{duration:1800,fill:'forwards'});
  }
  return face;
}

export function clockPractice({hour, start=12}, feedback, complete) {
  const field = document.createElement('div');
  field.className = 'math67-clock-play';
  const face = clockFace(start);
  const controls = document.createElement('div');
  controls.className = 'sensory-row';
  const button = label => {
    const control = document.createElement('button');
    control.type = 'button';
    control.className = 'academy-button';
    control.textContent = label;
    controls.append(control);
    return control;
  };
  let current = start;
  const next = button('Перевести на час вперёд');
  const back = button('Перевести на час назад');
  const check = button('Проверить часы');
  const setHour = direction => {
    current = (current + direction + 11) % 12 + 1;
    const updated = clockFace(current);
    field.firstElementChild.replaceWith(updated);
  };
  next.onclick=()=>setHour(1);
  back.onclick=()=>setHour(-1);
  check.onclick=()=>{
    if (current !== hour) {
      feedback.dataset.state='retry';
      feedback.textContent='Посмотри, на какое число указывает короткая стрелка.';
      return;
    }
    [next,back,check].forEach(control=>control.disabled=true);
    complete();
  };
  field.append(face,controls);
  return field;
}

export function clockLayout(feedback, complete) {
  const field = document.createElement('div');
  field.className = 'math67-clock-play';
  const dial = document.createElement('div');
  dial.className = 'math67-clock-layout';
  dial.setAttribute('aria-label','Места для чисел на циферблате');
  const cards = document.createElement('div');
  cards.className = 'sensory-row';
  let current;
  let placed = 0;
  const button = (text,parent) => {
    const control = document.createElement('button');
    control.type = 'button';
    control.textContent = text;
    parent.append(control);
    return control;
  };
  const order = [6,3,9,1,11,5,7,12,4,10,2,8];
  const sources = new Map(order.map(number=>{
    const tile = button(String(number),cards);
    tile.dataset.clockNumber = number;
    tile.setAttribute('aria-pressed','false');
    tile.onclick=()=>{
      sources.get(current)?.setAttribute('aria-pressed','false');
      current = number;
      tile.setAttribute('aria-pressed','true');
    };
    return [number,tile];
  }));
  for (let number=1;number<=12;number++) {
    const angle = number*Math.PI/6;
    const slot = button('·',dial);
    slot.dataset.clockSlot=number;
    slot.setAttribute('aria-label',number===12 ? 'Верхнее место' : `Место ${number} после верхнего по ходу стрелок`);
    slot.style.left=`${50+37*Math.sin(angle)}%`;
    slot.style.top=`${50-37*Math.cos(angle)}%`;
    slot.onclick=()=>{
      if (current !== number) {
        feedback.dataset.state='retry';
        feedback.textContent=current ? 'Найди место числа на круге.' : 'Сперва выбери числовую карточку.';
        return;
      }
      slot.textContent = String(number);
      slot.disabled = true;
      sources.get(number).disabled = true;
      sources.get(number).setAttribute('aria-pressed','false');
      current = undefined;
      if (++placed===12) complete();
    };
  }
  field.append(dial,cards);
  return field;
}
