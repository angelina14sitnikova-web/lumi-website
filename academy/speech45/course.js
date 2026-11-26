import {startSpeech} from '../speech/course.js';
import {courseHero} from './hero.js';
import {openVoice} from './voice.js';

export async function startSpeech45(options){
 return startSpeech({...options,courseHero,voice:await openVoice(options.lesson.world)});
}
