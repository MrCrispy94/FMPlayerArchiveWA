import React from 'react';

export const CupTrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
            <linearGradient id="cup-silver-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#e8e8e8' }} />
                <stop offset="100%" style={{ stopColor: '#b0b0b0' }} />
            </linearGradient>
        </defs>
        {/* Base */}
        <ellipse cx="50" cy="110" rx="30" ry="8" fill="#a0a0a0" />
        <rect x="46" y="95" width="8" height="15" fill="#b8b8b8" />
        
        {/* Body */}
        <path d="M35,95 C35,70 30,20 50,15 C70,20 65,70 65,95 Z" fill="url(#cup-silver-grad)" />
        <ellipse cx="50" cy="20" rx="16" ry="5" fill="url(#cup-silver-grad)" stroke="#a0a0a0" strokeWidth="1"/>

        {/* Handles */}
        <path d="M65,50 C 85,45 85,75 65,80" fill="none" stroke="url(#cup-silver-grad)" strokeWidth="6" strokeLinecap="round" />
        <path d="M35,50 C 15,45 15,75 35,80" fill="none" stroke="url(#cup-silver-grad)" strokeWidth="6" strokeLinecap="round" />
    </svg>
);
