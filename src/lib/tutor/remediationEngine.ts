import { prisma } from '../prisma';

export type AcademicErrorType =
  | 'PREREQUISITE_GAP'
  | 'DEFINITION_MISUNDERSTANDING'
  | 'ALGEBRAIC_ERROR'
  | 'CALCULATION_ERROR'
  | 'METHOD_SELECTION_ERROR'
  | 'NOTATION_ERROR'
  | 'UNKNOWN';

export interface RemediationRecommendation {
  errorType: AcademicErrorType;
  headline: string;
  explanation: string;
  recommendedAction: 'PREREQUISITE_REPAIR' | 'DEFINITION_REFRESH' | 'CALCULATION_CHECK';
  repairConceptId?: string;
  repairConceptName?: string;
  estimatedMinutes: number;
}

/**
 * Classifies an incorrect submission into an academic error type
 * and constructs an automated remediation pathway.
 */
export function diagnoseError(
  userAnswer: string,
  correctAnswer: string,
  problemConcepts: Array<{
    concept: {
      id: string;
      formalStatement: string;
      translations: Array<{ language: string; name: string }>;
      prerequisites: Array<{
        prerequisite: {
          id: string;
          translations: Array<{ language: string; name: string }>;
        };
        importance: string;
      }>;
    };
  }>
): RemediationRecommendation {
  const cleanUser = userAnswer.trim().toLowerCase();
  const cleanCorrect = correctAnswer.trim().toLowerCase();

  // 1. Check for Calculation / Sign / Minor Algebraic Error
  // e.g., off by negative sign: userAnswer is -correctAnswer
  const numUser = parseFloat(cleanUser);
  const numCorrect = parseFloat(cleanCorrect);
  if (!isNaN(numUser) && !isNaN(numCorrect)) {
    if (numUser === -numCorrect) {
      return {
        errorType: 'CALCULATION_ERROR',
        headline: 'İşaret Hatası (Sign Reversal)',
        explanation: 'Çözüm mantığınız doğru görünüyor ancak negatif işaret katsayısında bir hata yaptınız. Formüldeki çıkarma ve yön işaretlerini kontrol edin.',
        recommendedAction: 'CALCULATION_CHECK',
        estimatedMinutes: 2
      };
    }
    if (Math.abs(numUser - numCorrect) / Math.abs(numCorrect) < 0.25) {
      return {
        errorType: 'CALCULATION_ERROR',
        headline: 'Aritmetik / Yuvarlama Hatası',
        explanation: 'Cevabınız doğru sonuca çok yakın ancak ara adımlarda aritmetik veya parantez önceliği hatası yapıldı.',
        recommendedAction: 'CALCULATION_CHECK',
        estimatedMinutes: 2
      };
    }
  }

  // 2. Check for Prerequisite Gaps
  // Find essential prerequisites of the concept
  for (const pc of problemConcepts) {
    const essentialPrereqs = pc.concept.prerequisites.filter(p => p.importance === 'ESSENTIAL');
    if (essentialPrereqs.length > 0) {
      const targetPrereq = essentialPrereqs[0].prerequisite;
      const trName = targetPrereq.translations.find(t => t.language === 'tr')?.name || targetPrereq.id;

      return {
        errorType: 'PREREQUISITE_GAP',
        headline: `Önkoşul Boşluğu: ${trName}`,
        explanation: `Bu soruyu doğru çözebilmek için temel yapı taşı olan "${trName}" kavramının tam olarak anlaşılmış olması gerekir. Soruyu zorlamak yerine 5 dakikalık hedefli tazeleyici mini derse geçmenizi öneririz.`,
        recommendedAction: 'PREREQUISITE_REPAIR',
        repairConceptId: targetPrereq.id,
        repairConceptName: trName,
        estimatedMinutes: 5
      };
    }
  }

  // 3. Fallback to Definition Misunderstanding
  const parentConcept = problemConcepts[0]?.concept;
  const parentName = parentConcept?.translations.find(t => t.language === 'tr')?.name || parentConcept?.id || 'Temel Kavram';

  return {
    errorType: 'DEFINITION_MISUNDERSTANDING',
    headline: `Kavramsal Yanılgı: ${parentName}`,
    explanation: `Verilen yanıt, ${parentName} tanımındaki temel bir varsayımın veya hipotezin atlandığını gösteriyor. Teoremin koşullarını ve zihinsel modelini gözden geçirin.`,
    recommendedAction: 'DEFINITION_REFRESH',
    repairConceptId: parentConcept?.id,
    repairConceptName: parentName,
    estimatedMinutes: 4
  };
}

/**
 * Persists error diagnosis into MistakeItem and updates learning profile.
 */
export async function recordMistakeWithDiagnosis(
  userId: string,
  problemId: string,
  userAnswer: string,
  recommendation: RemediationRecommendation
) {
  return await prisma.mistakeItem.upsert({
    where: {
      userId_problemId: {
        userId,
        problemId
      }
    },
    update: {
      lastUserAnswer: userAnswer,
      mistakeCount: { increment: 1 },
      resolved: false,
      errorType: recommendation.errorType,
      lastAttemptAt: new Date()
    },
    create: {
      userId,
      problemId,
      lastUserAnswer: userAnswer,
      mistakeCount: 1,
      resolved: false,
      errorType: recommendation.errorType
    }
  });
}
