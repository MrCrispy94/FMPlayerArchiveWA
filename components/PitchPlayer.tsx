
import React from 'react';
import { Player, Club } from '../types';
import Kit from './Kit';

interface PitchPlayerProps {
  player: Player;
  allClubs: Record<string, Club>;
  position: string;
  top: string;
  left: string;
  kitDisplayIndex: number;
  onKitClick?: (playerId: string) => void;
  isStatic?: boolean;
}

const PitchPlayer: React.FC<PitchPlayerProps> = ({ player, allClubs, position, top, left, kitDisplayIndex, onKitClick, isStatic = false }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (isStatic) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('playerId', player.id);
    e.dataTransfer.setData('fromPosition', position);
  };
  
  const handleKitClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if(onKitClick) onKitClick(player.id);
  };

  const clubsPlayedFor = [player.currentClub, ...player.clubHistory.map(h => h.clubName)].filter(Boolean);
  const displayedClubName = player.primaryPosition === 'GK' 
    ? player.currentClub 
    : (clubsPlayedFor[kitDisplayIndex % clubsPlayedFor.length] || player.currentClub);
  
  const club = allClubs[displayedClubName];
  const gkKitIndex = player.primaryPosition === 'GK' ? kitDisplayIndex : 0;
  const displayName = player.knownAs || player.lastName;

  return (
    <div
      draggable={!isStatic}
      onDragStart={handleDragStart}
      className={`absolute w-20 h-24 flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${!isStatic ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
      style={{ top, left }}
    >
        <div onClick={handleKitClick}>
            <Kit 
                player={player} 
                club={club}
                squadNumber={player.squadNumber} 
                size="lg" 
                gkKitIndex={gkKitIndex}
                allClubs={allClubs}
            />
        </div>
        <div className="mt-1 text-center">
            <p className="text-xs font-bold text-white bg-black/50 px-2 py-0.5 rounded-md truncate max-w-[70px]">
                {displayName}
            </p>
        </div>
    </div>
  );
};

export default PitchPlayer;
