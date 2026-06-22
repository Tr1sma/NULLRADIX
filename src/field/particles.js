import { seeded } from '../utils/math.js';

/**
 * Seed a jittered lattice across the viewport so it reads as a coordinate
 * plane rather than random noise. Returns a particle array, count capped by tier.
 */
export function seedParticles(width, height, tier) {
  const { spacing, cap } = tier;
  const rand = seeded(1337);
  const j = spacing * 0.35;
  const cols = Math.ceil(width / spacing) + 1;
  const rows = Math.ceil(height / spacing) + 1;

  const particles = [];
  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      const ox = gx * spacing + (rand() - 0.5) * j;
      const oy = gy * spacing + (rand() - 0.5) * j;
      particles.push({ ox, oy, x: ox, y: oy, vx: 0, vy: 0, cell: -1 });
      if (particles.length >= cap) return particles;
    }
  }
  return particles;
}
