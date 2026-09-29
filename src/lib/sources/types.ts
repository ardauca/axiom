export type SourceRole =
  | 'PRIMARY_THEORY'
  | 'PRIMARY_TEACHING'
  | 'PRIMARY_PROOF'
  | 'EXAM_PAPER'
  | 'EXAMPLE_SOURCE'
  | 'PROBLEM_SOURCE'
  | 'SOLUTION_SOURCE'
  | 'CODE_SOURCE'
  | 'SUPPORTING_NOTE'
  | 'PERSONAL_NOTE'
  | 'REFERENCE'
  | 'DUPLICATE'
  | 'ARCHIVED'
  | 'NEEDS_REVIEW';

export type SourceAuthority =
  | 'PROFESSOR'
  | 'DEPARTMENT'
  | 'REFERENCE_TEXTBOOK'
  | 'STUDENT_NOTE'
  | 'UNKNOWN';

export type ContentVerification =
  | 'SOURCE_REFERENCED'
  | 'SOURCE_CROSS_CHECKED'
  | 'SYMBOLICALLY_VERIFIED'
  | 'NUMERICALLY_VERIFIED'
  | 'CODE_VERIFIED'
  | 'HUMAN_REVIEWED'
  | 'OCR_UNCERTAIN'
  | 'CONFLICTING_SOURCES'
  | 'UNVERIFIED';

export type ProblemOrigin =
  | 'SOURCE_EXACT'
  | 'SOURCE_ADAPTED'
  | 'GENERATED_FROM_SOURCE'
  | 'GENERATED_VERIFIED';

export interface QualityMetrics {
  authority: number; // 0 - 100
  completeness: number; // 0 - 100
  clarity: number; // 0 - 100
  relevance: number; // 0 - 100
  exampleQuality: number; // 0 - 100
  problemQuality: number; // 0 - 100
  solutionQuality: number; // 0 - 100
  extractionQuality: number; // 0 - 100
  OCRQuality: number; // 0 - 100
  recency: number; // 0 - 100
  provenanceConfidence: number; // 0 - 100
}

export interface SourceComparisonItem {
  criterion: string;
  sourceAVal: string;
  sourceBVal: string;
  notes?: string;
}

export interface ProvenanceCitation {
  documentId: string;
  documentTitle: string;
  author: string;
  institution: string;
  location: string; // "Bölüm 4, Sayfa 42" or "Soru 3(b)"
  verificationLevel: ContentVerification;
  authority: SourceAuthority;
  whyThisSource?: string;
}
