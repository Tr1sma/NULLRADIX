import gsap from 'gsap';
import { qs, el } from '../utils/dom.js';
import { projects } from '../data/content.js';
import { env } from './env.js';

/** Build the accessible work list + a sharp marker that glides between rows. */
export function renderProjects(panel) {
  const list = qs('[data-projects]');
  if (!list) return;

  projects.forEach((p, i) => {
    const num = String(i + 1).padStart(2, '0');

    const trigger = el(
      'button',
      { class: 'open-trigger', type: 'button', 'aria-haspopup': 'dialog' },
      [p.name, el('span', { class: 'arrow', 'aria-hidden': 'true' }, '↗')]
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
  });

  let current = null;
  let shown = false;

  const ramp = (item, to, duration, ease) =>
    gsap.to(item._st, { ...to, duration, ease, overwrite: true, onUpdate: () => setNum(item) });

  // The active row is ~25px taller because its big index glyph swells (wght/wdth).
  // GSAP applies that on its next tick, so a plain offsetHeight read here captures
  // the pre-swell height and leaves the marker short. Measure the settled height by
  // briefly forcing the final glyph axes, then hand the glyph back to the ramp.
  function activeHeight(item) {
    const prev = item._num.style.fontVariationSettings;
    item._num.style.fontVariationSettings = `'wght' ${NUM_ACTIVE.w}, 'wdth' ${NUM_ACTIVE.wd}, 'opsz' 144`;
    const h = item.offsetHeight;
    item._num.style.fontVariationSettings = prev;
    return h;
  }

  function moveTo(item) {
    if (item === current) return;
    if (current) {
      current.classList.remove('is-active');
      ramp(current, NUM_REST, 0.26, 'power3.out');
    }
    current = item;
    item.classList.add('is-active');
    ramp(item, NUM_ACTIVE, 0.32, 'power3.out');
    api?.onHighlight?.(items.indexOf(item)); // mirror onto the plotted node

    const y = item.offsetTop;
    const h = activeHeight(item);
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

  // Snap (don't tween) the marker back onto the active row after any reflow:
  // async web-font swap, orientation change, content reflow. moveTo bails when
  // the centred row is unchanged, so without this the marker keeps a stale height
  // (the "too short/long/overshooting" bug on mobile). gsap.set = no chase.
  function resync() {
    if (current && shown) gsap.set(marker, { y: current.offsetTop, height: activeHeight(current) });
  }
  // Variable font (Roboto Flex) lands after the first measure → row grows. Re-snap.
  document.fonts?.ready.then(resync);
  let roRaf = 0;
  new ResizeObserver(() => {
    if (!roRaf)
      roRaf = requestAnimationFrame(() => {
        roRaf = 0;
        resync();
      });
  }).observe(list);

  // keyboard focus drives the highlight on every device
  items.forEach((it) =>
    it.querySelector('.open-trigger')?.addEventListener('focus', () => moveTo(it))
  );
  list.addEventListener('focusout', (e) => {
    if (!list.contains(e.relatedTarget)) hide();
  });

  if (env.coarsePointer || env.smallScreen) {
    // Touch / narrow screens have no usable hover - keep whichever row sits nearest
    // the viewport centre lit as the page scrolls (also cross-highlights the node).
    let raf = 0;
    const syncCentered = () => {
      raf = 0;
      const mid = innerHeight / 2;
      let best = null;
      let bestD = Infinity;
      for (const it of items) {
        const r = it.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) continue; // off-screen
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestD) {
          bestD = d;
          best = it;
        }
      }
      if (best) moveTo(best);
      else hide();
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(syncCentered);
    };
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue, { passive: true });
    addEventListener('resize', resync, { passive: true });
    requestAnimationFrame(syncCentered); // light the centre row on load
  } else {
    // Fine pointer: classic hover.
    items.forEach((it) => it.addEventListener('pointerenter', () => moveTo(it)));
    list.addEventListener('pointerleave', hide);
    addEventListener('resize', resync, { passive: true });
  }

  return { moveTo, hide, items };
}
