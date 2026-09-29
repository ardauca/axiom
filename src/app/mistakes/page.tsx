'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../lib/i18n/context';
import { BookX, RotateCcw, CheckCircle2, Clock, Save, ArrowRight } from 'lucide-react';
import { LatexText } from '../../lib/math/KaTeXRenderer';

export default function MistakeNotebookPage() {
  const { t, language } = useLanguage();
  const [mistakes, setMistakes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/mistakes?lang=${language}`)
      .then((res) => res.json())
      .then((data) => {
        setMistakes(data.mistakes || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [language]);

  const updateNotes = async (id: string, notes: string) => {
    setSavingNoteId(id);
    try {
      await fetch('/api/mistakes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, userNotes: notes }),
      });
      setMistakes((prev) =>
        prev.map((m) => (m.id === id ? { ...m, userNotes: notes } : m))
      );
    } catch (e) {
    } finally {
      setSavingNoteId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="border-b border-academic-200 dark:border-academic-800 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-rose-500 uppercase tracking-wider">
          <BookX className="w-4 h-4" />
          <span>{t.nav.mistakes}</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-academic-950 dark:text-academic-50">
          {language === 'tr' ? 'Hata Defteri & Yanılgı Analizi' : 'Mistake Notebook & Reflection'}
        </h1>
        <p className="text-sm text-academic-600 dark:text-academic-400 max-w-2xl leading-relaxed">
          {language === 'tr'
            ? 'Yanlış çözülen her soru buraya kaydedilir. Hatanızın nereden kaynaklandığını not alın, aralıklı tekrarla pekiştirin ve eksiklerinizi kapatın.'
            : 'Every mistake is an educational milestone. Document your reasoning misconceptions, schedule spaced reviews, and re-attempt to solidify mastery.'}
        </p>
      </div>

      {/* Empty State */}
      {mistakes.length === 0 && !loading && (
        <div className="p-12 text-center rounded-2xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/40 space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-serif font-bold text-academic-900 dark:text-academic-100">
            {language === 'tr' ? 'Hata Defteriniz Temiz!' : 'No Mistakes Recorded!'}
          </h3>
          <p className="text-xs text-academic-500 max-w-md mx-auto">
            {language === 'tr'
              ? 'Pratik yaparken hata yaptıkça sorular otomatik olarak buraya eklenecektir.'
              : 'Incorrect attempts will automatically be captured here for structured reflection.'}
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

      {/* Mistake Items */}
      <div className="space-y-5">
        {mistakes.map((m) => (
          <div
            key={m.id}
            className="p-6 rounded-2xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/50 shadow-md space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-academic-100 dark:border-academic-800 pb-3">
              <div>
                <span className="text-xs font-mono text-rose-500 font-bold uppercase">
                  {m.mistakeCount} {language === 'tr' ? 'Kez Yanlış Çözüldü' : 'Mistakes Logged'}
                </span>
                <h2 className="text-xl font-serif font-bold text-academic-900 dark:text-academic-100">
                  {m.title}
                </h2>
              </div>

              <Link
                href={`/problem/${m.slug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-bold transition-colors self-start sm:self-center"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'tr' ? 'Yeniden Dene' : 'Re-attempt'}</span>
              </Link>
            </div>

            {/* Prompt Preview */}
            <div className="text-xs text-academic-700 dark:text-academic-300 leading-relaxed bg-academic-50 dark:bg-academic-950/60 p-3.5 rounded-xl border border-academic-100 dark:border-academic-800">
              <LatexText text={m.prompt} />
            </div>

            {/* User Attempt vs Correct Solution */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-600 dark:text-rose-400">
                <span className="font-bold block text-[10px] uppercase">{language === 'tr' ? 'Sizin Cevabınız:' : 'Your Last Attempt:'}</span>
                <span>{m.lastUserAnswer || 'None'}</span>
              </div>
              <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400">
                <span className="font-bold block text-[10px] uppercase">{language === 'tr' ? 'Kavram / Teorem:' : 'Core Concept:'}</span>
                <span>{m.concepts[0]?.name || 'Mathematical Invariant'}</span>
              </div>
            </div>

            {/* Personal Student Notes Input */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-mono text-academic-500 font-semibold">
                {language === 'tr' ? 'Kişisel Yanılgı Notunuz (Nerede hata yaptınız?):' : 'Reflection Note (Why did you make this error?):'}
              </label>
              <textarea
                rows={2}
                defaultValue={m.userNotes || ''}
                onBlur={(e) => updateNotes(m.id, e.target.value)}
                placeholder={
                  language === 'tr'
                    ? 'Örn: Modüler bölme yaparken modül ile aralarında asal olma şartını unutmuşum...'
                    : 'e.g. Forgot the condition for coprime modulus during division...'
                }
                className="w-full p-3 rounded-xl border border-academic-300 dark:border-academic-700 bg-white dark:bg-academic-950 text-xs text-academic-900 dark:text-academic-100 placeholder-academic-400 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
