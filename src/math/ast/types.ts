export interface BinaryExpr {
  kind: 'binary';
  operator: string;
  left: ExprNode;
  right: ExprNode;
}

export interface UnaryExpr {
  kind: 'unary';
  operator: string;
  argument: ExprNode;
}

export interface NumberLiteral {
  kind: 'number';
  value: number;
}

export interface Variable {
  kind: 'variable';
  name: string;
}

export interface FunctionCall {
  kind: 'function';
  name: string;
  argument: ExprNode;
}

export type ExprNode = BinaryExpr | UnaryExpr | NumberLiteral | Variable | FunctionCall;
