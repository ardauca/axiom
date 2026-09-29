'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../lib/i18n/context';
import { GraduationCap, ArrowRight, ShieldCheck, BookOpen, Network } from 'lucide-react';
import { MathRenderer } from '../../lib/math/KaTeXRenderer';

export default function LearnIndexPage() {
  const { t, language } = useLanguage();
  const [concepts, setConcepts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/concepts?lang=${language}`)
      .then((res) => res.json())
      .then((data) => {
        setConcepts(data.concepts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [language]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-academic-200 dark:border-academic-800 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          <GraduationCap className="w-4 h-4" />
          <span>{t.modes.learn.title}</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-academic-950 dark:text-academic-50">
          {language === 'tr' ? 'Axiom Akademisi: Temelden Kavram İnşası' : 'Axiom Academy: Learn from First Principles'}
        </h1>
        <p className="text-sm text-academic-600 dark:text-academic-400 max-w-2xl leading-relaxed">
          {language === 'tr'
            ? 'Bir konuyu bilmiyor musunuz? Zor sorulara geçmeden önce sezgi, tanım, çözümlü örnek ve mini kavrama testi içeren 8 adımlı mini derslerle sağlam temeller atın.'
            : 'Unfamiliar with a topic? Build intuition, master formal definitions, and test your understanding through 8-step interactive mini-lessons before tackling difficult problems.'}
        </p>
      </div>

      {/* Epistemic Verification Notice */}
      <div className="p-4 rounded-xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/40 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <span className="font-semibold text-academic-800 dark:text-academic-200">
            {t.verification.aiDisclaimer}
          </span>
          <p className="text-academic-500">
            {language === 'tr'
              ? 'Derslerdeki tüm teorem ve formüller MIT, Stanford ve yetkin akademik kaynaklara dayanır; doğrulanmış epistemik tabakadan beslenir.'
              : 'All theorems and definitions in these lessons are traceable to verified university references (MIT OCW, Stanford).'}
          </p>
        </div>
      </div>

      {/* Concept Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {concepts.map((c) => (
          <div
            key={c.id}
            className="p-6 rounded-xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/50 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4 shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-academic-100 dark:bg-academic-800 text-academic-600 dark:text-academic-400 font-semibold">
                  {c.subcategory}
                </span>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Level {c.verificationLevel}</span>
                </span>
              </div>

              <div>
                <h2 className="text-xl font-serif font-bold text-academic-900 dark:text-academic-100">
                  {language === 'tr' && c.dualTerminology ? c.dualTerminology : c.name}
                </h2>
                <div className="mt-2 text-xs font-mono bg-academic-50 dark:bg-academic-950 p-2.5 rounded-lg border border-academic-200 dark:border-academic-800 text-amber-600 dark:text-amber-400 overflow-x-auto">
                  <MathRenderer math={c.formalStatement} block={false} />
                </div>
              </div>

              <p className="text-xs text-academic-600 dark:text-academic-400 line-clamp-2 leading-relaxed">
                {c.intuition}
              </p>

              {/* Prerequisites */}
              {c.prerequisites.length > 0 && (
                <div className="text-[11px] font-mono text-academic-500 flex items-center gap-1.5 pt-1">
                  <Network className="w-3.5 h-3.5 text-academic-400" />
                  <span>{language === 'tr' ? 'Önkoşul:' : 'Prerequisite:'}</span>
                  <span className="text-amber-500 font-semibold">
                    {c.prerequisites[0].name}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-academic-100 dark:border-academic-800 flex items-center justify-between">
              <span className="text-[11px] text-academic-400 font-mono">
                {c.sourceAuthor.slice(0, 30)}
              </span>
              <Link
                href={`/learn/${c.id}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs font-mono transition-colors"
              >
                <span>{language === 'tr' ? 'Derse Başla' : 'Start Lesson'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
