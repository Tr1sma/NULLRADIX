import { onFrame } from '../utils/raf.js';
import { env } from './env.js';

/**
 * Smooth inertial scroll on capable desktops only. Mobile/touch keep native
 * scroll; reduced-motion disables it entirely. Lenis is driven from the shared
 * rAF loop so it shares the frame budget with the field.
 */
export async function initScroll() {
  if (env.reducedMotion || env.coarsePointer) return;

  const { default: Lenis } = await import('lenis');
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  onFrame((now) => lenis.raf(now));

  // make in-page anchor clicks use Lenis
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -16 });
    history.pushState(null, '', id);
  });

  return lenis;
}
