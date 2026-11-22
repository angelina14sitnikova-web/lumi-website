import assert from 'node:assert/strict';
import { canOpen, findCourse, findLesson, isComplete, lessonUrl, passPractice, saveCompletion } from '../course-model.js';

const storage = new Map();
globalThis.localStorage = {
  getItem: key => storage.get(key),
  setItem: (key, value) => storage.set(key, value),
};

const course = findCourse();
const ids = new Set();
const urls = new Set();
assert.equal(course.modules.length, 12);
for (const module of course.modules) {
  assert.equal(module.lessons.length, 7);
  for (const lesson of module.lessons) {
    assert(!ids.has(lesson.id));
    ids.add(lesson.id);
    urls.add(lessonUrl(course, module, lesson));
    assert.equal(findLesson(course, module.id, lesson.id).lesson, lesson);
    if (!canOpen(lesson)) assert(!isComplete(course, module, lesson));
  }
}
assert.equal(urls.size, 84);
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

console.log('PASS: 84 unique lesson routes and completion requires all practice answers');
