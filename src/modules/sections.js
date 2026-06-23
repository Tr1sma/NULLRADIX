import { qs, qsa, el } from '../utils/dom.js';
import { profile, skills, experience, socials } from '../data/content.js';

/** Fill the data-driven regions from content.js. */
export function renderSections() {
  document.title = `${profile.name} — ${profile.role}`;

  const status = qs('[data-profile-status]');
  if (status) status.textContent = profile.status;

  qsa('[data-profile-email]').forEach((node) => {
    node.textContent = profile.email;
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
          el('p', { class: 'timeline__range' }, `${e.from} — ${e.to}`),
          el('p', { class: 'timeline__role' }, e.role),
          el('p', { class: 'timeline__org' }, e.org),
          el('p', { class: 'timeline__summary' }, e.summary),
          e.tech
            ? el('ul', { class: 'tags' }, e.tech.map((t) => el('li', { class: 'tag' }, t)))
            : null,
        ])
      )
    );
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
