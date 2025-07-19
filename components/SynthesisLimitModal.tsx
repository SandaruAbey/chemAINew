import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { translations } from '../utils/translations';

interface SynthesisLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => void;
  language: 'en' | 'si';
}

export const SynthesisLimitModal: React.FC<SynthesisLimitModalProps> = ({
  isOpen,
  onClose,
  onSignIn,
  language,
}) => {
  const { synthesisCount } = useAuth();
  const t = translations[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
        <div className="text-center">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {t.synthesisLimitReached}
          </h2>

          <p className="text-gray-600 mb-6">
            {t.synthesisLimitMessage}
          </p>

          <div className="text-sm text-gray-500 mb-6">
            {t.remainingSynthesis.replace('{count}', (5 - synthesisCount).toString())}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSignIn}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t.loginSignup}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
