import { prisma } from '../prisma';
import { calculateCourseReadiness } from './curriculumEngine';

export interface MasteryUpdateParams {
  userId: string;
  problemId: string;
  isCorrect: boolean;
  timeSpentSec: number;
  hintsUsed: number;
  attemptNumber: number;
  independenceScore: number;
}

export interface MasteryUpdateResult {
  updatedConcepts: Array<{
    conceptId: string;
    conceptName: string;
    conceptualScore: number;
    formulaScore: number;
    problemSolvingScore: number;
    transferScore: number;
    averageScore: number;
    scoreDelta: number;
  }>;
  affectedCourses: Array<{
    courseId: string;
    courseCode: string;
    courseName: string;
    examReadinessScore: number;
    progressPercent: number;
  }>;
}

/**
 * Updates UserConceptMastery across 4 rigorous academic dimensions
 * (conceptual, formula, problem solving, transfer) upon problem submission
 * and recalculates CourseReadiness for all parent courses.
 */
export async function updateMasteryOnSubmission(
  params: MasteryUpdateParams
): Promise<MasteryUpdateResult> {
  const {
    userId,
    problemId,
    isCorrect,
    timeSpentSec,
    hintsUsed,
    attemptNumber,
    independenceScore,
  } = params;

  // 1. Fetch problem and linked concepts
  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
    include: {
      concepts: {
        include: {
          concept: {
            include: {
              translations: { where: { language: 'tr' } },
              topicConcepts: {
                include: {
                  topic: {
                    include: {
                      course: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!problem || problem.concepts.length === 0) {
    return { updatedConcepts: [], affectedCourses: [] };
  }

  const updatedConceptsList: MasteryUpdateResult['updatedConcepts'] = [];
  const affectedCourseIds = new Set<string>();

  for (const pc of problem.concepts) {
    const concept = pc.concept;
    const conceptId = concept.id;
    const conceptName = concept.translations[0]?.name || concept.id;

    // Collect affected courses
    for (const tc of concept.topicConcepts) {
      if (tc.topic.courseId) {
        affectedCourseIds.add(tc.topic.courseId);
      }
    }

    // Get current mastery or initialize
    let currentMastery = await prisma.userConceptMastery.findUnique({
      where: {
        userId_conceptId: {
          userId,
          conceptId,
        },
      },
    });

    if (!currentMastery) {
      currentMastery = await prisma.userConceptMastery.create({
        data: {
          userId,
          conceptId,
          conceptualScore: 40,
          formulaScore: 40,
          problemSolvingScore: 30,
          transferScore: 30,
          independentSolvesCount: 0,
          totalSolvesCount: 0,
        },
      });
    }

    const prevAvg = Math.round(
      (currentMastery.conceptualScore +
        currentMastery.formulaScore +
        currentMastery.problemSolvingScore +
        currentMastery.transferScore) /
        4
    );

    let {
      conceptualScore,
      formulaScore,
      problemSolvingScore,
      transferScore,
      independentSolvesCount,
      totalSolvesCount,
    } = currentMastery;

    if (isCorrect) {
      totalSolvesCount += 1;
      const isIndependent = hintsUsed === 0 && attemptNumber === 1;
      if (isIndependent) {
        independentSolvesCount += 1;
      }

      // Delta calculations based on performance
      const qualityFactor = hintsUsed === 0 ? 1.0 : hintsUsed === 1 ? 0.7 : 0.4;
      const timeBonus = timeSpentSec <= (problem.estimatedTime * 60) ? 1.1 : 0.9;
      const ratingDifficultyBonus = Math.max(0.8, Math.min(1.4, problem.rating / 1400));

      const baseGain = Math.round(12 * qualityFactor * timeBonus * ratingDifficultyBonus);

      problemSolvingScore = Math.min(100, problemSolvingScore + baseGain);
      formulaScore = Math.min(100, formulaScore + Math.round(baseGain * 0.9));
      conceptualScore = Math.min(100, conceptualScore + Math.round(baseGain * 0.8));

      // Transfer score increases if problem is cross-disciplinary or high rating
      if (problem.category === 'MATH_X_CS' || problem.rating >= 1500) {
        transferScore = Math.min(100, transferScore + Math.round(baseGain * 1.1));
      } else {
        transferScore = Math.min(100, transferScore + Math.round(baseGain * 0.6));
      }
    } else {
      // Diagnostic penalty / error reflection
      // Conceptual & formula scores drop mildly, pointing to needed review
      const penalty = attemptNumber > 2 ? 8 : 4;
      problemSolvingScore = Math.max(10, problemSolvingScore - penalty);
      formulaScore = Math.max(15, formulaScore - Math.round(penalty * 0.7));
      conceptualScore = Math.max(20, conceptualScore - Math.round(penalty * 0.5));
    }

    const newAvg = Math.round(
      (conceptualScore + formulaScore + problemSolvingScore + transferScore) / 4
    );

    // Save updated mastery
    await prisma.userConceptMastery.update({
      where: {
        userId_conceptId: {
          userId,
          conceptId,
        },
      },
      data: {
        conceptualScore,
        formulaScore,
        problemSolvingScore,
        transferScore,
        independentSolvesCount,
        totalSolvesCount,
        lastPracticedAt: new Date(),
      },
    });

    updatedConceptsList.push({
      conceptId,
      conceptName,
      conceptualScore,
      formulaScore,
      problemSolvingScore,
      transferScore,
      averageScore: newAvg,
      scoreDelta: newAvg - prevAvg,
    });
  }

  // 2. Recalculate Course Readiness for all affected courses
  const affectedCoursesList: MasteryUpdateResult['affectedCourses'] = [];
  for (const courseId of affectedCourseIds) {
    try {
      const readiness = await calculateCourseReadiness(courseId, userId);
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: { code: true, name: true },
      });

      if (course) {
        affectedCoursesList.push({
          courseId,
          courseCode: course.code,
          courseName: course.name,
          examReadinessScore: readiness.examReadinessScore,
          progressPercent: readiness.topicCoverageScore,
        });
      }
    } catch (e) {
      console.error(`Failed to recalculate readiness for course ${courseId}:`, e);
    }
  }

  return {
    updatedConcepts: updatedConceptsList,
    affectedCourses: affectedCoursesList,
  };
}

/**
 * Record a lesson completion event to directly boost conceptual understanding.
 */
export async function recordLessonConceptProgress(
  userId: string,
  conceptId: string,
  miniCheckPassed: boolean
): Promise<{ conceptualScore: number; isUnlocked: boolean }> {
  let currentMastery = await prisma.userConceptMastery.findUnique({
    where: {
      userId_conceptId: {
        userId,
        conceptId,
      },
    },
  });

  const baseGain = miniCheckPassed ? 25 : 12;

  if (!currentMastery) {
    currentMastery = await prisma.userConceptMastery.create({
      data: {
        userId,
        conceptId,
        conceptualScore: Math.min(100, 50 + baseGain),
        formulaScore: 50,
        problemSolvingScore: 30,
        transferScore: 25,
      },
    });
  } else {
    currentMastery = await prisma.userConceptMastery.update({
      where: {
        userId_conceptId: {
          userId,
          conceptId,
        },
      },
      data: {
        conceptualScore: Math.min(100, currentMastery.conceptualScore + baseGain),
        formulaScore: Math.min(100, currentMastery.formulaScore + (miniCheckPassed ? 15 : 5)),
        lastPracticedAt: new Date(),
      },
    });
  }

  // Find parent courses and recompute readiness
  const concept = await prisma.concept.findUnique({
    where: { id: conceptId },
    include: {
      topicConcepts: {
        include: {
          topic: true,
        },
      },
    },
  });

  if (concept) {
    for (const tc of concept.topicConcepts) {
      if (tc.topic.courseId) {
        await calculateCourseReadiness(tc.topic.courseId, userId).catch(() => {});
      }
    }
  }

  return {
    conceptualScore: currentMastery.conceptualScore,
    isUnlocked: currentMastery.conceptualScore >= 60,
  };
}
