/**
 * The projects, plotted. Each `coord:{x,y}` (-100..100) maps to a point on the
 * plane; a faint line ties it back to ORIGIN. Handles hit-testing for hover and
 * exposes each node's canvas position so the modal can grow out of it.
 */
const PAD = 56; // inset from the edges so labels stay inside
const HIT = 16; // node hover/click radius in px
const LINE_HIT = 6; // how close to the ORIGIN connector counts as a hit
const LABEL_PAD = 6; // forgiving margin around the name's hit box

/** Squared distance from point to segment a→b, plus where along it the foot lands. */
function segHit(px, py, ax, ay, bx, by) {
  const vx = bx - ax;
  const vy = by - ay;
  const len2 = vx * vx + vy * vy || 1;
  let t = ((px - ax) * vx + (py - ay) * vy) / len2;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  const dx = px - (ax + t * vx);
  const dy = py - (ay + t * vy);
  return { d2: dx * dx + dy * dy, t };
}

export function createNodes(projects) {
  let placed = [];
  let W = 0;
  let H = 0;
  let hovered = -1;

  function layout(width, height) {
    W = width;
    H = height;
    const halfW = W / 2 - PAD;
    const halfH = H / 2 - PAD;
    placed = projects.map((project, i) => ({
      project,
      i,
      cx: W / 2 + ((project.coord?.x ?? 0) / 100) * halfW,
      cy: H / 2 - ((project.coord?.y ?? 0) / 100) * halfH,
    }));
  }

  function hitTest(x, y) {
    // 1) node point - the most precise target wins outright
    let best = -1;
    let bestD = HIT * HIT;
    for (const n of placed) {
      const dx = x - n.cx;
      const dy = y - n.cy;
      const d = dx * dx + dy * dy;
      if (d < bestD) {
        bestD = d;
        best = n.i;
      }
    }
    if (best >= 0) return best;

    // 2) the name label's box
    for (const n of placed) {
      const b = n.labelBox;
      if (
        b &&
        x >= b.x0 - LABEL_PAD &&
        x <= b.x1 + LABEL_PAD &&
        y >= b.y0 - LABEL_PAD &&
        y <= b.y1 + LABEL_PAD
      ) {
        return n.i;
      }
    }

    // 3) the connector line back to ORIGIN (skip the crowded stub near the centre)
    let lineBest = -1;
    let lineBestD = LINE_HIT * LINE_HIT;
    for (const n of placed) {
      const { d2, t } = segHit(x, y, W / 2, H / 2, n.cx, n.cy);
      if (t > 0.2 && d2 < lineBestD) {
        lineBestD = d2;
        lineBest = n.i;
      }
    }
    return lineBest;
  }

  function setHovered(i) {
    hovered = i;
  }

  /** Canvas-space centre of node `i` (for the modal transform-origin). */
  function pointOf(i) {
    const n = placed.find((p) => p.i === i);
    return n ? { x: n.cx, y: n.cy } : null;
  }

  function draw(ctx, colors, font) {
    for (const n of placed) {
      const active = n.i === hovered;

      // connector back to ORIGIN
      ctx.strokeStyle = colors.line;
      ctx.globalAlpha = active ? 0.55 : 0.28;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(W / 2, H / 2);
      ctx.lineTo(n.cx, n.cy);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // node: ring + centre dot
      const col = active ? colors.origin : colors.mid;
      ctx.strokeStyle = col;
      ctx.fillStyle = col;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(n.cx, n.cy, active ? 7 : 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(n.cx, n.cy, 1.6, 0, Math.PI * 2);
      ctx.fill();

      // label - flips to the left near the right edge so it never clips
      const right = n.cx < W - 120;
      ctx.font = (active ? '600 ' : '500 ') + '12px ' + font;
      ctx.fillStyle = active ? colors.near : colors.mid;
      ctx.textBaseline = 'middle';
      ctx.textAlign = right ? 'left' : 'right';
      const anchor = n.cx + (right ? 14 : -14);
      ctx.fillText(n.project.name, anchor, n.cy);

      // remember where the label sits so it's hoverable too (see hitTest)
      const w = ctx.measureText(n.project.name).width;
      n.labelBox = {
        x0: right ? anchor : anchor - w,
        x1: right ? anchor + w : anchor,
        y0: n.cy - 8,
        y1: n.cy + 8,
      };
    }
  }

  return { layout, hitTest, setHovered, pointOf, draw };
}
