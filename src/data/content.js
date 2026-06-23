/**
 * NULLRADIX — single source of truth for content.
 * Edit this file to update the site. (The hero headline + subline live in
 * index.html since they're the one piece of brand copy.)
 */

export const profile = {
  name: 'NULLRADIX',
  role: 'Developer',
  status: 'Available for work',
  email: 'you@example.com',
};

/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} name
 * @property {string} blurb
 * @property {string[]} tech
 * @property {number} year
 * @property {'live'|'wip'|'archived'} [status]
 * @property {{live?:string,repo?:string,docs?:string}} links
 */

/** @type {Project[]} */
export const projects = [
  {
    id: 'ledger-engine',
    name: 'Ledger Engine',
    blurb: 'A double-entry accounting core that stays correct under load — fast, auditable, hard to misuse.',
    tech: ['TypeScript', 'Go', 'Postgres'],
    year: 2025,
    status: 'live',
    links: { live: 'https://example.com', repo: 'https://github.com/you/ledger-engine' },
  },
  {
    id: 'tide',
    name: 'Tide',
    blurb: 'A tiny tool that turns messy CSV exports into clean, typed datasets in one drag.',
    tech: ['Rust', 'WASM', 'Vite'],
    year: 2024,
    status: 'live',
    links: { live: 'https://example.com', repo: 'https://github.com/you/tide' },
  },
  {
    id: 'quiet-hours',
    name: 'Quiet Hours',
    blurb: 'A focus app that protects your deep-work time and gets out of the way.',
    tech: ['Swift', 'SwiftUI'],
    year: 2023,
    status: 'live',
    links: { live: 'https://example.com' },
  },
  {
    id: 'relay',
    name: 'Relay',
    blurb: 'Self-hosted webhook router with a visual rule builder and replayable history.',
    tech: ['Go', 'Postgres', 'htmx'],
    year: 2023,
    status: 'archived',
    links: { repo: 'https://github.com/you/relay' },
  },
  {
    id: 'nullradix',
    name: 'nullradix.dev',
    blurb: 'This site — kinetic type, monochrome, built from scratch with no UI framework.',
    tech: ['Vanilla JS', 'GSAP', 'Vite'],
    year: 2026,
    status: 'wip',
    links: { repo: 'https://github.com/you/nullradix' },
  },
];

/** @type {{group:string, items:string[]}[]} */
export const skills = [
  { group: 'Languages', items: ['TypeScript', 'Rust', 'Go', 'Python'] },
  { group: 'Frontend', items: ['Vanilla JS', 'CSS', 'GSAP', 'React'] },
  { group: 'Backend', items: ['Node', 'Postgres', 'Redis', 'REST / WS'] },
  { group: 'Tooling', items: ['Vite', 'Git', 'Docker', 'CI/CD'] },
];

/** @type {{org:string, role:string, from:string, to:string, summary:string, tech?:string[]}[]} */
export const experience = [
  {
    org: 'Acme Labs',
    role: 'Senior Developer',
    from: '2023',
    to: 'Present',
    summary: 'Lead frontend architecture for a real-time product used by thousands every day.',
    tech: ['TypeScript', 'Rust'],
  },
  {
    org: 'Studio North',
    role: 'Full-stack Developer',
    from: '2021',
    to: '2023',
    summary: 'Built and shipped client apps end to end, from API design to the last pixel.',
    tech: ['Node', 'React', 'Postgres'],
  },
  {
    org: 'Freelance',
    role: 'Developer',
    from: '2019',
    to: '2021',
    summary: 'Designed and delivered small products for early-stage founders.',
    tech: ['JavaScript'],
  },
];

/** @type {{label:string, href:string, handle:string}[]} */
export const socials = [
  { label: 'GitHub', href: 'https://github.com/you', handle: '@you' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/you', handle: '/in/you' },
  { label: 'X', href: 'https://x.com/you', handle: '@you' },
];

export default { profile, projects, skills, experience, socials };
