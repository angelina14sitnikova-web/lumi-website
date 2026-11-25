import {BOARD} from './geometry.js';
import {paintStroke} from './canvas.js';
import {paperColors} from './ink.js';
import {downloadImage,saveDrawing,toBlob} from './gallery.js';
import {el,button} from './ui.js';

export async function picturePng({backdrop,ink,readPaper}){
  const sheet=el('canvas'), lines=el('canvas');
  const scale=2;
  sheet.width=lines.width=BOARD.width*scale;
  sheet.height=lines.height=BOARD.height*scale;
  const ctx=sheet.getContext('2d');
  ctx.fillStyle=paperColors[readPaper()]??paperColors.plain;
  ctx.fillRect(0,0,sheet.width,sheet.height);
  const clean=backdrop.cloneNode(true);
  clean.setAttribute('width',String(sheet.width));
  clean.setAttribute('height',String(sheet.height));
  const source='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(clean));
  const svg=await new Promise((resolve,reject)=>{
    const picture=new Image();
    picture.onload=()=>resolve(picture);
    picture.onerror=()=>reject(new Error('The drawing background could not be rendered.'));
    picture.src=source;
  });
  ctx.drawImage(svg,0,0,sheet.width,sheet.height);
  const draw=lines.getContext('2d');
  draw.scale(scale,scale);
  for(const stroke of ink.read())paintStroke(draw,stroke);
  ctx.drawImage(lines,0,0);
  return toBlob(sheet);
}

export function installDrawingExport(context,{id,items,onSave}={}){
  const status=el('p','write-feedback');
  status.setAttribute('role','status');
  let active=false,current=id;
  async function perform(save){
    if(active)return;
    active=true;
    status.textContent='';
    try{
      const strokes=context.ink.read(),paper=context.readPaper();
      const png=await picturePng({backdrop:context.backdrop,ink:{read:()=>strokes},readPaper:()=>paper});
      if(save){
        const file=await saveDrawing({id:current,png,paper,strokes,items});
        current=file.id;
        status.textContent='Рисунок в галерее.';
        onSave?.(file);
      }else downloadImage(png,'lumi-drawing.png');
    }catch{status.textContent=save?'Браузер не сохранил рисунок. Его можно скачать в PNG.':'Не удалось сохранить PNG. Попробуй ещё раз.';}
    finally{active=false;}
  }
  context.toolbar.append(button('Сохранить в галерею',()=>void perform(true),true),button('Скачать PNG',()=>void perform(false)),status);
}
