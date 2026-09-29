'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Sparkles,
  Award,
  HelpCircle
} from 'lucide-react';
import { LatexText } from '@/lib/math/KaTeXRenderer';
import confetti from 'canvas-confetti';

interface ExamData {
  course: {
    id: string;
    code: string;
    name: string;
    semester: string;
  };
  exam: {
    title: string;
    totalDurationMinutes: number;
    totalPoints: number;
    problems: Array<{
      index: number;
      id: string;
      slug: string;
      points: number;
      topicTitle: string;
      title: string;
      prompt: string;
      questionType: string;
      options: string[] | null;
      rating: number;
      verificationSource: string;
    }>;
  };
}

export default function ExamSimulationPage({
  params
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const { language } = useLanguage();
  const [data, setData] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [examResult, setExamResult] = useState<any>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(3600);

  useEffect(() => {
    fetch(`/api/courses/${courseId}/exam`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setData(json);
          setSecondsRemaining((json.exam.totalDurationMinutes || 60) * 60);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [courseId]);

  // Countdown timer
  useEffect(() => {
    if (examResult || loading) return;
    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [examResult, loading]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-academic-500 font-mono text-sm">
        <Sparkles className="w-5 h-5 animate-pulse text-amber-500 mr-2" />
        Sınav kağıdı ve arşiv soruları derleniyor...
      </div>
    );
  }

  const { course, exam } = data;

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleOptionSelect = (problemId: string, option: string) => {
    if (examResult) return;
    setAnswers(prev => ({ ...prev, [problemId]: option }));
  };

  const handleInputChange = (problemId: string, val: string) => {
    if (examResult) return;
    setAnswers(prev => ({ ...prev, [problemId]: val }));
  };

  const handleSubmitExam = async () => {
    if (submitting || examResult) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/exam`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          timeSpentSec: (exam.totalDurationMinutes * 60) - secondsRemaining
        })
      });
      const resJson = await res.json();
      if (resJson.success) {
        setExamResult(resJson);
        if (resJson.passed) {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 }
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 pb-24">
      {/* Exam Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-academic-200 dark:border-academic-800 pb-5">
        <div>
          <Link
            href={`/courses/${course.id}`}
            className="text-xs font-mono text-academic-500 hover:text-academic-900 dark:hover:text-academic-200 flex items-center gap-1.5 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{course.code} Ders Sayfasına Dön</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-academic-950 dark:text-academic-50">
            {exam.title}
          </h1>
          <p className="text-xs font-mono text-academic-500 mt-1">
            ESOGÜ Matematik ve Bilgisayar Bilimleri • {course.semester}
          </p>
        </div>

        {/* Floating Timer & Points */}
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl border font-mono text-sm flex items-center gap-2 font-bold shadow-sm ${
            secondsRemaining < 300
              ? 'bg-rose-500/10 text-rose-600 border-rose-500/30 animate-pulse'
              : 'bg-white dark:bg-academic-900 border-academic-200 dark:border-academic-800 text-academic-900 dark:text-academic-100'
          }`}>
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Kalan Süre: {formatTimer(secondsRemaining)}</span>
          </div>

          <div className="p-3 rounded-xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900 font-mono text-xs text-academic-600 dark:text-academic-300">
            Toplam: <strong>{exam.totalPoints} Puan</strong>
          </div>
        </div>
      </div>

      {/* Result Card (When exam is finished) */}
      {examResult && (
        <div className={`p-6 sm:p-8 rounded-2xl border-2 shadow-xl space-y-4 animate-in fade-in ${
          examResult.passed
            ? 'bg-emerald-500/5 border-emerald-500/40 text-emerald-950 dark:text-emerald-50'
            : 'bg-rose-500/5 border-rose-500/40 text-rose-950 dark:text-rose-50'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-current/20 pb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${examResult.passed ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider font-bold block opacity-75">
                  Sınav Sonucu
                </span>
                <h2 className="text-2xl font-serif font-bold">
                  {examResult.passed ? 'Tebrikler! Sınavı Geçtiniz' : 'Sınav Barajının Altında Kaldınız'}
                </h2>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-mono font-bold">
                {examResult.totalScore} / {examResult.totalPossible}
              </div>
              <span className="text-xs font-mono opacity-80">
                Baraj: %60 ({examResult.passed ? 'BAŞARILI' : 'BAŞARISIZ'})
              </span>
            </div>
          </div>

          <p className="text-sm opacity-90 leading-relaxed">
            {examResult.passed
              ? 'Tebrikler! Bu dersin temel konularında ve sınav kalibresindeki problemlerinde güçlü bir performans gösterdiniz.'
              : 'Eksik kaldığınız sorular için aşağıda listelenen tanısal çözümleri ve önkoşul tamir derslerini inceleyin.'}
          </p>
        </div>
      )}

      {/* Exam Questions Sheet */}
      <div className="space-y-6">
        {exam.problems.map((prob) => {
          const resultItem = examResult?.results?.find((r: any) => r.problemId === prob.id);
          const userAnswer = answers[prob.id] || '';

          return (
            <div
              key={prob.id}
              className={`p-6 sm:p-8 rounded-2xl border bg-white dark:bg-academic-900/60 shadow-md space-y-5 transition-all ${
                resultItem
                  ? resultItem.isCorrect
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : 'border-rose-500/40 bg-rose-500/5'
                  : 'border-academic-200 dark:border-academic-800'
              }`}
            >
              <div className="flex items-center justify-between border-b border-academic-100 dark:border-academic-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    Soru {prob.index} • [{prob.points} Puan]
                  </span>
                  <span className="text-xs font-mono text-academic-500">
                    {prob.topicTitle}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-academic-400">
                  {prob.verificationSource}
                </div>
              </div>

              {/* Prompt with KaTeX */}
              <div className="text-sm sm:text-base leading-relaxed text-academic-900 dark:text-academic-100">
                <LatexText text={prob.prompt} />
              </div>

              {/* Answer Input or Multiple Choice Options */}
              {prob.options && prob.options.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {prob.options.map((opt: string) => {
                    const isSelected = answers[prob.id] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => handleOptionSelect(prob.id, opt)}
                        disabled={!!examResult}
                        className={`p-3.5 rounded-xl text-xs font-mono text-left border transition-all ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold ring-2 ring-amber-500/20'
                            : 'border-academic-200 dark:border-academic-800 hover:border-academic-400 text-academic-700 dark:text-academic-300'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="pt-2">
                  <input
                    type="text"
                    placeholder="Matematiksel yanıtınızı girin..."
                    value={userAnswer}
                    disabled={!!examResult}
                    onChange={(e) => handleInputChange(prob.id, e.target.value)}
                    className="w-full max-w-md p-3 rounded-xl border border-academic-300 dark:border-academic-700 bg-academic-50/50 dark:bg-academic-950/50 font-mono text-sm text-academic-900 dark:text-academic-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              )}

              {/* Result breakdown per question */}
              {resultItem && (
                <div className="p-4 rounded-xl border space-y-3 pt-4 border-academic-200 dark:border-academic-800 bg-white/70 dark:bg-academic-950/70">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      {resultItem.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">Doğru (+{resultItem.pointsEarned} Puan)</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-500" />
                          <span className="text-rose-600 dark:text-rose-400 font-bold">Yanlış (0 / {resultItem.maxPoints} Puan)</span>
                        </>
                      )}
                    </div>
                    <span className="text-academic-500">
                      Doğru Yanıt: <strong className="font-mono text-academic-900 dark:text-academic-100">{resultItem.correctAnswer}</strong>
                    </span>
                  </div>

                  {/* Remediation card for missed questions */}
                  {!resultItem.isCorrect && resultItem.remediation && (
                    <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs space-y-1.5 text-academic-800 dark:text-academic-200">
                      <div className="flex items-center justify-between font-bold text-amber-600 dark:text-amber-400">
                        <span className="flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {resultItem.remediation.headline}
                        </span>
                        <span>{resultItem.remediation.estimatedMinutes} dk</span>
                      </div>
                      <p className="text-[11px] opacity-90">
                        {resultItem.remediation.explanation}
                      </p>
                      {resultItem.remediation.repairConceptId && (
                        <div className="pt-1">
                          <Link
                            href={`/learn/${resultItem.remediation.repairConceptId}`}
                            className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline"
                          >
                            <span>Önkoşul Dersi: {resultItem.remediation.repairConceptName}</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Official solution */}
                  {resultItem.solution && (
                    <div className="text-xs text-academic-600 dark:text-academic-400 pt-2 border-t border-academic-100 dark:border-academic-800">
                      <strong className="block text-academic-800 dark:text-academic-200 mb-1">Resmi Çözüm Adımları:</strong>
                      <LatexText text={resultItem.solution} />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Final Submission Action */}
      {!examResult && (
        <div className="p-6 rounded-2xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/60 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs font-mono text-academic-500">
            Cevaplanan: <strong>{Object.keys(answers).length} / {exam.problems.length} Soru</strong>
          </div>

          <button
            onClick={handleSubmitExam}
            disabled={submitting}
            className="py-3 px-8 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{submitting ? 'Notlandırılıyor...' : 'Sınavı Bitir ve Notlandır'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
