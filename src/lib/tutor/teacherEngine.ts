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
  } else if (conceptId === 'uniform-convergence') {
    mentalModelText = `**Zihinsel Model (Epsilon-Tüpü / Şerit Yaklaşımı):**\n\nNoktasal yakınsaklıkta (Pointwise), her $x$ noktası kendi hızında hedefe yaklaşır; bazı noktalar limite çok geç varabilir. Düzgün yakınsaklıkta (Uniform Convergence) ise, $f(x)$ limit fonksiyonunun etrafına $\\pm\\epsilon$ genişliğinde bir şerit (tüp) çizdiğimizde, belli bir $N$ indisinden sonraki TÜM $f_n(x)$ fonksiyonlarının grafiği BÜTÜN tanım kümesi boyunca İSTİSNASIZ olarak bu tüpün içerisine girer ve bir daha dışarı çıkamaz. $N$ sayısı $x$'e bağımlı olamaz, yalnızca seçilen hata payı $\\epsilon$'a bağlıdır ($N = N(\\epsilon)$).`;
  } else if (conceptId === 'double-integrals') {
    mentalModelText = `**Zihinsel Model (Ekmek Dilimleme / Hacim Toplama):**\n\nTek değişkenli integral bir eğrinin altındaki alanı dilim dilim toplarken, iki katlı integral $z = f(x, y)$ yüzeyinin altındaki 3 boyutlu katı cismin hacmini hesaplar. Fubini Teoremi, bir somun ekmeği önce $x$ ekseni boyunca paralel ince dilimlere ayırıp (her dilimin alanı bir iç integraldir), ardından bu dilimleri $y$ boyunca toplamaya (dış integral) benzer. Koordinat sırasını değiştirmek dilimleme yönünü 90 derece döndürmektir.`;
  } else if (conceptId === 'green-theorem') {
    mentalModelText = `**Zihinsel Model (Girdap Sayacı / Komşu İptali):**\n\nBölgeyi mikroskobik küçük karelere böldüğünüzü ve her karenin etrafında küçük birer girdap (curl / rotasyonel) döndüğünü hayal edin. İki komşu karenin ortak kenarındaki akışlar birbirine zıt yönde aktığı için birbirini tam olarak yok eder (iptal olur). Geriye yalnızca bölgenin en dış sınırındaki (çeperdeki) akış kalır. Dolayısıyla içerdeki tüm mikroskobik rotasyonellerin toplamı (çift katlı integral), dış çeperdeki toplam dolaşıma (eğrisel integral) eşittir.`;
  } else if (conceptId === 'exact-differential-equations') {
    mentalModelText = `**Zihinsel Model (Yükseklik Haritası ve Eşyükselti Eğrileri):**\n\nBir tepe yüzeyi $z = \\Psi(x, y)$ düşünün. Bu tepede sabit irtifada kalacak şekilde yürürseniz ($d\\Psi = 0$), yürüdüğünüz patika tam olarak diferansiyel denklemin çözüm eğrisi $\\Psi(x, y) = C$'dir. Denklemin tam (exact) olması, tepe yüzeyinin eğiminin (gradyanının) fiziksel olarak tutarlı olması anlamına gelir: $x$'e göre türevin $y$ değişimi ile $y$'ye göre türevin $x$ değişimi birbirine eşit olmalıdır ($M_y = N_x$, Clairaut / Schwarz teoremi).`;
  } else if (conceptId === 'spanning-trees') {
    mentalModelText = `**Zihinsel Model (Minimum Maliyetli Şebeke / Ağaç İskeleti):**\n\n$n$ adet kasabayı birbirine elektrik telleriyle bağlamak istiyorsunuz. Amacınız her kasabanın en az bir yoldan diğerlerine ulaşabilmesi (bağlantılılık), ancak gereksiz döngü/halka yapıp fazladan tel harcamamaktır (devirsizlik / ağaç yapısı). $n$ düğümü birbirine bağlayan en az kenarlı şebeke tam olarak $n - 1$ kenar içerir.`;
  } else if (conceptId === 'pipeline-hazards') {
    mentalModelText = `**Zihinsel Model (Endüstriyel Çamaşırhane Bandı):**\n\nYıkama, kurutma, katlama ve dolaba yerleştirme aşamalarından oluşan bir çamaşırhane düşünün. Birinci çamaşır yıkamadan kurutmaya geçtiğinde, ikinci çamaşırı hemen yıkamaya atabilirsiniz (Pipelining). Ancak eğer ikinci çamaşır birincinin kurumasını beklemek zorundaysa (örneğin aynı sepeti kullanacaklarsa veya sonuç verisine bağımlıysa), çamaşırhane bandı duraklar (Stall / Kabarcık). İleri iletim (Forwarding) ise ıslak sonucu kurutma bitmeden doğrudan sonraki aşamaya elden teslim etmektir.`;
  } else if (conceptId === 'linq-expressions') {
    mentalModelText = `**Zihinsel Model (Tarif Kartı vs Pişmiş Yemek):**\n\nBir yemek tarifi yazdığınızda yemek henüz pişmemiştir, elinizde sadece ne yapılacağını anlatan bir talimat vardır. LINQ sorgusu tanımlandığında (\`var q = list.Where(...)\`), sorgu çalıştırılmaz; sadece bir 'çalıştırma planı' (tarif) saklanır. Ne zaman ki \`foreach\`, \`.ToList()\` veya \`.Count()\` çağrılır, işte o an fırın yakılır ve veriler tek tek işlenir (Ertelenmiş Yürütme / Deferred Execution).`;
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
  } else if (conceptId === 'uniform-convergence') {
    checkQ = '(f_n) fonksiyon dizisinin bir I aralığında f fonksiyonuna düzgün yakınsaması ile noktasal yakınsaması arasındaki en temel mantıksal ve niceliksel fark nedir?';
    checkOpts = [
      'Düzgün yakınsaklıkta seçilen N indisi yalnızca epsilon\'a bağlı olup tüm x in I için ortaktır; noktasal yakınsaklıkta ise N indisi hem epsilon\'a hem de x noktasına bağlı olabilir (N = N(epsilon, x)).',
      'Noktasal yakınsaklık yalnızca kapalı ve sınırlı aralıklarda tanımlıdır.',
      'Düzgün yakınsak fonksiyon dizileri hiçbir zaman türevlenemez.',
      'Düzgün yakınsaklıkta her f_n fonksiyonunun sabit fonksiyon olması zorunludur.'
    ];
    checkAns = 'Düzgün yakınsaklıkta seçilen N indisi yalnızca epsilon\'a bağlı olup tüm x in I için ortaktır; noktasal yakınsaklıkta ise N indisi hem epsilon\'a hem de x noktasına bağlı olabilir (N = N(epsilon, x)).';
    checkExpl = 'Tanım gereği forall epsilon > 0, exists N(epsilon) in N oyle ki forall n >= N ve forall x in I icin |f_n(x) - f(x)| < epsilon. Burada "forall x" niteleyicisi "exists N" ifadesinden sonra geldiği için N sayısı x\'ten tamamen bağımsızdır ve tüm aralık için tek bir N yeterlidir.';
  } else if (conceptId === 'double-integrals') {
    checkQ = 'İki katlı integralde Kartezyen koordinatlardan Kutupsal koordinatlara (x = r cos theta, y = r sin theta) geçerken alan elemanı dA neden dx dy yerine r dr dtheta olur?';
    checkOpts = [
      'Dönüşümün Jacobian determinantı |J| = r olduğu için ve kutup merkezinden uzaklaştıkça açı diliminin yay uzunluğu r dtheta kadar genişlediğinden.',
      'r çarpanı integrali sadeleştirmek için keyfi olarak seçilmiş bir katsayıdır.',
      'Yalnızca çember yarıçapı 1 olduğunda r çarpanı yazılır, diğer durumlarda yazılmaz.',
      'r çarpanı integrali tek katlı integrale indirgemek için gereklidir.'
    ];
    checkAns = 'Dönüşümün Jacobian determinantı |J| = r olduğu için ve kutup merkezinden uzaklaştıkça açı diliminin yay uzunluğu r dtheta kadar genişlediğinden.';
    checkExpl = 'Kartezyen ve kutupsal koordinat dönüşümünde alan elemanı dA = |J| dr dtheta formülüyle hesaplanır. Jacobian determinantı det([[cos theta, -r sin theta], [sin theta, r cos theta]]) = r(cos^2 theta + sin^2 theta) = r çıkar.';
  } else if (conceptId === 'green-theorem') {
    checkQ = 'Green Teoremi\'nin geçerli olabilmesi için C eğrisi ve D bölgesi hangi temel geometrik ve topolojik koşulları sağlamalıdır?';
    checkOpts = [
      'C parçalı pürüzsüz, basit ve kapalı bir eğri olmalı; D ise C ile sınırlanmış basit bağlantılı bir düzlem bölgesi olmalı ve eğri pozitif (saat yönünün tersi) yönlendirilmiş olmalıdır.',
      'C eğrisi mutlaka bir elips veya çember olmalı, D bölgesi sonsuz olmalıdır.',
      'P ve Q fonksiyonlarının türevlerinin sıfır olması zorunludur.',
      'Eğrinin yönü fark etmeksizin sonuç her zaman pozitif çıkmalıdır.'
    ];
    checkAns = 'C parçalı pürüzsüz, basit ve kapalı bir eğri olmalı; D ise C ile sınırlanmış basit bağlantılı bir düzlem bölgesi olmalı ve eğri pozitif (saat yönünün tersi) yönlendirilmiş olmalıdır.';
    checkExpl = 'Green Teoremi basit bağlantılı (içinde delik olmayan) bölgelerde, kendini kesmeyen (basit) kapalı ve parçalı pürüzsüz sınır eğrileri üzerinde saat yönünün tersi (iç bölgeyi solda bırakan pozitif yön) altında geçerlidir.';
  } else if (conceptId === 'exact-differential-equations') {
    checkQ = 'M(x, y)dx + N(x, y)dy = 0 denkleminin bir D bölgesinde tam (exact) olması için gerek ve yeter koşul nedir?';
    checkOpts = [
      'dM/dy = dN/dx (kısmi türevlerin eşitliği) şartının D bölgesinde her yerde sağlanması.',
      'M(x, y) + N(x, y) = 0 olması.',
      'Denklemin derecesinin 2 olması.',
      'x ve y değişkenlerinin birbirinden bağımsız sabitler olması.'
    ];
    checkAns = 'dM/dy = dN/dx (kısmi türevlerin eşitliği) şartının D bölgesinde her yerde sağlanması.';
    checkExpl = 'Clairaut teoremi gereği d^2 Psi / (dy dx) = d^2 Psi / (dx dy) olmalıdır. dPsi/dx = M ve dPsi/dy = N olduğundan dM/dy = dN/dx zorunlu ve yeterli tamlık koşuludur.';
  } else if (conceptId === 'spanning-trees') {
    checkQ = 'n köşeli bağlantılı bir G çizgesinin bir T kapsayan ağacı (spanning tree) hakkında hangisi kesinlikle doğrudur?';
    checkOpts = [
      'T kesinlikle n köşe ve n - 1 kenar içerir, hiçbir çevrim (cycle) barındırmaz.',
      'T her zaman n kenar içerir.',
      'T çizgesinde her köşenin derecesi en az 3 olmalıdır.',
      'T yalnızca tam çizgelerde (complete graph) var olabilir.'
    ];
    checkAns = 'T kesinlikle n köşe ve n - 1 kenar içerir, hiçbir çevrim (cycle) barındırmaz.';
    checkExpl = 'Ağaç tanımı gereği bağlantılı ve devirsiz bir çizgedir. n köşeli bir ağaçta kenar sayısı daima n - 1\'dir. Kapsayan ağaç, orijinal çizgenin tüm n köşesini içerir.';
  } else if (conceptId === 'pipeline-hazards') {
    checkQ = '5 aşamalı MIPS boru hattında (IF, ID, EX, MEM, WB) bir LW (Load Word) komutunun hemen ardından gelen ve yüklenen register\'ı kullanan bir ADD komutu arasındaki Load-Use veri tehlikesi (hazard), veri ileri iletimi (forwarding) donanımı varken bile neden tamamen 0 stall ile çözülemez?';
    checkOpts = [
      'Bellekten okunan veri ancak MEM aşamasının sonunda hazır olduğundan ve sonraki komut bu veriye EX aşamasının başında ihtiyaç duyduğundan, zamanda geriye doğru iletim yapılamaz; zorunlu 1 çevrimlik stall (kabarcık) gerekir.',
      'ADD komutunun register yazma aşaması yoktur.',
      'MIPS işlemcilerde forwarding devreleri yalnızca çıkarma işlemlerinde çalışır.',
      'Boru hattı saat frekansı düştüğü için.'
    ];
    checkAns = 'Bellekten okunan veri ancak MEM aşamasının sonunda hazır olduğundan ve sonraki komut bu veriye EX aşamasının başında ihtiyaç duyduğundan, zamanda geriye doğru iletim yapılamaz; zorunlu 1 çevrimlik stall (kabarcık) gerekir.';
    checkExpl = 'LW komutunda veri bellekten 4. aşama olan MEM aşamasının sonunda çıkar. Bir sonraki komut ise ALU işlemi için veriyi 3. aşama (EX) başında ister. Forwarding zamanda geriye veri gönderemeyeceğinden donanım 1 çevrimlik "stall" (kabarcık) eklemek zorundadır.';
  } else if (conceptId === 'linq-expressions') {
    checkQ = 'C# LINQ sorgularında Where() metodunun ertelenmiş yürütme (deferred execution) ile çalışması ne anlama gelir?';
    checkOpts = [
      'Sorgu tanımlandığı satırda çalıştırılmaz; foreach, ToList() veya Count() gibi tetikleyicilerle tüketildiği anda kaynak koleksiyon üzerindeki güncel veriler üzerinden değerlendirilir.',
      'Sorgu arka planda ayrı bir thread\'de sonsuza kadar bekler.',
      'Sorgu yalnızca veritabanı bağlantısı açıkken çalışır.',
      'Sorgu derleme zamanında çalıştırılıp sabit diziye dönüştürülür.'
    ];
    checkAns = 'Sorgu tanımlandığı satırda çalıştırılmaz; foreach, ToList() veya Count() gibi tetikleyicilerle tüketildiği anda kaynak koleksiyon üzerindeki güncel veriler üzerinden değerlendirilir.';
    checkExpl = 'LINQ sorguları tembel değerlendirme (lazy evaluation) ilkesine göre tasarlanmıştır. Sorgu değişkeni sadece komut ağacını tutar, veri üzerinde dolaşma ancak sonuç talep edildiğinde (iteratör çağrıldığında) gerçekleşir.';
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
