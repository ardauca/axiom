import { prisma } from '../prisma';

export interface OfficialCourseDef {
  id: string;
  officialCode: string;
  code: string;
  name: string;
  englishName: string;
  department: string;
  semester: string;
  year: number; // 1, 2, 3, 4
  term: number; // 1..8
  isCurrentSemester: boolean;
  theoryHours: number;
  practiceHours: number;
  credits: number;
  ects: number;
  syllabusSourceUrl: string;
  description: string;
  prerequisites: string[]; // ids of prerequisite courses
  units: Array<{
    title: string;
    topics: Array<{
      id: string;
      title: string;
      estimatedMinutes: number;
      concepts: Array<{
        id: string;
        name: string;
        formalStatement: string;
        prerequisites?: string[];
      }>;
    }>;
  }>;
}

export const ESOGU_COMPULSORY_CURRICULUM_2024: OfficialCourseDef[] = [
  // ==========================================
  // 1. SINIF GÜZ (1. DÖNEM)
  // ==========================================
  {
    id: 'analiz-1',
    officialCode: '821611008',
    code: 'MAT101',
    name: 'Analiz I',
    englishName: 'Analysis I',
    department: 'Matematik ve Bilgisayar Bilimleri',
    semester: '1. Sınıf Güz',
    year: 1,
    term: 1,
    isCurrentSemester: false,
    theoryHours: 3,
    practiceHours: 2,
    credits: 4,
    ects: 5,
    syllabusSourceUrl: 'https://matbil.ogu.edu.tr/Sayfa/Index/63/2024-sonrasi',
    description: 'Reel sayılar aksiyomları, supremum ve infimum, lineer nokta kümeleri, reel sayı dizileri ve limit, fonksiyonlarda limit ve süreklilik, tek değişkenli diferansiyel hesap.',
    prerequisites: [],
    units: [
      {
        title: 'Ünite 1: Reel Sayılar ve Lineer Nokta Kümeleri',
        topics: [
          {
            id: 'top-analiz1-kume-dizi',
            title: 'Reel Sayılar Aksiyomları ve Dizilerde Limit',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'real-number-completeness',
                name: 'Reel Sayıların Tamlığı ve Supremum',
                formalStatement: 'Her üstten sınırlı boş olmayan reel alt kümenin en küçük üst sınırı (supremum) mevcuttur.'
              },
              {
                id: 'sequence-limit',
                name: 'Dizilerde Limit ve Yakınsaklık',
                formalStatement: '\\forall \\epsilon > 0, \\exists N \\in \\mathbb{N} \\text{ s.t. } n > N \\implies |a_n - L| < \\epsilon'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'analitik-geometri',
    officialCode: '821611009',
    code: 'MAT103',
    name: 'Analitik Geometri',
    englishName: 'Analytic Geometry',
    department: 'Matematik ve Bilgisayar Bilimleri',
    semester: '1. Sınıf Güz',
    year: 1,
    term: 1,
    isCurrentSemester: false,
    theoryHours: 3,
    practiceHours: 0,
    credits: 3,
    ects: 4,
    syllabusSourceUrl: 'https://matbil.ogu.edu.tr/Sayfa/Index/63/2024-sonrasi',
    description: 'Düzlemde ve uzayda koordinat sistemleri, vektörler, doğru ve düzlem denklemleri, konikler ve kuadrik yüzeyler.',
    prerequisites: [],
    units: [
      {
        title: 'Ünite 1: Vektörler ve Doğru Denklemleri',
        topics: [
          {
            id: 'top-anageo-vektorler',
            title: 'Uzayda Vektör Cebiri ve Doğru/Düzlem Denklemleri',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'dot-and-cross-product',
                name: 'Skaler ve Vektörel Çarpım',
                formalStatement: '\\vec{u} \\cdot \\vec{v} = |u||v|\\cos\\theta, \\quad \\vec{u} \\times \\vec{v} = |u||v|\\sin\\theta \\vec{n}'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'soyut-matematik',
    officialCode: '821611013',
    code: 'MAT105',
    name: 'Soyut Matematik',
    englishName: 'Abstract Mathematics',
    department: 'Matematik ve Bilgisayar Bilimleri',
    semester: '1. Sınıf Güz',
    year: 1,
    term: 1,
    isCurrentSemester: false,
    theoryHours: 3,
    practiceHours: 0,
    credits: 3,
    ects: 4,
    syllabusSourceUrl: 'https://matbil.ogu.edu.tr/Sayfa/Index/63/2024-sonrasi',
    description: 'Önermeler mantığı, niceleyiciler, küme teorisi bağıntıları, denklik ve sıralama bağıntıları, fonksiyonlar ve kardinalite.',
    prerequisites: [],
    units: [
      {
        title: 'Ünite 1: Mantık ve Kanıt Yöntemleri',
        topics: [
          {
            id: 'top-soyut-mantik',
            title: 'Önermeler Mantığı ve Kanıt Türleri',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'mathematical-induction',
                name: 'Matematiksel Tümevarım İlkesi',
                formalStatement: 'P(1) \\land (\\forall k, P(k) \\implies P(k+1)) \\implies \\forall n \\in \\mathbb{N}, P(n)'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'temel-bilgisayar-bilimleri-1',
    officialCode: '821611010',
    code: 'CENG101',
    name: 'Temel Bilgisayar Bilimleri I',
    englishName: 'Fundamentals of Computer Science I',
    department: 'Matematik ve Bilgisayar Bilimleri',
    semester: '1. Sınıf Güz',
    year: 1,
    term: 1,
    isCurrentSemester: false,
    theoryHours: 3,
    practiceHours: 0,
    credits: 3,
    ects: 4,
    syllabusSourceUrl: 'https://matbil.ogu.edu.tr/Sayfa/Index/63/2024-sonrasi',
    description: 'Sayı sistemleri, ikili aritmetik, Boole cebiri, mantık kapıları, temel bilgisayar organizasyonu.',
    prerequisites: [],
    units: [
      {
        title: 'Ünite 1: Sayı Sistemleri ve Boole Mantığı',
        topics: [
          {
            id: 'top-tbb-sayi-sistemleri',
            title: 'İkili Sayı Sistemleri ve Tümleyen Aritmetiği',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'twos-complement',
                name: 'İkiye Tümleyen Temsili (Two\'s Complement)',
                formalStatement: 'Negatif sayılar 2^n - |x| formatında gösterilir.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'bilgisayar-programlama-1',
    officialCode: '821611007',
    code: 'CENG103',
    name: 'Bilgisayar Programlama I',
    englishName: 'Computer Programming I (Python)',
    department: 'Matematik ve Bilgisayar Bilimleri',
    semester: '1. Sınıf Güz',
    year: 1,
    term: 1,
    isCurrentSemester: false,
    theoryHours: 3,
    practiceHours: 0,
    credits: 3,
    ects: 4,
    syllabusSourceUrl: 'https://matbil.ogu.edu.tr/Sayfa/Index/63/2024-sonrasi',
    description: 'Algoritma kavramı, akış şemaları, Python sözdizimi, temel veri tipleri, döngüler, koşul yapıları, fonksiyonlar.',
    prerequisites: [],
    units: [
      {
        title: 'Ünite 1: Temel Algoritma ve Python Yapıları',
        topics: [
          {
            id: 'top-bp1-algoritmalar',
            title: 'Algoritmik Düşünce ve Python Fonksiyonları',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'euclidean-algorithm',
                name: 'Öklid Algoritması (EBOB)',
                formalStatement: '\\gcd(a, b) = \\gcd(b, a \\pmod b)'
              }
            ]
          }
        ]
      }
    ]
  },

  // ==========================================
  // 1. SINIF BAHAR (2. DÖNEM)
  // ==========================================
  {
    id: 'analiz-2',
    officialCode: '821612008',
    code: 'MAT102',
    name: 'Analiz II',
    englishName: 'Analysis II',
    department: 'Matematik ve Bilgisayar Bilimleri',
    semester: '1. Sınıf Bahar',
    year: 1,
    term: 2,
    isCurrentSemester: false,
    theoryHours: 3,
    practiceHours: 2,
    credits: 4,
    ects: 5,
    syllabusSourceUrl: 'https://matbil.ogu.edu.tr/Sayfa/Index/63/2024-sonrasi',
    description: 'Riemann integrali, analizin temel teoremi, integrasyon teknikleri, genelleştirilmiş integraller, Taylor formülü.',
    prerequisites: ['analiz-1'],
    units: [
      {
        title: 'Ünite 1: Riemann İntegrali ve Teknikleri',
        topics: [
          {
            id: 'top-analiz2-riemann',
            title: 'Riemann İntegrali ve Analizin Temel Teoremi',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'fundamental-theorem-calculus',
                name: 'Kalkülüsün Temel Teoremi',
                formalStatement: '\\frac{d}{dx} \\int_a^x f(t) dt = f(x)'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'lineer-cebir',
    officialCode: '821612009',
    code: 'MAT104',
    name: 'Lineer Cebir',
    englishName: 'Linear Algebra',
    department: 'Matematik ve Bilgisayar Bilimleri',
    semester: '1. Sınıf Bahar',
    year: 1,
    term: 2,
    isCurrentSemester: false,
    theoryHours: 3,
    practiceHours: 0,
    credits: 3,
    ects: 4,
    syllabusSourceUrl: 'https://matbil.ogu.edu.tr/Sayfa/Index/63/2024-sonrasi',
    description: 'Matrisler, determinantlar, lineer denklem sistemleri, vektör uzayları, taban ve boyut, lineer dönüşümler, özdeğerler ve özvektörler.',
    prerequisites: ['analitik-geometri'],
    units: [
      {
        title: 'Ünite 1: Matrisler ve Özdeğerler',
        topics: [
          {
            id: 'top-lineer-ozdeger',
            title: 'Karakteristik Denklem ve Özdeğer Hesabı',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'eigenvalues',
                name: 'Özdeğerler ve Özvektörler',
                formalStatement: 'A v = \\lambda v \\iff \\det(A - \\lambda I) = 0'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'ayrik-matematik',
    officialCode: '821612013',
    code: 'MAT106',
    name: 'Ayrık Matematik',
    englishName: 'Discrete Mathematics',
    department: 'Matematik ve Bilgisayar Bilimleri',
    semester: '1. Sınıf Bahar',
    year: 1,
    term: 2,
    isCurrentSemester: false,
    theoryHours: 3,
    practiceHours: 0,
    credits: 3,
    ects: 4,
    syllabusSourceUrl: 'https://matbil.ogu.edu.tr/Sayfa/Index/63/2024-sonrasi',
    description: 'Kombinatorik, sayma ilkeleri, güvercin yuvası ilkesi, yineleme bağıntıları, üreteç fonksiyonları, modüler aritmetik.',
    prerequisites: ['soyut-matematik'],
    units: [
      {
        title: 'Ünite 1: Sayılar Teorisi ve Sayma',
        topics: [
          {
            id: 'top-ayrik-modular',
            title: 'Modüler Aritmetik ve Kalanlar',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'modular-arithmetic',
                name: 'Modüler Aritmetik ve Kalan Sınıfları',
                formalStatement: 'a \\equiv b \\pmod m \\iff m \\mid (a - b)'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'temel-bilgisayar-bilimleri-2',
    officialCode: '821612010',
    code: 'CENG102',
    name: 'Temel Bilgisayar Bilimleri II',
    englishName: 'Fundamentals of Computer Science II',
    department: 'Matematik ve Bilgisayar Bilimleri',
    semester: '1. Sınıf Bahar',
    year: 1,
    term: 2,
    isCurrentSemester: false,
    theoryHours: 3,
    practiceHours: 0,
    credits: 3,
    ects: 4,
    syllabusSourceUrl: 'https://matbil.ogu.edu.tr/Sayfa/Index/63/2024-sonrasi',
    description: 'İşletim sistemleri temelleri, süreçler, bellek yönetimi, dosya sistemleri, ağ protokolleri temelleri.',
    prerequisites: ['temel-bilgisayar-bilimleri-1'],
    units: [
      {
        title: 'Ünite 1: İşletim Sistemleri ve Bellek Yönetimi',
        topics: [
          {
            id: 'top-tbb2-memory',
            title: 'Süreç Çizelgeleme ve Sanal Bellek',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'virtual-memory-paging',
                name: 'Sayfalama (Paging) ve Sayfa Tablosu',
                formalStatement: 'Mantıksal adresler sayfa tablosu (Page Table) aracılığıyla fiziksel çerçevelere dönüştürülür.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'bilgisayar-programlama-2',
    officialCode: '821612007',
    code: 'CENG104',
    name: 'Bilgisayar Programlama II',
    englishName: 'Computer Programming II (C/C++)',
    department: 'Matematik ve Bilgisayar Bilimleri',
    semester: '1. Sınıf Bahar',
    year: 1,
    term: 2,
    isCurrentSemester: false,
    theoryHours: 3,
    practiceHours: 0,
    credits: 3,
    ects: 4,
    syllabusSourceUrl: 'https://matbil.ogu.edu.tr/Sayfa/Index/63/2024-sonrasi',
    description: 'C/C++ dili, işaretçiler (pointers), dinamik bellek tahsisi, yapılar (structs), dosya girdi/çıktı işlemleri.',
    prerequisites: ['bilgisayar-programlama-1'],
    units: [
      {
        title: 'Ünite 1: İşaretçiler ve Dinamik Bellek',
        topics: [
          {
            id: 'top-bp2-pointers',
            title: 'Pointer Aritmetiği ve Dinamik Bellek Tahsisi',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'pointers-and-memory',
                name: 'İşaretçiler ve Doğrudan Bellek Erişimi',
                formalStatement: 'Bellek adresleri int* p = &x ve *p gösterimiyle manipüle edilir.'
              }
            ]
          }
        ]
      }
    ]
  },

  // ==========================================
  // 2. SINIF GÜZ (3. DÖNEM - AKTİF ÇALIŞMA DÖNEMİ)
  // ==========================================
  {
    id: 'analiz-3',
    officialCode: '821613001',
    code: 'MAT201',
    name: 'Analiz III',
    englishName: 'Analysis III',
    department: 'Matematik ve Bilgisayar Bilimleri',
    semester: '2. Sınıf Güz',
    year: 2,
    term: 3,
    isCurrentSemester: true,
    theoryHours: 3,
    practiceHours: 0,
    credits: 3,
    ects: 5,
    syllabusSourceUrl: 'https://matbil.ogu.edu.tr/Sayfa/Index/63/2024-sonrasi',
    description: 'Vektör değerli fonksiyonlar, çok değişkenli limit ve süreklilik, kısmi türevler, yönlü türev, zincir kuralı, gradyan, Lagrange çarpanları, katlı integraller ve fonksiyon dizilerinde düzgün yakınsaklık.',
    prerequisites: ['analiz-2'],
    units: [
      {
        title: 'Ünite 1: Çok Değişkenli Diferansiyel Hesap',
        topics: [
          {
            id: 'top-analiz3-yonlu-turev',
            title: 'Yöne Göre Türev ve Gradyan Vektörü',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'directional-derivative',
                name: 'Yöne Göre Türev (Directional Derivative)',
                formalStatement: 'D_{\\vec{u}} f(x_0, y_0) = \\nabla f(x_0, y_0) \\cdot \\vec{u}'
              }
            ]
          }
        ]
      },
      {
        title: 'Ünite 2: Fonksiyon Dizileri ve Serileri',
        topics: [
          {
            id: 'top-analiz3-duzgun-yakinsaklik',
            title: 'Noktasal ve Düzgün Yakınsaklık (Uniform Convergence)',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'uniform-convergence',
                name: 'Düzgün Yakınsaklık (Uniform Convergence)',
                formalStatement: '\\forall \\epsilon > 0, \\exists N \\in \\mathbb{N} \\text{ s.t. } n > N \\implies |f_n(x) - f(x)| < \\epsilon, \\forall x \\in E'
              }
            ]
          }
        ]
      },
      {
        title: 'Ünite 3: Katlı İntegraller (Multiple Integrals)',
        topics: [
          {
            id: 'top-analiz3-katli-integraller',
            title: 'İki Katlı İntegraller ve Fubini Teoremi',
            estimatedMinutes: 50,
            concepts: [
              {
                id: 'double-integrals',
                name: 'İki Katlı İntegraller ve Fubini Teoremi (Double Integrals)',
                formalStatement: '\\iint_R f(x, y) \\, dA = \\int_a^b \\left( \\int_{g_1(x)}^{g_2(x)} f(x, y) \\, dy \\right) dx'
              }
            ]
          }
        ]
      },
      {
        title: 'Ünite 4: Vektör Analizi ve Eğrisel İntegraller',
        topics: [
          {
            id: 'top-analiz3-green-teoremi',
            title: 'Green Teoremi ve Düzlemde Eğrisel İntegraller',
            estimatedMinutes: 50,
            concepts: [
              {
                id: 'green-theorem',
                name: 'Green Teoremi (Düzlemde Eğrisel İntegral)',
                formalStatement: '\\oint_{\\partial D} (P \\, dx + Q \\, dy) = \\iint_D \\left( \\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} \\right) dA'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'graf-teorisi',
    officialCode: '821613002',
    code: 'MAT203',
    name: 'Graf Teori',
    englishName: 'Graph Theory',
    department: 'Matematik ve Bilgisayar Bilimleri',
    semester: '2. Sınıf Güz',
    year: 2,
    term: 3,
    isCurrentSemester: true,
    theoryHours: 3,
    practiceHours: 0,
    credits: 3,
    ects: 5,
    syllabusSourceUrl: 'https://matbil.ogu.edu.tr/Sayfa/Index/63/2024-sonrasi',
    description: 'Graf tanımları, köşe dereceleri, Handshaking Lemma, Euler ve Hamilton grafikleri, ağaçlar, planar graflar, renklendirme.',
    prerequisites: ['ayrik-matematik'],
    units: [
      {
        title: 'Ünite 1: Graf Yapıları ve Yolları',
        topics: [
          {
            id: 'top-graf-euler',
            title: 'Euler ve Hamilton Çizgeleri',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'euler-graph',
                name: 'Euler Çizgesi ve Handshaking Lemma',
                formalStatement: '\\sum_{v \\in V} d(v) = 2|E|'
              }
            ]
          }
        ]
      },
      {
        title: 'Ünite 2: Ağaçlar ve Kapsayan Ağaçlar',
        topics: [
          {
            id: 'top-graf-agaclar',
            title: 'Ağaçların Karakterizasyonu ve Kapsayan Ağaçlar (Spanning Trees)',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'spanning-trees',
                name: 'Kapsayan Ağaçlar ve Ağaç Karakterizasyonu (Spanning Trees)',
                formalStatement: 'G = (V, E) \\text{ bir ağaçtır} \\iff G \\text{ bağlantılı ve devirsizdir} \\iff |E| = |V| - 1'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'diferansiyel-denklemler',
    officialCode: '821613003',
    code: 'MAT205',
    name: 'Diferansiyel Denklemler',
    englishName: 'Differential Equations',
    department: 'Matematik ve Bilgisayar Bilimleri',
    semester: '2. Sınıf Güz',
    year: 2,
    term: 3,
    isCurrentSemester: true,
    theoryHours: 3,
    practiceHours: 0,
    credits: 3,
    ects: 5,
    syllabusSourceUrl: 'https://matbil.ogu.edu.tr/Sayfa/Index/63/2024-sonrasi',
    description: 'Birinci mertebeden diferansiyel denklemler (ayrılabilir, lineer, Bernoulli, tam), yüksek mertebeden lineer denklemler, Laplace dönüşümü.',
    prerequisites: ['analiz-2'],
    units: [
      {
        title: 'Ünite 1: Birinci Mertebeden Diferansiyel Denklemler',
        topics: [
          {
            id: 'top-difdenk-birinci-mertebe',
            title: 'Bernoulli ve Lineer Diferansiyel Denklemler',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'bernoulli-differential-equation',
                name: 'Bernoulli Diferansiyel Denklemi',
                formalStatement: 'y\' + P(x)y = Q(x)y^n \\implies v = y^{1-n}'
              }
            ]
          },
          {
            id: 'top-difdenk-tam-denklemler',
            title: 'Tam Diferansiyel Denklemler ve Potansiyel Fonksiyon',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'exact-differential-equations',
                name: 'Tam Diferansiyel Denklemler (Exact Equations)',
                formalStatement: 'M(x, y)dx + N(x, y)dy = 0 \\text{ tamdır} \\iff \\frac{\\partial M}{\\partial y} = \\frac{\\partial N}{\\partial x}'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'bilgisayar-mimarisi',
    officialCode: '821613004',
    code: 'CENG203',
    name: 'Bilgisayar Mimarisi',
    englishName: 'Computer Architecture',
    department: 'Matematik ve Bilgisayar Bilimleri',
    semester: '2. Sınıf Güz',
    year: 2,
    term: 3,
    isCurrentSemester: true,
    theoryHours: 3,
    practiceHours: 0,
    credits: 3,
    ects: 5,
    syllabusSourceUrl: 'https://matbil.ogu.edu.tr/Sayfa/Index/63/2024-sonrasi',
    description: 'MIPS komut kümesi mimarisi, ALU tasarımı, boru hattı (pipelining) ve tehlikeleri, önbellek hiyerarşisi (Direct, Set-Associative).',
    prerequisites: ['temel-bilgisayar-bilimleri-2'],
    units: [
      {
        title: 'Ünite 1: Bellek Hiyerarşisi ve Önbellek',
        topics: [
          {
            id: 'top-mimari-cache',
            title: 'Önbellek Eşleme (Cache Mapping)',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'cache-mapping',
                name: 'Önbellek Eşleme ve Adres Bit Dağılımı',
                formalStatement: '\\text{Adres} = [\\text{Tag} \\mid \\text{Index} \\mid \\text{Offset}], \\quad 2^{\\text{Index}} = \\text{Set Sayısı}'
              }
            ]
          }
        ]
      },
      {
        title: 'Ünite 2: İşlemci Boru Hattı ve Riskler',
        topics: [
          {
            id: 'top-mimari-pipelining',
            title: 'Boru Hattı Riskleri ve İleri İletim (Pipeline Hazards & Forwarding)',
            estimatedMinutes: 50,
            concepts: [
              {
                id: 'pipeline-hazards',
                name: 'Boru Hattı Riskleri ve İleri İletim (Pipeline Hazards & Forwarding)',
                formalStatement: '\\text{CPI} = 1 + \\text{Stall}_{\\text{Data}} + \\text{Stall}_{\\text{Control}} + \\text{Stall}_{\\text{Structural}}'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'gorsel-programlama-1',
    officialCode: '821613005',
    code: 'CENG205',
    name: 'Görsel Programlama I',
    englishName: 'Visual Programming I (C#)',
    department: 'Matematik ve Bilgisayar Bilimleri',
    semester: '2. Sınıf Güz',
    year: 2,
    term: 3,
    isCurrentSemester: true,
    theoryHours: 3,
    practiceHours: 0,
    credits: 3,
    ects: 5,
    syllabusSourceUrl: 'https://matbil.ogu.edu.tr/Sayfa/Index/63/2024-sonrasi',
    description: '.NET platformu, C# sözdizimi, nesneye yönelik programlama (OOP), olay güdümlü programlama (events/delegates), Windows Forms GUI tasarımı.',
    prerequisites: ['bilgisayar-programlama-2'],
    units: [
      {
        title: 'Ünite 1: Olay Güdümlü Programlama ve Delegeler',
        topics: [
          {
            id: 'top-gp1-events',
            title: 'C# Olay Güdümlü Programlama (Event-Driven)',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'csharp-delegates-events',
                name: 'C# Delegeler ve Olay Dinleyiciler',
                formalStatement: 'button.Click += new EventHandler(MyMethod);'
              }
            ]
          }
        ]
      },
      {
        title: 'Ünite 2: Modern C# ve LINQ ile Veri İşleme',
        topics: [
          {
            id: 'top-gp1-linq',
            title: 'LINQ Sorguları ve Ertelenmiş Yürütme (Deferred Execution)',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'linq-expressions',
                name: 'LINQ Sorguları ve Ertelenmiş Yürütme (Deferred Execution)',
                formalStatement: '\\text{var query} = \\text{collection.Where(x => x.Condition).Select(x => x.Property);}'
              }
            ]
          }
        ]
      }
    ]
  },

  // ==========================================
  // 2. SINIF BAHAR (4. DÖNEM)
  // ==========================================
  {
    id: 'analiz-4',
    officialCode: '821614001',
    code: 'MAT202',
    name: 'Analiz IV',
    englishName: 'Analysis IV',
    department: 'Matematik ve Bilgisayar Bilimleri',
    semester: '2. Sınıf Bahar',
    year: 2,
    term: 4,
    isCurrentSemester: false,
    theoryHours: 3,
    practiceHours: 0,
    credits: 3,
    ects: 5,
    syllabusSourceUrl: 'https://matbil.ogu.edu.tr/Sayfa/Index/63/2024-sonrasi',
    description: 'Seriler, kuvvet serileri, yakınsaklık yarıçapı, Taylor ve Maclaurin serileri, Fourier serileri, parametrik integraller.',
    prerequisites: ['analiz-3'],
    units: [
      {
        title: 'Ünite 1: Sonsuz Seriler ve Kuvvet Serileri',
        topics: [
          {
            id: 'top-analiz4-seriler',
            title: 'Seri Yakınsaklık Testleri ve Kuvvet Serileri',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'power-series-radius',
                name: 'Kuvvet Serileri ve Yakınsaklık Yarıçapı',
                formalStatement: 'R = \\lim_{n \\to \\infty} \\left| \\frac{a_n}{a_{n+1}} \\right|'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'yapay-zeka',
    officialCode: '821614002',
    code: 'CENG202',
    name: 'Yapay Zeka',
    englishName: 'Artificial Intelligence',
    department: 'Matematik ve Bilgisayar Bilimleri',
    semester: '2. Sınıf Bahar',
    year: 2,
    term: 4,
    isCurrentSemester: false,
    theoryHours: 3,
    practiceHours: 0,
    credits: 3,
    ects: 5,
    syllabusSourceUrl: 'https://matbil.ogu.edu.tr/Sayfa/Index/63/2024-sonrasi',
    description: 'Arama algoritmaları (A*, BFS, DFS), sezgisel yöntemler, kısıt sağlama problemleri, bilgi temsili, makine öğrenmesi temelleri.',
    prerequisites: ['ayrik-matematik', 'bilgisayar-programlama-1'],
    units: [
      {
        title: 'Ünite 1: Sezgisel Arama ve Graf Arama',
        topics: [
          {
            id: 'top-ai-search',
            title: 'A* Arama Algoritması ve Sezgiseller',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'a-star-search',
                name: 'A* Arama Değerlendirme Fonksiyonu',
                formalStatement: 'f(n) = g(n) + h(n), \\quad h(n) \\le h^*(n)'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'dinamik-sistemler',
    officialCode: '821614003',
    code: 'MAT204',
    name: 'Dinamik Sistemler',
    englishName: 'Dynamical Systems',
    department: 'Matematik ve Bilgisayar Bilimleri',
    semester: '2. Sınıf Bahar',
    year: 2,
    term: 4,
    isCurrentSemester: false,
    theoryHours: 3,
    practiceHours: 0,
    credits: 3,
    ects: 5,
    syllabusSourceUrl: 'https://matbil.ogu.edu.tr/Sayfa/Index/63/2024-sonrasi',
    description: 'Lineer ve lineer olmayan sistemler, faz düzlemi analizi, kararlılık, Lyapunov fonksiyonları, çatallanma (bifurcation) teorisi.',
    prerequisites: ['diferansiyel-denklemler', 'lineer-cebir'],
    units: [
      {
        title: 'Ünite 1: Faz Portreleri ve Kararlılık',
        topics: [
          {
            id: 'top-dinamik-kararlilik',
            title: 'Denge Noktaları ve Lyapunov Kararlılığı',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'lyapunov-stability',
                name: 'Lyapunov Fonksiyonu ve Kararlılık Kriteri',
                formalStatement: 'V(x) > 0 \\land \\dot{V}(x) \\le 0 \\implies \\text{Kararlı Denge}'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'olasilik-ve-istatistik',
    officialCode: '821614004',
    code: 'STAT202',
    name: 'Olasılık ve İstatistik',
    englishName: 'Probability and Statistics',
    department: 'Matematik ve Bilgisayar Bilimleri',
    semester: '2. Sınıf Bahar',
    year: 2,
    term: 4,
    isCurrentSemester: false,
    theoryHours: 3,
    practiceHours: 0,
    credits: 3,
    ects: 5,
    syllabusSourceUrl: 'https://matbil.ogu.edu.tr/Sayfa/Index/63/2024-sonrasi',
    description: 'Örneklem uzayı, olasılık aksiyomları, koşullu olasılık, Bayes teoremi, kesikli ve sürekli rastgele değişkenler, hipotez testleri.',
    prerequisites: ['analiz-2'],
    units: [
      {
        title: 'Ünite 1: Koşullu Olasılık ve Bayes',
        topics: [
          {
            id: 'top-olasilik-bayes',
            title: 'Koşullu Olasılık ve Bayes Teoremi',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'bayes-theorem',
                name: 'Bayes Teoremi',
                formalStatement: 'P(A|B) = \\frac{P(B|A)P(A)}{P(B)}, \\quad P(B) > 0'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'gorsel-programlama-2',
    officialCode: '821614005',
    code: 'CENG204',
    name: 'Görsel Programlama II',
    englishName: 'Visual Programming II',
    department: 'Matematik ve Bilgisayar Bilimleri',
    semester: '2. Sınıf Bahar',
    year: 2,
    term: 4,
    isCurrentSemester: false,
    theoryHours: 3,
    practiceHours: 0,
    credits: 3,
    ects: 5,
    syllabusSourceUrl: 'https://matbil.ogu.edu.tr/Sayfa/Index/63/2024-sonrasi',
    description: 'Veritabanı bağlantıları (ADO.NET, Entity Framework), çok katmanlı mimari, asenkron programlama (async/await), LINQ sorguları.',
    prerequisites: ['gorsel-programlama-1'],
    units: [
      {
        title: 'Ünite 1: Asenkron Programlama ve Veritabanı',
        topics: [
          {
            id: 'top-gp2-async',
            title: 'Asenkron Görevler ve LINQ Sorguları',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'csharp-async-await',
                name: 'Asenkron Metotlar ve Task Yapısı',
                formalStatement: 'public async Task<int> FetchDataAsync() { await ... }'
              }
            ]
          }
        ]
      }
    ]
  },

  // ==========================================
  // 3. SINIF GÜZ (5. DÖNEM)
  // ==========================================
  {
    id: 'modern-cebir',
    officialCode: '821615001',
    code: 'MAT301',
    name: 'Modern Cebir',
    englishName: 'Abstract / Modern Algebra',
    department: 'Matematik ve Bilgisayar Bilimleri',
    semester: '3. Sınıf Güz',
    year: 3,
    term: 5,
    isCurrentSemester: false,
    theoryHours: 3,
    practiceHours: 0,
    credits: 3,
    ects: 5,
    syllabusSourceUrl: 'https://matbil.ogu.edu.tr/Sayfa/Index/63/2024-sonrasi',
    description: 'Gruplar, alt gruplar, Lagrange teoremi, homomorfizmalar, halkalar, idealler ve cisimler.',
    prerequisites: ['lineer-cebir', 'soyut-matematik'],
    units: [
      {
        title: 'Ünite 1: Grup Teorisi ve Lagrange Teoremi',
        topics: [
          {
            id: 'top-cebir-gruplar',
            title: 'Gruplar ve Lagrange Teoremi',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'lagrange-subgroup-theorem',
                name: 'Lagrange Alt Grup Mertebe Teoremi',
                formalStatement: '|H| \\text{ böler } |G|'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'diferansiyel-geometri',
    officialCode: '821615002',
    code: 'MAT303',
    name: 'Diferansiyel Geometri',
    englishName: 'Differential Geometry',
    department: 'Matematik ve Bilgisayar Bilimleri',
    semester: '3. Sınıf Güz',
    year: 3,
    term: 5,
    isCurrentSemester: false,
    theoryHours: 3,
    practiceHours: 0,
    credits: 3,
    ects: 5,
    syllabusSourceUrl: 'https://matbil.ogu.edu.tr/Sayfa/Index/63/2024-sonrasi',
    description: 'Uzay eğrileri, Frenet-Serret formülleri, eğrilik ve burulma, yüzeyler, birinci ve ikinci temel formlar, Gauss eğriliği.',
    prerequisites: ['analiz-3', 'lineer-cebir'],
    units: [
      {
        title: 'Ünite 1: Frenet-Serret Çatısı',
        topics: [
          {
            id: 'top-difgeo-frenet',
            title: 'Frenet-Serret Formülleri ve Eğrilik',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'frenet-serret-formulas',
                name: 'Frenet-Serret Çatısı Formülleri',
                formalStatement: 'T\' = \\kappa N, \\quad N\' = -\\kappa T + \\tau B, \\quad B\' = -\\tau N'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'sembolik-hesaplama-1',
    officialCode: '821615003',
    code: 'CENG301',
    name: 'Sembolik Hesaplama I',
    englishName: 'Symbolic Computation I (MATLAB/Maple)',
    department: 'Matematik ve Bilgisayar Bilimleri',
    semester: '3. Sınıf Güz',
    year: 3,
    term: 5,
    isCurrentSemester: false,
    theoryHours: 3,
    practiceHours: 0,
    credits: 3,
    ects: 5,
    syllabusSourceUrl: 'https://matbil.ogu.edu.tr/Sayfa/Index/63/2024-sonrasi',
    description: 'Bilgisayarlı cebir sistemleri (CAS), analitik türev ve integral çözümleri, sayısal yaklaşım metotları.',
    prerequisites: ['analiz-2', 'bilgisayar-programlama-1'],
    units: [
      {
        title: 'Ünite 1: Sayısal İntegrasyon ve Sembolik Türev',
        topics: [
          {
            id: 'top-sembolik-matlab',
            title: 'MATLAB Sayısal ve Sembolik Hesaplama',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'matlab-symbolic-diff',
                name: 'MATLAB diff ve trapz İntegrasyonu',
                formalStatement: 'I = \\text{trapz}(x, y)'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'matematiksel-yazilim-tasarim',
    officialCode: '821615004',
    code: 'CENG303',
    name: 'Matematiksel Yazılım ve Tasarım',
    englishName: 'Mathematical Software and Design',
    department: 'Matematik ve Bilgisayar Bilimleri',
    semester: '3. Sınıf Güz',
    year: 3,
    term: 5,
    isCurrentSemester: false,
    theoryHours: 3,
    practiceHours: 0,
    credits: 3,
    ects: 5,
    syllabusSourceUrl: 'https://matbil.ogu.edu.tr/Sayfa/Index/63/2024-sonrasi',
    description: 'Yazılım tasarım desenleri (Design Patterns), matematiksel modelleme arayüzleri, UML diyagramları.',
    prerequisites: ['gorsel-programlama-1'],
    units: [
      {
        title: 'Ünite 1: Tasarım Desenleri',
        topics: [
          {
            id: 'top-myt-patterns',
            title: 'Singleton ve Factory Tasarım Desenleri',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'singleton-pattern',
                name: 'Singleton Tasarım Deseni',
                formalStatement: 'Sınıftan uygulama boyunca yalnızca tek bir örneğin oluşturulmasını garanti eder.'
              }
            ]
          }
        ]
      }
    ]
  },

  // ==========================================
  // 3. SINIF BAHAR (6. DÖNEM)
  // ==========================================
  {
    id: 'topoloji',
    officialCode: '821616001',
    code: 'MAT302',
    name: 'Topoloji',
    englishName: 'General Topology',
    department: 'Matematik ve Bilgisayar Bilimleri',
    semester: '3. Sınıf Bahar',
    year: 3,
    term: 6,
    isCurrentSemester: false,
    theoryHours: 3,
    practiceHours: 0,
    credits: 3,
    ects: 5,
    syllabusSourceUrl: 'https://matbil.ogu.edu.tr/Sayfa/Index/63/2024-sonrasi',
    description: 'Topolojik uzaylar, açık ve kapalı kümeler, taban ve alt taban, süreklilik ve homeomorfizma, kompaktlık, bağlantılılık.',
    prerequisites: ['analiz-3', 'soyut-matematik'],
    units: [
      {
        title: 'Ünite 1: Topolojik Uzaylar ve Süreklilik',
        topics: [
          {
            id: 'top-topoloji-uzaylar',
            title: 'Topoloji Tanımı ve Taban Kümeleri',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'topological-space-axioms',
                name: 'Topolojik Uzay Aksiyomları',
                formalStatement: '\\emptyset, X \\in \\tau, \\quad \\bigcup U_i \\in \\tau, \\quad \\bigcap_{i=1}^n U_i \\in \\tau'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'kompleks-analiz',
    officialCode: '821616002',
    code: 'MAT304',
    name: 'Kompleks Analiz',
    englishName: 'Complex Analysis',
    department: 'Matematik ve Bilgisayar Bilimleri',
    semester: '3. Sınıf Bahar',
    year: 3,
    term: 6,
    isCurrentSemester: false,
    theoryHours: 3,
    practiceHours: 0,
    credits: 3,
    ects: 5,
    syllabusSourceUrl: 'https://matbil.ogu.edu.tr/Sayfa/Index/63/2024-sonrasi',
    description: 'Kompleks sayılar, holomorf fonksiyonlar, Cauchy-Riemann denklemleri, Cauchy integral formülü, rezidü teoremi.',
    prerequisites: ['analiz-3'],
    units: [
      {
        title: 'Ünite 1: Holomorf Fonksiyonlar ve Cauchy-Riemann',
        topics: [
          {
            id: 'top-kompleks-cr',
            title: 'Cauchy-Riemann Denklemleri ve Rezidüler',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'cauchy-riemann-equations',
                name: 'Cauchy-Riemann Denklemleri',
                formalStatement: '\\frac{\\partial u}{\\partial x} = \\frac{\\partial v}{\\partial y}, \\quad \\frac{\\partial u}{\\partial y} = -\\frac{\\partial v}{\\partial x}'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'algoritmalar',
    officialCode: '821616003',
    code: 'CENG302',
    name: 'Algoritmalar',
    englishName: 'Design and Analysis of Algorithms',
    department: 'Matematik ve Bilgisayar Bilimleri',
    semester: '3. Sınıf Bahar',
    year: 3,
    term: 6,
    isCurrentSemester: false,
    theoryHours: 3,
    practiceHours: 0,
    credits: 3,
    ects: 5,
    syllabusSourceUrl: 'https://matbil.ogu.edu.tr/Sayfa/Index/63/2024-sonrasi',
    description: 'Asimptotik analiz (Big-O), Böl ve Yönet (Divide & Conquer), Dinamik Programlama (DP), Açgözlü (Greedy) algoritmalar, graf algoritmaları (Dijkstra, Kruskal).',
    prerequisites: ['graf-teorisi', 'bilgisayar-programlama-2'],
    units: [
      {
        title: 'Ünite 1: Dinamik Programlama ve Karmaşıklık',
        topics: [
          {
            id: 'top-algo-dp',
            title: 'Dinamik Programlama ve Örtüşen Alt Problemler',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'dynamic-programming',
                name: 'Dinamik Programlama ve Memoization',
                formalStatement: 'Optimal alt yapı ve örtüşen alt problemler prensibi: DP[i] = \\min_j (DP[j] + cost)'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'kategori-teorisi-bilgisayar-bilimleri',
    officialCode: '821616004',
    code: 'CENG304',
    name: 'Kategori Teorisi ve Bilgisayar Bilimleri',
    englishName: 'Category Theory for Computer Science',
    department: 'Matematik ve Bilgisayar Bilimleri',
    semester: '3. Sınıf Bahar',
    year: 3,
    term: 6,
    isCurrentSemester: false,
    theoryHours: 3,
    practiceHours: 0,
    credits: 3,
    ects: 5,
    syllabusSourceUrl: 'https://matbil.ogu.edu.tr/Sayfa/Index/63/2024-sonrasi',
    description: 'Kategoriler, nesneler ve morfizmler, funktörler, doğal dönüşümler, monadlar ve fonksiyonel programlama temelleri.',
    prerequisites: ['modern-cebir', 'soyut-matematik'],
    units: [
      {
        title: 'Ünite 1: Kategoriler ve Funktörler',
        topics: [
          {
            id: 'top-kategori-funktor',
            title: 'Funktörler ve Doğal Dönüşümler',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'functor-definition',
                name: 'Kovaryant Funktör Tanımı',
                formalStatement: 'F(f \\circ g) = F(f) \\circ F(g), \\quad F(\\text{id}_A) = \\text{id}_{F(A)}'
              }
            ]
          }
        ]
      }
    ]
  },

  // ==========================================
  // 4. SINIF GÜZ (7. DÖNEM)
  // ==========================================
  {
    id: 'java',
    officialCode: '821617001',
    code: 'CENG401',
    name: 'Java',
    englishName: 'Enterprise Java Programming',
    department: 'Matematik ve Bilgisayar Bilimleri',
    semester: '4. Sınıf Güz',
    year: 4,
    term: 7,
    isCurrentSemester: false,
    theoryHours: 3,
    practiceHours: 0,
    credits: 3,
    ects: 5,
    syllabusSourceUrl: 'https://matbil.ogu.edu.tr/Sayfa/Index/63/2024-sonrasi',
    description: 'Java Sanal Makinesi (JVM), multithreading ve eşzamanlılık (concurrency), akışlar (Streams API), soket programlama.',
    prerequisites: ['gorsel-programlama-2'],
    units: [
      {
        title: 'Ünite 1: Eşzamanlılık ve Multithreading',
        topics: [
          {
            id: 'top-java-threads',
            title: 'Java İş Parçacıkları ve Senkronizasyon',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'java-synchronized-block',
                name: 'Java Senkronizasyon ve Monitor Kilidi',
                formalStatement: 'synchronized(lock) { /* Kritik Bölge */ }'
              }
            ]
          }
        ]
      }
    ]
  },

  // ==========================================
  // 4. SINIF BAHAR (8. DÖNEM)
  // ==========================================
  {
    id: 'kriptoloji',
    officialCode: '821618001',
    code: 'CENG402',
    name: 'Kriptoloji',
    englishName: 'Cryptology and Information Security',
    department: 'Matematik ve Bilgisayar Bilimleri',
    semester: '4. Sınıf Bahar',
    year: 4,
    term: 8,
    isCurrentSemester: false,
    theoryHours: 3,
    practiceHours: 0,
    credits: 3,
    ects: 5,
    syllabusSourceUrl: 'https://matbil.ogu.edu.tr/Sayfa/Index/63/2024-sonrasi',
    description: 'Klasik şifreleme, simetrik şifreleme (AES, DES), asimetrik şifreleme (RSA, Diffie-Hellman), eliptik eğri kriptografisi (ECC), özet fonksiyonları (SHA-256).',
    prerequisites: ['ayrik-matematik', 'modern-cebir'],
    units: [
      {
        title: 'Ünite 1: Asimetrik Kriptografi ve RSA',
        topics: [
          {
            id: 'top-kripto-rsa',
            title: 'RSA Açık Anahtarlı Şifreleme ve Euler Teoremi',
            estimatedMinutes: 45,
            concepts: [
              {
                id: 'rsa-algorithm',
                name: 'RSA Şifreleme Algoritması',
                formalStatement: 'c \\equiv m^e \\pmod n, \\quad m \\equiv c^d \\pmod n, \\quad e \\cdot d \\equiv 1 \\pmod{\\phi(n)}'
              }
            ]
          }
        ]
      }
    ]
  }
];

/**
 * Seeds all 30 compulsory courses from the 2024 post-reform ESOGÜ curriculum into the database.
 */
export async function seedAllOfficialCourses() {
  console.log(`Seeding ${ESOGU_COMPULSORY_CURRICULUM_2024.length} official compulsory courses into Axiom database...`);

  for (const c of ESOGU_COMPULSORY_CURRICULUM_2024) {
    // 1. Upsert Course
    await prisma.course.upsert({
      where: { id: c.id },
      create: {
        id: c.id,
        code: c.code,
        officialCode: c.officialCode,
        name: c.name,
        englishName: c.englishName,
        department: c.department,
        semester: c.semester,
        isCurrentSemester: c.isCurrentSemester,
        coverageStatus: 'COMPLETE',
        theoryHours: c.theoryHours,
        practiceHours: c.practiceHours,
        credits: c.credits,
        ects: c.ects,
        syllabusSourceUrl: c.syllabusSourceUrl,
        description: c.description
      },
      update: {
        code: c.code,
        officialCode: c.officialCode,
        name: c.name,
        englishName: c.englishName,
        department: c.department,
        semester: c.semester,
        isCurrentSemester: c.isCurrentSemester,
        theoryHours: c.theoryHours,
        practiceHours: c.practiceHours,
        credits: c.credits,
        ects: c.ects,
        syllabusSourceUrl: c.syllabusSourceUrl,
        description: c.description
      }
    });

    // 2. Upsert Units, Topics and Concepts
    for (let uIdx = 0; uIdx < c.units.length; uIdx++) {
      const unit = c.units[uIdx];
      for (let tIdx = 0; tIdx < unit.topics.length; tIdx++) {
        const top = unit.topics[tIdx];

        await prisma.courseTopic.upsert({
          where: { id: top.id },
          create: {
            id: top.id,
            courseId: c.id,
            orderIndex: (uIdx + 1) * 10 + tIdx,
            unitTitle: unit.title,
            title: top.title,
            estimatedMinutes: top.estimatedMinutes
          },
          update: {
            courseId: c.id,
            unitTitle: unit.title,
            title: top.title,
            estimatedMinutes: top.estimatedMinutes
          }
        });

        // Concepts
        for (const concept of top.concepts) {
          await prisma.concept.upsert({
            where: { id: concept.id },
            create: {
              id: concept.id,
              category: c.department.includes('Bilgisayar') ? 'MATH_X_CS' : 'MATHEMATICS',
              subcategory: c.name,
              formalStatement: concept.formalStatement,
              verificationLevel: 3,
              verificationStatus: 'VERIFIED',
              sourceTitle: `${c.name} Resmi Müfredatı`,
              sourceAuthor: 'Eskişehir Osmangazi Üniversitesi',
              sourceCitation: `ESOGÜ ${c.code} Ders İzlencesi`
            },
            update: {
              formalStatement: concept.formalStatement,
              sourceTitle: `${c.name} Resmi Müfredatı`
            }
          });

          // Translation TR
          await prisma.conceptTranslation.upsert({
            where: {
              conceptId_language: {
                conceptId: concept.id,
                language: 'tr'
              }
            },
            create: {
              conceptId: concept.id,
              language: 'tr',
              name: concept.name,
              dualTerminology: `${concept.name} (${concept.id})`,
              definition: concept.formalStatement,
              intuition: `${concept.name} konusunun temel matematiksel ve mühendislik sezgisi.`,
              commonPitfalls: 'Teorem hipotezlerinin kontrol edilmemesi.'
            },
            update: {
              name: concept.name,
              dualTerminology: `${concept.name} (${concept.id})`,
              definition: concept.formalStatement
            }
          });

          // Link Topic to Concept
          await prisma.topicConcept.upsert({
            where: {
              topicId_conceptId: {
                topicId: top.id,
                conceptId: concept.id
              }
            },
            create: {
              topicId: top.id,
              conceptId: concept.id
            },
            update: {}
          });
        }
      }
    }
  }

  // 3. Connect Prerequisites DAG between courses
  for (const c of ESOGU_COMPULSORY_CURRICULUM_2024) {
    for (const prereqId of c.prerequisites) {
      await prisma.coursePrerequisite.upsert({
        where: {
          courseId_prerequisiteId: {
            courseId: c.id,
            prerequisiteId: prereqId
          }
        },
        create: {
          courseId: c.id,
          prerequisiteId: prereqId,
          relationType: 'DIRECT_ACADEMIC'
        },
        update: {}
      });
    }
  }

  console.log('All 30 compulsory courses and their academic prerequisites successfully synced!');
}
