import React from 'react';

export const ChampionsLeagueTrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <radialGradient id="ucl-silver-grad" cx="50%" cy="40%" r="50%" fx="50%" fy="40%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="20%" stopColor="#E0E0E0" />
        <stop offset="100%" stopColor="#A0A0A0" />
      </radialGradient>
    </defs>
    
    {/* Base */}
    <ellipse cx="50" cy="112" rx="35" ry="8" fill="#A9A9A9" stroke="#808080" strokeWidth="0.5" />
    <path d="M40 104 L60 104 L65 98 L35 98 Z" fill="#C0C0C0" />
    
    {/* Body */}
    <path d="M35,98 C35,70 30,30 50,10 C70,30 65,70 65,98 Z" fill="url(#ucl-silver-grad)" />
    
    {/* Handles */}
    <path d="M65,80 C95,70 110,40 70,20" fill="none" stroke="url(#ucl-silver-grad)" strokeWidth="10" strokeLinecap="round"/>
    <path d="M35,80 C5,70 -10,40 30,20" fill="none" stroke="url(#ucl-silver-grad)" strokeWidth="10" strokeLinecap="round"/>
    
    {/* Lip */}
    <ellipse cx="50" cy="12" rx="20" ry="7" fill="url(#ucl-silver-grad)" stroke="#808080" strokeWidth="0.5"/>
  </svg>
);