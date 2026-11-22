import math from './math-3-4.js';
import speech from './speech-3-4.js';
import literacy from './literacy-3-4.js';
import logic from './logic-3-4.js';
import memory from './memory-3-4.js';
import writing from './writing-3-4.js';
import { lessonContent } from './lesson-content.js';

export const courses = [math, speech, literacy, logic, memory, writing].map(course => ({
  ...course,
  age: '3–4 года',
  agePage: 'age-3-4.html',
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
}));
