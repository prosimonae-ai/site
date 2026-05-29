/* ── DÉCLARATIONS ── */
const nav       = document.getElementById('nav');
const cursor    = document.getElementById('work-cursor');
const gridEl    = document.getElementById('layout-grid');
const listEl    = document.getElementById('layout-list');
const thumb     = document.getElementById('wl-thumb');
const thumbI    = document.getElementById('wl-thumb-inner');

/* ── SON HOVER (Web Audio API) ── */
const _ac = new (window.AudioContext || window.webkitAudioContext)();
let _hoverBuf = null;

fetch('sound/toc.wav')
  .then(r => r.arrayBuffer())
  .then(buf => _ac.decodeAudioData(buf))
  .then(decoded => { _hoverBuf = decoded; })
  .catch(() => {});

function playHover() {
  if (!_hoverBuf) return;
  if (_ac.state === 'suspended') _ac.resume();
  const src = _ac.createBufferSource();
  src.buffer = _hoverBuf;
  src.connect(_ac.destination);
  src.start(0);
}

/* Débloque l'AudioContext sur le premier geste */
document.addEventListener('pointerdown', () => _ac.resume(), { once: true });

let currentLayout = sessionStorage.getItem('workLayout') || 'grid';

/* Cursor lerp */
let cx = 0, cy = 0, tx = 0, ty = 0;

(function rafLoop() {
  cx += (tx - cx) * 0.1;
  cy += (ty - cy) * 0.1;
  cursor.style.transform = `translate(${cx}px,${cy}px) rotate(-10deg)`;
  requestAnimationFrame(rafLoop);
})();

/* Thumbnail lerp */
let thX = 0, thY = 0, thTX = 0, thTY = 0, thRunning = false;

function thumbRaf() {
  thX += (thTX - thX) * 0.1;
  thY += (thTY - thY) * 0.1;
  thumb.style.left = thX + 'px';
  thumb.style.top  = thY + 'px';
  if (thRunning) requestAnimationFrame(thumbRaf);
}

/* ── LAYOUT TOGGLE ── */
document.querySelectorAll('.wpt').forEach(btn => {
  btn.addEventListener('click', () => {
    const to = btn.dataset.layout;
    if (to === currentLayout) return;

    document.querySelectorAll('.wpt').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    /* Fade out courant */
    const outEl = currentLayout === 'grid' ? gridEl : listEl;
    const inEl  = to === 'grid' ? gridEl : listEl;

    outEl.classList.add('fading');

    setTimeout(() => {
      outEl.classList.remove('fading');
      if (currentLayout === 'grid') {
        gridEl.style.display = 'none';
        listEl.classList.add('active');
      } else {
        listEl.classList.remove('active');
        gridEl.style.display = '';
        cards.forEach((card, i) => {
          if (card.classList.contains('done')) return;
          revealCard(card, i);
        });
      }
      currentLayout = to;
      sessionStorage.setItem('workLayout', to);

      /* Fade in */
      inEl.style.opacity = '0';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        inEl.style.opacity = '';
      }));

      /* Cursor reset */
      cursor.classList.remove('visible');
      thumb.classList.remove('active');
      thRunning = false;
    }, 230);
  });
});

/* ── MOUSE ── */
document.addEventListener('mousemove', e => {
  tx = e.clientX + 2;
  ty = e.clientY - 2;
  thTX = e.clientX + 32;
  thTY = e.clientY - 130;
});

/* ── NAV SCROLL ── */
const tabs = document.querySelector('.wp-tabs');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  if (tabs) {
    const opacity = Math.max(0, 1 - window.scrollY / 120);
    tabs.style.opacity = opacity;
    tabs.style.pointerEvents = opacity < 0.1 ? 'none' : '';
  }
}, { passive: true });

/* ── GRILLE : scroll reveal ── */
const cards = document.querySelectorAll('.wp-card');

function revealCard(card, idx) {
  card.style.setProperty('--tx', idx % 2 === 0 ? '-90px' : '90px');
  card.style.animationDelay = (idx * 120) + 'ms';
  card.classList.add('entering');
  card.addEventListener('animationend', () => {
    card.classList.remove('entering');
    card.classList.add('done');
    card.style.animationDelay = '';
  }, { once: true });
}

const cardObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    revealCard(e.target, [...cards].indexOf(e.target));
    cardObs.unobserve(e.target);
  });
}, { threshold: 0.06 });

cards.forEach(c => cardObs.observe(c));

/* ── GRILLE : cursor label ── */
document.querySelectorAll('.wp-card').forEach(card => {
  card.addEventListener('mouseenter', e => {
    playHover();
    cursor.textContent = card.dataset.title || '';
    cursor.classList.add('visible');
    cx = e.clientX + 2; cy = e.clientY - 2;
  });
  card.addEventListener('mouseleave', () => cursor.classList.remove('visible'));
});

/* ── LISTE : cursor + thumbnail ── */
document.querySelectorAll('.wl-item').forEach(item => {
  item.style.setProperty('--c', item.dataset.color || 'rgba(255,255,255,0.02)');

  item.addEventListener('mouseenter', e => {
    playHover();
    cursor.textContent = 'VOIR';
    cursor.classList.add('visible');
    cx = e.clientX + 2; cy = e.clientY - 2;

    thumbI.style.background =
      `linear-gradient(145deg, #1e1a28 0%, ${item.dataset.color} 55%, #030303 100%)`;
    thTX = e.clientX + 32; thTY = e.clientY - 130;
    thX = thTX; thY = thTY;
    thumb.style.left = thX + 'px';
    thumb.style.top  = thY + 'px';
    thumb.classList.add('active');
    if (!thRunning) { thRunning = true; thumbRaf(); }
  });

  item.addEventListener('mousemove', e => {
    thTX = e.clientX + 32;
    thTY = e.clientY - 130;
  });

  item.addEventListener('mouseleave', () => {
    cursor.classList.remove('visible');
    thumb.classList.remove('active');
    thRunning = false;
  });
});

/* ── RESTORE SAVED LAYOUT ── */
if (currentLayout === 'list') {
  document.querySelectorAll('.wpt').forEach(b => b.classList.remove('active'));
  document.querySelector('.wpt[data-layout="list"]').classList.add('active');
  gridEl.style.display = 'none';
  listEl.classList.add('active');
}
