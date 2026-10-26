import type { ViewMode } from '../../app/state/types';

interface GraphToolbarProps {
  mode: ViewMode;
  onAdd: () => void;
}

export default function GraphToolbar({ mode, onAdd }: GraphToolbarProps) {
  return (
    <nav className="toolbar" aria-label="Graph toolbar">
      <button onClick={onAdd} aria-label="Add expression">Add</button>
      <span aria-label="Current view mode">{mode}</span>
      <button aria-label="Reset view">Reset</button>
    </nav>
  );
}
