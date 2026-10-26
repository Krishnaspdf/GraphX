import { tokenize } from '../lexer/lexer';
import type { Token } from '../lexer/types';
import type { ExprNode } from '../ast/types';

export function parseExpression(source: string): ExprNode {
  const tokens = tokenize(source);
  let pos = 0;

  function current(): Token {
    return tokens[pos];
  }

  function advance(): Token {
    return tokens[pos++];
  }

  function parseExpressionPrecedence(): ExprNode {
    return parseAddSub();
  }

  function parseAddSub(): ExprNode {
    let node = parseMulDiv();
    while (current().value === '+' || current().value === '-') {
      const op = advance().value;
      const right = parseMulDiv();
      node = { kind: 'binary', operator: op, left: node, right };
    }
    return node;
  }

  function parseMulDiv(): ExprNode {
    let node = parsePower();
    while (current().value === '*' || current().value === '/') {
      const op = advance().value;
      const right = parsePower();
      node = { kind: 'binary', operator: op, left: node, right };
    }
    return node;
  }

  function parsePower(): ExprNode {
    let node = parseUnary();
    if (current().value === '^') {
      advance();
      const right = parseUnary();
      node = { kind: 'binary', operator: '^', left: node, right };
    }
    return node;
  }

  function parseUnary(): ExprNode {
    if (current().value === '-' || current().value === '+') {
      const op = advance().value;
      const arg = parseUnary();
      return { kind: 'unary', operator: op, argument: arg };
    }
    return parsePrimary();
  }

  function parsePrimary(): ExprNode {
    const tok = current();
    if (tok.type === 'NUMBER') {
      advance();
      return { kind: 'number', value: parseFloat(tok.value) };
    }
    if (tok.type === 'IDENTIFIER') {
      const name = tok.value;
      advance();
      if (current().type === 'LPAREN') {
        advance();
        if (current().type === 'RPAREN') {
          advance();
          return { kind: 'function', name, argument: { kind: 'number', value: 0 } };
        }
        const arg = parseExpressionPrecedence();
        if (current().type !== 'RPAREN') throw new Error('Expected )');
        advance();
        return { kind: 'function', name, argument: arg };
      }
      return { kind: 'variable', name };
    }
    if (tok.type === 'LPAREN') {
      advance();
      const expr = parseExpressionPrecedence();
      if (current().type !== 'RPAREN') throw new Error('Expected )');
      advance();
      return expr;
    }
    throw new Error(`Unexpected token: ${tok.value} at position ${tok.position}`);
  }

  return parseExpressionPrecedence();
}
