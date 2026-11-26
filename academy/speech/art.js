import {drawing,image} from '../logic/art.js';
import {colors,object} from '../logic/model.js';
import {art45} from '../speech45/art.js';
import {sensoryArt,shadeArt,scaleArt} from '../speech45/sensory-art.js';
import {words} from './words.js';

const p=(d,color,stroke='none',w=5)=>`<path d="${d}" fill="${color}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const x=(a,b,w,h,c,r=7)=>`<rect x="${a}" y="${b}" width="${w}" height="${h}" rx="${r}" fill="${c}"/>`;
const e=(a,b,rx,ry,c)=>`<ellipse cx="${a}" cy="${b}" rx="${rx}" ry="${ry}" fill="${c}"/>`;
const c=(a,b,r,f)=>e(a,b,r,r,f);
const oak='#aa7353',milk='#fff0ca',rose='#d78293',blue='#5288ae',mint='#73a483',ink='#394852',honey='#e7b653';
const legs=(a,b)=>x(a,b,11,49,oak,3)+x(168-a,b,11,49,oak,3);
const human=(f,kind)=>`<g class="speech-legs">${p('M79 114 72 162m32-48 7 48','none','#57689a',13)}</g><g class="speech-arm">${p('M67 89 45 117m67-27 23 25','none','#edba91',11)}</g>`+
 x(65,79,53,43,f,13)+c(90,54,29,'#f0c699')+
 p(kind==='girl'?'M59 77q-16-39 10-56 34-17 52 16l9 40-14 6-10-46-27 16-10 24z':
  'M62 52Q55 22 74 19q32-12 49 13l-4 20-14-20-20 17z','#865842')+
 c(81,57,3,ink)+c(103,57,3,ink)+p('M85 66q6 5 13 0','none','#925a55',3);
const animal=(kind,f)=>e(93,121,44,32,f)+e(67,143,12,18,f)+e(111,143,12,18,f)+
 p('M121 115q47-43 35-6','none',f,11)+
 (kind==='cow'?p('M58 48 40 27l8 22m63-1 16-23-5 24','none',oak,5):'')+
 e(84,77,48,39,f)+e(81,92,25,15,milk)+c(67,72,4,ink)+c(99,72,4,ink)+e(82,90,7,4,oak)+
 (kind==='cow'?e(105,57,16,14,oak)+e(112,119,15,17,oak):'');
const definitions={
 paper:()=>x(31,28,116,125,'#fff8df',10)+p('M60 64q35-24 66 13m-62 13h41','none','#6da38e',5),
 crayon:f=>p('M44 118l67-76 24 23-69 74-32 8z','#cf895f')+p('M107 49l20 22m-78 51 23 16','none','#7f5361',4),
 table:()=>legs(32,91)+p('M20 81h137l13 21H11z',oak)+x(16,72,147,21,'#d9a779',6),
 chair:()=>legs(49,108)+x(47,21,14,109,oak)+x(57,28,65,54,'#b78564')+x(48,100,84,17,'#daa679'),
 bed:()=>x(17,82,11,71,oak)+x(150,114,11,35,oak)+x(26,105,123,39,blue)+x(28,101,120,17,'#eecdb2')+e(56,96,31,10,milk)+x(74,90,79,42,blue),
 cupboard:()=>x(38,20,105,139,oak,8)+x(45,27,91,117,'#d2a47e')+p('M90 28v114','none',oak)+c(81,87,4,honey)+c(100,87,4,honey),
 shelf:()=>x(22,27,138,128,oak)+x(34,36,115,104,'#f5dfb6')+x(27,79,126,10,oak),
 sofa:()=>x(29,43,120,91,mint,19)+x(17,74,28,61,'#8ab398',11)+x(135,74,28,61,'#8ab398',11)+x(43,96,94,36,'#8db59a')+x(39,129,10,22,oak)+x(131,129,10,22,oak),
 pants:()=>p('M43 29h91l17 117-32 7-29-76-25 76-35-7z','#5686b2')+p('M42 39h96','none','#aac3de'),
 dress:f=>p('M67 25h46l15 49-19 3 49 77H22l48-77-21-3z',f)+p('M64 89h52','none','#fff3d0'),
 jacket:f=>p('M56 33l31-9 35 11 34 78-37 5v33H58v-35l-35-4z',f)+p('M90 31v115','none','#eddaba',6)+x(61,100,21,23,blue)+x(99,100,20,23,blue)+p('M68 35l23 20 21-20','none','#ffe3b7',5),
 sock:f=>p('M53 26h55l-1 73 32 25q17 28-9 30H51z',f)+p('M53 38h52','none',milk),
 fork:f=>x(83,70,14,83,f)+x(65,60,50,25,f)+[0,1,2,3].map(i=>x(64+14*i,29,8,44,f,4)).join(''),
 pot:f=>x(42,61,98,80,f,14)+e(90,62,55,12,'#dbe0de')+x(13,84,34,13,f)+x(133,84,34,13,f)+c(90,46,9,ink),
 bucket:f=>p('M39 60h102l-14 82H54z',f)+e(90,61,50,10,'#d4e9e6')+p('M44 58q-6-46 46-46t48 46','none',ink),
 napkin:f=>p('M35 38h109l3 106H33z',f)+p('M46 52h86v80H46z','none','#fff9ef',4),
 pillow:f=>p('M37 46q44 17 105 0l-10 47 11 46q-58-14-108 0l12-46z',f)+p('M49 59q39 9 79 0','none','#fff2ec',3),
 wood:()=>x(27,54,126,76,'#cc955f',13)+p('M42 71h88m-81 37h76','none','#f2bd77',3),
 bark:()=>p('M33 43l114 2 7 19-13 15 16 20-15 32-109 6-13-12 10-27-11-15z','#936143')+p('M43 53l12 28-15 29m43-53-11 26 12 20-2 22m35-75 15 24-17 39','none','#653e37',7),
 girl:f=>human(f,'girl'),boy:f=>human(f,'boy'),adult:f=>human(f,'girl'),
 eye:()=>p('M33 90q57-69 114 0-57 62-114 0z','#fbf3dd')+c(91,90,24,blue)+c(91,90,11,ink),
 nose:f=>p('M79 44 56 103q16 24 64 0L96 44z',f)+e(88,101,24,9,'#ba7468'),
 mouth:()=>p('M34 86q42-33 112 0-61 54-112 0z',rose)+p('M55 90q35 16 74-1','none','#9d575d',4),
 leg:f=>p('M67 29h40v95l37 26H63z',f,'#b88368'),torso:f=>x(47,35,86,102,f,23),
 tail:f=>p('M36 133q85 5 100-62 1-32-20-28','none',f,17),
 wing:f=>p('M25 71q80-58 128-46-21 74-105 109-28 10-23-63z',f)+p('M43 94l84-54','none','#fff9',4),
 beak:f=>p('M35 76l107-38-10 73z',f,'#916745'),
 collar:f=>p('M34 42l53 30 55-30-35 64-20-15-19 15z',f),
 pocket:f=>p('M40 44h100v63q-49 50-100 0z',f)+p('M47 57h85','none','#fff8',3),
 button:f=>c(90,90,49,f)+c(73,90,7,ink)+c(106,90,7,ink),
 zip:f=>x(70,23,40,129,f)+p('M90 32v105','none','#eee4d3',7)+x(79,51,22,30,oak),
 back:f=>x(40,31,100,95,f,11),seat:f=>p('M30 72h110l17 32H23z',f),
 tabletop:f=>p('M17 71h142l12 32H9z',f),
 legs:()=>legs(31,52)+x(32,48,105,11,oak),
 screen:f=>x(27,37,127,111,f,9)+p('M71 40v108m44-108v108','none','#c3acad',5),
 winter:()=>c(124,57,26,'#d9f3fc')+p('M47 48v83m-34-61 68 40m-68 0 68-40','none',blue,5)+c(109,132,13,'#c1dfed'),
 sun:()=>c(90,90,41,honey)+p('M90 20v17m0 106v17M19 90h19m106 0h17M43 43l13 13m68 68 13 13m0-94-13 13m-68 68-13 13','none',honey,7),
 rain:()=>e(85,57,64,21,'#a6bccc')+p('M36 92 27 125m48-33-9 33m48-33-9 33m48-33-9 33','none',blue,7),
 umbrella:f=>p('M27 80q66-87 127 0z',f)+p('M90 80v61q10 25 26 3','none',oak,5),
 fish:f=>p('M41 93q37-62 93 0L168 64v61l-35-23q-49 46-92-9z',f)+c(61,87,4,ink),
 cow:f=>animal('cow',f),horse:f=>animal('horse',f)+p('M112 39q29 18 24 76l-15-18','none',oak,12),
 hen:f=>e(85,107,49,28,f)+c(120,75,25,f)+p('M140 80l25 10-25 5z',honey)+c(122,45,11,rose)+c(128,71,4,ink),
 kolobok:()=>c(90,90,56,'#e2a44b')+e(74,56,20,8,'#f4d381')+c(73,89,5,ink)+c(107,89,5,ink)+p('M78 106q12 15 25 0','none','#865638'),
 turnip:()=>p('M50 80q40-30 80 0 25 44-38 77-66-18-42-77z','#e3b54f')+p('M85 75 55 34q28-1 37 29l13-45q21 11 2 42l37-13-39 30z',mint),
 fox:f=>animal('fox',f)+p('M44 71 40 24l47 28 36-28 0 51z',f)+c(70,71,4,ink)+c(99,71,4,ink),
 mouse:f=>c(61,49,21,f)+c(121,49,20,f)+animal('mouse',f),
 frog:f=>c(62,61,21,f)+c(118,61,22,f)+e(90,103,58,43,f)+c(68,60,3,ink)+c(114,60,3,ink)+p('M74 113q14 10 30 0','none',ink,4),
 wolf:f=>animal('wolf',f)+p('M44 67 45 24l31 22 30-21 9 47z',f)+c(64,64,4,ink)+c(98,64,4,ink),
 grandpa:()=>human('#718899','boy')+p('M72 66q20 6 38-5l-7 28-17 8z','#e3ded0'),
 grandma:()=>human('#a47a97','girl')+p('M58 52q-1-44 31-45 39-1 37 50l-15-10-27-17z','#99919c'),
 arrow:()=>p('M35 92h110m-28-27 27 27-27 26','none',blue,10),
 voice:()=>p('M27 61h30l36-29v115l-36-33H27z',blue)+p('M112 65q33 23 0 50m12-65q49 40 0 80','none',mint,6),
 lamp:()=>x(54,43,70,102,honey,15)+x(64,55,50,79,milk,10)+p('M57 43h67L99 20H82z',oak)+p('M80 21q-3-15 11-15 14 1 12 15','none',oak),
 question:()=>p('M60 60q10-44 52-28 30 18-2 45-19 13-19 26','none',blue,12)+c(90,131,7,blue),
 happy:()=>c(90,90,59,honey)+c(69,75,5,ink)+c(111,75,5,ink)+p('M65 103q25 36 50 0','none',ink),
 sad:()=>c(90,90,59,blue)+c(70,76,5,ink)+c(110,76,5,ink)+p('M64 119q27-33 52 0','none',ink),
 cloth:()=>x(32,56,115,79,'#9dc4ad')+p('M38 76h102m-99 14h98m-92 14h88','none','#d5e8d5',4),
};
const aliases={kitten:'cat::small',puppy:'dog::small',duckling:'duck::small',calf:'cow::small',foal:'horse::small',chick:'hen::small',
 tomcat:'cat',lumi:'dog:cream',hand:'hand',sleeve:'jacket',soft:'pillow',hard:'block',smooth:'wood',rough:'bark',red:'circle:red',
 blue:'circle:blue',gold:'circle:gold',mint:'circle:mint',large:'circle:gray',small:'circle:gray:small',round:'circle:gray',
 square:'square:gray',rectangle:'book:gray',greet:'hand',farewell:'hand',thanks:'flower',help:'box',request:'hand',sorry:'sad',
 quiet:'voice::small',normal:'voice::medium',louder:'voice',inside:'box',on:'table',under:'table',behind:'screen',sit:'chair',
 read:'book',eat:'spoon',drink:'cup',sleep:'bed',wash:'soap',dry:'towel',write:'book',choose:'question',rest:'sofa'};
export function caption(id){
 if(typeof id!=='string')return 'Сюжетная картинка';
 return art45[id.split(':')[0]]?.[0]??sensoryArt[id.split(':')[0]]?.[0]??words[id.split(':')[0]]?.lemma??object(id)?.label??({
  girl:'Девочка',boy:'Мальчик',adult:'Взрослый',arrow:'Следующее место',pocket:'Карман',sleeve:'Рукав',collar:'Воротник',lamp:'Фонарик',
 })[id]??id;
}
export function render(id){
 if(typeof id==='object'){
  if(id.scale)return scaleArt(id.scale,render);
  return id.props.map((prop,i)=>{
   const val=typeof prop==='string'?[prop,24+i*40,23,.52]:prop;
   const [item,a,b,s,action]=val;
   return `<g transform="translate(${a} ${b}) scale(${s})"><g class="speech-motion speech-${action??'show'}">${render(item)}</g></g>`;
  }).join('');
 }
 const original=id??'question';
 if(original==='lumi'){
  const src=new URL('../../images/lumi-transparent.png',import.meta.url).href;
  return '<image href="'+src+'" x="12" y="12" width="156" height="156" preserveAspectRatio="xMidYMid meet"/>';
 }
 const target=aliases[original]??original;
 const [type,tone,size]=target.split(':');
 if(type==='lumi')return '';
 const shade=shadeArt(type,tone);
 if(shade)return shade;
 const newer=art45[type]??sensoryArt[type];
 if(newer)return newer[1](colors[tone]);
 if(definitions[type]){
  const shape=definitions[type](colors[tone]??({jacket:'#93aec1',dress:rose,bucket:'#87a798',girl:rose,boy:blue,adult:mint,screen:'#b991a9',
   fox:'#d48452',mouse:'#9697a0',frog:mint,wolf:'#818fa2',napkin:rose,pillow:'#d783ac',pot:'#a9b9bf',fork:'#85929b',
   head:'#edba91',leg:'#edba91',torso:blue,wing:blue,beak:honey}[type]??oak));
  const k=size==='small'?.60:size==='medium'?.81:1;
  return k===1?shape:`<g transform="translate(90 90) scale(${k}) translate(-90 -90)">${shape}</g>`;
 }
 return drawing(target)||definitions.question();
}
export const picture=art=>image(render(art));
