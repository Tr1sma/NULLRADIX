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

/** Smooth scroll + the page's scroll choreography (reveals, scrubs, parallax). */
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

    // ---- sector titles rise out of their line masks ----
    document.querySelectorAll('[data-title]').forEach((title) => {
      const inners = title.querySelectorAll('.line__inner');
      gsap.set(inners, { yPercent: 115 });
      gsap.to(inners, {
        yPercent: 0,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.09,
        scrollTrigger: { trigger: title, start: 'top 88%', once: true },
      });
    });

    // ---- sector rules draw in from the index toward the label ----
    document.querySelectorAll('[data-sector-rule]').forEach((rule) => {
      gsap.set(rule, { scaleX: 0 });
      gsap.to(rule, {
        scaleX: 1,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: rule, start: 'top 90%', once: true },
      });
    });

    // ---- about lead brightens word by word as it scrolls through ----
    const leadWords = document.querySelectorAll('.about__lead .w');
    if (leadWords.length) {
      gsap.fromTo(
        leadWords,
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.6,
          scrollTrigger: {
            trigger: '.about__lead',
            start: 'top 80%',
            end: 'bottom 45%',
            scrub: true,
          },
        }
      );
    }

    // ---- ruler dividers: ticks slide sideways with scroll (instrument feedback) ----
    document.querySelectorAll('[data-ruler] .ruler__ticks').forEach((ticks, i) => {
      gsap.fromTo(
        ticks,
        { x: 0 },
        {
          x: i % 2 ? 96 : -96, // one long-tick period; alternate direction per divider
          ease: 'none',
          scrollTrigger: {
            trigger: ticks.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.4,
          },
        }
      );
    });

    // ---- hero drifts up and dims as the page takes over ----
    const heroInner = document.querySelector('[data-hero-inner]');
    if (heroInner) {
      gsap.to(heroInner, {
        yPercent: -10,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 25%', scrub: true },
      });
    }

    // ---- footer wordmark rises into place as the page ends ----
    const mark = document.querySelector('[data-footer-mark]');
    if (mark) {
      gsap.fromTo(
        mark,
        { yPercent: 32 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '.site-footer',
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 0.4,
          },
        }
      );
    }

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
