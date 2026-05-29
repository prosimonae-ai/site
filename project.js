/* ── DONNÉES PROJETS ── */
const PROJECTS = {
  'horizon': {
    title: 'Horizon', num: '01', category: 'Film', year: '2024',
    role: 'Réalisation · Direction artistique',
    client: 'Personnel',
    duration: '12 min',
    vimeoId: '1190241060', vimeoH: 'd64fb1eb74',
    desc: 'Un voyage visuel à travers les paysages du monde. Chaque plan, une invitation à l\'exploration et à la contemplation du monde qui nous entoure.',
    screens: [
      { gradient: 'linear-gradient(135deg,#3d1a64,#1a0d2e,#060310)' },
      { gradient: 'linear-gradient(145deg,#2d1450,#100820)' },
      { gradient: 'linear-gradient(120deg,#4a2280,#1a0d2e)' },
      { gradient: 'linear-gradient(160deg,#080510,#2d1450)' },
      { gradient: 'linear-gradient(130deg,#1a0d2e,#3d1a64)' },
      { gradient: 'linear-gradient(150deg,#100820,#4a2280)' },
    ]
  },
  'nuit-blanche': {
    title: 'Nuit Blanche', num: '02', category: 'Documentaire', year: '2023',
    role: 'Réalisation · Montage',
    client: 'Centre Pompidou',
    duration: '28 min',
    vimeoId: '1190241060', vimeoH: 'd64fb1eb74',
    desc: 'Une nuit entière à suivre des artistes dans leurs ateliers. L\'art dans son état le plus brut, capturé sans filtre ni mise en scène.',
    screens: [
      { gradient: 'linear-gradient(135deg,#2a1848,#0e0818,#020108)' },
      { gradient: 'linear-gradient(145deg,#1a1030,#080510)' },
      { gradient: 'linear-gradient(120deg,#0e0818,#241640)' },
      { gradient: 'linear-gradient(160deg,#030308,#1a1030)' },
      { gradient: 'linear-gradient(130deg,#241640,#0e0818)' },
      { gradient: 'linear-gradient(150deg,#080510,#2a1848)' },
    ]
  },
  'particules': {
    title: 'Particules', num: '03', category: 'Motion Design', year: '2024',
    role: 'Direction artistique · Animation',
    client: 'Personnel',
    duration: '4 min',
    vimeoId: '1190241060', vimeoH: 'd64fb1eb74',
    desc: 'Exploration des structures invisibles qui composent notre monde. Une ode à la science et à la physique racontée par l\'image et le mouvement.',
    screens: [
      { gradient: 'linear-gradient(135deg,#0d2030,#061018,#020508)' },
      { gradient: 'linear-gradient(145deg,#0a1820,#020408)' },
      { gradient: 'linear-gradient(120deg,#061018,#102840)' },
      { gradient: 'linear-gradient(160deg,#020508,#0d2030)' },
      { gradient: 'linear-gradient(130deg,#102840,#061018)' },
      { gradient: 'linear-gradient(150deg,#020408,#0a1820)' },
    ]
  },
  'matiere-brute': {
    title: 'Matière Brute', num: '04', category: 'Photographie', year: '2023',
    role: 'Direction photo · Retouche',
    client: 'Personnel',
    duration: '—',
    vimeoId: '1190241060', vimeoH: 'd64fb1eb74',
    desc: 'La beauté de l\'imparfait. Une série photographique sur les textures et matières naturelles, sublimées par une lumière rasante.',
    screens: [
      { gradient: 'linear-gradient(135deg,#2e2010,#120e08,#050300)' },
      { gradient: 'linear-gradient(145deg,#1c1408,#080604)' },
      { gradient: 'linear-gradient(120deg,#241c10,#3a2c18)' },
      { gradient: 'linear-gradient(160deg,#050300,#1c1408)' },
      { gradient: 'linear-gradient(130deg,#3a2c18,#241c10)' },
      { gradient: 'linear-gradient(150deg,#080604,#2e2010)' },
    ]
  },
  'publication': {
    title: 'Publication', num: '05', category: 'Éditorial', year: '2022',
    role: 'Direction artistique · Mise en page',
    client: 'Revue Nulle Part',
    duration: '—',
    vimeoId: '1190241060', vimeoH: 'd64fb1eb74',
    desc: 'Direction artistique pour une publication culturelle parisienne. Identité visuelle, mise en page et direction photographique sur deux numéros.',
    screens: [
      { gradient: 'linear-gradient(135deg,#1c2410,#0e1208,#040500)' },
      { gradient: 'linear-gradient(145deg,#141c08,#060800)' },
      { gradient: 'linear-gradient(120deg,#0e1208,#2a3818)' },
      { gradient: 'linear-gradient(160deg,#040500,#141c08)' },
      { gradient: 'linear-gradient(130deg,#2a3818,#0e1208)' },
      { gradient: 'linear-gradient(150deg,#060800,#1c2410)' },
    ]
  }
};

/* ── INIT ── */
const PROJECT_ORDER = ['horizon', 'nuit-blanche', 'particules', 'matiere-brute', 'publication'];
const params     = new URLSearchParams(window.location.search);
const currentId  = params.get('id') || 'horizon';
const project    = PROJECTS[currentId] || PROJECTS['horizon'];
const nextId     = PROJECT_ORDER[(PROJECT_ORDER.indexOf(currentId) + 1) % PROJECT_ORDER.length];
const nextProj   = PROJECTS[nextId];

document.title = `${project.title} — SimonnAE`;
document.getElementById('piNum').textContent   = project.num;
document.getElementById('piTitle').textContent = project.title;
document.getElementById('piDesc').textContent  = project.desc;

/* Tags */
const tagsEl = document.getElementById('piTags');
[project.category, project.year].forEach(t => {
  const span = document.createElement('span');
  span.className = 'pi-tag';
  span.textContent = t;
  tagsEl.appendChild(span);
});

/* Détails */
const detailsEl = document.getElementById('piDetails');
[
  { label: 'Rôle',   val: project.role },
  { label: 'Client', val: project.client },
  { label: 'Année',  val: project.year },
  { label: 'Durée',  val: project.duration },
].forEach(({ label, val }) => {
  const div = document.createElement('div');
  div.className = 'pi-detail';
  div.innerHTML = `<span class="pi-detail-label">${label}</span><span class="pi-detail-val">${val}</span>`;
  detailsEl.appendChild(div);
});

/* Iframe */
const iframe = document.getElementById('vimeo');
iframe.src = `https://player.vimeo.com/video/${project.vimeoId}?controls=0&autoplay=0&loop=1&muted=0&title=0&byline=0&portrait=0`;

/* ── NEXT PROJECT SCROLL ── */
document.getElementById('nptTitle').textContent = nextProj.title;

const nptTrigger = document.getElementById('next-proj-trigger');
const nptFill    = document.getElementById('nptFill');
const THRESHOLD  = 1400;
let accumulated  = 0;
let drainRaf     = null;

const projPage = document.getElementById('proj-page');

function applyProgress(pct) {
  nptFill.style.width = Math.min(100, pct * 100) + '%';
  projPage.style.transform = `translateY(${-pct * 60}px)`;
}

function drain() {
  accumulated = Math.max(0, accumulated - 18);
  const pct = accumulated / THRESHOLD;
  applyProgress(pct);
  if (accumulated <= 0) {
    nptTrigger.classList.remove('active');
    projPage.style.transform = '';
  } else {
    drainRaf = requestAnimationFrame(drain);
  }
}

window.addEventListener('wheel', e => {
  const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 6;

  if (drainRaf) { cancelAnimationFrame(drainRaf); drainRaf = null; }

  if (atBottom && e.deltaY > 0) {
    accumulated = Math.min(THRESHOLD, accumulated + e.deltaY * 0.9);
    const pct = accumulated / THRESHOLD;
    applyProgress(pct);
    nptTrigger.classList.add('active');
    if (accumulated >= THRESHOLD) {
      window.location.href = `project.html?id=${nextId}`;
    }
  } else {
    drainRaf = requestAnimationFrame(drain);
  }
}, { passive: true });

/* ── NAV ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── SCROLL REVEALS ── */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.pi-title, .pi-body, .pi-back').forEach(el => obs.observe(el));

/* ── PLAYER VIMEO ── */
(function initPlayer() {
  if (typeof Vimeo === 'undefined') { setTimeout(initPlayer, 80); return; }

  const hit           = document.getElementById('reelHit');
  const playBtn       = document.getElementById('reelPlayBtn');
  const muteBtn       = document.getElementById('reelMuteBtn');
  const progArea      = document.getElementById('reelProgressArea');
  const bar           = document.getElementById('reelBar');
  const played        = document.getElementById('reelPlayed');
  const hoverFill     = document.getElementById('reelHoverFill');
  const dot           = document.getElementById('reelDot');
  const tip           = document.getElementById('reelTip');
  const tipTime       = document.getElementById('reelTipTime');
  const tipImg        = document.getElementById('reelTipImg');
  const poster        = document.getElementById('reelPoster');
  const timeDisp      = document.getElementById('reelTimeDisplay');
  const simpleFill    = document.getElementById('reelSimpleFill');
  const cornerMuteBtn = document.getElementById('cornerMuteBtn');
  const cornerFullBtn = document.getElementById('cornerFullBtn');

  const riPlay  = playBtn.querySelector('.ri-play');
  const riPause = playBtn.querySelector('.ri-pause');
  const riSound = muteBtn.querySelector('.ri-unmuted');
  const riMute  = muteBtn.querySelector('.ri-muted');
  const cRiSound = cornerMuteBtn.querySelector('.ri-unmuted');
  const cRiMute  = cornerMuteBtn.querySelector('.ri-muted');

  const player = new Vimeo.Player(iframe);
  let dur = 0, isPlaying = false, isMuted = true;

  function fmt(s) {
    s = Math.max(0, Math.floor(s));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${project.vimeoId}`)
    .then(r => r.json())
    .then(({ thumbnail_url }) => {
      if (!thumbnail_url) return;
      poster.style.backgroundImage = `url(${thumbnail_url})`;
      tipImg.src = thumbnail_url;
    })
    .catch(() => {});

  player.getDuration().then(d => { dur = d; });

  player.on('timeupdate', ({ seconds }) => {
    const pct = dur > 0 ? seconds / dur * 100 : 0;
    played.style.width     = pct + '%';
    dot.style.left         = pct + '%';
    simpleFill.style.width = pct + '%';
    timeDisp.textContent   = fmt(seconds);
  });

  function setIcon(hide, show) {
    hide.style.opacity = '0'; hide.style.transform = 'scale(0.7)';
    show.style.opacity = '1'; show.style.transform = 'scale(1)';
  }

  const videoCursor = document.getElementById('video-cursor');
  const vcText = videoCursor.querySelector('.vc-text');

  function setPlayState(playing) {
    isPlaying = playing;
    setIcon(playing ? riPlay : riPause, playing ? riPause : riPlay);
    playBtn.classList.toggle('btn-active', playing);
    vcText.classList.add('vc-out');
    vcText.addEventListener('animationend', () => {
      vcText.classList.remove('vc-out');
      vcText.textContent = playing ? 'Pause' : 'Play';
      vcText.classList.add('vc-in');
      vcText.addEventListener('animationend', () => vcText.classList.remove('vc-in'), { once: true });
    }, { once: true });
  }

  function setMuteState(muted) {
    isMuted = muted;
    player.setVolume(muted ? 0 : 1);
    setIcon(muted ? riSound : riMute,   muted ? riMute  : riSound);
    setIcon(muted ? cRiSound : cRiMute, muted ? cRiMute : cRiSound);
    muteBtn.classList.toggle('btn-active', !muted);
    cornerMuteBtn.classList.toggle('btn-active', !muted);
    muteBtn.classList.toggle('mute-hint', muted);
    cornerMuteBtn.classList.toggle('mute-hint', muted);
  }

  player.on('pause', () => setPlayState(false));
  player.on('ended', () => player.setCurrentTime(0).then(() => player.play()));

  /* État initial : son activé */
  isMuted = false;
  player.setVolume(1);
  setIcon(riMute, riSound);
  setIcon(cRiMute, cRiSound);
  muteBtn.classList.add('btn-active');
  cornerMuteBtn.classList.add('btn-active');

  let hasStarted = false;
  const projObs = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting && hasStarted) {
      player.pause();
    }
  }, { threshold: 0.4 });

  player.on('play', () => { hasStarted = true; setPlayState(true); });
  projObs.observe(document.getElementById('proj-reel'));

  /* Curseur vidéo lerp */
  let vcX = 0, vcY = 0, vcTX = 0, vcTY = 0;
  (function vcRaf() {
    vcX += (vcTX - vcX) * 0.1;
    vcY += (vcTY - vcY) * 0.1;
    videoCursor.style.transform = `translate(${vcX}px,${vcY}px) rotate(-10deg)`;
    requestAnimationFrame(vcRaf);
  })();

  hit.addEventListener('mouseenter', e => {
    vcTX = e.clientX + 18; vcTY = e.clientY - 16;
    vcX = vcTX; vcY = vcTY;
    videoCursor.classList.add('visible');
  });
  hit.addEventListener('mouseleave', () => videoCursor.classList.remove('visible'));
  hit.addEventListener('mousemove',  e => { vcTX = e.clientX + 18; vcTY = e.clientY - 16; });
  hit.addEventListener('click', () => isPlaying ? player.pause() : player.play());

  playBtn.addEventListener('click', () => isPlaying ? player.pause() : player.play());
  muteBtn.addEventListener('click', () => setMuteState(!isMuted));
  cornerMuteBtn.addEventListener('click', () => setMuteState(!isMuted));
  cornerFullBtn.addEventListener('click', () => {
    const box = document.querySelector('.reel-video-box');
    if (document.fullscreenElement) document.exitFullscreen();
    else box.requestFullscreen();
  });

  progArea.addEventListener('mousemove', e => {
    const rect = bar.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    hoverFill.style.width = (pct * 100) + '%';
    dot.style.left        = (pct * 100) + '%';
    tip.style.left        = (pct * 100) + '%';
    tipTime.textContent   = fmt(pct * dur);
  });
  progArea.addEventListener('mouseleave', () => { hoverFill.style.width = '0%'; });
  progArea.addEventListener('click', e => {
    const rect = bar.getBoundingClientRect();
    player.setCurrentTime(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * dur);
  });
})();
