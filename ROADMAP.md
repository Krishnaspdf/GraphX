# GraphX Roadmap
 
> A phased build plan for GraphX, an interactive mathematical visualization engine.
> Written with an eye toward demonstrating skills relevant to GPU computing, graphics
> programming, and numerical systems — the kind of work highlighted in NVIDIA
> internship applications (CUDA, OpenGL/Vulkan, parallel algorithms, performance
> engineering).
 
---
 
## Phase 1 — Foundations (Web UI Shell)
**Status: In Production / In Planning**
 
- [ ] Landing page (HTML5/CSS3/JS)
- [ ] Core UI layout: input bar, graph canvas, sidebar for variables/settings
- [ ] Responsive design (desktop + tablet)
- [ ] Basic routing/state management (vanilla JS or lightweight framework)
**Skill focus:** UI fundamentals, clean project structure, git hygiene.
 
---
 
## Phase 2 — Math Engine (CPU-side)
**Status: Equation parser theory done, application in progress**
 
- [ ] Tokenizer for mathematical expressions (numbers, operators, functions, variables)
- [ ] Parser: build an Abstract Syntax Tree (AST) — recursive descent or Pratt parsing
- [ ] Evaluator: walk the AST to compute values at sample points
- [ ] Support for multi-variable functions (x, y → z)
- [ ] Canvas 2D rendering engine: map AST-evaluated points to pixel space
- [ ] Multi-function overlay support (plot several curves at once)
**Skill focus:** Compiler-adjacent thinking (lexing/parsing), algorithm design.
This is the single most "CS fundamentals" phase — treat it like a mini compiler
project. NVIDIA recruiters like seeing parser/AST work because it shows you
understand program representation, which matters for shader compilation and
kernel scheduling later.
 
---
 
## Phase 3 — Analytical Tools & Project Persistence
 
- [ ] Calculus utilities: numerical differentiation, integration (Simpson's/trapezoidal)
- [ ] Symbolic simplification (optional, stretch goal)
- [ ] Save/load projects (localStorage → then backend/DB)
- [ ] Shareable graph links (URL-encoded state)
**Skill focus:** Numerical methods — directly relevant to scientific computing,
which is a core NVIDIA domain (CUDA numerical libraries, cuBLAS/cuFFT parallels).
 
---
 
## Phase 4 — GPU Acceleration (The NVIDIA-Relevant Core)
**Status: In Planning — this is your headline phase for an NVIDIA application**
 
- [ ] Move rendering from Canvas2D → **WebGL/WebGPU** for GPU-accelerated point plotting
- [ ] Write **GLSL/WGSL shaders** to evaluate simple expressions directly on GPU
  (fragment shader per-pixel evaluation for implicit functions, e.g. `x² + y² = r²`)
- [ ] Benchmark CPU (JS) evaluation vs GPU (shader) evaluation at scale
  (e.g. 10k vs 1M sample points) — document the speedup
- [ ] **Stretch/portfolio piece:** native companion app using C++ + OpenGL,
  offloading heavy computation to **CUDA kernels** for:
  - Large-scale point cloud generation
  - Parallel Newton-Raphson root finding
  - Real-time 3D surface plotting (z = f(x, y))
- [ ] Explore **WebAssembly (WASM)**: compile the C++/CUDA-adjacent math core to WASM
  so the web app and native app share one evaluation engine
**Skill focus:** This phase is what turns GraphX from "a student web project"
into "a systems + graphics + parallel computing project." For an NVIDIA
internship, having *any* working CUDA kernel with a benchmark write-up
(CPU vs GPU timing chart) is worth more than a polished UI.
 
---
 
## Phase 5 — Advanced Visualization & Simulation
 
- [ ] 3D surface and vector field plotting (Three.js for web, raw OpenGL for native)
- [ ] Physics-based simulations (particle systems, ODE solvers) rendered live
- [ ] Real-time parameter sliders driving GPU-computed animations
- [ ] Collaborative sessions (WebSocket-based shared graph state)
**Skill focus:** Real-time systems, animation loops, simulation — the "advanced
visualization" NVIDIA cares about (think: scientific visualization, digital twins).
 
---
 
## Suggested Order of Priority for a 1st-Year Student
 
If time is limited before internship application season, prioritize in this order:
 
1. **Finish Phase 2** (parser + evaluator) — proves core CS skill.
2. **Do a minimal Phase 4** — even a single WebGL shader that plots one implicit
   function on GPU, with a benchmark comparing it to your CPU version. This one
   deliverable + a short write-up is the strongest single resume line for NVIDIA.
3. Fill in Phase 3 (calculus tools) for depth.
4. Everything else (collaboration, saving/sharing, native CUDA app) is a bonus —
   attempt only if time remains.
**Key resume/interview artifact to produce along the way:** a short benchmark
report or blog post: "Plotting 1 million points: CPU JS vs GPU shader" with
graphs of your own timing data. This single artifact demonstrates initiative,
GPU literacy, and measurement discipline — exactly what NVIDIA screens for.
 