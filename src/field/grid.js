/**
 * Tiny spatial hash over the lattice home positions. The cursor only ever
 * pushes points in its own cell + the 8 neighbours, so proximity is
 * O(neighbors) instead of O(points) per frame.
 */
export function createGrid(cellSize) {
  const cells = new Map();
  const key = (cx, cy) => cx + ',' + cy;

  return {
    clear() {
      cells.clear();
    },
    insert(i, x, y) {
      const k = key(Math.floor(x / cellSize), Math.floor(y / cellSize));
      let bucket = cells.get(k);
      if (!bucket) cells.set(k, (bucket = []));
      bucket.push(i);
    },
    /** Fill `out` with the point indices in the cursor cell and its neighbours. */
    queryNeighbors(x, y, out) {
      out.length = 0;
      const cx = Math.floor(x / cellSize);
      const cy = Math.floor(y / cellSize);
      for (let gx = cx - 1; gx <= cx + 1; gx++) {
        for (let gy = cy - 1; gy <= cy + 1; gy++) {
          const bucket = cells.get(key(gx, gy));
          if (bucket) for (const i of bucket) out.push(i);
        }
      }
      return out;
    },
  };
}
