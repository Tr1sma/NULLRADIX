# Graph Report - NULLRADIX  (2026-07-13)

## Corpus Check
- 27 files · ~38,149 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 110 nodes · 190 edges · 13 communities (12 shown, 1 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5bcc843f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- field.js
- main.js
- package.json
- dependencies
- sections.js
- env.js
- NULLRADIX
- legal.js
- today-2026-07-13.md

## God Nodes (most connected - your core abstractions)
1. `el()` - 10 edges
2. `boot()` - 9 edges
3. `qs()` - 9 edges
4. `renderField()` - 8 edges
5. `NULLRADIX` - 8 edges
6. `env` - 7 edges
7. `renderSections()` - 7 edges
8. `qsa()` - 7 edges
9. `renderProjects()` - 6 edges
10. `initNav()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `boot()` --calls--> `renderField()`  [EXTRACTED]
  src/main.js → src/field/field.js
- `createHud()` --calls--> `el()`  [EXTRACTED]
  src/field/hud.js → src/utils/dom.js
- `boot()` --calls--> `initNav()`  [EXTRACTED]
  src/main.js → src/modules/nav.js
- `boot()` --calls--> `createPanel()`  [EXTRACTED]
  src/main.js → src/modules/panel.js
- `boot()` --calls--> `renderProjects()`  [EXTRACTED]
  src/main.js → src/modules/projects.js

## Import Cycles
- None detected.

## Communities (13 total, 1 thin omitted)

### Community 0 - "field.js"
Cohesion: 0.20
Nodes (9): drawCrosshair(), noop(), renderField(), createGrid(), createHud(), createNodes(), createLattice(), onEnvChange() (+1 more)

### Community 1 - "main.js"
Cohesion: 0.24
Nodes (13): projects, initNav(), createPanel(), STATUS_LABEL, initMarker(), NUM_ACTIVE, NUM_REST, renderProjects() (+5 more)

### Community 2 - "package.json"
Cohesion: 0.15
Nodes (12): description, devDependencies, vite, name, private, scripts, build, dev (+4 more)

### Community 3 - "dependencies"
Cohesion: 0.18
Nodes (11): @fontsource-variable/inter, @fontsource-variable/roboto-flex, @fontsource-variable/space-grotesk, gsap, lenis, dependencies, @fontsource-variable/inter, @fontsource-variable/roboto-flex (+3 more)

### Community 4 - "sections.js"
Cohesion: 0.31
Nodes (9): about, axes, experience, marquee, profile, skills, socials, initTimelineDot() (+1 more)

### Community 5 - "env.js"
Cohesion: 0.21
Nodes (12): boot(), env, listeners, mqCoarse, mqReduced, mqSmall, refresh(), snapshot() (+4 more)

### Community 6 - "NULLRADIX"
Cohesion: 0.22
Nodes (8): Accessibility, Deploy, Design tokens, Develop, Edit your content, How it works, NULLRADIX, Smooth scroll

### Community 11 - "today-2026-07-13.md"
Cohesion: 0.40
Nodes (4): 13:19 | main, 13:27-14:05 | main, 13:33 | main, 14:08-15:01 | main

## Knowledge Gaps
- **33 isolated node(s):** `name`, `version`, `private`, `type`, `description` (+28 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `el()` connect `main.js` to `field.js`, `sections.js`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `renderField()` connect `field.js` to `env.js`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _33 weakly-connected nodes found - possible documentation gaps or missing edges._