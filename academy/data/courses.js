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
