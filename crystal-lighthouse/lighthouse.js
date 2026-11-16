(() => {
'use strict';
const $=s=>document.querySelector(s), main=$('#main'), nav=$('#progress');
const KEY='lumi.lighthouse45.v1';
let saved={done:[],sound:true};try{const v=JSON.parse(localStorage.getItem(KEY));if(v&&Array.isArray(v.done))saved={done:v.done.filter(n=>Number.isInteger(n)&&n>=1&&n<=7),sound:v.sound!==false}}catch(_){}
let current=0,finished=false,audioContext,master,revision=0;
const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(saved))}catch(_){}};
function tone(success=false){if(!saved.sound)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;if(!audioContext){audioContext=new C();master=audioContext.createGain();master.gain.value=.1;master.connect(audioContext.destination)}if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});master.gain.setValueAtTime(.1,audioContext.currentTime);(success?[523.25,659.25,783.99,1046.5]:[880,1174.66]).forEach((f,i)=>{const o=audioContext.createOscillator(),g=audioContext.createGain(),t=audioContext.currentTime+i*.09;o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.3,t+.015);g.gain.exponentialRampToValueAtTime(.001,t+.35);o.connect(g);g.connect(master);o.start(t);o.stop(t+.37);o.onended=()=>{o.disconnect();g.disconnect()}})}catch(_){}}
function soundButton(){const b=$('#sound');b.setAttribute('aria-pressed',String(saved.sound));b.setAttribute('aria-label',saved.sound?'Выключить звуковые эффекты':'Включить звуковые эффекты');b.innerHTML=saved.sound?'♫ <span>Звук</span>':'♪ <span>Без звука</span>'}
$('#sound').onclick=()=>{saved.sound=!saved.sound;persist();soundButton();if(!saved.sound&&master)master.gain.setValueAtTime(0,audioContext.currentTime);if(saved.sound)tone()};soundButton();
window.addEventListener('pagehide',()=>{if(master)master.gain.setValueAtTime(0,audioContext.currentTime)});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&master)master.gain.setValueAtTime(0,audioContext.currentTime)});
function pose(n,cls=''){return `<div class="lumi ${cls}" role="img" aria-label="Луми" style="background-position:${n%4*100/3}% ${n<4?0:100}%"></div>`}
// Stage 1: intro only. Activities will be restored in subsequent stages.
function intro(){document.body.dataset.scene='intro';main.innerHTML=`<section class="intro"><div class="intro-copy"><span class="eyebrow">Первое приключение</span><h1>Тайна<br>Кристального маяка<span class="title-sparkle" aria-hidden="true">✦</span></h1><p>Маяк погас, и волшебные дорожки потеряли свет. Помоги Луми пройти семь испытаний и вернуть сияние!</p><div class="intro-tags"><span>✧ Внимание</span><span>✧ Сравнение</span><span>✧ Память и логика</span></div><button class="primary" id="start">Начать приключение →</button><p class="small-note">Играйте вместе: взрослый читает инструкции, ребёнок выбирает ответы. Голосовые записи Луми добавим позже.</p></div><div class="hero-lighthouse"></div>${pose(0,'hero-lumi')}</section>`;$('#start').disabled=true;$('#start').textContent='Приключение скоро появится';}
nav.innerHTML=Array.from({length:7},(_,i)=>`<button class="dot" disabled aria-label="Задание ${i+1} пока недоступно">${i+1}</button>`).join('');
intro();
})();
