'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../lib/i18n/context';
import { Calendar, Flame, Clock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { getDifficultyTier } from '../../lib/algorithms/elo';

export default function DailyChallengePage() {
  const { t, language } = useLanguage();
  const [dailyData, setDailyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/daily?lang=${language}`)
      .then((res) => res.json())
      .then((data) => {
        setDailyData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [language]);

  const problems = dailyData?.dailyProblems || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-academic-200 dark:border-academic-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-amber-500 uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>{t.problem.dailyTitle}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-academic-950 dark:text-academic-50">
            {language === 'tr' ? 'Günün Zihinsel Antrenmanı' : 'Daily Deliberate Practice Session'}
          </h1>
          <p className="text-xs sm:text-sm text-academic-500 dark:text-academic-400 mt-1">
            {language === 'tr'
              ? 'Yetenek düzeyinize göre seçilmiş 3 derin problem. Hedef: 15–30 dakika.'
              : '3 profound problems calibrated to your current rating. Target: 15–30 minutes.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-mono font-bold">
            <Flame className="w-4 h-4" />
            <span>4 Günlük Seri</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-academic-100 dark:bg-academic-900 border border-academic-200 dark:border-academic-800 text-academic-700 dark:text-academic-300 text-xs font-mono">
            <Clock className="w-4 h-4 text-academic-400" />
            <span>20 {t.problem.minutes}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="p-4 rounded-xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/40 space-y-2">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-academic-500">{language === 'tr' ? 'Bugünün İlerlemesi' : "Today's Completion"}</span>
          <span className="font-bold text-amber-500">1 / 3 {language === 'tr' ? 'Tamamlandı' : 'Completed'}</span>
        </div>
        <div className="w-full h-2 rounded-full bg-academic-100 dark:bg-academic-800 overflow-hidden">
          <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: '33%' }} />
        </div>
      </div>

      {/* Problems List */}
      <div className="space-y-4">
        {problems.map((p: any, idx: number) => {
          const tier = getDifficultyTier(p.rating);

          return (
            <div
              key={p.id}
              className="p-5 sm:p-6 rounded-xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/50 hover:border-amber-500/40 transition-all space-y-4 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-academic-400 font-bold">
                      #{idx + 1}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono border font-medium ${tier.colorClass}`}>
                      {p.rating} • {language === 'tr' ? tier.labelTr : tier.labelEn}
                    </span>
                    <span className="text-xs text-academic-400 font-mono">
                      ~{p.estimatedTime} {t.problem.minutes}
                    </span>
                  </div>
                  <h2 className="text-lg font-serif font-bold text-academic-900 dark:text-academic-100">
                    {p.title}
                  </h2>
                </div>

                <Link
                  href={`/problem/${p.slug}`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs font-mono transition-all self-start sm:self-center"
                >
                  <span>{language === 'tr' ? 'Şimdi Çöz' : 'Solve Now'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Concept tags */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-academic-100 dark:border-academic-800/60">
                <span className="text-[11px] font-mono text-academic-400">
                  {language === 'tr' ? 'Kavramlar:' : 'Concepts:'}
                </span>
                {p.concepts.map((c: any) => (
                  <span
                    key={c.id}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-academic-100 dark:bg-academic-800 text-academic-700 dark:text-academic-300"
                  >
                    {language === 'tr' && c.dualTerminology ? c.dualTerminology : c.name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
