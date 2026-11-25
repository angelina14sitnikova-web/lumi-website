const orderedKinds = new Set(['sequence', 'match', 'sort', 'move-stop']);
const singleKinds = new Set(['choice', 'discovery', 'compare', 'detect', 'repeat']);

export function shuffled(values, random = Math.random) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index--) {
    const position = Math.floor(random() * (index + 1));
    [result[index], result[position]] = [result[position], result[index]];
  }
  return result;
}

export function roundAnswer(kind, round, selected) {
  if (kind === 'repeat') return (round.accepts ?? [round.answer]).includes(selected);
  if (kind === 'rhythm') return Array.isArray(selected) && round.answer.length === selected.length && round.answer.every((id,i)=>selected[i]===id);
  if (kind === 'compose') return Array.isArray(selected) && selected.length===round.answer.length && selected.every(id=>round.options.includes(id));
  if (singleKinds.has(kind)) return round.answer === selected;
  if (!Array.isArray(round.answer) || !Array.isArray(selected) || selected.length !== round.answer.length) return false;
  if (orderedKinds.has(kind)) return round.answer.every((item, index) => selected[index] === item);
  if (kind === 'multi' || kind === 'explore') {
    return new Set(selected).size === selected.length && round.answer.every(item => selected.includes(item));
  }
  return false;
}

export function checkListeningTask(task, responses) {
  return Boolean(Array.isArray(responses) && responses.length === task.rounds.length &&
    task.rounds.every((round, index) => roundAnswer(round.kind ?? task.activity ?? task.kind, round, responses[index])));
}

export function readyListeningTask(task) {
  return Boolean(task.kind && task.name && task.instruction && Array.isArray(task.rounds) && task.rounds.length &&
    task.rounds.every(round => {
      if (!round.sounds?.length || round.options?.length < 1 || !Array.isArray(round.options)) return false;
      const answer = Array.isArray(round.answer) ? round.answer : [round.answer];
      return answer.length && answer.every(item => round.options.includes(item)) &&
        roundAnswer(round.kind ?? task.activity ?? task.kind, round, round.answer);
    }));
}

/** Keep the sample and option order stable throughout a round and all repeats. */
export function createListeningRound(kind, round, random = Math.random) {
  const options = shuffled(round.options, random);
  const sample = [...round.sounds];
  const selection = [];
  let sampleHeard = false;
  let onsetHeard = false;
  let musicHeard = false;
  let musicStopped = false;
  let errors = 0;
  let accepted = false;

  function attempt(answer) {
    if (!sampleHeard || accepted) return { status: 'wait' };
    if (roundAnswer(kind, round, answer)) {
      accepted = true;
      return { status: 'correct', answer };
    }
    errors++;
    selection.length = 0;
    return { status: 'try-again', hint: errors >= 2 ? Array.isArray(round.answer) ? [...round.answer] : round.answer : null };
  }

  function select(option) {
    if (!options.includes(option) || accepted) return { status: 'wait' };
    if (kind === 'detect') {
      if (!onsetHeard) return { status: 'wait' };
      sampleHeard = true;
    }
    if (kind === 'move-stop') {
      if (option === 'move' && musicHeard && !selection.length) {
        selection.push(option);
        return { status: 'picking' };
      }
      if (option === 'stop' && musicStopped && selection.length === 1) {
        sampleHeard = true;
        return attempt([...selection, option]);
      }
      return { status: 'wait' };
    }
    if (!sampleHeard) return { status: 'wait' };
    if (singleKinds.has(kind)) return attempt(option);
    if (kind === 'explore') {
      if (!selection.includes(option)) selection.push(option);
      return selection.length === round.answer.length ? attempt([...selection]) : {status:'picking'};
    }
    if (kind === 'compose' || kind === 'rhythm') {
      if(selection.length < (round.answer.length + (kind==='rhythm'?2:0))) selection.push(option);
      return {status:'picking'};
    }
    if (kind === 'multi') {
      const index = selection.indexOf(option);
      if (index === -1) selection.push(option);
      else selection.splice(index, 1);
      return { status: 'picking' };
    }
    if (orderedKinds.has(kind)) {
      selection.push(option);
      if (selection.length === round.answer.length) return attempt([...selection]);
      return { status: 'picking' };
    }
    return { status: 'wait' };
  }

  return {
    options: [...options],
    sample: [...sample],
    playClip(index) {
      if (kind === 'detect' && index === round.audibleIndex) onsetHeard = true;
      if (kind === 'move-stop' && index === 0) musicHeard = true;
      if (kind === 'move-stop' && index === 1) musicStopped = true;
    },
    finishListening() { sampleHeard = true; },
    select,
    selection: () => [...selection],
    submit: () => ['multi','rhythm','compose'].includes(kind) ? attempt([...selection]) : { status: 'wait' },
    resetSelection: () => { selection.length = 0; },
  };
}
