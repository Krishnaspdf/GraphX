import React from 'react';
import '../landing.css';

export default function Landing() {
  return (
    <section className="landing">
      <h1>GraphX</h1>
      <p className="subtitle">Interactive mathematical visualization with a GPU-accelerated rendering path.</p>

      <div className="cards">
        <Card title="Phase 1 — UI" desc="Landing page, responsive layout, navigation." status="Done" />
        <Card title="Phase 2 — Math Engine" desc="Tokenizer, parser, AST, CPU evaluator, Canvas2D render." status="Done" />
        <Card title="Phase 3 — Calculus" desc="Numerical diff/integration, save/load via localStorage." status="Done" />
        <Card title="Phase 4 — GPU" desc="WebGL shader compiler, benchmark (CPU vs GPU shader), GLSL codegen." status="Done" />
        <Card title="Phase 5 — Native" desc="C++ OpenGL + CUDA kernel structure, WASM bridge design." status="Done" />
      </div>

      <section className="docs-preview">
        <h2>Architecture Highlights</h2>
        <p>Parser → AST → CPU Evaluator → Canvas2D (current)</p>
        <p>Parser → AST → Shader Codegen → GLSL → WebGPU (target)</p>
        <p>C++ Math Core → WASM → Shared evaluation engine (stretch)</p>
      </section>
    </section>
  );
}

function Card({ title, desc, status }) {
  return (
    <article className="card">
      <h3>{title}</h3>
      <p>{desc}</p>
      <span className={`badge ${status === 'Done' ? 'ok' : 'pending'}`}>{status}</span>
    </article>
  );
}
