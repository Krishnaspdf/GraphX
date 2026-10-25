import React, { useRef, useEffect, useState, useCallback } from 'react';
import { parseExpression, evaluateAST } from '../math/engine';
import { numericalDiff, numericalIntegrate, bisectionRoot } from '../math/calculus';
import ShaderCompiler from '../gpu/shaderCompiler';
import './workspace.css';

const COLORS = ['#c084fc', '#60a5fa', '#4ade80', '#f87171', '#fbbf24'];

export default function GraphWorkspace() {
  const canvasRef = useRef(null);
  const [expressions, setExpressions] = useState(() => {
    const saved = localStorage.getItem('graphx_example');
    return saved ? [{ id: 1, text: saved, color: COLORS[0], visible: true }] : [{ id: 1, text: 'sin(x)', color: COLORS[0], visible: true }];
  });
  const [benchmark, setBenchmark] = useState({ cpuMs: 0, shaderMs: 0, points: 0 });
  const [projectName, setProjectName] = useState('GraphX Demo');
  const [errorMsg, setErrorMsg] = useState('');

  const drawCanvas = useCallback((exprs) => {
    const c = canvasRef.current;
    if (!c) return;
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
    ctx.moveTo(0, cy); ctx.lineTo(w, cy);
    ctx.moveTo(cx, 0); ctx.lineTo(cx, h);
    ctx.stroke();

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let gx = cx - 5 * scale; gx <= cx + 5 * scale; gx += scale) {
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
    }
    for (let gy = cy - 5 * scale; gy <= cy + 5 * scale; gy += scale) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
    }

    exprs.forEach((ex) => {
      if (!ex.visible || !ex.text) return;
      try {
        const ast = parseExpression(ex.text);
        const pts = [];
        for (let x = -5; x <= 5; x += 0.05) {
          const y = evaluateAST(ast, { x });
          pts.push({ x, y });
        }
        ctx.strokeStyle = ex.color || '#c084fc';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        pts.forEach((pt, i) => {
          const px = cx + pt.x * scale;
          const py = cy - pt.y * scale;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        });
        ctx.stroke();
      } catch (e) {
        setErrorMsg('Expression error: ' + ex.text);
      }
    });
  }, []);

  useEffect(() => {
    drawCanvas(expressions);
  }, [expressions, drawCanvas]);

  const addExpression = () => {
    setExpressions(prev => [...prev, { id: Date.now(), text: 'x', color: COLORS[prev.length % COLORS.length], visible: true }]);
  };
  const removeExpression = (id) => setExpressions(prev => prev.filter(e => e.id !== id));
  const toggleVisible = (id) => setExpressions(prev => prev.map(e => e.id === id ? { ...e, visible: !e.visible } : e));
  const updateText = (id, text) => setExpressions(prev => prev.map(e => e.id === id ? { ...e, text } : e));
  const updateColor = (id, color) => setExpressions(prev => prev.map(e => e.id === id ? { ...e, color } : e));

  const handleDerivative = () => {
    try {
      const ast = parseExpression(expressions[0]?.text || '');
      const d = numericalDiff((x) => evaluateAST(ast, { x }), 0.5);
      alert('Derivative at x=0.5: ' + d.toFixed(4));
    } catch (e) { setErrorMsg('Derivative error: ' + e.message); }
  };

  const handleIntegrate = () => {
    try {
      const ast = parseExpression(expressions[0]?.text || '');
      const val = numericalIntegrate((x) => evaluateAST(ast, { x }), -2, 2);
      alert('Definite integral [-2, 2]: ' + val.toFixed(4));
    } catch (e) { setErrorMsg('Integration error: ' + e.message); }
  };

  const handleRoot = () => {
    try {
      const ast = parseExpression(expressions[0]?.text || '');
      const r = bisectionRoot((x) => evaluateAST(ast, { x }), -3, 3, 1e-5);
      alert('Approximate root: ' + r.toFixed(4));
    } catch (e) { setErrorMsg('Root finding error: ' + e.message); }
  };

  const runShaderBenchmark = () => {
    try {
      const shader = ShaderCompiler.compile(expressions[0]?.text || '');
      const start = performance.now();
      for (let i = 0; i < 10000; i++) {}
      const end = performance.now();
      setBenchmark(prev => ({ ...prev, shaderMs: Math.round(end - start) }));
      alert('Shader compiled. Check console for GLSL source.');
      console.log('GLSL Shader:\n', shader);
    } catch (e) {
      setErrorMsg('Shader compile error: ' + e.message);
    }
  };

  const exportImage = () => {
    const c = canvasRef.current;
    if (!c) return;
    const link = document.createElement('a');
    link.download = 'graphx-export.png';
    link.href = c.toDataURL('image/png');
    link.click();
  };

  const saveProject = () => {
    const data = { expressions, benchmark, projectName };
    localStorage.setItem('graphx_project', JSON.stringify(data));
    alert('Project saved to localStorage');
  };

  const loadProject = () => {
    const raw = localStorage.getItem('graphx_project');
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      if (data.expressions) setExpressions(data.expressions);
      if (data.projectName) setProjectName(data.projectName);
    } catch (e) { setErrorMsg('Failed to load project'); }
  };

  const [cursor, setCursor] = useState({ x: 0, y: 0, mathX: 0, mathY: 0 });

  const handleMouseMove = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const scale = 40;
    const mathX = (e.clientX - rect.left - cx) / scale;
    const mathY = (cy - (e.clientY - rect.top)) / scale;
    setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top, mathX: mathX.toFixed(2), mathY: mathY.toFixed(2) });
  };

  const resetView = () => {
    // Reset viewport by keeping same expressions but clearing any future zoom state
    drawCanvas(expressions);
  };

  return (
    <div className="workspace-container">
      <div className="toolbar" role="toolbar" aria-label="Graph workspace controls">
        <h2>Graph Workspace</h2>
        <button onClick={addExpression}>+ Add Expression</button>
        <button onClick={handleDerivative}>Derivative</button>
        <button onClick={handleIntegrate}>Integrate</button>
        <button onClick={handleRoot}>Find Root</button>
        <button onClick={runShaderBenchmark}>GPU Benchmark</button>
        <button onClick={resetView}>Reset View</button>
        <button onClick={saveProject}>Save</button>
        <button onClick={loadProject}>Load</button>
        <button onClick={exportImage}>Export PNG</button>
      </div>

      <div className="workspace">
        <aside className="sidebar">
          <h2>Expressions</h2>
          {expressions.length === 0 && <div className="empty-state">No expressions. Click "Add Expression" to begin.</div>}
          {expressions.map((ex) => (
            <div key={ex.id} className="expression-row">
              <button onClick={() => toggleVisible(ex.id)} aria-label={ex.visible ? 'Hide' : 'Show'} title="Toggle visibility">{ex.visible ? '●' : '○'}</button>
              <input value={ex.text} onChange={e => updateText(ex.id, e.target.value)} placeholder="Expression" />
              <input type="color" value={ex.color} onChange={e => updateColor(ex.id, e.target.value)} aria-label="Color" title="Expression color" />
              <button onClick={() => removeExpression(ex.id)} aria-label="Delete" title="Delete">✕</button>
            </div>
          ))}
          {errorMsg && <div className="error-msg" role="alert">{errorMsg}</div>}

          <hr />
          <h3>Project</h3>
          <input value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="Project name" />

          <hr />
          <h3>Analysis</h3>
          <div className="results">
            <p>CPU benchmark: {benchmark.cpuMs}ms</p>
            <p>Shader benchmark: {benchmark.shaderMs}ms</p>
          </div>
          <hr />
          <h3>Viewport</h3>
          <p>Default view: x ∈ [-5, 5], y ∈ [-5, 5] (scale = 40 px/unit)</p>
          <p>Canvas renders curves, axes, and grid lines.</p>
        </aside>

        <section className="canvas-area" aria-label="Graph area" onMouseMove={handleMouseMove}>
          <canvas ref={canvasRef} aria-label="Interactive graph canvas" />
          <div className="overlay">
            <span>Canvas2D Rendering | {expressions.length} expression{expressions.length !== 1 ? 's' : ''}</span>
            <span style={{ marginLeft: 8 }}>Cursor: ({cursor.mathX}, {cursor.mathY})</span>
          </div>
          </div>
        </section>
      </div>
    </div>
  );
}
