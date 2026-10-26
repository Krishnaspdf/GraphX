import { describe, it, expect } from 'vitest';
import { tokenize } from '../lexer/lexer';

describe('lexer', () => {
  it('tokenizes numbers', () => {
    const toks = tokenize('42');
    expect(toks[0].type).toBe('NUMBER');
    expect(toks[0].value).toBe('42');
  });
  it('tokenizes identifiers', () => {
    const toks = tokenize('sin');
    expect(toks[0].type).toBe('IDENTIFIER');
  });
});
