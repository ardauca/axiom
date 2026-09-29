import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');
    const lang = searchParams.get('lang') || 'tr';

    const whereClause: any = { isPublished: true };
    if (category && category !== 'ALL') whereClause.category = category;
    if (subcategory && subcategory !== 'ALL') whereClause.subcategory = subcategory;
    if (difficulty && difficulty !== 'ALL') whereClause.difficulty = difficulty;

    const problems = await prisma.problem.findMany({
      where: whereClause,
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
      orderBy: { rating: 'asc' },
    });

    let filtered = problems.map((p) => ({
      id: p.id,
      slug: p.slug,
      category: p.category,
      subcategory: p.subcategory,
      difficulty: p.difficulty,
      rating: p.rating,
      questionType: p.questionType,
      estimatedTime: p.estimatedTime,
      solveCount: p.solveCount,
      attemptCount: p.attemptCount,
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

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.prompt.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ problems: filtered, count: filtered.length });
  } catch (error) {
    console.error('Problems API error:', error);
    return NextResponse.json({ error: 'Failed to fetch problems' }, { status: 500 });
  }
}
