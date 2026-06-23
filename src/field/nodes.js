/**
 * The projects, plotted. Each `coord:{x,y}` (-100..100) maps to a point on the
 * plane; a faint line ties it back to ORIGIN. Handles hit-testing for hover and
 * exposes each node's canvas position so the modal can grow out of it.
 */
const PAD = 56; // inset from the edges so labels stay inside
const HIT = 16; // hover/click radius in px

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
    return best;
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
      ctx.fillText(n.project.name, n.cx + (right ? 14 : -14), n.cy);
    }
  }

  return { layout, hitTest, setHovered, pointOf, draw };
}
