import React from 'react';

interface IconProps {
    className?: string;
}

export const TestTubeIcon: React.FC<IconProps> = ({ className }) => (
    <div className={`test-tube-icon ${className}`}>
        <svg 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full relative z-10"
        >
            {/* Test tube body */}
            <path
                d="M35 15 L35 55 Q35 70 45 80 Q55 90 65 80 Q75 70 75 55 L75 15"
                fill="url(#testTubeGradient)"
                stroke="url(#testTubeBorder)"
                strokeWidth="2"
            />
            
            {/* Liquid inside */}
            <path
                d="M38 50 L38 55 Q38 68 48 75 Q58 82 68 75 Q72 68 72 55 L72 50"
                fill="url(#liquidGradient)"
                opacity="0.8"
            />
            
            {/* Bubbles */}
            <circle cx="45" cy="65" r="2" fill="rgba(255,255,255,0.6)" />
            <circle cx="55" cy="58" r="1.5" fill="rgba(255,255,255,0.4)" />
            <circle cx="62" cy="68" r="1" fill="rgba(255,255,255,0.3)" />
            
            {/* Cork/cap */}
            <rect x="32" y="10" width="36" height="8" rx="4" fill="url(#corkGradient)" />
            
            {/* Measurement lines */}
            <line x1="30" y1="25" x2="33" y2="25" stroke="#94a3b8" strokeWidth="1" />
            <line x1="30" y1="35" x2="33" y2="35" stroke="#94a3b8" strokeWidth="1" />
            <line x1="30" y1="45" x2="33" y2="45" stroke="#94a3b8" strokeWidth="1" />
            
            {/* Gradient definitions */}
            <defs>
                <linearGradient id="testTubeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                    <stop offset="50%" stopColor="rgba(255,255,255,0.7)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.5)" />
                </linearGradient>
                
                <linearGradient id="testTubeBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
                
                <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                
                <linearGradient id="corkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#92400e" />
                </linearGradient>
            </defs>
        </svg>
    </div>
);

export const FlaskIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.5l-3 6.5h6l-3-6.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v6.5m0 0l-3 6.5m3-6.5l3 6.5M6 16h12" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 20h10v-2H7v2z" />
    </svg>
);

export const BeakerIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
);

export const LightBulbIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

export const ArrowDownIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 17l-4 4m0 0l-4-4m4 4V3" />
    </svg>
);

export const CameraIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);
