import { piece, lesson, scene, exercise, pick, connect } from '../sensory-builders.js';
export { piece, lesson, scene, exercise, pick, connect };
export const token=(tag)=> {
  const [shape,color='sky',size]=tag.split('/');
  return piece(shape,color,size);
};
export const set=(tags)=>tags.split(' ').map(token);
export const show=(text,tags)=>scene('together',text,set(tags));
export const move=(text,sources,targets,matches)=>scene('move',text,set(sources),{targets:set(targets),matches});
export const choose=(prompt,tags,indices,sample,extra={})=>exercise(prompt,'Посмотри на образец и выбери подходящее.',pick(set(tags),indices,sample && token(sample),extra));
export const join=(prompt,from,to,matches,extra={})=>exercise(prompt,'Выбери предмет, затем его место.',connect(set(from),set(to),matches,extra));
export const stages=(prompt,...steps)=>exercise(prompt,'Выполни каждый шаг по образцу.',...steps.flatMap(task=>task.rounds.map(round=>({...round,prompt:task.prompt}))));
export const keyed=(module,room,content)=>Object.fromEntries(content.map(([scenes,practice],i)=>['math-45-lesson-'+module+'-'+(i+1),lesson(room,scenes,practice)]));
