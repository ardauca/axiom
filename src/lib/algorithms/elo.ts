/**
 * Axiom Adaptive Rating Engine:
 * Separates Problem Skill Rating (Elo) from Independence Score (Self-Reliance).
 * Guarantees that using pedagogical hints does not destroy the student's mathematical rating.
 */

export interface RatingResult {
  newRating: number;
  ratingDelta: number;
  independenceScore: number; // 1.0 to 5.0 stars
  newOverallIndependence: number;
  xpEarned: number;
}

export function calculateRatingUpdate({
  userRating,
  problemRating,
  isCorrect,
  timeSpentSec,
  estimatedTimeMin,
  hintsUsed,
  currentIndependence = 5.0,
  attemptNumber = 1,
}: {
  userRating: number;
  problemRating: number;
  isCorrect: boolean;
  timeSpentSec: number;
  estimatedTimeMin: number;
  hintsUsed: number;
  currentIndependence?: number;
  attemptNumber?: number;
}): RatingResult {
  // 1. Elo Expected Score
  const exponent = (problemRating - userRating) / 400.0;
  const expected = 1.0 / (1.0 + Math.pow(10, exponent));

  // 2. K-Factor: Dynamic based on user rating tier
  let k = 32;
  if (userRating > 1800) k = 24;
  if (userRating > 2100) k = 16;

  // 3. Score determination
  // Hints do NOT zero out the solve! Solved with hints still proves comprehension of the concept.
  let actual = isCorrect ? 1.0 : 0.0;

  // 4. Minor time multiplier (up to +-10% scaling, never punitive)
  const estSeconds = Math.max(60, estimatedTimeMin * 60);
  const timeRatio = timeSpentSec / estSeconds;
  let timeMultiplier = 1.0;
  if (isCorrect && timeRatio < 0.75) {
    timeMultiplier = 1.1; // modest speed bonus
  } else if (isCorrect && timeRatio > 2.5) {
    timeMultiplier = 0.95;
  }

  // Calculate raw rating delta
  let ratingDelta = Math.round(k * (actual - expected) * timeMultiplier);

  // If correct, ensure at least +2 rating gain against valid problems
  if (isCorrect && ratingDelta <= 0) {
    ratingDelta = 2;
  }

  const newRating = Math.max(800, userRating + ratingDelta);

  // 5. Independence Score Calculation (1.0 - 5.0)
  let independenceScore: number;
  if (!isCorrect) {
    independenceScore = 1.0;
  } else if (hintsUsed === 0) {
    independenceScore = attemptNumber === 1 ? 5.0 : 4.0;
  } else if (hintsUsed === 1) {
    independenceScore = 3.0;
  } else if (hintsUsed === 2) {
    independenceScore = 2.0;
  } else {
    independenceScore = 1.0;
  }

  // Exponential moving average for user's overall independence
  const alpha = 0.15;
  const newOverallIndependence = Number(
    (currentIndependence * (1 - alpha) + independenceScore * alpha).toFixed(2)
  );

  // 6. Academic XP Calculation
  let xpEarned = 0;
  if (isCorrect) {
    const baseXP = Math.round(problemRating / 10);
    const independenceBonus = Math.round(independenceScore * 10);
    xpEarned = baseXP + independenceBonus;
  } else {
    xpEarned = 10; // Effort / participation reward
  }

  return {
    newRating,
    ratingDelta,
    independenceScore,
    newOverallIndependence,
    xpEarned,
  };
}

/**
 * Difficulty tier classification helper
 */
export function getDifficultyTier(rating: number): {
  labelEn: string;
  labelTr: string;
  colorClass: string;
} {
  if (rating < 1150) {
    return { labelEn: 'Beginner', labelTr: 'Başlangıç', colorClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
  }
  if (rating < 1350) {
    return { labelEn: 'Easy', labelTr: 'Kolay', colorClass: 'text-blue-500 bg-blue-500/10 border-blue-500/20' };
  }
  if (rating < 1550) {
    return { labelEn: 'Intermediate', labelTr: 'Orta Düzey', colorClass: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
  }
  if (rating < 1750) {
    return { labelEn: 'Advanced', labelTr: 'İleri Düzey', colorClass: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' };
  }
  if (rating < 1950) {
    return { labelEn: 'Very Advanced', labelTr: 'Üst Düzey', colorClass: 'text-purple-500 bg-purple-500/10 border-purple-500/20' };
  }
  return { labelEn: 'Expert', labelTr: 'Uzman', colorClass: 'text-rose-500 bg-rose-500/10 border-rose-500/20' };
}
