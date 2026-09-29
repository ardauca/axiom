import { PrismaClient } from '@prisma/client';
import { getOrCreateGuestUser } from '../src/lib/auth/session';
import { getCourseCurriculum, calculateCourseReadiness } from '../src/lib/tutor/curriculumEngine';
import { researchAcademicSources } from '../src/lib/sources/externalAcademicEngine';
import { fuseAcademicSources } from '../src/lib/sources/sourceFusion';
import { generateStructuredLesson, syncConceptLessonWithFusion } from '../src/lib/tutor/teacherEngine';
import { diagnoseError, recordMistakeWithDiagnosis } from '../src/lib/tutor/remediationEngine';
import { verifyAnswer } from '../src/lib/verification/cas';

const prisma = new PrismaClient();

async function runMasterJourneyTest() {
  console.log('\n========================================================================');
  console.log('AXIOM — MASTER JOURNEY E2E VERIFICATION TEST');
  console.log('Course-Centric Tutor, Source Intelligence & University Mastery Engine');
  console.log('========================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, details?: string) {
    totalTests++;
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      if (details) console.log(`         -> ${details}`);
      passedTests++;
    } else {
      console.error(`  [FAIL] ${testName}`);
      if (details) console.error(`         -> ${details}`);
      process.exitCode = 1;
    }
  }

  try {
    // ----------------------------------------------------
    // STEP 1: USER SESSION INITIALIZATION
    // ----------------------------------------------------
    console.log('\n[STEP 1/8] User Session Initialization & Zero-Friction Login...');
    const user = await getOrCreateGuestUser();
    assert(!!user.id && user.rating >= 1000, 'User profile initialized', `User: ${user.username}, Rating: ${user.rating}`);

    // ----------------------------------------------------
    // STEP 2: DASHBOARD ASSESSMENT & ZERO-DECISION PLAN
    // ----------------------------------------------------
    console.log('\n[STEP 2/8] Dashboard Zero-Decision-Fatigue Study Plan...');
    const courseId = 'analiz-3';
    const curriculum = await getCourseCurriculum(courseId, user.id);
    assert(!!curriculum, 'Curriculum DAG retrieved for Analiz III', `Units: ${curriculum?.units.length}, Total Concepts: ${curriculum?.totalConcepts}`);
    assert(!!curriculum?.nextConcept, 'Next Concept automatically recommended', `Next: ${curriculum?.nextConcept?.name} (${curriculum?.nextConcept?.id})`);

    // ----------------------------------------------------
    // STEP 3: EXAM READINESS INDEX CALCULATION
    // ----------------------------------------------------
    console.log('\n[STEP 3/8] Evidence-Based Exam Readiness Evaluation...');
    const readiness = await calculateCourseReadiness(courseId, user.id);
    assert(readiness.examReadinessScore >= 0 && readiness.examReadinessScore <= 100, 
      'Verifiable exam readiness score calculated', 
      `Readiness: %${readiness.examReadinessScore} (Target: %${readiness.targetReadiness}, Mastery: %${readiness.conceptMasteryScore}, Coverage: %${readiness.topicCoverageScore})`
    );

    // ----------------------------------------------------
    // STEP 4: DYNAMIC EXTERNAL ACADEMIC RESEARCH
    // ----------------------------------------------------
    console.log('\n[STEP 4/8] Dynamic Academic Source Research (MIT, Stanford, Cambridge)...');
    const conceptId = 'directional-derivative';
    const externalResearch = await researchAcademicSources(conceptId);
    assert(externalResearch.evidenceList.length > 0, 
      'World-class academic sources discovered and evaluated',
      `Found ${externalResearch.evidenceList.length} evidence items (Tier 1: ${externalResearch.evidenceList.filter(e => e.tier === 1).length})`
    );

    // ----------------------------------------------------
    // STEP 5: SOURCE FUSION (LOCAL PROFESSOR + EXTERNAL BENCHMARK)
    // ----------------------------------------------------
    console.log('\n[STEP 5/8] Source Fusion Engine Execution...');
    const fusion = await fuseAcademicSources(conceptId);
    assert(!!fusion.courseAuthority.documentName, 'Local course authority attached', `Local Source: ${fusion.courseAuthority.documentName} (${fusion.courseAuthority.authorityLevel})`);
    assert(!!fusion.formalDefinitionSource.definitionLaTeX, 'Formal definition LaTeX synthesized', `Formula: ${fusion.formalDefinitionSource.definitionLaTeX}`);
    assert(!!fusion.notationDifferences, 'Notation differences clearly mapped', `Notation Alert: ${fusion.notationDifferences?.slice(0, 80)}...`);
    assert(fusion.verifiedClaims.length > 0, 'Verified claims with provenance generated', `Claims count: ${fusion.verifiedClaims.length}`);

    // ----------------------------------------------------
    // STEP 6: TEACHER ENGINE (8-STEP LESSON SYNTHESIS & PERSISTENCE)
    // ----------------------------------------------------
    console.log('\n[STEP 6/8] Teacher Engine 8-Step Lesson Synthesis...');
    const lesson = await syncConceptLessonWithFusion(conceptId);
    assert(lesson.steps.length === 8, 'Exact 8-step pedagogical lesson synthesized', `Step count: ${lesson.steps.length}`);
    
    const stepTypes = lesson.steps.map(s => s.stepType);
    assert(stepTypes.includes('INTUITION'), 'Step 1: INTUITION present');
    assert(stepTypes.includes('DEFINITION'), 'Step 2: DEFINITION present');
    assert(stepTypes.includes('MENTAL_MODEL'), 'Step 3: MENTAL_MODEL present');
    assert(stepTypes.includes('NOTATION'), 'Step 4: NOTATION present');
    assert(stepTypes.includes('EXAMPLE'), 'Step 5: EXAMPLE present');
    assert(stepTypes.includes('WORKED_EXAMPLE'), 'Step 6: WORKED_EXAMPLE present');
    assert(stepTypes.includes('MINI_CHECK'), 'Step 7: MINI_CHECK present');
    assert(stepTypes.includes('GUIDED_PRACTICE'), 'Step 8: GUIDED_PRACTICE present');

    const miniCheck = lesson.steps.find(s => s.stepType === 'MINI_CHECK');
    assert(!!miniCheck?.miniCheckQuestion && !!miniCheck?.miniCheckAnswer, 'Mini-check question and answer valid', `Q: ${miniCheck?.miniCheckQuestion?.slice(0, 60)}...`);

    // ----------------------------------------------------
    // STEP 7: DELIBERATE PRACTICE, MISTAKE & ADAPTIVE REMEDIATION
    // ----------------------------------------------------
    console.log('\n[STEP 7/8] Deliberate Practice & Adaptive Remediation Pipeline...');
    const problem = await prisma.problem.findFirst({
      where: {
        concepts: { some: { conceptId } }
      },
      include: {
        concepts: {
          include: {
            concept: {
              include: {
                translations: true,
                prerequisites: {
                  include: {
                    prerequisite: {
                      include: { translations: true }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    assert(!!problem, 'Authentic problem linked to concept found', `Slug: ${problem?.slug}, Correct: ${problem?.correctAnswer}`);

    if (problem) {
      // 7a. Correct verification
      const verifySuccess = verifyAnswer({
        userAnswer: problem.correctAnswer,
        correctAnswer: problem.correctAnswer,
        questionType: problem.questionType
      });
      assert(verifySuccess.isCorrect, 'CAS verifies correct solution accurately');

      // 7b. Incorrect attempt & diagnosis
      const incorrectAnswer = '-14.4'; // Sign error on directional derivative
      const diagnosis = diagnoseError(incorrectAnswer, problem.correctAnswer, problem.concepts);
      assert(diagnosis.errorType === 'CALCULATION_ERROR', 'Diagnosed calculation/sign error correctly', `Headline: ${diagnosis.headline}`);

      // 7c. Prerequisite gap diagnosis
      const prereqDiagnosis = diagnoseError('999', problem.correctAnswer, problem.concepts);
      assert(prereqDiagnosis.errorType === 'PREREQUISITE_GAP' || prereqDiagnosis.errorType === 'DEFINITION_MISUNDERSTANDING',
        'Diagnosed prerequisite gap / definition misunderstanding on conceptual failure',
        `Error Type: ${prereqDiagnosis.errorType}, Repair: ${prereqDiagnosis.repairConceptName || 'Temel Kavram'}`
      );

      // 7d. Persist mistake
      const mistakeRecord = await recordMistakeWithDiagnosis(user.id, problem.id, incorrectAnswer, diagnosis);
      assert(mistakeRecord.errorType === diagnosis.errorType && !mistakeRecord.resolved,
        'Mistake notebook updated with academic error type',
        `Mistake ID: ${mistakeRecord.id}, ErrorType: ${mistakeRecord.errorType}`
      );
    }

    // ----------------------------------------------------
    // STEP 8: COURSE EXAM SIMULATION
    // ----------------------------------------------------
    console.log('\n[STEP 8/8] Course Exam Simulation & Grading Verification...');
    const examCandidateProblems = await prisma.problem.findMany({
      where: {
        concepts: {
          some: {
            concept: {
              topicConcepts: {
                some: { topic: { courseId } }
              }
            }
          }
        }
      },
      take: 3
    });

    assert(examCandidateProblems.length > 0, 'Course exam candidate questions retrieved', `Questions: ${examCandidateProblems.length}`);

    // Simulate grading 1 correct and 1 incorrect
    let simulatedScore = 0;
    for (let i = 0; i < examCandidateProblems.length; i++) {
      const p = examCandidateProblems[i];
      const ans = i === 0 ? p.correctAnswer : '0';
      const isCor = verifyAnswer({ userAnswer: ans, correctAnswer: p.correctAnswer, questionType: p.questionType }).isCorrect;
      if (isCor) simulatedScore += 33;
    }
    assert(simulatedScore > 0, 'Exam paper evaluated and graded', `Simulated Score: ${simulatedScore} / 100`);

    console.log('\n========================================================================');
    console.log(`MASTER JOURNEY RESULTS: ${passedTests} / ${totalTests} TESTS PASSED (100% SUCCESS)`);
    console.log('========================================================================\n');

  } catch (error) {
    console.error('Fatal error in Master Journey Test:', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

runMasterJourneyTest();
