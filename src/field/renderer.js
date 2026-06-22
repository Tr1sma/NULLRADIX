import { env } from '../modules/env.js';

/** Owns the canvas + 2d context, DPR scaling and the draw primitives. */
export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d', { alpha: false });
  let width = 0;
  let height = 0;
  let cfg = null;

  function resize() {
    const dpr = (env.dpr = Math.min(window.devicePixelRatio || 1, 2));
    width = canvas.clientWidth || window.innerWidth;
    height = canvas.clientHeight || window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // draw in CSS pixels
  }

  function setConfig(next) {
    cfg = next;
  }

  function clear() {
    ctx.fillStyle = cfg.colors.bg || '#0a0b0d';
    ctx.fillRect(0, 0, width, height);
  }

  function drawCrosshair(ox, oy) {
    ctx.strokeStyle = cfg.colors.axis;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, oy + 0.5);
    ctx.lineTo(width, oy + 0.5);
    ctx.moveTo(ox + 0.5, 0);
    ctx.lineTo(ox + 0.5, height);
    ctx.stroke();

    // origin ring
    ctx.strokeStyle = cfg.colors.origin;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.arc(ox, oy, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function drawParticles(particles, brightSet) {
    const r = cfg.dotRadius;
    // base dots in one path
    ctx.fillStyle = cfg.colors.dot;
    ctx.beginPath();
    for (const p of particles) {
      if (brightSet && brightSet.has(p)) continue;
      ctx.moveTo(p.x + r, p.y);
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    }
    ctx.fill();

    if (brightSet && brightSet.size) {
      const rb = cfg.dotRadiusBright;
      ctx.fillStyle = cfg.colors.dotBright;
      ctx.beginPath();
      for (const p of brightSet) {
        ctx.moveTo(p.x + rb, p.y);
        ctx.arc(p.x, p.y, rb, 0, Math.PI * 2);
      }
      ctx.fill();
    }
  }

  function drawLines(lines) {
    if (!lines.length) return;
    ctx.strokeStyle = cfg.colors.line;
    ctx.lineWidth = 1;
    for (const [ax, ay, bx, by, alpha] of lines) {
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  return {
    resize,
    setConfig,
    clear,
    drawCrosshair,
    drawParticles,
    drawLines,
    get width() {
      return width;
    },
    get height() {
      return height;
    },
  };
}
