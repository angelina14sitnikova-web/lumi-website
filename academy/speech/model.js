export const spokenModes=new Set(['speak','echo','act','dialogue','retell','listen','tactile']);
export const digitalModes=new Set(['choose','multi','place','order','parts','compose','paint']);
export const isSpoken=round=>spokenModes.has(round.responseMode);

export function accepted(round,response){
 const mode=round.responseMode;
 if(isSpoken(round))return response==='continue';
 if(mode==='choose'||mode==='parts')return round.correct.includes(response);
 if(mode==='multi'){
  return Array.isArray(response)&&new Set(response).size===response.length&&
   (round.count==null?response.length===round.correct.length:response.length===round.count)&&
   response.every(id=>round.correct.includes(id));
 }
 if(['place','compose','paint','order'].includes(mode)){
  return Array.isArray(response)&&response.length===round.slots.length&&
   (mode==='paint'||new Set(response).size===response.length)&&
   response.every((id,i)=>round.slots[i].accept.includes(id));
 }
 return false;
}
export function example(round){
 if(isSpoken(round))return 'continue';
 if(round.responseMode==='multi')return round.correct.slice(0,round.count??round.correct.length);
 if(['choose','parts'].includes(round.responseMode))return round.correct[0];
 const search=(slot,used)=>{
  if(slot===round.slots.length)return [];
  for(const id of round.slots[slot].accept){
   if(used.has(id)&&round.responseMode!=='paint')continue;
   const tail=search(slot+1,new Set([...used,id]));
   if(tail)return [id,...tail];
  }
  return null;
 };
 return search(0,new Set());
}

export function descriptionValid(item){
 return Boolean(['narrationText','instructionText','speechModel','adultPrompt','transcript'].every(key=>
  typeof item?.[key]==='string'&&item[key].trim())&&typeof item.requiresAdult==='boolean'&&
  (item.audioSrc===null||typeof item.audioSrc==='string')&&typeof item.responseMode==='string');
}
export function roundValid(round){
 if(!descriptionValid(round)||!Array.isArray(round.cards))return false;
 const ids=round.cards.map(c=>c.id);
 if(new Set(ids).size!==ids.length||round.cards.some(c=>!c.art))return false;
 if(isSpoken(round))return !round.correct&&!round.slots&&!round.count;
 if(!digitalModes.has(round.responseMode)||!ids.length)return false;
 if(round.slots){
  if(!round.slots.length||round.slots.some(s=>!s.accept?.length||s.accept.some(id=>!ids.includes(id))))return false;
 }else{
  if(!round.correct?.length||round.correct.some(id=>!ids.includes(id)))return false;
  if(round.count!=null&&(!Number.isInteger(round.count)||round.count<1||round.count>round.correct.length))return false;
 }
 return accepted(round,example(round));
}
export const ready=task=>Boolean(descriptionValid(task)&&task.title&&task.rounds?.length&&task.rounds.every(roundValid));
export const check=(task,answers)=>Array.isArray(answers)&&answers.length===task.rounds.length&&
 task.rounds.every((r,i)=>accepted(r,answers[i]));
