import gsap from 'gsap';
import { qs, el } from '../utils/dom.js';
import { projects } from '../data/content.js';
import { env } from './env.js';

/** Build the canonical, keyboard-accessible project atlas. */
export function renderProjects(panel) {
  const list = qs('[data-projects]');
  const markerNode = qs('[data-work-marker]');
  if (!list) return;

  projects.forEach((project, index) => {
    const number = String(index + 1).padStart(2, '0');
    const descriptionId = `project-${project.id}-description`;
    const coord = `${signed(project.coord?.x)} / ${signed(project.coord?.y)}`;

    const trigger = el(
      'button',
      {
        class: 'open-trigger',
        type: 'button',
        'aria-haspopup': 'dialog',
        'aria-describedby': descriptionId,
        'aria-label': `Open ${project.name} project dossier`,
      },
      [
        el('span', { class: 'open-trigger__label' }, project.name),
        el('span', { class: 'open-trigger__arrow', 'aria-hidden': 'true' }, '↗'),
      ]
    );
    trigger.addEventListener('click', () => panel.open(project, index + 1, trigger));

    const item = el('li', { class: 'work-item', 'data-project-index': index }, [
      el('div', { class: 'work-item__top' }, [
        el('span', { class: 'work-item__num', 'aria-hidden': 'true' }, number),
        el('span', { class: 'work-item__coord' }, coord),
        project.status ? el('span', { class: 'work-item__status' }, project.status) : el('span', {}, ''),
      ]),
      el('div', { class: 'work-item__main' }, [
        el('h3', { class: 'work-item__title' }, trigger),
        el('p', { class: 'work-item__blurb', id: descriptionId }, project.blurb),
        el(
          'ul',
          { class: 'project-stack', 'aria-label': `${project.name} technology` },
          project.tech.map((technology) => el('li', {}, technology))
        ),
      ]),
      el('div', { class: 'work-item__footer' }, [
        el('span', {}, String(project.year)),
        el('span', {}, 'Open dossier'),
      ]),
    ]);

    list.append(item);
  });

  const api = { onHighlight: null, highlight() {}, clearHighlight() {} };
  const marker = initMarker(list, markerNode, api);
  api.highlight = (index) => marker.items[index] && marker.moveTo(marker.items[index]);
  api.clearHighlight = () => marker.syncCentered(true);
  return api;
}

function signed(value = 0) {
  const number = Math.round(value);
  return `${number < 0 ? '−' : '+'}${String(Math.abs(number)).padStart(3, '0')}`;
}

function initMarker(list, marker, api) {
  const items = [...list.querySelectorAll('.work-item')];
  let current = null;
  let shown = false;
  let pointerActive = false;
  let focusActive = false;
  let scrollRaf = 0;

  function moveTo(item, notify = true, forceNotify = false) {
    if (!item) return;
    const changed = item !== current;
    if (changed) {
      current = item;
      items.forEach((candidate) => candidate.classList.toggle('is-active', candidate === item));
    }
    if (notify && (changed || forceNotify)) api?.onHighlight?.(items.indexOf(item));

    if (!marker) return;
    const state = { y: item.offsetTop, height: item.offsetHeight, opacity: 1 };
    if (!shown || env.reducedMotion) {
      gsap.set(marker, state);
      shown = true;
    } else {
      gsap.to(marker, {
        ...state,
        duration: 0.42,
        ease: 'power3.out',
        overwrite: true,
      });
    }
  }

  function syncCentered(forceNotify = false) {
    scrollRaf = 0;
    if (pointerActive || focusActive) return;

    const anchor = innerHeight * 0.53;
    let best = null;
    let distance = Infinity;
    for (const item of items) {
      const rect = item.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) continue;
      const itemAnchor = rect.top + Math.min(rect.height, innerHeight) * 0.42;
      const nextDistance = Math.abs(itemAnchor - anchor);
      if (nextDistance < distance) {
        best = item;
        distance = nextDistance;
      }
    }
    if (best) moveTo(best, true, forceNotify);
    else if (current && marker) gsap.set(marker, { y: current.offsetTop, height: current.offsetHeight });
  }

  const queueCentered = () => {
    if (!scrollRaf) scrollRaf = requestAnimationFrame(syncCentered);
  };

  if (!env.coarsePointer) {
    items.forEach((item) => {
      item.addEventListener('pointerenter', () => {
        pointerActive = true;
        moveTo(item);
      });
    });
    list.addEventListener('pointerleave', () => {
      pointerActive = false;
      queueCentered();
    });
  }

  items.forEach((item) => {
    item.querySelector('.open-trigger')?.addEventListener('focus', () => {
      focusActive = true;
      moveTo(item);
    });
  });
  list.addEventListener('focusout', (event) => {
    if (!list.contains(event.relatedTarget)) {
      focusActive = false;
      queueCentered();
    }
  });

  addEventListener('scroll', queueCentered, { passive: true });
  addEventListener('resize', queueCentered, { passive: true });
  document.fonts?.ready.then(queueCentered);
  if ('ResizeObserver' in window) new ResizeObserver(queueCentered).observe(list);
  requestAnimationFrame(syncCentered);

  return { moveTo, syncCentered, items };
}
