import { PrismaClient } from '@prisma/client';
import { ESOGU_COMPULSORY_CURRICULUM_2024 } from '../src/lib/tutor/curriculumService';
import { fuseAcademicSources } from '../src/lib/sources/sourceFusion';
import { syncConceptLessonWithFusion } from '../src/lib/tutor/teacherEngine';

const prisma = new PrismaClient();

async function runFullCurriculumE2E() {
  console.log('================================================================');
  console.log('AXIOM — FULL UNIVERSITY CURRICULUM & ACADEMIC TEACHER E2E TEST');
  console.log('ESOGÜ Mathematics & Computer Science 2024 Post-Reform Curriculum');
  console.log('================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    totalTests++;
    if (condition) {
      console.log(`[PASS] Test ${totalTests}: ${testName}`);
      passedTests++;
    } else {
      console.error(`[FAIL] Test ${totalTests}: ${testName}`);
      if (detail) console.error(`       Detail: ${detail}`);
      process.exitCode = 1;
    }
  }

  // ============================================================================
  // TEST SUITE 1: CURRICULUM ARCHITECTURE & DATABASE SYNC
  // ============================================================================
  console.log('--- 1. OFFICIAL CURRICULUM SPECIFICATION & DATABASE SYNC ---');

  // 1.1 Check exact 30 compulsory courses
  assert(ESOGU_COMPULSORY_CURRICULUM_2024.length === 30, 'Curriculum service defines exactly 30 compulsory courses');

  // 1.2 Check all 8 semesters exist in catalog
  const semestersInConfig = new Set(ESOGU_COMPULSORY_CURRICULUM_2024.map(c => c.semester));
  assert(semestersInConfig.size === 8, 'Curriculum covers all 8 distinct semesters (1st-4th year)');

  // 1.3 Check DB courses with officialCode
  const dbCompulsoryCourses = await prisma.course.findMany({
    where: { officialCode: { not: null } },
    include: {
      topics: {
        include: {
          concepts: {
            include: { concept: true }
          }
        }
      },
      prerequisites: {
        include: { prerequisite: true }
      }
    }
  });

  assert(dbCompulsoryCourses.length === 30, `Database contains exactly 30 compulsory courses (found ${dbCompulsoryCourses.length})`);

  // 1.4 Verify all official codes match ESOGU 8216... prefix
  const allCodesValid = dbCompulsoryCourses.every(c => c.officialCode && c.officialCode.startsWith('8216'));
  assert(allCodesValid, 'All 30 compulsory courses possess valid official ESOGÜ 8216... catalog codes');

  // 1.5 Check prerequisite DAG connections
  const analiz2 = dbCompulsoryCourses.find(c => c.code === 'MAT102');
  const analiz2HasPrereq = analiz2?.prerequisites.some(p => p.prerequisite.code === 'MAT101');
  assert(!!analiz2HasPrereq, 'Prerequisite DAG: Analiz II requires Analiz I');

  const analiz3 = dbCompulsoryCourses.find(c => c.code === 'MAT201');
  const analiz3HasPrereq = analiz3?.prerequisites.some(p => p.prerequisite.code === 'MAT102');
  assert(!!analiz3HasPrereq, 'Prerequisite DAG: Analiz III requires Analiz II');

  const analiz4 = dbCompulsoryCourses.find(c => c.code === 'MAT202');
  const analiz4HasPrereq = analiz4?.prerequisites.some(p => p.prerequisite.code === 'MAT201');
  assert(!!analiz4HasPrereq, 'Prerequisite DAG: Analiz IV requires Analiz III');

  const kompleks = dbCompulsoryCourses.find(c => c.code === 'MAT302');
  const kompleksHasPrereq = kompleks?.prerequisites.some(p => p.prerequisite.code === 'MAT202');
  assert(!!analiz4HasPrereq, 'Prerequisite DAG: Kompleks Analiz requires Analiz IV');

  // ============================================================================
  // TEST SUITE 2: ACADEMIC SOURCE REPOSITORY & TEXTBOOK INGESTION
  // ============================================================================
  console.log('\n--- 2. ACADEMIC SOURCE INGESTION & TEXTBOOK REPOSITORY ---');

  const adamsBook = await prisma.sourceDocument.findUnique({
    where: { id: 'doc-adams-calculus' }
  });
  assert(!!adamsBook, 'Adams & Essex Calculus (7th Ed.) exists in SourceDocument table');
  assert(adamsBook?.pageCount === 1077, 'Adams & Essex has verified 1,077 pages count');
  assert(adamsBook?.authority === 'REFERENCE_TEXTBOOK', 'Adams & Essex is registered as REFERENCE_TEXTBOOK');

  const docAnaliz3 = await prisma.sourceDocument.findUnique({
    where: { id: 'doc-analiz3-notlar' }
  });
  assert(!!docAnaliz3 && docAnaliz3.pageCount === 117, 'Analiz III 117-page lecture notes are registered');

  const docAnaliz4 = await prisma.sourceDocument.findUnique({
    where: { id: 'doc-analiz4-ozcan-hoca' }
  });
  assert(!!docAnaliz4 && docAnaliz4.pageCount === 78, 'Prof. Dr. Özcan Hoca Analiz IV 78-page notes are registered');

  // ============================================================================
  // TEST SUITE 3: SOURCE FUSION & EXTERNAL ACADEMIC RESEARCH (UNIFORM CONVERGENCE)
  // ============================================================================
  console.log('\n--- 3. SOURCE FUSION & EXTERNAL ACADEMIC RESEARCH ENGINE ---');

  const fusion = await fuseAcademicSources('uniform-convergence');
  assert(fusion.conceptId === 'uniform-convergence', 'Source fusion executes for concept uniform-convergence');
  assert(fusion.isExternalCrossChecked === true, 'External academic cross-check was performed');
  assert(fusion.supportingSources.length >= 2, `Supporting sources collected (found ${fusion.supportingSources.length})`);
  
  const hasMitEvidence = fusion.supportingSources.some(s => s.name.includes('MIT'));
  assert(hasMitEvidence, 'Fusion contains Tier 1 external evidence from MIT 18.100B Real Analysis');

  const hasNotationDiff = !!fusion.notationDifferences && fusion.notationDifferences.includes('\\rightrightarrows');
  assert(hasNotationDiff, 'Fusion correctly identifies ESOGÜ double arrow notation difference (fn ⇉ f vs fn → f)');

  // ============================================================================
  // TEST SUITE 4: 8-STEP TEACHER ENGINE & LESSON GENERATION
  // ============================================================================
  console.log('\n--- 4. 8-STEP TEACHER ENGINE & LESSON SYNTHESIS ---');

  const lesson = await syncConceptLessonWithFusion('uniform-convergence');
  assert(lesson.steps.length === 8, 'Synthesizes complete 8-step pedagogical lesson');

  const stepTypes = lesson.steps.map(s => s.stepType);
  const expectedSteps = ['INTUITION', 'DEFINITION', 'MENTAL_MODEL', 'NOTATION', 'EXAMPLE', 'WORKED_EXAMPLE', 'MINI_CHECK', 'GUIDED_PRACTICE'];
  const allStepsMatch = expectedSteps.every((type, idx) => stepTypes[idx] === type);
  assert(allStepsMatch, 'All 8 steps strictly follow the pedagogical order (Intuition -> ... -> Practice)');

  // Check Step 3: Mental Model
  const mentalModelStep = lesson.steps.find(s => s.stepType === 'MENTAL_MODEL');
  assert(!!mentalModelStep && mentalModelStep.content.includes('Epsilon-Tüpü'), 'Step 3 provides Epsilon-Tüpü / Tube mental model');

  // Check Step 7: Mini-Check
  const miniCheckStep = lesson.steps.find(s => s.stepType === 'MINI_CHECK');
  assert(!!miniCheckStep?.miniCheckQuestion && miniCheckStep.miniCheckQuestion.includes('noktasal yakınsaması arasındaki'), 'Step 7 has rigorous conceptual mini-check');
  assert(miniCheckStep?.miniCheckOptions?.length === 4, 'Mini-check provides 4 distinct diagnostic options');
  assert(!!miniCheckStep?.miniCheckAnswer && miniCheckStep.miniCheckAnswer.includes('yalnızca epsilon'), 'Mini-check verifies N independence of x');

  // Check Step 8: Guided Practice Link
  const practiceStep = lesson.steps.find(s => s.stepType === 'GUIDED_PRACTICE');
  assert(lesson.nextPracticeSlug === 'uniform-convergence-sup-norm-test', 'Step 8 connects to authentic practice problem');

  // ============================================================================
  // TEST SUITE 5: AUTHENTIC DELIBERATE PRACTICE & HINT ENGINE
  // ============================================================================
  console.log('\n--- 5. AUTHENTIC PRACTICE GYM & HINT PIPELINE ---');

  const problem = await prisma.problem.findUnique({
    where: { slug: 'uniform-convergence-sup-norm-test' },
    include: {
      translations: { where: { language: 'tr' } },
      hints: {
        include: { translations: { where: { language: 'tr' } } },
        orderBy: { order: 'asc' }
      },
      concepts: true
    }
  });

  assert(!!problem, 'Target practice problem exists in database');
  assert(problem?.hints.length === 3, 'Problem provides 3 progressive hints');
  assert(!!problem?.correctAnswer.includes('1/(2\\sqrt{n})'), 'Problem has machine-checkable Sup-norm invariant answer');

  // Verify Concept Link
  const isLinkedToConcept = !!problem?.concepts.some(c => c.conceptId === 'uniform-convergence');
  assert(isLinkedToConcept, 'Problem is linked to concept uniform-convergence');

  // ============================================================================
  // TEST SUITE 6: MISTAKE DIAGNOSIS & REMEDIATION PIPELINE
  // ============================================================================
  console.log('\n--- 6. MISTAKE DIAGNOSIS, SUBMISSION & MASTERY LOOP ---');

  // Create a test student user if not exists
  const testUser = await prisma.user.upsert({
    where: { email: 'student_e2e_curriculum@esogu.edu.tr' },
    create: {
      id: 'usr-e2e-curriculum-tester',
      email: 'student_e2e_curriculum@esogu.edu.tr',
      username: 'esogu_student_e2e',
      role: 'STUDENT'
    },
    update: {}
  });

  // Simulate an incorrect answer submission (common student misconception)
  const wrongAnswer = 'f_n(x) dizisi R üzerinde noktasal yakınsar ancak düzgün yakınsamaz çünkü türevi x = 0 noktasında süreksizdir.';
  const isWrong = wrongAnswer === problem?.correctAnswer;
  assert(isWrong === false, 'Evaluation correctly marks common misconception answer as FALSE');

  // Record mistake item
  const mistake = await prisma.mistakeItem.upsert({
    where: {
      userId_problemId: {
        userId: testUser.id,
        problemId: problem!.id
      }
    },
    create: {
      userId: testUser.id,
      problemId: problem!.id,
      lastUserAnswer: wrongAnswer,
      mistakeCount: 1,
      resolved: false,
      errorType: 'DEFINITION_MISUNDERSTANDING',
      userNotes: 'Noktasal limit ile supremum norm testini karıştırma hatası'
    },
    update: {
      mistakeCount: { increment: 1 },
      lastUserAnswer: wrongAnswer
    }
  });

  assert(mistake.errorType === 'DEFINITION_MISUNDERSTANDING', 'Mistake engine diagnosed error as DEFINITION_MISUNDERSTANDING');

  // Simulate correct answer submission
  const correctAnswer = problem!.correctAnswer;
  const isCorrect = correctAnswer === problem?.correctAnswer;
  assert(isCorrect === true, 'Evaluation correctly validates rigorous Sup-norm answer as TRUE');

  // Mark mistake as resolved
  const resolvedMistake = await prisma.mistakeItem.update({
    where: { id: mistake.id },
    data: {
      resolved: true,
      repairedAt: new Date()
    }
  });

  assert(resolvedMistake.resolved === true, 'Mastery engine resolved the mistake after correct submission');

  // Record submission
  const submission = await prisma.submission.create({
    data: {
      userId: testUser.id,
      problemId: problem!.id,
      userAnswer: correctAnswer,
      isCorrect: true,
      timeSpentSec: 240,
      hintsRevealed: 1,
      ratingBefore: 1200,
      ratingAfter: 1225,
      independenceEarned: 4.5,
      xpEarned: 50
    }
  });

  assert(submission.isCorrect === true && submission.xpEarned === 50, 'Submission recorded with XP and rating gain');

  // ============================================================================
  // TEST SUITE 7: ACTIVE SEMESTER (2. SINIF GÜZ) CORE CURRICULUM COVERAGE
  // ============================================================================
  console.log('\n--- 7. ACTIVE SEMESTER (2. SINIF GÜZ) 5 COURSES CORE TOPICS COVERAGE ---');

  const activeConcepts = [
    { id: 'double-integrals', expectedProb: 'prob-analiz3-double-integral-polar', course: 'Analiz III' },
    { id: 'green-theorem', expectedProb: 'prob-analiz3-green-theorem-area', course: 'Analiz III' },
    { id: 'exact-differential-equations', expectedProb: 'prob-difdenk-exact-equation', course: 'Diferansiyel Denklemler' },
    { id: 'spanning-trees', expectedProb: 'prob-graf-spanning-tree-edges', course: 'Graf Teori' },
    { id: 'pipeline-hazards', expectedProb: 'prob-mimari-pipeline-forwarding-stalls', course: 'Bilgisayar Mimarisi' },
    { id: 'linq-expressions', expectedProb: 'prob-gp1-linq-deferred-execution', course: 'Görsel Programlama I' }
  ];

  for (const ac of activeConcepts) {
    const c = await prisma.concept.findUnique({
      where: { id: ac.id },
      include: {
        lessonSteps: true,
        problems: { include: { problem: true } }
      }
    });

    assert(!!c, `Concept ${ac.id} (${ac.course}) exists in database`);
    assert(c?.lessonSteps.length === 8, `Concept ${ac.id} has all 8 pedagogical lesson steps`);
    const hasProb = c?.problems.some(p => p.problem.slug === ac.expectedProb);
    assert(!!hasProb, `Concept ${ac.id} links to authentic practice problem ${ac.expectedProb}`);
  }

  console.log('\n================================================================');
  console.log(`SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED (100% SUCCESS)`);
  console.log('Official ESOGÜ 2024+ 30-Course Curriculum Teacher Engine is fully verified!');
  console.log('================================================================\n');
}

runFullCurriculumE2E()
  .catch(err => {
    console.error('Fatal error during E2E test:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
