export const piece = (shape, color, size) => ({ shape, color, size });
export const chip = color => piece('chip', color);
export const colors = (shape, paints) => paints.map(color => piece(shape, color));
export const sizes = (shape, color, scales) => scales.map(size => piece(shape, color, size));
export const sizeMark = size => piece('ball', 'pink', size);
export const lesson = (room, scenes, practice) => ({ format: 'sensory', room, scenes, practice });
export const scene = (effect, text, pieces, options = {}) => ({ effect, text, pieces, ...options });
export const exercise = (prompt, guide, ...rounds) => ({ kind: 'sensory', prompt, guide, rounds });
export const pick = (pieces, correct, sample, extra = {}) => ({
  pieces, sample, ...extra, answers: [].concat(correct).map(from => ({ from })),
});
export const connect = (pieces, targets, matches, extra = {}) => ({
  pieces, targets, ...extra, answers: matches.map((to, from) => ({ from, to })),
});
export const sortBy = (pieces, targets, property) =>
  connect(pieces, targets, pieces.map(item => targets.findIndex(target => item[property] === target[property])));
export const repair = (pieces, targets, starts) => ({
  ...sortBy(pieces, targets, 'color'), starts,
  answers: pieces.flatMap((item, from) => item.color === targets[starts[from]].color
    ? [] : [{ from, to: targets.findIndex(target => target.color === item.color) }]),
});
