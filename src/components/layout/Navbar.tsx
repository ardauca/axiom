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
          <div className="w-10 h-10 rounded-lg bg-slate-900 dark:bg-amber-500/10 border border-slate-700 dark:border-amber-500/30 flex items-center justify-center font-serif text-xl font-bold text-amber-500 shadow-sm group-hover:scale-105 transition-transform">
            Α
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg text-academic-900 dark:text-academic-50 tracking-tight">
                {t.brand.name}
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-semibold">
                Gymnasium
              </span>
            </div>
            <p className="text-xs text-academic-500 dark:text-academic-400 hidden md:block line-clamp-1">
              {t.brand.subtitle}
            </p>
          </div>
        </Link>

        {/* User Badges & Controls */}
        <div className="flex items-center gap-3">
          {/* Rating Badge */}
          <div className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium border ${tier.colorClass}`}>
            <span className="font-bold">{userStats.rating}</span>
            <span className="opacity-80">({language === 'tr' ? tier.labelTr : tier.labelEn})</span>
          </div>

          {/* Independence Score */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-academic-100 dark:bg-academic-900 text-academic-700 dark:text-academic-300 border border-academic-200 dark:border-academic-800" title={t.stats.independence}>
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="font-semibold">{userStats.independenceScore.toFixed(1)}</span>
            <span className="text-[10px] text-academic-400">/ 5.0</span>
          </div>

          {/* Streak Counter */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20" title={t.stats.streak}>
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
            <span className="font-bold">{userStats.streakDays}</span>
            <span className="hidden sm:inline text-[11px]">{t.stats.days}</span>
          </div>

          {/* XP */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="font-bold">{userStats.xp}</span>
            <span className="text-[11px]">XP</span>
          </div>

          <div className="h-5 w-[1px] bg-academic-200 dark:bg-academic-800 mx-1" />

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
            className="px-2.5 py-1 text-xs font-mono font-semibold rounded-md border border-academic-300 dark:border-academic-700 hover:bg-academic-100 dark:hover:bg-academic-800 transition-colors flex items-center gap-1.5"
            title={language === 'tr' ? 'Switch to English' : "Türkçe'ye Geç"}
          >
            <span>{language === 'tr' ? '🇹🇷 TR' : '🇬🇧 EN'}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md text-academic-600 dark:text-academic-400 hover:bg-academic-100 dark:hover:bg-academic-800 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
