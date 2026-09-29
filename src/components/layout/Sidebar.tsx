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
  const { t } = useLanguage();

  const navItems = [
    { href: '/', label: t.nav.dashboard, icon: LayoutDashboard },
    { href: '/daily', label: t.nav.daily, icon: Calendar, badge: '15m' },
    { href: '/courses', label: (t.nav as any).courses || 'Ders Kataloğu', icon: BookOpen, badge: 'ESOGÜ' },
    { href: '/sources', label: (t.nav as any).sources || 'Akademik Kaynaklar', icon: FolderGit2, highlight: true },
    { href: '/learn', label: t.nav.learn, icon: GraduationCap },
    { href: '/practice', label: t.nav.practice, icon: Swords },
    { href: '/mastery', label: t.nav.mastery, icon: Target },
    { href: '/skills', label: t.nav.skills, icon: Network },
    { href: '/mistakes', label: t.nav.mistakes, icon: BookX },
    { href: '/bookmarks', label: t.nav.bookmarks, icon: Bookmark },
    { href: '/admin', label: t.nav.admin, icon: ShieldCheck },
  ];

  return (
    <aside className="w-64 border-r border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-950 p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-mono uppercase tracking-wider text-academic-400 font-semibold">
          Curriculum & Gym
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold border border-amber-500/20'
                  : 'text-academic-600 dark:text-academic-400 hover:text-academic-900 dark:hover:text-academic-100 hover:bg-academic-100 dark:hover:bg-academic-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-500' : 'text-academic-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
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
