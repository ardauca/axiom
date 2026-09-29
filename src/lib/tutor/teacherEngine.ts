import { prisma } from '../prisma';
import { fuseAcademicSources, SourceFusionResult } from '../sources/sourceFusion';

export interface StructuredLessonStep {
  stepOrder: number;
  stepType: 'INTUITION' | 'DEFINITION' | 'MENTAL_MODEL' | 'NOTATION' | 'EXAMPLE' | 'WORKED_EXAMPLE' | 'MINI_CHECK' | 'GUIDED_PRACTICE';
  title: string;
  content: string;
  miniCheckQuestion?: string;
  miniCheckOptions?: string[];
  miniCheckAnswer?: string;
  miniCheckExplanation?: string;
}

export interface FusedLesson {
  conceptId: string;
  conceptName: string;
  dualTerminology?: string;
  formalStatement: string;
  assumptions: string;
  canonicalFormula: string;
  verificationLevel: number;
  verificationStatus: string;
  fusion: SourceFusionResult;
  steps: StructuredLessonStep[];
  nextPracticeSlug?: string;
}

/**
 * Generates an 8-step synthesized academic lesson based on source fusion
 * of local course notes and top-tier external academic sources.
 */
export async function generateStructuredLesson(
  conceptId: string,
  options?: { disableExternal?: boolean }
): Promise<FusedLesson> {
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
      },
      prerequisites: {
        include: {
          prerequisite: {
            include: { translations: { where: { language: 'tr' } } }
          }
        }
      }
    }
  });

  if (!concept) {
    throw new Error(`Concept not found: ${conceptId}`);
  }

  // 1. Fuse local professor documents with external academic authorities
  const fusion = await fuseAcademicSources(conceptId, options);

  const tr = concept.translations[0];
  const conceptName = tr?.name || concept.id;
  const dualTerm = tr?.dualTerminology || `${conceptName} (${concept.id})`;

  // Build the 8 pedagogical steps
  const steps: StructuredLessonStep[] = [];

  // Step 1: INTUITION
  const intuitionContent = fusion.intuitionSource.mentalModel || tr?.intuition || 
    `Bu konu neden var? Matematiksel ve mühendislik problemlerinde karşılaşılan temel bir ihtiyaca yanıt verir. Kuru formüllerden önce, bu kavramın arkasındaki fiziksel, geometrik veya algoritmik sezgiyi kavramak esastır.`;
  steps.push({
    stepOrder: 1,
    stepType: 'INTUITION',
    title: '1. Sezgi ve Mühendislik Motivasyonu',
    content: `${intuitionContent}\n\n> **Pedagojik Not:** ${fusion.intuitionSource.citation} ilkeleri doğrultusunda bu model, karmaşık soyutlamayı somut bir sezgiye dönüştürür.`
  });

  // Step 2: DEFINITION
  const assumptionsText = fusion.formalDefinitionSource.assumptions 
    ? `\n\n**Gerekli Önkoşullar ve Varsayımlar:**\n${fusion.formalDefinitionSource.assumptions}` 
    : '';
  const definitionContent = `${tr?.definition || concept.formalStatement}\n\n$$\n${fusion.formalDefinitionSource.definitionLaTeX}\n$$${assumptionsText}\n\n*Kaynak Otoritesi: ${fusion.formalDefinitionSource.source}*`;
  steps.push({
    stepOrder: 2,
    stepType: 'DEFINITION',
    title: '2. Biçimsel Matematiksel Tanım ve Hipotezler',
    content: definitionContent
  });

  // Step 3: MENTAL_MODEL
  let mentalModelText = `Zihninizde canlandırın: Tanımlanan matematiksel nesne statik bir sembol değil, bir dönüşüm veya karar sürecidir.`;
  if (conceptId === 'bayes-theorem') {
    mentalModelText = `**Zihinsel Model (Filtre / Odak Daraltma):**\n\nEvrensel küme $S$ içindeki tüm olasılıklar arasından, $B$ olayının gerçekleştiği bilgisi elimize ulaştığında, yeni evrenimiz artık yalnızca $B$ kümesidir. $A$'nın yeni olasılığı, $A$'nın $B$ içine düşen parçasının ($A \\cap B$) tüm $B$'ye olan alan oranıdır: $P(A|B) = \\frac{P(A \\cap B)}{P(B)}$.`;
  } else if (conceptId === 'directional-derivative') {
    mentalModelText = `**Zihinsel Model (Dağ Yamacında Eğim):**\n\nÜç boyutlu bir tepede durduğunuzu hayal edin. Sadece Doğuya ($x$) veya Kuzeye ($y$) değil, istediğiniz herhangi bir $\\vec{u}$ yönüne adım attığınızda hissettiğiniz diklik/eğim miktarı o yöndeki türevdir. Gradyan vektörü $\\nabla f$ en dik tırmanış doğrultusunu gösterir; $\\vec{u}$ ile skaler çarpımı ise o yöndeki bileşeni verir.`;
  } else if (conceptId === 'mathematical-induction') {
    mentalModelText = `**Zihinsel Model (Sonsuz Domino Taşları):**\n\n1. İlk taşı devirebiliyor muyuz? (Temel Adım: $P(1)$ doğru).\n2. Herhangi bir $k$. taş devrildiğinde, bir sonraki $(k+1)$. taşı devirecek fiziksel temasa sahip mi? (Tümevarım Adımı: $P(k) \\implies P(k+1)$).\nEğer bu iki mekanizma kanıtlanırsa, zincirleme reaksiyon durmaksızın sonsuza kadar devam eder.`;
  } else if (conceptId === 'eigenvalues') {
    mentalModelText = `**Zihinsel Model (Yönü Değişmeyen Eksenler):**\n\nBir uzay matrisle dönüştürüldüğünde (döndürüldüğünde, esnetildiğinde) çoğu vektörün doğrultusu kayar. Özvektörler öyle özel doğrultulardır ki, matris çarpımı onları döndürmez; sadece $\\lambda$ katsayısı kadar uzatır veya kısaltır ($Av = \\lambda v$).`;
  } else if (conceptId === 'modular-arithmetic') {
    mentalModelText = `**Zihinsel Model (Dairesel Saat Kadranı):**\n\nSayı doğrusunu sonsuza uzatmak yerine $n$ dilimli dairesel bir saat kadranına sarmaktır. $12$'den sonra $13$ değil $1$ gelir. Sayılar arasındaki mutlak fark mod $n$'in tam katıysa, bu sayılar aynı saat pozisyonuna denk gelir.`;
  } else if (conceptId === 'dynamic-programming') {
    mentalModelText = `**Zihinsel Model (Hafızalı Problem Çözücü):**\n\nBir problemi daha küçük örtüşen alt problemlere bölüp, her alt problemin sonucunu bir hafıza tablosuna kaydetmektir. Aynı alt soruyla tekrar karşılaşıldığında yeniden hesaplama yapılmaz, hafızadan $O(1)$ sürede okunur.`;
  }
  steps.push({
    stepOrder: 3,
    stepType: 'MENTAL_MODEL',
    title: '3. Zihinsel Model ve Analoji',
    content: mentalModelText
  });

  // Step 4: NOTATION
  let notationContent = `Bu konuda kullanılan standart değişkenler, indisler ve sembollerin matematiksel anlamları:\n\n- Standart akademik sembolojide her simgenin kesin bir tanım kümesi vardır.\n- İndisleme ve vektör gösterimleri bağlama göre titizlikle seçilmiştir.`;
  if (fusion.notationDifferences) {
    notationContent += `\n\n> [!IMPORTANT]\n> **Üniversite Notasyon Farkı & Sınav Standardı:**\n> ${fusion.notationDifferences}`;
  }
  steps.push({
    stepOrder: 4,
    stepType: 'NOTATION',
    title: '4. Semboller ve Notasyon Standartları',
    content: notationContent
  });

  // Step 5: EXAMPLE
  const exampleContent = `**Temel Uygulama:**\n\n${fusion.exampleSource.problemPrompt}\n\n**Çözüm Yolu:**\n${fusion.exampleSource.stepByStepSolution}\n\n*(Kaynak: ${fusion.exampleSource.citation})*`;
  steps.push({
    stepOrder: 5,
    stepType: 'EXAMPLE',
    title: '5. Temel Kavramsal Uygulama',
    content: exampleContent
  });

  // Step 6: WORKED_EXAMPLE
  let workedPrompt = fusion.examSource?.rawPrompt || fusion.exampleSource.problemPrompt;
  let workedSolution = fusion.examSource?.officialSolution || fusion.exampleSource.stepByStepSolution;
  let workedCitation = fusion.examSource ? `ESOGÜ Sınav Arşivi: ${fusion.examSource.examName}` : fusion.exampleSource.citation;

  steps.push({
    stepOrder: 6,
    stepType: 'WORKED_EXAMPLE',
    title: '6. Sınav Kalibresinde Adım Adım Çözüm',
    content: `**Sınav Sorusu:**\n${workedPrompt}\n\n**Adım Adım Rigoröz Çözüm:**\n${workedSolution}\n\n*(Soru Kaynağı: ${workedCitation})*`
  });

  // Step 7: MINI_CHECK
  let checkQ = 'Bu kavramın uygulanabilmesi için hangi önkoşul zorunludur?';
  let checkOpts = [
    'Tüm değişkenlerin 0\'dan büyük olması',
    'İlgili teoremin matematiksel hipotezlerinin eksiksiz sağlanması',
    'Yalnızca lineer sistemlerde çalışması',
    'Fonksiyonun tam sayı değerli olması'
  ];
  let checkAns = 'İlgili teoremin matematiksel hipotezlerinin eksiksiz sağlanması';
  let checkExpl = 'Matematiksel teoremler yalnızca hipotezleri (varsayımları) sağlandığında geçerlidir; keyfi veya ezbere genelleme yapılamaz.';

  if (conceptId === 'bayes-theorem') {
    checkQ = 'Bayes formülünde P(A|B) = P(B|A)P(A) / P(B) ifadesinin matematiksel olarak tanımlı olabilmesi için hangi koşul zorunludur?';
    checkOpts = [
      'P(B) > 0 olması',
      'P(A) > 0 olması',
      'A ve B olaylarının bağımsız olması',
      'P(A) + P(B) = 1 olması'
    ];
    checkAns = 'P(B) > 0 olması';
    checkExpl = 'P(A|B) koşullu olasılığının ve formüldeki paydanın tanımlı olması için bölünen olayın olasılığı P(B) kesinlikle 0\'dan büyük olmalıdır. P(A) > 0 olması zorunlu bir tanım şartı değildir.';
  } else if (conceptId === 'directional-derivative') {
    checkQ = 'D_u f(x, y) = grad(f) . u formülünün doğrudan geçerli olabilmesi için u vektörü ve f fonksiyonu için hangi şart gereklidir?';
    checkOpts = [
      'u herhangi bir vektör olmalı ve f sürekli olmalı',
      'u birim vektör (|u| = 1) olmalı ve f türevlenebilir (differentiable) olmalı',
      'u sadece x ekseni doğrultusunda olmalı',
      'f fonksiyonu lineer olmalı'
    ];
    checkAns = 'u birim vektör (|u| = 1) olmalı ve f türevlenebilir (differentiable) olmalı';
    checkExpl = 'Yönlü türevin gradyan ile skaler çarpım formülü, yön vektörünün birim vektör (|u|=1) olması ve fonksiyonun o noktada türevlenebilir (differentiable) olması şartına bağlıdır.';
  } else if (conceptId === 'mathematical-induction') {
    checkQ = 'Tümevarım kanıtında P(k) => P(k+1) adımını başarıyla kanıtladınız ama temel adım P(1)\'i göstermeyi unuttunuz. Kanıtın geçerliliği nedir?';
    checkOpts = [
      'Kanıt yine de geçerlidir çünkü k sonsuza gider',
      'Kanıt geçersizdir çünkü zincirleme reaksiyonu başlatacak bir başlangıç doğrusu (base case) yoktur',
      'Sadece tek sayılar için geçerlidir',
      'k > 10 için otomatik olarak doğrudur'
    ];
    checkAns = 'Kanıt geçersizdir çünkü zincirleme reaksiyonu başlatacak bir başlangıç doğrusu (base case) yoktur';
    checkExpl = 'Domino taşlarının birbirini devirebileceğini kanıtlamak, ilk taş devrilmediği sürece hiçbir taşın devrileceğini garanti etmez. Temel adım şarttır.';
  } else if (conceptId === 'eigenvalues') {
    checkQ = 'Bir A kare matrisi için det(A - lambda*I) = 0 denkleminin çözülmesi neden özdeğerleri verir?';
    checkOpts = [
      '(A - lambda*I)v = 0 denkleminin sıfırdan farklı bir v özvektör çözümü olması için matrisin tekil (singular) olması gerektiğinden',
      'Matrisin izi sıfır olduğu için',
      'Özdeğerlerin her zaman pozitif reel sayı olması gerektiğinden',
      'Determinant matrisin boyutunu küçülttüğü için'
    ];
    checkAns = '(A - lambda*I)v = 0 denkleminin sıfırdan farklı bir v özvektör çözümü olması için matrisin tekil (singular) olması gerektiğinden';
    checkExpl = '(A - lambda*I)v = 0 homojen sisteminin aşikar olmayan (v != 0) bir çözüme sahip olabilmesi ancak ve ancak katsayılar matrisinin determinantının 0 olmasıyla mümkündür.';
  }

  steps.push({
    stepOrder: 7,
    stepType: 'MINI_CHECK',
    title: '7. Kavramsal Kontrol (Yanılgı ve Hipotez Testi)',
    content: 'Aşağıdaki soru ezbere formül kullanımını değil, kavramın temel matematiksel mantığını ölçer.',
    miniCheckQuestion: checkQ,
    miniCheckOptions: checkOpts,
    miniCheckAnswer: checkAns,
    miniCheckExplanation: checkExpl
  });

  // Step 8: GUIDED_PRACTICE
  const relatedProblem = concept.problems[0]?.problem;
  const practiceTitle = relatedProblem?.translations[0]?.title || 'Özgün Akademik Alıştırma';
  const practiceSlug = relatedProblem?.slug;

  steps.push({
    stepOrder: 8,
    stepType: 'GUIDED_PRACTICE',
    title: '8. Rehberli Problem Çözümüne Geçiş',
    content: `Tebrikler! Kavramın sezgisini, biçimsel tanımını, notasyon ayrıntılarını ve sınav kalibresindeki çözüm adımlarını tamamladınız.\n\nŞimdi öğrendiklerinizi pekiştirmek için kas hafızası ve analitik düşünme gerektiren deliberate practice sorusuna geçebilirsiniz:\n\n**Hedef Soru:** [${practiceTitle}](/problem/${practiceSlug || ''})\n\n> *Axiom Deliberate Gym ipucu:* Soruyu çözerken takılırsanız hemen ipucunu açmayın; önce birinci ilkelerden (tanım ve hipotezler) başlayarak adımlarınızı kağıda yazın.`
  });

  // Cache/persist SourceFusionContext into DB
  try {
    await prisma.sourceFusionContext.upsert({
      where: { conceptId },
      create: {
        conceptId,
        notationDifferences: fusion.notationDifferences || null,
        verifiedClaimsJson: JSON.stringify(fusion.verifiedClaims)
      },
      update: {
        notationDifferences: fusion.notationDifferences || null,
        verifiedClaimsJson: JSON.stringify(fusion.verifiedClaims)
      }
    });
  } catch (err) {
    console.warn(`Could not cache SourceFusionContext for ${conceptId}:`, err);
  }

  return {
    conceptId,
    conceptName,
    dualTerminology: dualTerm,
    formalStatement: concept.formalStatement,
    assumptions: concept.assumptions || '',
    canonicalFormula: concept.canonicalFormula || '',
    verificationLevel: concept.verificationLevel,
    verificationStatus: concept.verificationStatus,
    fusion,
    steps,
    nextPracticeSlug: practiceSlug
  };
}

/**
 * Synchronizes the generated 8-step lesson into the ConceptLessonStep database tables
 * so that both the SSR page and any API endpoint immediately serve the rich fused lesson.
 */
export async function syncConceptLessonWithFusion(conceptId: string): Promise<FusedLesson> {
  const lesson = await generateStructuredLesson(conceptId);

  // Upsert steps in database
  for (const step of lesson.steps) {
    // Find or create lesson step
    const existing = await prisma.lessonStep.findFirst({
      where: {
        conceptId,
        stepOrder: step.stepOrder
      }
    });

    const stepType = step.stepType;
    const miniCheckAnswer = step.miniCheckAnswer || null;
    const miniCheckOptions = step.miniCheckOptions ? JSON.stringify(step.miniCheckOptions) : null;

    let stepId: string;
    if (existing) {
      stepId = existing.id;
      await prisma.lessonStep.update({
        where: { id: stepId },
        data: {
          stepType,
          miniCheckAnswer,
          miniCheckOptions
        }
      });
    } else {
      const created = await prisma.lessonStep.create({
        data: {
          conceptId,
          stepOrder: step.stepOrder,
          stepType,
          miniCheckAnswer,
          miniCheckOptions
        }
      });
      stepId = created.id;
    }

    // Upsert translation in TR
    await prisma.lessonStepTranslation.upsert({
      where: {
        lessonStepId_language: {
          lessonStepId: stepId,
          language: 'tr'
        }
      },
      create: {
        lessonStepId: stepId,
        language: 'tr',
        title: step.title,
        content: step.content,
        miniCheckQuestion: step.miniCheckQuestion || null
      },
      update: {
        title: step.title,
        content: step.content,
        miniCheckQuestion: step.miniCheckQuestion || null
      }
    });
  }

  return lesson;
}
