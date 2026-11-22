import { courses } from './data/courses.js';
import { courseCounts, programUrl } from './course-model.js';

const list = document.querySelector('#subjects');
let moduleTotal = 0;
let lessonTotal = 0;

for (const course of courses.filter(item => item.agePage === 'age-3-4.html')) {
  const counts = courseCounts(course);
  moduleTotal += counts.modules;
  lessonTotal += counts.lessons;
  const item = document.createElement('li');
  item.dataset.courseTheme = course.theme;

  const link = document.createElement('a');
  link.className = 'subject-card academy-frame';
  link.href = programUrl(course);

  const image = document.createElement('img');
  image.src = course.icon;
  image.alt = '';
  image.width = 320;
  image.height = 320;
  image.loading = 'lazy';

  const body = document.createElement('div');
  const title = document.createElement('h3');
  title.textContent = course.title;
  const count = document.createElement('p');
  count.textContent = 'Модулей: ' + counts.modules + ' · Уроков: ' + counts.lessons;
  const arrow = document.createElement('span');
  arrow.className = 'subject-card-arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '→';

  body.append(title, count);
  link.append(image, body, arrow);
  item.append(link);
  list.append(item);
}

document.querySelector('#subjects-count').textContent =
  'Предметов: ' + list.childElementCount + ' · Модулей: ' + moduleTotal + ' · Уроков: ' + lessonTotal;
