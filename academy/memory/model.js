const memoryKeys = new Set([
  'find','pair','set','detail','difference','track','recall','memory-set','missing','layouts','arrange','changed','paint','audio','order',
]);

export function memoryRoundAnswer(round, answer) {
  if (!memoryKeys.has(round.kind)) return false;
  if (!Array.isArray(round.answer)) return round.answer === answer;
  if (['arrange','paint','audio','order'].includes(round.kind)) {
    return Array.isArray(answer) && answer.length === round.answer.length &&
      round.answer.every((id,index)=>id===answer[index]);
  }
  return Array.isArray(answer) && answer.length === round.answer.length &&
    new Set(answer).size === answer.length && round.answer.every(id => answer.includes(id));
}

export function memoryReady(task) {
  return typeof task.title === 'string' && Boolean(task.rounds?.length) && task.rounds.every(round => {
    if (!memoryKeys.has(round.kind) || typeof round.prompt !== 'string' || !round.options?.length) return false;
    if (new Set(round.options).size !== round.options.length) return false;
    const answers = [].concat(round.answer);
    return answers.length > 0 && answers.every(item => round.options.includes(item)) &&
      memoryRoundAnswer(round, round.answer);
  });
}

export function memoryAnswer(task, answer) {
  return Array.isArray(answer) && answer.length === task.rounds.length &&
    task.rounds.every((round, i) => memoryRoundAnswer(round, answer[i]));
}

export function shuffleOptions(options, random = Math.random) {
  const result = [...options];
  for (let index=result.length-1; index>0; index--) {
    const pick = Math.floor(random()*(index+1));
    [result[index],result[pick]] = [result[pick],result[index]];
  }
  return result;
}

export function restoringProgress(lesson, saved) {
  if (!saved || !Array.isArray(saved.answers) ||
      !saved.answers.every((answer, index) => lesson.practice[index] && memoryAnswer(lesson.practice[index],answer))) return null;
  const task = lesson.practice[saved.answers.length];
  if (saved.stage !== 'practice') {
    return Number.isInteger(saved.scene) && lesson.scenes[saved.scene] ? {scene:saved.scene} : null;
  }
  if (!task || !Array.isArray(saved.roundAnswers) || saved.roundAnswers.length >= task.rounds.length ||
      !saved.roundAnswers.every((answer, index) => memoryRoundAnswer(task.rounds[index], answer))) return null;
  return {
    stage:'practice',
    answers:saved.answers.map(answer => [...answer]),
    roundAnswers:[...saved.roundAnswers],
  };
}
