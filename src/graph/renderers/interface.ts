import type { ViewState } from '../coordinates/transform';

export interface Renderer {
  resize(width: number, height: number): void;
  render(view: ViewState, expressions: { id: string; color: string }[]): void;
  dispose(): void;
}
