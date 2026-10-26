import { useState } from 'react';
import ExpressionPanel from '../components/expression-panel/ExpressionPanel';
import GraphToolbar from '../components/graph-toolbar/GraphToolbar';
import SettingsPanel from '../components/settings-panel/SettingsPanel';
import './App.css';
import type { AppState, ExpressionState } from './state/types';

export default function App() {
  const [state, setState] = useState<AppState>({
    mode: 'workspace',
    expressions: [
      { id: 'e1', source: 'y = x', visible: true, color: '#e6194b' },
      { id: 'e2', source: 'y = x^2', visible: true, color: '#4363d8' },
    ],
  });

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
        <GraphToolbar
          mode={state.mode}
          onAdd={addExpression}
        />
      </header>
      <main className="workspace">
        <aside className="expression-panel-wrapper" aria-label="Expression panel">
          <ExpressionPanel
            expressions={state.expressions}
            onRemove={removeExpression}
            onToggle={toggleVisibility}
          />
        </aside>
        <section className="graph-area" aria-label="Graph canvas">
          <div className="canvas-placeholder" aria-label="Graph canvas placeholder">
            Canvas 2D renderer (Phase 3)
          </div>
        </section>
        <aside className="settings-wrapper" aria-label="Settings">
          <SettingsPanel />
        </aside>
      </main>
      <footer className="app-footer">
        <span>GraphX — Phase 1 (React + TypeScript + Vite)</span>
      </footer>
    </div>
  );
}
