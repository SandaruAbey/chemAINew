import React from 'react';
import { translations } from '../utils/translations';

interface LoaderProps {
  isAnalyzing?: boolean;
  language: 'en' | 'si';
}

export const Loader: React.FC<LoaderProps> = ({ isAnalyzing = false, language }) => {
  const t = translations[language];
  const text = isAnalyzing ? t.analyzingImage : t.generatingPathway;

  return (
    <div className="flex flex-col items-center py-12 space-y-6" aria-label="Loading">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin">
          <div className="w-full h-full border-4 border-transparent border-t-primary-600 rounded-full"></div>
        </div>
        
        {/* Inner molecule icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center animate-pulse">
            <span className="text-white text-sm">⚗️</span>
          </div>
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-xl font-semibold text-gray-900 dark:text-white">
          {text}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {isAnalyzing 
            ? "Processing your chemistry diagram..." 
            : "Generating synthesis pathway..."
          }
        </p>
        
        {/* Progress dots */}
        <div className="flex justify-center space-x-1 mt-4">
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );
};