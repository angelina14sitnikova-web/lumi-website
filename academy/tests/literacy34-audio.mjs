import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createLessonAudio } from '../literacy/audio.js';

function fixture({ failFirst = false } = {}) {
  const sources = [];
  const gains = [];
  const fetched = [];
  const decoded = [];
  const windowRef = new EventTarget();
  const documentRef = new EventTarget();
  Object.assign(windowRef, { setTimeout, clearTimeout });
  const context = {
    currentTime: 2,
    sampleRate: 1000,
    async resume() { this.resumed = (this.resumed ?? 0) + 1; },
    async close() { this.state = 'closed'; },
    async decodeAudioData(buffer) {
      const recording = { duration: 0.5, id: new Uint8Array(buffer)[0] };
      decoded.push(recording);
      return recording;
    },
    createBuffer(channelCount, samples, rate) {
      return { duration: samples / rate, channelCount };
    },
    createBufferSource() {
      const source = {
        connect(gain) { this.gain = gain; },
        disconnect() { this.disconnected = true; },
        start(time, offset, duration) { Object.assign(this, { time, offset, duration }); },
        stop() { this.stopped = true; },
      };
      sources.push(source);
      return source;
    },
    createGain() {
      const gain = {
        connect(output) { this.output = output; },
        disconnect() { this.disconnected = true; },
        gain: {
          points: [],
          setValueAtTime(value, time) { this.points.push([value, time]); },
          linearRampToValueAtTime(value, time) { this.points.push([value, time]); },
          setTargetAtTime(value) { this.value = value; },
        },
      };
      gains.push(gain);
      return gain;
    },
  };
  const audio = createLessonAudio({ bell: 'bell.mp3', drum: 'drum.mp3' }, {
    audioContext: () => context,
    fetchAudio: async url => {
      fetched.push(url);
      if (failFirst && fetched.length === 1) return { ok: false, status: 503 };
      return { ok: true, arrayBuffer: async () => Uint8Array.of(url === 'bell.mp3' ? 1 : 2).buffer };
    },
    documentRef,
    windowRef,
  });
  return { audio, context, sources, gains, fetched, decoded, documentRef, windowRef };
}

const tick = () => new Promise(resolve => setImmediate(resolve));
const clip = (sound, gain) => ({ sound, gain });

test('a sequence uses one transport, shared buffers and controlled gain', async () => {
  const { audio, context, sources, gains, fetched, decoded } = fixture();
  assert.deepEqual(await audio.preload(['bell', 'bell', 'silence']), { unavailable: [] });
  const playing = audio.play([clip('bell', 0.34), 'silence', clip('bell', 0.74), 'drum'], { gap: 0.25 });
  assert.equal(context.resumed, 1);
  await tick();
  assert.deepEqual(fetched, ['bell.mp3', 'drum.mp3']);
  assert.equal(decoded.length, 2);
  assert.equal(sources[0].buffer, sources[2].buffer);
  assert.equal(sources[1].buffer.channelCount, 1);
  assert.equal(sources[1].time - sources[0].time, 0.75);
  assert.ok(Math.abs(sources[2].time - sources[1].time - 1.4) < 0.0001);
  assert.deepEqual([sources[0], sources[2]].map(source => source.gain.gain.points[1][0]), [0.34, 0.74]);
  assert.ok(sources.every(source => source.gain.output === gains[0]));
  sources.at(-1).onended();
  assert.deepEqual(await playing, { status: 'finished' });
  assert.ok(sources.every(source => source.disconnected));
});

test('new playback, hiding the page and muting stop audio', async () => {
  const { audio, context, sources, documentRef, windowRef } = fixture();
  const first = audio.play(['bell', 'drum']);
  await tick();
  const second = audio.play(['drum']);
  assert.deepEqual(await first, { status: 'stopped' });
  assert.ok(sources.slice(0, 2).every(source => source.stopped));
  await tick();
  documentRef.hidden = true;
  documentRef.dispatchEvent(new Event('visibilitychange'));
  assert.deepEqual(await second, { status: 'stopped' });
  const third = audio.play(['bell']);
  await tick();
  windowRef.dispatchEvent(new Event('pagehide'));
  assert.deepEqual(await third, { status: 'stopped' });
  audio.setVolume(0);
  await assert.rejects(audio.play(['bell']), { code: 'muted' });
  await audio.dispose();
  assert.equal(context.state, 'closed');
});

test('unavailable sounds are reported and can be fetched again', async () => {
  const { audio, sources } = fixture({ failFirst: true });
  assert.deepEqual(await audio.preload(['bell', 'unknown']), { unavailable: ['bell', 'unknown'] });
  const play = audio.play(['bell']);
  await tick();
  sources[0].onended();
  assert.deepEqual(await play, { status: 'finished' });
  await assert.rejects(audio.play(['unknown']), { code: 'unknown-sound' });
});


test('speech excerpts start at their markers and advance by their segment lengths', async () => {
  const {audio, sources} = fixture();
  const listening = audio.play([
    {sound: 'bell', offset: .14, duration: .11},
    {sound: 'bell', offset: .32, duration: .15},
  ], {gap: .03});
  await tick();
  assert.deepEqual(sources.map(({offset,duration}) => [offset,duration]), [[.14,.11],[.32,.15]]);
  assert.ok(Math.abs(sources[1].time - sources[0].time - .14) < .0001);
  sources.at(-1).onended();
  assert.equal((await listening).status,'finished');
  await assert.rejects(audio.play([{sound:'bell',offset:.7,duration:.1}]),{code:'invalid-segment'});
});
