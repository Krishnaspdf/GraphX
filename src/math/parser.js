import { tokenize } from './tokenizer.js';

export function parseExpression(input) {
  const tokens = tokenize(input);
  let pos = 0;
  function current() { return tokens[pos]; }
  function advance() { return tokens[pos++]; }

  function parseExpression() { return parseAddSub(); }
  function parseAddSub() {
    let left = parseMulDiv();
    while (current().type === 'OP' && (current().value === '+' || current().value === '-')) {
      const op = advance().value;
      const right = parseMulDiv();
      left = { type: 'BINOP', op, left, right };
    }
    return left;
  }
  function parseMulDiv() {
    let left = parsePower();
    while (current().type === 'OP' && (current().value === '*' || current().value === '/')) {
      const op = advance().value;
      const right = parsePower();
      left = { type: 'BINOP', op, left, right };
    }
    return left;
  }
  function parsePower() {
    let left = parseUnary();
    if (current().type === 'OP' && current().value === '^') {
      advance();
      const right = parsePower();
      left = { type: 'BINOP', op: '^', left, right };
    }
    return left;
  }
  function parseUnary() {
    if (current().type === 'OP' && (current().value === '+' || current().value === '-')) {
      const op = advance().value;
      return { type: 'UNARY', op, operand: parseUnary() };
    }
    return parsePrimary();
  }
  function parsePrimary() {
    const tok = current();
    if (tok.type === 'NUMBER') {
      advance();
      return { type: 'NUMBER', value: tok.value };
    }
    if (tok.type === 'IDENT') {
      advance();
      if (current().type === 'LPAREN') {
        advance(); // (
        const args = [];
        if (current().type !== 'RPAREN') {
          args.push(parseExpression());
          while (current().type === 'COMMA') {
            advance();
            args.push(parseExpression());
          }
        }
        if (current().type !== 'RPAREN') throw new Error('Expected )');
        advance();
        return { type: 'CALL', name: tok.value, args };
      }
      return { type: 'VAR', name: tok.value };
    }
    if (tok.type === 'LPAREN') {
      advance();
      const inner = parseExpression();
      if (current().type !== 'RPAREN') throw new Error('Expected )');
      advance();
      return inner;
    }
    throw new Error('Unexpected token: ' + tok.type);
  }

  const ast = parseExpression();
  if (current().type !== 'EOF') throw new Error('Unexpected token after expression');
  return ast;
}
