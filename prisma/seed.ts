import { PrismaClient } from '@prisma/client';
import { SEED_CONCEPTS } from './seedData';
import { generateInitialCatalog } from './problemsCatalog';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Axiom Database Seed ---');

  // 1. Clean existing records safely
  await prisma.submission.deleteMany();
  await prisma.mistakeItem.deleteMany();
  await prisma.spacedReview.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.hintTranslation.deleteMany();
  await prisma.hint.deleteMany();
  await prisma.problemTranslation.deleteMany();
  await prisma.problemConcept.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.lessonStepTranslation.deleteMany();
  await prisma.lessonStep.deleteMany();
  await prisma.conceptDependency.deleteMany();
  await prisma.conceptTranslation.deleteMany();
  await prisma.concept.deleteMany();

  console.log('Cleared previous records.');

  // 2. Insert Concepts
  console.log(`Inserting ${SEED_CONCEPTS.length} verified mathematical concepts...`);
  for (const c of SEED_CONCEPTS) {
    await prisma.concept.create({
      data: {
        id: c.id,
        category: c.category,
        subcategory: c.subcategory,
        formalStatement: c.formalStatement,
        assumptions: c.assumptions,
        notation: c.notation,
        canonicalFormula: c.canonicalFormula,
        proofDerivation: c.proofDerivation,
        verificationLevel: c.verificationLevel,
        verificationStatus: c.verificationStatus,
        sourceTitle: c.sourceTitle,
        sourceAuthor: c.sourceAuthor,
        sourceCitation: c.sourceCitation,
        translations: {
          create: [
            {
              language: 'tr',
              name: c.translations.tr.name,
              dualTerminology: c.translations.tr.dualTerminology,
              definition: c.translations.tr.definition,
              intuition: c.translations.tr.intuition,
              commonPitfalls: c.translations.tr.commonPitfalls,
            },
            {
              language: 'en',
              name: c.translations.en.name,
              dualTerminology: c.translations.en.dualTerminology,
              definition: c.translations.en.definition,
              intuition: c.translations.en.intuition,
              commonPitfalls: c.translations.en.commonPitfalls,
            },
          ],
        },
        lessonSteps: {
          create: c.lessonSteps.map((step) => ({
            stepOrder: step.stepOrder,
            stepType: step.stepType,
            miniCheckAnswer: step.miniCheckAnswer || null,
            miniCheckOptions: step.miniCheckOptions ? JSON.stringify(step.miniCheckOptions) : null,
            translations: {
              create: [
                {
                  language: 'tr',
                  title: step.translations.tr.title,
                  content: step.translations.tr.content,
                  miniCheckQuestion: step.translations.tr.miniCheckQuestion || null,
                },
                {
                  language: 'en',
                  title: step.translations.en.title,
                  content: step.translations.en.content,
                  miniCheckQuestion: step.translations.en.miniCheckQuestion || null,
                },
              ],
            },
          })),
        },
      },
    });
  }

  // 3. Connect Prerequisite Concept Dependencies
  console.log('Linking prerequisite concept dependencies...');
  for (const c of SEED_CONCEPTS) {
    for (const prereq of c.prerequisites) {
      await prisma.conceptDependency.create({
        data: {
          conceptId: c.id,
          prerequisiteId: prereq.id,
          importance: prereq.importance,
        },
      });
    }
  }

  // 4. Insert 100+ Original Seed Problems
  const problemCatalog = generateInitialCatalog();
  console.log(`Inserting ${problemCatalog.length} original problems into database...`);

  for (const p of problemCatalog) {
    const createdProb = await prisma.problem.create({
      data: {
        slug: p.slug,
        category: p.category,
        subcategory: p.subcategory,
        difficulty: p.difficulty,
        rating: p.rating,
        questionType: p.questionType,
        estimatedTime: p.estimatedTime,
        correctAnswer: p.correctAnswer,
        codeSnippet: p.codeSnippet || null,
        testCases: p.testCases || null,
        language: p.language || null,
        verificationLevel: p.verificationLevel,
        verificationSource: p.verificationSource,
        translations: {
          create: [
            {
              language: 'tr',
              title: p.translations.tr.title,
              prompt: p.translations.tr.prompt,
              options: p.translations.tr.options ? JSON.stringify(p.translations.tr.options) : null,
              solution: p.translations.tr.solution,
              commonMistakes: JSON.stringify(p.translations.tr.commonMistakes),
            },
            {
              language: 'en',
              title: p.translations.en.title,
              prompt: p.translations.en.prompt,
              options: p.translations.en.options ? JSON.stringify(p.translations.en.options) : null,
              solution: p.translations.en.solution,
              commonMistakes: JSON.stringify(p.translations.en.commonMistakes),
            },
          ],
        },
        hints: {
          create: p.hints.map((h) => ({
            order: h.order,
            penaltyScore: h.penaltyScore,
            translations: {
              create: [
                {
                  language: 'tr',
                  title: h.translations.tr.title,
                  content: h.translations.tr.content,
                },
                {
                  language: 'en',
                  title: h.translations.en.title,
                  content: h.translations.en.content,
                },
              ],
            },
          })),
        },
      },
    });

    // Link problem to concepts
    for (const cId of p.conceptIds) {
      const exists = await prisma.concept.findUnique({ where: { id: cId } });
      if (exists) {
        await prisma.problemConcept.create({
          data: {
            problemId: createdProb.id,
            conceptId: cId,
          },
        });
      }
    }
  }

  // 5. Create default Scholar user
  await prisma.user.upsert({
    where: { username: 'Scholar' },
    update: {},
    create: {
      username: 'Scholar',
      email: 'scholar@axiom.edu',
      rating: 1400,
      independenceScore: 4.8,
      xp: 350,
      streakDays: 4,
      role: 'ADMIN',
      preferredLang: 'tr',
    },
  });

  console.log('✓ Axiom Database Seed Successfully Completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
