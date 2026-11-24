import assert from 'node:assert/strict';
import { comparisonAnswer, comparisonReady } from '../activities/comparison-model.js';
import { findCourse, practiceIsReady, saveCompletion } from '../course-model.js';

const course = findCourse('math-3-4');
const [module, ...futureModules] = course.modules;
assert.equal(module.id, 'compare');
assert.equal(module.lessons.length, 7);

for (const lesson of module.lessons) {
  assert.equal(lesson.format, 'comparison');
  assert.equal(lesson.scenes.length, 3);
  assert.equal(lesson.practice.length, 5);
  assert(practiceIsReady(lesson));
  for (const task of lesson.practice) {
    assert(comparisonReady(task));
    assert(task.guide.length > 30);
    if (task.pairs) {
      const answer = [...task.pairs].reverse().map(([a, b]) => [b, a]);
      assert(comparisonAnswer(task, answer));
      assert(!comparisonAnswer(task, answer.slice(1)));
      assert(!comparisonAnswer(task, answer.map(() => [-1, 0])));
      for (const [a, b] of answer) assert.deepEqual(task.options[a], task.options[b]);
    } else {
      const answer = task.rounds.map(round => round.correct);
      assert(comparisonAnswer(task, answer));
      assert(!comparisonAnswer(task, [-1, ...answer.slice(1)]));
    }
  }
  assert(!saveCompletion(course, module, lesson, []));
}

const odd = module.lessons[5];
for (const { rounds: [{ options, correct, view }] } of odd.practice) {
  const feature = view.feature || 'color';
  const matches = options.filter((_, index) => index !== correct);
  assert.equal(new Set(matches.map(toy => toy[feature])).size, 1);
  assert.notEqual(options[correct][feature], matches[0][feature]);
}

assert(futureModules.slice(7).every(next => next.lessons.every(lesson => !lesson.scenes.length)));
console.log('PASS: 21 scenes, 35 exercises, unique grouping rules and no completion before practice.');
