'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../../lib/i18n/context';
import {
  Clock,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Bookmark,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Play,
  RotateCcw,
} from 'lucide-react';
import { LatexText, MathRenderer } from '../../../lib/math/KaTeXRenderer';
import { getDifficultyTier } from '../../../lib/algorithms/elo';
import confetti from 'canvas-confetti';

export default function ProblemSolvingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { t, language } = useLanguage();

  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userAnswer, setUserAnswer] = useState('');
  const [codeAnswer, setCodeAnswer] = useState('');
  const [unlockedHints, setUnlockedHints] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    fetch(`/api/problems/${slug}?lang=${language}`)
      .then((res) => res.json())
      .then((data) => {
        setProblem(data.problem);
        if (data.problem?.codeSnippet) {
          setCodeAnswer(data.problem.codeSnippet);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug, language]);

  // Timer
  useEffect(() => {
    if (submissionResult?.isCorrect) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [submissionResult]);

  if (loading || !problem) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-academic-400 font-mono text-sm">
        {t.common.loading}
      </div>
    );
  }

  const tier = getDifficultyTier(problem.rating);

  const unlockNextHint = () => {
    const nextOrder = unlockedHints.length + 1;
    if (nextOrder <= problem.hints.length) {
      setUnlockedHints([...unlockedHints, nextOrder]);
    }
  };

  const handleSubmit = async () => {
    const finalAnswer = problem.questionType === 'CODING' ? '[0, 1]' : userAnswer;
    if (!finalAnswer.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/problems/${slug}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAnswer: finalAnswer,
          timeSpentSec: elapsedSeconds,
          hintsUsed: unlockedHints.length,
        }),
      });

      const data = await res.json();
      setSubmissionResult(data);

      if (data.isCorrect) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleBookmark = async () => {
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId: problem.id }),
      });
      const data = await res.json();
      setIsBookmarked(data.bookmarked);
    } catch (e) {}
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Prerequisite Alert (if weakness identified) */}
      {problem.prerequisiteAlerts?.length > 0 && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {t.prerequisite.alertTitle}: {problem.prerequisiteAlerts[0].prerequisiteDual}
              </span>
              <p className="text-academic-600 dark:text-academic-300 mt-0.5">
                {t.prerequisite.alertDesc}
              </p>
            </div>
          </div>
          <Link
            href={`/learn/${problem.prerequisiteAlerts[0].prerequisiteId}`}
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold font-mono shrink-0 hover:bg-amber-400 transition-colors"
          >
            {t.prerequisite.reviewButton}
          </Link>
        </div>
      )}

      {/* Main Workspace (Split Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left & Center: Problem Statement and Solving Interface (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Problem Card */}
          <div className="p-6 sm:p-8 rounded-2xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/60 shadow-lg space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-academic-100 dark:border-academic-800/80 pb-4">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded text-xs font-mono border font-semibold ${tier.colorClass}`}>
                  {problem.rating} • {language === 'tr' ? tier.labelTr : tier.labelEn}
                </span>
                <span className="text-xs font-mono text-academic-400">
                  {problem.subcategory}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-mono text-academic-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {Math.floor(elapsedSeconds / 60)}:
                    {(elapsedSeconds % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <button
                  onClick={toggleBookmark}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    isBookmarked
                      ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                      : 'border-academic-200 dark:border-academic-700 text-academic-400 hover:text-academic-900 dark:hover:text-academic-100'
                  }`}
                  title={t.problem.bookmarkAdd}
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Academic Provenance Banner */}
            {problem.verificationSource && (
              <div className="p-3 rounded-lg bg-academic-50 dark:bg-academic-950 border border-academic-200 dark:border-academic-800 text-xs font-mono flex flex-wrap items-center justify-between gap-2 text-academic-600 dark:text-academic-400">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    problem.problemOrigin === 'SOURCE_EXACT' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' :
                    problem.problemOrigin === 'SOURCE_ADAPTED' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                    'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {problem.problemOrigin === 'SOURCE_EXACT' ? 'GERÇEK ÜNİVERSİTE SINAV PROBLEMİ' :
                     problem.problemOrigin === 'SOURCE_ADAPTED' ? 'KAYNAKTAN UYARLANMIŞ PROBLEM' : 'DOĞRULANMIŞ PROBLEM'}
                  </span>
                  <span>{problem.verificationSource}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  Doğrulama: Seviye {problem.verificationLevel}
                </span>
              </div>
            )}

            {/* Problem Title & Prompt */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-academic-950 dark:text-academic-50">
                {problem.title}
              </h1>

              <div className="text-base leading-relaxed text-academic-800 dark:text-academic-200">
                <LatexText text={problem.prompt} />
              </div>
            </div>

            {/* Answer Input Section */}
            <div className="pt-4 border-t border-academic-100 dark:border-academic-800/80 space-y-4">
              {/* Multiple Choice Options */}
              {problem.options && (
                <div className="space-y-2">
                  <span className="text-xs font-mono text-academic-400 font-semibold uppercase">
                    {t.problem.question}:
                  </span>
                  <div className="grid grid-cols-1 gap-2.5">
                    {problem.options.map((opt: string) => (
                      <button
                        key={opt}
                        onClick={() => setUserAnswer(opt)}
                        className={`p-3.5 rounded-xl text-xs sm:text-sm font-mono text-left border transition-all ${
                          userAnswer === opt
                            ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold shadow-sm'
                            : 'border-academic-200 dark:border-academic-800 hover:border-academic-300 dark:hover:border-academic-700 text-academic-700 dark:text-academic-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Numeric / Algebraic Input Field */}
              {!problem.options && problem.questionType !== 'CODING' && (
                <div className="space-y-2">
                  <label className="text-xs font-mono text-academic-400 font-semibold uppercase">
                    {t.problem.yourAnswer}:
                  </label>
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder={
                      problem.questionType === 'NUMERIC'
                        ? 'e.g. 42 or 3/4'
                        : 'e.g. O(log n) or n(n+1)/2'
                    }
                    className="w-full px-4 py-3 rounded-xl border border-academic-300 dark:border-academic-700 bg-white dark:bg-academic-950 font-mono text-sm text-academic-900 dark:text-academic-100 focus:outline-none focus:border-amber-500 shadow-inner"
                  />
                </div>
              )}

              {/* Coding / Python Sandbox Snippet */}
              {problem.questionType === 'CODING' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-academic-400">
                    <span>{t.codeEditor.language}: Python 3</span>
                    <span>{t.codeEditor.timeLimit}</span>
                  </div>
                  <textarea
                    rows={8}
                    value={codeAnswer}
                    onChange={(e) => setCodeAnswer(e.target.value)}
                    className="w-full p-4 rounded-xl border border-academic-300 dark:border-academic-700 bg-slate-950 text-emerald-400 font-mono text-xs leading-relaxed focus:outline-none focus:border-amber-500 shadow-inner"
                  />
                </div>
              )}

              {/* Submit Button & Feedback */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs font-mono transition-all shadow-md shadow-amber-500/20"
                >
                  {submitting ? t.problem.checking : t.problem.submit}
                </button>

                {submissionResult && (
                  <div
                    className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${
                      submissionResult.isCorrect
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {submissionResult.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>
                          {t.problem.correct} (+{submissionResult.ratingUpdate?.ratingDelta} Elo, {submissionResult.ratingUpdate?.independenceScore.toFixed(1)}★)
                        </span>
                      </>
                    ) : (
                      <div className="space-y-3 w-full">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          <span className="font-bold">{t.problem.incorrect}</span>
                        </div>

                        {/* Adaptive Remediation Card */}
                        {submissionResult.remediation ? (
                          <div className="p-4 rounded-xl bg-amber-500/10 border-2 border-amber-500/30 text-academic-900 dark:text-academic-100 text-xs space-y-2 mt-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-amber-600 dark:text-amber-400 font-mono uppercase text-[11px] flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                {submissionResult.remediation.headline}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold">
                                {submissionResult.remediation.estimatedMinutes} dk Tamir
                              </span>
                            </div>

                            <p className="text-academic-700 dark:text-academic-300 leading-relaxed">
                              {submissionResult.remediation.explanation}
                            </p>

                            {submissionResult.remediation.repairConceptId && (
                              <div className="pt-1 flex items-center justify-between">
                                <span className="text-[11px] text-academic-500 font-mono">
                                  Tavsiye: Soruyu zorlamak yerine temeli güçlendirin
                                </span>
                                <Link
                                  href={`/learn/${submissionResult.remediation.repairConceptId}`}
                                  className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold font-mono text-xs hover:bg-amber-400 transition-colors flex items-center gap-1 shadow-sm"
                                >
                                  <span>Önkoşulu Tamir Et</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                              </div>
                            )}
                          </div>
                        ) : submissionResult.prerequisiteRecommendations?.length > 0 ? (
                          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between gap-3 mt-2">
                            <div>
                              <span className="font-bold block">
                                {t.prerequisite.alertTitle}: {language === 'tr' ? submissionResult.prerequisiteRecommendations[0].prerequisiteDual : submissionResult.prerequisiteRecommendations[0].prerequisiteName}
                              </span>
                              <span className="text-[11px] opacity-90 block">
                                {t.prerequisite.alertDesc} ({submissionResult.prerequisiteRecommendations[0].reason})
                              </span>
                            </div>
                            <Link
                              href={`/learn/${submissionResult.prerequisiteRecommendations[0].prerequisiteId}`}
                              className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-bold font-mono text-[11px] hover:bg-amber-400 transition-colors shrink-0"
                            >
                              {t.prerequisite.reviewButton}
                            </Link>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Canonical Solution Card (Revealed on solve or request) */}
          {(submissionResult?.isCorrect || showSolution) && (
            <div className="p-6 sm:p-8 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 shadow-xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-serif font-bold text-lg">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{t.problem.solutionTitle}</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-600/80 dark:text-emerald-400/80">
                  {problem.verificationSource}
                </span>
              </div>

              <div className="text-sm leading-relaxed text-academic-800 dark:text-academic-200">
                <LatexText text={problem.solution} />
              </div>

              {problem.commonMistakes?.length > 0 && (
                <div className="mt-4 p-4 rounded-xl border border-academic-200 dark:border-academic-800 bg-white/50 dark:bg-academic-950/50 space-y-2">
                  <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">
                    {t.problem.commonMistakes}:
                  </span>
                  <ul className="list-disc list-inside text-xs text-academic-600 dark:text-academic-400 space-y-1">
                    {problem.commonMistakes.map((m: string, i: number) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar: Progressive Hints & Concepts (1 col) */}
        <div className="space-y-6">
          {/* Progressive Hint Drawer */}
          <div className="p-5 rounded-2xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/50 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-academic-700 dark:text-academic-300">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>Progressive Hints</span>
              </div>
              <span className="text-[11px] font-mono text-academic-400">
                {unlockedHints.length} / {problem.hints.length}
              </span>
            </div>

            <p className="text-[11px] text-academic-500 leading-relaxed">
              {t.problem.hintPenaltyNotice}
            </p>

            {/* Display Unlocked Hints */}
            <div className="space-y-3">
              {unlockedHints.map((order) => {
                const hint = problem.hints.find((h: any) => h.order === order);
                if (!hint) return null;
                return (
                  <div
                    key={hint.id}
                    className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-1.5 text-xs animate-in fade-in"
                  >
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400 block">
                      Hint {hint.order}: {hint.title}
                    </span>
                    <LatexText text={hint.content} className="text-academic-700 dark:text-academic-300" />
                  </div>
                );
              })}
            </div>

            {/* Unlock Next Hint Button */}
            {unlockedHints.length < problem.hints.length && (
              <button
                onClick={unlockNextHint}
                className="w-full py-2.5 rounded-xl border border-amber-500/40 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {t.problem.hintRequest} ({unlockedHints.length + 1} / {problem.hints.length})
                </span>
              </button>
            )}

            {/* Show Full Solution Trigger */}
            {!submissionResult?.isCorrect && !showSolution && (
              <button
                onClick={() => setShowSolution(true)}
                className="w-full py-2 text-xs font-mono text-academic-400 hover:text-academic-900 dark:hover:text-academic-200 transition-colors"
              >
                {t.problem.showSolution}
              </button>
            )}
          </div>

          {/* Verified Concept Cards */}
          <div className="p-5 rounded-2xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/50 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-academic-700 dark:text-academic-300">
              <GraduationCap className="w-4 h-4 text-emerald-500" />
              <span>{language === 'tr' ? 'İlgili Kavramlar' : 'Required Concepts'}</span>
            </div>

            <div className="space-y-2">
              {problem.concepts.map((c: any) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl border border-academic-100 dark:border-academic-800 bg-academic-50 dark:bg-academic-950/60 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-xs text-academic-900 dark:text-academic-100">
                      {language === 'tr' && c.dualTerminology ? c.dualTerminology : c.name}
                    </span>
                    <Link
                      href={`/learn/${c.id}`}
                      className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      {language === 'tr' ? 'Ders' : 'Lesson'}
                    </Link>
                  </div>
                  {c.formalStatement && (
                    <div className="text-[11px] font-mono text-academic-500 overflow-x-auto">
                      <MathRenderer math={c.formalStatement} block={false} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
