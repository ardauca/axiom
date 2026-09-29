'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../lib/i18n/context';
import { Network, CheckCircle2, Lock, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';
import { MathRenderer } from '../../lib/math/KaTeXRenderer';

export default function SkillGraphPage() {
  const { t, language } = useLanguage();
  const [concepts, setConcepts] = useState<any[]>([]);
  const [selectedConcept, setSelectedConcept] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/concepts?lang=${language}`)
      .then((res) => res.json())
      .then((data) => {
        setConcepts(data.concepts || []);
        if (data.concepts?.[0]) setSelectedConcept(data.concepts[0]);
      })
      .catch(() => {});
  }, [language]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="border-b border-academic-200 dark:border-academic-800 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-amber-500 uppercase tracking-wider">
          <Network className="w-4 h-4" />
          <span>{t.nav.skills}</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-academic-950 dark:text-academic-50">
          {language === 'tr' ? 'Kavram ve Önkoşul Ağacı (DAG)' : 'Concept & Prerequisite Graph'}
        </h1>
        <p className="text-sm text-academic-600 dark:text-academic-400 max-w-2xl leading-relaxed">
          {language === 'tr'
            ? 'Kavramlar arasındaki nedensellik ve önkoşul hiyerarşisi. Bir konuyu derinlemesine kavramak için önkoşullarının sağlam olması gerekir.'
            : 'Visual dependency graph of concepts and prerequisites. Mastering advanced topics requires solidifying their foundational precursors.'}
        </p>
      </div>

      {/* Visual DAG & Inspection Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Graph Visual Area (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/60 shadow-lg space-y-6">
          <div className="flex items-center justify-between text-xs font-mono text-academic-400 border-b border-academic-100 dark:border-academic-800 pb-3">
            <span>Dependency Network</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Mastered</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>Learning</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Prereq Gap</span>
              </span>
            </div>
          </div>

          {/* Interactive DAG Nodes */}
          <div className="space-y-6 py-4">
            {concepts.map((c) => {
              const isSelected = selectedConcept?.id === c.id;
              const hasPrereqs = c.prerequisites.length > 0;

              return (
                <div key={c.id} className="relative">
                  {hasPrereqs && (
                    <div className="pl-6 pb-2 text-[11px] font-mono text-academic-400 flex items-center gap-2">
                      <span className="opacity-60">↳ {language === 'tr' ? 'Önkoşul:' : 'Prerequisite:'}</span>
                      <span className="font-semibold text-amber-500">{c.prerequisites[0].name}</span>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedConcept(c)}
                    className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 shadow-md ring-1 ring-amber-500/30'
                        : 'border-academic-200 dark:border-academic-800 hover:border-academic-300 dark:hover:border-academic-700 bg-academic-50/50 dark:bg-academic-950/40'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-academic-200 dark:bg-academic-800 text-academic-700 dark:text-academic-300 font-semibold">
                          {c.subcategory}
                        </span>
                        <span className="text-xs font-mono text-emerald-500 font-semibold">
                          Level {c.verificationLevel}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-base text-academic-900 dark:text-academic-100">
                        {language === 'tr' && c.dualTerminology ? c.dualTerminology : c.name}
                      </h3>
                    </div>

                    <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-amber-500 translate-x-1' : 'text-academic-400'}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Concept Inspector (1 col) */}
        {selectedConcept && (
          <div className="p-6 rounded-2xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/60 shadow-lg space-y-5">
            <div>
              <span className="text-xs font-mono uppercase text-amber-500 font-bold tracking-wider">
                Concept Inspector
              </span>
              <h2 className="text-xl font-serif font-bold text-academic-900 dark:text-academic-50 mt-1">
                {language === 'tr' && selectedConcept.dualTerminology ? selectedConcept.dualTerminology : selectedConcept.name}
              </h2>
            </div>

            <div className="text-xs font-mono bg-academic-50 dark:bg-academic-950 p-3 rounded-xl border border-academic-200 dark:border-academic-800 text-amber-600 dark:text-amber-400 overflow-x-auto">
              <MathRenderer math={selectedConcept.formalStatement} block={false} />
            </div>

            <p className="text-xs text-academic-600 dark:text-academic-400 leading-relaxed">
              {selectedConcept.definition}
            </p>

            <div className="p-3 rounded-xl bg-academic-50 dark:bg-academic-950/60 border border-academic-200 dark:border-academic-800 space-y-1 text-xs">
              <span className="font-mono font-semibold text-academic-700 dark:text-academic-300">
                Academic Citation:
              </span>
              <p className="text-[11px] text-academic-500">
                {selectedConcept.sourceTitle} — {selectedConcept.sourceAuthor} ({selectedConcept.sourceCitation})
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href={`/learn/${selectedConcept.id}`}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-colors text-center"
              >
                {language === 'tr' ? 'Bu Konuyu Öğren (Mini Ders)' : 'Learn This Concept'}
              </Link>
              <Link
                href="/practice"
                className="w-full py-2.5 rounded-xl border border-academic-300 dark:border-academic-700 hover:bg-academic-100 dark:hover:bg-academic-800 text-academic-900 dark:text-academic-100 font-mono text-xs font-semibold transition-colors text-center"
              >
                {language === 'tr' ? 'İlgili Problemleri Çöz' : 'Practice Problems'}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
