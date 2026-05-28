(function () {
  const mask = document.createElement('div');
  mask.id = 'page-mask';
  mask.innerHTML = '<img class="pm-logo" src="assets/logo.svg" alt="SIMONN.AE" />';
  document.body.prepend(mask);

  const NAV_KEY = 'navTransition';
  const fromNav = sessionStorage.getItem(NAV_KEY);
  const introShowing = document.getElementById('intro') && !sessionStorage.getItem('introSeen');

  sessionStorage.removeItem(NAV_KEY);

  if (fromNav && !introShowing) {
    /* Vient d'un clic nav : masque couvre l'écran puis remonte */
    mask.style.transition = 'none';
    mask.style.transform = 'translateY(0)';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      mask.style.transition = '';
      mask.style.transform = 'translateY(-100%)';
    }));
  }
  /* Sinon : masque déjà caché via CSS — rien à faire */

  /* Exit — uniquement sur les liens de la navbar */
  document.addEventListener('click', e => {
    const a = e.target.closest('.nav-link');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#')) return;

    e.preventDefault();
    sessionStorage.setItem(NAV_KEY, '1');
    mask.style.transition = 'transform 600ms cubic-bezier(0.76, 0, 0.24, 1)';
    mask.style.transform = 'translateY(0)';
    setTimeout(() => { window.location.href = href; }, 620);
  }, true);
})();

/* ── LOGO ADAPTATIF ── */
(function () {
  const logoImg = document.querySelector('#site-logo img');
  if (!logoImg) return;

  const srcs = {
    white: 'assets/logo-white.svg',
    black: 'assets/logo-black.svg',
    pink:  'assets/logo-pink.svg',
  };
  const active = new Map();

  function update() {
    const color = active.size > 0 ? [...active.values()][0] : 'pink';
    logoImg.src = srcs[color] || srcs.white;
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) active.set(e.target, e.target.dataset.logoColor);
      else active.delete(e.target);
    });
    update();
  }, {
    /* observe uniquement la bande du haut où se trouve le logo */
    rootMargin: '-10px 0px -85% 0px',
    threshold: 0,
  });

  document.querySelectorAll('[data-logo-color]').forEach(el => obs.observe(el));
})();
