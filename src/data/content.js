/**
 * NULLRADIX - single source of truth for content.
 * Edit this file to update the site. (The hero headline + subline live in
 * index.html since they're the one piece of brand copy.)
 */

export const profile = {
  name: 'Tristan',
  role: 'Developer',
  status: 'Available for work',
  email: 'tristan@nullradix.de',
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
 * @property {{x:number,y:number}} coord  where the project leans on the plane (each axis ~ -100..100;
 *   x: Frontend (-) ↔ Backend (+), y: Infrastructure (-) ↔ Product (+))
 */

/** @type {Project[]} */
export const projects = [
  {
    id: 'noose',
    name: 'NOOSE',
    blurb:
      'Audited, role-based case database for a GTA roleplay law-enforcement faction - linked person/faction files, investigations, threat scoring and a relationship graph, updated in real time.',
    tech: ['C#', '.NET 10', 'Blazor', 'EF Core', 'MySQL'],
    year: 2026,
    status: 'live',
    links: { live: 'https://demo.noose.info', repo: 'https://github.com/Tr1sma/NOOSE-Website' },
    coord: { x: 48, y: 45 }, // backend-heavy product (Backend + Product quadrant)
  },
  {
    id: 'tide',
    name: 'Tide',
    blurb: 'A tiny tool that turns messy CSV exports into clean, typed datasets in one drag.',
    tech: ['Rust', 'WASM', 'Vite'],
    year: 2024,
    status: 'live',
    links: { live: 'https://example.com', repo: 'https://github.com/you/tide' },
    coord: { x: -12, y: -32 }, // small data/dev tool
  },
  {
    id: 'bookheart',
    name: 'BookHeart',
    blurb:
      'A cozy Android app for tracking, rating and gamifying your reading - virtual bookshelf, reading timer, streaks, plant-growing rewards and shareable stats, fully offline on the device.',
    tech: ['C#', '.NET 10 MAUI', 'Blazor Hybrid', 'EF Core', 'SQLite'],
    year: 2025,
    status: 'live',
    links: {
      live: 'https://play.google.com/store/apps/details?id=com.bookheart.app',
      repo: 'https://github.com/Tr1sma/BookLoggerApp',
    },
    coord: { x: -28, y: 68 }, // polished consumer mobile product (Frontend + Product quadrant)
  },
  {
    id: 'relay',
    name: 'Relay',
    blurb: 'Self-hosted webhook router with a visual rule builder and replayable history.',
    tech: ['Go', 'Postgres', 'htmx'],
    year: 2023,
    status: 'archived',
    links: { repo: 'https://github.com/you/relay' },
    coord: { x: 58, y: -58 }, // backend infra / plumbing
  },
  {
    id: 'nullradix',
    name: 'nullradix.dev',
    blurb: 'This site - kinetic type, monochrome, built from scratch with no UI framework.',
    tech: ['Vanilla JS', 'GSAP', 'Vite'],
    year: 2026,
    status: 'wip',
    links: { repo: 'https://github.com/you/nullradix' },
    coord: { x: -80, y: 48 }, // frontend product (this site)
  },
];

/**
 * The plane's meaning - the four directions a project can lean toward. These
 * label the axis poles in the field; a project's `coord` places it between them.
 * Rename freely.
 * @type {{x:{neg:string,pos:string}, y:{neg:string,pos:string}}}
 */
export const axes = {
  x: { neg: 'Frontend', pos: 'Backend' },
  y: { neg: 'Infrastructure', pos: 'Product' },
};

/** @type {{lead:string, principles:{k:string,v:string}[]}} */
export const about = {
  lead: 'I build software that feels obvious - fast, durable products where the hard parts are hidden and the right thing is the easy thing to do.',
  principles: [
    { k: 'Correctness', v: 'Systems that stay right under load, and fail loudly when they don’t.' },
    { k: 'Clarity', v: 'Code and interfaces a stranger can read at a glance - including future me.' },
    { k: 'Durability', v: 'Boring, well-bounded pieces that keep working long after launch.' },
  ],
};

/** @type {{group:string, items:string[]}[]} */
export const skills = [
  { group: 'Languages', items: ['C#', 'JavaScript', 'SQL'] },
  { group: 'Backend', items: ['.NET 10', 'ASP.NET Core', 'EF Core', 'SignalR'] },
  { group: 'Frontend', items: ['Blazor', '.NET MAUI', 'Vanilla JS', 'CSS', 'GSAP'] },
  { group: 'Data & Tools', items: ['MySQL / MariaDB', 'SQLite', 'OAuth', 'CI/CD', 'Git'] },
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
  { label: 'GitHub', href: 'https://github.com/Tr1sma', handle: '@Tr1sma' },
  { label: 'Fiverr', href: 'https://de.fiverr.com/tristan_sowieja', handle: '@tristan_sowieja' },
  { label: 'X', href: 'https://x.com/you', handle: '@you' },
];

export default { profile, axes, about, projects, skills, experience, socials };
