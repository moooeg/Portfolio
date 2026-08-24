const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const header = document.querySelector('.site-header');

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem('portfolio-theme', theme);
}

themeToggle?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
navToggle?.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  siteNav?.classList.toggle('is-open', !isOpen);
});
siteNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navToggle?.setAttribute('aria-expanded', 'false');
  siteNav.classList.remove('is-open');
}));

function updateHeader() { header?.classList.toggle('is-scrolled', window.scrollY > 8); }
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

// Reveal content as it enters the viewport instead of animating everything on load.
const motionTargets = [
  ...document.querySelectorAll('.reveal'),
  ...document.querySelectorAll('.project-page .project-hero > *, .project-page .project-facts, .project-page .case-study > section, .project-page .next-project')
];

motionTargets.forEach((element) => element.classList.add('reveal'));
document.querySelectorAll('.capability-grid, .project-list, .outcome-grid').forEach((group) => {
  [...group.children].forEach((child, index) => child.style.setProperty('--reveal-delay', `${index * 80}ms`));
});

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px' });

  motionTargets.forEach((element) => revealObserver.observe(element));
} else {
  motionTargets.forEach((element) => element.classList.add('is-visible'));
}

// Give the schematic a small amount of responsive depth on pointer devices.
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual && window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  heroVisual.addEventListener('pointermove', (event) => {
    const bounds = heroVisual.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroVisual.style.setProperty('--tilt-x', `${(-y * 2.5).toFixed(2)}deg`);
    heroVisual.style.setProperty('--tilt-y', `${(x * 2.5).toFixed(2)}deg`);
  });
  heroVisual.addEventListener('pointerleave', () => {
    heroVisual.style.setProperty('--tilt-x', '0deg');
    heroVisual.style.setProperty('--tilt-y', '0deg');
  });
}
