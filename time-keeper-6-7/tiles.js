(function () {
  'use strict';

  function shuffle(items, answer = items) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    if (same(result.filter(item => answer.includes(item)), answer)) {
      const first = result.indexOf(answer[0]);
      const second = result.indexOf(answer[1]);
      [result[first], result[second]] = [result[second], result[first]];
    }
    return result;
  }

  function same(a, b) {
    return a.length === b.length && a.every((item, index) => item === b[index]);
  }

  function move(slots, item, target) {
    const result = [...slots];
    const source = result.indexOf(item);
    if (source === target) return result;
    if (source >= 0) result[source] = target >= 0 ? result[target] : null;
    if (target >= 0) result[target] = item;
    return result;
  }

  function bind(board, drop) {
    let drag = null;
    let suppressClick = false;
    let scrollFrame = 0;

    function autoScroll() {
      scrollFrame = 0;
      if (!drag?.ghost) return;
      const margin = Math.min(68, window.innerHeight / 6);
      const speed = drag.y < margin ? (drag.y - margin) / 5 :
        drag.y > window.innerHeight - margin ? (drag.y + margin - window.innerHeight) / 5 : 0;
      if (speed) {
        window.scrollBy(0, Math.max(-18, Math.min(18, speed)));
        scrollFrame = requestAnimationFrame(autoScroll);
      }
    }

    board.addEventListener('pointerdown', event => {
      const source = event.target.closest('[data-drag]');
      if (drag || !source || source.disabled || event.isPrimary === false || event.button !== 0) return;
      drag = {pointer: event.pointerId, source, startX: event.clientX, startY: event.clientY, ghost: null};
      try { source.setPointerCapture?.(event.pointerId); } catch { /* Tap remains available. */ }
    });

    board.addEventListener('pointermove', event => {
      if (!drag || event.pointerId !== drag.pointer) return;
      if (!drag.ghost && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 8) return;
      if (!drag.ghost) {
        const ghost = drag.source.cloneNode(true);
        ghost.removeAttribute('data-drag');
        ghost.classList.add('drag-ghost');
        ghost.tabIndex = -1;
        ghost.setAttribute('aria-hidden', 'true');
        ghost.style.inlineSize = Math.min(drag.source.getBoundingClientRect().width, 170) + 'px';
        document.body.append(ghost);
        drag.ghost = ghost;
      }
      drag.y = event.clientY;
      drag.ghost.style.transform = 'translate(' + event.clientX + 'px,' + event.clientY + 'px) translate(-50%,-50%)';
      if (!scrollFrame) scrollFrame = requestAnimationFrame(autoScroll);
    });

    function finish(event, cancelled) {
      if (!drag || event.pointerId !== drag.pointer) return;
      const {ghost, source} = drag;
      drag = null;
      if (!ghost) return;
      ghost.remove();
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      scrollFrame = 0;
      suppressClick = true;
      setTimeout(() => { suppressClick = false; }, 0);
      const target = !cancelled && document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-drop]');
      if (target && board.contains(target)) drop(source.dataset.drag, Number(target.dataset.drop));
    }

    board.addEventListener('pointerup', event => finish(event, false));
    board.addEventListener('pointercancel', event => finish(event, true));
    board.addEventListener('click', event => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
  }

  window.TimeTiles = Object.freeze({shuffle, same, move, bind});
})();
