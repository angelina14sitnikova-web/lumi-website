'use strict';
(()=>{
 const data=window.LumiCatalogData;
 const ageButtons=document.querySelector('.crystal-age-buttons');
 const filters=document.getElementById('catalog-filters');
 const catalog=document.getElementById('catalog-content');
 const status=document.getElementById('catalog-status');
 let selectedAge=data.ages.some(a=>'#'+a.id===location.hash)?location.hash.slice(1):data.ages[0].id;
 let selectedDirection='all';
 const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
 const ageLabel=id=>data.ages.find(a=>a.id===id).label;
 const directionLabel=id=>data.directions.find(d=>d.id===id)?.label||id;
 function card(a){
  const article=node('article','crystal-quest featured-quest illustrated-quest catalog-card');article.dataset.adventure=a.id;article.dataset.direction=a.direction;
  const image=node('img','quest-cover');image.src=a.cover;image.alt=a.coverAlt||a.title;image.loading='lazy';image.width=1000;image.height=600;
  const number=node('div','quest-number','Приключение '+a.number);
  const content=node('div','quest-content');content.append(node('span','quest-type','7 заданий · '+ageLabel(a.age)),node('h3','',a.title),node('span','catalog-direction',directionLabel(a.direction)),node('p','',a.description));
  const skills=node('div','quest-skills');(a.skills||[]).forEach(s=>skills.append(node('span','',s)));content.append(skills);
  if(a.status==='available'){const link=node('a','quest-button','Начать приключение →');link.href=a.game;content.append(link);}else content.append(node('span','quest-soon','Скоро открытие'));
  article.append(image,number,content);return article;
 }
 function render(){
  ageButtons.querySelectorAll('button').forEach(b=>{const active=b.dataset.age===selectedAge;b.classList.toggle('active-age',active);b.setAttribute('aria-pressed',String(active));});
  filters.querySelectorAll('button').forEach(b=>{const active=b.dataset.direction===selectedDirection;b.classList.toggle('active-filter',active);b.setAttribute('aria-pressed',String(active));});
  catalog.replaceChildren();
  const matches=data.adventures.filter(a=>a.age===selectedAge&&(selectedDirection==='all'||a.direction===selectedDirection));
  const section=node('section','age-adventures active-adventures');section.id=selectedAge;section.setAttribute('aria-label',ageLabel(selectedAge));
  const heading=node('div','crystal-section-heading');heading.append(node('span','',ageLabel(selectedAge)),node('h2','','Выбери своё приключение'));section.append(heading);
  if(matches.length){const grid=node('div','crystal-adventure-grid');matches.forEach(a=>grid.append(card(a)));section.append(grid);}else section.append(node('p','catalog-empty','Здесь скоро появятся новые приключения!'));
  catalog.append(section);status.textContent='Возраст: '+ageLabel(selectedAge)+'. '+(selectedDirection==='all'?'Все приключения':directionLabel(selectedDirection))+'. Найдено: '+matches.length+'.';
 }
 function selectAge(id,updateHash){if(!data.ages.some(a=>a.id===id))id=data.ages[0].id;selectedAge=id;selectedDirection='all';if(updateHash)history.replaceState(null,'','#'+id);render();}
 ageButtons.replaceChildren();data.ages.forEach(a=>{const b=node('button','',a.label);b.type='button';b.dataset.age=a.id;b.onclick=()=>selectAge(a.id,true);ageButtons.append(b);});
 [{id:'all',label:'Все приключения'},...data.directions].forEach(d=>{const b=node('button','catalog-filter',d.label);b.type='button';b.dataset.direction=d.id;b.onclick=()=>{selectedDirection=d.id;render();};filters.append(b);});
 window.addEventListener('hashchange',()=>selectAge(location.hash.slice(1),false));render();
})();
