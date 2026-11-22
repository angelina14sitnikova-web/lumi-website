import assert from 'node:assert/strict';
import { canOpen, courseCounts, findCourse, findLesson, isComplete, lessonUrl, passPractice, saveCompletion } from '../course-model.js';

const storage = new Map();
globalThis.localStorage = {
  getItem: key => storage.get(key),
  setItem: (key, value) => storage.set(key, value),
};

const course = findCourse();
const ids = new Set();
const urls = new Set();
const subjects = [
  ['math-3-4', 12, 84],
  ['speech-3-4', 10, 60],
  ['literacy-3-4', 5, 30],
  ['logic-3-4', 7, 42],
  ['memory-3-4', 6, 36],
  ['writing-3-4', 6, 36],
  ['math-4-5', 10, 60],
  ['speech-4-5', 10, 60],
  ['literacy-4-5', 6, 36],
  ['logic-4-5', 7, 42],
  ['memory-4-5', 6, 36],
  ['writing-4-5', 6, 36],
  ['math-5-6', 10, 60],
  ['speech-5-6', 10, 60],
  ['literacy-5-6', 7, 42],
  ['logic-5-6', 7, 42],
  ['memory-5-6', 7, 42],
  ['writing-5-6', 7, 42],
];
for (const [courseId, modules, lessons] of subjects) {
  const subject = findCourse(courseId);
  assert.deepEqual(courseCounts(subject), { modules, lessons });
  assert(!ids.has(subject.id));
  ids.add(subject.id);
  for (const module of subject.modules) {
    assert(!ids.has(module.id));
    ids.add(module.id);
    for (const lesson of module.lessons) {
      assert(!ids.has(lesson.id));
      ids.add(lesson.id);
      urls.add(lessonUrl(subject, module, lesson));
      assert.equal(findLesson(subject, module.id, lesson.id).lesson, lesson);
      if (!canOpen(lesson)) assert(!isComplete(subject, module, lesson));
    }
  }
}
assert.equal(urls.size, 846);
assert.deepEqual(findLesson(course, 'missing', 'missing'), { module: undefined, lesson: undefined });

const module = { id: 'fixture-module' };
const empty = { id: 'fixture-lesson', scenes: [], practice: [] };
assert(!saveCompletion(course, module, empty, []));
assert(!storage.size);

const task = { kind: 'choice', choices: [{ id: 'left' }, { id: 'right' }], correct: 'right' };
const lesson = { ...empty, scenes: [{}], practice: [task, task] };
assert(!passPractice(lesson, ['right']));
assert(!saveCompletion(course, module, lesson, ['right', 'left']));
assert(!isComplete(course, module, lesson));
assert(saveCompletion(course, module, lesson, ['right', 'right']));
assert(isComplete(course, module, lesson));

console.log('PASS: 846 unique lesson routes and completion requires all practice answers');
