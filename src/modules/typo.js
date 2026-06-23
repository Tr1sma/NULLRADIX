import gsap from 'gsap';
import { env } from './env.js';

/**
 * Kinetic hero type: split into letters, play a line-rise + "inhale" entrance,
 * then make each glyph's weight/width swell toward the cursor like a spotlight.
 */
export function initTypo() {
  const title = document.getElementById('hero-title');
  if (!title) return;

  const chars = [];
  title.querySelectorAll('[data-letters]').forEach((el) => {
    const text = el.textContent.trim();
    el.textContent = '';
    for (const c of text) {
      if (c === ' ') {
        el.appendChild(document.createTextNode(' '));
        continue;
      }
      const span = document.createElement('span');
      span.className = 'ch';
      span.textContent = c;
      el.appendChild(span);
      chars.push(span);
    }
  });

  const lines = title.querySelectorAll('.line__inner');
  const sub = document.querySelector('.hero__sub .line__inner');

  if (env.reducedMotion) {
    // everything already visible via CSS; just settle the weight
    chars.forEach((s) => (s.style.fontVariationSettings = "'wght' 640,'wdth' 78,'opsz' 144"));
    return;
  }

  // ---- entrance: lines rise, then the word inhales to bold+condensed ----
  const tl = gsap.timeline({ delay: 0.15 });
  tl.from(lines, {
    yPercent: 115,
    rotate: 6,
    opacity: 0,
    duration: 0.95,
    ease: 'power4.out',
    stagger: 0.09,
  });
  tl.from(
    chars,
    {
      // start thin + wide, animate to settled weight (the "inhale")
      onStart() {
        chars.forEach((s) => (s.style.fontVariationSettings = "'wght' 200,'wdth' 125,'opsz' 144"));
      },
      duration: 0.9,
      ease: 'power2.inOut',
      stagger: { each: 0.012, from: 'center' },
      onUpdate() {
        const p = this.progress();
        const w = Math.round(200 + (640 - 200) * p);
        const wd = Math.round(125 + (78 - 125) * p);
        chars.forEach((s) => (s.style.fontVariationSettings = `'wght' ${w},'wdth' ${wd},'opsz' 144`));
      },
    },
    '-=0.45'
  );
  if (sub) tl.from(sub, { yPercent: 120, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6');

  // ---- cursor spotlight: weight/width swell toward the pointer ----
  let px = -9999;
  let py = -9999;
  let active = false;
  let started = false;
  addEventListener(
    'pointermove',
    (e) => {
      px = e.clientX;
      py = e.clientY;
      active = true;
    },
    { passive: true }
  );
  // hand control to the cursor after the entrance settles
  tl.eventCallback('onComplete', () => (started = true));

  const R = 260;
  let frame = 0;
  function loop() {
    requestAnimationFrame(loop);
    if (!started || !active) return;
    if ((frame++ & 1) === 0) return;
    for (const s of chars) {
      const r = s.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) continue;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const d = Math.hypot(cx - px, cy - py);
      const k = Math.max(0, 1 - d / R);
      const e = k * k;
      const w = Math.round(360 + 560 * e); // 360..920
      const wd = Math.round(120 - 46 * e); // 120..74
      s.style.fontVariationSettings = `'wght' ${w},'wdth' ${wd},'opsz' 144`;
    }
  }
  loop();
}
