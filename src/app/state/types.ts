export type ViewMode = 'workspace' | 'landing';

export interface ExpressionState {
  id: string;
  source: string;
  visible: boolean;
  color: string;
}

export interface AppState {
  mode: ViewMode;
  expressions: ExpressionState[];
}
