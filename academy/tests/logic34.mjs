import {test} from 'node:test';
import assert from 'node:assert/strict';
import {findCourse,practiceIsReady,passPractice} from '../course-model.js';
import {answer,expected,matches,validRound} from '../logic/model.js';
import {match,odd} from '../data/logic34/builders.js';

test('logic lesson content preserves catalogue routes, and all enabled rounds are playable',()=>{
 const course=findCourse('logic-3-4');
 assert.equal(course.modules.length,7);
 let enabled=0;
 for(const [m,module] of course.modules.entries()){
  assert.equal(module.lessons.length,6);
  for(const [l,lesson] of module.lessons.entries()){
   assert.equal(lesson.id,'logic-lesson-'+(m+1)+'-'+(l+1));
   if(!lesson.scenes.length)continue;
   enabled++;
   assert.equal(lesson.scenes.length,3);
   assert.equal(lesson.practice.length,5);
   for(const scene of lesson.scenes)assert.ok(validRound(scene.example),lesson.id);
   assert.ok(practiceIsReady(lesson),lesson.id);
   assert.ok(passPractice(lesson,lesson.practice.map(t=>t.rounds.map(expected))),lesson.id);
   assert.equal(passPractice(lesson,[]),false);
  }
 }
 assert.equal(enabled,42);
});
test('correspondence is based on attributes and accepts every complete pairing',()=>{
 const pair=match(['car:red','bear:red'],['ball:red','top:red'],'color');
 assert.ok(answer(pair,[0,1]));
 assert.ok(answer(pair,[1,0]));
 assert.equal(answer(pair,[0,0]),false);
 const select=match(['car'],['car:red','car','car:mint']);
 assert.deepEqual(expected(select),[null,0,null]);
 assert.ok(answer(select,[null,0,null]));
 assert.equal(answer(select,[0,null,null]),false);
 assert.equal(matches('car','wheel','part'),true);
 assert.equal(matches('house','wheel','part'),false);
});
test('odd-one-out uses the requested property and excludes ambiguous groups',()=>{
 const r=odd(['circle:red','square:red','circle:blue'],'shape','Форма');
 assert.equal(validRound(r),true);
 assert.equal(answer(r,1),true);
 assert.equal(answer(r,2),false);
 assert.equal(validRound(odd(['circle:red','square:red','triangle:blue'],'shape','Форма')),false);
});

test('story tasks accept every useful tool and reject unrelated objects',()=>{
 const course=findCourse('logic-3-4');
 const games=course.modules.at(-1).lessons.flatMap(lesson=>lesson.practice.flatMap(task=>task.rounds)).filter(r=>r.kind==='story');
 assert.ok(games.length>=10);
 const variants=games.find(r=>r.use==='cross');
 assert.ok(answer(variants,{choice:variants.items.indexOf('bridge'),checked:true}));
 assert.ok(answer(variants,{choice:variants.items.indexOf('plank'),checked:true}));
 assert.equal(answer(variants,{choice:variants.items.indexOf('lid'),checked:true}),false);
 for(const r of games){
  const e=expected(r);
  assert.ok(answer(r,e));
  assert.equal(answer(r,{choice:e.choice,checked:false}),false);
 }
});
test('a two-piece puzzle requires two distinct fragments and exact destinations',()=>{
 const task=findCourse('logic-3-4').modules[4].lessons[0].practice[0].rounds[0];
 assert.equal(task.layout,'twoVertical');
 assert.ok(answer(task,[1,0]));
 assert.equal(answer(task,[0,1]),false);
 assert.equal(answer(task,[1,1]),false);
});
