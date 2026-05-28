(function () {
  const mask = document.createElement('div');
  mask.id = 'page-mask';
  mask.innerHTML = '<img class="pm-logo" src="assets/name-pink.svg" alt="SIMONN.AE" />';
  document.body.prepend(mask);

  const NAV_KEY = 'navTransition';
  const fromNav = sessionStorage.getItem(NAV_KEY);
  const introShowing = document.getElementById('intro') && !sessionStorage.getItem('introSeen_v2');

  sessionStorage.removeItem(NAV_KEY);

  const pmLogo = mask.querySelector('.pm-logo');

  if (fromNav && !introShowing) {
    /* Vient d'un clic nav : masque couvre l'écran puis remonte */
    mask.style.transition = 'none';
    mask.style.transform = 'translateY(0)';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      mask.style.transition = '';
      mask.style.transform = 'translateY(-100%)';
      /* Fondu sortant du nom pour éviter le flash de rendu */
      if (pmLogo) {
        pmLogo.style.transition = 'opacity 300ms 200ms';
        pmLogo.style.opacity = '0';
      }
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
    /* Fondu entrant du nom */
    if (pmLogo) { pmLogo.style.opacity = '0'; pmLogo.style.transition = 'opacity 300ms 100ms'; }
    mask.style.transition = 'transform 750ms cubic-bezier(0.76, 0, 0.24, 1)';
    mask.style.transform = 'translateY(0)';
    if (pmLogo) setTimeout(() => { pmLogo.style.opacity = '1'; }, 100);
    setTimeout(() => { window.location.href = href; }, 770);
  }, true);
})();

/* ── POINT NAV GLISSANT ── */
(function () {
  const navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;

  const dot = document.createElement('span');
  dot.className = 'nav-indicator';
  navLinks.appendChild(dot);

  const activeLink = navLinks.querySelector('.nav-link.active');

  function moveTo(el) {
    const navRect = navLinks.getBoundingClientRect();
    const elRect  = el.getBoundingClientRect();
    dot.style.left    = (elRect.left - navRect.left + elRect.width / 2 - 2.5) + 'px';
    dot.style.opacity = '1';
  }

  if (activeLink) {
    dot.style.transition = 'none';
    requestAnimationFrame(() => {
      moveTo(activeLink);
      requestAnimationFrame(() => { dot.style.transition = ''; });
    });
  }

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mouseenter', () => moveTo(link));
    link.addEventListener('mouseleave', () => {
      if (activeLink) moveTo(activeLink);
      else dot.style.opacity = '0';
    });
  });
})();

/* ── BOTTOM NAV MOBILE ── */
(function () {
  const navLinks = document.querySelector('#nav .nav-links');
  if (!navLinks) return;

  const bottomNav = document.createElement('nav');
  bottomNav.id = 'bottom-nav';

  const linksWrap = document.createElement('div');
  linksWrap.className = 'nav-links';
  linksWrap.innerHTML = navLinks.innerHTML;
  bottomNav.appendChild(linksWrap);
  document.body.appendChild(bottomNav);

  /* Reprend la logique du point glissant pour la bottom nav */
  const dot = document.createElement('span');
  dot.className = 'nav-indicator';
  linksWrap.appendChild(dot);

  const activeLink = linksWrap.querySelector('.nav-link.active');

  function moveTo(el) {
    const rect    = linksWrap.getBoundingClientRect();
    const elRect  = el.getBoundingClientRect();
    dot.style.left    = (elRect.left - rect.left + elRect.width / 2 - 2.5) + 'px';
    dot.style.opacity = '1';
  }

  if (activeLink) {
    dot.style.transition = 'none';
    requestAnimationFrame(() => {
      moveTo(activeLink);
      requestAnimationFrame(() => { dot.style.transition = ''; });
    });
  }

  linksWrap.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mouseenter', () => moveTo(link));
    link.addEventListener('mouseleave', () => {
      if (activeLink) moveTo(activeLink);
      else dot.style.opacity = '0';
    });
  });
})();

/* ── LOGO MASCOTTE ── */
(function () {
  const link = document.getElementById('site-logo');
  if (!link) return;

  const BODY = 'M1093.05,491.52c-6.93,66.79-7.03,142.81-53.13,196.89-45.44,50.04-125.97,47.77-183.83,21.25-52.04-25.18-88.18-72.78-121.49-118.15-20.15-26.98-40.21-54.14-62.21-79.66-17.6-19.07-20.78,4.14-20.9,20.35-.88,16.96-1.62,34.1-3.67,50.85-4.48,31.12-11.23,64.47-32.51,88.78-36.98,40.33-100.31,37.69-149.12,23.41-51.53-14.87-87.02-56.34-115.9-98.87-15.56-22.38-31.16-45.38-46.53-67.97-10.14-12.67-33.16-64.53-38.19-20.84-9.87,58.51-11.3,133.35-67.81,168.01-42.77,22.91-104.74,22.46-144.77-6.19C3.53,632.69,6.56,564.79,1.71,509.73c-4.25-101.87-.7-204.53,12.2-305.59C27.38,88.27,58.74-18.93,201.77,2.83c58.6,10.85,94.71,62.46,121.36,111.08,31.61,55.22,57.75,112.95,87.18,169.23,35.61,72.72,19.8-20.79,20.06-45.52.5-42.23-.46-86.57,8.02-127.81C463.48,7.15,575.79-24,664.65,22.2c37.83,20.54,62.75,56.84,83.93,92.96,11.43,18.89,23.3,38.97,34.66,58.35,6.39,8.3,23.24,47.62,33.62,28.62,7.46-21.74,8.47-46.16,15.23-68.22,12.69-48.7,38.31-100.08,87.62-120.4,51.29-20.38,119.18-7.65,148.45,41.8,26.26,45.97,26.22,101.06,30.12,152.37,3.88,94.34,2.69,189.38-5.19,283.7Z';

  link.innerHTML = `<svg id="logo-nav-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1100.41 728.19" aria-label="SIMONN.AE">
    <defs>
      <linearGradient id="logo-nav-g" x1="541.93" y1="-108.16" x2="541.93" y2="596.65" gradientTransform="translate(16.1 100.45) rotate(1.72) scale(1 .99) skewX(.02)" gradientUnits="userSpaceOnUse">
        <stop offset=".35" stop-color="#fb5089"/>
        <stop offset="1" stop-color="#dc2e61"/>
      </linearGradient>

      <!-- Filtre B : liquid wobble (feTurbulence + feDisplacementMap) -->
      <filter id="logo-f-wobble" x="-25%" y="-25%" width="150%" height="150%">
        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="5" result="noise">
          <animate id="wobble-turb" attributeName="baseFrequency"
                   values="0.02;0.065;0.03;0.02" dur="0.75s"
                   begin="indefinite" repeatCount="1" calcMode="spline"
                   keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1"/>
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="noise" xChannelSelector="R" yChannelSelector="G" scale="0">
          <animate attributeName="scale" values="0;26;10;0" dur="0.75s"
                   begin="wobble-turb.begin" repeatCount="1" calcMode="spline"
                   keySplines="0.4 0 0.2 1;0.4 0 0.6 1;0.4 0 0.2 1"/>
        </feDisplacementMap>
      </filter>

      <!-- Filtre C : glow inflate (feGaussianBlur rose) -->
      <filter id="logo-f-glow" x="-35%" y="-35%" width="170%" height="170%">
        <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="0">
          <animate id="glow-blur" attributeName="stdDeviation"
                   values="0;10;6;2;0" dur="0.85s"
                   begin="indefinite" repeatCount="1" calcMode="spline"
                   keySplines="0.2 0 0.4 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.2 1"/>
        </feGaussianBlur>
        <feColorMatrix in="blur" type="matrix"
          values="1 0 0 0 1  0 0.29 0 0 0.54  0 0 0 0 0.54  0 0 0 2 0" result="glow"/>
        <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>

      <!-- Filtre D : chromatic aberration glitch (feOffset + hue) -->
      <filter id="logo-f-glitch" x="-15%" y="-15%" width="130%" height="130%">
        <feOffset in="SourceGraphic" result="shifted" dx="0" dy="0">
          <animate id="glitch-off" attributeName="dx"
                   values="0;5;-5;4;-3;2;0" dur="0.45s"
                   begin="indefinite" repeatCount="1" calcMode="discrete"/>
        </feOffset>
        <feColorMatrix in="shifted" type="hueRotate" values="0" result="hued">
          <animate attributeName="values"
                   values="0;160;-120;80;-40;0" dur="0.45s"
                   begin="glitch-off.begin" repeatCount="1" calcMode="discrete"/>
        </feColorMatrix>
        <feMerge>
          <feMergeNode in="SourceGraphic"/>
          <feMergeNode in="hued"/>
        </feMerge>
      </filter>
    </defs>

    <path id="logo-nav-body" fill="url(#logo-nav-g)" d="${BODY}"/>
    <circle id="logo-nav-eye1" fill="#141414" cx="829.44" cy="333.83" r="20.97"/>
    <circle id="logo-nav-eye2" fill="#141414" cx="889.64" cy="331.62" r="20.97"/>
  </svg>`;

  const svg      = document.getElementById('logo-nav-svg');
  const eye1     = document.getElementById('logo-nav-eye1');
  const eye2     = document.getElementById('logo-nav-eye2');
  const wobbleFn = svg.querySelector('#wobble-turb');
  const glowFn   = svg.querySelector('#glow-blur');
  const glitchFn = svg.querySelector('#glitch-off');

  let hovered  = false;
  let lastAnim = null;

  /* Durées et configs par animation */
  const ANIMS = {
    a: { dur: '0.68s', ease: 'cubic-bezier(0.34,1.56,0.64,1)', eyeDelay: ['0.08s','0.15s'] },
    b: { dur: '0.75s', ease: 'cubic-bezier(0.25,1,0.5,1)',     eyeDelay: ['0.05s','0.12s'] },
    c: { dur: '0.85s', ease: 'cubic-bezier(0.25,1,0.5,1)',     eyeDelay: ['0.1s', '0.18s'] },
    d: { dur: '0.48s', ease: 'linear',                          eyeDelay: ['0.02s','0.06s'] },
  };

  function pickAnim() {
    const keys = Object.keys(ANIMS).filter(k => k !== lastAnim);
    return keys[Math.floor(Math.random() * keys.length)];
  }

  function resetSvg() {
    svg.style.filter     = '';
    svg.style.animation  = 'none';
    svg.style.transition = '';
    svg.style.transform  = '';
    eye1.style.animation = '';
    eye2.style.animation = '';
    void svg.offsetWidth;
  }

  link.addEventListener('mouseenter', () => {
    hovered = true;
    const id = pickAnim();
    lastAnim = id;
    const { dur, ease, eyeDelay } = ANIMS[id];

    /* Réinitialise proprement */
    svg.style.transition = '';
    svg.style.transform  = '';
    svg.style.filter     = '';

    /* Déclenche l'animation SVG native si besoin */
    if (id === 'b' && wobbleFn) wobbleFn.beginElement();
    if (id === 'c' && glowFn)   glowFn.beginElement();
    if (id === 'd' && glitchFn) glitchFn.beginElement();

    svg.style.animation  = `mascot-${id}-svg ${dur} ${ease} forwards`;
    eye1.style.animation = `mascot-${id}-eye 0.52s ${ease} ${eyeDelay[0]} both`;
    eye2.style.animation = `mascot-${id}-eye 0.52s ${ease} ${eyeDelay[1]} both`;
  });

  link.addEventListener('mouseleave', () => {
    hovered = false;
    eye1.style.animation = '';
    eye2.style.animation = '';

    /* Capture position courante et transition vers scale(1) */
    const cur = getComputedStyle(svg).transform;
    svg.style.animation = 'none';
    svg.style.filter    = '';
    svg.style.transform = cur;
    void svg.offsetWidth;
    svg.style.transition = 'transform 460ms cubic-bezier(0.25,1,0.5,1)';
    svg.style.transform  = 'scale(1)';

    svg.addEventListener('transitionend', () => {
      if (hovered) return;
      resetSvg();
      svg.style.animation = 'logo-idle 3.8s ease-in-out infinite';
    }, { once: true });
  });
})();

