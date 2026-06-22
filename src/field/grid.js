/**
 * Uniform spatial hash. cellSize ~= the largest query radius, so any
 * neighbor query touches at most a 3x3 block of cells -> O(neighbors).
 */
export function createGrid(cellSize) {
  let buckets = new Map();
  const key = (cx, cy) => cx * 100000 + cy;

  function rebuild(particles) {
    buckets.clear();
    for (const p of particles) {
      const cx = (p.x / cellSize) | 0;
      const cy = (p.y / cellSize) | 0;
      const k = key(cx, cy);
      let arr = buckets.get(k);
      if (!arr) buckets.set(k, (arr = []));
      arr.push(p);
    }
  }

  /** collect candidates in the 3x3 block around (x,y); caller does exact dist test */
  function queryNeighbors(x, y, out) {
    out.length = 0;
    const cx = (x / cellSize) | 0;
    const cy = (y / cellSize) | 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const arr = buckets.get(key(cx + dx, cy + dy));
        if (arr) for (let i = 0; i < arr.length; i++) out.push(arr[i]);
      }
    }
    return out;
  }

  return { rebuild, queryNeighbors };
}
