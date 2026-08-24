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
