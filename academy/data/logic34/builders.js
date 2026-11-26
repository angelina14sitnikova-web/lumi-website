export const r=(kind,prompt,details={})=>({kind,prompt,...details});
export const t=(title,...rounds)=>({kind:'logic34',title,rounds});
export const d=(text,example)=>({text,example});
export const lessons=(number,items)=>Object.fromEntries(items.map(([goal,scenes,...practice],i)=>[
 'logic-lesson-'+number+'-'+(i+1),{format:'logic34',world:number,goal,scenes,practice},
]));
export const compare=(...items)=>r('compare','Эти картинки одинаковые?',{items,rule:'image'});
export const pair=(items,count=1,rule='image')=>r('pair','Соедини подходящие картинки.',{items,count,rule});
export const pairChoice=(...pairs)=>r('pairChoice','Выбери одинаковую пару.',{pairs});
export const pick=(items,sample,rule='image',prompt='Найди по образцу.')=>r('select',prompt,{items,sample,rule});
export const pickValue=(items,rule,value,prompt)=>r('select',prompt,{items,rule,value});
export const match=(items,targets,rule='image',prompt='Соедини подходящие картинки.',extra={})=>r('match',prompt,{items,rule,slots:targets.map(object=>({object})),...extra});
export const group=(items,values,rule,prompt,extra={})=>r('group',prompt,{items,rule,slots:values.map(x=>Array.isArray(x)?{value:x[0],object:x[1]}:{value:x}),...extra});
export const odd=(items,rule,prompt,extra={})=>r('odd',prompt,{items,rule,...extra});
export const spot=(id,label,area)=>({id,label,area});
export const diff=(a,b,spots,prompt='Покажи, чем картинки отличаются.')=>r('diff',prompt,{images:[a,b],spots});
export const picture=(background,...entries)=>({background,objects:entries.map(([id,x,y,scale])=>({id,x,y,scale}))});
export const worlds=['Музей удивительных находок','Фабрика волшебных коллекций','Сад потерянных половинок','Город добрых детективов',
 'Замок рассыпавшихся картин','Железная дорога волшебных узоров','Академия великих маленьких открытий'];
