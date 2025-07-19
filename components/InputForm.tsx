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
    <div className="space-y-6">
      {/* Image Upload Section */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {t.option1Title}
        </label>
        <div className="flex items-center justify-center w-full">
          <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:hover:bg-bray-800 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <CameraIcon className="w-8 h-8 mb-2 text-slate-500 dark:text-slate-400" />
              <p className="mb-2 text-sm text-slate-500 dark:text-slate-400"><span className="font-semibold">{t.uploadPrompt}</span> {t.uploadPromptDrag}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.uploadFileType}</p>
            </div>
            <input id="file-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} ref={fileInputRef} disabled={isAnalyzing}/>
          </label>
        </div>
        
        {analysisError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">{t.analysisFailed} </strong>
                <span className="block sm:inline">{analysisError}</span>
            </div>
        )}

        {previewUrl && (
          <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-700/50">
            <div className="flex items-start space-x-4">
              <img src={previewUrl} alt="Preview" className="h-24 w-24 object-cover rounded-md"/>
              <div className="flex-1 space-y-2">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 break-all">{imageFile?.name}</p>
                <div className="flex items-center space-x-2">
                  <button type="button" onClick={handleAnalyzeClick} disabled={isAnalyzing || isLoading} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-brand-secondary hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">
                    <SparklesIcon className="w-4 h-4 mr-2" />
                    {isAnalyzing ? t.analyzingButton : t.analyzeButton}
                  </button>
                  <button type="button" onClick={handleClearImage} disabled={isAnalyzing} className="inline-flex items-center p-2 border border-slate-300 dark:border-slate-500 text-xs font-medium rounded-md text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-600 hover:bg-slate-50 dark:hover:bg-slate-500 disabled:opacity-50">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white dark:bg-slate-800 px-2 text-sm text-slate-500 dark:text-slate-400">{t.dividerText}</span>
        </div>
      </div>
      
      {/* Manual Input Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <p className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t.option2Title}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="startCompound" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t.startCompoundLabel}
            </label>
            <input type="text" id="startCompound" value={synthesisInput.startCompound} onChange={(e) => onInputChange('startCompound', e.target.value)}
              className="block w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 shadow-sm focus:border-brand-primary focus:ring focus:ring-brand-primary focus:ring-opacity-50 transition" placeholder={t.startCompoundPlaceholder} required />
          </div>
          <div>
            <label htmlFor="targetCompound" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t.targetCompoundLabel}
            </label>
            <input type="text" id="targetCompound" value={synthesisInput.targetCompound} onChange={(e) => onInputChange('targetCompound', e.target.value)}
              className="block w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 shadow-sm focus:border-brand-primary focus:ring focus:ring-brand-primary focus:ring-opacity-50 transition" placeholder={t.targetCompoundPlaceholder} required />
          </div>
        </div>
        <div>
          <label htmlFor="reagents" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {t.reagentsLabel}
          </label>
          <input type="text" id="reagents" value={synthesisInput.reagents} onChange={(e) => onInputChange('reagents', e.target.value)}
            className="block w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 shadow-sm focus:border-brand-primary focus:ring focus:ring-brand-primary focus:ring-opacity-50 transition" placeholder={t.reagentsPlaceholder} />
        </div>
        <div className="pt-2">
          <button type="submit" disabled={isSubmitDisabled} className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">
            {isLoading ? t.generatingButton : t.generateButton}
          </button>
        </div>
      </form>
    </div>
  );
};