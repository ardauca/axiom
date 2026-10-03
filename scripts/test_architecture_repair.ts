import { prisma } from '../src/lib/prisma';
import { getSessionUser, getOrCreateGuestUser } from '../src/lib/auth/session';
import { researchAcademicSources } from '../src/lib/sources/externalAcademicEngine';
import { fuseAcademicSources } from '../src/lib/sources/sourceFusion';
import { evaluateAcademicSource } from '../src/lib/sources/sourceEvaluation';
import { generateStructuredLesson } from '../src/lib/tutor/teacherEngine';
import { recordLessonConceptProgress, updateMasteryOnSubmission } from '../src/lib/tutor/masteryEngine';
import { diagnoseError, recordMistakeWithDiagnosis } from '../src/lib/tutor/remediationEngine';

async function runArchitectureRepairTests() {
  console.log('\n========================================================================');
  console.log('AXIOM — ARCHITECTURE REPAIR & REAL TUTOR ENGINE TEST SUITE');
  console.log('Testing User Isolation, Evidence Fusion, Mastery Proof, and Generic Tutor');
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      if (detail) console.log(`         -> ${detail}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${testName}`);
      if (detail) console.error(`         -> ${detail}`);
      failed++;
      process.exitCode = 1;
    }
  }

  try {
    // ----------------------------------------------------
    // TEST A: TRUE USER / SESSION ISOLATION
    // ----------------------------------------------------
    console.log('\n[TEST A] True User/Session Isolation (Header, Cookie & Guest Isolation)...');
    
    // Create User A
    const userA = await prisma.user.create({
      data: {
        username: `student_alice_${Date.now()}`,
        role: 'STUDENT',
        rating: 1200,
        xp: 0
      }
    });

    // Create User B
    const userB = await prisma.user.create({
      data: {
        username: `student_bob_${Date.now()}`,
        role: 'STUDENT',
        rating: 1200,
        xp: 0
      }
    });

    // Request simulation with x-axiom-user-id header
    const mockReqA = new Request('http://localhost:3000/api/dashboard', {
      headers: { 'x-axiom-user-id': userA.id }
    });
    const sessionUserA = await getSessionUser(mockReqA);
    assert(sessionUserA.id === userA.id, 'Session User A resolved from header correctly', `ID: ${sessionUserA.id}`);

    const mockReqB = new Request('http://localhost:3000/api/dashboard', {
      headers: { 'x-axiom-user-id': userB.id }
    });
    const sessionUserB = await getSessionUser(mockReqB);
    assert(sessionUserB.id === userB.id, 'Session User B resolved from header correctly', `ID: ${sessionUserB.id}`);
    assert(sessionUserA.id !== sessionUserB.id, 'User A and User B IDs are strictly isolated');

    // Record progress for User A only
    await recordLessonConceptProgress(userA.id, 'directional-derivative', true);

    const masteryA = await prisma.userConceptMastery.findUnique({
      where: { userId_conceptId: { userId: userA.id, conceptId: 'directional-derivative' } }
    });
    const masteryB = await prisma.userConceptMastery.findUnique({
      where: { userId_conceptId: { userId: userB.id, conceptId: 'directional-derivative' } }
    });

    assert(masteryA !== null && masteryA.conceptualScore > 50, 'User A has active mastery record', `Score: ${masteryA?.conceptualScore}`);
    assert(masteryB === null, 'User B has zero mastery record (No session leakage)');

    // ----------------------------------------------------
    // TEST B: EXTERNAL ACADEMIC EVIDENCE EVALUATION & FUSION
    // ----------------------------------------------------
    console.log('\n[TEST B] Multi-Dimensional Academic Source Evaluation & Fusion (MAT201: Uniform Convergence)...');
    const conceptId = 'uniform-convergence';

    // Test individual source evaluation function
    const sampleEval = evaluateAcademicSource({
      id: 'rudin-principles',
      name: 'Principles of Mathematical Analysis',
      author: 'Walter Rudin',
      institution: 'McGraw-Hill / MIT Mathematics',
      tier: 1,
      authority: 'REFERENCE_TEXTBOOK',
      rawText: 'Uniform convergence of sequences and series of functions. Let fn be a sequence of functions defined on a metric space E. We say that fn converges uniformly to f on E if for every epsilon > 0 there exists an integer N such that n >= N implies |fn(x) - f(x)| < epsilon for all x in E. The limit of a uniformly convergent sequence of continuous functions is continuous. Theorem: If fn converges uniformly to f on [a, b], then the integral of the limit equals the limit of the integrals.',
      topicsCovered: ['uniform convergence', 'sequences of functions', 'continuity', 'integration']
    }, {
      targetConcept: 'uniform-convergence',
      courseCode: 'MAT201',
      department: 'Matematik ve Bilgisayar Bilimleri'
    });

    assert(sampleEval.overallQuality >= 80, 'Rudin evaluated with high score', `Overall: ${sampleEval.overallQuality}/100, Authority: ${sampleEval.authorityScore}, Rigor: ${sampleEval.rigorScore}`);
    assert(sampleEval.recommendedRole === 'PRIMARY_PROOF' || sampleEval.recommendedRole === 'PRIMARY_THEORY', 'Rudin assigned theoretical/proof role', `Role: ${sampleEval.recommendedRole}`);

    // Perform full source fusion
    const fusion = await fuseAcademicSources(conceptId);
    assert(!!fusion.courseAuthority.documentName, 'ESOGÜ Local syllabus/course authority attached', `Authority: ${fusion.courseAuthority.documentName}`);
    assert(fusion.verifiedClaims.length > 0, 'Verified claims with concrete citations generated', `Claims count: ${fusion.verifiedClaims.length}`);
    assert(!!fusion.formalDefinitionSource.definitionLaTeX, 'Formal definition LaTeX synthesized', `Formula: ${fusion.formalDefinitionSource.definitionLaTeX}`);

    // ----------------------------------------------------
    // TEST C: RESEARCH WITH EXTERNAL DISABLED (OFFLINE / AIR-GAPPED FALLBACK)
    // ----------------------------------------------------
    console.log('\n[TEST C] Source Fusion with External Research Disabled...');
    const offlineFusion = await fuseAcademicSources(conceptId, { disableExternal: true });
    assert(offlineFusion.isExternalCrossChecked === false, 'External cross-checking flagged as false when disabled');
    assert(offlineFusion.courseAuthority.authorityLevel === 'PRIMARY_AUTHORITY' || offlineFusion.courseAuthority.authorityLevel === 'PROFESSOR',
      'Local professor authority remains primary authority',
      `Authority: ${offlineFusion.courseAuthority.documentName}`
    );

    // ----------------------------------------------------
    // TEST D: EVIDENCE-BASED MASTERY — WRONG ANSWERS NEVER AWARD MASTERY
    // ----------------------------------------------------
    console.log('\n[TEST D] Evidence-Based Mastery Correctness (Wrong Answers)...');
    
    // User B answers mini-check incorrectly
    const wrongProgressResult = await recordLessonConceptProgress(userB.id, 'bayes-theorem', false);
    assert(wrongProgressResult.conceptualScore <= 20, 'Wrong answer yields low conceptual score (Diagnostic evidence)', `Score: ${wrongProgressResult.conceptualScore}`);
    assert(!wrongProgressResult.isUnlocked, 'Concept is not unlocked on failure');

    const masteryAfterWrong = await prisma.userConceptMastery.findUnique({
      where: { userId_conceptId: { userId: userB.id, conceptId: 'bayes-theorem' } }
    });
    assert(masteryAfterWrong !== null && masteryAfterWrong.conceptualScore === 20, 'Mastery flagged for remediation, NOT rewarded');

    // Simulate incorrect problem submission
    const problem = await prisma.problem.findFirst({
      where: { concepts: { some: { conceptId: 'bayes-theorem' } } }
    });

    if (problem) {
      const wrongSubmissionResult = await updateMasteryOnSubmission({
        userId: userB.id,
        problemId: problem.id,
        isCorrect: false,
        timeSpentSec: 45,
        hintsUsed: 2,
        attemptNumber: 1,
        independenceScore: 0.2
      });

      const updatedBayes = wrongSubmissionResult.updatedConcepts.find(c => c.conceptId === 'bayes-theorem');
      assert(updatedBayes !== undefined, 'Mastery updated on submission');
      assert(updatedBayes!.scoreDelta <= 0, 'Mastery delta is negative or zero on wrong answer', `Delta: ${updatedBayes?.scoreDelta}`);
    }

    // ----------------------------------------------------
    // TEST E: INDEPENDENT SOLVE AWARDS STRONG MASTERY
    // ----------------------------------------------------
    console.log('\n[TEST E] Independent Solve Awards Strong Positive Evidence...');
    if (problem) {
      const correctSubmissionResult = await updateMasteryOnSubmission({
        userId: userA.id,
        problemId: problem.id,
        isCorrect: true,
        timeSpentSec: 75,
        hintsUsed: 0,
        attemptNumber: 1,
        independenceScore: 1.0 // 100% independent
      });

      const userABayes = correctSubmissionResult.updatedConcepts.find(c => c.conceptId === 'bayes-theorem');
      assert(userABayes !== undefined && userABayes.scoreDelta > 0, 'Independent correct solve awards positive mastery boost', `Delta: +${userABayes?.scoreDelta}`);
      assert(userABayes!.independentSolvesCount === 1, 'Independent solve count incremented');
    }

    // ----------------------------------------------------
    // TEST F: PREREQUISITE GAP DETECTION & DETOUR RECOMMENDATION
    // ----------------------------------------------------
    console.log('\n[TEST F] Prerequisite Gap & Remediation Detour...');
    if (problem) {
      const problemWithRelations = await prisma.problem.findUnique({
        where: { id: problem.id },
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

      // Wildly wrong answer triggers PREREQUISITE_GAP or DEFINITION_MISUNDERSTANDING
      const diag = diagnoseError('99999999', problem.correctAnswer, problemWithRelations?.concepts || []);
      assert(diag.errorType === 'PREREQUISITE_GAP' || diag.errorType === 'DEFINITION_MISUNDERSTANDING',
        'Diagnosed conceptual breakdown accurately',
        `ErrorType: ${diag.errorType}, Repair: ${diag.repairConceptName || 'Temel Kavram'}`
      );
      assert(!!diag.recommendedAction && !!diag.explanation, 'Remediation recommendation generated', `Action: ${diag.recommendedAction}`);
    }

    // ----------------------------------------------------
    // TEST G: GENERIC TEACHER ENGINE SYNTHESIS FOR ANY ARBITRARY CONCEPT
    // ----------------------------------------------------
    console.log('\n[TEST G] Generic Teacher Engine Synthesis for Secondary/Arbitrary Concepts...');
    
    // Test on 'spanning-trees' or 'lu-decomposition' or 'dynamic-programming'
    const testConcepts = ['spanning-trees', 'lu-decomposition', 'uniform-convergence'];
    for (const cId of testConcepts) {
      const exists = await prisma.concept.findUnique({ where: { id: cId } });
      if (exists) {
        const genLesson = await generateStructuredLesson(cId);
        assert(genLesson.steps.length === 8, `Structured 8-step lesson synthesized for ${cId}`, `Steps: ${genLesson.steps.length}`);
        const miniCheckStep = genLesson.steps.find(s => s.stepType === 'MINI_CHECK');
        assert(!!miniCheckStep?.miniCheckQuestion && !!miniCheckStep?.miniCheckAnswer, 
          `Valid mini-check generated for ${cId}`,
          `Q: ${miniCheckStep?.miniCheckQuestion?.slice(0, 50)}... | Ans: ${miniCheckStep?.miniCheckAnswer?.slice(0, 40)}...`
        );
      }
    }

    // ----------------------------------------------------
    // TEST H: COMPLETE DYNAMIC RESEARCH -> EVALUATION -> FUSION -> TEACHER RUNTIME CHAIN
    // (Testing on concepts strictly OUTSIDE the static registry)
    // ----------------------------------------------------
    console.log('\n[TEST H] Live Dynamic Research -> Multi-Dimensional Evaluation -> Fusion -> Teacher Chain...');
    const unregisteredConceptId = 'topological-space-axioms';
    const dynamicResearch = await researchAcademicSources(unregisteredConceptId);
    assert(dynamicResearch.isExternalAvailable === true, 'Dynamic academic research succeeded for unregistered concept');
    assert(dynamicResearch.evidenceList.length >= 2, 'Discovered at least 2 Tier 1 academic benchmark sources', `Count: ${dynamicResearch.evidenceList.length}`);
    
    // Check dynamic evaluation of the newly discovered sources
    const dynamicEvidence = dynamicResearch.evidenceList[0];
    const dynamicEval = evaluateAcademicSource({
      id: dynamicEvidence.citation,
      name: dynamicEvidence.courseName,
      institution: dynamicEvidence.institution,
      tier: dynamicEvidence.tier,
      authority: 'REFERENCE_TEXTBOOK',
      rawText: `${dynamicEvidence.courseName} ${dynamicEvidence.citation} ${dynamicEvidence.extractedExcerpt}`,
      topicsCovered: ['topological space', 'topology axioms']
    }, {
      targetConcept: 'topological-space-axioms',
      courseCode: 'MAT301',
      department: 'Matematik ve Bilgisayar Bilimleri'
    });
    assert(dynamicEval.overallQuality >= 70, 'Dynamically discovered source evaluated with high quality score', `Score: ${dynamicEval.overallQuality}`);

    // Verify full teacher synthesis with dynamic fusion
    const dynamicLesson = await generateStructuredLesson(unregisteredConceptId);
    assert(dynamicLesson.steps.length === 8, '8-step pedagogical lesson synthesized for dynamically researched concept');
    assert(dynamicLesson.fusion.intuitionSource.source.includes('MIT') || dynamicLesson.fusion.intuitionSource.source.includes('Cambridge'),
      'Fusion attached dynamic academic intuition',
      `Intuition Source: ${dynamicLesson.fusion.intuitionSource.source}`
    );
    const dynamicMiniCheck = dynamicLesson.steps.find(s => s.stepType === 'MINI_CHECK');
    assert(!!dynamicMiniCheck?.miniCheckQuestion && !!dynamicMiniCheck?.miniCheckAnswer,
      'Hypothesis-testing mini-check dynamically generated from assumptions',
      `Mini-check Q: ${dynamicMiniCheck?.miniCheckQuestion?.slice(0, 50)}...`
    );

    // Cleanup test users
    await prisma.userConceptMastery.deleteMany({ where: { userId: { in: [userA.id, userB.id] } } });
    await prisma.mistakeItem.deleteMany({ where: { userId: { in: [userA.id, userB.id] } } });
    await prisma.user.deleteMany({ where: { id: { in: [userA.id, userB.id] } } });

    console.log('\n========================================================================');
    console.log(`ALL TESTS COMPLETED: ${passed} PASSED, ${failed} FAILED.`);
    console.log('========================================================================\n');

  } catch (err) {
    console.error('Fatal error during test execution:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

runArchitectureRepairTests();
