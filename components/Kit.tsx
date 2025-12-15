import React from 'react';
import { Player, Club } from '../types';
import { GOALKEEPER_KITS } from '../constants';

interface KitProps {
  player?: Player;
  club?: Club;
  size?: 'sm' | 'lg';
  gkKitIndex?: number;
  allClubs?: Record<string, Club>;
  squadNumber?: number;
}

const getKitNumberStyle = (): { fill: string, stroke: string } => {
  return { fill: '#FFFFFF', stroke: '#000000' };
};


const Kit: React.FC<KitProps> = ({ player, club, size = 'lg', gkKitIndex = 0, allClubs, squadNumber }) => {
  const isGk = player?.primaryPosition === 'GK';
  
  let kitColors;
  let pattern: Club['pattern'] = 'plain';

  if(isGk) {
      kitColors = GOALKEEPER_KITS[gkKitIndex];
  } else {
      const clubInfo = club || (player && allClubs ? allClubs[player.currentClub] : undefined);
      kitColors = clubInfo ? clubInfo.kitColors : { primary: '#cccccc', secondary: '#999999' };
      pattern = clubInfo?.pattern || 'plain';
  }

  const dimensions = size === 'sm' ? { width: 40, height: 40 } : { width: 80, height: 80 };
  const numberStyle = getKitNumberStyle();
  const textFontSize = size === 'sm' ? '28' : '40';
  
  return (
    <svg {...dimensions} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="shirt-clip">
            <path d="M25,30 Q20,32 20,40 L20,80 Q20,90 30,90 L70,90 Q80,90 80,80 L80,40 Q80,32 75,30 L65,25 L35,25 Z" />
        </clipPath>
      </defs>
      <g>
        {/* Main body */}
        <path d="M25,30 Q20,32 20,40 L20,80 Q20,90 30,90 L70,90 Q80,90 80,80 L80,40 Q80,32 75,30 L65,25 L35,25 Z" fill={kitColors.primary} />

        {/* Patterns */}
        <g clipPath="url(#shirt-clip)">
            {pattern === 'stripes' && (
                <>
                    <rect x="20" y="25" width="12" height="65" fill={kitColors.secondary} />
                    <rect x="44" y="25" width="12" height="65" fill={kitColors.secondary} />
                    <rect x="68" y="25" width="12" height="65" fill={kitColors.secondary} />
                </>
            )}
            {pattern === 'hoops' && (
                <>
                    <rect x="20" y="35" width="60" height="10" fill={kitColors.secondary} />
                    <rect x="20" y="55" width="60" height="10" fill={kitColors.secondary} />
                    <rect x="20" y="75" width="60" height="10" fill={kitColors.secondary} />
                </>
            )}
        </g>
        
        {/* Collar */}
        <path d="M35,25 Q50,40 65,25 L60,22 Q50,30 40,22 Z" fill={kitColors.secondary} />
        {/* Sleeves */}
        <path d="M25,30 L10,35 L15,45 L20,40 Z" fill={kitColors.primary} />
        <path d="M10,35 L15,45" stroke={kitColors.secondary} strokeWidth="3" />
        <path d="M75,30 L90,35 L85,45 L80,40 Z" fill={kitColors.primary} />
        <path d="M90,35 L85,45" stroke={kitColors.secondary} strokeWidth="3" />

        {/* Squad Number */}
        {squadNumber !== undefined && (
          <text
            x="50"
            y={size === 'sm' ? "68" : "70"}
            fontFamily="Inter, sans-serif"
            fontSize={textFontSize}
            fontWeight="bold"
            fill={numberStyle.fill}
            textAnchor="middle"
            stroke={numberStyle.stroke}
            strokeWidth="2"
            strokeLinejoin="round"
            paintOrder="stroke"
          >
            {squadNumber}
          </text>
        )}
      </g>
    </svg>
  );
};

export default Kit;