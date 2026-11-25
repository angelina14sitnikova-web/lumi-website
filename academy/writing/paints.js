import {moduleStars} from '../course-model.js';

export const extraPaints=[
  ['#c99942','Золотистая'],['#71bfa9','Мятная'],['#67b9dc','Голубая'],
  ['#a786bd','Лавандовая'],['#e68a79','Коралловая'],['rainbow','Радужная'],
];
export function unlockedPaints(course){
  return extraPaints.filter((_,i)=>{
    const module=course?.modules[i];
    return module?.lessons.length&&moduleStars(course,module)===module.lessons.length;
  });
}
