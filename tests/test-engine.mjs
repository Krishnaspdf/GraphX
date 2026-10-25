#!/usr/bin/env node
// Basic engine verification (run with: node tests/test-engine.mjs)
import { parseExpression, evaluateString } from '../src/math/engine.js';

let passed = 0;
let failed = 0;

function assertEqual(label, actual, expected) {
  if (Math.abs(actual - expected) < 1e-4) {
    console.log('PASS:', label);
    passed++;
  } else {
    console.log('FAIL:', label, '| expected', expected, '| got', actual);
    failed++;
  }
}

assertEqual('sin(x) at 0', evaluateString('sin(x)', { x: 0 }), 0);
assertEqual('2 + 3', evaluateString('2 + 3', {}), 5);
assertEqual('sqrt(4)', evaluateString('sqrt(4)', {}), 2);
assertEqual('pi', evaluateString('pi', {}), Math.PI);
assertEqual('x + 5 at x=10', evaluateString('x + 5', { x: 10 }), 15);
console.log(`\nResults: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
