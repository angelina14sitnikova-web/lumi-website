const paths = {
  pumpkin: ['Тыква','M50 34C18 19 10 48 22 69Q34 91 50 81Q66 91 78 69C90 48 82 19 50 34Z','<path d="M50 34q0-13 8-15m-19 19q-14 21 0 39m22-39q14 21 0 39" fill="none" stroke="#90512c" stroke-width="4"/>'],
  orangeFruit: ['Апельсин','M50 19a32 32 0 1 1 0 64a32 32 0 1 1 0-64Z','<path d="M50 24q12-19 26-11-6 14-26 11Z" fill="#5fa55d"/>'],
  acorn: ['Жёлудь','M25 41h50v17c0 14-12 26-25 28-13-2-25-14-25-28Z','<path d="M18 45q0-21 32-22 32 1 32 22Z" fill="#c79364"/><path d="M49 23l7-10" fill="none" stroke-width="5"/>'],
  chocolate: ['Шоколад','M22 14h56v72H22Z','<path d="M28 22h17v17H28Zm27 0h17v17H55ZM28 45h17v17H28Zm27 0h17v17H55Z" fill="#aa7658"/>'],
  ribbon: ['Лента', 'M10 43H90L80 50L90 57H10Z'],
  pencil: ['Карандаш', 'M10 43H77L90 50L77 57H10Z', '<path d="M21 43v14m55-14v14" fill="none"/>'],
  road: ['Дорожка', 'M10 35H90V65H10Z', '<path d="M15 50H86" fill="none" stroke="#fff9e5" stroke-width="3" stroke-dasharray="6 7"/>'],
  strip: ['Полоска', 'M10 43H90V57H10Z'],
  rope: ['Верёвочка', 'M10 49Q20 38 30 49T50 49T70 49T90 49', '<path d="M10 49Q20 38 30 49T50 49T70 49T90 49" fill="none" stroke="var(--toy-color)" stroke-width="4"/>'],
  tower: ['Башня', 'M29 86V23H20V13H34V20H45V13H55V20H66V13H80V23H71V86Z', '<path d="M42 86V68a8 8 0 0 1 16 0v18m-12-48h8v11h-8Z" fill="#fff0d2"/>'],
  tree: ['Дерево', 'M44 86V65C11 69 17 35 35 32a15 15 0 1 1 30 0c18 3 24 37-9 33v21Z', '<path d="M50 61V42m0 12-10-7m10 1 9-8" fill="none" stroke="#f0ffeb"/>'],
  bridge: ['Мост', 'M10 35H90V65H10Z', '<path d="M13 41H87M13 59H87M25 42v16m12-16v16m13-16v16m13-16v16m12-16v16" stroke="#fff2d8" fill="none"/>'],
  rectangle: ['Вытянутый прямоугольник', 'M13 30H87V70H13Z'],
  doorShape: ['Контур двери', 'M30 14H70V86H30Z'],
  door: ['Дверь', 'M30 14H70V86H30Z', '<path d="M36 22H64V79H36Z" fill="none"/><circle cx="60" cy="54" r="3" fill="#fff0d3"/>'],
  wheel: ['Колесо', 'M50 15a35 35 0 1 1 0 70a35 35 0 1 1 0-70Z', '<circle cx="50" cy="50" r="12" fill="#fff5dd"/><path d="M50 22v56M22 50h56" fill="none"/>'],
  clock: ['Часы', 'M50 15a35 35 0 1 1 0 70a35 35 0 1 1 0-70Z', '<circle cx="50" cy="50" r="27" fill="#fffaec"/><path d="M50 31v20l12 8" fill="none"/>'],
  tile: ['Плитка', 'M16 16H84V84H16Z', '<path d="M23 23H77V77H23Z" fill="none" stroke="#fff4df" stroke-width="3"/>'],
  wall: ['Стенка домика', 'M16 16H84V84H16Z', '<path d="M20 34H80M20 52H80M20 70H80" fill="none" stroke="#fff3de"/>'],
  roof: ['Треугольная крыша', 'M50 14 89 83H11Z', '<path d="M25 63H75M35 46H65" fill="none" stroke="#fff2d8"/>'],
  flatRoof: ['Плоская крыша', 'M12 38H88V62H12Z'],
  roundRoof: ['Округлая крыша', 'M12 75a38 49 0 0 1 76 0Z'],
  window: ['Квадратное окно', 'M16 16H84V84H16Z', '<path d="M50 19V81M19 50H81" fill="none" stroke="#fff6e5" stroke-width="5"/>'],
  roundWindow: ['Круглое окно', 'M50 16a34 34 0 1 1 0 68a34 34 0 1 1 0-68Z', '<path d="M50 19V81M19 50H81" fill="none" stroke="#fff6e5" stroke-width="5"/>'],
  tallWindow: ['Вытянутое окно', 'M30 14H70V86H30Z', '<path d="M50 19V81M33 50H67" fill="none" stroke="#fff6e5" stroke-width="5"/>'],
};

export const geometryName = shape => paths[shape]?.[0];
export function geometryMarkup(shape) {
  const definition = paths[shape];
  if (!definition) return null;
  const [, path, details = ''] = definition;
  return '<path d="' + path + '"' + (shape === 'rope' ? ' fill="none" stroke-width="7"' : '') + '/>' + details;
}
