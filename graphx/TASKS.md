# GraphX — Task Checklist

Use `[ ]` for pending, `[x]` for completed, and add notes or links to commits for substantial milestones. Check off a task only when its acceptance criteria are met.

## 0. Project setup and research

- [x] Create the repository and establish the default branch.
- [x] Add `README.md`, `TASKS.md`, `ROADMAP.md`, and `ARCHITECTURE.md`.
- [x] Scaffold React + TypeScript with Vite.
- [x] Enable TypeScript strict mode.
- [x] Configure ESLint and Prettier.
- [x] Configure Vitest and React Testing Library.
- [x] Configure Playwright for end-to-end browser tests.
- [x] Add CI to run type checking, linting, tests, and production build.
- [x] Define initial layout breakpoints and accessibility expectations.
- [x] Create `docs/research/feature-matrix.md`.
- [x] Create a reproducible observation template: initial state, action, result, edge cases.
- [x] Record verified behavioral requirements without copying proprietary assets or code.
- [x] Add an initial architecture decision record (ADR) for the TypeScript-first strategy.

## 1. Application shell

- [x] Create the main React application shell.
- [x] Create a responsive expression-panel / graph-canvas layout.
- [x] Create the expression row component.
- [x] Create graph toolbar controls.
- [x] Add a basic settings panel.
- [x] Define accessible labels, focus states, and keyboard behavior.
- [x] Create a typed application-state model.
- [x] Separate persistent graph state from transient UI state.
- [x] Add a small set of original design tokens for spacing, typography, and colors.

**Acceptance:** the application loads without errors, layout responds to resizing, and controls have accessible names.

## 2. Mathematical representation

- [x] Define TypeScript types for tokens, AST nodes, expressions, and diagnostics.
- [x] Implement a lexer for numbers, identifiers, operators, parentheses, commas, and supported symbols.
- [x] Add unit tests for tokenization and invalid characters.
- [x] Implement a parser with explicit operator precedence.
- [x] Support unary plus and minus.
- [x] Support parentheses and implicit multiplication where unambiguous.
- [x] Support exponentiation with carefully specified associativity.
- [x] Support function calls such as `sin(x)` and `sqrt(x)`.
- [x] Define supported constants such as `pi` and `e`.
- [x] Produce helpful parse errors with source positions.
- [x] Build an AST pretty-printer for debugging.
- [x] Document grammar and operator precedence.

**Acceptance:** parser tests cover valid input, precedence, whitespace, malformed expressions, and edge cases. Do not evaluate user input with `eval()`.

## 3. Evaluation engine

- [ ] Implement AST evaluation for numeric expressions.
- [ ] Implement arithmetic operators and supported functions.
- [ ] Define handling for division by zero, invalid logarithms, and non-finite results.
- [ ] Add evaluation tests with known expected values.
- [ ] Separate variable bindings from expression ASTs.
- [ ] Add expression diagnostics that can be shown in the UI.
- [ ] Add limits for expression length and evaluation work.
- [ ] Add deterministic behavior for errors and unsupported syntax.

**Acceptance:** the evaluator returns a numeric result or a structured error; it never crashes the UI.

## 4. Coordinate system and Canvas 2D renderer

- [ ] Define a `ViewState` with world bounds or center + scale.
- [ ] Implement world-to-screen coordinate conversion.
- [ ] Implement screen-to-world coordinate conversion.
- [ ] Test round-trip coordinate conversion.
- [ ] Render the background and grid.
- [ ] Calculate readable grid spacing at different zoom levels.
- [ ] Render axes and tick labels.
- [ ] Handle device-pixel ratio and canvas resizing.
- [ ] Implement a renderer interface independent of the math engine.
- [ ] Render a test point and a simple line.
- [ ] Add clipping to the visible graph viewport.
- [ ] Avoid connecting across discontinuities or non-finite samples.

**Acceptance:** axes and points stay aligned during resize, zoom, and pan; coordinate transforms pass tests.

## 5. Explicit function plotting — first MVP graph

- [ ] Recognize explicit forms such as `y = f(x)`.
- [ ] Sample a function across the visible x-domain.
- [ ] Choose a sampling density based on viewport size.
- [ ] Convert samples to screen coordinates.
- [ ] Draw continuous segments.
- [ ] Detect large jumps and discontinuities conservatively.
- [ ] Support polynomials and common elementary functions.
- [ ] Add distinct colors per expression.
- [ ] Test `y=x`, `y=2x+1`, `y=x^2`, and `y=sin(x)`.
- [ ] Test a function with a vertical asymptote, such as `y=1/x`.
- [ ] Add a graph-level error state for unsupported expression types.

**Acceptance:** several functions render correctly, update when edited, and do not draw misleading lines across obvious discontinuities.

## 6. Expression management

- [ ] Add an expression row.
- [ ] Edit an expression.
- [ ] Delete an expression.
- [ ] Toggle expression visibility.
- [ ] Assign a stable ID to each expression.
- [ ] Assign a distinct color to each visible expression.
- [ ] Keep text, parsed AST, diagnostics, and visibility state distinct.
- [ ] Update only affected expressions when practical.
- [ ] Preserve other expressions when one expression is invalid.
- [ ] Add component and interaction tests.

**Acceptance:** multiple expressions can be independently created, edited, hidden, and deleted.

## 7. Pan, zoom, and view controls

- [ ] Pan by dragging the graph.
- [ ] Zoom in and out around the pointer location.
- [ ] Add zoom controls.
- [ ] Add reset-view.
- [ ] Add optional fit-to-graph behavior.
- [ ] Add configurable axis bounds.
- [ ] Handle pointer capture and interrupted drags.
- [ ] Keep the graph stable across window resize.
- [ ] Test zoom-anchor behavior and coordinate invariants.
- [ ] Add keyboard alternatives for essential navigation actions.

**Acceptance:** navigation is smooth, predictable, and does not shift the graph unexpectedly.

## 8. Variables and sliders

- [ ] Support constant definitions such as `a = 2`.
- [ ] Define scope and duplicate-variable rules.
- [ ] Resolve dependencies between expressions.
- [ ] Detect circular variable definitions.
- [ ] Identify free parameters where safe and unambiguous.
- [ ] Add manually configurable sliders.
- [ ] Support slider min, max, step, and current value.
- [ ] Re-evaluate only dependent expressions where practical.
- [ ] Support optional animation with play/pause.
- [ ] Test invalid ranges and dependency cycles.

**Acceptance:** changing a parameter updates every dependent graph consistently.

## 9. Points and domain restrictions

- [ ] Support coordinate points such as `(2, 3)`.
- [ ] Render and label points.
- [ ] Support movable points if the state model allows them cleanly.
- [ ] Support explicit function domain restrictions.
- [ ] Test points outside the visible viewport.
- [ ] Define point selection and dragging interactions.

## 10. Implicit equations and inequalities

- [ ] Define a typed expression classification system.
- [ ] Implement implicit equation evaluation for `F(x,y)=0`.
- [ ] Prototype marching squares for implicit curves.
- [ ] Handle ambiguous marching-squares cases.
- [ ] Test circles, ellipses, and curves with multiple branches.
- [ ] Define an approach for inequality region shading.
- [ ] Test `y > x^2` and `x^2 + y^2 <= r^2`.
- [ ] Keep sampling resolution tied to the viewport.
- [ ] Benchmark dense implicit plots.

**Acceptance:** implicit curves render without assuming they are single-valued functions of x.

## 11. Parametric and polar equations

- [ ] Define parameterized expression types.
- [ ] Sample parametric curves over a parameter interval.
- [ ] Support examples such as `x=cos(t), y=sin(t)`.
- [ ] Support polar expressions such as `r=2cos(theta)`.
- [ ] Add configurable parameter domains.
- [ ] Handle discontinuities and closed curves.
- [ ] Add numerical and visual regression tests.

## 12. Tables, points, and statistics

- [ ] Add editable x/y data tables.
- [ ] Render table rows as points.
- [ ] Support multiple datasets.
- [ ] Validate incomplete and invalid cells.
- [ ] Add basic summary statistics.
- [ ] Implement a clearly documented initial regression method.
- [ ] Test regression against known datasets.
- [ ] Keep data plotting independent from expression plotting.

## 13. Mathematical analysis tools

- [ ] Implement robust root-finding for supported function classes.
- [ ] Add intersection detection with documented limitations.
- [ ] Add numerical derivative estimation.
- [ ] Add numerical definite integration.
- [ ] Add local maxima/minima exploration.
- [ ] Display approximate results and relevant tolerances.
- [ ] Test difficult cases and communicate numerical limitations.

## 14. WebGL renderer

- [ ] Define rendering benchmarks for representative graphs.
- [ ] Profile Canvas 2D before porting.
- [ ] Design a WebGL 2 renderer behind the renderer interface.
- [ ] Render grid and axes using GPU-friendly primitives.
- [ ] Choose a curve representation and upload strategy.
- [ ] Manage shaders, buffers, resizing, and device-pixel ratio.
- [ ] Handle WebGL context loss and fallback to Canvas 2D.
- [ ] Compare visual correctness against Canvas output.
- [ ] Benchmark startup cost, frame time, and many-expression workloads.
- [ ] Keep Canvas 2D as a reliable fallback until WebGL is proven stable.

**Acceptance:** WebGL has measured benefits for defined workloads and matches required visual behavior.

## 15. Native C++ core and WebAssembly

- [ ] Create `native/` with CMake.
- [ ] Establish C++ unit-test infrastructure.
- [ ] Identify a measured, self-contained hot path to port.
- [ ] Implement the selected algorithm in C++ without UI dependencies.
- [ ] Create cross-language reference tests against TypeScript.
- [ ] Benchmark native performance against TypeScript.
- [ ] Evaluate Emscripten for browser deployment.
- [ ] Define a narrow, typed JS/Wasm interface.
- [ ] Add build scripts and document toolchain requirements.
- [ ] Keep the TypeScript implementation as a fallback/reference.
- [ ] Avoid duplicating the entire math engine until the benefit is demonstrated.

**Acceptance:** the native component is correct, independently tested, reproducibly built, and measurably useful.

## 16. CUDA research track

- [ ] Select a genuinely parallel workload with enough work to amortize transfer and launch overhead.
- [ ] Establish a CPU baseline and reproducible dataset.
- [ ] Prototype the algorithm in C++ first.
- [ ] Implement an optional CUDA version on supported NVIDIA hardware.
- [ ] Compare correctness against CPU results within defined tolerances.
- [ ] Benchmark kernel time and end-to-end time, including data transfers.
- [ ] Document GPU hardware, compiler, build flags, and methodology.
- [ ] Decide whether the use case is native-only, remote compute, or unsuitable for CUDA.
- [ ] Keep CUDA optional and avoid making the basic web app depend on it.

**Acceptance:** CUDA is retained only if it provides a demonstrated benefit for a specific workload.

## 17. Reliability, performance, and UX

- [ ] Add keyboard-only workflows.
- [ ] Test screen-reader labels and focus order.
- [ ] Verify responsive behavior on narrow and wide screens.
- [ ] Add safe persistence for graph state.
- [ ] Add import/export of a versioned graph document format.
- [ ] Add shareable graph-state URLs only after encoding and size limits are defined.
- [ ] Add error boundaries and recovery paths.
- [ ] Profile typing-to-render latency.
- [ ] Profile many-expression and dense-sampling scenarios.
- [ ] Add performance budgets based on measurements.
- [ ] Test browser compatibility and WebGL fallback.
- [ ] Audit dependencies and document licenses.

## 18. Release readiness

- [ ] Complete the MVP acceptance checklist in `ROADMAP.md`.
- [ ] Ensure CI passes on a clean checkout.
- [ ] Write installation and development instructions.
- [ ] Document supported syntax and limitations.
- [ ] Document architecture and renderer selection.
- [ ] Publish a demo with original GraphX branding.
- [ ] Record benchmark methodology and results.
- [ ] Tag the first stable MVP release.
