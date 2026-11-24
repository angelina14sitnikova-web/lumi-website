import { findCourse, moduleStars } from '../course-model.js';

export const celebrationUrl = 'celebration.html';
export function courseCompleted(course) {
  return course?.id === 'math-3-4' && course.modules.length === 12 &&
    course.modules.every(module => moduleStars(course,module) === module.lessons.length);
}

const panel = globalThis.document?.querySelector('#course-celebration');
if (panel) {
  const course = findCourse('math-3-4');
  const stars = course.modules.reduce((sum,module)=>sum+moduleStars(course,module),0);
  if (courseCompleted(course)) {
    panel.querySelector('h1').textContent = 'Ты прошёл математику с Луми!';
    panel.querySelector('p').textContent = stars + ' звезды · 12 завершённых модулей · 12 медалей';
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
  } else {
    panel.querySelector('p').textContent = 'Собери звёзды во всех модулях. Сейчас у тебя ' + stars + ' из 84.';
  }
}
