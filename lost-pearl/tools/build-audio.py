#!/usr/bin/env python3
"""Build local narration and original procedural music. Never runs in the browser.
Requires node, ffmpeg, ffprobe and edge-tts (pip install edge-tts).
Existing valid MP3s are retained. Set EDGE_TTS_PYTHONPATH for a local dependency dir.
TLS remains verified; only the runtime's explicit trusted CA bundle is added.
"""
from pathlib import Path
import asyncio, hashlib, importlib, json, math, os, re, struct, subprocess, sys, tempfile, wave
ROOT=Path(__file__).resolve().parents[1]
AUDIO=ROOT/'audio'
VOICE='ru-RU-SvetlanaNeural'
RATE='-12%'
ATTEMPTS=max(1,min(3,int(os.environ.get('PEARL_TTS_ATTEMPTS','3'))))
if os.environ.get('EDGE_TTS_PYTHONPATH'):sys.path.insert(0,os.environ['EDGE_TTS_PYTHONPATH'])
import edge_tts
if os.environ.get('SSL_CERT_FILE'):
 importlib.import_module('edge_tts.communicate')._SSL_CTX.load_verify_locations(cafile=os.environ['SSL_CERT_FILE'])

def content():
 script="const fs=require('node:fs'),vm=require('node:vm');const c={window:{}};vm.runInNewContext(fs.readFileSync(process.argv[1],'utf8'),c);process.stdout.write(JSON.stringify(c.window.PearlContent));"
 return json.loads(subprocess.check_output(['node','-e',script,str(ROOT/'content.js')],text=True))

def strings(value):
 out=[]
 def walk(x):
  if isinstance(x,str) and re.search('[А-Яа-яЁё]',x) and x not in out:out.append(x)
  elif isinstance(x,dict):
   for v in x.values():walk(v)
  elif isinstance(x,list):
   for v in x:walk(v)
 walk(value)
 return out

def probe(path):
 try:
  p=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration:stream=codec_name,sample_rate,channels','-of','json',str(path)],stderr=subprocess.DEVNULL,text=True))
  duration=float(p['format']['duration']);stream=p['streams'][0]
  if duration<=0 or stream['codec_name']!='mp3':return None
  return {'duration_seconds':duration,**stream,'bytes':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()}
 except Exception:return None

def write_json(path,data):path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')

def synthesize_music():
 sr=22050
 def wav_to_mp3(name,samples):
  with tempfile.TemporaryDirectory(prefix='pearl-audio-') as d:
   raw=Path(d)/(name+'.wav')
   with wave.open(str(raw),'wb') as f:
    f.setnchannels(1);f.setsampwidth(2);f.setframerate(sr)
    f.writeframes(b''.join(struct.pack('<h',max(-32767,min(32767,int(x*32767)))) for x in samples))
   subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(raw),'-codec:a','libmp3lame','-b:a','48k',str(AUDIO/(name+'.mp3'))],check=True)
 # Original 24-second pentatonic music, no recordings or external composition.
 length=24;music=[0.]*(sr*length)
 melody=[60,64,67,69,74,69,67,64,62,67,69,64]
 for j,note in enumerate(melody):
  freq=440*2**((note-69)/12);start=j*2
  for i in range(int(sr*2.8)):
   k=int(start*sr)+i
   if k>=len(music):break
   t=i/sr;env=(1-math.exp(-t/0.045))*math.exp(-t/0.8)
   music[k]+=.105*env*(math.sin(2*math.pi*freq*t)+.23*math.sin(2*math.pi*freq*2*t))
 # Slow, soft pad with a fade at both loop boundaries.
 for i in range(len(music)):
  t=i/sr;fade=min(1,t/2,(length-t)/2)
  music[i]=(music[i]+.018*(math.sin(2*math.pi*130.8128*t)+math.sin(2*math.pi*195.9977*t)))*max(0,fade)
 wav_to_mp3('music',music)
 good=[0.]*(int(sr*.9))
 for j,note in enumerate([76,79,84]):
  f=440*2**((note-69)/12)
  for i in range(int(sr*.5)):
   k=int(j*.14*sr)+i
   if k>=len(good):break
   t=i/sr;good[k]+=.15*(1-math.exp(-t/.012))*math.exp(-t/.11)*math.sin(2*math.pi*f*t)
 wav_to_mp3('correct',good)
 bubble=[];phase=0
 for i in range(int(sr*.38)):
  t=i/sr;phase+=2*math.pi*(420+650*t/.38)/sr
  bubble.append(.10*math.sin(math.pi*t/.38)**2*math.sin(phase)*math.exp(-t/0.18))
 wav_to_mp3('bubble',bubble)

async def main():
 AUDIO.mkdir(parents=True,exist_ok=True)
 texts=strings(content())
 # Text hashes keep file identifiers stable if content order changes.
 mapping={s:'audio/v-'+hashlib.sha256(s.encode()).hexdigest()[:16]+'.mp3' for s in texts}
 (ROOT/'speech-map.js').write_text("'use strict';\nwindow.PearlSpeech="+json.dumps(mapping,ensure_ascii=False,separators=(',',':'))+';\n')
 manifest={'voice':VOICE,'rate':RATE,'input_sha256':hashlib.sha256((ROOT/'content.js').read_bytes()).hexdigest(),'tracks':[{'text':s,'path':mapping[s]} for s in texts],'acoustic_review':'not_performed','note':'Technical stream validation is not a human pronunciation review.'}
 write_json(ROOT/'speech-manifest.json',manifest)
 done=0;failed=[];blocked=False;consecutive_errors=0
 for text in texts:
  path=ROOT/mapping[text]
  if blocked:
   if not probe(path):failed.append(mapping[text])
   done+=1
   continue
  if not probe(path):
   for attempt in range(ATTEMPTS):
    # Exactly one request at a time, with a moderate gap between requests.
    await asyncio.sleep(.75)
    part=path.with_suffix('.part.mp3')
    try:
     task=edge_tts.Communicate(text,voice=VOICE,rate=RATE,proxy=os.environ.get('HTTPS_PROXY'))
     await asyncio.wait_for(task.save(str(part)),35)
     if not probe(part):raise ValueError('Invalid MP3')
     part.replace(path);consecutive_errors=0;break
    except Exception as e:
     # Do not expose request URLs, proxy credentials, or exception payloads.
     consecutive_errors+=1
     print(json.dumps({'error_type':type(e).__name__,'http_status':getattr(e,'status',None),'path':mapping[text],'attempt':attempt+1,'consecutive_errors':consecutive_errors}),flush=True)
     if consecutive_errors>=3:
      blocked=True;failed.append(mapping[text]);break
     if attempt==ATTEMPTS-1:failed.append(mapping[text])
  done+=1
  if done%20==0 or done==len(texts):print(json.dumps({'complete':done,'total':len(texts),'failed':len(failed)}),flush=True)
 synthesize_music()
 validation=[]
 for track in manifest['tracks']:
  info=probe(ROOT/track['path']);validation.append({'path':track['path'],'valid':bool(info),**(info or {})})
 for name in ['music','correct','bubble']:
  p='audio/'+name+'.mp3';info=probe(ROOT/p);validation.append({'path':p,'valid':bool(info),**(info or {})})
 write_json(ROOT/'audio-validation.json',{'tracks':validation,'speech_count':len(texts),'all_valid':all(x['valid'] for x in validation),'acoustic_review':'not_performed'})
 print(json.dumps({'speech_count':len(texts),'all_valid':all(x['valid'] for x in validation),'failed':failed}),flush=True)
 if failed:raise SystemExit(1)

if __name__=='__main__':asyncio.run(main())
