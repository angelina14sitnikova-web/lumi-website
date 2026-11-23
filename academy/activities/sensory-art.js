import { palette } from './colors-model.js';
import { toy, toyName } from './colors-art.js';

const props = {
  chip: ['Цветовой образец', '<rect x="18" y="18" width="64" height="64" rx="15"/><path d="M27 37v-6q0-4 5-4h10" stroke="#fff" stroke-width="4" fill="none" opacity=".65"/>'],
  gift: ['Подарок', '<rect x="20" y="38" width="60" height="48" rx="7"/><rect x="14" y="33" width="72" height="18" rx="5"/><path d="M50 34C16 30 29 9 43 22l7 12c32-4 21-25 7-12Z" fill="#ffedd0"/><path d="M49 36v49" stroke="#fff3d9" stroke-width="9"/>'],
  mitten: ['Варежка', '<path d="M34 77Q25 68 14 54c-8-10 3-17 10-11l11 9V31c0-24 42-24 42 0v26q0 13-11 20Z"/><rect x="31" y="74" width="39" height="13" rx="4"/><path d="M42 80h18m-10-47v19m-8-10h16" fill="none" stroke="#fff" opacity=".6"/>'],
  hat: ['Шапочка', '<circle cx="50" cy="18" r="9"/><path d="M19 69v-6a31 31 0 1 1 62 0v6Z"/><rect x="15" y="63" width="70" height="19" rx="6"/><path d="M32 71v4m12-4v4m12-4v4m12-4v4" fill="none" stroke="#fff" opacity=".55"/>'],
  box: ['Коробка', '<path d="M14 39 32 22h52v44L66 84H14Z"/><path d="M14 39l18-17h52L66 39Z" fill="#fff" opacity=".3"/><path d="M66 39 84 22v44L66 84Z" fill="#302437" opacity=".22"/><rect x="29" y="52" width="19" height="6" rx="3" fill="#ffefcf"/>'],
  basket: ['Корзина', '<path d="M29 43V39a21 21 0 0 1 42 0v4" fill="none" stroke="var(--toy-color)" stroke-width="6"/><path d="m12 42 10 39h56l10-39Z"/><path d="M22 54h56m-51 12h46M36 49l3 29m25-29-3 29" stroke="#fff2d8" fill="none" opacity=".67"/>'],
  stall: ['Прилавок', '<path d="M20 23h60v55H20Z" fill="#fff0d4"/><path d="M16 24h68l8 22H8Zm0 31h68v27H16Z"/><path d="M32 26 29 44m39-18 3 18M23 64h54" stroke="#fff5da" stroke-width="4" fill="none"/>'],
  bear: ['Медведь', '<circle cx="28" cy="24" r="12"/><circle cx="72" cy="24" r="12"/><ellipse cx="50" cy="68" rx="22" ry="22"/><ellipse cx="29" cy="80" rx="11" ry="9"/><ellipse cx="71" cy="80" rx="11" ry="9"/><ellipse cx="50" cy="42" rx="29" ry="23"/><ellipse cx="50" cy="49" rx="13" ry="10" fill="#fff2d8"/><g fill="#3d2a34" stroke="none"><circle cx="39" cy="39" r="3"/><circle cx="61" cy="39" r="3"/><ellipse cx="50" cy="47" rx="5" ry="3"/></g>'],
  house: ['Домик', '<path d="M23 45h54v40H23Z"/><path d="M12 46 50 15l38 31Z"/><path d="M44 85V63h13v22M30 55h9v11h-9Zm32 0h9v11h-9Z" fill="#fff3d6"/>'],
  mug: ['Чашка', '<path d="M67 41h11a12 12 0 0 1 0 24H67" fill="none" stroke="var(--toy-color)" stroke-width="8"/><path d="M15 33h56v28q0 20-27 20T15 61Z"/><ellipse cx="43" cy="33" rx="28" ry="7" fill="#fff" opacity=".48"/>'],
  square: ['Квадрат', '<rect x="16" y="16" width="68" height="68" rx="3"/>'],
  plate: ['Тарелка', '<circle cx="50" cy="50" r="37"/><circle cx="50" cy="50" r="26" fill="#fff" opacity=".38"/>'],
  bed: ['Кроватка', '<path d="M14 32q9-9 17 0v42H14Zm55 12q9-8 17 0v30H69Z"/><path d="M25 49h49v21H25Z"/><rect x="28" y="46" width="16" height="12" rx="4" fill="#fff4df"/><path d="M15 78h71" fill="none" stroke-width="4"/>'],
  doll: ['Кукла', '<path d="M38 42h24l14 28H24Z"/><path d="M42 70v15m16-15v15" stroke="#76565b" stroke-width="6" fill="none"/><circle cx="50" cy="30" r="18" fill="#ffe5cb"/><path d="M33 28Q29 7 50 9q18 0 19 19Q56 29 51 20q-4 9-18 8Z" fill="#9e694b"/><g fill="#493940" stroke="none"><circle cx="44" cy="32" r="2"/><circle cx="56" cy="32" r="2"/></g>'],
};

const sizeNames = { small: 'маленький размер', middle: 'средний размер', large: 'большой размер' };
export function sensoryName(piece) {
  const prop = props[piece.shape];
  const name = prop ? palette[piece.color].name + ' · ' + prop[0].toLowerCase() : toyName(piece);
  return piece.size ? name + ' · ' + sizeNames[piece.size] : name;
}

export function sensoryArt(piece) {
  const basis = props[piece.shape];
  if (!basis) return toy(piece);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('color-toy');
  svg.style.setProperty('--toy-color', palette[piece.color].paint);
  svg.innerHTML = '<g>' + basis[1] + '</g>';
  return svg;
}
