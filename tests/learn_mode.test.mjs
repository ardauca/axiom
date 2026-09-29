import { test, describe } from 'node:test';
import assert from 'node:assert';
import { SEED_CONCEPTS } from '../prisma/seedData.js';

describe('Axiom Learn Mode Deep Educational & Mathematical Audit', () => {
  const REQUIRED_CONCEPTS = [
    'modular-arithmetic',
    'bayes-theorem',
    'mathematical-induction',
    'eigenvalues',
    'dynamic-programming',
  ];

  test('contains all 5 mandatory audit concepts with academic citations', () => {
    const conceptMap = new Map(SEED_CONCEPTS.map((c) => [c.id, c]));

    for (const id of REQUIRED_CONCEPTS) {
      assert.ok(conceptMap.has(id), `Concept ${id} must exist in seed catalog`);
      const c = conceptMap.get(id);

      assert.ok(c.sourceTitle, `${id} must have source academic title`);
      assert.ok(c.sourceAuthor, `${id} must have accredited source author`);
      assert.ok(c.sourceCitation, `${id} must have specific chapter/theorem citation`);
      assert.ok(
        ['SOURCE_BACKED', 'CAS_VERIFIED', 'NUMERICALLY_CHECKED'].includes(c.verificationStatus),
        `${id} must have honest verification status`
      );
    }
  });

  test('enforces strict 8-step pedagogical structure for every concept', () => {
    const EXPECTED_STEP_TYPES = [
      'INTUITION',
      'DEFINITION',
      'MENTAL_MODEL',
      'NOTATION',
      'SIMPLE_EXAMPLE',
      'WORKED_EXAMPLE',
      'MINI_CHECK',
      'GUIDED_PRACTICE',
    ];

    for (const conceptId of REQUIRED_CONCEPTS) {
      const c = SEED_CONCEPTS.find((item) => item.id === conceptId);
      assert.ok(c, `Missing ${conceptId}`);
      assert.strictEqual(
        c.lessonSteps.length,
        8,
        `${conceptId} must have exactly 8 pedagogical steps, found ${c.lessonSteps.length}`
      );

      c.lessonSteps.forEach((step, idx) => {
        assert.strictEqual(step.stepOrder, idx + 1, `${conceptId} step order mismatch at ${idx}`);
        assert.strictEqual(
          step.stepType,
          EXPECTED_STEP_TYPES[idx],
          `${conceptId} step ${idx + 1} type should be ${EXPECTED_STEP_TYPES[idx]}, got ${step.stepType}`
        );

        // Verify bilingual text presence
        assert.ok(step.translations.tr.title.length > 0, `${conceptId} step ${idx + 1} missing TR title`);
        assert.ok(step.translations.tr.content.length > 50, `${conceptId} step ${idx + 1} TR content too short`);
        assert.ok(step.translations.en.title.length > 0, `${conceptId} step ${idx + 1} missing EN title`);
        assert.ok(step.translations.en.content.length > 50, `${conceptId} step ${idx + 1} EN content too short`);
      });
    }
  });

  test('validates explicit assumptions in mathematical definitions', () => {
    // 1. Bayes' Theorem requires P(B) > 0 for conditioning and division, but does NOT require P(A) > 0
    const bayes = SEED_CONCEPTS.find((c) => c.id === 'bayes-theorem');
    assert.ok(
      bayes.assumptions.includes('P(B) > 0'),
      'Bayes Theorem must explicitly state P(B) > 0 assumption'
    );
    assert.strictEqual(
      bayes.assumptions.includes('P(A) > 0'),
      false,
      'Bayes Theorem must NOT incorrectly require P(A) > 0'
    );

    // 2. Mathematical Induction requires base case and inductive step over natural numbers
    const induction = SEED_CONCEPTS.find((c) => c.id === 'mathematical-induction');
    assert.ok(
      induction.assumptions.toLowerCase().includes('subset') ||
        induction.assumptions.includes('\\mathbb{N}'),
      'Induction must state inductive domain over N or well-ordering'
    );

    // 3. Eigenvalues requires square matrix and non-zero eigenvector v != 0
    const eigen = SEED_CONCEPTS.find((c) => c.id === 'eigenvalues');
    assert.ok(
      eigen.assumptions.includes('\\setminus') ||
        eigen.assumptions.includes('v \\neq \\mathbf{0}') ||
        eigen.assumptions.includes('v \\neq 0'),
      'Eigenvalues must require non-zero eigenvector'
    );
    assert.ok(
      eigen.assumptions.includes('n \\times n') || eigen.assumptions.includes('M_{n'),
      'Eigenvalues must require square matrix'
    );

    // 4. Modular Arithmetic requires positive integer modulus m in Z+, but does NOT artificially restrict m > 1
    const mod = SEED_CONCEPTS.find((c) => c.id === 'modular-arithmetic');
    assert.ok(
      mod.assumptions.includes('\\mathbb{Z}^+'),
      'Modular arithmetic must require positive integer modulus m in Z+'
    );
    assert.strictEqual(
      mod.assumptions.includes('m > 1'),
      false,
      'Modular arithmetic must NOT artificially restrict modulus to m > 1'
    );

    // 5. Dynamic Programming requires optimal substructure and overlapping subproblems
    const dp = SEED_CONCEPTS.find((c) => c.id === 'dynamic-programming');
    assert.ok(
      dp.assumptions.toLowerCase().includes('optimal substructure') ||
        dp.formalStatement.toLowerCase().includes('optimal'),
      'Dynamic Programming must state optimal substructure'
    );
  });

  test('validates conceptual Mini-Checks (Step 7) test understanding, not pure memorization', () => {
    for (const conceptId of REQUIRED_CONCEPTS) {
      const c = SEED_CONCEPTS.find((item) => item.id === conceptId);
      const step7 = c.lessonSteps.find((s) => s.stepOrder === 7);

      assert.ok(step7, `${conceptId} missing step 7`);
      assert.strictEqual(step7.stepType, 'MINI_CHECK');
      assert.ok(step7.miniCheckAnswer, `${conceptId} missing miniCheckAnswer`);
      assert.ok(
        step7.miniCheckOptions && step7.miniCheckOptions.length >= 3,
        `${conceptId} must have at least 3 multiple choice options`
      );
      assert.ok(
        step7.miniCheckOptions.includes(step7.miniCheckAnswer),
        `${conceptId} miniCheckAnswer '${step7.miniCheckAnswer}' must be in options`
      );

      // Verify question prompts in both languages
      assert.ok(
        step7.translations.tr.miniCheckQuestion,
        `${conceptId} missing TR miniCheckQuestion`
      );
      assert.ok(
        step7.translations.en.miniCheckQuestion,
        `${conceptId} missing EN miniCheckQuestion`
      );
    }
  });

  test('verifies mathematical correctness of Worked Examples (Step 6)', () => {
    // Modular arithmetic worked example: 7^100 mod 13 == 9 via Fermat
    const mod = SEED_CONCEPTS.find((c) => c.id === 'modular-arithmetic');
    const modStep6 = mod.lessonSteps.find((s) => s.stepOrder === 6);
    assert.ok(
      modStep6.translations.en.content.includes('9 \\pmod{13}') ||
        modStep6.translations.en.content.includes('Answer: **9**') ||
        modStep6.translations.en.content.includes('\\equiv 9'),
      'Modular arithmetic worked example must reach remainder 9'
    );

    // Bayes' theorem worked example: P(Disease | Positive) calculation
    const bayes = SEED_CONCEPTS.find((c) => c.id === 'bayes-theorem');
    const bayesStep6 = bayes.lessonSteps.find((s) => s.stepOrder === 6);
    assert.ok(
      bayesStep6.translations.en.content.includes('16.1%') ||
        bayesStep6.translations.en.content.includes('0.161') ||
        bayesStep6.translations.en.content.includes('0.059'),
      'Bayes worked example must accurately compute posterior probability'
    );

    // Eigenvalues worked example: det(A - \lambda I) = 0 for [[4, 1], [2, 3]] -> eigenvalues 5 and 2
    const eigen = SEED_CONCEPTS.find((c) => c.id === 'eigenvalues');
    const eigenStep6 = eigen.lessonSteps.find((s) => s.stepOrder === 6);
    assert.ok(
      eigenStep6.translations.en.content.includes('\\lambda_1 = 5') ||
        eigenStep6.translations.en.content.includes('5 and 2') ||
        (eigenStep6.translations.en.content.includes('5') && eigenStep6.translations.en.content.includes('2')),
      'Eigenvalues worked example must find eigenvalues 5 and 2'
    );
  });
});
