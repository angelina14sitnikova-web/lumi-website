const designs = {
  squarePlate:['Квадратная тарелка','<rect x="17" y="17" width="66" height="66" rx="6"/><rect x="25" y="25" width="50" height="50" rx="4" fill="#fff6e4" opacity=".5"/>'],
  longPlate:['Вытянутая тарелка','<rect x="12" y="27" width="76" height="46" rx="7"/><rect x="19" y="34" width="62" height="32" rx="5" fill="#fff6e4" opacity=".5"/>'],
  badge:['Круглый значок','<circle cx="50" cy="50" r="34"/><circle cx="50" cy="50" r="28" fill="none" stroke="#fff8df"/><path d="m50 29 6 13 15 2-11 10 3 15-13-7-13 7 3-15-11-10 15-2Z" fill="#fff3bb"/>'],
  squareFrame:['Квадратная рамка','<path d="M16 16H84V84H16Z M27 27V73H73V27Z" fill-rule="evenodd"/>'],
  roundFrame:['Круглая рамка','<circle cx="50" cy="50" r="31" fill="none" stroke="var(--toy-color)" stroke-width="11"/>'],
  flag:['Треугольный флажок','<path d="M22 22v62" fill="none" stroke-width="4"/><path d="M24 23H82L24 62Z"/>'],
  squareFlag:['Квадратный флажок','<path d="M22 22v62" fill="none" stroke-width="4"/><rect x="24" y="23" width="42" height="42"/>'],
  houseTriangle:['Домик с треугольной крышей','<path d="M25 48h50v36H25Z" fill="#fff0d5"/><path d="M12 48 50 14 88 48Z"/><path d="M42 83V61H58V83" fill="none"/>'],
  berry:['Ягода','<path d="M50 29C30 17 18 29 21 48c3 17 21 36 29 36S76 65 79 48c3-19-9-31-29-19Z"/><path d="m49 29-16-7 8 14 9-5 9 5 8-14Z" fill="#539260"/><path d="M37 47h1m24 0h1m-13 11h1m-2 12h1" stroke="#fff0d9" stroke-width="3"/>'],
  carrot:['Морковь','<path d="M40 37C11 52 29 59 71 83 65 40 62 26 40 37Z" fill="#e89549"/><path d="m37 41-20-9 17 1-11-14 17 12 3-14 6 21Z" fill="#67a653"/>'],
  bunny:['Зайчик','<ellipse cx="37" cy="28" rx="8" ry="20"/><ellipse cx="63" cy="28" rx="8" ry="20"/><ellipse cx="50" cy="58" rx="27" ry="24"/><circle cx="40" cy="56" r="2.5" fill="#493341"/><circle cx="60" cy="56" r="2.5" fill="#493341"/><path d="m46 63 4 4 4-4Z" fill="#d786a5"/>'],
  vase:['Ваза','<path d="M35 26H65L61 45C84 71 66 85 50 85S16 71 39 45Z"/><path d="M34 53q16 10 32 0" fill="none" stroke="#faf1ec"/>'],
  sphere:['Шар','<ellipse cx="50" cy="83" rx="33" ry="6" fill="#544162" opacity=".2" stroke="none"/><circle cx="50" cy="47" r="34"/><path d="M23 54C35 73 59 75 76 64A34 34 0 0 1 23 54Z" fill="#373048" opacity=".24" stroke="none"/><ellipse cx="38" cy="32" rx="12" ry="8" fill="white" opacity=".59" stroke="none"/><path d="M30 69Q53 65 69 33" fill="none" stroke="white" opacity=".52" stroke-width="3"/>'],
  cube:['Куб','<path d="M16 28 40 14H84V67L61 85H16Z"/><path d="M16 28 40 14H84L61 28Z" fill="white" opacity=".45"/><path d="M61 28 84 14V67L61 85Z" fill="#381e57" opacity=".28"/>'],
  sphereBasket:['Корзина с меткой шара','<path d="M25 44a25 23 0 0 1 50 0M14 44h72L75 85H25Z" fill="#f1c78b"/><circle cx="50" cy="61" r="13"/><circle cx="46" cy="57" r="4" fill="white" opacity=".7"/>'],
};
export const worldDesign = shape => designs[shape];
