import React from 'react';
import { translations } from '../utils/translations';

interface FooterProps {
  language: 'en' | 'si';
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = translations[language];
  const year = new Date().getFullYear();
  const footerText = t.footerText.replace('{year}', year.toString());

  return (
    <footer className="mt-16 py-8 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center space-x-2 text-primary-600 dark:text-primary-400">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <img src ="image/image.png" alt="Logo" className="h-6 w-6" />
            </div>
            <span className="font-bold text-lg">ChemAI</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {footerText}
          </p>
          <div className="flex justify-center space-x-6 text-xs text-gray-400 dark:text-gray-500">
            <span>AI-Powered</span>
            <span>•</span>
            <span>Organic Chemistry</span>
            <span>•</span>
            <span>Research Tool</span>
          </div>
        </div>
      </div>
    </footer>
  );
};