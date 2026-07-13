import { qs, qsa } from '../utils/dom.js';

const labels = {
  top: ['00', 'ORIGIN'],
  about: ['01', 'APPROACH'],
  work: ['02', 'WORK'],
  skills: ['03', 'CAPABILITIES'],
  contact: ['04', 'CONTACT'],
};

/** Active-section readout, nav state and the restrained header surface. */
export function initNav() {
  const header = qs('[data-header]');
  const readout = qs('[data-header-section]');
  const progressLabel = qs('[data-progress-label]');
  const links = qsa('.site-nav a');
  const byHash = new Map(links.map((link) => [link.getAttribute('href'), link]));
  const sections = qsa('main > section[id]');
  let currentId = '';
  let raf = 0;

  const setCurrent = (section) => {
    const id = section?.id || 'top';
    if (id === currentId) return;
    currentId = id;
    const [index, name] = labels[id] || labels.top;

    links.forEach((link) => link.removeAttribute('aria-current'));
    byHash.get(`#${id}`)?.setAttribute('aria-current', 'location');
    if (readout) readout.textContent = `${index} — ${name}`;
    if (progressLabel) progressLabel.textContent = index;
    header?.setAttribute('data-section', id);
  };

  const update = () => {
    raf = 0;
    header?.setAttribute('data-scrolled', scrollY > 24 ? 'true' : 'false');

    const anchor = innerHeight * 0.46;
    let active = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= anchor) active = section;
      else break;
    }
    setCurrent(active);
  };

  const queue = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue, { passive: true });
  update();
}
