import './styles/index.css';

// self-hosted variable fonts
import '@fontsource-variable/roboto-flex/full.css'; // wght + wdth + opsz axes
import '@fontsource-variable/inter';
import '@fontsource-variable/space-grotesk';

import { renderSections } from './modules/sections.js';
import { renderProjects } from './modules/projects.js';
import { createPanel } from './modules/panel.js';
import { initTypo } from './modules/typo.js';
import { initScroll } from './modules/scroll.js';
import { initNav } from './modules/nav.js';

function boot() {
  renderSections();

  const panel = createPanel();
  renderProjects(panel);

  initTypo();
  initNav();
  initScroll();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
