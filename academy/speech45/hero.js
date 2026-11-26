import {worlds} from '../data/speech45/metadata.js';
import {hero} from '../speech/ui.js';

export const courseHero=world=>hero(world,{name:worlds[world-1][0],cover:new URL('./media/world-'+world+'.webp',import.meta.url)});
