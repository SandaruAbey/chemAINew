import React from 'react';
import { translations } from '../utils/translations';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
    language: 'en' | 'si';
    toggleLanguage: () => void;
    onShowAuthModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ language, toggleLanguage, onShowAuthModal }) => {
  const t = translations[language];
  const { user, signOut, synthesisCount } = useAuth();

  const handleSignOut = async () => {
    try {
      console.log('Header: handleSignOut called');
      await signOut();
      console.log('Header: signOut completed successfully');
    } catch (error) {
      console.error('Header: Error signing out:', error);
      // The AuthContext should handle the error display, but we can add fallback
    }
  };

  return (
    <header className="glass sticky top-0 z-50 border-b border-white/20 animate-fadeIn">
      <nav className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20 gap-2">
          {/* Logo and Brand */}
          <div className="flex items-center group cursor-pointer flex-shrink-0">
            <div className="flex-shrink-0 mr-2 sm:mr-3 lg:mr-4">
              
              <img
              src="image/image.png"
              alt="Logo"
              className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 ml-2"
              />
            </div>
            <div className="min-w-0">
              <h1 className="header-title text-sm sm:text-lg lg:text-xl xl:text-2xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-gray-900 dark:from-white dark:via-primary-400 dark:to-white bg-clip-text text-transparent truncate">
                {t.headerTitle}
              </h1>
              <p className="header-subtitle hidden md:block text-xs lg:text-sm text-gray-500 dark:text-gray-400 font-medium truncate">
                AI-Powered Organic Synthesis By @SandaruAbey
              </p>
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
            {/* Synthesis Counter for non-authenticated users */}
            {!user && (
              <div className="hidden xs:block text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {t.remainingSynthesis.replace('{count}', (5 - synthesisCount).toString())}
              </div>
            )}

            {/* Mobile synthesis counter (shorter version) */}
            {!user && (
              <div className="block xs:hidden text-xs text-gray-600 dark:text-gray-400">
               Points {5 - synthesisCount} 
              </div>
            )}

            {/* Authentication Button */}
            {user ? (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="hidden sm:block text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate max-w-32">
                  {user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 text-white rounded hover:scale-105 focus-ring font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ backgroundColor: '#1b1b1bff' }}
                >
                  <span className="hidden sm:inline">Sign Out</span>
                  <span className="sm:hidden">Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onShowAuthModal}
                className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 text-white rounded hover:scale-105 focus-ring font-bold shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"
                style={{ backgroundColor: '#1b1b1bff' }}
              >
                <span className="hidden sm:inline">{t.loginSignup}</span>
                <span className="sm:hidden">Login</span>
              </button>
            )}

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              type="button"
              className="text-xs sm:text-sm lg:text-base px-2 py-1 sm:px-3 sm:py-2 text-white rounded hover:scale-105 focus-ring font-bold shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ backgroundColor: '#f59e0b' }}
              aria-label="Toggle language"
            >
              {t.languageToggle}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};