import React from 'react';
import '../landing.css';
import ExampleGallery from './ExampleGallery';

export default function Landing() {
  return (
    <div className="landing">
      <header className="hero">
        <h1>GraphX</h1>
        <p className="subtitle">Interactive mathematical visualization with a GPU-accelerated rendering path.</p>
        <div className="cta-row">
          <a href="#workspace" className="btn-primary">Start Graphing</a>
          <a href="#examples" className="btn-secondary">Explore Examples</a>
        </div>
      </header>

      <section className="section" aria-label="Why GraphX">
        <h2>Why GraphX?</h2>
        <p>GraphX transforms equations into interactive visual models. It is designed for students, educators, researchers, and developers who need to see mathematics rather than just read it.</p>
      </section>

      <section className="section" aria-label="How it works">
        <h2>How It Works</h2>
        <ol className="steps">
          <li>Enter a mathematical expression.</li>
          <li>The expression is parsed into an AST.</li>
          <li>Points are evaluated and rendered to an interactive graph.</li>
          <li>Zoom, pan, modify variables, and explore in real time.</li>
        </ol>
      </section>

      <section className="section" id="examples" aria-label="Capabilities">
        <h2>Key Capabilities</h2>
        <div className="cards">
          <Card title="Phase 1 — UI" desc="Landing page, responsive layout, navigation." />
          <Card title="Phase 2 — Math Engine" desc="Tokenizer, parser, AST, evaluator, Canvas2D." />
          <Card title="Phase 3 — Calculus" desc="Derivatives, integration, persistence." />
          <Card title="Phase 4 — GPU" desc="WebGL shader compiler, benchmark." />
          <Card title="Phase 5 — Native" desc="C++ OpenGL + CUDA + WASM." />
        </div>
      </section>

      <ExampleGallery onSelect={(expr) => { window.location.hash = 'workspace'; localStorage.setItem('graphx_example', expr); }} />

      <section className="section" aria-label="Vision">
        <h2>Project Goals</h2>
        <p>Build a modern mathematical workspace: real-time visualization, function analysis, GPU-accelerated computation, and shared project persistence.</p>
      </section>

      <footer className="landing-footer">
        <nav aria-label="Footer links">
          <a href="#">Overview</a>
          <a href="#">Documentation</a>
          <a href="#">About</a>
        </nav>
        <p>GraphX — Building mathematics into interactive visual systems.</p>
      </footer>
    </div>
  );
}

function Card({ title, desc }) {
  return (
    <article className="card">
      <h3>{title}</h3>
      <p>{desc}</p>
      <span className="badge ok">Active</span>
    </article>
  );
}
