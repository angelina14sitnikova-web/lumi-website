import { el, button } from '../writing/ui.js';
import { toBlob, downloadImage, printDrawing } from '../writing/gallery.js';
import { programUrl } from '../course-model.js';

const title = 'Хранитель волшебного мира звуков';
const lumi = new URL('../../images/lumi-transparent.png', import.meta.url);
const island = new URL('./media/island/cover.webp', import.meta.url);

function image(src, alt) {
  const img = el('img');
  img.src = src;
  img.alt = alt;
  return img;
}

function link(text, href) {
  const anchor = el('a', 'academy-button', text);
  anchor.href = href;
  return anchor;
}

function certificate(course, stars, date, cover, mascot) {
  const section = el('section', 'academy-diploma literacy-certificate ym-hide-content');
  const label = el('label', '', 'Имя на грамоте по желанию');
  const name = el('input', 'ym-disable-keys');
  name.type = 'text';
  name.maxLength = 50;
  name.autocomplete = 'off';
  name.spellcheck = false;
  label.append(name);

  const sheet = el('canvas');
  sheet.width = 1440;
  sheet.height = 1018;
  sheet.setAttribute('aria-label', 'Игровая грамота «' + title + '»');
  const draw = sheet.getContext('2d');
  const status = el('p');
  status.setAttribute('role', 'status');

  function paint() {
    if (!draw) return;
    const wash = draw.createLinearGradient(0, 0, 1440, 1018);
    wash.addColorStop(0, '#e6f8f0');
    wash.addColorStop(.56, '#fff8e6');
    wash.addColorStop(1, '#ecdef8');
    draw.fillStyle = wash;
    draw.fillRect(0, 0, 1440, 1018);
    if (cover.naturalWidth) {
      draw.save();
      draw.globalAlpha = .16;
      draw.drawImage(cover, 55, 465, 1330, 470);
      draw.restore();
    }
    draw.strokeStyle = '#a37d4d';
    draw.lineWidth = 5;
    draw.strokeRect(30, 30, 1380, 958);
    draw.lineWidth = 2;
    draw.strokeRect(46, 46, 1348, 926);
    draw.textAlign = 'center';
    draw.fillStyle = '#28434d';
    function text(value, x, y, font, width) {
      draw.font = font;
      draw.fillText(value, x, y, width);
    }
    text('Академия Луми', 720, 119, 'bold 34px Georgia', 1220);
    text('Игровая грамота', 720, 206, 'bold 62px Georgia', 1220);
    text(title, 720, 306, 'bold 60px Georgia', 1220);
    text(course.nameForCourse, 720, 373, '36px Georgia', 1220);
    text('Подготовка к грамоте · 3–4 года', 720, 426, '28px sans-serif', 1220);
    if (mascot.naturalWidth) {
      const scale = Math.min(440 / mascot.naturalWidth, 430 / mascot.naturalHeight);
      const w = mascot.naturalWidth * scale, h = mascot.naturalHeight * scale;
      draw.drawImage(mascot, 340 - w / 2, 680 - h / 2, w, h);
    }
    text(name.value.trim().replace(/\s+/g,' ') || 'Юный хранитель звуков', 976, 608, 'bold 50px Georgia', 700);
    text(stars + ' золотых звёзд · ' + course.modules.length + ' медалей', 976, 688, '31px sans-serif', 700);
    if (date) {
      const display = new Intl.DateTimeFormat('ru-RU', { dateStyle: 'long' }).format(new Date(date));
      text(display, 976, 747, '28px sans-serif', 700);
    }
    text('Памятная игровая награда Академии Луми', 720, 929, '26px sans-serif', 1200);
  }

  for (const img of [cover, mascot]) img.addEventListener('load', paint);
  name.addEventListener('input', paint);
  async function exportSheet(print) {
    if (!cover.naturalWidth || !mascot.naturalWidth) {
      status.textContent = 'Дождитесь, когда загрузятся иллюстрации.';
      return;
    }
    try {
      paint();
      const png = await toBlob(sheet);
      if (print) await printDrawing(png);
      else downloadImage(png, 'lumi-keeper-of-sounds.png');
      status.textContent = '';
    } catch {
      status.textContent = 'Не удалось подготовить грамоту. Попробуйте ещё раз.';
    }
  }
  const actions = el('div', 'lesson-actions');
  actions.append(button('Сохранить PNG', () => exportSheet(false)), button('Распечатать', () => exportSheet(true)));
  section.append(el('h2', '', 'Игровая грамота'), label, sheet, actions, status);
  paint();
  return section;
}

export function mountLiteracyFinale(panel, course, complete, stars, date) {
  const css = el('link');
  css.rel = 'stylesheet';
  css.href = new URL('finale.css', import.meta.url);
  document.head.append(css);
  document.body.classList.add('literacy-finale-page');
  document.title = title + ' · Академия Луми';
  panel.classList.add('literacy-finale');
  const back = link('К урокам курса', programUrl(course));
  const total = course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
  if (!complete) {
    panel.replaceChildren(el('h1', '', 'Праздник в стране звуков'),
      el('p', '', 'Пройдено ' + stars + ' из ' + total + ' уроков. Заверши курс, чтобы открыть праздник.'), back);
    return;
  }
  const banner = el('div', 'literacy-finale-banner');
  const cover = image(island, '');
  const mascot = image(lumi, 'Луми');
  banner.append(cover, mascot);
  const starField = el('div', 'literacy-finale-stars');
  starField.setAttribute('aria-label', stars + ' золотых звёзд');
  for (let i = 0; i < stars; i++) {
    const star = el('span', '', '★');
    star.style.setProperty('--delay', i % 10 * 75 + 'ms');
    star.setAttribute('aria-hidden', 'true');
    starField.append(star);
  }
  const medals = el('ul', 'literacy-finale-medals');
  for (const module of course.modules) {
    const item = el('li');
    item.append(image(module.literacyMedal, ''), el('span', '', module.reward));
    medals.append(item);
  }
  const actions = el('div', 'lesson-actions');
  actions.append(link('Выбрать урок для повторения', programUrl(course)), link('Вернуться в Академию', 'age-3-4.html'));
  panel.replaceChildren(banner, el('h1', '', title),
    el('p', '', 'Луми поздравляет тебя! Ты прошёл все уроки и собрал медали.'), starField, medals, actions,
    certificate(course, stars, date, cover, mascot));
}
