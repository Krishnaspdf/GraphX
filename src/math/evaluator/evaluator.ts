import type { ExprNode, BinaryExpr, UnaryExpr, NumberLiteral, Variable, FunctionCall } from '../ast/types';

export interface Diagnostic {
  code: string;
  message: string;
}

export interface EvaluationResult {
  value?: number;
  diagnostics: Diagnostic[];
}

export function evaluate(node: ExprNode, variables: Record<string, number> = {}): EvaluationResult {
  const diagnostics: Diagnostic[] = [];
  try {
    return { value: evaluateNode(node, variables, diagnostics), diagnostics };
  } catch (e: unknown) {
    diagnostics.push({
      code: 'EVAL_ERROR',
      message: e instanceof Error ? e.message : String(e),
    });
    return { diagnostics };
  }
}

function evaluateNode(node: ExprNode, variables: Record<string, number>, diagnostics: Diagnostic[]): number {
  switch (node.kind) {
    case 'number':
      return (node as NumberLiteral).value;
    case 'variable': {
      const name = (node as Variable).name;
      if (variables[name] === undefined) {
        throw new Error(`Unknown variable: ${name}`);
      }
      return variables[name];
    }
    case 'unary': {
      const n = node as UnaryExpr;
      const arg = evaluateNode(n.argument, variables, diagnostics);
      if (n.operator === '-') return -arg;
      if (n.operator === '+') return arg;
      throw new Error(`Unknown unary operator: ${n.operator}`);
    }
    case 'binary': {
      const b = node as BinaryExpr;
      const left = evaluateNode(b.left, variables, diagnostics);
      const right = evaluateNode(b.right, variables, diagnostics);
      switch (b.operator) {
        case '+': return left + right;
        case '-': return left - right;
        case '*': return left * right;
        case '/':
          if (right === 0) throw new Error('Division by zero');
          return left / right;
        case '^': return Math.pow(left, right);
        default: throw new Error(`Unknown binary operator: ${b.operator}`);
      }
    }
    case 'function': {
      const fn = node as FunctionCall;
      const arg = evaluateNode(fn.argument, variables, diagnostics);
      switch (fn.name) {
        case 'sin': return Math.sin(arg);
        case 'cos': return Math.cos(arg);
        case 'tan': return Math.tan(arg);
        case 'sqrt': return Math.sqrt(arg);
        case 'abs': return Math.abs(arg);
        case 'log': return Math.log10(arg);
        case 'ln': return Math.log(arg);
        case 'exp': return Math.exp(arg);
        default: throw new Error(`Unknown function: ${fn.name}`);
      }
    }
    default:
      throw new Error('Unknown expression node');
  }
}
