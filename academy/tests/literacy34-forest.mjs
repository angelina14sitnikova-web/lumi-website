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

test('all authored rounds accept the intended response and reject incomplete input', async () => {
  const { checkListeningTask, readyListeningTask } = await import('../literacy/listening-round.js');
  for (const lesson of Object.values(forest.lessons)) {
    for (const task of lesson.practice) {
      assert.ok(readyListeningTask(task), task.name);
      assert.ok(checkListeningTask(task, task.rounds.map(round => round.answer)), task.name);
      assert.equal(checkListeningTask(task, []), false, task.name);
      if (task.rounds.length > 1) {
        assert.equal(checkListeningTask(task, task.rounds.slice(1).map(round => round.answer)), false, task.name);
      }
    }
  }
});

test('options and audio stay stable until a new round, and a hint follows two errors', async () => {
  const { createListeningRound } = await import('../literacy/listening-round.js');
  const round = { sounds: ['cat'], options: ['cat', 'dog'], answer: 'cat' };
  const play = createListeningRound('choice', round, () => 0);
  assert.deepEqual(play.options, ['dog', 'cat']);
  assert.deepEqual(play.select('cat'), { status: 'wait' });
  play.finishListening();
  assert.deepEqual(play.select('dog'), { status: 'try-again', hint: null });
  assert.deepEqual(play.sample, ['cat']);
  assert.deepEqual(play.select('dog'), { status: 'try-again', hint: 'cat' });
  assert.deepEqual(play.select('cat'), { status: 'correct', answer: 'cat' });
});

test('sequences require order, while multi-select accepts any order', async () => {
  const { createListeningRound, roundAnswer } = await import('../literacy/listening-round.js');
  const round = { sounds: ['cat', 'bell'], options: ['cat', 'bell'], answer: ['cat', 'bell'] };
  assert.equal(roundAnswer('sequence', round, ['bell', 'cat']), false);
  assert.equal(roundAnswer('multi', round, ['bell', 'cat']), true);
  assert.equal(roundAnswer('multi', round, ['cat', 'cat']), false);
  const play = createListeningRound('sequence', round);
  play.finishListening();
  assert.deepEqual(play.select('cat'), { status: 'picking' });
  assert.deepEqual(play.select('bell'), { status: 'correct', answer: ['cat', 'bell'] });
});

test('detecting a sound has a start cue and no response deadline', async () => {
  const { createListeningRound } = await import('../literacy/listening-round.js');
  const round = forest.lessons['literacy-lesson-1-1'].practice[0].rounds[0];
  const play = createListeningRound('detect', round);
  play.playClip(0);
  assert.deepEqual(play.select('bell'), { status: 'wait' });
  play.playClip(1);
  play.finishListening();
  assert.deepEqual(play.select('bell'), { status: 'correct', answer: 'bell' });
});

test('movement follows the music and a late response is still accepted', async () => {
  const { createListeningRound } = await import('../literacy/listening-round.js');
  const task = forest.lessons['literacy-lesson-1-1'].practice.find(task => task.kind === 'move-stop');
  const play = createListeningRound(task.kind, task.rounds[0]);
  assert.deepEqual(play.select('move'), { status: 'wait' });
  play.playClip(0);
  assert.deepEqual(play.select('move'), { status: 'picking' });
  assert.deepEqual(play.select('stop'), { status: 'wait' });
  play.playClip(1);
  play.finishListening();
  assert.deepEqual(play.select('stop'), { status: 'correct', answer: ['move', 'stop'] });
});
