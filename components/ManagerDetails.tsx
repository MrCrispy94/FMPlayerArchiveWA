

import React, { useState, useEffect, useMemo } from 'react';
import type { Manager, ManagerSeasonStat, ManagerClubHistory, Honour, Club, SaveGame, TrophyCabinetSettings, ManagerAttributes, ManagerStyle, LeagueTableRow } from '../types';
import ManagerAttireIcon from './icons/ManagerAttireIcon';
import { FlagIcon } from './icons/FlagIcon';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import Checkbox from './ui/Checkbox';
import ManagerAttributeTable from './ManagerAttributeTable';
import HonoursModal from './HonoursModal';
import { v4 as uuidv4 } from 'uuid';
import { CONTINENTS, getHonourInfo, COACHING_BADGES, MANAGER_STYLES } from '../constants';
import Combobox from './ui/Combobox';
import Modal from './ui/Modal';
import CreateClubForm from './CreateClubForm';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { StarIcon } from './icons/StarIcon';
import { CabinetIcon } from './icons/CabinetIcon';
import ManagerTrophyCabinetModal from './ManagerTrophyCabinetModal';
import { GoldTrophyIcon } from './icons/GoldTrophyIcon';
import { BootAwardIcon } from './icons/BootAwardIcon';
import ImportManagerSeasonModal from './ImportManagerSeasonModal';
import ImportLeagueTableModal from './ImportLeagueTableModal';
import LeagueTableModal from './LeagueTableModal';

interface ManagerDetailsProps {
  manager: Manager;
  onSave: (manager: Manager) => void;
  onDelete: (managerId: string) => void;
  onToggleFavourite: (managerId: string) => void;
  onAddClub: (club: Club) => void;
  allHonours: Honour[];
  allClubs: Record<string, Club>;
  saveGames: SaveGame[];
  fmVersions: string[];
  customIcons: Record<string, string>;
  trophyCabinetSettings: TrophyCabinetSettings;
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
  if (tag.startsWith('CM')) {
    return { backgroundColor: '#3b82f6', color: 'white' };
  }
  if (tag.startsWith('FM')) {
    return { backgroundColor: '#8b5cf6', color: 'white' };
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

const ManagerDetails: React.FC<ManagerDetailsProps> = ({ manager, onSave, onDelete, onToggleFavourite, onAddClub, allHonours, allClubs, saveGames, fmVersions, customIcons, trophyCabinetSettings }) => {
  const [editedManager, setEditedManager] = useState<Manager>({ ...manager });
  const [isEditing, setIsEditing] = useState(false);
  const [isHonoursModalOpen, setIsHonoursModalOpen] = useState(false);
  const [isTrophyCabinetOpen, setIsTrophyCabinetOpen] = useState(false);
  const [editingHonoursForSeasonId, setEditingHonoursForSeasonId] = useState<string | null>(null);
  const [isImportStatsModalOpen, setIsImportStatsModalOpen] = useState(false);
  const [isImportLeagueTableModalOpen, setIsImportLeagueTableModalOpen] = useState(false);
  const [editingStatsForSeasonId, setEditingStatsForSeasonId] = useState<string | null>(null);
  const [viewingTableForSeasonId, setViewingTableForSeasonId] = useState<string | null>(null);
  
  const [isCreateClubModalOpen, setCreateClubModalOpen] = useState(false);
  const [newClubNameToCreate, setNewClubNameToCreate] = useState('');
  const [isStatsExpanded, setIsStatsExpanded] = useState(true);
  const [isClubHistoryExpanded, setIsClubHistoryExpanded] = useState(false);

  const displayName = manager.knownAs || `${manager.firstName} ${manager.lastName}`;

  useEffect(() => {
    setEditedManager({ ...manager });
    // Automatically enter edit mode for new managers, otherwise reset to view mode.
    setIsEditing(manager.firstName === 'New' && manager.lastName === 'Manager');
    setIsStatsExpanded(true);
  }, [manager]);

  const handleSave = () => {
    onSave(editedManager);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedManager({ ...manager });
    setIsEditing(false);
  };

  const handleChange = (field: keyof Manager, value: any) => {
    setEditedManager(prev => ({ ...prev, [field]: value }));
  };

  const handleStatChange = (index: number, field: keyof ManagerSeasonStat, value: any) => {
    const newStats = [...editedManager.seasonStats];
    (newStats[index] as any)[field] = value;
    handleChange('seasonStats', newStats);
  };
  
  const handleAddStatRow = () => {
      const newStat: ManagerSeasonStat = { id: uuidv4(), season: '2025/26', club: editedManager.currentClub, league: '', wins: 0, losses: 0, draws: 0, leaguePosition: 'N/A', honours: {} };
      handleChange('seasonStats', [...editedManager.seasonStats, newStat]);
  };
  
  const handleRemoveStatRow = (id: string) => {
      handleChange('seasonStats', editedManager.seasonStats.filter(s => s.id !== id));
  };
  
  const handleClubHistoryChange = (index: number, field: keyof ManagerClubHistory, value: any) => {
    const newHistory = [...editedManager.clubHistory];
    (newHistory[index] as any)[field] = value;
    handleChange('clubHistory', newHistory);
  };

  const handleAddClubHistoryRow = () => {
    const newClub: ManagerClubHistory = { id: uuidv4(), clubName: editedManager.currentClub, startYear: new Date().getFullYear(), endYear: 'Present', gamesManaged: 0, winRatio: 0 };
    handleChange('clubHistory', [...editedManager.clubHistory, newClub]);
  };

  const handleRemoveClubHistoryRow = (id: string) => {
    handleChange('clubHistory', editedManager.clubHistory.filter(c => c.id !== id));
  };

  const handleAttributeChange = (category: keyof ManagerAttributes, attribute: keyof ManagerAttributes, value: number) => {
    setEditedManager(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [attribute]: value,
      },
    }));
  };
  
  const handleOpenHonoursModal = (seasonId: string) => {
      setEditingHonoursForSeasonId(seasonId);
      setIsHonoursModalOpen(true);
  }

  const handleSaveHonours = (newHonours: Record<string, number>) => {
      if(!editingHonoursForSeasonId) return;
      const seasonIndex = editedManager.seasonStats.findIndex(s => s.id === editingHonoursForSeasonId);
      if(seasonIndex > -1) {
          handleStatChange(seasonIndex, 'honours', newHonours);
      }
      setIsHonoursModalOpen(false);
      setEditingHonoursForSeasonId(null);
  }

  const handleOpenCreateClubModal = (clubName: string) => {
    setNewClubNameToCreate(clubName);
    setCreateClubModalOpen(true);
  }

  const handleSaveNewClub = (newClub: Club) => {
    onAddClub(newClub);
    if (newClubNameToCreate === editedManager.currentClub) {
        handleChange('currentClub', newClub.name);
    }
    setCreateClubModalOpen(false);
  }

  const handleOpenImportStatsModal = (seasonId: string) => {
    setEditingStatsForSeasonId(seasonId);
    setIsImportStatsModalOpen(true);
  };
  
  const handleOpenImportLeagueTableModal = (seasonId: string) => {
    setEditingStatsForSeasonId(seasonId);
    setIsImportLeagueTableModalOpen(true);
  };

  const handleImportStats = (stats: { wins: number; losses: number; draws: number }) => {
    if (!editingStatsForSeasonId) return;
    const seasonIndex = editedManager.seasonStats.findIndex(s => s.id === editingStatsForSeasonId);
    if (seasonIndex > -1) {
        const newStats = [...editedManager.seasonStats];
        newStats[seasonIndex] = {
            ...newStats[seasonIndex],
            wins: stats.wins,
            losses: stats.losses,
            draws: stats.draws,
        };
        handleChange('seasonStats', newStats);
    }
    setEditingStatsForSeasonId(null);
  };

  const handleImportLeagueTable = (tableData: LeagueTableRow[]) => {
    if (!editingStatsForSeasonId) return;
    const seasonIndex = editedManager.seasonStats.findIndex(s => s.id === editingStatsForSeasonId);
    if (seasonIndex > -1) {
        const newStats = [...editedManager.seasonStats];
        newStats[seasonIndex] = {
            ...newStats[seasonIndex],
            leagueTable: tableData,
        };
        handleChange('seasonStats', newStats);
    }
    setEditingStatsForSeasonId(null);
  };

    const honoursCount = useMemo(() => {
        let team = 0;
        let personal = 0;
        manager.seasonStats.forEach(season => {
            for (const honourId in season.honours) {
                const count: number = season.honours[honourId];
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
    
    const clubHistoryTotals = useMemo(() => {
        const numClubs = new Set(manager.clubHistory.map(h => h.clubName)).size;
        const totalGames = manager.clubHistory.reduce((sum, h) => sum + h.gamesManaged, 0);
        return { numClubs, totalGames };
    }, [manager.clubHistory]);

  const nationalityContinent = Object.keys(CONTINENTS).find(c => CONTINENTS[c].includes(editedManager.nationality)) || 'Europe';
  
  const displayedClub = allClubs[editedManager.currentClub];
  
  const seasonForHonoursModal = useMemo(() => {
    return editedManager.seasonStats.find(s => s.id === editingHonoursForSeasonId);
  }, [editedManager.seasonStats, editingHonoursForSeasonId]);
  
  const viewingSeason = useMemo(() => {
    return editedManager.seasonStats.find(s => s.id === viewingTableForSeasonId);
  }, [editedManager.seasonStats, viewingTableForSeasonId]);
  
  const saveGameOptions = useMemo(() => saveGames.map(s => s.name), [saveGames]);

  const careerTotals = useMemo(() => {
    let wins = 0, losses = 0, draws = 0, totalHonours = 0;
    editedManager.seasonStats.forEach(s => {
        wins += Number(s.wins) || 0;
        losses += Number(s.losses) || 0;
        draws += Number(s.draws) || 0;
        totalHonours += Object.values(s.honours).reduce((sum: number, count: number) => sum + count, 0);
    });
    const totalGames = wins + losses + draws;
    const winRatio = totalGames > 0 ? (wins / totalGames) * 100 : 0;

    return { totalGames, wins, losses, draws, winRatio, totalHonours };
  }, [editedManager.seasonStats]);

  return (
    <div className="p-4 sm:p-6 space-y-6 h-full flex flex-col">
        <HonoursModal
            isOpen={isHonoursModalOpen}
            onClose={() => setIsHonoursModalOpen(false)}
            allHonours={allHonours}
            selectedHonours={seasonForHonoursModal?.honours || {}}
            onSave={handleSaveHonours as (selection: Record<string, number>) => void}
            awardType="manager"
        />

        <ImportManagerSeasonModal
            isOpen={isImportStatsModalOpen}
            onClose={() => setIsImportStatsModalOpen(false)}
            onImport={handleImportStats}
        />
        
        <ImportLeagueTableModal
            isOpen={isImportLeagueTableModalOpen}
            onClose={() => setIsImportLeagueTableModalOpen(false)}
            onImport={handleImportLeagueTable}
        />

        <LeagueTableModal
            isOpen={!!viewingTableForSeasonId}
            onClose={() => setViewingTableForSeasonId(null)}
            season={viewingSeason}
        />

        <ManagerTrophyCabinetModal 
            isOpen={isTrophyCabinetOpen}
            onClose={() => setIsTrophyCabinetOpen(false)}
            manager={manager}
            allHonours={allHonours}
            customIcons={customIcons}
            trophyCabinetSettings={trophyCabinetSettings}
        />

        <Modal isOpen={isCreateClubModalOpen} onClose={() => setCreateClubModalOpen(false)} title={`Create New Club: ${newClubNameToCreate}`}>
            <CreateClubForm
                initialName={newClubNameToCreate}
                allClubs={allClubs}
                onSave={handleSaveNewClub}
                onCancel={() => setCreateClubModalOpen(false)}
            />
        </Modal>

        {/* Header */}
        <div className="flex justify-between items-start">
            <div className="flex items-start gap-4">
                <div className="text-center">
                    <ManagerAttireIcon 
                        style={editedManager.managerStyle}
                        club={displayedClub}
                        size="lg"
                    />
                </div>
                <div>
                    {isEditing ? (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                             <div className="col-span-1">
                                <label className="text-xs text-gray-400">First Name</label>
                                <Input value={editedManager.firstName} onChange={e => handleChange('firstName', e.target.value)} />
                            </div>
                            <div className="col-span-1">
                                <label className="text-xs text-gray-400">Last Name</label>
                                <Input value={editedManager.lastName} onChange={e => handleChange('lastName', e.target.value)} />
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs text-gray-400">Common Name (optional)</label>
                                <Input value={editedManager.knownAs} onChange={e => handleChange('knownAs', e.target.value)} />
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-bold text-white">{displayName}</h2>
                            <button
                                onClick={() => onToggleFavourite(manager.id)}
                                className={`transition-colors duration-200 ${manager.isFavourite ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-500 hover:text-yellow-400'}`}
                                aria-label={manager.isFavourite ? 'Remove from favourites' : 'Add to favourites'}
                            >
                                <StarIcon filled={manager.isFavourite} className="w-7 h-7" />
                            </button>
                        </div>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-gray-300">
                        {isEditing ? (
                            <>
                                <Select value={nationalityContinent} onChange={e => handleChange('nationality', CONTINENTS[e.target.value][0])}>
                                    {Object.keys(CONTINENTS).map(c => <option key={c} value={c}>{c}</option>)}
                                </Select>
                                <Select value={editedManager.nationality} onChange={e => handleChange('nationality', e.target.value)}>
                                    {CONTINENTS[nationalityContinent].map(n => <option key={n} value={n}>{n}</option>)}
                                </Select>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <FlagIcon nationality={manager.nationality} className="w-6 h-5" />
                                <span>{manager.nationality}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {isEditing ? (
                    <>
                        <Button onClick={handleSave} variant="primary">Save</Button>
                        <Button onClick={handleCancel} variant="secondary">Cancel</Button>
                    </>
                ) : (
                    <>
                        <Button onClick={() => setIsEditing(true)} variant="secondary" icon={PencilIcon}>Edit</Button>
                        <Button onClick={() => onDelete(manager.id)} variant="danger" icon={TrashIcon}>Delete</Button>
                    </>
                )}
            </div>
        </div>
        
        {/* Core Info & Tags */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-900/50 rounded-lg">
            <div>
                <label className="text-xs text-gray-400">Coaching Badge</label>
                {isEditing ? (
                    <Select value={editedManager.coachingBadge} onChange={e => handleChange('coachingBadge', e.target.value)}>
                        {COACHING_BADGES.map(b => <option key={b} value={b}>{b}</option>)}
                    </Select>
                ) : <p className="text-lg font-semibold">{manager.coachingBadge}</p>}
            </div>
            <div>
                <label className="text-xs text-gray-400">Manager Style</label>
                {isEditing ? (
                    <Select value={editedManager.managerStyle} onChange={e => handleChange('managerStyle', e.target.value as ManagerStyle)}>
                        {MANAGER_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                ) : <p className="text-lg font-semibold">{manager.managerStyle}</p>}
            </div>
             <div className="col-span-2">
                <label className="text-xs text-gray-400">Current Club</label>
                 {isEditing ? (
                     <Combobox
                        options={Object.keys(allClubs)}
                        value={editedManager.currentClub}
                        onChange={value => handleChange('currentClub', value)}
                        onAddNew={(name) => {
                            handleChange('currentClub', name);
                            handleOpenCreateClubModal(name);
                        }}
                        placeholder="Select or create a club..."
                     />
                 ) : <p className="text-lg font-semibold">{manager.currentClub}</p>}
            </div>
            <div className="col-span-full">
                 <label className="text-xs text-gray-400">Metadata</label>
                 {isEditing ? (
                     <div className="flex flex-wrap items-center gap-4 mt-1">
                        <Select value={editedManager.fmVersion} onChange={e => handleChange('fmVersion', e.target.value)}>
                             {fmVersions.map(v => <option key={v} value={v}>{v}</option>)}
                        </Select>
                        <Select value={editedManager.saveGameName} onChange={e => handleChange('saveGameName', e.target.value)}>
                            {saveGameOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        </Select>
                        <Checkbox label="Favourite" checked={editedManager.isFavourite} onChange={e => handleChange('isFavourite', e.target.checked)} />
                     </div>
                 ) : (
                    <div className="flex flex-wrap gap-2 mt-1">
                        {[manager.fmVersion, manager.saveGameName].filter(Boolean).map(tag => (
                            <span 
                                key={tag as string}
                                style={getTagStyle(tag as string, saveGames)}
                                className="px-3 py-1 text-sm rounded-full font-medium"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                 )}
            </div>
        </div>

        {/* Honours & Stats Tabs */}
        <div className="flex-1 space-y-4 overflow-y-auto pr-2">
             {/* Club History */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold">Club History</h3>
                        <button onClick={() => setIsClubHistoryExpanded(prev => !prev)} className="text-gray-400 hover:text-white" aria-expanded={isClubHistoryExpanded} aria-controls="club-history-table">
                            <span className="sr-only">{isClubHistoryExpanded ? 'Collapse' : 'Expand'} club history</span>
                            <ChevronDownIcon className={`w-5 h-5 transition-transform ${isClubHistoryExpanded ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                     {isEditing && <Button onClick={handleAddClubHistoryRow} variant="secondary" size="sm" icon={PlusIcon}>Add</Button>}
                </div>
                 <div className="bg-gray-800/60 font-bold text-white p-3 rounded-lg flex justify-around mb-2">
                    <span>Clubs Managed: <span className="text-green-400">{clubHistoryTotals.numClubs}</span></span>
                    <span>Total Games: <span className="text-yellow-400">{clubHistoryTotals.totalGames}</span></span>
                </div>
                {isClubHistoryExpanded && (
                    <div className="bg-gray-900/50 rounded-lg overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-700/50 text-xs text-gray-300 uppercase tracking-wider">
                                <tr>
                                    <th className="p-3">Club</th><th className="p-3">Duration</th><th className="p-3">Games</th><th className="p-3">Win %</th>
                                    {isEditing && <th className="p-3"></th>}
                                </tr>
                            </thead>
                            <tbody className="text-white">
                                {[...editedManager.clubHistory].sort((a, b) => {
                                    const endA = a.endYear === 'Present' ? Infinity : Number(a.endYear);
                                    const endB = b.endYear === 'Present' ? Infinity : Number(b.endYear);
                                    if (endA !== endB) return endB - endA;
                                    return Number(b.startYear) - Number(a.startYear);
                                }).map((club) => {
                                    const index = editedManager.clubHistory.findIndex(c => c.id === club.id);
                                    return (
                                    <tr key={club.id} className="border-t border-gray-700/50">
                                        <td className="p-3">
                                            {isEditing ? (
                                                <Combobox
                                                    options={Object.keys(allClubs)}
                                                    value={club.clubName}
                                                    onChange={value => handleClubHistoryChange(index, 'clubName', value)}
                                                    onAddNew={handleOpenCreateClubModal}
                                                    placeholder="Select or create club..."
                                                />
                                            ) : club.clubName}
                                        </td>
                                        <td className="p-3">{isEditing ? <div className="flex gap-2"><Input type="number" value={club.startYear} onChange={e => handleClubHistoryChange(index, 'startYear', parseInt(e.target.value) || 0)} /><Input value={club.endYear} onChange={e => handleClubHistoryChange(index, 'endYear', e.target.value)} /></div> : `${club.startYear} - ${club.endYear}`}</td>
                                        <td className="p-3">{isEditing ? <Input type="number" value={club.gamesManaged} onChange={e => handleClubHistoryChange(index, 'gamesManaged', parseInt(e.target.value) || 0)} /> : club.gamesManaged}</td>
                                        <td className="p-3">{isEditing ? <Input type="number" value={club.winRatio} onChange={e => handleClubHistoryChange(index, 'winRatio', parseFloat(e.target.value) || 0)} /> : `${club.winRatio.toFixed(1)}%`}</td>
                                        {isEditing && <td className="p-3"><Button onClick={() => handleRemoveClubHistoryRow(club.id)} variant="danger" size="sm" icon={TrashIcon}></Button></td>}
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Season Stats */}
            <div>
                 <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold">Season Stats</h3>
                        <button onClick={() => setIsStatsExpanded(prev => !prev)} className="text-gray-400 hover:text-white" aria-expanded={isStatsExpanded} aria-controls="season-stats-table">
                            <span className="sr-only">{isStatsExpanded ? 'Collapse' : 'Expand'} season stats</span>
                            <ChevronDownIcon className={`w-5 h-5 transition-transform ${isStatsExpanded ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                    {isEditing && <Button onClick={handleAddStatRow} variant="secondary" size="sm" icon={PlusIcon}>Add</Button>}
                </div>
                 <div className="bg-gray-900/50 rounded-lg overflow-hidden">
                    <table id="season-stats-table" className="w-full text-left">
                        <thead className="bg-gray-700/50 text-xs text-gray-300 uppercase tracking-wider">
                            <tr>
                                <th className="p-3">Season</th><th className="p-3">Club</th><th className="p-3">League</th><th className="p-3">W</th><th className="p-3">D</th><th className="p-3">L</th><th className="p-3">Pos</th><th className="p-3 text-center">Actions</th>
                                {isEditing && <th className="p-3"></th>}
                            </tr>
                        </thead>
                        {isStatsExpanded && (
                            <tbody className="text-white">
                                {[...editedManager.seasonStats].sort((a, b) => parseInt(b.season.split('/')[0], 10) - parseInt(a.season.split('/')[0], 10)).map((stat) => {
                                    const index = editedManager.seasonStats.findIndex(s => s.id === stat.id);
                                    const honoursCount = Object.values(stat.honours).reduce((sum: number, count: number) => sum + count, 0);
                                    return (
                                        <tr key={stat.id} className="border-t border-gray-700/50">
                                            <td className="p-3">{isEditing ? <Input value={stat.season} onChange={e => handleStatChange(index, 'season', e.target.value)} /> : stat.season}</td>
                                            <td className="p-3">{isEditing ? <Input value={stat.club} onChange={e => handleStatChange(index, 'club', e.target.value)} /> : stat.club}</td>
                                            <td className="p-3">{isEditing ? <Input value={stat.league} onChange={e => handleStatChange(index, 'league', e.target.value)} /> : stat.league}</td>
                                            <td className="p-3">{isEditing ? <Input type="number" value={stat.wins} onChange={e => handleStatChange(index, 'wins', parseInt(e.target.value) || 0)} /> : stat.wins}</td>
                                            <td className="p-3">{isEditing ? <Input type="number" value={stat.draws} onChange={e => handleStatChange(index, 'draws', parseInt(e.target.value) || 0)} /> : stat.draws}</td>
                                            <td className="p-3">{isEditing ? <Input type="number" value={stat.losses} onChange={e => handleStatChange(index, 'losses', parseInt(e.target.value) || 0)} /> : stat.losses}</td>
                                            <td className="p-3">{isEditing ? <Input value={stat.leaguePosition} onChange={e => handleStatChange(index, 'leaguePosition', e.target.value)} /> : stat.leaguePosition}</td>
                                            <td className="p-3">
                                                {isEditing ? (
                                                    <div className="flex items-center gap-2">
                                                        <Button onClick={() => handleOpenImportStatsModal(stat.id)} variant="secondary" size="sm" title="Import season results from a text file">Import Results</Button>
                                                        <Button onClick={() => handleOpenImportLeagueTableModal(stat.id)} variant="secondary" size="sm" title="Import league table from HTML">Import Table</Button>
                                                        <Button onClick={() => handleOpenHonoursModal(stat.id)} size="sm" variant="secondary" title="Manage honours">Honours ({honoursCount})</Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <span>{honoursCount} Honours</span>
                                                        {stat.leagueTable && stat.leagueTable.length > 0 && (
                                                            <Button onClick={() => setViewingTableForSeasonId(stat.id)} variant="secondary" size="sm">View Table</Button>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            {isEditing && <td className="p-3"><Button onClick={() => handleRemoveStatRow(stat.id)} variant="danger" size="sm" icon={TrashIcon}></Button></td>}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        )}
                        <tfoot className="bg-gray-800/60 font-bold text-white border-t-2 border-purple-500/50">
                             <tr>
                                <td className="p-3">Career Total</td>
                                <td colSpan={2} className="p-3">{careerTotals.totalGames} games</td>
                                <td className="p-3">{careerTotals.wins}</td>
                                <td className="p-3">{careerTotals.draws}</td>
                                <td className="p-3">{careerTotals.losses}</td>
                                <td className="p-3">{careerTotals.winRatio.toFixed(1)}% Win Rate</td>
                                <td className="p-3 text-center">{careerTotals.totalHonours} Honours</td>
                                {isEditing && <td className="p-3"></td>}
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Honours */}
             <div>
                <h3 className="text-xl font-semibold mb-2">Career Honours</h3>
                 <div className="p-4 bg-gray-900/50 rounded-lg flex items-center justify-between">
                     <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <GoldTrophyIcon className="w-6 h-6" />
                            <span className="text-xl font-bold">{honoursCount.team}</span>
                            <span className="text-gray-400">Team Trophies</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <BootAwardIcon className="w-6 h-6" />
                            <span className="text-xl font-bold">{honoursCount.personal}</span>
                            <span className="text-gray-400">Personal Awards</span>
                        </div>
                     </div>
                     <Button onClick={() => setIsTrophyCabinetOpen(true)} variant="secondary" size="sm" icon={CabinetIcon}>
                        View Cabinet
                     </Button>
                 </div>
            </div>
            
            {/* Attributes */}
            <div>
                <h3 className="text-xl font-semibold mb-2">Attributes</h3>
                <ManagerAttributeTable 
                    attributes={editedManager.attributes} 
                    isEditing={isEditing} 
                    onChange={handleAttributeChange}
                />
            </div>
        </div>
        {manager.originalManager && (
            <p className="text-right text-xs text-gray-500 italic mt-auto pt-4">
                Original Manager - {manager.originalManager}
            </p>
         )}
    </div>
  );
};

export default ManagerDetails;
