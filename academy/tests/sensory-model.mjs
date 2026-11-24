import assert from 'node:assert/strict';
import { checkAnswer, findCourse, moduleStars, practiceIsReady, saveCompletion } from '../course-model.js';

const store = new Map();
globalThis.localStorage = { getItem: key => store.get(key), setItem: (key, value) => store.set(key, value) };
const course = findCourse();
for (const module of course.modules.slice(2, 8)) {
  assert.equal(module.lessons.length, 7);
  assert(module.reward);
  assert.equal(moduleStars(course, module), 0);
  for (const [index, lesson] of module.lessons.entries()) {
    assert.equal(lesson.scenes.length, 3);
    assert(lesson.scenes.every(scene => scene.text && scene.pieces.length));
    assert.equal(lesson.practice.length, 5);
    assert(practiceIsReady(lesson));
    const responses = lesson.practice.map(task => {
      assert(task.guide && task.prompt);
      const valid = task.rounds.map(round => round.answers);
      assert(checkAnswer(task, valid));
      assert(!checkAnswer(task, valid.slice(1)));
      assert(!checkAnswer(task, [[{ from: -1 }], ...valid.slice(1)]));
      for (const round of task.rounds) {
        if (round.starts) {
          assert.deepEqual(round.answers.map(answer => answer.from),
            round.pieces.flatMap((piece, i) => piece.color !== round.targets[round.starts[i]].color ? [i] : []));
        }
        if (round.overlay) {
          for (const { from, to } of round.answers) assert.equal(round.pieces[from].shape, round.targets[to].shape);
        }
      }
      return valid;
    });
    assert(!saveCompletion(course, module, lesson, responses.slice(0, -1)));
    assert(saveCompletion(course, module, lesson, responses));
    assert(saveCompletion(course, module, lesson, responses));
    assert.equal(moduleStars(course, module), index + 1);
  }
}
assert(course.modules.slice(8).every(module => module.lessons.every(lesson => lesson.scenes.length === 0)));
console.log('PASS: 42 lessons, 126 scenes, 210 exercises and 6 separate rewards.');
