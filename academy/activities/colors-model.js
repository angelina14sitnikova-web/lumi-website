export const palette = {
  orange: { name: 'оранжевый', paint: '#f18224' },
  brown: { name: 'коричневый', paint: '#81503b' },
  paleGreen: { name: 'светло-зелёный', paint: '#a6d767' },
  deepGreen: { name: 'тёмно-зелёный', paint: '#155339' },
  red: { name: 'красный', paint: '#d32f39' },
  yellow: { name: 'жёлтый', paint: '#ffc928' },
  blue: { name: 'синий', paint: '#2051bb' },
  green: { name: 'зелёный', paint: '#268748' },
  white: { name: 'белый', paint: '#ffffff' },
  black: { name: 'чёрный', paint: '#23232e' },
  pink: { name: 'розовый', paint: '#f49bc5' },
  sky: { name: 'голубой', paint: '#79cef2' },
  gray: { name: 'серый', paint: '#858893' },
};

export function colorTargets(task) {
  return task.pieces.flatMap(({ color }, index) => {
    const matches = color === task.color;
    const needed = task.mode === 'odd' ? !matches : !task.color || matches;
    return needed ? [index] : [];
  });
}

export function colorsReady(task) {
  if (!['find', 'odd', 'sort', 'match', 'gather'].includes(task.mode) || !task.pieces?.length ||
      !task.pieces.every(piece => Object.hasOwn(palette, piece.color))) return false;
  const targets = colorTargets(task);
  if (!targets.length) return false;
  if (task.mode === 'find' || task.mode === 'odd') {
    return Object.hasOwn(palette, task.color) && targets.length < task.pieces.length &&
      (task.mode !== 'odd' || targets.length === 1);
  }
  return Boolean(task.bins?.length && new Set(task.bins).size === task.bins.length &&
    task.bins.every(color => Object.hasOwn(palette, color) && targets.some(index => task.pieces[index].color === color)) &&
    targets.every(index => task.bins.includes(task.pieces[index].color)));
}

export function colorsAnswer(task, answer) {
  const targets = colorTargets(task);
  if (!Array.isArray(answer) || answer.length !== targets.length) return false;
  return targets.every(index => {
    const destination = task.bins ? task.pieces[index].color : null;
    return answer.some(step => step?.index === index && step.destination === destination);
  });
}
