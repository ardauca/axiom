import { test, describe } from 'node:test';
import assert from 'node:assert';
import { calculateNextReview } from '../src/lib/algorithms/spacedRepetition.js';

describe('Axiom SuperMemo SM-2 Spaced Repetition', () => {
  test('schedules initial review after 1 day on first perfect solve', () => {
    const res = calculateNextReview({
      quality: 5,
      previousRepetition: 0,
      previousInterval: 1.0,
      previousEaseFactor: 2.5,
    });

    assert.strictEqual(res.intervalDays, 1.0);
    assert.strictEqual(res.repetition, 1);
    assert.strictEqual(res.easeFactor >= 2.5, true);
  });

  test('schedules second review after 6 days on consecutive success', () => {
    const res = calculateNextReview({
      quality: 5,
      previousRepetition: 1,
      previousInterval: 1.0,
      previousEaseFactor: 2.6,
    });

    assert.strictEqual(res.intervalDays, 6.0);
    assert.strictEqual(res.repetition, 2);
  });

  test('resets repetition to 0 and interval to 1 day on recall failure', () => {
    const res = calculateNextReview({
      quality: 1, // failure
      previousRepetition: 3,
      previousInterval: 15.0,
      previousEaseFactor: 2.5,
    });

    assert.strictEqual(res.intervalDays, 1.0);
    assert.strictEqual(res.repetition, 0);
    assert.strictEqual(res.easeFactor < 2.5, true);
  });
});
