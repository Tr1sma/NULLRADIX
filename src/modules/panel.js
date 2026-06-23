import { qs, qsa, el } from '../utils/dom.js';
import { projects } from '../data/content.js';

/** Shared project detail dialog. */
export function createPanel() {
  const root = qs('[data-panel]');
  const card = qs('[data-panel-card]', root);
  let lastFocus = null;

  const set = (sel, value) => {
    qs(sel, root).textContent = value ?? '';
  };

  function open(project, index) {
    lastFocus = document.activeElement;

    const num = String(index || projects.indexOf(project) + 1).padStart(2, '0');
    set('[data-panel-index]', `${num} / ${String(projects.length).padStart(2, '0')}`);
    set('[data-panel-title]', project.name);
    set(
      '[data-panel-meta]',
      [project.year, project.status].filter(Boolean).join(' · ')
    );
    set('[data-panel-blurb]', project.blurb);

    qs('[data-panel-tech]', root).replaceChildren(
      ...project.tech.map((t) => el('li', { class: 'tag' }, t))
    );
    qs('[data-panel-links]', root).replaceChildren(
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
    if (e.key === 'Escape') return close();
    if (e.key === 'Tab') {
      const f = qsa('a, button, [tabindex]:not([tabindex="-1"])', root).filter(
        (n) => !n.hasAttribute('disabled') && n.offsetParent !== null
      );
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
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
