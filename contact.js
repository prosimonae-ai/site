const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

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
