'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import {
  BookOpen,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Clock,
  Play,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Wrench,
  GraduationCap
} from 'lucide-react';

interface CourseItem {
  id: string;
  code: string;
  name: string;
  department: string;
  semester: string;
  isCurrentSemester: boolean;
  progressPercent: number;
  readinessScore: number;
  nextConcept: { id: string; name: string } | null;
  currentTopic: { title: string; unitTitle?: string } | null;
  daysToExam: number | null;
}

interface TodayScheduleItem {
  order: number;
  type: string;
  title: string;
  courseCode: string;
  courseName: string;
  durationMinutes: number;
  targetUrl: string;
}

interface DashboardData {
  user: {
    username: string;
  };
  currentCourse: CourseItem | null;
  courses: CourseItem[];
  todaySchedule: TodayScheduleItem[];
  activePrerequisiteGap: {
    title: string;
    conceptName: string;
    problemSlug: string;
    mistakeId: string;
    remediationAction: string;
  } | null;
  mistakesCount: number;
  dueReviewsCount: number;
}

export default function HomePage() {
  const { language } = useLanguage();
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
        {language === 'tr' ? 'Kişisel üniversite ders programınız yükleniyor...' : 'Loading personal course curriculum...'}
      </div>
    );
  }

  const { user, currentCourse, courses, todaySchedule, activePrerequisiteGap } = data;

  const currentConceptName = currentCourse?.nextConcept?.name || (language === 'tr' ? 'Düzgün Yakınsaklık' : 'Uniform Convergence');
  const currentConceptId = currentCourse?.nextConcept?.id || 'uniform-convergence';
  const currentUnitTitle = currentCourse?.currentTopic?.unitTitle || currentCourse?.currentTopic?.title || (language === 'tr' ? 'Ünite 2 · Fonksiyon Dizileri ve Serileri' : 'Unit 2 · Function Sequences & Series');
  const currentProgress = currentCourse?.progressPercent ?? 72;

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* 1. Header: Calm, Educational, Trustworthy */}
      <div className="space-y-1.5 border-b border-academic-200 dark:border-academic-800 pb-5">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-academic-100 dark:bg-academic-850 text-academic-700 dark:text-academic-300 border border-academic-200 dark:border-academic-700">
          <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
          <span>{language === 'tr' ? 'Kişisel Üniversite Eğitmeni' : 'Personal University Tutor'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-academic-950 dark:text-academic-50 tracking-tight">
          {language === 'tr' ? `İyi çalışmalar, ${user.username}.` : `Good day, ${user.username}.`}
        </h1>
        <p className="text-xs sm:text-sm text-academic-600 dark:text-academic-400">
          {language === 'tr' 
            ? 'Axiom, resmi ESOGÜ müfredatınız boyunca hangi konuyu ne zaman çalışmanız gerektiğine karar verir.' 
            : 'Axiom guides your university course curriculum step by step with zero decision fatigue.'}
        </p>
      </div>

      {/* 2. CONTINUE YOUR COURSE — The Primary Hero */}
      <div className="p-6 sm:p-8 rounded-2xl border-2 border-amber-500/35 bg-white dark:bg-academic-900/60 shadow-lg space-y-5">
        <div className="flex items-center justify-between text-xs font-mono text-academic-500">
          <span className="font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <Play className="w-3.5 h-3.5 fill-current" />
            {language === 'tr' ? 'DERSİNE DEVAM ET' : 'CONTINUE YOUR COURSE'}
          </span>
          <span className="px-2 py-0.5 rounded bg-academic-100 dark:bg-academic-800 text-academic-700 dark:text-academic-300 font-semibold">
            {currentCourse?.code || 'MAT201'} — {currentCourse?.name || 'Analiz III'}
          </span>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-academic-500 font-mono">
            {currentUnitTitle}
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-academic-950 dark:text-academic-50">
            {currentConceptName}
          </h2>
          <p className="text-xs sm:text-sm text-academic-600 dark:text-academic-400 leading-relaxed max-w-2xl">
            {language === 'tr'
              ? 'Ders hocanızın notları ve uluslararası akademik standartlarla sentezlenmiş 8 adımlı pedagojik eğitim hazır. Sezgiyi kurun, tanımı doğrulayın ve deliberate alıştırmaya geçin.'
              : 'Synthesized with verified course notes and international academic sources. Build intuition, verify definition, and proceed to deliberate practice.'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-academic-500">{language === 'tr' ? 'Ders Müfredat İlerlemesi' : 'Course Progress'}</span>
            <span className="font-bold text-academic-900 dark:text-academic-100">%{currentProgress}</span>
          </div>
          <div className="w-full bg-academic-200 dark:bg-academic-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500 shadow-sm shadow-amber-500/50"
              style={{ width: `${currentProgress}%` }}
            />
          </div>
        </div>

        {/* Big Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            href={`/learn/${currentConceptId}`}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 hover:scale-[1.01] transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{language === 'tr' ? 'Derse Devam Et' : 'Continue Lesson'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href={`/courses/${currentCourse?.id || 'analiz-3'}`}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-academic-300 dark:border-academic-700 hover:bg-academic-100 dark:hover:bg-academic-800 text-academic-700 dark:text-academic-300 font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>{language === 'tr' ? 'Ders Yol Haritasını Gör' : 'View Course Roadmap'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 3. DERSLERİM / MY COURSES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-academic-200 dark:border-academic-800 pb-2.5">
          <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-academic-800 dark:text-academic-200 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>{language === 'tr' ? 'DERSLERİM' : 'MY COURSES'}</span>
          </h2>
          <Link
            href="/courses"
            className="text-xs font-mono text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-medium"
          >
            <span>{language === 'tr' ? 'Tüm 30 Zorunlu Dersi Gör' : 'View All 30 Courses'}</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {courses.slice(0, 3).map((c) => (
            <Link
              key={c.id}
              href={`/courses/${c.id}`}
              className="p-4 rounded-xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/50 hover:border-academic-300 dark:hover:border-academic-700 transition-all space-y-3 group block shadow-sm"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold px-2 py-0.5 rounded bg-academic-100 dark:bg-academic-800 text-academic-800 dark:text-academic-200">
                  {c.code}
                </span>
                <span className="text-academic-500 font-semibold">%{c.progressPercent}</span>
              </div>

              <div>
                <h3 className="font-serif font-bold text-base text-academic-900 dark:text-academic-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {c.name}
                </h3>
                <div className="w-full bg-academic-200 dark:bg-academic-800 h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${c.progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="text-[11px] font-mono text-academic-500 pt-1 border-t border-academic-100 dark:border-academic-800/80 truncate">
                <span className="text-academic-400">{language === 'tr' ? 'Sıradaki: ' : 'Current: '}</span>
                <span className="text-academic-800 dark:text-academic-200 font-medium">
                  {c.nextConcept?.name || c.currentTopic?.title || (language === 'tr' ? 'Kavram Girişi' : 'Concept Overview')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. AXIOM'UN BUGÜNKÜ ÇALIŞMA PLANI / AXIOM'S PLAN FOR TODAY */}
      <div className="p-6 rounded-2xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/40 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-academic-100 dark:border-academic-800 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-academic-900 dark:text-academic-100">
              {language === 'tr' ? "AXIOM'UN BUGÜNKÜ ÇALIŞMA PLANI" : "AXIOM'S PLAN FOR TODAY"}
            </h2>
          </div>
          <span className="text-xs font-mono text-academic-500">
            {todaySchedule.reduce((acc, s) => acc + s.durationMinutes, 0)} {language === 'tr' ? 'dakika toplam' : 'min total'}
          </span>
        </div>

        <div className="space-y-3">
          {todaySchedule.map((item) => (
            <div
              key={item.order}
              className="p-3.5 rounded-xl border border-academic-100 dark:border-academic-800/80 bg-academic-50/50 dark:bg-academic-950/40 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  {item.order}
                </span>
                <div>
                  <div className="text-xs sm:text-sm font-medium text-academic-900 dark:text-academic-100">
                    {item.title}
                  </div>
                  <div className="text-[11px] font-mono text-academic-500 flex items-center gap-2">
                    <span className="text-academic-600 dark:text-academic-400 font-semibold">{item.courseCode}</span>
                    <span>•</span>
                    <span>{item.durationMinutes} {language === 'tr' ? 'dk' : 'min'}</span>
                  </div>
                </div>
              </div>

              <Link
                href={item.targetUrl}
                className="px-3.5 py-1.5 rounded-lg border border-academic-300 dark:border-academic-700 hover:bg-academic-100 dark:hover:bg-academic-800 text-academic-700 dark:text-academic-300 font-mono text-xs font-medium transition-colors shrink-0 flex items-center gap-1"
              >
                <span>{language === 'tr' ? 'Başla' : 'Start'}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* 5. DİKKAT / ATTENTION (Önkoşul Boşluğu) */}
      {activePrerequisiteGap && (
        <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-500/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-mono font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>{language === 'tr' ? 'DİKKAT — ÖNKOŞUL BOŞLUĞU TESPİT EDİLDİ' : 'ATTENTION — PREREQUISITE GAP DETECTED'}</span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold">
              {language === 'tr' ? 'Otomatik Teşhis' : 'Auto-Diagnosed'}
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-serif font-bold text-academic-900 dark:text-academic-100">
              {activePrerequisiteGap.conceptName}
            </h3>
            <p className="text-xs sm:text-sm text-academic-700 dark:text-academic-300 leading-relaxed">
              {language === 'tr'
                ? 'Son deliberate practice alıştırmanızda bu temel kavramla ilgili bir önkoşul açığı tespit edildi. İleri konulara geçmeden önce bu boşluğu kapatmanız önerilir.'
                : 'A foundational prerequisite gap was detected in your recent attempt. Repairing this prerequisite ensures smooth progress in higher-level topics.'}
            </p>
          </div>

          <div className="pt-2">
            <Link
              href={`/problem/${activePrerequisiteGap.problemSlug}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold transition-colors shadow-sm"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>{language === 'tr' ? 'Önkoşulu Tamir Et' : 'Repair Prerequisite'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
