export const feedback={
 retry:'Давай попробуем ещё раз.',
 hint:'Посмотри на подсветку и попробуй ещё раз.',
 done:'Игровое действие выполнено. Можно сказать вместе.',
 star:'Ты получил звезду!',
 world:'Ты завершил все уроки в этом королевстве. Перо возвращается в книгу!',
 finale:'Ты вернул волшебной книге все перья! Теперь у её страниц есть твоя история.',
};
export function lessonPhrases(lessons){
 const phrases=new Set(Object.values(feedback));
 function add(...lines){for(const line of lines.flat(Infinity))if(typeof line==='string'&&line.trim())phrases.add(line);}
 for(const lesson of Object.values(lessons)){
  for(const item of [...lesson.scenes,...lesson.practice.flatMap(task=>task.rounds)]){
   add(item.instructionText,item.speechModel,item.partner,Object.values(item.replies??{}),
    Object.values(item.models??{}),item.samples?.map(sample=>sample.text));
   if(item.frames)add(item.frames.map(frame=>[frame.says,frame.voice?.text]));
   if(item.audioPhrases)add(item.audioPhrases);
  }
 }
 return [...phrases];
}
