import {worlds} from '../data/speech34/builders.js';
import {el} from '../writing/ui.js';

export function style(){
 if(document.querySelector('[data-speech-style]'))return;
 const css=el('link');css.rel='stylesheet';css.href=new URL('speech.css',import.meta.url);css.dataset.speechStyle='';
 document.head.append(css);
}
export function graphic(src,alt=''){
 const n=el('img');n.src=src;n.alt=alt;return n;
}
export function link(title,href){
 const n=el('a','academy-button',title);n.href=href;return n;
}
export function hero(world,{name=worlds[world-1],cover=new URL('./media/world-'+world+'.webp',import.meta.url)}={}){
 const n=el('div','speech-hero');
 n.append(graphic(cover),graphic(new URL('../../images/lumi-transparent.png',import.meta.url),'Луми'));
 if(name)n.append(el('p','',name));
 return n;
}
