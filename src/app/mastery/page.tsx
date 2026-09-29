'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../lib/i18n/context';
import { Target, Star, CheckCircle2, ArrowRight, ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';

export default function MasteryDiagnosticsPage() {
  const { t, language } = useLanguage();

  const masteryDimensions = [
    {
      conceptName: language === 'tr' ? "Bayes Teoremi (Bayes' Theorem)" : "Bayes' Theorem",
      conceptId: 'bayes-theorem',
      conceptual: 100,
      formula: 82,
      problemSolving: 61,
      transfer: 42,
      independence: '4 / 5',
      verdict: language === 'tr' ? 'Kavram tanınıyor ancak yabancı problem transferi geliştirilmeli' : 'Concept recognized, but novel problem transfer needs practice',
      needsReview: true,
    },
    {
      conceptName: language === 'tr' ? 'Modüler Aritmetik (Modular Arithmetic)' : 'Modular Arithmetic',
      conceptId: 'modular-arithmetic',
      conceptual: 95,
      formula: 90,
      problemSolving: 85,
      transfer: 78,
      independence: '5 / 5',
      verdict: language === 'tr' ? 'Yüksek yetkinlik ve bağımsız çözüm kabiliyeti' : 'High competence and independent problem-solving ability',
      needsReview: false,
    },
    {
      conceptName: language === 'tr' ? 'Özdeğerler ve Özvektörler (Eigenvalues)' : 'Eigenvalues and Eigenvectors',
      conceptId: 'eigenvalues',
      conceptual: 80,
      formula: 65,
      problemSolving: 50,
      transfer: 35,
      independence: '3 / 5',
      verdict: language === 'tr' ? 'Önkoşul (Matris Çarpımı) pekiştirilmesi tavsiye edilir' : 'Reviewing prerequisite (Matrix Multiplication) recommended',
      needsReview: true,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="border-b border-academic-200 dark:border-academic-800 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-purple-500 uppercase tracking-wider">
          <Target className="w-4 h-4" />
          <span>{t.modes.mastery.badge}</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-academic-950 dark:text-academic-50">
          {language === 'tr' ? '5 Boyutlu Yetkinlik Teşhisi' : '5-Dimensional Mastery Diagnosis'}
        </h1>
        <p className="text-sm text-academic-600 dark:text-academic-400 max-w-2xl leading-relaxed">
          {language === 'tr'
            ? 'Axiom, bir konuyu "tanımak" ile o konuyu "yeni problemlerde bağımsızca çözebilmek" arasındaki farkı net olarak ölçer.'
            : 'Axiom distinguishes between superficial formula recognition and genuine independent problem-solving competence.'}
        </p>
      </div>

      {/* Diagnostics Cards */}
      <div className="space-y-6">
        {masteryDimensions.map((m, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/50 shadow-md space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-academic-100 dark:border-academic-800 pb-4">
              <div>
                <span className="text-xs font-mono text-academic-400 uppercase tracking-wider font-semibold">
                  Competency Profile
                </span>
                <h2 className="text-xl font-serif font-bold text-academic-900 dark:text-academic-50">
                  {m.conceptName}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/learn/${m.conceptId}`}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-academic-100 dark:bg-academic-800 text-academic-800 dark:text-academic-200 hover:bg-academic-200 transition-colors"
                >
                  {t.modes.learn.title}
                </Link>
                <Link
                  href="/practice"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors"
                >
                  {language === 'tr' ? 'Yetkinlik Pratiği' : 'Practice'}
                </Link>
              </div>
            </div>

            {/* 5-Dimensional Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="p-3.5 rounded-xl bg-academic-50 dark:bg-academic-950/60 border border-academic-200 dark:border-academic-800 space-y-1">
                <span className="text-[10px] font-mono text-academic-400 uppercase">
                  {t.modes.mastery.dimensions.conceptual}
                </span>
                <div className="text-lg font-bold font-mono text-academic-900 dark:text-academic-100">
                  {m.conceptual}%
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-academic-50 dark:bg-academic-950/60 border border-academic-200 dark:border-academic-800 space-y-1">
                <span className="text-[10px] font-mono text-academic-400 uppercase">
                  {t.modes.mastery.dimensions.formula}
                </span>
                <div className="text-lg font-bold font-mono text-academic-900 dark:text-academic-100">
                  {m.formula}%
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-academic-50 dark:bg-academic-950/60 border border-academic-200 dark:border-academic-800 space-y-1">
                <span className="text-[10px] font-mono text-academic-400 uppercase">
                  {t.modes.mastery.dimensions.problemSolving}
                </span>
                <div className="text-lg font-bold font-mono text-academic-900 dark:text-academic-100">
                  {m.problemSolving}%
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-academic-50 dark:bg-academic-950/60 border border-academic-200 dark:border-academic-800 space-y-1">
                <span className="text-[10px] font-mono text-academic-400 uppercase">
                  {t.modes.mastery.dimensions.transfer}
                </span>
                <div className="text-lg font-bold font-mono text-purple-600 dark:text-purple-400">
                  {m.transfer}%
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-academic-50 dark:bg-academic-950/60 border border-academic-200 dark:border-academic-800 space-y-1">
                <span className="text-[10px] font-mono text-academic-400 uppercase">
                  {t.modes.mastery.dimensions.independence}
                </span>
                <div className="text-lg font-bold font-mono text-amber-500">
                  {m.independence} ★
                </div>
              </div>
            </div>

            {/* Verdict Alert */}
            <div className={`p-3.5 rounded-xl border text-xs font-mono flex items-center gap-2.5 ${
              m.needsReview
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
            }`}>
              {m.needsReview ? (
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              )}
              <span>{m.verdict}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
