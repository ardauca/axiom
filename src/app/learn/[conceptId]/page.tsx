'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../../lib/i18n/context';
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  BookOpen,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { LatexText, MathRenderer } from '../../../lib/math/KaTeXRenderer';

export default function ConceptLessonPage({
  params,
}: {
  params: Promise<{ conceptId: string }>;
}) {
  const { conceptId } = use(params);
  const { t, language } = useLanguage();
  const [concept, setConcept] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedMiniAnswer, setSelectedMiniAnswer] = useState<string | null>(null);
  const [miniCheckSubmitted, setMiniCheckSubmitted] = useState(false);

  useEffect(() => {
    fetch(`/api/concepts/${conceptId}?lang=${language}`)
      .then((res) => res.json())
      .then((data) => {
        setConcept(data.concept);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [conceptId, language]);

  if (loading || !concept) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-academic-400 font-mono text-sm">
        {t.common.loading}
      </div>
    );
  }

  const steps = concept.lessonSteps || [];
  const currentStep = steps[currentStepIndex];
  const isMiniCheck = currentStep?.stepType === 'MINI_CHECK';
  const isCorrect = selectedMiniAnswer === currentStep?.miniCheckAnswer;

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedMiniAnswer(null);
      setMiniCheckSubmitted(false);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setSelectedMiniAnswer(null);
      setMiniCheckSubmitted(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header & Verification Source */}
      <div className="space-y-3 border-b border-academic-200 dark:border-academic-800 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link
            href="/learn"
            className="text-xs font-mono text-academic-500 hover:text-academic-900 dark:hover:text-academic-200 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.common.back}</span>
          </Link>
          <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              Level {concept.verificationLevel}: {concept.sourceAuthor}
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-academic-950 dark:text-academic-50">
          {language === 'tr' && concept.dualTerminology ? concept.dualTerminology : concept.name}
        </h1>

        {/* Academic Source Citation Card */}
        {concept.sourceCitation && (
          <div className="p-3 rounded-lg bg-academic-50 dark:bg-academic-950 border border-academic-200 dark:border-academic-800 text-xs font-mono flex flex-wrap items-center justify-between gap-2 text-academic-600 dark:text-academic-400">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-500 shrink-0" />
              <span><strong>Akademik Kaynak:</strong> {concept.sourceCitation} — {concept.sourceAuthor}</span>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Doğrulama: {concept.verificationStatus} (Seviye {concept.verificationLevel})
            </span>
          </div>
        )}

        {/* Step Progress Indicators */}
        <div className="flex items-center gap-2 pt-2 overflow-x-auto pb-1">
          {steps.map((s: any, idx: number) => (
            <button
              key={s.id}
              onClick={() => {
                setCurrentStepIndex(idx);
                setSelectedMiniAnswer(null);
                setMiniCheckSubmitted(false);
              }}
              className={`h-2 flex-1 rounded-full transition-all ${
                idx === currentStepIndex
                  ? 'bg-amber-500 shadow-sm shadow-amber-500/50'
                  : idx < currentStepIndex
                  ? 'bg-emerald-500'
                  : 'bg-academic-200 dark:bg-academic-800'
              }`}
              title={s.title}
            />
          ))}
        </div>
      </div>

      {/* Main Lesson Step Container */}
      <div className="p-6 sm:p-8 rounded-2xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/60 shadow-lg space-y-6">
        <div className="flex items-center justify-between border-b border-academic-100 dark:border-academic-800/80 pb-4">
          <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-bold">
            Step {currentStepIndex + 1} of {steps.length} • {currentStep?.stepType}
          </span>
          <span className="text-xs font-mono text-academic-400">
            Axiom Academy
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-serif font-bold text-academic-900 dark:text-academic-100">
          {currentStep?.title}
        </h2>

        {/* Step Content */}
        <div className="text-sm sm:text-base leading-relaxed text-academic-800 dark:text-academic-200">
          <LatexText text={currentStep?.content || ''} />
        </div>

        {/* Interactive Mini Check (if stepType === MINI_CHECK) */}
        {isMiniCheck && (
          <div className="mt-6 p-5 rounded-xl border-2 border-dashed border-amber-500/40 bg-amber-500/5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
              <HelpCircle className="w-4 h-4" />
              <span>{t.modes.learn.steps.miniCheck}</span>
            </div>

            <p className="text-sm font-semibold text-academic-900 dark:text-academic-100">
              {currentStep.miniCheckQuestion}
            </p>

            {/* Options */}
            {currentStep.miniCheckOptions && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentStep.miniCheckOptions.map((opt: string) => {
                  const isSelected = selectedMiniAnswer === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => {
                        setSelectedMiniAnswer(opt);
                        setMiniCheckSubmitted(true);
                      }}
                      className={`p-3 rounded-lg text-xs font-mono text-left border transition-all ${
                        isSelected
                          ? isCorrect
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                            : 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                          : 'border-academic-200 dark:border-academic-800 hover:border-academic-400 text-academic-700 dark:text-academic-300'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Feedback Message */}
            {miniCheckSubmitted && (
              <div className={`p-3 rounded-lg text-xs font-mono flex items-center gap-2 ${
                isCorrect
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
              }`}>
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{language === 'tr' ? 'Doğru akıl yürütme! Sonraki adıma geçebilirsiniz.' : 'Correct reasoning! You can proceed to the next step.'}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-500" />
                    <span>{language === 'tr' ? 'Yanıt doğru değil. Açıklamayı tekrar gözden geçirin.' : 'Incorrect. Review the step explanation and try again.'}</span>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-academic-100 dark:border-academic-800">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="px-4 py-2 rounded-lg text-xs font-mono font-medium border border-academic-300 dark:border-academic-700 disabled:opacity-40 hover:bg-academic-100 dark:hover:bg-academic-800 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.common.back}</span>
          </button>

          {currentStepIndex < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-lg text-xs font-mono font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>{t.common.continue}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              href={concept.relatedProblems?.[0] ? `/problem/${concept.relatedProblems[0].slug}` : '/practice'}
              className="px-5 py-2 rounded-lg text-xs font-mono font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>{language === 'tr' ? 'Rehberli Pratiğe Geç' : 'Proceed to Practice'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
