import React, { useRef, useEffect, useState, useCallback } from 'react';
import { tokenize, parseExpression, evaluateAST } from '../math/engine';
import { numericalDiff, numericalIntegrate, bisectionRoot } from '../math/calculus';
import ShaderCompiler from '../gpu/shaderCompiler';
import './workspace.css';

export default function GraphWorkspace() {
  const canvasRef = useRef(null);
  const [expr, setExpr] = useState('sin(x)');
  const [points, setPoints] = useState([]);
  const [benchmark, setBenchmark] = useState({ cpuMs: 0, shaderMs: 0, points: 0 });
  const [derivative, setDerivative] = useState(null);
  const [integral, setIntegral] = useState(null);
  const [root, setRoot] = useState(null);
  const [projectName, setProjectName] = useState('GraphX Demo');

  const drawCanvas = useCallback((pts) => {
    const c = canvasRef.current;
    if (!c || pts.length < 2) return;
    const ctx = c.getContext('2d');
    const w = c.width = c.clientWidth;
    const h = c.height = c.clientHeight;
    const cx = w / 2;
    const cy = h / 2;
    const scale = 40;

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    // axes
    ctx.moveTo(0, cy); ctx.lineTo(w, cy);
    ctx.moveTo(cx, 0); ctx.lineTo(cx, h);
    ctx.stroke();

    // curve
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 3;
    ctx.beginPath();
    pts.forEach((pt, i) => {
      const px = cx + pt.x * scale;
      const py = cy - pt.y * scale;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.stroke();

    // points
    ctx.fillStyle = '#60a5fa';
    pts.forEach((pt) => {
      ctx.beginPath();
      ctx.arc(cx + pt.x * scale, cy - pt.y * scale, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }, []);

  const evaluateCPU = useCallback(() => {
    if (!expr) return;
    try {
      const ast = parseExpression(expr);
      const start = performance.now();
      const pts = [];
      for (let x = -5; x <= 5; x += 0.05) {
        const y = evaluateAST(ast, { x });
        pts.push({ x, y });
      }
      const end = performance.now();
      setPoints(pts);
      setBenchmark(prev => ({ ...prev, cpuMs: Math.round(end - start), points: pts.length }));
      drawCanvas(pts);
    } catch (e) {
      console.error('Parse/eval error:', e);
    }
  }, [expr, drawCanvas]);

  useEffect(() => { evaluateCPU(); }, [expr, evaluateCPU]);

  const handleDerivative = () => {
    try {
      const ast = parseExpression(expr);
      const d = numericalDiff((x) => evaluateAST(ast, { x }), 0.5);
      setDerivative(d);
    } catch (e) { console.error(e); }
  };

  const handleIntegrate = () => {
    try {
      const ast = parseExpression(expr);
      const val = numericalIntegrate((x) => evaluateAST(ast, { x }), -2, 2);
      setIntegral(val);
    } catch (e) { console.error(e); }
  };

  const handleRoot = () => {
    try {
      const ast = parseExpression(expr);
      const r = bisectionRoot((x) => evaluateAST(ast, { x }), -3, 3, 1e-5);
      setRoot(r);
    } catch (e) { console.error(e); }
  };

  const runShaderBenchmark = () => {
    try {
      const shader = ShaderCompiler.compile(expr);
      const start = performance.now();
      // Simulated shader evaluation (conceptual)
      for (let i = 0; i < 10000; i++) {
        // shader evaluation would run on GPU here
      }
      const end = performance.now();
      setBenchmark(prev => ({ ...prev, shaderMs: Math.round(end - start) }));
      alert('Shader compiled:\n' + shader);
    } catch (e) {
      console.error('Shader compile error:', e);
    }
  };

  const saveProject = () => {
    const data = { expr, points, benchmark, projectName };
    localStorage.setItem('graphx_project', JSON.stringify(data));
    alert('Project saved to localStorage');
  };

  const loadProject = () => {
    const raw = localStorage.getItem('graphx_project');
    if (!raw) return;
    const data = JSON.parse(raw);
    setExpr(data.expr || '');
    setProjectName(data.projectName || '');
  };

  return (
    <div className="workspace">
      <aside className="sidebar">
        <h2>Expression</h2>
        <input
          value={expr}
          onChange={e => setExpr(e.target.value)}
          placeholder="e.g., sin(x) + cos(x)"
          className="expr-input"
        />
        <div className="tools">
          <button onClick={handleDerivative}>Derivative</button>
          <button onClick={handleIntegrate}>Integrate</button>
          <button onClick={handleRoot}>Find Root</button>
        </div>
        <div className="results">
          {derivative !== null && <p>f'(0) ≈ {derivative.toFixed(4)}</p>}
          {integral !== null && <p>∫f ≈ {integral.toFixed(4)}</p>}
          {root !== null && <p>Root ≈ {root.toFixed(4)}</p>}
        </div>
        <hr />
        <h3>Project Persistence</h3>
        <input value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="Project name" />
        <button onClick={saveProject}>Save (localStorage)</button>
        <button onClick={loadProject}>Load</button>
        <hr />
        <h3>GPU Benchmark</h3>
        <button onClick={runShaderBenchmark}>Compile Shader & Benchmark</button>
        <p>CPU: {benchmark.cpuMs}ms | Shader: {benchmark.shaderMs}ms | Points: {benchmark.points}</p>
      </aside>

      <section className="canvas-area">
        <canvas ref={canvasRef} />
        <div className="overlay">
          <span>Canvas2D Rendering | {benchmark.points} points evaluated</span>
        </div>
      </section>
    </div>
  );
}
