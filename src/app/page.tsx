'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../lib/i18n/context';
import {
  Flame,
  Calendar,
  GraduationCap,
  Swords,
  Target,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { LatexText } from '../lib/math/KaTeXRenderer';

export default function HomePage() {
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

  const featuredDaily = dailyData?.dailyProblems?.[0];

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16">
      {/* Hero & Academic Tagline */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{t.verification.verifiedSource}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-academic-950 dark:text-academic-50 tracking-tight leading-tight">
          {t.brand.tagline}
        </h1>
        <p className="text-base sm:text-lg text-academic-600 dark:text-academic-400 max-w-3xl leading-relaxed">
          {language === 'tr'
            ? 'Ezbere dayalı soru çözümü yerine; ilk ilkelerden inşa eden mini dersler, titiz matematiksel ispatlar ve derin algoritmik akıl yürütme.'
            : 'Move beyond formula memorization: construct understanding from first principles through interactive mini-lessons, rigorous proofs, and algorithmic thinking.'}
        </p>
      </div>

      {/* Prominent Daily Challenge Banner */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-slate-900/40 to-slate-900 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-amber-500/20 text-amber-500">
                <Calendar className="w-5 h-5" />
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-amber-500 font-bold">
                {t.problem.dailyTitle} • 15-30 {t.problem.minutes}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
              <Flame className="w-3.5 h-3.5" />
              <span>Streak Protection</span>
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
              {featuredDaily ? featuredDaily.title : t.problem.dailyTitle}
            </h2>
            <p className="text-sm text-slate-300 mt-1 line-clamp-2">
              {featuredDaily ? featuredDaily.prompt.slice(0, 150) + '...' : t.problem.dailySubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href={featuredDaily ? `/problem/${featuredDaily.slug}` : '/daily'}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-amber-500/20 hover:scale-[1.02]"
            >
              <span>{t.problem.startDaily}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/daily"
              className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm border border-white/10 transition-colors"
            >
              {language === 'tr' ? 'Tüm Günlük Seti Gör (3 Problem)' : 'View All 3 Daily Problems'}
            </Link>
          </div>
        </div>
      </div>

      {/* 3 Core Learning Modes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-academic-900 dark:text-academic-100">
            {language === 'tr' ? 'Üç Temel Öğrenme Modu' : 'Three Core Learning Modes'}
          </h2>
          <span className="text-xs font-mono text-academic-400">
            {language === 'tr' ? 'Pedagojik Çerçeve' : 'Pedagogical Framework'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Mode 1: Learn Mode */}
          <Link
            href="/learn"
            className="group relative rounded-xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/50 p-6 hover:border-amber-500/50 transition-all hover:shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="inline-block px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {t.modes.learn.badge}
              </div>
              <h3 className="font-serif font-bold text-lg text-academic-900 dark:text-academic-50 group-hover:text-amber-500 transition-colors">
                {t.modes.learn.title}
              </h3>
              <p className="text-xs text-academic-500 dark:text-academic-400 leading-relaxed">
                {t.modes.learn.desc}
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>{t.modes.learn.button}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Mode 2: Practice Mode */}
          <Link
            href="/practice"
            className="group relative rounded-xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/50 p-6 hover:border-amber-500/50 transition-all hover:shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                <Swords className="w-5 h-5" />
              </div>
              <div className="inline-block px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                {t.modes.practice.badge}
              </div>
              <h3 className="font-serif font-bold text-lg text-academic-900 dark:text-academic-50 group-hover:text-amber-500 transition-colors">
                {t.modes.practice.title}
              </h3>
              <p className="text-xs text-academic-500 dark:text-academic-400 leading-relaxed">
                {t.modes.practice.desc}
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
              <span>{t.modes.practice.button}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Mode 3: Mastery Mode */}
          <Link
            href="/mastery"
            className="group relative rounded-xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/50 p-6 hover:border-amber-500/50 transition-all hover:shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
                <Target className="w-5 h-5" />
              </div>
              <div className="inline-block px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                {t.modes.mastery.badge}
              </div>
              <h3 className="font-serif font-bold text-lg text-academic-900 dark:text-academic-50 group-hover:text-amber-500 transition-colors">
                {t.modes.mastery.title}
              </h3>
              <p className="text-xs text-academic-500 dark:text-academic-400 leading-relaxed">
                {t.modes.mastery.desc}
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
              <span>{t.modes.mastery.button}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </div>

      {/* Prerequisite Alert Scaffolding Box */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-3">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-serif font-bold">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>{t.prerequisite.alertTitle}</span>
        </div>
        <p className="text-xs text-academic-600 dark:text-academic-300 leading-relaxed">
          {language === 'tr'
            ? 'Örnek Teşhis: "Özdeğerler ve Özvektörler" konusunda hata yapıyorsanız, sistem temel zayıflığın "Matris Çarpımı" önkoşulunda olduğunu tespit eder ve sizi kısa bir tazeleyici mini derse davet eder.'
            : 'Sample Diagnostic: If you struggle with "Eigenvalues", the system identifies prerequisite weakness in "Matrix Multiplication" and offers a targeted 3-minute refresher.'}
        </p>
        <div className="flex items-center gap-3 pt-1">
          <Link
            href="/learn/matrix-multiplication"
            className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors"
          >
            {t.prerequisite.reviewButton}
          </Link>
          <Link
            href="/problem/power-remainder-modulo-13"
            className="text-xs font-mono text-academic-500 hover:text-academic-900 dark:hover:text-academic-200 transition-colors"
          >
            {t.prerequisite.continueAnyway}
          </Link>
        </div>
      </div>
    </div>
  );
}
