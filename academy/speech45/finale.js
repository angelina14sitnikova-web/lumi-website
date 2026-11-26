import {mountSpeechFinale} from '../speech/finale.js';
import {mountStories} from './stories.js';
import {courseHero} from './hero.js';
import {openVoice} from './voice.js';
import {feedback} from './voice-text.js';
import {el,button} from '../writing/ui.js';

const completedStoryKey='lumi.academy.speech45.finale-story.v1';
function mountStory(root,showDiploma){
 const section=el('section','speech45-final-story');
 section.append(el('h2','','Твоя финальная сказка'));
 const reveal=()=>{
  try{localStorage.setItem(completedStoryKey,'true');}catch{}
  showDiploma();
 };
 try{if(localStorage.getItem(completedStoryKey)==='true')showDiploma();}catch{}
 let voice;
 const voiceButton=button('Послушать поздравление',async()=>{
  try{await voice.play(feedback.finale);}catch{status.textContent='Можно прочитать поздравление вместе.';}
 });
 voiceButton.disabled=true;
 const status=el('p','speech-status');status.setAttribute('role','status');
 void openVoice(10).then(recording=>{
  voice=recording;voiceButton.disabled=!voice;
  if(!voice)status.textContent=feedback.finale;
 });
 section.append(voiceButton,status);root.append(section);
 mountStories(section,{editorFirst:true,onSave:reveal});
}
export function mountSpeech45Finale(root,course,complete,stars){
 mountSpeechFinale(root,course,complete,stars,{
  title:'Королевство живых историй',certificate:'Юный сказочник Академии Луми',
  storageKey:'lumi.academy.speech45.feathers.v1',recipient:'Юный сказочник',rewardText:'10 волшебных перьев',
  filename:'lumi-storyteller.png',incomplete:'Заверши уроки, чтобы собрать все волшебные перья.',
  prompt:'Верни волшебные перья в книгу, чтобы снова открыть её.',
  progress:count=>count+' из 10 перьев вернулись в книгу.',showHero:courseHero,
  workshop:'speech45-workshop.html',age:'age-4-5.html',mountStory,
 });
}
