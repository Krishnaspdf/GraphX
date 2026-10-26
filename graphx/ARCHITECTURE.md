# GraphX — Architecture

## 1. Architectural goals

GraphX should have a responsive user interface, a mathematically correct and testable core, replaceable rendering backends, and a path to native acceleration. It should not depend on a particular renderer to understand or evaluate expressions.

Primary goals:

- Separate UI, state, math, sampling, and rendering.
- Keep mathematical operations deterministic where practical.
- Test math independently of the browser.
- Provide a reliable Canvas 2D baseline.
- Add WebGL, C++, WebAssembly, and CUDA only behind clear boundaries.
- Preserve a working TypeScript implementation as a correctness reference.

## 2. High-level system

```text
┌────────────────────────────────────────────────────────────┐
│                     React + TypeScript UI                  │
│  Expression Panel | Toolbar | Settings | Sliders | Tables  │
└─────────────────────────────┬──────────────────────────────┘
                              │ user actions / view state
                              ▼
┌────────────────────────────────────────────────────────────┐
│                  Application State Layer                   │
│ expressions | variables | styles | viewport | preferences  │
└─────────────────────────────┬──────────────────────────────┘
                              │ typed expression records
                              ▼
┌────────────────────────────────────────────────────────────┐
│                      Math Front End                        │
│ Lexer → Parser → AST → Validation → Dependency Analysis    │
└─────────────────────────────┬──────────────────────────────┘
                              │ valid AST + variable bindings
                              ▼
┌────────────────────────────────────────────────────────────┐
│                    Mathematical Core                       │
│ Evaluator | Sampling | Numerical Methods | Diagnostics     │
└─────────────────────────────┬──────────────────────────────┘
                              │ graph primitives / samples
                              ▼
┌────────────────────────────────────────────────────────────┐
│                    Graph Rendering API                     │
│       View Transform | Clipping | Render Scheduling        │
└─────────────────────────────┬──────────────────────────────┘
                              │ renderer interface
                  ┌───────────┴────────────┐
                  ▼                        ▼
       ┌──────────────────┐     ┌──────────────────┐
       │ Canvas 2D        │     │ WebGL 2          │
       │ initial baseline │     │ profiled backend │
       └──────────────────┘     └──────────────────┘

Optional compute implementations, not required for the initial app:
TypeScript baseline ↔ narrow compute interface ↔ C++/WebAssembly
Native C++ application or service ↔ optional CUDA implementation
```

## 3. Suggested source layout

```text
src/
├── app/
│   ├── App.tsx
│   └── state/
├── components/
│   ├── expression-panel/
│   ├── graph-toolbar/
│   └── settings-panel/
├── features/
│   ├── expressions/
│   ├── sliders/
│   └── tables/
├── math/
│   ├── lexer/
│   ├── parser/
│   ├── ast/
│   ├── evaluator/
│   ├── variables/
│   └── numerical/
├── graph/
│   ├── coordinates/
│   ├── sampling/
│   ├── primitives/
│   └── renderers/
├── workers/
├── styles/
└── main.tsx

native/
├── CMakeLists.txt
├── include/graphx/
├── src/
└── tests/

wasm/
cuda/
tests/
├── unit/
├── component/
└── e2e/
docs/
├── research/
├── decisions/
└── benchmarks/
```

Create folders incrementally as components are implemented. Avoid creating empty abstractions without a current use case.

## 4. Core data models

These are conceptual TypeScript types. Refine them as the implementation grows.

```ts
type ExpressionId = string;

type ExpressionKind =
  | "explicit-function"
  | "implicit-equation"
  | "inequality"
  | "point"
  | "parametric"
  | "polar"
  | "constant"
  | "table";

interface ExpressionRecord {
  id: ExpressionId;
  source: string;
  visible: boolean;
  color: string;
  kind?: ExpressionKind; // determined or validated by parsing/classification
}

interface Diagnostic {
  code: string;
  message: string;
  start?: number;
  end?: number;
}

interface ViewState {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

interface ScreenPoint {
  x: number;
  y: number;
}

interface MathPoint {
  x: number;
  y: number;
}
```

Store the source text separately from the AST so the user can edit exactly what they entered. Parsed ASTs and evaluation results can be cached and invalidated when their source or dependencies change.

## 5. Mathematical pipeline

### 5.1 Lexing

Convert characters into tokens: numeric literals, identifiers, operators, parentheses, commas, and supported relation symbols.

The lexer should preserve source positions so errors can be highlighted in the expression editor.

### 5.2 Parsing

Build an AST using a documented grammar and explicit operator precedence. Do not parse mathematics using ad hoc string replacements alone. Define the behavior of implicit multiplication, exponentiation associativity, unary minus, and function calls.

### 5.3 Validation and classification

Validate syntax, names, variable dependencies, and expression type. A valid AST does not necessarily mean an expression is drawable as a single-valued `y=f(x)` curve.

### 5.4 Evaluation

Evaluate the AST against explicit variable bindings. Return a number or a structured diagnostic. Handle non-finite values and domain errors deliberately.

Never execute user-provided expressions through JavaScript `eval()` or `Function()`.

### 5.5 Sampling

Use a sampling strategy appropriate to the expression kind:

- Explicit function: sample x-values over the visible domain.
- Implicit equation: evaluate a two-dimensional field and extract contours, for example with marching squares.
- Inequality: classify or shade the region using an appropriate sampling strategy.
- Parametric curve: sample the parameter interval.
- Polar curve: sample angle and convert radius/angle into x/y.
- Points/table: map data points directly.

Avoid drawing lines through non-finite samples or obvious discontinuities. Adaptive sampling can be added when fixed sampling is insufficient.

## 6. Coordinate system

Use a single, documented world-to-screen transform. The math engine operates in world coordinates; renderers operate in screen pixels.

For world bounds `xMin`, `xMax`, `yMin`, `yMax` and viewport dimensions `W`, `H`:

```text
screenX = (worldX - xMin) / (xMax - xMin) * W
screenY = H - (worldY - yMin) / (yMax - yMin) * H
```

Implement the inverse transform and test round trips. Handle canvas device-pixel ratio separately from CSS layout dimensions.

For zoom around a pointer, map the pointer to world coordinates before and after changing scale and adjust the viewport so that world point stays under the pointer.

## 7. Renderer interface

The math engine must not import Canvas or WebGL APIs. Define a renderer contract with operations such as resize, render, and dispose. Pass it validated render data and viewport information, not React components or UI state.

Canvas 2D is the first implementation. WebGL 2 is a second implementation selected only after performance measurements. Keep renderer-specific resources internal to each backend.

The renderer is responsible for drawing; it should not own the expression editor, parse source strings, or decide variable semantics.

## 8. State and update flow

1. User edits an expression.
2. React updates the expression's source text.
3. The math front end parses and validates the new source.
4. Dependencies are resolved and affected expressions are marked dirty.
5. The evaluator/sampler produces updated graph data.
6. The renderer receives the updated data and viewport.
7. The graph redraws.
8. Diagnostics are displayed in the corresponding expression row.

Use stable expression IDs. Avoid re-parsing every expression for every pointer movement. View changes should normally trigger resampling/rendering without rebuilding unchanged ASTs.

For expensive operations, a Web Worker may keep the UI responsive. Worker messages should use serializable data and version IDs so stale results can be discarded.

## 9. Native C++ and WebAssembly boundary

Start with a complete, testable TypeScript math path. Introduce native code only after benchmarks identify a specific hot path or a strong portability reason.

Good candidates might include bulk numerical evaluation or a specialized numerical algorithm. Keep the boundary narrow and typed, for example: input arrays + parameters → output arrays + status.

C++ code should not depend on React, DOM, Canvas, or WebGL. Use CMake and native unit tests. If compiled to WebAssembly through a toolchain such as Emscripten, add cross-language tests against the TypeScript reference implementation.

Measure the whole operation, including marshalling and memory copies—not only the native function runtime.

## 10. CUDA boundary

CUDA is optional and generally belongs to a native compute path, not directly inside a normal browser page. A browser application cannot simply launch CUDA kernels on a user's GPU through standard WebGL APIs.

If a CUDA experiment is justified:

1. Select a highly parallel workload.
2. Establish a correct CPU baseline.
3. Implement and test the native C++ version.
4. Add a CUDA version behind the same logical interface.
5. Benchmark kernel time and end-to-end time, including data transfers.
6. Retain a CPU fallback.

Possible future deployments include a native GraphX application or an explicitly designed remote compute service. A remote service introduces networking, deployment, security, latency, and privacy concerns and should not be assumed for the MVP.

## 11. Performance and correctness strategy

Track separate measurements for:
- Input-to-visible-update latency.
- Parsing and dependency resolution.
- Numerical evaluation and sampling.
- Renderer frame time.
- Number of active expressions and samples.
- Memory use and worker overhead.

Correctness tests:
- Parser and evaluator unit tests.
- Coordinate transform round-trip tests.
- Numerical reference tests with defined tolerances.
- Regression tests for discontinuities and invalid values.
- Browser interaction tests.
- Cross-backend comparisons for Canvas/WebGL and TypeScript/native code.

Do not claim acceleration without a repeatable benchmark and a defined baseline.

## 12. Security, reliability, and maintainability

- Treat expression text as untrusted input.
- Do not use dynamic code execution for expression evaluation.
- Bound expression size, recursion depth, and evaluation work.
- Avoid unbounded work on the UI thread.
- Handle WebGL context loss and unavailable WebGL support.
- Keep a fallback renderer.
- Pin dependencies and review licenses.
- Document public APIs and supported syntax.
- Keep algorithm limitations visible to users.

## 13. Key architecture decisions

| Decision | Initial choice | Reason | Revisit when |
|---|---|---|---|
| UI | React + TypeScript | Typed components and maintainable state | Evidence suggests a specific bottleneck |
| Build | Vite | Fast development and simple tooling | Deployment requirements demand a change |
| Math core | TypeScript first | Fast iteration and easy testing | Benchmarks justify native code |
| Renderer | Canvas 2D first | Simple correctness baseline | Rendering profiles show a need for WebGL |
| GPU graphics | WebGL 2 | Browser graphics API for GPU rendering | Device support or workload constraints change |
| Native acceleration | C++ + optional Wasm | Reusable native algorithms and browser deployment option | A measured workload justifies integration |
| CUDA | Optional native experiment | Useful only for appropriate parallel workloads | Benchmark demonstrates value |
| Expensive computation | Worker where needed | Protects UI responsiveness | Measured overhead outweighs benefit |
