(() => {
const {register,shape}=window.Lumi;
register(1,{title:'Звёздный шифр',instruction:'Выбери звезду по всем четырём условиям.',mount(c){
const stars=[{id:'purple',x:14,y:23,s:75,a:'Фиолетовая звезда',file:'star-gold',filter:'hue-rotate(220deg)'},{id:'gold-big',x:43,y:55,s:105,a:'Большая жёлтая звезда',file:'star-gold'},{id:'answer',x:65,y:24,s:82,a:'Средняя голубая звезда с пятью лучами',file:'star-blue'},{id:'six',x:22,y:78,s:83,a:'Голубая звезда с шестью лучами',file:'star-six'},{id:'gold-small',x:67,y:80,s:62,a:'Маленькая жёлтая звезда',file:'star-gold'},{id:'largest',x:88,y:19,s:125,a:'Самая большая голубая звезда с пятью лучами',file:'star-blue'}];
c.root.innerHTML=`<div class="parchment conditions">Голубая<br>С пятью лучами<br>Выше большой жёлтой звезды<br>Не самая большая из всех звёзд</div><div class="star-field">${stars.map(s=>`<button class="sky-star" data-star="${s.id}" aria-label="${s.a}" style="left:${s.x}%;top:${s.y}%;--size:${s.s}px;filter:${s.filter||'none'}">${c.img(s.file)}</button>`).join('')}</div>`;
c.root.querySelectorAll('[data-star]').forEach(b=>b.onclick=()=>{if(c.isDone())return;b.dataset.star==='answer'?c.success():c.wrong(b);});
}});
register(2,{title:'Мост между облаками',instruction:'Посмотри на образец. Выбери дорожку, которая продолжает ряд.',mount(c){
const paths=[['triangle','circle','square','triangle'],['circle','square','triangle','circle'],['square','triangle','circle','square']];
c.root.innerHTML=`<div class="sequence">${['triangle','circle','square','triangle','circle'].map(x=>shape(x)).join('')}<span class="question">?</span></div><div class="bridge-scene">${c.img('bridge-clouds','bridge-art')}<div class="bridge-paths">${paths.map((p,i)=>`<button class="bridge-path" data-path="${i}" aria-label="Дорожка ${i+1}: ${p.map(x=>({triangle:'треугольник',circle:'круг',square:'квадрат'}[x])).join(', ')}">${p.map(x=>`<span>${shape(x)}</span>`).join('')}</button>`).join('')}</div>${c.img('lumi-welcome','walking-lumi')}</div>`;
let timer;c.root.querySelectorAll('[data-path]').forEach(b=>b.onclick=()=>{if(c.isDone()||c.root.classList.contains('crossing'))return;if(b.dataset.path!=='2'){c.wrong(b);return;}b.classList.add('correct');c.root.classList.add('crossing');c.data={crossed:true};timer=setTimeout(c.success,1500);});return()=>clearTimeout(timer);
}});
})();
