import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') || 'tr';

    const problem = await prisma.problem.findUnique({
      where: { slug },
      include: {
        translations: { where: { language: lang } },
        hints: {
          orderBy: { order: 'asc' },
          include: {
            translations: { where: { language: lang } },
          },
        },
        concepts: {
          include: {
            concept: {
              include: {
                translations: { where: { language: lang } },
                prerequisites: {
                  include: {
                    prerequisite: {
                      include: {
                        translations: { where: { language: lang } },
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

    const prerequisiteAlerts: Array<{
      prerequisiteId: string;
      prerequisiteName: string;
      prerequisiteDual: string;
      reason: string;
    }> = [];

    for (const pc of problem.concepts) {
      for (const dep of pc.concept.prerequisites) {
        prerequisiteAlerts.push({
          prerequisiteId: dep.prerequisite.id,
          prerequisiteName: dep.prerequisite.translations[0]?.name || dep.prerequisite.id,
          prerequisiteDual: dep.prerequisite.translations[0]?.dualTerminology || dep.prerequisite.id,
          reason: dep.importance,
        });
      }
    }

    const tr = problem.translations[0];

    const formatted = {
      id: problem.id,
      slug: problem.slug,
      category: problem.category,
      subcategory: problem.subcategory,
      difficulty: problem.difficulty,
      rating: problem.rating,
      questionType: problem.questionType,
      estimatedTime: problem.estimatedTime,
      codeSnippet: problem.codeSnippet,
      testCases: problem.testCases ? JSON.parse(problem.testCases) : null,
      language: problem.language,
      verificationLevel: problem.verificationLevel,
      verificationSource: problem.verificationSource,
      problemOrigin: problem.problemOrigin,
      title: tr?.title || problem.slug,
      prompt: tr?.prompt || '',
      options: tr?.options ? JSON.parse(tr.options) : null,
      solution: tr?.solution || '',
      commonMistakes: tr?.commonMistakes ? JSON.parse(tr.commonMistakes) : [],
      hints: problem.hints.map((h) => ({
        id: h.id,
        order: h.order,
        penaltyScore: h.penaltyScore,
        title: h.translations[0]?.title || `Hint ${h.order}`,
        content: h.translations[0]?.content || '',
      })),
      concepts: problem.concepts.map((c) => ({
        id: c.concept.id,
        name: c.concept.translations[0]?.name || c.concept.id,
        dualTerminology: c.concept.translations[0]?.dualTerminology,
        definition: c.concept.translations[0]?.definition,
        formalStatement: c.concept.formalStatement,
        sourceCitation: c.concept.sourceCitation,
      })),
      prerequisiteAlerts,
    };

    return NextResponse.json({ problem: formatted });
  } catch (error) {
    console.error('Problem detail API error:', error);
    return NextResponse.json({ error: 'Failed to fetch problem details' }, { status: 500 });
  }
}
