export interface SeedConcept {
  id: string;
  category: string;
  subcategory: string;
  formalStatement: string;
  assumptions: string;
  notation: string;
  canonicalFormula: string;
  proofDerivation: string;
  verificationLevel: number;
  verificationStatus: string; // 'SOURCE_BACKED' | 'CAS_VERIFIED' | 'NUMERICALLY_CHECKED' | 'SANDBOX_TESTED'
  sourceTitle: string;
  sourceAuthor: string;
  sourceCitation: string;
  prerequisites: Array<{ id: string; importance: string }>;
  translations: {
    tr: {
      name: string;
      dualTerminology: string;
      definition: string;
      intuition: string;
      commonPitfalls: string;
    };
    en: {
      name: string;
      dualTerminology: string;
      definition: string;
      intuition: string;
      commonPitfalls: string;
    };
  };
  lessonSteps: Array<{
    stepOrder: number;
    stepType: string;
    miniCheckAnswer?: string;
    miniCheckOptions?: string[];
    translations: {
      tr: { title: string; content: string; miniCheckQuestion?: string };
      en: { title: string; content: string; miniCheckQuestion?: string };
    };
  }>;
}

export const SEED_CONCEPTS: SeedConcept[] = [
  // =========================================================================
  // 1. MODULAR ARITHMETIC (Number Theory)
  // =========================================================================
  {
    id: 'modular-arithmetic',
    category: 'MATHEMATICS',
    subcategory: 'NumberTheory',
    formalStatement: 'a \\equiv b \\pmod m \\iff m \\mid (a - b)',
    assumptions: 'a, b \\in \\mathbb{Z}, m \\in \\mathbb{Z}^+',
    notation: 'a \\equiv b \\pmod m',
    canonicalFormula: 'a = qm + r \\text{ where } 0 \\le r < m',
    proofDerivation: 'By the Euclidean division theorem, a = q_1 m + r_1 and b = q_2 m + r_2 with 0 <= r_1, r_2 < m. The difference a - b = (q_1 - q_2)m + (r_1 - r_2) is divisible by m if and only if r_1 - r_2 is divisible by m. Since -m < r_1 - r_2 < m, this holds if and only if r_1 = r_2.',
    verificationLevel: 3,
    verificationStatus: 'SOURCE_BACKED',
    sourceTitle: 'Elementary Number Theory and Its Applications',
    sourceAuthor: 'Kenneth H. Rosen (Pearson Academic)',
    sourceCitation: 'Chapter 4: Congruences, Section 4.1, Theorem 4.1',
    prerequisites: [],
    translations: {
      tr: {
        name: 'Modüler Aritmetik',
        dualTerminology: 'Modüler Aritmetik (Modular Arithmetic)',
        definition: '$a, b \\in \\mathbb{Z}$ ve $m \\in \\mathbb{Z}^+$ olmak üzere, eğer $m$ sayısı $a - b$ farkını tam bölüyorsa ($m \\mid (a - b)$), $a$ ile $b$ mod $m$\'e göre denktir denir ve $a \\equiv b \\pmod m$ yazılır.',
        intuition: 'Dairesel bir saat gibi düşünün. 12 saatlik bir kadranda 9\'dan 5 saat sonra saat 14 değil, 2 olur. Sayılar sonsuz bir doğru yerine sonlu bir çember etrafında döner.',
        commonPitfalls: 'Modüler bölme normal bölme gibi yapılamaz. Bölme işlemi ancak bölen ile modül aralarında asalsa modüler ters ile mümkündür: $a \\cdot a^{-1} \\equiv 1 \\pmod m$.',
      },
      en: {
        name: 'Modular Arithmetic',
        dualTerminology: 'Modular Arithmetic',
        definition: 'For integers $a, b$ and positive integer $m \\in \\mathbb{Z}^+$, $a$ is congruent to $b$ modulo $m$ (written $a \\equiv b \\pmod m$) if $m$ divides the difference $a - b$.',
        intuition: 'Think of clock arithmetic. On a 12-hour dial, 5 hours after 9:00 is 2:00, not 14:00. Numbers wrap around a finite cycle.',
        commonPitfalls: 'Division cannot be done directly by division; it requires multiplying by the modular multiplicative inverse, which exists if and only if $\\gcd(a, m) = 1$.',
      },
    },
    lessonSteps: [
      {
        stepOrder: 1,
        stepType: 'INTUITION',
        translations: {
          tr: {
            title: '1. Sezgi: Döngüsel Zamanda Düşünmek',
            content: 'Bugün günlerden Salı ise, 14 gün sonra hangi gündür? Yine Salı. 15 gün sonra? Çarşamba. Sayıları bir cetvel gibi sonsuza uzatmak yerine, 7 günlük bir çember üzerinde sayarız. İşte modüler aritmetik, sonsuz tamsayılar dünyasını sonlu ve öngörülebilir döngülere indirgeme sanatıdır.',
          },
          en: {
            title: '1. Intuition: Thinking in Cycles',
            content: 'If today is Tuesday, what day is it in 14 days? Tuesday. In 15 days? Wednesday. Instead of marching along an infinite line, we walk around a 7-day circle. Modular arithmetic is the mathematics of cyclic structures and periodic remainders.',
          },
        },
      },
      {
        stepOrder: 2,
        stepType: 'DEFINITION',
        translations: {
          tr: {
            title: '2. Biçimsel Tanım ve Varsayımlar',
            content: '**Varsayım:** $a, b \\in \\mathbb{Z}$ ve $m \\in \\mathbb{Z}^+$ (pozitif tamsayı modül).\n\n**Tanım:** Eğer $m$ tamsayısı $a - b$ farkını kalansız bölüyorsa, $a$ ile $b$ mod $m$\'e göre denktir denir:\n$$a \\equiv b \\pmod m \\iff m \\mid (a - b)$$\nBu, $a$ ve $b$\'nin $m$\'e bölündüğünde aynı kalanı ($r$) vermesiyle tamamen eşdeğerdir ($0 \\le r < m$).',
          },
          en: {
            title: '2. Formal Definition & Assumptions',
            content: '**Assumptions:** $a, b \\in \\mathbb{Z}$ and $m \\in \\mathbb{Z}^+$ (positive integer modulus).\n\n**Definition:** Two integers $a$ and $b$ are congruent modulo $m$ if $m$ divides their difference $a - b$:\n$$a \\equiv b \\pmod m \\iff m \\mid (a - b)$$\nEquivalently, $a$ and $b$ leave the exact same remainder $r$ when divided by $m$, where $0 \\le r < m$.',
          },
        },
      },
      {
        stepOrder: 3,
        stepType: 'MENTAL_MODEL',
        translations: {
          tr: {
            title: '3. Zihinsel Model: Eşdeğerlik Sepetleri',
            content: 'Bütün sonsuz tamsayılar kümesini ($\\{\\dots, -2, -1, 0, 1, 2, \\dots\\}$), $m$ adet sepete ayırın. Mod 5 için sadece 5 sepet vardır: $[0], [1], [2], [3], [4]$.\nÖrneğin $[2]$ sepetinde $\\{\\dots, -8, -3, 2, 7, 12, 17, \\dots\\}$ sayıları yer alır. Aritmetik yaparken bu sepetlerin herhangi bir temsilcisiyle işlem yapabilirsiniz.',
          },
          en: {
            title: '3. Mental Model: Equivalence Bins',
            content: 'Partition the infinite set of all integers into exactly $m$ bins. For modulo 5, there are only 5 bins: $[0], [1], [2], [3], [4]$.\nThe bin $[2]$ contains $\\{\\dots, -8, -3, 2, 7, 12, 17, \\dots\\}$. Under modular arithmetic, any element in a bin represents the entire equivalence class.',
          },
        },
      },
      {
        stepOrder: 4,
        stepType: 'NOTATION',
        translations: {
          tr: {
            title: '4. Notasyonun Çözümlenmesi',
            content: '- $a \\equiv b \\pmod m$: "$a$ sayısı $m$ modülüne göre $b$\'ye denktir."\n- $a \\pmod m$: $a$\'nın $m$ ile bölümünden elde edilen standart kalan değerini ($0 \\le r < m$) ifade eden fonksiyonel gösterimdir.\n- $m \\mid (a - b)$: "$m$, $a-b$ farkını tam böler."',
          },
          en: {
            title: '4. Decoding the Notation',
            content: '- $a \\equiv b \\pmod m$: Read as "$a$ is congruent to $b$ modulo $m$".\n- $a \\pmod m$: The functional residue of $a$ when divided by $m$, strictly satisfying $0 \\le r < m$.\n- $m \\mid (a - b)$: "$m$ divides $a - b$ with zero remainder".',
          },
        },
      },
      {
        stepOrder: 5,
        stepType: 'SIMPLE_EXAMPLE',
        translations: {
          tr: {
            title: '5. Temel Örnek',
            content: '$38 \\equiv 3 \\pmod 7$ midir?\nKontrol edelim: $38 - 3 = 35$.\n$35 = 7 \\times 5$ olduğuna göre $7 \\mid 35$ sağlanır. Evet, $38 \\equiv 3 \\pmod 7$.\nAyrıca $-4 \\equiv 3 \\pmod 7$ çünkü $-4 - 3 = -7$ ve $7 \\mid (-7)$.',
          },
          en: {
            title: '5. Baseline Concrete Example',
            content: 'Is $38 \\equiv 3 \\pmod 7$?\nCheck the difference: $38 - 3 = 35 = 7 \\times 5$.\nSince $7 \\mid 35$, the congruence holds. Yes, $38 \\equiv 3 \\pmod 7$.\nSimilarly, $-4 \\equiv 3 \\pmod 7$ because $-4 - 3 = -7$, which is a multiple of 7.',
          },
        },
      },
      {
        stepOrder: 6,
        stepType: 'WORKED_EXAMPLE',
        translations: {
          tr: {
            title: '6. Adım Adım Çözümlü Örnek: Fermat Yardımıyla Büyük Üsler',
            content: 'Problem: $7^{100} \\pmod{13}$ kalanını bulunuz.\n1. **Adım:** 13 asal sayıdır ve $\\gcd(7, 13) = 1$\'dir. Fermat\'nın Küçük Teoremi gereğince:\n$$7^{13 - 1} = 7^{12} \\equiv 1 \\pmod{13}$$\n2. **Adım:** Üssü 12 modülüne göre bölelim: $100 = 12 \\times 8 + 4$.\n3. **Adım:** Eşliği parçalayalım:\n$$7^{100} = (7^{12})^8 \\cdot 7^4 \\equiv (1)^8 \\cdot 7^4 = 7^4 \\pmod{13}$$\n4. **Adım:** $7^2 = 49 \\equiv 10 \\equiv -3 \\pmod{13}$.\n5. **Adım:** $7^4 = (7^2)^2 \\equiv (-3)^2 = 9 \\pmod{13}$.\nCevap: **9**.',
          },
          en: {
            title: '6. Step-by-Step Worked Example: Large Power via Fermat',
            content: 'Problem: Find the remainder of $7^{100} \\pmod{13}$.\n1. **Step 1:** Since 13 is prime and $\\gcd(7, 13) = 1$, apply Fermat\'s Little Theorem:\n$$7^{12} \\equiv 1 \\pmod{13}$$\n2. **Step 2:** Decompose the exponent by the cycle length: $100 = 12 \\times 8 + 4$.\n3. **Step 3:** Simplify the congruence:\n$$7^{100} = (7^{12})^8 \\cdot 7^4 \\equiv 1^8 \\cdot 7^4 = 7^4 \\pmod{13}$$\n4. **Step 4:** Note that $7^2 = 49 \\equiv -3 \\pmod{13}$.\n5. **Step 5:** Thus $7^4 = (7^2)^2 \\equiv (-3)^2 = 9 \\pmod{13}$.\nFinal Answer: **9**.',
          },
        },
      },
      {
        stepOrder: 7,
        stepType: 'MINI_CHECK',
        miniCheckAnswer: 'gcd(a, m) = 1',
        miniCheckOptions: ['gcd(a, m) = 1', 'a > m', 'a çift olmalıdır', 'm asal olmamalıdır'],
        translations: {
          tr: {
            title: '7. Mini Kavrama Testi: Modüler Ters Koşulu',
            content: 'Modüler aritmetikte bölme işlemi $a \\cdot x \\equiv 1 \\pmod m$ denklemini sağlayan $x$ tersinin varlığına bağlıdır.',
            miniCheckQuestion: 'Bir $a$ tamsayısının mod $m$\'e göre çarpımsal tersinin ($a^{-1}$) var olabilmesi için zorunlu ve yeterli koşul nedir?',
          },
          en: {
            title: '7. Mini Knowledge Check: Multiplicative Inverse',
            content: 'In modular arithmetic, division corresponds to multiplying by an inverse: $a \\cdot x \\equiv 1 \\pmod m$.',
            miniCheckQuestion: 'What is the necessary and sufficient condition for $a$ to have a multiplicative inverse modulo $m$?',
          },
        },
      },
      {
        stepOrder: 8,
        stepType: 'GUIDED_PRACTICE',
        translations: {
          tr: {
            title: '8. Rehberli Problem',
            content: '**Soru:** $3x \\equiv 4 \\pmod 7$ lineer modüler denklemini çözünüz.\n- $\\gcd(3, 7) = 1$ olduğu için çözüm vardır ve tektir.\n- $3$\'ün mod 7\'deki tersini bulalım: $3 \\times 1 = 3, 3 \\times 2 = 6, 3 \\times 3 = 9 \\equiv 2, 3 \\times 4 = 12 \\equiv 5, 3 \\times 5 = 15 \\equiv 1 \\pmod 7$.\n- Yani $3^{-1} \\equiv 5 \\pmod 7$.\n- İki tarafı 5 ile çarpalım:\n$$x \\equiv 4 \\times 5 = 20 \\equiv 6 \\pmod 7$$\nKontrol: $3(6) = 18 = 2 \\times 7 + 4 \\equiv 4 \\pmod 7$. Sağlandı! Şimdi pratik modundaki zorlayıcı problemleri çözmeye hazırsınız.',
          },
          en: {
            title: '8. Guided Practice: Linear Congruence',
            content: '**Problem:** Solve $3x \\equiv 4 \\pmod 7$.\n- Since $\\gcd(3, 7) = 1$, a unique solution modulo 7 exists.\n- Find the inverse of 3 modulo 7: test multiples until $3k \\equiv 1 \\pmod 7$. We find $3 \\times 5 = 15 \\equiv 1 \\pmod 7$, so $3^{-1} \\equiv 5$.\n- Multiply both sides by 5:\n$$x \\equiv 4 \\times 5 = 20 \\equiv 6 \\pmod 7$$\nVerification: $3 \\times 6 = 18 = 2 \\times 7 + 4 \\equiv 4 \\pmod 7$. Correct! You are now prepared for independent problems.',
          },
        },
      },
    ],
  },

  // =========================================================================
  // 2. BAYES' THEOREM (Probability)
  // =========================================================================
  {
    id: 'bayes-theorem',
    category: 'MATHEMATICS',
    subcategory: 'Probability',
    formalStatement: 'P(A \\mid B) = \\frac{P(B \\mid A) P(A)}{P(B)}',
    assumptions: 'P(B) > 0',
    notation: 'P(A \\mid B)',
    canonicalFormula: 'P(A \\mid B) = \\frac{P(B \\mid A)P(A)}{P(B \\mid A)P(A) + P(B \\mid A^c)P(A^c)}',
    proofDerivation: 'By the mathematical definition of conditional probability on probability space (Omega, F, P): P(A cap B) = P(A | B)P(B) and P(A cap B) = P(B | A)P(A). Equating both sides and dividing by P(B) (valid since P(B) > 0) yields Bayes\' Theorem.',
    verificationLevel: 3,
    verificationStatus: 'SOURCE_BACKED',
    sourceTitle: 'Introduction to Probability (MIT OCW 18.05 / 6.041)',
    sourceAuthor: 'Dimitri P. Bertsekas & John N. Tsitsiklis',
    sourceCitation: 'Chapter 1: Sample Space and Probability, Section 1.4: Total Probability Theorem and Bayes\' Rule',
    prerequisites: [],
    translations: {
      tr: {
        name: 'Bayes Teoremi',
        dualTerminology: 'Bayes Teoremi (Bayes\' Theorem)',
        definition: 'Yeni bir gözlem veya kanıt ($B$, $P(B) > 0$) elde edildiğinde, bir olayın veya hipotezin ($A$) olasılığının nasıl güncelleneceğini belirten temel olasılık kuramı: $P(A|B) = \\frac{P(B|A)P(A)}{P(B)}$.',
        intuition: 'Bir mahkemedesiniz. Şüpheli hakkında başlangıçta bir kanaatiniz (önsel olasılık) vardır. Olay yerinde şüphelinin kan grubuyla eşleşen bir kan lekesi (yeni kanıt) bulunduğunda, kanaatinizi bu kanıtın gücüne göre rasyonel şekilde güncellersiniz.',
        commonPitfalls: 'Taban Oran İhmali (Base Rate Fallacy): $P(B|A)$ (hastaysa testin pozitif çıkması) ile $P(A|B)$ (testi pozitifse hasta olması) birbirine eşit DEĞİLDİR. Eğer hastalık çok nadir ise ($P(A)$ küçükse), testi pozitif çıkan birinin hasta olma olasılığı şaşırtıcı biçimde düşük kalabilir.',
      },
      en: {
        name: 'Bayes\' Theorem',
        dualTerminology: 'Bayes\' Theorem',
        definition: 'A fundamental theorem of probability theory specifying how to update the probability of a hypothesis $A$ given observed evidence $B$ ($P(B) > 0$): $P(A|B) = \\frac{P(B|A)P(A)}{P(B)}$.',
        intuition: 'Imagine being a detective with a prior suspicion about a suspect. When new forensic evidence arrives, Bayes\' Theorem provides the exact mathematical framework to rationally update your belief.',
        commonPitfalls: 'Base Rate Fallacy: Confusing the likelihood $P(B|A)$ with the posterior $P(A|B)$. If a disease is extremely rare, even a 99% accurate test yields a low posterior probability due to the overwhelming base rate of healthy individuals.',
      },
    },
    lessonSteps: [
      {
        stepOrder: 1,
        stepType: 'INTUITION',
        translations: {
          tr: {
            title: '1. Sezgi: Kanıt Işığında İnançları Güncellemek',
            content: 'Nadir görülen bir hastalık için yapılan testin %%99 doğru olduğunu varsayalım. Testiniz pozitif çıkarsa hasta olma olasılığınız %%99 mudur? Çoğu insan "evet" der, ancak matematik "hayır" der! Çünkü toplumun %%99.9\'u sağlıklıdır. Sağlıklı insanların oluşturduğu küçük yanlış pozitifler, hasta insanların gerçek pozitiflerini sayıca geride bırakabilir.',
          },
          en: {
            title: '1. Intuition: Updating Beliefs under Evidence',
            content: 'Suppose a medical test for a rare disease is 99% accurate. If your test comes back positive, is your probability of having the disease 99%? Intuition says yes, but probability theory says no! Because the vast majority of the population is healthy, false positives from the healthy population can easily outnumber true positives from the sick population.',
          },
        },
      },
      {
        stepOrder: 2,
        stepType: 'DEFINITION',
        translations: {
          tr: {
            title: '2. Biçimsel Tanım ve Varsayımlar',
            content: '**Varsayımlar:** Olasılık uzayında $P(B) > 0$ olan bir $B$ kanıt olayı ve keyfi bir $A$ hipotez olayı.\n\n*(Epistemik Not: $P(A) > 0$ varsayımı gerekli DEĞİLDİR. Eğer $P(A) = 0$ ise, $A \\cap B \\subseteq A$ olduğundan $P(A \\cap B) = 0$ ve dolayısıyla $P(A \\mid B) = 0$ olur. Teoremin ve $P(A \\mid B)$ koşullu olasılığının iyi tanımlı olması için gereken tek zorunlu koşul $P(B) > 0$\'dır.)*\n\n**Teorem:**\n$$P(A \\mid B) = \\frac{P(B \\mid A) \\cdot P(A)}{P(B)}$$\nToplam olasılık teoremi ile genişletildiğinde ($A^c$, $A$\'nın tümleyeni olmak üzere):\n$$P(A \\mid B) = \\frac{P(B \\mid A)P(A)}{P(B \\mid A)P(A) + P(B \\mid A^c)P(A^c)}$$',
          },
          en: {
            title: '2. Formal Definition & Assumptions',
            content: '**Assumptions:** Any evidence event $B$ with $P(B) > 0$, and an arbitrary hypothesis event $A$.\n\n*(Mathematical Note: $P(A) > 0$ is NOT required. If $P(A) = 0$, then $A \\cap B \\subseteq A \\implies P(A \\cap B) = 0$, giving $P(A \\mid B) = 0$. The sole strictly necessary condition for the conditional probability and division by $P(B)$ to be well-defined is $P(B) > 0$.)*\n\n**Theorem:**\n$$P(A \\mid B) = \\frac{P(B \\mid A) \\cdot P(A)}{P(B)}$$\nExpanding the denominator via the Law of Total Probability:\n$$P(A \\mid B) = \\frac{P(B \\mid A)P(A)}{P(B \\mid A)P(A) + P(B \\mid A^c)P(A^c)}$$',
          },
        },
      },
      {
        stepOrder: 3,
        stepType: 'MENTAL_MODEL',
        translations: {
          tr: {
            title: '3. Zihinsel Model: 10,000 Kişilik Nüfus Tablosu',
            content: '10,000 kişilik bir topluluk hayal edin:\n- 10 kişi hasta ($D$), 9,990 kişi sağlıklı ($H$).\n- Test hassasiyeti: %99. 10 hastanın 10\'u da pozitif çıkar.\n- Testin yanlış pozitif oranı: %1. 9,990 sağlıklı kişinin yaklaşık 100\'ü yanlış pozitif çıkar!\nToplam pozitif sayısı: $10 + 100 = 110$.\nTesti pozitif çıkanların gerçekten hasta olan oranı: $\\frac{10}{110} \\approx \\%9$!',
          },
          en: {
            title: '3. Mental Model: The 10,000 People Grid',
            content: 'Visualize a group of 10,000 people:\n- 10 people have the disease ($D$), 9,990 are healthy ($H$).\n- Test sensitivity: 99%. All 10 sick people test positive.\n- False positive rate: 1%. Approximately 100 healthy people also test positive!\nTotal positive tests: $10 + 100 = 110$.\nThe fraction of positive people who actually have the disease: $\\frac{10}{110} \\approx 9.1\\%$!',
          },
        },
      },
      {
        stepOrder: 4,
        stepType: 'NOTATION',
        translations: {
          tr: {
            title: '4. Dört Temel Terim',
            content: '- $P(A)$: **Önsel Olasılık (Prior)** — Kanıt görülmeden önce $A$\'ya verilen olasılık.\n- $P(B \\mid A)$: **Olabilirlik (Likelihood)** — Hipotez doğru olsaydı bu kanıtın görülme olasılığı.\n- $P(B)$: **Toplam Kanıt Olasılığı (Evidence / Marginal)** — Kanıtın evrendeki toplam görülme sıklığı.\n- $P(A \\mid B)$: **Sonsal Olasılık (Posterior)** — Kanıt görüldükten sonra $A$\'nın güncellenmiş yeni olasılığı.',
          },
          en: {
            title: '4. The Four Core Terms',
            content: '- $P(A)$: **Prior Probability** — Belief in hypothesis $A$ before seeing evidence $B$.\n- $P(B \\mid A)$: **Likelihood** — Probability that evidence $B$ occurs given that hypothesis $A$ is true.\n- $P(B)$: **Marginal Evidence** — Overall probability of observing evidence $B$.\n- $P(A \\mid B)$: **Posterior Probability** — Updated belief in hypothesis $A$ after observing evidence $B$.',
          },
        },
      },
      {
        stepOrder: 5,
        stepType: 'SIMPLE_EXAMPLE',
        translations: {
          tr: {
            title: '5. Temel Örnek: İki Torba',
            content: 'A Torbasında 2 Kırmızı, 1 Beyaz bilye var. B Torbasında 1 Kırmızı, 2 Beyaz bilye var.\nRastgele bir torba seçip ($P(A) = P(B) = 0.5$) bir bilye çekiyorsunuz ve Kırmızı çıkıyor ($R$).\nBu bilyenin A Torbasından gelmiş olma olasılığı:\n$$P(A \\mid R) = \\frac{P(R \\mid A)P(A)}{P(R \\mid A)P(A) + P(R \\mid B)P(B)} = \\frac{(2/3)(1/2)}{(2/3)(1/2) + (1/3)(1/2)} = \\frac{2/6}{2/6 + 1/6} = \\frac{2}{3}$$',
          },
          en: {
            title: '5. Baseline Example: Two Urns',
            content: 'Urn A contains 2 Red, 1 White marble. Urn B contains 1 Red, 2 White marbles.\nPick an urn uniformly at random ($P(A) = P(B) = 0.5$) and draw a marble. It is Red ($R$).\nThe posterior probability that it came from Urn A:\n$$P(A \\mid R) = \\frac{(2/3)(1/2)}{(2/3)(1/2) + (1/3)(1/2)} = \\frac{1/3}{1/3 + 1/6} = \\frac{2/6}{3/6} = \\frac{2}{3}$$',
          },
        },
      },
      {
        stepOrder: 6,
        stepType: 'WORKED_EXAMPLE',
        translations: {
          tr: {
            title: '6. Adım Adım Çözümlü Örnek: Tıbbi Teşhis',
            content: 'Nüfusun %%1\'inde görülen bir hastalık ($P(D) = 0.01$).\nTestin hasta birinde pozitif çıkma olasılığı (Duyarlılık): $P(+ \\mid D) = 0.95$.\nTestin sağlıklı birinde yanlış pozitif çıkma olasılığı: $P(+ \\mid D^c) = 0.05$.\nTesti pozitif çıkan birinin hasta olma olasılığı nedir?\n\n1. **Önsel ve Tümleyen Olasılıklar:**\n$P(D) = 0.01, \\quad P(D^c) = 0.99$\n2. **Pay Hesaplaması (Doğru Pozitif):**\n$P(+ \\mid D) P(D) = 0.95 \\times 0.01 = 0.0095$\n3. **Payda Hesaplaması (Toplam Pozitif):**\n$P(+) = P(+ \\mid D)P(D) + P(+ \\mid D^c)P(D^c) = 0.0095 + (0.05 \\times 0.99) = 0.0095 + 0.0495 = 0.059$\n4. **Bayes Oranı:**\n$$P(D \\mid +) = \\frac{0.0095}{0.059} = \\frac{95}{590} \\approx 0.161 \\text{ (yani \\%16.1)}$$\nSonuç: Test %%95 duyarlı olmasına rağmen, pozitif test alan birinin gerçekten hasta olma olasılığı sadece %%16.1\'dir.',
          },
          en: {
            title: '6. Step-by-Step Worked Example: Diagnostic Screening',
            content: 'Prevalence: $P(D) = 0.01$, so $P(D^c) = 0.99$.\nSensitivity: $P(+ \\mid D) = 0.95$. False positive rate: $P(+ \\mid D^c) = 0.05$.\nWhat is $P(D \\mid +)$?\n\n1. **Numerator (True Positive joint probability):**\n$P(+ \\mid D)P(D) = 0.95 \\times 0.01 = 0.0095$\n2. **Denominator (Total probability of positive):**\n$P(+) = 0.0095 + (0.05 \\times 0.99) = 0.0095 + 0.0495 = 0.059$\n3. **Posterior Calculation:**\n$$P(D \\mid +) = \\frac{0.0095}{0.059} \\approx 0.161 \\text{ (16.1\\%)}$$\nInterpretation: Despite 95% test accuracy, a patient testing positive has only a 16.1% probability of disease.',
          },
        },
      },
      {
        stepOrder: 7,
        stepType: 'MINI_CHECK',
        miniCheckAnswer: 'P(B|A) ile P(A|B) yer degistirilmistir',
        miniCheckOptions: [
          'P(B|A) ile P(A|B) yer degistirilmistir',
          'P(B) daima sifira esittir',
          'P(A) ile P(B) daima bagimsizdir',
          'Formul sadece yazi-tura icin gecerlidir',
        ],
        translations: {
          tr: {
            title: '7. Mini Kavrama Testi: Savcı Yanılgısı',
            content: 'Bir mahkemede savcı: "Şüphelinin kan grubu olay yerindeki kanla eşleşiyor. Masum bir insanın bu kan grubuna sahip olma olasılığı yalnızca %%1\'dir. Öyleyse şüphelinin masum olma olasılığı %%1\'dir" der.',
            miniCheckQuestion: 'Savcının akıl yürütmesindeki temel matematiksel hata nedir?',
          },
          en: {
            title: '7. Mini Knowledge Check: The Prosecutor\'s Fallacy',
            content: 'A prosecutor argues: "The defendant shares a rare blood type found at the crime scene, which occurs in only 1% of innocent people. Therefore, there is only a 1% chance the defendant is innocent."',
            miniCheckQuestion: 'What is the fundamental probabilistic fallacy in the prosecutor\'s claim?',
          },
        },
      },
      {
        stepOrder: 8,
        stepType: 'GUIDED_PRACTICE',
        translations: {
          tr: {
            title: '8. Rehberli Problem',
            content: '**Problem:** Bir fabrikada üretilen ürünlerin %60\'ı A makinesinden, %40\'ı B makinesinden çıkmaktadır. A makinesinin kusurlu ürün oranı %1, B makinesinin kusurlu ürün oranı %3\'tür. Rastgele seçilen bir ürünün kusurlu olduğu görülürse, bunun B makinesinden üretilmiş olma olasılığı nedir?\n\n- $P(B) = 0.40, P(K \\mid B) = 0.03 \\implies P(K \\cap B) = 0.40 \\times 0.03 = 0.012$.\n- $P(A) = 0.60, P(K \\mid A) = 0.01 \\implies P(K \\cap A) = 0.60 \\times 0.01 = 0.006$.\n- Toplam kusurlu olasılığı: $P(K) = 0.012 + 0.006 = 0.018$.\n- $P(B \\mid K) = \\frac{0.012}{0.018} = \\frac{12}{18} = \\frac{2}{3} \\approx \\%66.7$.\nHarika! Şimdi Bayes Teoremi üzerine zorlayıcı bağımsız problemleri çözmeye hazırsınız.',
          },
          en: {
            title: '8. Guided Practice: Factory Defect Analysis',
            content: '**Problem:** Machine A produces 60% of output with 1% defect rate. Machine B produces 40% with 3% defect rate. A randomly chosen item is found to be defective ($D$). What is $P(B \\mid D)$?\n\n- Joint B: $P(D \\cap B) = 0.40 \\times 0.03 = 0.012$.\n- Joint A: $P(D \\cap A) = 0.60 \\times 0.01 = 0.006$.\n- Total defective: $P(D) = 0.012 + 0.006 = 0.018$.\n- Posterior: $P(B \\mid D) = \\frac{0.012}{0.018} = \\frac{2}{3} \\approx 66.7\\%$.\nExcellent! You are now prepared for advanced practice problems.',
          },
        },
      },
    ],
  },

  // =========================================================================
  // 3. MATHEMATICAL INDUCTION (Discrete Mathematics)
  // =========================================================================
  {
    id: 'mathematical-induction',
    category: 'MATHEMATICS',
    subcategory: 'DiscreteMathematics',
    formalStatement: '[P(1) \\land (\\forall k \\in \\mathbb{N}, P(k) \\implies P(k+1))] \\implies \\forall n \\in \\mathbb{N}, P(n)',
    assumptions: 'P(n) \\text{ is a predicate on natural numbers } n \\in \\mathbb{N} = \\{1, 2, 3, \\dots\\}',
    notation: 'P(k) \\implies P(k+1)',
    canonicalFormula: '\\sum_{i=1}^n i = \\frac{n(n+1)}{2}',
    proofDerivation: 'Mathematical induction is equivalent to the Well-Ordering Principle of the natural numbers (every non-empty subset of N has a least element). Suppose the conclusion is false; let S = {n in N : not P(n)} be non-empty. S has a minimal element m. Since P(1) is true, m > 1. Then m - 1 is in N and P(m-1) is true. By the inductive step, P(m-1) implies P(m), contradicting m in S.',
    verificationLevel: 3,
    verificationStatus: 'SOURCE_BACKED',
    sourceTitle: 'Discrete Mathematics and Its Applications',
    sourceAuthor: 'Kenneth H. Rosen (McGraw-Hill)',
    sourceCitation: 'Chapter 5: Induction and Recursion, Section 5.1: Mathematical Induction',
    prerequisites: [],
    translations: {
      tr: {
        name: 'Matematiksel Tümevarım',
        dualTerminology: 'Matematiksel Tümevarım (Mathematical Induction)',
        definition: 'Doğal sayılar üzerinde tanımlı bir $P(n)$ önermesinin tüm $n \\in \\mathbb{N}$ için doğru olduğunu kanıtlamak amacıyla kullanılan temel ispat yöntemi. Temel Adım ($P(1)$) ve Tümevarım Adımı ($P(k) \\implies P(k+1)$) sağlandığında $P(n)$ tüm $n$ için doğrulanır.',
        intuition: 'Sıraya dizilmiş sonsuz dominoları düşünün. 1. İlk dominoyu devirirsiniz (Temel Adım). 2. Herhangi bir domino devrildiğinde bir sonrakini de devirecek biçimde dizilmiştir (Tümevarım Adımı). Bu iki koşul sağlandığında, sıradaki tüm dominolar istisnasız devrilir.',
        commonPitfalls: 'Tümevarım varsayımını ($P(k)$) kurmadan doğrudan eşitliği kabul etmek; veya Temel Adımı ($P(1)$) doğrulamayı atlamak. Temel adım olmadan zincir asla başlamaz.',
      },
      en: {
        name: 'Mathematical Induction',
        dualTerminology: 'Mathematical Induction',
        definition: 'A fundamental proof technique establishing that a predicate $P(n)$ is true for all natural numbers $n \\in \\mathbb{N}$ by proving a Base Case $P(1)$ and an Inductive Step $\\forall k, P(k) \\implies P(k+1)$.',
        intuition: 'Think of an infinite row of dominos. 1. You knock down the first domino (Base Case). 2. The spacing guarantees that if any domino falls, the next one falls (Inductive Step). Together, every domino in the infinite chain must fall.',
        commonPitfalls: 'Skipping the base case check or committing circular reasoning during the inductive step.',
      },
    },
    lessonSteps: [
      {
        stepOrder: 1,
        stepType: 'INTUITION',
        translations: {
          tr: {
            title: '1. Sezgi: Sonsuz Merdiveni Tırmanmak',
            content: 'Sonsuz basamaklı bir merdivenin her basamağına ulaşabileceğinizi nasıl kanıtlarsınız? Tek tek tüm basamaklara basamazsınız; sonsuz zamanınız yok. Ancak iki şeyi kanıtlarsanız iş biter:\n1. Birinci basamağa adım atabiliyorum.\n2. Hangi basamakta olursam olayım, bir sonraki basamağa tırmanabiliyorum.\nBu iki kural, sizi sonsuzdaki her basamağa ulaştırır!',
          },
          en: {
            title: '1. Intuition: Climbing an Infinite Ladder',
            content: 'How do you prove you can reach every rung of an infinite ladder? You cannot step on them one by one. But if you prove two conditions:\n1. You can step onto the first rung.\n2. Whenever you are on rung $k$, you can step onto rung $k+1$.\nThen you can reach any rung in the universe!',
          },
        },
      },
      {
        stepOrder: 2,
        stepType: 'DEFINITION',
        translations: {
          tr: {
            title: '2. İki Temel Sütun',
            content: '**1. Temel Adım (Base Case):** $P(1)$ önermesinin doğru olduğunu gösterin.\n**2. Tümevarım Adımı (Inductive Step):** Herhangi bir $k \\ge 1$ tamsayısı için, $P(k)$ önermesinin doğruluğu varsayıldığında (Tümevarım Hipotezi) $P(k+1)$ önermesinin de zorunlu olarak doğru olduğunu gösterin:\n$$P(k) \\implies P(k+1)$$\nBu iki adım tamamlandığında, Tümevarım İlkesi gereği $\\forall n \\in \\mathbb{N}, P(n)$ kanıtlanmış olur.',
          },
          en: {
            title: '2. The Two Pillars of Induction',
            content: '**1. Base Case:** Verify that statement $P(1)$ is true.\n**2. Inductive Step:** Prove that for any $k \\ge 1$, if $P(k)$ is assumed true (the Inductive Hypothesis), then $P(k+1)$ must also be true:\n$$P(k) \\implies P(k+1)$$\nOnce both are proven, the Principle of Mathematical Induction asserts that $P(n)$ is true for all $n \\in \\mathbb{N}$.',
          },
        },
      },
      {
        stepOrder: 3,
        stepType: 'MENTAL_MODEL',
        translations: {
          tr: {
            title: '3. Zihinsel Model: Domino Etkisi',
            content: 'Dominolar doğru dizilmiş olsa bile (adım 2 doğru olsa bile), parmağınızla ilk dominoyu devirmezseniz (adım 1 eksikse) hiçbir şey devrilmez. Benzer şekilde, ilk dominoyu devirseniz ama dominolar arası mesafe çok uzaksa ($P(k) \\not\\implies P(k+1)$) zincir hemen durur. Her iki adım da vazgeçilmezdir.',
          },
          en: {
            title: '3. Mental Model: The Domino Chain',
            content: 'Even if the dominos are spaced correctly ($P(k) \\implies P(k+1)$), nothing falls unless you push the first one ($P(1)$). Conversely, pushing the first domino achieves nothing if the gap between dominos is too wide. Both steps are strictly necessary.',
          },
        },
      },
      {
        stepOrder: 4,
        stepType: 'NOTATION',
        translations: {
          tr: {
            title: '4. Notasyon ve Semboller',
            content: '- $P(n)$: Doğal sayı $n$\'e bağlı önerme (iddia).\n- $\\mathbb{N}$: Doğal sayılar kümesi $\\{1, 2, 3, \\dots\\}$.\n- $P(k)$: Tümevarım hipotezi (doğru kabul edilen ara basamak).\n- $P(k+1)$: Hipotez kullanılarak türetilecek olan hedef basamak.',
          },
          en: {
            title: '4. Mathematical Symbols',
            content: '- $P(n)$: The proposition or claim parameterized by integer $n$.\n- $\\mathbb{N}$: The set of positive integers $\\{1, 2, 3, \\dots\\}$.\n- $P(k)$: Inductive Hypothesis (the assumption of truth at step $k$).\n- $P(k+1)$: The target proposition that must be logically deduced from $P(k)$.',
          },
        },
      },
      {
        stepOrder: 5,
        stepType: 'SIMPLE_EXAMPLE',
        translations: {
          tr: {
            title: '5. Temel Örnek: Gauss Toplam Formülü',
            content: 'İddia: $\\sum_{i=1}^n i = 1 + 2 + \\dots + n = \\frac{n(n+1)}{2}$.\n- **Temel Adım ($n=1$):**\nSol taraf: $1$. Sağ taraf: $\\frac{1(2)}{2} = 1$. Eşitlik sağlandı!\n- **Tümevarım Hipotezi ($n=k$):**\n$1 + 2 + \\dots + k = \\frac{k(k+1)}{2}$ doğru olsun.',
          },
          en: {
            title: '5. Baseline Example: Gauss Summation',
            content: 'Claim: $\\sum_{i=1}^n i = \\frac{n(n+1)}{2}$.\n- **Base Case ($n=1$):**\nLHS: $1$. RHS: $\\frac{1(2)}{2} = 1$. Holds!\n- **Inductive Hypothesis:** Assume $1 + 2 + \\dots + k = \\frac{k(k+1)}{2}$ holds for arbitrary $k \\ge 1$.',
          },
        },
      },
      {
        stepOrder: 6,
        stepType: 'WORKED_EXAMPLE',
        translations: {
          tr: {
            title: '6. Adım Adım İspatın Tamamlanması',
            content: '$k+1$ için eşitliğin sağlandığını gösterelim:\n$$1 + 2 + \\dots + k + (k+1) = [1 + 2 + \\dots + k] + (k+1)$$\nTümevarım hipotezini yerine koyalım:\n$$= \\frac{k(k+1)}{2} + (k+1)$$\nOrtak paranteze alalım:\n$$= (k+1) \\left( \\frac{k}{2} + 1 \\right) = (k+1) \\left( \\frac{k+2}{2} \\right) = \\frac{(k+1)((k+1) + 1)}{2}$$\nBu tam olarak formülde $n$ yerine $k+1$ yazılmış halidir! İspat tamamlandı.',
          },
          en: {
            title: '6. Step-by-Step Proof Completion',
            content: 'Show that the claim holds for $k+1$:\n$$1 + 2 + \\dots + k + (k+1) = [1 + 2 + \\dots + k] + (k+1)$$\nSubstitute the Inductive Hypothesis:\n$$= \\frac{k(k+1)}{2} + (k+1) = (k+1)\\left(\\frac{k}{2} + 1\\right) = \\frac{(k+1)(k+2)}{2} = \\frac{(k+1)((k+1)+1)}{2}$$\nThis matches the formula for $n = k+1$. Thus by induction, the claim holds for all $n \\ge 1$.',
          },
        },
      },
      {
        stepOrder: 7,
        stepType: 'MINI_CHECK',
        miniCheckAnswer: 'k=1 durumundan k=2 durumuna gecis saglanamaz',
        miniCheckOptions: [
          'k=1 durumundan k=2 durumuna gecis saglanamaz',
          'Atlar uzerinde matematik yapilamaz',
          'Atlarin renkleri tam sayi degildir',
          'Tumevarim sadece esitlikler icin gecerlidir',
        ],
        translations: {
          tr: {
            title: '7. Mini Kavrama Testi: "Bütün Atlar Aynı Renktir" Paradoksu',
            content: 'Ünlü bir sözde-ispatta: "$n$ atlık herhangi bir kümedeki tüm atlar aynı renktedir" iddiası tümevarımla kanıtlanmaya çalışılır. $k$ attan bir at çıkarılıp eklenerek $P(k) \\implies P(k+1)$ geçişi kurgulanır.',
            miniCheckQuestion: 'Bu sahte ispat nerede çöker?',
          },
          en: {
            title: '7. Mini Knowledge Check: The "All Horses Are Same Color" Fallacy',
            content: 'In a famous fallacy, one attempts to prove by induction that in any set of $n$ horses, all have the same color. The induction step relies on overlapping subsets.',
            miniCheckQuestion: 'Where does the inductive step break down?',
          },
        },
      },
      {
        stepOrder: 8,
        stepType: 'GUIDED_PRACTICE',
        translations: {
          tr: {
            title: '8. Rehberli Problem: Bölünebilirlik İspatı',
            content: '**Teorem:** Her $n \\ge 1$ için $3 \\mid (n^3 + 2n)$ olduğunu kanıtlayınız.\n- **Temel Adım ($n=1$):** $1^3 + 2(1) = 3$. $3 \\mid 3$ doğrudur.\n- **Tümevarım Adımı:** $k^3 + 2k = 3m$ olsun ($m \\in \\mathbb{Z}$).\n$n = k+1$ için ifadeyi açalım:\n$$(k+1)^3 + 2(k+1) = (k^3 + 3k^2 + 3k + 1) + (2k + 2) = (k^3 + 2k) + (3k^2 + 3k + 3)$$\n$$= 3m + 3(k^2 + k + 1) = 3(m + k^2 + k + 1)$$\n3 çarpanı elde edildiğinden $3 \\mid ((k+1)^3 + 2(k+1))$ kanıtlanmıştır. Q.E.D. Artık bağımsız tümevarım problemlerine hazırsınız!',
          },
          en: {
            title: '8. Guided Practice: Divisibility by Induction',
            content: '**Theorem:** Prove that $3 \\mid (n^3 + 2n)$ for all $n \\ge 1$.\n- **Base Case ($n=1$):** $1^3 + 2(1) = 3$. Divisible by 3.\n- **Inductive Step:** Assume $k^3 + 2k = 3m$.\nEvaluate for $k+1$:\n$$(k+1)^3 + 2(k+1) = (k^3 + 2k) + 3(k^2 + k + 1) = 3[m + k^2 + k + 1]$$\nSince 3 is factored out, the expression is divisible by 3. Q.E.D. You are ready for practice problems!',
          },
        },
      },
    ],
  },

  // =========================================================================
  // 4. EIGENVALUES & EIGENVECTORS (Linear Algebra)
  // =========================================================================
  {
    id: 'eigenvalues',
    category: 'MATHEMATICS',
    subcategory: 'LinearAlgebra',
    formalStatement: 'Av = \\lambda v \\iff (A - \\lambda I)v = 0 \\text{ for } v \\neq 0',
    assumptions: 'A \\in \\mathbb{C}^{n \\times n}, v \\in \\mathbb{C}^n \\setminus \\{\\mathbf{0}\\}, \\lambda \\in \\mathbb{C}',
    notation: 'A v = \\lambda v, \\quad \\det(A - \\lambda I) = 0',
    canonicalFormula: '\\det(A - \\lambda I) = 0, \\quad \\text{tr}(A) = \\sum \\lambda_i, \\quad \\det(A) = \\prod \\lambda_i',
    proofDerivation: 'If Av = lambda v for non-zero vector v, then Av - lambda I v = (A - lambda I)v = 0. The linear system (A - lambda I)v = 0 has a non-trivial solution if and only if the matrix (A - lambda I) has a non-trivial nullspace, which by the Invertible Matrix Theorem requires det(A - lambda I) = 0.',
    verificationLevel: 3,
    verificationStatus: 'SOURCE_BACKED',
    sourceTitle: 'Introduction to Linear Algebra',
    sourceAuthor: 'Gilbert Strang (MIT OpenCourseWare 18.06)',
    sourceCitation: 'Chapter 6: Eigenvalues and Eigenvectors, Section 6.1: Introduction to Eigenvalues',
    prerequisites: [
      { id: 'matrix-multiplication', importance: 'ESSENTIAL' },
    ],
    translations: {
      tr: {
        name: 'Özdeğerler ve Özvektörler',
        dualTerminology: 'Özdeğerler ve Özvektörler (Eigenvalues and Eigenvectors)',
        definition: 'Bir kare matris $A$ uygulandığında yönü değişmeyip yalnızca bir $\\lambda$ katsayısıyla ölçeklenen sıfırdan farklı bir $v$ vektörüne özvektör, bu $\\lambda$ skalerine ise özdeğer denir: $Av = \\lambda v$.',
        intuition: 'Bir matris genel olarak uzaydaki vektörleri hem döndürür hem de uzatır/kısaltır. Ancak bazı ayrıcalıklı eksenler vardır ki matris bu eksenlerin yönünü hiç bozmaz, yalnızca boyunu $\\lambda$ kadar esnetir.',
        commonPitfalls: 'Özvektör $v$ ASLA sıfır vektörü olamaz ($v \\neq 0$). Çünkü $A0 = \\lambda 0$ her $\\lambda$ için önemsizce sağlanır. Fakat özdeğer $\\lambda = 0$ OLABİLİR (bu, matrisin determinantının sıfır olduğunu ve tersi olmadığını gösterir).',
      },
      en: {
        name: 'Eigenvalues and Eigenvectors',
        dualTerminology: 'Eigenvalues and Eigenvectors',
        definition: 'For a square matrix $A$, a non-zero vector $v$ is an eigenvector with corresponding eigenvalue $\\lambda$ if $Av = \\lambda v$.',
        intuition: 'Matrices typically rotate and stretch space. Eigenvectors are the privileged directions whose orientation remains invariant under the transformation, merely being scaled by factor $\\lambda$.',
        commonPitfalls: 'An eigenvector $v$ can NEVER be the zero vector ($v \\neq 0$). However, an eigenvalue $\\lambda$ CAN be zero, which signifies that matrix $A$ is singular.',
      },
    },
    lessonSteps: [
      {
        stepOrder: 1,
        stepType: 'INTUITION',
        translations: {
          tr: {
            title: '1. Sezgi: Yönünü Kaybetmeyen Doğrultular',
            content: 'İki boyutlu bir lastik kumaşı tutup yatay eksende 3 kat genişletip dikey eksende yarıya indirdiğinizi düşünün. Çoğu nokta yön değiştirir. Fakat tam $x$ ekseni ve tam $y$ ekseni üzerindeki noktaların yönü hiç değişmez; sadece mesafeleri değişir. Bu değişmeyen eksenler özvektörler, uzama katsayıları ($3$ ve $0.5$) ise özdeğerlerdir.',
          },
          en: {
            title: '1. Intuition: Directions that Do Not Rotate',
            content: 'Imagine stretching a rubber sheet so it expands by $3\\times$ horizontally and contracts by $0.5\\times$ vertically. Almost all vectors change their heading. But vectors pointing along the x-axis or y-axis do not rotate at all; they merely stretch. Those invariant directions are eigenvectors, and their scaling factors are eigenvalues.',
          },
        },
      },
      {
        stepOrder: 2,
        stepType: 'DEFINITION',
        translations: {
          tr: {
            title: '2. Biçimsel Tanım ve Varsayımlar',
            content: '**Varsayımlar:** $A \\in \\mathbb{C}^{n \\times n}$ (kare matris), $v \\in \\mathbb{C}^n \\setminus \\{\\mathbf{0}\\}$ (sıfırdan farklı vektör), $\\lambda \\in \\mathbb{C}$ (özdeğer $\\lambda = 0$ olabilir, ancak özvektör $v \\neq \\mathbf{0}$ olmalıdır).\n\n**Tanım:**\n$$Av = \\lambda v$$\nMatris çarpımı kuralıyla düzenlersek ($I$ birim matris olmak üzere):\n$$(A - \\lambda I)v = 0$$\nSıfırdan farklı bir $v$ vektörünün bu homojen denklemde yer alabilmesi için $(A - \\lambda I)$ matrisinin determinantı sıfır olmalıdır:\n$$\\det(A - \\lambda I) = 0$$\nBu denkleme **Karakteristik Denklem** denir.',
          },
          en: {
            title: '2. Formal Statement & The Characteristic Equation',
            content: '**Assumptions:** Square matrix $A \\in \\mathbb{C}^{n \\times n}$, non-zero eigenvector $v \\neq \\mathbf{0}$, and scalar eigenvalue $\\lambda \\in \\mathbb{C}$ (note: $\\lambda = 0$ is a valid eigenvalue, but $v \\neq \\mathbf{0}$ is strictly required).\n\n**Definition:**\n$$Av = \\lambda v \\iff (A - \\lambda I)v = 0$$\nFor non-zero $v$ to exist in the nullspace, $(A - \\lambda I)$ must be singular:\n$$\\det(A - \\lambda I) = 0$$\nThis polynomial equation is called the **Characteristic Equation**.',
          },
        },
      },
      {
        stepOrder: 3,
        stepType: 'MENTAL_MODEL',
        translations: {
          tr: {
            title: '3. Zihinsel Model: Koordinat Sistemi Dönüşümü',
            content: 'Bir matrisle çalışmak genelde zordur çünkü satırlar ve sütunlar birbirine karışır. Ancak matrisi kendi özvektörlerinin ekseninde incelerseniz (köşegenleştirme: $A = PDP^{-1}$), matris basitçe her ekseni kendi özdeğeriyle çarpan sevimli bir köşegen matrise dönüşür.',
          },
          en: {
            title: '3. Mental Model: Finding the Natural Basis',
            content: 'Working with a matrix in arbitrary coordinates is messy. But in the coordinate system of its eigenvectors (diagonalization $A = PDP^{-1}$), the transformation simplifies into independent scalings along each axis.',
          },
        },
      },
      {
        stepOrder: 4,
        stepType: 'NOTATION',
        translations: {
          tr: {
            title: '4. Notasyon ve Özdeğer Özellikleri',
            content: '- $\\lambda$: Özdeğer (Yunanca "eigen" = öz, kendine ait).\n- $v$: Özvektör ($v \\neq 0$).\n- $\\text{tr}(A)$: Matrisin izi (köşegen toplamı). $\\text{tr}(A) = \\sum \\lambda_i$.\n- $\\det(A)$: Matrisin determinantı. $\\det(A) = \\prod \\lambda_i$.',
          },
          en: {
            title: '4. Notation & Invariant Properties',
            content: '- $\\lambda$: Eigenvalue (from German "eigen" meaning proper, characteristic).\n- $v$: Eigenvector (strictly $v \\neq 0$).\n- $\\text{tr}(A)$: Trace of the matrix. $\\text{tr}(A) = \\sum_{i=1}^n \\lambda_i$.\n- $\\det(A)$: Determinant of the matrix. $\\det(A) = \\prod_{i=1}^n \\lambda_i$.',
          },
        },
      },
      {
        stepOrder: 5,
        stepType: 'SIMPLE_EXAMPLE',
        translations: {
          tr: {
            title: '5. Temel Örnek: Köşegen Matris',
            content: '$A = \\begin{pmatrix} 7 & 0 \\\\ 0 & -2 \\end{pmatrix}$ olsun.\n$$\\det(A - \\lambda I) = \\det\\begin{pmatrix} 7 - \\lambda & 0 \\\\ 0 & -2 - \\lambda \\end{pmatrix} = (7 - \\lambda)(-2 - \\lambda) = 0$$\nÖzdeğerler doğrudan köşegendeki sayılardır: $\\lambda_1 = 7, \\lambda_2 = -2$.\nÖzvektörler: $v_1 = \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}, v_2 = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$.',
          },
          en: {
            title: '5. Baseline Example: Diagonal Matrix',
            content: 'For $A = \\begin{pmatrix} 7 & 0 \\\\ 0 & -2 \\end{pmatrix}$:\n$$\\det(A - \\lambda I) = (7 - \\lambda)(-2 - \\lambda) = 0$$\nThe eigenvalues are the diagonal entries themselves: $\\lambda_1 = 7, \\lambda_2 = -2$.\nCorresponding eigenvectors: $v_1 = \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}$ and $v_2 = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$.',
          },
        },
      },
      {
        stepOrder: 6,
        stepType: 'WORKED_EXAMPLE',
        translations: {
          tr: {
            title: '6. Adım Adım Çözümlü Örnek: 2x2 Genel Matris',
            content: '$A = \\begin{pmatrix} 4 & 1 \\\\ 2 & 3 \\end{pmatrix}$ matrisinin özdeğerlerini bulalım.\n1. **Karakteristik Matrisi Yazalım:**\n$$A - \\lambda I = \\begin{pmatrix} 4 - \\lambda & 1 \\\\ 2 & 3 - \\lambda \\end{pmatrix}$$\n2. **Determinantı Alalım:**\n$$\\det(A - \\lambda I) = (4 - \\lambda)(3 - \\lambda) - (1)(2)$$\n$$= 12 - 7\\lambda + \\lambda^2 - 2 = \\lambda^2 - 7\\lambda + 10$$\n3. **Kökleri Bulalım:**\n$$\\lambda^2 - 7\\lambda + 10 = (\\lambda - 5)(\\lambda - 2) = 0$$\nÖzdeğerler: $\\lambda_1 = 5$ ve $\\lambda_2 = 2$.\n\n**Kontrol:**\n- $\\lambda_1 + \\lambda_2 = 5 + 2 = 7 = \\text{tr}(A) = 4 + 3 = 7$. (Doğru!)\n- $\\lambda_1 \\cdot \\lambda_2 = 5 \\times 2 = 10 = \\det(A) = 4(3) - 1(2) = 10$. (Doğru!)',
          },
          en: {
            title: '6. Step-by-Step Worked Example: General 2x2 Matrix',
            content: 'Find eigenvalues of $A = \\begin{pmatrix} 4 & 1 \\\\ 2 & 3 \\end{pmatrix}$.\n1. **Construct $A - \\lambda I$:**\n$$A - \\lambda I = \\begin{pmatrix} 4 - \\lambda & 1 \\\\ 2 & 3 - \\lambda \\end{pmatrix}$$\n2. **Compute Determinant:**\n$$\\det(A - \\lambda I) = (4 - \\lambda)(3 - \\lambda) - 2 = \\lambda^2 - 7\\lambda + 10$$\n3. **Factor Characteristic Polynomial:**\n$$(\\lambda - 5)(\\lambda - 2) = 0 \\implies \\lambda_1 = 5, \\lambda_2 = 2$$\n\n**Verification:**\n- Sum: $5 + 2 = 7 = \\text{tr}(A) = 4 + 3$.\n- Product: $5 \\times 2 = 10 = \\det(A) = 12 - 2 = 10$.',
          },
        },
      },
      {
        stepOrder: 7,
        stepType: 'MINI_CHECK',
        miniCheckAnswer: 'v = 0 icin A(0) = lambda(0) her lambda icin onemsizce saglanir',
        miniCheckOptions: [
          'v = 0 icin A(0) = lambda(0) her lambda icin onemsizce saglanir',
          'Sifir vektoru matrislerle carpilamaz',
          'Sifir vektorunun uzunlugu sonsuzdur',
          'Determinant hesaplanamaz hale gelir',
        ],
        translations: {
          tr: {
            title: '7. Mini Kavrama Testi: Sıfır Vektörü Neden Hariçtir?',
            content: 'Lineer cebirde özvektörler, dönüşüm altında doğrultusu korunarak yalnızca ölçeklenen yönleri temsil eder. Tanım, matematiksel dejenerasyonu önlemek için sıfırdan farklı vektörleri ($v \\neq \\mathbf{0}$) şart koşar.',
            miniCheckQuestion: 'Özvektör tanımından $v = 0$ sıfır vektörünün hariç tutulmasının temel matematiksel nedeni nedir?',
          },
          en: {
            title: '7. Mini Knowledge Check: Why Exclude Zero Vector?',
            content: 'In linear algebra, eigenvectors represent invariant directional axes under transformation. The formal definition strictly requires non-zero vectors ($v \\neq \\mathbf{0}$) to prevent mathematical degeneracy.',
            miniCheckQuestion: 'What is the mathematical reason for explicitly excluding the zero vector $v = 0$ from being an eigenvector?',
          },
        },
      },
      {
        stepOrder: 8,
        stepType: 'GUIDED_PRACTICE',
        translations: {
          tr: {
            title: '8. Rehberli Problem',
            content: '**Problem:** $A = \\begin{pmatrix} 1 & 2 \\\\ 2 & 1 \\end{pmatrix}$ simetrik matrisinin özdeğerlerini bulunuz.\n- Karakteristik denklem: $\\det\\begin{pmatrix} 1 - \\lambda & 2 \\\\ 2 & 1 - \\lambda \\end{pmatrix} = (1 - \\lambda)^2 - 4 = 0$.\n- $(1 - \\lambda)^2 = 4 \\implies 1 - \\lambda = \\pm 2$.\n- $\\lambda_1 = 1 - 2 = -1$.\n- $\\lambda_2 = 1 + 2 = 3$.\nİz kontrolü: $-1 + 3 = 2 = 1 + 1$. Determinant: $(-1)(3) = -3 = 1 - 4 = -3$. Mükemmel! Artık bağımsız lineer cebir problemlerine hazırsınız.',
          },
          en: {
            title: '8. Guided Practice: Symmetric Matrix',
            content: '**Problem:** Find the eigenvalues of $A = \\begin{pmatrix} 1 & 2 \\\\ 2 & 1 \\end{pmatrix}$.\n- Characteristic equation: $(1 - \\lambda)^2 - 4 = 0$.\n- $(1 - \\lambda)^2 = 4 \\implies 1 - \\lambda = \\pm 2$.\n- $\\lambda_1 = -1, \\lambda_2 = 3$.\nCheck: $\\text{tr} = -1 + 3 = 2$, $\\det = (-1)(3) = -3 = 1 - 4$. Excellent! You are ready for independent problem solving.',
          },
        },
      },
    ],
  },

  // =========================================================================
  // 5. DYNAMIC PROGRAMMING (Computer Science / Algorithms)
  // =========================================================================
  {
    id: 'dynamic-programming',
    category: 'COMPUTER_SCIENCE',
    subcategory: 'Algorithms',
    formalStatement: 'OPT(i) = \\min_{j < i} \\{ OPT(j) + \\text{cost}(j, i) \\}',
    assumptions: 'Problem exhibits Optimal Substructure and Overlapping Subproblems without cyclic dependencies',
    notation: 'OPT(i), \\quad dp[i][w]',
    canonicalFormula: 'F(n) = F(n-1) + F(n-2), \\quad dp[i][w] = \\max(dp[i-1][w], dp[i-1][w-w_i] + v_i)',
    proofDerivation: 'By the Principle of Optimality (Richard Bellman, 1957): An optimal policy has the property that whatever the initial state and decision are, the remaining decisions must constitute an optimal policy with regard to the state resulting from the first decision. Storing subproblem solutions in a table guarantees each state is computed exactly once.',
    verificationLevel: 3,
    verificationStatus: 'SOURCE_BACKED',
    sourceTitle: 'Introduction to Algorithms (CLRS)',
    sourceAuthor: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
    sourceCitation: 'Chapter 15: Dynamic Programming, Section 15.1: Rod Cutting & Section 15.3: Elements of Dynamic Programming',
    prerequisites: [],
    translations: {
      tr: {
        name: 'Dinamik Programlama',
        dualTerminology: 'Dinamik Programlama (Dynamic Programming)',
        definition: 'Karmaşık bir optimizasyon problemini örtüşen alt problemlere (overlapping subproblems) bölüp, her bir alt problemin en uygun çözümünü belleğe kaydederek (memoization / tabulation) üstel karmaşıklığı ($O(2^n)$) polinomiyal zamana ($O(n)$ veya $O(n^2)$) indiren algoritma tasarım paradigması.',
        intuition: 'Bir kâğıda 1+1+1+1+1 yazdığınızı düşünün. Kaç tane 1 var? Beş. Şimdi başına bir tane daha "+ 1" eklerseniz ne olur? Hepsini baştan saymazsınız; önceki cevabınız olan 5\'i hatırlayıp 1 eklersiniz: 6! Dinamik programlama tam olarak bu "önceden çözülmüş alt sonuçları hatırlama" sanatıdır.',
        commonPitfalls: 'Durum (state) tanımını eksik yapmak; alt problemler arasında bağımsızlık (optimal substructure) olmadığını fark etmemek; veya döngüsel bağımlılık (circular dependency) kurmak.',
      },
      en: {
        name: 'Dynamic Programming',
        dualTerminology: 'Dynamic Programming',
        definition: 'An algorithmic design paradigm that solves complex optimization problems by breaking them down into overlapping subproblems, solving each once, and storing their solutions to reduce exponential time to polynomial time.',
        intuition: 'Write 1+1+1+1+1 on a paper. How many? Five. Add another "+ 1" to the front. How many now? You do not recount from scratch; you remember 5 and add 1 to get 6. That is dynamic programming: remembering subproblem solutions to solve larger problems.',
        commonPitfalls: 'Defining an incomplete state; assuming optimal substructure when subproblems are not independent; or introducing cyclic state transitions.',
      },
    },
    lessonSteps: [
      {
        stepOrder: 1,
        stepType: 'INTUITION',
        translations: {
          tr: {
            title: '1. Sezgi: Belleksiz Akıl Üstel Çöker',
            content: 'Saf özyinelemeli (recursive) bir Fibonacci algoritması $F(5)$ için $F(3)$\'ü 2 kez, $F(2)$\'yi 3 kez baştan hesaplar. $F(50)$ için gereken işlem sayısı $2^{50} \\approx 10^{15}$ adım olur ve bilgisayarınız dakikalarca kilitlenir. Oysa her hesaplanan değeri küçük bir tabloya yazsaydık sadece 50 işlem yeterli olurdu!',
          },
          en: {
            title: '1. Intuition: Memoryless Recursion Explodes',
            content: 'A naive recursive Fibonacci implementation recalculates $F(3)$ twice and $F(2)$ three times when evaluating $F(5)$. For $F(50)$, it performs $2^{50} \\approx 10^{15}$ operations, freezing your computer. Storing results in an array solves it in just 50 steps.',
          },
        },
      },
      {
        stepOrder: 2,
        stepType: 'DEFINITION',
        translations: {
          tr: {
            title: '2. İki Zorunlu Matematiksel Koşul',
            content: 'Bir probleme Dinamik Programlama uygulanabilmesi için iki temel nitelik şarttır:\n\n1. **Optimal Alt Yapı (Optimal Substructure):** Büyük problemin optimal çözümü, alt problemlerin optimal çözümlerinden inşa edilebilmelidir.\n2. **Örtüşen Alt Problemler (Overlapping Subproblems):** Problemi böldüğünüzde aynı küçük alt problemler tekrar tekrar ortaya çıkmalıdır.',
          },
          en: {
            title: '2. The Two Essential Mathematical Properties',
            content: 'Dynamic Programming applies if and only if two properties hold:\n\n1. **Optimal Substructure:** An optimal solution to the problem contains optimal solutions to subproblems.\n2. **Overlapping Subproblems:** The space of subproblems is small, and a recursive algorithm revisits the same subproblems repeatedly.',
          },
        },
      },
      {
        stepOrder: 3,
        stepType: 'MENTAL_MODEL',
        translations: {
          tr: {
            title: '3. Zihinsel Model: Yönlü Döngüsüz Çizge (DAG)',
            content: 'Her alt problemi bir düğüm (node), her geçişi ise bir yönlü kenar (directed edge) olarak hayal edin. Dinamik programlama, bu Yönlü Döngüsüz Çizge (DAG) üzerinde en kısa veya en uzun yolu topolojik sırayla hesaplamaktır.',
          },
          en: {
            title: '3. Mental Model: Directed Acyclic Graph (DAG)',
            content: 'Think of subproblems as nodes in a Directed Acyclic Graph (DAG). Transitions are directed edges. Dynamic programming is fundamentally finding the shortest or longest path in this DAG in topological order.',
          },
        },
      },
      {
        stepOrder: 4,
        stepType: 'NOTATION',
        translations: {
          tr: {
            title: '4. Durum (State) ve Geçiş (Transition)',
            content: '- **Durum (State):** Alt problemi benzersiz şekilde niteleyen parametreler kümesi (örneğin $dp[i]$ veya $dp[i][w]$).\n- **Taban Durumu (Base Case):** Özyinelemenin durduğu en küçük bilinen değerler (örneğin $dp[0] = 0, dp[1] = 1$).\n- **Geçiş Denklemi (Bellman Equation):** $dp[i]$ değerinin kendinden önceki durumlardan nasıl hesaplandığını veren kural.',
          },
          en: {
            title: '4. State & Transition Equation',
            content: '- **State:** The minimal parameters defining a subproblem (e.g. $dp[i]$ or $dp[i][w]$).\n- **Base Case:** Trivial starting values where recursion terminates (e.g. $dp[0] = 0$).\n- **Transition Equation (Bellman):** The mathematical recurrence computing state $i$ from smaller states.',
          },
        },
      },
      {
        stepOrder: 5,
        stepType: 'SIMPLE_EXAMPLE',
        translations: {
          tr: {
            title: '5. Temel Örnek: Merdiven Tırmanma',
            content: '$n$ basamaklı bir merdiveni her adımda 1 veya 2 basamak atlayarak kaç farklı şekilde tırmanabilirsiniz?\n- $n$. basamağa ya $(n-1)$. basamaktan (1 adım atarak) ya da $(n-2)$. basamaktan (2 adım atarak) gelebilirsiniz.\n- Geçiş: $dp[n] = dp[n-1] + dp[n-2]$.\n- Taban: $dp[1] = 1$, $dp[2] = 2$.\n- $n=4$ için: $dp[3] = 1 + 2 = 3$. $dp[4] = 2 + 3 = 5$ farklı yol vardır.',
          },
          en: {
            title: '5. Baseline Example: Climbing Stairs',
            content: 'How many ways to climb an $n$-step staircase taking 1 or 2 steps at a time?\n- To reach step $n$, you must come from either step $n-1$ or step $n-2$.\n- Transition: $dp[n] = dp[n-1] + dp[n-2]$.\n- Base cases: $dp[1] = 1, dp[2] = 2$.\n- For $n=4$: $dp[3] = 3, dp[4] = 5$ distinct ways.',
          },
        },
      },
      {
        stepOrder: 6,
        stepType: 'WORKED_EXAMPLE',
        translations: {
          tr: {
            title: '6. Adım Adım Çözümlü Örnek: 0/1 Sırt Çantası (Knapsack)',
            content: 'Kapasitesi $W=4$ olan bir çanta ve 3 eşya olsun:\n1. Eşya: ağırlık $w_1 = 2$, değer $v_1 = 3$\n2. Eşya: ağırlık $w_2 = 1$, değer $v_2 = 2$\n3. Eşya: ağırlık $w_3 = 3$, değer $v_3 = 4$\n\nGeçiş Denklemi:\n$$dp[i][w] = \\max(dp[i-1][w], \\ dp[i-1][w - w_i] + v_i)$$\nTabloyu dolduralım:\n- Sadece 1. eşya: $w=2, 3, 4$ için değer 3.\n- 1 ve 2. eşya: $w=1 \\implies 2$; $w=2 \\implies 3$; $w=3 \\implies 2+3=5$; $w=4 \\implies 5$.\n- 3. eşya eklendiğinde: $w=4$ için $\\max(5, dp[2][1] + 4 = 2 + 4 = 6)$.\nEn yüksek değer: **6** (1. ve 3. eşyalar değil, 2. ve 3. eşyalar: ağırlık $1+3=4$, değer $2+4=6$).',
          },
          en: {
            title: '6. Step-by-Step Worked Example: 0/1 Knapsack',
            content: 'Capacity $W=4$. Items:\nItem 1: $w_1 = 2, v_1 = 3$\nItem 2: $w_2 = 1, v_2 = 2$\nItem 3: $w_3 = 3, v_3 = 4$\n\nBellman Recurrence:\n$$dp[i][w] = \\max(dp[i-1][w], \\ dp[i-1][w - w_i] + v_i)$$\nEvaluating state $dp[3][4]$:\nOption A (leave item 3): $dp[2][4] = 5$.\nOption B (take item 3): $dp[2][4 - 3] + v_3 = dp[2][1] + 4 = 2 + 4 = 6$.\nMax value: $\\max(5, 6) = \\mathbf{6}$.',
          },
        },
      },
      {
        stepOrder: 7,
        stepType: 'MINI_CHECK',
        miniCheckAnswer: 'Ortusen alt problemlerin bulunmasi ve sonucun saklanmasi',
        miniCheckOptions: [
          'Ortusen alt problemlerin bulunmasi ve sonucun saklanmasi',
          'Sadece siralama algoritmalarinda kullanilmasi',
          'Rastgele sayi uretecine dayanmasi',
          'Hafiza kullanmadan sadece donguyle calismasi',
        ],
        translations: {
          tr: {
            title: '7. Mini Kavrama Testi: Böl ve Yönet vs Dinamik Programlama',
            content: 'Merge Sort (Böl ve Yönet) ile Knapsack (Dinamik Programlama) arasındaki temel yapısal fark nedir?',
            miniCheckQuestion: 'Dinamik programlamayı Böl ve Yönet yaklaşımından ayıran kritik özellik nedir?',
          },
          en: {
            title: '7. Mini Knowledge Check: Divide & Conquer vs DP',
            content: 'Consider the conceptual distinction between Merge Sort and the Knapsack algorithm.',
            miniCheckQuestion: 'What fundamental property distinguishes Dynamic Programming from standard Divide & Conquer?',
          },
        },
      },
      {
        stepOrder: 8,
        stepType: 'GUIDED_PRACTICE',
        translations: {
          tr: {
            title: '8. Rehberli Problem: Para Üstü Problemi (Coin Change)',
            content: '**Problem:** Madeni paralar $\\{1, 3, 4\\}$ olsun. $S = 6$ değerini elde etmek için gereken en az madeni para sayısı nedir?\n- $dp[0] = 0$.\n- $dp[1] = dp[0] + 1 = 1$ (1\'lik).\n- $dp[2] = dp[1] + 1 = 2$ (iki adet 1\'lik).\n- $dp[3] = \\min(dp[2]+1, dp[0]+1) = \\min(3, 1) = 1$ (bir adet 3\'lük).\n- $dp[4] = \\min(dp[3]+1, dp[1]+1, dp[0]+1) = 1$ (bir adet 4\'lük).\n- $dp[5] = \\min(dp[4]+1, dp[2]+1, dp[1]+1) = \\min(2, 3, 2) = 2$.\n- $dp[6] = \\min(dp[5]+1, dp[3]+1, dp[2]+1) = \\min(3, 1+1=2, 2+1=3) = 2$ (iki adet 3\'lük).\nSonuç: **2**. Açgözlü (greedy) yaklaşım 4+1+1=3 vererek yanılırdı, DP ise optimal 3+3=6 cevabını buldu!',
          },
          en: {
            title: '8. Guided Practice: Coin Change Min Coins',
            content: '**Problem:** Coins $\\{1, 3, 4\\}$. Find minimal coins to make amount $S = 6$.\n- Recurrence: $dp[v] = 1 + \\min_{c \\in \\{1, 3, 4\\}} dp[v - c]$.\n- $dp[3] = 1$ (one 3-coin).\n- $dp[4] = 1$ (one 4-coin).\n- $dp[6] = \\min(dp[5]+1, dp[3]+1, dp[2]+1) = \\min(3, 1+1, 3) = \\mathbf{2}$ (two 3-coins).\nNotice that greedy chooses $4 + 1 + 1$ (3 coins), which is suboptimal! DP discovers the global optimum $3 + 3$. You are now ready for competitive practice!',
          },
        },
      },
    ],
  },

  // =========================================================================
  // 6. MATRIX MULTIPLICATION (Linear Algebra Prerequisite)
  // =========================================================================
  {
    id: 'matrix-multiplication',
    category: 'MATHEMATICS',
    subcategory: 'LinearAlgebra',
    formalStatement: 'C_{ij} = \\sum_{k=1}^m A_{ik} B_{kj}',
    assumptions: 'A \\in \\mathbb{R}^{n \\times m}, B \\in \\mathbb{R}^{m \\times p} \\implies C \\in \\mathbb{R}^{n \\times p}',
    notation: 'C = AB, \\quad (AB)_{ij} = A_{i,:} \\cdot B_{:,j}',
    canonicalFormula: '(AB)_{ij} = \\sum_{k=1}^m A_{ik} B_{kj}',
    proofDerivation: 'Matrix multiplication corresponds to the composition of linear maps. Let T: R^p -> R^m with matrix B, and S: R^m -> R^n with matrix A. The composite transformation (S o T)(e_j) = S(T(e_j)) = S(sum_k B_kj e_k) = sum_k B_kj S(e_k) = sum_k B_kj (sum_i A_ik e_i) = sum_i (sum_k A_ik B_kj) e_i.',
    verificationLevel: 3,
    verificationStatus: 'SOURCE_BACKED',
    sourceTitle: 'Linear Algebra and Its Applications',
    sourceAuthor: 'Gilbert Strang (Cengage Learning)',
    sourceCitation: 'Chapter 1: Matrices and Gaussian Elimination, Section 1.4: Matrix Multiplication',
    prerequisites: [],
    translations: {
      tr: {
        name: 'Matris Çarpımı',
        dualTerminology: 'Matris Çarpımı (Matrix Multiplication)',
        definition: '$n \\times m$ boyutlu bir $A$ matrisi ile $m \\times p$ boyutlu bir $B$ matrisinin çarpımı, satır-sütun iç çarpımlarıyla oluşturulan $n \\times p$ boyutlu bir $C = AB$ matrisidir.',
        intuition: 'Matris çarpımı sayılar gibi eleman eleman çarpım değildir; iki lineer dönüşümün art arda uygulanmasıdır (fonksiyon bileşkesi: $(S \\circ T)(x)$).',
        commonPitfalls: 'Matris çarpımı genel olarak değişmeli (commutative) DEĞİLDİR: $AB \\neq BA$. Ayrıca boyut uyumu şarttır (ilk matrisin sütun sayısı ikincinin satır sayısına eşit olmalıdır).',
      },
      en: {
        name: 'Matrix Multiplication',
        dualTerminology: 'Matrix Multiplication',
        definition: 'For matrices $A \\in \\mathbb{R}^{n \\times m}$ and $B \\in \\mathbb{R}^{m \\times p}$, their product $C = AB$ has entries $C_{ij} = \\sum_{k=1}^m A_{ik} B_{kj}$.',
        intuition: 'Matrix multiplication represents the composition of two sequential linear transformations. Applying transformation B followed by A equals multiplying by AB.',
        commonPitfalls: 'Matrix multiplication is NOT commutative: $AB \\neq BA$ in general. Dimensions must align: columns of A must equal rows of B.',
      },
    },
    lessonSteps: [
      {
        stepOrder: 1,
        stepType: 'INTUITION',
        translations: {
          tr: {
            title: '1. Sezgi: Dönüşüm Bileşkesi',
            content: 'Bir uzayı önce $B$ matrisi ile esnetip ardından $A$ matrisi ile döndürdüğünüzü hayal edin. Bu iki işlemi tek bir adımda yapmak $AB$ matris çarpımıyla ifade edilir.',
          },
          en: {
            title: '1. Intuition: Transformation Composition',
            content: 'Imagine transforming space by matrix B, followed by matrix A. Combining both sequential transformations into a single operation is represented by the matrix product AB.',
          },
        },
      },
      {
        stepOrder: 2,
        stepType: 'DEFINITION',
        translations: {
          tr: {
            title: '2. Satır-Sütun Kuralı',
            content: 'Sonuç matrisinin $i$. satır $j$. sütunundaki eleman, $A$\'nın $i$. satırı ile $B$\'nin $j$. sütununun iç çarpımıdır:\n$$C_{ij} = A_{i1}B_{1j} + A_{i2}B_{2j} + \\dots + A_{im}B_{mj}$$',
          },
          en: {
            title: '2. Row-Column Dot Product Rule',
            content: 'Entry $(i, j)$ of product $C$ is the dot product of row $i$ of matrix $A$ and column $j$ of matrix $B$:\n$$C_{ij} = \\sum_{k=1}^m A_{ik}B_{kj}$$',
          },
        },
      },
      {
        stepOrder: 3,
        stepType: 'MINI_CHECK',
        miniCheckAnswer: '2x4',
        miniCheckOptions: ['2x4', '3x3', '2x3', 'Tanımsız'],
        translations: {
          tr: {
            title: '3. Mini Kavrama Testi: Boyut Uyumu',
            content: 'Boyut uyumunu kontrol ediniz.',
            miniCheckQuestion: '$2 \\times 3$ boyutundaki $A$ matrisi ile $3 \\times 4$ boyutundaki $B$ matrisinin çarpımının boyutu nedir?',
          },
          en: {
            title: '3. Mini Knowledge Check: Dimension Compatibility',
            content: 'Check dimension compatibility.',
            miniCheckQuestion: 'What is the dimension of product $AB$ if $A$ is $2 \\times 3$ and $B$ is $3 \\times 4$?',
          },
        },
      },
    ],
  },
];
