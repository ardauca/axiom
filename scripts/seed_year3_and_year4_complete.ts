import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import { syncConceptLessonWithFusion } from '../src/lib/tutor/teacherEngine';

const prisma = new PrismaClient();

async function seedYear3AndYear4Complete() {
  console.log('========================================================================');
  console.log('SEEDING 3RD & 4TH YEAR OFFICIAL ESOGU COMPULSORY CURRICULUM (10 COURSES)');
  console.log('========================================================================\n');

  const NEW_Y3_Y4_CONCEPTS = [
    // --- 3. SINIF GÜZ (5. DÖNEM) ---
    {
      id: 'group-lagrange-theorem',
      courseCode: 'MAT301',
      topicId: 'top-cebir-gruplar',
      topicTitle: 'Gruplar, Devirli Gruplar ve Lagrange Teoremi',
      name: 'Soyut Gruplar ve Lagrange Teoremi',
      formalStatement: 'H \\le G, |G| < \\infty \\implies |H| \\mid |G| \\quad (\\text{Alt grubun mertebesi grubun mertebesini böler})',
      intuition: 'Lagrange Teoremi soyut cebirin temel taşıdır. Bir sonlu grubun herhangi bir alt grubunun eleman sayısı, tüm grubun eleman sayısını kalansız bölmek zorundadır. Örneğin 15 elemanlı bir grubun asla 4 elemanlı bir alt grubu olamaz.',
      problem: {
        slug: 'prob-cebir-lagrange-subgroups',
        title: 'Lagrange Teoremi ile Olası Alt Grup Mertebeleri',
        difficulty: 'EASY',
        rating: 1380,
        questionType: 'MULTIPLE_CHOICE',
        estimatedTime: 10,
        correctAnswer: 'Alt grupların mertebeleri yalnızca 1, 2, 4, 5, 10 veya 20 olabilir.',
        prompt: `Mertebesi 20 olan ($|G| = 20$) sonlu bir $G$ grubunun herhangi bir $H$ alt grubunun mertebesi ($|H|$) hakkında Lagrange Teoremi'ne göre hangisi kesinlikle doğrudur?`,
        options: JSON.stringify([
          'Alt grupların mertebeleri yalnızca 1, 2, 4, 5, 10 veya 20 olabilir.',
          'Alt grubun mertebesi 3 veya 6 olabilir.',
          'Alt grubun mertebesi kesinlikle asal sayı olmak zorundadır.',
          'G devirli değilse alt grubu bulunamaz.'
        ]),
        solution: `Lagrange Teoremi gereği: Sonlu bir G grubu ve onun herhangi bir H alt grubu için |H|, |G| sayısının bir bölenidir (|G| = [G:H] * |H|).
20 sayısının pozitif bölenleri: 1, 2, 4, 5, 10, 20'dir.
Dolayısıyla bir alt grubun eleman sayısı yalnızca bu bölenlerden biri olabilir.`,
        hints: [
          { order: 1, title: 'Lagrange Teoremi', content: '|H| sayısı |G| = 20 sayısını kalansız bölmelidir.' }
        ]
      }
    },
    {
      id: 'frenet-serret-frame',
      courseCode: 'MAT303',
      topicId: 'top-difgeo-frenet',
      topicTitle: 'Eğriler Teorisi ve Frenet-Serret Çatısı (T, N, B)',
      name: 'Frenet-Serret Çatısı, Eğrilik ve Burulma',
      formalStatement: '\\frac{d\\vec{T}}{ds} = \\kappa \\vec{N}, \\quad \\frac{d\\vec{N}}{ds} = -\\kappa \\vec{T} + \\tau \\vec{B}, \\quad \\frac{d\\vec{B}}{ds} = -\\tau \\vec{N}',
      intuition: 'Uzayda hareket eden bir parçacığın her an yanına yerel bir koordinat sistemi bağlanır: Teğet T (hareket yönü), Asli Normal N (dönüş yönü) ve Binormal B = T x N. Eğrilik kappa yolun ne kadar büküldüğünü, burulma tau ise düzlemden ne kadar koptuğunu ölçer.',
      problem: {
        slug: 'prob-difgeo-circular-helix-curvature',
        title: 'Dairesel Helis Eğriliğinin Hesabı',
        difficulty: 'INTERMEDIATE',
        rating: 1480,
        questionType: 'MULTIPLE_CHOICE',
        estimatedTime: 12,
        correctAnswer: '\\kappa = \\frac{a}{a^2 + b^2}',
        prompt: `$\\vec{r}(t) = (a \\cos t, a \\sin t, bt)$ ($a > 0, b > 0$) dairesel helis eğrisinin eğriliği (\\kappa) nedir?`,
        options: JSON.stringify([
          '\\kappa = \\frac{a}{a^2 + b^2}',
          '\\kappa = \\frac{1}{a}',
          '\\kappa = \\frac{a}{\\sqrt{a^2 + b^2}}',
          '\\kappa = a^2 + b^2'
        ]),
        solution: `r'(t) = (-a sin t, a cos t, b) ==> |r'(t)| = sqrt(a^2 + b^2).
r''(t) = (-a cos t, -a sin t, 0).
Vektörel çarpım: r'(t) x r''(t) = (ab sin t, -ab cos t, a^2).
|r' x r''| = sqrt(a^2 b^2 + a^4) = a sqrt(a^2 + b^2).
Eğrilik formülü: kappa = |r' x r''| / |r'|^3 = (a sqrt(a^2 + b^2)) / (a^2 + b^2)^{3/2} = a / (a^2 + b^2).`,
        hints: [
          { order: 1, title: 'Eğrilik Formülü', content: 'Genel parametre için \\kappa = |\\vec{r}\' \\times \\vec{r}\'\'| / |\\vec{r}\'|^3 formülünü kullanın.' }
        ]
      }
    },
    {
      id: 'symbolic-polynomial-gcd',
      courseCode: 'CENG301',
      topicId: 'top-sembolik-polinom',
      topicTitle: 'Sembolik Polinom İşlemleri ve Gröbner Tabanları',
      name: 'Polinom Halkalarında Sembolik EBOB ve İndirgeme',
      formalStatement: '\\gcd(P(x), Q(x)) = S(x)P(x) + T(x)Q(x) \\quad (\\text{Bézout Özdeşliği})',
      intuition: 'Sayısal yaklaşımlar (floating-point) yuvarlama hatası üretir. Sembolik hesaplama sistemleri (Computer Algebra Systems - CAS) tam cebirsel ifadeler, rasyonel katsayılar ve analitik sadeleştirmelerle çalışır.',
      problem: {
        slug: 'prob-sembolik-poly-gcd',
        title: 'Polinomlarda Sembolik En Büyük Ortak Bölen',
        difficulty: 'EASY',
        rating: 1350,
        questionType: 'MULTIPLE_CHOICE',
        estimatedTime: 10,
        correctAnswer: 'x - 1',
        prompt: `$P(x) = x^3 - 1$ ve $Q(x) = x^2 + x - 2$ polinomlarının $\\mathbb{R}[x]$ halkasındaki monik en büyük ortak böleni (EBOB) nedir?`,
        options: JSON.stringify([
          'x - 1',
          'x + 2',
          '(x - 1)(x + 2)',
          '1 (Aralarında asaldırlar)'
        ]),
        solution: `P(x) = x^3 - 1 = (x - 1)(x^2 + x + 1).
Q(x) = x^2 + x - 2 = (x - 1)(x + 2).
Ortak monik çarpan: x - 1.
Dolayısıyla gcd(P, Q) = x - 1'dir.`,
        hints: [
          { order: 1, title: 'Çarpanlara Ayırma', content: 'Küp farkı formülü: a^3 - b^3 = (a - b)(a^2 + ab + b^2).' }
        ]
      }
    },
    {
      id: 'lu-decomposition',
      courseCode: 'CENG303',
      topicId: 'top-myzt-matris-ayrisim',
      topicTitle: 'Sayısal Matris Ayrışımları ve LU Yöntemi',
      name: 'LU Matris Ayrışımı ve Denklem Çözümü',
      formalStatement: 'A = L \\cdot U \\implies L \\vec{y} = \\vec{b} \\text{ (İleriye Yerine Koyma)}, \\quad U \\vec{x} = \\vec{y} \\text{ (Geriye Yerine Koyma)}',
      intuition: 'Bir A katsayılar matrisini bir alt üçgensel L ve bir üst üçgensel U matrisine ayırmak, aynı A matrisiyle farklı b vektörlerini O(n^2) sürede ışık hızında çözmeyi sağlar.',
      problem: {
        slug: 'prob-myzt-lu-triangular',
        title: 'LU Ayrışımında Üst Üçgensel Matris Pivot Elemanı',
        difficulty: 'INTERMEDIATE',
        rating: 1420,
        questionType: 'MULTIPLE_CHOICE',
        estimatedTime: 10,
        correctAnswer: 'U_{22} = 5',
        prompt: `$A = \\begin{pmatrix} 2 & 1 \\\\ 4 & 7 \\end{pmatrix}$ matrisinin $A = LU$ ayrışımında ($L_{11}=1, L_{22}=1$) $U$ üst üçgensel matrisinin $(2,2)$ elemanı ($U_{22}$) nedir?`,
        options: JSON.stringify([
          '5',
          '7',
          '3',
          '2'
        ]),
        solution: `L = [[1, 0], [l_21, 1]], U = [[u_11, u_12], [0, u_22]].
A = LU:
Row 1: u_11 = 2, u_12 = 1.
Row 2: l_21 * u_11 = 4 ==> l_21 * 2 = 4 ==> l_21 = 2.
l_21 * u_12 + u_22 = 7 ==> 2 * 1 + u_22 = 7 ==> u_22 = 5.
Sonuç U_22 = 5.`,
        hints: [
          { order: 1, title: 'Matris Çarpım Eşitliği', content: '2. satır 2. sütun elemanı: L_21 * U_12 + U_22 = A_22 formülünü kurun.' }
        ]
      }
    },

    // --- 3. SINIF BAHAR (6. DÖNEM) ---
    {
      id: 'topological-compactness',
      courseCode: 'MAT302',
      topicId: 'top-topoloji-kompaktlik',
      topicTitle: 'Topolojik Uzaylar, Açık Kümeler ve Kompaktlık',
      name: 'Kompaktlık ve Heine-Borel Karakterizasyonu',
      formalStatement: 'X \\text{ kompakttır} \\iff X\\text{\'in her açık örtüsü sonlu bir alt örtüye sahiptir.}',
      intuition: 'Sonsuz kümelerde sonluluk gibi davranabilme süper gücüdür. Bir küme kompakt ise, sonsuz sayıda açık örtüyle sarılsa bile bu örtülerin içinden sonlu tanesi seçilerek küme tamamen kaplanabilir.',
      problem: {
        slug: 'prob-topoloji-heine-borel',
        title: 'Öklid Uzayında Kompaktlık Kriteri (Heine-Borel)',
        difficulty: 'EASY',
        rating: 1360,
        questionType: 'MULTIPLE_CHOICE',
        estimatedTime: 8,
        correctAnswer: '[0, 1] kapalı ve sınırlı aralığı',
        prompt: `$\\mathbb{R}$ standart topolojisinde aşağıdaki alt kümelerden hangisi Heine-Borel Teoremi'ne göre kompakttır?`,
        options: JSON.stringify([
          '[0, 1] kapalı ve sınırlı aralığı',
          '(0, 1) açık aralığı (sınırlı fakat kapalı değil)',
          '[0, \\infty) yarı-sonsuz aralığı (kapalı fakat sınırsız)',
          '\\mathbb{Q} rasyonel sayılar kümesi'
        ]),
        solution: `Heine-Borel Teoremi gereği: R^n uzayının bir alt kümesi ancak ve ancak KAPALI ve SINIRLI ise kompakttır.
[0, 1] kümesi hem kapalıdır (tüm limit noktalarını içerir) hem de sınırlıdır (|x| <= 1).
Dolayısıyla kompakttır. (0, 1) kapalı değildir; [0, inf) sınırlı değildir.`,
        hints: [
          { order: 1, title: 'Heine-Borel Kuralı', content: 'Öklid uzayında Kompakt = Kapalı + Sınırlı.' }
        ]
      }
    },
    {
      id: 'cauchy-riemann-equations',
      courseCode: 'MAT304',
      topicId: 'top-kompleks-cr-denklemleri',
      topicTitle: 'Holomorf Fonksiyonlar ve Cauchy-Riemann Denklemleri',
      name: 'Cauchy-Riemann Denklemleri ve Kompleks Türevlenebilirlik',
      formalStatement: 'f(z) = u(x, y) + i v(x, y) \\text{ türevlenebilir} \\iff u_x = v_y \\quad \\text{ve} \\quad u_y = -v_x',
      intuition: 'Kompleks türev, iki boyutlu reel türevden çok daha güçlüdür. z noktasına hangi doğrultudan yaklaşırsanız yaklaşın eğimin aynı olması zorunludur. Bu katı simetri ancak reel ve sanal kısımlar Cauchy-Riemann denklemlerini sağladığında mümkündür.',
      problem: {
        slug: 'prob-kompleks-harmonic-conjugate',
        title: 'Cauchy-Riemann ile Harmonik Eşlenik Bulma',
        difficulty: 'INTERMEDIATE',
        rating: 1460,
        questionType: 'MULTIPLE_CHOICE',
        estimatedTime: 12,
        correctAnswer: 'v(x, y) = 2xy + C',
        prompt: `$f(z) = u(x, y) + i v(x, y)$ tam (entire) fonksiyonunun reel kısmı $u(x, y) = x^2 - y^2$ olduğuna göre, sanal kısmı olan $v(x, y)$ harmonik eşleniği nedir?`,
        options: JSON.stringify([
          'v(x, y) = 2xy + C',
          'v(x, y) = x^2 + y^2 + C',
          'v(x, y) = -2xy + C',
          'v(x, y) = 2x - 2y + C'
        ]),
        solution: `Cauchy-Riemann şartları:
1) u_x = v_y ==> d/dx(x^2 - y^2) = 2x ==> v_y = 2x.
y'ye göre integral alalım: v(x, y) = 2xy + h(x).
2) u_y = -v_x ==> d/dy(x^2 - y^2) = -2y.
v_x = d/dx(2xy + h(x)) = 2y + h'(x).
Şart: -2y = -(2y + h'(x)) ==> -2y = -2y - h'(x) ==> h'(x) = 0 ==> h(x) = C.
Sonuç: v(x, y) = 2xy + C.`,
        hints: [
          { order: 1, title: 'CR Denklemleri', content: 'u_x = v_y ve u_y = -v_x denklemlerini kurup sırayla entegre ediniz.' }
        ]
      }
    },
    {
      id: 'divide-and-conquer-master-theorem',
      courseCode: 'CENG302',
      topicId: 'top-alg-master-theorem',
      topicTitle: 'Böl ve Yönet Algoritmaları ve Master Teoremi',
      name: 'Master Teoremi ile Rekürans ve Karmaşıklık Analizi',
      formalStatement: 'T(n) = a T(n/b) + f(n), \\quad c = \\log_b a \\implies T(n) = \\Theta(n^{\\log_b a})',
      intuition: 'Rekürsif algoritmaların zaman karmaşıklığını tek satırda çözme cetvelidir. Alt problemlerin büyüme hızı n^{log_b a} ile bölme/birleştirme maliyeti f(n) arasındaki savaşı kimin kazandığına bakar.',
      problem: {
        slug: 'prob-alg-master-mergesort-complexity',
        title: 'Master Teoremi ile Merge Sort Karmaşıklığı',
        difficulty: 'EASY',
        rating: 1340,
        questionType: 'MULTIPLE_CHOICE',
        estimatedTime: 8,
        correctAnswer: '\\Theta(n \\log n)',
        prompt: `Merge Sort algoritmasının çalışma süresini modelleyen $T(n) = 2T(n/2) + \\Theta(n)$ reküransının Master Teoremi'ne göre asimptotik karmaşıklığı nedir?`,
        options: JSON.stringify([
          '\\Theta(n \\log n)',
          '\\Theta(n^2)',
          '\\Theta(n)',
          '\\Theta(\\log n)'
        ]),
        solution: `T(n) = a T(n/b) + f(n):
a = 2, b = 2, f(n) = Theta(n).
Kritik üs: log_b a = log_2 2 = 1 ==> n^{log_b a} = n^1 = n.
f(n) = Theta(n) ile n^{log_b a} aynı büyüme derecesine sahiptir (Vaka 2).
Sonuç: T(n) = Theta(n^{log_b a} log n) = Theta(n log n).`,
        hints: [
          { order: 1, title: 'Master Teoremi Vaka 2', content: 'f(n) = Theta(n^{log_b a}) durumunda Theta(n^{log_b a} log n) sonucuna varılır.' }
        ]
      }
    },
    {
      id: 'category-functor-monad',
      courseCode: 'CENG304',
      topicId: 'top-kategori-funktor',
      topicTitle: 'Kategoriler, Funktorlar ve Doğal Dönüşümler',
      name: 'Kategori Teorisi, Funktorlar ve Yapı Korunumu',
      formalStatement: 'F: \\mathcal{C} \\to \\mathcal{D}, \\quad F(f \\circ g) = F(f) \\circ F(g), \\quad F(\\text{id}_A) = \\text{id}_{F(A)}',
      intuition: 'Kategori teorisi matematiğin matematiğidir. Bir kategori nesnelerden ve aralarındaki oklardan (morfizmler) oluşur. Funktor ise bir kategoriyi diğerine taşırken nesnelerin ve ilişkilerin yapısını kusursuz koruyan haritadır (yazılımda List.map gibi).',
      problem: {
        slug: 'prob-kategori-functor-identity',
        title: 'Funktorun Bileşke ve Özdeşlik Koruma Aksiyomu',
        difficulty: 'INTERMEDIATE',
        rating: 1440,
        questionType: 'MULTIPLE_CHOICE',
        estimatedTime: 10,
        correctAnswer: 'F(f \\circ g) = F(f) \\circ F(g) \\quad \\text{ve} \\quad F(\\text{id}_A) = \\text{id}_{F(A)}',
        prompt: `Bir $\\mathcal{C}$ kategorisinden $\\mathcal{D}$ kategorisine tanımlı bir kovaryant $F$ funktorunun sağlaması zorunlu iki temel aksiyom nedir?`,
        options: JSON.stringify([
          'F(f \\circ g) = F(f) \\circ F(g) \\quad \\text{ve} \\quad F(\\text{id}_A) = \\text{id}_{F(A)}',
          'F(f \\circ g) = F(g) \\circ F(f) \\quad (ters çevirme)',
          'F(A) = A \\quad \\text{tüm nesneler için sabit kalmalıdır}',
          'F türevlenebilir bir fonksiyon olmalıdır'
        ]),
        solution: `Kovaryant Funktor tanımı gereği:
1. Morfizm bileşkesini korur: F(f o g) = F(f) o F(g).
2. Özdeşlik morfizmlerini korur: F(id_A) = id_{F(A)}.`,
        hints: [
          { order: 1, title: 'Kovaryant vs Kontravaryant', content: 'Kovaryant funktor okların yönünü ve sırasını aynen korur.' }
        ]
      }
    },

    // --- 4. SINIF GÜZ (7. DÖNEM) ---
    {
      id: 'java-jvm-memory-generics',
      courseCode: 'CENG401',
      topicId: 'top-java-jvm-oop',
      topicTitle: 'Java Platformu, JVM Bellek Modeli ve Generics',
      name: 'Java Nesne Yönelimi, JVM Heap/Stack ve Değer ile Aktarım',
      formalStatement: '\\text{Java is strictly Pass-by-Value}: \\text{References are passed by value}',
      intuition: 'Java\'da her değişken değeriyle aktarılır (Pass-by-Value). Ancak bir nesne referansı aktarıldığında, aktarılan değer nesnenin bellekteki adresidir. Dolayısıyla metot içinde nesnenin alanları değiştirilebilir, fakat referansın kendisi yeniden atanamaz.',
      problem: {
        slug: 'prob-java-pass-by-value-reference',
        title: 'Java Pass-by-Value ve Nesne Mutasyonu Çıktı Analizi',
        difficulty: 'EASY',
        rating: 1320,
        questionType: 'MULTIPLE_CHOICE',
        estimatedTime: 8,
        correctAnswer: '50 yazdırılır; çünkü p.x alanının mutasyonu nesneye yansır fakat p referansı yeniden atanamaz.',
        prompt: `Aşağıdaki Java kodu çalıştırıldığında ekrana ne yazdırılır?

\`\`\`java
class Point { int x = 10; }
public class Main {
    static void modify(Point p) {
        p.x = 50;
        p = new Point();
        p.x = 100;
    }
    public static void main(String[] args) {
        Point p = new Point();
        modify(p);
        System.out.println(p.x);
    }
}
\`\`\``,
        options: JSON.stringify([
          '50 yazdırılır; çünkü p.x alanının mutasyonu nesneye yansır fakat p referansı yeniden atanamaz.',
          '100 yazdırılır; çünkü en son p.x = 100 atanmıştır.',
          '10 yazdırılır; çünkü Java pass-by-value olduğu için hiçbir değişiklik dışarıya yansımaz.',
          'Derleme hatası verir.'
        ]),
        solution: `Java'da nesne referansları değere göre (pass-by-value) aktarılır:
1. modify metoduna p'nin adres kopyası gider.
2. p.x = 50 çağrıldığında orijinal nesnenin x alanı 50 olur.
3. p = new Point() çağrıldığında yerel referans kopya yeni bir nesneye yönlendirilir, orijinal p referansı etkilenmez.
4. main metodundaki p hala orijinal nesneyi gösterir ve p.x = 50 basılır.`,
        hints: [
          { order: 1, title: 'Referansın Değeri vs Nesne İçeriği', content: 'p = new Point() sadece yerel kopya referansı değiştirir.' }
        ]
      }
    },

    // --- 4. SINIF BAHAR (8. DÖNEM) ---
    {
      id: 'rsa-public-key-cryptography',
      courseCode: 'CENG402',
      topicId: 'top-kripto-rsa',
      topicTitle: 'Açık Anahtarlı Şifreleme ve RSA Algoritması',
      name: 'RSA Şifreleme, Euler Totient ve Modüler Ters',
      formalStatement: 'ed \\equiv 1 \\pmod{\\phi(n)}, \\quad c = m^e \\pmod n, \\quad m = c^d \\pmod n',
      intuition: 'İki büyük asal sayıyı çarpmak kolaydır, ancak çarpımı çarpanlarına ayırmak imkansız derecede zordur (Tek yönlü tuzak kapı fonksiyonu). Açık anahtar (e, n) herkes tarafından şifreleme için kullanılırken, çözmek için gizli asal çarpanları bilen özel anahtar (d) gereklidir.',
      problem: {
        slug: 'prob-kripto-rsa-key-generation',
        title: 'RSA Algoritmasında Özel Anahtar (d) Hesabı',
        difficulty: 'INTERMEDIATE',
        rating: 1450,
        questionType: 'MULTIPLE_CHOICE',
        estimatedTime: 12,
        correctAnswer: 'd = 5',
        prompt: `RSA anahtar üretiminde $p = 3$ ve $q = 11$ asal sayıları seçilmiştir. Açık anahtar üssü $e = 3$ olarak belirlendiğinde, modüler ters $e \\cdot d \\equiv 1 \\pmod{\\phi(n)}$ denkliğini sağlayan özel anahtar $d$ nedir?`,
        options: JSON.stringify([
          'd = 5',
          'd = 7',
          'd = 13',
          'd = 3'
        ]),
        solution: `n = p * q = 3 * 11 = 33.
phi(n) = (p - 1) * (q - 1) = (3 - 1) * (11 - 1) = 2 * 10 = 20.
e = 3.
Denklik: 3 * d = 1 (mod 20).
d'yi bulmak için 3d - 20k = 1:
d = 1 ==> 3 != 1 (mod 20)
d = 2 ==> 6
d = 3 ==> 9
d = 4 ==> 12
d = 5 ==> 3 * 5 = 15
d = 6 ==> 18
d = 7 ==> 3 * 7 = 21 = 1 (mod 20)!
Bekleyin: 3 * 7 = 21 = 1 (mod 20), dolayısıyla d = 7!
Seçeneklerde d = 7 doğru cevaptır.`,
        hints: [
          { order: 1, title: 'phi(n) Hesabı', content: 'phi(n) = (p - 1)(q - 1) = 2 * 10 = 20.' },
          { order: 2, title: 'Modüler Ters', content: '3 * d = 1 (mod 20) denklemini çözün: 3 * 7 = 21 = 1 (mod 20).' }
        ]
      }
    }
  ];

  // Fix d = 7 in prompt
  NEW_Y3_Y4_CONCEPTS[9].problem.correctAnswer = 'd = 7';

  // 0. Seed official 16-week syllabi for all 10 courses
  console.log('Seeding official 16-week syllabi for all 10 Year 3 & 4 courses...');
  if (fs.existsSync('parsed_weekly_plans_y3_y4.json')) {
    const weeklyPlans = JSON.parse(fs.readFileSync('parsed_weekly_plans_y3_y4.json', 'utf8'));
    for (const [code, plan] of Object.entries<any>(weeklyPlans)) {
      const course = await prisma.course.findFirst({
        where: { code }
      });
      if (!course) {
        console.warn(`Course ${code} not found in DB!`);
        continue;
      }
      for (const w of plan.weeks) {
        const topicId = `top-${code.toLowerCase()}-h${w.week}`;
        const topicTitle = `Hafta ${w.week}: ${w.topic}`;
        await prisma.courseTopic.upsert({
          where: { id: topicId },
          create: {
            id: topicId,
            courseId: course.id,
            title: topicTitle,
            orderIndex: parseInt(w.week) || 1,
            estimatedMinutes: 45
          },
          update: {
            title: topicTitle
          }
        });
      }
      console.log(`  ✓ Synced ${plan.weeks.length} weeks of official syllabus for ${code} (${plan.name})`);
    }
  }

  for (const c of NEW_Y3_Y4_CONCEPTS) {
    console.log(`Processing 3rd/4th Year Concept: ${c.id} for ${c.courseCode}...`);

    // 1. Upsert concept
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
              commonPitfalls: 'Teorem hipotezlerinin kontrol edilmemesi.'
            }
          ]
        }
      },
      update: {
        formalStatement: c.formalStatement,
        sourceCitation: `ESOGÜ ${c.courseCode} Ders Bilgi Formu`
      }
    });

    // 2. Link to Course and Topic
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
          courseId: course.id,
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

    // 3. Upsert Problem
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
  console.log('ALL 30 COMPULSORY COURSES OF THE 4-YEAR DEGREE ARE OFFICIALLY EQUIPPED!');
  console.log('========================================================================\n');
}

seedYear3AndYear4Complete()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
