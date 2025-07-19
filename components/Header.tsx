import React from 'react';
import { TestTubeIcon } from './Icon';
import { translations } from '../utils/translations';

interface HeaderProps {
    language: 'en' | 'si';
    toggleLanguage: () => void;
}

export const Header: React.FC<HeaderProps> = ({ language, toggleLanguage }) => {
  const t = translations[language];

  return (
    <header className="glass sticky top-0 z-50 border-b border-white/20 animate-fadeIn">
      <nav className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo and Brand */}
          <div className="flex items-center group cursor-pointer">
            <div className="flex-shrink-0 mr-2 sm:mr-3 lg:mr-4">
              
              <img
              src="image/image.png"
              alt="Logo"
              className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 ml-2"
              />
            </div>
            <div>
              <h1 className="header-title text-sm sm:text-lg lg:text-xl xl:text-2xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-gray-900 dark:from-white dark:via-primary-400 dark:to-white bg-clip-text text-transparent">
                {t.headerTitle}
              </h1>
              <p className="header-subtitle hidden sm:block text-xs lg:text-sm text-gray-500 dark:text-gray-400 font-medium">
                AI-Powered Organic Synthesis By @SandaruAbey
              </p>
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              type="button"
              className="lang-toggle-mobile btn btn-md bg-gradient-primary hover:scale-105 focus-ring text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 w-8 h-8 sm:w-auto sm:h-auto text-xs sm:text-sm lg:text-base"
              aria-label="Toggle language"
              style={{ backgroundColor: '#f59e0b' }}
            >
              <span className="text-xs sm:text-sm lg:text-base">{t.languageToggle}</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};