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
    <footer className="w-full mt-12 py-4">
      <div className="text-center text-sm text-slate-500 dark:text-slate-400">
        <p>{footerText}</p>
      </div>
    </footer>
  );
};