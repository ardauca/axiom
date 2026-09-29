import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  areAlgebraicallyEquivalent,
  testAlgebraicEquivalence,
  normalizeMathString,
  extractVariables,
  evaluateExpression,
} from '../src/lib/verification/cas.js';

describe('Axiom Advanced CAS & Identity Engine', () => {
  test('verifies polynomial identities with implicit multiplication', () => {
    // (x+1)^2 == x^2 + 2x + 1
    assert.strictEqual(
      areAlgebraicallyEquivalent('(x+1)^2', 'x^2 + 2x + 1'),
      true
    );

    // 2x(x - 3) == 2x^2 - 6x
    assert.strictEqual(
      areAlgebraicallyEquivalent('2x(x - 3)', '2x^2 - 6x'),
      true
    );

    // Difference of squares: (2x - 3)(2x + 3) == 4x^2 - 9
    assert.strictEqual(
      areAlgebraicallyEquivalent('(2x - 3)(2x + 3)', '4x^2 - 9'),
      true
    );
  });

  test('verifies rational function identities without singularity pole failure', () => {
    // 1/(x-1) - 1/(x+1) == 2/(x^2 - 1)
    // Singularity poles at x=1 and x=-1 must be avoided by the sampler
    assert.strictEqual(
      areAlgebraicallyEquivalent('1/(x-1) - 1/(x+1)', '2/(x^2 - 1)'),
      true
    );
  });

  test('verifies fundamental trigonometric identities', () => {
    // sin^2(x) + cos^2(x) == 1
    assert.strictEqual(
      areAlgebraicallyEquivalent('sin^2(x) + cos^2(x)', '1'),
      true
    );

    // tan(x) == sin(x)/cos(x)
    assert.strictEqual(
      areAlgebraicallyEquivalent('tan(x)', 'sin(x)/cos(x)'),
      true
    );

    // 1 + tan^2(x) == sec^2(x)
    assert.strictEqual(
      areAlgebraicallyEquivalent('1 + tan^2(x)', 'sec^2(x)'),
      true
    );
  });

  test('handles multi-variable expressions and auto-detection', () => {
    // a^2 - b^2 == (a - b)(a + b)
    const vars = extractVariables('a^2 - b^2');
    assert.ok(vars.includes('a'));
    assert.ok(vars.includes('b'));

    assert.strictEqual(
      areAlgebraicallyEquivalent('a^2 - b^2', '(a - b)(a + b)'),
      true
    );

    // x*y + x*z == x*(y + z)
    assert.strictEqual(
      areAlgebraicallyEquivalent('x*y + x*z', 'x*(y + z)'),
      true
    );
  });

  test('normalizes LaTeX syntax into algebraic equivalents', () => {
    // \frac{n(n+1)}{2} == (n^2 + n) / 2
    assert.strictEqual(
      areAlgebraicallyEquivalent('\\frac{n(n+1)}{2}', '(n^2 + n)/2'),
      true
    );

    // \sin^2(x) + \cos^2(x) == 1
    assert.strictEqual(
      areAlgebraicallyEquivalent('\\sin^2(x) + \\cos^2(x)', '1'),
      true
    );
  });

  test('rejects non-equivalent expressions accurately', () => {
    assert.strictEqual(
      areAlgebraicallyEquivalent('(x+1)^2', 'x^2 + 1'),
      false
    );

    assert.strictEqual(
      areAlgebraicallyEquivalent('sin(x) + cos(x)', '1'),
      false
    );

    assert.strictEqual(
      areAlgebraicallyEquivalent('x^3 - 1', '(x-1)(x^2 + 1)'),
      false
    );
  });

  test('returns honest verification metadata with sampled points', () => {
    const res = testAlgebraicEquivalence('(k+1)^3', 'k^3 + 3k^2 + 3k + 1');
    assert.strictEqual(res.isEquivalent, true);
    assert.ok(res.pointsTested >= 3, 'Must test at least 3 points');
  });
});
