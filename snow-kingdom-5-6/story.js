(function () {
  'use strict';

  const ordered = [1, 2, 3, 4];

  function shuffled() {
    const cards = [...ordered];
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    if (solved(cards)) [cards[0], cards[1]] = [cards[1], cards[0]];
    return cards;
  }

  function solved(slots) {
    return ordered.every((id, index) => slots[index] === id);
  }

  function move(slots, id, target) {
    const result = [...slots];
    const source = result.indexOf(id);
    if (source === target) return result;
    if (source >= 0) result[source] = target >= 0 ? result[target] : null;
    if (target >= 0) result[target] = id;
    return result;
  }

  function bind(board, onDrop) {
    let gesture = null;
    let suppressClick = false;
    let scrollFrame = 0;
    const hit = (x, y) => document.elementFromPoint(x, y)?.closest('[data-story-drop]');

    board.addEventListener('pointerdown', event => {
      const card = event.target.closest('[data-story-card]');
      if (!card || !event.isPrimary || event.button !== 0) return;
      gesture = { id: event.pointerId, card, x: event.clientX, y: event.clientY, ghost: null };
      card.setPointerCapture?.(event.pointerId);
    });

    function scrollAtEdge() {
      scrollFrame = 0;
      if (!gesture?.ghost) return;
      const margin = Math.min(75, window.innerHeight / 5);
      const y = gesture.currentY;
      const speed = y < margin ? (y - margin) / 5 :
        y > window.innerHeight - margin ? (y - window.innerHeight + margin) / 5 : 0;
      if (speed) {
        window.scrollBy(0, Math.max(-18, Math.min(18, speed)));
        scrollFrame = requestAnimationFrame(scrollAtEdge);
      }
    }

    board.addEventListener('pointermove', event => {
      if (!gesture || event.pointerId !== gesture.id) return;
      if (!gesture.ghost && Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) < 9) return;
      if (!gesture.ghost) {
        const ghost = gesture.card.querySelector('img').cloneNode();
        ghost.alt = '';
        ghost.className = 'story-ghost';
        document.body.append(ghost);
        gesture.ghost = ghost;
      }
      gesture.ghost.style.transform = 'translate(' + event.clientX + 'px,' + event.clientY + 'px) translate(-50%,-50%)';
      gesture.currentY = event.clientY;
      if (!scrollFrame) scrollFrame = requestAnimationFrame(scrollAtEdge);
    });

    function finish(event, cancelled) {
      if (!gesture || event.pointerId !== gesture.id) return;
      const { card, ghost } = gesture;
      gesture = null;
      if (!ghost) return;
      ghost.remove();
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      scrollFrame = 0;
      suppressClick = true;
      setTimeout(() => { suppressClick = false; }, 0);
      const target = !cancelled && hit(event.clientX, event.clientY);
      if (target && board.contains(target)) onDrop(Number(card.dataset.storyCard), Number(target.dataset.storyDrop));
    }
    board.addEventListener('pointerup', event => finish(event, false));
    board.addEventListener('pointercancel', event => finish(event, true));
    board.addEventListener('click', event => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
  }

  window.SnowStory = Object.freeze({ shuffled, solved, move, bind });
})();
