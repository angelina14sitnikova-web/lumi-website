const DEFAULT_VOLUME = 0.65;
const MAX_GAIN = 0.8;
const SILENCE_SECONDS = 1.15;
const FADE_SECONDS = 0.035;

export class LessonAudioError extends Error {
  constructor(code, cause) {
    super(code, { cause });
    this.name = 'LessonAudioError';
    this.code = code;
  }
}

/**
 * Plays recorded sounds with Web Audio. All audio in a lesson uses this
 * transport, including spoken prompts and feedback, to prevent overlap.
 */
export function createLessonAudio(manifest, {
  audioContext = () => new (window.AudioContext ?? window.webkitAudioContext)(),
  fetchAudio = url => fetch(url),
  documentRef = typeof document === 'undefined' ? null : document,
  windowRef = typeof window === 'undefined' ? null : window,
} = {}) {
  const files = new Map();
  const recordings = new Map();
  let context;
  let output;
  let current;
  let volume = DEFAULT_VOLUME;

  function file(sound) {
    if (sound === 'silence') return null;
    if (!Object.hasOwn(manifest, sound)) {
      throw new LessonAudioError('unknown-sound', sound);
    }
    if (!files.has(sound)) {
      const request = fetchAudio(manifest[sound]).then(response => {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.arrayBuffer();
      }).catch(cause => {
        files.delete(sound);
        throw new LessonAudioError('load-failed', cause);
      });
      files.set(sound, request);
    }
    return files.get(sound);
  }

  async function recording(sound) {
    if (sound === 'silence') return null;
    if (!recordings.has(sound)) {
      const request = file(sound).then(bytes => context.decodeAudioData(bytes.slice(0))).catch(cause => {
        recordings.delete(sound);
        throw cause instanceof LessonAudioError ? cause : new LessonAudioError('decode-failed', cause);
      });
      recordings.set(sound, request);
    }
    return recordings.get(sound);
  }

  function stop() {
    const session = current;
    if (!session) return;
    current = null;
    for (const timer of session.timers) windowRef?.clearTimeout(timer);
    for (const node of session.nodes) {
      node.onended = null;
      node.disconnect();
      node.stop();
    }
    for (const gain of session.gains) gain.disconnect();
    session.finish({ status: 'stopped' });
  }

  async function preload(sounds) {
    const ids = [...new Set(sounds.map(clip => typeof clip === 'string' ? clip : clip.sound))];
    const results = await Promise.allSettled(ids.map(async sound => file(sound)));
    return { unavailable: ids.filter((_, index) => results[index].status === 'rejected') };
  }

  function scheduleClip(session, clip, buffer, startTime, offset, duration) {
    const source = context.createBufferSource();
    // An empty buffer advances the transport for listening exercises with silence.
    source.buffer = buffer ?? context.createBuffer(1, Math.ceil(duration * context.sampleRate), context.sampleRate);
    const gain = context.createGain();
    const requested = clip.gain ?? MAX_GAIN;
    const safeGain = Number.isFinite(requested) ? Math.min(MAX_GAIN, Math.max(0, requested)) : MAX_GAIN;
    const fade = Math.min(FADE_SECONDS, duration / 4);
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(safeGain, startTime + fade);
    gain.gain.setValueAtTime(safeGain, startTime + duration - fade);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);
    source.connect(gain);
    gain.connect(output);
    source.start(startTime, offset, duration);
    session.nodes.push(source);
    session.gains.push(gain);
  }

  async function play(sequence, { gap = 0.32, onClip } = {}) {
    stop();
    if (!volume) throw new LessonAudioError('muted');
    if (!sequence.length) return { status: 'finished' };
    const clips = sequence.map(clip => typeof clip === 'string' ? { sound: clip } : clip);
    const session = { nodes: [], gains: [], timers: [], finish: null };
    const done = new Promise(resolve => { session.finish = resolve; });
    current = session;
    const start = async () => {
      if (!context) {
        context = audioContext();
        output = context.createGain();
        output.gain.value = volume;
        output.connect(context.destination);
      }
      // Invoke resume() before the first async wait so Safari can use the tap
      // that opened the audio. Fetching and decoding may finish after that tap.
      await context.resume();
      if (session !== current) return;
      const buffers = await Promise.all(clips.map(clip => recording(clip.sound)));
      if (session !== current) return;
      let startTime = context.currentTime + 0.025;
      const safeGap = Number.isFinite(gap) ? Math.max(0, gap) : 0.32;
      clips.forEach((clip, index) => {
        const buffer = buffers[index];
        const offset = clip.offset ?? 0;
        const available = (buffer?.duration ?? SILENCE_SECONDS) - offset;
        const duration = Math.min(clip.duration ?? available, available);
        if (!Number.isFinite(offset) || offset < 0 || !Number.isFinite(duration) || duration <= 0) {
          throw new LessonAudioError('invalid-segment', clip.sound);
        }
        if (onClip && windowRef) {
          const elapsed = (startTime - context.currentTime) * 1000;
          const timer = windowRef.setTimeout(() => {
            if (current === session) onClip(index, clip.sound);
          }, elapsed);
          session.timers.push(timer);
        }
        scheduleClip(session, clip, buffer, startTime, offset, duration);
        startTime += duration + safeGap;
      });
      session.nodes.at(-1).onended = () => {
        if (session !== current) return;
        current = null;
        for (const timer of session.timers) windowRef?.clearTimeout(timer);
        for (const node of session.nodes) node.disconnect();
        for (const gain of session.gains) gain.disconnect();
        session.finish({ status: 'finished' });
      };
    };
    try {
      await Promise.race([done, start()]);
      return await done;
    } catch (cause) {
      if (session !== current) return done;
      stop();
      throw cause instanceof LessonAudioError ? cause : new LessonAudioError('play-failed', cause);
    }
  }

  function setVolume(value) {
    if (!Number.isFinite(value)) return;
    volume = Math.min(1, Math.max(0, value));
    if (!volume) stop();
    if (output) output.gain.setTargetAtTime(volume, context.currentTime, 0.018);
  }

  function pauseWhenHidden() {
    if (documentRef.hidden) stop();
  }

  windowRef?.addEventListener('pagehide', stop);
  documentRef?.addEventListener('visibilitychange', pauseWhenHidden);
  function dispose() {
    stop();
    windowRef?.removeEventListener('pagehide', stop);
    documentRef?.removeEventListener('visibilitychange', pauseWhenHidden);
    if (context && context.state !== 'closed') return context.close();
  }

  return { play, preload, stop, setVolume, getVolume: () => volume, dispose };
}
