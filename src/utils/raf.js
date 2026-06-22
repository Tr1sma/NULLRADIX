/**
 * One shared requestAnimationFrame loop. Subscribers get the timestamp each
 * frame. The loop only runs while there is at least one subscriber, so an
 * idle page costs nothing. Per-subscriber throttling is the subscriber's job.
 */
const subs = new Set();
let running = false;

function loop(now) {
  if (subs.size === 0) {
    running = false;
    return;
  }
  requestAnimationFrame(loop);
  for (const cb of subs) cb(now);
}

export function onFrame(cb) {
  subs.add(cb);
  if (!running) {
    running = true;
    requestAnimationFrame(loop);
  }
  return () => subs.delete(cb);
}
