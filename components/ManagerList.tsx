
import React, { useRef } from 'react';
import { Manager, Honour, Club, SaveGame } from '../types';
import ManagerListItem from './ManagerListItem';
import Input from './ui/Input';
import Button from './ui/Button';
import { PlusIcon } from './icons/PlusIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { UploadIcon } from './icons/UploadIcon';

interface ManagerListProps {
  managers: Manager[];
  playerCount: number;
  managerCount: number;
  onViewChange: (view: 'players' | 'managers') => void;
  selectedManagerId: string | null;
  onSelectManager: (id: string) => void;
  onToggleFavourite: (id: string) => void;
  onAddManager: () => void;
  onOpenExportModal: () => void;
  onImportFile: (file: File) => void;
  searchQuery: string;
  onSearch: (query: string) => void;
  allHonours: Honour[];
  allClubs: Record<string, Club>;
  saveGames: SaveGame[];
}

const ManagerList: React.FC<ManagerListProps> = ({
  managers,
  playerCount,
  managerCount,
  onViewChange,
  selectedManagerId,
  onSelectManager,
  onToggleFavourite,
  onAddManager,
  onOpenExportModal,
  onImportFile,
  searchQuery,
  onSearch,
  allHonours,
  allClubs,
  saveGames,
}) => {
  const importInputRef = useRef<HTMLInputElement>(null);

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
          value="managers"
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
            <button onClick={onAddManager} className="p-2 rounded-md bg-purple-600 hover:bg-purple-500 text-white transition-colors duration-200">
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
        {/* TODO: Add filters for managers if needed */}
      </div>
      <div className="flex-1 overflow-y-auto">
        {managers.length > 0 ? (
          <ul>
            {managers.map(manager => (
              <ManagerListItem
                key={manager.id}
                manager={manager}
                isSelected={manager.id === selectedManagerId}
                onSelect={() => onSelectManager(manager.id)}
                onToggleFavourite={onToggleFavourite}
                allHonours={allHonours}
                allClubs={allClubs}
                saveGames={saveGames}
              />
            ))}
          </ul>
        ) : (
          <div className="text-center p-4 text-gray-500">No managers match your search.</div>
        )}
      </div>
    </div>
  );
};

export default ManagerList;
