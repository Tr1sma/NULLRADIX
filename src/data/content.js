/**
 * NULLRADIX — single source of truth.
 * Edit THIS file to update the whole site. The accessible list and the
 * plotted coordinate view both read from the same arrays below.
 *
 * coord: normalized position on the plane, each axis roughly -100..100.
 *        x ~ domain/category, y ~ recency. Only used for the plotted view.
 */

export const profile = {
  name: 'NULLRADIX',
  role: 'Software Developer',
  tagline: 'Plotting systems from (0,0).',
  email: 'you@example.com',
};

/**
 * @typedef {Object} Project
 * @property {string} id      stable slug
 * @property {string} name
 * @property {string} blurb   one or two sentences
 * @property {string[]} tech
 * @property {number} year
 * @property {'live'|'wip'|'archived'} [status]
 * @property {{x:number,y:number}} coord  normalized -100..100
 * @property {{live?:string,repo?:string,docs?:string}} links
 */

/** @type {Project[]} */
export const projects = [
  {
    id: 'forge',
    name: 'Forge',
    blurb: 'A desktop tool that turns rough ideas into shippable scaffolds in seconds.',
    tech: ['TypeScript', 'Electron', 'Vite'],
    year: 2025,
    status: 'live',
    coord: { x: -58, y: 64 },
    links: { live: 'https://example.com', repo: 'https://github.com/you/forge' },
  },
  {
    id: 'pulse',
    name: 'Pulse',
    blurb: 'Real-time analytics dashboard with sub-100ms streaming updates.',
    tech: ['Rust', 'WebSockets', 'Canvas'],
    year: 2025,
    status: 'live',
    coord: { x: 46, y: 52 },
    links: { live: 'https://example.com', repo: 'https://github.com/you/pulse' },
  },
  {
    id: 'atlas',
    name: 'Atlas',
    blurb: 'Offline-first mobile app for mapping field data without a connection.',
    tech: ['React Native', 'SQLite', 'MapLibre'],
    year: 2024,
    status: 'live',
    coord: { x: -30, y: 8 },
    links: { live: 'https://example.com', repo: 'https://github.com/you/atlas' },
  },
  {
    id: 'cipher',
    name: 'Cipher',
    blurb: 'A zero-dependency client-side encryption playground and teaching tool.',
    tech: ['JavaScript', 'WebCrypto'],
    year: 2024,
    status: 'wip',
    coord: { x: 70, y: -16 },
    links: { repo: 'https://github.com/you/cipher' },
  },
  {
    id: 'nullradix',
    name: 'nullradix.dev',
    blurb: 'This site — a portfolio that behaves like a graphing instrument.',
    tech: ['Vanilla JS', 'Canvas', 'Vite'],
    year: 2026,
    status: 'live',
    coord: { x: 0, y: 88 },
    links: { repo: 'https://github.com/you/nullradix' },
  },
  {
    id: 'relay',
    name: 'Relay',
    blurb: 'Self-hosted webhook router with a visual rule builder.',
    tech: ['Go', 'Postgres', 'htmx'],
    year: 2023,
    status: 'archived',
    coord: { x: 24, y: -64 },
    links: { repo: 'https://github.com/you/relay' },
  },
];

/** @type {{group:string, items:string[]}[]} */
export const skills = [
  { group: 'Languages', items: ['TypeScript', 'Rust', 'Go', 'Python'] },
  { group: 'Frontend', items: ['Vanilla JS', 'CSS', 'Canvas / WebGL', 'React'] },
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
    summary: 'Lead frontend architecture for a real-time data product used by thousands.',
    tech: ['TypeScript', 'Rust', 'Canvas'],
  },
  {
    org: 'Studio North',
    role: 'Full-stack Developer',
    from: '2021',
    to: '2023',
    summary: 'Built and shipped client apps end to end, from API to interface.',
    tech: ['Node', 'React', 'Postgres'],
  },
  {
    org: 'Freelance',
    role: 'Developer',
    from: '2019',
    to: '2021',
    summary: 'Designed and delivered small products for early-stage founders.',
    tech: ['JavaScript', 'PHP'],
  },
];

/** @type {{label:string, href:string, handle:string}[]} */
export const socials = [
  { label: 'GitHub', href: 'https://github.com/you', handle: '@you' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/you', handle: '/in/you' },
  { label: 'X', href: 'https://x.com/you', handle: '@you' },
];

export default { profile, projects, skills, experience, socials };
