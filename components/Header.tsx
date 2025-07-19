import React from 'react';
import { FlaskIcon } from './Icon';
import { translations } from '../utils/translations';

interface HeaderProps {
    language: 'en' | 'si';
    toggleLanguage: () => void;
}

export const Header: React.FC<HeaderProps> = ({ language, toggleLanguage }) => {
  const t = translations[language];

  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-brand-primary">
              <FlaskIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t.headerTitle}</h1>
            </div>
          </div>
          <div className="flex items-center">
             <button
              onClick={toggleLanguage}
              type="button"
              className="relative inline-flex items-center justify-center w-12 h-8 text-sm font-semibold text-white bg-brand-secondary rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white transition-colors hover:bg-brand-primary"
              aria-label="Toggle language"
            >
              <span className="text-base">{t.languageToggle}</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};