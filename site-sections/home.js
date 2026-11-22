(() => {
  const header = document.querySelector('.home-header');
  const toggle = header.querySelector('.home-menu-toggle');
  const navigation = document.getElementById('home-navigation');
  const narrow = window.matchMedia('(max-width: 740px)');

  function updateMenu(open) {
    const expanded = narrow.matches && open;
    navigation.hidden = narrow.matches && !expanded;
    toggle.setAttribute('aria-expanded', String(expanded));
  }

  function menuIsOpen() {
    return toggle.getAttribute('aria-expanded') === 'true';
  }

  function syncWidth() {
    const wasInMenu = navigation.contains(document.activeElement);
    updateMenu(false);
    if (narrow.matches && wasInMenu) toggle.focus();
  }

  header.classList.add('has-menu');
  toggle.hidden = false;
  syncWidth();

  narrow.addEventListener('change', syncWidth);
  toggle.addEventListener('click', () => updateMenu(!menuIsOpen()));
  navigation.addEventListener('click', event => {
    if (event.target.closest('a') && menuIsOpen()) updateMenu(false);
  });
  document.addEventListener('click', event => {
    if (menuIsOpen() && !header.contains(event.target)) updateMenu(false);
  });
  document.addEventListener('focusin', event => {
    if (menuIsOpen() && !header.contains(event.target)) updateMenu(false);
  });
  header.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !menuIsOpen()) return;
    event.preventDefault();
    updateMenu(false);
    toggle.focus();
  });

  function updateScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }

  updateScroll();
  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('pageshow', updateScroll);
})();
