
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
        <div className="text-center p-8 bg-brand-light dark:bg-slate-700/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
            <BeakerIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
            <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-white">{t.noPathwayGenerated}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.noPathwayPrompt}</p>
        </div>
    );
  }

  return (
    <div className="space-y-8 pt-4">
      <div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <LightBulbIcon className="h-6 w-6 text-yellow-400"/>
          {t.summaryTitle}
        </h3>
        <p className="p-4 bg-sky-50 dark:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 italic">
          "{result.summary}"
        </p>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          {t.pathwayTitle}
        </h3>
        <div className="flow-root">
          <ul className="-mb-8">
            {result.pathway.map((step: SynthesisStep, stepIdx: number) => (
              <li key={step.step}>
                <div className="relative pb-8">
                  {stepIdx !== result.pathway.length - 1 ? (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-300 dark:bg-slate-600" aria-hidden="true"></span>
                  ) : null}
                  <div className="relative flex items-start space-x-4">
                    <div>
                      <div className="h-8 w-8 rounded-full bg-brand-primary flex items-center justify-center ring-8 ring-white dark:ring-slate-800">
                        <span className="text-white font-bold">{step.step}</span>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5">
                      <div className="text-lg font-medium text-slate-900 dark:text-white">{step.reaction}</div>
                      <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        <p className="font-semibold">{t.reagentsAndConditions}</p>
                        <p>{step.reagentsAndConditions}</p>
                      </div>
                      <div className="mt-3 space-y-3">
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
                            <ArrowDownIcon className="h-4 w-4 text-slate-400"/>
                            <strong>{step.intermediateProducts.length > 1 ? t.products : t.product}</strong>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {step.intermediateProducts?.map((product: Product, pIdx: number) => (
                                <div key={pIdx} className="space-y-2">
                                    <p className="text-center font-medium text-sm text-slate-700 dark:text-slate-300">{product.name}</p>
                                    {product.SVG && (
                                        <div className="p-4 bg-white rounded-lg border border-slate-200 dark:bg-slate-700 flex justify-center items-center min-h-[160px]">
                                            <div
                                                className="w-full dark:invert [&>svg]:w-full [&>svg]:h-auto"
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
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
