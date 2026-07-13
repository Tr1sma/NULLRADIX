import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { env } from './env.js';

gsap.registerPlugin(ScrollTrigger);

const HEADER_OFFSET = 78;

function smoothScrollTo(targetY, duration = 760) {
  const startY = scrollY;
  const distance = targetY - startY;
  if (Math.abs(distance) < 2) return;
  let started;
  const step = (timestamp) => {
    started ??= timestamp;
    const progress = Math.min(1, (timestamp - started) / duration);
    const eased = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    scrollTo(0, startY + distance * eased);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/** Smooth navigation and restrained scene reveals. */
export async function initScroll() {
  const revealElements = [
    ...document.querySelectorAll(
      '[data-reveal], .metric, .principle, .work-item__main, .skill-group, .timeline__item'
    ),
  ];
  const rules = [...document.querySelectorAll('.section__rule')];
  let lenis = null;

  if (env.reducedMotion) {
    revealElements.forEach((element) => {
      element.classList.add('is-in');
      gsap.set(element, { clearProps: 'all' });
    });
    rules.forEach((rule) => gsap.set(rule, { scaleX: 1 }));
  } else {
    if (!env.coarsePointer) {
      try {
        const { default: Lenis } = await import('lenis');
        lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.92 });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      } catch {
        // Native scrolling remains the complete fallback.
      }
    }

    gsap.set(revealElements, { opacity: 0, y: 34 });
    ScrollTrigger.batch(revealElements, {
      start: 'top 88%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.07,
          overwrite: true,
        }),
    });

    rules.forEach((rule) => {
      gsap.fromTo(
        rule,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.1,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: rule, start: 'top 88%', once: true },
        }
      );
    });

    const ghost = document.querySelector('.hero__ghost');
    if (ghost && !env.coarsePointer) {
      gsap.to(ghost, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.7 },
      });
    }

    ScrollTrigger.refresh();
  }

  const skip = document.querySelector('.skip-link');
  const main = document.getElementById('main');
  skip?.addEventListener('click', () => {
    requestAnimationFrame(() => main?.focus({ preventScroll: true }));
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href^="#"]:not(.skip-link)');
    if (!link) return;
    const hash = link.getAttribute('href');
    if (!hash || hash.length < 2) return;
    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    if (env.reducedMotion) {
      const y = target.getBoundingClientRect().top + scrollY - HEADER_OFFSET;
      scrollTo(0, y);
    } else if (lenis) {
      // Sections already declare scroll-margin-top for the fixed header; Lenis
      // reads that margin when resolving an element target.
      lenis.scrollTo(target, { offset: 0, duration: 1.05 });
    } else {
      const y = target.getBoundingClientRect().top + scrollY - HEADER_OFFSET;
      smoothScrollTo(y);
    }
    history.pushState(null, '', hash);
  });
}
