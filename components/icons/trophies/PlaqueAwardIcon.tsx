import React from 'react';

export const PlaqueAwardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="plaque-wood-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#855a3c" />
        <stop offset="100%" stopColor="#51341a" />
      </linearGradient>
       <linearGradient id="plaque-metal-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#d4af37" />
        <stop offset="100%" stopColor="#b8860b" />
      </linearGradient>
    </defs>
    
    {/* Wooden Plaque */}
    <rect x="10" y="10" width="80" height="100" rx="10" fill="url(#plaque-wood-grad)" />
    
    {/* Metal Plate */}
    <rect x="20" y="25" width="60" height="70" rx="5" fill="url(#plaque-metal-grad)" />

    {/* Text Lines (simplified) */}
    <rect x="30" y="40" width="40" height="4" fill="rgba(0,0,0,0.3)" />
    <rect x="30" y="55" width="40" height="4" fill="rgba(0,0,0,0.3)" />
    <rect x="30" y="70" width="40" height="4" fill="rgba(0,0,0,0.3)" />
  </svg>
);