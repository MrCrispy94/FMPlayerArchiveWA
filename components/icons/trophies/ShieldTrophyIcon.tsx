import React from 'react';

export const ShieldTrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="shield-silver-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#e0e0e0' }} />
        <stop offset="100%" style={{ stopColor: '#b8b8b8' }} />
      </linearGradient>
    </defs>
    {/* Base */}
    <rect x="20" y="110" width="60" height="10" rx="5" fill="#654321" />

    {/* Shield */}
    <path d="M10,10 C10,0 90,0 90,10 L90,60 C90,90 50,110 50,110 C50,110 10,90 10,60 Z" fill="url(#shield-silver-grad)" stroke="#a0a0a0" strokeWidth="3" />

    {/* Shield Detail */}
    <path d="M25,20 L75,20 L75,55 C75,75 50,90 50,90 C50,90 25,75 25,55 Z" fill="rgba(255,255,255,0.2)" />
  </svg>
);
