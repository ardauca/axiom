import { prisma } from '../prisma';
import { ContentVerification, ProvenanceCitation } from './types';

export interface SourceSearchResult {
  query: string;
  hasDirectSource: boolean;
  statusMessage: string;
  concept?: {
    id: string;
    name: string;
    formalStatement: string;
    canonicalFormula?: string | null;
    assumptions?: string | null;
    verificationStatus: string;
    courseName?: string;
  };
  primarySource?: {
    id: string;
    canonicalName: string;
    author: string | null;
    institution: string | null;
    whyThisSource: string | null;
    verificationLevel: string;
  };
  theorems: Array<{
    title: string;
    snippet: string;
    pageOrSection: string;
    verification: string;
  }>;
  sourceExamples: Array<{
    title: string;
    statement: string;
    solution: string;
    sourceDocument: string;
    verification: string;
  }>;
  examProblems: Array<{
    id: string;
    year?: number | null;
    examType?: string | null;
    location: string;
    prompt: string;
    origin: string;
    verification: string;
  }>;
}

export async function searchAcademicSources(query: string): Promise<SourceSearchResult> {
  const qLower = query.toLowerCase().trim();

  // 1. Search in CourseTopics and Concepts
  const concepts = await prisma.concept.findMany({
    where: {
      OR: [
        { id: { contains: qLower } },
        { formalStatement: { contains: qLower } },
        { canonicalFormula: { contains: qLower } },
        { translations: { some: { name: { contains: qLower } } } },
        { translations: { some: { definition: { contains: qLower } } } },
      ]
    },
    include: {
      translations: true,
      topicConcepts: {
        include: {
          topic: {
            include: {
              course: true
            }
          }
        }
      }
    },
    take: 5
  });

  // 2. Search in SourceDocuments
  const matchingDocs = await prisma.sourceDocument.findMany({
    where: {
      OR: [
        { canonicalName: { contains: qLower } },
        { author: { contains: qLower } },
        { whyThisSource: { contains: qLower } }
      ]
    },
    take: 5
  });

  // 3. Search in SourceProblems (Exams & questions)
  const matchingProblems = await prisma.sourceProblem.findMany({
    where: {
      OR: [
        { rawPrompt: { contains: qLower } },
        { sourceLocation: { contains: qLower } },
        { officialSolution: { contains: qLower } }
      ]
    },
    include: {
      document: true
    },
    take: 10
  });

  // 4. Search in SourceReferences (Theorems, definitions, formulas)
  const matchingReferences = await prisma.sourceReference.findMany({
    where: {
      OR: [
        { sectionTitle: { contains: qLower } },
        { paragraphSnippet: { contains: qLower } }
      ]
    },
    include: {
      document: true
    },
    take: 5
  });

  const hasDirectSource = concepts.length > 0 || matchingDocs.length > 0 || matchingProblems.length > 0;

  const firstConcept = concepts[0];
  const trTranslation = firstConcept?.translations.find(t => t.language === 'tr');
  const primaryDoc = matchingDocs[0] || (firstConcept ? await prisma.sourceDocument.findFirst({
    where: { id: firstConcept.sourceTitle }
  }) : null);

  const courseName = firstConcept?.topicConcepts[0]?.topic?.course?.name;

  return {
    query,
    hasDirectSource,
    statusMessage: hasDirectSource
      ? `"${query}" ile ilgili ESOGÜ akademik kaynakları ve sınav arşivi bulundu.`
      : `Bu konu için arşivde doğrudan ESOGÜ ders kaynağı bulunamadı. Genel matematiksel referans (Adams & Essex Calculus / Axiom KB) kullanılmaktadır.`,
    concept: firstConcept ? {
      id: firstConcept.id,
      name: trTranslation?.name || firstConcept.id,
      formalStatement: firstConcept.formalStatement,
      canonicalFormula: firstConcept.canonicalFormula,
      assumptions: firstConcept.assumptions,
      verificationStatus: firstConcept.verificationStatus,
      courseName
    } : undefined,
    primarySource: primaryDoc ? {
      id: primaryDoc.id,
      canonicalName: primaryDoc.canonicalName,
      author: primaryDoc.author,
      institution: primaryDoc.institution,
      whyThisSource: primaryDoc.whyThisSource,
      verificationLevel: primaryDoc.verificationLevel
    } : undefined,
    theorems: matchingReferences.map(r => ({
      title: r.sectionTitle || 'Matematiksel Teorem/Tanım',
      snippet: r.paragraphSnippet || '',
      pageOrSection: r.pageNumber ? `Sayfa ${r.pageNumber}` : 'Ders Notu',
      verification: r.verificationStatus
    })),
    sourceExamples: [],
    examProblems: matchingProblems.map(p => ({
      id: p.id,
      year: p.examYear,
      examType: p.examType,
      location: p.sourceLocation,
      prompt: p.rawPrompt,
      origin: p.problemType,
      verification: p.verificationLevel
    }))
  };
}
