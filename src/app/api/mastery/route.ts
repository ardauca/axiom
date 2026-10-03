import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth/session';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') || 'tr';

    const user = await getSessionUser(req);

    const masteries = await prisma.userConceptMastery.findMany({
      where: { userId: user.id },
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
      },
      orderBy: { lastPracticedAt: 'desc' }
    });

    const items = masteries.map((m) => {
      const avg = Math.round((m.conceptualScore + m.formulaScore + m.problemSolvingScore + m.transferScore) / 4);
      const cTr = m.concept.translations[0];
      const conceptName = cTr?.name || m.conceptId;

      let verdict = '';
      let needsReview = false;

      if (avg >= 85 && m.transferScore >= 75) {
        verdict = lang === 'tr' ? 'Yüksek yetkinlik ve bağımsız çözüm kabiliyeti' : 'High competence and independent problem-solving ability';
      } else if (m.transferScore < 50 && m.conceptualScore >= 70) {
        verdict = lang === 'tr' ? 'Kavram tanınıyor ancak yabancı problem transferi geliştirilmeli' : 'Concept recognized, but novel problem transfer needs practice';
        needsReview = true;
      } else if (avg < 60) {
        verdict = lang === 'tr' ? 'Önkoşul pekiştirilmesi tavsiye edilir' : 'Reviewing prerequisites recommended';
        needsReview = true;
      } else {
        verdict = lang === 'tr' ? 'Öğrenme ve alıştırma aşamasında' : 'In learning and practice phase';
      }

      return {
        conceptId: m.conceptId,
        conceptName,
        dualTerminology: cTr?.dualTerminology,
        conceptual: m.conceptualScore,
        formula: m.formulaScore,
        problemSolving: m.problemSolvingScore,
        transfer: m.transferScore,
        averageScore: avg,
        independence: `${m.independentSolvesCount} / ${Math.max(1, m.totalSolvesCount)}`,
        verdict,
        needsReview,
        lastPracticedAt: m.lastPracticedAt,
      };
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        rating: user.rating,
      },
      masteryDimensions: items,
    });
  } catch (error) {
    console.error('Mastery API error:', error);
    return NextResponse.json({ error: 'Failed to fetch user mastery' }, { status: 500 });
  }
}
