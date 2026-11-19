(function () {
  'use strict';

  const voice = document.getElementById('narration');
  const music = document.getElementById('music');
  const chime = document.getElementById('chime');
  const status = document.getElementById('sound-status');
  let sequence = 0;
  let unblock = null;
  let context;
  let musicGain;
  let chimeGain;

  function gainFor(audio) {
    const gain = context.createGain();
    context.createMediaElementSource(audio).connect(gain).connect(context.destination);
    return gain;
  }

  function setMusicVolume(volume) {
    if (musicGain) musicGain.gain.value = volume;
    else music.volume = volume;
  }

  function prepareMusic() {
    music.volume = 0.1;
    if (!musicGain && music.volume !== 0.1) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        context = new AudioContext();
        musicGain = gainFor(music);
        chimeGain = gainFor(chime);
        chimeGain.gain.value = 0.24;
      }
    }
    context?.resume().catch(() => {});
  }

  function stopVoice() {
    sequence += 1;
    voice.pause();
    voice.onended = null;
    voice.onerror = null;
    unblock?.(false);
    unblock = null;
    setMusicVolume(0.1);
  }

  function playClip(path) {
    return new Promise(resolve => {
      const finish = played => {
        if (unblock !== finish) return;
        voice.onended = voice.onerror = null;
        unblock = null;
        resolve(played);
      };
      unblock = finish;
      voice.onended = () => finish(true);
      voice.onerror = () => finish(false);
      voice.src = path;
      voice.play().catch(() => finish(false));
    });
  }

  async function say(lines, enabled, force = false) {
    stopVoice();
    if (!enabled && !force) return;
    const marker = sequence;
    status.textContent = '';
    setMusicVolume(0.027);
    for (const line of lines.filter(Boolean)) {
      if (marker !== sequence) return;
      const path = line.startsWith('phoneme:') ?
        'audio/phoneme-' + line.slice(8) + '.mp3' :
        window.SnowSpeech?.[line];
      const ok = path && await playClip(path);
      if (marker !== sequence) return;
      if (!ok) {
        status.textContent = 'Не удалось воспроизвести запись. Попробуй ещё раз.';
        break;
      }
    }
    if (marker === sequence) setMusicVolume(0.1);
  }

  function background(on) {
    if (!on) return music.pause();
    try {
      prepareMusic();
      setMusicVolume(voice.paused ? 0.1 : 0.027);
      music.play().catch(() => {});
    } catch {
      music.pause();
    }
  }

  function effect(name, enabled) {
    if (!enabled) return;
    chime.pause();
    chime.src = 'audio/' + name + '.mp3';
    if (!chimeGain) chime.volume = 0.24;
    chime.play().catch(() => {});
  }

  function stop() {
    stopVoice();
    music.pause();
    chime.pause();
  }

  window.addEventListener('pagehide', stop);
  window.SnowSound = Object.freeze({ say, stopVoice, background, effect, stop });
})();
