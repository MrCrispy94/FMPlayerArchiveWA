import React from 'react';

export const LaLigaTrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="laliga-silver-grad-detail" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#DCDCDC" />
        <stop offset="50%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#DCDCDC" />
      </linearGradient>
    </defs>
    
    {/* Base */}
    <ellipse cx="50" cy="115" rx="30" ry="5" fill="#a0a0a0" />
    
    {/* Body */}
    <path d="M35 115 C 30 80, 30 30, 35 10 L 65 10 C 70 30, 70 80, 65 115 Z" fill="url(#laliga-silver-grad-detail)" />
    
    {/* Ribbon/Handles */}
    <path d="M65 10 C 85 20, 85 90, 65 100" fill="none" stroke="#E30613" strokeWidth="5" />
    <path d="M35 10 C 15 20, 15 90, 35 100" fill="none" stroke="#E30613" strokeWidth="5" />

    {/* Top Lip */}
    <ellipse cx="50" cy="10" rx="30" ry="8" fill="url(#laliga-silver-grad-detail)" stroke="#a0a0a0" strokeWidth="1" />
  </svg>
);