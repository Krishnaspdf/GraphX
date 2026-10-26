import type { ViewState } from '../coordinates/transform';
import type { Renderer } from './interface';

export class Canvas2DRenderer implements Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    if (!this.ctx) throw new Error('Canvas 2D context not available');
  }

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(view: ViewState, _expressions: { id: string; color: string }[]) {
    const { ctx, canvas } = this;
    if (!ctx) return;
    ctx.fillStyle = '#0f1115';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = '#2d323b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= 20; i++) {
      const x = (i / 20) * canvas.width;
      ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height);
    }
    for (let i = 0; i <= 20; i++) {
      const y = (i / 20) * canvas.height;
      ctx.moveTo(0, y); ctx.lineTo(canvas.width, y);
    }
    ctx.stroke();

    // Axes
    ctx.strokeStyle = '#4dabf7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const cx = (0 - view.xMin) / (view.xMax - view.xMin) * canvas.width;
    const cy = canvas.height - (0 - view.yMin) / (view.yMax - view.yMin) * canvas.height;
    ctx.moveTo(cx, 0); ctx.lineTo(cx, canvas.height);
    ctx.moveTo(0, cy); ctx.lineTo(canvas.width, cy);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#e8e8e8';
    ctx.font = '12px sans-serif';
    ctx.fillText('y', 10, 16);
    ctx.fillText('x', canvas.width - 20, cy - 8);
  }

  dispose() {
    // Canvas cleanup handled by GC
  }
}
