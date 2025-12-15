

import React, { useMemo } from 'react';
import { Manager, Honour, Club, SaveGame } from '../types';
import { getHonourInfo } from '../constants';
import ManagerAttireIcon from './icons/ManagerAttireIcon';
import { FlagIcon } from './icons/FlagIcon';
import { StarIcon } from './icons/StarIcon';
import { GoldTrophyIcon } from './icons/GoldTrophyIcon';
import { BootAwardIcon } from './icons/BootAwardIcon';

interface ManagerListItemProps {
  manager: Manager;
  isSelected: boolean;
  onSelect: () => void;
  onToggleFavourite: (managerId: string) => void;
  allHonours: Honour[];
  allClubs: Record<string, Club>;
  saveGames: SaveGame[];
}

const isColorLight = (hexColor: string): boolean => {
    if (!hexColor) return false;
    const color = (hexColor.charAt(0) === '#') ? hexColor.substring(1, 7) : hexColor;
    if (color.length < 6) return false;
    try {
        const r = parseInt(color.substring(0, 2), 16);
        const g = parseInt(color.substring(2, 4), 16);
        const b = parseInt(color.substring(4, 6), 16);
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186;
    } catch(e) {
        return false;
    }
};

const getTagStyle = (tag: string, saveGames: SaveGame[]): React.CSSProperties => {
  if (tag === 'Favourite') {
    return { backgroundColor: '#facc15', color: '#422006' }; // yellow-400
  }
  if (tag === 'Imported') {
    return { backgroundColor: '#2dd4bf', color: '#042f2e' }; // teal-400
  }
  if (tag.startsWith('CM')) {
    return { backgroundColor: '#3b82f6', color: 'white' }; // Blue-500
  }
  if (tag.startsWith('FM')) {
    return { backgroundColor: '#8b5cf6', color: 'white' }; // Violet-500
  }
  
  const saveGame = saveGames.find(s => s.name === tag);
  if (saveGame && saveGame.color) {
    return {
      backgroundColor: saveGame.color,
      color: isColorLight(saveGame.color) ? '#1f2937' : '#f9fafb',
    };
  }

  return { backgroundColor: '#4b5563', color: '#f9fafb' };
};

const ManagerListItem: React.FC<ManagerListItemProps> = ({ manager, isSelected, onSelect, onToggleFavourite, allHonours, allClubs, saveGames }) => {
  const honoursCount = useMemo(() => {
    let team = 0;
    let personal = 0;
    
    manager.seasonStats.forEach(season => {
      for (const honourId in season.honours) {
        const count = season.honours[honourId];
        const info = getHonourInfo(honourId, allHonours);
        if (info) {
          if (info.type.startsWith('personal_')) {
            personal += count;
          } else if (info.type !== 'friendly_cup') {
            team += count;
          }
        }
      }
    });

    return { team, personal };
  }, [manager.seasonStats, allHonours]);
  
  const handleFavouriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavourite(manager.id);
  }

  const displayedClub = allClubs[manager.currentClub];
  const displayName = manager.knownAs || `${manager.firstName} ${manager.lastName}`;

  const tags = [
    manager.fmVersion,
    manager.saveGameName,
    ...(manager.isImported ? ['Imported'] : []),
  ].filter(Boolean);

  return (
    <li
      onClick={onSelect}
      className={`p-3 border-b border-gray-700/50 cursor-pointer transition-colors duration-200 ${
        isSelected ? 'bg-purple-600/20' : 'hover:bg-gray-700/50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <ManagerAttireIcon
            style={manager.managerStyle}
            club={displayedClub}
            size="sm"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
             <div className="flex items-center gap-2">
                <button 
                  onClick={handleFavouriteClick} 
                  className={`text-gray-500 hover:text-yellow-400 transition-colors duration-200 ${manager.isFavourite ? 'text-yellow-400' : ''}`}
                  aria-label={manager.isFavourite ? "Remove from Favourites" : "Add to Favourites"}
                >
                    <StarIcon filled={manager.isFavourite} className="w-5 h-5" />
                </button>
                <p className="font-bold text-lg truncate text-white">{displayName}</p>
             </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <GoldTrophyIcon className="w-4 h-4" />
                <span className="text-gray-300">{honoursCount.team}</span>
              </div>
              <div className="flex items-center gap-1">
                <BootAwardIcon className="w-4 h-4" />
                <span className="text-gray-300">{honoursCount.personal}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <FlagIcon nationality={manager.nationality} className="w-5 h-5" />
            <span>{manager.nationality}</span>
          </div>
          <p className="text-sm text-gray-400">{manager.currentClub}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map(tag => (
              <span 
                key={tag} 
                style={getTagStyle(tag, saveGames)}
                className="px-2 py-0.5 text-xs rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </li>
  );
};

export default ManagerListItem;
