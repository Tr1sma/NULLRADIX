import { env } from '../modules/env.js';

/** Read a CSS custom property from :root (keeps canvas colors in sync with tokens.css). */
function cssVar(name, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

/** Density tier -> lattice spacing (px) + hard particle cap. */
const TIERS = {
  high: { spacing: 30, cap: 1300 },
  mid: { spacing: 38, cap: 680 },
  low: { spacing: 50, cap: 300 },
};

export function pickTier() {
  let key = env.mode === 'animated' ? 'high' : env.mode === 'low-motion' ? 'mid' : 'low';
  if (env.cores <= 4 && key === 'high') key = 'mid';
  return TIERS[key];
}

export function readConfig() {
  return {
    colors: {
      bg: cssVar('--c-void', '#0a0b0d'),
      dot: cssVar('--c-graphite', '#5b6470'),
      dotBright: cssVar('--c-origin', '#36f1cd'),
      line: cssVar('--c-origin', '#36f1cd'),
      axis: cssVar('--c-grid', '#1c2026'),
      origin: cssVar('--c-origin', '#36f1cd'),
    },
    // interaction
    interactionRadius: 150,
    connectRadius: 46,
    maxLinksPerNode: 3,
    pointerLerp: 0.12,
    push: 0.9, // magnetic repel strength
    springK: 0.02,
    springDamp: 0.86,
    maxLineAlpha: 0.5,
    dotRadius: 1.2,
    dotRadiusBright: 2.6,
    jitter: 0.35, // lattice jitter as fraction of spacing
    targetFps: env.mode === 'animated' ? 60 : 30,
  };
}
