import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') || 'tr';

    const concepts = await prisma.concept.findMany({
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
        dependents: {
          include: {
            concept: {
              include: {
                translations: { where: { language: lang } },
              },
            },
          },
        },
      },
    });

    const formatted = concepts.map((c) => ({
      id: c.id,
      category: c.category,
      subcategory: c.subcategory,
      formalStatement: c.formalStatement,
      canonicalFormula: c.canonicalFormula,
      verificationLevel: c.verificationLevel,
      verificationStatus: c.verificationStatus,
      sourceTitle: c.sourceTitle,
      sourceAuthor: c.sourceAuthor,
      sourceCitation: c.sourceCitation,
      name: c.translations[0]?.name || c.id,
      dualTerminology: c.translations[0]?.dualTerminology,
      definition: c.translations[0]?.definition || '',
      intuition: c.translations[0]?.intuition || '',
      prerequisites: c.prerequisites.map((p) => ({
        id: p.prerequisite.id,
        name: p.prerequisite.translations[0]?.name || p.prerequisite.id,
        dualTerminology: p.prerequisite.translations[0]?.dualTerminology,
        importance: p.importance,
      })),
      dependents: c.dependents.map((d) => ({
        id: d.concept.id,
        name: d.concept.translations[0]?.name || d.concept.id,
      })),
    }));

    return NextResponse.json({ concepts: formatted });
  } catch (error) {
    console.error('Concepts API error:', error);
    return NextResponse.json({ error: 'Failed to fetch concepts' }, { status: 500 });
  }
}
