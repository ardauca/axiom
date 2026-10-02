'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../../lib/i18n/context';
import {
  LayoutDashboard,
  Calendar,
  GraduationCap,
  Swords,
  Target,
  Network,
  BookX,
  Bookmark,
  ShieldCheck,
  BookOpen,
  FolderGit2,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { t, language } = useLanguage();

  const primaryNavItems = [
    { href: '/', label: language === 'tr' ? 'Ana Sayfa' : 'Dashboard', icon: LayoutDashboard },
    { href: '/courses', label: language === 'tr' ? 'Derslerim' : 'My Courses', icon: BookOpen, badge: 'ESOGÜ' },
    { href: '/daily', label: language === 'tr' ? 'Bugün' : 'Today', icon: Calendar, badge: 'Plan' },
    { href: '/mastery', label: language === 'tr' ? 'Kavramsal Tekrar' : 'Review & Retention', icon: Target },
  ];

  const secondaryNavItems = [
    { href: '/mistakes', label: language === 'tr' ? 'Önkoşul & Hata Defteri' : 'Remediation Notebook', icon: BookX },
    { href: '/bookmarks', label: language === 'tr' ? 'Kayıtlı Konular' : 'Bookmarks', icon: Bookmark },
  ];

  const advancedNavItems = [
    { href: '/sources', label: language === 'tr' ? 'Akademik Kaynak Arşivi' : 'Sources & Provenance', icon: FolderGit2 },
    { href: '/admin', label: language === 'tr' ? 'Sistem & Doğrulama' : 'Settings & Admin', icon: ShieldCheck },
  ];

  return (
    <aside className="w-64 border-r border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-950 p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* Primary University Loop */}
        <div className="space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-academic-400 font-semibold">
            {language === 'tr' ? 'Öğretmen & Müfredat' : 'Tutor & Curriculum'}
          </div>
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold border border-amber-500/25'
                    : 'text-academic-600 dark:text-academic-400 hover:text-academic-950 dark:hover:text-academic-50 hover:bg-academic-100 dark:hover:bg-academic-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-500' : 'text-academic-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Diagnostic & Supporting Tools */}
        <div className="space-y-1 pt-2 border-t border-academic-100 dark:border-academic-800/80">
          <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-academic-400 font-semibold">
            {language === 'tr' ? 'Teşhis & Notlar' : 'Diagnosis & Saved'}
          </div>
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-academic-100 dark:bg-academic-800 text-academic-950 dark:text-academic-50 font-semibold'
                    : 'text-academic-500 hover:text-academic-900 dark:hover:text-academic-200 hover:bg-academic-50 dark:hover:bg-academic-900/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-academic-400" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Provenance & System */}
        <div className="space-y-1 pt-2 border-t border-academic-100 dark:border-academic-800/80">
          <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-academic-400 font-semibold">
            {language === 'tr' ? 'Kaynak & Sistem' : 'Provenance & System'}
          </div>
          {advancedNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-academic-100 dark:bg-academic-800 text-academic-950 dark:text-academic-50 font-semibold'
                    : 'text-academic-500 hover:text-academic-900 dark:hover:text-academic-200 hover:bg-academic-50 dark:hover:bg-academic-900/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-academic-400" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Epistemic Verification Notice */}
      <div className="p-3 rounded-lg border border-academic-200 dark:border-academic-800 bg-academic-50 dark:bg-academic-900/40 text-xs text-academic-500 space-y-1">
        <div className="flex items-center gap-1.5 text-academic-700 dark:text-academic-300 font-semibold text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Verified Knowledge</span>
        </div>
        <p className="text-[11px] leading-relaxed line-clamp-3">
          Mathematical claims are backed by peer-reviewed university curricula. AI is an explanatory assistant, not the authority.
        </p>
      </div>
    </aside>
  );
}
