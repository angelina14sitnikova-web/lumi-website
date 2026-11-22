const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');global.window={};require('../catalog-data.js');
const data=window.LumiCatalogData;
assert.equal(data.ages.length,4);assert.equal(data.directions.length,2);
assert.equal(new Set(data.adventures.map(a=>a.id)).size,data.adventures.length);
for(const id of ['crystal-trail','magic-garden','crystal-lighthouse','star-tower','enchanted-library'])assert(data.adventures.some(a=>a.id===id));
for(const a of data.adventures){
 for(const key of ['id','title','age','direction','description','cover','game','status'])assert(a[key],`${a.id}: missing ${key}`);
 assert(data.ages.some(t=>t.id===a.age));assert(data.directions.some(t=>t.id===a.direction));
 for(const url of [a.cover,a.game])assert(fs.existsSync(path.join(root,url.split(/[?#]/)[0])),`Missing ${url}`);
 assert.equal(a.status,'available');
}
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.equal((home.match(/class="world-card section-card /g)||[]).length,4);
assert(home.includes('Открой мир Луми')&&home.includes('id="adventures"'));
for(const id of ['adventures','academy','encyclopedia','workshop'])assert(fs.existsSync(path.join(root,`site-sections/assets/${id}.webp`)));
for(const name of ['encyclopedia','workshop']){
 const text=fs.readFileSync(path.join(root,name+'.html'),'utf8');assert(text.includes('Скоро открытие'));assert(text.includes('href="index.html"'));assert(!text.includes('Начать занятие'));
}
assert.match(home, /class="section-link" href="academy\.html">Войти в Академию/);
const academy=fs.readFileSync(path.join(root,'academy.html'),'utf8');
assert.match(academy, /href="#academy-ages">Начать обучение/);
assert.match(academy, /id="academy-ages"/);
assert.match(academy, /href="index\.html"/);
for(const age of ['3-4','4-5','5-6','6-7']){
 const target=`academy/age-${age}.html`;
 assert(academy.includes(`id="door-${age}"`));
 assert(academy.includes(`href="${target}"`));
 const page=fs.readFileSync(path.join(root,target),'utf8');
 assert(page.includes(age==='3-4' ? 'id="subjects"' : 'Скоро здесь появятся волшебные уроки!'));
 assert(page.includes(`href="../academy.html#door-${age}"`));
}
// The navigation/catalog must never overwrite adventure saves or install analytics.
for(const name of ['catalog.js','catalog-data.js']){
 const text=fs.readFileSync(path.join(root,'site-sections',name),'utf8');assert(!/localStorage|sessionStorage|metrika\/tag|114310945/.test(text));
}
const catalog=fs.readFileSync(path.join(root,'crystal-world.html'),'utf8');assert(catalog.includes('catalog-data.js')&&catalog.includes('catalog.js'));
console.log('PASS: catalogue routes, four sections, Academy age navigation and two future sections');
