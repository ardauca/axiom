import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedUniformConvergenceProblem() {
  console.log('Seeding authentic Uniform Convergence problem & hints...');

  const slug = 'uniform-convergence-sup-norm-test';

  const problem = await prisma.problem.upsert({
    where: { slug },
    create: {
      slug,
      category: 'MATHEMATICS',
      subcategory: 'Analiz III',
      difficulty: 'INTERMEDIATE',
      rating: 1550,
      questionType: 'MULTIPLE_CHOICE',
      estimatedTime: 12,
      correctAnswer: 'f_n(x) dizisi R üzerinde f(x) = 0 fonksiyonuna DÜZGÜN yakınsar çünkü M_n = sup |f_n(x) - f(x)| = 1/(2\\sqrt{n}) \\to 0.',
      verificationLevel: 3,
      verificationSource: 'Adams & Essex Calculus (7th Ed.) Sec 9.5 & ESOGÜ Analiz III/IV Özcan Hoca Notları',
      problemOrigin: 'SOURCE_ADAPTED',
      translations: {
        create: [
          {
            language: 'tr',
            title: 'Fonksiyon Dizilerinde Düzgün Yakınsaklık (Sup-Norm / Weierstrass Testi)',
            prompt: `Her $n \\in \\mathbb{N}$ için $f_n: \\mathbb{R} \\to \\mathbb{R}$ fonksiyon dizisi şu şekilde tanımlanmıştır:

$$f_n(x) = \\frac{x}{1 + n x^2}$$

Bu fonksiyon dizisinin $\\mathbb{R}$ üzerindeki noktasal limiti ve düzgün yakınsaklık davranışı hakkında aşağıdakilerden hangisi kesinlikle doğrudur?`,
            options: JSON.stringify([
              'f_n(x) dizisi R üzerinde f(x) = 0 fonksiyonuna DÜZGÜN yakınsar çünkü M_n = sup |f_n(x) - f(x)| = 1/(2\\sqrt{n}) \\to 0.',
              'f_n(x) dizisi R üzerinde noktasal yakınsar ancak düzgün yakınsamaz çünkü türevi x = 0 noktasında süreksizdir.',
              'f_n(x) dizisi hiçbir x noktasında yakınsamaz çünkü paydada n terimi sonsuza gitmektedir.',
              'f_n(x) yalnızca [0, 1] kapalı aralığında düzgün yakınsar, R üzerinde ıraksaktır.'
            ]),
            solution: `**Adım Adım Rigoröz Çözüm:**

1. **Noktasal Limit (Pointwise Limit):**
   Herhangi bir sabit $x \\in \\mathbb{R}$ seçelim:
   - Eğer $x = 0$ ise, $f_n(0) = 0 / 1 = 0 \\implies \\lim_{n \\to \\infty} f_n(0) = 0$.
   - Eğer $x \\neq 0$ ise, paydada $n x^2 \\to \\infty$ olacağından:
     $$\\lim_{n \\to \\infty} f_n(x) = \\lim_{n \\to \\infty} \\frac{x}{1 + n x^2} = 0$$
   Demek ki dizinin $\\mathbb{R}$ üzerindeki noktasal limit fonksiyonu $f(x) = 0$'dır.

2. **Düzgün Yakınsaklık Kriteri (Supremum Normu):**
   $(f_n)$ dizisinin $\\mathbb{R}$ üzerinde $f(x) = 0$'a düzgün yakınsaması için gerek ve yeter şart:
   $$M_n = \\sup_{x \\in \\mathbb{R}} |f_n(x) - f(x)| = \\sup_{x \\in \\mathbb{R}} \\left| \\frac{x}{1 + n x^2} \\right| \\xrightarrow{n \\to \\infty} 0$$
   olmasıdır.

3. **Maksimum Değerin Hesaplanması (Ekstremum Analizi):**
   $f_n(x)$ tek fonksiyondur, $x > 0$ için inceleyelim ve $x$'e göre türev alalım:
   $$f_n'(x) = \\frac{1 \\cdot (1 + n x^2) - x \\cdot (2 n x)}{(1 + n x^2)^2} = \\frac{1 - n x^2}{(1 + n x^2)^2}$$
   $f_n'(x) = 0 \\implies 1 - n x^2 = 0 \\implies x = \\frac{1}{\\sqrt{n}}$ (çünkü $x > 0$).
   Bu kritik noktada fonksiyonun aldığı değer:
   $$f_n\\left(\\frac{1}{\\sqrt{n}}\\right) = \\frac{\\frac{1}{\\sqrt{n}}}{1 + n \\left(\\frac{1}{n}\\right)} = \\frac{\\frac{1}{\\sqrt{n}}}{2} = \\frac{1}{2\\sqrt{n}}$$

4. **Limit Alımı:**
   $$M_n = \\frac{1}{2\\sqrt{n}}$$
   Buradan:
   $$\\lim_{n \\to \\infty} M_n = \\lim_{n \\to \\infty} \\frac{1}{2\\sqrt{n}} = 0$$
   $M_n \\to 0$ sağlandığından, $f_n(x)$ dizisi $\\mathbb{R}$ üzerinde $f(x) = 0$ limitine **DÜZGÜN YAKINSAKTIR** ($f_n \\rightrightarrows 0$).`,
            commonMistakes: JSON.stringify([
              'x = 0 için paydanın 1 olmasını unutup tanımsız sanmak',
              'Noktasal limit 0 olunca doğrudan düzgün yakınsar varsayımı yapmak (supremum kontrol edilmelidir)',
              '1/sqrt(n) noktasındaki tepe değerinin n büyüdükçe 0\'a gittiğini gözden kaçırmak'
            ])
          }
        ]
      },
      hints: {
        create: [
          {
            order: 1,
            penaltyScore: 0.2,
            translations: {
              create: [
                {
                  language: 'tr',
                  title: '1. İpucu: Noktasal Limiti Belirleyin',
                  content: 'Önce her bir sabit $x \\in \\mathbb{R}$ için $\\lim_{n \\to \\infty} f_n(x)$ limitini hesaplayın. Hem $x = 0$ hem de $x \\neq 0$ durumlarını ayrı ayrı test edin.'
                }
              ]
            }
          },
          {
            order: 2,
            penaltyScore: 0.3,
            translations: {
              create: [
                {
                  language: 'tr',
                  title: '2. İpucu: Sup-Norm (Ekstremum) Kriteri',
                  content: 'Düzgün yakınsaklığı doğrulamak için $M_n = \\sup_{x \\in \\mathbb{R}} |f_n(x) - f(x)|$ ifadesini bulmalısınız. $f_n(x)$\'in türevini alarak tepe noktasını ($f_n\'(x) = 0$) bulun.'
                }
              ]
            }
          },
          {
            order: 3,
            penaltyScore: 0.5,
            translations: {
              create: [
                {
                  language: 'tr',
                  title: '3. İpucu: Tepe Değerinin Limiti',
                  content: 'Türevden $x = 1/\\sqrt{n}$ kritik noktası gelir. Bu değeri fonksiyonda yerine yazınca $M_n = \\frac{1}{2\\sqrt{n}}$ çıkar. $n \\to \\infty$ iken bu değer $0$\'a gittiği için düzgün yakınsaklık sağlanır.'
                }
              ]
            }
          }
        ]
      }
    },
    update: {
      correctAnswer: 'f_n(x) dizisi R üzerinde f(x) = 0 fonksiyonuna DÜZGÜN yakınsar çünkü M_n = sup |f_n(x) - f(x)| = 1/(2\\sqrt{n}) \\to 0.',
      verificationSource: 'Adams & Essex Calculus (7th Ed.) Sec 9.5 & ESOGÜ Analiz III/IV Özcan Hoca Notları'
    }
  });

  // Link problem to Concept 'uniform-convergence'
  await prisma.problemConcept.upsert({
    where: {
      problemId_conceptId: {
        problemId: problem.id,
        conceptId: 'uniform-convergence'
      }
    },
    create: {
      problemId: problem.id,
      conceptId: 'uniform-convergence'
    },
    update: {}
  });

  console.log(`Problem successfully seeded and linked to concept 'uniform-convergence': ${slug} (ID: ${problem.id})`);
}

seedUniformConvergenceProblem()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
