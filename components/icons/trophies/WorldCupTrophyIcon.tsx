import React from 'react';

export const WorldCupTrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <radialGradient id="wc-gold-grad-detail" cx="50%" cy="40%" r="50%" fx="50%" fy="40%">
        <stop offset="0%" stopColor="#FFFDE7" />
        <stop offset="20%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#B8860B" />
      </radialGradient>
      <linearGradient id="wc-malachite" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0a6941" />
        <stop offset="50%" stopColor="#0c7d4d" />
        <stop offset="100%" stopColor="#0a6941" />
      </linearGradient>
    </defs>
    
    {/* Base */}
    <path d="M20,118 L80,118 L85,105 L15,105 Z" fill="url(#wc-malachite)" stroke="#064027" strokeWidth="0.5" />
    <path d="M25,105 L75,105 L80,98 L20,98 Z" fill="url(#wc-malachite)" stroke="#064027" strokeWidth="0.5" />
    
    {/* Figures */}
    <path d="M50 98 C 65 70, 70 50, 60 38" fill="none" stroke="url(#wc-gold-grad-detail)" strokeWidth="14" strokeLinecap="round" />
    <path d="M50 98 C 35 70, 30 50, 40 38" fill="none" stroke="url(#wc-gold-grad-detail)" strokeWidth="14" strokeLinecap="round" />

    {/* Globe */}
    <circle cx="50" cy="28" r="22" fill="url(#wc-gold-grad-detail)" />
    <path d="M50,6 A22,22 0 0,1 50,50" fill="none" stroke="rgba(184, 134, 11, 0.5)" strokeWidth="1" />
    <path d="M28,28 A22,22 0 0,1 72,28" fill="none" stroke="rgba(184, 134, 11, 0.5)" strokeWidth="1" />
    {/* Continents shape (simplified) */}
    <path d="M45,18 C40,20 38,28 42,35 C48,40 55,38 60,30 C62,25 55,15 45,18 Z" fill="#B8860B" opacity="0.3" />
  </svg>
);