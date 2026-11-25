import test from 'node:test';
import assert from 'node:assert/strict';
import {findCourse,isComplete,saveCompletion,practiceIsReady,moduleStars} from '../course-model.js';
import {writingBoardReady,readWritingProgress} from '../writing/model.js';

test('the makers have six lessons with permanent routes and five practical exercises each',()=>{
  const course=findCourse('writing-3-4'), module=course.modules[0];
  assert.equal(course.modules.length,6);
  assert.equal(module.reward,'Медаль ловких пальчиков');
  assert.equal(module.writingPaint,'золотистая');
  assert.deepEqual(module.lessons.map(l=>l.id),Array.from({length:6},(_,i)=>'writing-lesson-1-'+(i+1)));
  for(const lesson of module.lessons){
    assert.equal(practiceIsReady(lesson),true);
    assert.equal(lesson.scenes.length,3);
    assert.ok(lesson.scenes.every(s=>writingBoardReady(s.board)));
    assert.equal(lesson.practice.length,5);
  }
});

test('writing lessons use the Academy star store and can be replayed without extra stars',()=>{
  const values=new Map;
  globalThis.localStorage={getItem:key=>values.get(key),setItem:(key,value)=>values.set(key,value)};
  const course=findCourse('writing-3-4'), module=course.modules[0], lesson=module.lessons[0];
  const answers=lesson.practice.map(task=>task.rounds.map(round=>round.kind));
  const math='["math-3-4","lesson-module","earlier-lesson"]';
  values.set('lumi.academy.completed.v1',JSON.stringify([math]));
  assert.equal(saveCompletion(course,module,lesson,[]),false);
  assert.equal(readWritingProgress(lesson,{stage:'practice',scene:2,answers:answers.slice(0,4),rounds:['hand']}).rounds.length,1);
  assert.equal(saveCompletion(course,module,lesson,answers),true);
  assert.equal(saveCompletion(course,module,lesson,answers),true);
  assert.equal(isComplete(course,module,lesson),true);
  assert.equal(moduleStars(course,module),1);
  assert.ok(JSON.parse(values.get('lumi.academy.completed.v1')).includes(math));
});
