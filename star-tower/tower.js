(() => {
'use strict';
const game=document.getElementById('game');
game.innerHTML=`<section class="hero"><div class="hero-copy"><p class="eyebrow">Кристальный мир · 5–6 лет</p><h1>Луми и Тайна<br>Звёздной башни</h1><p>Семь волшебных звёзд исчезли. Помоги Луми вернуть их на небесную карту и вновь зажечь башню над облаками.</p><img class="hero-lumi" src="assets/lumi-welcome.png" alt="Луми приветствует тебя"><button class="gold" id="start">Начать приключение</button></div><div class="hero-spacer"></div></section>`;
document.getElementById('start').onclick=()=>{document.getElementById('feedback').textContent='Приключение готовится в рабочей ветке.'};
})();
