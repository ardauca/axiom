import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateGuestUser } from '@/lib/auth/session';
import { getCourseCurriculum, calculateCourseReadiness } from '@/lib/tutor/curriculumEngine';

export async function GET(req: Request) {
  try {
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });
    const activeUser = adminUser || (await getOrCreateGuestUser());
    const userId = activeUser.id;

    // 1. Fetch current semester courses
    const courses = await prisma.course.findMany({
      orderBy: [
        { isCurrentSemester: 'desc' },
        { code: 'asc' }
      ],
      take: 6
    });

    const coursesWithProgress = [];
    let topRecommendation = null;

    for (const course of courses) {
      const curriculum = await getCourseCurriculum(course.id, userId);
      const readiness = await calculateCourseReadiness(course.id, userId);

      const courseItem = {
        id: course.id,
        code: course.code,
        name: course.name,
        department: course.department,
        semester: course.semester,
        isCurrentSemester: course.isCurrentSemester,
        progressPercent: curriculum?.progressPercent || 0,
        readinessScore: readiness.examReadinessScore,
        nextConcept: curriculum?.nextConcept || null,
        currentTopic: curriculum?.currentTopic || null,
        daysToExam: readiness.daysToExam
      };

      coursesWithProgress.push(courseItem);

      if (!topRecommendation && courseItem.nextConcept) {
        topRecommendation = {
          courseId: course.id,
          courseCode: course.code,
          courseName: course.name,
          topicTitle: courseItem.currentTopic?.title || 'Müfredat Konusu',
          conceptId: courseItem.nextConcept.id,
          conceptName: courseItem.nextConcept.name,
          estimatedMinutes: courseItem.currentTopic?.estimatedMinutes || 45,
          rationale: course.isCurrentSemester
            ? 'Aktif Dönem Müfredat Sırası + Sınav Önceliği'
            : 'Temel Önkoşul Dersi İlerlemesi'
        };
      }
    }

    // 2. Fetch unresolved mistakes needing repair
    const unresolvedMistakes = await prisma.mistakeItem.findMany({
      where: {
        userId,
        resolved: false
      },
      include: {
        problem: {
          include: {
            translations: { where: { language: 'tr' } }
          }
        }
      },
      take: 5
    });

    // 3. Spaced review due count
    const dueReviewsCount = await prisma.spacedReview.count({
      where: {
        userId,
        dueDate: { lte: new Date() }
      }
    });

    // 4. Save or retrieve today's DailyStudyPlan in DB
    const todayStr = new Date().toISOString().split('T')[0];
    if (topRecommendation) {
      await prisma.dailyStudyPlan.upsert({
        where: {
          userId_dateString: {
            userId,
            dateString: todayStr
          }
        },
        create: {
          userId,
          dateString: todayStr,
          recommendedCourseId: topRecommendation.courseId,
          recommendedTopicId: topRecommendation.conceptId,
          recommendedConceptId: topRecommendation.conceptId,
          estimatedMinutes: topRecommendation.estimatedMinutes,
          rationale: topRecommendation.rationale
        },
        update: {
          recommendedCourseId: topRecommendation.courseId,
          recommendedTopicId: topRecommendation.conceptId,
          recommendedConceptId: topRecommendation.conceptId,
          estimatedMinutes: topRecommendation.estimatedMinutes,
          rationale: topRecommendation.rationale
        }
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: activeUser.id,
        username: activeUser.username,
        rating: activeUser.rating,
        independenceScore: activeUser.independenceScore,
        streakDays: activeUser.streakDays
      },
      dailyStudyPlan: topRecommendation,
      courses: coursesWithProgress,
      mistakesCount: unresolvedMistakes.length,
      unresolvedMistakes: unresolvedMistakes.map(m => ({
        id: m.id,
        problemSlug: m.problem.slug,
        problemTitle: m.problem.translations[0]?.title || m.problem.slug,
        errorType: m.errorType,
        mistakeCount: m.mistakeCount
      })),
      dueReviewsCount
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Failed to retrieve dashboard data' }, { status: 500 });
  }
}
