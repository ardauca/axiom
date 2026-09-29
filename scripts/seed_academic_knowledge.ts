import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- SEEDING ACADEMIC SOURCES & KNOWLEDGE SYSTEM ---');

  // 1. REPOSITORIES
  const repoMaster = await prisma.sourceRepository.upsert({
    where: { id: 'repo-master' },
    update: {},
    create: {
      id: 'repo-master',
      name: 'ESOGÜ Lisans Akademik Master Arşivi',
      rootPath: 'D:\\Belgeler\\Ders',
      role: 'MASTER_ARCHIVE',
      academicPeriod: '1-3. Sınıf Genel Müfredat',
      isMaster: true,
    }
  });

  const repoActive = await prisma.sourceRepository.upsert({
    where: { id: 'repo-active' },
    update: {},
    create: {
      id: 'repo-active',
      name: '2. Sınıf Güz Aktif Çalışma Deposu',
      rootPath: 'C:\\Users\\ARDA\\Desktop\\2.sınıf Güz',
      role: 'ACTIVE_SEMESTER_SUPPLEMENT',
      academicPeriod: '2. Sınıf Güz',
      isMaster: false,
    }
  });

  // 2. SOURCE FAMILIES & CLUSTERS
  const famDifDenk = await prisma.sourceFamily.upsert({
    where: { id: 'fam-difdenk-exams' },
    update: {},
    create: {
      id: 'fam-difdenk-exams',
      name: 'ESOGÜ Diferansiyel Denklemler Sınav Arşivi (2023-2025)',
      subject: 'Diferansiyel Denklemler'
    }
  });

  const famGorsel = await prisma.sourceFamily.upsert({
    where: { id: 'fam-gorsel-prog' },
    update: {},
    create: {
      id: 'fam-gorsel-prog',
      name: 'ESOGÜ Görsel Programlama Vize Arşivi (2022-2023)',
      subject: 'Görsel Programlama I'
    }
  });

  const clusterAnaliz1 = await prisma.sourceCluster.upsert({
    where: { id: 'cluster-analiz-1' },
    update: {},
    create: {
      id: 'cluster-analiz-1',
      title: 'Analiz I Notları ve El Yazısı Defterleri',
      description: 'Analiz 1.pdf (ders notu) ve Analiz_1.pdf (öğrenci çalışma defteri) varyantları'
    }
  });

  // 3. SOURCE DOCUMENTS
  // Doc 1: Graf Teorisi
  const docGraf = await prisma.sourceDocument.upsert({
    where: { sha256: 'sha256-graf-teori-gunaltili' },
    update: {},
    create: {
      id: 'doc-graf-teori',
      sha256: 'sha256-graf-teori-gunaltili',
      canonicalName: 'GRAF TEORİ DERS NOTLARI.docx',
      fileType: 'docx',
      sizeBytes: 409350,
      pageCount: 85,
      isScanned: false,
      author: 'Prof. Dr. İbrahim Günaltılı',
      institution: 'Eskişehir Osmangazi Üniversitesi',
      academicPeriod: '2. Sınıf Güz',
      primaryRole: 'PRIMARY_THEORY',
      secondaryRoles: JSON.stringify(['PRIMARY_TEACHING', 'EXAMPLE_SOURCE']),
      authority: 'PROFESSOR',
      verificationLevel: 'SOURCE_REFERENCED',
      whyThisSource: 'ESOGÜ Matematik ve Bilgisayar Bilimleri Bölümü resmi ders notudur. Prof. Dr. İbrahim Günaltılı tarafından hazırlanmış 1,283 paragraflık eksiksiz müfredat ve 45 çözümlü teorem/örnek içerir.',
      qualityMetrics: JSON.stringify({
        authority: 95,
        completeness: 98,
        clarity: 92,
        relevance: 100,
        exampleQuality: 90,
        problemQuality: 88,
        solutionQuality: 90,
        extractionQuality: 100,
        OCRQuality: 100,
        recency: 85,
        provenanceConfidence: 98
      })
    }
  });

  // Location for docGraf (in Repo 1)
  await prisma.sourceLocation.upsert({
    where: { repositoryId_relativePath: { repositoryId: repoActive.id, relativePath: 'GRAF TEORİ DERS NOTLARI.docx' } },
    update: {},
    create: {
      documentId: docGraf.id,
      repositoryId: repoActive.id,
      relativePath: 'GRAF TEORİ DERS NOTLARI.docx',
      fullPath: 'C:\\Users\\ARDA\\Desktop\\2.sınıf Güz\\GRAF TEORİ DERS NOTLARI.docx',
      isCanonical: true
    }
  });

  // Doc 2: Bilgisayar Mimarisi Slaytları
  const docMimariSlayt = await prisma.sourceDocument.upsert({
    where: { sha256: 'sha256-bilgisayar-mimarisi-celik' },
    update: {},
    create: {
      id: 'doc-bilgisayar-mimarisi',
      sha256: 'sha256-bilgisayar-mimarisi-celik',
      canonicalName: 'Bilgisayar_Mimarisi.pdf',
      fileType: 'pdf',
      sizeBytes: 15420000,
      pageCount: 137,
      isScanned: false,
      author: 'Doç. Dr. Özer Çelik',
      institution: 'Eskişehir Osmangazi Üniversitesi',
      academicPeriod: '2. Sınıf Güz',
      primaryRole: 'PRIMARY_THEORY',
      secondaryRoles: JSON.stringify(['PRIMARY_TEACHING']),
      authority: 'PROFESSOR',
      verificationLevel: 'SOURCE_REFERENCED',
      whyThisSource: '137 sayfalık resmi bölüm ders sunumudur. ALU tasarımı, MIPS komut seti mimarisi, Booth çarpma algoritması ve Cache bellek hiyerarşisini adım adım açıklar.',
      qualityMetrics: JSON.stringify({
        authority: 94,
        completeness: 90,
        clarity: 88,
        relevance: 100,
        exampleQuality: 85,
        problemQuality: 82,
        solutionQuality: 84,
        extractionQuality: 98,
        OCRQuality: 100,
        recency: 90,
        provenanceConfidence: 95
      })
    }
  });

  await prisma.sourceLocation.upsert({
    where: { repositoryId_relativePath: { repositoryId: repoMaster.id, relativePath: '2.Sınıf Güz\\Bilgisayar Mimarisi\\Bilgisayar_Mimarisi.pdf' } },
    update: {},
    create: {
      documentId: docMimariSlayt.id,
      repositoryId: repoMaster.id,
      relativePath: '2.Sınıf Güz\\Bilgisayar Mimarisi\\Bilgisayar_Mimarisi.pdf',
      fullPath: 'D:\\Belgeler\\Ders\\2.Sınıf Güz\\Bilgisayar Mimarisi\\Bilgisayar_Mimarisi.pdf',
      isCanonical: true
    }
  });

  await prisma.sourceLocation.upsert({
    where: { repositoryId_relativePath: { repositoryId: repoActive.id, relativePath: 'Bilgisayar Mimarisi\\Bilgisayar_Mimarisi.pdf' } },
    update: {},
    create: {
      documentId: docMimariSlayt.id,
      repositoryId: repoActive.id,
      relativePath: 'Bilgisayar Mimarisi\\Bilgisayar_Mimarisi.pdf',
      fullPath: 'C:\\Users\\ARDA\\Desktop\\2.sınıf Güz\\Bilgisayar Mimarisi\\Bilgisayar_Mimarisi.pdf',
      isCanonical: false // duplicate copy
    }
  });

  // Doc 3: Bilgisayar Mimarisi 2021 Final Sınavı
  const docMimariFinal = await prisma.sourceDocument.upsert({
    where: { sha256: 'sha256-bilgisayar-mimarisi-final-2021' },
    update: {},
    create: {
      id: 'doc-bilgisayar-mimarisi-final-2021',
      sha256: 'sha256-bilgisayar-mimarisi-final-2021',
      canonicalName: 'Bilgisayar_Mimarisi_2021_final.docx',
      fileType: 'docx',
      sizeBytes: 16433,
      pageCount: 3,
      isScanned: false,
      author: 'Doç. Dr. Özer Çelik',
      institution: 'Eskişehir Osmangazi Üniversitesi',
      academicPeriod: '2. Sınıf Güz',
      primaryRole: 'EXAM_PAPER',
      secondaryRoles: JSON.stringify(['PROBLEM_SOURCE', 'SOLUTION_SOURCE']),
      authority: 'PROFESSOR',
      verificationLevel: 'SOURCE_REFERENCED',
      whyThisSource: 'Doç. Dr. Özer Çelik tarafından hazırlanan 2020-2021 Dönem Sonu Final Sınavı resmi soru kağıdıdır. 6 adet kapsamlı problem (MIPS çevrimleri, Booth algoritması, Cache mapping) içerir.',
      qualityMetrics: JSON.stringify({
        authority: 96,
        completeness: 90,
        clarity: 90,
        relevance: 100,
        exampleQuality: 92,
        problemQuality: 95,
        solutionQuality: 90,
        extractionQuality: 100,
        OCRQuality: 100,
        recency: 85,
        provenanceConfidence: 98
      })
    }
  });

  await prisma.sourceLocation.upsert({
    where: { repositoryId_relativePath: { repositoryId: repoActive.id, relativePath: 'Bilgisayar_Mimarisi_2021_final.docx' } },
    update: {},
    create: {
      documentId: docMimariFinal.id,
      repositoryId: repoActive.id,
      relativePath: 'Bilgisayar_Mimarisi_2021_final.docx',
      fullPath: 'C:\\Users\\ARDA\\Desktop\\2.sınıf Güz\\Bilgisayar_Mimarisi_2021_final.docx',
      isCanonical: true
    }
  });

  // Doc 4: Diferansiyel Denklemler 2025 Final Sınavı
  const docDifDenkFinal2025 = await prisma.sourceDocument.upsert({
    where: { sha256: 'sha256-difdenk-final-06012025' },
    update: {},
    create: {
      id: 'doc-difdenk-final-2025',
      sha256: 'sha256-difdenk-final-06012025',
      canonicalName: 'difdenk_final_06012025.jpg',
      fileType: 'image',
      sizeBytes: 104166,
      pageCount: 1,
      isScanned: true,
      author: 'Eskişehir Osmangazi Üniversitesi',
      institution: 'Eskişehir Osmangazi Üniversitesi',
      academicPeriod: '2. Sınıf Güz',
      primaryRole: 'EXAM_PAPER',
      secondaryRoles: JSON.stringify(['PROBLEM_SOURCE', 'SOLUTION_SOURCE']),
      authority: 'DEPARTMENT',
      verificationLevel: 'HUMAN_REVIEWED',
      familyId: famDifDenk.id,
      whyThisSource: '06.01.2025 tarihli en güncel Diferansiyel Denklemler Final sınavı soru kağıdı ve adım adım çözümleridir. Bernoulli, Belirsiz Katsayılar ve Laplace dönüşümlerini içerir.',
      qualityMetrics: JSON.stringify({
        authority: 90,
        completeness: 85,
        clarity: 82,
        relevance: 100,
        exampleQuality: 88,
        problemQuality: 96,
        solutionQuality: 92,
        extractionQuality: 85,
        OCRQuality: 88,
        recency: 98,
        provenanceConfidence: 95
      })
    }
  });

  await prisma.sourceLocation.upsert({
    where: { repositoryId_relativePath: { repositoryId: repoActive.id, relativePath: 'difdenk_final_06012025.jpg' } },
    update: {},
    create: {
      documentId: docDifDenkFinal2025.id,
      repositoryId: repoActive.id,
      relativePath: 'difdenk_final_06012025.jpg',
      fullPath: 'C:\\Users\\ARDA\\Desktop\\2.sınıf Güz\\difdenk_final_06012025.jpg',
      isCanonical: true
    }
  });

  // Doc 5: Adams & Essex Calculus 7th Edition (Master Reference)
  const docAdamsCalculus = await prisma.sourceDocument.upsert({
    where: { sha256: 'sha256-adams-essex-calculus-7th' },
    update: {},
    create: {
      id: 'doc-adams-calculus',
      sha256: 'sha256-adams-essex-calculus-7th',
      canonicalName: 'Calculus: A Complete Course (7th Edition)',
      fileType: 'pdf',
      sizeBytes: 31200000,
      pageCount: 1077,
      isScanned: false,
      author: 'Robert A. Adams & Christopher Essex',
      institution: 'Pearson Education',
      academicPeriod: 'Genel Lisans Başvuru',
      primaryRole: 'REFERENCE',
      secondaryRoles: JSON.stringify(['PRIMARY_PROOF', 'PRIMARY_THEORY']),
      authority: 'REFERENCE_TEXTBOOK',
      verificationLevel: 'SOURCE_CROSS_CHECKED',
      whyThisSource: 'Dünya standartlarında 1,077 sayfalık matematiksel analiz başvuru kitabıdır; tek ve çok değişkenli analiz, vektörel analiz ve diferansiyel denklemler için formal ispatlar sağlar.',
      qualityMetrics: JSON.stringify({
        authority: 98,
        completeness: 100,
        clarity: 96,
        relevance: 90,
        exampleQuality: 95,
        problemQuality: 92,
        solutionQuality: 94,
        extractionQuality: 100,
        OCRQuality: 100,
        recency: 80,
        provenanceConfidence: 100
      })
    }
  });

  await prisma.sourceLocation.upsert({
    where: { repositoryId_relativePath: { repositoryId: repoMaster.id, relativePath: '1508848447251.pdf' } },
    update: {},
    create: {
      documentId: docAdamsCalculus.id,
      repositoryId: repoMaster.id,
      relativePath: '1508848447251.pdf',
      fullPath: 'D:\\Belgeler\\Ders\\1508848447251.pdf',
      isCanonical: true
    }
  });

  // Doc 6: Analiz III 2023 Final Sınavı
  const docAnaliz3Final = await prisma.sourceDocument.upsert({
    where: { sha256: 'sha256-analiz3-final-2023' },
    update: {},
    create: {
      id: 'doc-analiz3-final-2023',
      sha256: 'sha256-analiz3-final-2023',
      canonicalName: 'analiz3_final_2023.jpg',
      fileType: 'image',
      sizeBytes: 85200,
      pageCount: 1,
      isScanned: true,
      author: 'Eskişehir Osmangazi Üniversitesi',
      institution: 'Eskişehir Osmangazi Üniversitesi',
      academicPeriod: '2. Sınıf Güz',
      primaryRole: 'EXAM_PAPER',
      secondaryRoles: JSON.stringify(['PROBLEM_SOURCE', 'SOLUTION_SOURCE']),
      authority: 'PROFESSOR',
      verificationLevel: 'HUMAN_REVIEWED',
      whyThisSource: '12.01.2023 tarihli Analiz III Final sınavıdır. Yöne göre türev, ekstremumlar, Lagrange çarpanları ve çift katlı integralleri içerir.',
      qualityMetrics: JSON.stringify({
        authority: 92,
        completeness: 88,
        clarity: 85,
        relevance: 100,
        exampleQuality: 88,
        problemQuality: 95,
        solutionQuality: 90,
        extractionQuality: 86,
        OCRQuality: 88,
        recency: 92,
        provenanceConfidence: 95
      })
    }
  });

  await prisma.sourceLocation.upsert({
    where: { repositoryId_relativePath: { repositoryId: repoMaster.id, relativePath: '1.Sınıf Güz\\Analiz\\analiz3_final_2023.jpg' } },
    update: {},
    create: {
      documentId: docAnaliz3Final.id,
      repositoryId: repoMaster.id,
      relativePath: '1.Sınıf Güz\\Analiz\\analiz3_final_2023.jpg',
      fullPath: 'D:\\Belgeler\\Ders\\1.Sınıf Güz\\Analiz\\analiz3_final_2023.jpg',
      isCanonical: true
    }
  });

  // Doc 7: Lineer Cebir I Notları
  const docLineerCebir = await prisma.sourceDocument.upsert({
    where: { sha256: 'sha256-lineer-cebir-notlari' },
    update: {},
    create: {
      id: 'doc-lineer-cebir',
      sha256: 'sha256-lineer-cebir-notlari',
      canonicalName: 'Lineer Cebir I.pdf',
      fileType: 'pdf',
      sizeBytes: 8400000,
      pageCount: 120,
      isScanned: false,
      author: 'Eskişehir Osmangazi Üniversitesi',
      institution: 'Eskişehir Osmangazi Üniversitesi',
      academicPeriod: '1. Sınıf Bahar',
      primaryRole: 'PRIMARY_THEORY',
      secondaryRoles: JSON.stringify(['PRIMARY_TEACHING']),
      authority: 'PROFESSOR',
      verificationLevel: 'SOURCE_REFERENCED',
      whyThisSource: 'ESOGÜ Matematik Bölümü resmi Lineer Cebir ders notlarıdır. Vektör uzayları, matris dönüşümleri, özdeğerler ve köşegenleştirmeyi kapsar.',
      qualityMetrics: JSON.stringify({
        authority: 92,
        completeness: 94,
        clarity: 90,
        relevance: 98,
        exampleQuality: 88,
        problemQuality: 86,
        solutionQuality: 86,
        extractionQuality: 95,
        OCRQuality: 100,
        recency: 85,
        provenanceConfidence: 95
      })
    }
  });

  await prisma.sourceLocation.upsert({
    where: { repositoryId_relativePath: { repositoryId: repoMaster.id, relativePath: '1.Sınıf Bahar\\Lineer Cebir\\Lineer Cebir I.pdf' } },
    update: {},
    create: {
      documentId: docLineerCebir.id,
      repositoryId: repoMaster.id,
      relativePath: '1.Sınıf Bahar\\Lineer Cebir\\Lineer Cebir I.pdf',
      fullPath: 'D:\\Belgeler\\Ders\\1.Sınıf Bahar\\Lineer Cebir\\Lineer Cebir I.pdf',
      isCanonical: true
    }
  });

  // Doc 8: TBT MATLAB Serisi
  const docTbtMatlab = await prisma.sourceDocument.upsert({
    where: { sha256: 'sha256-tbt-matlab-odabas' },
    update: {},
    create: {
      id: 'doc-tbt-matlab',
      sha256: 'sha256-tbt-matlab-odabas',
      canonicalName: 'ders1.md - ders11.md (TBT MATLAB Serisi)',
      fileType: 'text',
      sizeBytes: 250000,
      pageCount: 11,
      isScanned: false,
      author: 'Dr. Alper Odabaş',
      institution: 'Eskişehir Osmangazi Üniversitesi',
      academicPeriod: '1. Sınıf Güz & Bahar',
      primaryRole: 'PRIMARY_TEACHING',
      secondaryRoles: JSON.stringify(['CODE_SOURCE', 'EXAMPLE_SOURCE']),
      authority: 'PROFESSOR',
      verificationLevel: 'CODE_VERIFIED',
      whyThisSource: 'Dr. Alper Odabaş tarafından hazırlanan 11 haftalık tam MATLAB müfredatıdır. Matris işlemleri, grafik çizimleri, sayısal integrasyon (trapz) ve diferansiyel denklem çözümü (ode45) kodlarını içerir.',
      qualityMetrics: JSON.stringify({
        authority: 95,
        completeness: 96,
        clarity: 94,
        relevance: 100,
        exampleQuality: 95,
        problemQuality: 90,
        solutionQuality: 92,
        extractionQuality: 100,
        OCRQuality: 100,
        recency: 90,
        provenanceConfidence: 98
      })
    }
  });

  await prisma.sourceLocation.upsert({
    where: { repositoryId_relativePath: { repositoryId: repoMaster.id, relativePath: 'TBT\\ders1.md' } },
    update: {},
    create: {
      documentId: docTbtMatlab.id,
      repositoryId: repoMaster.id,
      relativePath: 'TBT\\ders1.md',
      fullPath: 'D:\\Belgeler\\Ders\\TBT\\ders1.md',
      isCanonical: true
    }
  });

  // Doc 9: Python Algoritma ve Sayılar Teorisi
  const docPython = await prisma.sourceDocument.upsert({
    where: { sha256: 'sha256-python-algoritma-esogu' },
    update: {},
    create: {
      id: 'doc-python-algo',
      sha256: 'sha256-python-algoritma-esogu',
      canonicalName: 'PYTHON PROGRAMLAMA & ALGORİTMA REHBERİ',
      fileType: 'code',
      sizeBytes: 180000,
      pageCount: 46,
      isScanned: false,
      author: 'Eskişehir Osmangazi Üniversitesi',
      institution: 'Eskişehir Osmangazi Üniversitesi',
      academicPeriod: '1. Sınıf Güz',
      primaryRole: 'CODE_SOURCE',
      secondaryRoles: JSON.stringify(['PRIMARY_TEACHING', 'EXAMPLE_SOURCE']),
      authority: 'DEPARTMENT',
      verificationLevel: 'CODE_VERIFIED',
      whyThisSource: '46 adet Python algoritma betiği ve rehber belgesidir; Öklid algoritması, asallık testleri, dinamik programlama ve nesne yönelimli programlama temellerini içerir.',
      qualityMetrics: JSON.stringify({
        authority: 90,
        completeness: 92,
        clarity: 92,
        relevance: 100,
        exampleQuality: 94,
        problemQuality: 90,
        solutionQuality: 92,
        extractionQuality: 100,
        OCRQuality: 100,
        recency: 88,
        provenanceConfidence: 95
      })
    }
  });

  await prisma.sourceLocation.upsert({
    where: { repositoryId_relativePath: { repositoryId: repoMaster.id, relativePath: '1.Sınıf Güz\\Bilgisayar Programlama\\ebob_ekok.py' } },
    update: {},
    create: {
      documentId: docPython.id,
      repositoryId: repoMaster.id,
      relativePath: '1.Sınıf Güz\\Bilgisayar Programlama\\ebob_ekok.py',
      fullPath: 'D:\\Belgeler\\Ders\\1.Sınıf Güz\\Bilgisayar Programlama\\ebob_ekok.py',
      isCanonical: true
    }
  });

  // Doc 10: Görsel Programlama 2022-2023 Vizeleri
  const docGorselProg = await prisma.sourceDocument.upsert({
    where: { sha256: 'sha256-gorsel-prog-saka' },
    update: {},
    create: {
      id: 'doc-gorsel-prog-2022-2023',
      sha256: 'sha256-gorsel-prog-saka',
      canonicalName: 'gorsel_prog_vize_2022.pdf & 2023.pdf',
      fileType: 'pdf',
      sizeBytes: 1250000,
      pageCount: 6,
      isScanned: false,
      author: 'Prof. Dr. Bülent Saka',
      institution: 'Eskişehir Osmangazi Üniversitesi',
      academicPeriod: '2. Sınıf Güz',
      primaryRole: 'EXAM_PAPER',
      secondaryRoles: JSON.stringify(['PROBLEM_SOURCE']),
      authority: 'PROFESSOR',
      verificationLevel: 'SOURCE_REFERENCED',
      familyId: famGorsel.id,
      whyThisSource: 'Prof. Dr. Bülent Saka tarafından hazırlanan resmi C# Windows Forms vize sınavlarıdır. Olay güdümlü programlama, delege/event yapıları ve GUI mantığını içerir.',
      qualityMetrics: JSON.stringify({
        authority: 94,
        completeness: 88,
        clarity: 90,
        relevance: 100,
        exampleQuality: 88,
        problemQuality: 92,
        solutionQuality: 88,
        extractionQuality: 98,
        OCRQuality: 100,
        recency: 92,
        provenanceConfidence: 96
      })
    }
  });

  await prisma.sourceLocation.upsert({
    where: { repositoryId_relativePath: { repositoryId: repoMaster.id, relativePath: '2.Sınıf Güz\\Görsel Programlama\\gorsel_prog_vize_2022.pdf' } },
    update: {},
    create: {
      documentId: docGorselProg.id,
      repositoryId: repoMaster.id,
      relativePath: '2.Sınıf Güz\\Görsel Programlama\\gorsel_prog_vize_2022.pdf',
      fullPath: 'D:\\Belgeler\\Ders\\2.Sınıf Güz\\Görsel Programlama\\gorsel_prog_vize_2022.pdf',
      isCanonical: true
    }
  });

  // 4. COURSES CATALOG
  const coursesData = [
    {
      id: 'graf-teorisi',
      code: 'MAT211',
      name: 'Graf Teorisi ve Uygulamaları-I',
      englishName: 'Graph Theory and Applications I',
      department: 'Matematik ve Bilgisayar Bilimleri',
      semester: '2. Sınıf Güz',
      isCurrentSemester: true,
      coverageStatus: 'COMPLETE',
      primarySourceId: docGraf.id,
      description: 'Çizge temelleri, izomorfizma, Handshaking Lemma, Euler ve Hamilton çizgeleri, ağaçlar ve düzlemsel çizgeler.'
    },
    {
      id: 'diferansiyel-denklemler',
      code: 'MAT203',
      name: 'Diferansiyel Denklemler',
      englishName: 'Differential Equations',
      department: 'Matematik ve Bilgisayar Bilimleri',
      semester: '2. Sınıf Güz',
      isCurrentSemester: true,
      coverageStatus: 'PARTIAL',
      primarySourceId: docDifDenkFinal2025.id,
      description: '1. ve 2. mertebeden diferansiyel denklemler, Bernoulli, Belirsiz Katsayılar, Parametrelerin Değişimi, Laplace Dönüşümleri. (Not: Teori için Adams & Essex Calculus referans olarak eklenmiştir).'
    },
    {
      id: 'bilgisayar-mimarisi',
      code: 'CENG201',
      name: 'Bilgisayar Mimarisi',
      englishName: 'Computer Architecture',
      department: 'Matematik ve Bilgisayar Bilimleri',
      semester: '2. Sınıf Güz',
      isCurrentSemester: true,
      coverageStatus: 'COMPLETE',
      primarySourceId: docMimariSlayt.id,
      description: 'Von Neumann mimarisi, ALU tasarımı, MIPS komut seti, Booth çarpma algoritması, Cache bellek eşleme ve Pipelining.'
    },
    {
      id: 'analiz-3',
      code: 'MAT201',
      name: 'Analiz III',
      englishName: 'Mathematical Analysis III',
      department: 'Matematik ve Bilgisayar Bilimleri',
      semester: '2. Sınıf Güz',
      isCurrentSemester: true,
      coverageStatus: 'COMPLETE',
      primarySourceId: docAnaliz3Final.id,
      description: 'Çok değişkenli fonksiyonlar, kısmi türevler, yöne göre türev, gradyan, Lagrange çarpanları, çift katlı integraller.'
    },
    {
      id: 'gorsel-programlama-1',
      code: 'CENG205',
      name: 'Görsel Programlama I',
      englishName: 'Visual Programming I',
      department: 'Matematik ve Bilgisayar Bilimleri',
      semester: '2. Sınıf Güz',
      isCurrentSemester: true,
      coverageStatus: 'COMPLETE',
      primarySourceId: docGorselProg.id,
      description: 'C# Windows Forms, olay güdümlü programlama, GUI bileşenleri, delege ve event mimarisi.'
    },
    {
      id: 'analiz-1',
      code: 'MAT101',
      name: 'Analiz I',
      englishName: 'Calculus & Analysis I',
      department: 'Matematik ve Bilgisayar Bilimleri',
      semester: '1. Sınıf Güz',
      isCurrentSemester: false,
      coverageStatus: 'COMPLETE',
      primarySourceId: docAdamsCalculus.id,
      description: 'Limit, süreklilik, tek değişkenli fonksiyonlarda türev, ortalama değer teoremi, integral temelleri.'
    },
    {
      id: 'analiz-2',
      code: 'MAT102',
      name: 'Analiz II',
      englishName: 'Calculus & Analysis II',
      department: 'Matematik ve Bilgisayar Bilimleri',
      semester: '1. Sınıf Bahar',
      isCurrentSemester: false,
      coverageStatus: 'COMPLETE',
      primarySourceId: docAdamsCalculus.id,
      description: 'İntegrasyon teknikleri, genelleştirilmiş integraller, seriler, Taylor ve Maclaurin serileri.'
    },
    {
      id: 'lineer-cebir-1',
      code: 'MAT103',
      name: 'Lineer Cebir I & II',
      englishName: 'Linear Algebra I & II',
      department: 'Matematik ve Bilgisayar Bilimleri',
      semester: '1. Sınıf Bahar',
      isCurrentSemester: false,
      coverageStatus: 'COMPLETE',
      primarySourceId: docLineerCebir.id,
      description: 'Vektör uzayları, alt uzaylar, taban ve boyut, lineer dönüşümler, matris cebiri, özdeğerler ve özvektörler.'
    },
    {
      id: 'ayrik-matematik',
      code: 'MAT105',
      name: 'Ayrık Matematik',
      englishName: 'Discrete Mathematics',
      department: 'Matematik ve Bilgisayar Bilimleri',
      semester: '1. Sınıf Bahar',
      isCurrentSemester: false,
      coverageStatus: 'COMPLETE',
      primarySourceId: docGraf.id,
      description: 'Önermeler mantığı, matematiksel tümevarım, bağıntılar, güvercin yuvası ilkesi, kombinatorik, yineleme bağıntıları.'
    },
    {
      id: 'bilgisayar-programlama-1',
      code: 'CENG101',
      name: 'Bilgisayar Programlama (Python)',
      englishName: 'Computer Programming (Python)',
      department: 'Matematik ve Bilgisayar Bilimleri',
      semester: '1. Sınıf Güz',
      isCurrentSemester: false,
      coverageStatus: 'COMPLETE',
      primarySourceId: docPython.id,
      description: 'Python temelleri, kontrol akışı, fonksiyonlar, veri yapıları, algoritmik düşünce ve sayılar teorisi algoritmaları.'
    },
    {
      id: 'temel-bilgi-teknolojileri',
      code: 'CENG103',
      name: 'Temel Bilgi Teknolojileri (MATLAB)',
      englishName: 'Information Technologies (MATLAB)',
      department: 'Matematik ve Bilgisayar Bilimleri',
      semester: '1. Sınıf Güz',
      isCurrentSemester: false,
      coverageStatus: 'COMPLETE',
      primarySourceId: docTbtMatlab.id,
      description: 'MATLAB matris indisleme, 2D/3D görselleştirme, sayısal türev/integral ve ODE çözücüler.'
    },
    {
      id: 'sembolik-hesaplama',
      code: 'MAT301',
      name: 'Sembolik Hesaplama (CAS)',
      englishName: 'Symbolic Computation (CAS)',
      department: 'Matematik ve Bilgisayar Bilimleri',
      semester: '3. Sınıf',
      isCurrentSemester: false,
      coverageStatus: 'COMPLETE',
      primarySourceId: docAdamsCalculus.id,
      description: 'Bilgisayarlı Cebir Sistemleri, Gröbner tabanları, polinom algoritmaları ve sembolik matematik motorları.'
    }
  ];

  for (const c of coursesData) {
    await prisma.course.upsert({
      where: { id: c.id },
      update: c,
      create: c
    });
  }

  // 5. COURSE PREREQUISITES
  const prerequisitesData = [
    { courseId: 'analiz-2', prerequisiteId: 'analiz-1', relationType: 'DIRECT_ACADEMIC' },
    { courseId: 'analiz-3', prerequisiteId: 'analiz-2', relationType: 'DIRECT_ACADEMIC' },
    { courseId: 'diferansiyel-denklemler', prerequisiteId: 'analiz-1', relationType: 'INFERRED_PREREQUISITE' },
    { courseId: 'diferansiyel-denklemler', prerequisiteId: 'lineer-cebir-1', relationType: 'INFERRED_PREREQUISITE' },
    { courseId: 'graf-teorisi', prerequisiteId: 'ayrik-matematik', relationType: 'INFERRED_PREREQUISITE' },
    { courseId: 'bilgisayar-mimarisi', prerequisiteId: 'bilgisayar-programlama-1', relationType: 'INFERRED_PREREQUISITE' },
    { courseId: 'gorsel-programlama-1', prerequisiteId: 'bilgisayar-programlama-1', relationType: 'INFERRED_PREREQUISITE' },
    { courseId: 'sembolik-hesaplama', prerequisiteId: 'lineer-cebir-1', relationType: 'INFERRED_PREREQUISITE' },
  ];

  for (const p of prerequisitesData) {
    await prisma.coursePrerequisite.upsert({
      where: { courseId_prerequisiteId: { courseId: p.courseId, prerequisiteId: p.prerequisiteId } },
      update: {},
      create: p
    });
  }

  // 6. SOURCE CONFLICT LOGGING
  await prisma.sourceConflict.upsert({
    where: { id: 'conflict-difdenk-coverage' },
    update: {},
    create: {
      id: 'conflict-difdenk-coverage',
      topic: 'Diferansiyel Denklemler Teorik Kapsam',
      sourceAId: docDifDenkFinal2025.id,
      sourceBId: docAdamsCalculus.id,
      description: 'Yerel ESOGÜ arşivinde tam teorik ders notu PDF\'i bulunmayıp sadece vize/final sınav kağıtları mevcuttur. Teori açığı Adams & Essex Calculus ile kapatılmış olup, harici kaynak statüsü açıkça etiketlenmiştir.',
      resolutionStatus: 'RESOLVED_CANONICAL_CHOSEN',
      resolutionNotes: 'Sınav soruları için ESOGÜ Final kağıtları, ispat ve teori için Adams & Essex Calculus Bölüm 17 referans olarak bağlandı.'
    }
  });

  // 7. COURSE TOPICS & CONCEPTS GROUNDING
  // 7.1. Analiz III -> Yöne Göre Türev
  const topicYoneTurev = await prisma.courseTopic.upsert({
    where: { id: 'top-analiz3-yone-turev' },
    update: {},
    create: {
      id: 'top-analiz3-yone-turev',
      courseId: 'analiz-3',
      orderIndex: 1,
      title: 'Yöne Göre Türev ve Gradyan Vektörü',
      englishTitle: 'Directional Derivative and Gradient Vector',
      description: 'Çok değişkenli fonksiyonlarda birim vektör yönündeki değişim oranı ve gradyan ilişkisi.',
      primaryTeachingSourceId: docAdamsCalculus.id,
      primaryExamSourceId: docAnaliz3Final.id
    }
  });

  // Concept: directional-derivative
  const conceptYoneTurev = await prisma.concept.upsert({
    where: { id: 'directional-derivative' },
    update: {},
    create: {
      id: 'directional-derivative',
      category: 'MATHEMATICS',
      subcategory: 'Analiz III',
      formalStatement: 'f: \\mathbb{R}^n \\to \\mathbb{R} diferansiyellenebilir bir fonksiyon ve \\vec{u} birim vektör (|\\vec{u}|=1) olsun. f\'in \\vec{u} yönündeki türevi D_{\\vec{u}}f = \\nabla f \\cdot \\vec{u} dir.',
      canonicalFormula: 'D_{\\vec{u}}f(x_0, y_0) = \\nabla f(x_0, y_0) \\cdot \\vec{u} = \\frac{\\partial f}{\\partial x}u_1 + \\frac{\\partial f}{\\partial y}u_2',
      assumptions: 'f fonksiyonunun (x_0, y_0) noktasında sürekli kısmi türevlere sahip olması ve ||u|| = 1 birim vektör olması gerekir.',
      proofDerivation: 'Tek değişkenli g(t) = f(x_0 + t u_1, y_0 + t u_2) fonksiyonu tanımlanır. Çok değişkenli zincir kuralı uygulandığında g\'(0) = f_x u_1 + f_y u_2 elde edilir.',
      verificationLevel: 5,
      verificationStatus: 'VERIFIED',
      sourceTitle: docAnaliz3Final.id,
      sourceAuthor: 'Eskişehir Osmangazi Üniversitesi',
      sourceCitation: 'Analiz III 2023 Final Sınavı Soru 2 & Adams-Essex Calculus Section 12.7'
    }
  });

  await prisma.conceptTranslation.upsert({
    where: { conceptId_language: { conceptId: conceptYoneTurev.id, language: 'tr' } },
    update: {},
    create: {
      conceptId: conceptYoneTurev.id,
      language: 'tr',
      name: 'Yöne Göre Türev',
      dualTerminology: 'Yöne Göre Türev (Directional Derivative)',
      definition: '$f(x,y)$ diferansiyellenebilir bir fonksiyon ve $\\vec{u}=(u_1, u_2)$ birim vektör ($||\\vec{u}||=1$) olsun. $f$\'in $\\vec{u}$ yönündeki yönlü türevi $D_{\\vec{u}}f(x,y) = \\nabla f(x,y) \\cdot \\vec{u}$ iç çarpımı ile hesaplanır.',
      intuition: 'Bir tepe üzerinde dururken belirli bir pusula yönünde bir adım attığınızda yüksekliğinizin ne kadar değiştiğini gösteren eğimdir. En dik artış yönü her zaman gradyan vektörü $\\nabla f$ yönündedir.',
      commonPitfalls: 'Verilen yön vektörünü birim vektöre normalize etmeyi unutmak (vektörü boyuna bölmemek en sık yapılan hatadır).'
    }
  });

  await prisma.topicConcept.upsert({
    where: { topicId_conceptId: { topicId: topicYoneTurev.id, conceptId: conceptYoneTurev.id } },
    update: {},
    create: { topicId: topicYoneTurev.id, conceptId: conceptYoneTurev.id }
  });

  // Source Reference for Yöne Göre Türev
  await prisma.sourceReference.upsert({
    where: { id: 'ref-yone-turev-adams' },
    update: {},
    create: {
      id: 'ref-yone-turev-adams',
      documentId: docAdamsCalculus.id,
      conceptId: conceptYoneTurev.id,
      sectionTitle: 'Section 12.7 Directional Derivatives and Gradients',
      pageNumber: 712,
      paragraphSnippet: 'Theorem 7: If f is differentiable at P, then f has a directional derivative in the direction of any unit vector u, and D_u f(P) = grad(f)(P) . u',
      referenceType: 'THEOREM',
      verificationStatus: 'SYMBOLICALLY_VERIFIED'
    }
  });

  // Source Problem for Analiz III Final 2023
  const probAnaliz3 = await prisma.sourceProblem.upsert({
    where: { id: 'src-prob-analiz3-final-2023-q2' },
    update: {},
    create: {
      id: 'src-prob-analiz3-final-2023-q2',
      documentId: docAnaliz3Final.id,
      problemType: 'SOURCE_EXACT',
      examYear: 2023,
      examType: 'FINAL',
      sourceLocation: '12.01.2023 Final Sınavı Soru 2',
      rawPrompt: '$f(x,y) = x^2 y + 2xy^2$ fonksiyonunun $P(1, 2)$ noktasında $\\vec{v} = (3, 4)$ yönündeki yönlü türevini hesaplayınız.',
      adaptedPrompt: '$f(x,y) = x^2 y + 2xy^2$ fonksiyonunun $P(1, 2)$ noktasındaki gradyanı ve $\\vec{u} = (3/5, 4/5)$ birim vektörü yönündeki türevi nedir?',
      officialSolution: '1. Gradyan: $\\nabla f = (2xy + 2y^2, x^2 + 4xy)$. P(1,2) noktasında $\\nabla f(1,2) = (4 + 8, 1 + 8) = (12, 9)$.\n2. Birim vektör: $|\\vec{v}| = \\sqrt{3^2 + 4^2} = 5 \\implies \\vec{u} = (3/5, 4/5)$.\n3. Yönlü türev: $D_{\\vec{u}}f(1,2) = 12(3/5) + 9(4/5) = (36 + 36)/5 = 72/5 = 14.4$.',
      verificationLevel: 'SYMBOLICALLY_VERIFIED'
    }
  });

  await prisma.sourceSolution.upsert({
    where: { id: 'sol-analiz3-final-q2' },
    update: {},
    create: {
      id: 'sol-analiz3-final-q2',
      sourceProblemId: probAnaliz3.id,
      methodName: 'Yöntem: Gradyan ve Birim Vektör İç Çarpımı',
      solutionText: '$\\nabla f(1,2) = (12, 9)$, $\\vec{u}=(3/5, 4/5)$, $D_{\\vec{u}}f = 12 \\cdot 0.6 + 9 \\cdot 0.8 = 7.2 + 7.2 = 14.4 = 72/5$.',
      authorType: 'PROFESSOR_OFFICIAL',
      verificationStatus: 'SYMBOLICALLY_VERIFIED'
    }
  });

  // 7.2. Diferansiyel Denklemler -> Bernoulli Denklemi
  const topicBernoulli = await prisma.courseTopic.upsert({
    where: { id: 'top-difdenk-bernoulli' },
    update: {},
    create: {
      id: 'top-difdenk-bernoulli',
      courseId: 'diferansiyel-denklemler',
      orderIndex: 1,
      title: 'Bernoulli Diferansiyel Denklemleri',
      englishTitle: 'Bernoulli Differential Equations',
      description: 'Lineer olmayan ancak v = y^{1-n} dönüşümü ile 1. mertebeden lineer hale getirilebilen denklemler.',
      primaryExamSourceId: docDifDenkFinal2025.id,
      primaryTheorySourceId: docAdamsCalculus.id
    }
  });

  const conceptBernoulli = await prisma.concept.upsert({
    where: { id: 'bernoulli-differential-equation' },
    update: {},
    create: {
      id: 'bernoulli-differential-equation',
      category: 'MATHEMATICS',
      subcategory: 'Diferansiyel Denklemler',
      formalStatement: 'y\' + P(x)y = Q(x)y^n biçimindeki denklemlere Bernoulli diferansiyel denklemi denir (n \\neq 0, 1).',
      canonicalFormula: 'v = y^{1-n} \\implies \\frac{dv}{dx} + (1-n)P(x)v = (1-n)Q(x)',
      assumptions: 'n \\neq 0 ve n \\neq 1 (n=0 ve n=1 durumlarında denklem zaten lineerdir).',
      proofDerivation: 'Denklem y^n ile bölünür: y^{-n}y\' + P(x)y^{1-n} = Q(x). v = y^{1-n} türevi v\' = (1-n)y^{-n}y\' yerine konulduğunda 1. mertebeden standart lineer denklem elde edilir.',
      verificationLevel: 5,
      verificationStatus: 'VERIFIED',
      sourceTitle: docDifDenkFinal2025.id,
      sourceAuthor: 'Eskişehir Osmangazi Üniversitesi',
      sourceCitation: '06.01.2025 Final Sınavı Soru 1 & Adams-Essex Calculus Section 17.2'
    }
  });

  await prisma.conceptTranslation.upsert({
    where: { conceptId_language: { conceptId: conceptBernoulli.id, language: 'tr' } },
    update: {},
    create: {
      conceptId: conceptBernoulli.id,
      language: 'tr',
      name: 'Bernoulli Diferansiyel Denklemi',
      dualTerminology: 'Bernoulli Diferansiyel Denklemi (Bernoulli Differential Equation)',
      definition: '$y\' + P(x)y = Q(x)y^n$ ($n \\neq 0, 1$) formundaki birinci mertebeden lineer olmayan diferansiyel denklemdir.',
      intuition: 'Sağ tarafta bulunan $y^n$ terimi denklemi lineer olmaktan çıkarır. Ancak akıllıca bir değişken değiştirme ($v = y^{1-n}$) yapılarak denklem standart integrasyon çarpanı ile çözülebilen lineer bir denkleme dönüştürülür.',
      commonPitfalls: 'Dönüşüm türevinde $(1-n)$ katsayısını unutmak veya $v$ bulunduktan sonra orijinal $y$ değişkenine geri dönmemek.'
    }
  });

  await prisma.topicConcept.upsert({
    where: { topicId_conceptId: { topicId: topicBernoulli.id, conceptId: conceptBernoulli.id } },
    update: {},
    create: { topicId: topicBernoulli.id, conceptId: conceptBernoulli.id }
  });

  // Source Problem for Bernoulli (06.01.2025 ESOGÜ Final Sınavı)
  const probBernoulli = await prisma.sourceProblem.upsert({
    where: { id: 'src-prob-difdenk-final-2025-q1' },
    update: {},
    create: {
      id: 'src-prob-difdenk-final-2025-q1',
      documentId: docDifDenkFinal2025.id,
      problemType: 'SOURCE_EXACT',
      examYear: 2025,
      examType: 'FINAL',
      sourceLocation: '06.01.2025 Final Sınavı Soru 1',
      rawPrompt: '$y\' + \\frac{1}{x}y = x y^2$ diferansiyel denkleminin genel çözümünü bulunuz.',
      adaptedPrompt: '$y\' + \\frac{1}{x}y = x y^2$ denklemi için $v = y^{-1}$ dönüşümü yapıldığında elde edilen lineer denklemi ve $y(x)$ çözümünü bulunuz.',
      officialSolution: '1. Bernoulli n=2. Her tarafı $y^2$\'ye böl: $y^{-2}y\' + \\frac{1}{x}y^{-1} = x$.\n2. $v = y^{1-2} = y^{-1} \\implies v\' = -y^{-2}y\' \\implies y^{-2}y\' = -v\'$.\n3. Yerine yaz: $-v\' + \\frac{1}{x}v = x \\implies v\' - \\frac{1}{x}v = -x$.\n4. İntegrasyon çarpanı: $\\mu(x) = e^{\\int -1/x dx} = e^{-\\ln x} = 1/x$.\n5. $(v/x)\' = -1 \\implies v/x = -x + C \\implies v = -x^2 + Cx$.\n6. $y = 1/v = \\frac{1}{Cx - x^2}$.',
      verificationLevel: 'SYMBOLICALLY_VERIFIED'
    }
  });

  await prisma.sourceSolution.upsert({
    where: { id: 'sol-difdenk-final-2025-q1' },
    update: {},
    create: {
      id: 'sol-difdenk-final-2025-q1',
      sourceProblemId: probBernoulli.id,
      methodName: 'Yöntem: Bernoulli Lineerleştirme (v = y^-1)',
      solutionText: 'Genel çözüm: $y(x) = \\frac{1}{Cx - x^2}$ (veya $y(x) = \\frac{1}{x(C - x)}$).',
      authorType: 'STUDENT_EXAM_SHEET',
      verificationStatus: 'SYMBOLICALLY_VERIFIED'
    }
  });

  // 7.3. Graf Teorisi -> Euler Çizgesi (Eulerian Graph)
  const topicEuler = await prisma.courseTopic.upsert({
    where: { id: 'top-graf-euler' },
    update: {},
    create: {
      id: 'top-graf-euler',
      courseId: 'graf-teorisi',
      orderIndex: 2,
      title: 'Euler Çizgeleri ve Handshaking Lemma',
      englishTitle: 'Eulerian Graphs and Handshaking Lemma',
      description: 'Her kenardan tam olarak bir kez geçen kapalı yollar (Euler turu) ve köşe derece teoremleri.',
      primaryTeachingSourceId: docGraf.id,
      primaryTheorySourceId: docGraf.id
    }
  });

  const conceptEuler = await prisma.concept.upsert({
    where: { id: 'euler-graph' },
    update: {},
    create: {
      id: 'euler-graph',
      category: 'MATHEMATICS',
      subcategory: 'Graf Teorisi',
      formalStatement: 'Bağlantılı bir G=(V,E) çizgesinin bir Euler devresine sahip olması için gerek ve yeter koşul her v \\in V köşesinin derecesinin çift (deg(v) \\equiv 0 \\pmod 2) olmasıdır.',
      canonicalFormula: '\\sum_{v \\in V} \\deg(v) = 2|E| \\quad \\text{ve} \\quad \\forall v \\in V, \\, \\deg(v) \\text{ çifttir}',
      assumptions: 'G çizgesi bağlantılı olmalı (derecesi 0 olan izole köşeler hariç) ve kenar sayısı |E| \\ge 1 olmalıdır.',
      proofDerivation: 'Gereklilik: Tur her köşeye girdiğinde bir kenar kullanır, çıktığında başka bir kenar kullanır; dolayısıyla her geçiş dereceye 2 katkıda bulunur. Yeterlilik: Fleury veya Hierholzer algoritması ile döngülerin birleştirilmesiyle kurulur.',
      verificationLevel: 5,
      verificationStatus: 'VERIFIED',
      sourceTitle: docGraf.id,
      sourceAuthor: 'Prof. Dr. İbrahim Günaltılı',
      sourceCitation: 'GRAF TEORİ DERS NOTLARI.docx Teorem 2.1 & Bölüm 3'
    }
  });

  await prisma.conceptTranslation.upsert({
    where: { conceptId_language: { conceptId: conceptEuler.id, language: 'tr' } },
    update: {},
    create: {
      conceptId: conceptEuler.id,
      language: 'tr',
      name: 'Euler Çizgesi',
      dualTerminology: 'Euler Çizgesi (Eulerian Graph)',
      definition: 'Bir çizgede her kenardan tam olarak bir kez geçen ve başladığı köşede biten kapalı bir yürüyüşe **Euler Devresi (Eulerian Circuit)**; böyle bir devreye sahip çizgeye ise **Euler Çizgesi** denir.',
      intuition: 'Bir şekli kalemi kağıttan kaldırmadan ve aynı çizginin üzerinden iki kez geçmeden çizip başladığınız noktaya dönebilme problemidir (Königsberg Köprü Problemi). Bir köşeye girdiğiniz her seferde oradan çıkabilmeniz için o köşeye bağlı kenar sayısı mutlaka çift olmalıdır.',
      commonPitfalls: 'Euler Çizgesi (her kenardan 1 kez geçme) ile Hamilton Çizgesi (her köşeden 1 kez geçme) kavramlarını karıştırmak.'
    }
  });

  await prisma.topicConcept.upsert({
    where: { topicId_conceptId: { topicId: topicEuler.id, conceptId: conceptEuler.id } },
    update: {},
    create: { topicId: topicEuler.id, conceptId: conceptEuler.id }
  });

  // Source Reference for Euler
  await prisma.sourceReference.upsert({
    where: { id: 'ref-euler-gunaltili' },
    update: {},
    create: {
      id: 'ref-euler-gunaltili',
      documentId: docGraf.id,
      conceptId: conceptEuler.id,
      sectionTitle: 'Bölüm 2: Euler Çizgeleri ve Teoremleri',
      pageNumber: 24,
      paragraphSnippet: 'Teorem 2.1: Bağlantılı bir G çizgesinin bir Euler turuna sahip olması için gerek ve yeter şart, G\'nin her köşesinin derecesinin çift olmasıdır.',
      referenceType: 'THEOREM',
      verificationStatus: 'SOURCE_REFERENCED'
    }
  });

  // Source Problem for Euler Graph
  const probEuler = await prisma.sourceProblem.upsert({
    where: { id: 'src-prob-graf-euler-q1' },
    update: {},
    create: {
      id: 'src-prob-graf-euler-q1',
      documentId: docGraf.id,
      problemType: 'SOURCE_EXACT',
      examType: 'BOOK_EXERCISE',
      sourceLocation: 'GRAF TEORİ DERS NOTLARI Örnek 2.4',
      rawPrompt: 'Bir $G$ çizgesinin köşe dereceleri sırasıyla $(4, 4, 4, 2, 2)$ olarak verilmiştir. $G$ bağlantılı olduğuna göre $G$\'nin toplam kenar sayısı kaçtır ve $G$ bir Euler çizgesi midir?',
      adaptedPrompt: 'Derece dizisi $(4, 4, 4, 2, 2)$ olan bağlantılı bir çizgenin kenar sayısı $|E|$ kaçtır?',
      officialSolution: 'Handshaking Lemma: $\\sum \\deg(v) = 2|E| \\implies 4 + 4 + 4 + 2 + 2 = 16 = 2|E| \\implies |E| = 8$. Tüm dereceler {4, 4, 4, 2, 2} çift sayı olduğundan ve çizge bağlantılı olduğundan G bir Euler çizgesidir.',
      verificationLevel: 'SYMBOLICALLY_VERIFIED'
    }
  });

  await prisma.sourceSolution.upsert({
    where: { id: 'sol-graf-euler-q1' },
    update: {},
    create: {
      id: 'sol-graf-euler-q1',
      sourceProblemId: probEuler.id,
      methodName: 'Handshaking Lemma ve Euler Karakterizasyonu',
      solutionText: '|E| = 16 / 2 = 8. Bütün dereceler çift olduğu için Euler turu vardır.',
      authorType: 'PROFESSOR_OFFICIAL',
      verificationStatus: 'SYMBOLICALLY_VERIFIED'
    }
  });

  // 7.4. Bilgisayar Mimarisi -> Cache Bellek Eşleme (Direct & Set-Associative)
  const topicCache = await prisma.courseTopic.upsert({
    where: { id: 'top-mimari-cache' },
    update: {},
    create: {
      id: 'top-mimari-cache',
      courseId: 'bilgisayar-mimarisi',
      orderIndex: 3,
      title: 'Önbellek (Cache) Bellek Eşleme Mimarisi',
      englishTitle: 'Cache Memory Mapping Architecture',
      description: 'Doğrudan Eşleme, Kümeli İlişkili Eşleme, Tag, Index ve Offset bit hesaplamaları.',
      primaryTeachingSourceId: docMimariSlayt.id,
      primaryExamSourceId: docMimariFinal.id
    }
  });

  const conceptCache = await prisma.concept.upsert({
    where: { id: 'cache-mapping' },
    update: {},
    create: {
      id: 'cache-mapping',
      category: 'COMPUTER_SCIENCE',
      subcategory: 'Bilgisayar Mimarisi',
      formalStatement: '32-bit bellek adresinde: Adres = Tag + Index + Offset bitlerinden oluşur. Blok boyutu B bayt için Offset = \\log_2(B); küme sayısı S için Index = \\log_2(S); Tag = 32 - (Index + Offset).',
      canonicalFormula: '\\text{Offset} = \\log_2(\\text{BlockSize}), \\quad \\text{Index} = \\log_2(\\text{NumSets}), \\quad \\text{Tag} = \\text{AddressBits} - \\text{Index} - \\text{Offset}',
      assumptions: 'Bellek bayt adreslenebilir olmalı ve blok boyutu ile küme sayıları 2\'nin tam kuvveti olmalıdır.',
      proofDerivation: 'Cache toplam boyutu C, N-yollu ilişkili için: Küme sayısı S = C / (N * B). Adresteki blok içi bayt adresi için \\log_2(B) bit, küme seçimi için \\log_2(S) bit ayrılır, kalan yüksek anlamlı bitler Tag etiketini oluşturur.',
      verificationLevel: 5,
      verificationStatus: 'VERIFIED',
      sourceTitle: docMimariFinal.id,
      sourceAuthor: 'Doç. Dr. Özer Çelik',
      sourceCitation: 'Bilgisayar Mimarisi 2021 Final Sınavı Soru 3 & Ders Notları Slayt 95-104'
    }
  });

  await prisma.conceptTranslation.upsert({
    where: { conceptId_language: { conceptId: conceptCache.id, language: 'tr' } },
    update: {},
    create: {
      conceptId: conceptCache.id,
      language: 'tr',
      name: 'Önbellek Eşleme (Cache Mapping)',
      dualTerminology: 'Önbellek Eşleme (Cache Mapping: Direct / Set-Associative)',
      definition: 'Ana bellekteki verilerin hızlı önbelleğe (L1/L2 Cache) hangi satırlara yerleştirileceğini belirleyen donanımsal eşleme yöntemidir (Doğrudan Eşleme, Tam İlişkili, K-Yollu Kümeli İlişkili).',
      intuition: 'Milyonlarca kitabın bulunduğu devasa bir kütüphaneden (RAM), masanızdaki küçük çalışma rafına (Cache) kitap getirirken her kitabın rafta nereye konulacağını belirleyen fihrist kodlamasıdır.',
      commonPitfalls: 'Kümeli ilişkili önbellekte toplam satır sayısı ile küme sayısını (Set Count) birbirine karıştırmak; Index bitleri satır sayısına göre değil küme sayısına göre hesaplanır.'
    }
  });

  await prisma.topicConcept.upsert({
    where: { topicId_conceptId: { topicId: topicCache.id, conceptId: conceptCache.id } },
    update: {},
    create: { topicId: topicCache.id, conceptId: conceptCache.id }
  });

  // Source Problem for Cache (2021 Final Doç. Dr. Özer Çelik)
  const probCache = await prisma.sourceProblem.upsert({
    where: { id: 'src-prob-mimari-final-2021-q3' },
    update: {},
    create: {
      id: 'src-prob-mimari-final-2021-q3',
      documentId: docMimariFinal.id,
      problemType: 'SOURCE_EXACT',
      examYear: 2021,
      examType: 'FINAL',
      sourceLocation: '2020-2021 Final Sınavı Soru 3',
      rawPrompt: '32-bit bayt adreslemeli bir sistemde, 64 KB kapasiteli ve her bloğu 64 Bayt olan 4-yollu kümeli ilişkili (4-way set associative) bir önbellek için Tag, Index ve Offset bit sayılarını bulunuz.',
      adaptedPrompt: '64 KB 4-way set associative cache (blok boyutu 64 bayt, 32-bit adres) için Index bit sayısı kaçtır?',
      officialSolution: '1. Blok boyutu: B = 64 Bayt = 2^6 Bayt \\implies Offset = 6 bit.\n2. Toplam blok sayısı: 64 KB / 64 B = 1024 blok.\n3. 4-yollu olduğundan Küme Sayısı S = 1024 / 4 = 256 küme = 2^8 \\implies Index = 8 bit.\n4. Tag bit sayısı = 32 - (Index + Offset) = 32 - (8 + 6) = 32 - 14 = 18 bit.\nSonuç: Tag = 18 bit, Index = 8 bit, Offset = 6 bit.',
      verificationLevel: 'NUMERICALLY_VERIFIED'
    }
  });

  await prisma.sourceSolution.upsert({
    where: { id: 'sol-mimari-final-2021-q3' },
    update: {},
    create: {
      id: 'sol-mimari-final-2021-q3',
      sourceProblemId: probCache.id,
      methodName: 'Bit Dağılımı Hesabı: Tag = 18, Index = 8, Offset = 6',
      solutionText: 'Offset = 6 bit, Index = 8 bit, Tag = 18 bit.',
      authorType: 'PROFESSOR_OFFICIAL',
      verificationStatus: 'NUMERICALLY_VERIFIED'
    }
  });

  // 7.5. Python -> Sayılar Teorisi (EBOB / Öklid)
  const topicPython = await prisma.courseTopic.upsert({
    where: { id: 'top-python-number-theory' },
    update: {},
    create: {
      id: 'top-python-number-theory',
      courseId: 'bilgisayar-programlama-1',
      orderIndex: 1,
      title: 'Sayılar Teorisi ve Öklid Algoritması',
      englishTitle: 'Number Theory and Euclidean Algorithm',
      description: 'En Büyük Ortak Bölen (EBOB) hesaplama, modüler aritmetik ve asallık algoritmaları.',
      primaryTeachingSourceId: docPython.id,
      primaryTheorySourceId: docPython.id
    }
  });

  const conceptEuclid = await prisma.concept.upsert({
    where: { id: 'euclidean-algorithm-python' },
    update: {},
    create: {
      id: 'euclidean-algorithm-python',
      category: 'COMPUTER_SCIENCE',
      subcategory: 'Bilgisayar Programlama',
      formalStatement: '\\gcd(a, b) = \\gcd(b, a \\pmod b) \\quad (b > 0) \\quad \\text{ve} \\quad \\gcd(a, 0) = a',
      canonicalFormula: '\\text{def gcd(a, b): return a if b == 0 else gcd(b, a % b)}',
      assumptions: 'a, b \\in \\mathbb{Z} ve en az biri sıfırdan farklı olmalıdır.',
      proofDerivation: 'a = qb + r ise r = a - qb. Ortak bölen d hem a\'yı hem b\'yi bölerse r\'yi de bölmek zorundadır. Dolayısıyla OrtakBolen(a,b) = OrtakBolen(b,r) dir.',
      verificationLevel: 5,
      verificationStatus: 'VERIFIED',
      sourceTitle: docPython.id,
      sourceAuthor: 'Eskişehir Osmangazi Üniversitesi',
      sourceCitation: '1.Sınıf Güz Bilgisayar Programlama ebob_ekok.py'
    }
  });

  await prisma.conceptTranslation.upsert({
    where: { conceptId_language: { conceptId: conceptEuclid.id, language: 'tr' } },
    update: {},
    create: {
      conceptId: conceptEuclid.id,
      language: 'tr',
      name: 'Öklid Algoritması (EBOB)',
      dualTerminology: 'Öklid Algoritması (Euclidean Algorithm)',
      definition: 'İki tam sayının en büyük ortak bölenini ardışık kalanlı bölme adımlarıyla $O(\\log(\\min(a,b)))$ karmaşıklığında bulan antik ve temel algoritmadır.',
      intuition: 'Büyük sayıyı küçük sayıya böldüğünüzde aralarındaki farkın ortak böleni değiştirmediği gerçeğine dayanır. Sıfıra ulaşana kadar kalanla devam edilir.',
      commonPitfalls: 'Negatif sayılar verildiğinde mutlak değer almayı unutmak veya sıfıra bölme hatasına düşmek.'
    }
  });

  await prisma.topicConcept.upsert({
    where: { topicId_conceptId: { topicId: topicPython.id, conceptId: conceptEuclid.id } },
    update: {},
    create: { topicId: topicPython.id, conceptId: conceptEuclid.id }
  });

  // 7.6. MATLAB -> Sayısal İntegrasyon (Numerical Integration)
  const topicMatlab = await prisma.courseTopic.upsert({
    where: { id: 'top-matlab-integration' },
    update: {},
    create: {
      id: 'top-matlab-integration',
      courseId: 'temel-bilgi-teknolojileri',
      orderIndex: 7,
      title: 'MATLAB Sayısal İntegrasyon (Trapz ve Integral)',
      englishTitle: 'MATLAB Numerical Integration',
      description: 'Ayrık veri noktaları ve sürekli fonksiyonlar için yamuk (trapezoid) ve Gauss kareleme integrasyon yöntemleri.',
      primaryTeachingSourceId: docTbtMatlab.id
    }
  });

  const conceptMatlabInteg = await prisma.concept.upsert({
    where: { id: 'numerical-integration-matlab' },
    update: {},
    create: {
      id: 'numerical-integration-matlab',
      category: 'COMPUTER_SCIENCE',
      subcategory: 'Temel Bilgi Teknolojileri',
      formalStatement: '\\int_a^b f(x)dx \\approx \\frac{h}{2} \\left( f(x_0) + 2\\sum_{i=1}^{n-1} f(x_i) + f(x_n) \\right) \\quad \\text{MATLAB: } \\text{trapz}(x, y)',
      canonicalFormula: 'I = \\text{trapz}(x, y) \\quad \\text{veya} \\quad Q = \\text{integral}(@(x) f(x), a, b)',
      assumptions: 'x vektörü monoton artan olmalı ve f(x) integrasyon aralığında integrallenebilir olmalıdır.',
      proofDerivation: 'Fonksiyon parçalı doğrusal doğru parçalarıyla yaklaştırılır ve her [x_i, x_{i+1}] aralığındaki yamuğun alanı h_i (y_i + y_{i+1})/2 toplanır.',
      verificationLevel: 5,
      verificationStatus: 'VERIFIED',
      sourceTitle: docTbtMatlab.id,
      sourceAuthor: 'Dr. Alper Odabaş',
      sourceCitation: 'TBT MATLAB Serisi ders7.md & ders8.md'
    }
  });

  await prisma.conceptTranslation.upsert({
    where: { conceptId_language: { conceptId: conceptMatlabInteg.id, language: 'tr' } },
    update: {},
    create: {
      conceptId: conceptMatlabInteg.id,
      language: 'tr',
      name: 'MATLAB Sayısal İntegrasyon',
      dualTerminology: 'Sayısal İntegrasyon (Numerical Integration in MATLAB)',
      definition: 'Analitik integrali bulunamayan veya deneysel ayrık veri setleri şeklinde verilen fonksiyonların alanını `trapz` veya `integral` komutlarıyla hesaplama yöntemidir.',
      intuition: 'Eğrinin altındaki alanı küçük dikdörtgenler veya yamuklar dizisine bölerek toplam alana yaklaşmaktır.',
      commonPitfalls: 'Eşit aralıklı olmayan x dizilerinde `trapz(y)` kullanmak (doğrusu `trapz(x, y)` olmalıdır).'
    }
  });

  await prisma.topicConcept.upsert({
    where: { topicId_conceptId: { topicId: topicMatlab.id, conceptId: conceptMatlabInteg.id } },
    update: {},
    create: { topicId: topicMatlab.id, conceptId: conceptMatlabInteg.id }
  });

  // 7.7. C# -> Olay Güdümlü Programlama (Event-Driven Programming)
  const topicCSharp = await prisma.courseTopic.upsert({
    where: { id: 'top-csharp-event-driven' },
    update: {},
    create: {
      id: 'top-csharp-event-driven',
      courseId: 'gorsel-programlama-1',
      orderIndex: 2,
      title: 'Olay Güdümlü Programlama ve Delegeler',
      englishTitle: 'Event-Driven Programming and Delegates in C#',
      description: 'Windows Forms arayüzünde kullanıcı etkileşimleri (Click, KeyDown), event delegeleri ve dinamik olay bağlama.',
      primaryExamSourceId: docGorselProg.id,
      primaryTeachingSourceId: docGorselProg.id
    }
  });

  const conceptCSharp = await prisma.concept.upsert({
    where: { id: 'event-driven-csharp' },
    update: {},
    create: {
      id: 'event-driven-csharp',
      category: 'COMPUTER_SCIENCE',
      subcategory: 'Görsel Programlama',
      formalStatement: 'public delegate void EventHandler(object sender, EventArgs e); button.Click += new EventHandler(Button_Click);',
      canonicalFormula: 'publisher.SomeEvent += subscriber.HandlerMethod;',
      assumptions: 'Olay dinleyicisi (Subscriber) ile yayıncı (Publisher) imza uyumluluğuna sahip olmalıdır.',
      proofDerivation: 'C#\'ta event yapıları tip-güvenli fonksiyon göstericileri (Type-safe Function Pointers) olan MulticastDelegate sınıfı üzerine inşa edilmiştir.',
      verificationLevel: 5,
      verificationStatus: 'VERIFIED',
      sourceTitle: docGorselProg.id,
      sourceAuthor: 'Prof. Dr. Bülent Saka',
      sourceCitation: 'Görsel Programlama I Vize 2022 & 2023 Soruları'
    }
  });

  await prisma.conceptTranslation.upsert({
    where: { conceptId_language: { conceptId: conceptCSharp.id, language: 'tr' } },
    update: {},
    create: {
      conceptId: conceptCSharp.id,
      language: 'tr',
      name: 'Olay Güdümlü Programlama (C#)',
      dualTerminology: 'Olay Güdümlü Programlama (Event-Driven Programming)',
      definition: 'Programın akışının sıralı kod satırları yerine kullanıcı tıklamaları, sensör verileri veya mesajlaşma gibi harici olaylar (events) tarafından tetiklendiği mimaridir.',
      intuition: 'Bir zile basıldığında kapının açılması gibi: Buton ne zaman tıklanacağını bilmez, sadece tıklandığında "Tıklandım!" sinyalini kayıtlı olan dinleyicilere dağıtır.',
      commonPitfalls: 'Form kapanırken veya nesne yok edilirken olay aboneliğini (-=) kaldırmamak bellek sızıntılarına (Memory Leak) yol açar.'
    }
  });

  await prisma.topicConcept.upsert({
    where: { topicId_conceptId: { topicId: topicCSharp.id, conceptId: conceptCSharp.id } },
    update: {},
    create: { topicId: topicCSharp.id, conceptId: conceptCSharp.id }
  });

  // Link existing Axiom concepts to Lineer Cebir and Ayrık Matematik
  const topicEigenvalues = await prisma.courseTopic.upsert({
    where: { id: 'top-lineer-eigenvalues' },
    update: {},
    create: {
      id: 'top-lineer-eigenvalues',
      courseId: 'lineer-cebir-1',
      orderIndex: 4,
      title: 'Özdeğerler, Özvektörler ve Köşegenleştirme',
      englishTitle: 'Eigenvalues, Eigenvectors and Diagonalization',
      description: 'Karakteristik denklem det(A - lambda I) = 0, geometrik ve cebirsel katlılık, köşegenleştirme koşulları.',
      primaryTheorySourceId: docLineerCebir.id
    }
  });

  await prisma.topicConcept.upsert({
    where: { topicId_conceptId: { topicId: topicEigenvalues.id, conceptId: 'eigenvalues' } },
    update: {},
    create: { topicId: topicEigenvalues.id, conceptId: 'eigenvalues' }
  });

  const topicInduction = await prisma.courseTopic.upsert({
    where: { id: 'top-ayrik-induction' },
    update: {},
    create: {
      id: 'top-ayrik-induction',
      courseId: 'ayrik-matematik',
      orderIndex: 2,
      title: 'Matematiksel Tümevarım ve İyi-Sıralılık',
      englishTitle: 'Mathematical Induction and Well-Ordering',
      description: 'Temel adım, tümevarım hipotezi ve adım adımıyla evrensel önermelerin ispatı.',
      primaryTeachingSourceId: docGraf.id
    }
  });

  await prisma.topicConcept.upsert({
    where: { topicId_conceptId: { topicId: topicInduction.id, conceptId: 'mathematical-induction' } },
    update: {},
    create: { topicId: topicInduction.id, conceptId: 'mathematical-induction' }
  });

  console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
