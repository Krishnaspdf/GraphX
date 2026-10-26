import { describe, it, expect } from 'vitest';
import { evaluate } from '../evaluator/evaluator';
import { parseExpression } from '../parser/parser';

describe('evaluator', () => {
  it('evaluates 1 + 2', () => {
    const ast = parseExpression('1 + 2');
    const result = evaluate(ast);
    expect(result.value).toBe(3);
  });
  it('returns diagnostic for unknown variable', () => {
    const ast = parseExpression('x');
    const result = evaluate(ast);
    expect(result.diagnostics.length).toBeGreaterThan(0);
  });
});
