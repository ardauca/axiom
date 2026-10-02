import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') || 'tr';

    const concept = await prisma.concept.findUnique({
      where: { id },
      include: {
        translations: { where: { language: lang } },
        lessonSteps: {
          orderBy: { stepOrder: 'asc' },
          include: {
            translations: { where: { language: lang } },
          },
        },
        prerequisites: {
          include: {
            prerequisite: {
              include: {
                translations: { where: { language: lang } },
              },
            },
          },
        },
        problems: {
          include: {
            problem: {
              include: {
                translations: { where: { language: lang } },
              },
            },
          },
        },
      },
    });

    if (!concept) {
      return NextResponse.json({ error: 'Concept not found' }, { status: 404 });
    }

    // Auto-generate 8-step synthesized academic lesson if not yet populated
    if (concept.lessonSteps.length === 0) {
      const { syncConceptLessonWithFusion } = await import('@/lib/tutor/teacherEngine');
      await syncConceptLessonWithFusion(id).catch(console.error);
      // Reload concept
      return GET(req, { params });
    }

    const tr = concept.translations[0];

    const formatted = {
      id: concept.id,
      category: concept.category,
      subcategory: concept.subcategory,
      formalStatement: concept.formalStatement,
      assumptions: concept.assumptions,
      canonicalFormula: concept.canonicalFormula,
      proofDerivation: concept.proofDerivation,
      verificationLevel: concept.verificationLevel,
      verificationStatus: concept.verificationStatus,
      sourceTitle: concept.sourceTitle,
      sourceAuthor: concept.sourceAuthor,
      sourceCitation: concept.sourceCitation,
      name: tr?.name || concept.id,
      dualTerminology: tr?.dualTerminology,
      definition: tr?.definition || '',
      intuition: tr?.intuition || '',
      commonPitfalls: tr?.commonPitfalls || '',
      lessonSteps: concept.lessonSteps.map((step) => ({
        id: step.id,
        stepOrder: step.stepOrder,
        stepType: step.stepType,
        miniCheckAnswer: step.miniCheckAnswer,
        miniCheckOptions: step.miniCheckOptions ? JSON.parse(step.miniCheckOptions) : null,
        title: step.translations[0]?.title || `Step ${step.stepOrder}`,
        content: step.translations[0]?.content || '',
        miniCheckQuestion: step.translations[0]?.miniCheckQuestion || null,
      })),
      prerequisites: concept.prerequisites.map((p) => ({
        id: p.prerequisite.id,
        name: p.prerequisite.translations[0]?.name || p.prerequisite.id,
        dualTerminology: p.prerequisite.translations[0]?.dualTerminology,
        importance: p.importance,
      })),
      relatedProblems: concept.problems.map((p) => ({
        id: p.problem.id,
        slug: p.problem.slug,
        title: p.problem.translations[0]?.title || p.problem.slug,
        rating: p.problem.rating,
        difficulty: p.problem.difficulty,
      })),
    };

    return NextResponse.json({ concept: formatted });
  } catch (error) {
    console.error('Concept detail API error:', error);
    return NextResponse.json({ error: 'Failed to fetch concept details' }, { status: 500 });
  }
}
