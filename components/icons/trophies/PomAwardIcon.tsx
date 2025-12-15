
import React from 'react';

// The league prop is no longer needed as the design is now generic.
export const PomAwardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    return (
        <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" {...props}>
            <defs>
                <linearGradient id="pom-award-silver-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f5f5f5" />
                    <stop offset="50%" stopColor="#c0c0c0" />
                    <stop offset="100%" stopColor="#a9a9a9" />
                </linearGradient>
            </defs>
            
            {/* Silver Rectangle plaque */}
            <rect 
                x="25" 
                y="10" 
                width="50" 
                height="100" 
                rx="5" 
                fill="url(#pom-award-silver-grad)" 
                stroke="#6b7280" 
                strokeWidth="2" 
            />
            
            {/* "PoM" Text */}
            <text 
                x="50" 
                y="60" // Vertically centered in the rectangle
                fontFamily="Inter, sans-serif" 
                fontSize="18" 
                fontWeight="900" // Extra bold
                fill="#2d3748" // A dark gray color
                textAnchor="middle"
                dominantBaseline="middle"
                stroke="#111827"
                strokeWidth="0.5"
                paintOrder="stroke"
            >
                PoM
            </text>
        </svg>
    );
};
