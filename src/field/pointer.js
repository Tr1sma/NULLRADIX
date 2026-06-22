/** Raw pointer + eased pointer for the magnetic feel. */
export function createPointer(lerp) {
  const raw = { x: 0, y: 0 };
  const eased = { x: 0, y: 0 };
  let active = false;
  let seeded = false;

  function onMove(e) {
    raw.x = e.clientX;
    raw.y = e.clientY;
    if (!seeded) {
      eased.x = raw.x;
      eased.y = raw.y;
      seeded = true;
    }
    active = true;
  }

  function onLeave() {
    active = false;
  }

  function bind() {
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave, { passive: true });
    window.addEventListener('blur', onLeave, { passive: true });
  }

  function unbind() {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerleave', onLeave);
    window.removeEventListener('blur', onLeave);
  }

  function update() {
    eased.x += (raw.x - eased.x) * lerp;
    eased.y += (raw.y - eased.y) * lerp;
  }

  return {
    bind,
    unbind,
    update,
    get active() {
      return active;
    },
    get x() {
      return eased.x;
    },
    get y() {
      return eased.y;
    },
    get rawX() {
      return raw.x;
    },
    get rawY() {
      return raw.y;
    },
  };
}
