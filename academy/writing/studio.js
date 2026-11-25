import {findCourse} from '../course-model.js';
import {inkBoard} from './ink.js';
import {installDrawingExport} from './export.js';
import {makeGallery,readDrawing} from './gallery.js';
import {el,button} from './ui.js';

import {unlockedPaints} from './paints.js';

const root=document.querySelector('#writing-workspace');
if(root){
  const course=findCourse('writing-3-4');
  const studio=el('section','write-studio');
  const gallery=makeGallery({open:async id=>{
    try{
      const saved=await readDrawing(id);
      if(saved){
        edit(saved);
        studio.scrollIntoView({behavior:'instant',block:'start'});
      }
    }catch{notice.textContent='Не удалось открыть рисунок.';}
  }});
  const notice=el('p','write-feedback');
  notice.setAttribute('role','status');
  root.append(studio,notice,gallery.view);
  let view;
  function edit(file){
    view?.destroy();
    studio.replaceChildren();
    notice.textContent='';
    let context;
    const settings={kind:'ink',mode:'free',items:file?.items,extraColors:unlockedPaints(course),paper:file?.paper??'plain'};
    view=inkBoard(settings,{strokes:file?.strokes??[],exportControls(value){
      context=value;
      installDrawingExport(value,{id:file?.id,items:file?.items,onSave:()=>void gallery.show()});
    }});
    const switches=el('div','write-controls');
    for(const [paper,label] of [['plain','Чистый лист'],['garden','Сад'],['clouds','Облака'],['sunshine','Солнце']]){
      switches.append(button(label,()=>context.setPaper(paper)));
    }
    const reset=button('Новый рисунок',()=>edit());
    studio.append(switches,view.view,el('div','write-controls'));
    studio.lastElementChild.append(reset);
  }
  edit();
  void gallery.show();
}
