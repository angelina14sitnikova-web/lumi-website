import { canOpen, findCourse, isComplete, lessonUrl, practiceIsReady } from './course-model.js';

const catalog = document.querySelector('#modules');
const params = new URLSearchParams(location.search);
const course = findCourse(params.get('course') ?? undefined);

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function updateCatalog() {
  if (!course || !course.modules.length) {
    const notice = element('div', 'course-notice academy-frame');
    notice.append(element('p', '', course
      ? 'Список модулей и уроков появится здесь после утверждения программы.'
      : 'Эта учебная программа пока недоступна.'));
    if (!course) {
      document.querySelector('#course-title').textContent = 'Учебная программа';
      document.querySelector('#course-count').hidden = true;
    }
    catalog.replaceChildren(notice);
    return;
  }

  const list = element('ol', 'course-modules');
  course.modules.forEach((module, moduleIndex) => {
    const card = element('li', 'academy-frame course-module');
    const details = element('details');
    details.id = 'module-' + module.id;
    details.open = moduleIndex === 0 && !location.hash;
    const summary = element('summary');
    const cover = element('img', 'course-module-cover');
    cover.src = module.cover || 'assets/subject-math.webp';
    cover.alt = '';
    cover.width = 96;
    cover.height = 96;
    cover.loading = 'lazy';
    const name = element('span', 'course-module-name');
    name.append(element('span', 'course-kicker', 'Модуль ' + (moduleIndex + 1)), element('strong', '', module.title));
    summary.append(cover, name);
    details.append(summary);

    if (!module.lessons.length) {
      details.append(element('p', 'course-module-empty', 'Уроки готовятся.'));
    } else {
      const lessons = element('ol', 'course-lessons');
      module.lessons.forEach((lesson, lessonIndex) => {
        const row = element('li', 'course-lesson-row');
        const number = (moduleIndex + 1) + '.' + (lessonIndex + 1);
        row.append(element('span', 'course-lesson-number', number));
        const link = element('a', '', lesson.title);
        link.href = lessonUrl(course, module, lesson);
        row.append(link);
        if (isComplete(course, module, lesson)) {
          row.append(element('span', 'course-status', 'Пройден'));
        } else if (!canOpen(lesson)) {
          row.append(element('span', 'course-status', 'Готовится'));
        } else if (!practiceIsReady(lesson)) {
          row.append(element('span', 'course-status', 'Объяснение доступно'));
        }
        const arrow = element('span', 'course-open-arrow', '→');
        arrow.setAttribute('aria-hidden', 'true');
        link.append(arrow);
        lessons.append(row);
      });
      details.append(lessons);
    }
    card.append(details);
    list.append(card);
  });
  catalog.replaceChildren(list);
}

function openModuleFromHash() {
  const current = [...catalog.querySelectorAll('details')].find(details =>
    '#' + encodeURIComponent(details.id) === location.hash);
  if (!current) return;
  current.open = true;
  current.scrollIntoView({ behavior: 'instant', block: 'start' });
}

if (course) {
  document.querySelector('#course-title').textContent = course.title + ' · ' + course.age;
  const lessonCount = course.modules.reduce((count, module) => count + module.lessons.length, 0);
  document.querySelector('#course-count').textContent = 'Модулей: ' + course.modules.length + ' · Уроков: ' + lessonCount;
  document.querySelector('.academy-return').href = course.agePage;
  document.title = course.title + ' · ' + course.age + ' — Академия Луми';
}
updateCatalog();
openModuleFromHash();
window.addEventListener('hashchange', openModuleFromHash);
window.addEventListener('pageshow', event => {
  if (event.persisted) {
    const open = [...catalog.querySelectorAll('details[open]')].map(details => details.id);
    updateCatalog();
    open.forEach(id => { const details = document.getElementById(id); if (details) details.open = true; });
  }
});
