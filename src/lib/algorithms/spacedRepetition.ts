/**
 * SuperMemo SM-2 Spaced Repetition Algorithm:
 * Calculates next review interval, ease factor, and due dates
 * to ensure students do not forget foundational concepts.
 */

export interface SpacedScheduleResult {
  intervalDays: number;
  easeFactor: number;
  repetition: number;
  dueDate: Date;
}

export function calculateNextReview({
  quality,
  previousRepetition = 0,
  previousInterval = 1.0,
  previousEaseFactor = 2.5,
}: {
  quality: number; // 0 to 5
  previousRepetition?: number;
  previousInterval?: number;
  previousEaseFactor?: number;
}): SpacedScheduleResult {
  let intervalDays: number;
  let repetition: number;
  let easeFactor: number;

  // Compute new Ease Factor
  easeFactor =
    previousEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  // Quality >= 3 denotes successful recall/solve
  if (quality >= 3) {
    if (previousRepetition === 0) {
      intervalDays = 1.0;
    } else if (previousRepetition === 1) {
      intervalDays = 6.0;
    } else {
      intervalDays = Math.round(previousInterval * easeFactor);
    }
    repetition = previousRepetition + 1;
  } else {
    // Failure resets repetition count to re-cement the concept
    repetition = 0;
    intervalDays = 1.0;
  }

  const dueDate = new Date();
  dueDate.setSeconds(dueDate.getSeconds() + intervalDays * 24 * 60 * 60);

  return {
    intervalDays,
    easeFactor: Number(easeFactor.toFixed(2)),
    repetition,
    dueDate,
  };
}
