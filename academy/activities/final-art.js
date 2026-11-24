const icon = (name, drawing) => [name, drawing];
const bed = '<rect x="13" y="52" width="74" height="25" rx="6"/><path d="M14 41v44m72-30v30" fill="none" stroke-width="5"/><rect x="19" y="45" width="22" height="14" rx="5" fill="#fff4df"/>';
const apple = '<path d="M50 38C30 21 15 40 22 59c5 16 16 22 28 16 12 6 23 0 28-16 7-19-8-38-28-21Z" fill="#de635e"/><path d="M50 38q1-16 10-18m-9 13q15 1 19-9" fill="none" stroke="#4b8652" stroke-width="4"/>';
const dog = '<path d="M27 38Q16 34 18 58Q20 78 32 65M73 38Q84 34 82 58Q80 78 68 65" fill="#d2ad83"/><ellipse cx="50" cy="75" rx="20" ry="14" fill="#edcaa2"/><ellipse cx="50" cy="47" rx="27" ry="23" fill="#f8dfbe"/><path d="M33 65q17 8 34 0l-4 10H38Z" fill="#77bcef"/>';
const face = '<ellipse cx="43" cy="48" rx="4" ry="6" fill="#4b96d1"/><ellipse cx="58" cy="48" rx="4" ry="6" fill="#4b96d1"/><ellipse cx="51" cy="58" rx="4" ry="3" fill="#6c4745"/>';
const colors = {morning:'#f6c985',day:'#a7dcf8',evening:'#e9a3a4',night:'#484674',twilight:'#e5b0ac'};

const arrows = {
  arrowright: ['Вправо',0], arrowdown: ['Вниз',90], arrowleft: ['Влево',180], arrowup: ['Вверх',270],
};
const page = (name, mark) => icon(name,'<rect x="19" y="22" width="62" height="63" rx="8" fill="#fff3d9"/><path d="M20 39h60m-49-23v14m38-14v14" fill="none" stroke-width="5"/>'+mark);
const designs = {
  doubleTicket: icon('Билет с двумя отметками','<rect x="13" y="26" width="74" height="49" rx="6" fill="#e7c0e3"/><path d="m21 51 9 9 15-18m5 9 9 9 15-18" fill="none" stroke="#614283" stroke-width="6"/>'),
  crystal:icon('Кристалл','<path d="M50 8 76 34 72 67 50 92 28 67 24 34Z"/><path d="M50 8v84M24 34h52M28 67h44" fill="none" stroke="#e5f2fc" opacity=".7"/>'),
  markedCrystal:icon('Кристалл с отметкой','<path d="M50 8 76 34 72 67 50 92 28 67 24 34Z"/><path d="m34 49 12 12 21-26" stroke="#fff4d8" stroke-width="6" fill="none"/>'),
  lantern:icon('Фонарь','<path d="M34 29a16 16 0 0 1 32 0M22 38h56L67 85H33Z" fill="#e6ba72"/><path d="M31 45h38l-7 31H38Z" fill="#fff0ac"/><path d="M48 53v17" stroke="#f4ba57" stroke-width="6"/>'),
  pearl:icon('Жемчужина','<circle cx="50" cy="50" r="30" fill="#edebfd"/><ellipse cx="39" cy="41" rx="12" ry="9" fill="#fffdf4"/><path d="M29 64q25 12 44-5" fill="none" stroke="#c1b0e7"/>'),
  mushroom:icon('Гриб','<path d="M41 54h18l6 34H35Z" fill="#f4ddbe"/><path d="M12 59Q17 17 50 17t38 42Z"/><circle cx="38" cy="39" r="7" fill="#fff1da"/><circle cx="62" cy="48" r="6" fill="#fff1da"/>'),
  firefly:icon('Светлячок','<ellipse cx="33" cy="43" rx="16" ry="11" fill="#c4e6fb"/><ellipse cx="67" cy="43" rx="16" ry="11" fill="#c4e6fb"/><ellipse cx="50" cy="55" rx="19" ry="26" fill="#f8d268"/><circle cx="50" cy="37" r="13" fill="#794e60"/><path d="M34 80l-9 9m41-9 9 9" stroke="#e6ad52" stroke-width="4"/>'),
  shell:icon('Ракушка','<path d="M47 84Q7 69 14 42q-4-14 15-18 6-15 21-9 15-6 21 9 19 4 15 18 7 27-33 42Z"/><path d="M50 78 28 31m22 47V19m0 59 22-47" fill="none" stroke="#fff1df" stroke-width="4"/>'),
  previousDay:page('Вчера','<path d="M66 56H42v-9L27 62l15 15v-9h24Z"/>'),
  todayDay:page('Сегодня','<circle cx="50" cy="62" r="15" fill="#f6c366"/>'),
  nextDay:page('Завтра','<path d="M32 56h24v-9l15 15-15 15v-9H32Z"/>'),
  sprout:icon('Росток','<path d="M15 83q35-19 70 0" stroke="#a07755" stroke-width="9" fill="none"/><path d="M50 80V43q-21 0-23-20 24-2 23 20 11-15 26-12-3 20-26 23" stroke="#447a50" fill="#a4d580" stroke-width="4"/>'),
  bread:icon('Ломтик хлеба','<path d="M21 44q-8-14 9-19h40q17 5 9 19l-5 33H26Z" fill="#f2bf79"/>'),
  cheese:icon('Ломтик сыра','<path d="M14 73 29 35h54v38Z" fill="#f5c852"/><circle cx="38" cy="60" r="5" fill="#ffe6a3"/><circle cx="66" cy="47" r="6" fill="#ffe6a3"/>'),
  sandwich:icon('Бутерброд','<path d="M14 59h72v16H14Z" fill="#d6a36c"/><path d="M13 56h74v11H13Z" fill="#edc256"/><path d="M15 56q12-19 36-19t34 19Z" fill="#e6b570"/>'),
  lift: icon('Лифт','<rect x="21" y="13" width="58" height="77" rx="7" fill="#afaddd"/><path d="M28 30h44v52H28Zm22 3v46" fill="#f0e4fe"/><circle cx="50" cy="22" r="4" fill="#f8d16b"/>'),
  treasure: icon('Сундук','<path d="M16 45q0-17 17-19h34q17 2 17 19v34H16Z" fill="#d1a06c"/><path d="M16 48h68M30 30v48m40-48v48" fill="none" stroke="#eebd61" stroke-width="5"/><rect x="44" y="48" width="12" height="15" rx="3" fill="#f4d87f"/>'),
  wagon: icon('Вагон','<rect x="12" y="27" width="76" height="44" rx="8"/><path d="M20 34h17v17H20Zm23 0h17v17H43Zm23 0h14v17H66Z" fill="#fff3ce"/><circle cx="28" cy="76" r="10" fill="#4a3659"/><circle cx="73" cy="76" r="10" fill="#4a3659"/>'),
  dogToy: icon('Щенок',dog+face),
  markedCube: icon('Кубик с отметкой','<path d="M21 34 42 19h40v45L61 82H21Z" fill="#71a9da"/><path d="M21 34 42 19h40L61 34Z" fill="#bde8fb"/><path d="m30 56 6 7 16-16" stroke="#fff3ca" stroke-width="6" fill="none"/>'),
  drum: icon('Барабан','<path d="M17 37v38q33 20 66 0V37Z" fill="#b781c9"/><ellipse cx="50" cy="37" rx="33" ry="13" fill="#ffedbd"/><path d="m23 53 14 25 13-23 14 23 13-25" fill="none" stroke="#ffdea4" stroke-width="4"/>'),
  clap: icon('Хлопок','<path d="M22 81 14 56l6-10 10 10V28q0-9 7-9 6 0 6 8v23l6-7q8 0 9 8v22l-9 9Z" fill="#f1bc8b"/><path d="M79 75 88 51l-7-8-8 7V24q0-8-6-8-7 0-7 8v23l-7-6q-8 0-8 8v22l8 9Z" fill="#f1bc8b"/><path d="M50 16V7m-9 13-5-6m22 8 6-6" fill="none" stroke="#bf8e2f" stroke-width="3"/>'),
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
const pawDrawing='<path d="M24 60q0-9 8-15l11-8q7-5 14 0l11 8q8 6 8 15 0 14-15 10l-11-4-11 4Q24 74 24 60Z" fill="#e4b992"/><g fill="#e4b992"><circle cx="27" cy="34" r="8"/><circle cx="43" cy="22" r="8"/><circle cx="60" cy="22" r="8"/><circle cx="75" cy="34" r="8"/></g>';
const shapeParts={
 leftPaw:['Левая лапка',pawDrawing], rightPaw:['Правая лапка',pawDrawing],
 paperMap:['Лист бумаги','<rect x="12" y="17" width="76" height="66" rx="5" fill="#fff5dd"/>'],
 block:['Игрушечный кубик','<path d="M18 31 50 14l32 17v42L50 90 18 73Z"/><path d="m18 31 32 17 32-17M50 48v42" fill="none" stroke="#51326a"/>'],

 measureUnit: ['Условная мерка','<rect x="13" y="39" width="74" height="22" rx="4"/><path d="M22 46h56" stroke="#fff" opacity=".5"/>'],
 cylinder: ['Цилиндр','<path d="M21 28h58v47a29 13 0 0 1-58 0Z"/><ellipse cx="50" cy="28" rx="29" ry="13" fill="var(--toy-color)"/><path d="M26 26a25 9 0 0 1 45-4M32 42v30" fill="none" stroke="#fff" opacity=".55"/>'],
 tin: ['Банка','<path d="M22 29h56v49a28 12 0 0 1-56 0Z"/><path d="M23 44q27 13 54 0v22q-27 13-54 0Z" fill="#fff7d4"/><ellipse cx="50" cy="29" rx="28" ry="12" fill="#e3e1ed"/>'],
 trapezoid: ['Трапеция','<path d="M30 20h40l18 60H12Z"/>'],
 vertex: ['Угол','<path d="M24 74V24h50" fill="none" stroke-width="8"/>'],
 halfTop: ['Верхняя половина круга','<path d="M10 50a40 40 0 0 1 80 0Z"/>'],
 halfBottom: ['Нижняя половина круга','<path d="M10 50a40 40 0 0 0 80 0Z"/>'],
 diagonalTop: ['Верхняя треугольная часть','<path d="M15 15h70L15 85Z"/>'],
 diagonalBottom: ['Нижняя треугольная часть','<path d="M85 85H15L85 15Z"/>'],
 quarterNW: ['Верхняя левая четверть','<path d="M50 50H10a40 40 0 0 1 40-40Z"/>'],
 quarterNE: ['Верхняя правая четверть','<path d="M50 50V10a40 40 0 0 1 40 40Z"/>'],
 quarterSW: ['Нижняя левая четверть','<path d="M50 50v40a40 40 0 0 1-40-40Z"/>'],
 quarterSE: ['Нижняя правая четверть','<path d="M50 50h40a40 40 0 0 1-40 40Z"/>'],
 edgeTop: ['Верхняя сторона','<path d="M15 15h70" fill="none" stroke-width="8"/>'],
 edgeRight: ['Правая сторона','<path d="M85 15v70" fill="none" stroke-width="8"/>'],
 edgeBottom: ['Нижняя сторона','<path d="M85 85H15" fill="none" stroke-width="8"/>'],
 edgeLeft: ['Левая сторона','<path d="M15 85V15" fill="none" stroke-width="8"/>'],
 equalCircle:['Круг с линией по центру','<circle cx="50" cy="50" r="38"/><path d="M12 50h76" stroke="#392747" stroke-width="4"/>'],
 unequalCircle:['Круг с линией выше центра','<circle cx="50" cy="50" r="38"/><path d="M20 27h60" stroke="#392747" stroke-width="4"/>'],
 equalSquare:['Квадрат с линией по центру','<path d="M14 14h72v72H14Z"/><path d="M50 14v72" stroke="#392747" stroke-width="4"/>'],
 unequalSquare:['Квадрат с линией сбоку','<path d="M14 14h72v72H14Z"/><path d="M31 14v72" stroke="#392747" stroke-width="4"/>'],
 equalRectangle:['Прямоугольник с линией по центру','<path d="M10 29h80v42H10Z"/><path d="M50 29v42" stroke="#392747" stroke-width="4"/>'],
 unequalRectangle:['Прямоугольник с линией сбоку','<path d="M10 29h80v42H10Z"/><path d="M30 29v42" stroke="#392747" stroke-width="4"/>'],
};
const seasonArt = {
 snowScene:['Зима','#b5dcf3','#eff8ff','#8099b5','<g fill="#fff"><circle cx="25" cy="22" r="3"/><circle cx="62" cy="31" r="3"/><circle cx="74" cy="19" r="2"/></g>'],
 springScene:['Весна','#e5cdf4','#b4d78b','#e295b4','<g fill="#f19fc0"><circle cx="42" cy="44" r="6"/><circle cx="63" cy="42" r="5"/><circle cx="52" cy="33" r="6"/></g>'],
 summerScene:['Лето','#a4e5fa','#8ed08b','#3b9b72','<circle cx="21" cy="26" r="9" fill="#ffe5a2"/>'],
 autumnScene:['Осень','#eed6b3','#ecd39d','#da8c4f','<path d="m27 68 5 -4 5 4 -5 4zm40 -1 6 -5 5 4 -5 4Z" fill="#bc643b"/>']
};
export function finalDesign(shape) {
  if (seasonArt[shape]) {
    const [name,sky,ground,tree,detail]=seasonArt[shape];
    return [name, '<rect x="4" y="7" width="92" height="86" rx="12" fill="'+sky+'"/><path d="M5 72Q22 61 41 74Q65 62 95 70V89H5Z" fill="'+ground+'"/><path d="M50 80V48" stroke="#916755" stroke-width="5"/><circle cx="50" cy="49" r="21" fill="'+tree+'"/>'+detail];
  }
  if (shapeParts[shape]) return shapeParts[shape];
  if (!arrows[shape]) return designs[shape];
  const [name,turn] = arrows[shape];
  return icon(name,'<path d="M15 42H60V27L87 50 60 73V58H15Z" transform="rotate('+turn+' 50 50)"/>');
}
export function phaseMarkup(phase) {
  if (!phase) return '';
  const light = phase === 'night'
    ? '<path d="M64 11a14 14 0 1 0 16 18 14 14 0 0 1-16-18Z" fill="#fff0a0"/><path d="M20 18h3m14 14h3m41 4h3" stroke="#fff4aa" stroke-width="4"/>'
    : '<circle cx="' + (phase === 'evening' ? 72 : 28) + '" cy="' + (phase === 'day' ? 19 : 40) + '" r="13" fill="#ffe682"/>';
  return '<rect x="3" y="3" width="94" height="94" rx="14" fill="' + colors[phase] + '" stroke="none"/>'+light+
    '<path d="M4 71q29-15 49 0t43-6v18q0 13-13 13H17Q4 96 4 83Z" fill="#a6b988" stroke="none"/>';
}
