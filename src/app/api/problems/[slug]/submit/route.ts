import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth/session';
import { verifyAnswer } from '@/lib/verification/cas';
import { calculateRatingUpdate } from '@/lib/algorithms/elo';
import { calculateNextReview } from '@/lib/algorithms/spacedRepetition';
import { diagnoseError, recordMistakeWithDiagnosis } from '@/lib/tutor/remediationEngine';
import { updateMasteryOnSubmission } from '@/lib/tutor/masteryEngine';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const { userAnswer, timeSpentSec = 60, hintsUsed = 0, attemptNumber = 1 } = body;

    const problem = await prisma.problem.findUnique({
      where: { slug },
      include: {
        concepts: {
          include: {
            concept: {
              include: {
                translations: true,
                prerequisites: {
                  include: {
                    prerequisite: {
                      include: {
                        translations: true,
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

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    // 1. Verify Answer with CAS / Deterministic Engine
    const verification = verifyAnswer({
      userAnswer: String(userAnswer),
      correctAnswer: problem.correctAnswer,
      questionType: problem.questionType,
    });

    const isCorrect = verification.isCorrect;

    // Prerequisite diagnostic check on incorrect attempt
    const prerequisiteRecommendations: Array<{
      prerequisiteId: string;
      prerequisiteName: string;
      prerequisiteDual: string;
      reason: string;
      parentConcept: string;
    }> = [];

    if (!isCorrect) {
      for (const pc of problem.concepts) {
        for (const dep of pc.concept.prerequisites) {
          const nameEn = dep.prerequisite.translations.find((t) => t.language === 'en')?.name || dep.prerequisite.id;
          const dualTr = dep.prerequisite.translations.find((t) => t.language === 'tr')?.dualTerminology || nameEn;
          const parentName = pc.concept.translations.find((t) => t.language === 'en')?.name || pc.concept.id;

          prerequisiteRecommendations.push({
            prerequisiteId: dep.prerequisite.id,
            prerequisiteName: nameEn,
            prerequisiteDual: dualTr,
            reason: dep.importance,
            parentConcept: parentName,
          });
        }
      }
    }

    // 2. Retrieve User Profile
    const user = await getSessionUser(req);

    // 3. Compute Adaptive Rating and Independence
    const ratingResult = calculateRatingUpdate({
      userRating: user.rating,
      problemRating: problem.rating,
      isCorrect,
      timeSpentSec,
      estimatedTimeMin: problem.estimatedTime,
      hintsUsed,
      currentIndependence: user.independenceScore,
      attemptNumber,
    });

    // 4. Update User in DB
    await prisma.user.update({
      where: { id: user.id },
      data: {
        rating: ratingResult.newRating,
        independenceScore: ratingResult.newOverallIndependence,
        xp: { increment: ratingResult.xpEarned },
        lastActiveDate: new Date(),
      },
    });

    // 5. Update Problem Solve Counters
    await prisma.problem.update({
      where: { id: problem.id },
      data: {
        attemptCount: { increment: 1 },
        solveCount: isCorrect ? { increment: 1 } : undefined,
      },
    });

    // 6. Record Submission
    await prisma.submission.create({
      data: {
        userId: user.id,
        problemId: problem.id,
        userAnswer: String(userAnswer),
        isCorrect,
        timeSpentSec,
        hintsRevealed: hintsUsed,
        ratingBefore: user.rating,
        ratingAfter: ratingResult.newRating,
        independenceEarned: ratingResult.independenceScore,
        xpEarned: ratingResult.xpEarned,
      },
    });

    // 7. Mistake Notebook & Adaptive Remediation Handling
    let remediation = null;
    if (!isCorrect) {
      remediation = diagnoseError(
        String(userAnswer),
        problem.correctAnswer,
        problem.concepts
      );
      await recordMistakeWithDiagnosis(
        user.id,
        problem.id,
        String(userAnswer),
        remediation
      );
    } else {
      await prisma.mistakeItem.updateMany({
        where: {
          userId: user.id,
          problemId: problem.id,
        },
        data: {
          resolved: true,
          repairedAt: new Date(),
        },
      });

      const reviewQuality = hintsUsed === 0 ? 5 : hintsUsed === 1 ? 4 : 3;
      const schedule = calculateNextReview({ quality: reviewQuality });

      await prisma.spacedReview.upsert({
        where: {
          userId_problemId: {
            userId: user.id,
            problemId: problem.id,
          },
        },
        update: {
          intervalDays: schedule.intervalDays,
          easeFactor: schedule.easeFactor,
          repetition: schedule.repetition,
          dueDate: schedule.dueDate,
        },
        create: {
          userId: user.id,
          problemId: problem.id,
          intervalDays: schedule.intervalDays,
          easeFactor: schedule.easeFactor,
          repetition: schedule.repetition,
          dueDate: schedule.dueDate,
        },
      });
    }

    // 8. Update UserConceptMastery & CourseReadiness (True Course Connection)
    const masteryImpact = await updateMasteryOnSubmission({
      userId: user.id,
      problemId: problem.id,
      isCorrect,
      timeSpentSec,
      hintsUsed,
      attemptNumber,
      independenceScore: ratingResult.independenceScore,
    });

    return NextResponse.json({
      isCorrect,
      userAnswer,
      correctAnswer: problem.correctAnswer,
      verificationMethod: verification.verificationMethod,
      pointsTested: verification.pointsTested,
      prerequisiteRecommendations,
      remediation,
      masteryImpact,
      ratingUpdate: {
        oldRating: user.rating,
        newRating: ratingResult.newRating,
        ratingDelta: ratingResult.ratingDelta,
        independenceScore: ratingResult.independenceScore,
        newOverallIndependence: ratingResult.newOverallIndependence,
        xpEarned: ratingResult.xpEarned,
      },
    });
  } catch (error) {
    console.error('Submission API error:', error);
    return NextResponse.json({ error: 'Failed to process submission' }, { status: 500 });
  }
}
