import {test} from 'node:test';
import assert from 'node:assert/strict';
import {courseCounts, findCourse, practiceIsReady, saveCompletion, moduleStars} from '../course-model.js';
import {memoryAnswer, memoryRoundAnswer, restoringProgress} from '../memory/model.js';
import {painting, regions} from '../memory/art.js';
import {observers} from '../data/memory34/observers.js';

const course=findCourse('memory-3-4');
const module=course.modules[0];
test('course keeps its catalogue ids; six observer lessons and their art are valid',()=>{
  assert.deepEqual(courseCounts(course),{modules:6,lessons:36});
  assert.deepEqual(module.lessons.map(lesson=>lesson.id),Object.keys(observers));
  assert.equal(module.lessons.flatMap(lesson=>lesson.scenes).length,18);
  assert.equal(module.lessons.flatMap(lesson=>lesson.practice).length,30);
  for (const lesson of module.lessons) {
    assert.ok(practiceIsReady(lesson),lesson.title);
    for(const task of lesson.practice) {
      const correct=task.rounds.map(round=>round.answer);
      assert.ok(memoryAnswer(task,correct));
      assert.equal(memoryAnswer(task,correct.slice(1)),false);
      for(const round of task.rounds) {
        if (round.kind==='track') {
          assert.equal(round.answer,round.destinations[round.path.at(-1)]);
          assert.ok(round.path.every(step=>step>=0&&step<round.destinations.length));
        }
        for(const art of [round.picture,round.left,round.right,round.subject,...(round.sample??[]),
            ...(['find','set','track'].includes(round.kind)?round.options:[])].filter(Boolean)) {
          assert.ok(!painting(art).includes('undefined'),art);
        }
        if(round.kind==='difference') {
          assert.notEqual(painting(round.left),painting(round.right));
          assert.ok(round.answer.every(target=>regions[round.left.split('-')[0]][target]&&regions[round.right.split('-')[0]][target]));
        }
      }
    }
  }
});
test('difference and set answers disregard ordering and reject duplicates',()=>{
  const round=module.lessons[3].practice[4].rounds[0];
  assert.equal(memoryRoundAnswer(round,['tree','ball','roof']),true);
  assert.equal(memoryRoundAnswer(round,['tree','tree','roof']),false);
  assert.equal(memoryRoundAnswer(round,['tree','ball']),false);
});
test('existing star storage grants the award once and preserves earlier courses',()=>{
  const other=JSON.stringify(['math-6-7','module','lesson']);
  let storage=JSON.stringify([other]);
  globalThis.localStorage={getItem:()=>storage,setItem:(key,val)=>{storage=val;}};
  for(const lesson of module.lessons) {
    assert.equal(saveCompletion(course,module,lesson,[]),false);
    const answers=lesson.practice.map(task=>task.rounds.map(round=>round.answer));
    assert.equal(saveCompletion(course,module,lesson,answers),true);
    assert.equal(saveCompletion(course,module,lesson,answers),true);
  }
  assert.equal(moduleStars(course,module),6);
  assert.equal(JSON.parse(storage).length,7);
  assert.ok(JSON.parse(storage).includes(other));
});
test('partial practice can be resumed only with valid task answers',()=>{
  const lesson=module.lessons[0];
  const snapshot={stage:'practice',answers:[['ears'],['wheels']],roundAnswers:['roof']};
  assert.deepEqual(restoringProgress(lesson,snapshot),snapshot);
  assert.equal(restoringProgress(lesson,{...snapshot,roundAnswers:['door']}),null);
});

test('the castle covers all six visual memory lessons and preserves sample positions',()=>{
  const lessons=course.modules[1].lessons;
  assert.equal(lessons.flatMap(lesson=>lesson.scenes).length,18);
  assert.equal(lessons.flatMap(lesson=>lesson.practice).length,30);
  for(const lesson of lessons){
    assert.ok(practiceIsReady(lesson),lesson.title);
    for(const task of lesson.practice){
      assert.ok(memoryAnswer(task,task.rounds.map(round=>round.answer)),task.title);
      for(const round of task.rounds){
        for(const item of round.sample) assert.ok(!painting(item).includes('undefined'),item);
        if(round.kind==='missing'){
          assert.deepEqual(round.after,round.sample.map((value,index)=>index===round.slot?null:value));
          assert.equal(round.sample[round.slot],round.answer);
        }
        if(['arrange','paint'].includes(round.kind)&&new Set(round.answer).size>1){
          assert.equal(memoryRoundAnswer(round,[...round.answer].reverse()),false);
        }
        if(round.kind==='memory-set'){
          assert.equal(memoryRoundAnswer(round,[...round.answer].reverse()),true);
        }
      }
    }
  }
});
