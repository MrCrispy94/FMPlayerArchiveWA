import React from 'react';

export const GenericCupIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="gcup-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFAA4" />
        <stop offset="100%" stopColor="#D4AF37" />
      </linearGradient>
    </defs>
    
    {/* Base */}
    <ellipse cx="50" cy="115" rx="25" ry="5" fill="#D4AF37" />
    <path d="M45 110 L55 110 L 60 95 L 40 95 Z" fill="#b08d2f" />
    
    {/* Stem */}
    <rect x="47" y="70" width="6" height="25" fill="#D4AF37" />
    <circle cx="50" cy="70" r="8" fill="#FFD700" />
    
    {/* Cup */}
    <path d="M30,70 C 30,30 40,5 50,5 C 60,5 70,30 70,70 Z" fill="url(#gcup-gold-grad)" />

    {/* Lip */}
    <ellipse cx="50" cy="10" rx="20" ry="5" fill="#FFD700" stroke="#B8860B" strokeWidth="0.5"/>
  </svg>
);