# NULLRADIX

An immersive, strictly monochrome developer portfolio built as a living
coordinate instrument. Projects are plotted from **ORIGIN / (0,0)** and the
same visual language continues through the hero, section navigation, project
atlas, capability matrix, experience rail and contact finale.

Stack: semantic HTML, modern CSS, vanilla ES modules, Canvas, GSAP,
ScrollTrigger, Lenis and Vite. No UI framework.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production output in dist/
npm run preview
```

Node 20.19+ or 22.12+ is required (see `.nvmrc`).

## Content

Portfolio content lives in [`src/data/content.js`](src/data/content.js):

- profile and availability
- about copy, principles and proof points
- projects, links and field coordinates
- skills and experience
- social profiles

The project list is the canonical accessible representation. The Canvas field
reads the same project data and acts as a pointer-enhanced overview.

Each `coord: { x, y }` uses an approximate `-100..100` range. The x-axis runs
Frontend → Backend; the y-axis runs Infrastructure → Product.

## Architecture

- `src/modules/` — data rendering, navigation, scroll orchestration, kinetic
  type, global instrument feedback and the project dossier
- `src/field/` — spatially hashed Canvas lattice, axes, HUD and project nodes
- `src/styles/` — tokens, base rules, page layout, components, field and a
  lightweight standalone legal-page entry
- `index.html` — semantic scene structure and progressive-enhancement hooks

Roboto Flex is loaded with only the weight/width axis build used by the design;
Inter and Space Grotesk provide body text and telemetry. Fonts are self-hosted.

## Accessibility and performance

- semantic landmarks, headings and list content
- skip link, visible focus states and 44px primary touch targets
- keyboard-accessible project list and focus-trapped dossier with `inert`
  background and focus restoration
- live copy feedback and meaningful external-link labels
- complete `prefers-reduced-motion` path: immediate navigation, static field,
  no scrambles, parallax, marquee or spatial dialog transitions
- touch/Save-Data capability modes and Canvas DPR cap
- Canvas animation pauses offscreen and when idle
- event-driven hero typography with cached glyph geometry (no permanent rAF)
- dedicated legal CSS bundle instead of the full portfolio scene styles

## Deploy

The output is static. `netlify.toml` is included. For a GitHub Pages project
site, change Vite's `base` in `vite.config.js`; keep `/` for a custom domain.

Replace `public/nr-avatar.png` with a dedicated optimized 1200×630 Open Graph
image if richer social previews are required.
