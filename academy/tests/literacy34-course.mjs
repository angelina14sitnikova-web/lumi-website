import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import { findCourse, practiceIsReady, passPractice } from '../course-model.js';
import { forestSoundIds } from '../data/literacy34/forest.js';
import { recordings, speech } from '../literacy/speech-index.js';

test('all thirty literacy lessons have working content and valid sound references', () => {
  const course = findCourse('literacy-3-4');
  assert.equal(course.modules.length, 5);
  let scenes = 0, exercises = 0;
  const audio = new Set([...forestSoundIds, ...Object.keys(recordings)]);
  const media = new URL('../literacy/', import.meta.url);
  for (const file of Object.values(recordings)) assert.ok(existsSync(new URL(file, media)), file);
  for (const module of course.modules) {
    assert.equal(module.lessons.length, 6);
    for (const path of [module.cover, module.literacyMedal]) {
      assert.ok(path && existsSync(new URL('../' + path, import.meta.url)), path);
    }
    for (const lesson of module.lessons) {
      assert.equal(lesson.format, 'literacy34');
      assert.equal(lesson.scenes.length, 3);
      assert.equal(lesson.practice.length, 5);
      assert.ok(practiceIsReady(lesson), lesson.id);
      const speechForWorld = speech[lesson.world];
      const verify = clip => {
        if (clip?.voice) {
          assert.ok(speechForWorld?.[(clip.variant ?? 'clear') + '|' + clip.voice], clip.voice);
        } else {
          const id = typeof clip === 'string' ? clip : clip?.sound;
          assert.ok(audio.has(id), lesson.id + ': ' + id);
        }
      };
      for (const scene of lesson.scenes) {
        assert.ok(scene.action && scene.text && scene.sounds.length, lesson.id);
        scene.sounds.forEach(verify);
        scenes++;
      }
      for (const task of lesson.practice) {
        if (speechForWorld) assert.ok(speechForWorld['clear|' + task.instruction], task.name);
        for (const round of task.rounds) {
          assert.equal(new Set(round.options).size, round.options.length, task.name);
          round.sounds.forEach(verify);
          Object.values(round.choices ?? {}).flat().forEach(verify);
        }
        exercises++;
      }
      const responses = lesson.practice.map(task => task.rounds.map(round => round.answer));
      assert.ok(passPractice(lesson, responses), lesson.id);
      assert.equal(passPractice(lesson, responses.slice(0, 4)), false, lesson.id);
    }
  }
  assert.deepEqual([scenes, exercises], [90, 150]);
});
