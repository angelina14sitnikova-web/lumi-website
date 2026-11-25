import { artTitle, picture, regions } from './art.js';
import { memoryRoundAnswer, restoringProgress, shuffleOptions } from './model.js';
import { createLessonAudio } from './audio.js';
import { makeRecallBoard, visualRecallKinds } from './recall-board.js';
import { lessonUrl, moduleStars, programUrl, saveCompletion } from '../course-model.js';

const media = new URL('./media/', import.meta.url);
const css = new URL('./lesson.css', import.meta.url);
const cssLink = document.createElement('link');
cssLink.rel = 'stylesheet';
cssLink.href = css.href;
document.head.append(cssLink);
const progressKey = 'lumi.academy.memory34.resume.v1:';
const secondary = 'lesson-secondary mem-button';
const primary = 'academy-button lesson-primary mem-button';

function element(tag, name = '', text = '') {
  const node = document.createElement(tag);
  node.className = name;
  node.textContent = text;
  return node;
}

function button(label, fn, className = secondary) {
  const node = element('button', className, label);
  node.type = 'button';
  node.addEventListener('click',fn);
  return node;
}

function link(label, href) {
  const node = element('a',primary,label);
  node.href = href;
  return node;
}

function image(name, className = '', alt = '') {
  const node = element('img',className);
  node.src = new URL(name+'.webp',media);
  node.alt = alt;
  node.draggable = false;
  return node;
}

function reduced() { return matchMedia('(prefers-reduced-motion: reduce)').matches; }

function registerMotion(task, motion) {
  if (reduced() || !task?.animate) return;
  task.animate(motion,{duration:550,easing:'ease-in-out'});
}

function gallery(ids, name = '') {
  const strip = element('div','mem-gallery '+name);
  strip.append(...ids.map(id=>{
    const card = element('div','mem-sample');
    card.append(picture(id));
    card.setAttribute('role','img');
    card.setAttribute('aria-label',artTitle(id));
    return card;
  }));
  return strip;
}

function pictureBoard(id, choose, hintId, activeLens = false) {
  const board = element('div','mem-picture');
  const base = picture(id);
  board.append(base);
  const spots = regions[id.split('-')[0]] ?? {};
  let lensView = null;
  if (activeLens) {
    lensView = element('div','mem-lens');
    lensView.hidden = true;
    lensView.append(picture(id));
    board.append(lensView);
  }
  function lensAt(x,y) {
    if (!lensView) return;
    lensView.style.setProperty('--px',x+'%');
    lensView.style.setProperty('--py',y+'%');
    lensView.hidden = false;
  }
  const hotSpots = new Map();
  for (const [key, entries] of Object.entries(spots)) {
    const group = [];
    for (const [x, y] of entries) {
      const spot = button('',()=>choose?.(key), 'mem-zone');
      spot.dataset.zone = key;
      spot.setAttribute('aria-label',artTitle(key));
      spot.style.left = x+'%';
      spot.style.top = y+'%';
      if (!choose) spot.disabled = true;
      spot.addEventListener('focus',()=>lensAt(x,y));
      group.push(spot);
      board.append(spot);
    }
    hotSpots.set(key, group);
  }
  if (lensView) {
    const aim = event => {
      const box = board.getBoundingClientRect();
      lensAt((event.clientX-box.left)/box.width*100,(event.clientY-box.top)/box.height*100);
    };
    board.addEventListener('pointermove',aim);
    board.addEventListener('pointerdown',aim);
    board.addEventListener('pointerleave',()=>{lensView.hidden=true;});
  }
  if (hintId) hotSpots.get(hintId)?.forEach(node=>node.classList.add('mem-mark'));
  return {board, hotSpots};
}

function route(round, onChoose, complete) {
  const lane = element('div','mem-lane');
  const racer = element('div','mem-racer');
  racer.append(picture(round.subject));
  lane.append(racer);
  let rival;
  if (round.distractionPath) {
    rival = element('div','mem-racer rival');
    rival.append(picture('car-blue'));
    lane.append(rival);
  }
  const pads = element('div','mem-pads');
  const buttons = new Map();
  round.destinations.forEach(id=>{
    const dock = button('',()=>onChoose?.(id),'mem-card mem-pad');
    dock.setAttribute('aria-label',artTitle(id));
    dock.dataset.choice = id;
    dock.append(picture(id));
    dock.disabled = true;
    buttons.set(id,[dock]);
    pads.append(dock);
  });
  lane.append(pads);
  function x(index){ return (100/round.destinations.length)*(index+0.5)+'%'; }
  function place(step) {
    racer.style.left = x(round.path[step]);
    if (rival) rival.style.left = x(round.distractionPath[step]);
  }
  place(0);
  let serial = 0;
  let step = 0;
  const steps = round.path.length;
  const controls = element('div','lesson-actions mem-controls');
  const nextFrame = button('Следующий кадр',()=>{
    step++;
    place(step);
    if (step+1===steps) {
      nextFrame.hidden=true;
      unlock();
    }
  });
  nextFrame.hidden = true;
  function unlock() {
    for (const [dock] of buttons.values()) dock.disabled = !onChoose;
    complete?.();
  }
  const watch = button('Смотреть маршрут',async()=>{
    serial++;
    const run = serial;
    for (const [dock] of buttons.values()) dock.disabled = true;
    watch.textContent='Повторить маршрут';
    if (reduced()) {
      step=0;
      place(step);
      nextFrame.hidden=false;
      return;
    }
    lane.classList.remove('is-moving');
    place(0);
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    if (serial!==run || !lane.isConnected) return;
    lane.classList.add('is-moving');
    for (let index=1; index<steps; index++) {
      place(index);
      await new Promise(resolve=>setTimeout(resolve,850));
      if (serial!==run || !lane.isConnected) return;
    }
    unlock();
  });
  controls.append(watch,nextFrame);
  return {lane, controls, buttons, watch};
}

function demo(scene, playSound) {
  const round = scene.example;
  let play;
  let notes;
  const box = element('div','mem-demo-board');
  const explanation = element('p','mem-prompt',scene.text);
  if (visualRecallKinds.has(round.kind)) {
    const lesson=makeRecallBoard(round,{example:true});
    box.append(lesson.view);
    play=()=>lesson.replayExample();
  } else if (round.kind==='track') {
    const moving = route(round, null, ()=>{ notes.textContent='Луми проследил за предметом.'; });
    box.append(moving.lane,moving.controls);
    play = ()=>moving.watch.click();
  } else if (round.kind==='detail' || round.kind==='difference') {
    const diagrams = element('div','mem-diagrams');
    const canvases = round.kind==='detail'?[round.picture]:[round.left,round.right];
    const views = canvases.map(id=>pictureBoard(id,null,null,round.lens));
    views.forEach(view=>diagrams.append(view.board));
    box.append(diagrams);
    const parts = round.kind==='detail' && round.picture==='bear' ? ['ears','paws','bow']
      : round.kind==='detail' && round.picture==='car' ? ['wheels','window','light'] : [].concat(round.answer);
    let run = 0;
    play = async()=>{
      const ownRun=++run;
      for (const view of views) for (const spots of view.hotSpots.values()) spots.forEach(spot=>spot.classList.remove('mem-mark'));
      for (const part of parts) {
        if (run!==ownRun || !diagrams.isConnected) return;
        for (const view of views) view.hotSpots.get(part)?.forEach(spot=>spot.classList.add('mem-mark'));
        if (!reduced()) await new Promise(resolve=>setTimeout(resolve,440));
      }
    };
  } else {
    const sample=gallery(round.sample);
    const candidates=gallery(round.options);
    box.append(sample,candidates);
    play = ()=>{
      for (const item of sample.children) registerMotion(item,[{transform:'scale(1)'},{transform:'scale(1.1)'},{transform:'scale(1)'}]);
      [...candidates.children].forEach((node,index)=>{
        if ([].concat(round.answer).includes(round.options[index])) {
          node.classList.add('mem-mark');
          registerMotion(node,[{transform:'translateY(0)'},{transform:'translateY(-7px)'},{transform:'translateY(0)'}]);
        }
      });
    };
  }
  const watch = button('Смотреть и слушать',()=>{ playSound(); void play(); },primary);
  notes = element('p','mem-feedback');
  box.append(watch,notes);
  return {box,explanation};
}

function loadProgress(lesson) {
  try { return restoringProgress(lesson,JSON.parse(localStorage.getItem(progressKey+lesson.id))); }
  catch { return null; }
}
function saveProgress(lesson,progress) {
  try {
    if (progress) localStorage.setItem(progressKey+lesson.id,JSON.stringify(progress));
    else localStorage.removeItem(progressKey+lesson.id);
  } catch { /* The open lesson can continue if storage is unavailable. */ }
}

export async function startMemoryLesson({ root, course, module, lesson }) {
  const speech = await import('./voice.js');
  const index = speech.narration[lesson.id];
  const sound = createLessonAudio({ speech: new URL(lesson.id+'.mp3',media), reward:new URL('reward.mp3',media) });
  const saved = loadProgress(lesson);
  let sceneIndex = saved?.scene ?? 0;
  const answers = saved?.answers ?? [];
  let roundAnswers = saved?.roundAnswers ?? [];
  const box = element('section','lesson-step mem-lesson');
  const status = element('p','mem-feedback');
  status.setAttribute('role','status');
  const panel = element('div','mem-panel');
  const prefs = element('details','mem-prefs');
  prefs.append(element('summary','','Настройки звука'));
  const volume = element('input');
  volume.type='range'; volume.min='0'; volume.max='1'; volume.step='0.05'; volume.value=String(sound.getVolume());
  volume.setAttribute('aria-label','Громкость');
  volume.addEventListener('input',()=>sound.setVolume(Number(volume.value)));
  prefs.append(volume);
  const pause = button('Сделать паузу',()=>{
    const resume = answers.length || roundAnswers.length || panel.querySelector('.mem-practice') ? showPractice : showScene;
    render(element('h2','lesson-part','Перерыв'),button('Продолжить',resume,primary),link('К учебной программе',programUrl(course,module)));
    pause.hidden=true;
  });
  box.append(panel,status,pause,prefs);
  root.replaceChildren(box);
  void sound.preload(['speech','reward']);

  function say(text) {
    const clip = index?.[text];
    if (!clip) return;
    status.textContent='';
    void sound.play([{sound:'speech',offset:clip[0],duration:clip[1]}]).catch(error=>{
      if (error.code!=='muted') status.textContent='Звук не загрузился. Можно повторить или попросить взрослого прочитать задание.';
    });
  }
  function render(...children) {
    sound.stop();
    status.textContent='';
    pause.hidden=false;
    panel.replaceChildren(...children);
  }
  function pauseProgress(stage) {
    saveProgress(lesson,{stage,scene:sceneIndex,answers,roundAnswers});
  }
  function showScene() {
    pauseProgress('scene');
    const scene = lesson.scenes[sceneIndex];
    const top = element('div','mem-location');
    top.style.backgroundImage='url("'+new URL(lesson.world+'.webp',media)+'")';
    const pose = lesson.world==='castle'?'lumi-chest':scene.example.lens?'lumi-lens':'lumi-point';
    top.append(image(pose,'mem-lumi','Луми'));
    const view = demo(scene,()=>{
      say(scene.text);
      registerMotion(top.firstElementChild,[{transform:'rotate(0)'},{transform:'rotate(4deg)'},{transform:'rotate(0)'}]);
    });
    const controls = element('div','lesson-actions mem-controls');
    if (sceneIndex>0) controls.append(button('Назад',()=>{sceneIndex--;showScene();}));
    controls.append(button(sceneIndex+1<lesson.scenes.length?'Следующая сцена':'Перейти к играм',()=>{
      if (sceneIndex+1<lesson.scenes.length) {sceneIndex++;showScene();}
      else showPractice();
    },primary));
    render(element('p','course-kicker','Сцена '+(sceneIndex+1)+' из '+lesson.scenes.length),
      top,view.explanation,view.box,controls);
  }
  function showPractice() {
    const task = lesson.practice[answers.length];
    const round = task.rounds[roundAnswers.length];
    pauseProgress('practice');
    const display = element('div','mem-practice');
    const controls = element('div','lesson-actions mem-controls');
    const noRepeat = new Set();
    const options = new Map();
    let tried=0;
    let done=false;
    let pairing=round.kind!=='pair';
    let recallBoard;
    const advance=button('Дальше',()=>{
      if (!done) return;
      if (roundAnswers.length===task.rounds.length) {
        answers.push([...roundAnswers]);
        roundAnswers=[];
      }
      if (answers.length===lesson.practice.length) showReward();
      else showPractice();
    },primary);
    advance.hidden=true;
    controls.append(button('Послушать задание',()=>say(round.prompt)), advance);

    function mark(id,style) { options.get(id)?.forEach(node=>node.classList.add(style)); }
    function check(answer) {
      if (done) return;
      if (memoryRoundAnswer(round,answer)) {
        done=true;
        pause.hidden=true;
        roundAnswers.push(Array.isArray(answer)?[...answer]:answer);
        status.textContent='Получилось!';
        advance.hidden=false;
        for (const group of options.values()) group.forEach(node=>node.disabled=true);
        recallBoard?.finish();
        void sound.play(['reward']).catch(()=>{});
      } else {
        tried++;
        status.textContent=tried>=2?'Попробуй ещё раз. Посмотри на подсказку.':'Попробуй ещё раз.';
        noRepeat.clear();
        recallBoard?.clearResult();
        for (const group of options.values()) group.forEach(node=>node.classList.remove('mem-selected'));
        if (tried>=2) {
          const hint = [].concat(round.answer).find(id=>!groupFound(round,id)) ?? [].concat(round.answer)[0];
          mark(hint,'mem-mark');
        }
      }
    }
    function groupFound(_round,id) {
      return options.get(id)?.some(node=>node.classList.contains('mem-found'));
    }
    function choose(id) {
      if (done) return;
      if (!pairing) {
        status.textContent='Сначала нажми на рисунок в верхней рамке.';
        return;
      }
      if (round.kind==='difference') {
        if (noRepeat.has(id)) return;
        const targets=round.answer;
        if (!targets.includes(id)) {
          tried++;
          status.textContent=tried>=2?'Одна область выделена подсказкой.':'Посмотри на обе картинки ещё раз.';
          if (tried>=2) mark(targets.find(item=>!noRepeat.has(item)),'mem-mark');
          return;
        }
        noRepeat.add(id);
        mark(id,'mem-found');
        if (noRepeat.size===targets.length) check([...noRepeat]);
        else status.textContent='Нашлось! Есть ещё отличие.';
      } else if (round.kind==='set' || round.kind==='memory-set') {
        if (noRepeat.has(id)) {
          noRepeat.delete(id);
          options.get(id).forEach(node=>node.classList.remove('mem-selected'));
          return;
        }
        noRepeat.add(id);
        mark(id,'mem-selected');
        if (noRepeat.size===round.answer.length) check([...noRepeat]);
      } else check(id);
    }

    if (visualRecallKinds.has(round.kind)) {
      recallBoard=makeRecallBoard(round,{
        answer:check,choose,options,announce:text=>{status.textContent=text;},reset:()=>noRepeat.clear(),
      });
      display.append(recallBoard.view);
    } else if (round.kind==='detail' || round.kind==='difference') {
      const diagrams=element('div','mem-diagrams');
      const pictureIds=round.kind==='detail'?[round.picture]:[round.left,round.right];
      pictureIds.forEach(id=>{
        const piece=pictureBoard(id,choose,null,round.lens);
        for (const [key,spots] of piece.hotSpots) options.set(key,[...(options.get(key)??[]),...spots]);
        diagrams.append(piece.board);
      });
      display.append(diagrams);
    } else if (round.kind==='track') {
      const game = route(round,choose);
      for (const [key,nodes] of game.buttons) options.set(key,nodes);
      display.append(game.lane,game.controls);
    } else {
      if (round.kind==='pair') {
        const pairStart = button('',()=>{
          pairing=true;
          pairStart.classList.add('mem-selected');
          pairStart.setAttribute('aria-pressed','true');
          status.textContent='Теперь найди пару.';
        },'mem-card mem-pair-sample');
        pairStart.setAttribute('aria-label','Образец: '+artTitle(round.sample[0]));
        pairStart.setAttribute('aria-pressed','false');
        pairStart.append(picture(round.sample[0]));
        const sample = element('div','mem-visible-sample mem-gallery');
        sample.append(pairStart);
        display.append(sample);
      } else display.append(gallery(round.sample,'mem-visible-sample'));
      const cards=element('div','mem-options');
      shuffleOptions(round.options).forEach(id=>{
        const choice=button('',()=>choose(id),'mem-card');
        choice.setAttribute('aria-label',artTitle(id));
        choice.dataset.choice=id;
        choice.append(picture(id));
        cards.append(choice);
        options.set(id,[choice]);
      });
      display.append(cards);
    }
    render(element('p','course-kicker','Игра '+(answers.length+1)+' из '+lesson.practice.length),
      element('h2','lesson-part',task.title),element('p','mem-prompt',round.prompt),display,controls);
  }

  function showReward() {
    const saved = saveCompletion(course,module,lesson,answers);
    if (saved) saveProgress(lesson,null);
    const stars = moduleStars(course,module);
    const heading = element('h2','lesson-part',saved?'Урок завершён!':'Урок пройден');
    const piece = element('div','mem-reward');
    piece.append(image('lumi-win','mem-celebrate','Луми радуется'));
    const summary = element('p','',saved?'Звёзды модуля: '+stars+' из '+module.lessons.length:
      'На этом устройстве не удалось сохранить звезду.');
    if (stars===module.lessons.length) {
      const medal=module.memoryAlbum.medal.split('/').at(-1).replace('.webp','');
      piece.append(image(medal,'mem-medal',module.reward));
      piece.append(element('p','',module.reward+' и страница альбома открыты.'));
    }
    const next=module.lessons[module.lessons.indexOf(lesson)+1];
    const actions=element('div','lesson-actions mem-controls');
    if (next?.scenes.length) actions.append(link('Следующий урок',lessonUrl(course,module,next)));
    actions.append(link('К учебной программе',programUrl(course,module)));
    render(heading,piece,summary,actions);
    pause.hidden=true;
  }

  if (saved?.stage==='practice') showPractice();
  else showScene();
}
