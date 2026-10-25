export function tokenize(input) {
  const tokens = [];
  let i = 0;
  while (i < input.length) {
    const ch = input[i];
    if (/[\s]/.test(ch)) { i++; continue; }
    if (/[0-9.]/.test(ch)) {
      let num = '';
      while (i < input.length && /[0-9.]/.test(input[i])) num += input[i++];
      tokens.push({ type: 'NUMBER', value: parseFloat(num) });
      continue;
    }
    if (/[a-zA-Z]/.test(ch)) {
      let name = '';
      while (i < input.length && /[a-zA-Z]/.test(input[i])) name += input[i++];
      tokens.push({ type: 'IDENT', value: name });
      continue;
    }
    if (/[+\-*/^]/.test(ch)) {
      tokens.push({ type: 'OP', value: ch, precedence: ch === '^' ? 3 : ch === '*' || ch === '/' ? 2 : 1 });
      i++;
      continue;
    }
    if (ch === '(' || ch === ')' || ch === ',') {
      tokens.push({ type: ch === '(' ? 'LPAREN' : ch === ')' ? 'RPAREN' : 'COMMA', value: ch });
      i++;
      continue;
    }
    throw new Error(`Unknown char: ${ch}`);
  }
  tokens.push({ type: 'EOF', value: null });
  return tokens;
}
