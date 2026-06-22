/**
 * Capability snapshot + live updates. Render decisions key off this.
 *  mode: 'animated' | 'low-motion' | 'static'
 */
const mqReduced = matchMedia('(prefers-reduced-motion: reduce)');
const mqCoarse = matchMedia('(pointer: coarse)');
const mqSmall = matchMedia('(max-width: 640px)');

function snapshot() {
  const reducedMotion = mqReduced.matches;
  const coarsePointer = mqCoarse.matches;
  const smallScreen = mqSmall.matches;
  const saveData = navigator.connection?.saveData === true;
  const cores = navigator.hardwareConcurrency || 4;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let mode = 'animated';
  if (reducedMotion || saveData) mode = 'static';
  else if (coarsePointer || smallScreen) mode = 'low-motion';

  return { reducedMotion, coarsePointer, smallScreen, saveData, cores, dpr, mode };
}

export const env = snapshot();

const listeners = new Set();

/** subscribe to env changes; returns unsubscribe */
export function onEnvChange(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function refresh() {
  Object.assign(env, snapshot());
  for (const cb of listeners) cb(env);
}

for (const mq of [mqReduced, mqCoarse, mqSmall]) {
  mq.addEventListener?.('change', refresh);
}
