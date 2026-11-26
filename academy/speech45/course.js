import {worlds} from '../data/speech45/metadata.js';
import {hero} from '../speech/ui.js';
import {startSpeech} from '../speech/course.js';
import {openVoice} from './voice.js';

export const courseHero=world=>hero(world,{name:worlds[world-1][0],cover:new URL('./media/world-'+world+'.webp',import.meta.url)});
export async function startSpeech45(options){
 return startSpeech({...options,courseHero,voice:await openVoice(options.lesson.world)});
}
