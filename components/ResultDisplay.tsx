
import React from 'react';
import type { SynthesisResult, SynthesisStep, Product } from '../types';
import { ArrowDownIcon, BeakerIcon, LightBulbIcon } from './Icon';
import { translations } from '../utils/translations';

interface ResultDisplayProps {
  result: SynthesisResult | null;
  language: 'en' | 'si';
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, language }) => {
  const t = translations[language];

  if (!result) {
    return (
        <div className="text-center p-6 sm:p-12 bg-gradient-to-br from-gray-50 to-primary-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl sm:rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-600 animate-fadeIn">
            <BeakerIcon className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 dark:text-gray-500 mb-3 sm:mb-4 animate-float" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">{t.noPathwayGenerated}</h3>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">{t.noPathwayPrompt}</p>
        </div>
    );
  }

  return (
    <div className="space-y-mobile space-y-4 sm:space-y-8 animate-fadeInUp">
      {/* Summary Section */}
      <div className="card p-4 sm:p-8 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200 dark:border-primary-800">
        <h3 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-6 flex items-center gap-2 sm:gap-3">
          <LightBulbIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary-500 animate-pulse"/>
          {t.summaryTitle}
        </h3>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-3 sm:p-6 rounded-xl sm:rounded-2xl border border-primary-100 dark:border-primary-900">
          <p className="text-sm sm:text-lg text-gray-700 dark:text-gray-300 italic leading-relaxed">
            "{result.summary}"
          </p>
        </div>
      </div>
      
      {/* Pathway Section */}
      <div className="card p-4 sm:p-8">
        <h3 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-8 flex items-center gap-2 sm:gap-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm sm:text-base">🧪</span>
          </div>
          {t.pathwayTitle}
        </h3>
        
        <div className="flow-root">
          <ul className="space-y-4 sm:space-y-8">
            {result.pathway.map((step: SynthesisStep, stepIdx: number) => (
              <li key={step.step} className="relative animate-slideInRight" style={{animationDelay: `${stepIdx * 0.1}s`}}>
                <div className="relative">
                  {/* Connection Line */}
                  {stepIdx !== result.pathway.length - 1 && (
                    <span className="absolute top-8 sm:top-12 left-3 sm:left-5 w-0.5 h-12 sm:h-16 step-line" aria-hidden="true"></span>
                  )}
                  
                  <div className="relative flex items-start space-x-3 sm:space-x-6">
                    {/* Step Number */}
                    <div className="step-mobile step-indicator text-xs sm:text-base">
                      {step.step}
                    </div>
                    
                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <div className="card p-3 sm:p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700">
                        <h4 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
                          {step.reaction}
                        </h4>
                        
                        <div className="mb-3 sm:mb-6 p-2 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg sm:rounded-xl">
                          <h5 className="font-bold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2 text-xs sm:text-base">
                            🧪 {t.reagentsAndConditions}
                          </h5>
                          <p className="text-gray-600 dark:text-gray-400 font-mono text-xs sm:text-sm">
                            {step.reagentsAndConditions}
                          </p>
                        </div>
                        
                        {/* Products */}
                        <div className="space-y-2 sm:space-y-4">
                          <div className="flex items-center gap-1 sm:gap-2 text-gray-700 dark:text-gray-300">
                            <ArrowDownIcon className="h-3 w-3 sm:h-5 sm:w-5 text-primary-500"/>
                            <strong className="text-sm sm:text-lg">
                              {step.intermediateProducts.length > 1 ? t.products : t.product}
                            </strong>
                          </div>
                          
                          <div className="grid-mobile grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
                            {step.intermediateProducts?.map((product: Product, pIdx: number) => (
                              <div key={pIdx} className="space-y-2 sm:space-y-3">
                                <h6 className="text-center font-bold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 py-1 sm:py-2 px-2 sm:px-4 rounded-lg text-xs sm:text-base">
                                  {product.name}
                                </h6>
                                {product.SVG && (
                                  <div className="chemistry-canvas chemistry-canvas-mobile bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex justify-center items-center min-h-[120px] sm:min-h-[200px] p-2 sm:p-4">
                                    <div
                                      className="w-full max-w-full dark:invert [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-h-32 sm:[&>svg]:max-h-48"
                                      dangerouslySetInnerHTML={{ __html: product.SVG }}
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
