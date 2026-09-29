'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../lib/i18n/context';
import { Swords, Search, Filter, ShieldCheck, ArrowRight, Clock } from 'lucide-react';
import { getDifficultyTier } from '../../lib/algorithms/elo';

export default function PracticeArenaPage() {
  const { t, language } = useLanguage();
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    let url = `/api/problems?lang=${language}`;
    if (selectedCategory !== 'ALL') {
      url += `&category=${selectedCategory}`;
    }
    if (searchQuery.trim()) {
      url += `&search=${encodeURIComponent(searchQuery.trim())}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProblems(data.problems || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [language, selectedCategory, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="border-b border-academic-200 dark:border-academic-800 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-blue-500 uppercase tracking-wider">
          <Swords className="w-4 h-4" />
          <span>{t.modes.practice.title}</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-academic-950 dark:text-academic-50">
          {language === 'tr' ? 'Problem Çözme Jimnazyumu' : 'Problem-Solving Gymnasium'}
        </h1>
        <p className="text-sm text-academic-600 dark:text-academic-400 max-w-2xl leading-relaxed">
          {language === 'tr'
            ? '110+ özgün, aşamalı ve akademik düzeyde problem. Sezgilerinizi zorlayın, derinlemesine düşünün, ipuçlarını bilinçli kullanın.'
            : '110+ original, progressively difficult problems across Mathematics, CS, and their intersection. Sharpen your deliberate practice.'}
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-academic-100 dark:bg-academic-900 border border-academic-200 dark:border-academic-800 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-white dark:bg-academic-800 text-academic-950 dark:text-academic-50 shadow-sm font-bold'
                : 'text-academic-500 hover:text-academic-900 dark:hover:text-academic-200'
            }`}
          >
            {t.common.all}
          </button>
          <button
            onClick={() => setSelectedCategory('MATHEMATICS')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedCategory === 'MATHEMATICS'
                ? 'bg-white dark:bg-academic-800 text-academic-950 dark:text-academic-50 shadow-sm font-bold'
                : 'text-academic-500 hover:text-academic-900 dark:hover:text-academic-200'
            }`}
          >
            {t.categories.MATHEMATICS}
          </button>
          <button
            onClick={() => setSelectedCategory('COMPUTER_SCIENCE')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedCategory === 'COMPUTER_SCIENCE'
                ? 'bg-white dark:bg-academic-800 text-academic-950 dark:text-academic-50 shadow-sm font-bold'
                : 'text-academic-500 hover:text-academic-900 dark:hover:text-academic-200'
            }`}
          >
            {t.categories.COMPUTER_SCIENCE}
          </button>
          <button
            onClick={() => setSelectedCategory('MATH_X_CS')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedCategory === 'MATH_X_CS'
                ? 'bg-white dark:bg-academic-800 text-academic-950 dark:text-academic-50 shadow-sm font-bold'
                : 'text-academic-500 hover:text-academic-900 dark:hover:text-academic-200'
            }`}
          >
            {t.categories.MATH_X_CS}
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-academic-400" />
          <input
            type="text"
            placeholder={t.common.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-academic-300 dark:border-academic-700 bg-white dark:bg-academic-900 text-xs text-academic-900 dark:text-academic-100 placeholder-academic-400 focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>
      </div>

      {/* Problem Count Indicator */}
      <div className="text-xs font-mono text-academic-400">
        {language === 'tr' ? `${problems.length} problem listelendi` : `${problems.length} problems displayed`}
      </div>

      {/* Problem Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {problems.map((p) => {
          const tier = getDifficultyTier(p.rating);

          return (
            <Link
              key={p.id}
              href={`/problem/${p.slug}`}
              className="p-5 rounded-xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/50 hover:border-amber-500/40 transition-all hover:shadow-md flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono border font-medium ${tier.colorClass}`}>
                    {p.rating} • {language === 'tr' ? tier.labelTr : tier.labelEn}
                  </span>
                  <span className="text-[11px] font-mono text-academic-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>~{p.estimatedTime} {t.problem.minutes}</span>
                  </span>
                </div>

                <h2 className="font-serif font-bold text-base text-academic-900 dark:text-academic-100 group-hover:text-amber-500 transition-colors line-clamp-1">
                  {p.title}
                </h2>

                <p className="text-xs text-academic-500 dark:text-academic-400 line-clamp-2 leading-relaxed">
                  {p.prompt.replace(/\$[^$]+\$/g, '[math]')}
                </p>
              </div>

              <div className="pt-2 border-t border-academic-100 dark:border-academic-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-academic-400 text-[11px]">
                  {p.subcategory}
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  <span>{language === 'tr' ? 'Çöz' : 'Solve'}</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
