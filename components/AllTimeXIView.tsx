import React, { useState, useMemo, useCallback } from 'react';
import { Player, Club, AllTimeXI, SavedSquad } from '../types';
import { FORMATIONS } from '../constants';
import Pitch from './Pitch';
import DraggablePlayerCard from './DraggablePlayerCard';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import { DownloadIcon } from './icons/DownloadIcon';
import { UploadIcon } from './icons/UploadIcon';

interface AllTimeXIViewProps {
  allPlayers: Player[];
  allClubs: Record<string, Club>;
  allTimeXI: AllTimeXI;
  onPlacePlayer: (position: string, playerId: string) => void;
  onRemovePlayer: (position: string) => void;
  onUpdateXI: (newXI: AllTimeXI) => void;
  kitDisplayIndices: Record<string, number>;
  onKitClick: (playerId: string) => void;
}

type SortKey = 'name' | 'position';

const AllTimeXIView: React.FC<AllTimeXIViewProps> = ({
  allPlayers,
  allClubs,
  allTimeXI,
  onPlacePlayer,
  onRemovePlayer,
  onUpdateXI,
  kitDisplayIndices,
  onKitClick
}) => {
  const [formation, setFormation] = useState(Object.keys(FORMATIONS)[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [squadName, setSquadName] = useState('My All-Time XI');
  const [loadedSquad, setLoadedSquad] = useState<SavedSquad | null>(null);

  const formationPositions = useMemo(() => FORMATIONS[formation], [formation]);

  const playersOnPitch = useMemo(() => {
    const sourcePlayers = loadedSquad ? loadedSquad.players : allPlayers;
    return Object.values(allTimeXI)
      .filter(Boolean)
      .map(playerId => sourcePlayers.find(p => p.id === playerId))
      .filter((p): p is Player => p !== undefined);
  }, [allTimeXI, allPlayers, loadedSquad]);

  const handleSaveSquad = () => {
    const squadToSave: SavedSquad = {
      squadName,
      formation,
      xi: allTimeXI,
      players: playersOnPitch,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(squadToSave, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `${squadName.replace(/\s+/g, '_') || 'all-time-xi'}.json`;
    link.click();
  };

  const handleLoadSquad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target?.result as string;
          const parsedSquad = JSON.parse(result) as SavedSquad;
          if (parsedSquad.squadName && parsedSquad.formation && parsedSquad.xi && Array.isArray(parsedSquad.players)) {
            setSquadName(parsedSquad.squadName);
            setFormation(parsedSquad.formation);
            onUpdateXI(parsedSquad.xi);
            setLoadedSquad(parsedSquad);
          } else {
            alert('Invalid squad file format.');
          }
        } catch (error) {
          console.error("Failed to parse squad file:", error);
          alert('Failed to load squad file. Make sure it is a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const triggerLoadSquad = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => handleLoadSquad(e as any);
    input.click();
  };

  const handleClearPitch = () => {
    if (window.confirm('Are you sure you want to clear all players from the pitch?')) {
      const newXI: AllTimeXI = {};
      Object.keys(allTimeXI).forEach(pos => {
        newXI[pos] = null;
      });
      onUpdateXI(newXI);
      setLoadedSquad(null);
    }
  };

  const filteredAndSortedPlayers = useMemo(() => {
    const getDisplayName = (p: Player) => p.knownAs || `${p.firstName} ${p.lastName}`;
    const lowerCaseQuery = searchQuery.toLowerCase();

    const filtered = allPlayers.filter(player => {
      const fullName = `${player.firstName} ${player.lastName}`;
      const nameMatch =
        fullName.toLowerCase().includes(lowerCaseQuery) ||
        player.knownAs.toLowerCase().includes(lowerCaseQuery);
      return nameMatch;
    });

    return filtered.sort((a, b) => {
      if (sortKey === 'name') {
        return getDisplayName(a).localeCompare(getDisplayName(b));
      }
      if (sortKey === 'position') {
        return a.primaryPosition.localeCompare(b.primaryPosition);
      }
      return 0;
    });
  }, [allPlayers, searchQuery, sortKey]);

  const handleDropOnPlayerList = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const fromPosition = e.dataTransfer.getData('fromPosition');
    if (fromPosition) {
      onRemovePlayer(fromPosition);
    }
  };

  const playersForPitch = useMemo(() => {
    return loadedSquad ? loadedSquad.players : allPlayers;
  }, [loadedSquad, allPlayers]);

  return (
    <div className="flex h-full gap-4">
      <div className="w-2/3 flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4 bg-gray-800/60 p-2 rounded-lg border border-gray-700/50 flex-wrap">
          <div className="flex items-center gap-4 flex-grow">
            <Input
              value={squadName}
              onChange={e => setSquadName(e.target.value)}
              className="bg-transparent border-0 text-xl font-bold text-white focus:ring-0 focus:bg-gray-700/50"
            />
            <div className="flex items-center gap-2">
              <label htmlFor="formation-select" className="text-sm font-semibold text-gray-400">Formation</label>
              <Select id="formation-select" value={formation} onChange={e => setFormation(e.target.value)}>
                {Object.keys(FORMATIONS).map(f => <option key={f} value={f}>{f}</option>)}
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={triggerLoadSquad} variant="secondary" size="sm" icon={DownloadIcon}>Load</Button>
            <Button onClick={handleSaveSquad} variant="primary" size="sm" icon={UploadIcon}>Save</Button>
            <Button onClick={handleClearPitch} variant="danger" size="sm">Clear Pitch</Button>
          </div>
        </div>
        <div className="flex-1 bg-gray-800/60 rounded-lg border border-gray-700/50 p-4 relative overflow-hidden flex items-center justify-center">
          <Pitch
            formation={formationPositions}
            placedPlayers={allTimeXI}
            allPlayers={playersForPitch}
            allClubs={allClubs}
            onPlacePlayer={onPlacePlayer}
            kitDisplayIndices={kitDisplayIndices}
            onKitClick={onKitClick}
          />
        </div>
      </div>

      <div className="w-1/3 max-w-sm flex flex-col bg-gray-800/60 rounded-lg border border-gray-700/50">
        <div className="p-3 border-b border-gray-700/50">
          <h2 className="text-lg font-semibold mb-2">Available Players</h2>
          <Input
            type="text"
            placeholder="Search players..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <div className="mt-2">
            <label htmlFor="sort-select" className="sr-only">Sort by</label>
            <Select id="sort-select" value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)} className="text-xs">
              <option value="name">Sort by Name</option>
              <option value="position">Sort by Position</option>
            </Select>
          </div>
        </div>
        <div 
          className="flex-1 overflow-y-auto p-2"
          onDragOver={e => e.preventDefault()}
          onDrop={handleDropOnPlayerList}
        >
          <div className="grid grid-cols-1 gap-2">
            {filteredAndSortedPlayers.map(player => (
              <DraggablePlayerCard
                key={player.id}
                player={player}
                allClubs={allClubs}
                onKitClick={onKitClick}
                kitDisplayIndex={kitDisplayIndices[player.id] || 0}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllTimeXIView;
