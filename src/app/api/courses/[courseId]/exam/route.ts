import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateGuestUser } from '@/lib/auth/session';
import { verifyAnswer } from '@/lib/verification/cas';
import { diagnoseError, recordMistakeWithDiagnosis } from '@/lib/tutor/remediationEngine';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        topics: {
          include: {
            concepts: {
              include: {
                concept: {
                  include: {
                    problems: {
                      include: {
                        problem: {
                          include: {
                            translations: { where: { language: 'tr' } }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Collect candidate exam problems
    const problemMap = new Map<string, any>();
    for (const topic of course.topics) {
      for (const tc of topic.concepts) {
        for (const p of tc.concept.problems) {
          if (!problemMap.has(p.problem.id)) {
            problemMap.set(p.problem.id, {
              ...p.problem,
              topicTitle: topic.title
            });
          }
        }
      }
    }

    // Select 4-6 representative problems
    const candidateList = Array.from(problemMap.values());
    const examProblems = candidateList.slice(0, 5).map((p, idx) => ({
      index: idx + 1,
      id: p.id,
      slug: p.slug,
      points: 20,
      topicTitle: p.topicTitle,
      title: p.translations[0]?.title || `Soru ${idx + 1}`,
      prompt: p.translations[0]?.prompt || '',
      questionType: p.questionType,
      options: p.translations[0]?.options ? JSON.parse(p.translations[0]?.options) : null,
      rating: p.rating,
      verificationSource: p.verificationSource || 'ESOGÜ Sınav Komisyonu'
    }));

    return NextResponse.json({
      success: true,
      course: {
        id: course.id,
        code: course.code,
        name: course.name,
        semester: course.semester
      },
      exam: {
        title: `${course.code} Dönem Sonu / Ara Sınav Simülasyonu`,
        totalDurationMinutes: 60,
        totalPoints: 100,
        problems: examProblems
      }
    });
  } catch (error) {
    console.error('Exam GET error:', error);
    return NextResponse.json({ error: 'Failed to generate exam paper' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const body = await req.json();
    const { answers, timeSpentSec = 3600 } = body; // map of problemId -> userAnswer

    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });
    const activeUser = adminUser || (await getOrCreateGuestUser());
    const userId = activeUser.id;

    let totalScore = 0;
    const totalPossible = 100;
    const results = [];

    const problemIds = Object.keys(answers || {});
    const problems = await prisma.problem.findMany({
      where: { id: { in: problemIds } },
      include: {
        translations: { where: { language: 'tr' } },
        concepts: {
          include: {
            concept: {
              include: {
                translations: true,
                prerequisites: {
                  include: {
                    prerequisite: {
                      include: { translations: true }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const pointsPerProblem = problems.length > 0 ? Math.floor(100 / problems.length) : 20;

    for (const prob of problems) {
      const userAnswer = String(answers[prob.id] || '');
      const verification = verifyAnswer({
        userAnswer,
        correctAnswer: prob.correctAnswer,
        questionType: prob.questionType
      });

      const isCorrect = verification.isCorrect;
      let remediation = null;

      if (isCorrect) {
        totalScore += pointsPerProblem;
        // Mark mistake resolved if any
        await prisma.mistakeItem.updateMany({
          where: { userId, problemId: prob.id },
          data: { resolved: true, repairedAt: new Date() }
        });
      } else {
        remediation = diagnoseError(userAnswer, prob.correctAnswer, prob.concepts);
        await recordMistakeWithDiagnosis(userId, prob.id, userAnswer, remediation);
      }

      // Record submission
      await prisma.submission.create({
        data: {
          userId,
          problemId: prob.id,
          userAnswer,
          isCorrect,
          timeSpentSec: Math.floor(timeSpentSec / problems.length),
          ratingBefore: activeUser.rating,
          ratingAfter: activeUser.rating + (isCorrect ? 10 : -5),
          xpEarned: isCorrect ? 25 : 5
        }
      });

      results.push({
        problemId: prob.id,
        title: prob.translations[0]?.title || prob.slug,
        userAnswer,
        correctAnswer: prob.correctAnswer,
        isCorrect,
        pointsEarned: isCorrect ? pointsPerProblem : 0,
        maxPoints: pointsPerProblem,
        solution: prob.translations[0]?.solution || '',
        remediation
      });
    }

    // Update CourseReadiness
    await prisma.courseReadiness.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      },
      create: {
        userId,
        courseId,
        problemSolvingScore: totalScore,
        examReadinessScore: Math.min(100, Math.round(totalScore * 0.9 + 10))
      },
      update: {
        problemSolvingScore: totalScore,
        examReadinessScore: Math.min(100, Math.round(totalScore * 0.9 + 10))
      }
    });

    return NextResponse.json({
      success: true,
      totalScore,
      totalPossible,
      passed: totalScore >= 60,
      results
    });
  } catch (error) {
    console.error('Exam submission error:', error);
    return NextResponse.json({ error: 'Failed to grade exam submission' }, { status: 500 });
  }
}
