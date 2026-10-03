import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth/session';
import { getCourseCurriculum } from '@/lib/tutor/curriculumEngine';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') || 'tr';

    const user = await getSessionUser(req);

    // 1. Identify active course (MAT201 default or user's active semester)
    let currentCourse = await prisma.course.findFirst({
      where: { isCurrentSemester: true },
      orderBy: { code: 'asc' },
    });

    if (!currentCourse) {
      currentCourse = await prisma.course.findFirst({
        orderBy: { code: 'asc' },
      });
    }

    const curriculum = currentCourse
      ? await getCourseCurriculum(currentCourse.id, user.id)
      : null;

    // 2. Identify unresolved mistake / prerequisite gap
    const activeMistake = await prisma.mistakeItem.findFirst({
      where: {
        userId: user.id,
        resolved: false,
      },
      include: {
        problem: {
          include: {
            translations: { where: { language: lang } },
            concepts: {
              include: {
                concept: {
                  include: {
                    translations: { where: { language: lang } },
                    prerequisites: {
                      include: {
                        prerequisite: {
                          include: { translations: { where: { language: lang } } }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { lastAttemptAt: 'desc' }
    });

    // 3. Spaced review queue
    const reviewDue = await prisma.spacedReview.findFirst({
      where: {
        userId: user.id,
      },
      include: {
        problem: {
          include: {
            translations: { where: { language: lang } },
          }
        }
      },
      orderBy: { dueDate: 'asc' }
    });

    // Structure Axiom's 3 Educational Priorities for Today
    const todayPlan: Array<{
      order: number;
      type: 'LESSON' | 'DIAGNOSIS' | 'REVIEW';
      title: string;
      subtitle: string;
      estimatedMinutes: number;
      badge: string;
      ctaText: string;
      ctaHref: string;
      isUrgent?: boolean;
    }> = [];

    // Step 1: Lesson in Current Course
    if (curriculum?.nextConcept) {
      todayPlan.push({
        order: 1,
        type: 'LESSON',
        title: `${currentCourse?.code}: ${curriculum.nextConcept.name}`,
        subtitle: `${curriculum.currentTopic?.title || 'Aktif Ünite'} • Akademik Sezgi & Rigoröz Tanım`,
        estimatedMinutes: 25,
        badge: 'ANA DERS ADIMI',
        ctaText: 'Dersi Çalış',
        ctaHref: `/learn/${curriculum.nextConcept.id}`
      });
    } else {
      todayPlan.push({
        order: 1,
        type: 'LESSON',
        title: `${currentCourse?.code} ${currentCourse?.name}: Sınav Hazırlığı`,
        subtitle: 'Müfredatın tüm kavramları tamamlandı. Final seviyesi sınav denemesine girin.',
        estimatedMinutes: 30,
        badge: 'SINAV HAZIRLIĞI',
        ctaText: 'Denemeyi Başlat',
        ctaHref: currentCourse ? `/courses/${currentCourse.id}/exam` : '/courses'
      });
    }

    // Step 2: Diagnosis & Remediation
    if (activeMistake) {
      const pTitle = activeMistake.problem.translations[0]?.title || activeMistake.problem.slug;
      const prereqConcept = activeMistake.problem.concepts[0]?.concept.prerequisites[0]?.prerequisite;
      const prereqName = prereqConcept?.translations[0]?.name;

      todayPlan.push({
        order: 2,
        type: 'DIAGNOSIS',
        title: prereqName ? `Önkoşul Boşluğu: ${prereqName}` : `Hata Analizi: ${pTitle}`,
        subtitle: activeMistake.errorType === 'PREREQUISITE_GAP'
          ? 'Temel matematiksel tanım eksikliği teşhis edildi. Tamir edilmeden ilerlenemez.'
          : 'Geçmiş alıştırmada yapılan işlem hatasının metodolojik düzeltmesi.',
        estimatedMinutes: 15,
        badge: 'EKSİK TEŞHİSİ',
        ctaText: prereqConcept ? 'Önkoşulu Tamir Et' : 'Hatayı İncele',
        ctaHref: prereqConcept ? `/learn/${prereqConcept.id}` : `/problem/${activeMistake.problem.slug}`,
        isUrgent: true
      });
    } else {
      todayPlan.push({
        order: 2,
        type: 'DIAGNOSIS',
        title: 'Kavramsal Boşluk Taraması',
        subtitle: 'Geçmiş konulardan rastgele seçilmiş kritik hipotez kontrolü.',
        estimatedMinutes: 10,
        badge: 'KONTROL',
        ctaText: 'Kontrol Et',
        ctaHref: curriculum?.nextConcept ? `/learn/${curriculum.nextConcept.id}` : '/courses'
      });
    }

    // Step 3: Spaced Retention Review
    if (reviewDue) {
      const pTitle = reviewDue.problem.translations[0]?.title || reviewDue.problem.slug;
      todayPlan.push({
        order: 3,
        type: 'REVIEW',
        title: `Hafıza Tazeleyici: ${pTitle}`,
        subtitle: 'Aralıklı tekrar algoritması tarafından unutma eğrisine göre zamanlandı.',
        estimatedMinutes: 10,
        badge: 'ARALIKLI TEKRAR',
        ctaText: 'Hatırla & Çöz',
        ctaHref: `/problem/${reviewDue.problem.slug}`
      });
    } else {
      todayPlan.push({
        order: 3,
        type: 'REVIEW',
        title: 'Önceki Ünite Tekrarı',
        subtitle: 'Zayıf konu hafızasını güçlendirmek için 1 adet deliberate alıştırma.',
        estimatedMinutes: 10,
        badge: 'KORUMA',
        ctaText: 'Alıştırma Yap',
        ctaHref: '/practice'
      });
    }

    return NextResponse.json({
      success: true,
      currentCourse: currentCourse ? {
        id: currentCourse.id,
        code: currentCourse.code,
        name: currentCourse.name,
        progressPercent: curriculum?.progressPercent || 0,
      } : null,
      todayPlan,
      totalEstimatedMinutes: todayPlan.reduce((acc, step) => acc + step.estimatedMinutes, 0),
    });
  } catch (error) {
    console.error('Daily API error:', error);
    return NextResponse.json({ error: 'Failed to fetch daily study plan' }, { status: 500 });
  }
}
