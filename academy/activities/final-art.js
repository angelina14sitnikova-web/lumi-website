const icon = (name, drawing) => [name, drawing];
const bed = '<rect x="13" y="52" width="74" height="25" rx="6"/><path d="M14 41v44m72-30v30" fill="none" stroke-width="5"/><rect x="19" y="45" width="22" height="14" rx="5" fill="#fff4df"/>';
const apple = '<path d="M50 38C30 21 15 40 22 59c5 16 16 22 28 16 12 6 23 0 28-16 7-19-8-38-28-21Z" fill="#de635e"/><path d="M50 38q1-16 10-18m-9 13q15 1 19-9" fill="none" stroke="#4b8652" stroke-width="4"/>';
const dog = '<path d="M27 38Q16 34 18 58Q20 78 32 65M73 38Q84 34 82 58Q80 78 68 65" fill="#d2ad83"/><ellipse cx="50" cy="75" rx="20" ry="14" fill="#edcaa2"/><ellipse cx="50" cy="47" rx="27" ry="23" fill="#f8dfbe"/><path d="M33 65q17 8 34 0l-4 10H38Z" fill="#77bcef"/>';
const face = '<ellipse cx="43" cy="48" rx="4" ry="6" fill="#4b96d1"/><ellipse cx="58" cy="48" rx="4" ry="6" fill="#4b96d1"/><ellipse cx="51" cy="58" rx="4" ry="3" fill="#6c4745"/>';
const colors = {morning:'#f6c985',day:'#a7dcf8',evening:'#e9a3a4',night:'#484674',twilight:'#e5b0ac'};

const designs = {
  hoop: icon('Обруч','<circle cx="50" cy="50" r="32" fill="none" stroke="var(--toy-color)" stroke-width="8"/>'),
  garage: icon('Гараж','<path d="M15 83V37L50 19 85 37V83Z"/><path d="M28 83V50H72V83Z" fill="#7764a0"/><path d="M30 57h40m-40 9h40" stroke="#eae3fa"/>'),
  bird: icon('Птица','<path d="M16 61q10-23 30-16 12-21 27-8l12 5-12 7Q66 72 43 73L18 78l7-13Z"/><circle cx="68" cy="42" r="2" fill="#30263f"/>'),
  shelf: icon('Полка','<path d="M21 15v70m58-70v70M20 34h60M20 69h60" fill="none" stroke="#a67a54" stroke-width="7"/>'),
  spot: icon('Свободное место','<circle cx="50" cy="50" r="25" fill="#fff7dc" stroke="#795499" stroke-dasharray="5 4"/>'),
  addOne: icon('Добавить один','<circle cx="50" cy="50" r="34" fill="#d9efd3"/><path d="M33 50h34M50 33v34" stroke="#317247" stroke-width="7"/>'),
  takeOne: icon('Убрать один','<circle cx="50" cy="50" r="34" fill="#f8e0d4"/><path d="M33 50h34" stroke="#a34b48" stroke-width="7"/>'),
  lumiBack: icon('Луми со спины',dog+'<path d="M57 83q10 1 14-7" fill="none" stroke="#d2ad83" stroke-width="5"/>'),
  lumiRight: icon('Луми поднимает правую лапку',dog+'<path d="M68 78q12-2 15-16" fill="none" stroke="#edcaa2" stroke-width="9"/>'),
  lumiLeft: icon('Луми поднимает левую лапку',dog+'<path d="M32 78q-12-2-15-16" fill="none" stroke="#edcaa2" stroke-width="9"/>'),
  lumiSide: icon('Луми смотрит вправо','<g transform="translate(-5)">'+dog+'</g><ellipse cx="69" cy="54" rx="13" ry="9" fill="#f8dfbe"/><ellipse cx="59" cy="46" rx="4" ry="5" fill="#4a96d1"/><circle cx="79" cy="53" r="3" fill="#594143"/>'),
  wake: icon('Пробуждение',bed+'<g transform="translate(7 -4) scale(.85)">'+dog+face+'</g>'),
  sleep: icon('Сон',bed+'<ellipse cx="33" cy="49" rx="13" ry="8" fill="#f5d1ab"/><path d="M33 49q4 4 8 0" fill="none"/><path d="M46 53h35v23H44Z" fill="#a6bbea"/>'),
  ready: icon('Подготовка ко сну','<g transform="translate(-16 9) scale(.89)">'+dog+'</g><path d="M64 23 76 30 87 23 96 42 87 49 85 77H67L65 49 56 42Z" fill="#c485a8"/><path d="M73 51h7m-7 9h7" stroke="#fff4dc"/>'),
  wash: icon('Умывание','<path d="M17 57h66q-4 22-33 22T17 57Z" fill="#d1edf6"/><path d="M26 58V41q0-10 11-10h11v8" fill="none" stroke-width="5"/><path d="m46 47-3 6m11-8-2 8" stroke="#5bafe1" fill="none"/><g transform="translate(36 4) scale(.65)">'+dog+face+'</g>'),
  meal: icon('Еда за столом','<g transform="translate(12 -8) scale(.76)">'+dog+face+'</g><path d="M13 65h75v10H13Zm8 11v12m57-12v12" fill="#c69d6a"/><ellipse cx="50" cy="67" rx="17" ry="6" fill="#fff3db"/>'),
  walk: icon('Прогулка','<path d="M7 86q26-18 38-2t46-8" fill="none" stroke="#bd9a6c" stroke-width="8"/>'+dog+face),
  play: icon('Игра на полянке','<g transform="translate(-8) scale(.9)">'+dog+face+'</g><circle cx="73" cy="73" r="17" fill="#e9989a"/><path d="M58 68q12-9 27 1" fill="none" stroke="#fff2dd"/>'),
  home: icon('Возвращение домой','<g transform="translate(-10 23) scale(.7)">'+dog+'</g><path d="M59 75V38h31v37Z" fill="#daa57b"/><path d="M52 39 75 18 97 39Z" fill="#9a6d90"/><path d="M71 75V52h13v23Z" fill="#ffe2a7"/>'),
  rinse: icon('Мытьё яблока','<g transform="translate(8 14) scale(.8)">'+apple+'</g><path d="M20 39v-9q0-8 8-8h20v8m-5 5v8m8-9v10" stroke="#459fd0" stroke-width="4" fill="none"/><path d="M12 72q38 25 76 0" fill="none" stroke="#86bddf" stroke-width="6"/>'),
  eat: icon('Кусочек яблока',apple+'<circle cx="77" cy="43" r="13" fill="#fff6e7" stroke="none"/>'),
  boots: icon('Сапоги','<path d="M27 24h21v43q0 12-14 12H16q-8 0-8-9 0-9 19-9Zm44 0h21v43q0 12-14 12H60q-8 0-8-9 0-9 19-9Z" fill="#75add6"/>'),
  seed: icon('Посадка семечка','<path d="M12 71q38-20 76 0v16H12Z" fill="#a77856"/><ellipse cx="50" cy="49" rx="8" ry="12" fill="#ceaa7e"/><path d="M50 22v12m-5-5 5 5 5-5" fill="none"/>'),
  water: icon('Полив','<path d="M15 37h41v31H15Zm40 11 21-13v13l-21 12" fill="#78b5dd"/><path d="m76 55 2 5m6-7 2 5m5-7 2 5" stroke="#438dd0"/><path d="M66 82q10-12 23 0Z" fill="#8d7051"/>'),
  grow: icon('Распустившийся цветок','<path d="M50 83V48m0 20q-11-12-17-9m17 6q9-12 17-10" stroke="#4e9c68" stroke-width="5" fill="none"/><path d="M50 27c-13-22-30 2-15 12-10 15 13 21 15 9 18 12 27-13 14-14 5-19-11-18-14-7Z" fill="#e68fb1"/><circle cx="51" cy="36" r="6" fill="#ffe58b"/>'),
  skyScene: icon('Вид полянки','<path d="M23 87V69h25v18Zm-4-18 16-15 17 15Z" fill="#d7a77a"/><path d="M72 87V67m-15 4 15-20 15 20Z" fill="#79a976"/>'),
};
export function finalDesign(shape) { return designs[shape]; }
export function phaseMarkup(phase) {
  if (!phase) return '';
  const light = phase === 'night'
    ? '<path d="M64 11a14 14 0 1 0 16 18 14 14 0 0 1-16-18Z" fill="#fff0a0"/><path d="M20 18h3m14 14h3m41 4h3" stroke="#fff4aa" stroke-width="4"/>'
    : '<circle cx="' + (phase === 'evening' ? 72 : 28) + '" cy="' + (phase === 'day' ? 19 : 40) + '" r="13" fill="#ffe682"/>';
  return '<rect x="3" y="3" width="94" height="94" rx="14" fill="' + colors[phase] + '" stroke="none"/>'+light+
    '<path d="M4 71q29-15 49 0t43-6v18q0 13-13 13H17Q4 96 4 83Z" fill="#a6b988" stroke="none"/>';
}
