import { createGrid } from './grid.js';

/* gentle "jelly" lattice: each point springs back to its jittered home while
   the cursor pushes the handful of points near it (looked up via the grid). */
const REPULSE_RADIUS = 130;
const REPULSE_FORCE = 6000; // accel scale near the cursor
const SPRING = 130; // pull back to home
const DAMP = 16; // velocity damping
const MAX_SPEED = 1100;

/** Deterministic per-cell jitter so the lattice is stable across resizes. */
function hash(a, b) {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

export function createLattice(gap) {
  const grid = createGrid(REPULSE_RADIUS);
  let points = [];
  let W = 0;
  let H = 0;
  const scratch = [];

  function layout(width, height) {
    W = width;
    H = height;
    points = [];
    const cols = Math.max(1, Math.floor(width / gap));
    const rows = Math.max(1, Math.floor(height / gap));
    const offX = (width - cols * gap) / 2 + gap / 2;
    const offY = (height - rows * gap) / 2 + gap / 2;
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        const hx = offX + c * gap + (hash(c, r) - 0.5) * gap * 0.36;
        const hy = offY + r * gap + (hash(r, c) - 0.5) * gap * 0.36;
        points.push({ hx, hy, x: hx, y: hy, vx: 0, vy: 0 });
      }
    }
    grid.clear();
    points.forEach((p, i) => grid.insert(i, p.hx, p.hy));
  }

  function update(px, py, hasPointer, dt) {
    for (const p of points) {
      let ax = (p.hx - p.x) * SPRING - p.vx * DAMP;
      let ay = (p.hy - p.y) * SPRING - p.vy * DAMP;
      p.vx += ax * dt;
      p.vy += ay * dt;
    }
    if (hasPointer) {
      grid.queryNeighbors(px, py, scratch);
      for (const i of scratch) {
        const p = points[i];
        const dx = p.x - px;
        const dy = p.y - py;
        const d2 = dx * dx + dy * dy;
        if (d2 > REPULSE_RADIUS * REPULSE_RADIUS || d2 < 0.01) continue;
        const d = Math.sqrt(d2);
        const f = (1 - d / REPULSE_RADIUS) * REPULSE_FORCE;
        p.vx += (dx / d) * f * dt;
        p.vy += (dy / d) * f * dt;
      }
    }
    for (const p of points) {
      const sp = Math.hypot(p.vx, p.vy);
      if (sp > MAX_SPEED) {
        p.vx = (p.vx / sp) * MAX_SPEED;
        p.vy = (p.vy / sp) * MAX_SPEED;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
  }

  function draw(ctx, dotColor, pointer) {
    ctx.fillStyle = dotColor;
    for (const p of points) {
      let near = 0;
      if (pointer) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < REPULSE_RADIUS * REPULSE_RADIUS) near = 1 - Math.sqrt(d2) / REPULSE_RADIUS;
      }
      ctx.globalAlpha = 0.32 + near * 0.55;
      const r = 1 + near * 1.4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  return { layout, update, draw };
}
