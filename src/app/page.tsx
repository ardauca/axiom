'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
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
  BookOpen,
  Clock,
  CheckCircle2,
  Play,
  RotateCcw,
  Layers,
  ChevronRight
} from 'lucide-react';

interface DashboardData {
  user: {
    username: string;
    rating: number;
    independenceScore: number;
    streakDays: number;
  };
  dailyStudyPlan: {
    courseId: string;
    courseCode: string;
    courseName: string;
    topicTitle: string;
    conceptId: string;
    conceptName: string;
    estimatedMinutes: number;
    rationale: string;
  } | null;
  courses: Array<{
    id: string;
    code: string;
    name: string;
    department: string;
    semester: string;
    isCurrentSemester: boolean;
    progressPercent: number;
    readinessScore: number;
    nextConcept: { id: string; name: string } | null;
    currentTopic: { title: string } | null;
    daysToExam: number | null;
  }>;
  mistakesCount: number;
  unresolvedMistakes: Array<{
    id: string;
    problemSlug: string;
    problemTitle: string;
    errorType: string;
    mistakeCount: number;
  }>;
  dueReviewsCount: number;
}

export default function HomePage() {
  const { t, language } = useLanguage();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setData(json);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-academic-500 font-mono text-sm">
        <Sparkles className="w-5 h-5 animate-pulse text-amber-500 mr-2" />
        Kişisel akademik çalışma planı ve dersler yükleniyor...
      </div>
    );
  }

  const { user, dailyStudyPlan, courses, mistakesCount, unresolvedMistakes, dueReviewsCount } = data;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Top Academic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-academic-200 dark:border-academic-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Kişisel Üniversite Eğitmeni & Sınav Hazırlık Sistemi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-academic-950 dark:text-academic-50">
            Hoş geldin, {user.username}
          </h1>
          <p className="text-xs sm:text-sm text-academic-600 dark:text-academic-400">
            Bugün ne öğrenmen gerektiğini Axiom belirler. Sıfır karar yorgunluğu ile dersine odaklan.
          </p>
        </div>

        {/* User Stats Pills */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="p-2.5 rounded-xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/60 flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>{user.streakDays} Gün Seri</span>
          </div>
          <div className="p-2.5 rounded-xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/60 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-500" />
            <span>Rating: {user.rating}</span>
          </div>
        </div>
      </div>

      {/* Hero Section: Zero Decision Fatigue - Today's Study Plan */}
      {dailyStudyPlan ? (
        <div className="relative overflow-hidden rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-academic-900/40 to-academic-950 p-6 sm:p-8 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-amber-500/20 text-amber-500">
                <Sparkles className="w-5 h-5" />
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
                Bugünkü Çalışma Planı • Sıfır Karar Yorgunluğu
              </span>
            </div>
            <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold border border-amber-500/30">
              {dailyStudyPlan.rationale}
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-academic-500">
                <span className="px-2 py-0.5 rounded bg-academic-200 dark:bg-academic-800 text-academic-800 dark:text-academic-200 font-bold">
                  {dailyStudyPlan.courseCode}
                </span>
                <span>{dailyStudyPlan.courseName}</span>
                <span>•</span>
                <span className="text-academic-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {dailyStudyPlan.estimatedMinutes} dk
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-academic-950 dark:text-academic-50">
                {dailyStudyPlan.conceptName}
              </h2>

              <p className="text-sm text-academic-700 dark:text-academic-300 leading-relaxed">
                Müfredat Ünitesi: <strong>{dailyStudyPlan.topicTitle}</strong>. Yerel hoca kaynakları ve uluslararası akademik standartlarla sentezlenmiş 8 adımlı mini ders ile kavramsal temeli inşa edin.
              </p>
            </div>

            <div className="flex flex-col gap-3 justify-center">
              <Link
                href={`/learn/${dailyStudyPlan.conceptId}`}
                className="w-full py-4 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all group"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Derse Başla</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={`/courses/${dailyStudyPlan.courseId}`}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-academic-700 dark:text-academic-300 font-mono text-xs flex items-center justify-center gap-1.5 border border-academic-300 dark:border-academic-700 transition-colors"
              >
                <span>Ders Müfredatını İncele</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {/* Action / Alert Banners: Mistakes & Reviews */}
      <div className="grid sm:grid-cols-2 gap-4">
        {mistakesCount > 0 ? (
          <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-500/20 text-rose-500">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                  {mistakesCount} Hata / Önkoşul Tamiri Bekliyor
                </div>
                <div className="text-[11px] text-academic-500">
                  Sınav öncesi kavramsal yanılgıları kapatın.
                </div>
              </div>
            </div>
            <Link
              href="/mistakes"
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold transition-colors shrink-0"
            >
              Tamir Et
            </Link>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <div className="text-xs font-mono text-emerald-700 dark:text-emerald-400">
              Kavramsal hata bankası temiz! Tüm aktif eksikler giderildi.
            </div>
          </div>
        )}

        {dueReviewsCount > 0 ? (
          <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-500">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {dueReviewsCount} Aralıklı Tekrar (SRS) Bekliyor
                </div>
                <div className="text-[11px] text-academic-500">
                  Uzun vadeli hafızayı korumak için tekrarlayın.
                </div>
              </div>
            </div>
            <Link
              href="/practice"
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-colors shrink-0"
            >
              Tekrar Et
            </Link>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-academic-200 dark:border-academic-800 bg-academic-50/50 dark:bg-academic-900/30 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-academic-400 shrink-0" />
            <div className="text-xs font-mono text-academic-500">
              Bugün için planlanmış aralıklı tekrar bulunmuyor.
            </div>
          </div>
        )}
      </div>

      {/* University Courses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-academic-200 dark:border-academic-800 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-serif font-bold text-academic-900 dark:text-academic-100">
              Üniversite Lisans Derslerim
            </h2>
          </div>
          <Link
            href="/courses"
            className="text-xs font-mono text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Tüm Kataloğu Gör</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <div
              key={course.id}
              className="p-5 rounded-2xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/60 shadow-sm hover:border-academic-300 dark:hover:border-academic-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-academic-100 dark:bg-academic-800 text-academic-700 dark:text-academic-300">
                    {course.code}
                  </span>
                  <span className="text-[11px] font-mono text-academic-400">
                    {course.semester}
                  </span>
                </div>

                <Link
                  href={`/courses/${course.id}`}
                  className="font-serif font-bold text-lg text-academic-900 dark:text-academic-100 hover:text-amber-600 dark:hover:text-amber-400 transition-colors block"
                >
                  {course.name}
                </Link>

                {/* Progress & Exam Readiness */}
                <div className="space-y-2 pt-1 text-xs font-mono">
                  <div className="flex items-center justify-between text-academic-500">
                    <span>Müfredat İlerlemesi</span>
                    <span className="font-bold text-academic-900 dark:text-academic-100">%{course.progressPercent}</span>
                  </div>
                  <div className="w-full bg-academic-200 dark:bg-academic-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${course.progressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-academic-500 pt-1">
                    <span>Sınav Hazırlık İndeksi</span>
                    <span className={`font-bold ${
                      course.readinessScore >= 80 ? 'text-emerald-500' : 'text-amber-500'
                    }`}>
                      %{course.readinessScore}
                    </span>
                  </div>
                </div>

                {course.nextConcept && (
                  <div className="p-2.5 rounded-lg bg-academic-50 dark:bg-academic-950 border border-academic-200 dark:border-academic-800 text-xs font-mono">
                    <span className="text-academic-400 block text-[10px] uppercase">Sıradaki Konu:</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400 truncate block">
                      {course.nextConcept.name}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-academic-100 dark:border-academic-800/60 flex items-center justify-between">
                <Link
                  href={`/courses/${course.id}`}
                  className="text-xs font-mono text-academic-500 hover:text-academic-900 dark:hover:text-academic-200"
                >
                  Ders Detayı
                </Link>
                <Link
                  href={course.nextConcept ? `/learn/${course.nextConcept.id}` : `/courses/${course.id}`}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-mono text-xs font-bold hover:bg-amber-400 transition-colors flex items-center gap-1 shadow-sm"
                >
                  <span>Öğren</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Learning Ecosystem Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
        <Link
          href="/practice"
          className="p-5 rounded-2xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/40 hover:border-academic-300 dark:hover:border-academic-700 transition-all space-y-2 group"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
            <Swords className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-base text-academic-900 dark:text-academic-100 group-hover:text-amber-500 transition-colors">
            Deliberate Practice Gym
          </h3>
          <p className="text-xs text-academic-500 dark:text-academic-400 leading-relaxed">
            Hemen cevaba kaçmadan birinci ilkelerden adım adım problem çözün, ipucu cezalarını ve bağımsızlık skorunuzu takip edin.
          </p>
        </Link>

        <Link
          href="/sources"
          className="p-5 rounded-2xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/40 hover:border-academic-300 dark:hover:border-academic-700 transition-all space-y-2 group"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-base text-academic-900 dark:text-academic-100 group-hover:text-amber-500 transition-colors">
            Kaynak Zekâsı & Doğrulama
          </h3>
          <p className="text-xs text-academic-500 dark:text-academic-400 leading-relaxed">
            339 küme üniversite ders notu, sınav arşivi ve MIT/Stanford çapraz doğrulanmış akademik iddiaları inceleyin.
          </p>
        </Link>

        <Link
          href="/mistakes"
          className="p-5 rounded-2xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/40 hover:border-academic-300 dark:hover:border-academic-700 transition-all space-y-2 group"
        >
          <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-base text-academic-900 dark:text-academic-100 group-hover:text-amber-500 transition-colors">
            Hata Teşhis & Önkoşul Tamiri
          </h3>
          <p className="text-xs text-academic-500 dark:text-academic-400 leading-relaxed">
            Hangi tipte hata yaptığınızı (tanım yanılgısı, işlem hatası, yöntem seçimi) otomatik sınıflandırıp önkoşulları tamir edin.
          </p>
        </Link>
      </div>
    </div>
  );
}
