
import React, { useRef } from 'react';
import { Player, Honour, Club, SaveGame, NewgenTerm, CustomTag } from '../types';
import PlayerListItem from './PlayerListItem';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import { PlusIcon } from './icons/PlusIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { UploadIcon } from './icons/UploadIcon';

interface PlayerListProps {
  players: Player[];
  playerCount: number;
  managerCount: number;
  onViewChange: (view: 'players' | 'managers') => void;
  selectedPlayerId: string | null;
  onSelectPlayer: (id: string) => void;
  onToggleFavourite: (id: string) => void;
  onAddPlayer: () => void;
  onOpenExportModal: () => void;
  onImportFile: (file: File) => void;
  searchQuery: string;
  onSearch: (query: string) => void;
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
  allTags: string[];
  allHonours: Honour[];
  allClubs: Record<string, Club>;
  nationalityFilter: string;
  onNationalityFilterChange: (value: string) => void;
  availableNationalities: string[];
  positionFilter: string;
  onPositionFilterChange: (value:string) => void;
  availablePositions: string[];
  kitDisplayIndices: Record<string, number>;
  onKitClick: (playerId: string) => void;
  saveGames: SaveGame[];
  customTags: CustomTag[];
  newgenTerm: NewgenTerm;
}

const PlayerList: React.FC<PlayerListProps> = ({
  players,
  playerCount,
  managerCount,
  onViewChange,
  selectedPlayerId,
  onSelectPlayer,
  onToggleFavourite,
  onAddPlayer,
  onOpenExportModal,
  onImportFile,
  searchQuery,
  onSearch,
  activeFilters,
  onFilterChange,
  allTags,
  allHonours,
  allClubs,
  nationalityFilter,
  onNationalityFilterChange,
  availableNationalities,
  positionFilter,
  onPositionFilterChange,
  availablePositions,
  kitDisplayIndices,
  onKitClick,
  saveGames,
  customTags,
  newgenTerm,
}) => {
  
  const importInputRef = useRef<HTMLInputElement>(null);

  const toggleFilter = (tag: string) => {
    const newFilters = activeFilters.includes(tag)
      ? activeFilters.filter(f => f !== tag)
      : [...activeFilters, tag];
    onFilterChange(newFilters);
  };

  const handleImportClick = () => {
    importInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImportFile(e.target.files[0]);
      e.target.value = ''; // Reset input so same file can be selected again
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-700/50 flex justify-between items-center">
        <select
            value="players"
            onChange={(e) => onViewChange(e.target.value as 'players' | 'managers')}
            className="text-lg font-semibold bg-transparent border-0 focus:ring-0 text-white pl-0 pr-8"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, appearance: 'none', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
        >
            <option value="players" className="text-black">Players ({playerCount})</option>
            <option value="managers" className="text-black">Managers ({managerCount})</option>
        </select>
        <div className="flex items-center gap-2">
            <input
              ref={importInputRef}
              type="file"
              className="hidden"
              accept=".json"
              onChange={handleFileChange}
            />
            <Button onClick={handleImportClick} variant="secondary" size="sm" icon={DownloadIcon}>Import</Button>
            <Button onClick={onOpenExportModal} variant="secondary" size="sm" icon={UploadIcon}>Export</Button>
            <button onClick={onAddPlayer} className="p-2 rounded-md bg-purple-600 hover:bg-purple-500 text-white transition-colors duration-200">
                <PlusIcon className="w-5 h-5" />
            </button>
        </div>
      </div>
      <div className="p-2 border-b border-gray-700/50">
        <Input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full"
        />
        <div className="flex gap-2 mt-2">
            <Select
                value={nationalityFilter}
                onChange={e => onNationalityFilterChange(e.target.value)}
                className="flex-1"
            >
                <option value="">All Nationalities</option>
                {availableNationalities.map(nat => <option key={nat} value={nat}>{nat}</option>)}
            </Select>
            <Select
                value={positionFilter}
                onChange={e => onPositionFilterChange(e.target.value)}
                className="flex-1"
            >
                <option value="">All Positions</option>
                {availablePositions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
            </Select>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
            {allTags.map(tag => (
                <button
                    key={tag}
                    onClick={() => toggleFilter(tag)}
                    className={`px-2 py-1 text-xs rounded-full transition-colors duration-200 ${
                        activeFilters.includes(tag)
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-600 hover:bg-gray-500 text-gray-200'
                    }`}
                >
                    {tag}
                </button>
            ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {players.length > 0 ? (
          <ul>
            {players.map(player => (
              <PlayerListItem
                key={player.id}
                player={player}
                isSelected={player.id === selectedPlayerId}
                onSelect={() => onSelectPlayer(player.id)}
                onToggleFavourite={onToggleFavourite}
                allHonours={allHonours}
                allClubs={allClubs}
                kitDisplayIndex={kitDisplayIndices[player.id] || 0}
                onKitClick={onKitClick}
                saveGames={saveGames}
                customTags={customTags}
                newgenTerm={newgenTerm}
              />
            ))}
          </ul>
        ) : (
          <div className="text-center p-4 text-gray-500">No players match your search.</div>
        )}
      </div>
    </div>
  );
};

export default PlayerList;