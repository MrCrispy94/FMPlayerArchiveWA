import React from 'react';

export const PlateTrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <radialGradient id="plate-silver-grad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f0f0f0" />
        <stop offset="80%" stopColor="#c0c0c0" />
        <stop offset="100%" stopColor="#a0a0a0" />
      </radialGradient>
    </defs>

    {/* Base */}
    <path d="M40 118 L60 118 L 55 100 L45 100 Z" fill="#654321" />

    {/* Plate */}
    <circle cx="50" cy="60" r="45" fill="url(#plate-silver-grad)" stroke="#808080" strokeWidth="1" />
    
    {/* Inner detail */}
    <circle cx="50" cy="60" r="35" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="2" strokeDasharray="5,5" />
    <circle cx="50" cy="60" r="20" fill="rgba(255,255,255,0.2)" />
  </svg>
);