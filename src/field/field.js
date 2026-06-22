import { onFrame } from '../utils/raf.js';
import { env, onEnvChange } from '../modules/env.js';
import { readConfig, pickTier } from './config.js';
import { createRenderer } from './renderer.js';
import { seedParticles } from './particles.js';
import { createGrid } from './grid.js';
import { createPointer } from './pointer.js';
import { createOrigin } from './crosshair.js';
import { createHud } from './hud.js';

export function createField(canvas, hudEl) {
  const renderer = createRenderer(canvas);
  const origin = createOrigin();
  const hud = createHud(hudEl, origin);
  let cfg = readConfig();
  let pointer = null;
  let particles = [];
  let grid = null;
  let stopLoop = null;
  let visible = true;
  let last = 0;
  const scratch = [];
  const scratch2 = [];

  function buildField() {
    cfg = readConfig();
    renderer.setConfig(cfg);
    renderer.resize();
    const tier = pickTier();
    particles = seedParticles(renderer.width, renderer.height, tier);
    grid = createGrid(cfg.interactionRadius);
  }

  // ---- animated hot loop ----
  function tick(now) {
    if (now - last < 1000 / cfg.targetFps) return;
    last = now;

    pointer.update();
    const o = origin.get(renderer.width, renderer.height);
    grid.rebuild(particles);

    const ir = cfg.interactionRadius;
    const ir2 = ir * ir;
    const brightR2 = (ir * 0.42) * (ir * 0.42);
    const bright = new Set();

    if (pointer.active) {
      const near = grid.queryNeighbors(pointer.x, pointer.y, scratch);
      for (let i = 0; i < near.length; i++) {
        const p = near[i];
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < ir2) {
          const d = Math.sqrt(d2) || 0.0001;
          const force = (1 - d / ir) * cfg.push;
          p.vx += (dx / d) * force;
          p.vy += (dy / d) * force;
          if (d2 < brightR2) bright.add(p);
        }
      }
    }

    // spring back to home + integrate
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.vx += (p.ox - p.x) * cfg.springK;
      p.vy += (p.oy - p.y) * cfg.springK;
      p.vx *= cfg.springDamp;
      p.vy *= cfg.springDamp;
      p.x += p.vx;
      p.y += p.vy;
    }

    renderer.clear();
    renderer.drawCrosshair(o.x, o.y);

    // constellation lines near the pointer
    const lines = [];
    if (pointer.active && bright.size) {
      const cr = cfg.connectRadius;
      const cr2 = cr * cr;
      for (const a of bright) {
        let links = 0;
        const partners = grid.queryNeighbors(a.x, a.y, scratch2);
        for (let i = 0; i < partners.length && links < cfg.maxLinksPerNode; i++) {
          const b = partners[i];
          if (b === a) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < cr2) {
            const pd = Math.hypot(a.x - pointer.x, a.y - pointer.y);
            const alpha = (1 - Math.sqrt(d2) / cr) * (1 - pd / ir) * cfg.maxLineAlpha;
            if (alpha > 0.02) {
              lines.push([a.x, a.y, b.x, b.y, alpha]);
              links++;
            }
          }
        }
      }
    }
    renderer.drawLines(lines);
    renderer.drawParticles(particles, bright);
  }

  // ---- single static frame (static / low-motion modes) ----
  function renderStatic() {
    const o = origin.get(renderer.width, renderer.height);
    renderer.clear();
    renderer.drawCrosshair(o.x, o.y);
    renderer.drawParticles(particles, null);
  }

  function startAnimated() {
    if (stopLoop) return;
    pointer = pointer || createPointer(cfg.pointerLerp);
    pointer.bind();
    stopLoop = onFrame(tick);
  }

  function stopAnimated() {
    if (stopLoop) {
      stopLoop();
      stopLoop = null;
    }
    pointer?.unbind();
  }

  // keep the crosshair following the wordmark while scrolling in non-animated
  // modes (where there is no per-frame loop to redraw it)
  let staticScrollRaf = 0;
  function onStaticScroll() {
    if (staticScrollRaf) return;
    staticScrollRaf = requestAnimationFrame(() => {
      staticScrollRaf = 0;
      renderStatic();
    });
  }

  function apply() {
    buildField();
    stopAnimated();
    window.removeEventListener('scroll', onStaticScroll);
    if (env.mode === 'animated' && visible) {
      startAnimated();
    } else {
      renderStatic();
      window.addEventListener('scroll', onStaticScroll, { passive: true });
    }
  }

  // ---- lifecycle wiring ----
  let resizeTimer = 0;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(apply, 150);
  }

  function onVisibility() {
    visible = !document.hidden;
    if (env.mode !== 'animated') return;
    if (visible) startAnimated();
    else stopAnimated();
  }

  function mount() {
    origin.bind();
    hud.bind();
    apply();
    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    onEnvChange(apply);

    // pause work when the field (always full-viewport) is irrelevant is N/A;
    // instead pause when the document is hidden (handled above).
    if (import.meta.hot) import.meta.hot.dispose(destroy);
  }

  function destroy() {
    stopAnimated();
    hud.unbind();
    window.removeEventListener('resize', onResize);
    window.removeEventListener('scroll', onStaticScroll);
    document.removeEventListener('visibilitychange', onVisibility);
  }

  return { mount, destroy };
}
