import './styles/index.css';

// self-hosted variable fonts (latin subset fetched via unicode-range)
import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';

import { qs } from './utils/dom.js';
import { renderSections } from './modules/sections.js';
import { renderProjects } from './modules/projects.js';
import { renderNodes } from './modules/nodes.js';
import { createPanel } from './modules/panel.js';
import { initReveal } from './modules/reveal.js';
import { initNav } from './modules/nav.js';
import { initScroll } from './modules/scroll.js';
import { createField } from './field/field.js';

function boot() {
  renderSections();

  const panel = createPanel();
  const projectsCtrl = renderProjects(panel);
  renderNodes(projectsCtrl, panel);

  initReveal();
  initNav();
  initScroll();

  const canvas = qs('#field');
  const hud = qs('#hud');
  if (canvas && hud) {
    const field = createField(canvas, hud);
    field.mount();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
