import { qs, qsa, el } from '../utils/dom.js';

/** Shared project detail dialog. Opened from both the list and the plotted nodes. */
export function createPanel() {
  const root = qs('[data-panel]');
  const card = qs('[data-panel-card]', root);
  let lastFocus = null;

  const set = (sel, value) => {
    qs(sel, root).textContent = value ?? '';
  };

  function open(project) {
    lastFocus = document.activeElement;

    set('[data-panel-coord]', `(${project.coord.x}, ${project.coord.y})`);
    set('[data-panel-title]', project.name);
    set('[data-panel-year]', `${project.year}${project.status ? ' · ' + project.status : ''}`);
    set('[data-panel-blurb]', project.blurb);

    const tech = qs('[data-panel-tech]', root);
    tech.replaceChildren(...project.tech.map((t) => el('li', { class: 'tag' }, t)));

    const links = qs('[data-panel-links]', root);
    links.replaceChildren(
      ...Object.entries(project.links || {}).map(([k, href]) =>
        el('a', { class: 'btn', href, target: '_blank', rel: 'noopener' }, labelFor(k))
      )
    );

    root.hidden = false;
    document.body.style.overflow = 'hidden';
    card.focus();
    document.addEventListener('keydown', onKey);
  }

  function close() {
    if (root.hidden) return;
    root.hidden = true;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    lastFocus?.focus?.();
  }

  function onKey(e) {
    if (e.key === 'Escape') {
      close();
      return;
    }
    if (e.key === 'Tab') {
      const f = qsa('a, button, [tabindex]:not([tabindex="-1"])', root).filter(
        (n) => !n.hasAttribute('disabled') && n.offsetParent !== null
      );
      if (!f.length) return;
      const first = f[0];
      const lastEl = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  qsa('[data-panel-close]', root).forEach((b) => b.addEventListener('click', close));

  return { open, close };
}

function labelFor(key) {
  return { live: 'Live ↗', repo: 'Repository ↗', docs: 'Docs ↗' }[key] || key + ' ↗';
}
