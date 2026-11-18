const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const acorn=require('acorn');const root=path.resolve(__dirname,'..');let checks=0;
function ok(v,m){assert.ok(v,m);checks++;}
function parse(file){const s=fs.readFileSync(path.join(root,file),'utf8');acorn.parse(s,{ecmaVersion:'latest'});return s;}
function fn(file,name){const s=parse(file),ast=acorn.parse(s,{ecmaVersion:'latest'});let n;function walk(v){if(!v||typeof v!=='object'||n)return;if(v.type==='FunctionDeclaration'&&v.id.name===name){n=v;return;}for(const k of Object.keys(v))if(k!=='start'&&k!=='end')walk(v[k]);}walk(ast);assert.ok(n,name);return s.slice(n.start,n.end);}
const calls=[],api={taskComplete:(id,n)=>calls.push(['task',id,n]),complete:id=>calls.push(['complete',id]),begin:(...a)=>calls.push(['begin',...a])};
const element={innerHTML:'',outerHTML:'',textContent:'',open:false,showModal(){this.open=true}};const noop=()=>{};
const common={window:{LumiAnalytics:api},document:{getElementById:()=>element,querySelector:()=>element},stars:()=>'',seals:()=>'',tone:noop,save:noop,progress:noop,chime:noop,showSuccess:noop,feedback:{},stop:noop,bg:noop,dialog:{showModal:noop},play:noop,persist:noop,message:noop,$:()=>({}),go:noop};
for(const [file,name,extra,prepare] of [
 ['star-tower/tower.js','success',{state:{step:1,earned:0,pending:false}},(c,n)=>{c.state.step=n;c.state.pending=false}],
 ['magic-garden/garden.js','award',{state:{stage:1,earned:0,pending:false}},(c,n)=>{c.state.stage=n;c.state.pending=false}],
 ['enchanted-library/library.js','success',{screen:1,earned:0},(c,n)=>{c.screen=n;element.open=false}],
 ['crystal-lighthouse/lighthouse.js','complete',{saved:{done:[]},finished:false,current:1},(c,n)=>{c.current=n;c.finished=false}]
]){
 calls.length=0;const ctx=vm.createContext({...common,...extra});vm.runInContext(fn(file,name),ctx);
 for(let n=1;n<=7;n++){prepare(ctx,n);ctx[name]();ctx[name]();}
 ok(calls.filter(x=>x[0]==='task').length===7,file+' seven task signals');ok(calls.filter(x=>x[0]==='complete').length===1,file+' completion once');
}
const oldCalls=[];const oldCtx=vm.createContext({...common,window:{LumiAnalytics:{taskComplete:()=>{},complete:()=>oldCalls.push('complete')}},saved:{done:[1,2,3,4,5,6,7]},finished:false,current:7});vm.runInContext(fn('crystal-lighthouse/lighthouse.js','complete'),oldCtx);oldCtx.complete();ok(oldCalls.length===0,'replaying old final lighthouse task is not full completion');
function htmls(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{if(['dist','.openai','.git'].includes(e.name))return [];const p=path.join(dir,e.name);return e.isDirectory()?htmls(p):p.endsWith('.html')?[p]:[]})}
const pages=htmls(root);
for(const p of pages){const s=fs.readFileSync(p,'utf8');const scripts=[...s.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];ok(scripts.filter(x=>/lumi-analytics\.js/.test(x[1])).length===1,path.relative(root,p)+' shared loader once');for(const m of scripts){const src=m[1].match(/src="([^"]+)"/);if(src&&!/^https?:/.test(src[1]))ok(fs.existsSync(path.resolve(path.dirname(p),src[1].split('?')[0])),'script exists '+src[1]);else if(!src&&m[2].trim())acorn.parse(m[2],{ecmaVersion:'latest'});}}
for(let n=1;n<=7;n++){const s=fs.readFileSync(path.join(root,`crystal-trail-${n}.html`),'utf8');ok(s.includes(`taskComplete("crystal-trail",${n})`),'trail task '+n);}
parse('analytics/lumi-analytics.js');parse('site-sections/catalog.js');
console.log(JSON.stringify({checks,htmlPages:pages.length,result:'PASS'}));
