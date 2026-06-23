import { qs, el } from '../utils/dom.js';
import { projects } from '../data/content.js';

/** Build the accessible work list. Clicking a title opens the shared detail panel. */
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
    trigger.addEventListener('click', () => panel.open(p, i + 1));

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
}
