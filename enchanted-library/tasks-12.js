'use strict';
(()=>{const L=Library,A=L.art;
L.register(1,{title:'Шифр библиотекаря',instruction:'У каждого символа есть буква. Расшифруй пять символов и составь слово. Нажми на ячейку, затем выбери букву.',hint:'Начни с первого символа. Найди его в таблице и посмотри, какая буква написана рядом. Так же проверь остальные символы.',lumi:'lumi-thinking',aside:'Свиток хранит ключ к каждому символу.',mount(root){
const symbols=['star','moon','crystal','storybook','feather'],letters=['К','Н','И','Г','А'];let answer=Array(5).fill(''),active=0,done=false;
root.innerHTML=`<div class="cipher-table">${symbols.map((s,i)=>`<div>${A(s,'','Символ '+['звезда','месяц','кристалл','книга','перо'][i])}<span>= ${letters[i]}</span></div>`).join('')}</div><p class="caption">Прочитай тайное послание</p><div class="cipher-code">${symbols.map(s=>A(s)).join('')}</div><div class="cipher-slots" aria-label="Пять букв слова">${letters.map((_,i)=>`<button data-slot="${i}" aria-label="Буква ${i+1}"></button>`).join('')}</div><div class="choices keyboard">${['А','Г','И','К','Н','О','Р'].map(x=>`<button data-letter="${x}">${x}</button>`).join('')}<button data-letter="" aria-label="Стереть букву">Стереть</button></div><div class="actions"><button id="check-cipher">Проверить слово</button></div>`;
const paint=()=>root.querySelectorAll('[data-slot]').forEach((b,i)=>{b.textContent=answer[i]||'·';b.classList.toggle('selected',i===active);});
root.querySelectorAll('[data-slot]').forEach(b=>b.onclick=()=>{active=+b.dataset.slot;paint();});root.querySelectorAll('[data-letter]').forEach(b=>b.onclick=()=>{if(done)return;answer[active]=b.dataset.letter;if(b.dataset.letter)active=Math.min(4,active+1);paint();});root.querySelector('#check-cipher').onclick=()=>{if(answer.join('')==='КНИГА'){done=true;L.success();}else L.message('Попробуй ещё раз! Сверь каждую букву с таблицей.',true);};paint();
}});
const maze=['111111111','100010001','101010111','101000101','101110101','100010001','111010111','100000001','111111111'];
const keys=[[1,7],[5,1],[7,3]],start=[1,1],exit=[7,7];
// Published pure data also supports a state-space reachability test including key order.
window.LibraryMaze={maze,keys,start,exit};
L.register(2,{
  title:'Лабиринт забытых страниц',
  instruction:'Собери ключи по порядку: 1, 2, 3. Нажми на клетку дальше по прямому проходу — Луми дойдёт сам. Или удерживай стрелку внизу.',
  hint:'Сначала найди ключ 1. За один раз можно пройти прямой свободный проход. На повороте выбери новое направление. У ключа Луми остановится, чтобы ты мог осмотреться.',
  lumi:'lumi-welcome',
  aside:'Выбирай путь, а я пройду по нему! Через шкафы пройти нельзя.',
  mount(root){
    let r=start[0],c=start[1],collected=0,done=false,disposed=false;
    let stepTimer=null,holdTimer=null,heldButton=null;
    root.innerHTML=`<div class="maze-status" aria-live="polite"></div><div class="maze" role="group" aria-label="Лабиринт из книжных шкафов"></div><p class="maze-tip">Один прямой проход — одно нажатие. На повороте выбери новое направление. У ключа Луми остановится.</p><div class="maze-bottom"><span class="pill">Вход: слева вверху</span><span class="pill">Выход: справа внизу</span></div><div class="dpad" aria-label="Управление Луми"><button data-move="-1,0" aria-label="Вверх">↑</button><button data-move="0,-1" aria-label="Влево">←</button><button data-move="1,0" aria-label="Вниз">↓</button><button data-move="0,1" aria-label="Вправо">→</button></div>`;
    const board=root.querySelector('.maze'),status=root.querySelector('.maze-status');
    function stop(){
      clearTimeout(stepTimer);clearTimeout(holdTimer);stepTimer=null;holdTimer=null;
      heldButton?.classList.remove('held');heldButton=null;
    }
    function paint(){
      status.innerHTML=`${keys.map((_,i)=>`<span class="key-counter ${collected>i?'collected':''}">${A('key')}<b>${i+1}</b>${collected>i?' ✓':''}</span>`).join('')}<span>${collected===3?'Выход открыт!':'Ищем ключ '+(collected+1)}</span>`;
      board.innerHTML=maze.map((row,y)=>[...row].map((cell,x)=>{
        if(cell==='1')return `<div class="wall" aria-label="Книжный шкаф">${A('shelf')}</div>`;
        const key=keys.findIndex(([a,b])=>a===y&&b===x);
        const here=y===r&&x===c,isExit=y===exit[0]&&x===exit[1];
        return `<button class="maze-cell ${here?'here':''} ${isExit?'exit':''}" data-cell="${y},${x}" aria-label="${here?'Луми':isExit?'Выход':key>=collected&&key>=0?'Ключ '+(key+1):'Проход'}; ряд ${y}, столбец ${x}">${here?A('lumi-welcome'):key>=collected&&key>=0?A('key')+'<b>'+(key+1)+'</b>':isExit?(collected===3?'Выход':'Закрыто'):''}</button>`;
      }).join('')).join('');
      board.querySelectorAll('[data-cell]').forEach(b=>b.onclick=()=>walkTo(...b.dataset.cell.split(',').map(Number)));
    }
    function move(dr,dc){
      if(done||disposed||document.querySelector('dialog[open]'))return false;
      const nr=r+dr,nc=c+dc;
      if(maze[nr]?.[nc]!=='0'){L.message('Здесь книжный шкаф. Найдём проход.');return false;}
      const k=keys.findIndex(([y,x])=>y===nr&&x===nc);
      if(k>=collected&&k!==collected){L.message('Сначала нужен ключ '+(collected+1)+'. К этому ключу вернёмся позже.');return false;}
      if(nr===exit[0]&&nc===exit[1]&&collected<3){L.message('Выход откроется, когда соберёшь все три ключа.');return false;}
      r=nr;c=nc;
      if(k===collected){collected++;L.tone();L.message('Ключ найден! '+(collected<3?'Теперь ищем ключ '+(collected+1)+'.':'Выход открыт!'));}
      paint();
      if(r===exit[0]&&c===exit[1]&&collected===3){done=true;stop();L.success();}
      return true;
    }
    function walkTo(nr,nc){
      stop();
      if(done||disposed||(r===nr&&c===nc))return;
      if(r!==nr&&c!==nc){L.message('Выбери клетку в том же прямом проходе. На повороте выберем новое направление.');return;}
      const dr=Math.sign(nr-r),dc=Math.sign(nc-c);
      for(let y=r+dr,x=c+dc;;y+=dr,x+=dc){
        if(maze[y]?.[x]!=='0'){L.message('Между нами книжный шкаф. Выбери свободный прямой проход.');return;}
        if(y===nr&&x===nc)break;
      }
      function next(){
        const before=collected;
        if(!move(dr,dc)||done||collected!==before||(r===nr&&c===nc)){stop();return;}
        stepTimer=setTimeout(next,150);
      }
      next();
    }
    function singleStep(dr,dc){stop();move(dr,dc);}
    root.querySelectorAll('[data-move]').forEach(b=>{
      const [dr,dc]=b.dataset.move.split(',').map(Number);
      b.onpointerdown=e=>{
        if(e.button!==0)return;
        e.preventDefault();stop();
        heldButton=b;b.classList.add('held');
        try{b.setPointerCapture(e.pointerId);}catch{}
        const before=collected;
        if(!move(dr,dc)||done||collected!==before){stop();return;}
        function repeat(){
          const count=collected;
          if(!move(dr,dc)||done||collected!==count){stop();return;}
          stepTimer=setTimeout(repeat,150);
        }
        holdTimer=setTimeout(repeat,320);
      };
      b.onpointerup=stop;b.onpointercancel=stop;b.onlostpointercapture=stop;
      b.oncontextmenu=e=>e.preventDefault();
      // Pointer presses move on pointerdown. Keyboard and assistive clicks still work.
      b.onclick=e=>{if(e.detail===0)singleStep(dr,dc);};
    });
    board.addEventListener('pointerdown',stop);
    const onkey=e=>{
      if(document.querySelector('dialog[open]'))return;
      const d={ArrowUp:[-1,0],ArrowDown:[1,0],ArrowLeft:[0,-1],ArrowRight:[0,1]}[e.key];
      if(d){e.preventDefault();singleStep(...d);}
    };
    const visibility=()=>{if(document.hidden)stop();};
    window.addEventListener('keydown',onkey);
    window.addEventListener('pointerup',stop);
    window.addEventListener('pointercancel',stop);
    window.addEventListener('blur',stop);
    document.addEventListener('visibilitychange',visibility);
    paint();
    return()=>{
      disposed=true;stop();window.removeEventListener('keydown',onkey);
      window.removeEventListener('pointerup',stop);window.removeEventListener('pointercancel',stop);
      window.removeEventListener('blur',stop);document.removeEventListener('visibilitychange',visibility);
    };
  }
});
})();
