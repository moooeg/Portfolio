const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const header = document.querySelector('.site-header');

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem('portfolio-theme', theme);
}

themeToggle?.addEventListener('click', () =>
  setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'),
);
navToggle?.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  siteNav?.classList.toggle('is-open', !isOpen);
});
siteNav?.querySelectorAll('a').forEach((link) =>
  link.addEventListener('click', () => {
    navToggle?.setAttribute('aria-expanded', 'false');
    siteNav.classList.remove('is-open');
  }),
);

function updateHeader() {
  header?.classList.toggle('is-scrolled', window.scrollY > 8);
}
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

// Give the hero light a soft spring and a restrained, fading afterglow.
const hero = document.querySelector('.hero');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (hero && !prefersReducedMotion) {
  const trailLayer = document.createElement('div');
  trailLayer.className = 'hero-light-trail';
  trailLayer.setAttribute('aria-hidden', 'true');

  const initialBounds = hero.getBoundingClientRect();
  let targetX = initialBounds.width * 0.72;
  let targetY = initialBounds.height * 0.34;
  let currentX = targetX;
  let currentY = targetY;
  let velocityX = 0;
  let velocityY = 0;
  let trailActivity = 0;
  let pointerInside = false;
  let animationFrame = 0;

  const trailPoints = Array.from({ length: 4 }, () => {
    const node = document.createElement('span');
    trailLayer.append(node);
    return { node, x: currentX, y: currentY };
  });
  hero.prepend(trailLayer);

  function animateSpotlight(time) {
    animationFrame = 0;

    velocityX = (velocityX + (targetX - currentX) * 0.025) * 0.48;
    velocityY = (velocityY + (targetY - currentY) * 0.025) * 0.48;
    currentX += velocityX;
    currentY += velocityY;

    hero.style.setProperty('--spotlight-x', `${currentX.toFixed(1)}px`);
    hero.style.setProperty('--spotlight-y', `${currentY.toFixed(1)}px`);

    const activityTarget = pointerInside ? 1 : 0;
    trailActivity += (activityTarget - trailActivity) * (pointerInside ? 0.24 : 0.075);

    let leaderX = currentX;
    let leaderY = currentY;
    trailPoints.forEach((point, index) => {
      const followRate = 0.13 - index * 0.018;
      point.x += (leaderX - point.x) * followRate;
      point.y += (leaderY - point.y) * followRate;
      point.node.style.transform = `translate3d(${point.x.toFixed(1)}px, ${point.y.toFixed(1)}px, 0) translate(-50%, -50%)`;
      point.node.style.opacity = (trailActivity * (0.22 - index * 0.035)).toFixed(3);
      leaderX = point.x;
      leaderY = point.y;
    });

    const remainingDistance = Math.hypot(targetX - currentX, targetY - currentY);
    const remainingVelocity = Math.hypot(velocityX, velocityY);
    const trailIsTransitioning = Math.abs(activityTarget - trailActivity) > 0.004;
    if (remainingDistance > 0.08 || remainingVelocity > 0.03 || trailIsTransitioning) {
      animationFrame = requestAnimationFrame(animateSpotlight);
    }
  }

  function startSpotlightAnimation() {
    if (!animationFrame) animationFrame = requestAnimationFrame(animateSpotlight);
  }

  hero.addEventListener(
    'pointermove',
    (event) => {
      const bounds = hero.getBoundingClientRect();
      targetX = Math.min(bounds.width, Math.max(0, event.clientX - bounds.left));
      targetY = Math.min(bounds.height, Math.max(0, event.clientY - bounds.top));
      pointerInside = true;
      hero.style.setProperty('--spotlight-opacity', '1');
      trailActivity = Math.max(trailActivity, 0.12);
      startSpotlightAnimation();
    },
    { passive: true },
  );

  hero.addEventListener('pointerleave', () => {
    pointerInside = false;
    hero.style.setProperty('--spotlight-opacity', '0');
    startSpotlightAnimation();
  });
}

// Reveal content as it enters the viewport instead of animating everything on load.
const motionTargets = [
  ...document.querySelectorAll('.reveal'),
  ...document.querySelectorAll(
    '.project-page .project-hero > *, .project-page .project-facts, .project-page .case-study > section, .project-page .next-project',
  ),
];

motionTargets.forEach((element) => element.classList.add('reveal'));
document.querySelectorAll('.capability-grid, .project-list, .outcome-grid').forEach((group) => {
  [...group.children].forEach((child, index) =>
    child.style.setProperty('--reveal-delay', `${index * 80}ms`),
  );
});

if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -35px' },
  );

  motionTargets.forEach((element) => revealObserver.observe(element));
} else {
  motionTargets.forEach((element) => element.classList.add('is-visible'));
}
