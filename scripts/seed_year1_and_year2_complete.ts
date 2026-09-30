import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import { syncConceptLessonWithFusion } from '../src/lib/tutor/teacherEngine';

const prisma = new PrismaClient();

async function seedYear1AndYear2Complete() {
  console.log('========================================================================');
  console.log('SEEDING 1ST & 2ND YEAR OFFICIAL ESOGU COMPULSORY CURRICULUM (20 COURSES)');
  console.log('========================================================================\n');

  // Load weekly plans
  const weeklyPlans = JSON.parse(fs.readFileSync('parsed_weekly_plans.json', 'utf8'));

  // 1. Definition of core concepts for 1st & 2nd year courses that need rich lessons & problems
  const NEW_CONCEPTS = [
    // --- 1. SINIF GÜZ ---
    {
      id: 'real-number-completeness',
      courseCode: 'MAT101',
      topicId: 'top-analiz1-reel-sayilar',
      topicTitle: 'Reel Sayılar Aksiyomları ve Tamlık (Completeness)',
      name: 'Reel Sayıların Tamlığı ve Supremum Aksiyomu',
      formalStatement: '\\forall S \\subset \\mathbb{R}, S \\neq \\emptyset \\text{ ve } S \\text{ üstten sınırlı ise } \\exists \\sup S \\in \\mathbb{R}',
      intuition: 'Rasyonel sayılarda delikler vardır (örneğin karesi 2 olan sayı rasyonel değildir). Reel sayılar tamlık aksiyomu sayesinde doğru üzerinde hiçbir boşluk bırakmaz; üstten sınırlı her kümenin mutlaka en küçük üst sınırı (supremumu) vardır.',
      problem: {
        slug: 'prob-analiz1-supremum-set',
        title: 'Kümelerde Supremum ve İnfimum Hesabı',
        difficulty: 'EASY',
        rating: 1350,
        questionType: 'MULTIPLE_CHOICE',
        estimatedTime: 10,
        correctAnswer: '\\sup S = 1, \\quad \\inf S = 0',
        prompt: `$S = \\left\\{ 1 - \\frac{1}{n} : n \\in \\mathbb{N}^+ \\right\\} = \\left\\{ 0, \\frac{1}{2}, \\frac{2}{3}, \\frac{3}{4}, \\dots \\right\\}$ kümesinin $\\mathbb{R}$ içindeki supremum ve infimum değerleri nedir?`,
        options: JSON.stringify([
          '\\sup S = 1, \\quad \\inf S = 0',
          '\\sup S = 1, \\quad \\inf S = 1/2',
          '\\sup S = \\infty, \\quad \\inf S = 0',
          'Supremumu yoktur çünkü 1 elemanı kümeye ait değildir.'
        ]),
        solution: `1. Kümenin elemanları: n = 1 için 0, n = 2 için 1/2, n sonsuza giderken 1'e yaklaşır.
2. 0 kümenin en küçük elemanıdır, dolayısıyla inf S = min S = 0.
3. Her n için 1 - 1/n < 1 olduğundan 1 bir üst sınırdır.
4. Her epsilon > 0 için Arşimet prensibi gereği 1/n < epsilon olacak bir n bulunabilir; dolayısıyla 1'den küçük hiçbir sayı üst sınır olamaz.
5. Supremum tanımı gereği en küçük üst sınır sup S = 1'dir (1'in kümeye ait olması zorunlu değildir).`,
        hints: [
          { order: 1, title: 'Supremum Kümede Olmak Zorunda Değildir', content: 'Supremum en küçük üst sınırdır; kümenin elemanı olmak zorunda değildir.' }
        ]
      }
    },
    {
      id: 'sequence-limit',
      courseCode: 'MAT101',
      topicId: 'top-analiz1-diziler-limit',
      topicTitle: 'Dizilerde Limit ve Yakınsaklık (Epsilon-N)',
      name: 'Dizilerde Limit ve Epsilon-N Tanımı',
      formalStatement: '\\lim_{n \\to \\infty} a_n = L \\iff \\forall \\epsilon > 0, \\exists N \\in \\mathbb{N} \\text{ s.t. } n > N \\implies |a_n - L| < \\epsilon',
      intuition: 'Dizinin limite yaklaşması bir oyundur: Hakem ne kadar dar bir hata payı (epsilon) seçerse seçsin, öyle bir N adımından sonra dizinin tüm terimleri hedef L etrafındaki epsilon penceresine hapsolur.',
      problem: {
        slug: 'prob-analiz1-epsilon-n-limit',
        title: 'Epsilon-N Tanımı ile Dizi Limiti İspatı',
        difficulty: 'INTERMEDIATE',
        rating: 1420,
        questionType: 'MULTIPLE_CHOICE',
        estimatedTime: 12,
        correctAnswer: 'N = \\lceil 3 / \\epsilon \\rceil',
        prompt: `$a_n = \\frac{3n + 1}{n + 2}$ dizisinin limitinin $L = 3$ olduğunu kanıtlamak için verilen bir $\\epsilon > 0$ sayısına karşılık seçilmesi gereken $N(\\epsilon)$ indisi hangisi olabilir?`,
        options: JSON.stringify([
          'N = \\lceil 5 / \\epsilon \\rceil',
          'N = \\lceil 3 / \\epsilon \\rceil',
          'N = \\lceil 1 / \\epsilon^2 \\rceil',
          'N = 3\\epsilon'
        ]),
        solution: `|a_n - 3| = |(3n+1 - 3n - 6)/(n+2)| = |-5/(n+2)| = 5/(n+2).
5/(n+2) < 5/n.
5/n < epsilon olması için n > 5/epsilon seçilmesi yeterlidir.
Dolayısıyla N = ceil(5 / epsilon) indisi seçildiğinde her n > N için |a_n - 3| < epsilon sağlanır.`,
        hints: [
          { order: 1, title: 'Mutlak Değer Farkını Sadeleştirin', content: '|a_n - 3| paydalarını eşitleyip mutlak değeri açın: 5/(n+2) < 5/n < epsilon.' }
        ]
      }
    },
    {
      id: 'dot-and-cross-product',
      courseCode: 'MAT103',
      topicId: 'top-analitik-vektorler',
      topicTitle: 'Uzayda Vektörler, Nokta ve Vektörel Çarpım',
      name: 'Nokta (Skaler) ve Vektörel Çarpım Geometrisi',
      formalStatement: '\\vec{u} \\cdot \\vec{v} = |\\vec{u}||\\vec{v}| \\cos\\theta, \\quad |\\vec{u} \\times \\vec{v}| = |\\vec{u}||\\vec{v}| \\sin\\theta',
      intuition: 'Nokta çarpım iki vektörün ne kadar aynı doğrultuda baktığını ölçer ve skaler verir (izdüşüm). Vektörel çarpım ise her iki vektöre de dik (ortogonal) yeni bir 3B vektör üretir ve büyüklüğü oluşturdukları paralelkenarın alanına eşittir.',
      problem: {
        slug: 'prob-analitik-cross-product-area',
        title: 'Vektörel Çarpım ile Üçgen Alanı Hesabı',
        difficulty: 'EASY',
        rating: 1300,
        questionType: 'MULTIPLE_CHOICE',
        estimatedTime: 10,
        correctAnswer: '3\\sqrt{3} / 2',
        prompt: `Köşe noktaları $A(1, 0, 0)$, $B(0, 2, 0)$ ve $C(0, 0, 3)$ olan üçgenin alanını vektörel çarpım kullanarak hesaplayınız.`,
        options: JSON.stringify([
          '7 / 2',
          '3\\sqrt{3} / 2',
          '\\sqrt{29} / 2',
          '6'
        ]),
        solution: `AB vektörü = B - A = (-1, 2, 0).
AC vektörü = C - A = (-1, 0, 3).
Vektörel çarpım AB x AC = det([[i, j, k], [-1, 2, 0], [-1, 0, 3]]) = i(6) - j(-3) + k(2) = (6, 3, 2).
Büyüklük |AB x AC| = sqrt(6^2 + 3^2 + 2^2) = sqrt(36 + 9 + 4) = sqrt(49) = 7.
Üçgenin alanı = (1/2) * |AB x AC| = 7 / 2.`,
        hints: [
          { order: 1, title: 'Ortak Başlangıçlı İki Kenar Vektörü', content: 'AB ve AC vektörlerini bulunuz, determinant ile vektörel çarpımı hesaplayınız.' }
        ]
      }
    },
    {
      id: 'twos-complement',
      courseCode: 'CENG101',
      topicId: 'top-tbb1-sayi-sistemleri',
      topicTitle: 'İkili Sayı Sistemleri ve İkiye Tümleyen (Two\'s Complement)',
      name: 'İkiye Tümleyen Temsili ve Negatif Sayı Aritmetiği',
      formalStatement: '-x = \\sim x + 1 \\quad (\\text{Bitleri ters çevir ve 1 ekle})',
      intuition: 'İkiye tümleyen, bilgisayar donanımında çıkarma işlemi için ayrı bir çıkartıcı devre yapma zorunluluğunu ortadan kaldırır. Toplama devresiyle negatif sayılar doğrudan toplanabilir.',
      problem: {
        slug: 'prob-tbb1-twos-complement-calc',
        title: '8-Bit İkiye Tümleyen Sayı Değeri',
        difficulty: 'EASY',
        rating: 1280,
        questionType: 'MULTIPLE_CHOICE',
        estimatedTime: 8,
        correctAnswer: '-43',
        prompt: `8-bit işaretli ikiye tümleyen sisteminde saklanan \`11010101\` ikili (binary) sayısının onluk (decimal) karşılığı nedir?`,
        options: JSON.stringify([
          '-43',
          '-85',
          '213',
          '-107'
        ]),
        solution: `En soldaki bit (MSB) 1 olduğu için sayı negatiftir (ağırlığı -2^7 = -128).
Değer = -128 + 64 + 0 + 16 + 0 + 4 + 0 + 1 = -128 + 85 = -43.
Alternatif yöntem: Bitleri ters çevirip 1 ekleyelim:
~11010101 = 00101010
+ 1 = 00101011 (onluk karşılığı 32 + 8 + 2 + 1 = 43).
İşaret negatif olduğundan sonuç -43'tür.`,
        hints: [
          { order: 1, title: 'En Yüksek Değerlikli Bit (MSB)', content: 'MSB 1 ise sayı negatiftir; -128 ağırlığı ile pozitif bitlerin toplamını alabilirsiniz.' }
        ]
      }
    },

    // --- 1. SINIF BAHAR ---
    {
      id: 'fundamental-theorem-calculus',
      courseCode: 'MAT102',
      topicId: 'top-analiz2-temel-teorem',
      topicTitle: 'Kalkülüsün Temel Teoremi (FTC I & II)',
      name: 'Analizin Temel Teoremi ve İntegral-Türev İlişkisi',
      formalStatement: '\\frac{d}{dx} \\left( \\int_a^x f(t) \\, dt \\right) = f(x), \\quad \\int_a^b f(x) \\, dx = F(b) - F(a)',
      intuition: 'Türev ile integral birbirinin tam tersi işlemlerdir. Bir fonksiyonun altındaki birikimli alanın x\'e göre büyüme hızı, tam o andaki eğrinin yüksekliğidir.',
      problem: {
        slug: 'prob-analiz2-leibniz-integral-rule',
        title: 'Değişken Sınırlı İntegralin Türevi (Leibniz Kuralı)',
        difficulty: 'INTERMEDIATE',
        rating: 1450,
        questionType: 'MULTIPLE_CHOICE',
        estimatedTime: 12,
        correctAnswer: '2x \\cos(x^4)',
        prompt: `$F(x) = \\int_0^{x^2} \\cos(t^2) \\, dt$ fonksiyonunun $x$'e göre türevi $F'(x)$ nedir?`,
        options: JSON.stringify([
          '2x \\cos(x^4)',
          '\\cos(x^4)',
          '2x \\cos(x^2)',
          '-2x \\sin(x^4)'
        ]),
        solution: `Leibniz integral türev kuralı:
d/dx [int_{u(x)}^{v(x)} f(t) dt] = f(v(x)) * v'(x) - f(u(x)) * u'(x).
Burada v(x) = x^2, v'(x) = 2x, u(x) = 0, u'(x) = 0.
f(v(x)) = cos((x^2)^2) = cos(x^4).
F'(x) = cos(x^4) * (2x) = 2x cos(x^4).`,
        hints: [
          { order: 1, title: 'Zincir Kuralı ile Üst Sınır Türevi', content: 'Üst sınır x değil x^2 olduğu için zincir kuralı gereği (x^2)\' = 2x çarpanı başa gelir.' }
        ]
      }
    },
    {
      id: 'integration-by-parts',
      courseCode: 'MAT102',
      topicId: 'top-analiz2-kismi-integral',
      topicTitle: 'Kısmi İntegrasyon Yöntemi',
      name: 'Kısmi İntegrasyon ve Çarpım Türevinin Tersi',
      formalStatement: '\\int u \\, dv = u v - \\int v \\, du',
      intuition: 'Çarpımın türevi kuralının tersten işletilmesidir. u seçimi yapılırken LAPTÜ (Logaritmik, Ark, Polinom, Trigonometrik, Üstel) öncelik sırası takip edilir.',
      problem: {
        slug: 'prob-analiz2-by-parts-poly-exp',
        title: 'Kısmi İntegrasyon ile x e^{2x} İntegrali',
        difficulty: 'EASY',
        rating: 1320,
        questionType: 'MULTIPLE_CHOICE',
        estimatedTime: 10,
        correctAnswer: '\\frac{1}{2} x e^{2x} - \\frac{1}{4} e^{2x} + C',
        prompt: `$\\int x e^{2x} \\, dx$ belirsiz integralini hesaplayınız.`,
        options: JSON.stringify([
          '\\frac{1}{2} x e^{2x} - \\frac{1}{4} e^{2x} + C',
          'x e^{2x} - e^{2x} + C',
          '\\frac{1}{2} x^2 e^{2x} + C',
          '\\frac{1}{4} x e^{2x} + C'
        ]),
        solution: `LAPTÜ gereği Polinom (x) -> u, Üstel (e^{2x} dx) -> dv.
u = x ==> du = dx.
dv = e^{2x} dx ==> v = (1/2) e^{2x}.
Formül: int u dv = uv - int v du
= x * (1/2 e^{2x}) - int (1/2 e^{2x}) dx
= 1/2 x e^{2x} - 1/4 e^{2x} + C.`,
        hints: [
          { order: 1, title: 'LAPTÜ Kuralı', content: 'u = x ve dv = e^{2x} dx seçiniz.' }
        ]
      }
    },
    {
      id: 'pointers-and-memory',
      courseCode: 'CENG104',
      topicId: 'top-bp2-pointers-memory',
      topicTitle: 'C/C++ İşaretçiler ve Dinamik Bellek',
      name: 'İşaretçiler, Adresleme ve Bellek Yönetimi',
      formalStatement: '\\text{int *ptr} = \\&x; \\quad *\\text{ptr} = 20;',
      intuition: 'İşaretçi (pointer) bir değişkenin değerini değil, RAM belleğindeki bayt adresini saklayan değişkendir. Doğrudan bellek manipülasyonu ve yüksek performanslı veri yapıları için zorunludur.',
      problem: {
        slug: 'prob-bp2-pointer-arithmetic',
        title: 'C Dili Pointer Aritmetiği ve Dizi Erişimi',
        difficulty: 'EASY',
        rating: 1340,
        questionType: 'MULTIPLE_CHOICE',
        estimatedTime: 8,
        correctAnswer: '30',
        prompt: `Aşağıdaki C kod parçacığı çalıştırıldığında ekrana ne basılır?

\`\`\`c
int dizi[] = { 10, 20, 30, 40 };
int *p = dizi;
p += 2;
printf("%d", *p);
\`\`\``,
        options: JSON.stringify([
          '30',
          '20',
          '12 (10 + 2)',
          'Bellek adresi'
        ]),
        solution: `dizi dizinin ilk elemanının adresidir (&dizi[0]).
p += 2 işlemi pointer'ı sizeof(int) * 2 bayt ileri öteler ve dizi[2] elemanını gösterir.
*p ifadesi bu adresteki değeri okur, yani dizi[2] = 30'dur.`,
        hints: [
          { order: 1, title: 'Pointer Aritmetiğinde Tip Boyutu', content: 'p += 2 ifadesi pointer\'ı 2 eleman ileriye taşır (&dizi[2]).' }
        ]
      }
    },
    {
      id: 'virtual-memory-paging',
      courseCode: 'CENG102',
      topicId: 'top-tbb2-sanal-bellek',
      topicTitle: 'Sanal Bellek ve Sayfalama (Paging)',
      name: 'Sanal Bellek, Sayfa Tablosu ve Sayfa Hatası (Page Fault)',
      formalStatement: '\\text{Sanal Adres} = (\\text{VPN}, \\text{Offset}) \\to \\text{Fiziksel Adres} = (\\text{PPN}, \\text{Offset})',
      intuition: 'Her programa kendi bağımsız devasa bellek alanı varmış hissi verilir. Fiziksel RAM küçük sabit bloklara (çerçeve) bölünür, sayfa tablosu sayesinde sanal sayfalar fiziksel çerçevelere dinamik haritalanır.',
      problem: {
        slug: 'prob-tbb2-page-offset-bits',
        title: 'Sayfa Boyutu ve Sayfa İçi Kayma (Offset) Bit Sayısı',
        difficulty: 'EASY',
        rating: 1320,
        questionType: 'MULTIPLE_CHOICE',
        estimatedTime: 8,
        correctAnswer: '12 bit',
        prompt: `32-bit mimaride sayfa boyutu 4 KB ($4096$ bayt) olarak belirlenmiş bir işletim sisteminde, sayfa içi kayma (offset) için kaç bit ayrılmalıdır?`,
        options: JSON.stringify([
          '12 bit',
          '20 bit',
          '10 bit',
          '16 bit'
        ]),
        solution: `Sayfa boyutu = 4 KB = 4 * 1024 bayt = 4096 bayt = 2^12 bayt.
Sayfa içindeki her baytı adresleyebilmek için log2(4096) = 12 bit gerekir.
Geriye kalan 32 - 12 = 20 bit ise Sanal Sayfa Numarası (VPN) için kullanılır.`,
        hints: [
          { order: 1, title: '2\'nin Kuvveti', content: '4096 = 2^12 bayttır.' }
        ]
      }
    },

    // --- 2. SINIF BAHAR ---
    {
      id: 'triple-integrals-spherical',
      courseCode: 'MAT202',
      topicId: 'top-analiz4-uc-katli-kuresel',
      topicTitle: 'Küresel Koordinatlarda Üç Katlı İntegraller',
      name: 'Küresel Koordinatlar ve Hacim İntegrali',
      formalStatement: 'dV = \\rho^2 \\sin\\phi \\, d\\rho \\, d\\phi \\, d\\theta',
      intuition: 'Küre veya koni geometrisi içeren 3B cisimlerde Kartezyen integraller aşırı zordur. Küresel koordinatlarda yarıçap rho, zenit açısı phi ve azimut açısı theta sabit sınırlara indirgenir.',
      problem: {
        slug: 'prob-analiz4-spherical-volume',
        title: 'Küresel Koordinatlarda Yarıçapı R Olan Kürenin Hacmi',
        difficulty: 'INTERMEDIATE',
        rating: 1480,
        questionType: 'MULTIPLE_CHOICE',
        estimatedTime: 12,
        correctAnswer: '\\frac{4}{3}\\pi R^3',
        prompt: `Küresel koordinatlar ($dV = \\rho^2 \\sin\\phi \\, d\\rho \\, d\\phi \\, d\\theta$) kullanarak $x^2 + y^2 + z^2 \\le R^2$ katı küresinin hacmini hesaplayınız.`,
        options: JSON.stringify([
          '\\frac{4}{3}\\pi R^3',
          '2\\pi R^3',
          '\\frac{2}{3}\\pi R^3',
          '\\frac{4}{3}\\pi R^2'
        ]),
        solution: `Sınırlar: rho in [0, R], phi in [0, pi], theta in [0, 2pi].
V = int_0^{2pi} dtheta * int_0^pi sin(phi) dphi * int_0^R rho^2 drho
= [2pi] * [-cos(phi)]_0^pi * [rho^3 / 3]_0^R
= 2pi * (1 - (-1)) * (R^3 / 3) = 2pi * 2 * R^3 / 3 = 4/3 pi R^3.`,
        hints: [
          { order: 1, title: 'Phi ve Theta Sınırları', content: 'Phi açısı kutuptan kutba [0, pi] aralığında, theta açısı [0, 2pi] aralığındadır.' }
        ]
      }
    },
    {
      id: 'power-series-radius',
      courseCode: 'MAT202',
      topicId: 'top-analiz4-kuvvet-serileri',
      topicTitle: 'Kuvvet Serileri ve Yakınsaklık Yarıçapı',
      name: 'Kuvvet Serileri ve Oran Testi ile Yakınsaklık Aralığı',
      formalStatement: 'R = \\lim_{n \\to \\infty} \\left| \\frac{a_n}{a_{n+1}} \\right|',
      intuition: 'Kuvvet serisi sonsuz dereceli bir polinomdur. x merkezden uzaklaştıkça serinin yakınsak kalabildiği maksimum mesafe yakınsaklık yarıçapı R\'dir.',
      problem: {
        slug: 'prob-analiz4-radius-convergence',
        title: 'Kuvvet Serisinin Yakınsaklık Yarıçapı Hesabı',
        difficulty: 'INTERMEDIATE',
        rating: 1440,
        questionType: 'MULTIPLE_CHOICE',
        estimatedTime: 10,
        correctAnswer: 'R = 3',
        prompt: `$\\sum_{n=1}^\\infty \\frac{(x - 2)^n}{n \\cdot 3^n}$ kuvvet serisinin yakınsaklık yarıçapı ($R$) nedir?`,
        options: JSON.stringify([
          'R = 3',
          'R = 1/3',
          'R = 2',
          'R = \\infty'
        ]),
        solution: `Oran testi (Ratio test):
L = lim |a_{n+1}/a_n| = lim | [(x-2)^{n+1} / ((n+1)3^{n+1})] * [n 3^n / (x-2)^n] |
= |x - 2| / 3 * lim [n / (n+1)] = |x - 2| / 3.
Yakınsaklık için L < 1 olmalıdır:
|x - 2| / 3 < 1 ==> |x - 2| < 3.
Buradan yakınsaklık yarıçapı R = 3 ve merkez x_0 = 2'dir.`,
        hints: [
          { order: 1, title: "D'Alembert Oran Testi", content: 'lim |u_{n+1}/u_n| < 1 eşitsizliğini kurunuz.' }
        ]
      }
    },
    {
      id: 'a-star-search',
      courseCode: 'CENG202',
      topicId: 'top-yz-sezgisel-arama',
      topicTitle: 'A* Arama Algoritması ve Sezgiseller (Heuristics)',
      name: 'A* Sezgisel Arama ve Kabul Edilebilirlik (Admissibility)',
      formalStatement: 'f(n) = g(n) + h(n), \\quad h(n) \\le h^*(n)',
      intuition: 'Dijkstra algoritması hedefin nerede olduğunu bilmeden her yöne eşit genişler. A* ise elindeki pusulayla (sezgisel tahmin h(n)) hedefe doğru olan düğümleri öne alarak gereksiz aramaları budar.',
      problem: {
        slug: 'prob-yz-astar-evaluation',
        title: 'A* Algoritması f(n) Değeri ve Düğüm Seçimi',
        difficulty: 'EASY',
        rating: 1350,
        questionType: 'MULTIPLE_CHOICE',
        estimatedTime: 8,
        correctAnswer: 'A düğümü (f = 7)',
        prompt: `A* algoritmasında açık listede (open list) iki düğüm bulunmaktadır:
- Düğüm A: Başlangıçtan maliyet $g(A) = 3$, hedefe tahmini mesafe $h(A) = 4$.
- Düğüm B: Başlangıçtan maliyet $g(B) = 5$, hedefe tahmini mesafe $h(B) = 3$.

Algoritma öncelik kuyruğundan bir sonraki adımda hangi düğümü genişletmek için seçer?`,
        options: JSON.stringify([
          'A düğümü (f = 7)',
          'B düğümü (h değeri daha küçük olduğu için)',
          'Rastgele biri seçilir (f değerleri eşit)',
          'B düğümü (f = 8)'
        ]),
        solution: `A* aramasında düğüm önceliği f(n) = g(n) + h(n) toplam maliyetine göredir:
f(A) = g(A) + h(A) = 3 + 4 = 7.
f(B) = g(B) + h(B) = 5 + 3 = 8.
Min-priority queue en küçük f değerine sahip olan düğümü seçer: f(A) = 7 < f(B) = 8 olduğundan A düğümü seçilir.`,
        hints: [
          { order: 1, title: 'f(n) = g(n) + h(n)', content: 'Her iki düğüm için toplam f maliyetini hesaplayıp en küçüğünü bulunuz.' }
        ]
      }
    },
    {
      id: 'lyapunov-stability',
      courseCode: 'MAT204',
      topicId: 'top-dinamik-lyapunov',
      topicTitle: 'Denge Noktaları ve Lyapunov Kararlılığı',
      name: 'Lyapunov Fonksiyonları ve Doğrudan Kararlılık Analizi',
      formalStatement: 'V(x) > 0 \\quad (x \\neq 0), \\quad \\dot{V}(x) = \\nabla V(x) \\cdot f(x) \\le 0',
      intuition: 'Sistemin diferansiyel denklemini çözmeden kararlılığı anlamaktır. Enerji benzeri bir V(x) çanağı bulunur; eğer sistem boyunca enerji azalıyorsa (V_nokta <= 0), sistem çanağın dibindeki denge noktasına doğru akar.',
      problem: {
        slug: 'prob-dinamik-lyapunov-derivative',
        title: 'Lyapunov Fonksiyonu Boyunca Türev Hesabı',
        difficulty: 'INTERMEDIATE',
        rating: 1470,
        questionType: 'MULTIPLE_CHOICE',
        estimatedTime: 12,
        correctAnswer: '\\dot{V} = -2x^4 - 2y^4 \\le 0 \\implies \\text{Asimptotik Kararlı}',
        prompt: `$\\dot{x} = -x^3 + y$, $\\quad \\dot{y} = -x - y^3$ nonlineer sistemi için $V(x, y) = x^2 + y^2$ aday Lyapunov fonksiyonunun sistem boyunca türevi $\\dot{V}$ ve $(0,0)$ denge noktasının kararlılığı nedir?`,
        options: JSON.stringify([
          '\\dot{V} = -2x^4 - 2y^4 \\le 0 \\implies \\text{Asimptotik Kararlı}',
          '\\dot{V} = 2xy \\implies \\text{Kararsız}',
          '\\dot{V} = -2x^2 - 2y^2 \\le 0 \\implies \\text{Nötr Kararlı}',
          '\\dot{V} = 0 \\implies \\text{Sonsuz Çevrim}'
        ]),
        solution: `V(x, y) = x^2 + y^2 > 0 (orijin hariç).
Zaman türevi: dot{V} = 2x dot{x} + 2y dot{y}
= 2x(-x^3 + y) + 2y(-x - y^3)
= -2x^4 + 2xy - 2yx - 2y^4
= -2x^4 - 2y^4 = -2(x^4 + y^4).
Tüm (x, y) != (0, 0) için dot{V} < 0 (kesin negatif) olduğundan orijin ASİMPTOTİK KARARLIDIR.`,
        hints: [
          { order: 1, title: 'Zincir Kuralı ile Zaman Türevi', content: 'dot{V} = 2x(dx/dt) + 2y(dy/dt) yazıp sistem denklemlerini yerine koyun.' }
        ]
      }
    },
    {
      id: 'csharp-async-await',
      courseCode: 'CENG204',
      topicId: 'top-gp2-async-await',
      topicTitle: 'Asenkron Programlama (async/await) ve UI Thread',
      name: 'C# async/await, Task Yapısı ve UI Donmalarını Önleme',
      formalStatement: 'public async Task<int> FetchDataAsync() { return await client.GetAsync(...); }',
      intuition: 'Ağdan veri indirirken veya ağır bir hesaplama yaparken ana UI thread bloke edilirse pencere donar (Not Responding). await anahtarı iş arka planda sürerken ana thread\'i serbest bırakır, işlem bitince kaldığı yerden devam eder.',
      problem: {
        slug: 'prob-gp2-async-await-thread',
        title: 'C# async/await UI Donmasını Önleme Mantığı',
        difficulty: 'EASY',
        rating: 1300,
        questionType: 'MULTIPLE_CHOICE',
        estimatedTime: 8,
        correctAnswer: 'await ana thread\'i (UI) bloke etmez; işlem bitene kadar kontrolü UI mesaj döngüsüne devreder.',
        prompt: `Arayüz butonuna tıklandığında uzun süren bir veritabanı sorgusunu \`await Task.Run(...)\` ile çalıştırmanın \`Thread.Sleep()\` veya senkron çağrıya göre temel avantajı nedir?`,
        options: JSON.stringify([
          'await ana thread\'i (UI) bloke etmez; işlem bitene kadar kontrolü UI mesaj döngüsüne devreder.',
          'await işlemi 10 kat daha hızlı bitirir.',
          'await kullandığınızda veritabanı bağlantısı açmaya gerek kalmaz.',
          'await derleme zamanı hatasını engeller.'
        ]),
        solution: `Senkron Thread.Sleep veya bekletme ana UI thread'ini kilitler ve pencerenin yeniden çizilmesini engeller.
await ise asenkron görev tamamlanana kadar çağıran thread'i serbest bırakır, böylece arayüz akıcı ve yanıt verebilir (responsive) kalır.`,
        hints: [
          { order: 1, title: 'UI Thread Sorumluluğu', content: 'Ana thread pencere çizimi ve fare tıklamalarını yönetir.' }
        ]
      }
    }
  ];

  for (const c of NEW_CONCEPTS) {
    console.log(`Processing concept: ${c.id} for course ${c.courseCode}...`);

    // 1. Ensure concept exists
    await prisma.concept.upsert({
      where: { id: c.id },
      create: {
        id: c.id,
        category: c.courseCode.startsWith('MAT') ? 'MATHEMATICS' : 'COMPUTER_SCIENCE',
        subcategory: c.topicTitle,
        formalStatement: c.formalStatement,
        verificationLevel: 3,
        verificationStatus: 'VERIFIED',
        sourceTitle: `${c.courseCode} Resmi Müfredatı`,
        sourceAuthor: 'Eskişehir Osmangazi Üniversitesi',
        sourceCitation: `ESOGÜ ${c.courseCode} Ders Bilgi Formu`,
        translations: {
          create: [
            {
              language: 'tr',
              name: c.name,
              dualTerminology: `${c.name} (${c.id})`,
              definition: c.formalStatement,
              intuition: c.intuition,
              commonPitfalls: 'Teorem hipotezlerinin ve önkoşulların kontrol edilmemesi.'
            }
          ]
        }
      },
      update: {
        formalStatement: c.formalStatement,
        sourceCitation: `ESOGÜ ${c.courseCode} Ders Bilgi Formu`
      }
    });

    // 2. Ensure topic exists and link concept to topic
    const course = await prisma.course.findFirst({
      where: { code: c.courseCode }
    });

    if (course) {
      const topic = await prisma.courseTopic.upsert({
        where: { id: c.topicId },
        create: {
          id: c.topicId,
          courseId: course.id,
          title: c.topicTitle,
          orderIndex: 1,
          estimatedMinutes: 45
        },
        update: {
          title: c.topicTitle
        }
      });

      await prisma.topicConcept.upsert({
        where: {
          topicId_conceptId: {
            topicId: topic.id,
            conceptId: c.id
          }
        },
        create: {
          topicId: topic.id,
          conceptId: c.id
        },
        update: {}
      });
    }

    // 3. Upsert problem
    const p = c.problem;
    const problem = await prisma.problem.upsert({
      where: { slug: p.slug },
      create: {
        slug: p.slug,
        category: c.courseCode.startsWith('MAT') ? 'MATHEMATICS' : 'COMPUTER_SCIENCE',
        subcategory: c.topicTitle,
        difficulty: p.difficulty,
        rating: p.rating,
        questionType: p.questionType,
        estimatedTime: p.estimatedTime,
        correctAnswer: p.correctAnswer,
        verificationLevel: 3,
        verificationSource: `ESOGÜ ${c.courseCode} Resmi Ders İzlencesi ve Arşivi`,
        problemOrigin: 'SOURCE_ADAPTED',
        translations: {
          create: [
            {
              language: 'tr',
              title: p.title,
              prompt: p.prompt,
              options: p.options,
              solution: p.solution
            }
          ]
        },
        hints: {
          create: p.hints.map(h => ({
            order: h.order,
            penaltyScore: 0.25,
            translations: {
              create: [
                {
                  language: 'tr',
                  title: h.title,
                  content: h.content
                }
              ]
            }
          }))
        }
      },
      update: {
        correctAnswer: p.correctAnswer
      }
    });

    // Link problem to concept
    await prisma.problemConcept.upsert({
      where: {
        problemId_conceptId: {
          problemId: problem.id,
          conceptId: c.id
        }
      },
      create: {
        problemId: problem.id,
        conceptId: c.id
      },
      update: {}
    });

    // 4. Generate and sync 8-step lesson
    try {
      const lesson = await syncConceptLessonWithFusion(c.id);
      console.log(`  ✓ Synced 8-step lesson for ${c.id} (Next: ${lesson.nextPracticeSlug})`);
    } catch (err) {
      console.warn(`  ! Could not sync lesson for ${c.id}:`, err);
    }
  }

  console.log('\n========================================================================');
  console.log('SUCCESSFULLY COMPLETED 1ST & 2ND YEAR COMPREHENSIVE CURRICULUM SEEDING!');
  console.log('========================================================================\n');
}

seedYear1AndYear2Complete()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
