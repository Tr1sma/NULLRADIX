import gsap from 'gsap';
import { qs, qsa, el } from '../utils/dom.js';
import { profile, about, skills, experience, socials } from '../data/content.js';
import { createScramble } from '../utils/scramble.js';
import { env } from './env.js';

/** Fill the data-driven regions from content.js. */
export function renderSections() {
  document.title = `${profile.name} - ${profile.role}`;

  const status = qs('[data-profile-status]');
  if (status) status.textContent = profile.status;

  const aboutLead = qs('[data-about-lead]');
  if (aboutLead) aboutLead.textContent = about.lead;

  const aboutPrinciples = qs('[data-about-principles]');
  if (aboutPrinciples) {
    aboutPrinciples.replaceChildren(
      ...about.principles.flatMap((p) => [
        el('dt', { class: 'about__k' }, p.k),
        el('dd', { class: 'about__v' }, p.v),
      ])
    );
  }

  qsa('[data-profile-email]').forEach((node) => {
    node.textContent = profile.email;
    node.dataset.text = profile.email; // mirror for the glyph-bound glow (::before content)
    if (node.tagName === 'A') node.href = `mailto:${profile.email}`;
  });

  const skillsRoot = qs('[data-skills]');
  if (skillsRoot) {
    skillsRoot.replaceChildren(
      ...skills.map((g) =>
        el('div', { class: 'skill-group' }, [
          el('h3', { class: 'skill-group__label' }, g.group),
          el(
            'ul',
            { class: 'skill-group__items' },
            g.items.map((s) => el('li', { class: 'tag' }, s))
          ),
        ])
      )
    );
  }

  const expRoot = qs('[data-experience]');
  if (expRoot) {
    expRoot.replaceChildren(
      ...experience.map((e) =>
        el('li', { class: 'timeline__item' }, [
          el('p', { class: 'timeline__range' }, `${e.from} - ${e.to}`),
          el('p', { class: 'timeline__role' }, el('span', { class: 'timeline__role-name' }, e.role)),
          el('p', { class: 'timeline__org' }, e.org),
          el('p', { class: 'timeline__summary' }, e.summary),
          e.tech
            ? el('ul', { class: 'tags' }, e.tech.map((t) => el('li', { class: 'tag' }, t)))
            : null,
        ])
      )
    );
    initTimelineDot(expRoot);
  }

  const socialRoot = qs('[data-socials]');
  if (socialRoot) {
    socialRoot.replaceChildren(
      ...socials.map((s) =>
        el('li', {}, [
          el('a', { href: s.href, target: '_blank', rel: 'noopener' }, [
            `${s.label} `,
            el('span', { style: 'color:var(--c-far)' }, s.handle),
          ]),
        ])
      )
    );
  }

  const year = qs('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  const copyBtn = qs('[data-copy-email]');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(profile.email);
        const original = copyBtn.textContent;
        copyBtn.textContent = 'Copied ✓';
        setTimeout(() => (copyBtn.textContent = original), 1600);
      } catch {
        /* mailto link is the fallback */
      }
    });
  }
}

/** A single dot that glides down the timeline line to the hovered entry. */
function initTimelineDot(root) {
  const items = [...root.querySelectorAll('.timeline__item')];
  if (!items.length) return;

  items.forEach((it) => (it._scramble = createScramble(it.querySelector('.timeline__role-name'))));

  const dot = el('span', { class: 'timeline__dot', 'aria-hidden': 'true' });
  root.appendChild(dot);

  const anchorY = (item) => {
    // item.offsetParent is .timeline; range.offsetTop is relative to the item
    const r = item.querySelector('.timeline__range');
    return item.offsetTop + r.offsetTop + r.offsetHeight / 2 - 6; // centre the 12px dot
  };

  let current = null;
  let placed = false;
  function moveTo(item, scramble) {
    if (item === current) return; // same entry: nothing to re-trigger
    current = item;
    items.forEach((x) => x.classList.toggle('is-active', x === item));
    if (scramble) item._scramble?.play();
    const y = anchorY(item);
    if (!placed) {
      gsap.set(dot, { y, opacity: 1 });
      placed = true;
    } else {
      // slow in, fast through the middle, slow out - short so it tracks the cursor
      gsap.to(dot, { y, duration: 0.22, ease: 'expo.inOut', overwrite: true });
    }
  }

  // Snap the dot back onto the active entry after reflow (font swap, resize) -
  // anchorY depends on offsetTop, which shifts when the variable font lands.
  const resync = () => gsap.set(dot, { y: anchorY(current || items[0]) });

  moveTo(items[0]); // rest at the top entry (no scramble on load)
  document.fonts?.ready.then(resync);

  if (env.coarsePointer || env.smallScreen) {
    // Touch / narrow: no hover - the dot tracks whichever entry sits nearest the
    // viewport centre as the page scrolls (mirrors the work-list marker).
    let raf = 0;
    const syncCentered = () => {
      raf = 0;
      const mid = innerHeight / 2;
      let best = null;
      let bestD = Infinity;
      for (const it of items) {
        const r = it.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) continue; // off-screen
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestD) {
          bestD = d;
          best = it;
        }
      }
      if (best) moveTo(best, true);
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(syncCentered);
    };
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue, { passive: true });
    addEventListener('resize', resync, { passive: true });
    requestAnimationFrame(syncCentered); // light the centred entry on load
  } else {
    items.forEach((it) => it.addEventListener('pointerenter', () => moveTo(it, true)));
    addEventListener('resize', resync, { passive: true });
  }
}
