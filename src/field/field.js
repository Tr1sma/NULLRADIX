import { env, onEnvChange } from '../modules/env.js';
import { projects, axes } from '../data/content.js';
import { createLattice } from './particles.js';
import { drawCrosshair } from './crosshair.js';
import { createNodes } from './nodes.js';
import { createHud } from './hud.js';

const noop = () => ({ highlightNode() {}, clearNode() {}, destroy() {} });

/**
 * The coordinate instrument. Projects are plotted around ORIGIN on a canvas;
 * a jittered lattice reacts to the cursor; hovering a node cross-highlights the
 * work list, clicking opens the shared modal grown out of the clicked point.
 *
 * Render modes (env.mode): 'animated' runs the rAF loop; 'low-motion' and
 * 'static' draw a single calm frame (nodes stay tappable). The loop also pauses
 * whenever the field scrolls out of view.
 */
export function renderField({ panel, projectsApi } = {}) {
  const root = document.querySelector('[data-field]');
  if (!root) return noop();
  const canvas = root.querySelector('[data-field-canvas]');
  const hudNode = root.querySelector('[data-field-hud]');
  const ctx = canvas?.getContext('2d');
  if (!ctx) return noop();

  const gap = env.cores <= 4 ? 40 : 32;
  const lattice = createLattice(gap);
  const nodes = createNodes(projects);
  const hud = createHud(hudNode);

  let W = 1;
  let H = 1;
  let colors = readColors();
  let ffLabel = readVar('--ff-label') || 'sans-serif';
  const pointer = { x: 0, y: 0, on: false };
  let hovered = -1;

  let rafLoop = 0;
  let rafOnce = 0;
  let rafScramble = 0;
  let lastT = 0;
  let visible = true;
  let idleTimer = 0;

  const animated = () => env.mode === 'animated';

  function readVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  function readColors() {
    return {
      line: readVar('--c-line'),
      far: readVar('--c-far'),
      mid: readVar('--c-mid'),
      near: readVar('--c-near'),
      origin: readVar('--c-origin'),
    };
  }

  // ---------- sizing ----------
  function resize() {
    const r = canvas.getBoundingClientRect();
    W = Math.max(1, Math.round(r.width));
    H = Math.max(1, Math.round(r.height));
    canvas.width = Math.round(W * env.dpr);
    canvas.height = Math.round(H * env.dpr);
    ctx.setTransform(env.dpr, 0, 0, env.dpr, 0, 0);
    lattice.layout(W, H);
    nodes.layout(W, H);
    paint(animated() && pointer.on);
  }

  // ---------- drawing ----------
  function paint(motion) {
    ctx.clearRect(0, 0, W, H);
    const p = motion && pointer.on ? pointer : null;
    lattice.draw(ctx, colors.mid, p);
    drawCrosshair(ctx, W, H, colors, p, axes, ffLabel);
    nodes.draw(ctx, colors, ffLabel);
    updateHud(p);
  }

  function updateHud(p) {
    if (env.mode === 'static') return hud.set(0, 0, 'ORIGIN');
    const name = hovered >= 0 ? projects[hovered].name.toUpperCase() : null;
    if (p) hud.set(((p.x - W / 2) / (W / 2)) * 100, ((H / 2 - p.y) / (H / 2)) * 100, name || '§ WORK');
    else hud.set(0, 0, name || 'ORIGIN');
  }

  /** Coalesced single frame - used by the non-animated modes and hover updates. */
  function renderOnce() {
    if (rafOnce) return;
    rafOnce = requestAnimationFrame(() => {
      rafOnce = 0;
      paint(false);
    });
  }

  /**
   * Drive a few frames so a label's decode flourish actually animates when the
   * main rAF loop isn't running (low-motion / static / reduced-motion). No-op in
   * animated mode - the loop already repaints every frame.
   */
  function pumpScramble() {
    // If the main loop is idle (the normal state while the list drives the
    // sticky field), briefly paint just enough frames for the label decode.
    if (rafLoop || rafScramble) return;
    const step = () => {
      paint(false);
      rafScramble = nodes.isScrambling() ? requestAnimationFrame(step) : 0;
    };
    rafScramble = requestAnimationFrame(step);
  }

  // ---------- animated loop ----------
  function tick(t) {
    const dt = Math.min(0.033, lastT ? (t - lastT) / 1000 : 0.016);
    lastT = t;
    lattice.update(pointer.x, pointer.y, pointer.on, dt);
    paint(true);
    rafLoop = requestAnimationFrame(tick);
  }
  function startLoop() {
    if (rafLoop || !animated() || !visible) return;
    lastT = 0;
    rafLoop = requestAnimationFrame(tick);
  }
  function stopLoop() {
    if (rafLoop) cancelAnimationFrame(rafLoop);
    rafLoop = 0;
  }

  // ---------- pointer ----------
  function toLocal(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function setHover(i, fromList) {
    if (i === hovered) return;
    hovered = i;
    nodes.setHovered(i, !env.reducedMotion);
    if (!fromList) {
      if (i >= 0) projectsApi?.highlight?.(i);
      else projectsApi?.clearHighlight?.();
    }
    if (i >= 0) pumpScramble();
    else if (!rafLoop) renderOnce();
  }
  function onMove(e) {
    const p = toLocal(e);
    pointer.x = p.x;
    pointer.y = p.y;
    pointer.on = true;
    const h = nodes.hitTest(p.x, p.y);
    canvas.style.cursor = h >= 0 ? 'pointer' : '';
    setHover(h, false);
    if (animated()) {
      clearTimeout(idleTimer);
      startLoop();
    } else renderOnce(); // reflect the live coord without a loop
  }
  function onLeave() {
    pointer.on = false;
    canvas.style.cursor = '';
    setHover(-1, false);
    if (animated()) {
      clearTimeout(idleTimer);
      // Let the displaced lattice settle, then stop consuming frames entirely.
      idleTimer = window.setTimeout(() => {
        stopLoop();
        renderOnce();
      }, 900);
    } else renderOnce();
  }
  function onClick(e) {
    const p = toLocal(e);
    const i = nodes.hitTest(p.x, p.y);
    if (i < 0 || !panel) return;
    const rect = canvas.getBoundingClientRect();
    const c = nodes.pointOf(i);
    const left = rect.left + c.x;
    const top = rect.top + c.y;
    panel.open(projects[i], i + 1, {
      getBoundingClientRect: () => ({
        left,
        top,
        right: left,
        bottom: top,
        x: left,
        y: top,
        width: 0,
        height: 0,
      }),
    });
  }

  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('click', onClick);

  // ---------- pause when scrolled out of view ----------
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible) (animated() && pointer.on ? startLoop() : renderOnce());
        else stopLoop();
      },
      { threshold: 0 }
    ).observe(root);
  }

  // ---------- react to size + capability changes ----------
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  else addEventListener('resize', resize, { passive: true });

  onEnvChange(() => {
    colors = readColors();
    ffLabel = readVar('--ff-label') || ffLabel;
    stopLoop();
    resize();
    if (animated() && visible && pointer.on) startLoop();
  });

  // redraw once webfonts land (canvas labels otherwise fall back on first paint)
  document.fonts?.ready?.then(() => {
    if (!animated()) renderOnce();
  });

  // initial
  resize();
  renderOnce();

  return {
    // list → field highlight (no callback back into the list)
    highlightNode(i) {
      setHover(i, true);
    },
    clearNode() {
      setHover(-1, true);
    },
    destroy() {
      stopLoop();
      clearTimeout(idleTimer);
      if (rafOnce) cancelAnimationFrame(rafOnce);
      if (rafScramble) cancelAnimationFrame(rafScramble);
    },
  };
}
