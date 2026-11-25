import {artTitle,picture} from '../memory/art.js';
import {mark} from '../writing/pictures.js';
import {svg} from '../writing/ui.js';

const extra={
  'ball-big':['Большой мяч','ball-red',1.06],
  'ball-small':['Маленький красный мяч','ball-red',.62],
  'ball-blue-small':['Маленький синий мяч','ball-blue',.62],
  'ball-blue-big':['Большой синий мяч','ball-blue',1.06],
  'ball-red-big':['Большой красный мяч','ball-red',1.06],
  balloon:['Красный шарик','balloon-red'], 'balloon-blue':['Синий шарик','balloon-blue'],
  boots:['Ботинки','boot'], cat:['Кот','cat'], 'cat-sleep':['Кошка спит','cat'],
  'cat-hop':['Кошка прыгает','cat'], 'dog-sleep':['Собака спит','dog'], 'dog-run':['Собака бежит','dog'],
  'rabbit-hop':['Зайчик прыгает','rabbit'], 'bear-walk':['Мишка идёт','bear'], 'bear-sleep':['Мишка спит','bear'],
  sleep:['Спит',null],hop:['Прыгает',null],sit:['Сидит',null],run:['Бежит',null],play:['Играет',null],
  fly:['Летит','bird'], swim:['Плывёт','fish'], 'red-ball-roll':['Красный мяч катится','ball-red'],
  'blue-ball-roll':['Синий мяч катится','ball-blue'],'red-ball-still':['Красный мяч лежит','ball-red'],
  'bird-fly':['Птичка летит','bird'],'bird-sit':['Птичка сидит','bird'], 'fish-swim':['Рыбка плывёт','fish'],
  'car-go':['Машинка едет','car'], som:['Сом','fish'], whale:['Кит',null], goat:['Коза',null],
  braid:['Коса',null], bowl:['Миска','plate'], triangle:['Треугольник',null],
  turtle:['Черепаха',null], elephant:['Слон',null], rain:['Дождь',null],
  'hands-clap':['Ладушки','hands'],'magpie':['Сорока','bird'],
  clap:['Хлопок','hands'],tap:['Барабан','drum'],'wash':['Умывание','faucet'],
  'story-lad':['Ладушки','hands'], 'story-sor':['Сорока-белобока','bird'], 'story-water':['Водичка','faucet'],
  short:['Короткая дорожка',null],long:['Длинная дорожка',null],
};
const motion={
  clap:'play',tap:'play',flower:'play',wash:'fly',magpie:'hop',
  sleep:'sleep',sit:'sit',hop:'hop',run:'run',play:'play',fly:'fly',swim:'swim',
  'cat-sleep':'sleep','cat-hop':'hop','dog-sleep':'sleep','dog-run':'run','rabbit-hop':'hop',
  'bear-walk':'run','bear-sleep':'sleep','red-ball-roll':'roll','blue-ball-roll':'roll','bird-fly':'fly',
  'fish-swim':'swim','car-go':'run','hands-clap':'play','story-lad':'play','story-sor':'hop','story-water':'fly',
};
const custom={
  'vowel-a':'<ellipse cx="60" cy="58" rx="27" ry="32" fill="#dd8ca7"/><ellipse cx="60" cy="56" rx="19" ry="26" fill="#73475b"/>',
  'vowel-u':'<ellipse cx="60" cy="62" rx="22" ry="20" fill="#dd8ca7"/><ellipse cx="60" cy="61" rx="11" ry="13" fill="#73475b"/>',
  'vowel-o':'<ellipse cx="60" cy="60" rx="28" ry="26" fill="#dd8ca7"/><ellipse cx="60" cy="58" rx="19" ry="18" fill="#73475b"/>',
  'vowel-i':'<ellipse cx="60" cy="62" rx="36" ry="15" fill="#dd8ca7"/><ellipse cx="60" cy="61" rx="29" ry="9" fill="#fff2dd"/>',
  'consonant-m':'<path d="M28 60Q48 42 60 55Q72 43 92 60Q64 80 28 60Z" fill="#d58daa"/><path d="M30 60Q60 65 89 60" stroke="#803f62" stroke-width="3" fill="none"/>',
  magpie:'<path d="M25 62Q44 38 79 54L106 25Q112 20 107 40L89 81Q44 106 25 62Z" fill="#3d4862"/><ellipse cx="58" cy="66" rx="23" ry="17" fill="#f0edf0"/><circle cx="28" cy="47" r="17" fill="#3d4862"/><path d="M14 45l-13 7 15 4Z" fill="#7a665b"/><circle cx="23" cy="43" r="3" fill="#f3dfb4"/>',
  drip:'<path d="M60 19Q17 69 34 88Q61 114 87 88Q105 70 60 19Z" fill="#81bed6"/><ellipse cx="49" cy="72" rx="8" ry="11" fill="#d6edf2"/>',
  knock:'<path d="M31 96L30 18H91V96Z" fill="#c69d7c"/><circle cx="77" cy="58" r="8" fill="#efc77e"/><path d="M90 36l18-9m-14 27 17 1m-18 11 17 8" stroke="#d08b6b" stroke-width="3"/>',
  human:'<path d="M52 31Q42 33 43 54L36 63L45 68V88H68Q83 82 83 56Q83 31 52 31Z" fill="#e5b294"/><path d="M80 56Q92 46 97 54M84 66Q100 59 107 66" stroke="#7999b4" stroke-width="4" fill="none"/>',
  other:'<path d="M14 64h14l9-25 14 45 11-29 11 12h25" stroke="#8ea785" stroke-width="7" fill="none" stroke-linecap="round"/>',
  rest:'<path d="M36 60h49" stroke="#a79ab0" stroke-width="13" stroke-linecap="round"/>',
  triangle:'<path d="M60 18L103 98H17Z" fill="#e8b96d" stroke="#b1855a" stroke-width="4" stroke-linejoin="round"/>',
  turtle:'<ellipse cx="57" cy="69" rx="39" ry="25" fill="#75a774"/><circle cx="99" cy="64" r="14" fill="#a7b77e"/><circle cx="103" cy="60" r="3" fill="#645365"/><path d="M31 89h18m24 1h20m-55-30 17 10 19-13" stroke="#506b57" stroke-width="7" stroke-linecap="round" fill="none"/>',
  elephant:'<ellipse cx="55" cy="63" rx="36" ry="31" fill="#9a9fb7"/><ellipse cx="78" cy="57" rx="27" ry="29" fill="#afacc6"/><ellipse cx="72" cy="58" rx="16" ry="21" fill="#d0bacb"/><path d="M95 61v28q6 11 16 1M35 84v16m21-14v15" stroke="#9a9fb7" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="90" cy="53" r="4" fill="#665168"/>',
  whale:'<path d="M15 73Q28 32 71 45Q90 53 94 68Q105 54 114 56Q112 75 96 83Q61 119 15 73Z" fill="#79b4ce"/><path d="M53 40q0-15-12-19m13 18q4-15 15-17" stroke="#8ac5d7" stroke-width="4" fill="none"/><circle cx="38" cy="65" r="4" fill="#43586b"/>',
  goat:'<ellipse cx="51" cy="67" rx="34" ry="21" fill="#d5cfbf"/><ellipse cx="81" cy="53" rx="20" ry="22" fill="#e3d7c4"/><path d="M70 39L65 20m26 17 8-18M29 79v19m34-18v18" stroke="#93816f" stroke-width="7" stroke-linecap="round"/><circle cx="85" cy="49" r="3" fill="#5b4e58"/>',
  braid:'<path d="M51 18Q88 24 74 49Q96 65 62 76Q76 91 54 108Q31 98 46 79Q16 67 39 47Q24 21 51 18Z" fill="#af7c5a"/><path d="M35 48l42 5M39 76l35 1M45 94h18" stroke="#e0a27c" stroke-width="6"/>',
};
export const artLabel=id=>extra[id]?.[0]??artTitle(id);
const hero=new URL('../../images/lumi-transparent.png',import.meta.url);
export function literacyArt(id){
  let graphic;
  if(['gold','blue','pink','green'].includes(id)){
    graphic=svg('svg',{viewBox:'0 0 120 120','aria-hidden':'true'});
    const color={gold:'#eac06e',blue:'#81b4d3',pink:'#d891b3',green:'#8ebd92'}[id];
    graphic.append(svg('path',{d:'M60 19Q77 46 91 57Q109 80 91 96Q66 119 37 98Q19 83 29 60Z',fill:color}),svg('circle',{cx:53,cy:63,r:13,fill:'#fff8e2'}));
  }else if(custom[id]){graphic=svg('svg',{viewBox:'0 0 120 120','aria-hidden':'true'});graphic.innerHTML=custom[id];}
  else if(['short','long'].includes(id)) {
    graphic=svg('svg',{viewBox:'0 0 120 120','aria-hidden':'true'});
    graphic.append(svg('path',{d:id==='short'?'M39 62H82':'M12 62H108',stroke:'#b890b8','stroke-width':14,'stroke-linecap':'round'}));
  } else if(motion[id]&&!extra[id]?.[1]) {
    graphic=document.createElement('img');graphic.src=hero;graphic.alt='';
  } else if(['fish','som','swim','fish-swim'].includes(id)) {
    graphic=svg('svg',{viewBox:'0 0 120 120','aria-hidden':'true'});graphic.append(mark('fish',60,60,100));
  } else {
    graphic=picture(extra[id]?.[1]??id);
    const scale=extra[id]?.[2];
    if(scale)graphic.firstElementChild?.parentNode?.setAttribute('style','transform:scale('+scale+')');
  }
  if(motion[id])graphic.classList.add('literacy-action','literacy-action-'+motion[id]);
  return graphic;
}
export const canIllustrate=id=>['gold','blue','pink','green'].includes(id)||Object.hasOwn(extra,id)||Object.hasOwn(custom,id)||artTitle(id)!==id;
