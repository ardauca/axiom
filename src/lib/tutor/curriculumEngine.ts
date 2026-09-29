import { prisma } from '../prisma';

export interface CurriculumStatus {
  courseId: string;
  courseName: string;
  code: string;
  progressPercent: number;
  totalConcepts: number;
  masteredConceptsCount: number;
  currentTopic: {
    id: string;
    title: string;
    unitTitle: string;
    estimatedMinutes: number;
  } | null;
  nextConcept: {
    id: string;
    name: string;
    formalStatement: string;
    prerequisites: Array<{ id: string; name: string; isMastered: boolean }>;
  } | null;
  units: Array<{
    title: string;
    topics: Array<{
      id: string;
      title: string;
      estimatedMinutes: number;
      concepts: Array<{
        id: string;
        name: string;
        status: 'MASTERED' | 'IN_PROGRESS' | 'LOCKED' | 'NOT_STARTED';
        masteryScore: number;
      }>;
    }>;
  }>;
}

export async function getCourseCurriculum(courseId: string, userId: string): Promise<CurriculumStatus | null> {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      topics: {
        orderBy: { orderIndex: 'asc' },
        include: {
          concepts: {
            include: {
              concept: {
                include: {
                  translations: { where: { language: 'tr' } },
                  prerequisites: {
                    include: {
                      prerequisite: {
                        include: { translations: { where: { language: 'tr' } } }
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

  if (!course) return null;

  // Fetch user masteries
  const masteries = await prisma.userConceptMastery.findMany({
    where: { userId }
  });
  const masteryMap = new Map<string, number>();
  for (const m of masteries) {
    const avg = Math.round((m.conceptualScore + m.formulaScore + m.problemSolvingScore + m.transferScore) / 4);
    masteryMap.set(m.conceptId, avg);
  }

  const unitsMap = new Map<string, any[]>();
  let totalConcepts = 0;
  let masteredCount = 0;
  let nextConceptToLearn: any = null;
  let currentTopicToLearn: any = null;

  for (const topic of course.topics) {
    const unitTitle = topic.unitTitle || 'Genel Müfredat';
    if (!unitsMap.has(unitTitle)) {
      unitsMap.set(unitTitle, []);
    }

    const topicConcepts: any[] = [];

    for (const tc of topic.concepts) {
      totalConcepts++;
      const cid = tc.concept.id;
      const cScore = masteryMap.get(cid) || 0;
      const trName = tc.concept.translations[0]?.name || cid;

      // Check prerequisites
      let prereqsSatisfied = true;
      const prereqsList: any[] = [];
      for (const p of tc.concept.prerequisites) {
        const pScore = masteryMap.get(p.prerequisite.id) || 0;
        const pMastered = pScore >= 70;
        if (!pMastered) prereqsSatisfied = false;
        prereqsList.push({
          id: p.prerequisite.id,
          name: p.prerequisite.translations[0]?.name || p.prerequisite.id,
          isMastered: pMastered
        });
      }

      let status: 'MASTERED' | 'IN_PROGRESS' | 'LOCKED' | 'NOT_STARTED' = 'NOT_STARTED';
      if (cScore >= 80) {
        status = 'MASTERED';
        masteredCount++;
      } else if (cScore > 0) {
        status = 'IN_PROGRESS';
      } else if (!prereqsSatisfied) {
        status = 'LOCKED';
      }

      if (!nextConceptToLearn && status !== 'MASTERED' && prereqsSatisfied) {
        nextConceptToLearn = {
          id: cid,
          name: trName,
          formalStatement: tc.concept.formalStatement,
          prerequisites: prereqsList
        };
        currentTopicToLearn = {
          id: topic.id,
          title: topic.title,
          unitTitle,
          estimatedMinutes: topic.estimatedMinutes
        };
      }

      topicConcepts.push({
        id: cid,
        name: trName,
        status,
        masteryScore: cScore
      });
    }

    unitsMap.get(unitTitle)!.push({
      id: topic.id,
      title: topic.title,
      estimatedMinutes: topic.estimatedMinutes,
      concepts: topicConcepts
    });
  }

  const units = Array.from(unitsMap.entries()).map(([title, topics]) => ({
    title,
    topics
  }));

  const progressPercent = totalConcepts > 0 ? Math.round((masteredCount / totalConcepts) * 100) : 0;

  return {
    courseId: course.id,
    courseName: course.name,
    code: course.code,
    progressPercent,
    totalConcepts,
    masteredConceptsCount: masteredCount,
    currentTopic: currentTopicToLearn,
    nextConcept: nextConceptToLearn,
    units
  };
}

export interface CourseReadinessResult {
  topicCoverageScore: number;
  conceptMasteryScore: number;
  problemSolvingScore: number;
  retentionScore: number;
  examReadinessScore: number;
  weakTopicsCount: number;
  targetReadiness: number;
  daysToExam: number | null;
}

export async function calculateCourseReadiness(
  courseId: string,
  userId: string
): Promise<CourseReadinessResult> {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      topics: {
        include: {
          concepts: {
            include: { concept: true }
          }
        }
      }
    }
  });

  if (!course) {
    throw new Error(`Course not found: ${courseId}`);
  }

  // Concept masteries
  const allConceptIds = course.topics.flatMap(t => t.concepts.map(c => c.concept.id));
  const masteries = await prisma.userConceptMastery.findMany({
    where: {
      userId,
      conceptId: { in: allConceptIds }
    }
  });

  const masteryMap = new Map<string, number>();
  for (const m of masteries) {
    const avg = Math.round((m.conceptualScore + m.formulaScore + m.problemSolvingScore + m.transferScore) / 4);
    masteryMap.set(m.conceptId, avg);
  }

  const totalConcepts = allConceptIds.length;
  let practicedConcepts = 0;
  let totalMasterySum = 0;
  let weakCount = 0;

  for (const topic of course.topics) {
    let topicMasterySum = 0;
    for (const tc of topic.concepts) {
      const score = masteryMap.get(tc.concept.id) || 0;
      if (score > 0) practicedConcepts++;
      totalMasterySum += score;
      topicMasterySum += score;
    }
    const topicAvg = topic.concepts.length > 0 ? topicMasterySum / topic.concepts.length : 0;
    if (topicAvg < 60) {
      weakCount++;
    }
  }

  const topicCoverageScore = totalConcepts > 0 ? Math.round((practicedConcepts / totalConcepts) * 100) : 0;
  const conceptMasteryScore = totalConcepts > 0 ? Math.round(totalMasterySum / totalConcepts) : 0;

  // Problem solving score from submissions on problems linked to these concepts
  const submissions = await prisma.submission.findMany({
    where: {
      userId,
      problem: {
        concepts: {
          some: { conceptId: { in: allConceptIds } }
        }
      }
    }
  });

  let problemSolvingScore = 0;
  if (submissions.length > 0) {
    const correctCount = submissions.filter(s => s.isCorrect).length;
    problemSolvingScore = Math.round((correctCount / submissions.length) * 100);
  } else if (conceptMasteryScore > 0) {
    problemSolvingScore = Math.round(conceptMasteryScore * 0.85);
  }

  // Spaced review retention
  const spacedReviews = await prisma.spacedReview.findMany({
    where: {
      userId,
      problem: {
        concepts: {
          some: { conceptId: { in: allConceptIds } }
        }
      }
    }
  });

  const retentionScore = spacedReviews.length > 0
    ? Math.min(100, Math.round(spacedReviews.reduce((acc, r) => acc + (r.repetition >= 2 ? 100 : 60), 0) / spacedReviews.length))
    : (conceptMasteryScore > 50 ? 80 : 50);

  // Evidence-based weighted index
  // 35% Concept Mastery + 30% Problem Solving + 20% Topic Coverage + 15% Retention
  const examReadinessScore = Math.round(
    conceptMasteryScore * 0.35 +
    problemSolvingScore * 0.30 +
    topicCoverageScore * 0.20 +
    retentionScore * 0.15
  );

  let daysToExam: number | null = null;
  if (course.examDate) {
    const now = new Date();
    const diffTime = course.examDate.getTime() - now.getTime();
    daysToExam = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  // Persist into CourseReadiness
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
      topicCoverageScore,
      conceptMasteryScore,
      problemSolvingScore,
      retentionScore,
      examReadinessScore,
      weakTopicsCount: weakCount
    },
    update: {
      topicCoverageScore,
      conceptMasteryScore,
      problemSolvingScore,
      retentionScore,
      examReadinessScore,
      weakTopicsCount: weakCount
    }
  });

  return {
    topicCoverageScore,
    conceptMasteryScore,
    problemSolvingScore,
    retentionScore,
    examReadinessScore,
    weakTopicsCount: weakCount,
    targetReadiness: 85,
    daysToExam
  };
}

