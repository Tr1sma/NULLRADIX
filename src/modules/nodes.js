import { qs, el } from '../utils/dom.js';
import { mapRange } from '../utils/math.js';
import { projects } from '../data/content.js';
import { env } from '../modules/env.js';

/**
 * Plotted overlay nodes (progressive enhancement). The list is the canonical,
 * keyboard-accessible path, so nodes are pointer-only (tabindex -1) twins that
 * cross-highlight their list card and open the same panel.
 */
export function renderNodes(projectsCtrl, panel) {
  if (env.mode !== 'animated') return; // list-only on touch/reduced-motion; nodes are a desktop enhancement
  const plot = qs('[data-plot]');
  if (!plot) return;

  const lookup = new Map();

  for (const p of projects) {
    const left = mapRange(p.coord.x, -100, 100, 8, 92);
    const top = mapRange(p.coord.y, -100, 100, 92, 8); // y up
    const node = el('button', {
      class: 'node',
      type: 'button',
      tabindex: '-1',
      'aria-hidden': 'true',
      'data-project-id': p.id,
      'data-label': `${p.name} (${p.coord.x}, ${p.coord.y})`,
      style: `left:${left}%;top:${top}%`,
    });

    node.addEventListener('mouseenter', () => projectsCtrl.highlight(p.id, true, 'node'));
    node.addEventListener('mouseleave', () => projectsCtrl.highlight(p.id, false, 'node'));
    node.addEventListener('click', () => panel.open(p));

    lookup.set(p.id, node);
    plot.append(node);
  }

  projectsCtrl.bindNodes?.(lookup);
}
