/* ── INTRO ── */
const intro    = document.getElementById('intro');
const enterBtn = document.getElementById('enterBtn');
const site     = document.getElementById('site');

function skipIntro() {
  intro.style.display = 'none';
  site.classList.add('visible');
  document.body.classList.remove('no-scroll');
}

if (sessionStorage.getItem('introSeen')) {
  skipIntro();
} else {
  enterBtn.addEventListener('click', () => {
    sessionStorage.setItem('introSeen', '1');
    intro.classList.add('leaving');
    setTimeout(() => {
      site.classList.add('visible');
      document.body.classList.remove('no-scroll');
    }, 600);
    setTimeout(() => {
      intro.style.display = 'none';
    }, 1200);
  });
}

/* ── SCROLL PROGRESS + NAV + HERO FADE ── */
const scrollBar   = document.getElementById('scroll-bar');
const nav         = document.getElementById('nav');
const heroContent = document.getElementById('heroContent');

let updateScrollVolume = () => {};

window.addEventListener('scroll', () => {
  const s = window.scrollY;
  nav.classList.toggle('scrolled', s > 40);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  scrollBar.style.width = (max > 0 ? (s / max) * 100 : 0) + '%';
  updateScrollVolume();

  /* Texte héro — parallax léger au scroll */
  if (heroContent) {
    heroContent.style.transform = `translateY(${-s * 0.3}px)`;
    heroContent.style.opacity   = Math.max(0, 1 - s / (window.innerHeight * 0.5));
  }
}, { passive: true });


/* ── WORK BG REVEAL + THUMBNAIL ── */
const workBg     = document.getElementById('work-bg');
const thumb      = document.getElementById('work-thumb');
const thumbInner = document.getElementById('work-thumb-inner');
const thumbLabel = document.getElementById('work-thumb-label');

let thumbTX = 0, thumbTY = 0, thumbCX = 0, thumbCY = 0;
let thumbRunning = false;

function thumbRaf() {
  thumbCX += (thumbTX - thumbCX) * 0.1;
  thumbCY += (thumbTY - thumbCY) * 0.1;
  thumb.style.left = thumbCX + 'px';
  thumb.style.top  = thumbCY + 'px';
  if (thumbRunning) requestAnimationFrame(thumbRaf);
}

document.querySelectorAll('.wi').forEach(item => {
  item.addEventListener('mouseenter', () => {
    const color = item.dataset.color || '#111';
    workBg.style.backgroundColor = color;
    workBg.style.opacity = '1';

    thumbInner.style.background =
      `linear-gradient(145deg, #2a2030 0%, ${color} 40%, #030303 100%)`;
    thumbLabel.textContent = item.querySelector('.wi-name').textContent;
    thumb.classList.add('active');

    if (!thumbRunning) { thumbRunning = true; thumbRaf(); }
  });

  item.addEventListener('mousemove', e => {
    thumbTX = e.clientX - 140;
    thumbTY = e.clientY - 220;
  });

  item.addEventListener('mouseleave', () => {
    workBg.style.opacity = '0';
    thumb.classList.remove('active');
    thumbRunning = false;
  });
});

/* ── REEL CUSTOM PLAYER ── */
(function initReel() {
  if (typeof Vimeo === 'undefined') { setTimeout(initReel, 80); return; }

  const iframe   = document.getElementById('vimeo');
  const hit      = document.getElementById('reelHit');
  const playBtn  = document.getElementById('reelPlayBtn');
  const muteBtn  = document.getElementById('reelMuteBtn');
  const progArea = document.getElementById('reelProgressArea');
  const bar      = document.getElementById('reelBar');
  const played   = document.getElementById('reelPlayed');
  const hoverFill= document.getElementById('reelHoverFill');
  const dot      = document.getElementById('reelDot');
  const tip      = document.getElementById('reelTip');
  const tipTime  = document.getElementById('reelTipTime');
  const tipImg   = document.getElementById('reelTipImg');
  const poster   = document.getElementById('reelPoster');
  const timeDisp   = document.getElementById('reelTimeDisplay');
  const simpleFill = document.getElementById('reelSimpleFill');

  const cornerMuteBtn = document.getElementById('cornerMuteBtn');
  const cornerFullBtn = document.getElementById('cornerFullBtn');

  const riPlay  = playBtn.querySelector('.ri-play');
  const riPause = playBtn.querySelector('.ri-pause');
  const riSound = muteBtn.querySelector('.ri-unmuted');
  const riMute  = muteBtn.querySelector('.ri-muted');

  const cRiSound = cornerMuteBtn.querySelector('.ri-unmuted');
  const cRiMute  = cornerMuteBtn.querySelector('.ri-muted');

  const player  = new Vimeo.Player(iframe);
  let dur       = 0;
  let isPlaying = false;
  let isMuted   = true;

  const reelEl = document.getElementById('reel');
  updateScrollVolume = () => {
    if (isMuted) return;
    const rect  = reelEl.getBoundingClientRect();
    const viewH = window.innerHeight;
    const visH  = Math.min(rect.bottom, viewH) - Math.max(rect.top, 0);
    const ratio = Math.max(0, Math.min(1, visH / rect.height));
    player.setVolume(ratio);
  };

  function fmt(s) {
    s = Math.max(0, Math.floor(s));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  /* Fetch thumbnail Vimeo pour le fond du filmstrip et le tooltip */
  fetch('https://vimeo.com/api/oembed.json?url=https://vimeo.com/1190241060')
    .then(r => r.json())
    .then(({ thumbnail_url }) => {
      if (!thumbnail_url) return;
      poster.style.backgroundImage = `url(${thumbnail_url})`;
      tipImg.src = thumbnail_url;
    })
    .catch(() => {});

  player.getDuration().then(d => { dur = d; });

  player.on('timeupdate', ({ seconds }) => {
    const pct = dur > 0 ? (seconds / dur * 100) : 0;
    played.style.width      = pct + '%';
    dot.style.left          = pct + '%';
    simpleFill.style.width  = pct + '%';
    timeDisp.textContent    = fmt(seconds);
  });

  function setIcon(hide, show) {
    hide.style.opacity = '0'; hide.style.transform = 'scale(0.7)';
    show.style.opacity = '1'; show.style.transform = 'scale(1)';
  }

  function setPlayState(playing) {
    isPlaying = playing;
    setIcon(playing ? riPlay : riPause, playing ? riPause : riPlay);
    playBtn.classList.toggle('btn-active', playing);
    /* Slide Play ↔ Pause sur le label curseur */
    const vcText = videoCursor.querySelector('.vc-text');
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
    if (muted) { player.setVolume(0); } else { updateScrollVolume(); }
    setIcon(muted ? riSound : riMute,   muted ? riMute  : riSound);
    setIcon(muted ? cRiSound : cRiMute, muted ? cRiMute : cRiSound);
    muteBtn.classList.toggle('btn-active', !muted);
    cornerMuteBtn.classList.toggle('btn-active', !muted);
    muteBtn.classList.toggle('mute-hint', muted);
    cornerMuteBtn.classList.toggle('mute-hint', muted);
  }

  player.on('pause', () => setPlayState(false));
  player.on('ended', () => {
    player.setCurrentTime(0).then(() => player.play());
  });

  /* État initial : son activé, lecture en attente du scroll */
  isMuted = false;
  player.setVolume(1);
  setIcon(riMute, riSound);
  setIcon(cRiMute, cRiSound);
  muteBtn.classList.add('btn-active');
  cornerMuteBtn.classList.add('btn-active');

  /* Lance/pause selon la visibilité dans le viewport */
  const reelSection = document.getElementById('reel');
  let hasStarted = false;
  const reelObs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      player.play().catch(() => {
        /* Navigateur bloque le son — repasse muté */
        isMuted = true;
        player.setVolume(0);
        setIcon(riSound, riMute);
        setIcon(cRiSound, cRiMute);
        muteBtn.classList.remove('btn-active');
        cornerMuteBtn.classList.remove('btn-active');
        muteBtn.classList.add('mute-hint');
        cornerMuteBtn.classList.add('mute-hint');
      });
    } else if (hasStarted) {
      player.pause();
    }
  }, { threshold: 0.4 });

  player.on('play', () => { hasStarted = true; setPlayState(true); });
  reelObs.observe(reelSection);

  /* Label curseur vidéo — lerp smooth */
  const videoCursor = document.getElementById('video-cursor');
  let vcX = 0, vcY = 0, vcTX = 0, vcTY = 0, vcActive = false;

  (function vcRaf() {
    vcX += (vcTX - vcX) * 0.1;
    vcY += (vcTY - vcY) * 0.1;
    videoCursor.style.transform = `translate(${vcX}px, ${vcY}px) rotate(-10deg)`;
    requestAnimationFrame(vcRaf);
  })();

  hit.addEventListener('mouseenter', e => {
    vcTX = e.clientX + 18; vcTY = e.clientY - 16;
    vcX  = vcTX;           vcY  = vcTY;
    videoCursor.classList.add('visible');
  });
  hit.addEventListener('mouseleave', () => videoCursor.classList.remove('visible'));
  hit.addEventListener('mousemove',  e => {
    vcTX = e.clientX + 18;
    vcTY = e.clientY - 16;
  });

  /* Click sur la vidéo → play/pause */
  hit.addEventListener('click', () => isPlaying ? player.pause() : player.play());

  /* Boutons pill */
  playBtn.addEventListener('click', () => isPlaying ? player.pause() : player.play());
  muteBtn.addEventListener('click', () => setMuteState(!isMuted));

  /* Boutons coin */
  cornerMuteBtn.addEventListener('click', () => setMuteState(!isMuted));
  cornerFullBtn.addEventListener('click', () => {
    const box = document.querySelector('.reel-video-box');
    if (document.fullscreenElement) document.exitFullscreen();
    else box.requestFullscreen();
  });

  /* Filmstrip — hover : déplace tooltip + highlight */
  progArea.addEventListener('mousemove', e => {
    const rect = bar.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const pctP = (pct * 100) + '%';
    hoverFill.style.width = pctP;
    dot.style.left        = pctP;
    tip.style.left        = pctP;
    tipTime.textContent   = fmt(pct * dur);
  });

  progArea.addEventListener('mouseleave', () => {
    hoverFill.style.width = '0%';
  });

  /* Filmstrip — click : seek */
  progArea.addEventListener('click', e => {
    const rect = bar.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    player.setCurrentTime(pct * dur);
  });
})();

/* ── SCROLL REVEALS ── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

/* Work items — stagger via JS so hover is instant after reveal */
const workItems = document.querySelectorAll('.wi');
const wiObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const idx = [...workItems].indexOf(e.target);
    e.target.style.transitionDelay = (idx * 0.07) + 's';
    e.target.classList.add('visible');
    setTimeout(() => { e.target.style.transitionDelay = '0s'; }, 700 + idx * 70);
    wiObs.unobserve(e.target);
  });
}, { threshold: 0.1 });

workItems.forEach(el => wiObs.observe(el));

/* Contact lines */
document.querySelectorAll('.ct-line').forEach(el => revealObs.observe(el));

