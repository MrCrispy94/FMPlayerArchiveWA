import React from 'react';

export const MedalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <radialGradient id="medal-gold-grad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" style={{ stopColor: '#FFDF00' }} />
        <stop offset="100%" style={{ stopColor: '#D4AF37' }} />
      </radialGradient>
    </defs>
    {/* Ribbon */}
    <path d="M30 0 L40 40 L50 20 L60 40 L70 0 Z" fill="#4169E1" />
    
    {/* Medal */}
    <circle cx="50" cy="70" r="30" fill="url(#medal-gold-grad)" />
    <circle cx="50" cy="70" r="25" fill="none" stroke="#B8860B" strokeWidth="3" />
    <path d="M42 65 l16 10 m-16 0 l16 -10" stroke="#B8860B" strokeWidth="3" />
  </svg>
);
