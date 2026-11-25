const motions=new Set(['open','fist','point','wiggle','greet1','greet2','greet3','greet4','pinch']);
const objects=new Set(['pom','button','stone','bead','shape','keys']);
const isPoint=point=>Number.isFinite(point?.x)&&Number.isFinite(point?.y);
export function writingBoardReady(board){
  if(!board)return false;
  if(board.kind==='hand'){
    if(board.fingers)return board.fingers.length>0&&board.fingers.every(i=>Number.isInteger(i)&&i>=0&&i<5);
    return board.moves?.length>0&&board.moves.every(move=>motions.has(move))&&
      (!board.actions||board.moves.every(move=>board.actions.includes(move)));
  }
  if(board.kind==='objects'){
    return objects.has(board.object)&&Number.isInteger(board.count)&&board.count>0&&board.count<=5&&
      (board.object!=='keys'||(board.pattern?.length>0&&board.pattern.every(i=>Number.isInteger(i)&&i>=0&&i<board.count)));
  }
  if(board.kind==='ink') return ['trace','route','free','marks'].includes(board.mode)&&(
    board.mode==='free'||(board.mode==='marks'&&Number.isInteger(board.count)&&board.count>0&&board.area)||(board.mode==='trace'&&board.targets?.length>0&&board.targets.every(target=>
      target.tolerance>0&&target.points?.length>=2&&target.points.every(isPoint)))||
    (board.mode==='route'&&isPoint(board.start)&&isPoint(board.end)));
  return false;
}
export function writingReady(task){
  return Boolean(task.title&&task.instruction&&task.rounds?.length&&task.rounds.every(writingBoardReady));
}
export function writingAnswer(task,answer){
  return Array.isArray(answer)&&answer.length===task.rounds.length&&
    answer.every((value,i)=>value===task.rounds[i].kind);
}
export function readWritingProgress(lesson,value){
  if(!value||!Array.isArray(value.answers)||!Array.isArray(value.rounds))return null;
  if(value.answers.length>=lesson.practice.length||
    value.answers.some((answer,i)=>!writingAnswer(lesson.practice[i],answer)))return null;
  const task=lesson.practice[value.answers.length];
  if(value.rounds.length>=task.rounds.length||value.rounds.some((answer,i)=>answer!==task.rounds[i].kind))return null;
  if(value.stage!=='practice'&&value.stage!=='scene')return null;
  if(!Number.isInteger(value.scene)||value.scene<0||value.scene>=lesson.scenes.length)return null;
  return value;
}
