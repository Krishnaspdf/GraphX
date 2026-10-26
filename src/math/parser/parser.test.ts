import { describe, it, expect } from 'vitest';
import { parseExpression } from '../parser/parser';

describe('parser', () => {
  it('parses a number', () => {
    const ast = parseExpression('3');
    expect(ast.kind).toBe('number');
  });
  it('parses binary addition', () => {
    const ast = parseExpression('1 + 2');
    expect(ast.kind).toBe('binary');
  });
  it('parses unary minus', () => {
    const ast = parseExpression('-5');
    expect(ast.kind).toBe('unary');
  });
});
