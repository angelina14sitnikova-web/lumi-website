#!/usr/bin/env python3
"""Create the game narration as local MP3 files using Node, edge-tts and FFmpeg."""
import asyncio
from hashlib import sha256
import importlib
import json
import math
import os
from pathlib import Path
import struct
import subprocess
import tempfile
import wave

import edge_tts

ROOT = Path(__file__).resolve().parents[1]
AUDIO = ROOT / 'audio'
VOICE = 'ru-RU-SvetlanaNeural'
RATE = '-12%'

for name in ('SSL_CERT_FILE', 'CODEX_PROXY_CERT'):
    trust = os.environ.get(name)
    if trust and Path(trust).is_file():
        importlib.import_module('edge_tts.communicate')._SSL_CTX.load_verify_locations(cafile=trust)


def texts():
    script = '''global.window={};require(process.argv[1]);
    process.stdout.write(JSON.stringify(window.SnowContent.collectSpeech()));'''
    return json.loads(subprocess.check_output(['node', '-e', script, ROOT / 'content.js']))


def track_id(line):
    return 'audio/v-' + sha256(line.encode()).hexdigest()[:16] + '.mp3'


def probe(path):
    if not path.is_file():
        return None
    result = subprocess.run(
        ['ffprobe', '-v', 'error', '-select_streams', 'a:0', '-show_entries',
         'stream=codec_name,duration', '-of', 'json', path], capture_output=True, text=True)
    if result.returncode:
        return None
    streams = json.loads(result.stdout)['streams']
    return streams[0] if streams and streams[0]['codec_name'] == 'mp3' else None


def score(name, duration, notes, interval, decay, level):
    rate = 22050
    samples = [0.0] * round(duration * rate)
    for index, note in enumerate(notes):
        fundamental = 440 * 2 ** ((note - 69) / 12)
        stop = min(round(4 * decay * rate), len(samples) - round(index * interval * rate))
        for frame in range(stop):
            t = frame / rate
            envelope = (1 - math.exp(-t / .019)) * math.exp(-t / decay)
            angle = 2 * math.pi * fundamental * t
            samples[round(index * interval * rate) + frame] += (
                level * envelope * (math.sin(angle) + .16 * math.sin(2 * angle)))
    with tempfile.TemporaryDirectory() as scratch:
        source = Path(scratch) / 'score.wav'
        with wave.open(str(source), 'wb') as output:
            output.setparams((1, 2, rate, 0, 'NONE', 'not compressed'))
            output.writeframes(b''.join(struct.pack('<h', round(sample * 32767)) for sample in samples))
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', source, '-b:a', '48k',
                        AUDIO / (name + '.mp3')], check=True)


async def main():
    AUDIO.mkdir(exist_ok=True)
    mapping = {line: track_id(line) for line in texts()}
    rows = list(mapping.items())
    (ROOT / 'speech-map.js').write_text(
        "'use strict';\nwindow.SnowSpeech = " + json.dumps(mapping, ensure_ascii=False, indent=2) + ';\n')
    score('music', 24, [62, 69, 74, 76, 74, 69, 64, 67, 69, 74, 71, 69], 2, .72, .17)
    score('correct', .8, [76, 81, 86], .095, .13, .25)
    score('award', 1.2, [74, 78, 81, 86], .13, .16, .25)
    score('final', 2.2, [67, 74, 79, 83, 86, 91], .18, .26, .22)
    semaphore = asyncio.Semaphore(3)
    forbidden = asyncio.Event()
    fails = []
    complete = 0

    async def synthesize(line, location):
        nonlocal complete
        path = ROOT / location
        async with semaphore:
            if forbidden.is_set():
                return
            succeeded = bool(probe(path))
            if not succeeded:
                for attempt in range(3):
                    if forbidden.is_set():
                        return
                    await asyncio.sleep(.65 * (attempt + 1))
                    part = path.with_suffix('.partial.mp3')
                    try:
                        voice = edge_tts.Communicate(line, VOICE, rate=RATE, proxy=os.environ.get('HTTPS_PROXY'))
                        await asyncio.wait_for(voice.save(str(part)), 28)
                        if not probe(part):
                            raise ValueError('Invalid MP3')
                        part.replace(path)
                        succeeded = True
                        break
                    except Exception as error:
                        part.unlink(missing_ok=True)
                        status = getattr(error, 'status', None)
                        print(location, type(error).__name__, status, flush=True)
                        if status == 403:
                            forbidden.set()
                            break
            if not succeeded:
                fails.append(location)
            complete += 1
            if complete % 15 == 0 or complete == len(rows):
                print('Checked', complete, 'of', len(rows), 'tracks', flush=True)

    await asyncio.gather(*(synthesize(line, location) for line, location in rows))
    manifest = {
        'voice': VOICE, 'rate': RATE,
        'tracks': [{'text': text, 'path': location, 'stream': probe(ROOT / location)} for text, location in rows],
        'acoustic_review': 'pending',
    }
    (ROOT / 'speech-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    if forbidden.is_set():
        raise SystemExit('HTTP 403')
    if fails:
        raise SystemExit('Missing tracks: ' + ', '.join(fails))


if __name__ == '__main__':
    asyncio.run(main())
