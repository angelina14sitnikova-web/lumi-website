import assert from 'node:assert/strict';
import { checkAnswer, findCourse, moduleStars, passPractice, practiceIsReady, saveCompletion } from '../course-model.js';
import { colorTargets, palette } from '../activities/colors-model.js';

const storage = new Map();
globalThis.localStorage = { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) };
const course = findCourse('math-3-4');
const module = course.modules[1];
assert.equal(module.id, 'colors');
assert.equal(module.lessons.length, 7);
assert.equal(new Set(module.lessons.map(lesson => lesson.room)).size, 7);
assert.equal(new Set(["red","yellow","blue","green","white","black","pink","sky","gray"].map(key => palette[key].paint)).size, 9);
assert.equal(moduleStars(course, module), 0);
for (const [lessonIndex, lesson] of module.lessons.entries()) {
  assert.equal(lesson.scenes.length, 3);
  assert(lesson.scenes.every(scene => !scene.audio && scene.text && scene.pieces.length));
  assert.equal(lesson.practice.length, 5);
  assert(practiceIsReady(lesson));
  const answers = lesson.practice.map(task => {
    assert(task.guide && task.prompt);
    const answer = colorTargets(task).map(index => ({ index, destination: task.bins ? task.pieces[index].color : null }));
    assert(checkAnswer(task, answer));
    assert(checkAnswer(task, [...answer].reverse()));
    assert(!checkAnswer(task, answer.slice(1)));
    assert(!checkAnswer(task, [{ index: -1, destination: null }, ...answer.slice(1)]));
    assert(!checkAnswer(task, [{ ...answer[0], destination: 'other' }, ...answer.slice(1)]));
    if (answer.length > 1) assert(!checkAnswer(task, answer.map(() => answer[0])));
    return answer;
  });
  assert(!passPractice(lesson, answers.slice(0, -1)));
  assert(!saveCompletion(course, module, lesson, answers.slice(0, -1)));
  assert(saveCompletion(course, module, lesson, answers));
  assert(saveCompletion(course, module, lesson, answers));
  assert.equal(moduleStars(course, module), lessonIndex + 1);
}
assert.equal(moduleStars(course, course.modules[0]), 0);
console.log('PASS: 7 lessons, 21 scenes, 35 checked exercises and 7 unique stars');
