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
  car: (c, parts) => rect(24,62,76,27,c,10)+path('M35 62l13 -23h35l13 23z',c)+path('M42 60l10 -16h26l10 16z','#daeef8')+line('M65 44v16',c,3)+circle(36,87,12,dark)+circle(86,87,12,dark)+circle(36,87,5,'#dbe9f0')+circle(86,87,5,'#dbe9f0')+rect(91,68,8,8,'#fff1b0',3)+(parts.includes('star')?sparkle(60,74,9):''),
  bear: (c, parts) => ellipse(60,83,24,25,'#ba8664')+circle(37,31,13,'#bb8864')+circle(83,31,13,'#bb8864')+circle(37,31,7,'#f1cfab')+circle(83,31,7,'#f1cfab')+circle(60,54,28,'#dca77b')+ellipse(60,63,15,11,'#f4d1a7')+face(60,56)+circle(60,63,3,dark)+ellipse(35,86,12,9,'#dca77b')+ellipse(85,86,12,9,'#dca77b')+ellipse(47,104,11,6,'#ebba91')+ellipse(73,104,11,6,'#ebba91')+(parts.includes('plain')?'':parts.includes('scarf')?rect(41,73,38,11,'#58a3bd',6)+rect(69,75,9,24,'#58a3bd',4):ribbon(parts.includes('blue')?tones.blue:tones.pink)),
  house: (c, parts) => rect(28,49,64,54,'#f3dca9',4)+path('M17 52L60 17L103 52Q102 57 96 57H24Q18 56 17 52Z',c)+rect(54,73,18,30,'#b88468',8)+circle(66,89,2,'#f9db94')+rect(34,63,14,15,parts.includes('shut')?'#9b7499':'#84bdd6',4)+line('M41 64v13m-6 -6h12','#f9f1db',1.4),
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
  flower: c => line('M60 105V61','#70a679',5)+leaves(61,88)+[0,1,2,3,4].map(i=>circle(60+20*Math.cos(i*1.2566),50+20*Math.sin(i*1.2566),12,c)).join('')+circle(60,50,11,gold),
  star: () => sparkle(60,57,41)+sparkle(55,51,14,'#ffedb3'),
  firefly: () => ellipse(60,66,13,22,'#e7c33e')+ellipse(44,52,18,9,'#b1d9d8')+ellipse(76,52,18,9,'#b1d9d8')+circle(60,45,10,'#697f6f')+circle(60,73,8,'#f8ec8a'),
  mat: () => rect(15,58,90,33,'#ba8cae',14)+rect(26,64,68,20,'#debbd8',10),
  basket: () => line('M35 65Q60 14 85 65','#b48357',7)+path('M25 56h70l-10 39H35Z','#e0ac70')+line('M34 69h52m-46 11h40','#b38253',3),
  garage: c => path('M15 50l45 -28l45 28v46H15Z',c)+rect(32,55,56,41,'#cce0e4',10)+rect(36,59,48,37,'#536d7a',8),
  window: c => rect(27,25,66,75,c,17)+rect(34,32,52,61,'#dcebf4',12)+line('M60 35v55M37 61h46',c,4),
  desk: () => rect(4,17,112,83,'#edce99',12)+rect(11,24,98,69,'#f8e4b5',8)+sub('apple',14,22,28)+sub('cup',46,16,28)+sub('leaf',78,22,27)+sub('ball',27,55,30)+sub('bell',70,54,28),
  fair: (c, parts) => rect(2,15,116,92,'#e1f1f4',14)+path('M2 78q36 -17 63 -3q20 7 53 -6v30q0 8 -8 8H10q-8 0 -8 -8Z','#a5c592')+sub(parts.includes('changed')?'house-pink':'house-blue',8,32,52)+sub(parts.includes('changed')?'ball-blue':'ball',40,74,29)+rect(88,56,8,32,'#996f50',4)+circle(92,49,20,parts.includes('changed')?'#d5a569':'#71a078'),
};

export function painting(id) {
  const [name,...parts] = id.split('-');
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
  fair:{ roof:[[28,41]],ball:[[46,73]],tree:[[77,45]],door:[[31,64]] },
};
export const artTitle = id => titles[id] ?? titles[id.split('-')[0]] ?? id;
