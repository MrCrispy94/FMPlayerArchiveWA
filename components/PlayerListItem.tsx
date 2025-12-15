
import React, { useMemo } from 'react';
import { Player, Honour, Club, SaveGame, NewgenTerm, CustomTag } from '../types';
import { getHonourInfo } from '../constants';
import Kit from './Kit';
import { FlagIcon } from './icons/FlagIcon';
import { StarIcon } from './icons/StarIcon';
import { GoldTrophyIcon } from './icons/GoldTrophyIcon';
import { BootAwardIcon } from './icons/BootAwardIcon';
import { CaptainIcon } from './icons/CaptainIcon';

interface PlayerListItemProps {
  player: Player;
  isSelected: boolean;
  onSelect: () => void;
  onToggleFavourite: (playerId: string) => void;
  allHonours: Honour[];
  allClubs: Record<string, Club>;
  kitDisplayIndex: number;
  onKitClick: (playerId: string) => void;
  saveGames: SaveGame[];
  customTags: CustomTag[];
  newgenTerm: NewgenTerm;
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

const getTagStyle = (tag: string, saveGames: SaveGame[], customTags: CustomTag[], newgenTerm: NewgenTerm): React.CSSProperties => {
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
  if (tag === newgenTerm) {
    return { backgroundColor: '#f9fafb', color: '#1f2937' }; // Gray-50, dark text
  }
  if (tag === 'Youth Intake') {
    return { backgroundColor: '#10b981', color: 'white' }; // Emerald-500
  }
  
  const saveGame = saveGames.find(s => s.name === tag);
  if (saveGame && saveGame.color) {
    return {
      backgroundColor: saveGame.color,
      color: isColorLight(saveGame.color) ? '#1f2937' : '#f9fafb',
    };
  }
  
  const customTag = customTags.find(t => t.name === tag);
  if (customTag && customTag.color) {
    return {
        backgroundColor: customTag.color,
        color: isColorLight(customTag.color) ? '#1f2937' : '#f9fafb',
    }
  }

  return { backgroundColor: '#4b5563', color: '#f9fafb' }; // Gray-600, light text
};


const PlayerListItem: React.FC<PlayerListItemProps> = ({ player, isSelected, onSelect, onToggleFavourite, allHonours, allClubs, kitDisplayIndex, onKitClick, saveGames, customTags, newgenTerm }) => {
  const totalHonours = useMemo(() => player.seasonStats.flatMap(s => s.honours), [player.seasonStats]);

  const teamTrophies = useMemo(() => totalHonours.filter(hId => {
      const info = getHonourInfo(hId, allHonours);
      return info && !info.type.startsWith('personal_') && info.type !== 'friendly_cup';
  }).length, [totalHonours, allHonours]);

  const personalHonours = useMemo(() => totalHonours.filter(hId => {
      const info = getHonourInfo(hId, allHonours);
      return info && info.type.startsWith('personal_');
  }).length, [totalHonours, allHonours]);

  const clubsPlayedFor = useMemo(() => 
    Array.from(new Set([player.currentClub, ...player.clubHistory.map(h => h.clubName)])).filter(Boolean), 
    [player.currentClub, player.clubHistory]
  );
  
  const handleKitClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onKitClick(player.id);
  };
  
  const handleFavouriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavourite(player.id);
  }

  const displayedClubIndex = player.primaryPosition === 'GK' ? 0 : kitDisplayIndex;
  const gkKitIndex = player.primaryPosition === 'GK' ? kitDisplayIndex : 0;

  const displayedClubName = player.primaryPosition === 'GK' 
    ? player.currentClub 
    : (clubsPlayedFor[displayedClubIndex % (clubsPlayedFor.length || 1)] || player.currentClub);
    
  const displayedClub = allClubs[displayedClubName];
  
  const isCaptainOfDisplayedClub = useMemo(() => {
    return player.clubHistory.some(h => h.clubName === displayedClubName && h.wasCaptain);
  }, [player.clubHistory, displayedClubName]);

  const displayName = player.knownAs || `${player.firstName} ${player.lastName}`;
  
  const playerCustomTagNames = useMemo(() => 
    (player.customTags || [])
        .map(tagId => customTags.find(t => t.id === tagId)?.name)
        .filter((name): name is string => !!name), 
  [player.customTags, customTags]);

  const tags = [
    player.fmVersion,
    player.saveGameName,
    ...(player.isRegen ? [newgenTerm] : []),
    ...(player.isYouthIntake ? ['Youth Intake'] : []),
    ...(player.isImported ? ['Imported'] : []),
    ...playerCustomTagNames,
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
          <button onClick={handleKitClick} className="rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800">
            <Kit
              player={player}
              club={displayedClub}
              size="sm"
              allClubs={allClubs}
              squadNumber={player.squadNumber}
              gkKitIndex={gkKitIndex}
            />
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
             <div className="flex items-center gap-2">
                <button 
                  onClick={handleFavouriteClick} 
                  className={`text-gray-500 hover:text-yellow-400 transition-colors duration-200 ${player.isFavourite ? 'text-yellow-400' : ''}`}
                  aria-label={player.isFavourite ? "Remove from Favourites" : "Add to Favourites"}
                >
                    <StarIcon filled={player.isFavourite} className="w-5 h-5" />
                </button>
                {isCaptainOfDisplayedClub && (
                    <CaptainIcon className="w-5 h-5 flex-shrink-0" title={`Captain of ${displayedClubName}`} />
                )}
                <p className="font-bold text-lg truncate text-white">{displayName}</p>
             </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <GoldTrophyIcon className="w-4 h-4" />
                <span className="text-gray-300">{teamTrophies}</span>
              </div>
              <div className="flex items-center gap-1">
                <BootAwardIcon className="w-4 h-4" />
                <span className="text-gray-300">{personalHonours}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <FlagIcon nationality={player.nationality} className="w-5 h-5" />
            <span>{player.nationality}</span>
            <span className="text-gray-500">•</span>
            <span>{player.primaryPosition}</span>
          </div>
          <p className="text-sm text-gray-400">{displayedClubName}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map(tag => (
              <span 
                key={tag} 
                style={getTagStyle(tag, saveGames, customTags, newgenTerm)}
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

export default PlayerListItem;