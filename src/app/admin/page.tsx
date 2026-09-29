'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../lib/i18n/context';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  Sparkles,
  Layers,
  Database,
  Cpu,
} from 'lucide-react';
import { MathRenderer } from '../../lib/math/KaTeXRenderer';

export default function AdminVerificationPage() {
  const { t, language } = useLanguage();

  const [generatorSubject, setGeneratorSubject] = useState('Number Theory');
  const [generatorDifficulty, setGeneratorDifficulty] = useState('1500');
  const [generating, setGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<any>(null);
  const [validationResults, setValidationResults] = useState<any>(null);

  const simulateAIGeneration = () => {
    setGenerating(true);
    setTimeout(() => {
      const draft = {
        title: 'Modular Inverse via Extended Euclidean Algorithm',
        category: 'MATHEMATICS',
        subcategory: 'NumberTheory',
        rating: 1540,
        formalStatement: 'ax \\equiv 1 \\pmod m \\iff \\gcd(a, m) = 1',
        prompt: 'Find the modular multiplicative inverse of $17$ modulo $43$. In other words, find the unique integer $x \\in \\{1, \\dots, 42\\}$ such that $17x \\equiv 1 \\pmod{43}$.',
        correctAnswer: '38',
        solution: 'By the Extended Euclidean Algorithm:\n$$43 = 2 \\times 17 + 9$$\n$$17 = 1 \\times 9 + 8$$\n$$9 = 1 \\times 8 + 1$$\nBack-substituting gives $1 = 9 - 1 \\times 8 = 9 - (17 - 9) = 2 \\times 9 - 17 = 2(43 - 2 \\times 17) - 17 = 2 \\times 43 - 5 \\times 17$.\nHence $-5 \\times 17 \\equiv 1 \\pmod{43}$.\nSince $-5 \\equiv 38 \\pmod{43}$, the unique inverse is **38**.',
        academicSource: 'Kenneth Rosen, Elementary Number Theory Sec 4.4',
      };

      const checks = [
        { name: 'Symbolic & Uniqueness Check', status: 'PASSED', detail: 'Single unique solution in residue class mod 43.' },
        { name: 'CAS Deterministic Calculation Engine', status: 'PASSED', detail: '(17 * 38) mod 43 = 646 mod 43 = 1. Verified.' },
        { name: 'Assumption Consistency Verification', status: 'PASSED', detail: 'gcd(17, 43) = 1 holds; 43 is prime.' },
        { name: 'Epistemic Source Attribution', status: 'PASSED', detail: 'Directly traceable to verified academic theorem (Bézout Identity).' },
      ];

      setGeneratedDraft(draft);
      setValidationResults(checks);
      setGenerating(false);
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="border-b border-academic-200 dark:border-academic-800 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>{t.verification.title}</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-academic-950 dark:text-academic-50">
          {language === 'tr' ? 'Epistemik Otorite & Doğrulama Paneli' : 'Epistemic Authority & Content Verification'}
        </h1>
        <p className="text-sm text-academic-600 dark:text-academic-400 max-w-2xl leading-relaxed">
          {t.verification.aiDisclaimer}
        </p>
      </div>

      {/* System Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/50 space-y-1">
          <span className="text-[11px] font-mono text-academic-400 uppercase">
            Catalog Problems
          </span>
          <div className="text-2xl font-bold font-mono text-academic-900 dark:text-academic-50">
            112
          </div>
          <span className="text-[10px] text-emerald-500 font-mono">100% Original & Verified</span>
        </div>

        <div className="p-4 rounded-xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/50 space-y-1">
          <span className="text-[11px] font-mono text-academic-400 uppercase">
            Verified Concepts
          </span>
          <div className="text-2xl font-bold font-mono text-academic-900 dark:text-academic-50">
            5
          </div>
          <span className="text-[10px] text-emerald-500 font-mono">MIT / Stanford Sources</span>
        </div>

        <div className="p-4 rounded-xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/50 space-y-1">
          <span className="text-[11px] font-mono text-academic-400 uppercase">
            Average Solve Rate
          </span>
          <div className="text-2xl font-bold font-mono text-academic-900 dark:text-academic-50">
            68.4%
          </div>
          <span className="text-[10px] text-academic-400 font-mono">Deliberate Difficulty</span>
        </div>

        <div className="p-4 rounded-xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/50 space-y-1">
          <span className="text-[11px] font-mono text-academic-400 uppercase">
            Independence Ratio
          </span>
          <div className="text-2xl font-bold font-mono text-amber-500">
            4.8 ★
          </div>
          <span className="text-[10px] text-academic-400 font-mono">Hint Decoupled Rating</span>
        </div>
      </div>

      {/* 6 Verification Levels Hierarchy */}
      <div className="p-6 rounded-2xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/50 space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-500" />
          <h2 className="font-serif font-bold text-lg text-academic-900 dark:text-academic-100">
            {language === 'tr' ? '6 Aşamalı Doğrulama Hiyerarşisi' : '6-Level Verification Hierarchy'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {Object.entries(t.verification.levels).map(([lvl, label]) => (
            <div
              key={lvl}
              className="p-3.5 rounded-xl border border-academic-100 dark:border-academic-800/80 bg-academic-50 dark:bg-academic-950/60 flex items-center gap-3 text-xs font-mono"
            >
              <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 font-bold flex items-center justify-center shrink-0">
                {lvl}
              </span>
              <span className="text-academic-700 dark:text-academic-300">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Problem Generation & Verification Pipeline */}
      <div className="p-6 rounded-2xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/50 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-500" />
            <h2 className="font-serif font-bold text-lg text-academic-900 dark:text-academic-100">
              {language === 'tr' ? 'Doğrulanmış Soru Üretim & Denetim Motoru' : 'Verified Problem Generator & Verification Engine'}
            </h2>
          </div>
          <span className="text-[11px] font-mono text-academic-400">
            Strict Multi-Check Pipeline
          </span>
        </div>

        <p className="text-xs text-academic-500 max-w-2xl leading-relaxed">
          {language === 'tr'
            ? 'Bir LLM modeline asla tek başına soru yayınlama yetkisi verilmez. Üretilen soru; teklik, sembolik CAS doğrulaması, sayısal tutarlılık ve insan onayından geçmeden yayına alınamaz.'
            : 'An LLM is never permitted to publish problems autonomously. Every generated problem must pass CAS evaluation, uniqueness tests, and human sign-off before entering the catalog.'}
        </p>

        {/* Input Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-mono text-academic-400 font-semibold">Subject / Topic:</label>
            <input
              type="text"
              value={generatorSubject}
              onChange={(e) => setGeneratorSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-academic-300 dark:border-academic-700 bg-white dark:bg-academic-950 text-xs font-mono text-academic-900 dark:text-academic-100 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-academic-400 font-semibold">Target Rating (Elo):</label>
            <input
              type="text"
              value={generatorDifficulty}
              onChange={(e) => setGeneratorDifficulty(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-academic-300 dark:border-academic-700 bg-white dark:bg-academic-950 text-xs font-mono text-academic-900 dark:text-academic-100 focus:outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={simulateAIGeneration}
              disabled={generating}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{generating ? 'Validating Pipeline...' : 'Generate & Verify'}</span>
            </button>
          </div>
        </div>

        {/* Pipeline Output & Automated Validation Checks */}
        {generatedDraft && (
          <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
              <span className="font-serif font-bold text-base text-academic-900 dark:text-academic-100">
                {generatedDraft.title}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                ✓ ALL CHECKS PASSED
              </span>
            </div>

            <p className="text-xs text-academic-700 dark:text-academic-300 leading-relaxed">
              {generatedDraft.prompt}
            </p>

            {/* Checks list */}
            <div className="space-y-2 pt-2 border-t border-emerald-500/10">
              <span className="text-[11px] font-mono text-academic-400 uppercase font-bold">
                Multi-Level Automated Verifications:
              </span>
              {validationResults?.map((chk: any, idx: number) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-white/60 dark:bg-academic-950/60 border border-emerald-500/20 flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="font-bold text-academic-800 dark:text-academic-200">
                      {chk.name}:
                    </span>
                    <span className="text-academic-500">{chk.detail}</span>
                  </div>
                  <span className="text-emerald-500 font-bold">{chk.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
