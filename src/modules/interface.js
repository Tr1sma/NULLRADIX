import { env } from './env.js';

/**
 * Lightweight, page-wide instrument feedback: scroll position, system time,
 * pointer light and a restrained amount of local parallax. All pointer work is
 * event-driven and disabled for touch, Save-Data and reduced-motion modes.
 */
export function initInterface() {
  const root = document.documentElement;
  const time = document.querySelector('[data-system-time]');

  const updateTime = () => {
    if (!time) return;
    const now = new Date();
    time.dateTime = now.toISOString();
    time.textContent = new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(now);
  };
  updateTime();
  const clock = window.setInterval(updateTime, 1000);
  addEventListener('pagehide', () => clearInterval(clock), { once: true });

  let scrollRaf = 0;
  const updateScroll = () => {
    scrollRaf = 0;
    const range = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const progress = Math.min(1, Math.max(0, scrollY / range));
    root.style.setProperty('--scroll-progress', progress.toFixed(4));
  };
  const queueScroll = () => {
    if (!scrollRaf) scrollRaf = requestAnimationFrame(updateScroll);
  };
  addEventListener('scroll', queueScroll, { passive: true });
  addEventListener('resize', queueScroll, { passive: true });
  updateScroll();

  if (env.mode !== 'animated') return;

  let pointerRaf = 0;
  let pointerX = innerWidth / 2;
  let pointerY = innerHeight / 2;
  const paintPointer = () => {
    pointerRaf = 0;
    root.style.setProperty('--pointer-x', `${pointerX}px`);
    root.style.setProperty('--pointer-y', `${pointerY}px`);
  };
  addEventListener(
    'pointermove',
    (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!pointerRaf) pointerRaf = requestAnimationFrame(paintPointer);
    },
    { passive: true }
  );

  const hero = document.querySelector('.hero');
  const reticle = document.querySelector('[data-reticle]');
  if (hero && reticle) {
    hero.addEventListener(
      'pointermove',
      (event) => {
        const rect = hero.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width - 0.5;
        const ny = (event.clientY - rect.top) / rect.height - 0.5;
        reticle.style.setProperty('--reticle-x', `${(nx * 24).toFixed(2)}px`);
        reticle.style.setProperty('--reticle-y', `${(ny * 18).toFixed(2)}px`);
      },
      { passive: true }
    );
    hero.addEventListener('pointerleave', () => {
      reticle.style.setProperty('--reticle-x', '0px');
      reticle.style.setProperty('--reticle-y', '0px');
    });
  }

  document.querySelectorAll('[data-magnetic]').forEach((control) => {
    control.addEventListener(
      'pointermove',
      (event) => {
        const rect = control.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.08;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.12;
        control.style.setProperty('--magnetic-x', `${x.toFixed(2)}px`);
        control.style.setProperty('--magnetic-y', `${y.toFixed(2)}px`);
      },
      { passive: true }
    );
    control.addEventListener('pointerleave', () => {
      control.style.setProperty('--magnetic-x', '0px');
      control.style.setProperty('--magnetic-y', '0px');
    });
  });
}
