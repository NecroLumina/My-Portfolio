const root = document.documentElement;
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const themeButton = document.querySelector('.theme-toggle');
const year = document.querySelector('#year');
const themeMeta = document.querySelector('meta[name="theme-color"]');

root.classList.remove('no-js');
if (year) year.textContent = String(new Date().getFullYear());

const closeMenu = () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Open navigation menu');
  navLinks?.classList.remove('is-open');
};

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.setAttribute('aria-label', open ? 'Open navigation menu' : 'Close navigation menu');
  navLinks?.classList.toggle('is-open', !open);
});

navLinks?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

let savedTheme = null;
try { savedTheme = localStorage.getItem('portfolio-theme'); } catch { /* Storage can be disabled; theme still works for this page. */ }
if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;

const updateThemeButton = () => {
  const light = root.dataset.theme === 'light';
  themeButton?.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
  themeButton?.setAttribute('title', light ? 'Switch to dark theme' : 'Switch to light theme');
};
updateThemeButton();
themeMeta?.setAttribute('content', root.dataset.theme === 'light' ? '#f3f5f6' : '#0b0d10');

themeButton?.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
  try { localStorage.setItem('portfolio-theme', root.dataset.theme); } catch { /* Ignore unavailable storage. */ }
  themeMeta?.setAttribute('content', root.dataset.theme === 'light' ? '#f3f5f6' : '#0b0d10');
  updateThemeButton();
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const observedSections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);
if ('IntersectionObserver' in window) {
  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-28% 0px -62% 0px' });
  observedSections.forEach((section) => activeObserver.observe(section));
}

document.querySelectorAll('.game-cover img').forEach((image) => {
  image.addEventListener('error', () => {
    image.hidden = true;
    image.closest('.game-cover')?.classList.add('media-unavailable');
  }, { once: true });
});
