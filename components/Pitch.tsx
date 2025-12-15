

import React from 'react';
import { Player, Club, AllTimeXI, FormationPosition } from '../types';
import PitchPlayer from './PitchPlayer';

interface PitchProps {
  formation: FormationPosition[];
  placedPlayers: AllTimeXI;
  allPlayers: Player[];
  allClubs: Record<string, Club>;
  onPlacePlayer?: (position: string, playerId: string) => void;
  kitDisplayIndices?: Record<string, number>;
  onKitClick?: (playerId: string) => void;
  isStatic?: boolean;
}

const DropZone: React.FC<{
  position: string;
  top: string;
  left: string;
  onDrop: (position: string, playerId: string, fromPosition?: string) => void;
}> = ({ position, top, left, onDrop }) => {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const playerId = e.dataTransfer.getData('playerId');
    const fromPosition = e.dataTransfer.getData('fromPosition');
    if (playerId) {
      onDrop(position, playerId, fromPosition || undefined);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="absolute w-20 h-20 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
      style={{ top, left }}
      data-position={position}
    >
      <div className="w-14 h-14 bg-black/20 rounded-full border-2 border-dashed border-gray-400/50 flex items-center justify-center">
        <span className="text-gray-400/80 font-bold text-sm">{position}</span>
      </div>
    </div>
  );
};

const Pitch: React.FC<PitchProps> = ({ formation, placedPlayers, allPlayers, allClubs, onPlacePlayer, kitDisplayIndices = {}, onKitClick, isStatic = false }) => {
  
  const handleDropOnZone = (position: string, playerId: string, fromPosition?: string) => {
    if (!onPlacePlayer) return;
    onPlacePlayer(position, playerId);
  };
  
  return (
    <div className="relative h-full max-w-full aspect-[2/3] bg-green-700 bg-gradient-to-b from-green-600 to-green-800 rounded-lg overflow-hidden">
      {/* Pitch Markings SVG */}
      <svg width="100%" height="100%" viewBox="0 0 700 1050" className="absolute inset-0">
        <defs>
          <linearGradient id="grass" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#2f8f4f' }} />
            <stop offset="100%" style={{ stopColor: '#216e39' }} />
          </linearGradient>
          <pattern id="stripes" patternUnits="userSpaceOnUse" width="700" height="150">
            <rect width="700" height="75" fill="#298247"/>
            <rect y="75" width="700" height="75" fill="#2d8a4d"/>
          </pattern>
        </defs>
        <rect width="700" height="1050" fill="url(#stripes)" />

        {/* Outlines */}
        <rect x="25" y="25" width="650" height="1000" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="5" />
        {/* Halfway line */}
        <line x1="25" y1="525" x2="675" y2="525" stroke="rgba(255,255,255,0.4)" strokeWidth="5" />
        {/* Center circle */}
        <circle cx="350" cy="525" r="91.5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="5" />
        <circle cx="350" cy="525" r="5" fill="rgba(255,255,255,0.4)" />

        {/* Top penalty area */}
        <rect x="137.5" y="25" width="425" height="165" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="5" />
        <rect x="237.5" y="25" width="225" height="55" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="5" />
        <circle cx="350" cy="110" r="5" fill="rgba(255,255,255,0.4)" />
        <path d="M 275 190 A 73.2 73.2 0 0 0 425 190" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="5" />
        
        {/* Bottom penalty area */}
        <rect x="137.5" y="860" width="425" height="165" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="5" />
        <rect x="237.5" y="970" width="225" height="55" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="5" />
        <circle cx="350" cy="940" r="5" fill="rgba(255,255,255,0.4)" />
        <path d="M 275 860 A 73.2 73.2 0 0 1 425 860" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="5" />
      </svg>
      
      {/* Drop Zones */}
      {!isStatic && formation.map(({ position, top, left }) => (
         <DropZone
            key={position}
            position={position}
            top={top}
            left={left}
            onDrop={handleDropOnZone}
          />
      ))}

      {/* Placed Players */}
      {formation.map(({ position, top, left }) => {
        const playerId = placedPlayers[position];
        if (!playerId) return null;

        const player = allPlayers.find(p => p.id === playerId);
        if (!player) return null;

        return (
          <PitchPlayer
            key={player.id}
            player={player}
            allClubs={allClubs}
            position={position}
            top={top}
            left={left}
            kitDisplayIndex={kitDisplayIndices[player.id] || 0}
            onKitClick={onKitClick}
            isStatic={isStatic}
          />
        );
      })}
    </div>
  );
};

export default Pitch;