import gsap from 'gsap';
import { qs, el } from '../utils/dom.js';
import { projects } from '../data/content.js';

/** Build the accessible work list + a sharp marker that glides between rows. */
export function renderProjects(panel) {
  const list = qs('[data-projects]');
  if (!list) return;

  projects.forEach((p, i) => {
    const num = String(i + 1).padStart(2, '0');

    const trigger = el(
      'button',
      { class: 'open-trigger', type: 'button', 'aria-haspopup': 'dialog' },
      [
        el('span', { class: 'work-item__name' }, p.name),
        el('span', { class: 'arrow', 'aria-hidden': 'true' }, '↗'),
      ]
    );
    trigger.addEventListener('click', () => panel.open(p, i + 1, trigger));

    const meta = el('div', { class: 'work-item__meta' }, [
      p.status ? el('span', { class: 'status' }, p.status) : null,
      el('span', {}, String(p.year)),
    ]);

    const item = el('li', { class: 'work-item' }, [
      el('span', { class: 'work-item__num', 'aria-hidden': 'true' }, num),
      el('div', { class: 'work-item__main' }, [
        el('h3', { class: 'work-item__title' }, trigger),
        el('p', { class: 'work-item__blurb' }, p.blurb),
        el(
          'ul',
          { class: 'tags', 'aria-label': 'Tech' },
          p.tech.map((t) => el('li', { class: 'tag' }, t))
        ),
      ]),
      meta,
    ]);

    list.append(item);
  });

  // small controller so the field can cross-highlight rows (and vice-versa)
  const api = { onHighlight: null, onClear: null, highlight() {}, clearHighlight() {} };
  const marker = initMarker(list, api);
  api.highlight = (i) => marker.items[i] && marker.moveTo(marker.items[i]);
  api.clearHighlight = () => marker.hide();
  return api;
}

/**
 * A short "decode" flourish: on hover the title's glyphs flicker through random
 * characters and lock in left→right. Width is pinned for the run so nothing
 * reflows, and the final text is always restored. Caller gates on reduced-motion.
 */
const SCRAMBLE_GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>*+=-';
const SCRAMBLE_MS = 360;
function createScramble(nameEl) {
  if (!nameEl) return null;
  const finalText = nameEl.textContent;
  const len = finalText.length;
  let raf = 0;
  let start = 0;

  function frame(now) {
    if (!start) start = now;
    const t = Math.min(1, (now - start) / SCRAMBLE_MS);
    let out = '';
    for (let i = 0; i < len; i++) {
      const ch = finalText[i];
      if (ch === ' ' || t >= (i + 1) / len) out += ch;
      else out += SCRAMBLE_GLYPHS[(Math.random() * SCRAMBLE_GLYPHS.length) | 0];
    }
    nameEl.textContent = out;
    if (t < 1) {
      raf = requestAnimationFrame(frame);
    } else {
      nameEl.textContent = finalText;
      nameEl.style.width = '';
      nameEl.style.display = '';
    }
  }

  return {
    play() {
      cancelAnimationFrame(raf);
      nameEl.style.display = 'inline-block';
      nameEl.style.width = `${nameEl.offsetWidth}px`; // pin width before scrambling
      start = 0;
      raf = requestAnimationFrame(frame);
    },
  };
}

const NUM_REST = { w: 300, wd: 60 };
const NUM_ACTIVE = { w: 820, wd: 145 };
const setNum = (item) => {
  item._num.style.fontVariationSettings = `'wght' ${Math.round(item._st.w)}, 'wdth' ${Math.round(
    item._st.wd
  )}, 'opsz' 144`;
};

/**
 * One gliding highlight + GSAP-driven glyph weight. These are small, non-scrolling
 * hover micro-interactions, so they intentionally play even under reduced-motion
 * (the page-level motion - hero, parallax, reveals, grain - still respects it).
 */
function initMarker(list, api) {
  const marker = el('div', { class: 'work-marker', 'aria-hidden': 'true' });
  list.append(marker);

  const items = [...list.querySelectorAll('.work-item')];
  items.forEach((it) => {
    it._num = it.querySelector('.work-item__num');
    it._st = { ...NUM_REST };
    it._scramble = createScramble(it.querySelector('.work-item__name'));
  });

  let current = null;
  let shown = false;

  const ramp = (item, to, duration, ease) =>
    gsap.to(item._st, { ...to, duration, ease, overwrite: true, onUpdate: () => setNum(item) });

  function moveTo(item) {
    if (item === current) return;
    if (current) {
      current.classList.remove('is-active');
      ramp(current, NUM_REST, 0.26, 'power3.out');
    }
    current = item;
    item.classList.add('is-active');
    item._scramble?.play(); // hover micro-interaction - plays like the glyph-weight ramp below
    ramp(item, NUM_ACTIVE, 0.32, 'power3.out');
    api?.onHighlight?.(items.indexOf(item)); // mirror onto the plotted node

    const y = item.offsetTop;
    const h = item.offsetHeight;
    if (!shown) {
      gsap.set(marker, { y, height: h });
      gsap.to(marker, { opacity: 1, duration: 0.18, ease: 'power2.out', overwrite: true });
      shown = true;
    } else {
      gsap.to(marker, { y, height: h, opacity: 1, duration: 0.34, ease: 'power3.out', overwrite: true });
    }
  }

  function hide() {
    if (current) {
      current.classList.remove('is-active');
      ramp(current, NUM_REST, 0.26, 'power3.out');
      current = null;
    }
    shown = false;
    api?.onClear?.();
    gsap.to(marker, { opacity: 0, duration: 0.2, ease: 'power2.out', overwrite: true });
  }

  items.forEach((it) => {
    it.addEventListener('pointerenter', () => moveTo(it));
    it.querySelector('.open-trigger')?.addEventListener('focus', () => moveTo(it));
  });
  list.addEventListener('pointerleave', hide);
  list.addEventListener('focusout', (e) => {
    if (!list.contains(e.relatedTarget)) hide();
  });
  addEventListener(
    'resize',
    () => {
      if (current && shown) gsap.set(marker, { y: current.offsetTop, height: current.offsetHeight });
    },
    { passive: true }
  );

  return { moveTo, hide, items };
}
