import {object,colors,rules,categories} from './model.js';
import {svg} from '../writing/ui.js';

const p=(d,c,s='none',w=4)=>`<path d="${d}" fill="${c}" stroke="${s}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const e=(x,y,rx,ry,c)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}"/>`;
const c=(x,y,r,f)=>e(x,y,r,r,f);
const box=(x,y,w,h,f,r=8)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${f}"/>`;
const lit=(x,y)=>e(x,y,16,5,'#ffffff57');
const wheel=(x,y)=>c(x,y,17,'#3a485f')+c(x,y,7,'#acc9d8');
const face=(x,y)=>c(x-15,y,4,'#344053')+c(x+15,y,4,'#344053')+p(`M${x-5} ${y+10}q5 7 10 0`,'none','#755349',3);
const bow=(x,y,f)=>p(`M${x} ${y}l-18-11v22l18-11 18-11v22z`,f)+c(x,y,5,'#f5dbe3');
const teddy=(f,d,type)=>e(90,126,42,39,f)+e(46,143,17,19,f)+e(136,143,17,19,f)+
 (type==='bunny'?e(65,42,15,36,f)+e(112,42,15,36,f)+e(65,37,7,24,'#e7aba9')+e(112,37,7,24,'#e7aba9'):
 type==='cat'?p('M45 80V26l32 23h26l31-23v54z',f):
 (d==='no-ear'?'':c(56,48,22,f)+c(56,48,11,'#dfa3a0'))+c(123,48,22,f)+c(123,48,11,'#dfa3a0'))+
 e(90,80,48,41,f)+e(90,93,26,17,'#ffeecc')+face(90,75)+e(90,84,8,5,'#755447')+
 (d==='scarf'?p('M51 105q42 17 80 0l-2 20-22-4 14 30-16 9-17-37-35-1z','#5495bd'):
 d.includes('bow')?bow(90,118,d==='blue-bow'?'#4399be':d==='gold-bow'?'#dfb748':'#d77592'):'');
const car=(f,d)=>p('M23 109q3-23 26-26l28-37h47l27 34q19 6 20 27v16H18v-12z',f,'#53738a')+
 p('M62 80l22-27h34l21 27z','#d4f1ff')+p('M106 54v27','none','#779fae',3)+box(153,97,12,10,'#ffe4a6',3)+lit(53,95)+
 (d==='body'?'':(d==='no-wheel'?'':wheel(53,126))+wheel(131,126));
const house=(f,d)=>box(38,72,104,85,f,6)+(d==='no-roof'?'':p('M17 77L90 22l72 55z',d.includes('blue-roof')?'#478db8':'#c35e57','#975e52'))+
 (d==='no-door'?'':box(78,107,25,50,d.includes('gold-door')?'#d6a94e':'#916144',3)+c(98,131,2,'#ffe7a8'))+
 box(49,90,22,24,'#afe1ec',4)+box(111,90,22,24,'#afe1ec',4)+p('M61 93v17m61-17v17','none','#6292a6',2);
const bloom=(f,d)=>p('M90 90v72m0-23 31-19m-31 26-32-15','none','#5c9b69',7)+
 [[90,46],[122,71],[111,106],[69,106],[58,71]].filter((_,i)=>i||d!=='no-petal').map(([x,y])=>c(x,y,22,f)).join('')+c(90,76,20,'#f1bf56');
const container=(f,d)=>p('M37 74h106l-9 71H46z',f,'#926e55')+
 (d==='open'?p('M32 72l17-42h84l19 42z','#ddaf75','#a47a58'):box(31,63,117,22,'#d9ae7b',4))+box(82,84,15,12,'#ecd276',3);
const art={
 circle:f=>c(90,90,54,f)+lit(70,54),square:f=>box(36,36,108,108,f,13)+lit(62,54),
 triangle:f=>p('M90 31l62 112H28z',f)+lit(91,58),oval:f=>e(90,90,49,60,f)+lit(75,50),
 ball:(f,d)=>c(90,90,55,f)+p(d==='stripe'?'M43 68q64-5 92 56m-97-42q52 1 85 52':'M52 53q44 45 34 92m40-88q-30 36-79 56','none','#ffffff9b',7)+lit(68,51),
 apple:f=>p('M90 56c28-29 64-8 61 35-3 48-36 73-60 59-27 14-61-15-62-53-2-42 30-59 61-41z',f)+p('M89 57q-6-22 3-38','none','#8e674d',7)+p('M94 42q11-23 44-20-6 25-44 20z','#67a56a')+lit(62,75),
 pear:f=>p('M76 54q4-34 24-29 18 0 18 33c8 31 35 36 34 61-3 48-101 54-123 10-13-35 35-51 47-75z',f)+lit(60,105)+p('M93 31l12-18','none','#8e6246',6),
 banana:f=>p('M32 50q39 84 108 30-18 67-72 62-39-8-36-92z',f,'#c59342')+p('M37 79q28 60 86 26','none','#fff6af',5),
 plum:f=>e(90,96,48,56,f)+p('M92 47q12-27 35-27-4 26-35 27z','#74aa68')+lit(75,65),
 bear:teddy,cat:(f,d)=>teddy(f,d,'cat'),bunny:(f,d)=>teddy(f,d,'bunny'),dog:teddy,
 car,body:f=>car(f,'body'),house,flower:bloom,
 butterfly:(f,d)=>p('M89 84C76 22 27 26 25 64c-1 23 18 27 37 27-26 11-21 43 2 43 15 0 26-16 27-40m0-10c11-62 60-58 63-20 2 23-18 27-37 27 25 11 20 43-3 43-15 0-24-16-26-40',f,'#88718e')+
 p('M90 65v53m0-47L75 53m16 18 15-18','none','#524959',6)+(['spots','dots'].includes(d)?c(54,66,d==='spots'?13:7,'#ffed9a')+c(125,66,d==='spots'?13:7,'#ffed9a'):''),
 balloon:(f,d)=>(d==='round'?c(90,72,53,f):e(90,71,42,57,f))+p('M90 124q-24 21 0 46','none','#74607f',4)+lit(72,45),
 cup:(f,d)=>(d==='no-handle'?'':p('M124 74q45-11 41 21t-40 22','none',f,14))+p('M39 60h94l-7 66q-35 31-78 0z',f)+e(86,62,47,12,'#f2dfc7')+e(86,62,36,7,'#aa6b7c'),
 kettle:(f,d)=>p('M43 71q-35-5-16 42l25 8','none',f,12)+p('M105 81q32-42 58-14-7 24-42 31z',f)+e(86,102,49,39,f)+(d==='no-lid'?'':box(50,57,70,12,'#dcae54')+c(83,53,9,'#e5b866'))+lit(73,88),
 bowl:f=>p('M29 68h123q-11 79-62 78-54-3-61-78z',f)+e(90,69,61,15,'#936c61')+e(90,67,51,9,'#ffe8ba'),
 plate:f=>e(90,90,61,48,f)+e(90,90,45,34,'#ffffff6b')+e(90,91,33,24,'#fff3de'),
 spoon:f=>box(83,68,14,90,f,7)+e(90,58,24,35,f)+e(90,56,16,26,'#ffffff57'),
 lid:f=>e(90,105,61,27,f)+box(76,66,28,29,f,8)+lit(65,102),
 block:f=>p('M32 58l65-27 48 40v70l-62 19-51-38z',f)+p('M32 58l51 40 62-27M83 98v62','none','#ffffff8f'),
 top:f=>p('M30 78q58-35 120 0L90 147z',f)+box(82,31,16,57,'#ad7759')+p('M48 97q43-17 85 0','none','#f4cd70',6),
 pyramid:f=>box(32,145,115,14,'#ae8058')+[0,1,2,3].map(i=>box(40+i*10,117-i*23,100-i*20,24,[f,'#e8b756','#67ab87','#598fc4'][i],11)).join(''),
 doll:f=>c(90,58,31,'#efcda0')+p('M60 65Q42 32 68 21q39-15 54 25l-7 26-8-28-22 13-25 8z','#996d4e')+p('M72 83h37l29 61H42z',f)+face(90,58),
 robot:f=>box(42,37,96,80,f,16)+box(61,119,59,29,'#90b3c9',9)+p('M89 36V17','none','#5f6f84',5)+c(89,15,7,'#e7bf62')+face(90,72),
 scarf:f=>p('M29 43q59 29 122 0l-6 34-38 10 24 52-26 17-20-71-51-9z',f),
 hat:f=>p('M37 116q3-77 53-77 48 5 52 77z',f)+c(90,35,15,'#efc56c')+box(26,106,128,24,f,12),
 boot:f=>p('M55 37h65v67l28 20q9 16-14 23H55z',f)+box(48,137,102,13,'#775048'),
 mitten:f=>p('M63 129L35 78q-5-20 14-17l18 15V37q4-24 29-23 43 1 45 56l-10 62z',f)+box(60,126,76,15,'#efd2a8'),
 shirt:f=>p('M65 34 21 58l21 38 24-10v66h49V86l23 10 18-38-44-24q-17 27-47 0z',f),
 bird:f=>e(85,105,47,32,f)+c(122,71,28,f)+c(131,65,4,'#344c60')+p('M146 72l18 10-21 4z','#e9aa52')+e(82,103,23,15,'#ffffff64'),
 duck:f=>art.bird(f)+p('M37 137q46 13 105-1','none','#72b6d7',5),
 leaf:f=>p('M35 145q-14-89 108-108 9 105-108 108z',f)+p('M39 145l78-71m-47 42-8-19','none','#edf4b5',4),
 ribbon:f=>p('M28 56h127l-19 35 19 34H28l21-34z',f)+lit(75,74),
 box:container,chest:container,
 basket:f=>p('M55 83q-13-57 35-61 45 4 34 62','none','#a56f50',9)+p('M30 77h120l-21 68H51z',f)+p('M40 96h100m-94 15h88m-83 14h78','none','#e7bc6c',4),
 shelf:f=>box(24,31,132,124,f)+box(35,43,110,103,'#faeaca')+box(34,82,112,9,f,3),
 platform:f=>p('M28 94h121l16 22-33 25H22z',f,'#b99067'),
 wheel:f=>c(90,90,47,f)+c(90,90,22,'#bccfdb'),window:f=>box(39,39,102,102,f,11)+p('M90 45v90M45 90h90','none','#e9f8fd',7),
 ear:f=>e(90,90,43,51,f)+e(90,88,22,34,'#e0a49c'),bow:f=>bow(90,90,f),
 handle:f=>p('M49 58q91-20 86 31-2 41-84 37','none',f,17),
 petal:f=>e(90,90,29,55,f)+lit(87,61),roof:f=>p('M22 121 90 46l68 75z',f),
 door:f=>box(51,30,77,122,f)+c(105,95,5,'#ffe2a7'),
 wall:f=>box(33,35,114,114,f)+box(78,89,28,60,'#9e6b4a',5)+box(49,58,24,26,'#9dd3ef',4),
 head:f=>e(90,90,48,45,f)+face(90,85),bearBody:f=>e(90,90,46,60,f)+e(90,98,30,42,'#fff1cd'),
 paw:f=>e(90,90,31,43,f)+e(90,102,17,20,'#e4aca2'),base:f=>box(28,73,124,55,f,11),ring:f=>e(90,91,62,28,f)+e(90,87,26,11,'#fff3d9'),
 train:f=>box(24,57,131,64,f)+box(20,51,140,15,'#af7552')+box(43,72,31,28,'#d4edf3',4)+box(104,72,31,28,'#d4edf3',4)+wheel(53,130)+wheel(131,130),
 bridge:f=>p('M18 135V81q72-72 144 0v54h-24q0-50-48-50t-48 50z',f)+p('M27 79q64-57 125 1','none','#e5bb75',7),
 plank:f=>box(15,67,150,51,f)+p('M25 83h128m-124 17h115','none','#e2b87c',5),
 watering:f=>e(100,102,47,35,f)+p('M66 111 27 75 18 84l42 42m77-35q49 1 11-36l-29-1M86 68q-4-36 36-38','none',f,11),
 pitcher:f=>p('M49 41h64l-8 34q25 46 11 70H51q-24-11-7-67z',f)+p('M108 61q43-2 38 22-7 20-35 12','none',f,11),
 brush:f=>e(62,70,43,30,f)+p('M89 83l56 62','none',f,18)+p('M44 66v20m14-24v24m15-25v25','none','#78606d',5),
 comb:f=>box(24,44,132,31,f)+Array.from({length:8},(_,i)=>box(29+17*i,66,8,53,f,3)).join(''),
 cloth:f=>p('M30 42h115l14 96-124 11z',f)+p('M48 60l9 72m14-68 9 67m14-65 11 62','none','#ffffff75',4),
 towel:f=>box(44,25,93,131,f,11)+p('M54 127h74m-71 11h68','none','#fff0cf',4),
 book:(f,d)=>d==='closed'?box(34,51,112,84,f)+p('M50 61v65','none','#fff6',6):
 p('M22 43q39-10 68 12 27-22 67-12v97q-36-9-67 9-33-18-68-9z',f)+p('M90 57v86m-53-68 36 9m32 0 32-9','none','#ffffff88',4),
 soap:f=>box(36,63,108,58,f,22)+lit(74,78)+c(134,53,8,'#82c6de'),
 hand:f=>p('M63 150 32 95q-6-14 6-19l24 19V45q0-17 12-17t11 20v34-54q10-11 21 0v56-42q14-10 20 3v45-25q14-7 19 8l-3 53-21 29z',f,'#b48366',3),
 water:f=>e(90,97,67,39,f)+p('M41 99q25-18 48 0t50 0','none','#cff0fa',5),
 road:f=>p('M11 115q58-26 158-30','none',f,39)+p('M21 112l22-7m19-5 18-4m20-3 20-2m19-1h22','none','#f8db91',4),
};
export function drawing(id){
 const a=object(id);if(!a)return '';
 const body=art[a.type](colors[a.color],a.detail);
 const scale={small:.57,medium:.78,big:1}[a.size];
 return scale===1?body:`<g transform="translate(90 90) scale(${scale}) translate(-90 -90)">${body}</g>`;
}
export function image(markup,viewBox='0 0 180 180'){
 const graphic=svg('svg',{viewBox,'aria-hidden':'true'});
 graphic.innerHTML=markup;
 return graphic;
}
export const card=id=>image(drawing(id));
export const name=id=>{
 const a=object(id);
 return a?[a.label,{red:'красный',blue:'голубой',gold:'жёлтый',mint:'зелёный',purple:'фиолетовый',rose:'розовый',brown:'коричневый',gray:'серый',cream:'кремовый'}[a.color],{big:'крупный',small:'маленький',medium:'средний'}[a.size],a.detail==='plain'?'':a.detail].filter(Boolean).join(', '):id;
};
export const multiple=ids=>image(ids.map((id,i)=>`<g transform="translate(${i*180} 0)">${drawing(id)}</g>`).join(''),'0 0 '+ids.length*180+' 180');
export function landscape(scene) {
 if(typeof scene==='string')return drawing(scene);
 if(!scene)return '';
 return (scene.background?box(0,0,180,180,scene.background,0):'')+scene.objects.map(({id,x,y,scale})=>
 `<g transform="translate(${x} ${y}) scale(${scale})">${drawing(id)}</g>`).join('');
}
export function icon(k){
 const icons={
  image:p('M36 74h108m-108 33h108','none','#488a77',11),
  different:p('M36 74h108m-108 33h108m-10-62-87 93','none','#79669a',10),
  color:c(64,65,27,'#cc5b55')+c(117,68,27,'#5998c2')+c(91,107,26,'#efbb49'),
  shape:c(44,94,21,'#66778a')+box(72,75,34,38,'#66778a')+p('M144 71l23 44h-46z','#66778a'),
  size:c(57,104,22,'#66778a')+c(122,91,36,'#66778a'),
  part:p('M36 128V64h40q-10-27 13-28 23 1 13 28h42v64z','#869db4'),
  category:box(28,49,123,33,'#bd9c62')+box(28,94,123,33,'#849caa'),
  next:p('M32 90h107m-32-29 32 29-32 29','none','#57887c',12),
  verify:p('M43 92l31 32 63-68','none','#468d76',16),
 };
 return image(icons[k]??drawing(k));
}
export function marker(rule,value){
 if(rule==='size')return [card('circle:gray:'+value),{big:'Большие',small:'Маленькие',medium:'Средние'}[value]];
 if(rule==='shape'){
  const item={round:'circle',rectangle:'book',wings:'butterfly'}[value]??value;
  return [card(item+':gray'),object(item)?.label??'Форма'];
 }
 if(rule==='color')return [image(c(90,90,54,colors[value])),name('circle:'+value)];
 if(rule==='category')return [card(categories[value]?.[1]),categories[value]?.[0]];
 if(rule==='image')return [icon(value?'image':'different'),value?'Одинаковые':'Разные'];
 return [icon(rule),rules[rule]];
}
