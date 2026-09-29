import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') || 'tr';

    const user = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });
    const userRating = user ? user.rating : 1400;

    const problems = await prisma.problem.findMany({
      where: { isPublished: true },
      include: {
        translations: {
          where: { language: lang },
        },
        concepts: {
          include: {
            concept: {
              include: {
                translations: { where: { language: lang } },
              },
            },
          },
        },
      },
      take: 20,
    });

    const sorted = [...problems].sort(
      (a, b) => Math.abs(a.rating - userRating) - Math.abs(b.rating - userRating)
    );

    const dailySelection = sorted.slice(0, 3).map((p) => ({
      id: p.id,
      slug: p.slug,
      category: p.category,
      subcategory: p.subcategory,
      difficulty: p.difficulty,
      rating: p.rating,
      estimatedTime: p.estimatedTime,
      questionType: p.questionType,
      verificationLevel: p.verificationLevel,
      verificationSource: p.verificationSource,
      title: p.translations[0]?.title || p.slug,
      prompt: p.translations[0]?.prompt || '',
      concepts: p.concepts.map((c) => ({
        id: c.concept.id,
        name: c.concept.translations[0]?.name || c.concept.id,
        dualTerminology: c.concept.translations[0]?.dualTerminology,
      })),
    }));

    return NextResponse.json({
      dailyProblems: dailySelection,
      userRating,
      sessionTargetMinutes: 20,
    });
  } catch (error) {
    console.error('Daily API error:', error);
    return NextResponse.json({ error: 'Failed to fetch daily challenge' }, { status: 500 });
  }
}
