export const clamp = (v, min, max) => (v < min ? min : v > max ? max : v);

export const lerp = (a, b, t) => a + (b - a) * t;

/** map x from [a,b] to [c,d] */
export const mapRange = (x, a, b, c, d) => c + ((x - a) * (d - c)) / (b - a);

/** squared distance (skip sqrt in hot paths) */
export const dist2 = (ax, ay, bx, by) => {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
};

/** deterministic pseudo-random in [0,1) from an integer seed (no Math.random) */
export function seeded(seed) {
  let s = (seed * 1103515245 + 12345) & 0x7fffffff;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}
