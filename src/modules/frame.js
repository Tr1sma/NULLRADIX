import gsap from 'gsap';
import { qs, qsa } from '../utils/dom.js';
import { env } from './env.js';

/** Sector names keyed by section id - what the bottom-right readout displays. */
const SECTORS = {
  top: ['00', 'ORIGIN'],
  about: ['01', 'ABOUT'],
  work: ['02', 'WORK'],
  skills: ['03', 'SKILLS'],
  contact: ['04', 'CONTACT'],
};

const fmt = (v, digits) =>
  (v < 0 ? '−' : '+') + String(Math.abs(Math.round(v))).padStart(digits, '0');

/**
 * The viewport instrument frame. Decorative HUD (aria-hidden) that extends the
 * field's crosshair to the whole page: two hairlines + a coordinate chip track
 * the cursor, the bottom corners read out scroll position (as a plotted Y) and
 * the current sector. CSS hides the frame on coarse pointers / narrow screens;
 * the crosshair additionally requires motion to be allowed.
 */
export function initFrame() {
  const root = qs('[data-frame]');
  if (!root) return;

  const readY = qs('[data-read-y]', root);
  const readPct = qs('[data-read-pct]', root);
  const readIndex = qs('[data-read-index]', root);
  const readSector = qs('[data-read-sector]', root);

  // ---- scroll readout: page Y as a plot coordinate + progress percent ----
  let scrollRaf = 0;
  function updateScroll() {
    scrollRaf = 0;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const pct = Math.min(100, Math.round((scrollY / max) * 100));
    readY.textContent = `Y ${fmt(-scrollY, 5)}`;
    readPct.textContent = `${String(pct).padStart(3, '0')}%`;
  }
  addEventListener(
    'scroll',
    () => {
      if (!scrollRaf) scrollRaf = requestAnimationFrame(updateScroll);
    },
    { passive: true }
  );
  updateScroll();

  // ---- sector readout mirrors the section in view ----
  const sections = qsa('main section[id]');
  if ('IntersectionObserver' in window && sections.length) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const s = SECTORS[e.target.id];
          if (!s) continue;
          readIndex.textContent = s[0];
          readSector.textContent = s[1];
        }
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => io.observe(s));
  }

  // ---- page-wide cursor crosshair (fine pointer + motion allowed only) ----
  if (!env.reducedMotion && !env.coarsePointer) {
    const crossX = qs('[data-cross-x]', root);
    const crossY = qs('[data-cross-y]', root);
    const chip = qs('[data-cross-chip]', root);

    const xTo = gsap.quickTo(crossX, 'y', { duration: 0.32, ease: 'power3' });
    const yTo = gsap.quickTo(crossY, 'x', { duration: 0.32, ease: 'power3' });
    const cxTo = gsap.quickTo(chip, 'x', { duration: 0.32, ease: 'power3' });
    const cyTo = gsap.quickTo(chip, 'y', { duration: 0.32, ease: 'power3' });

    gsap.set([crossX, crossY, chip], { autoAlpha: 0 });
    let shown = false;

    addEventListener(
      'pointermove',
      (e) => {
        if (!shown) {
          shown = true;
          gsap.to([crossX, crossY, chip], { autoAlpha: 1, duration: 0.4 });
        }
        xTo(e.clientY);
        yTo(e.clientX);
        cxTo(e.clientX);
        cyTo(e.clientY);
        // coordinates relative to the viewport centre, like the field's HUD
        const x = ((e.clientX - innerWidth / 2) / (innerWidth / 2)) * 100;
        const y = ((innerHeight / 2 - e.clientY) / (innerHeight / 2)) * 100;
        chip.textContent = `x ${fmt(x, 3)}  y ${fmt(y, 3)}`;
      },
      { passive: true }
    );
    document.documentElement.addEventListener('pointerleave', () => {
      shown = false;
      gsap.to([crossX, crossY, chip], { autoAlpha: 0, duration: 0.3 });
    });
  }

  // fade the frame in once the hero entrance has settled
  setTimeout(() => root.classList.add('is-on'), env.reducedMotion ? 0 : 1400);
}
