const catalog={
 ball:['мяч','toy','circle','red'],car:['машинка','toy','rectangle','blue','wheel window'],bear:['медвежонок','toy','round','cream','ear bow scarf'],
 doll:['кукла','toy','oval','rose'],block:['кубик','toy','square','gold'],top:['юла','toy','triangle','red'],pyramid:['пирамидка','toy','triangle','rose'],
 robot:['робот','toy','rectangle','mint'],train:['вагон','toy','rectangle','red'],
 circle:['круг','shape','circle','blue'],square:['квадрат','shape','square','blue'],triangle:['треугольник','shape','triangle','blue'],oval:['овал','shape','oval','blue'],
 apple:['яблоко','fruit','round','red'],pear:['груша','fruit','oval','mint'],banana:['банан','fruit','crescent','gold'],plum:['слива','fruit','oval','purple'],
 cup:['чашка','dish','round','rose','handle'],plate:['тарелка','dish','circle','blue'],spoon:['ложка','dish','oval','gray','','eat'],
 kettle:['чайник','dish','round','mint','lid spout'],bowl:['миска','dish','round','cream'],lid:['крышка','part','circle','mint','','close'],
 scarf:['шарфик','clothes','rectangle','blue'],hat:['шапка','clothes','round','rose'],boot:['ботинок','clothes','boot','brown'],
 mitten:['варежка','clothes','oval','purple'],shirt:['футболка','clothes','square','gold'],cat:['кошка','animal','round','brown'],
 bunny:['зайчик','animal','oval','cream'],dog:['щенок','animal','round','cream'],duck:['уточка','animal','oval','gold'],
 butterfly:['бабочка','animal','wings','purple'],bird:['птичка','animal','oval','blue'],
 flower:['цветок','garden','round','rose','petal leaf'],leaf:['листик','garden','oval','mint'],balloon:['шарик','toy','oval','rose','ribbon'],
 ribbon:['ленточка','part','rectangle','rose'],house:['домик','place','square','cream','roof door window'],wheel:['колесо','part','circle','gray'],
 window:['окно','part','square','blue'],ear:['ушко','part','round','cream'],bow:['бантик','part','wings','rose'],handle:['ручка','part','oval','rose'],
 petal:['лепесток','part','oval','rose'],roof:['крыша','part','triangle','red'],door:['дверь','part','rectangle','brown'],
 body:['корпус','part','rectangle','blue'],head:['голова','part','round','cream'],paw:['лапка','part','oval','cream'],
 bearBody:['туловище','part','oval','cream'],base:['основание','part','rectangle','brown'],ring:['кольцо','part','oval','gold'],
 wall:['стены','part','square','cream'],box:['коробка','container','square','cream'],basket:['корзинка','container','oval','brown','','collect'],
 shelf:['полка','container','rectangle','brown'],chest:['сундук','container','rectangle','brown'],platform:['подставка','place','rectangle','cream'],
 bridge:['мостик','tool','arc','brown','','cross'],plank:['доска','tool','rectangle','brown','','cross'],
 watering:['лейка','tool','round','mint','','water'],pitcher:['кувшин','tool','round','blue','','water'],
 brush:['щётка','tool','oval','rose','','comb'],comb:['расчёска','tool','rectangle','purple','','comb'],
 cloth:['тряпочка','tool','square','mint','','wipe'],towel:['полотенце','tool','rectangle','rose','','wipe'],
 book:['книга','toy','rectangle','mint'],soap:['мыло','tool','oval','blue'],hand:['ладонь','scene','oval','cream'],
 water:['вода','scene','oval','blue'],road:['дорожка','scene','rectangle','gray'],
};
export const colors={red:'#c94b49',blue:'#387fb6',gold:'#e4af35',mint:'#589d6d',purple:'#9273be',rose:'#d6749a',cream:'#e8bf87',brown:'#a67155',gray:'#82909b'};
export const rules={image:'Одинаковые картинки',color:'Цвет',shape:'Форма',size:'Размер',category:'Группа',part:'Часть предмета'};
export const categories={toy:['Игрушки','car'],fruit:['Фрукты','apple'],dish:['Посуда','cup'],clothes:['Одежда','hat'],animal:['Животные','cat'],shape:['Фигуры','circle']};
export function object(id){
 if(typeof id!=='string')return null;
 const [type,c,size='big',detail='plain']=id.split(':');
 const def=catalog[type];
 if(!def||(c&&!colors[c])||!['big','small','medium'].includes(size))return null;
 const [label,category,shape,d,parts='',uses='']=def;
 return {id,type,label,category,shape:type==='balloon'&&detail==='round'?'circle':shape,color:c||d,size,detail,parts:parts.split(' '),uses:uses.split(' ')};
}
export function trait(id,rule){
 const a=object(id);
 return rule==='image'&&a?[a.type,a.color,a.size,a.detail].join(':'):a?.[rule];
}
export function matches(a,b,rule){
 const x=object(a),y=object(b);
 if(!x||!y)return false;
 return rule==='part'?x.parts.includes(y.type)||y.parts.includes(x.type):[].concat(rule).every(key=>trait(a,key)!==undefined&&trait(a,key)===trait(b,key));
}
const unique=list=>new Set(list).size===list.length;
const same=(a,b)=>Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((x,i)=>x===b[i]);
export const identical=pair=>matches(...pair,'image');
export const placements=new Set(['group','match','puzzle','construct','order','pattern']);
export function fits(r,i,j){
 if(!Number.isInteger(i)||!Number.isInteger(j)||i<0||j<0||i>=r.items.length||j>=r.slots.length)return false;
 const a=r.items[i],b=r.slots[j];
 switch(r.kind){
  case 'group':return (r.pairs?identical(a):trait(a,r.rule))===b.value;
  case 'match':return matches(a,b.object,r.rule);
  case 'puzzle':return a===b.piece;
  case 'construct':return b.accepts.includes(a);
  case 'order':return a===r.order[j];
  case 'pattern':return matches(a,r.seed[b.position%2],r.rule);
  default:return false;
 }
}
export function solutions(r){
 if(r.kind==='compare')return [identical(r.items)?'same':'different'];
 if(r.kind==='pairChoice')return r.pairs.flatMap((p,i)=>identical(p)?[i]:[]);
 if(r.kind==='chooseOrder')return r.rows.flatMap((p,i)=>same(p,r.order)?[i]:[]);
 if(r.kind==='select')return r.items.flatMap((item,i)=>(r.sample?matches(item,r.sample,r.rule):trait(item,r.rule)===r.value)?[i]:[]);
 if(r.kind==='event')return r.items.flatMap((id,i)=>id===r.steps[r.step]?[i]:[]);
 if(r.kind==='story')return r.items.flatMap((id,i)=>object(id)?.uses.includes(r.use)&&(!r.fit||trait(id,r.fit[0])===r.fit[1])?[i]:[]);
 if(r.kind==='odd'){
  const counts=new Map();
  const keys=r.items.map(id=>trait(id,r.rule));
  for(const k of keys)counts.set(k,(counts.get(k)??0)+1);
  return counts.size===2&&Math.max(...counts.values())===keys.length-1?keys.flatMap((k,i)=>counts.get(k)===1?[i]:[]):[];
 }
 return [];
}
export function arrangement(r,partial=[]){
 if(r.kind==='group')return r.items.map((_,i)=>{
  const slot=r.slots.findIndex((_,j)=>fits(r,i,j));
  return slot<0?null:slot;
 });
 function fill(j,used){
  if(j===r.slots.length)return used.size===Math.min(r.items.length,r.slots.length)?[]:null;
  const candidates=partial[j]!=null?[partial[j]]:r.items.map((_,i)=>i);
  for(const i of candidates){
   if(used.has(i)||!fits(r,i,j))continue;
   const rest=fill(j+1,new Set([...used,i]));
   if(rest)return [i,...rest];
  }
  if(r.kind==='match'&&r.items.length<r.slots.length&&partial[j]==null){
   const rest=fill(j+1,used);if(rest)return [null,...rest];
  }
  return null;
 }
 return fill(0,new Set());
}
export function expected(r){
 if(placements.has(r.kind))return arrangement(r);
 if(r.kind==='diff')return r.spots.map(spot=>spot.id);
 if(r.kind==='actions')return r.steps.map(step=>step.choice);
 if(r.kind==='pair'){
  function fill(found){
   if(found.length===r.count*2)return found;
   for(let a=0;a<r.items.length;a++)for(let b=a+1;b<r.items.length;b++){
    if(found.includes(a)||found.includes(b)||!matches(r.items[a],r.items[b],r.rule))continue;
    const rest=fill([...found,a,b]);if(rest)return rest;
   }
   return null;
  }
  return fill([]);
 }
 const choice=solutions(r)[0];
 if(r.kind==='story')return {choice,checked:true};
 if(r.kind==='odd'&&(r.reason||r.rehome))return {choice,reason:r.rehome?trait(r.items[choice],'category'):trait(r.items.find((_,i)=>i!==choice),r.rule)};
 return choice;
}
export function answer(r,a){
 if(placements.has(r.kind)){
  if(r.kind==='group')return same(a,arrangement(r));
  if(!Array.isArray(a)||a.length!==r.slots.length)return false;
  const used=a.filter(i=>i!=null);
  return used.length===Math.min(r.items.length,r.slots.length)&&unique(used)&&a.every((i,j)=>i==null?r.kind==='match':fits(r,i,j));
 }
 if(r.kind==='diff')return Array.isArray(a)&&a.length===r.spots.length&&unique(a)&&a.every(id=>r.spots.some(p=>p.id===id));
 if(r.kind==='pair')return Array.isArray(a)&&a.length===r.count*2&&unique(a)&&a.every((i,j)=>object(r.items[i])&&
  (j%2===0||matches(r.items[a[j-1]],r.items[i],r.rule)));
 if(r.kind==='story')return a?.checked===true&&solutions(r).includes(a.choice);
 if(r.kind==='actions')return same(a,r.steps.map(step=>step.choice));
 if(r.kind==='odd'&&(r.reason||r.rehome)){
  if(!solutions(r).includes(a?.choice))return false;
  return a.reason===(r.rehome?trait(r.items[a.choice],'category'):trait(r.items.find((_,i)=>i!==a.choice),r.rule));
 }
 return solutions(r).includes(a);
}
export function validRound(r){
 if(!r?.prompt)return false;
 if(['select','compare','odd','match','construct','pattern','story','pair'].includes(r.kind)&&!r.items.every(object))return false;
 if(r.kind==='group'){
  if(!r.items.every(x=>r.pairs?x.length===2&&x.every(object):object(x))||!unique(r.slots.map(x=>x.value)))return false;
  const full=arrangement(r);
  if(!full.some(x=>x!=null)||(!r.partial&&full.includes(null)))return false;
 }
 if(['select','pairChoice','chooseOrder','odd','event'].includes(r.kind)&&solutions(r).length!==(r.allow??1))return false;
 if(r.kind==='pattern'&&(r.seed.length!==2||matches(...r.seed,r.rule)||r.row.length<4))return false;
 if(r.kind==='diff'&&(!r.spots.length||!unique(r.spots.map(x=>x.id))))return false;
 if(r.kind==='odd'&&(r.reason||r.rehome)&&!r.options.includes(expected(r).reason))return false;
 if(r.kind==='actions'&&!r.steps.every(s=>s.options.includes(s.choice)))return false;
 return answer(r,expected(r));
}
export const ready=task=>Boolean(task?.title&&task.rounds?.length&&task.rounds.every(validRound));
export const check=(task,answers)=>Array.isArray(answers)&&task.rounds.length===answers.length&&task.rounds.every((r,i)=>answer(r,answers[i]));
