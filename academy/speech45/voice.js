import {createLessonAudio} from '../literacy/audio.js';

export async function openVoice(world){
 const folder=new URL('./media/',import.meta.url);
 const prefix='voice-'+world;
 let index;
 try{
  const response=await fetch(new URL(prefix+'.json',folder));
  if(!response.ok)throw new Error('HTTP '+response.status);
  index=await response.json();
 }catch{return null;}
 const sources=Object.fromEntries([...new Set(Object.values(index).map(cue=>cue[0]))]
  .map(track=>[track,new URL(prefix+'-'+track+'.mp3',folder)]));
 const transport=createLessonAudio(sources);
 let lastVolume=.72;
 transport.setVolume(lastVolume);
 function play(...phrases){
  return transport.play(phrases.flat().map(value=>{
   const {text,gain}=typeof value==='string'?{text:value}:value;
   const cue=index[text];
   if(!cue)throw new Error('Нет записи для реплики.');
   const [track,offset,duration]=cue;
   return {sound:String(track),offset,duration,gain};
  }));
 }
 function mute(value){if(value&&transport.getVolume())lastVolume=transport.getVolume();transport.setVolume(value?0:lastVolume);}
 function setVolume(value){if(value>0)lastVolume=value;transport.setVolume(value);}
 return {...transport,play,mute,setVolume,index};
}
