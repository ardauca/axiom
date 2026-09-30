'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import {
  BookOpen,
  GraduationCap,
  ArrowRight,
  GitBranch,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface Course {
  id: string;
  code: string;
  officialCode?: string | null;
  name: string;
  englishName: string | null;
  department: string;
  semester: string;
  ects?: number;
  theoryHours?: number;
  practiceHours?: number;
  isCurrentSemester: boolean;
  coverageStatus: string;
  description: string | null;
  topics: Array<{
    id: string;
    orderIndex: number;
    title: string;
    englishTitle: string | null;
    description: string | null;
    concepts: Array<{
      concept: {
        id: string;
        translations: Array<{
          language: string;
          name: string;
        }>;
      };
    }>;
  }>;
  prerequisites: Array<{
    id: string;
    relationType: string;
    prerequisite: {
      id: string;
      code: string;
      name: string;
    };
  }>;
}

type FilterTab = 'ALL' | 'YEAR2_CURRENT' | 'YEAR1' | 'YEAR2' | 'YEAR3' | 'YEAR4';

export default function CoursesPage() {
  const { language } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCourses(data.courses);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const displayedCourses = courses.filter(c => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'YEAR2_CURRENT') return c.isCurrentSemester;
    if (activeTab === 'YEAR1') return c.semester.includes('1. Sınıf');
    if (activeTab === 'YEAR2') return c.semester.includes('2. Sınıf');
    if (activeTab === 'YEAR3') return c.semester.includes('3. Sınıf');
    if (activeTab === 'YEAR4') return c.semester.includes('4. Sınıf');
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-academic-200 dark:border-academic-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              ESOGÜ 2024+ RESMİ MÜFREDATI
            </span>
            <span className="text-xs text-academic-500 font-mono">
              Matematik ve Bilgisayar Bilimleri (30 Zorunlu Ders)
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-academic-900 dark:text-academic-50 mt-1">
            Lisans Müfredatı & Akademik Öğretmen Kataloğu
          </h1>
          <p className="text-academic-600 dark:text-academic-400 text-sm mt-1 max-w-2xl">
            1. sınıftan 4. sınıfa kadar tüm zorunlu dersler; bölüm ders notları, uluslararası standart kaynaklar ve sınav arşiviyle birebir eşleştirilmiştir.
          </p>
        </div>

        {/* Semester Tab Toggle */}
        <div className="flex flex-wrap gap-1 p-1 bg-academic-100 dark:bg-academic-800/80 rounded-xl text-xs font-mono">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'ALL'
                ? 'bg-amber-500 text-academic-950 shadow-sm'
                : 'text-academic-600 dark:text-academic-400 hover:text-academic-900'
            }`}
          >
            Tüm Müfredat ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('YEAR2_CURRENT')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'YEAR2_CURRENT'
                ? 'bg-amber-500 text-academic-950 shadow-sm'
                : 'text-academic-600 dark:text-academic-400 hover:text-academic-900'
            }`}
          >
            ★ Aktif Dönem ({courses.filter(c => c.isCurrentSemester).length})
          </button>
          <button
            onClick={() => setActiveTab('YEAR1')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'YEAR1'
                ? 'bg-amber-500 text-academic-950 shadow-sm'
                : 'text-academic-600 dark:text-academic-400 hover:text-academic-900'
            }`}
          >
            1. Sınıf ({courses.filter(c => c.semester.includes('1. Sınıf')).length})
          </button>
          <button
            onClick={() => setActiveTab('YEAR2')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'YEAR2'
                ? 'bg-amber-500 text-academic-950 shadow-sm'
                : 'text-academic-600 dark:text-academic-400 hover:text-academic-900'
            }`}
          >
            2. Sınıf ({courses.filter(c => c.semester.includes('2. Sınıf')).length})
          </button>
          <button
            onClick={() => setActiveTab('YEAR3')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'YEAR3'
                ? 'bg-amber-500 text-academic-950 shadow-sm'
                : 'text-academic-600 dark:text-academic-400 hover:text-academic-900'
            }`}
          >
            3. Sınıf ({courses.filter(c => c.semester.includes('3. Sınıf')).length})
          </button>
          <button
            onClick={() => setActiveTab('YEAR4')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'YEAR4'
                ? 'bg-amber-500 text-academic-950 shadow-sm'
                : 'text-academic-600 dark:text-academic-400 hover:text-academic-900'
            }`}
          >
            4. Sınıf ({courses.filter(c => c.semester.includes('4. Sınıf')).length})
          </button>
        </div>
      </div>

      {/* Courses List */}
      <div className="grid gap-6">
        {loading ? (
          <div className="text-center py-12 font-mono text-sm text-academic-500">Müfredat yükleniyor...</div>
        ) : displayedCourses.length === 0 ? (
          <div className="text-center py-12 font-mono text-sm text-academic-500">Bu filtrede ders bulunamadı.</div>
        ) : (
          displayedCourses.map(course => (
            <div
              key={course.id}
              className="p-6 rounded-2xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/60 shadow-sm hover:border-academic-300 dark:hover:border-academic-700 transition-all space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-academic-100 dark:border-academic-800/60 pb-3">
                <Link
                  href={`/courses/${course.id}`}
                  className="flex flex-wrap items-center gap-2.5 group"
                >
                  <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-academic-100 dark:bg-academic-800 text-academic-700 dark:text-academic-300 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                    {course.code}
                  </span>
                  {course.officialCode && (
                    <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-academic-50 dark:bg-academic-800/50 text-academic-500 border border-academic-200 dark:border-academic-700">
                      ESOGÜ: {course.officialCode}
                    </span>
                  )}
                  <h2 className="text-xl font-serif font-bold text-academic-900 dark:text-academic-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors flex items-center gap-2">
                    {course.name}
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-amber-500" />
                  </h2>
                  {course.englishName && (
                    <span className="text-xs text-academic-500 hidden lg:inline">
                      ({course.englishName})
                    </span>
                  )}
                </Link>

                <div className="flex flex-wrap items-center gap-2">
                  {course.isCurrentSemester && (
                    <span className="px-2 py-0.5 text-xs font-mono font-bold rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" /> Aktif Dönem
                    </span>
                  )}
                  {course.ects && (
                    <span className="px-2 py-0.5 text-xs font-mono font-bold rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      {course.ects} AKTS
                    </span>
                  )}
                  <span className="text-xs font-mono text-academic-500 px-2 py-0.5 rounded bg-academic-100 dark:bg-academic-800">
                    T:{course.theoryHours ?? 3} U:{course.practiceHours ?? 0}
                  </span>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                    course.coverageStatus === 'COMPLETE'
                      ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                      : 'bg-orange-500/10 text-orange-600 border border-orange-500/20'
                  }`}>
                    {course.coverageStatus === 'COMPLETE' ? 'KAPSAM: TAM' : 'KAPSAM: DOĞRULANMIŞ'}
                  </span>
                  <span className="text-xs font-mono text-academic-400 px-2 py-0.5 rounded bg-academic-50 dark:bg-academic-950 border border-academic-200 dark:border-academic-800">
                    {course.semester}
                  </span>
                  <Link
                    href={`/courses/${course.id}`}
                    className="px-3 py-1 text-xs font-mono font-bold rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-colors border border-amber-500/20"
                  >
                    Dersi Aç
                  </Link>
                </div>
              </div>

              {course.description && (
                <p className="text-xs text-academic-600 dark:text-academic-400 leading-relaxed">
                  {course.description}
                </p>
              )}

              {/* Prerequisites */}
              {course.prerequisites.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono pt-1">
                  <span className="text-academic-400 flex items-center gap-1">
                    <GitBranch className="w-3.5 h-3.5" /> Önkoşul Bağıntıları:
                  </span>
                  {course.prerequisites.map(p => (
                    <span
                      key={p.id}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        p.relationType === 'DIRECT_ACADEMIC'
                          ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}
                      title={p.relationType === 'DIRECT_ACADEMIC' ? 'Resmi Müfredat Önkoşulu' : 'Kavramsal İçerik Önkoşulu'}
                    >
                      {p.prerequisite.name} ({p.relationType === 'DIRECT_ACADEMIC' ? 'Müfredat Önkoşulu' : 'Kavramsal'})
                    </span>
                  ))}
                </div>
              )}

              {/* Topics & Concepts */}
              {course.topics.length > 0 && (
                <div className="pt-2 space-y-2">
                  <div className="text-xs font-mono text-academic-400 uppercase font-semibold flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5" />
                    Müfredat Konuları & Doğrulanmış Akademik Kavramlar:
                  </div>
                  <div className="grid md:grid-cols-2 gap-2">
                    {course.topics.map(topic => (
                      <div
                        key={topic.id}
                        className="p-3 rounded-xl border border-academic-200 dark:border-academic-800/80 bg-academic-50/50 dark:bg-academic-950/40 flex items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="text-xs font-semibold text-academic-800 dark:text-academic-200">
                            {topic.title}
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {topic.concepts.map(tc => {
                              const trName = tc.concept.translations.find(t => t.language === 'tr')?.name || tc.concept.id;
                              return (
                                <Link
                                  key={tc.concept.id}
                                  href={`/learn?concept=${tc.concept.id}`}
                                  className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-600 dark:text-amber-400 hover:underline"
                                >
                                  <GraduationCap className="w-3 h-3" />
                                  {trName}
                                </Link>
                              );
                            })}
                          </div>
                        </div>

                        <Link
                          href={`/practice?topic=${topic.id}`}
                          className="px-2.5 py-1 text-xs font-mono rounded-lg bg-white dark:bg-academic-800 border border-academic-200 dark:border-academic-700 hover:bg-academic-100 text-academic-700 dark:text-academic-300 font-semibold transition-colors flex-shrink-0"
                        >
                          Pratik
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
