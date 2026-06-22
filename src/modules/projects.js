import { qs, el } from '../utils/dom.js';
import { projects } from '../data/content.js';

/** Build the canonical accessible project list. Returns helpers for cross-highlight. */
export function renderProjects(panel) {
  const list = qs('[data-projects]');
  if (!list) return { highlight() {}, openById() {} };

  const byId = new Map();

  for (const p of projects) {
    const trigger = el(
      'button',
      {
        class: 'open-trigger',
        type: 'button',
        'data-project-id': p.id,
        'aria-haspopup': 'dialog',
      },
      p.name
    );
    trigger.addEventListener('click', () => panel.open(p));

    const techList = el(
      'ul',
      { class: 'tags', 'aria-label': 'Tech' },
      p.tech.map((t) => el('li', { class: 'tag' }, t))
    );

    const links = el(
      'div',
      { class: 'project-card__links' },
      Object.entries(p.links || {}).map(([k, href]) =>
        el('a', { class: 'link-arrow', href, target: '_blank', rel: 'noopener' }, linkLabel(k))
      )
    );

    const card = el('li', { class: 'project-card', 'data-card-id': p.id, 'data-reveal': true }, [
      el('span', { class: 'project-card__coord mono', 'aria-hidden': 'true' }, `(${p.coord.x}, ${p.coord.y})`),
      el('div', { class: 'project-card__main' }, [
        el('h3', { class: 'project-card__name' }, trigger),
        el('p', { class: 'project-card__blurb' }, p.blurb),
        techList,
        links,
      ]),
      el('div', { class: 'project-card__meta' }, [
        p.status ? el('span', { class: `status status--${p.status}` }, p.status) : null,
        el('span', { class: 'project-card__year mono' }, String(p.year)),
      ]),
    ]);

    // cross-highlight node when interacting with the card
    const setActive = (on) => highlight(p.id, on, 'card');
    card.addEventListener('mouseenter', () => setActive(true));
    card.addEventListener('mouseleave', () => setActive(false));
    trigger.addEventListener('focus', () => setActive(true));
    trigger.addEventListener('blur', () => setActive(false));

    byId.set(p.id, { card });
    list.append(card);
  }

  let nodeLookup = null;
  function bindNodes(lookup) {
    nodeLookup = lookup;
  }

  function highlight(id, on, source) {
    const entry = byId.get(id);
    if (entry && source !== 'card') entry.card.classList.toggle('is-active', on);
    if (nodeLookup && source !== 'node') {
      const node = nodeLookup.get(id);
      node?.classList.toggle('is-active', on);
    }
  }

  function openById(id) {
    const p = projects.find((x) => x.id === id);
    if (p) panel.open(p);
  }

  return { highlight, bindNodes, openById };
}

function linkLabel(key) {
  return { live: 'Live', repo: 'Code', docs: 'Docs' }[key] || key;
}
