import { qs, qsa, el } from '../utils/dom.js';
import { projects } from '../data/content.js';
import { env } from './env.js';

/** Accessible full-height project dossier. */
export function createPanel() {
  const root = qs('[data-panel]');
  const card = qs('[data-panel-card]', root);
  const closeButton = qs('.panel__close', root);
  const background = qsa('.site-header, main, .site-footer');
  let lastFocus = null;
  let closeTimer = 0;

  function setBackgroundInert(value) {
    background.forEach((node) => {
      node.inert = value;
    });
  }

  function open(project, index) {
    clearTimeout(closeTimer);
    lastFocus = document.activeElement;

    const number = String(index || projects.indexOf(project) + 1).padStart(2, '0');
    const total = String(projects.length).padStart(2, '0');
    const status = project.status ? project.status.toUpperCase() : 'ARCHIVE';
    const x = signed(project.coord?.x);
    const y = signed(project.coord?.y);

    qs('[data-panel-index]', root).textContent = `${number} / ${total}`;
    qs('[data-panel-watermark]', root).textContent = number;
    qs('[data-panel-title]', root).textContent = project.name;
    qs('[data-panel-meta]', root).textContent = `${project.year} / ${status}`;
    qs('[data-panel-coord]', root).textContent = `X ${x} / Y ${y}`;
    qs('[data-panel-blurb]', root).textContent = project.blurb;
    qs('[data-panel-tech]', root).replaceChildren(
      ...project.tech.map((technology) => el('li', { class: 'tag' }, technology))
    );
    qs('[data-panel-links]', root).replaceChildren(
      ...Object.entries(project.links || {}).map(([key, href]) =>
        el(
          'a',
          { class: 'btn', href, target: '_blank', rel: 'noopener' },
          [el('span', {}, labelFor(key)), el('i', { 'aria-hidden': 'true' }, '↗')]
        )
      )
    );

    root.hidden = false;
    setBackgroundInert(true);
    document.body.classList.add('panel-open');
    requestAnimationFrame(() => {
      root.classList.add('is-open');
      closeButton?.focus({ preventScroll: true });
    });
    document.addEventListener('keydown', onKey);
  }

  function close() {
    if (!root || root.hidden || !root.classList.contains('is-open')) return;
    root.classList.remove('is-open');
    document.body.classList.remove('panel-open');
    document.removeEventListener('keydown', onKey);

    const delay = env.reducedMotion ? 0 : 520;
    closeTimer = window.setTimeout(() => {
      root.hidden = true;
      setBackgroundInert(false);
      lastFocus?.focus?.({ preventScroll: true });
    }, delay);
  }

  function onKey(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== 'Tab') return;

    const focusable = qsa('a, button, [tabindex]:not([tabindex="-1"])', card).filter(
      (node) => !node.hasAttribute('disabled') && node.offsetParent !== null
    );
    if (!focusable.length) {
      event.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  qsa('[data-panel-close]', root).forEach((control) => control.addEventListener('click', close));

  return { open, close };
}

function signed(value = 0) {
  const number = Math.round(value);
  return `${number < 0 ? '−' : '+'}${String(Math.abs(number)).padStart(3, '0')}`;
}

function labelFor(key) {
  return { live: 'View live', repo: 'View repository', docs: 'Read docs' }[key] || key;
}
