export const p=(x,y)=>({x,y});
export const routeLine=(...coords)=>coords.map(([x,y])=>p(x,y));
export const line=(a,b,c,d)=>[p(a,b),p(c,d)];
export const curve=(a,b,c,d,ax,ay,bx=ax,by=ay)=>Array.from({length:41},(_,i)=>{
  const t=i/40,s=1-t;
  return p(s*s*s*a+3*s*s*t*ax+3*s*t*t*bx+t*t*t*c,s*s*s*b+3*s*s*t*ay+3*s*t*t*by+t*t*t*d);
});
export const waves=(start,end,y,amplitude=48,count=1)=>Array.from({length:64},(_,i)=>{
  const t=i/63;
  return p(start+(end-start)*t,y-amplitude*Math.sin(t*2*Math.PI*count));
});
export const ring=(x,y,r,vertical=r,start=-Math.PI/2,length=Math.PI*2)=>Array.from({length:65},(_,i)=>{
  const angle=start+i/64*length;
  return p(x+Math.cos(angle)*r,y+Math.sin(angle)*vertical);
});
export const arch=(x,y,r,h)=>ring(x,y,r,h,Math.PI,Math.PI);
export const item=(name,x,y,size)=>({name,x,y,size});
export const dot=(points,tolerance=29,settings)=>({points,tolerance,...settings});
export const trace=(targets,settings)=>({kind:'ink',mode:'trace',targets,...settings});
export const road=(points,actor,goal,settings={})=>({
  kind:'ink',mode:'route',actor,goal,start:points[0],end:points.at(-1),
  corridors:[points],width:41,...settings,
});
export const free=(settings)=>({kind:'ink',mode:'free',...settings});
export const task=(title,instruction,...rounds)=>({kind:'writing34',title,instruction,rounds});
export const scene=(title,description,board)=>({title,description,board});
export const moduleLessons=(number,world,lessons)=>Object.fromEntries(lessons.map(([scenes,...practice],i)=>[
  'writing-lesson-'+number+'-'+(i+1),{format:'writing34',world,scenes,practice},
]));
