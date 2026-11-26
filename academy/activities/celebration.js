import { mountDiploma } from './diploma67.js';
import { findCourse, moduleStars, completionDate67, memoryCompletionDate, writingCompletionDate, literacyCompletionDate } from '../course-model.js';

export const celebrationUrl = course => course.id === 'math-3-4' ? 'celebration.html' : 'celebration.html?course=' + course.id;
export function courseCompleted(course) {
  const expected = { 'math-3-4':12, 'math-4-5':10, 'math-5-6':10, 'math-6-7':10, 'memory-3-4':6, 'writing-3-4':6, 'literacy-3-4':5, 'logic-3-4':7, 'speech-3-4':10, 'speech-4-5':10 };
  return course?.modules.length === expected[course?.id] && Boolean(expected[course?.id]) &&
    course.modules.every(module => moduleStars(course,module) === module.lessons.length);
}

const panel = globalThis.document?.querySelector('#course-celebration');
if (panel) {
  const requested = new URLSearchParams(location.search).get('course');
  const course = findCourse(['math-4-5','math-5-6','math-6-7','memory-3-4','writing-3-4','literacy-3-4','logic-3-4','speech-3-4','speech-4-5'].includes(requested) ? requested : 'math-3-4');
  if(course.id==='writing-3-4') {
    const {mountWritingFinale}=await import('../writing/finale.js');
    const stars=course.modules.reduce((sum,module)=>sum+moduleStars(course,module),0);
    mountWritingFinale(panel,course,courseCompleted(course),stars,writingCompletionDate());
  } else if (course.id === 'speech-4-5') {
    const { mountSpeech45Finale } = await import('../speech45/finale.js');
    const stars = course.modules.reduce((sum,module) => sum + moduleStars(course,module),0);
    mountSpeech45Finale(panel,course,courseCompleted(course),stars);
  } else if (course.id === 'speech-3-4') {
    const { mountSpeechFinale } = await import('../speech/finale.js');
    const stars = course.modules.reduce((sum,module) => sum + moduleStars(course,module),0);
    mountSpeechFinale(panel,course,courseCompleted(course),stars);
  } else if (course.id === 'logic-3-4') {
    const { mountLogicFinale } = await import('../logic/finale.js');
    const stars = course.modules.reduce((sum,module) => sum + moduleStars(course,module),0);
    mountLogicFinale(panel,course,courseCompleted(course),stars);
  } else if (course.id === 'literacy-3-4') {
    const { mountLiteracyFinale } = await import('../literacy/finale.js');
    const stars = course.modules.reduce((sum, module) => sum + moduleStars(course, module), 0);
    mountLiteracyFinale(panel, course, courseCompleted(course), stars, literacyCompletionDate());
  } else if(course.id==='memory-3-4') {
    const {mountMemoryFinale}=await import('../memory/finale.js');
    const stars=course.modules.reduce((sum,module)=>sum+moduleStars(course,module),0);
    mountMemoryFinale(panel,course,courseCompleted(course),stars,memoryCompletionDate());
  } else {
    const older = course.id === 'math-5-6';
    const graduation = course.id === 'math-6-7';
    const total = course.modules.reduce((sum,module)=>sum+module.lessons.length,0);
    panel.querySelector('a').href = 'program.html?course=' + course.id;
    const stars = course.modules.reduce((sum,module)=>sum+moduleStars(course,module),0);
    if (courseCompleted(course)) {
      panel.querySelector('h1').textContent = graduation ? 'Выпускник математической Академии Луми' : older ? 'Луми и великий математический исследователь' : course.id === 'math-4-5' ? 'Мир чисел и фигур пройден!' : 'Ты прошёл математику с Луми!';
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
      if (older || graduation) {
        panel.classList.add('math56-celebration');
        panel.querySelector('img').src = 'assets/sensory/lumi-graduate.webp';
        panel.querySelector('img').alt = 'Луми в академической мантии';
        const skills = document.createElement('p');
        skills.textContent = graduation ? 'Ты умеешь считать до десяти, складывать, вычитать и решать задачи. Ты различаешь фигуры и тела, измеряешь мерками, читаешь карты, часы и календарь.' : 'Ты умеешь считать до десяти, сравнивать группы, собирать фигуры, измерять мерками, прокладывать маршрут и пользоваться календарём.';
        panel.querySelector('p').after(skills);
      }
      if (graduation) {
        panel.classList.add('math67-celebration');
        panel.querySelector('a').textContent = 'Вернуться в Академию';
        panel.querySelector('a').href = 'age-6-7.html';
        const replay = document.createElement('a');
        replay.className = 'academy-button';
        replay.href = 'program.html?course=math-6-7';
        replay.textContent = 'Выбрать урок для повторения';
        panel.querySelector('a').after(replay);
        mountDiploma(panel, completionDate67(), total);
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
}
