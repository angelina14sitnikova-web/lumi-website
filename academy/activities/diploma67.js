const textColor = '#163255';
const gold = '#ab751f';
const imagePath = 'assets/sensory/lumi-graduate.webp';

function label(ctx, text, x, y, font, color = textColor, width = 1040) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y, width);
}

export function mountDiploma(panel, date, total) {
  const section = document.createElement('section');
  section.className = 'academy-diploma ym-hide-content';
  const heading = document.createElement('h2');
  heading.textContent = 'Диплом выпускника';
  const nameLabel = document.createElement('label');
  nameLabel.textContent = 'Имя на дипломе (по желанию)';
  const input = document.createElement('input');
  input.type = 'text';
  input.maxLength = 60;
  input.autocomplete = 'off';
  input.className = 'ym-disable-keys';
  nameLabel.append(input);
  const canvas = document.createElement('canvas');
  canvas.width = 1440;
  canvas.height = 1018;
  canvas.setAttribute('aria-label', 'Предпросмотр игрового диплома');
  const save = document.createElement('button');
  save.type = 'button';
  save.className = 'academy-button';
  save.textContent = 'Сохранить PNG';
  const print = document.createElement('button');
  print.type = 'button';
  print.className = 'academy-button';
  print.textContent = 'Распечатать';
  const status = document.createElement('p');
  status.setAttribute('role', 'status');
  section.append(heading, nameLabel, canvas, save, print, status);
  panel.append(section);

  const ctx = canvas.getContext('2d');
  const lumi = new Image();
  const dateLabel = date ? new Intl.DateTimeFormat('ru-RU', { dateStyle: 'long' }).format(new Date(date)) : 'Дата завершения не сохранена';
  const draw = () => {
    const paper = ctx.createLinearGradient(0, 0, 1440, 1018);
    paper.addColorStop(0, '#edf5ff');
    paper.addColorStop(.5, '#fff9ed');
    paper.addColorStop(1, '#e5edff');
    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, 1440, 1018);
    ctx.strokeStyle = gold;
    ctx.lineWidth = 6;
    ctx.strokeRect(32, 32, 1376, 954);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(46, 46, 1348, 926);
    ctx.textAlign = 'center';
    label(ctx, 'Академия Луми', 720, 116, 'bold 38px Georgia');
    label(ctx, '☾✦', 914, 115, 'bold 38px Georgia', gold);
    label(ctx, 'Диплом выпускника', 720, 213, 'bold 80px Georgia');
    label(ctx, 'Академия великих математических открытий', 720, 291, 'bold 41px Georgia');
    label(ctx, 'Математика · 6–7 лет', 720, 345, '30px sans-serif');
    if (lumi.naturalWidth) {
      const width = 386 * lumi.naturalWidth / lumi.naturalHeight;
      ctx.drawImage(lumi, 410 - width / 2, 404, width, 386);
    }
    label(ctx, input.value.trim() || 'Юный математический исследователь', 1030, 484, 'bold 52px Georgia', textColor, 510);
    label(ctx, `Завершено ${total} из ${total} уроков`, 1030, 550, '32px sans-serif', textColor, 510);
    label(ctx, dateLabel, 1030, 600, '27px sans-serif', textColor, 510);
    ctx.beginPath();
    ctx.arc(1030, 746, 70, 0, Math.PI * 2);
    ctx.fillStyle = '#f8d779';
    ctx.fill();
    ctx.stroke();
    label(ctx, '★', 1030, 775, '75px sans-serif', gold);
    label(ctx, 'Памятная игровая награда Академии Луми', 720, 926, '25px sans-serif');
  };

  input.addEventListener('input', draw);
  lumi.addEventListener('load', draw);
  lumi.src = imagePath;
  draw();
  save.addEventListener('click', () => {
    canvas.toBlob(blob => {
      if (!blob) {
        status.textContent = 'Не удалось сохранить изображение. Попробуй ещё раз.';
        return;
      }
      const url = URL.createObjectURL(blob);
      const download = document.createElement('a');
      download.href = url;
      download.download = 'lumi-diploma.png';
      download.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 'image/png');
  });
  print.addEventListener('click', () => window.print());
}
