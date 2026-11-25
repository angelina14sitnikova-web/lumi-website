import {el,button} from './ui.js';
const dbName='lumi.academy.writing34.gallery';
const storeName='drawings';

function connect(){
  return new Promise((resolve,reject)=>{
    if(!globalThis.indexedDB){reject(new Error('IndexedDB unavailable'));return;}
    const request=indexedDB.open(dbName,1);
    request.onupgradeneeded=()=>{
      const store=request.result.createObjectStore(storeName,{keyPath:'id'});
      store.createIndex('updated','updated');
    };
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error);
    request.onblocked=()=>reject(new Error('IndexedDB upgrade is blocked'));
  });
}
async function access(mode,operation){
  const db=await connect();
  try {
    return await new Promise((resolve,reject)=>{
      const tx=db.transaction(storeName,mode);
      const request=operation(tx.objectStore(storeName));
      tx.oncomplete=()=>resolve(request.result);
      tx.onabort=()=>reject(tx.error??request.error??new Error('Transaction aborted'));
      tx.onerror=()=>reject(tx.error??request.error);
    });
  } finally {db.close();}
}
export const pictures=async()=>(await access('readonly',store=>store.getAll())).sort((a,b)=>b.updated-a.updated);
export const readDrawing=id=>access('readonly',store=>store.get(id));
export async function saveDrawing({png,...drawing}){
  const id=drawing.id??globalThis.crypto.randomUUID();
  // Store the bytes so the database does not depend on Blob file handles.
  const record={...drawing,id,pngBytes:await png.arrayBuffer(),updated:Date.now()};
  await access('readwrite',store=>store.put(record));
  return record;
}
export const removeDrawing=id=>access('readwrite',store=>store.delete(id));

export const toBlob=canvas=>new Promise((resolve,reject)=>{
  canvas.toBlob(blob=>{if(blob)resolve(blob);else reject(new Error('PNG unavailable'));},'image/png');
});
export function downloadImage(blob,filename){
  const href=URL.createObjectURL(blob);
  const anchor=el('a');
  anchor.href=href;anchor.download=filename;
  document.body.append(anchor);
  anchor.click();anchor.remove();
  setTimeout(()=>URL.revokeObjectURL(href),30000);
}
function dataUrl(blob){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>resolve(reader.result);
    reader.onerror=()=>reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
export async function printDrawing(blob){
  const preview=el('div','write-print-preview ym-hide-content');
  const photo=el('img');
  photo.alt='Рисунок';
  preview.append(photo);
  function cleanup(){preview.remove();}
  const source=await dataUrl(blob);
  await new Promise((resolve,reject)=>{
    photo.onload=resolve;photo.onerror=reject;photo.src=source;
  });
  document.body.append(preview);
  window.addEventListener('afterprint',cleanup,{once:true});
  try{window.print();}catch(error){cleanup();throw error;}
}

export function makeGallery({open,exhibition=false}={}){
  const view=el('section','write-gallery ym-hide-content');
  const list=el('div','write-gallery-list');
  const status=el('p','write-feedback');
  status.setAttribute('role','status');
  view.append(el('h2','',exhibition?'Рисунки на выставке':'Мои рисунки'),status,list);
  if(!exhibition)view.append(el('p','write-gallery-note','Рисунки хранятся в этом браузере. Очистка его данных может удалить галерею.'));
  let urls=[],generation=0;
  function disposeUrls(){
    urls.forEach(url=>URL.revokeObjectURL(url));urls=[];
  }
  async function show(){
    const run=++generation;
    status.textContent='';
    try{
      const data=await pictures();
      if(run!==generation||!view.isConnected)return;
      disposeUrls();
      list.replaceChildren();
      if(data.length===0)status.textContent=exhibition?'Можно добавить рисунок из мастерской.':'Здесь будут сохранённые рисунки.';
      for(const item of data){
        const card=el('article','write-gallery-card');
        const photo=el('img');
        const blob=new Blob([item.pngBytes],{type:'image/png'});
        const url=URL.createObjectURL(blob);
        urls.push(url);
        photo.addEventListener('error',()=>{
          void dataUrl(blob).then(source=>{if(photo.isConnected)photo.src=source;}).catch(()=>{});
        },{once:true});
        photo.src=url;
        photo.alt='Сохранённый рисунок';
        photo.loading='lazy';
        const tools=el('div','write-controls');
        if(open)tools.append(button('Открыть',()=>open(item.id)));
        tools.append(button('PNG',()=>downloadImage(blob,'lumi-drawing.png')),
          button('Печать',()=>void printDrawing(blob).catch(()=>{status.textContent='Не удалось открыть рисунок для печати.';})));
        if(!exhibition){
          const del=button('Удалить',()=>{
            const confirm=button('Удалить рисунок',async()=>{
              try{await removeDrawing(item.id);await show();}
              catch{status.textContent='Браузер не удалил рисунок. Можно попробовать ещё раз.';}
            });
            tools.replaceChildren(confirm,button('Оставить',()=>void show()));
          });
          tools.append(del);
        }
        card.append(photo,tools);
        list.append(card);
      }
    }catch{if(run===generation)status.textContent='Хранилище рисунков недоступно в этом браузере.';}
  }
  return {view,show,destroy(){generation++;disposeUrls();}};
}
