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
  CheckCircle2
} from 'lucide-react';

interface Course {
  id: string;
  code: string;
  name: string;
  englishName: string | null;
  department: string;
  semester: string;
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

export default function CoursesPage() {
  const { language } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<'CURRENT' | 'ARCHIVE'>('CURRENT');
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

  const currentCourses = courses.filter(c => c.isCurrentSemester);
  const archiveCourses = courses.filter(c => !c.isCurrentSemester);

  const displayedCourses = activeTab === 'CURRENT' ? currentCourses : archiveCourses;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-academic-200 dark:border-academic-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              ESOGÜ MÜFREDATI
            </span>
            <span className="text-xs text-academic-500 font-mono">
              Matematik ve Bilgisayar Bilimleri Bölümü
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-academic-900 dark:text-academic-50 mt-1">
            Ders Kataloğu & Önkoşul Haritası
          </h1>
          <p className="text-academic-600 dark:text-academic-400 text-sm mt-1 max-w-2xl">
            Üniversite kaynakları doğrultusunda yapılandırılmış lisans dersleri. Aktif dönem dersleri ile tüm lisans arşivi ayrı sekmelerde listelenmiştir.
          </p>
        </div>

        {/* Semester Tab Toggle */}
        <div className="flex p-1 bg-academic-100 dark:bg-academic-800/80 rounded-xl text-xs font-mono">
          <button
            onClick={() => setActiveTab('CURRENT')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'CURRENT'
                ? 'bg-amber-500 text-academic-950 shadow-sm'
                : 'text-academic-600 dark:text-academic-400 hover:text-academic-900'
            }`}
          >
            Aktif Dönem (2. Sınıf Güz) [{currentCourses.length}]
          </button>
          <button
            onClick={() => setActiveTab('ARCHIVE')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'ARCHIVE'
                ? 'bg-amber-500 text-academic-950 shadow-sm'
                : 'text-academic-600 dark:text-academic-400 hover:text-academic-900'
            }`}
          >
            Lisans Arşivi (1-3. Sınıf) [{archiveCourses.length}]
          </button>
        </div>
      </div>

      {/* Courses List */}
      <div className="grid gap-6">
        {loading ? (
          <div className="text-center py-12 font-mono text-sm text-academic-500">Dersler yükleniyor...</div>
        ) : displayedCourses.length === 0 ? (
          <div className="text-center py-12 font-mono text-sm text-academic-500">Ders bulunamadı.</div>
        ) : (
          displayedCourses.map(course => (
            <div
              key={course.id}
              className="p-6 rounded-2xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/60 shadow-sm hover:border-academic-300 dark:hover:border-academic-700 transition-all space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-academic-100 dark:border-academic-800/60 pb-3">
                <Link
                  href={`/courses/${course.id}`}
                  className="flex items-center gap-3 group"
                >
                  <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-academic-100 dark:bg-academic-800 text-academic-700 dark:text-academic-300 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                    {course.code}
                  </span>
                  <h2 className="text-xl font-serif font-bold text-academic-900 dark:text-academic-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors flex items-center gap-2">
                    {course.name}
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-amber-500" />
                  </h2>
                  {course.englishName && (
                    <span className="text-xs text-academic-500 hidden md:inline">
                      ({course.englishName})
                    </span>
                  )}
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/courses/${course.id}`}
                    className="px-3 py-1 text-xs font-mono font-bold rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-colors border border-amber-500/20"
                  >
                    Dersi İncele
                  </Link>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                    course.coverageStatus === 'COMPLETE'
                      ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                      : 'bg-orange-500/10 text-orange-600 border border-orange-500/20'
                  }`}>
                    {course.coverageStatus === 'COMPLETE' ? 'KAPSAM: TAM' : 'KAPSAM: HARİCİ REFERANS DESTEKLİ'}
                  </span>
                  <span className="text-xs font-mono text-academic-400 px-2 py-0.5 rounded bg-academic-50 dark:bg-academic-950">
                    {course.semester}
                  </span>
                </div>
              </div>

              {course.description && (
                <p className="text-xs text-academic-600 dark:text-academic-400">
                  {course.description}
                </p>
              )}

              {/* Prerequisites */}
              {course.prerequisites.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="text-academic-400 flex items-center gap-1">
                    <GitBranch className="w-3.5 h-3.5" /> Önkoşullar:
                  </span>
                  {course.prerequisites.map(p => (
                    <span
                      key={p.id}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        p.relationType === 'DIRECT_ACADEMIC'
                          ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                          : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                      }`}
                      title={p.relationType === 'DIRECT_ACADEMIC' ? 'Resmi Bölüm Önkoşulu' : 'Kaynak İçerik Analizinden Türetilmiş Önkoşul (Inferred)'}
                    >
                      {p.prerequisite.name} ({p.relationType === 'DIRECT_ACADEMIC' ? 'Doğrudan' : 'Türetilmiş'})
                    </span>
                  ))}
                </div>
              )}

              {/* Topics & Concepts */}
              <div className="pt-2 space-y-2">
                <div className="text-xs font-mono text-academic-400 uppercase font-semibold">
                  Müfredat Konuları & Doğrulanmış Kavramlar:
                </div>
                <div className="grid md:grid-cols-2 gap-2">
                  {course.topics.map(topic => (
                    <div
                      key={topic.id}
                      className="p-3 rounded-lg border border-academic-200 dark:border-academic-800/80 bg-academic-50/50 dark:bg-academic-950/40 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-semibold text-academic-800 dark:text-academic-200">
                          {topic.title}
                        </div>
                        {topic.concepts.map(tc => {
                          const trName = tc.concept.translations.find(t => t.language === 'tr')?.name || tc.concept.id;
                          return (
                            <Link
                              key={tc.concept.id}
                              href={`/learn?concept=${tc.concept.id}`}
                              className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-600 dark:text-amber-400 hover:underline mt-1 mr-3"
                            >
                              <GraduationCap className="w-3 h-3" />
                              {trName}
                            </Link>
                          );
                        })}
                      </div>

                      <Link
                        href={`/practice?topic=${topic.id}`}
                        className="px-2.5 py-1 text-xs font-mono rounded bg-white dark:bg-academic-800 border border-academic-200 dark:border-academic-700 hover:bg-academic-100 text-academic-700 dark:text-academic-300 font-semibold"
                      >
                        Pratik
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
