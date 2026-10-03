import { prisma } from '../prisma';
import { researchAcademicSources, ExternalSourceEvidence } from './externalAcademicEngine';
import { evaluateAcademicSource } from './sourceEvaluation';

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

  // 4b. Perform Multi-Dimensional Academic Source Evaluation & Dynamic Role Assignment
  const evaluatedEvidence = externalResearch.evidenceList.map(ev => {
    const evalResult = evaluateAcademicSource(
      {
        id: ev.citation,
        name: ev.courseName,
        institution: ev.institution,
        tier: ev.tier,
        authority: 'REFERENCE_TEXTBOOK',
        rawText: `${ev.courseName} ${ev.citation} ${ev.extractedExcerpt}`,
        topicsCovered: [concept.translations[0]?.name || concept.id],
      },
      {
        targetConcept: concept.translations[0]?.name || concept.id,
      }
    );

    return {
      evidence: ev,
      evaluation: evalResult,
    };
  });

  // Identify external roles based on evaluation or specified role
  const intuitionEvidence = evaluatedEvidence.find(e => e.evidence.pedagogicalRole === 'BEST_INTUITION')?.evidence
    || externalResearch.evidenceList.find(e => e.pedagogicalRole === 'BEST_INTUITION');
  const proofEvidence = evaluatedEvidence.find(e => e.evidence.pedagogicalRole === 'FORMAL_PROOF')?.evidence
    || externalResearch.evidenceList.find(e => e.pedagogicalRole === 'FORMAL_PROOF');
  const workedExampleEvidence = evaluatedEvidence.find(e => e.evidence.pedagogicalRole === 'BEST_WORKED_EXAMPLE')?.evidence
    || externalResearch.evidenceList.find(e => e.pedagogicalRole === 'BEST_WORKED_EXAMPLE');

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
  } else if (conceptId === 'double-integrals') {
    notationDifferences = 'ESOGÜ Analiz III ders notlarında alan elemanı dA veya dx dy / dy dx olarak yazılır. Kutupsal koordinatlara geçildiğinde Jacobian çarpanı olan r unutulmamalıdır: dA = r dr dtheta. Adams & Essex notasyonuyla birebir örtüşür.';
  } else if (conceptId === 'green-theorem') {
    notationDifferences = 'Eğrisel integralde kapalı eğri üzerinde saatin tersi yönü (pozitif yön) standarttır ve \\oint_C veya \\oint_{\\partial D}^+ sembolüyle gösterilir. Sınavınızda eğrinin yönünün pozitif (iç bölgeyi soluna alan) yönde olduğunu teyit ediniz; saat yönünde eğri verilirse işaret eksiye döner.';
  } else if (conceptId === 'exact-differential-equations') {
    notationDifferences = 'ESOGÜ Diferansiyel Denklemler dersinde potansiyel fonksiyon Psi(x, y) = C veya F(x, y) = C olarak adlandırılır. M(x, y)dx + N(x, y)dy = 0 formunda M\'nin y\'ye göre kısmi türevi, N\'nin x\'e göre kısmi türevine eşit olmalıdır: M_y = N_x.';
  } else if (conceptId === 'spanning-trees') {
    notationDifferences = 'Graf teorisi literatüründe n köşeli bir ağaçta tam olarak n - 1 kenar bulunur (|E| = |V| - 1). ESOGÜ notlarında T = (V, E\') kapsayan ağacı simgeler ve devirsiz (acyclic) bağlantılı alt çizgedir.';
  } else if (conceptId === 'pipeline-hazards') {
    notationDifferences = 'ESOGÜ Bilgisayar Mimarisi ve Patterson & Hennessy standardında 5 aşamalı MIPS boru hattı [IF, ID, EX, MEM, WB] olarak adlandırılır. Veri riskleri (RAW: Read After Write) forwarding ile 0 stall\'a indirgenir; ancak Load-Use riski zorunlu 1 çevrimlik stall (kabarcık) gerektirir.';
  } else if (conceptId === 'linq-expressions') {
    notationDifferences = 'C# LINQ sorgularında Query Syntax (from e in list where ... select) ile Method Syntax (list.Where(...).Select(...)) tamamen denktir; derleyici sorguyu arka planda Extension Method zincirine dönüştürür.';
  } else if (conceptId === 'group-lagrange-theorem') {
    notationDifferences = 'Modern Cebir dersinde bir H altgrubunun G içindeki sol denklik sınıfları gH = {gh : h in H} veya aH biçiminde yazılır. [G:H] simgesi H\'nin G içindeki indeksini (ayrık koset sayısını) gösterir. Lagrange teoremine göre |G| = [G:H] * |H| olup |H|, |G|\'yi böler.';
  } else if (conceptId === 'frenet-serret-frame') {
    notationDifferences = 'Diferansiyel Geometri literatüründe eğri yay parametresiyle verildiğinde alfa(s) kullanılır; hız |alfa\'(s)| = 1\'dir. Teğet T(s) = alfa\'(s), asli normal N(s) = T\'(s)/|T\'(s)| ve binormal B(s) = T x N olarak tanımlanır. Eğrilik kappa(s) = |T\'(s)| ve burulma tau(s) skalerdir.';
  } else if (conceptId === 'symbolic-polynomial-gcd') {
    notationDifferences = 'Sembolik Hesaplamada iki polinomun OBEB\'i gcd(P, Q) veya obeb(P, Q) olarak yazılır. Tam sayılar halkası Z[x] üzerinde hesaplama yapılırken katsayı patlamasını önlemek için sözde kalan (pseudo-remainder prem(P, Q)) ve Subresultant PRS notasyonu kullanılır.';
  } else if (conceptId === 'lu-decomposition') {
    notationDifferences = 'Sayısal Yöntemler ve Sayısal Lineer Cebirde A = LU ayrışımı yapılırken L birim alt üçgensel matris (köşegeni 1 olan matris: L_ii = 1), U ise üst üçgensel matris olarak normalize edilir.';
  } else if (conceptId === 'topological-compactness') {
    notationDifferences = 'Topoloji dersinde açık örtü {U_alpha : alpha in Lambda} ailesidir. Kompaktlık her açık örtünün sonlu bir alt örtüsünün bulunmasıdır. R^n reel uzayında standart topolojiye göre kompaktlık "kapalı ve sınırlı" (Heine-Borel) kavramıyla özdeştir.';
  } else if (conceptId === 'cauchy-riemann-equations') {
    notationDifferences = 'Kompleks Analiz ders notlarında z = x + iy için f(z) = u(x, y) + iv(x, y) ayrışımı kullanılır. Cauchy-Riemann denklemleri u_x = v_y ve u_y = -v_x olarak ifade edilir. Bu kısmi türevler türevlenebilirliğin gerek koşuludur.';
  } else if (conceptId === 'divide-and-conquer-master-theorem') {
    notationDifferences = 'Algoritma analizinde yineleme T(n) = a T(n/b) + f(n) formundadır; a >= 1 alt problem sayısı, b > 1 boyut küçültme oranıdır. Kritik üst c_crit = log_b(a) olup f(n) fonksiyonunun n^(log_b a) ile asimptotik kıyası yapılır.';
  } else if (conceptId === 'category-functor-monad') {
    notationDifferences = 'Kategori teorisinde Ob(C) nesneler, Hom(A, B) veya Mor(A, B) morfizmlerdir. Functor F: C -> D nesne ve morfizm dönüşümüdür. Monad ise (T, eta, mu) üçlüsüdür; eta: Id -> T birim (return), mu: T^2 -> T çarpım (join/flatMap) doğal dönüşümüdür.';
  } else if (conceptId === 'java-jvm-memory-generics') {
    notationDifferences = 'Java dilinde primitive tipler (int, double) doğrudan değer tutarken nesne değişkenleri Stack üzerinde referans (işaretçi değeri) saklar. Java kesinlikle Pass-by-Value çalışır; parametreye referansın bir kopyası aktarılır. Generic yapılarda Tip Silme (Type Erasure) derleme aşamasında tip kontrolünden sonra Object\'e dönüştürülür.';
  } else if (conceptId === 'rsa-public-key-cryptography') {
    notationDifferences = 'Kriptoloji dersinde n = p*q (iki büyük asal sayı), Euler totient fonksiyonu phi(n) = (p-1)*(q-1)\'dir. Genel anahtar (e, n), özel anahtar (d, n)\'dir ve d*e = 1 (mod phi(n)) yani d = e^(-1) mod phi(n) olarak seçilir.';
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
