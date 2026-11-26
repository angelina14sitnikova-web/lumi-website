import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {findCourse,practiceIsReady} from '../course-model.js';
import {descriptionValid,example,check,isSpoken,accepted} from '../speech/model.js';
import {lessonPhrases} from '../speech45/voice-text.js';

const course=findCourse('speech-4-5');
test('speech 4–5 preserves the catalogue and validates activity and voice manifests for playable modules',()=>{
 assert.equal(course.modules.length,10);
 for(const [i,module] of course.modules.entries()){
  const world=i+1;
  assert.equal(module.id,'speech-45-module-'+world);
  assert.equal(module.lessons.length,6);
  const active=module.lessons.filter(practiceIsReady);
  if(!active.length)continue;
  assert.equal(active.length,6);
  const media=new URL('../speech45/media/',import.meta.url);
  const cues=JSON.parse(readFileSync(new URL('voice-'+world+'.json',media),'utf8'));
  for(const text of lessonPhrases(active)){
   const cue=cues[text];
   assert.ok(cue,text);
   assert.ok(cue[1]>=0&&cue[2]>0,text);
   assert.ok(existsSync(new URL(`voice-${world}-${cue[0]}.mp3`,media)),text);
  }
  active.forEach((lesson,j)=>{
   assert.equal(lesson.id,`speech-45-lesson-${world}-${j+1}`);
   assert.equal(lesson.scenes.length,3);
   assert.equal(lesson.practice.length,5);
   assert.ok(lesson.scenes.every(scene=>descriptionValid(scene)&&scene.frames.length&&scene.audioSrc));
   for(const activity of lesson.practice){
    assert.ok(check(activity,activity.rounds.map(example)),activity.title);
    for(const round of activity.rounds){
     assert.ok(round.audioSrc);
     if(isSpoken(round))assert.ok(!accepted(round,round.speechModel));
    }
   }
  });
 }
 assert.ok(course.modules[0].lessons.every(practiceIsReady));
});
