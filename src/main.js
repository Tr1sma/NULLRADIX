import "./styles/index.css";

// self-hosted variable fonts
// The wdth build contains the two axes used by the interface (weight + width)
// without shipping Roboto Flex's much heavier full axis set.
import "@fontsource-variable/roboto-flex/wdth.css";
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";

import { renderSections } from "./modules/sections.js";
import { renderProjects } from "./modules/projects.js";
import { createPanel } from "./modules/panel.js";
import { renderField } from "./field/field.js";
import { initTypo } from "./modules/typo.js";
import { initScroll } from "./modules/scroll.js";
import { initNav } from "./modules/nav.js";
import { initInterface } from "./modules/interface.js";

function boot() {
  renderSections();

  const panel = createPanel();
  const projectsApi = renderProjects(panel);

  // the plotted view of the same projects - bi-directional highlight with the list
  const fieldApi = renderField({ panel, projectsApi });
  projectsApi.onHighlight = (i) => fieldApi.highlightNode(i);

  initTypo();
  initInterface();
  initNav();
  initScroll();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
