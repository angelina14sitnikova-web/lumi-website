import { palette } from './colors-model.js';

const shapes = {
  balloon: ['Воздушный шарик', '<path d="M48 68 C42 80 62 84 49 95" fill="none" stroke="#675376" stroke-width="2"/><path d="M50 9C22 9 14 32 26 53c6 10 14 15 21 17l-4 6h14l-4-6c7-2 15-7 21-17C86 32 78 9 50 9Z"/>'],
  ball: ['Мяч', '<circle cx="50" cy="50" r="35"/><path d="M26 36Q49 47 74 31M30 77Q54 63 69 78" fill="none" stroke="white" opacity=".28"/>'],
  apple: ['Яблоко', '<path d="M50 34q-9-14 1-23" fill="none" stroke="#724826" stroke-width="6"/><path d="M51 26Q57 9 75 14Q70 30 51 26" fill="#41794a"/><path d="M50 32C16 11 9 62 32 83c8 8 13 1 18 1s10 7 18-1C91 62 84 11 50 32Z"/>'],
  car: ['Машинка', '<path d="M10 56q0-9 12-10l12-19h33l13 18q12 1 12 11v15H10Z"/><path d="M36 32h13v14H28Zm18 0h10l10 14H54Z" fill="#eaf9ff"/><circle cx="28" cy="73" r="10" fill="#42364c"/><circle cx="73" cy="73" r="10" fill="#42364c"/><circle cx="28" cy="73" r="4" fill="#dccfe4"/><circle cx="73" cy="73" r="4" fill="#dccfe4"/>'],
  flower: ['Цветок', '<path d="M50 56v31m0-11q17-13 26-11Q63 78 50 80" fill="none" stroke="#41794a" stroke-width="5"/><path d="M50 26C36 1 18 21 29 36C2 40 13 65 33 56C30 81 54 83 58 60C76 76 94 54 73 43C92 23 63 11 50 26Z"/><circle cx="50" cy="44" r="9" fill="#643f54" opacity=".72"/>'],
  block: ['Кубик', '<path d="M16 28 39 14h45v55L63 85H16Z"/><path d="M16 28 39 14h45L63 28Z" fill="white" opacity=".32"/><path d="M63 28 84 14v55L63 85Z" fill="#262037" opacity=".23"/>'],
  sun: ['Солнышко', '<path d="M50 9v11m0 60v11M9 50h11m60 0h11M21 21l8 8m42 42 8 8M79 21l-8 8M29 71l-8 8" fill="none" stroke="var(--toy-color)" stroke-width="6"/><circle cx="50" cy="50" r="25"/>'],
  lemon: ['Лимон', `
    <path d="M76 33q3-10 10-14" fill="none" stroke="#76563a" stroke-width="3.5"/>
    <path d="M79 27q-12-1-17-15 16-3 21 10Z" fill="#4b8754" stroke="#2d5c41"/>
    <path d="M15 50C25 29 58 19 76 33q7 5 10 5c6 0 8 5 3 9-4 3-3 9-7 15C69 82 39 89 21 75q-5-4-9-5c-6-1-7-7-2-10q2-2 5-10Z"/>
    <path d="M23 49q10-13 28-16" fill="none" stroke="white" stroke-width="5" opacity=".48"/>
    <path d="M69 61h.1m-9 8h.1m12-1h.1" fill="none" stroke-width="2.8" opacity=".45"/>
  `],
  star: ['Звёздочка', '<path d="m50 12 12 24 27 4-19 19 4 27-24-13-24 13 4-27L11 40l27-4Z"/>'],
  boat: ['Лодочка', '<path d="M49 13v53" fill="none" stroke="#705479" stroke-width="4"/><path d="M43 16 16 55h27Zm13 6 22 33H56ZM10 63h80L75 82H24Z"/>'],
  leaf: ['Листочек', '<path d="M17 78C11 46 27 20 85 15 80 71 52 89 17 78Z"/><path d="M15 87 67 32m-35 39 22-2m-14-6 1-17" fill="none" stroke="white" opacity=".55" stroke-width="3"/>'],
  frog: ['Лягушка', `
    <path d="M34 77C11 61 9 83 22 87l15 2h26l15-2c13-4 11-26-12-10Z"/>
    <path d="M31 77q0-14 19-16 19 2 19 16l-6 12H37Z" stroke="none"/>
    <ellipse cx="50" cy="76" rx="15" ry="10" fill="white" opacity=".27" stroke="none"/>
    <path d="M19 40a15 15 0 0 1 28-8h6a15 15 0 0 1 28 8c0 5 4 8 4 15 0 14-15 19-35 19s-35-5-35-19c0-7 4-10 4-15Z"/>
    <circle cx="33" cy="40" r="9" fill="#fffdf2" stroke="none"/>
    <circle cx="67" cy="40" r="9" fill="#fffdf2" stroke="none"/>
    <circle cx="34" cy="41" r="4.6" fill="#252337" stroke="none"/>
    <circle cx="66" cy="41" r="4.6" fill="#252337" stroke="none"/>
    <path d="M40 57q10 12 20 0" fill="none" stroke="#20392b" stroke-width="2.8"/>
    <path d="M36 77v7m28-7v7" fill="none"/>
    <path d="M24 88h16m20 0h16" fill="none" stroke-width="3.2"/>
  `],
  paper: ['Лист бумаги', '<path d="M24 12h37l15 15v61H24Z"/><path d="M61 12v15h15" fill="#e5dfec"/>'],
  cat: ['Котёнок', '<path d="M67 77q19 4 18-16" fill="none" stroke="var(--toy-color)" stroke-width="7"/><path d="M22 37 20 14l20 15h20l20-15-2 24C94 63 76 67 67 69l6 14H27l6-14C20 67 7 57 22 37Z"/><circle cx="37" cy="48" r="4" fill="#b08099"/><circle cx="63" cy="48" r="4" fill="#b08099"/><path d="m46 55 4 4 4-4Z" fill="#d687a3"/>'],
  circle: ['Круг', '<circle cx="50" cy="50" r="34"/>'],
  triangle: ['Треугольник', '<path d="M50 14 89 83H11Z"/>'],
  pebble: ['Камешек', '<path d="M18 41C27 22 52 21 67 29S91 55 81 70c-8 12-48 11-61 4q-16-8-2-33Z"/>'],
};

export function toyName(piece) {
  return palette[piece.color].name + ' — ' + shapes[piece.shape][0].toLowerCase();
}

export function toy(piece) {
  const image = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  image.setAttribute('viewBox', '0 0 100 100');
  image.setAttribute('aria-hidden', 'true');
  image.classList.add('color-toy');
  image.style.setProperty('--toy-color', palette[piece.color].paint);
  image.innerHTML = '<g>' + shapes[piece.shape][1] + '</g>';
  return image;
}
