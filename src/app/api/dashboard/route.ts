import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth/session';
import { getCourseCurriculum, calculateCourseReadiness } from '@/lib/tutor/curriculumEngine';

export async function GET(req: Request) {
  try {
    const activeUser = await getSessionUser(req);
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

    // 4. Identify Prerequisite Gaps
    let activePrerequisiteGap = null;
    const gapMistake = unresolvedMistakes.find(m => m.errorType === 'PREREQUISITE_GAP');
    if (gapMistake) {
      activePrerequisiteGap = {
        title: 'Önkoşul Boşluğu Tespit Edildi',
        conceptName: gapMistake.problem.translations[0]?.title || 'Önkoşul Kavramı',
        problemSlug: gapMistake.problem.slug,
        mistakeId: gapMistake.id,
        remediationAction: 'Önkoşul Dersi ile Tamir Et'
      };
    } else if (unresolvedMistakes.length > 0) {
      activePrerequisiteGap = {
        title: 'Kavramsal Yanılgı Tamiri Gerekiyor',
        conceptName: unresolvedMistakes[0].problem.translations[0]?.title || 'Hedef Soru',
        problemSlug: unresolvedMistakes[0].problem.slug,
        mistakeId: unresolvedMistakes[0].id,
        remediationAction: 'Yanıtı İncele ve Düzelt'
      };
    }

    // 5. Build Axiom's Plan for Today (3 structured, prioritized actions)
    const primaryCourse = coursesWithProgress[0];
    const secondaryCourse = coursesWithProgress[1] || primaryCourse;
    const tertiaryCourse = coursesWithProgress[2] || primaryCourse;

    const todaySchedule = [
      {
        order: 1,
        type: 'CONTINUE_LESSON',
        title: primaryCourse?.nextConcept?.name ? `Derse Devam: ${primaryCourse.nextConcept.name}` : `${primaryCourse?.code || 'Ders'} Müfredat İlerlemesi`,
        courseCode: primaryCourse?.code || 'MAT201',
        courseName: primaryCourse?.name || 'Analiz III',
        durationMinutes: 25,
        targetUrl: primaryCourse?.nextConcept ? `/learn/${primaryCourse.nextConcept.id}` : `/courses/${primaryCourse?.id || ''}`
      },
      {
        order: 2,
        type: activePrerequisiteGap ? 'REMEDIATE' : 'DIAGNOSE',
        title: activePrerequisiteGap ? `Önkoşul Tamiri: ${activePrerequisiteGap.conceptName}` : `Kavram Teşhisi: ${secondaryCourse?.nextConcept?.name || secondaryCourse?.name || 'Konu Tekrarı'}`,
        courseCode: secondaryCourse?.code || 'MAT203',
        courseName: secondaryCourse?.name || 'Graf Teori',
        durationMinutes: 15,
        targetUrl: activePrerequisiteGap ? `/problem/${activePrerequisiteGap.problemSlug}` : (secondaryCourse?.nextConcept ? `/learn/${secondaryCourse.nextConcept.id}` : `/courses/${secondaryCourse?.id || ''}`)
      },
      {
        order: 3,
        type: 'REVIEW',
        title: `Hafıza ve Aralıklı Tekrar: ${tertiaryCourse?.nextConcept?.name || tertiaryCourse?.name || 'Önceki Konular'}`,
        courseCode: tertiaryCourse?.code || 'CENG203',
        courseName: tertiaryCourse?.name || 'Bilgisayar Mimarisi',
        durationMinutes: 15,
        targetUrl: `/mastery`
      }
    ];

    return NextResponse.json({
      success: true,
      user: {
        id: activeUser.id,
        username: activeUser.username,
        rating: activeUser.rating,
        independenceScore: activeUser.independenceScore,
        streakDays: activeUser.streakDays
      },
      currentCourse: primaryCourse || null,
      courses: coursesWithProgress,
      todaySchedule,
      activePrerequisiteGap,
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
