#!/usr/bin/env python3
"""Make short, isolated Russian phoneme tracks from the project narration."""
from array import array
from hashlib import sha256
from pathlib import Path
import subprocess
import shutil

AUDIO = Path(__file__).resolve().parents[1] / 'audio'
RATE = 24000
# Boundaries in milliseconds from decoded, gapless source audio.
CLIPS = {
    'a': ('Арка', 277, 374),
    'o': ('Облако', 274, 372),
    'u': ('Утка', 277, 348),
    'i': ('Иглы', 286, 387),
    'y': ('Сыр', 480, 570),
    't': ('Торт', 609, 700),
    'r': ('Ракета', 273, 314),
    'n': ('Нос', 254, 345),
}
SHARED = AUDIO.parent.parent / 'snow-kingdom-5-6' / 'audio'



def extract(name, word, start, end):
    source = AUDIO / ('v-' + sha256(word.encode()).hexdigest()[:16] + '.mp3')
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', source, '-vn',
                                   '-ac', '1', '-ar', str(RATE), '-f', 'f32le', '-'])
    samples = array('f')
    samples.frombytes(raw)
    segment = samples[start * RATE // 1000:end * RATE // 1000]
    if len(segment) != (end - start) * RATE // 1000:
        raise ValueError('Invalid cut for ' + word)
    fade = RATE * 4 // 1000
    for index in range(fade):
        segment[index] *= index / fade
        segment[-1 - index] *= index / fade
    peak = max(map(abs, segment))
    if peak < .001:
        raise ValueError('Silent cut for ' + word)
    segment = array('f', (sample * .58 / peak for sample in segment))
    silence = array('f', [0.0]) * (RATE * 50 // 1000)
    data = (silence + segment + silence).tobytes()
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ac', '1', '-ar',
                    str(RATE), '-i', '-', '-codec:a', 'libmp3lame', '-b:a', '96k',
                    AUDIO / ('phoneme-' + name + '.mp3')], check=True, input=data)
    print(name, word, f'{start}–{end} ms', 'isolated segment')


if __name__ == '__main__':
    for name in ['s', 'm', 'l', 'k']:
        filename = 'phoneme-' + name + '.mp3'
        shutil.copyfile(SHARED / filename, AUDIO / filename)
    for name, clip in CLIPS.items():
        extract(name, *clip)
