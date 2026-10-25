# GraphX Architecture
 
> Technical architecture document. Describes system layers, data flow, and the
> planned GPU-acceleration path. Written to double as a portfolio artifact —
> the kind of design doc that shows systems thinking in an NVIDIA internship
> application, not just "I made a website."
 
---
 
## 1. High-Level System Overview
 
```
┌─────────────────────────────────────────────────────────────────┐
│                            GraphX                                │
│                                                                   │
│  ┌───────────┐    ┌──────────────┐    ┌───────────────────────┐ │
│  │   UI       │───▶│  Math Engine │───▶│  Rendering Engine     │ │
│  │  (Input,   │    │ (Parser/AST/ │    │ (Canvas2D → WebGL/    │ │
│  │  Controls) │    │  Evaluator)  │    │  WebGPU → GPU shader) │ │
│  └───────────┘    └──────────────┘    └───────────────────────┘ │
│        │                  │                       │              │
│        ▼                  ▼                       ▼              │
│  ┌───────────┐    ┌──────────────┐    ┌───────────────────────┐ │
│  │ Project    │    │  Calculus    │    │  GPU Compute Layer    │ │
│  │ Store      │    │  Utilities   │    │  (CUDA / compute      │ │
│  │ (save/     │    │ (diff/       │    │   shaders, native or  │ │
│  │  share)    │    │  integrate)  │    │   WASM bridge)        │ │
│  └───────────┘    └──────────────┘    └───────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```
 
---
 
## 2. Layer Breakdown
 
### 2.1 UI Layer
- **Tech:** HTML5, CSS3, vanilla JS (or lightweight framework later)
- **Responsibility:** capture expression input, variable sliders, zoom/pan
  gestures; forward events to the Math Engine and Rendering Engine.
- **Design note:** keep this layer "dumb" — no math logic here. This
  separation of concerns is what lets you swap the rendering backend later
  (Canvas2D → WebGL → native OpenGL) without touching UI code.
### 2.2 Math Engine
- **Tokenizer:** converts raw string input (`"sin(x^2) + y"`) into a token stream.
- **Parser:** builds an **Abstract Syntax Tree (AST)** from tokens
  (recursive-descent or Pratt parsing recommended for operator precedence).
- **Evaluator:** walks the AST given `(x, y)` (or more variables) and returns
  a numeric value. This is a tree-walking interpreter — the same core concept
  used in real compilers/shader compilers.
- **Why this matters for NVIDIA:** GPU shader compilers (GLSL/HLSL/PTX) do
  exactly this — parse an expression/program into an AST/IR, then lower it.
  Building your own toy version here is directly relevant background.
### 2.3 Calculus Utilities
- Numerical differentiation (finite differences)
- Numerical integration (trapezoidal/Simpson's rule)
- Root finding (bisection, Newton-Raphson)
- These operate on the AST/evaluator, not on raw strings — keeps math logic
  centralized and testable.
### 2.4 Rendering Engine (the critical path for GPU work)
 
**Stage A — CPU rendering (current/near-term):**
- Evaluate the function at N sample points on the CPU (JavaScript)
- Draw resulting points/lines onto an HTML5 `<canvas>` (2D context)
- Simple, correct, but O(N) evaluation cost sits entirely on the CPU thread
**Stage B — GPU-accelerated rendering (target for NVIDIA-relevant depth):**
- Move to **WebGL2 or WebGPU**
- Translate the AST into a **GLSL/WGSL fragment shader** at runtime (a mini
  "expression-to-shader compiler") so every pixel/point is evaluated in
  parallel on the GPU instead of looping in JS
- This is the single highest-value architectural upgrade in the whole
  project — it's a real (small) example of "compile math expression → GPU
  kernel," conceptually similar to how CUDA JIT-compiles kernels
**Stage C — Native compute layer (stretch goal):**
- A companion C++ application using **OpenGL** for rendering and **CUDA**
  for the heavy numerical lifting (large point clouds, 3D surfaces, particle
  simulations)
- Shared core logic between web and native via **WebAssembly**: compile the
  C++ math core to WASM so both the browser app and native app use one
  source of truth for evaluation logic
```
Expression string
      │
      ▼
   Tokenizer
      │
      ▼
     AST
      │
      ├──────────────► CPU Evaluator ──► Canvas2D draw calls
      │
      └──────────────► Shader Codegen ──► GLSL/WGSL ──► GPU (parallel eval)
                                                            │
                                                (stretch)   ▼
                                                     CUDA kernel (native)
```
 
### 2.5 Project Store
- Save/load current graph state (expressions, variable ranges, view camera)
- Start with `localStorage`/JSON export, later a small backend (Node/Express
  or similar) for shareable links and multi-device sync
---
 
## 3. Data Flow (Single Render Cycle)
 
1. User types expression → UI captures string
2. Math Engine tokenizes + parses → AST
3. AST is either:
   - Walked by CPU evaluator to produce `(x, y)` point arrays, **or**
   - Compiled into a shader string and uploaded to the GPU
4. Rendering Engine draws the result (Canvas2D or WebGL draw call)
5. User interaction (zoom/pan/slider) triggers re-evaluation of only the
   changed region where possible (optimization target, not day-1 requirement)
---
 
## 4. Technology Stack Summary
 
| Layer              | Now (Web)              | Planned / Stretch          |
|--------------------|-------------------------|-----------------------------|
| UI                 | HTML5, CSS3, JS         | Framework (optional)        |
| Math Engine        | JS (tokenizer/parser)   | Shared core via WASM (C++)  |
| Rendering          | Canvas2D                | WebGL2 / WebGPU shaders     |
| Heavy Compute      | —                       | CUDA kernels (native app)   |
| Native Rendering   | —                       | C++ + OpenGL                |
| Persistence        | localStorage            | Backend + DB                |
 
---
 
## 5. Why This Architecture Is Internship-Relevant
 
- **Parser → AST → Evaluator** demonstrates you understand program
  representation and interpretation — foundational to any compiler,
  shader-language, or GPU-kernel work.
- **CPU vs GPU evaluator split** is a direct, hands-on demonstration of
  the exact tradeoff NVIDIA's entire business is built on: serial vs
  massively parallel computation. A working benchmark (points/sec on CPU
  vs GPU) is a concrete, quantifiable result to put on a resume.
- **WASM bridge** shows awareness of cross-platform performance-portable
  code, relevant to NVIDIA's own tooling ecosystem (e.g., CUDA-adjacent
  cross-compilation concerns).
- **Incremental architecture** (CPU → WebGL → native CUDA) shows you can
  design a system that scales in complexity deliberately, rather than
  overbuilding on day one — a trait recruiters look for over raw feature count.