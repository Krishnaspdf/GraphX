import { describe, it, expect } from 'vitest';
import { worldToScreen, screenToWorld } from './transform';

describe('coordinate transforms', () => {
  const view = { xMin: -5, xMax: 5, yMin: -5, yMax: 5, width: 200, height: 200 };
  it('round-trips a point', () => {
    const s = worldToScreen(0, 0, view);
    const w = screenToWorld(s.x, s.y, view);
    expect(Math.abs(w.x)).toBeLessThan(0.01);
    expect(Math.abs(w.y)).toBeLessThan(0.01);
  });
});
