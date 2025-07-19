import React, { useState, useRef } from 'react';
import type { SynthesisInput } from '../types';
import { CameraIcon, TrashIcon, SparklesIcon } from './Icon';
import { translations } from '../utils/translations';

interface InputFormProps {
  onGenerate: (inputs: SynthesisInput) => void;
  isLoading: boolean;
  onAnalyzeImage: (file: File) => Promise<void>;
  isAnalyzing: boolean;
  analysisError: string | null;
  synthesisInput: SynthesisInput;
  onInputChange: (field: keyof SynthesisInput, value: string) => void;
  language: 'en' | 'si';
}

export const InputForm: React.FC<InputFormProps> = ({ 
  onGenerate, 
  isLoading,
  onAnalyzeImage,
  isAnalyzing,
  analysisError,
  synthesisInput,
  onInputChange,
  language
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = translations[language];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleClearImage = () => {
    setImageFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleAnalyzeClick = async () => {
    if (imageFile) {
      await onAnalyzeImage(imageFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(synthesisInput);
  };

  const isSubmitDisabled = isLoading || isAnalyzing;

  return (
    <div className="space-y-mobile space-y-4 sm:space-y-8">
      {/* Image Upload Section */}
      <div className="space-y-3 sm:space-y-6">
        <div className="text-center">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
            <span className="flex items-center justify-center gap-2">
              <CameraIcon className="w-4 h-4 sm:w-6 sm:h-6 text-primary-600" />
              {t.option1Title}
            </span>
          </h3>
          <p className="text-mobile-sm text-sm sm:text-base text-gray-600 dark:text-gray-400">Upload chemistry diagram for analysis</p>
        </div>
        
        <div className="relative">
          <label htmlFor="file-upload" className="upload-area upload-area-mobile block w-full h-32 sm:h-48 lg:h-56 rounded-xl sm:rounded-2xl cursor-pointer group">
            <div className="h-full flex flex-col items-center justify-center p-3 sm:p-8">
              <div className="mb-3 sm:mb-6 relative">
                <CameraIcon className="w-8 h-8 sm:w-16 sm:h-16 text-gray-400 group-hover:text-primary-500 transition-colors duration-300" />
                <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="text-center">
                <p className="text-mobile-sm text-sm sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                  <span className="text-primary-600">{t.uploadPrompt}</span>
                </p>
                <p className="text-mobile-xs text-xs sm:text-base text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">
                  {t.uploadPromptDrag}
                </p>
                <div className="inline-flex items-center px-2 sm:px-4 py-1 sm:py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {t.uploadFileType}
                </div>
              </div>
            </div>
            <input 
              id="file-upload" 
              type="file" 
              className="hidden" 
              accept="image/png, image/jpeg, image/webp" 
              onChange={handleFileChange} 
              ref={fileInputRef} 
              disabled={isAnalyzing}
            />
          </label>
        </div>
        
        {analysisError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-6 rounded-2xl shadow-lg error-shake" role="alert">
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <strong className="font-bold text-lg">{t.analysisFailed}</strong>
                    <p className="mt-1">{analysisError}</p>
                  </div>
                </div>
            </div>
        )}

        {previewUrl && (
          <div className="card p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl">
            <div className="flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-8">
              <div className="relative group flex-shrink-0">
                <img 
                  src={previewUrl} 
                  alt="Chemistry diagram preview" 
                  className="w-full lg:w-48 h-48 object-cover rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-xl transition-all duration-300"></div>
              </div>
              <div className="flex-1 space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    📎 Uploaded File
                  </h4>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white break-all">
                    {imageFile?.name}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    type="button" 
                    onClick={handleAnalyzeClick} 
                    disabled={isAnalyzing || isLoading} 
                    className="btn-mobile btn btn-md sm:btn-lg bg-gradient-primary text-white disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none text-xs sm:text-base"
                    style={{ backgroundColor: '#f59e0b' }}
                  >
                    <SparklesIcon className="w-3 h-3 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                    {isAnalyzing ? t.analyzingButton : t.analyzeButton}
                  </button>
                  <button 
                    type="button" 
                    onClick={handleClearImage} 
                    disabled={isAnalyzing} 
                    className="btn btn-secondary p-2 sm:p-3 disabled:opacity-50"
                    title="Remove image"
                  >
                    <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="relative py-4 sm:py-8">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-50 dark:bg-gray-800 px-3 sm:px-6 py-1 sm:py-2 text-sm sm:text-base font-medium text-gray-500 dark:text-gray-400 rounded-full border border-gray-200 dark:border-gray-700">
            {t.dividerText}
          </span>
        </div>
      </div>
      
      {/* Manual Input Form */}
      <div className="space-y-mobile space-y-3 sm:space-y-6">
        <div className="text-center">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
            {t.option2Title}
          </h3>
          <p className="text-mobile-sm text-sm sm:text-base text-gray-600 dark:text-gray-400">Enter compound formulas and reagents</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-mobile space-y-3 sm:space-y-6">
          <div className="grid-mobile grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
            <div className="space-y-1 sm:space-y-2">
              <label htmlFor="startCompound" className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t.startCompoundLabel}
              </label>
              <input 
                type="text" 
                id="startCompound" 
                value={synthesisInput.startCompound} 
                onChange={(e) => onInputChange('startCompound', e.target.value)}
                className="input-mobile input focus-ring text-xs sm:text-base" 
                placeholder={t.startCompoundPlaceholder} 
                required 
              />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <label htmlFor="targetCompound" className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t.targetCompoundLabel}
              </label>
              <input 
                type="text" 
                id="targetCompound" 
                value={synthesisInput.targetCompound} 
                onChange={(e) => onInputChange('targetCompound', e.target.value)}
                className="input-mobile input focus-ring text-xs sm:text-base" 
                placeholder={t.targetCompoundPlaceholder} 
                required 
              />
            </div>
          </div>
          
          <div className="space-y-1 sm:space-y-2">
            <label htmlFor="reagents" className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t.reagentsLabel}
            </label>
            <input 
              type="text" 
              id="reagents" 
              value={synthesisInput.reagents} 
              onChange={(e) => onInputChange('reagents', e.target.value)}
              className="input-mobile input focus-ring text-xs sm:text-base" 
              placeholder={t.reagentsPlaceholder} 
            />
          </div>
          
          <div className="pt-2 sm:pt-4">
            <button 
              type="submit" 
              disabled={isSubmitDisabled} 
              className="btn-mobile btn btn-md sm:btn-lg w-full bg-gradient-primary text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-lg font-bold"
               style={{ backgroundColor: '#f59e0b' }}
            >
              {isLoading ? (
                <>
                  {/* <div className="loading-spinner mr-2 sm:mr-3 "></div> */}
                  {t.generatingButton}
                </>
              ) : (
                <>
                  🧪 {t.generateButton}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};