/**
 * Computes the screen-space origin (0,0) — pinned to the hero wordmark so the
 * crosshair literally crosses through "NULLRADIX". Falls back to viewport
 * center once the hero scrolls away.
 */
export function createOrigin() {
  let anchor = null;

  function bind() {
    anchor = document.querySelector('#origin-h') || document.querySelector('#origin');
  }

  function get(width, height) {
    if (anchor) {
      const r = anchor.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
    return { x: width / 2, y: height / 2 };
  }

  return { bind, get };
}
