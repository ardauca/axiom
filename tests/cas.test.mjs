import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  verifyAnswer,
  areAlgebraicallyEquivalent,
  parseNumericValue,
  normalizeMathString,
} from '../src/lib/verification/cas.js';

describe('Axiom CAS & Mathematical Answer Verification', () => {
  test('recognizes algebraically equivalent expressions', () => {
    // n(n+1)/2 == (n^2 + n)/2
    assert.strictEqual(
      areAlgebraicallyEquivalent('n*(n+1)/2', '(n^2 + n)/2'),
      true
    );

    // (n-1)*(n+1) == n^2 - 1
    assert.strictEqual(
      areAlgebraicallyEquivalent('(n-1)*(n+1)', 'n^2 - 1'),
      true
    );

    // Non-equivalent
    assert.strictEqual(
      areAlgebraicallyEquivalent('n^2 + 1', 'n^2 - 1'),
      false
    );
  });

  test('parses fractional and decimal inputs accurately', () => {
    assert.strictEqual(parseNumericValue('3/4'), 0.75);
    assert.strictEqual(parseNumericValue(' 7 / 14 '), 0.5);
    assert.strictEqual(parseNumericValue('-5'), -5);
    assert.strictEqual(parseNumericValue('42'), 42);
  });

  test('verifies numeric problem answers with tolerance', () => {
    const resInt = verifyAnswer({
      userAnswer: '9',
      correctAnswer: '9',
      questionType: 'NUMERIC',
    });
    assert.strictEqual(resInt.isCorrect, true);

    const resFrac = verifyAnswer({
      userAnswer: '0.8',
      correctAnswer: '4/5',
      questionType: 'NUMERIC',
    });
    assert.strictEqual(resFrac.isCorrect, true);

    const resFail = verifyAnswer({
      userAnswer: '7',
      correctAnswer: '9',
      questionType: 'NUMERIC',
    });
    assert.strictEqual(resFail.isCorrect, false);
  });

  test('verifies multiple choice and boolean logic questions', () => {
    const resMC = verifyAnswer({
      userAnswer: 'low + (high - low) / 2',
      correctAnswer: 'low + (high - low) / 2',
      questionType: 'DEBUGGING',
    });
    assert.strictEqual(resMC.isCorrect, true);
  });
});
