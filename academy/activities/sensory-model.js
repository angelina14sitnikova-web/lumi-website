import { palette } from './colors-model.js';

export function sensoryReady(task) {
  const validPiece = piece => Boolean(piece?.shape && Object.hasOwn(palette, piece.color));
  return Boolean(task.rounds?.length && task.rounds.every(round =>
    round.pieces?.length && round.pieces.every(validPiece) &&
    (!round.sample || validPiece(round.sample)) && (!round.targets || round.targets.every(validPiece)) &&
    round.answers?.length && new Set(round.answers.map(step => step.from)).size === round.answers.length &&
    (!round.starts || round.starts.length === round.pieces.length && round.starts.every(index => round.targets?.[index])) &&
    round.answers.every(({ from, to }) => Number.isInteger(from) && round.pieces[from] &&
      (round.targets ? Number.isInteger(to) && round.targets[to] && round.starts?.[from] !== to : to === undefined))));
}

export function sensoryAnswer(task, attempt) {
  return Array.isArray(attempt) && attempt.length === task.rounds.length &&
    task.rounds.every((round, index) => Array.isArray(attempt[index]) && attempt[index].length === round.answers.length &&
      (round.interchangeable
      ? new Set(attempt[index].map(step=>step.from)).size === round.pieces.length &&
        new Set(attempt[index].map(step=>step.to)).size === round.targets.length &&
        attempt[index].every(step=>Number.isInteger(step.from) && Number.isInteger(step.to) &&
          round.pieces[step.from] && round.targets[step.to])
      : round.take
      ? new Set(attempt[index].map(step => step.from)).size === round.take &&
        attempt[index].every(step => Number.isInteger(step?.from) && round.pieces[step.from] && step.to === undefined)
      : round.answers.every(({ from, to }) => attempt[index].some(step => step?.from === from && step.to === to))));
}
