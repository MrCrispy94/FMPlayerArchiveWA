import React from 'react';

export const BallonDorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <radialGradient id="bdor-gold-grad" cx="50%" cy="40%" r="50%" fx="50%" fy="40%">
        <stop offset="0%" stopColor="#FFF59D" />
        <stop offset="30%" stopColor="#FFEE58" />
        <stop offset="70%" stopColor="#FBC02D" />
        <stop offset="100%" stopColor="#B1740F" />
      </radialGradient>
      <linearGradient id="bdor-base-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#434343" />
        <stop offset="100%" stopColor="#000000" />
      </linearGradient>
    </defs>
    
    {/* Base */}
    <path d="M20,118 L80,118 L90,100 L70,105 L50,98 L30,105 L10,100 Z" fill="url(#bdor-base-grad)" />
    
    {/* Ball */}
    <circle cx="50" cy="55" r="45" fill="url(#bdor-gold-grad)" />
    
    {/* Seams */}
    <path d="M50,10 C 65,25 75,45 72,60 C 65,80 40,85 30,70 C 20,55 35,25 50,10 Z" fill="none" stroke="rgba(177, 116, 15, 0.4)" strokeWidth="1.5" />
    <path d="M50,100 C 35,85 25,65 28,50 C 35,30 60,25 70,40 C 80,55 65,85 50,100 Z" fill="none" stroke="rgba(177, 116, 15, 0.4)" strokeWidth="1.5" />
  </svg>
);