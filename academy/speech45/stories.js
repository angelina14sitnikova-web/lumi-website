import {el,button} from '../writing/ui.js';
import {toBlob,downloadImage,printDrawing} from '../writing/gallery.js';
import {picture} from '../speech/art.js';

const database='lumi.academy.speech45.stories';
const storeName='stories';
const chapters=['Начало','Событие','Завершение'];
const characters=[['lumi','Луми'],['bunny','Зайчик'],['girl','Девочка'],['fox','Лиса']];
const places=[['house','Дом'],['park','Парк'],['stage','Театр'],['flower-shop','Цветочная мастерская']];
const events=[['book','Книга'],['rain','Дождь'],['palace-ball:red','Мяч'],['island-sprout','Росток']];
const labels=new Map([...characters,...places,...events]);
const mascot=new URL('../../images/lumi-transparent.png',import.meta.url);
function connect(){
 return new Promise((resolve,reject)=>{
  if(!globalThis.indexedDB){reject(new Error('IndexedDB unavailable'));return;}
  const request=indexedDB.open(database,1);
  request.onupgradeneeded=()=>request.result.createObjectStore(storeName,{keyPath:'id'});
  request.onsuccess=()=>resolve(request.result);
  request.onerror=()=>reject(request.error);
  request.onblocked=()=>reject(new Error('IndexedDB unavailable'));
 });
}
async function transact(mode,operation){
 const db=await connect();
 try{
  return await new Promise((resolve,reject)=>{
   const tx=db.transaction(storeName,mode),request=operation(tx.objectStore(storeName));
   tx.oncomplete=()=>resolve(request.result);
   tx.onabort=()=>reject(tx.error??request.error);
   tx.onerror=()=>reject(tx.error??request.error);
  });
 }finally{db.close();}
}
const save=story=>transact('readwrite',store=>store.put(story));
const all=()=>transact('readonly',store=>store.getAll());
const remove=id=>transact('readwrite',store=>store.delete(id));
const now=()=>Date.now();
const newStory=()=>({id:crypto.randomUUID(),title:'',updated:now(),
 pages:chapters.map(()=>({hero:'lumi',place:'park',event:'book',text:''}))});
function art(id){
 if(id==='lumi'){
  const img=el('img');img.src=mascot.href;img.alt='Луми';return img;
 }
 const image=picture(id);image.setAttribute('aria-label',labels.get(id)??id);return image;
}
function row(page){
 const view=el('div','speech-row story-figures');
 view.append(art(page.hero),art(page.place),art(page.event));return view;
}
function field(name,control){
 const label=el('label','',name);control.setAttribute('aria-label',name);label.append(control);return label;
}
function select(name,list,value,onchange){
 const control=el('select');
 for(const [id,label] of list){
  const option=el('option','',label);option.value=id;control.append(option);
 }
 control.value=value;control.addEventListener('change',()=>onchange(control.value));
 return field(name,control);
}
function pictureFile(id){
 if(id==='lumi')return mascot.href;
 const svg=picture(id);
 svg.setAttribute('width','180');svg.setAttribute('height','180');
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(svg));
}
function loadPicture(id){
 return new Promise((resolve,reject)=>{
  const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=pictureFile(id);
 });
}
function lines(ctx,text,max){
 const rows=[];
 for(const paragraph of text.split(/\n/)){
  let line='';
  for(const word of paragraph.split(/\s+/).filter(Boolean)){
   const candidate=line?line+' '+word:word;
   if(ctx.measureText(candidate).width>max&&line){rows.push(line);line=word;}else line=candidate;
  }
  rows.push(line);
 }
 return rows;
}
async function storyBlob(story){
 const canvas=el('canvas');canvas.width=1120;canvas.height=1692;
 const ctx=canvas.getContext('2d');
 ctx.fillStyle='#f9edd8';ctx.fillRect(0,0,canvas.width,canvas.height);
 ctx.textAlign='center';ctx.fillStyle='#544364';ctx.font='bold 51px Georgia';
 ctx.fillText(story.title,560,106,1000);
 const images=await Promise.all(story.pages.map(page=>Promise.all([page.hero,page.place,page.event].map(loadPicture))));
 story.pages.forEach((page,i)=>{
  const y=150+i*490;
  ctx.fillStyle=['#e8e0ee','#e4eddf','#e2eaf1'][i];ctx.fillRect(54,y,1012,444);
  ctx.fillStyle='#544364';ctx.font='bold 30px Georgia';ctx.fillText(chapters[i],560,y+46);
  images[i].forEach((image,j)=>{
   const scale=Math.min(130/image.width,130/image.height),w=image.width*scale,h=image.height*scale;
   ctx.drawImage(image,350+j*210-w/2,y+132-h/2,w,h);
  });
  ctx.font='25px sans-serif';ctx.textAlign='left';
  for(const [j,line] of lines(ctx,page.text.replace(/\s+/g,' '),910).entries())ctx.fillText(line,104,y+228+j*25,910);
  ctx.textAlign='center';
 });
 ctx.fillStyle='#544364';ctx.font='23px sans-serif';ctx.fillText('Академия Луми',560,1650);
 return toBlob(canvas);
}
function exporter(story,status,print){
 return async()=>{
  try{
   const blob=await storyBlob(story);
   if(print)await printDrawing(blob);else downloadImage(blob,'lumi-story.png');
   status.textContent='';
  }catch{status.textContent='Не удалось подготовить историю. Попробуйте ещё раз.';}
 };
}
export function mountStories(root,{onSave,editorFirst=false}={}){
 let run=0;
 const details=el('div','story-library ym-hide-content');
 const status=el('p','speech-status');status.setAttribute('role','status');
 function base(title){
  run++;status.textContent='';
  details.replaceChildren(el('h2','',title),status);
 }
 function tools(story){
  const nav=el('div','lesson-actions');
  nav.append(button('Скачать PNG',exporter(story,status,false)),button('Распечатать',exporter(story,status,true)));
  return nav;
 }
 function editor(story){
  base('Конструктор историй');
  const title=el('input','ym-disable-keys');title.maxLength=80;title.autocomplete='off';title.value=story.title;
  details.append(field('Название истории',title));
  for(const [i,page] of story.pages.entries()){
   const section=el('fieldset','story-page');section.append(el('legend','',chapters[i]));
   const view=row(page);
   const options=el('div','story-options');
   for(const [name,key,list] of [['Герой','hero',characters],['Место','place',places],['Предмет или событие','event',events]]){
    options.append(select(name,list,page[key],value=>{page[key]=value;view.replaceChildren(art(page.hero),art(page.place),art(page.event));}));
   }
   const text=el('textarea','ym-disable-keys');text.rows=3;text.maxLength=260;text.value=page.text;
   text.addEventListener('input',()=>{page.text=text.value;});
   section.append(options,view,field('Расскажи, что происходит',text));details.append(section);
  }
  const toolbar=el('div','lesson-actions');
  const saveControl=button('Сохранить историю',async()=>{
   story.title=title.value.trim();
   if(!story.title||story.pages.some(page=>!page.text.trim())){
    status.textContent='Добавьте название и по одной фразе для каждой части.';return;
   }
   saveControl.disabled=true;
   try{
    story.updated=now();await save(story);open(story);onSave?.(story);
   }catch{status.textContent='Не удалось сохранить историю в этом браузере.';}
   finally{saveControl.disabled=false;}
  },true);
  toolbar.append(saveControl,button('Мои истории',library));details.append(toolbar);
 }
 function open(story){
  base(story.title);
  for(const [i,page] of story.pages.entries()){
   const section=el('section','story-page');section.append(el('h3','',chapters[i]),row(page),el('p','story-text',page.text));details.append(section);
  }
  const nav=tools(story);
  nav.append(button('Редактировать',()=>editor(structuredClone(story))),button('Мои истории',library));
  details.append(nav);
 }
 async function library(){
  base('Сказочная библиотека');
  const generation=run;
  details.append(el('p','speech-grown','Истории хранятся в этом браузере. При очистке его данных они могут исчезнуть.'),button('Новая история',()=>editor(newStory()),true));
  try{
   const data=(await all()).sort((a,b)=>b.updated-a.updated);
   if(run!==generation||!details.isConnected)return;
   if(!data.length)status.textContent='Здесь появятся твои истории.';
   for(const story of data){
    const item=el('article','story-saved'),nav=el('div','lesson-actions');
    nav.append(button('Открыть',()=>open(story)),button('Сделать копию',async()=>{
     try{
      const copy={...structuredClone(story),id:crypto.randomUUID(),title:(story.title.slice(0,68)+' (копия)'),updated:now()};
      await save(copy);open(copy);
     }catch{status.textContent='Не удалось создать копию.';}
    }),button('Удалить',()=>{
     const question=el('div','lesson-actions');
     question.append(el('p','','Удалить эту историю из библиотеки?'),button('Да, удалить',async()=>{
      try{await remove(story.id);void library();}catch{status.textContent='Не удалось удалить историю.';}
     }),button('Отмена',()=>question.remove()));
     item.querySelector('[data-delete-question]')?.remove();question.dataset.deleteQuestion='';item.append(question);
    }));
    item.append(el('h3','',story.title),nav);details.append(item);
   }
  }catch{status.textContent='Хранилище историй недоступно в этом браузере.';}
 }
 root.append(details);
 if(editorFirst)editor(newStory());else void library();
}
