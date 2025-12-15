

import React from 'react';
import { Player, Club } from '../types';
import Kit from './Kit';
import { FlagIcon } from './icons/FlagIcon';

interface DraggablePlayerCardProps {
  player: Player;
  allClubs: Record<string, Club>;
  kitDisplayIndex: number;
  onKitClick: (playerId: string) => void;
}

const DraggablePlayerCard: React.FC<DraggablePlayerCardProps> = ({ player, allClubs, kitDisplayIndex, onKitClick }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('playerId', player.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleKitClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onKitClick(player.id);
  };

  const clubsPlayedFor = [player.currentClub, ...player.clubHistory.map(h => h.clubName)].filter(Boolean);
  const displayedClubName = player.primaryPosition === 'GK'
    ? player.currentClub
    : (clubsPlayedFor[kitDisplayIndex % (clubsPlayedFor.length || 1)] || player.currentClub);
  
  const displayedClub = allClubs[displayedClubName];
  const gkKitIndex = player.primaryPosition === 'GK' ? kitDisplayIndex : 0;
  const displayName = player.knownAs || `${player.firstName} ${player.lastName}`;


  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-gray-700/70 p-2 rounded-lg border border-gray-600/50 flex items-center gap-3 cursor-grab active:cursor-grabbing hover:bg-gray-700 transition-colors"
    >
      <div className="flex-shrink-0" onClick={handleKitClick}>
        <Kit 
          player={player} 
          club={displayedClub}
          size="sm"
          gkKitIndex={gkKitIndex}
          allClubs={allClubs}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-base truncate text-white">{displayName}</p>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <FlagIcon nationality={player.nationality} className="w-4 h-3" />
          <span>{player.primaryPosition}</span>
          <span className="text-gray-500">•</span>
          <span className="truncate">{displayedClubName}</span>
        </div>
      </div>
    </div>
  );
};

export default DraggablePlayerCard;
