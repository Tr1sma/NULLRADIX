/**
 * The instrument's frame: faint axes through the centre, the four direction
 * labels at the axis poles, a bright ORIGIN mark pinned to (0,0), and - only
 * while animated - a crosshair tracking the cursor.
 */
export function drawCrosshair(ctx, W, H, colors, pointer, axes, font) {
  const cx = W / 2;
  const cy = H / 2;

  // faint full-bleed axes
  ctx.strokeStyle = colors.line;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.moveTo(0, cy);
  ctx.lineTo(W, cy);
  ctx.moveTo(cx, 0);
  ctx.lineTo(cx, H);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // cursor crosshair (animated mode only)
  if (pointer) {
    ctx.strokeStyle = colors.far;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.moveTo(0, pointer.y);
    ctx.lineTo(W, pointer.y);
    ctx.moveTo(pointer.x, 0);
    ctx.lineTo(pointer.x, H);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // ORIGIN mark - bright ticks + ring at (0,0)
  ctx.strokeStyle = colors.origin;
  ctx.lineWidth = 1.5;
  const t = 9;
  ctx.beginPath();
  ctx.moveTo(cx - t, cy);
  ctx.lineTo(cx + t, cy);
  ctx.moveTo(cx, cy - t);
  ctx.lineTo(cx, cy + t);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.stroke();

  // the four direction labels at the axis poles
  if (axes && font) {
    const pad = 12;
    ctx.fillStyle = colors.far;
    ctx.font = '600 11px ' + font;
    ctx.letterSpacing = '1.5px';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(axes.y.pos.toUpperCase(), cx, pad); // top
    ctx.textBaseline = 'bottom';
    ctx.fillText(axes.y.neg.toUpperCase(), cx, H - pad); // bottom
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillText(axes.x.neg.toUpperCase(), pad, cy - 12); // left, nudged off the axis
    ctx.textAlign = 'right';
    ctx.fillText(axes.x.pos.toUpperCase(), W - pad, cy - 12); // right
    ctx.letterSpacing = '0px'; // reset so node labels aren't affected
  }
}
