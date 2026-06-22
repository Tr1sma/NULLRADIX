const SCALE = 6; // screen px per world unit

function fmt(n) {
  const s = n < 0 ? '-' : '+';
  return s + Math.abs(n).toFixed(1).padStart(5, '0');
}

/**
 * Live (x,y) readout, self-contained. Reads the current origin each update so
 * it stays correct as the hero scrolls. Text-only writes, throttled — works
 * in every render mode (it is information, not motion).
 */
export function createHud(outputEl, originMod) {
  let raf = 0;
  let last = '';

  function render() {
    raf = 0;
    const o = originMod.get(window.innerWidth, window.innerHeight);
    const wx = (lastX - o.x) / SCALE;
    const wy = (o.y - lastY) / SCALE;
    const text = `x:${fmt(wx)}  y:${fmt(wy)}`;
    if (text !== last) {
      outputEl.textContent = text;
      last = text;
    }
  }

  let lastX = 0;
  let lastY = 0;

  function onMove(e) {
    lastX = e.clientX;
    lastY = e.clientY;
    if (!raf) raf = requestAnimationFrame(render);
  }

  function onScroll() {
    if (!raf) raf = requestAnimationFrame(render);
  }

  function bind() {
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function unbind() {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('scroll', onScroll);
  }

  return { bind, unbind };
}
