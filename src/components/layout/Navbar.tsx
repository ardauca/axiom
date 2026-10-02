'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../lib/i18n/context';
import { Moon, Sun, Flame, Sparkles, Star, ShieldCheck } from 'lucide-react';
import { getDifficultyTier } from '../../lib/algorithms/elo';

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [isDark, setIsDark] = useState<boolean>(true);
  const [userStats, setUserStats] = useState({
    rating: 1400,
    independenceScore: 4.8,
    streakDays: 4,
    xp: 350,
  });

  useEffect(() => {
    // Check dark mode
    const isDarkMode = document.documentElement.classList.contains('dark') ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Load user stats from API or localStorage
    fetch('/api/user/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUserStats({
            rating: data.user.rating,
            independenceScore: data.user.independenceScore,
            streakDays: data.user.streakDays,
            xp: data.user.xp,
          });
        }
      })
      .catch(() => {});
  }, []);

  const toggleDarkMode = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const tier = getDifficultyTier(userStats.rating);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-academic-200 dark:border-academic-800 bg-white/80 dark:bg-academic-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-serif text-lg font-bold text-amber-500 shadow-sm group-hover:scale-105 transition-transform">
            Α
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg text-academic-950 dark:text-academic-50 tracking-tight">
                Axiom
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-academic-100 dark:bg-academic-800 text-academic-600 dark:text-academic-400 font-medium">
                {language === 'tr' ? 'Üniversite Öğretmeni' : 'University Tutor'}
              </span>
            </div>
            <p className="text-[11px] text-academic-500 dark:text-academic-400 hidden md:block">
              {language === 'tr' ? 'ESOGÜ Müfredat Destekli Kişisel Eğitim' : 'Curriculum-Aligned Personal Learning'}
            </p>
          </div>
        </Link>

        {/* User Status & Controls */}
        <div className="flex items-center gap-3">
          {/* Active Course Indicator */}
          <Link
            href="/courses/analiz-3"
            className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-mono bg-academic-100/70 dark:bg-academic-900/60 text-academic-700 dark:text-academic-300 border border-academic-200 dark:border-academic-800 hover:border-academic-300 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold">MAT201 Analiz III</span>
          </Link>

          {/* Understated Streak & Review Indicator */}
          <div className="flex items-center gap-2 text-xs font-mono text-academic-500">
            {userStats.streakDays > 0 && (
              <span className="hidden md:inline px-2 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 font-medium">
                {userStats.streakDays} {language === 'tr' ? 'gün aktif' : 'days active'}
              </span>
            )}
          </div>

          <div className="h-4 w-[1px] bg-academic-200 dark:border-academic-800 mx-1" />

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
            className="px-2 py-1 text-xs font-mono font-medium rounded-md border border-academic-200 dark:border-academic-800 hover:bg-academic-100 dark:hover:bg-academic-900 transition-colors"
            title={language === 'tr' ? 'Switch to English' : "Türkçe'ye Geç"}
          >
            {language === 'tr' ? 'TR' : 'EN'}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-1.5 rounded-md text-academic-500 hover:text-academic-900 dark:hover:text-academic-100 hover:bg-academic-100 dark:hover:bg-academic-900 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
