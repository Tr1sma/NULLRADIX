import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { env } from './env.js';

gsap.registerPlugin(ScrollTrigger);

/** Smooth scroll (Lenis, desktop only) + scroll-reveals + ghost parallax. */
export async function initScroll() {
  const revealEls = [
    ...document.querySelectorAll('[data-reveal], .work-item, .timeline__item, .skill-group'),
  ];

  // reduced-motion or no smooth scroll: show everything, no choreography
  if (env.reducedMotion) {
    revealEls.forEach((e) => e.classList.add('is-in'));
    return;
  }

  // ---- Lenis smooth scroll on capable pointers ----
  let lenis = null;
  if (!env.coarsePointer) {
    try {
      const { default: Lenis } = await import('lenis');
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);

      document.addEventListener('click', (e) => {
        const a = e.target.closest?.('a[href^="#"]');
        if (!a) return;
        const id = a.getAttribute('href');
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -64 });
        history.pushState(null, '', id);
      });
    } catch {
      /* Lenis optional; native scroll is the fallback */
    }
  }

  // ---- scroll reveals (staggered) ----
  gsap.set(revealEls, { opacity: 0, y: 26 });
  ScrollTrigger.batch(revealEls, {
    start: 'top 86%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.08,
        overwrite: true,
      }),
  });

  // ---- giant ghost wordmark drifts slower than the page ----
  const ghost = document.querySelector('[data-ghost]');
  if (ghost) {
    gsap.to(ghost, {
      yPercent: -14,
      ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
    });
  }

  ScrollTrigger.refresh();
}
