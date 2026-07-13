import gsap from 'gsap';
import { env } from './env.js';

const REST = { weight: 620, width: 76 };

/**
 * Kinetic hero type. Glyph geometry is measured in one read batch and pointer
 * updates are event-driven, avoiding the former permanent layout-reading loop.
 */
export function initTypo() {
  const title = document.getElementById('hero-title');
  const hero = title?.closest('.hero');
  if (!title || !hero) return;

  const chars = [];
  title.querySelectorAll('[data-letters]').forEach((line) => {
    const text = line.textContent.trim();
    line.textContent = '';
    for (const character of text) {
      if (character === ' ') {
        line.appendChild(document.createTextNode(' '));
        continue;
      }
      const span = document.createElement('span');
      span.className = 'ch';
      span.textContent = character;
      line.appendChild(span);
      chars.push(span);
    }
  });

  const lines = title.querySelectorAll('.line__inner');
  const sub = document.querySelector('.hero__sub .line__inner');
  const setAxes = (node, weight, width) => {
    node.style.fontVariationSettings = `'wght' ${Math.round(weight)}, 'wdth' ${Math.round(width)}`;
  };
  const setAll = (weight, width) => chars.forEach((char) => setAxes(char, weight, width));

  if (env.reducedMotion) {
    setAll(REST.weight, REST.width);
    return;
  }

  const axes = { weight: 210, width: 128 };
  setAll(axes.weight, axes.width);

  let interactive = false;
  const intro = gsap.timeline({ delay: 0.12 });
  intro.from(lines, {
    yPercent: 118,
    rotate: 3,
    opacity: 0,
    duration: 1.05,
    ease: 'power4.out',
    stagger: 0.075,
  });
  intro.to(
    axes,
    {
      weight: REST.weight,
      width: REST.width,
      duration: 1.05,
      ease: 'power3.inOut',
      onUpdate: () => setAll(axes.weight, axes.width),
    },
    '-=0.82'
  );
  if (sub) {
    intro.from(sub, { yPercent: 80, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.58');
  }
  intro.eventCallback('onComplete', () => {
    interactive = true;
    measure();
  });

  let bounds = [];
  let measureRaf = 0;
  function measure() {
    measureRaf = 0;
    bounds = chars.map((char) => {
      const rect = char.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    });
  }
  const queueMeasure = () => {
    if (!measureRaf) measureRaf = requestAnimationFrame(measure);
  };

  let pointerX = -9999;
  let pointerY = -9999;
  let pointerRaf = 0;
  const radius = 280;

  function paintPointer() {
    pointerRaf = 0;
    for (let index = 0; index < chars.length; index++) {
      const point = bounds[index];
      if (!point) continue;
      const distance = Math.hypot(point.x - pointerX, point.y - pointerY);
      const proximity = Math.max(0, 1 - distance / radius);
      const eased = proximity * proximity;
      setAxes(chars[index], 390 + 540 * eased, 112 - 42 * eased);
    }
  }

  hero.addEventListener(
    'pointermove',
    (event) => {
      if (!interactive) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!pointerRaf) pointerRaf = requestAnimationFrame(paintPointer);
    },
    { passive: true }
  );
  hero.addEventListener('pointerleave', () => {
    if (!interactive) return;
    setAll(REST.weight, REST.width);
    queueMeasure();
  });

  addEventListener('resize', queueMeasure, { passive: true });
  document.fonts?.ready.then(queueMeasure);
}
