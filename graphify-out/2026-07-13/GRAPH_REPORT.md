# Graph Report - NULLRADIX  (2026-07-13)

## Corpus Check
- 27 files · ~38,168 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 111 nodes · 191 edges · 14 communities (12 shown, 2 thin omitted)
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
- projects.js
- legal.js
- today-2026-07-13.md
- projects.js

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
- `boot()` --calls--> `renderProjects()`  [EXTRACTED]
  src/main.js → src/modules/projects.js
- `boot()` --calls--> `initScroll()`  [EXTRACTED]
  src/main.js → src/modules/scroll.js
- `renderProjects()` --calls--> `qs()`  [EXTRACTED]
  src/modules/projects.js → src/utils/dom.js

## Import Cycles
- None detected.

## Communities (14 total, 2 thin omitted)

### Community 0 - "field.js"
Cohesion: 0.17
Nodes (11): axes, projects, drawCrosshair(), noop(), renderField(), createGrid(), createHud(), createNodes() (+3 more)

### Community 1 - "main.js"
Cohesion: 0.29
Nodes (9): boot(), initNav(), createPanel(), STATUS_LABEL, initScrollFill(), renderSections(), initTypo(), qs() (+1 more)

### Community 2 - "package.json"
Cohesion: 0.15
Nodes (12): description, devDependencies, vite, name, private, scripts, build, dev (+4 more)

### Community 3 - "dependencies"
Cohesion: 0.18
Nodes (11): @fontsource-variable/inter, @fontsource-variable/roboto-flex, @fontsource-variable/space-grotesk, gsap, lenis, dependencies, @fontsource-variable/inter, @fontsource-variable/roboto-flex (+3 more)

### Community 4 - "sections.js"
Cohesion: 0.36
Nodes (8): about, experience, marquee, profile, skills, socials, initTimelineDot(), createScramble()

### Community 5 - "env.js"
Cohesion: 0.24
Nodes (9): env, listeners, mqCoarse, mqReduced, mqSmall, refresh(), snapshot(), initScroll() (+1 more)

### Community 6 - "NULLRADIX"
Cohesion: 0.22
Nodes (8): Accessibility, Deploy, Design tokens, Develop, Edit your content, How it works, NULLRADIX, Smooth scroll

### Community 7 - "projects.js"
Cohesion: 0.40
Nodes (4): 13:27 | main, 13:33 | main, 14:05 | main, 14:08 | main

### Community 13 - "projects.js"
Cohesion: 0.48
Nodes (6): initMarker(), NUM_ACTIVE, NUM_REST, renderProjects(), setNum(), el()

## Knowledge Gaps
- **34 isolated node(s):** `name`, `version`, `private`, `type`, `description` (+29 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `el()` connect `projects.js` to `field.js`, `main.js`, `sections.js`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `renderField()` connect `field.js` to `main.js`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _34 weakly-connected nodes found - possible documentation gaps or missing edges._