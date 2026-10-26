# GraphX — Development Roadmap

This roadmap prioritizes a correct, usable graphing engine first, then expands mathematical coverage and introduces acceleration based on evidence. Timings are intentionally omitted: progress depends on learning, testing, and the complexity of each feature.

## Guiding strategy

- React + TypeScript + Vite are the application foundation from day one.
- Canvas 2D is the first renderer, chosen for a simple correctness baseline.
- The mathematical core remains independent of the renderer.
- WebGL 2 is added after profiling identifies rendering bottlenecks.
- C++ is introduced for selected performance-sensitive or reusable algorithms.
- WebAssembly is considered for running selected C++ modules in the browser.
- CUDA remains an optional native compute experiment for workloads that justify it.
- Each phase ends with tests and an explicit acceptance check.

## Phase 0 — Research and specification [COMPLETE]

Status: completed.

## Phase 1 — Modern frontend foundation [COMPLETE]

**Deliverables**
- Verified behavior matrix for the reference calculator.
- A list of supported syntax and expression categories.
- Initial user-flow sketches and acceptance tests.
- Architecture decision records for the technology strategy.

**Exit criteria**
- MVP scope is explicit.
- Every MVP feature has at least one example and expected behavior.
- No assumptions about private internals are presented as facts.

## Phase 1 — Modern frontend foundation

**Deliverables**
- React + TypeScript + Vite app.
- Strict type checking, linting, formatting, unit testing, and CI.
- Responsive expression panel, graph area, and toolbar.
- Typed application state.

**Status:** Completed — build, tests, responsive layout, typed state verified.

## Phase 2 — Mathematical parser and evaluator [IN PROGRESS]

**Deliverables**
- Lexer and parser.
- AST definitions.
- Operator precedence and function-call handling.
- Numeric evaluator and structured diagnostics.
- Grammar documentation and test fixtures.

**Initial syntax target**
- Numeric literals and constants.
- Variables.
- `+`, `-`, `*`, `/`, and `^`.
- Parentheses and unambiguous implicit multiplication.
- Common functions: `sin`, `cos`, `tan`, `sqrt`, `abs`, `log`, `ln`, `exp`.
- Explicit functions written as `y = f(x)`.

**Exit criteria**
- Parser and evaluator pass unit tests for valid input, invalid input, precedence, and numeric edge cases.
- User expressions are never executed with `eval()`.

## Phase 3 — Coordinate system and first renderer

**Deliverables**
- World-to-screen and screen-to-world transforms.
- Adaptive grid, axes, tick labels, and viewport resizing.
- Canvas 2D renderer behind a renderer interface.
- Explicit-function sampling and discontinuity safeguards.

**Exit criteria**
- `y=x`, `y=2x+1`, `y=x^2`, and `y=sin(x)` render correctly.
- Coordinate-transform invariants are tested.
- Resize, pan, and zoom do not break coordinate alignment.

## Phase 4 — MVP expression workflow

**Deliverables**
- Multiple expression rows.
- Add, edit, delete, hide/show, and color assignment.
- Live graph updates and useful error messages.
- Pan, zoom, reset-view, and basic axis bounds.

**Exit criteria**
- An invalid expression does not break other expressions.
- Essential graphing and navigation flows pass browser tests.
- MVP can be used without developer tools.

## Phase 5 — Variables and interactivity

**Deliverables**
- Constants and shared variable bindings.
- Dependency tracking and circular-definition detection.
- Sliders with ranges and steps.
- Optional parameter animation.
- Point plotting and domain restrictions.

**Exit criteria**
- Changing a variable updates all dependent expressions correctly.
- Dependency errors are visible and recoverable.

## Phase 6 — Expanded mathematical graph types

**Deliverables**
- Implicit equations via a suitable contouring algorithm.
- Inequality region rendering.
- Parametric and polar curves.
- Points and multiple branches.

**Exit criteria**
- Tests cover circles, multiple-branch curves, discontinuities, and shaded regions.
- Algorithms and known limitations are documented.

## Phase 7 — Data and analysis

**Deliverables**
- Editable tables and scatter plots.
- Basic descriptive statistics.
- Initial regression support.
- Root finding, intersection exploration, numerical derivatives, and integration.

**Exit criteria**
- Numerical methods are tested against known cases.
- Approximate results and limitations are clearly communicated.

## Phase 8 — Performance measurement and WebGL

**Deliverables**
- Repeatable benchmark suite.
- Profiling of render time, evaluation time, and input-to-display latency.
- WebGL 2 renderer behind the existing interface.
- Context-loss handling and Canvas fallback.

**Exit criteria**
- Benchmarks identify where WebGL helps.
- WebGL output passes visual/numerical comparison tests.
- Canvas remains available as a fallback.

## Phase 9 — C++ and WebAssembly

**Deliverables**
- CMake-based native module.
- Cross-language correctness tests.
- A narrow JavaScript/Wasm API for selected operations.
- Repeatable native, Wasm, and TypeScript benchmarks.

**Exit criteria**
- A real bottleneck or architectural benefit justifies the port.
- Native results match the TypeScript reference within documented tolerances.
- The web application still works without the Wasm module.

## Phase 10 — CUDA research

**Deliverables**
- A measured candidate workload.
- CPU baseline, CUDA implementation, and correctness tests.
- End-to-end benchmarks including memory transfers.
- A written decision on where CUDA belongs in the product.

**Exit criteria**
- CUDA is used only for a workload where it produces a defensible benefit.
- The browser app does not assume direct CUDA availability.
- A CPU fallback remains available.

## Phase 11 — Production polish

**Deliverables**
- Keyboard and accessibility improvements.
- Graph save/load and a versioned document format.
- Robust error recovery and responsive behavior.
- Dependency/license audit, documentation, demo, and release notes.

**Exit criteria**
- CI passes from a clean checkout.
- Installation, supported syntax, limitations, and architecture are documented.
- A new contributor can run the app using the README.

## MVP definition

The MVP is complete when a user can:

1. Open GraphX in a browser.
2. Add multiple explicit function expressions.
3. See functions rendered over a labeled Cartesian grid.
4. Edit, hide, and delete expressions.
5. Pan and zoom the graph.
6. Recover from invalid mathematical input without reloading.
7. Run the test suite and production build successfully.

**Not required for MVP:** CUDA, native C++, WebAssembly, WebGL, regression, implicit equations, or calculus. These remain planned extensions; the architecture should make them possible without blocking the first release.
