'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../lib/i18n/context';
import {
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  Wrench,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function DailyStudyPlanPage() {
  const { language } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/daily?lang=${language}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [language]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-academic-500 font-mono text-sm">
        <Sparkles className="w-5 h-5 animate-pulse text-amber-500 mr-2" />
        Axiom bugünkü çalışma planını derliyor...
      </div>
    );
  }

  const { currentCourse, todayPlan, totalEstimatedMinutes } = data;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="border-b border-academic-200 dark:border-academic-800 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-amber-500 uppercase tracking-wider">
          <Calendar className="w-4 h-4" />
          <span>AXIOM AKADEMİK REHBER</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-academic-950 dark:text-academic-50">
          Bugünün Çalışma Planı (Sıfır Karar Yorgunluğu)
        </h1>
        <p className="text-xs sm:text-sm text-academic-600 dark:text-academic-400 max-w-2xl leading-relaxed">
          Neye çalışacağınızı seçmeyin. Axiom; aktif dersinizdeki sıradaki adımı, tespit edilen önkoşul boşluklarını ve unutma eğrisine giren konuları otomatik olarak sıraladı.
        </p>

        {/* Current Course Context Pill */}
        {currentCourse && (
          <div className="pt-2 flex items-center gap-3 text-xs font-mono">
            <span className="text-academic-500">Aktif Ders:</span>
            <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
              {currentCourse.code} {currentCourse.name} (%{currentCourse.progressPercent} İlerleme)
            </span>
            <span className="text-academic-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Toplam ~{totalEstimatedMinutes} dakika
            </span>
          </div>
        )}
      </div>

      {/* Structured 3-Step Daily Queue */}
      <div className="space-y-4">
        {todayPlan?.map((item: any) => {
          const isLesson = item.type === 'LESSON';
          const isDiagnosis = item.type === 'DIAGNOSIS';
          const isReview = item.type === 'REVIEW';

          return (
            <div
              key={item.order}
              className={`p-5 sm:p-6 rounded-2xl border transition-all space-y-4 shadow-sm ${
                item.isUrgent
                  ? 'border-rose-500/40 bg-rose-500/5 dark:bg-rose-500/10'
                  : 'border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/60 hover:border-amber-500/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-academic-100 dark:bg-academic-800 text-xs font-mono font-bold flex items-center justify-center text-academic-700 dark:text-academic-300">
                      {item.order}
                    </span>
                    <span
                      className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                        isLesson
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                          : isDiagnosis
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                          : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
                      }`}
                    >
                      {item.badge}
                    </span>
                    <span className="text-xs font-mono text-academic-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.estimatedMinutes} dk
                    </span>
                  </div>

                  <h2 className="text-lg font-serif font-bold text-academic-900 dark:text-academic-100 pt-1">
                    {item.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-academic-600 dark:text-academic-400 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>

                <Link
                  href={item.ctaHref}
                  className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all self-start sm:self-center shadow-md whitespace-nowrap ${
                    item.isUrgent
                      ? 'bg-rose-600 hover:bg-rose-500 text-white'
                      : isLesson
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      : 'bg-academic-900 dark:bg-academic-100 text-white dark:text-academic-950 hover:opacity-90'
                  }`}
                >
                  <span>{item.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
