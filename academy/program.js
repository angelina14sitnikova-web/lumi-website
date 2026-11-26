import { courseCompleted, celebrationUrl } from './activities/celebration.js';
import { canOpen, courseCounts, findCourse, isComplete, lessonUrl, moduleStars, practiceIsReady } from './course-model.js';

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
    cover.src = module.cover || course.icon;
    cover.alt = '';
    cover.width = 96;
    cover.height = 96;
    cover.loading = 'lazy';
    const name = element('span', 'course-module-name');
    name.append(element('span', 'course-kicker', 'Модуль ' + (moduleIndex + 1)), element('strong', '', module.title));
    const count = element('span', 'course-module-count', 'Уроков: ' + module.lessons.length);
    summary.append(cover, name, count);
    const colorModule = module.lessons.some(lesson => lesson.format === 'colors');
    if (module.reward || colorModule || module.lessons.some(lesson => lesson.format === 'comparison')) {
      const stars = moduleStars(course, module);
      const progress = element('div', 'cmp-module-progress');
      const badge = element('span', stars === module.lessons.length ? 'cmp-medal' : 'cmp-module-star', '★');
      badge.setAttribute('aria-hidden', 'true');
      const text = element('div', '');
      text.append(element('strong', '', 'Звёздочки: ' + stars + ' из ' + module.lessons.length));
      if (stars === module.lessons.length) text.append(element('p', '', module.reward || (colorModule ? 'Радужная медаль Луми' : 'Медаль внимательного исследователя')));
      progress.append(badge, text);
      details.append(summary, progress);
      if (module.speechMedal && stars === module.lessons.length) {
        for (const [src,label] of [[module.speechMedal,module.reward],[module.speechLantern,module.speechLanternName]]) {
          const icon = element('img','course-module-cover');
          icon.src = src;
          icon.alt = label;
          details.append(icon);
        }
      }
      if (module.logicMedal && stars === module.lessons.length) {
        for (const [src,label] of [[module.logicMedal,module.reward],[module.logicKeyArt,module.logicKey]]) {
          const icon = element('img', 'course-module-cover');
          icon.src = src;
          icon.alt = label;
          details.append(icon);
        }
      }
      if (module.literacyMedal && stars === module.lessons.length) {
        const medal = element('img', 'course-module-cover');
        medal.src = module.literacyMedal;
        medal.alt = module.reward;
        medal.width = medal.height = 80;
        details.append(medal);
      }
      if (module.writingMedal && stars === module.lessons.length) {
        const medal = element('img', 'course-module-cover');
        medal.src = module.writingMedal;
        medal.alt = module.reward;
        medal.width = medal.height = 80;
        details.append(medal, element('p', '', 'Волшебная краска · ' + module.writingPaint));
      }
      if (module.memoryAlbum && stars === module.lessons.length) {
        const entry = element('figure', 'mem-album-page');
        const art = element('img');
        art.src = module.memoryAlbum.image;
        art.alt = '';
        art.loading = 'lazy';
        art.width = 160;
        art.height = 90;
        const medal = element('img');
        medal.src = module.memoryAlbum.medal;
        medal.alt = module.reward;
        medal.loading = 'lazy';
        medal.width = 60;
        medal.height = 60;
        entry.append(art, medal, element('figcaption', '', 'Страница альбома · ' + module.memoryAlbum.title));
        details.append(entry);
      }
    } else {
      details.append(summary);
    }

    if (!module.lessons.length) {
      details.append(element('p', 'course-module-empty', 'Уроки готовятся.'));
    } else {
      const lessons = element('ol', 'course-lessons');
      module.lessons.forEach((lesson, lessonIndex) => {
        const row = element('li', lesson.format === 'comparison'
          ? 'course-lesson-row cmp-course-row' : 'course-lesson-row');
        const number = (moduleIndex + 1) + '.' + (lessonIndex + 1);
        row.append(element('span', 'course-lesson-number', number));
        const link = element('a', '', lesson.title);
        link.href = lessonUrl(course, module, lesson);
        row.append(link);
        const complete = isComplete(course, module, lesson);
        const ready = practiceIsReady(lesson);
        const status = complete ? 'Пройден'
          : !canOpen(lesson) ? 'Скоро'
            : ready ? (['comparison', 'colors', 'sensory', 'memory34', 'writing34', 'literacy34', 'logic34', 'speech34', 'speech45'].includes(lesson.format) ? 'Начать' : 'Доступен') : 'Объяснение доступно';
        row.append(element('span', 'course-status', status));
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
  if (course.id === 'writing-3-4') {
    const studio = element('a', 'academy-button', 'Свободная мастерская');
    studio.href = 'writing-studio.html';
    catalog.prepend(studio);
  }
  if (course.id === 'logic-3-4') {
    const workshop = element('a','academy-button','Мастерская головоломок');
    workshop.href = 'logic-workshop.html';
    catalog.prepend(workshop);
  }
  if (course.id === 'speech-3-4') {
    const workshop = element('a','academy-button','Свободная речевая мастерская');
    workshop.href = 'speech-workshop.html';
    catalog.prepend(workshop);
  }
  if (courseCompleted(course)) {
    const celebration = element('a', 'academy-button', course.id === 'writing-3-4' ? 'Открыть выставку' : course.id === 'memory-3-4' ? 'Открыть волшебный альбом' : course.id === 'literacy-3-4' ? 'Открыть праздник звуков' : course.id === 'speech-3-4' ? 'Праздник слов' : 'Праздник открытий ✨');
    celebration.href = celebrationUrl(course);
    catalog.prepend(celebration);
  }
}

function openModuleFromHash() {
  const current = [...catalog.querySelectorAll('details')].find(details =>
    '#' + encodeURIComponent(details.id) === location.hash);
  if (!current) return;
  current.open = true;
  current.scrollIntoView({ behavior: 'instant', block: 'start' });
}

if (course) {
  document.querySelector('#course-title').replaceChildren((course.id === 'math-6-7' ? 'Академия великих математических открытий' : course.id === 'math-5-6' ? 'Лаборатория математических открытий' : course.id === 'math-4-5' ? 'Мир чисел и фигур' : ['memory-3-4', 'writing-3-4', 'literacy-3-4', 'logic-3-4', 'speech-3-4', 'speech-4-5'].includes(course.id) ? course.nameForCourse : course.title) + ' ',
    element('span', 'course-age-label', '· ' + course.age));
  const counts = courseCounts(course);
  const count = document.querySelector('#course-count');
  count.textContent = 'Модулей: ' + counts.modules + ' · Уроков: ' + counts.lessons;
  count.hidden = false;
  const main = document.querySelector('#academy-main');
  main.classList.replace('academy-tone-3-4', course.ageTone);
  main.dataset.courseTheme = course.theme;
  if (['speech-3-4','speech-4-5'].includes(course.id)) {
    main.dataset.speechCourse = '';
    document.querySelector('#course-room .academy-age-lumi').src = '../images/lumi-transparent.png';
  }
  if (course.id === 'logic-3-4') {
    main.dataset.logicCourse = '';
    document.querySelector('#course-room .academy-age-lumi').src = '../images/lumi-transparent.png';
  }
  const art = document.querySelector('#course-room-art');
  art.alt = course.room.alt;
  art.width = course.room.width;
  art.height = course.room.height;
  art.src = course.room.image;
  document.querySelector('#course-room').hidden = false;
  document.querySelector('.academy-return').href = course.agePage;
  const [ages] = course.age.split(' ');
  document.querySelector('#program-back-label').textContent = 'К предметам для ' + ages + ' лет';
  if (course.readingNote) {
    const note = element('aside', 'academy-frame course-foundation');
    const source = element('a', '', 'Разъяснение о приёме в первый класс');
    source.href = course.readingSource;
    note.append(element('p', '', course.readingNote), element('p'));
    note.lastChild.append(source);
    document.querySelector('.course-hero').after(note);
  }
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
