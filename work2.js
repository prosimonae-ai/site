/* ── DÉCLARATIONS ── */
const nav       = document.getElementById('nav');
const cursor    = document.getElementById('work-cursor');
const gridEl    = null;
const listEl    = document.getElementById('layout-list');
const thumb     = document.getElementById('wl-thumb');
const thumbI    = document.getElementById('wl-thumb-inner');

/* ── SON HOVER (Web Audio API) ── */
const _ac = new (window.AudioContext || window.webkitAudioContext)();
let _hoverBuf = null;
let _dingBuf = null;

fetch('sound/toc.wav')
  .then(r => r.arrayBuffer())
  .then(buf => _ac.decodeAudioData(buf))
  .then(decoded => { _hoverBuf = decoded; })
  .catch(() => {});

fetch('sound/ding.wav')
  .then(r => r.arrayBuffer())
  .then(buf => _ac.decodeAudioData(buf))
  .then(decoded => { _dingBuf = decoded; })
  .catch(() => {});

function playDing() {
  if (!_dingBuf) return;
  if (_ac.state === 'suspended') _ac.resume();
  const gain = _ac.createGain();
  gain.gain.value = 0.10;
  const src = _ac.createBufferSource();
  src.buffer = _dingBuf;
  src.connect(gain);
  gain.connect(_ac.destination);
  src.start(0);
}

function playHover() {
  if (!_hoverBuf || window._transitioning) return;
  if (_ac.state === 'suspended') _ac.resume();
  const gain = _ac.createGain();
  gain.gain.value = 0.10;
  const src = _ac.createBufferSource();
  src.buffer = _hoverBuf;
  src.connect(gain);
  gain.connect(_ac.destination);
  src.start(0);
}

/* Débloque l'AudioContext sur le premier geste */
document.addEventListener('pointerdown', () => _ac.resume(), { once: true });

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

/* ── MOUSE ── */
document.addEventListener('mousemove', e => {
  tx = e.clientX + 2;
  ty = e.clientY - 2;
  thTX = e.clientX + 32;
  thTY = e.clientY - 130;
});

/* ── NAV SCROLL ── */
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── LISTE : cursor + thumbnail ── */
document.querySelectorAll('.wl-item').forEach(item => {
  item.style.setProperty('--c', item.dataset.color || 'rgba(255,255,255,0.02)');

  item.addEventListener('click', e => {
    e.preventDefault();
    const href = item.getAttribute('href');
    sessionStorage.setItem('dingStart', Date.now());
    playDing();
    if (window.triggerTransition) window.triggerTransition(href, false, false);
    else window.location.href = href;
  });
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

/* ── FILTRES CATÉGORIES ── */
const catsEl = document.getElementById('wp-cats');
if (catsEl) {
  catsEl.addEventListener('click', e => {
    const btn = e.target.closest('.wpc');
    if (!btn) return;

    catsEl.querySelectorAll('.wpc').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const cat = btn.dataset.cat;

    /* Liste */
    document.querySelectorAll('.wl-item').forEach((item, i) => {
      const match = cat === 'all' || item.dataset.cat === cat;
      item.classList.toggle('cat-hidden', !match);
    });

    /* Renuméroter les items visibles */
    let n = 1;
    document.querySelectorAll('.wl-item:not(.cat-hidden) .wl-num').forEach(num => {
      num.textContent = String(n++).padStart(2, '0');
    });
  });
}
