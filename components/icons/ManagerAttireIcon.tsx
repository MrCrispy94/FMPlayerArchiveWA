import React from 'react';
import { Club, ManagerStyle } from '../../types';

interface ManagerAttireIconProps {
  style: ManagerStyle;
  club?: Club;
  size?: 'sm' | 'lg';
}

const ManagerAttireIcon: React.FC<ManagerAttireIconProps> = ({ style, club, size = 'lg' }) => {
  const dimensions = size === 'sm' ? { width: 40, height: 40 } : { width: 80, height: 80 };
  const kitColors = club?.kitColors || { primary: '#64748b', secondary: '#94a3b8' }; // Default to slate colors

  const Suit = () => (
    <g>
      {/* Suit Jacket */}
      <path d="M20,30 L20,80 Q20,90 30,90 L70,90 Q80,90 80,80 L80,30 L55,30 Q50,35 45,30 Z" fill="#334155" />
      
      {/* Shirt */}
      <path d="M45,30 Q50,35 55,30 L55,45 L45,45 Z" fill="#e2e8f0" />
      <polygon points="45,30 55,30 50,35" fill="#e2e8f0" />

      {/* Tie */}
      <path d="M48,35 L52,35 L50,60 Z" fill={kitColors.primary} />
    </g>
  );

  const Tracksuit = () => (
    <g>
      {/* Main body */}
      <path d="M20,30 L20,80 Q20,90 30,90 L70,90 Q80,90 80,80 L80,30 Z" fill={kitColors.primary} />
      
      {/* Collar */}
      <path d="M40,30 C40,20 60,20 60,30" fill={kitColors.secondary} />
      
      {/* Zipper */}
      <line x1="50" y1="30" x2="50" y2="90" stroke={kitColors.secondary} strokeWidth="2" />

      {/* Shoulder Stripes */}
      <path d="M20,30 L35,40" stroke={kitColors.secondary} strokeWidth="4" />
      <path d="M80,30 L65,40" stroke={kitColors.secondary} strokeWidth="4" />
    </g>
  );

  return (
    <svg {...dimensions} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="attire-clip">
          <path d="M20,30 L20,80 Q20,90 30,90 L70,90 Q80,90 80,80 L80,30 Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#attire-clip)">
        {style === 'Suit and Tie' ? <Suit /> : <Tracksuit />}
      </g>
    </svg>
  );
};

export default ManagerAttireIcon;
