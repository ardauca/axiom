/**
 * Academic Terminology Mappings for Turkish students.
 * Whenever Turkish mode is enabled, key technical terms show their international English counterparts in parentheses
 * to bridge the transition to university and graduate literature.
 */
export interface AcademicTerm {
  tr: string;
  en: string;
  category: 'math' | 'cs' | 'general';
  definitionTr: string;
  definitionEn: string;
}

export const ACADEMIC_TERMS: Record<string, AcademicTerm> = {
  eigenvalue: {
    tr: 'Özdeğer',
    en: 'Eigenvalue',
    category: 'math',
    definitionTr: 'Bir lineer dönüşüm altında yönü değişmeyip sadece ölçeklenen vektörün ölçek katsayısı.',
    definitionEn: 'A scalar by which an eigenvector is scaled during a linear transformation.',
  },
  eigenvector: {
    tr: 'Özvektör',
    en: 'Eigenvector',
    category: 'math',
    definitionTr: 'Bir lineer dönüşüm uygulandığında sadece kendi doğrultusu üzerinde uzayıp kısalan sıfır-dışı vektör.',
    definitionEn: 'A non-zero vector that changes at most by a scalar factor when that linear transformation is applied.',
  },
  invariant: {
    tr: 'Değişmez',
    en: 'Invariant',
    category: 'math',
    definitionTr: 'Bir dizi işlem veya durum geçişi boyunca değeri veya mantıksal niteliği sabit kalan nicelik.',
    definitionEn: 'A property of a mathematical object or system that remains unchanged after operations or transformations.',
  },
  pigeonhole: {
    tr: 'Güvercin Yuvası İlkesi',
    en: 'Pigeonhole Principle',
    category: 'math',
    definitionTr: 'n adet nesne m adet yuvaya dağıtıldığında ve n > m olduğunda en az bir yuvada birden fazla nesne bulunacağını ifade eden ilke.',
    definitionEn: 'If n items are put into m containers, with n > m, then at least one container must contain more than one item.',
  },
  quotient_group: {
    tr: 'Bölüm Grubu',
    en: 'Quotient Group',
    category: 'math',
    definitionTr: 'Bir grubun bir normal altgrubunun eşkümeleri üzerinde tanımlanan doğal grup yapısı.',
    definitionEn: 'A group obtained by aggregating similar elements of a larger group using an equivalence relation from a normal subgroup.',
  },
  equivalence_class: {
    tr: 'Eşdeğerlik Sınıfı',
    en: 'Equivalence Class',
    category: 'math',
    definitionTr: 'Bir küme üzerinde tanımlı eşdeğerlik bağıntısına göre birbirine denk olan elemanların altkümesi.',
    definitionEn: 'A subset of elements that are equivalent to each other under a given equivalence relation.',
  },
  characteristic_polynomial: {
    tr: 'Karakteristik Polinom',
    en: 'Characteristic Polynomial',
    category: 'math',
    definitionTr: 'Karekökleri bir matrisin özdeğerlerini veren det(A - λI) = 0 denkleminin polinomu.',
    definitionEn: 'A polynomial associated with a square matrix whose roots are the eigenvalues of the matrix: det(A - λI).',
  },
  complexity: {
    tr: 'Karmaşıklık',
    en: 'Complexity',
    category: 'cs',
    definitionTr: 'Bir algoritmanın girdi boyutu n büyüdükçe tükettiği zaman (adım) veya bellek miktarının asimptotik büyüme hızı.',
    definitionEn: 'The asymptotic rate of growth of resource consumption (time or space) as input size n scales.',
  },
  dynamic_programming: {
    tr: 'Dinamik Programlama',
    en: 'Dynamic Programming',
    category: 'cs',
    definitionTr: 'Karmaşık bir problemi örtüşen alt problemlere bölüp her alt problemin sonucunu saklayarak (memoization) çözen algoritma paradigması.',
    definitionEn: 'An algorithmic paradigm that solves complex problems by breaking them down into overlapping subproblems and memoizing results.',
  },
  recurrence_relation: {
    tr: 'Özyineleme Bağıntısı',
    en: 'Recurrence Relation',
    category: 'math',
    definitionTr: 'Bir dizinin her bir terimini kendisinden önceki terimlerin bir fonksiyonu olarak tanımlayan matematiksel denklem.',
    definitionEn: 'An equation that defines a sequence recursively in terms of preceding terms.',
  },
  generating_function: {
    tr: 'Üreteç Fonksiyonu',
    en: 'Generating Function',
    category: 'math',
    definitionTr: 'Bir dizinin terimlerini katsayı olarak alan bir biçimsel kuvvet serisi.',
    definitionEn: 'A formal power series whose coefficients encode information about a sequence.',
  },
  convex_hull: {
    tr: 'Dışbükey Örtü',
    en: 'Convex Hull',
    category: 'cs',
    definitionTr: 'Verilen bir nokta kümesini içine alan en küçük dışbükey çokgen.',
    definitionEn: 'The smallest convex set that contains a given set of points in Euclidean space.',
  },
  chinese_remainder_theorem: {
    tr: 'Çin Kalan Teoremi',
    en: 'Chinese Remainder Theorem',
    category: 'math',
    definitionTr: 'Aralarında asal modüllere göre verilen eşlik sistemlerinin tek bir modüler çözüme sahip olduğunu belirten teorem.',
    definitionEn: 'A theorem stating that if one knows the remainders of the division of an integer n by several pairwise coprime integers, then the remainder of the division of n by the product of these integers is uniquely determined.',
  },
  extended_euclidean: {
    tr: 'Genişletilmiş Öklid Algoritması',
    en: 'Extended Euclidean Algorithm',
    category: 'cs',
    definitionTr: 'İki tamsayının EBOB\'unu bulmanın yanı sıra Bezout katsayılarını (ax + by = gcd(a,b)) hesaplayan algoritma.',
    definitionEn: 'An algorithm that computes the greatest common divisor of integers a and b, as well as the coefficients of Bézout\'s identity: ax + by = gcd(a,b).',
  },
};

/**
 * Format a term bilingual display helper:
 * In Turkish mode: "Özdeğer (Eigenvalue)"
 * In English mode: "Eigenvalue"
 */
export function formatTerm(key: string, lang: 'tr' | 'en'): string {
  const term = ACADEMIC_TERMS[key];
  if (!term) return key;
  if (lang === 'tr') {
    return `${term.tr} (${term.en})`;
  }
  return term.en;
}
