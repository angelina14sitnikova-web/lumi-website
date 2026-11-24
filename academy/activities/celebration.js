import { findCourse, moduleStars } from '../course-model.js';

export const celebrationUrl = course => course.id === 'math-3-4' ? 'celebration.html' : 'celebration.html?course=' + course.id;
export function courseCompleted(course) {
  return ['math-3-4','math-4-5','math-5-6'].includes(course?.id) &&
    course.modules.length === (course.id === 'math-3-4' ? 12 : 10) &&
    course.modules.every(module => moduleStars(course,module) === module.lessons.length);
}

const panel = globalThis.document?.querySelector('#course-celebration');
if (panel) {
  const requested = new URLSearchParams(location.search).get('course');
  const course = findCourse(['math-4-5','math-5-6'].includes(requested) ? requested : 'math-3-4');
  const older = course.id === 'math-5-6';
  const total = course.modules.reduce((sum,module)=>sum+module.lessons.length,0);
  panel.querySelector('a').href = 'program.html?course=' + course.id;
  const stars = course.modules.reduce((sum,module)=>sum+moduleStars(course,module),0);
  if (courseCompleted(course)) {
    panel.querySelector('h1').textContent = older ? 'Луми и великий математический исследователь' : course.id === 'math-4-5' ? 'Мир чисел и фигур пройден!' : 'Ты прошёл математику с Луми!';
    panel.querySelector('p').textContent = course.id !== 'math-3-4' ? stars + ' звёзд · 10 завершённых модулей · 10 медалей' : stars + ' звезды · 12 завершённых модулей · 12 медалей';
    const confetti = document.createElement('div');
    confetti.className = 'academy-confetti';
    confetti.setAttribute('aria-hidden','true');
    for (let i=0;i<30;i+=1) {
      const star = document.createElement('span');
      star.textContent = i%3 ? '✦' : '★';
      star.style.setProperty('--position', (i*37)%100+'%');
      star.style.setProperty('--delay',(i%8)*.11+'s');
      star.style.setProperty('--hue',(i*53)%360);
      confetti.append(star);
    }
    panel.append(confetti);
    if (older) {
      panel.classList.add('math56-celebration');
      panel.querySelector('img').src = 'assets/sensory/lumi-graduate.webp';
      panel.querySelector('img').alt = 'Луми в академической мантии';
      const skills = document.createElement('p');
      skills.textContent = 'Ты умеешь считать до десяти, сравнивать группы, собирать фигуры, измерять мерками, прокладывать маршрут и пользоваться календарём.';
      panel.querySelector('p').after(skills);
    }
    if (course.id !== 'math-3-4') {
      const medals = document.createElement('ul');
      medals.className = 'academy-course-medals';
      for (const module of course.modules) {
        const item = document.createElement('li');
        item.textContent = module.reward;
        medals.append(item);
      }
      panel.append(medals);
    }
  } else {
    panel.querySelector('p').textContent = 'Собери звёзды во всех модулях. Сейчас у тебя ' + stars + ' из ' + total + '.';
  }
}
