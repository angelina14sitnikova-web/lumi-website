/* One counter, explicit parental consent, no game-state dependencies. */
(function () {
 'use strict';
 if (window.LumiAnalytics) return;
 const ID=114310945, KEY='lumi.analytics.consent.v1', RUNS='lumi.analytics.runs.v1';
 const ages={'crystal-trail':'3-4','magic-garden':'3-4','crystal-lighthouse':'4-5','star-tower':'5-6','enchanted-library':'6-7'};
 const ownScript=document.currentScript, base=new URL('.',ownScript.src);
 let consent=read('localStorage',KEY), requested=false, initialized=false, stopped=false, pending=[], panel, status;
 let runs;try{runs=JSON.parse(sessionStorage.getItem(RUNS)||'{}');}catch{runs={};}
 if(!runs||typeof runs!=='object'||Array.isArray(runs))runs={};
 const recent=new Map();
 function read(storage,key){try{return window[storage].getItem(key);}catch{return null;}}
 function persist(){try{sessionStorage.setItem(RUNS,JSON.stringify(runs));}catch{}}
 function safe(fn){try{fn();}catch{/* Analytics must never interrupt a game. */}}
 function protect(){
  document.body.classList.add('ym-disable-clickmap','ym-disable-tracklink','ym-disable-submit','ym-hide-content');
  document.querySelectorAll('input,textarea').forEach(e=>{e.classList.remove('ym-record-keys');e.classList.add('ym-disable-keys');});
 }
 function call(){if(consent==='allowed'&&initialized&&!stopped&&typeof window.ym==='function')safe(()=>window.ym.apply(window,arguments));}
 function emit(goal,params){
  if(consent!=='allowed'||stopped)return;
  if(initialized)call(ID,'reachGoal',goal,params);
  else if(pending.length<50)pending.push([goal,params]);
 }
 function begin(id,restart){
  safe(()=>{
   if(consent!=='allowed'||!Object.prototype.hasOwnProperty.call(ages,id))return;
   const now=Date.now(), key='begin:'+id;
   if(recent.has(key)&&now-recent.get(key)<1200)return;
   recent.set(key,now);
   if(restart||!runs[id])runs[id]={started:false,tasks:[],complete:false};
   const run=runs[id];if(run.started||run.complete)return;
   run.started=true;persist();emit('adventure_start',{adventure_id:id,age_group:ages[id]});
  });
 }
 function task(id,n){
  safe(()=>{
   if(consent!=='allowed'||!Object.prototype.hasOwnProperty.call(ages,id)||!Number.isInteger(n)||n<1||n>7)return;
   const run=runs[id]||(runs[id]={started:false,tasks:[],complete:false});
   if(run.complete||run.tasks.includes(n))return;
   run.tasks.push(n);persist();emit('task_complete',{adventure_id:id,age_group:ages[id],task_number:n});
  });
 }
 function complete(id){
  safe(()=>{
   if(consent!=='allowed'||!Object.prototype.hasOwnProperty.call(ages,id))return;
   const run=runs[id];if(!run||run.complete||!run.tasks.includes(7))return;
   // The multipage trail has no independent completion state. Require all seven answers.
   if(id==='crystal-trail'&&run.tasks.length!==7)return;
   run.complete=true;persist();emit('adventure_complete',{adventure_id:id,age_group:ages[id]});
  });
 }
 window.LumiAnalytics=Object.freeze({
  begin,taskComplete:task,complete,
  age(id){safe(()=>{const a=id.replace(/^age-/,''),key='age:'+a,now=Date.now();if(!['3-4','4-5','5-6','6-7'].includes(a)||consent!=='allowed')return;if(recent.has(key)&&now-recent.get(key)<1200)return;recent.set(key,now);emit('age_'+a.replace('-','_'),{});});}
 });
 function load(){
  if(consent!=='allowed'||requested||stopped)return;
  requested=true;protect();
  const observer=new MutationObserver(()=>protect());
  // Watch added fields, not class changes made by protect().
  observer.observe(document.body,{childList:true,subtree:true});
  window.ym=window.ym||function(){(window.ym.a=window.ym.a||[]).push(arguments);};
  window.ym.l=Date.now();
  const script=document.createElement('script');script.id='lumi-metrika-sdk';script.async=true;script.referrerPolicy='no-referrer';script.src='https://mc.yandex.ru/metrika/tag.js';
  script.onload=()=>{
   if(consent!=='allowed'||stopped)return;
   safe(()=>{
    window.ym(ID,'init',{webvisor:false,clickmap:false,trackLinks:false,ecommerce:false,accurateTrackBounce:false,childIframe:false,trackHash:false,sendTitle:false,disableYtm:true,defer:true});
    initialized=true;
    // Never forward query strings, fragments, titles or incoming referral data.
    call(ID,'hit',location.origin+location.pathname,{title:'',referer:location.origin+'/'});
    const queue=pending;pending=[];queue.forEach(([goal,params])=>emit(goal,params));
   });
  };
  script.onerror=()=>{pending=[];};
  document.head.append(script);
 }
 function revoke(){
  pending=[];recent.clear();runs={};persist();
  if(initialized&&typeof window.ym==='function')safe(()=>window.ym(ID,'destruct'));
  if(requested)stopped=true;
  initialized=false;document.getElementById('lumi-metrika-sdk')?.remove();
 }
 function choose(value){
  consent=value;try{localStorage.setItem(KEY,value);}catch{}
  if(value==='allowed')load();else revoke();
  panel.hidden=true;updateStatus();
 }
 function updateStatus(){status.textContent=consent==='allowed'?(stopped?'Аналитика разрешена. Подключится при следующем открытии страницы.':'Аналитика разрешена.'):consent==='denied'?'Аналитика отключена.':'Аналитика выключена до вашего согласия.';}
 function ui(){
  const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('lumi-analytics.css',base);document.head.append(css);
  const controls=document.createElement('div');controls.id='lumi-analytics-controls';
  const settings=document.createElement('button');settings.type='button';settings.textContent='Родителям: настройки аналитики';settings.onclick=()=>{panel.hidden=false;updateStatus();panel.querySelector('button').focus();};controls.append(settings);
  panel=document.createElement('section');panel.id='lumi-analytics-panel';panel.setAttribute('aria-label','Родителям: аналитика сайта');panel.setAttribute('role','region');panel.hidden=consent==='allowed'||consent==='denied';
  panel.innerHTML='<h2>Родителям: статистика Lumi</h2><p>С вашего разрешения Яндекс Метрика помогает понять, какие приключения и задания интересны. Сервис получает технические данные браузера и устройства, IP-адрес и cookie-идентификаторы, просмотры и события игры. Имена, голос и содержимое полей мы не передаём. Вебвизор, карта кликов, запись форм и электронная коммерция отключены.</p><p>Можно играть без аналитики. Отозвать согласие можно в настройках аналитики внизу любой страницы. Отзыв останавливает дальнейшую отправку, но не удаляет ранее отправленные данные.</p><p class="lumi-analytics-status" aria-live="polite"></p><div class="lumi-analytics-actions"><button type="button" data-choice="allowed">Разрешить аналитику</button><button type="button" data-choice="denied">Без аналитики / отозвать согласие</button><button type="button" data-close>Закрыть</button></div>';
  status=panel.querySelector('.lumi-analytics-status');
  panel.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>choose(b.dataset.choice));
  panel.querySelector('[data-close]').onclick=()=>{panel.hidden=true;settings.focus();};
  document.body.append(controls,panel);updateStatus();if(consent==='allowed')load();
 }
 window.addEventListener('storage',e=>{if(e.key!==KEY)return;consent=e.newValue;if(consent!=='allowed')revoke();else load();updateStatus();});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ui,{once:true});else ui();
})();
