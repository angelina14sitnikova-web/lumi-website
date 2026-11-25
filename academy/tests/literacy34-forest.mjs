import assert from 'node:assert/strict';
import { test } from 'node:test';
import catalog from '../data/literacy-3-4.js';
import { forest, forestSoundIds } from '../data/literacy34/forest.js';

const getId = clip => typeof clip === 'string' ? clip : clip.sound;

test('forest content covers the six existing catalogue lessons in order', () => {
  const [module, ...lessons] = catalog.modules[0];
  assert.equal(forest.id, module.id);
  assert.deepEqual(Object.keys(forest.lessons), lessons.map(([id]) => id));
  const all = Object.values(forest.lessons);
  assert.equal(all.flatMap(lesson => lesson.scenes).length, 18);
  assert.equal(all.flatMap(lesson => lesson.practice).length, 30);

  for (const lesson of all) {
    assert.ok(lesson.goal);
    assert.equal(lesson.scenes.length, 3);
    assert.equal(lesson.practice.length, 5);
    for (const scene of lesson.scenes) {
      assert.ok(scene.action && scene.text && scene.sounds.length);
      assert.ok(scene.sounds.every(clip => forestSoundIds.includes(getId(clip))));
    }
    for (const task of lesson.practice) {
      assert.ok(task.name && task.instruction && task.rounds.length);
      for (const round of task.rounds) {
        assert.ok(round.sounds.length && round.sounds.every(clip => forestSoundIds.includes(getId(clip))));
        assert.equal(round.options.length, new Set(round.options).size);
        const answers = Array.isArray(round.answer) ? round.answer : [round.answer];
        assert.ok(answers.length && answers.every(id => round.options.includes(id)));
      }
    }
  }
});

test('loudness compares the same recording using relative gain', () => {
  const lesson = forest.lessons['literacy-lesson-1-5'];
  for (const scene of lesson.scenes) {
    assert.equal(new Set(scene.sounds.map(getId)).size, 1);
    assert.equal(new Set(scene.sounds.map(clip => clip.gain)).size, 2);
  }
  for (const round of lesson.practice.flatMap(task => task.rounds)) {
    assert.equal(new Set(round.sounds.map(getId)).size, 1);
    assert.ok(round.sounds.every(clip => clip.gain > 0 && clip.gain < 0.8));
  }
  const form = lesson.practice.filter(task => task.kind === 'compare');
  assert.deepEqual(form.map(task => task.rounds[0].answer), ['second', 'first', 'first']);
  assert.equal(lesson.practice.find(task => task.kind === 'sort').rounds.flatMap(round => round.sounds).length, 6);
});
