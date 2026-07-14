import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { env } from './env.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-linked "text ignites to white" reveal. Splits every
 * [data-scroll-fill] element into words, dims them, then brightens each
 * left-to-right as the block scrolls up through the viewport (scrubbed, so it
 * tracks scroll position both ways). Opacity - not colour - so GSAP
 * interpolates smoothly and the design tokens stay intact; white at 0.18 over
 * --c-void reads as a dim grey.
 */
export function initScrollFill() {
  // reduced motion: leave the bright text renderSections already placed
  if (env.reducedMotion) return;

  document.querySelectorAll('[data-scroll-fill]').forEach((elm) => {
    const text = elm.textContent.trim();
    if (!text) return;

    // split into words, wrap each in a span, keep the spaces between them
    elm.textContent = '';
    const words = [];
    for (const token of text.split(/(\s+)/)) {
      if (token === '') continue;
      if (/^\s+$/.test(token)) {
        elm.appendChild(document.createTextNode(' '));
        continue;
      }
      const span = document.createElement('span');
      span.className = 'sf-word';
      span.textContent = token;
      elm.appendChild(span);
      words.push(span);
    }
    if (!words.length) return;

    gsap.set(words, { opacity: 0.18 });
    gsap.to(words, {
      opacity: 1,
      ease: 'none',
      duration: 1,
      stagger: { each: 0.6 }, // stagger < duration -> soft per-word ignite
      scrollTrigger: { trigger: elm, start: 'top 82%', end: 'top 38%', scrub: true },
    });
  });

  // the variable display font swaps in late; re-measure so start/end stay true
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
