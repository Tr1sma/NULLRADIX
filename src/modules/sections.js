import { qs, qsa, el } from '../utils/dom.js';
import { profile, skills, experience, socials } from '../data/content.js';

/** Fill the data-driven static regions: profile, skills, experience, contact, footer. */
export function renderSections() {
  // ---- profile ----
  const role = qs('[data-profile-role]');
  if (role) role.textContent = profile.role;
  const tagline = qs('[data-profile-tagline]');
  if (tagline) tagline.textContent = profile.tagline;
  qsa('[data-profile-email]').forEach((node) => {
    node.textContent = profile.email;
    if (node.tagName === 'A') node.href = `mailto:${profile.email}`;
  });
  document.title = `${profile.name} — ${profile.role}`;

  // ---- skills ----
  const skillsRoot = qs('[data-skills]');
  if (skillsRoot) {
    skillsRoot.replaceChildren(
      ...skills.map((g) =>
        el('div', { class: 'skill-group', 'data-reveal': true }, [
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

  // ---- experience ----
  const expRoot = qs('[data-experience]');
  if (expRoot) {
    expRoot.replaceChildren(
      ...experience.map((e) =>
        el('li', { class: 'timeline__item', 'data-reveal': true }, [
          el('p', { class: 'timeline__range mono' }, `${e.from} — ${e.to}`),
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

  // ---- socials ----
  const socialRoot = qs('[data-socials]');
  if (socialRoot) {
    socialRoot.replaceChildren(
      ...socials.map((s) =>
        el('li', {}, [
          el('a', { href: s.href, target: '_blank', rel: 'noopener' }, [
            `${s.label} `,
            el('span', { class: 'mono', style: 'color:var(--c-graphite)' }, s.handle),
          ]),
        ])
      )
    );
  }

  // ---- footer year ----
  const year = qs('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  // ---- copy email ----
  const copyBtn = qs('[data-copy-email]');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(profile.email);
        const original = copyBtn.textContent;
        copyBtn.textContent = 'Copied ✓';
        copyBtn.style.color = 'var(--c-origin)';
        setTimeout(() => {
          copyBtn.textContent = original;
          copyBtn.style.color = '';
        }, 1600);
      } catch {
        /* clipboard unavailable; the mailto link is the fallback */
      }
    });
  }
}
