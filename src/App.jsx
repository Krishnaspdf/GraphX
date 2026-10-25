import React, { useState, useCallback, useEffect } from 'react';
import GraphWorkspace from './components/GraphWorkspace';
import Landing from './components/Landing';
import './App.css';

export default function App() {
  const [view, setView] = useState('landing'); // landing | workspace

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">GraphX</div>
        <nav>
          <button onClick={() => setView('landing')}>Overview</button>
          <button onClick={() => setView('workspace')}>Workspace</button>
        </nav>
      </header>
      <main>
        {view === 'landing' ? <Landing /> : <GraphWorkspace />}
      </main>
      <footer>
        <span>GraphX — 5-Phase Build (React + Canvas2D → WebGL → CUDA)</span>
      </footer>
    </div>
  );
}
