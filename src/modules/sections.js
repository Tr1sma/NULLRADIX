import gsap from 'gsap';
import { qs, qsa, el } from '../utils/dom.js';
import { profile, about, metrics, skills, experience, socials } from '../data/content.js';
import { createScramble } from '../utils/scramble.js';
import { env } from './env.js';

/** Fill the data-driven regions from content.js. */
export function renderSections() {
  document.title = `NULLRADIX — ${profile.role}`;

  const status = qs('[data-profile-status]');
  if (status) status.textContent = profile.status;

  const aboutLead = qs('[data-about-lead]');
  if (aboutLead) aboutLead.textContent = about.lead;

  const metricsRoot = qs('[data-metrics]');
  if (metricsRoot) {
    metricsRoot.replaceChildren(
      ...metrics.map((metric, index) =>
        el('div', { class: 'metric' }, [
          el('dt', { class: 'metric__label' }, `${String(index + 1).padStart(2, '0')} — ${metric.label}`),
          el('dd', { class: 'metric__value' }, metric.value),
        ])
      )
    );
  }

  const principlesRoot = qs('[data-about-principles]');
  if (principlesRoot) {
    principlesRoot.replaceChildren(
      ...about.principles.map((principle, index) =>
        el('div', { class: 'principle' }, [
          el('span', { class: 'principle__index', 'aria-hidden': 'true' }, String(index + 1).padStart(2, '0')),
          el('dt', { class: 'principle__key' }, principle.k),
          el('dd', { class: 'principle__value' }, principle.v),
        ])
      )
    );
  }

  qsa('[data-profile-email]').forEach((node) => {
    node.textContent = profile.email;
    if (node.tagName === 'A') node.href = `mailto:${profile.email}`;
  });

  const skillsRoot = qs('[data-skills]');
  if (skillsRoot) {
    skillsRoot.replaceChildren(
      ...skills.map((group, index) =>
        el('article', { class: 'skill-group' }, [
          el('header', { class: 'skill-group__head' }, [
            el('span', { class: 'skill-group__index', 'aria-hidden': 'true' }, String(index + 1).padStart(2, '0')),
            el('h3', { class: 'skill-group__label' }, group.group),
          ]),
          el(
            'ul',
            { class: 'skill-group__items', 'aria-label': `${group.group} technologies` },
            group.items.map((item) => el('li', { class: 'skill-item' }, item))
          ),
        ])
      )
    );
  }

  const timelineRoot = qs('[data-experience]');
  if (timelineRoot) {
    timelineRoot.replaceChildren(
      ...experience.map((entry, index) =>
        el('li', { class: 'timeline__item' }, [
          el('span', { class: 'timeline__index', 'aria-hidden': 'true' }, String(index + 1).padStart(2, '0')),
          el('p', { class: 'timeline__range' }, [
            el('span', {}, entry.from),
            el('i', { 'aria-hidden': 'true' }, '—'),
            el('span', {}, entry.to),
          ]),
          el('div', { class: 'timeline__content' }, [
            el('h3', { class: 'timeline__role' }, el('span', { class: 'timeline__role-name' }, entry.role)),
            el('p', { class: 'timeline__org' }, entry.org),
            el('p', { class: 'timeline__summary' }, entry.summary),
            entry.tech
              ? el(
                  'ul',
                  { class: 'timeline__tech', 'aria-label': `Technology used at ${entry.org}` },
                  entry.tech.map((item) => el('li', {}, item))
                )
              : null,
          ]),
        ])
      )
    );
    initTimeline(timelineRoot);
  }

  const socialRoot = qs('[data-socials]');
  if (socialRoot) {
    socialRoot.replaceChildren(
      ...socials.map((social, index) =>
        el('li', {}, [
          el(
            'a',
            {
              href: social.href,
              target: '_blank',
              rel: 'noopener',
              'aria-label': `${social.label} ${social.handle} — opens in a new tab`,
            },
            [
              el('span', { class: 'socials__index', 'aria-hidden': 'true' }, String(index + 1).padStart(2, '0')),
              el('span', { class: 'socials__label' }, social.label),
              el('span', { class: 'socials__handle' }, social.handle),
              el('i', { 'aria-hidden': 'true' }, '↗'),
            ]
          ),
        ])
      )
    );
  }

  qsa('[data-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  initCopyButton();
}

function initCopyButton() {
  const button = qs('[data-copy-email]');
  const status = qs('[data-copy-status]');
  if (!button) return;

  button.addEventListener('click', async () => {
    const label = button.querySelector('span');
    const original = label?.textContent || button.textContent;
    button.setAttribute('aria-busy', 'true');
    if (label) label.textContent = 'Copying address';
    if (status) status.textContent = 'Copying address…';
    try {
      await copyText(profile.email);
      if (label) label.textContent = 'Address copied';
      if (status) status.textContent = 'Address copied to clipboard.';
      window.setTimeout(() => {
        if (label) label.textContent = original;
      }, 1800);
    } catch {
      if (label) label.textContent = original;
      if (status) status.textContent = 'Clipboard unavailable. Use the email link above.';
    } finally {
      button.removeAttribute('aria-busy');
    }
  });
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    let timer = 0;
    try {
      await Promise.race([
        navigator.clipboard.writeText(text),
        new Promise((_, reject) => {
          timer = window.setTimeout(() => reject(new Error('Clipboard timed out')), 1200);
        }),
      ]);
      clearTimeout(timer);
      return;
    } catch {
      clearTimeout(timer);
    }
  }

  const input = document.createElement('textarea');
  input.value = text;
  input.setAttribute('readonly', '');
  input.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
  document.body.append(input);
  input.select();
  const copied = document.execCommand?.('copy') === true;
  input.remove();
  if (!copied) throw new Error('Clipboard unavailable');
}

/** Keep the visual timeline signal aligned with scroll, hover and reflow. */
function initTimeline(root) {
  const items = [...root.querySelectorAll('.timeline__item')];
  const dot = qs('[data-timeline-dot]');
  if (!items.length || !dot) return;

  items.forEach((item) => {
    item._scramble = createScramble(item.querySelector('.timeline__role-name'));
  });

  const anchorY = (item) => {
    const range = item.querySelector('.timeline__range');
    return item.offsetTop + range.offsetTop + range.offsetHeight / 2;
  };

  let current = null;
  let placed = false;
  let pointerActive = false;
  let scrollRaf = 0;

  function moveTo(item, scramble = false) {
    if (!item || item === current) return;
    current = item;
    items.forEach((candidate) => candidate.classList.toggle('is-active', candidate === item));
    if (scramble && !env.reducedMotion) item._scramble?.play();

    const y = anchorY(item);
    if (!placed || env.reducedMotion) {
      gsap.set(dot, { y, opacity: 1 });
      placed = true;
    } else {
      gsap.to(dot, { y, opacity: 1, duration: 0.28, ease: 'power3.out', overwrite: true });
    }
  }

  function syncCentered() {
    scrollRaf = 0;
    if (pointerActive) return;
    const mid = innerHeight * 0.55;
    let best = null;
    let bestDistance = Infinity;
    for (const item of items) {
      const rect = item.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) continue;
      const distance = Math.abs(rect.top + Math.min(rect.height, innerHeight) / 2 - mid);
      if (distance < bestDistance) {
        best = item;
        bestDistance = distance;
      }
    }
    moveTo(best || current || items[0]);
  }

  const queueCentered = () => {
    if (!scrollRaf) scrollRaf = requestAnimationFrame(syncCentered);
  };

  items.forEach((item) => {
    item.addEventListener('pointerenter', () => {
      pointerActive = true;
      moveTo(item, true);
    });
  });
  root.addEventListener('pointerleave', () => {
    pointerActive = false;
    queueCentered();
  });
  addEventListener('scroll', queueCentered, { passive: true });
  addEventListener('resize', queueCentered, { passive: true });
  document.fonts?.ready.then(queueCentered);
  requestAnimationFrame(syncCentered);
}
