import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- SEEDING ACADEMIC LESSON STEPS & VERIFIED PROBLEMS ---');

  // Helper to create lesson steps
  async function createLessonSteps(conceptId: string, steps: Array<{
    order: number;
    type: string;
    answer?: string;
    options?: string[];
    tr: { title: string; content: string; miniCheckQuestion?: string };
    en: { title: string; content: string; miniCheckQuestion?: string };
  }>) {
    for (const s of steps) {
      const step = await prisma.lessonStep.create({
        data: {
          conceptId,
          stepOrder: s.order,
          stepType: s.type,
          miniCheckAnswer: s.answer,
          miniCheckOptions: s.options ? JSON.stringify(s.options) : null,
          translations: {
            create: [
              {
                language: 'tr',
                title: s.tr.title,
                content: s.tr.content,
                miniCheckQuestion: s.tr.miniCheckQuestion
              },
              {
                language: 'en',
                title: s.en.title,
                content: s.en.content,
                miniCheckQuestion: s.en.miniCheckQuestion
              }
            ]
          }
        }
      });
    }
  }

  // Helper to create verified problem
  async function createVerifiedProblem(data: {
    slug: string;
    category: string;
    subcategory: string;
    difficulty: string;
    rating: number;
    questionType: string;
    estimatedTime: number;
    correctAnswer: string;
    problemOrigin: string;
    sourceProblemId?: string;
    verificationLevel: number;
    verificationSource: string;
    conceptId: string;
    tr: { title: string; prompt: string; solution: string; options?: string[] };
    en: { title: string; prompt: string; solution: string; options?: string[] };
    hints: Array<{ order: number; trTitle: string; trContent: string; enTitle: string; enContent: string }>;
  }) {
    const existing = await prisma.problem.findUnique({ where: { slug: data.slug } });
    if (existing) {
      await prisma.problem.delete({ where: { slug: data.slug } });
    }

    await prisma.problem.create({
      data: {
        slug: data.slug,
        category: data.category,
        subcategory: data.subcategory,
        difficulty: data.difficulty,
        rating: data.rating,
        questionType: data.questionType,
        estimatedTime: data.estimatedTime,
        correctAnswer: data.correctAnswer,
        problemOrigin: data.problemOrigin,
        sourceProblemId: data.sourceProblemId,
        verificationLevel: data.verificationLevel,
        verificationSource: data.verificationSource,
        translations: {
          create: [
            {
              language: 'tr',
              title: data.tr.title,
              prompt: data.tr.prompt,
              options: data.tr.options ? JSON.stringify(data.tr.options) : null,
              solution: data.tr.solution
            },
            {
              language: 'en',
              title: data.en.title,
              prompt: data.en.prompt,
              options: data.en.options ? JSON.stringify(data.en.options) : null,
              solution: data.en.solution
            }
          ]
        },
        hints: {
          create: data.hints.map(h => ({
            order: h.order,
            translations: {
              create: [
                { language: 'tr', title: h.trTitle, content: h.trContent },
                { language: 'en', title: h.enTitle, content: h.enContent }
              ]
            }
          }))
        },
        concepts: {
          create: [{ conceptId: data.conceptId }]
        }
      }
    });
  }

  // Clear existing steps for our test concepts
  const testConceptIds = [
    'directional-derivative',
    'bernoulli-differential-equation',
    'euler-graph',
    'cache-mapping',
    'euclidean-algorithm-python',
    'numerical-integration-matlab',
    'event-driven-csharp'
  ];

  await prisma.lessonStep.deleteMany({
    where: { conceptId: { in: testConceptIds } }
  });

  // 1. LESSON STEPS: Yöne Göre Türev
  await createLessonSteps('directional-derivative', [
    {
      order: 1,
      type: 'INTUITION',
      tr: {
        title: 'Yönlü Türevin Sezgisi',
        content: 'Tek değişkenli fonksiyonlarda türev yalnızca sağa ve sola değişimi ölçer. Ancak iki veya daha fazla değişkende, bir tepe üzerinde herhangi bir pusula yönünde yürüyebilirsiniz. Yöne göre türev, seçtiğiniz bir $\\vec{u}$ birim vektörü yönünde attığınız adımda yüksekliğin anlık değişim hızıdır.'
      },
      en: {
        title: 'Intuition for Directional Derivatives',
        content: 'In single-variable calculus, derivative only measures change left and right. In multiple dimensions, you can walk in any compass direction. The directional derivative measures the instantaneous rate of change in the direction of a specified unit vector.'
      }
    },
    {
      order: 2,
      type: 'DEFINITION',
      tr: {
        title: 'Formal Tanım ve Formül',
        content: '$f: \\mathbb{R}^2 \\to \\mathbb{R}$ diferansiyellenebilir bir fonksiyon ve $\\vec{u}=(u_1, u_2)$ birim vektör ($||\\vec{u}||=1$) olsun. $f$\'in $\\vec{u}$ yönündeki yönlü türevi:\n\n$$D_{\\vec{u}}f(x_0, y_0) = \\nabla f(x_0, y_0) \\cdot \\vec{u} = \\frac{\\partial f}{\\partial x}u_1 + \\frac{\\partial f}{\\partial y}u_2$$\n\nBurada $\\nabla f = \\left(\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}\\right)$ gradyan vektörüdür.'
      },
      en: {
        title: 'Formal Definition and Formula',
        content: 'Let $f$ be differentiable and $\\vec{u}$ a unit vector. The directional derivative is $D_{\\vec{u}}f = \\nabla f \\cdot \\vec{u}$.'
      }
    },
    {
      order: 3,
      type: 'WORKED_EXAMPLE',
      tr: {
        title: 'Adım Adım Örnek (ESOGÜ Analiz III)',
        content: '**Problem:** $f(x,y) = x^2 y$ fonksiyonunun $P(1, 2)$ noktasında $\\vec{v}=(3, 4)$ yönündeki yönlü türevini bulunuz.\n\n**Adım 1:** Gradyanı hesaplayalım:\n$$\\nabla f = (2xy, x^2) \\implies \\nabla f(1, 2) = (2(1)(2), 1^2) = (4, 1)$$\n\n**Adım 2:** $\\vec{v}$ vektörünü birim vektör yapalım:\n$$||\\vec{v}|| = \\sqrt{3^2 + 4^2} = 5 \\implies \\vec{u} = \\left(\\frac{3}{5}, \\frac{4}{5}\\right)$$\n\n**Adım 3:** İç çarpım alalım:\n$$D_{\\vec{u}}f(1,2) = 4 \\cdot \\frac{3}{5} + 1 \\cdot \\frac{4}{5} = \\frac{12 + 4}{5} = \\frac{16}{5} = 3.2$$'
      },
      en: {
        title: 'Worked Example',
        content: 'Calculates directional derivative by first computing gradient, normalizing vector, and evaluating dot product.'
      }
    },
    {
      order: 4,
      type: 'MINI_CHECK',
      answer: 'C',
      options: ['A) Gradyan vektörünün tersi yönünde', 'B) Herhangi bir rastgele yönde', 'C) Gradyan vektörü ile aynı yönde (\\nabla f)', 'D) Gradyana dik yönde'],
      tr: {
        title: 'Kavram Kontrolü',
        content: 'Yönlü türevin maksimum değerine ulaştığı yön hangisidir?',
        miniCheckQuestion: 'Yönlü türevin maksimum değerine ulaştığı yön hangisidir?'
      },
      en: {
        title: 'Knowledge Check',
        content: 'In which direction does the directional derivative achieve its maximum value?',
        miniCheckQuestion: 'In which direction does the directional derivative achieve its maximum value?'
      }
    }
  ]);

  // 2. LESSON STEPS: Bernoulli Diferansiyel Denklemleri
  await createLessonSteps('bernoulli-differential-equation', [
    {
      order: 1,
      type: 'INTUITION',
      tr: {
        title: 'Bernoulli Sezgisi',
        content: '$y\' + P(x)y = Q(x)$ denklemi birinci mertebeden lineerdir ve integrasyon çarpanıyla kolayca çözülür. Ancak sağ tarafa bir $y^n$ ($n \\neq 0, 1$) çarpanı geldiğinde denklem lineerliğini kaybeder. Bernoulli\'nin parlak fikri, $v = y^{1-n}$ dönüşümü yaparak denklemi tam olarak birinci mertebe lineer bir denkleme indirgemektir.'
      },
      en: {
        title: 'Bernoulli Intuition',
        content: 'Transforming a nonlinear ODE into a linear ODE via substitution v = y^(1-n).'
      }
    },
    {
      order: 2,
      type: 'DEFINITION',
      tr: {
        title: 'Standart Form ve Doğrusal Hale Getirme',
        content: 'Bernoulli denklemi:\n$$y\' + P(x)y = Q(x)y^n$$\n\nHer iki taraf $y^n$\'e bölündüğünde:\n$$y^{-n}y\' + P(x)y^{1-n} = Q(x)$$\n\n$v = y^{1-n}$ seçilirse $v\' = (1-n)y^{-n}y\'$ olur. Böylece denklem:\n$$\\frac{1}{1-n}v\' + P(x)v = Q(x) \\implies v\' + (1-n)P(x)v = (1-n)Q(x)$$\nlineer formuna dönüşür.'
      },
      en: {
        title: 'Formal Transformation',
        content: 'Dividing by y^n and substituting v = y^(1-n) leads to a first-order linear differential equation in v.'
      }
    },
    {
      order: 3,
      type: 'WORKED_EXAMPLE',
      tr: {
        title: '06.01.2025 ESOGÜ Final Soru Çözümü',
        content: '**Soru (ESOGÜ 2025 Final):** $y\' + \\frac{1}{x}y = x y^2$ denklemini çözünüz.\n\n1. $n=2$, dolayısıyla $v = y^{1-2} = y^{-1} = 1/y$.\n2. $v\' = -y^{-2}y\' \\implies y^{-2}y\' = -v\'$.\n3. Denklemi $y^2$\'ye bölelim: $y^{-2}y\' + \\frac{1}{x}y^{-1} = x \\implies -v\' + \\frac{1}{x}v = x$.\n4. Standart form: $v\' - \\frac{1}{x}v = -x$.\n5. İntegrasyon çarpanı: $\\mu(x) = e^{\\int -1/x dx} = 1/x$.\n6. $\\frac{d}{dx}\\left(\\frac{v}{x}\\right) = -1 \\implies \\frac{v}{x} = -x + C \\implies v = Cx - x^2$.\n7. $y = 1/v = \\frac{1}{Cx - x^2}$.'
      },
      en: {
        title: 'Worked Exam Solution',
        content: 'Step by step reduction of y\' + (1/x)y = x y^2 using v = y^-1 to obtain y = 1/(Cx - x^2).'
      }
    },
    {
      order: 4,
      type: 'MINI_CHECK',
      answer: 'B',
      options: ['A) v = y^3', 'B) v = y^{-2}', 'C) v = y^2', 'D) v = ln(y)'],
      tr: {
        title: 'Kavram Kontrolü',
        content: '$y\' + 2xy = x y^3$ Bernoulli denklemini lineerleştirmek için hangi değişken değiştirme yapılmalıdır?',
        miniCheckQuestion: '$y\' + 2xy = x y^3$ Bernoulli denklemini lineerleştirmek için hangi değişken değiştirme yapılmalıdır?'
      },
      en: {
        title: 'Knowledge Check',
        content: 'Which substitution linearizes y\' + 2xy = x y^3?',
        miniCheckQuestion: 'Which substitution linearizes y\' + 2xy = x y^3?'
      }
    }
  ]);

  // 3. LESSON STEPS: Euler Çizgeleri
  await createLessonSteps('euler-graph', [
    {
      order: 1,
      type: 'INTUITION',
      tr: {
        title: 'Euler Çizgesi Sezgisi (Königsberg Köprüleri)',
        content: 'Bir şekli kaleminizi kağıttan kaldırmadan ve aynı çizginin üzerinden iki kez geçmeden tek hamlede çizip başladığınız noktaya dönebilir misiniz? Bu soru, modern topoloji ve çizge teorisinin kurucusu Leonhard Euler\'in 1736\'da çözdüğü Königsberg Köprü Problemine dayanır.'
      },
      en: {
        title: 'Eulerian Intuition',
        content: 'Traversing every edge exactly once and returning to the starting vertex without lifting your pencil.'
      }
    },
    {
      order: 2,
      type: 'DEFINITION',
      tr: {
        title: 'Euler Karakterizasyon Teoremi',
        content: '**Teorem (Prof. Dr. İbrahim Günaltılı, Teorem 2.1):**\nBağlantılı bir $G$ çizgesinin bir Euler devresine (kapalı Euler turuna) sahip olması için gerek ve yeter koşul, **$G$\'nin her köşesinin derecesinin çift sayı olmasıdır**.\n\n$$\\forall v \\in V(G), \\quad \\deg(v) \\equiv 0 \\pmod 2$$'
      },
      en: {
        title: 'Euler Characterization Theorem',
        content: 'A connected graph has an Eulerian circuit if and only if every vertex has an even degree.'
      }
    },
    {
      order: 3,
      type: 'WORKED_EXAMPLE',
      tr: {
        title: 'Handshaking Lemma ile Kenar Sayımı',
        content: '**Örnek:** Köşe dereceleri sırasıyla $(4, 4, 4, 2, 2)$ olan bağlantılı bir $G$ çizgesi verilsin.\n\n1. Tüm dereceler $\\{4, 4, 4, 2, 2\\}$ çift sayıdır. Dolayısıyla $G$ bir **Euler Çizgesidir**.\n2. Handshaking Lemma (Tokalaşma Lemması):\n$$\\sum_{v \\in V} \\deg(v) = 2|E| \\implies 4 + 4 + 4 + 2 + 2 = 16 = 2|E| \\implies |E| = 8$$\nÇizge 8 kenara sahiptir.'
      },
      en: {
        title: 'Worked Example',
        content: 'Applies the Handshaking Lemma to calculate edges and verifies all degrees are even.'
      }
    },
    {
      order: 4,
      type: 'MINI_CHECK',
      answer: 'D',
      options: ['A) 0', 'B) 1', 'C) 3', 'D) 0 veya 2'],
      tr: {
        title: 'Kavram Kontrolü',
        content: 'Bir çizgede tek dereceli köşe sayısı aşağıdakilerden hangisi olabilir?',
        miniCheckQuestion: 'Bir çizgede tek dereceli köşe sayısı aşağıdakilerden hangisi olabilir?'
      },
      en: {
        title: 'Knowledge Check',
        content: 'What can be the number of odd-degree vertices in an Eulerian trail?',
        miniCheckQuestion: 'What can be the number of odd-degree vertices in an Eulerian trail?'
      }
    }
  ]);

  // 4. LESSON STEPS: Cache Bellek Eşleme
  await createLessonSteps('cache-mapping', [
    {
      order: 1,
      type: 'INTUITION',
      tr: {
        title: 'Önbellek Eşleme Sezgisi',
        content: 'Ana bellek (RAM) gigabaytlarca büyük ancak yavaştır. İşlemci içerisindeki önbellek (Cache) ise nanosaniyeler hızında ancak kilobaytlar mertebesinde küçüktür. Bir adresteki veriyi önbelleğe alırken "Hangi blok önbelleğin neresine yerleşecek?" kuralını donanım belirler.'
      },
      en: {
        title: 'Cache Mapping Intuition',
        content: 'Determining where memory blocks reside inside high-speed cache lines.'
      }
    },
    {
      order: 2,
      type: 'DEFINITION',
      tr: {
        title: 'Bit Dağılımı ve Formüller',
        content: '32-bit bayt adresli bir mimaride adres 3 alana bölünür:\n\n1. **Offset:** Blok içindeki baytı seçer $\\implies \\text{Offset} = \\log_2(\\text{Blok Boyutu})$\n2. **Index:** Önbellekteki kümeyi (Set) seçer $\\implies \\text{Index} = \\log_2(\\text{Küme Sayısı})$\n3. **Tag:** Bloğun kimliğini doğrular $\\implies \\text{Tag} = 32 - (\\text{Index} + \\text{Offset})$'
      },
      en: {
        title: 'Formulas for Tag, Index, Offset',
        content: 'Offset = log2(BlockSize), Index = log2(NumSets), Tag = AddressBits - Index - Offset.'
      }
    },
    {
      order: 3,
      type: 'WORKED_EXAMPLE',
      tr: {
        title: 'ESOGÜ 2021 Final Sınav Çözümü',
        content: '**Soru (Doç. Dr. Özer Çelik, 2021 Final):** 32-bit adres, 64 KB 4-way set associative cache, blok boyutu 64 Bayt.\n\n1. $\\text{Offset} = \\log_2(64) = 6$ bit.\n2. Toplam blok sayısı = $64 \\text{ KB} / 64 \\text{ B} = 1024$ blok.\n3. 4-yollu olduğundan küme sayısı = $1024 / 4 = 256$ küme.\n4. $\\text{Index} = \\log_2(256) = 8$ bit.\n5. $\\text{Tag} = 32 - (8 + 6) = 32 - 14 = 18$ bit.'
      },
      en: {
        title: 'Worked Example',
        content: 'Calculates Offset = 6 bits, Index = 8 bits, Tag = 18 bits for 64KB 4-way cache.'
      }
    },
    {
      order: 4,
      type: 'MINI_CHECK',
      answer: 'B',
      options: ['A) 4 bit', 'B) 5 bit', 'C) 6 bit', 'D) 8 bit'],
      tr: {
        title: 'Kavram Kontrolü',
        content: 'Blok boyutu 32 bayt olan bir önbellek için Offset bit sayısı kaçtır?',
        miniCheckQuestion: 'Blok boyutu 32 bayt olan bir önbellek için Offset bit sayısı kaçtır?'
      },
      en: {
        title: 'Knowledge Check',
        content: 'What is the number of offset bits for a 32-byte block size?',
        miniCheckQuestion: 'What is the number of offset bits for a 32-byte block size?'
      }
    }
  ]);

  // 5. LESSON STEPS: Python Sayılar Teorisi (Öklid Algoritması)
  await createLessonSteps('euclidean-algorithm-python', [
    {
      order: 1,
      type: 'INTUITION',
      tr: {
        title: 'Öklid Algoritması Sezgisi',
        content: 'İki sayının ortak böleni, bu sayıların farkını ve kalanını da böler. Sayıları asal çarpanlarına ayırmak büyük sayılarda çok zorken, ardışık bölmelerle kalanı sıfırlamak saniyeler sürer.'
      },
      en: {
        title: 'Euclidean Intuition',
        content: 'GCD of two numbers divides their difference and remainder.'
      }
    },
    {
      order: 2,
      type: 'DEFINITION',
      tr: {
        title: 'Matematiksel Teorem ve Python Kodu',
        content: '$\\gcd(a, b) = \\gcd(b, a \\pmod b)$ ($b > 0$) ve $\\gcd(a, 0) = |a|$.\n\n```python\ndef gcd(a, b):\n    while b != 0:\n        a, b = b, a % b\n    return abs(a)\n```'
      },
      en: {
        title: 'Formal Definition and Python Implementation',
        content: 'gcd(a, b) = gcd(b, a % b).'
      }
    },
    {
      order: 3,
      type: 'WORKED_EXAMPLE',
      tr: {
        title: 'Adım Adım Çalıştırma (48 ve 18)',
        content: '1. `a=48, b=18` $\\implies 48 = 2 \\times 18 + 12 \\implies$ yeni çift: `(18, 12)`\n2. `a=18, b=12` $\\implies 18 = 1 \\times 12 + 6 \\implies$ yeni çift: `(12, 6)`\n3. `a=12, b=6` $\\implies 12 = 2 \\times 6 + 0 \\implies$ kalan 0, sonuç **6**.'
      },
      en: {
        title: 'Worked Example',
        content: 'Demonstrates steps 48 % 18 = 12, 18 % 12 = 6, 12 % 6 = 0, returning 6.'
      }
    },
    {
      order: 4,
      type: 'MINI_CHECK',
      answer: 'C',
      options: ['A) 1', 'B) 4', 'C) 8', 'D) 16'],
      tr: {
        title: 'Kavram Kontrolü',
        content: 'gcd(56, 24) çağrıldığında sonuç kaçtır?',
        miniCheckQuestion: 'gcd(56, 24) çağrıldığında sonuç kaçtır?'
      },
      en: {
        title: 'Knowledge Check',
        content: 'What is gcd(56, 24)?',
        miniCheckQuestion: 'What is gcd(56, 24)?'
      }
    }
  ]);

  // 6. LESSON STEPS: MATLAB Sayısal İntegrasyon
  await createLessonSteps('numerical-integration-matlab', [
    {
      order: 1,
      type: 'INTUITION',
      tr: {
        title: 'Sayısal İntegrasyon Sezgisi',
        content: 'Mühendislik ve veri analizinde çoğu zaman fonksiyonun formülü bilinmez, sadece belirli x noktalarındaki y ölçümleri bilinir. MATLAB trapz fonksiyonu, bu noktaları yamuklarla birleştirerek eğri altındaki alanı hesaplar.'
      },
      en: {
        title: 'Numerical Integration Intuition',
        content: 'Approximating area under discrete data points using trapezoids.'
      }
    },
    {
      order: 2,
      type: 'DEFINITION',
      tr: {
        title: 'Yamuk Formülü ve MATLAB trapz',
        content: 'Eşit aralıklı $h = x_{i+1} - x_i$ adımları için:\n$$\\int_a^b f(x)dx \\approx \\frac{h}{2} \\left( y_0 + 2\\sum_{i=1}^{n-1} y_i + y_n \\right)$$\n\nMATLAB Kullanımı:\n```matlab\nx = [0, 2, 4];\ny = [1, 3, 5];\nAlan = trapz(x, y); % 12 sonucunu verir\n```'
      },
      en: {
        title: 'Trapezoidal Rule Definition',
        content: 'Calculates area via trapz(x, y).'
      }
    },
    {
      order: 3,
      type: 'WORKED_EXAMPLE',
      tr: {
        title: 'Ayrık Veri Üzerinde Örnek Hesaplama',
        content: '`x = [0, 2, 4]`, `y = [1, 3, 5]`\n1. [0, 2] aralığı: $h=2$, Alan = $2 \\times (1 + 3) / 2 = 4$\n2. [2, 4] aralığı: $h=2$, Alan = $2 \\times (3 + 5) / 2 = 8$\nToplam Alan = $4 + 8 = 12$.'
      },
      en: {
        title: 'Worked Example',
        content: 'Calculates trapezoidal sum 4 + 8 = 12.'
      }
    },
    {
      order: 4,
      type: 'MINI_CHECK',
      answer: 'A',
      options: ['A) trapz(x, y)', 'B) sum(y)', 'C) diff(y)', 'D) polyfit(x, y)'],
      tr: {
        title: 'Kavram Kontrolü',
        content: 'Eşit aralıklı olmayan x ve y vektörlerinde doğru integrali hangi komut hesaplar?',
        miniCheckQuestion: 'Eşit aralıklı olmayan x ve y vektörlerinde doğru integrali hangi komut hesaplar?'
      },
      en: {
        title: 'Knowledge Check',
        content: 'Which command computes trapezoidal integration over vectors x and y?',
        miniCheckQuestion: 'Which command computes trapezoidal integration over vectors x and y?'
      }
    }
  ]);

  // 7. LESSON STEPS: C# Olay Güdümlü Programlama
  await createLessonSteps('event-driven-csharp', [
    {
      order: 1,
      type: 'INTUITION',
      tr: {
        title: 'Olay Güdümlü Mimari Sezgisi',
        content: 'Geleneksel konsol programları baştan sona sırayla çalışıp biter. GUI uygulamaları ise bir "Olay Döngüsü (Event Loop)" içinde bekler; kullanıcı butona tıkladığında veya klavyeden tuşa bastığında ilgili dinleyici tetiklenir.'
      },
      en: {
        title: 'Event-Driven Intuition',
        content: 'Programs respond to user interactions via event listeners.'
      }
    },
    {
      order: 2,
      type: 'DEFINITION',
      tr: {
        title: 'C# Delege ve Event Notasyonu',
        content: 'C# dilinde olay bağlama `+=` operatörü ile gerçekleştirilir:\n```csharp\n// Buton tıklama olayına metot bağlama\nthis.btnGonder.Click += new System.EventHandler(this.btnGonder_Click);\n\nprivate void btnGonder_Click(object sender, EventArgs e)\n{\n    MessageBox.Show("İşlem tamamlandı!");\n}\n```'
      },
      en: {
        title: 'C# Event Syntax',
        content: 'Subscribing to events using += operator.'
      }
    },
    {
      order: 3,
      type: 'WORKED_EXAMPLE',
      tr: {
        title: 'ESOGÜ 2022 Vize Sınav Sorusu',
        content: '**Soru (Prof. Dr. Bülent Saka, 2022 Vize):** Çalışma anında dinamik oluşturulan butonlara ortak olay dinleyici bağlama:\n```csharp\nButton btn = new Button();\nbtn.Text = "Hesapla";\nbtn.Click += OrtakClick_Handler;\nthis.Controls.Add(btn);\n```\n`+=` operatörü MulticastDelegate yapısına yeni metot referansı ekler.'
      },
      en: {
        title: 'Worked Exam Example',
        content: 'Demonstrating dynamic event handler binding with +='
      }
    },
    {
      order: 4,
      type: 'MINI_CHECK',
      answer: 'C',
      options: ['A) =', 'B) ==', 'C) +=', 'D) ->'],
      tr: {
        title: 'Kavram Kontrolü',
        content: 'C# dilinde bir evente yeni dinleyici eklemek için hangi operatör kullanılır?',
        miniCheckQuestion: 'C# dilinde bir evente yeni dinleyici eklemek için hangi operatör kullanılır?'
      },
      en: {
        title: 'Knowledge Check',
        content: 'Which operator attaches an event handler in C#?',
        miniCheckQuestion: 'Which operator attaches an event handler in C#?'
      }
    }
  ]);

  // 8. SEED VERIFIED PROBLEMS FOR THE 9 TEST CASES

  // TEST 1: Analiz -> Yöne Göre Türev
  await createVerifiedProblem({
    slug: 'prob-directional-derivative-exam-2023',
    category: 'MATHEMATICS',
    subcategory: 'Analiz III',
    difficulty: 'INTERMEDIATE',
    rating: 1450,
    questionType: 'NUMERIC',
    estimatedTime: 5,
    correctAnswer: '14.4',
    problemOrigin: 'SOURCE_EXACT',
    sourceProblemId: 'src-prob-analiz3-final-2023-q2',
    verificationLevel: 5,
    verificationSource: 'ESOGÜ 12.01.2023 Analiz III Final Sınavı Soru 2',
    conceptId: 'directional-derivative',
    tr: {
      title: 'Yönlü Türev Hesabı (ESOGÜ 2023 Final)',
      prompt: '$f(x,y) = x^2 y + 2xy^2$ fonksiyonunun $P(1, 2)$ noktasında $\\vec{v} = (3, 4)$ yönündeki yönlü türevini $D_{\\vec{u}}f(1,2)$ hesaplayınız. (Ondalık sayı olarak yazınız, örn: 14.4)',
      solution: '1. $\\nabla f = (2xy + 2y^2, x^2 + 4xy) \\implies \\nabla f(1,2) = (4 + 8, 1 + 8) = (12, 9)$.\n2. $|\\vec{v}| = \\sqrt{3^2 + 4^2} = 5 \\implies \\vec{u} = (3/5, 4/5)$.\n3. $D_{\\vec{u}}f = 12(0.6) + 9(0.8) = 7.2 + 7.2 = 14.4$.'
    },
    en: {
      title: 'Directional Derivative Evaluation (ESOGÜ 2023 Final)',
      prompt: 'Find the directional derivative of $f(x,y) = x^2 y + 2xy^2$ at $P(1, 2)$ in the direction of $\\vec{v} = (3, 4)$.',
      solution: 'Gradient at (1,2) is (12, 9). Unit vector is (0.6, 0.8). Dot product yields 14.4.'
    },
    hints: [
      { order: 1, trTitle: 'Kısmi Türevler', trContent: 'Önce x ve y\'ye göre kısmi türevleri alıp P(1,2) noktasını yerine koyun.', enTitle: 'Partial Derivatives', enContent: 'First compute the gradient vector at (1,2).' },
      { order: 2, trTitle: 'Birim Vektör', trContent: 'v = (3,4) vektörünü boyuna (5) bölerek birim vektör yapmayı unutmayın.', enTitle: 'Unit Vector', enContent: 'Normalize vector v=(3,4) by dividing by its magnitude 5.' },
      { order: 3, trTitle: 'İç Çarpım', trContent: 'D_u f = 12*(3/5) + 9*(4/5) = 72/5 = 14.4.', enTitle: 'Dot Product', enContent: 'D_u f = 12*(3/5) + 9*(4/5) = 14.4.' }
    ]
  });

  // TEST 2: Diferansiyel Denklemler -> Bernoulli
  await createVerifiedProblem({
    slug: 'prob-difdenk-bernoulli-final-2025',
    category: 'MATHEMATICS',
    subcategory: 'Diferansiyel Denklemler',
    difficulty: 'ADVANCED',
    rating: 1650,
    questionType: 'MULTIPLE_CHOICE',
    estimatedTime: 6,
    correctAnswer: 'A',
    problemOrigin: 'SOURCE_EXACT',
    sourceProblemId: 'src-prob-difdenk-final-2025-q1',
    verificationLevel: 5,
    verificationSource: 'ESOGÜ 06.01.2025 Diferansiyel Denklemler Final Soru 1',
    conceptId: 'bernoulli-differential-equation',
    tr: {
      title: 'Bernoulli Diferansiyel Denklemi (ESOGÜ 2025 Final)',
      prompt: '$y\' + \\frac{1}{x}y = x y^2$ Bernoulli diferansiyel denkleminin genel çözümü aşağıdakilerden hangisidir?',
      options: [
        'A) y(x) = 1 / (Cx - x^2)',
        'B) y(x) = Cx - x^2',
        'C) y(x) = 1 / (Cx + x^2)',
        'D) y(x) = e^x / (C - x)'
      ],
      solution: '1. $n=2 \\implies v = y^{1-2} = y^{-1}$.\n2. Lineer denklem: $v\' - \\frac{1}{x}v = -x$.\n3. Çözüm: $v(x) = Cx - x^2$.\n4. $y(x) = 1/v = \\frac{1}{Cx - x^2}$. Doğru seçenek A.'
    },
    en: {
      title: 'Bernoulli Differential Equation (ESOGÜ 2025 Final)',
      prompt: 'What is the general solution of the Bernoulli ODE y\' + (1/x)y = x y^2?',
      options: [
        'A) y(x) = 1 / (Cx - x^2)',
        'B) y(x) = Cx - x^2',
        'C) y(x) = 1 / (Cx + x^2)',
        'D) y(x) = e^x / (C - x)'
      ],
      solution: 'Using substitution v = y^-1 leads to v = Cx - x^2, so y = 1/(Cx - x^2).'
    },
    hints: [
      { order: 1, trTitle: 'Bernoulli n Değeri', trContent: 'Denklem y^2 içerdiğinden n=2 dir. v = y^(1-2) = y^(-1) dönüşümü yapın.', enTitle: 'Bernoulli Power', enContent: 'Since RHS has y^2, n=2. Use substitution v = y^-1.' },
      { order: 2, trTitle: 'İntegrasyon Çarpanı', trContent: 'v\' - (1/x)v = -x için integrasyon çarpanı mu(x) = 1/x tir.', enTitle: 'Integrating Factor', enContent: 'Integrating factor is 1/x.' },
      { order: 3, trTitle: 'Geri Dönüşüm', trContent: 'v(x) = Cx - x^2 bulduktan sonra y = 1/v almayı unutmayın.', enTitle: 'Back-substitution', enContent: 'Invert v to get y = 1/(Cx - x^2).' }
    ]
  });

  // TEST 3: Graf Teorisi -> Euler Çizgesi & Handshaking Lemma
  await createVerifiedProblem({
    slug: 'prob-graf-euler-handshaking-exam',
    category: 'MATHEMATICS',
    subcategory: 'Graf Teorisi',
    difficulty: 'EASY',
    rating: 1200,
    questionType: 'NUMERIC',
    estimatedTime: 3,
    correctAnswer: '8',
    problemOrigin: 'SOURCE_EXACT',
    sourceProblemId: 'src-prob-graf-euler-q1',
    verificationLevel: 5,
    verificationSource: 'Prof. Dr. İbrahim Günaltılı, GRAF TEORİ DERS NOTLARI Örnek 2.4',
    conceptId: 'euler-graph',
    tr: {
      title: 'Köşe Dereceleri ve Kenar Sayımı (Handshaking Lemma)',
      prompt: 'Bir $G$ Euler çizgesinin köşe dereceleri sırasıyla $(4, 4, 4, 2, 2)$ olarak verilmiştir. Bu çizgenin toplam kenar sayısı $|E|$ kaçtır?',
      solution: 'Handshaking Lemma gereğince bir çizgedeki derecelerin toplamı kenar sayısının 2 katıdır:\n$$\\sum_{v \\in V} \\deg(v) = 2|E| \\implies 4 + 4 + 4 + 2 + 2 = 16 = 2|E| \\implies |E| = 8$$'
    },
    en: {
      title: 'Handshaking Lemma and Edge Count',
      prompt: 'A graph has vertex degrees (4, 4, 4, 2, 2). What is the total number of edges |E|?',
      solution: 'Sum of degrees is 16 = 2|E|, which yields |E| = 8.'
    },
    hints: [
      { order: 1, trTitle: 'Tokalaşma Lemması', trContent: 'Bir çizgedeki tüm köşe derecelerinin toplamı her kenarı iki kez sayar: sum deg(v) = 2|E|.', enTitle: 'Handshaking Lemma', enContent: 'The sum of all vertex degrees is equal to 2*|E|.' },
      { order: 2, trTitle: 'Dereceleri Toplayın', trContent: '4 + 4 + 4 + 2 + 2 = 16.', enTitle: 'Sum Degrees', enContent: '4 + 4 + 4 + 2 + 2 = 16.' },
      { order: 3, trTitle: '2\'ye Bölün', trContent: '|E| = 16 / 2 = 8.', enTitle: 'Divide by 2', enContent: '|E| = 16 / 2 = 8.' }
    ]
  });

  // TEST 4: Bilgisayar Mimarisi -> Cache
  await createVerifiedProblem({
    slug: 'prob-mimari-cache-bits-final-2021',
    category: 'COMPUTER_SCIENCE',
    subcategory: 'Bilgisayar Mimarisi',
    difficulty: 'INTERMEDIATE',
    rating: 1400,
    questionType: 'NUMERIC',
    estimatedTime: 4,
    correctAnswer: '8',
    problemOrigin: 'SOURCE_EXACT',
    sourceProblemId: 'src-prob-mimari-final-2021-q3',
    verificationLevel: 5,
    verificationSource: 'Doç. Dr. Özer Çelik, Bilgisayar Mimarisi 2021 Final Sınavı Soru 3',
    conceptId: 'cache-mapping',
    tr: {
      title: 'Önbellek Index Bit Sayısı (ESOGÜ 2021 Final)',
      prompt: '32-bit adreslemeli bir bilgisayarda, 64 KB kapasiteli ve her bloğu 64 Bayt olan 4-yollu kümeli ilişkili (4-way set associative) bir önbellek için **Index (Küme)** alanına kaç bit ayrılır?',
      solution: '1. Toplam blok sayısı = 64 KB / 64 B = 1024 blok.\n2. 4-yollu olduğundan küme sayısı S = 1024 / 4 = 256 küme.\n3. Index bit sayısı = log2(256) = 8 bit.'
    },
    en: {
      title: 'Cache Index Bits (ESOGÜ 2021 Final)',
      prompt: 'In a 32-bit address system with a 64 KB 4-way set-associative cache and 64-byte blocks, how many bits are used for the Index field?',
      solution: 'Total blocks = 1024. Sets = 1024/4 = 256. Index = log2(256) = 8 bits.'
    },
    hints: [
      { order: 1, trTitle: 'Toplam Blok Sayısı', trContent: '64 KB = 65536 Bayt. 65536 / 64 = 1024 blok.', enTitle: 'Total Blocks', enContent: '64 KB / 64 B = 1024 blocks.' },
      { order: 2, trTitle: 'Küme Sayısı (Set Count)', trContent: '4-yollu olduğu için 1024 blok / 4 = 256 küme vardır.', enTitle: 'Set Count', enContent: '1024 / 4 = 256 sets.' },
      { order: 3, trTitle: 'Log2 Hesabı', trContent: '256 = 2^8 olduğundan Index = 8 bittir.', enTitle: 'Log2', enContent: 'log2(256) = 8 bits.' }
    ]
  });

  // TEST 5: Lineer Cebir -> Özdeğerler
  await createVerifiedProblem({
    slug: 'prob-lineer-eigenvalues-source',
    category: 'MATHEMATICS',
    subcategory: 'Lineer Cebir',
    difficulty: 'INTERMEDIATE',
    rating: 1350,
    questionType: 'NUMERIC',
    estimatedTime: 4,
    correctAnswer: '5',
    problemOrigin: 'SOURCE_EXACT',
    verificationLevel: 5,
    verificationSource: 'ESOGÜ Lineer Cebir I Ders Notları & 2023 Final',
    conceptId: 'eigenvalues',
    tr: {
      title: 'Özdeğerlerin En Büyüğü (Karakteristik Denklem)',
      prompt: '$A = \\begin{pmatrix} 2 & 3 \\\\ 0 & 5 \\end{pmatrix}$ üst üçgensel matrisinin en büyük özdeğeri $\\lambda_{\\max}$ kaçtır?',
      solution: 'Üst veya alt üçgensel matrislerin özdeğerleri doğrudan ana köşegen üzerindeki elemanlardır. Ana köşegen elemanları $\\{2, 5\\}$ tir. Dolayısıyla en büyük özdeğer 5\'tir.'
    },
    en: {
      title: 'Largest Eigenvalue of Triangular Matrix',
      prompt: 'What is the largest eigenvalue of the upper triangular matrix A = [[2, 3], [0, 5]]?',
      solution: 'The eigenvalues of a triangular matrix are its diagonal entries {2, 5}. The largest is 5.'
    },
    hints: [
      { order: 1, trTitle: 'Karakteristik Polinom', trContent: 'det(A - lambda I) = (2 - lambda)(5 - lambda) = 0.', enTitle: 'Characteristic Polynomial', enContent: 'det(A - lambda I) = (2 - lambda)(5 - lambda) = 0.' },
      { order: 2, trTitle: 'Köşegen Özelliği', trContent: 'Üçgensel matrislerin özdeğerleri köşegen elemanlarıdır.', enTitle: 'Diagonal Property', enContent: 'Eigenvalues of a triangular matrix are its diagonal entries.' },
      { order: 3, trTitle: 'Maksimum', trContent: 'max(2, 5) = 5.', enTitle: 'Maximum', enContent: 'max(2, 5) = 5.' }
    ]
  });

  // TEST 6: Ayrık Matematik -> Tümevarım
  await createVerifiedProblem({
    slug: 'prob-ayrik-induction-source',
    category: 'MATHEMATICS',
    subcategory: 'Ayrık Matematik',
    difficulty: 'EASY',
    rating: 1150,
    questionType: 'MULTIPLE_CHOICE',
    estimatedTime: 3,
    correctAnswer: 'B',
    problemOrigin: 'SOURCE_EXACT',
    verificationLevel: 5,
    verificationSource: 'ESOGÜ Ayrık Matematik Arşivi (ayrık.txt)',
    conceptId: 'mathematical-induction',
    tr: {
      title: 'Tümevarım Adımı Hipotezi',
      prompt: 'Matematiksel tümevarımda $P(k)$ önermesinin doğru olduğu varsayılıp $P(k+1)$ önermesinin doğru olduğu ispatlanan adıma ne ad verilir?',
      options: [
        'A) Temel Adım (Base Step)',
        'B) Tümevarım Adımı (Inductive Step)',
        'C) Çelişki Adımı (Contradiction Step)',
        'D) Güvercin Yuvası İlkesi'
      ],
      solution: 'Tümevarım iki ana adımdan oluşur: 1. Temel Adım (n=1 için doğruluk), 2. Tümevarım Adımı (P(k) -> P(k+1) ispatı). Doğru cevap B.'
    },
    en: {
      title: 'Inductive Step Definition',
      prompt: 'In mathematical induction, what is the step where P(k) is assumed true to prove P(k+1)?',
      options: [
        'A) Base Step',
        'B) Inductive Step',
        'C) Contradiction Step',
        'D) Pigeonhole Principle'
      ],
      solution: 'The inductive step assumes P(k) to prove P(k+1).'
    },
    hints: [
      { order: 1, trTitle: 'İki Adım', trContent: 'Tümevarım temel adım ve geçiş adımından oluşur.', enTitle: 'Two Steps', enContent: 'Induction consists of base step and inductive step.' },
      { order: 2, trTitle: 'P(k) -> P(k+1)', trContent: 'k\'dan k+1\'e geçiş tümevarım adımıdır.', enTitle: 'Transition', enContent: 'Proving P(k+1) from P(k) is the inductive step.' }
    ]
  });

  // TEST 7: Python -> Sayılar Teorisi (Öklid EBOB)
  await createVerifiedProblem({
    slug: 'prob-python-euclid-source',
    category: 'COMPUTER_SCIENCE',
    subcategory: 'Bilgisayar Programlama',
    difficulty: 'EASY',
    rating: 1100,
    questionType: 'NUMERIC',
    estimatedTime: 2,
    correctAnswer: '6',
    problemOrigin: 'SOURCE_EXACT',
    verificationLevel: 5,
    verificationSource: 'ESOGÜ Bilgisayar Programlama ebob_ekok.py',
    conceptId: 'euclidean-algorithm-python',
    tr: {
      title: 'Öklid Algoritması ile EBOB (Python)',
      prompt: 'Python\'da `gcd(48, 18)` fonksiyonu çağrıldığında dönen en büyük ortak bölen (EBOB) değeri kaçtır?',
      solution: '1. 48 % 18 = 12\n2. 18 % 12 = 6\n3. 12 % 6 = 0\nKalan 0 olduğunda bölen 6\'dır. gcd(48, 18) = 6.'
    },
    en: {
      title: 'Euclidean GCD in Python',
      prompt: 'What is the return value of gcd(48, 18) in Python?',
      solution: '48 mod 18 = 12, 18 mod 12 = 6, 12 mod 6 = 0. GCD is 6.'
    },
    hints: [
      { order: 1, trTitle: 'Birinci Bölme', trContent: '48\'i 18\'e böldüğünüzde kalan 12\'dir.', enTitle: 'First division', enContent: '48 mod 18 = 12.' },
      { order: 2, trTitle: 'İkinci Bölme', trContent: '18\'i 12\'ye böldüğünüzde kalan 6\'dır.', enTitle: 'Second division', enContent: '18 mod 12 = 6.' },
      { order: 3, trTitle: 'Sonuç', trContent: '12, 6\'ya tam bölündüğü için EBOB 6\'dır.', enTitle: 'Result', enContent: '12 mod 6 = 0, so GCD is 6.' }
    ]
  });

  // TEST 8: MATLAB -> Sayısal İntegrasyon (Trapz)
  await createVerifiedProblem({
    slug: 'prob-matlab-integration-source',
    category: 'COMPUTER_SCIENCE',
    subcategory: 'Temel Bilgi Teknolojileri',
    difficulty: 'EASY',
    rating: 1180,
    questionType: 'NUMERIC',
    estimatedTime: 3,
    correctAnswer: '12',
    problemOrigin: 'SOURCE_EXACT',
    verificationLevel: 5,
    verificationSource: 'Dr. Alper Odabaş, TBT MATLAB Serisi ders7.md',
    conceptId: 'numerical-integration-matlab',
    tr: {
      title: 'MATLAB trapz Fonksiyonu ile Alan Hesabı',
      prompt: 'MATLAB ortamında `x = [0, 2, 4]; y = [1, 3, 5]; I = trapz(x, y);` komutları çalıştırıldığında `I` değişkeninin sayısal değeri kaçtır?',
      solution: 'Yamuk kuralı:\n1. [0, 2] aralığında h=2, alan = 2 * (1 + 3) / 2 = 4.\n2. [2, 4] aralığında h=2, alan = 2 * (3 + 5) / 2 = 8.\nToplam Alan = 4 + 8 = 12.'
    },
    en: {
      title: 'MATLAB trapz Numerical Area',
      prompt: 'What is the value of I after running: x = [0, 2, 4]; y = [1, 3, 5]; I = trapz(x, y);?',
      solution: 'Trapezoidal sum: 2*(1+3)/2 + 2*(3+5)/2 = 4 + 8 = 12.'
    },
    hints: [
      { order: 1, trTitle: 'Yamuk Alanı', trContent: 'Her aralık için alan = (x2 - x1) * (y1 + y2) / 2.', enTitle: 'Trapezoid Area', enContent: 'Area for each interval is dx * (y1 + y2) / 2.' },
      { order: 2, trTitle: 'Aralıklar', trContent: 'İki aralık vardır: [0, 2] için alan 4, [2, 4] için alan 8\'dir.', enTitle: 'Intervals', enContent: 'Intervals are [0,2] (area 4) and [2,4] (area 8).' },
      { order: 3, trTitle: 'Toplam', trContent: '4 + 8 = 12.', enTitle: 'Total', enContent: '4 + 8 = 12.' }
    ]
  });

  // TEST 9: C# -> Olay Güdümlü Programlama (Event-Driven)
  await createVerifiedProblem({
    slug: 'prob-csharp-event-source',
    category: 'COMPUTER_SCIENCE',
    subcategory: 'Görsel Programlama',
    difficulty: 'EASY',
    rating: 1120,
    questionType: 'MULTIPLE_CHOICE',
    estimatedTime: 2,
    correctAnswer: 'A',
    problemOrigin: 'SOURCE_EXACT',
    verificationLevel: 5,
    verificationSource: 'Prof. Dr. Bülent Saka, Görsel Programlama I Vize Soruları',
    conceptId: 'event-driven-csharp',
    tr: {
      title: 'C# Buton Olayı Dinleyici Bağlama',
      prompt: 'C# Windows Forms uygulamasında bir `btnHesapla` butonunun `Click` olayına `Hesapla_Click` metodunu dinamik olarak bağlamak için hangi operatör kullanılır?',
      options: [
        'A) += (btnHesapla.Click += Hesapla_Click;)',
        'B) = (btnHesapla.Click = Hesapla_Click;)',
        'C) == (btnHesapla.Click == Hesapla_Click;)',
        'D) -> (btnHesapla.Click -> Hesapla_Click;)'
      ],
      solution: 'C# dilinde delegelere ve event yapılarına yeni bir metot dinleyicisi abone etmek için `+=` (add handler) operatörü, abonelikten çıkarmak için `-=` operatörü kullanılır. Doğru cevap A.'
    },
    en: {
      title: 'C# Button Event Subscription',
      prompt: 'Which operator is used in C# to subscribe an event handler method to btnHesapla.Click?',
      options: [
        'A) += (btnHesapla.Click += Hesapla_Click;)',
        'B) = (btnHesapla.Click = Hesapla_Click;)',
        'C) == (btnHesapla.Click == Hesapla_Click;)',
        'D) -> (btnHesapla.Click -> Hesapla_Click;)'
      ],
      solution: 'The += operator is used to attach event handlers in C#.'
    },
    hints: [
      { order: 1, trTitle: 'Multicast Delege', trContent: 'Eventler birden fazla dinleyici kabul edebilen Multicast yapıdır.', enTitle: 'Multicast', enContent: 'Events can have multiple subscribers.' },
      { order: 2, trTitle: 'Ekleme Operatörü', trContent: 'Atama yerine ekleme (+=) işlemi yapılır.', enTitle: 'Add Operator', enContent: 'Use += rather than assignment.' }
    ]
  });

  console.log('--- SEEDING LESSON STEPS & PROBLEMS COMPLETED ---');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
