import { qs, qsa, el } from '../utils/dom.js';
import { projects } from '../data/content.js';
import { fmtCoord } from './projects.js';

/** Shared project detail dialog. */
export function createPanel() {
  const root = qs('[data-panel]');
  const card = qs('[data-panel-card]', root);
  let lastFocus = null;
  let closeTimer = 0;
  let typers = [];

  /** Cancel any in-flight typewriters, snapping their text to the final string. */
  function clearTypers() {
    for (const cancel of typers) cancel();
    typers = [];
  }

  /**
   * Reveal `text` in `node` character-by-character. Every glyph is laid out
   * up-front (hidden), so the box keeps its final size - no reflow, no jump,
   * and the open-from-click origin measures against the real height.
   */
  function typeText(node, text, delay, duration) {
    text = text ?? '';
    // opacity-only reveal (no movement) → safe to run even under reduced motion
    if (!text) {
      node.textContent = text;
      return;
    }
    const spans = [...text].map((ch) => {
      const s = el('span', {}, ch);
      s.style.opacity = '0';
      return s;
    });
    node.replaceChildren(...spans);

    let start = 0;
    let rafId = 0;
    const timer = setTimeout(() => {
      const step = (now) => {
        start ||= now;
        const p = Math.min((now - start) / duration, 1);
        const shown = Math.round(p * spans.length);
        for (let i = 0; i < shown; i++) spans[i].style.opacity = '1';
        if (p < 1) rafId = requestAnimationFrame(step);
      };
      rafId = requestAnimationFrame(step);
    }, delay);

    typers.push(() => {
      clearTimeout(timer);
      cancelAnimationFrame(rafId);
      node.textContent = text;
    });
  }

  /** Point the card's transform-origin at the clicked element so it grows out of it. */
  function setOrigin(source) {
    if (!source) {
      card.style.removeProperty('--ox');
      card.style.removeProperty('--oy');
      return;
    }
    // measure the card at its resting (untransformed) box
    card.style.transform = 'none';
    const c = card.getBoundingClientRect();
    card.style.transform = '';
    const s = source.getBoundingClientRect();
    card.style.setProperty('--ox', `${s.left + s.width / 2 - c.left}px`);
    card.style.setProperty('--oy', `${s.top + s.height / 2 - c.top}px`);
  }

  function open(project, index, source) {
    clearTimeout(closeTimer);
    clearTypers();
    lastFocus = document.activeElement;

    const num = String(index || projects.indexOf(project) + 1).padStart(2, '0');
    const total = String(projects.length).padStart(2, '0');
    const meta = [project.year, project.status, fmtCoord(project.coord)]
      .filter(Boolean)
      .join(' · ');
    // type the text fields out in a quick cascade as the card lands
    typeText(qs('[data-panel-index]', root), `${num} / ${total}`, 60, 200);
    typeText(qs('[data-panel-title]', root), project.name, 140, 320);
    typeText(qs('[data-panel-meta]', root), meta, 300, 220);
    typeText(qs('[data-panel-blurb]', root), project.blurb, 360, 520);

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
    setOrigin(source);
    void root.offsetWidth; // commit the closed state, then transition into the open one
    root.classList.add('is-open');
    card.focus({ preventScroll: true });
    document.addEventListener('keydown', onKey);
  }

  function close() {
    if (root.hidden || !root.classList.contains('is-open')) return;
    clearTypers();
    root.classList.remove('is-open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    lastFocus?.focus?.();
    closeTimer = setTimeout(() => {
      root.hidden = true;
    }, 420); // hold for the close transition (matches --dur) before removing from view
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
