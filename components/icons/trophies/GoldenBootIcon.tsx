import React from 'react';

export const GoldenBootIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <radialGradient id="gboot-gold-grad" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
        <stop offset="0%" stopColor="#FFF59D" />
        <stop offset="50%" stopColor="#FBC02D" />
        <stop offset="100%" stopColor="#B1740F" />
      </radialGradient>
      <linearGradient id="gboot-base-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3a3a3a" />
        <stop offset="100%" stopColor="#1a1a1a" />
      </linearGradient>
    </defs>
    
    {/* Base */}
    <path d="M5 118 L 95 118 L 85 100 L 15 100 Z" fill="url(#gboot-base-grad)" />

    {/* Boot */}
    <g transform="translate(0, 10)">
        <path d="M20,90 L85,90 L95,60 C 80,55 60,65 50,60 C 30,50 15,70 20,90 Z" fill="url(#gboot-gold-grad)" />
        <path d="M50,60 L45,20 L60,25 L55,60" fill="url(#gboot-gold-grad)" stroke="#B1740F" strokeWidth="1" />
        <path d="M22,90 C 25,80 35,75 48,78" fill="none" stroke="rgba(177, 116, 15, 0.6)" strokeWidth="2" />
    </g>
  </svg>
);