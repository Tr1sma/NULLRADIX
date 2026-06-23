import { el } from '../utils/dom.js';

/** Live (x,y) readout + a context label, mirrored from the field state. */
export function createHud(node) {
  const coord = el('span', { class: 'field__hud-coord' });
  const label = el('span', { class: 'field__hud-label' });
  node.replaceChildren(coord, label);

  const fmt = (v) => {
    const n = Math.max(-999, Math.min(999, Math.round(v)));
    return (n < 0 ? '-' : '+') + String(Math.abs(n)).padStart(3, '0');
  };

  return {
    set(x, y, text) {
      coord.textContent = `x ${fmt(x)}  y ${fmt(y)}`;
      label.textContent = text || '';
    },
  };
}
