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

test('all 36 writing lessons have valid activities, rewards and a unique completion date',async()=>{
  const {writingCompletionDate}=await import('../course-model.js');
  const {drawnRoute,traceProgress}=await import('../writing/geometry.js');
  const course=findCourse('writing-3-4');
  const values=new Map;
  globalThis.localStorage={getItem:key=>values.get(key),setItem:(key,value)=>values.set(key,value)};
  const all=course.modules.flatMap(module=>module.lessons);
  assert.equal(all.length,36);
  assert.equal(all.flatMap(lesson=>lesson.scenes).length,108);
  assert.equal(all.flatMap(lesson=>lesson.practice).length,180);
  assert.equal(new Set(all.map(lesson=>lesson.id)).size,36);
  assert.equal(new Set(course.modules.map(module=>module.writingPaint)).size,6);
  assert.equal(writingCompletionDate(),null);
  for(const module of course.modules){
    for(const lesson of module.lessons){
      assert.equal(practiceIsReady(lesson),true);
      assert.equal(lesson.scenes.length,3);
      assert.equal(lesson.practice.length,5);
      for(const board of [...lesson.scenes.map(s=>s.board),...lesson.practice.flatMap(task=>task.rounds)]){
        assert.ok(writingBoardReady(board));
        if(board.mode==='route'){
          const routes=board.corridors.length?board.corridors:board.demoPaths;
          for(const path of routes)assert.ok(drawnRoute([{tool:'brush',points:path}],board),lesson.title);
        }
        if(board.mode==='trace'){
          const strokes=board.targets.map(t=>({tool:'brush',points:t.points}));
          for(const target of board.targets)assert.equal(traceProgress(strokes,target),true,lesson.title);
        }
      }
      assert.equal(saveCompletion(course,module,lesson,lesson.practice.map(task=>task.rounds.map(round=>round.kind))),true);
    }
    assert.equal(moduleStars(course,module),6);
  }
  assert.ok(Number.isFinite(Date.parse(writingCompletionDate())));
  const recorded=writingCompletionDate();
  const module=course.modules.at(-1), lesson=module.lessons.at(-1);
  assert.equal(saveCompletion(course,module,lesson,lesson.practice.map(task=>task.rounds.map(round=>round.kind))),true);
  assert.equal(moduleStars(course,module),6);
  assert.equal(writingCompletionDate(),recorded);
});
