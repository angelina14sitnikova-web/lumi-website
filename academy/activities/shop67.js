export function shopPractice({goal, products}, feedback, complete) {
  const field = document.createElement('div');
  field.className = 'math67-clock-play';
  const shelf = document.createElement('div');
  shelf.className = 'sensory-row';
  const total = document.createElement('output');
  const selected = new Set();
  const price = () => [...selected].reduce((sum, index) => sum + products[index][1], 0);
  const update = () => { total.textContent = `В корзине на ${price()} из ${goal} монет`; };
  function button(label, parent) {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'academy-button';
    el.textContent = label;
    parent.append(el);
    return el;
  }
  const goods = products.map(([name, cost], index) => {
    const control = button(`${name} · ${cost} мон.`, shelf);
    control.setAttribute('aria-pressed','false');
    control.onclick = () => {
      if (selected.has(index)) selected.delete(index);
      else if (price() + cost <= 10) selected.add(index);
      else {
        feedback.textContent = 'В кошельке всего десять монет. Убери один товар и попробуй снова.';
        feedback.dataset.state = 'retry';
      }
      control.setAttribute('aria-pressed',String(selected.has(index)));
      update();
    };
    return control;
  });
  field.append(shelf,total);
  const check = button('Оплатить корзину',field);
  check.onclick = () => {
    if (price() !== goal) {
      feedback.dataset.state = 'retry';
      feedback.textContent = 'Сравни стоимость корзины с заданной суммой.';
      return;
    }
    [...goods,check].forEach(control => control.disabled = true);
    complete();
  };
  update();
  return field;
}
