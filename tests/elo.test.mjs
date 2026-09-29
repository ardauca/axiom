import { test, describe } from 'node:test';
import assert from 'node:assert';
import { calculateRatingUpdate, getDifficultyTier } from '../src/lib/algorithms/elo.js';

describe('Axiom Elo & Independence Engine', () => {
  test('separates skill rating from hint dependence and does not crush rating on hint usage', () => {
    // User rating 1400, problem rating 1500 (challenging problem)
    const resultNoHint = calculateRatingUpdate({
      userRating: 1400,
      problemRating: 1500,
      isCorrect: true,
      timeSpentSec: 300,
      estimatedTimeMin: 10,
      hintsUsed: 0,
      currentIndependence: 5.0,
      attemptNumber: 1,
    });

    const resultWith2Hints = calculateRatingUpdate({
      userRating: 1400,
      problemRating: 1500,
      isCorrect: true,
      timeSpentSec: 300,
      estimatedTimeMin: 10,
      hintsUsed: 2,
      currentIndependence: 5.0,
      attemptNumber: 1,
    });

    // Both should gain rating because the student solved a harder problem
    assert.strictEqual(resultNoHint.ratingDelta > 0, true);
    assert.strictEqual(resultWith2Hints.ratingDelta > 0, true);
    assert.strictEqual(resultNoHint.newRating >= 1410, true);
    assert.strictEqual(resultWith2Hints.newRating >= 1410, true);

    // Independence Score should reflect hint usage
    assert.strictEqual(resultNoHint.independenceScore, 5.0);
    assert.strictEqual(resultWith2Hints.independenceScore, 2.0);
  });

  test('gives minimum +2 rating delta on correct solve', () => {
    const result = calculateRatingUpdate({
      userRating: 2000,
      problemRating: 1000,
      isCorrect: true,
      timeSpentSec: 30,
      estimatedTimeMin: 5,
      hintsUsed: 0,
    });

    assert.strictEqual(result.ratingDelta >= 2, true);
  });

  test('maps difficulty tiers accurately', () => {
    assert.strictEqual(getDifficultyTier(1100).labelEn, 'Beginner');
    assert.strictEqual(getDifficultyTier(1300).labelEn, 'Easy');
    assert.strictEqual(getDifficultyTier(1500).labelEn, 'Intermediate');
    assert.strictEqual(getDifficultyTier(1700).labelEn, 'Advanced');
    assert.strictEqual(getDifficultyTier(2000).labelEn, 'Expert');
  });
});
