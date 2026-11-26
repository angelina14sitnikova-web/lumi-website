import {frame,panel,scene,say,choose,multi,place,order,task,token} from '../speech34/builders.js';
export {say,choose,multi,place,order,task,token};
export const visual=(...ids)=>panel(...ids.map((item,i)=>[item,Math.round(8+i*155/ids.length),Math.round(85-55/ids.length),Math.min(.86,.87/ids.length), 'rise']));
export const step=(art,says,action='rise')=>frame(Array.isArray(art)?visual(...art):art,action,{says,reset:true});
export const demo=(instruction,...steps)=>scene(instruction,steps.map(s=>s.says).join(' '),...steps);
export const match=(instruction,model,pairs,distractors=[])=>place(instruction,model,
 [...distractors,...pairs.map(p=>p[1]).reverse()],pairs.map(([target,id,label])=>[target,id,label]));
export const talk=(instruction,model,art,extra={})=>say(instruction,model,art.map((a,i)=>a?.props?token('picture-'+i,a):a),'speak',extra);
export function lessonSet(world,lessons){
 const audioSrc='speech45/media/voice-'+world+'.json';
 const record=item=>({...item,audioSrc,audioIndex:true});
 return Object.fromEntries(lessons.map(([goal,scenes,...practice],i)=>[
  'speech-45-lesson-'+world+'-'+(i+1),{format:'speech45',world,goal,scenes:scenes.map(record),
   practice:practice.map(activity=>({...record(activity),rounds:activity.rounds.map(record)}))},
 ]));
}
