import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { env } from './env.js';

gsap.registerPlugin(ScrollTrigger);

const HEADER_OFFSET = 64;

/** Custom rAF smooth-scroll - used for anchor clicks when Lenis isn't running. */
function smoothScrollTo(targetY, duration = 800) {
  const startY = window.scrollY;
  const dist = targetY - startY;
  if (Math.abs(dist) < 2) return;
  let startTs;
  function step(ts) {
    if (startTs === undefined) startTs = ts;
    const t = Math.min(1, (ts - startTs) / duration);
    const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; // easeInOutCubic
    window.scrollTo(0, startY + dist * e);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/** Smooth scroll + scroll-reveals + ghost parallax. */
export async function initScroll() {
  const revealEls = [
    ...document.querySelectorAll('[data-reveal], .work-item, .timeline__item, .skill-group'),
  ];
  let lenis = null;

  if (env.reducedMotion) {
    revealEls.forEach((e) => e.classList.add('is-in'));
  } else {
    // ---- Lenis smooth scroll on capable pointers ----
    if (!env.coarsePointer) {
      try {
        const { default: Lenis } = await import('lenis');
        lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((t) => lenis.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
      } catch {
        /* Lenis optional */
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
    // Skip on touch: scroll-scrubbing a position:fixed element jitters/bounces
    // against the mobile dynamic toolbar + rubber-band overscroll (same reason
    // Lenis is off here). The wordmark just sits still instead.
    const ghost = document.querySelector('[data-ghost]');
    if (ghost && !env.coarsePointer) {
      gsap.to(ghost, {
        yPercent: -14,
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
      });
    }

    ScrollTrigger.refresh();
  }

  // ---- in-page anchor links: always smooth (works even under reduced-motion) ----
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(target, { offset: -HEADER_OFFSET, duration: 1 });
    } else {
      const y = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      smoothScrollTo(y);
    }
    history.pushState(null, '', id);
  });
}
