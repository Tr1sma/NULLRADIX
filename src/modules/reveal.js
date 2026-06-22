import { qsa } from '../utils/dom.js';
import { env } from './env.js';

/** Scroll-triggered reveal via IntersectionObserver. Instant under reduced-motion. */
export function initReveal() {
  const items = qsa('[data-reveal]');
  if (!items.length) return;

  if (env.reducedMotion || !('IntersectionObserver' in window)) {
    items.forEach((n) => n.classList.add('is-revealed'));
    return;
  }

  const io = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
  );

  items.forEach((n) => io.observe(n));
}
