import {svg} from './ui.js';

const circle=(x,y,r,fill)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
const ellipse=(x,y,rx,ry,fill)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}"/>`;
const rect=(x,y,w,h,fill,rx=0)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`;
const path=(d,fill,stroke='none',w=2)=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const leaf='#78aa80', gold='#edb849', cocoa='#57516c', aqua='#74bfd0', coral='#e78e92', cream='#fff0c6';
const eyes=(x,y)=>circle(x-5,y,1.8,cocoa)+circle(x+5,y,1.8,cocoa);
const petals=(color=coral)=>Array.from({length:7},(_,i)=>ellipse(0,-17,8,11,color).replace('<ellipse ',`<ellipse transform="rotate(${i*360/7})" `)).join('')+circle(0,0,10,gold);
const star=path('M0-26 L7-8 27-8 11 4 17 25 0 13-17 25-11 4-27-8-7-8Z',gold);
const wheel=circle(0,0,26,cocoa)+circle(0,0,19,'#b8cbd3')+circle(0,0,10,'#60748e');
const apple=path('M0-13C-32-36-40 8-16 29Q-4 34 0 27Q10 34 22 24C42 6 29-32 0-13Z','#d98175')+path('M1-14Q-3-26 0-35','none','#8f654d',4)+path('M1-22Q14-38 25-25Q14-16 1-22Z',leaf);
const house=rect(-27,-5,54,42,'#ebcb93',5)+path('M-34 1L0-32L34 1Z','#c47988')+rect(-7,14,14,23,'#9c725f',5)+rect(11,8,11,12,aqua,3);
const cloud=path('M-33 18Q-49 12-40-2Q-34-12-26-10Q-22-30-7-28Q3-31 13-17Q32-21 37-8Q53 0 44 12Q40 19 23 19Z','#dbeaf1');
const sun=circle(0,0,28,'#f3c966')+circle(-8,-8,7,'#fff0ae');
const balloon=ellipse(0,-3,25,32,'#a3d6de')+ellipse(-7,-14,6,10,'#d8eff1')+path('M0 25l-7 13h14Z','#6abac9');
const pics={
  flower:petals(),flowerGold:petals('#f6cc79'),sun,balloon,star,apple,wheel,cloud,house,
  garage:rect(-35,-4,70,45,'#9fc3a8',7)+path('M-38 0L0-30L38 0Z','#84a59c')+rect(-23,7,46,34,'#5e7482',7)+path('M-15 18H15M-15 26H15','none','#a5c0c3',2),
  leaf:path('M-36 20Q-33-32 34-24Q19 30-35 22Z',leaf)+path('M-32 23Q-3-6 26-19','none','#c6e0b0',3),
  carrot:path('M-21-4Q-7-29 12-7Q18 1 22 32Q0 21-21-4Z','#e19556')+path('M-17-13Q-33-38-4-27Q-6-43 10-34Q5-18-5-11Z',leaf),
  butterfly:path('M-2 0Q-24-42-38-24Q-44-6-23 4Q-39 37-14 26Q-3 18 0 6Q5 28 22 27Q39 20 25 4Q44-9 39-24Q15-41 2 0Z','#c896ca')+ellipse(0,1,4,18,cocoa)+circle(-24,-12,5,'#ffe7a7')+circle(25,-12,5,'#ffe7a7'),
  rabbit:ellipse(-13,-19,7,22,'#dfb4a5')+ellipse(13,-19,7,22,'#dfb4a5')+ellipse(-13,-21,3,12,'#efd2c4')+ellipse(13,-21,3,12,'#efd2c4')+circle(0,8,24,'#eac9af')+eyes(0,5)+circle(0,12,4,'#b97780'),
  car:rect(-36,-2,72,24,'#e18879',7)+path('M-24-2L-15-22H14L26-2Z','#e18879')+path('M-19-5L-12-17H11L18-5Z','#d7ecf4')+circle(-22,20,9,cocoa)+circle(23,20,9,cocoa)+circle(-22,20,4,'#c7d9df')+circle(23,20,4,'#c7d9df'),
  bee:ellipse(0,-13,11,16,'#dbeaf3')+ellipse(9,-13,11,16,'#dbeaf3')+ellipse(0,3,27,15,'#eeb953')+path('M-10-10V15M4-11V16','none',cocoa,6)+circle(18,3,2,cocoa),
  fish:path('M-21-3L-40-19V19L-21 6Q8 32 39 1Q8-32-21-3Z','#7bbdcc')+circle(23,-2,3,cocoa)+path('M3-11Q-6 0 3 10','none','#d4e9ea',3),
  snail:ellipse(-4,15,36,11,'#aab988')+ellipse(21,0,12,17,'#aab988')+circle(-8,-3,21,'#d68b80')+path('M-7-7q11 4 2 13q-13 4-15-8q0-15 17-16','none','#f0c6a8',3)+path('M16-13l-3-13m13 14 5-14','none','#80936c',3)+circle(25,-2,2,cocoa),
  firefly:ellipse(-11,-9,14,9,'#bae2dc')+ellipse(11,-9,14,9,'#bae2dc')+ellipse(0,7,11,18,gold)+circle(0,-9,8,cocoa),
  rock:path('M-32 12L-24-10-3-20 20-18 32 6 20 18H-23Z','#b5a8b5')+path('M-23-7L-6-14 13-13','none','#dbcbd5',4),
  tree:rect(-5,-4,10,32,'#b38261',4)+circle(-14,-10,18,leaf)+circle(12,-13,18,'#81ac77')+circle(0,-23,19,'#95ba81'),
  chest:rect(-30,-11,60,34,'#af805c',7)+rect(-32,-15,64,13,'#d5a16c',5)+rect(-5,-5,10,14,gold,3),
  boat:path('M-36 10H37L24 25H-25Z','#c58b65')+path('M0 9V-37L28 7Z','#e5aab0')+path('M-4 6V-29L-27 5Z','#f2d48b'),
  basket:path('M-20 0Q-18-29 0-29Q18-29 20 0','none','#a97b54',5)+path('M-31-3H31L22 24H-22Z','#d7ad77')+path('M-22 5H22M-19 13H19','none','#f6d8a8',2),
  gift:rect(-28,-13,56,40,'#d69eb4',4)+rect(-32,-15,64,11,'#c989a8',4)+path('M0-12V25 M0-14Q-31-19-17-31Q-5-35 0-14Q16-38 21-26Q30-17 0-14','none','#fbe0a2',5),
  pencil:path('M-9 22V-15L0-36 9-15V22Z','#e9b84e')+rect(-9,22,18,9,'#d7899f',3)+path('M-9-14L0-36 9-14Z','#edd1a5')+path('M-4-26L0-36 4-26Z',cocoa),
  chestnut:ellipse(0,0,18,23,'#b48265')+ellipse(0,-8,14,7,'#ddad7e'),
};
const media=new URL('./media/',import.meta.url);
export function mark(id,x,y,size=78){
  const node=svg('g',{transform:`translate(${x} ${y}) scale(${size/80})`});
  if(id==='lumi'){
    node.append(svg('image',{href:new URL('lumi-makers.webp',media),x:-37,y:-46,width:74,height:86}));
  }else node.innerHTML=pics[id]??'';
  return node;
}
export const lineData=points=>points.map(({x,y},i)=>(i?'L':'M')+x+' '+y).join(' ');
export function polyline(points, attrs={}) {
  return svg('path',{d:lineData(points),fill:'none','stroke-linecap':'round','stroke-linejoin':'round',...attrs});
}
