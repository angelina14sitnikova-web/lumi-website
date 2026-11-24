import assert from 'node:assert/strict';
import { findCourse, practiceIsReady, checkAnswer, saveCompletion, moduleStars } from '../course-model.js';
import { courseCompleted } from '../activities/celebration.js';

const store = new Map();
globalThis.localStorage = { getItem: k => store.get(k), setItem: (k,v) => store.set(k,v) };
const course = findCourse('math-5-6');
assert.equal(course.modules.length,10);
assert(!courseCompleted(course));
for (const module of course.modules) {
  assert(module.reward);
  assert.equal(module.lessons.length,6);
  for (const [index,lesson] of module.lessons.entries()) {
    assert.equal(lesson.scenes.length,3);
    assert.equal(lesson.practice.length,5);
    assert(practiceIsReady(lesson));
    const answers=lesson.practice.map(task=>{
      const response=task.rounds.map(round=>round.answers);
      assert(checkAnswer(task,response));
      assert(!checkAnswer(task,response.slice(1)));
      const wrong=response.map((row,i)=>i ? row : [{...row[0],from:-1},...row.slice(1)]);
      assert(!checkAnswer(task,wrong));
      return response;
    });
    assert(!saveCompletion(course,module,lesson,answers.slice(1)));
    assert(saveCompletion(course,module,lesson,answers));
    assert(saveCompletion(course,module,lesson,answers));
    assert.equal(moduleStars(course,module),index+1);
  }
}
assert(courseCompleted(course));
assert(!courseCompleted(findCourse('math-3-4')));
assert(!courseCompleted(findCourse('math-4-5')));
console.log('PASS: 60 lessons, 180 scenes, 300 exercises, 60 unique stars and 10 module rewards.');
