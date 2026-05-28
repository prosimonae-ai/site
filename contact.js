const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  revealHeroText();
}, { passive: true });

/* ── TEXTE RÉVÉLÉ MOT PAR MOT (wheel fictif) ── */
(function () {
  const el      = document.getElementById('ctHeroText');
  const wrapper = document.querySelector('.ct-hero-wrapper');
  if (!el || !wrapper) return;

  /* Découpe mot par mot */
  const parts = el.innerHTML.split(/(<em>[^<]*<\/em>|[ \n]+)/g).filter(Boolean);
  el.innerHTML = parts.map(part => {
    if (part.match(/^<em>/)) {
      return part.replace(/<\/?em>/g, '').split(' ').filter(w => w)
        .map(w => `<span class="ct-word pink">${w}</span> `).join('');
    } else if (!part.trim()) {
      return ' ';
    } else {
      return part.split(' ').filter(w => w)
        .map(w => `<span class="ct-word">${w}</span> `).join('');
    }
  }).join('');

  const words   = el.querySelectorAll('.ct-word');
  const total   = 1200; /* "pixels" fictifs pour tout révéler */
  let   scrolled = 0;

  function update() {
    const progress = Math.min(1, Math.max(0, scrolled / total));
    const litCount = Math.floor(progress * words.length);
    words.forEach((w, i) => w.classList.toggle('lit', i < litCount));
  }

  /* Bloque le scroll réel et capte la molette */
  wrapper.addEventListener('wheel', e => {
    e.preventDefault();
    scrolled = Math.min(total, Math.max(0, scrolled + e.deltaY * 0.8));
    update();
  }, { passive: false });

  /* Touch support */
  let lastY = 0;
  wrapper.addEventListener('touchstart', e => { lastY = e.touches[0].clientY; }, { passive: true });
  wrapper.addEventListener('touchmove', e => {
    e.preventDefault();
    const dy = lastY - e.touches[0].clientY;
    lastY = e.touches[0].clientY;
    scrolled = Math.min(total, Math.max(0, scrolled + dy * 1.5));
    update();
  }, { passive: false });
})();

window.addEventListener('DOMContentLoaded', () => {
  /* Lignes du titre */
  document.querySelectorAll('.ct-line').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 120 + i * 110);
  });
  /* Bio + photo */
  setTimeout(() => {
    document.querySelector('.ct-bio')?.classList.add('visible');
  }, 320);
});
