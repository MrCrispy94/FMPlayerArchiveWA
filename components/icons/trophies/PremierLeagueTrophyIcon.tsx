import React from 'react';

export const PremierLeagueTrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="pl-silver-grad-detail" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f5f5f5" />
        <stop offset="100%" stopColor="#b0b0b0" />
      </linearGradient>
      <radialGradient id="pl-gold-grad-detail" cx="50%" cy="40%" r="50%" fx="50%" fy="40%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#DAA520" />
      </radialGradient>
      <linearGradient id="pl-malachite" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#00A356" />
        <stop offset="100%" stopColor="#00ff85" />
      </linearGradient>
    </defs>
    
    {/* Base */}
    <path d="M10 118 L 90 118 L 80 105 L 20 105 Z" fill="url(#pl-malachite)" stroke="#006434" strokeWidth="1" />
    
    {/* Trophy Body */}
    <path d="M40 105 C 40 80 45 40 50 35 C 55 40 60 80 60 105 Z" fill="url(#pl-silver-grad-detail)" />
    
    {/* Handles (Lions) */}
    <path d="M40 90 C 20 85 5 60 35 50" fill="url(#pl-gold-grad-detail)" />
    <path d="M60 90 C 80 85 95 60 65 50" fill="url(#pl-gold-grad-detail)" />

    {/* Crown */}
    <path d="M35 50 L 65 50 L 50 30 Z" fill="url(#pl-gold-grad-detail)" />
    <path d="M35 50 L 30 35 L 42 45 L 50 30 L 58 45 L 70 35 L 65 50" fill="url(#pl-gold-grad-detail)" stroke="#B8860B" strokeWidth="1" />
  </svg>
);