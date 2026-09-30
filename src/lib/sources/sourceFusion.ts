import { prisma } from '../prisma';
import { researchAcademicSources, ExternalSourceEvidence } from './externalAcademicEngine';

export interface SourceClaim {
  statement: string;
  sourceAuthority: string;
  verificationLevel: string;
  citation: string;
}

export interface SourceFusionResult {
  conceptId: string;
  courseAuthority: {
    documentName: string;
    author: string;
    institution: string;
    citation: string;
    authorityLevel: string;
  };
  formalDefinitionSource: {
    source: string;
    definitionLaTeX: string;
    assumptions: string;
    citation: string;
  };
  proofSource?: {
    source: string;
    proofSummary: string;
    citation: string;
  };
  intuitionSource: {
    source: string;
    mentalModel: string;
    citation: string;
  };
  exampleSource: {
    source: string;
    problemPrompt: string;
    stepByStepSolution: string;
    citation: string;
  };
  examSource?: {
    examName: string;
    questionLocation: string;
    rawPrompt: string;
    officialSolution: string;
  };
  supportingSources: Array<{
    name: string;
    role: string;
    citation: string;
  }>;
  notationDifferences?: string;
  verifiedClaims: SourceClaim[];
  isExternalCrossChecked: boolean;
}

export async function fuseAcademicSources(
  conceptId: string,
  options?: { disableExternal?: boolean }
): Promise<SourceFusionResult> {
  // 1. Fetch Concept from database
  const concept = await prisma.concept.findUnique({
    where: { id: conceptId },
    include: {
      translations: { where: { language: 'tr' } },
      problems: {
        include: {
          problem: {
            include: {
              translations: { where: { language: 'tr' } }
            }
          }
        }
      }
    }
  });

  if (!concept) {
    throw new Error(`Concept not found: ${conceptId}`);
  }

  // 2. Fetch Local Source Document
  const localDoc = await prisma.sourceDocument.findFirst({
    where: {
      OR: [
        { id: concept.sourceTitle },
        { canonicalName: { contains: concept.sourceTitle } }
      ]
    }
  });

  // 3. Fetch Local Exam Problem
  const localProblem = await prisma.sourceProblem.findFirst({
    where: {
      OR: [
        { rawPrompt: { contains: concept.translations[0]?.name || concept.id } },
        { documentId: localDoc?.id || '' }
      ]
    },
    include: {
      solutions: true
    }
  });

  // 4. Run External Academic Research
  const externalResearch = await researchAcademicSources(conceptId, options);

  // Identify external roles
  const intuitionEvidence = externalResearch.evidenceList.find(e => e.pedagogicalRole === 'BEST_INTUITION');
  const proofEvidence = externalResearch.evidenceList.find(e => e.pedagogicalRole === 'FORMAL_PROOF');
  const workedExampleEvidence = externalResearch.evidenceList.find(e => e.pedagogicalRole === 'BEST_WORKED_EXAMPLE');

  // 5. Detect Notation Differences & Academic Conventions
  let notationDifferences: string | undefined = undefined;
  if (conceptId === 'directional-derivative') {
    notationDifferences = 'ESOGÜ ve Adams & Essex notasyonunda yönlü türev D_u f veya grad(f) . u biçiminde gösterilir. Bazı uluslararası kaynaklarda nabla_u f veya f\'_u biçimi kullanılabilir. Sınavınızda profesörünüzün D_u f ve \\nabla f(x,y) \\cdot \\vec{u} gösterimini kullanınız.';
  } else if (conceptId === 'bernoulli-differential-equation') {
    notationDifferences = 'Dersinizde değişken değiştirme v = y^(1-n) olarak tanımlanır. Bazı Batı literatüründe u = y^(1-n) veya w = y^(1-n) harfleri tercih edilmektedir; formülasyon matematiksel olarak tamamen denktir.';
  } else if (conceptId === 'cache-mapping') {
    notationDifferences = 'ESOGÜ sınavlarında ve Patterson & Hennessy standardında adres bitleri sırasıyla [Tag | Index | Offset] olarak sıralanır. Bazı mimarilerde Offset yerine Block Offset veya Byte Offset terimi kullanılır.';
  } else if (conceptId === 'uniform-convergence') {
    notationDifferences = 'ESOGÜ Analiz III/IV ders notlarında düzgün yakınsaklık f_n \\rightrightarrows f biçiminde çift okla gösterilirken, noktasal yakınsaklık f_n \\to f tek okla gösterilir. Adams & Essex ve Rudin kaynaklarında "f_n converges uniformly to f on E" veya f_n -> f (uniformly) açık ibaresi kullanılır. Sınavınızda profesörünüzün çift ok \\rightrightarrows notasyonunu kullanınız.';
  }

  // 6. Build Verified Claims
  const verifiedClaims: SourceClaim[] = [
    {
      statement: concept.formalStatement,
      sourceAuthority: localDoc?.authority || 'PROFESSOR',
      verificationLevel: 'SOURCE_REFERENCED',
      citation: concept.sourceCitation || `${localDoc?.canonicalName || 'Ders Notu'}`
    }
  ];

  if (intuitionEvidence) {
    verifiedClaims.push({
      statement: intuitionEvidence.extractedExcerpt,
      sourceAuthority: intuitionEvidence.institution,
      verificationLevel: 'SOURCE_CROSS_CHECKED',
      citation: intuitionEvidence.citation
    });
  }

  // 7. Compose Result
  return {
    conceptId,
    courseAuthority: {
      documentName: localDoc?.canonicalName || concept.sourceTitle,
      author: localDoc?.author || concept.sourceAuthor,
      institution: localDoc?.institution || 'Eskişehir Osmangazi Üniversitesi',
      citation: concept.sourceCitation || `${localDoc?.canonicalName || 'Ders Notu'}`,
      authorityLevel: localDoc?.authority || 'PROFESSOR'
    },
    formalDefinitionSource: {
      source: concept.sourceCitation || `${localDoc?.canonicalName || 'ESOGÜ Resmi Müfredatı'}`,
      definitionLaTeX: concept.canonicalFormula || concept.formalStatement,
      assumptions: concept.assumptions || 'Gerekli matematiksel süreklilik ve tanım koşulları sağlanmalıdır.',
      citation: concept.sourceCitation || 'Bölüm Ders Notu'
    },
    proofSource: proofEvidence ? {
      source: proofEvidence.institution,
      proofSummary: proofEvidence.extractedExcerpt,
      citation: proofEvidence.citation
    } : (concept.proofDerivation ? {
      source: localDoc?.canonicalName || 'Ders Kitabı',
      proofSummary: concept.proofDerivation,
      citation: concept.sourceCitation || 'Teorem İspatı'
    } : undefined),
    intuitionSource: {
      source: intuitionEvidence ? intuitionEvidence.institution : 'Axiom Sezgisel Akıl Yürütme Motoru',
      mentalModel: intuitionEvidence ? intuitionEvidence.extractedExcerpt : (concept.translations[0]?.intuition || ''),
      citation: intuitionEvidence ? intuitionEvidence.citation : 'Pedagojik Mental Model'
    },
    exampleSource: {
      source: localProblem ? (localProblem.sourceLocation) : (workedExampleEvidence ? workedExampleEvidence.institution : 'Çözümlü Üniversite Örneği'),
      problemPrompt: localProblem?.rawPrompt || (concept.translations[0]?.definition || ''),
      stepByStepSolution: localProblem?.officialSolution || 'Çözüm adımları',
      citation: localProblem ? `ESOGÜ Sınav Arşivi (${localProblem.sourceLocation})` : (workedExampleEvidence?.citation || 'Akademik Örnek')
    },
    examSource: localProblem ? {
      examName: localProblem.sourceLocation,
      questionLocation: localProblem.sourceLocation,
      rawPrompt: localProblem.rawPrompt,
      officialSolution: localProblem.officialSolution || ''
    } : undefined,
    supportingSources: externalResearch.evidenceList.map(e => ({
      name: `${e.institution} (${e.courseName})`,
      role: e.pedagogicalRole,
      citation: e.citation
    })),
    notationDifferences,
    verifiedClaims,
    isExternalCrossChecked: externalResearch.isExternalAvailable
  };
}
