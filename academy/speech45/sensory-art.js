const colors={rose:'#dc88a2',lilac:'#ab8dce',blue:'#67bfe2','dark-blue':'#304a8c','light-green':'#a4ca61','dark-green':'#376d4b'};
const x=(x,y,w,h,fill,rx=7)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`;
const c=(x,y,r,fill)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
const p=(d,f,s='none',w=6)=>`<path d="${d}" fill="${f}" stroke="${s}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const ink='#614c53',gold='#edb669',cream='#fff2cd',green='#699f76';
const texture=(color,opaque)=>x(27,58,105,66,color,12)+x(41,66,75,47,opaque,7);
const tastes=(body)=>x(22,45,136,92,'#f7e8d0',16)+body;
function flowers(tone){
 const petals=[];
 for(let i=0;i<6;i++)petals.push(`<ellipse cx="90" cy="43" rx="18" ry="29" fill="${tone}" transform="rotate(${i*60} 90 69)"/>`);
 return p('M89 142 90 68m0 55q-25-24-48-16m48 14q24-24 44-12','none',green,8)+petals.join('')+c(90,69,16,gold);
}
export const sensoryArt={
 sponge:['Губка',()=>texture('#e4bb57','#ffdb75')+[[49,82],[70,94],[99,82],[109,103],[73,76]].map(([a,b])=>c(a,b,3.5,'#cca052')).join('')],
 stone:['Камень',()=>p('M46 121q-3-19 27-49l30-15 36 25 13 34q-19 22-106 5z','#8a8d95')+p('M66 106l30-33m12 12 21 10','none','#bfc1c5',5)],
 feather:['Перо',()=>p('M41 137q-7-57 24-80 31-28 79-19 1 41-33 66l-37 4 12 11-30 5z','#92b9ce')+p('M33 148q38-60 91-95M74 97l24-8','none','#577f9e',5)],
 cork:['Пробка',()=>x(45,65,90,47,'#c89868',12)+c(119,89,24,'#e3b986')+c(118,84,3,'#a77853')+c(127,94,2.8,'#a77853')+c(114,97,2.4,'#a77853')],
 lemon:['Лимон',()=>p('M34 105q-1-36 48-53 32-11 53 3l16-3-2 19q-1 37-42 59-42 22-65-13l-13-4z','#f0cf5d')+p('M54 91q21-24 46-28','none','#fff4a8',5)],
 'salt-cracker':['Солёный крекер',()=>x(38,44,104,94,'#d5a05c',12)+x(44,50,92,82,'#f0c677',9)+[[64,69],[91,82],[108,65],[73,103],[114,113]].map(([a,b])=>c(a,b,4,'#926443')).join('')],
 sweet:['Сладкий вкус',()=>tastes(c(90,90,36,'#e4b2c2')+p('M55 89l-21-17v34zm70 0 21-17v34z','#c77f9b')+p('M76 68q26 17 28 39','none','#f7dae6',6))],
 sour:['Кислый вкус',()=>tastes(c(90,90,41,gold)+c(90,90,34,'#ffe89a')+p('M90 57v66m-33-33h66m-57-24 48 48m0-48-48 48','none','#fff4ba',4))],
 salty:['Солёный вкус',()=>tastes(x(67,72,46,58,'#fdf7e8')+x(66,57,48,21,'#7098a5')+c(78,65,2.4,ink)+c(90,64,2.4,ink)+c(102,65,2.4,ink))],
 park:['Парк',()=>x(13,38,152,108,'#dfebd9',14)+p('M22 133q46-44 131-21','none','#d4b591',15)+x(49,74,8,47,'#b08159')+c(52,67,27,green)+x(118,69,8,51,'#b08159')+c(124,62,28,'#83ad78')],
 stage:['Сцена',()=>x(16,36,148,112,'#a6738a',10)+x(41,50,98,78,'#ebc9a7',6)+p('M17 43q54 4 50 20-15 39-51 66m147-86q-54 4-50 20 15 39 51 66','#9d617b')+x(20,127,140,15,'#c38872',5)],
 'broken-car':['Машинка без колеса',()=>x(28,88,90,32,'#c16b76',8)+p('M40 89 58 66h39l16 23z','#8bbcd4')+c(47,120,12,ink)+c(146,135,11,ink)],
 'closed-box':['Закрытая коробка',()=>x(35,70,110,67,'#a8796e')+x(30,61,120,25,'#c9987c')+p('M46 88h89','none','#89624d',4)],
};
for(const [id,col] of Object.entries(colors)){
 sensoryArt['shade-'+id]=['Цветовой образец',()=>c(90,90,55,col)];
}
export function shadeArt(type,tone){
 const normalized=tone?.replace(/^shade-/,'');
 const col=colors[normalized];
 if(!col)return null;
 if(type==='flower')return flowers(col);
 if(type==='leaf')return p('M35 139q-6-79 96-91l21-15q-1 91-92 93z',col)+p('M31 145q26-38 92-80','none','#e0eb9a',5);
 return null;
}
export function scaleArt({a,b,tilt},render){
 const l=tilt<0?15:-15,r=-l;
 const weights=(id,cx,dy)=>`<g transform="translate(${cx} ${81+dy})"><g class="speech-scale-pan" style="--tilt:${-dy}px">${p('M0-8l-25 38m25-38 25 38','none','#8f7370',2)}${p('M-27 31h54q-8 17-27 17t-27-17z',gold)}<g transform="translate(-24 -14) scale(.27)">${render(id)}</g></g></g>`;
 return x(22,15,136,151,'#fff9e9',12)+p('M90 52v93m-33 1h66','none','#8f7370',8)+
 `<g class="speech-scale-beam" style="--angle:${tilt*17}deg">${p('M36 81h108','none','#8f7370',6)}</g>`+
 weights(a,36,l)+weights(b,144,r)+c(90,81,8,'#bd8267');
}

function tower(n){
 return x(25,141,130,8,'#ab9977',4)+Array.from({length:n},(_,i)=>
 x(49,112-i*24,82,24,['#a8a3cc','#7d9db5','#9bb79c','#dbaa71'][i%4],4)+x(77,117-i*24,25,13,'#fff1d2',5)).join('');
}
function tree(n){return x(20,141,140,8,'#9d9c72',4)+x(84,142-n,12,n,'#9b755c',4)+c(90,142-n,29,green)+c(70,149-n,17,'#7ab088')+c(111,148-n,18,'#8fba89');}
function drink(kind){
 const cold=kind<0,wet=cold?'#add7e4':'#c88d56';
 return p('M52 66h76l-12 69H64z',cold?'#d5edf2':'#eee6d4',cold?'#7ba7bb':'#aa845f',4)+
  p('M57 88h66l-7 43H64z',wet)+
  (cold?x(67,91,15,16,cream,3)+x(93,96,16,16,'#e6f7ff',3):
   p('M128 76q33-5 26 21-3 13-31 13','none','#a48468',6))+
  (kind>0?[0,1,2].slice(0,kind).map(i=>`<g class="speech-steam">${p(`M${68+i*20} 62q13-12 2-22-6-6 2-15`,'none','#a9aeb2',3)}</g>`).join(''):'');
}
function jar(full){
 return x(53,47,74,94,'#dbe9e9',11)+x(47,41,86,18,'#a7826a',8)+
 (full?x(60,69,60,62,'#d78596',7):'')+p('M68 64v54m0 9v3','none','#fffbef',5);
}
Object.assign(sensoryArt,{
 'tower-low':['Низкая башня',()=>tower(2)],'tower-medium':['Средняя башня',()=>tower(3)],'tower-high':['Высокая башня',()=>tower(4)],
 'tree-low':['Низкое дерево',()=>tree(50)],'tree-high':['Высокое дерево',()=>tree(92)],
 'fast-wheel':['Быстро',()=>`<g class="speech-fast">${c(90,91,27,'#7494b4')}${p('M30 91h24','none','#7494b4')}</g>`],
 'slow-wheel':['Медленно',()=>`<g class="speech-slow">${c(90,91,27,'#7494b4')}${p('M30 91h24','none','#7494b4')}</g>`],
 'tea-hot':['Горячий чай',()=>drink(3)],'tea-warm':['Тёплый чай',()=>drink(1)],'tea-cool':['Прохладный чай',()=>drink(0)],
 'icy-glass':['Вода со льдом',()=>drink(-1)],
 ice:['Лёд',()=>p('M48 65 94 44l43 24v46l-43 22-46-22z','#c8ecf8','#82b8d0',4)+p('M50 67l44 21 42-20m-42 20v43','none','#edfaff',4)],
 'dirty-plate':['Грязная тарелка',()=>c(90,91,59,cream)+c(90,91,42,'#ead5ac')+p('M62 78q7-22 26 3 27-13 31 10-1 23-18 22-12 9-18-5-24 8-22-30z','#ad7d64')],
 'opened-box':['Открытая коробка',()=>p('M30 94 58 58l32 14 32-14 28 36-15 45H45z','#cea17c')+
 p('M32 93 90 70l60 23-60 15z','#93745e')+p('M31 94l59 14 61-14v37l-61 16-59-16z','#d8ac85')],
 'full-jar':['Полная банка',()=>jar(true)],'empty-jar':['Пустая банка',()=>jar(false)],
});
