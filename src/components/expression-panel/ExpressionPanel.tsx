import type { ExpressionState } from '../../app/state/types';

interface ExpressionPanelProps {
  expressions: ExpressionState[];
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
}

export default function ExpressionPanel({ expressions, onRemove, onToggle }: ExpressionPanelProps) {
  return (
    <div className="expression-panel">
      <h2>Expressions</h2>
      {expressions.length === 0 && <p className="empty">No expressions</p>}
      <ul className="expression-list">
        {expressions.map((expr) => (
          <li key={expr.id} className="expression-row" style={{ borderLeftColor: expr.color }}>
            <span className="expr-color-dot" style={{ backgroundColor: expr.color }} aria-hidden="true" />
            <span className="expr-source" aria-label={`Expression ${expr.id}`}>{expr.source}</span>
            <span className="expr-id" aria-label="Expression ID">{expr.id}</span>
            <button
              className="btn-icon"
              onClick={() => onToggle(expr.id)}
              aria-label={`${expr.visible ? 'Hide' : 'Show'} expression ${expr.id}`}
            >
              {expr.visible ? 'Hide' : 'Show'}
            </button>
            <button
              className="btn-icon btn-danger"
              onClick={() => onRemove(expr.id)}
              aria-label={`Remove expression ${expr.id}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
