import { SourceAuthority, SourceRole } from './types';

export interface SourceCandidate {
  id: string;
  name: string;
  institution?: string;
  author?: string;
  tier: number; // 1: Top Universities/Journals, 2: Standard Open Educational, 3: Commercial Textbooks, 4: Unverified/Student
  authority: SourceAuthority;
  rawText: string;
  topicsCovered: string[];
  isLocalCourseNote?: boolean;
}

export interface SourceEvaluationScore {
  candidateId: string;
  authorityScore: number;       // 0 - 100 (Institution/Prof rank & academic pedigree)
  academicRelevance: number;    // 0 - 100 (Relevance to university curriculum)
  conceptCoverage: number;      // 0 - 100 (Coverage of target concepts)
  rigorScore: number;           // 0 - 100 (Mathematical proofs, theorems, definitions)
  pedagogicalUsefulness: number;// 0 - 100 (Intuitions, analogies, clear explanations)
  courseFit: number;            // 0 - 100 (Fit to local syllabus/exams)
  overallQuality: number;       // Weighted score
  recommendedRole: SourceRole;  // Role assigned to this source
  evaluationNotes: string;
}

/**
 * Rigorously evaluates candidate academic sources across multi-dimensional criteria
 * and assigns specialized pedagogical roles rather than blindly assuming "MIT = best".
 */
export function evaluateAcademicSource(
  candidate: SourceCandidate,
  targetContext: {
    targetConcept: string;
    courseCode?: string;
    department?: string;
  }
): SourceEvaluationScore {
  const textLower = candidate.rawText.toLowerCase();
  const conceptLower = targetContext.targetConcept.toLowerCase();

  // 1. Authority Score (Based on Tier & Authority)
  let authorityScore = 50;
  if (candidate.isLocalCourseNote || candidate.authority === 'PROFESSOR') {
    authorityScore = 95; // Local university authority is paramount for course requirements
  } else if (candidate.tier === 1) {
    authorityScore = 98; // Top Tier: MIT, Stanford, Harvard, Cambridge
  } else if (candidate.tier === 2) {
    authorityScore = 85; // Tier 2: OpenStax, Open University, Standard texts
  } else if (candidate.tier === 3) {
    authorityScore = 75; // Standard reference textbooks (Adams, Stewart, etc.)
  }

  // 2. Academic Relevance
  const normalizedConcept = conceptLower.replace(/-/g, ' ');
  const normalizedText = textLower.replace(/-/g, ' ');
  const conceptMentions = (normalizedText.match(new RegExp(normalizedConcept, 'g')) || []).length;
  let academicRelevance = Math.min(100, Math.max(40, conceptMentions * 25));
  if (candidate.topicsCovered.some(t => t.toLowerCase().replace(/-/g, ' ').includes(normalizedConcept))) {
    academicRelevance = Math.min(100, academicRelevance + 30);
  }

  // 3. Concept Coverage
  const hasDefinition = /tanım|definition|teorem|theorem|lemma|proposition|aksiyom|axiom/i.test(candidate.rawText);
  const hasFormula = /\$|\\|frac|sum|int|lim|\\vec/i.test(candidate.rawText);
  const hasProof = /ispat|proof|gösterim|derivation/i.test(candidate.rawText);
  const hasExample = /örnek|example|problem|soru|çözüm|solution/i.test(candidate.rawText);

  let conceptCoverage = 40;
  if (hasDefinition) conceptCoverage += 20;
  if (hasFormula) conceptCoverage += 15;
  if (hasProof) conceptCoverage += 15;
  if (hasExample) conceptCoverage += 10;
  conceptCoverage = Math.min(100, conceptCoverage);

  // 4. Rigor Score (Proofs, Formal Logic, Assumptions)
  let rigorScore = 50;
  if (hasProof || /teorem|theorem|lemma/i.test(candidate.rawText)) rigorScore += 25;
  if (/varsayım|assumption|hypothesis|hipotez|şart|condition|implies|where/i.test(candidate.rawText)) rigorScore += 15;
  if (/\\forall|\\exists|\\implies|\\iff|epsilon|delta|integer N/i.test(candidate.rawText)) rigorScore += 10;
  rigorScore = Math.min(100, rigorScore);

  // 5. Pedagogical Usefulness (Intuition, Geometric/Visual Model)
  let pedagogicalUsefulness = 40;
  if (/sezgi|intuition|zihinsel|mental model|hayal edin|imagine|analogy|geometrik/i.test(candidate.rawText)) pedagogicalUsefulness += 35;
  if (hasExample) pedagogicalUsefulness += 15;
  if (candidate.institution?.includes('MIT') || candidate.institution?.includes('Stanford') || candidate.authority === 'REFERENCE_TEXTBOOK') {
    pedagogicalUsefulness += 15; // Renowned standard undergraduate authorities
  }
  pedagogicalUsefulness = Math.min(100, pedagogicalUsefulness);

  // 6. Course Fit
  let courseFit = 50;
  if (candidate.isLocalCourseNote) {
    courseFit = 100;
  } else if (targetContext.courseCode && candidate.rawText.includes(targetContext.courseCode)) {
    courseFit = 90;
  } else {
    courseFit = 80; // Standard undergraduate fit
  }

  // Determine Specialized Recommended Role
  let recommendedRole: SourceRole = 'REFERENCE';
  if (candidate.isLocalCourseNote) {
    recommendedRole = 'PRIMARY_TEACHING';
  } else if (rigorScore >= 75) {
    recommendedRole = 'PRIMARY_PROOF';
  } else if (pedagogicalUsefulness >= 65) {
    recommendedRole = 'PRIMARY_THEORY';
  } else if (hasExample) {
    recommendedRole = 'EXAMPLE_SOURCE';
  }

  // Overall Quality weighted index
  const overallQuality = Math.round(
    authorityScore * 0.25 +
    academicRelevance * 0.20 +
    conceptCoverage * 0.20 +
    rigorScore * 0.15 +
    pedagogicalUsefulness * 0.10 +
    courseFit * 0.10
  );

  return {
    candidateId: candidate.id,
    authorityScore,
    academicRelevance,
    conceptCoverage,
    rigorScore,
    pedagogicalUsefulness,
    courseFit,
    overallQuality,
    recommendedRole,
    evaluationNotes: `${candidate.name} (${candidate.institution || 'Bölüm'}) evaluated. Role: ${recommendedRole}, Quality: ${overallQuality}/100.`,
  };
}
