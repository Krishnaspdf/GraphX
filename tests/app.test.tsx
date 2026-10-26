import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../src/app/App';

describe('App', () => {
  it('renders workspace mode', () => {
    // Mock canvas context for jsdom
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (HTMLCanvasElement.prototype.getContext as any) = () => ({
      fillStyle: '',
      fillRect: () => {},
      clearRect: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      stroke: () => {},
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      fillText: () => {},
    } as unknown as CanvasRenderingContext2D);
    render(<App />);
    expect(document.body).toBeDefined();
  });
});
