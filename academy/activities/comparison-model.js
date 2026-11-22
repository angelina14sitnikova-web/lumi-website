function pairKey(pair) {
  return [...pair].sort((a, b) => a - b).join(':');
}

export function comparisonReady(task) {
  if (Array.isArray(task.pairs)) {
    const indices = task.pairs.flat();
    return task.pairs.length > 0 && new Set(indices).size === indices.length &&
      task.pairs.every(pair => pair.length === 2) &&
      indices.every(index => Number.isInteger(index) && index >= 0 && index < task.options.length);
  }
  return task.rounds?.length > 0 && task.rounds.every(round =>
    round.options.length > 1 && Number.isInteger(round.correct) &&
    round.correct >= 0 && round.correct < round.options.length);
}

export function comparisonAnswer(task, answer) {
  if (!Array.isArray(answer)) return false;
  if (task.pairs) {
    const valid = new Set(task.pairs.map(pairKey));
    return answer.length === valid.size && answer.every(pair =>
      Array.isArray(pair) && pair.length === 2 && pair.every(Number.isInteger) && valid.delete(pairKey(pair)));
  }
  return answer.length === task.rounds.length &&
    task.rounds.every((round, index) => answer[index] === round.correct);
}

export function isPair(task, first, second) {
  return task.pairs.some(pair => pair.includes(first) && pair.includes(second) && first !== second);
}

export function nextPair(task, matched) {
  return task.pairs.find(pair => pair.every(index => !matched.has(index)));
}
