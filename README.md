# GraphX

**GraphX** is an original, interactive mathematical visualization engine inspired by the capabilities and usability of modern graphing calculators. The project aims to combine a responsive browser-based experience with a well-tested mathematical core that can later be accelerated using WebGL and native C++.

> **Project principle:** reproduce observable functionality and interaction patterns through our own implementation. Do not copy proprietary source code, branding, visual assets, or private implementation details from other products.

## Vision

Build a graphing calculator where users can enter mathematical expressions, see them plotted immediately, manipulate variables, explore graphs, and eventually work with implicit equations, inequalities, tables, statistics, and numerical calculus.

GraphX is also a learning project: the mathematical engine, rendering pipeline, and performance trade-offs should be understood and documented rather than hidden behind a third-party graphing library.

## Planned technology stack

| Layer | Target technology | Purpose |
|---|---|---|
| Frontend | React + TypeScript | Component-based, typed UI and application state |
| Build tooling | Vite + TypeScript | Fast development, bundling, and type checking |
| Styling | CSS (optionally CSS Modules) | Responsive layout and visual system |
| Initial renderer | Canvas 2D | Establish correct graphing behavior quickly |
| Advanced renderer | WebGL 2 | GPU-driven rendering for suitable workloads |
| Mathematical core | TypeScript initially | Lexer, parser, AST, evaluator, sampling, and numerical methods |
| Native core | C++ (C++20 or newer where supported) | Portable, testable high-performance math components |
| Browser/native bridge | WebAssembly (Wasm), likely Emscripten | Run selected C++ code in the browser when justified |
| Optional compute path | CUDA | Experiment with large parallel workloads on supported NVIDIA hardware |
| Testing | Vitest + React Testing Library + Playwright | Unit, component, and browser interaction tests |
| Quality | ESLint + Prettier + TypeScript strict mode | Consistent, maintainable code |

### Technology strategy

Use React, TypeScript, and Vite from the beginning rather than building a throwaway plain-HTML application and migrating everything later. Start with Canvas 2D to validate the coordinate system and mathematical behavior; introduce WebGL when profiling demonstrates a benefit. Keep the math core renderer-independent. Develop the TypeScript implementation first, then port selected, measured hot paths to C++ and optionally WebAssembly. CUDA is a later experimental compute backend, not a requirement for basic browser rendering: ordinary web browsers cannot directly execute CUDA kernels, and CUDA generally belongs in a native service/application or a carefully designed remote-compute setup.

## MVP scope

The first useful release should support:

- An expression list with add, edit, delete, and visibility toggles.
- Explicit functions such as `y = x^2`, `y = 2x + 1`, and `y = sin(x)`.
- A correctly scaled Cartesian grid, axes, and tick labels.
- Pan, zoom, and reset-view controls.
- Multiple expressions with distinct colors.
- Parser and evaluation errors that do not crash the application.
- Automated tests for parser behavior, coordinate transforms, and core interactions.

## Longer-term features

- Constants, shared variables, and sliders.
- Points and point lists.
- Domain restrictions and inequalities.
- Implicit equations, using a suitable algorithm such as marching squares.
- Parametric and polar equations.
- Tables and scatter plots.
- Intersections, roots, extrema, and numerical calculus.
- Data regression and basic statistics.
- Save/load graph state and shareable graph documents.
- Accessibility, keyboard navigation, responsive layout, and performance profiling.
- Optional C++/Wasm and CUDA-backed numerical experiments.

## Repository layout (target)

```text
graphx/
├── README.md
├── TASKS.md
├── ROADMAP.md
├── ARCHITECTURE.md
├── package.json
├── index.html
├── public/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── state/
│   ├── components/
│   │   ├── expression-panel/
│   │   ├── graph-toolbar/
│   │   └── settings-panel/
│   ├── features/
│   │   ├── expressions/
│   │   ├── sliders/
│   │   └── tables/
│   ├── math/
│   │   ├── lexer/
│   │   ├── parser/
│   │   ├── ast/
│   │   ├── evaluator/
│   │   └── numerical/
│   ├── graph/
│   │   ├── coordinates/
│   │   ├── sampling/
│   │   └── renderers/
│   │       ├── Canvas2DRenderer.ts
│   │       └── WebGLRenderer.ts
│   ├── workers/
│   ├── styles/
│   └── main.tsx
├── native/
│   ├── CMakeLists.txt
│   ├── include/graphx/
│   ├── src/
│   └── tests/
├── wasm/
├── cuda/
├── tests/
│   ├── e2e/
│   └── fixtures/
└── docs/
    ├── research/
    ├── decisions/
    └── benchmarks/
```

This is a target structure, not a requirement to create every folder immediately. Add directories when their first implementation is needed.

## Development principles

1. **Correctness before acceleration.** Establish reference cases and numerical tests before optimizing.
2. **Separate concerns.** UI state, parsed math, sampling, coordinate transforms, and rendering must remain independent.
3. **Renderer independence.** Mathematical expressions must not depend on Canvas or WebGL APIs.
4. **Incremental migration.** Keep a working TypeScript baseline while native code is introduced.
5. **Profile before porting.** Use benchmarks to select C++/Wasm/CUDA workloads.
6. **Handle invalid input safely.** Never use JavaScript `eval()` to evaluate user expressions.
7. **Document design decisions.** Record why algorithms and technologies are chosen.
8. **Respect intellectual property.** Learn from publicly observable behavior and documentation; implement original code and visual design.

## Local development

Once the initial Vite project is scaffolded:

```bash
npm install
npm run dev
```

Common quality checks (scripts will be added during setup):

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Native components will use CMake and a C++ compiler when that phase begins.

## Definition of done

A feature is complete only when:
- Its behavior is documented.
- Normal and edge cases are tested.
- It works with other existing features.
- Type checking and relevant tests pass.
- No unrelated regressions are introduced.
- Any performance claim is supported by a repeatable benchmark.

## Reference and research

Use the public graphing calculator as a behavioral reference, not as a source-code template: https://www.desmos.com/calculator

Record observations, test expressions, screenshots you create yourself, and expected outcomes in `docs/research/`. Treat observed behavior as a requirement only after it has been verified.

## Status

**Current focus:** establish the React + TypeScript project structure and build the first correct graphing slice: expression input → parsing/evaluation → sampling → coordinate transform → Canvas rendering.
