import {worlds} from '../data/logic34/builders.js';
import {icon} from './art.js';
import {el} from '../writing/ui.js';

export function styles(){
 if(document.querySelector('[data-logic-styles]'))return;
 const link=el('link');
 link.rel='stylesheet';link.href=new URL('logic.css',import.meta.url);link.dataset.logicStyles='';
 document.head.append(link);
}
export function link(text,href){
 const n=el('a','academy-button',text);n.href=href;return n;
}
export function graphic(src,alt=''){
 const img=el('img');img.src=src;img.alt=alt;return img;
}
export function hero(world){
 const n=el('div','logic-hero');
 n.append(graphic(new URL('./media/world-'+world+'.webp',import.meta.url)),
  graphic(new URL('../../images/lumi-transparent.png',import.meta.url),'Луми'));
 const prop=el('span','logic-hero-prop');
 const tools=['image','block','butterfly','shape','part','train','bridge','verify'];
 prop.append(icon(tools[world-1]));
 n.append(prop);
 if(worlds[world-1])n.append(el('p','',worlds[world-1]));
 return n;
}
