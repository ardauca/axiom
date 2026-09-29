import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') || 'tr';

    const mistakes = await prisma.mistakeItem.findMany({
      include: {
        problem: {
          include: {
            translations: { where: { language: lang } },
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
        },
      },
      orderBy: { lastAttemptAt: 'desc' },
    });

    const formatted = mistakes.map((m) => ({
      id: m.id,
      problemId: m.problemId,
      slug: m.problem.slug,
      title: m.problem.translations[0]?.title || m.problem.slug,
      prompt: m.problem.translations[0]?.prompt || '',
      solution: m.problem.translations[0]?.solution || '',
      rating: m.problem.rating,
      difficulty: m.problem.difficulty,
      lastUserAnswer: m.lastUserAnswer,
      mistakeCount: m.mistakeCount,
      resolved: m.resolved,
      userNotes: m.userNotes,
      lastAttemptAt: m.lastAttemptAt,
      concepts: m.problem.concepts.map((c) => ({
        id: c.concept.id,
        name: c.concept.translations[0]?.name || c.concept.id,
        dualTerminology: c.concept.translations[0]?.dualTerminology,
      })),
    }));

    return NextResponse.json({ mistakes: formatted });
  } catch (error) {
    console.error('Mistakes API error:', error);
    return NextResponse.json({ error: 'Failed to fetch mistakes' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, userNotes, resolved } = body;

    const updated = await prisma.mistakeItem.update({
      where: { id },
      data: {
        userNotes: userNotes !== undefined ? userNotes : undefined,
        resolved: resolved !== undefined ? resolved : undefined,
      },
    });

    return NextResponse.json({ mistake: updated });
  } catch (error) {
    console.error('Update mistake error:', error);
    return NextResponse.json({ error: 'Failed to update mistake' }, { status: 500 });
  }
}
