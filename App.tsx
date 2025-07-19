import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';
import { Footer } from './components/Footer';
import { generateSynthesisPath, analyzeChemistryImage } from './services/geminiService';
import type { SynthesisResult, SynthesisInput } from './types';
import { translations } from './utils/translations';

const App: React.FC = () => {
  const [synthesisResult, setSynthesisResult] = useState<SynthesisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'si'>('en');

  const [synthesisInput, setSynthesisInput] = useState<SynthesisInput>({
    startCompound: 'C6H5CO2CH3',
    targetCompound: 'C6H5C(CH2C6H5)=CHC6H5',
    reagents: 'PCl3, Mg/dry ether, H+/H2O, LiAlH4, conc. H2SO4',
  });
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const t = translations[language];

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => (prev === 'en' ? 'si' : 'en'));
  }, []);

  const handleInputChange = (field: keyof SynthesisInput, value: string) => {
    setSynthesisInput(prev => ({ ...prev, [field]: value }));
  };

  const handleImageAnalysis = async (file: File) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setError(null);
    setSynthesisResult(null);
    try {
      const result = await analyzeChemistryImage(file, language);
      setSynthesisInput(result);
    } catch (err) {
      console.error("Error analyzing image:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during image analysis.";
      setAnalysisError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = useCallback(async (inputs: SynthesisInput) => {
    setIsLoading(true);
    setError(null);
    setAnalysisError(null);
    setSynthesisResult(null);

    try {
      if (!inputs.startCompound || !inputs.targetCompound) {
        throw new Error(t.errorStartTargetRequired);
      }
      const result = await generateSynthesisPath(inputs, language);
      setSynthesisResult(result);
    } catch (err) {
      console.error("Error generating synthesis path:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred. Please check the browser console for details.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [language, t.errorStartTargetRequired]);

  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-800 dark:text-slate-200">
      <Header language={language} toggleLanguage={toggleLanguage} />
      <main className="flex-grow w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {t.appTitle}
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              {t.appSubtitle}
            </p>
          </div>
          <InputForm
            onGenerate={handleGenerate}
            isLoading={isLoading}
            onAnalyzeImage={handleImageAnalysis}
            isAnalyzing={isAnalyzing}
            analysisError={analysisError}
            synthesisInput={synthesisInput}
            onInputChange={handleInputChange}
            language={language}
          />
          {(isLoading || isAnalyzing) && <Loader isAnalyzing={isAnalyzing} language={language} />}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
              <p className="font-bold">{t.errorPathwayTitle}</p>
              <p>{error}</p>
            </div>
          )}
          <ResultDisplay result={synthesisResult} language={language} />
        </div>
      </main>
      <Footer language={language} />
    </div>
  );
};

export default App;