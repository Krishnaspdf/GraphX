import React from 'react';

const EXAMPLES = [
  { title: 'Sine Wave', expr: 'sin(x)', category: 'Trigonometry' },
  { title: 'Parabola', expr: 'x^2', category: 'Algebra' },
  { title: 'Circle', expr: 'sqrt(25 - x^2)', category: 'Geometry' },
  { title: 'Exponential', expr: 'exp(x)', category: 'Calculus' },
];

export default function ExampleGallery({ onSelect }) {
  return (
    <section aria-label="Example Gallery" style={{ marginTop: '1rem' }}>
      <h3>Example Gallery</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
        {EXAMPLES.map((ex, i) => (
          <button
            key={i}
            onClick={() => onSelect(ex.expr)}
            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#e8ecf1', textAlign: 'left', cursor: 'pointer' }}
          >
            <strong>{ex.title}</strong>
            <br />
            <code style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{ex.expr}</code>
            <br />
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{ex.category}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
