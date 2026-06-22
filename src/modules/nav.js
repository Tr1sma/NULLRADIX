import { qs, qsa } from '../utils/dom.js';

/** Active-section sync in the nav + auto-hide header on scroll-down. */
export function initNav() {
  const header = qs('[data-header]');
  const links = qsa('.site-nav a');
  const byHash = new Map(links.map((a) => [a.getAttribute('href'), a]));

  // active section
  const sections = qsa('main section[id]');
  if ('IntersectionObserver' in window && sections.length) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const link = byHash.get('#' + e.target.id);
          if (!link) continue;
          links.forEach((a) => a.removeAttribute('aria-current'));
          link.setAttribute('aria-current', 'true');
        }
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => io.observe(s));
  }

  // auto-hide header
  if (header) {
    let lastY = window.scrollY;
    let ticking = false;
    window.addEventListener(
      'scroll',
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const y = window.scrollY;
          const hide = y > lastY && y > 200;
          header.setAttribute('data-hidden', hide ? 'true' : 'false');
          lastY = y;
          ticking = false;
        });
      },
      { passive: true }
    );
  }
}
