import {el,button} from '../writing/ui.js';
import {downloadImage,toBlob,printDrawing} from '../writing/gallery.js';
import {programUrl} from '../course-model.js';
import {style,link,hero,graphic} from './ui.js';
import {picture} from './art.js';

const title='Волшебная страна слов';
const certificate='Маленький волшебник слов Академии Луми';
const lumi=new URL('../../images/lumi-transparent.png',import.meta.url);
const storageKey='lumi.academy.speech34.lanterns.v1';
function book(open){
 const paper=open?'<path d="M15 37q62-25 105 15 44-40 105-15v84q-67-9-105 19-44-28-105-19Z" fill="#fff5cf"/><path d="M120 52v83m-82-62q32-9 65 8m33 0q33-18 69-10m-165 25q33-8 63 4m33 0q35-15 69-12" stroke="#c5a775" stroke-width="4" fill="none"/>':
  '<path d="M39 34h139q22 0 22 24v70H40q-20 0-20-22V59q0-25 19-25z" fill="#8073b8"/><path d="M31 42h146q15 0 15 17v56H40q-16 0-16-13V55q0-13 7-13z" fill="none" stroke="#dfbd75" stroke-width="4"/><path d="m108 56 8 16 17 3-13 11 3 18-15-8-15 8 2-18-12-11 17-3Z" fill="#e5c076"/><path d="M41 124h147v9H41q-15 0-15-15" stroke="#785e8a" stroke-width="6" fill="#fff1c6"/>';
 const box=el('div','speech-final-book');
 box.innerHTML='<svg viewBox="0 12 240 139" aria-hidden="true">'+paper+'</svg>';
 if(open)box.classList.add('speech-book-open');
 return box;
}
function diploma(course,stars){
 const area=el('section','academy-diploma speech-diploma ym-hide-content');
 const input=el('input','ym-disable-keys');input.maxLength=50;input.autocomplete='off';input.spellcheck=false;
 const label=el('label','','Имя на грамоте по желанию');label.append(input);
 const canvas=el('canvas');canvas.width=1440;canvas.height=1018;canvas.setAttribute('aria-label',certificate);
 const ctx=canvas.getContext('2d'),mascot=graphic(lumi),medal=graphic(course.modules.at(-1).speechMedal);
 const status=el('p','speech-status');status.setAttribute('role','status');
 function paint(){
  if(!ctx)return;
  const wash=ctx.createLinearGradient(0,0,1440,1018);
  wash.addColorStop(0,'#e7d9f1');wash.addColorStop(.48,'#fff5d8');wash.addColorStop(1,'#dbe8f3');
  ctx.fillStyle=wash;ctx.fillRect(0,0,1440,1018);
  ctx.strokeStyle='#af8b50';ctx.lineWidth=5;ctx.strokeRect(34,34,1372,950);
  ctx.lineWidth=2;ctx.strokeRect(48,48,1344,922);
  ctx.fillStyle='#344f65';ctx.textAlign='center';
  const text=(string,x,y,font,w)=>{ctx.font=font;ctx.fillText(string,x,y,w);};
  text('Игровая грамота',720,158,'bold 45px Georgia',1260);
  text(certificate,720,264,'bold 60px Georgia',1270);
  text(course.nameForCourse,720,347,'36px Georgia',1160);
  if(mascot.naturalWidth){
   const scale=Math.min(390/mascot.naturalWidth,370/mascot.naturalHeight);
   const w=mascot.naturalWidth*scale,h=mascot.naturalHeight*scale;
   ctx.drawImage(mascot,325-w/2,635-h/2,w,h);
  }
  if(medal.naturalWidth)ctx.drawImage(medal,903,660,125,125);
  text(input.value.trim().replace(/\s+/g,' ')||'Юный волшебник слов',970,518,'bold 48px Georgia',690);
  text(stars+' звёзд · 10 медалей · 10 фонариков',970,604,'33px sans-serif',700);
  text('Памятная награда за прохождение игры',720,922,'29px sans-serif',1160);
 }
 input.addEventListener('input',paint);
 for(const art of [mascot,medal])art.addEventListener('load',paint);
 async function save(print){
  try{
   if(!mascot.naturalWidth||!medal.naturalWidth){status.textContent='Дождитесь загрузки иллюстраций.';return;}
   paint();
   const blob=await toBlob(canvas);
   if(print)await printDrawing(blob);else downloadImage(blob,'lumi-word-wizard.png');
   status.textContent='';
  }catch{status.textContent='Грамота пока не сохранилась. Можно попробовать ещё раз.';}
 }
 const controls=el('div','lesson-actions');
 controls.append(button('Сохранить PNG',()=>save(false)),button('Распечатать',()=>save(true)));
 area.append(el('h2','','Игровая грамота'),label,canvas,controls,status);paint();
 return area;
}
export function mountSpeechFinale(root,course,complete,stars){
 style();
 root.classList.add('speech-lesson','speech-finale');
 document.body.classList.add('speech-finale-page');
 document.title=title+' · Академия Луми';
 const back=link('К урокам курса',programUrl(course));
 if(!complete){
  root.replaceChildren(el('h1','',title),el('p','', 'Пройдено '+stars+' из 60 уроков. Собери все фонарики.'),back);
  return;
 }
 let lit=0;
 try{lit=Math.max(0,Math.min(10,Number(localStorage.getItem(storageKey))||0));}catch{}
 const area=el('div','speech-starlight'),lamps=el('div','speech-final-lights');
 const explanation=el('p','speech-model','Зажги фонарики по очереди, чтобы открыть книгу.');
 const status=el('p','speech-status');status.setAttribute('role','status');
 const award=el('section');
 const navigation=el('div','lesson-actions');
 navigation.append(back,link('В речевую мастерскую','speech-workshop.html'),link('В Академию','age-3-4.html'));
 function show(){
  const complete=lit===course.modules.length;
  area.replaceChildren(book(complete));
  lamps.replaceChildren();
  for(const [i,module] of course.modules.entries()){
   const light=button('',()=>{
    if(i!==lit)return;
    lit++;
    try{localStorage.setItem(storageKey,String(lit));}catch{}
    status.textContent=lit+' из 10 фонариков горят.';
    show();
    lamps.querySelector('[data-lantern="'+lit+'"]')?.focus({preventScroll:true});
   });
   light.className='speech-final-light';light.dataset.lantern=i;
   light.setAttribute('aria-label',module.speechLanternName);
   light.setAttribute('aria-pressed',String(i<lit));light.disabled=i!==lit;
   if(i<lit)light.classList.add('speech-lit');
   light.append(graphic(module.speechLantern));lamps.append(light);
  }
  explanation.hidden=complete;
  if(!complete||award.childElementCount)return;
  const friends=el('div','speech-final-friends');
  friends.append(...['lumi','bunny','kolobok','turnip','flower','train'].map(id=>id==='lumi'?graphic(lumi,'Луми'):picture(id)));
  const starsRow=el('div','speech-final-stars');
  starsRow.setAttribute('aria-label',stars+' золотых звёзд');
  for(let i=0;i<stars;i++){const star=el('span','','★');star.setAttribute('aria-hidden','true');starsRow.append(star);}
  const medals=el('div','speech-final-medals');
  medals.append(...course.modules.map(module=>graphic(module.speechMedal,module.reward)));
  award.append(el('h2','','Книга открылась!'),friends,el('p','speech-model','Луми поздравляет тебя!'),
   starsRow,medals,diploma(course,stars));
 }
 root.replaceChildren(hero(10),el('h1','',title),area,explanation,lamps,status,award,navigation);show();
}
