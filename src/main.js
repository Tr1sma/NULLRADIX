import "./styles/index.css";

// self-hosted variable fonts
import "@fontsource-variable/roboto-flex/full.css"; // wght + wdth + opsz axes
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";

import { renderSections } from "./modules/sections.js";
import { renderProjects } from "./modules/projects.js";
import { createPanel } from "./modules/panel.js";
import { renderField } from "./field/field.js";
import { initTypo } from "./modules/typo.js";
import { initScroll } from "./modules/scroll.js";
import { initNav } from "./modules/nav.js";
import { initFrame } from "./modules/frame.js";

function boot() {
  // disable the context menu across the entire page
  document.addEventListener("contextmenu", (e) => e.preventDefault());

  renderSections();

  const panel = createPanel();
  const projectsApi = renderProjects(panel);

  // the plotted view of the same projects - bi-directional highlight with the list
  const fieldApi = renderField({ panel, projectsApi });
  projectsApi.onHighlight = (i) => fieldApi.highlightNode(i);
  projectsApi.onClear = () => fieldApi.clearNode();

  initTypo();
  initNav();
  initScroll();
  initFrame();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
