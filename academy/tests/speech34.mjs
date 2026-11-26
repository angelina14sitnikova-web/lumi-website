import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {findCourse,practiceIsReady,passPractice} from '../course-model.js';
import {accepted,descriptionValid,example,isSpoken,roundValid} from '../speech/model.js';
import {words,phrase,offspring} from '../speech/words.js';
import {book} from '../data/speech34/texts.js';

const course=findCourse('speech-3-4');
const all=course.modules.flatMap(m=>m.lessons);
const rounds=all.flatMap(l=>l.practice.flatMap(t=>t.rounds));

test('the speech course preserves all catalogue routes and has three scenes and five games per lesson',()=>{
 assert.equal(course.modules.length,10);
 assert.equal(all.length,60);
 for(const [i,m] of course.modules.entries()){
  assert.equal(m.id,'speech-'+(i+1));
  assert.equal(m.lessons.length,6);
  for(const file of [m.cover,m.speechMedal,m.speechLantern])assert.ok(readFileSync(new URL('../'+file,import.meta.url)).length);
  for(const [j,l] of m.lessons.entries()){
   assert.equal(l.id,'speech-lesson-'+(i+1)+'-'+(j+1));
   assert.equal(l.scenes.length,3);assert.equal(l.practice.length,5);
   assert.ok(l.scenes.every(s=>s.frames.length&&descriptionValid(s)&&s.audioSrc===null));
   assert.ok(practiceIsReady(l),l.id);
   assert.ok(passPractice(l,l.practice.map(t=>t.rounds.map(example))),l.id);
   assert.equal(passPractice(l,[]),false);
  }
 }
});

test('the vocabulary uses authored forms, adjectival agreement and animal families',()=>{
 assert.deepEqual([words.ball.singular,words.ball.plural,words.ball.cases.genitive,words.ball.affection],['мяч','мячи','мяча','мячик']);
 assert.deepEqual([words.doll.plural,words.doll.cases.genitive],['куклы','куклы']);
 assert.deepEqual([words.kitten.plural,words.puppy.plural,words.house.affection],['котята','щенки','домик']);
 assert.deepEqual(['ball','car','bucket'].map(id=>phrase(id,'red')),['красный мяч','красная машинка','красное ведёрко']);
 assert.deepEqual(Object.values(offspring),['kitten','puppy','calf','foal','duckling','chick']);
});

test('oral participation is a continuation token, while digital options are checked',()=>{
 for(const r of rounds){
  assert.ok(roundValid(r));
  if(isSpoken(r)){
   assert.ok(accepted(r,'continue'));
   assert.equal(accepted(r,'Я произнёс фразу'),false);
   assert.equal(r.correct,undefined);
  }else{
   assert.equal(accepted(r,'continue'),false);
   assert.ok(accepted(r,example(r)));
  }
 }
 assert.ok(course.modules[7].lessons.every(l=>l.scenes.every(s=>s.requiresAdult)&&l.practice.every(t=>t.rounds.every(r=>r.requiresAdult))));
});

test('preposition cards check the destination and retain both grammatical constructions',()=>{
 const r=course.modules[5].lessons[2].practice[2].rounds[0];
 assert.match(r.instructionText,/под стол\./);
 assert.match(r.speechModel,/под столом\./);
 assert.deepEqual(example(r),['car',null]);
 assert.ok(accepted(r,['car',null]));
 assert.equal(accepted(r,[null,'car']),false);
 assert.equal(accepted(r,['car','car']),false);
});

test('the turnip timeline and the works used in the course have fixed texts and attribution',()=>{
 assert.deepEqual(book.repka.episodes.map(e=>e.id),['p1','p2','p3','p4']);
 assert.ok(Object.values(book).every(w=>w.origin&&w.rights&&w.edition&&w.episodes.every(e=>e.text&&e.art.props.length)));
 const retell=course.modules[9].lessons.at(-1).practice.at(-1);
 assert.equal(retell.rounds.length,book.repka.episodes.length);
 assert.deepEqual(retell.rounds.map(r=>r.transcript),book.repka.episodes.map(e=>e.text));
 assert.ok(retell.rounds.every(r=>r.requiresAdult&&isSpoken(r)));
});
