const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
global.window={};require('../content.js');
const {tasks,common,matches}=window.GardenContent;
const root=path.resolve(__dirname,'..');
const file=p=>assert(fs.existsSync(path.join(root,p)),`Missing resource: ${p}`);
assert.equal(tasks.length,7);
assert.equal(tasks.reduce((n,t)=>n+t.rounds.length,0),28);
const ids=new Set();
tasks.forEach((t,i)=>{
 file(`assets/lumi-${t.lumi}.png`);file(`assets/bg-${i+1}.webp`);file(`audio/task-${i+1}.mp3`);
 t.rounds.forEach(r=>{
  assert(!ids.has(r.id));ids.add(r.id);
  assert.equal(r.options.filter(c=>matches(r,c)).length,1,`Exactly one correct choice: ${r.id}`);
  r.options.forEach(c=>file(`assets/${c.id}.png`));
  file(`audio/${r.id}-q.mp3`);file(`audio/${r.id}-a.mp3`);
  if(r.baby)file(`assets/${r.baby}.png`);
 });
});
for(const id of ['bird','frog','bee'])file(`audio/sound-${id}.mp3`);
for(const id of ['intro','wrong','success','story','final','chime','praise'])file(`audio/${id}.mp3`);
for(const id of ['star','medal','lumi-gate','lumi-reward'])file(`assets/${id}.png`);
for(const id of ['bg-start.webp','bg-final.webp','cover.webp'])file('assets/'+id);
assert(common.final.includes('пчёлки жужжат'));
assert.deepEqual(tasks[6].rounds.map(r=>r.answer),['story-1','story-2','story-3']);
// Each family includes the mother and two visibly different distractor species.
tasks[5].rounds.forEach(r=>{assert.equal(r.options.length,3);assert.equal(new Set(r.options.map(c=>c.id)).size,3);});
// Both traits matter: the same-color wrong size must be rejected.
for(const r of tasks[4].rounds.filter(r=>r.answerSize)){
 assert(r.options.some(c=>c.id===r.answer&&c.size!==r.answerSize&&!matches(r,c)));
}
const catalog=fs.readFileSync(path.resolve(root,'../crystal-world.html'),'utf8');
const age=catalog.split('<!-- 3–4 года -->')[1].split('<!-- 4–5 лет -->')[0];
assert.equal((age.match(/<article /g)||[]).length,2);
assert(age.includes('crystal-trail.html')&&age.includes('magic-garden/index.html'));
console.log('PASS: 7 games, 28 rounds, unambiguous answers, referenced graphics/audio, story, families, traits and two catalog cards');
