import {el,button} from '../writing/ui.js';
import {toBlob,downloadImage,printDrawing} from '../writing/gallery.js';
import {styles,graphic,link,hero} from './ui.js';
import {programUrl} from '../course-model.js';

const diplomaTitle='Маленький исследователь Академии Луми';
const crownTitle='Королевство маленьких открытий';
const lockArt='<svg viewBox="0 0 96 96" aria-hidden="true"><path d="M26 51V34a22 22 0 0 1 44 0v17" fill="none" stroke="currentColor" stroke-width="9"/><rect x="17" y="45" width="62" height="43" rx="9" fill="currentColor"/><circle cx="48" cy="61" r="6" fill="#fff8d8"/><rect x="45" y="63" width="6" height="12" rx="2" fill="#fff8d8"/></svg>';
function chest(open=false){
 const svg=el('div','logic-chest-art');
 const lid=open?'M27 94 41 26q40-24 168-8l20 59-53 22z':'M27 89V67q8-35 52-36h94q45 2 55 36v22z';
 svg.innerHTML='<svg viewBox="0 0 256 176" aria-hidden="true"><path d="M27 80h202l-11 73H38z" fill="#a77249" stroke="#6c514a" stroke-width="6"/><path d="'+lid+'" fill="#ce9e64" stroke="#6c514a" stroke-width="6"/><path d="M38 115h180m-169 26h158M68 83v67m120-67v67" stroke="#e7bd72" stroke-width="8" stroke-linecap="round"/><rect x="108" y="87" width="40" height="31" rx="8" fill="#edd28d"/><circle cx="128" cy="101" r="5" fill="#765349"/></svg>';
 return svg;
}
function diploma(course,stars){
 const unit=el('section','academy-diploma logic-diploma ym-hide-content');
 const who=el('input','ym-disable-keys');
 who.maxLength=50;who.autocomplete='off';who.spellcheck=false;
 const label=el('label','','Имя на грамоте по желанию');
 label.append(who);
 const canvas=el('canvas');canvas.width=1440;canvas.height=1018;canvas.setAttribute('aria-label',diplomaTitle);
 const ctx=canvas.getContext('2d'),m=graphic(new URL('../../images/lumi-transparent.png',import.meta.url));
 const gilded=graphic(course.modules.at(-1).logicMedal);
 const status=el('p');status.setAttribute('role','status');
 function paint(){
  if(!ctx)return;
  const wash=ctx.createLinearGradient(0,0,1440,1018);
  wash.addColorStop(0,'#f4e6c9');wash.addColorStop(.5,'#fff9e7');wash.addColorStop(1,'#e4edf1');
  ctx.fillStyle=wash;ctx.fillRect(0,0,1440,1018);
  ctx.strokeStyle='#ac8650';ctx.lineWidth=6;ctx.strokeRect(38,38,1364,942);
  ctx.lineWidth=2;ctx.strokeRect(54,54,1332,910);
  ctx.textAlign='center';ctx.fillStyle='#2d4c59';
  const text=(line,x,y,font,width)=>{ctx.font=font;ctx.fillText(line,x,y,width);};
  text('Игровая грамота',720,160,'bold 46px Georgia',1250);
  text(diplomaTitle,720,267,'bold 66px Georgia',1260);
  text(course.nameForCourse,720,366,'36px Georgia',1120);
  if(m.naturalWidth){
   const scale=Math.min(395/m.naturalWidth,382/m.naturalHeight),w=m.naturalWidth*scale,h=m.naturalHeight*scale;
   ctx.drawImage(m,310-w/2,644-h/2,w,h);
  }
  if(gilded.naturalWidth)ctx.drawImage(gilded,887,678,118,118);
  text(who.value.trim().replace(/\s+/g,' ')||'Юный исследователь',940,522,'bold 47px Georgia',710);
  text(stars+' звезды · '+course.modules.length+' медалей и ключей',940,606,'33px sans-serif',720);
  text('Памятная игровая награда · 3–4 года',720,915,'30px sans-serif',1140);
 }
 who.addEventListener('input',paint);m.addEventListener('load',paint);gilded.addEventListener('load',paint);
 async function save(print){
  try{
   if(!m.naturalWidth||!gilded.naturalWidth){status.textContent='Дождись загрузки иллюстраций.';return;}
   paint();
   const png=await toBlob(canvas);
   if(print)await printDrawing(png);else downloadImage(png,'lumi-young-explorer.png');
  }catch{status.textContent='Не удалось подготовить грамоту. Можно попробовать ещё раз.';}
 }
 const controls=el('div','lesson-actions');
 controls.append(button('Сохранить PNG',()=>save(false)),button('Распечатать',()=>save(true)));
 unit.append(el('h2','','Игровая грамота'),label,canvas,controls,status);paint();
 return unit;
}
export function mountLogicFinale(host,course,complete,stars){
 styles();
 host.classList.add('logic-finale');document.body.classList.add('logic-finale-page');
 const route=link('К урокам',programUrl(course));
 document.title=crownTitle+' · Академия Луми';
 if(!complete){
  host.replaceChildren(el('h1','',crownTitle),el('p','', 'Пройдено '+stars+' из 42 уроков. Собери семь ключей, чтобы открыть сундук.'),route);
  return;
 }
 const rings=el('div','logic-final-locks'),keys=el('div','logic-final-keys'),status=el('p','logic-feedback');
 status.setAttribute('role','status');
 const success=el('section','logic-final-result');
 const box=el('div','logic-final-chest');
 let selected=null;
 const keyStore='lumi.academy.logic.opened.v1';
 const opened=new Set();
 try{for(const id of JSON.parse(localStorage.getItem(keyStore)??'[]'))if(Number.isInteger(id)&&id>=0&&id<course.modules.length)opened.add(id);}catch{}
 const action=el('p','logic-caption','Возьми ключ и нажми на замок с таким же знаком.');
 function render(){
  keys.replaceChildren();rings.replaceChildren();
  const ready=opened.size===course.modules.length;
  box.replaceChildren(chest(ready));box.classList.toggle('logic-open',ready);
  if(ready){
   success.hidden=false;keys.hidden=true;rings.hidden=true;action.hidden=true;
   if(success.childElementCount)return;
   const awards=el('div','logic-rewards logic-final-rewards');
   const starSet=el('div','logic-final-stars');
   starSet.setAttribute('aria-label',stars+' золотые звезды');
   for(let i=0;i<stars;i++){const star=el('span','','★');star.setAttribute('aria-hidden','true');starSet.append(star);}
   for(const module of course.modules)awards.append(graphic(module.logicMedal,module.reward));
   success.append(el('h2','','Сундук открыт!'),el('p','','Луми поздравляет тебя. Ты собрал все звёзды и медали.'),starSet,awards,diploma(course,stars));
   return;
  }
  success.hidden=true;
  for(const [i,module] of course.modules.entries()){
   const lock=button('',()=>{
    if(selected===null){status.textContent='Сначала возьми ключ.';return;}
    if(selected!==i){status.textContent='Сравни знаки на ключе и замке.';return;}
    opened.add(i);selected=null;
    try{localStorage.setItem(keyStore,JSON.stringify([...opened]));}catch{}
    status.textContent='Замок открыт!';render();
   });
   lock.className='logic-lock';lock.dataset.lock=i;
   lock.style.color=['#51987e','#33978f','#8a6aab','#b46753','#687eb7','#5186b1','#b17d34'][i];
   lock.innerHTML=lockArt;
   lock.append(graphic(module.logicMedal));
   lock.setAttribute('aria-label',opened.has(i)?'Открытый замок '+(i+1):'Замок · '+module.logicKey);
   lock.disabled=opened.has(i);rings.append(lock);
   if(opened.has(i))continue;
   const key=button('',()=>{selected=i;status.textContent=module.logicKey+' выбран.';render();keys.querySelector('[data-key="'+i+'"]')?.focus({preventScroll:true});});
   key.className='logic-tile';key.dataset.key=i;
   key.setAttribute('aria-label',module.logicKey);key.setAttribute('aria-pressed',String(selected===i));
   if(selected===i)key.classList.add('logic-chosen');
   key.append(graphic(module.logicKeyArt));keys.append(key);
  }
 }
 const nav=el('div','lesson-actions');
 nav.append(route,link('В мастерскую головоломок','logic-workshop.html'),link('В Академию','age-3-4.html'));
 host.replaceChildren(hero(8),el('h1','',crownTitle),box,action,rings,keys,status,success,nav);
 render();
}
