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
    startCompound: '',
    targetCompound: '',
    reagents: '',
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50 to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-primary-900">
      <Header language={language} toggleLanguage={toggleLanguage} />
      
      {/* Hero Section */}
      <section className="relative py-6 sm:py-12 lg:py-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-16 sm:w-32 h-16 sm:h-32 bg-chemistry-yellow/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-3/4 right-1/4 w-20 sm:w-40 h-20 sm:h-40 bg-chemistry-green/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-12 sm:w-24 h-12 sm:h-24 bg-chemistry-purple/10 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="main-container relative max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="text-center mb-6 sm:mb-12 lg:mb-16 animate-fadeInUp">
            {/* Main Title */}
            <h1 className="hero-title text-2xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-primary-600 to-gray-900 dark:from-white dark:via-primary-400 dark:to-white bg-clip-text text-transparent">
                {t.appTitle}
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="hero-subtitle text-sm sm:text-lg lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-4 sm:mb-8 leading-relaxed px-2">
              {t.appSubtitle}
            </p>
            
            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-8 px-2">
              <span className="badge-mobile px-2 sm:px-4 py-1 sm:py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-primary-600 dark:text-primary-400 rounded-full font-semibold text-xs sm:text-sm border border-primary-200 dark:border-primary-800 animate-slideInRight">
                🧬 AI-Powered
              </span>
              <span className="badge-mobile px-2 sm:px-4 py-1 sm:py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-chemistry-green rounded-full font-semibold text-xs sm:text-sm border border-green-200 dark:border-green-800 animate-slideInRight" style={{animationDelay: '0.1s'}}>
                ⚗️ Synthesis
              </span>
              <span className="badge-mobile px-2 sm:px-4 py-1 sm:py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-chemistry-purple rounded-full font-semibold text-xs sm:text-sm border border-purple-200 dark:border-purple-800 animate-slideInRight" style={{animationDelay: '0.2s'}}>
                📊 Real-time
              </span>
            </div>
          </div>
          
          {/* Main Content Card */}
          <div className="max-w-5xl mx-auto">
            <div className="main-card card-glass rounded-2xl sm:rounded-3xl p-3 sm:p-6 lg:p-10 shadow-2xl animate-fadeInUp" style={{animationDelay: '0.3s'}}>
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
              
              {/* Loading State */}
              {(isLoading || isAnalyzing) && (
                <div className="mt-8 animate-fadeIn">
                  <Loader isAnalyzing={isAnalyzing} language={language} />
                </div>
              )}
              
              {/* Error State */}
              {error && (
                <div className="mt-8 animate-fadeIn">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-6 rounded-2xl shadow-lg error-shake" role="alert">
                    <div className="flex items-start">
                      <svg className="w-6 h-6 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h3 className="font-bold text-lg mb-1">{t.errorPathwayTitle}</h3>
                        <p className="text-base">{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Results */}
              {synthesisResult && (
                <div className="mt-8 success-bounce">
                  <ResultDisplay result={synthesisResult} language={language} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <Footer language={language} />
    </div>
  );
};

export default App;