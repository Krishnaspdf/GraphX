import { useState, useRef, useEffect } from 'react';
import ExpressionPanel from '../components/expression-panel/ExpressionPanel';
import GraphToolbar from '../components/graph-toolbar/GraphToolbar';
import SettingsPanel from '../components/settings-panel/SettingsPanel';
import './App.css';
import { Canvas2DRenderer } from '../graph/renderers/Canvas2DRenderer';
import type { ViewState } from '../graph/coordinates/transform';
import type { AppState, ExpressionState } from './state/types';

export default function App() {
  const [state, setState] = useState<AppState>({
    mode: 'workspace',
    expressions: [
      { id: 'e1', source: 'y = x', visible: true, color: '#e6194b' },
      { id: 'e2', source: 'y = x^2', visible: true, color: '#4363d8' },
    ],
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const renderer = new Canvas2DRenderer(canvasRef.current);
    renderer.resize(700, 450);
    const view: ViewState = { xMin: -10, xMax: 10, yMin: -10, yMax: 10, width: 700, height: 450 };
    renderer.render(view, state.expressions.map((e) => ({ id: e.id, color: e.color })));
    return () => renderer.dispose();
  }, [state.expressions]);

  const addExpression = () => {
    const colors = ['#e6194b', '#4363d8', '#3cb44b', '#ffe119', '#911eb4'];
    const nextColor = colors[state.expressions.length % colors.length];
    const newExpr: ExpressionState = {
      id: `e${state.expressions.length + 1}`,
      source: 'y = sin(x)',
      visible: true,
      color: nextColor,
    };
    setState((prev: AppState) => ({ ...prev, expressions: [...prev.expressions, newExpr] }));
  };

  const removeExpression = (id: string) => {
    setState((prev: AppState) => ({
      ...prev,
      expressions: prev.expressions.filter((e: ExpressionState) => e.id !== id),
    }));
  };

  const toggleVisibility = (id: string) => {
    setState((prev: AppState) => ({
      ...prev,
      expressions: prev.expressions.map((e: ExpressionState) =>
        e.id === id ? { ...e, visible: !e.visible } : e,
      ),
    }));
  };

  return (
    <div className="app" role="application" aria-label="GraphX workspace">
      <header className="app-header">
        <div className="logo" aria-label="GraphX logo">GraphX</div>
        <GraphToolbar mode={state.mode} onAdd={addExpression} />
      </header>
      <main className="workspace">
        <aside className="expression-panel-wrapper" aria-label="Expression panel">
          <ExpressionPanel expressions={state.expressions} onRemove={removeExpression} onToggle={toggleVisibility} />
        </aside>
        <section className="graph-area" aria-label="Graph canvas">
          <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', background: '#fff' }} aria-label="Graph canvas" />
        </section>
        <aside className="settings-wrapper" aria-label="Settings">
          <SettingsPanel />
        </aside>
      </main>
      <footer className="app-footer">
        <span>GraphX — Phase 3 (Coordinate + Canvas 2D)</span>
      </footer>
    </div>
  );
}
