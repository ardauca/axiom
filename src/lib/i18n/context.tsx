'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, TRANSLATIONS } from './translations';
import { ACADEMIC_TERMS, formatTerm } from './terms';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof TRANSLATIONS['tr'];
  term: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('tr');

  useEffect(() => {
    const saved = localStorage.getItem('axiom_lang') as Language;
    if (saved === 'tr' || saved === 'en') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('axiom_lang', lang);
  };

  const t = TRANSLATIONS[language];

  const term = (key: string): string => {
    return formatTerm(key, language);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, term }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
