const tones = { blue:'#5caddb', pink:'#dd819d', gold:'#efb952', green:'#77aa78', red:'#e47968', neutral:'#c2becb' };
const svg = 'http://www.w3.org/2000/svg';
const gold = tones.gold;
const dark = '#384465';

export const titles = {
  ball:'мяч', bear:'медвежонок', car:'машинка', duck:'уточка', doll:'кукла', stack:'пирамидка',
  cup:'чашка', apple:'яблоко', pear:'груша', plum:'слива', jug:'кувшин', plate:'тарелка', spoon:'ложка',
  butterfly:'бабочка', house:'домик', flower:'цветок', star:'звезда', firefly:'светлячок',
  leaf:'лист', bell:'колокольчик', basket:'корзинка', mat:'коврик', garage:'гараж', window:'окошко',
  desk:'стол', fair:'полянка', lemon:'лимон', balloon:'воздушный шарик',
  drum:'барабан', rattle:'погремушка', cat:'кошка', dog:'собака', bird:'птица',
  hat:'шапка', boot:'сапог', scarf:'шарф', coat:'куртка',
  box:'коробка', faucet:'кран', towel:'полотенце', watering:'лейка', plant:'цветок в горшке',
  hands:'лапки', book:'книга', paper:'лист бумаги', seed:'зёрнышко', circle:'круг', square:'квадрат',
  rabbit:'зайчик', berry:'ягода', wheel:'колесо', ear:'ушко', lamp:'лампа', 'wing-spot':'пятнышки',
  ears:'ушки', paws:'лапки', bow:'бантик', wheels:'колёса', light:'фары', roof:'крыша',
  door:'дверь', center:'серединка', body:'кузов', tree:'дерево',
};
const shape = {
  rect: (x,y,w,h,fill,rx=0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`,
  circle: (x,y,r,fill) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`,
  ellipse: (x,y,rx,ry,fill) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}"/>`,
  line: (d,stroke,width=3) => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round"/>`,
  path: (d,fill) => `<path d="${d}" fill="${fill}"/>`,
};
const { rect, circle, ellipse, line, path } = shape;
const sparkle = (x,y,r,fill=gold) => path(`M${x} ${y-r}l${r*.31} ${r*.65} ${r*.73} ${r*.09} -${r*.54} ${r*.51} ${r*.12} ${r*.72} -${r*.62} -${r*.35} -${r*.62} ${r*.35} ${r*.12} -${r*.72} -${r*.54} -${r*.51} ${r*.73} -${r*.09}z`,fill);
const shine = (x,y,rx,ry) => ellipse(x,y,rx,ry,'#ffffff80');
const shadow = ellipse(60,105,38,5,'#2f395315');
const face = (x,y) => circle(x-7,y,2,dark)+circle(x+7,y,2,dark)+line(`M${x-4} ${y+7}q4 4 8 0`,dark,1.5);
const sub = (key,x,y,size) => `<g transform="translate(${x} ${y}) scale(${size/120})">${painting(key)}</g>`;
const leaves = (x,y) => path(`M${x} ${y}q4 -19 23 -15q-4 15 -23 15z`,'#70a778');
const ribbon = (color) => path('M58 75Q40 61 41 83Q45 90 58 81Q72 90 79 83Q81 61 62 75Z',color)+circle(60,78,5,'#f9d686');

const draw = {
  ball: (c, parts) => circle(60,58,41,c)+path('M22 52Q51 84 96 63Q93 80 88 85Q48 104 27 76Z','#31457227')+shine(45,36,13,7)+(parts.includes('star')?sparkle(63,60,18):''),
  car: (c, parts) => rect(24,62,76,27,c,10)+path('M35 62l13 -23h35l13 23z',c)+path('M42 60l10 -16h26l10 16z','#daeef8')+line('M65 44v16',c,3)+circle(36,87,12,dark)+(parts.includes('wheeloff')?'':circle(86,87,12,dark)+circle(86,87,5,'#dbe9f0'))+circle(36,87,5,'#dbe9f0')+rect(91,68,8,8,'#fff1b0',3)+(parts.includes('star')?sparkle(60,74,9):''),
  bear: (c, parts) => ellipse(60,83,24,25,'#ba8664')+circle(37,31,13,'#bb8864')+(parts.includes('earoff')?'':circle(83,31,13,'#bb8864')+circle(83,31,7,'#f1cfab'))+circle(37,31,7,'#f1cfab')+circle(60,54,28,'#dca77b')+ellipse(60,63,15,11,'#f4d1a7')+face(60,56)+circle(60,63,3,dark)+ellipse(35,86,12,9,'#dca77b')+ellipse(85,86,12,9,'#dca77b')+ellipse(47,104,11,6,'#ebba91')+ellipse(73,104,11,6,'#ebba91')+(parts.includes('plain')?'':parts.includes('scarf')?rect(41,73,38,11,'#58a3bd',6)+rect(69,75,9,24,'#58a3bd',4):ribbon(parts.includes('blue')?tones.blue:tones.pink)),
  house: (c, parts) => rect(28,49,64,54,'#f3dca9',4)+path('M17 52L60 17L103 52Q102 57 96 57H24Q18 56 17 52Z',c)+(parts.includes('dooroff')?'':rect(54,73,18,30,'#b88468',8)+circle(66,89,2,'#f9db94'))+(parts.includes('windowoff')?'':rect(34,63,14,15,parts.includes('shut')?'#9b7499':'#84bdd6',4)+line('M41 64v13m-6 -6h12','#f9f1db',1.4)),
  butterfly: (c, parts) => path('M57 57Q31 17 17 29Q6 53 28 70Q11 100 40 94Q53 90 59 69Z',c)+path('M63 57Q89 17 103 29Q114 53 92 70Q109 100 80 94Q67 90 61 69Z',c)+ellipse(60,65,5,22,dark)+line('M57 46q-5 -12 -13 -11m19 11q5 -12 13 -11',dark,2)+(parts.includes('spot')?circle(33,47,9,'#fff4d0')+circle(87,47,9,'#fff4d0'):''),
  cup: (c, parts) => line('M85 42q26 -2 21 19q-3 11 -20 13',c,8)+path('M24 41h65l-7 38q-2 12 -14 12H44q-12 0 -14 -12Z',c)+ellipse(56,42,33,9,'#e4eff2')+ellipse(56,42,25,5,'#b5ced8')+shine(40,62,5,12)+(parts.includes('star')?sparkle(61,66,12):''),
  apple: () => path('M60 45q-28 -17 -39 8q-13 28 14 49q11 9 25 3q23 5 35 -23q11 -29 -11 -40q-11 -5 -24 3z',tones.red)+line('M60 46q2 -13 -2 -20','#875d4a',4)+leaves(62,39)+shine(38,58,7,10),
  pear: () => path('M60 28q16 0 21 30q28 10 21 32q-5 17 -41 18q-36 -1 -43 -18q-7 -19 21 -32q5 -30 21 -30z','#97b96a')+line('M60 32q-4 -10 4 -15','#896443',4)+leaves(62,28)+shine(52,67,7,12),
  plum: () => ellipse(60,67,31,38,'#8769ae')+path('M66 33Q80 75 56 103Q90 98 91 69Q93 46 66 33Z','#6a4a91')+leaves(60,34)+shine(48,53,7,9),
  lemon: () => path('M19 62Q29 33 61 31Q93 30 99 54Q113 58 105 67Q94 90 66 95Q35 98 21 78Q9 73 19 62Z','#eaca55')+shine(50,50,13,6)+leaves(82,37),
  balloon: c => ellipse(60,48,29,33,c)+path('M60 76l-7 12h14z',c)+line('M60 86q16 12 -2 24','#997d89',2)+shine(49,34,6,11),
  duck: () => ellipse(57,78,34,24,'#efb953')+circle(74,48,20,'#f5cc64')+ellipse(63,77,17,9,'#f8d875')+circle(78,45,3,dark)+path('M89 49l21 6l-21 7z','#e7955b')+rect(42,99,20,5,'#e7955b',3),
  doll: () => path('M60 60l30 42H30Z','#b388c5')+circle(60,43,20,'#b97750')+circle(60,48,16,'#f6cbac')+face(60,46)+ribbon(tones.blue)+rect(40,103,14,7,'#754e82',4)+rect(67,103,14,7,'#754e82',4),
  stack: () => rect(28,86,64,17,'#79ab80',8)+rect(34,70,52,17,'#81b7d8',8)+rect(41,54,38,17,'#dc92b0',8)+rect(48,38,24,17,'#efb65d',8)+circle(60,31,9,'#f4d98b'),
  jug: () => line('M76 44q31 1 24 23q-5 9 -15 10','#85a9a9',8)+path('M39 30h36l-3 28q20 13 9 32q-10 17 -34 13q-27 -4 -21 -28q3 -9 15 -18Z','#81aba8')+ellipse(55,30,19,5,'#d7ece9')+shine(43,75,6,12),
  plate: () => ellipse(60,70,45,27,'#7d91bc')+ellipse(60,68,39,21,'#d8e4ee')+ellipse(60,68,24,11,'#b9cde1'),
  spoon: () => ellipse(45,40,17,24,'#b98e5d')+rect(56,53,12,54,'#caa67a',6)+shine(42,33,5,8),
  leaf: () => path('M24 82q3 -56 74 -51q-3 57 -64 63z','#78a978')+line('M29 100Q62 59 86 45m-13 9l-20 -7m7 23l26 -6','#dcebc6',2.5),
  bell: () => path('M25 86q12 -12 15 -36q3 -16 20 -17q17 1 20 17q3 24 15 36z','#e9ac47')+ellipse(60,86,36,9,'#ae7430')+circle(60,89,7,'#f8cc69')+rect(56,23,8,15,'#a97946',4)+shine(49,58,5,14),
  drum: () => rect(25,48,70,43,'#5d9fba',10)+ellipse(60,90,35,12,'#d2a970')+ellipse(60,48,35,12,'#f3d4a1')+line('M29 54l17 35l16 -34l15 34l13 -35','#fff1cc',3)+line('M53 40l32 -20m-22 25l35 -12','#a57756',4),
  rattle: () => line('M60 61v34','#ad7c62',10)+circle(60,93,9,'#bf896c')+circle(60,46,25,'#83b9cc')+path('M36 44q23 18 48 0v8q-22 22 -46 1z','#f2d28b')+shine(54,33,9,4),
  cat: () => circle(58,78,23,'#d69462')+path('M30 52l3 -29l19 11h15l16 -11l4 29q1 21 -29 21q-28 0 -28 -21z','#e1ab79')+face(59,53)+line('M77 91q22 9 24 -11','#d69462',6)+ellipse(54,99,22,6,'#efbe8e'),
  dog: () => ellipse(54,80,25,26,'#b9896d')+circle(59,50,25,'#caa283')+ellipse(37,53,12,20,'#8f674f')+ellipse(83,53,12,20,'#8f674f')+ellipse(61,62,13,10,'#edc6a0')+face(60,56)+circle(61,62,3,dark)+ellipse(53,102,27,5,'#caa283'),
  bird: () => ellipse(58,74,34,24,'#77a2bc')+circle(80,49,17,'#8ab5cb')+path('M93 49l17 7l-16 5z','#d6a047')+ellipse(56,72,19,10,'#b0cfdb')+circle(84,45,2.4,dark)+line('M47 99h39','#ac7959',4),
  hat: () => path('M24 75q0 -43 37 -43q36 0 36 43z','#ad84b7')+rect(22,70,77,16,'#d4a2be',7)+circle(60,29,11,'#d4a2be'),
  boot: () => path('M41 29h44v42q0 16 18 17v16H31q-18 0 -16 -15q2 -11 26 -13z','#c8956c')+rect(37,29,51,12,'#dbb08e',6)+line('M18 97h83','#8e6b57',4),
  scarf: () => path('M23 41h74v18H78v43H61V59H23Z','#73a8c5')+line('M28 45h65m-27 40v13','#a7cbe1',3),
  coat: () => path('M39 29l21 -7l21 7l19 25l-13 10l-7 -8v48H40V56l-7 8l-13 -10z','#e2a47d')+line('M60 33v68m-15 -21h12m6 0h13','#976953',3),
  box: (_,parts) => rect(21,50,78,47,'#bd8fb6',6)+rect(22,47,77,13,'#ae7db0',4)+(parts.includes('open')?path('M20 51l8-27l66-11l5 34z','#d3bad7'):rect(17,39,86,16,'#c5a2c5',6))+rect(54,59,12,14,'#d5a558',3),
  faucet: () => rect(30,72,15,24,'#94a5ac',4)+line('M37 78V58Q37 39 58 39h20v10','#8ca6ab',10)+line('M42 47v-17m-9 3h17','#81949f',7)+line('M78 59v21m-7 -17v17m13 -13v13','#65b3d5',3),
  towel: () => rect(24,27,72,72,'#78adab',7)+rect(28,35,64,8,'#b7d6c4',3)+rect(28,85,64,8,'#b7d6c4',3)+line('M30 48h59m-59 5h59','#77a496',2),
  watering: () => line('M84 48q39 1 20 34q-6 10-17 13','#79a7c0',7)+path('M37 68L17 48L8 55L34 89Z','#84b7cd')+rect(30,55,65,44,'#73a9c3',13)+ellipse(63,57,32,7,'#c2e2e8'),
  plant: () => path('M37 71h47l-7 30H44z','#c88a6b')+line('M60 76V37','#84a77c',5)+leaves(55,60)+circle(60,31,13,'#dda3b3')+circle(60,31,6,'#f3d276'),
  water: () => [34,61,86].map((x,i)=>path(`M${x} ${34+i*4}q-18 23-15 32q3 10 15 11q12-1 15-11q2-10-15-32z`,'#74bedb')).join(''),
  hands: () => ellipse(41,60,22,20,'#dca77b')+ellipse(79,60,22,20,'#dca77b')+ellipse(41,62,12,9,'#ecc19e')+ellipse(79,62,12,9,'#ecc19e'),
  book: (_,parts) => parts.includes('open')
    ? path('M12 40q21-13 47 3q25-15 49-3v47q-24-12-48 2q-26-15-48-1z','#e8d4aa')+line('M60 43v46m-36-33 24 4m-24 5 24 4m24-9 24-4m-24 13 24-4','#b29470',2)
    : rect(31,23,57,77,'#ac80ae',6)+rect(30,26,9,68,'#8f668d',4)+sparkle(62,60,14),
  paper: () => path('M31 21h53l10 12v66H31z','#f5e8c9')+path('M84 21v12h10z','#e3d0a8'),
  paint: () => line('M36 96l40-55','#9a7154',8)+path('M72 43q-2-17 15-25q9 12-4 26z','#c083a0'),
  seed: () => ellipse(60,64,16,24,'#b58b63')+line('M57 77q7-16 7-26','#d8b586',3),
  circle:c=>circle(60,60,37,c),
  square:c=>rect(24,24,72,72,c,7),
  open: () => rect(30,24,62,77,'#c39671',7)+rect(37,32,48,69,'#716174',4)+path('M43 35l27-10v63l-27 12z','#ddb48e')+circle(63,65,3,'#e1b457'),
  garden: () => rect(10,36,100,67,'#dcecf4',9)+path('M10 73q54-16 100 0v30H10z','#a7c790')+sub('flower-pink',15,52,44)+sub('flower-gold',62,58,40),
  welcome: () => path('M19 63l30-22v14h42v17H49v15z','#83ae9e'),
  flower: c => line('M60 105V61','#70a679',5)+leaves(61,88)+[0,1,2,3,4].map(i=>circle(60+20*Math.cos(i*1.2566),50+20*Math.sin(i*1.2566),12,c)).join('')+circle(60,50,11,gold),
  star: () => sparkle(60,57,41)+sparkle(55,51,14,'#ffedb3'),
  firefly: () => ellipse(60,66,13,22,'#e7c33e')+ellipse(44,52,18,9,'#b1d9d8')+ellipse(76,52,18,9,'#b1d9d8')+circle(60,45,10,'#697f6f')+circle(60,73,8,'#f8ec8a'),
  mat: () => rect(15,58,90,33,'#ba8cae',14)+rect(26,64,68,20,'#debbd8',10),
  basket: () => line('M35 65Q60 14 85 65','#b48357',7)+path('M25 56h70l-10 39H35Z','#e0ac70')+line('M34 69h52m-46 11h40','#b38253',3),
  garage: c => path('M15 50l45 -28l45 28v46H15Z',c)+rect(32,55,56,41,'#cce0e4',10)+rect(36,59,48,37,'#536d7a',8),
  window: c => rect(27,25,66,75,c,17)+rect(34,32,52,61,'#dcebf4',12)+line('M60 35v55M37 61h46',c,4),
  desk: () => rect(4,17,112,83,'#edce99',12)+rect(11,24,98,69,'#f8e4b5',8)+sub('apple',14,22,28)+sub('cup',46,16,28)+sub('leaf',78,22,27)+sub('ball',27,55,30)+sub('bell',70,54,28),
  rabbit: () => ellipse(38,36,10,24,'#d2beb5')+ellipse(75,34,10,23,'#d2beb5')+ellipse(38,38,5,17,'#edb6ba')+ellipse(75,34,5,17,'#edb6ba')+circle(59,59,24,'#e1cebf')+ellipse(59,88,25,18,'#cfb9af')+face(58,58),
  berry: () => circle(59,66,34,'#ab5a85')+leaves(52,34)+shine(50,57,8,6),
  wheel: () => circle(60,60,34,dark)+circle(60,60,19,'#c3d3db')+circle(60,60,9,'#7190a1'),
  ear: () => circle(60,59,26,'#b98564')+circle(60,59,15,'#f0c1a0'),
  bow: () => '<g transform="translate(-22 -77) scale(1.35)">'+ribbon(tones.pink)+'</g>',
  roof: () => path('M22 75l38-40l38 40z','#78a9ca'),
  door: () => rect(38,29,44,67,'#b78768',10)+circle(72,65,4,'#efd287'),
  wing: () => circle(35,60,13,'#dec683')+circle(85,60,13,'#dec683'),
  lamp: (_,parts) => line('M60 95V54','#986f69',7)+ellipse(60,97,19,6,'#986f69')+path('M30 59l16-28h28l16 28z',parts.includes('blue')?'#7fabca':'#d89aaa'),
  room: (_,parts) => rect(2,13,116,95,'#f4daca',12)+rect(4,82,112,26,'#debda7',8)+sub('desk',4,35,61)+sub(parts.includes('changed')?'lamp-blue':'lamp',67,26,46)+sub(parts.includes('changed')?'ball-blue':'ball',63,76,29),
  hide: (_,parts) => hiding(parts[0]),
  fair: (c, parts) => rect(2,15,116,92,'#e1f1f4',14)+path('M2 78q36 -17 63 -3q20 7 53 -6v30q0 8 -8 8H10q-8 0 -8 -8Z','#a5c592')+sub(parts.includes('changed')?'house-pink':'house-blue',8,32,52)+(parts.includes('no')?'':sub(parts.includes('changed')?'ball-blue':'ball',40,74,29))+rect(88,56,8,32,'#996f50',4)+circle(92,49,20,parts.includes('changed')?'#d5a569':'#71a078'),
};

function hiding(place) {
  const lawn=rect(2,14,116,94,'#e9ebd8',12)+rect(2,73,116,35,'#b3c695',10);
  const shrub=(x,y)=>circle(x,y,17,'#75a384')+circle(x+13,y+6,16,'#89b189')+circle(x-13,y+7,15,'#89b189');
  const crate=(x,y)=>rect(x,y,40,26,'#d5ad80',6)+line('M'+(x+4)+' '+(y+6)+'h32m-32 12h32','#b58e68',3);
  if(place==='bush') return lawn+sub('rabbit',33,23,63)+shrub(64,65)+sub('flower-gold',11,63,28)+sub('leaf',93,58,24);
  if(place==='box') return lawn+sub('cat',54,26,60)+crate(60,53)+sub('plant',6,42,38)+sub('ball',31,74,24);
  if(place==='forest') return lawn+sub('rabbit',6,24,48)+sub('cat',64,32,54)+shrub(31,60)+crate(68,57)+sub('flower-pink',47,51,25);
  if(place==='garden') return lawn+sub('dog',24,30,76)+rect(40,57,45,34,'#d7b697',5)+sub('leaf',7,64,26)+sub('flower-pink',89,65,24);
  return lawn+sub('duck',7,45,54)+sub('bird',74,25,43)+crate(6,67)+shrub(81,62)+sub('flower-gold',46,70,25);
}

export function painting(id) {
  const [name,...parts] = id.split('-');
  if(id==='open-box') return painting('box-open');
  if(id.endsWith('-left')) return `<g transform="translate(120 0) scale(-1 1)">${painting(id.slice(0,-5))}</g>`;
  const color = tones[parts[0]] ?? ({ball:tones.red,car:tones.red,cup:'#7bab90',house:tones.blue}[name] ?? gold);
  return shadow + draw[name]?.(color,parts);
}

export function picture(id) {
  const node = document.createElementNS(svg,'svg');
  node.setAttribute('viewBox','0 0 120 120');
  node.setAttribute('aria-hidden','true');
  node.setAttribute('focusable','false');
  node.innerHTML = painting(id);
  return node;
}

export const regions = {
  bear:{ ears:[[32,25],[69,25]], paws:[[29,72],[70,72]], bow:[[50,65]] },
  car:{ wheels:[[30,73],[72,73]], window:[[55,44]], light:[[79,61]], body:[[50,62]] },
  house:{ roof:[[50,34]], door:[[52,75]], window:[[34,59]] },
  ball:{ center:[[53,51]], edges:[[23,47],[74,52]] },
  desk:{ apple:[[23,31]],cup:[[50,27]],leaf:[[76,31]],ball:[[35,58]],bell:[[69,57]] },
  'hide-bush':{rabbit:[[51,36]],flower:[[19,73]],leaf:[[84,72]]},
  'hide-box':{cat:[[70,39]],plant:[[20,61]],ball:[[35,75]]},
  'hide-forest':{rabbit:[[21,33]],cat:[[79,42]],flower:[[50,62]]},
  'hide-garden':{dog:[[55,37]],leaf:[[16,70]],flower:[[86,73]]},
  'hide-market':{duck:[[30,55]],bird:[[84,35]],flower:[[47,77]]},
  room:{lamp:[[75,44]],ball:[[65,73]],desk:[[26,56]]},
  fair:{ roof:[[28,41]],ball:[[46,73]],tree:[[77,45]],door:[[31,64]] },
};
export const artTitle = id => titles[id] ?? titles[id.split('-')[0]] ?? id;
