export const cue=(text,variant='clear')=>({voice:text,variant});
export const C=cue;
export const scene=(text,sounds=[],objects=[],action='reveal')=>({text,sounds,objects,action});
export const say=(text,objects,words=[],action='reveal')=>scene(text,words.map(word=>cue(word)),objects,action);
export const task=(name,kind,instruction,...rounds)=>({ name,kind,instruction,rounds });
export const choice=(id,options,answer=id)=>({sounds:[id],options,answer});
export const spoken=(word,options,answer,variant)=>choice(cue(word,variant),options,answer);
export const each=(pairs,options)=>pairs.map(([word,id])=>spoken(word,options,id));
export const sequence=(sounds,options,answer=sounds,choices)=>({sounds,options,answer,choices});
export const matching=(sounds,options,answer)=>({sounds,options,answer});
export const audioCards=(sounds,clips,answer)=>({sounds,options:Object.keys(clips),answer,choices:clips,listenChoices:true});
export const repeat=(sounds,options=['ready','skip'])=>({sounds,options,answer:'ready',accepts:options});
export const bundle=(number,location,reward,lessons)=>({
  id:'literacy-'+number,location,reward,
  lessons:Object.fromEntries(lessons.map(([goal,scenes,...practice],i)=>['literacy-lesson-'+number+'-'+(i+1),{goal,scenes,practice}])),
});
