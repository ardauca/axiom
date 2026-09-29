'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../lib/i18n/context';
import { Bookmark, ArrowRight, Clock } from 'lucide-react';
import { getDifficultyTier } from '../../lib/algorithms/elo';

export default function BookmarksPage() {
  const { t, language } = useLanguage();
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/bookmarks?lang=${language}`)
      .then((res) => res.json())
      .then((data) => {
        setBookmarks(data.bookmarks || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [language]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="border-b border-academic-200 dark:border-academic-800 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-amber-500 uppercase tracking-wider">
          <Bookmark className="w-4 h-4" />
          <span>{t.nav.bookmarks}</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-academic-950 dark:text-academic-50">
          {language === 'tr' ? 'Kaydedilen Problemler' : 'Bookmarked Problems'}
        </h1>
        <p className="text-sm text-academic-600 dark:text-academic-400 max-w-2xl leading-relaxed">
          {language === 'tr'
            ? 'İleride tekrar çözmek veya incelemek üzere kaydettiğiniz problemler.'
            : 'Problems saved for future review or in-depth reflection.'}
        </p>
      </div>

      {/* Bookmarks List */}
      {bookmarks.length === 0 && !loading && (
        <div className="p-12 text-center rounded-2xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/40 space-y-3">
          <Bookmark className="w-10 h-10 text-academic-400 mx-auto" />
          <h3 className="text-lg font-serif font-bold text-academic-900 dark:text-academic-100">
            {language === 'tr' ? 'Henüz Kaydedilmiş Problem Yok' : 'No Bookmarks Yet'}
          </h3>
          <p className="text-xs text-academic-500 max-w-md mx-auto">
            {language === 'tr'
              ? 'Problem çözerken sağ üstteki yer imi butonuna tıklayarak problemleri buraya ekleyebilirsiniz.'
              : 'Click the bookmark icon during problem solving to save problems here.'}
          </p>
          <Link
            href="/practice"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-mono font-bold mt-2"
          >
            <span>{t.stats.practiceNow}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bookmarks.map((b) => {
          const tier = getDifficultyTier(b.rating);
          return (
            <Link
              key={b.id}
              href={`/problem/${b.slug}`}
              className="p-5 rounded-xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/50 hover:border-amber-500/40 transition-all shadow-sm flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono border font-medium ${tier.colorClass}`}>
                    {b.rating} • {language === 'tr' ? tier.labelTr : tier.labelEn}
                  </span>
                  <span className="text-[11px] font-mono text-academic-400">
                    {b.subcategory}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base text-academic-900 dark:text-academic-100 group-hover:text-amber-500 transition-colors">
                  {b.title}
                </h3>
              </div>

              <div className="pt-2 border-t border-academic-100 dark:border-academic-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-academic-400 text-[11px]">
                  {new Date(b.createdAt).toLocaleDateString()}
                </span>
                <span className="text-amber-500 font-semibold flex items-center gap-1">
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
