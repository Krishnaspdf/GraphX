import { parseExpression } from './parser.js';

const MATH = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  exp: Math.exp,
  log: Math.log,
  sqrt: Math.sqrt,
  abs: Math.abs,
  pow: Math.pow,
};

export function evaluateAST(node, vars) {
  if (!node) return 0;
  switch (node.type) {
    case 'NUMBER': return node.value;
    case 'VAR':
      if (node.name === 'x') return vars.x || 0;
      if (node.name === 'y') return vars.y || 0;
      if (node.name === 'e') return Math.E;
      if (node.name === 'pi') return Math.PI;
      return vars[node.name] || 0;
    case 'BINOP': {
      const l = evaluateAST(node.left, vars);
      const r = evaluateAST(node.right, vars);
      switch (node.op) {
        case '+': return l + r;
        case '-': return l - r;
        case '*': return l * r;
        case '/': return l / r;
        case '^': return Math.pow(l, r);
        default: throw new Error('Unknown op: ' + node.op);
      }
    }
    case 'UNARY': {
      const v = evaluateAST(node.operand, vars);
      return node.op === '-' ? -v : v;
    }
    case 'CALL': {
      const args = node.args.map(arg => evaluateAST(arg, vars));
      const fn = MATH[node.name];
      if (!fn) throw new Error('Unknown function: ' + node.name);
      return fn(...args);
    }
    default:
      throw new Error('Unknown node type: ' + node.type);
  }
}

export function evaluateString(exprStr, vars) {
  return evaluateAST(parseExpression(exprStr), vars);
}
