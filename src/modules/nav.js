import { qs, qsa } from '../utils/dom.js';

/** Active-section sync in the nav + header morphs into a dynamic-island pill on scroll. */
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

  // collapse the header into the island once scrolled past the hero top
  if (header) {
    let ticking = false;
    const update = () => {
      header.setAttribute('data-scrolled', window.scrollY > 48 ? 'true' : 'false');
      ticking = false;
    };
    update();
    window.addEventListener(
      'scroll',
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
      },
      { passive: true }
    );
  }
}
