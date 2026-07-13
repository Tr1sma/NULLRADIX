# Graph Report - NULLRADIX  (2026-07-13)

## Corpus Check
- 24 files · ~38,532 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 104 nodes · 195 edges · 11 communities (10 shown, 1 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e4b3b502`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- field.js
- main.js
- package.json
- env.js
- dependencies
- sections.js
- NULLRADIX
- projects.js
- legal.js

## God Nodes (most connected - your core abstractions)
1. `qs()` - 11 edges
2. `el()` - 10 edges
3. `boot()` - 9 edges
4. `qsa()` - 9 edges
5. `renderField()` - 8 edges
6. `NULLRADIX` - 8 edges
7. `env` - 7 edges
8. `renderProjects()` - 7 edges
9. `renderSections()` - 7 edges
10. `initFrame()` - 6 edges

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

## Communities (11 total, 1 thin omitted)

### Community 0 - "field.js"
Cohesion: 0.20
Nodes (9): drawCrosshair(), noop(), renderField(), createGrid(), createHud(), createNodes(), createLattice(), onEnvChange() (+1 more)

### Community 1 - "main.js"
Cohesion: 0.33
Nodes (10): boot(), fmt(), initFrame(), SECTORS, initNav(), createPanel(), renderSections(), initTypo() (+2 more)

### Community 2 - "package.json"
Cohesion: 0.15
Nodes (12): description, devDependencies, vite, name, private, scripts, build, dev (+4 more)

### Community 3 - "env.js"
Cohesion: 0.23
Nodes (9): env, listeners, mqCoarse, mqReduced, mqSmall, refresh(), snapshot(), initScroll() (+1 more)

### Community 4 - "dependencies"
Cohesion: 0.18
Nodes (11): @fontsource-variable/inter, @fontsource-variable/roboto-flex, @fontsource-variable/space-grotesk, gsap, lenis, dependencies, @fontsource-variable/inter, @fontsource-variable/roboto-flex (+3 more)

### Community 5 - "sections.js"
Cohesion: 0.29
Nodes (9): about, axes, experience, profile, projects, skills, socials, initTimelineDot() (+1 more)

### Community 6 - "NULLRADIX"
Cohesion: 0.22
Nodes (8): Accessibility, Deploy, Design tokens, Develop, Edit your content, How it works, NULLRADIX, Smooth scroll

### Community 7 - "projects.js"
Cohesion: 0.43
Nodes (7): fmtCoord(), initMarker(), NUM_ACTIVE, NUM_REST, renderProjects(), setNum(), el()

## Knowledge Gaps
- **29 isolated node(s):** `name`, `version`, `private`, `type`, `description` (+24 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `env` connect `env.js` to `field.js`, `main.js`, `sections.js`, `projects.js`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `renderField()` connect `field.js` to `main.js`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _29 weakly-connected nodes found - possible documentation gaps or missing edges._