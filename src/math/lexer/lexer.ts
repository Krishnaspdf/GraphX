import type { Token } from './types';

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < source.length) {
    const ch = source[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (ch === '(') {
      tokens.push({ type: 'LPAREN', value: ch, position: i });
      i++;
      continue;
    }
    if (ch === ')') {
      tokens.push({ type: 'RPAREN', value: ch, position: i });
      i++;
      continue;
    }
    if (ch === ',') {
      tokens.push({ type: 'COMMA', value: ch, position: i });
      i++;
      continue;
    }
    if (/\d/.test(ch) || ch === '.') {
      let num = '';
      while (i < source.length && (/\d/.test(source[i]) || source[i] === '.')) {
        num += source[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: num, position: i - num.length });
      continue;
    }
    if (/[a-zA-Z_]/.test(ch)) {
      let ident = '';
      while (i < source.length && /[a-zA-Z_0-9]/.test(source[i])) {
        ident += source[i];
        i++;
      }
      tokens.push({ type: 'IDENTIFIER', value: ident, position: i - ident.length });
      continue;
    }
    if ('+-*/^'.includes(ch)) {
      tokens.push({ type: 'OPERATOR', value: ch, position: i });
      i++;
      continue;
    }
    throw new Error(`Invalid character at position ${i}: ${ch}`);
  }
  tokens.push({ type: 'EOF', value: '', position: source.length });
  return tokens;
}
