# GraphX

**GraphX** is a mathematical visualization and exploration platform designed to transform equations into interactive visual models. It is being built with the goal of creating a modern mathematical workspace where users can visualize mathematical functions in real time, explore relationships between variables, investigate calculus concepts interactively, build mathematical simulations and models, and organize and share mathematical projects.

---

## Current Status (All 5 Phases Implemented)

- **Phase 1 — UI/Foundation:** React landing page, responsive layout, navigation, semantic HTML.
- **Phase 2 — Math Engine:** Tokenizer, parser (recursive descent), AST evaluator. Supports `+ - * / ^`, `sin/cos/tan/exp/log/sqrt/abs`, variables `x/y`, constants `pi/e`, parentheses. No `eval()`.
- **Phase 3 — Calculus & Persistence:** Numerical differentiation, integration (trapezoidal), bisection root finding. LocalStorage save/load. Project persistence.
- **Phase 4 — GPU Path:** GLSL shader compiler (`ShaderCompiler`), benchmark comparing CPU vs simulated shader timing. WebGL/WebGPU codegen structure.
- **Phase 5 — Native & WASM:** C++ OpenGL structure (`src/native/cpp/main.cpp`), CUDA kernel (`src/native/cuda/kernel.cu`), WASM bridge design (`src/utils/wasmBridge.js`).

---

## Features

### Implemented
- Responsive landing page with hero, CTAs, and sections
- Interactive graphing workspace (Canvas2D)
- Multiple expression support with visibility, colors, add/delete
- Real-time 2D graph rendering with axes, grid, and curves
- Safe parser with error handling (no arbitrary code execution)
- Derivative, integration, and root-finding analysis tools
- Project save/load via `localStorage`
- Graph export as PNG
- Example gallery with load-into-workspace
- GPU shader compiler and benchmark
- Native C++/CUDA structure and WASM bridge design

### Planned / Stretch
- WebGL/WebGPU real-time shader rendering
- WASM-compiled C++ math core
- Backend with shareable links
- Collaborative editing

---

## How GraphX Works

1. The user enters a mathematical expression.
2. The expression is tokenized and parsed into an Abstract Syntax Tree (AST).
3. The AST is evaluated at sample points.
4. Points are rendered onto an interactive Canvas 2D graph.
5. Users can zoom, pan, modify variables, and explore in real time.
6. For GPU acceleration, expressions can be compiled to GLSL fragment shaders.

---

## Project Structure

```
GraphX/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── README.md
├── ROADMAP.md
├── ARCHITECTURE.md
├── TASKS.md
├── BENCHMARK.md
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── landing.css
│   ├── components/
│   │   ├── Landing.jsx
│   │   ├── GraphWorkspace.jsx
│   │   ├── ExampleGallery.jsx
│   │   └── workspace.css
│   ├── math/
│   │   ├── tokenizer.js
│   │   ├── parser.js
│   │   ├── evaluator.js
│   │   ├── engine.js
│   │   └── calculus.js
│   ├── gpu/
│   │   └── shaderCompiler.js
│   ├── persistence/
│   │   └── projectStore.js
│   ├── native/
│   │   ├── cpp/
│   │   │   └── main.cpp
│   │   └── cuda/
│   │       └── kernel.cu
│   └── utils/
│       └── wasmBridge.js
├── assets/
├── tests/
│   └── test-engine.mjs
└── dist/
```

---

## How to Run

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:3000/`. Open it in a modern browser.

To test the production build:

```bash
npm run build
npm run preview
```

---

## Running Tests

```bash
node tests/test-engine.mjs
```

---

## Technology Stack

- **Frontend:** React 19, Vite, vanilla CSS
- **Rendering:** HTML5 Canvas 2D (current); WebGL/WebGPU shader compiler designed
- **Math Engine:** Pure JavaScript tokenizer/parser/evaluator
- **Native (stretch):** C++ + OpenGL + CUDA
- **Cross-platform:** WebAssembly bridge design

---

## Supported Expression Syntax

- Numbers: `3`, `-2.5`
- Variables: `x`, `y`
- Operators: `+`, `-`, `*`, `/`, `^` (power)
- Functions: `sin(x)`, `cos(x)`, `tan(x)`, `sqrt(x)`, `abs(x)`, `exp(x)`, `log(x)` (natural log)
- Constants: `pi`, `e`
- Parentheses: `( ... )`
- Unary signs: `-x`, `+x`

Invalid expressions are rejected safely with clear error messages. No `eval()` is used.

---

## Roadmap

See `ROADMAP.md` and `TASKS.md` for the phased build plan and milestone checklist.

---

## Target Audience

- Students learning mathematics
- Educators demonstrating concepts
- Researchers exploring relationships
- Developers interested in visualization
- Anyone curious about mathematics

---

## License

This project is currently being developed for educational and research purposes.

---

## Author

Krishna

Building GraphX to make mathematics more visual, interactive, and accessible.
