import math from './math-3-4.js';
import speech from './speech-3-4.js';
import literacy from './literacy-3-4.js';
import logic from './logic-3-4.js';
import memory from './memory-3-4.js';
import writing from './writing-3-4.js';
import math45 from './math-4-5.js';
import speech45 from './speech-4-5.js';
import literacy45 from './literacy-4-5.js';
import logic45 from './logic-4-5.js';
import memory45 from './memory-4-5.js';
import writing45 from './writing-4-5.js';
import math56 from './math-5-6.js';
import speech56 from './speech-5-6.js';
import literacy56 from './literacy-5-6.js';
import logic56 from './logic-5-6.js';
import memory56 from './memory-5-6.js';
import writing56 from './writing-5-6.js';
import math67 from './math-6-7.js';
import speech67 from './speech-6-7.js';
import literacy67 from './literacy-6-7.js';
import logic67 from './logic-6-7.js';
import memory67 from './memory-6-7.js';
import writing67 from './writing-6-7.js';
import { lessonContent } from './lesson-content.js';

const ageGroups = [
  {
    id: '3-4',
    label: '3–4 года',
    programs: [math, speech, literacy, logic, memory, writing],
  },
  {
    id: '4-5',
    label: '4–5 лет',
    programs: [
      { ...math, modules: math45 },
      { ...speech, modules: speech45 },
      { ...literacy, modules: literacy45 },
      { ...logic, modules: logic45 },
      { ...memory, modules: memory45 },
      { ...writing, modules: writing45 },
    ],
  },
  {
    id: '5-6',
    label: '5–6 лет',
    programs: [
      {
        ...math,
        modules: math56,
        room: { image: 'assets/math-classroom-5-6.webp', alt: 'Математический кабинет со счётами, лентами для измерения и деревянными фигурами', width: 600, height: 600 },
      },
      {
        ...speech,
        modules: speech56,
        room: { image: 'assets/speech-classroom-5-6.webp', alt: 'Сказочная гостиная с книгой и кукольной сценой', width: 600, height: 600 },
      },
      {
        ...literacy,
        modules: literacy56,
        room: { image: 'assets/literacy-classroom-5-6.webp', alt: 'Сказочная библиотека с колокольчиками и раскрытой книгой', width: 600, height: 600 },
      },
      {
        ...logic,
        modules: logic56,
        room: { image: 'assets/logic-classroom-5-6.webp', alt: 'Мастерская с головоломками, узорами и деревянными фигурами', width: 600, height: 600 },
      },
      {
        ...memory,
        modules: memory56,
        room: { image: 'assets/memory-classroom-5-6.webp', alt: 'Кабинет наблюдений с телескопом, карточками и лупой', width: 600, height: 600 },
      },
      {
        ...writing,
        modules: writing56,
        room: { image: 'assets/writing-classroom-5-6.webp', alt: 'Творческая мастерская с бумагой, карандашами и альбомом', width: 600, height: 600 },
      },
    ],
  },
  {
    id: '6-7',
    label: '6–7 лет',
    programs: [
      {
        ...math,
        modules: math67,
        room: { image: 'assets/math-classroom-6-7.webp', alt: 'Математический кабинет со счётами и геометрическими фигурами', width: 600, height: 600 },
      },
      {
        ...speech,
        modules: speech67,
        room: { image: 'assets/speech-classroom-6-7.webp', alt: 'Сказочный театр с кукольной сценой и иллюстрированной книгой', width: 600, height: 600 },
      },
      {
        ...literacy,
        modules: literacy67,
        room: { image: 'assets/literacy-classroom-6-7.webp', alt: 'Сказочная библиотека с раскрытыми книгами', width: 600, height: 600 },
        readingNote: 'Чтение слов и предложений в Академии — дополнительное направление. Умение читать не требуется при поступлении в первый класс.',
        readingSource: 'https://xn--273--84d1f.xn--p1ai/voprosy_i_otvety/obyazatelno-li-rebenok-dolzhen-budet-umet-chitat-pri-postuplenii-v-pervyy-klass',
      },
      {
        ...logic,
        modules: logic67,
        room: { image: 'assets/logic-classroom-6-7.webp', alt: 'Мастерская с головоломками и геометрическими узорами', width: 600, height: 600 },
      },
      {
        ...memory,
        modules: memory67,
        room: { image: 'assets/memory-classroom-6-7.webp', alt: 'Обсерватория с телескопом и парными карточками', width: 600, height: 600 },
      },
      {
        ...writing,
        modules: writing67,
        room: { image: 'assets/writing-classroom-6-7.webp', alt: 'Творческая мастерская с бумагой, карандашами и тетрадью', width: 600, height: 600 },
      },
    ],
  },
];

export const courses = ageGroups.flatMap(group => group.programs.map(course => ({
  ...course,
  id: course.theme + '-' + group.id,
  age: group.label,
  agePage: 'age-' + group.id + '.html',
  ageTone: 'academy-tone-' + group.id,
  modules: course.modules.map(([module, ...titles]) => ({
    ...module,
    lessons: titles.map(([id, title]) => ({
      id,
      title,
      scenes: [],
      practice: [],
      ...lessonContent[id],
    })),
  })),
})));
