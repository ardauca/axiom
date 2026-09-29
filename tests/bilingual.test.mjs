import { test, describe } from 'node:test';
import assert from 'node:assert';
import { TRANSLATIONS } from '../src/lib/i18n/translations.js';
import { ACADEMIC_TERMS, formatTerm } from '../src/lib/i18n/terms.js';
import { SEED_CONCEPTS } from '../prisma/seedData.js';

describe('Axiom Bilingual & Dual Academic Terminology Audit', () => {
  test('formats Turkish terms with dual English counterparts in parentheses', () => {
    // In Turkish mode: "Özdeğer (Eigenvalue)"
    const eigenTr = formatTerm('eigenvalue', 'tr');
    assert.strictEqual(eigenTr, 'Özdeğer (Eigenvalue)');

    // In English mode: "Eigenvalue"
    const eigenEn = formatTerm('eigenvalue', 'en');
    assert.strictEqual(eigenEn, 'Eigenvalue');

    // Convex Hull
    assert.strictEqual(formatTerm('convex_hull', 'tr'), 'Dışbükey Örtü (Convex Hull)');
    assert.strictEqual(formatTerm('convex_hull', 'en'), 'Convex Hull');
  });

  test('verifies all academic terms have definitions in both TR and EN', () => {
    const termKeys = Object.keys(ACADEMIC_TERMS);
    assert.ok(termKeys.length >= 10, 'Must have at least 10 core academic terms defined');

    for (const key of termKeys) {
      const term = ACADEMIC_TERMS[key];
      assert.ok(term.tr.length > 0, `Term ${key} missing Turkish title`);
      assert.ok(term.en.length > 0, `Term ${key} missing English title`);
      assert.ok(term.definitionTr.length > 10, `Term ${key} missing Turkish definition`);
      assert.ok(term.definitionEn.length > 10, `Term ${key} missing English definition`);
    }
  });

  test('enforces structural key parity between TR and EN UI translation dictionaries', () => {
    const tr = TRANSLATIONS.tr;
    const en = TRANSLATIONS.en;

    function compareKeys(objTr, objEn, path = '') {
      const trKeys = Object.keys(objTr).sort();
      const enKeys = Object.keys(objEn).sort();

      for (const k of trKeys) {
        const fullPath = path ? `${path}.${k}` : k;
        assert.ok(
          k in objEn,
          `Translation key '${fullPath}' exists in TR but missing in EN`
        );

        if (typeof objTr[k] === 'object' && objTr[k] !== null && !Array.isArray(objTr[k])) {
          compareKeys(objTr[k], objEn[k], fullPath);
        }
      }

      for (const k of enKeys) {
        const fullPath = path ? `${path}.${k}` : k;
        assert.ok(
          k in objTr,
          `Translation key '${fullPath}' exists in EN but missing in TR`
        );
      }
    }

    compareKeys(tr, en);
  });

  test('verifies all seed concepts contain dualTerminology in Turkish translation', () => {
    for (const c of SEED_CONCEPTS) {
      const dual = c.translations.tr.dualTerminology;
      assert.ok(dual, `Concept ${c.id} missing Turkish dualTerminology`);
      assert.ok(
        dual.includes('(') && dual.includes(')'),
        `Concept ${c.id} dualTerminology '${dual}' must contain English name in parentheses`
      );
    }
  });
});
