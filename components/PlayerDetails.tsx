import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { Player, SeasonStat, ClubHistory, Honour, Club, SaveGame, TrophyCabinetSettings, NewgenTerm, AttributeSnapshot, Attributes, DateFormatOption, CurrencyOption, CustomTag } from '../types';
import Kit from './Kit';
import { FlagIcon } from './icons/FlagIcon';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import Checkbox from './ui/Checkbox';
import AttributeTable from './AttributeTable';
import HonoursModal from './HonoursModal';
import { v4 as uuidv4 } from 'uuid';
import { CONTINENTS, POSITIONS, getHonourInfo, getCurrencySymbol } from '../constants';
import Combobox from './ui/Combobox';
import Modal from './ui/Modal';
import CreateClubForm from './CreateClubForm';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { StarIcon } from './icons/StarIcon';
import { CabinetIcon } from './icons/CabinetIcon';
import TrophyCabinetModal from './TrophyCabinetModal';
import { GoldTrophyIcon } from './icons/GoldTrophyIcon';
import { BootAwardIcon } from './icons/BootAwardIcon';
import { SilhouetteIcon } from './icons/SilhouetteIcon';
import AttributeSnapshotModal from './AttributeSnapshotModal';
import { UpdateAttributesModal } from './UpdateAttributesModal';
import ManageHistoryModal from './ManageHistoryModal';
import { UpArrowIcon } from './icons/UpArrowIcon';
import { DownArrowIcon } from './icons/DownArrowIcon';
import ImageCropModal from './ImageCropModal';

interface PlayerDetailsProps {
  player: Player;
  onSave: (player: Player) => void;
  onDelete: (playerId: string) => void;
  onToggleFavourite: (playerId: string) => void;
  onAddClub: (club: Club) => void;
  allHonours: Honour[];
  allClubs: Record<string, Club>;
  allLeagues: Record<string, string[]>;
  saveGames: SaveGame[];
  fmVersions: string[];
  customIcons: Record<string, string>;
  trophyCabinetSettings: TrophyCabinetSettings;
  kitDisplayIndex: number;
  onKitClick: (playerId: string) => void;
  newgenTerm: NewgenTerm;
  dateFormat: DateFormatOption;
  currency: CurrencyOption;
  customTags: CustomTag[];
  facesPath: string;
  facepackConfig: Record<string, string>;
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

const calculateAge = (birthDateString: string, onDateString?: string): number => {
  if (!birthDateString) return 0;
  try {
    const birthDate = new Date(birthDateString);
    const onDate = onDateString ? new Date(onDateString) : new Date();
    if (isNaN(birthDate.getTime()) || isNaN(onDate.getTime())) return 0;
    
    let age = onDate.getFullYear() - birthDate.getFullYear();
    const m = onDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && onDate.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  } catch (e) {
    return 0;
  }
};

const formatDate = (dateString: string, format: DateFormatOption): string => {
    if (!dateString) return 'N/A';
    try {
        // Handle yyyy-mm-dd from input type=date
        const parts = dateString.split('-');
        if (parts.length === 3) {
            const [year, month, day] = parts;
            return format === 'dd/mm/yyyy' ? `${day}/${month}/${year}` : `${month}/${day}/${year}`;
        }
        // Handle other parsable formats
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return format === 'dd/mm/yyyy' ? `${day}/${month}/${year}` : `${month}/${day}/${year}`;
    } catch (e) {
        return 'Invalid Date';
    }
};


const PlayerDetails: React.FC<PlayerDetailsProps> = ({ player, onSave, onDelete, onToggleFavourite, onAddClub, allHonours, allClubs, allLeagues, saveGames, fmVersions, customIcons, trophyCabinetSettings, kitDisplayIndex, onKitClick, newgenTerm, dateFormat, currency, customTags, facesPath, facepackConfig }) => {
  const [editedPlayer, setEditedPlayer] = useState<Player>({ ...player });
  const [isEditing, setIsEditing] = useState(false);
  const [isHonoursModalOpen, setIsHonoursModalOpen] = useState(false);
  const [isTrophyCabinetOpen, setIsTrophyCabinetOpen] = useState(false);
  const [editingHonoursForSeasonId, setEditingHonoursForSeasonId] = useState<string | null>(null);
  
  const [isCreateClubModalOpen, setCreateClubModalOpen] = useState(false);
  const [isImageCropModalOpen, setIsImageCropModalOpen] = useState(false);
  const [newClubNameToCreate, setNewClubNameToCreate] = useState('');
  const [isStatsExpanded, setIsStatsExpanded] = useState(true);
  const [isSnapshotModalOpen, setSnapshotModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isManageHistoryModalOpen, setManageHistoryModalOpen] = useState(false);
  const [isClubHistoryExpanded, setIsClubHistoryExpanded] = useState(true);
  const [isCoreInfoExpanded, setIsCoreInfoExpanded] = useState(true);
  const [isValueHistoryExpanded, setIsValueHistoryExpanded] = useState(true);
  
  const displayName = player.knownAs || `${player.firstName} ${player.lastName}`;
  const isGk = editedPlayer.primaryPosition === 'GK';
  const currencySymbol = getCurrencySymbol(currency);

  useEffect(() => {
    setEditedPlayer({ ...player });
    // Automatically enter edit mode for new players, otherwise reset to view mode.
    setIsEditing(player.firstName === 'New' && player.lastName === 'Player');
    setIsStatsExpanded(true);
    setIsClubHistoryExpanded(true);
    setIsCoreInfoExpanded(true);
    setIsValueHistoryExpanded(true);
  }, [player]);

  const getTagStyle = (tag: string, saveGames: SaveGame[], customTags: CustomTag[]): React.CSSProperties => {
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
      };
    }
  
    return { backgroundColor: '#4b5563', color: '#f9fafb' }; // Gray-600, light text
  };

  const handleSave = () => {
    const playerToSave = { ...editedPlayer };

    // Check if facepackId has been changed and is not empty
    if (playerToSave.facepackId && playerToSave.facepackId !== player.facepackId) {
        const imagePath = facepackConfig[playerToSave.facepackId];
        if (imagePath && facesPath) {
            // Construct the full URL, ensuring no double slashes and adding .png
            const cleanFacesPath = facesPath.endsWith('/') ? facesPath : `${facesPath}/`;
            const finalPath = `${cleanFacesPath}${imagePath}.png`;
            playerToSave.imageUrl = finalPath;
        }
    }
    onSave(playerToSave);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedPlayer({ ...player });
    setIsEditing(false);
  };

  const handleChange = (field: keyof Player, value: any) => {
    setEditedPlayer(prev => ({ ...prev, [field]: value }));
  };

  const handleSyncFacepack = () => {
    if (!editedPlayer.facepackId) {
        alert("Please enter a Facepack ID.");
        return;
    }
    if (!facesPath) {
        alert("Facepack graphics path is not set. Please set it in the Customise tab.");
        return;
    }
    const imagePath = facepackConfig[editedPlayer.facepackId];
    if (imagePath) {
        // Construct the full URL, ensuring no double slashes and adding .png
        const cleanFacesPath = facesPath.endsWith('/') ? facesPath : `${facesPath}/`;
        const finalPath = `${cleanFacesPath}${imagePath}.png`;
        handleChange('imageUrl', finalPath);
    } else {
        alert(`Could not find a mapping for Facepack ID: ${editedPlayer.facepackId}. Check your config.xml.`);
    }
  };
  
  const handleTagToggle = (tagId: string) => {
    const currentTags = editedPlayer.customTags || [];
    const newTags = currentTags.includes(tagId)
        ? currentTags.filter(id => id !== tagId)
        : [...currentTags, tagId];
    handleChange('customTags', newTags);
  };

  const handleStatChange = (index: number, field: keyof SeasonStat, value: any) => {
    const newStats = [...editedPlayer.seasonStats];
    (newStats[index] as any)[field] = value;
    handleChange('seasonStats', newStats);
  };
  
  const handleAddStatRow = () => {
      // Find the most recent club from history
      let mostRecentClubName = editedPlayer.currentClub; // Default
      if (editedPlayer.clubHistory && editedPlayer.clubHistory.length > 0) {
          const sortedHistory = [...editedPlayer.clubHistory].sort((a, b) => {
              const endYearA = a.endYear === 'Present' ? Infinity : Number(a.endYear);
              const endYearB = b.endYear === 'Present' ? Infinity : Number(b.endYear);
              if (endYearA !== endYearB) return endYearB - endYearA;
              return Number(b.startYear) - Number(a.startYear);
          });
          if (sortedHistory.length > 0) {
              mostRecentClubName = sortedHistory[0].clubName;
          }
      }

      // Find the league for that club
      let leagueName = '';
      const clubLeague = Object.entries(allLeagues).find(([, clubs]) => clubs.includes(mostRecentClubName));
      if (clubLeague) {
          leagueName = clubLeague[0];
      }
      
      // Suggest a new season string
      let newSeason = `${new Date().getFullYear()}/${(new Date().getFullYear() + 1).toString().slice(-2)}`;
      if(editedPlayer.seasonStats.length > 0){
          const sortedSeasons = [...editedPlayer.seasonStats].sort((a,b) => {
              const yearA = parseInt(a.season.split('/')[0]);
              const yearB = parseInt(b.season.split('/')[0]);
              return yearB - yearA;
          });
          const lastSeasonYear = parseInt(sortedSeasons[0].season.split('/')[0]);
          newSeason = `${lastSeasonYear + 1}/${(lastSeasonYear + 2).toString().slice(-2)}`;
      }

      const newStat: SeasonStat = { 
          id: uuidv4(), 
          season: newSeason, 
          club: mostRecentClubName, 
          league: leagueName || '', // Use found league or empty string
          apps: 0, 
          goals: 0, 
          assists: 0, 
          cleanSheets: 0, 
          goalsConceded: 0, 
          avgRating: 0.0, 
          honours: [], 
          pom: 0 
      };
      
      handleChange('seasonStats', [newStat, ...editedPlayer.seasonStats]);
  };
  
  const handleRemoveStatRow = (id: string) => {
      handleChange('seasonStats', editedPlayer.seasonStats.filter(s => s.id !== id));
  };
  
  const handleClubHistoryChange = (index: number, field: keyof ClubHistory, value: any) => {
    const newHistory = [...editedPlayer.clubHistory];
    (newHistory[index] as any)[field] = value;
    handleChange('clubHistory', newHistory);
  };

  const handleAddClubHistoryRow = () => {
    const newClub: ClubHistory = { id: uuidv4(), clubName: editedPlayer.currentClub, startYear: new Date().getFullYear(), endYear: 'Present', managedByUser: false, wasCaptain: false, transferFee: 0, isManagerTransfer: false, isLoan: false };
    handleChange('clubHistory', [...editedPlayer.clubHistory, newClub]);
  };

  const handleRemoveClubHistoryRow = (id: string) => {
    handleChange('clubHistory', editedPlayer.clubHistory.filter(c => c.id !== id));
  };

  const handleAttributeChange = (category: keyof Attributes, attribute: keyof Attributes, value: number) => {
    setEditedPlayer(prev => ({
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

  const handleSaveHonours = (newHonours: string[]) => {
      if(!editingHonoursForSeasonId) return;
      const seasonIndex = editedPlayer.seasonStats.findIndex(s => s.id === editingHonoursForSeasonId);
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
    // This is being called from the Current Club combobox
    if (newClubNameToCreate === editedPlayer.currentClub) {
        handleChange('currentClub', newClub.name);
    } else { // This is being called from the Club History combobox
        // We don't know which one, so we just add the club and let the user select it.
    }
    setCreateClubModalOpen(false);
  }

  const handleSaveCroppedImage = (base64Image: string) => {
    handleChange('imageUrl', base64Image);
  };

  const totalHonours = useMemo(() => player.seasonStats.flatMap(s => s.honours), [player.seasonStats]);

  const teamTrophies = useMemo(() => totalHonours.filter(hId => {
      const info = getHonourInfo(hId, allHonours);
      return info && !info.type.startsWith('personal_') && info.type !== 'friendly_cup';
  }).length, [totalHonours, allHonours]);

  const personalHonours = useMemo(() => {
    const nonPomCount = totalHonours.filter(hId => {
      const info = getHonourInfo(hId, allHonours);
      return info && info.type.startsWith('personal_');
    }).length;
    const pomCount: number = player.seasonStats.reduce((sum, stat) => sum + (stat.pom || 0), 0);
    return nonPomCount + (pomCount > 0 ? 1 : 0);
  }, [totalHonours, allHonours, player.seasonStats]);

  const nationalityContinent = Object.keys(CONTINENTS).find(c => CONTINENTS[c].includes(editedPlayer.nationality)) || 'Europe';
  
  const clubsPlayedFor = useMemo(() => 
    Array.from(new Set([editedPlayer.currentClub, ...editedPlayer.clubHistory.map(h => h.clubName)])).filter(Boolean),
    [editedPlayer.currentClub, editedPlayer.clubHistory]
  );
  
  const handleKitClick = () => {
    onKitClick(player.id);
  };

  const displayedClubIndex = editedPlayer.primaryPosition === 'GK' ? 0 : kitDisplayIndex;
  const gkKitIndex = editedPlayer.primaryPosition === 'GK' ? kitDisplayIndex : 0;

  const displayedClubName = editedPlayer.primaryPosition === 'GK'
    ? editedPlayer.currentClub
    : (clubsPlayedFor[displayedClubIndex % (clubsPlayedFor.length || 1)] || editedPlayer.currentClub);

  const displayedClub = allClubs[displayedClubName];
  
  const seasonForHonoursModal = useMemo(() => {
    return editedPlayer.seasonStats.find(s => s.id === editingHonoursForSeasonId);
  }, [editedPlayer.seasonStats, editingHonoursForSeasonId]);
  
  const saveGameOptions = useMemo(() => saveGames.map(s => s.name), [saveGames]);

  const careerTotals = useMemo(() => {
    const totalApps = editedPlayer.seasonStats.reduce((sum, stat) => sum + (Number(stat.apps) || 0), 0);
    const totalGoals = editedPlayer.seasonStats.reduce((sum, stat) => sum + (Number(stat.goals) || 0), 0);
    const totalAssists = editedPlayer.seasonStats.reduce((sum, stat) => sum + (Number(stat.assists) || 0), 0);
    const totalCleanSheets = editedPlayer.seasonStats.reduce((sum, stat) => sum + (Number(stat.cleanSheets) || 0), 0);
    const totalGoalsConceded = editedPlayer.seasonStats.reduce((sum, stat) => sum + (Number(stat.goalsConceded) || 0), 0);
    const totalPom = editedPlayer.seasonStats.reduce((sum, stat) => sum + (Number(stat.pom) || 0), 0);
    const weightedRatingSum = editedPlayer.seasonStats.reduce((sum, stat) => sum + (Number(stat.avgRating) || 0) * (Number(stat.apps) || 0), 0);
    const avgRating = totalApps > 0 ? weightedRatingSum / totalApps : 0;
    const totalHonoursValue: number = editedPlayer.seasonStats.reduce((sum, stat) => sum + stat.honours.length, 0);
    const totalTransferFees = editedPlayer.clubHistory.reduce((sum, hist) => sum + (Number(hist.transferFee) || 0), 0);

    return { 
        totalApps, 
        totalGoals, 
        totalAssists,
        totalCleanSheets,
        totalGoalsConceded,
        totalPom,
        avgRating: isNaN(avgRating) ? 0 : avgRating, 
        totalHonours: totalHonoursValue,
        totalTransferFees
    };
  }, [editedPlayer.seasonStats, editedPlayer.clubHistory]);
  
  const numClubs = useMemo(() => new Set(player.clubHistory.map(c => c.clubName)).size, [player.clubHistory]);

  const sortedSnapshots = useMemo(() => {
    if (!player.attributeSnapshots) return [];
    return [...player.attributeSnapshots].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [player.attributeSnapshots]);

  const latestSnapshotDate = sortedSnapshots[0]?.date;

  const averageValue = useMemo(() => {
    if (!sortedSnapshots || sortedSnapshots.length === 0) return 0;
    const valuedSnapshots = sortedSnapshots.filter(s => s.value !== undefined && s.value > 0);
    if (valuedSnapshots.length === 0) return 0;
    const sum = valuedSnapshots.reduce((acc, s) => acc + (s.value || 0), 0);
    return sum / valuedSnapshots.length;
  }, [sortedSnapshots]);

  return (
    <div className="p-4 sm:p-6 space-y-6 h-full flex flex-col">
        <HonoursModal
            isOpen={isHonoursModalOpen}
            onClose={() => setIsHonoursModalOpen(false)}
            allHonours={allHonours}
            selectedHonours={seasonForHonoursModal?.honours || []}
            onSave={handleSaveHonours as (selection: string[]) => void}
            awardType="player"
        />

        <TrophyCabinetModal 
            isOpen={isTrophyCabinetOpen}
            onClose={() => setIsTrophyCabinetOpen(false)}
            player={player}
            allHonours={allHonours}
            customIcons={customIcons}
            trophyCabinetSettings={trophyCabinetSettings}
        />

        <AttributeSnapshotModal
            isOpen={isSnapshotModalOpen}
            onClose={() => setSnapshotModalOpen(false)}
            player={player}
        />
        
        <UpdateAttributesModal
          isOpen={isUpdateModalOpen}
          onClose={() => setUpdateModalOpen(false)}
          player={player}
          onSave={onSave}
          currency={currency}
        />

        <ManageHistoryModal
            isOpen={isManageHistoryModalOpen}
            onClose={() => setManageHistoryModalOpen(false)}
            player={player}
            onSave={onSave}
            currency={currency}
        />

        <ImageCropModal
            isOpen={isImageCropModalOpen}
            onClose={() => setIsImageCropModalOpen(false)}
            onSave={handleSaveCroppedImage}
            initialImageSrc={editedPlayer.imageUrl}
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
                <div className="flex gap-4">
                    <div className="text-center">
                        <button onClick={handleKitClick} className="rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                            <Kit 
                                player={editedPlayer} 
                                club={displayedClub}
                                size="lg" 
                                gkKitIndex={gkKitIndex} 
                                allClubs={allClubs}
                                squadNumber={isEditing ? undefined : editedPlayer.squadNumber}
                            />
                        </button>
                        {editedPlayer.primaryPosition !== 'GK' && clubsPlayedFor.length > 1 && (
                            <p className="text-xs text-gray-400 mt-1 animate-pulse">{displayedClubName}</p>
                        )}
                    </div>
                    <div className="text-center">
                         <div className="w-20 h-20 bg-gray-900/50 rounded-lg overflow-hidden flex items-center justify-center border border-gray-700/50">
                            {editedPlayer.imageUrl ? (
                                <img src={editedPlayer.imageUrl} alt={displayName} className="w-full h-full object-cover" />
                            ) : (
                                <SilhouetteIcon className="w-16 h-16 text-gray-600" />
                            )}
                        </div>
                        {isEditing && (
                            <div className="flex flex-col items-center mt-2 w-20">
                                <Button size="sm" variant="secondary" onClick={() => setIsImageCropModalOpen(true)} className="text-xs w-full">
                                    Upload
                                </Button>
                                {editedPlayer.imageUrl && (
                                    <Button size="sm" variant="secondary" onClick={() => setIsImageCropModalOpen(true)} className="mt-1 text-xs w-full">
                                        Edit
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    {isEditing ? (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                             <div className="col-span-1">
                                <label className="text-xs text-gray-400">First Name</label>
                                <Input value={editedPlayer.firstName} onChange={e => handleChange('firstName', e.target.value)} />
                            </div>
                            <div className="col-span-1">
                                <label className="text-xs text-gray-400">Last Name</label>
                                <Input value={editedPlayer.lastName} onChange={e => handleChange('lastName', e.target.value)} />
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs text-gray-400">Common Name (optional)</label>
                                <Input value={editedPlayer.knownAs} onChange={e => handleChange('knownAs', e.target.value)} />
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-bold text-white">{displayName}</h2>
                            <button
                                onClick={() => onToggleFavourite(player.id)}
                                className={`transition-colors duration-200 ${player.isFavourite ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-500 hover:text-yellow-400'}`}
                                aria-label={player.isFavourite ? 'Remove from favourites' : 'Add to favourites'}
                            >
                                <StarIcon filled={player.isFavourite} className="w-7 h-7" />
                            </button>
                        </div>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-gray-300">
                        {isEditing ? (
                            <>
                                <Select value={nationalityContinent} onChange={e => handleChange('nationality', CONTINENTS[e.target.value][0])}>
                                    {Object.keys(CONTINENTS).map(c => <option key={c} value={c}>{c}</option>)}
                                </Select>
                                <Select value={editedPlayer.nationality} onChange={e => handleChange('nationality', e.target.value)}>
                                    {CONTINENTS[nationalityContinent].map(n => <option key={n} value={n}>{n}</option>)}
                                </Select>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <FlagIcon nationality={player.nationality} className="w-6 h-5" />
                                <span>{player.nationality}</span>
                            </div>
                        )}
                    </div>
                    {!isEditing && player.dateOfBirth && (
                      <p className="text-sm text-gray-400 mt-1">
                        {formatDate(player.dateOfBirth, dateFormat)} ({calculateAge(player.dateOfBirth, latestSnapshotDate)} years old)
                      </p>
                    )}
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
                        <Button onClick={() => onDelete(player.id)} variant="danger" icon={TrashIcon}>Delete</Button>
                    </>
                )}
            </div>
        </div>
        
        {/* Core Info & Tags */}
        <div>
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold">Core Details</h3>
                    <button onClick={() => setIsCoreInfoExpanded(prev => !prev)} className="text-gray-400 hover:text-white" aria-expanded={isCoreInfoExpanded} aria-controls="core-info-section">
                        <span className="sr-only">{isCoreInfoExpanded ? 'Collapse' : 'Expand'} core details</span>
                        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isCoreInfoExpanded ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>
            {isCoreInfoExpanded && (
                <div id="core-info-section" className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-900/50 rounded-lg">
                    <div>
                        <label className="text-xs text-gray-400">Position</label>
                        {isEditing ? (
                            <Select value={editedPlayer.primaryPosition} onChange={e => handleChange('primaryPosition', e.target.value)}>
                                {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                            </Select>
                        ) : <p className="text-lg font-semibold">{player.primaryPosition}</p>}
                    </div>
                    <div>
                        <label className="text-xs text-gray-400">Squad Number</label>
                        {isEditing ? (
                            <Input type="number" value={editedPlayer.squadNumber} onChange={e => handleChange('squadNumber', parseInt(e.target.value) || 0)} />
                        ) : <p className="text-lg font-semibold">{player.squadNumber}</p>}
                    </div>
                     <div>
                        <label className="text-xs text-gray-400">Int Caps</label>
                        {isEditing ? (
                            <Input type="number" value={editedPlayer.internationalCaps} onChange={e => handleChange('internationalCaps', parseInt(e.target.value, 10) || 0)} />
                        ) : <p className="text-lg font-semibold">{player.internationalCaps}</p>}
                    </div>
                     <div>
                        <label className="text-xs text-gray-400">Int Goals</label>
                        {isEditing ? (
                            <Input type="number" value={editedPlayer.internationalGoals} onChange={e => handleChange('internationalGoals', parseInt(e.target.value, 10) || 0)} />
                        ) : <p className="text-lg font-semibold">{player.internationalGoals}</p>}
                    </div>
                    <div className="col-span-2">
                        <label className="text-xs text-gray-400">Current Club</label>
                         {isEditing ? (
                             <Combobox
                                options={Object.keys(allClubs)}
                                value={editedPlayer.currentClub}
                                onChange={value => handleChange('currentClub', value)}
                                onAddNew={(name) => {
                                    handleChange('currentClub', name);
                                    handleOpenCreateClubModal(name);
                                }}
                                placeholder="Select or create a club..."
                             />
                         ) : <p className="text-lg font-semibold">{player.currentClub}</p>}
                    </div>
                    <div className="col-span-2">
                        <label className="text-xs text-gray-400">Current Value ({currencySymbol}m)</label>
                        {isEditing ? (
                            <Input type="number" step="0.1" value={editedPlayer.currentValue || 0} onChange={e => handleChange('currentValue', parseFloat(e.target.value) || 0)} />
                        ) : <p className="text-lg font-semibold">{player.currentValue ? `${currencySymbol}${player.currentValue}m` : 'N/A'}</p>}
                    </div>
                     {isEditing && (
                        <>
                            <div className="col-span-2">
                                <label className="text-xs text-gray-400">Facepack ID</label>
                                <div className="flex items-center gap-2">
                                    <Input 
                                        value={editedPlayer.facepackId || ''} 
                                        onChange={e => handleChange('facepackId', e.target.value)} 
                                        placeholder="e.g. 28090008"
                                        className="flex-grow"
                                    />
                                    <Button type="button" onClick={handleSyncFacepack} variant="secondary" size="sm">
                                        Sync
                                    </Button>
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs text-gray-400">Date of Birth</label>
                                <Input type="date" value={editedPlayer.dateOfBirth} onChange={e => handleChange('dateOfBirth', e.target.value)} />
                                <p className="text-xs text-gray-400 mt-1"> Sample: {formatDate('2025-12-25', dateFormat)}</p>
                            </div>
                        </>
                    )}
                    <div className="col-span-full">
                         <label className="text-xs text-gray-400">Metadata & Tags</label>
                         {isEditing ? (
                             <div className="space-y-3">
                                <div className="flex flex-wrap items-center gap-4 mt-1">
                                    <Select value={editedPlayer.fmVersion} onChange={e => handleChange('fmVersion', e.target.value)}>
                                        {fmVersions.map(v => <option key={v} value={v}>{v}</option>)}
                                    </Select>
                                    <Select value={editedPlayer.saveGameName} onChange={e => handleChange('saveGameName', e.target.value)}>
                                        {saveGameOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                    </Select>
                                    <Checkbox label={newgenTerm} checked={editedPlayer.isRegen} onChange={e => handleChange('isRegen', e.target.checked)} />
                                    <Checkbox label="Youth Intake" checked={editedPlayer.isYouthIntake} onChange={e => handleChange('isYouthIntake', e.target.checked)} />
                                    <Checkbox label="Known Attributes" checked={editedPlayer.hasKnownAttributes} onChange={e => handleChange('hasKnownAttributes', e.target.checked)} />
                                    <Checkbox label="Favourite" checked={editedPlayer.isFavourite} onChange={e => handleChange('isFavourite', e.target.checked)} />
                                    <Checkbox label="Imported" checked={!!editedPlayer.isImported} onChange={e => handleChange('isImported', e.target.checked)} />
                                </div>
                                {customTags.length > 0 && (
                                    <div className="p-2 border-t border-gray-700/50">
                                        <label className="text-xs text-gray-400 mb-2 block">Custom Tags</label>
                                        <div className="flex flex-wrap gap-2">
                                            {customTags.map(tag => (
                                                <Checkbox
                                                    key={tag.id}
                                                    label={tag.name}
                                                    checked={(editedPlayer.customTags || []).includes(tag.id)}
                                                    onChange={() => handleTagToggle(tag.id)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                             </div>
                         ) : (
                            <div className="flex flex-wrap gap-2 mt-1">
                                {[
                                    player.isFavourite && 'Favourite', 
                                    player.fmVersion, 
                                    player.saveGameName, 
                                    player.isRegen && newgenTerm, 
                                    player.isYouthIntake && 'Youth Intake', 
                                    player.isImported && 'Imported',
                                    ...(player.customTags || []).map(tagId => customTags.find(t => t.id === tagId)?.name)
                                ].filter(Boolean).map(tag => (
                                    <span 
                                        key={tag as string}
                                        style={getTagStyle(tag as string, saveGames, customTags)}
                                        className="px-3 py-1 text-sm rounded-full font-medium"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                         )}
                    </div>
                </div>
            )}
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
                <div className="bg-gray-900/50 rounded-lg overflow-hidden">
                    <table id="club-history-table" className="w-full text-left text-sm">
                        <thead className="bg-gray-700/50 text-xs text-gray-300 uppercase tracking-wider">
                            <tr>
                                <th className="p-3">Club</th>
                                <th className="p-3">Duration</th>
                                <th className="p-3">Fee ({currencySymbol}m)</th>
                                <th className="p-3">Managed</th>
                                <th className="p-3">Captain</th>
                                <th className="p-3">Mgr Xfer?</th>
                                <th className="p-3">Loan?</th>
                                {isEditing && <th className="p-3"></th>}
                            </tr>
                        </thead>
                        {isClubHistoryExpanded && (
                            <tbody className="text-white">
                                {[...editedPlayer.clubHistory].sort((a, b) => {
                                    const endYearA = a.endYear === 'Present' ? Infinity : Number(a.endYear);
                                    const endYearB = b.endYear === 'Present' ? Infinity : Number(b.endYear);
                                    if (endYearA !== endYearB) return endYearB - endYearA;
                                    return Number(b.startYear) - Number(a.startYear);
                                }).map((club) => {
                                    const index = editedPlayer.clubHistory.findIndex(c => c.id === club.id);
                                    return (
                                    <tr key={club.id} className="border-t border-gray-700/50">
                                        <td className="p-2">
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
                                        <td className="p-2">{isEditing ? <div className="flex gap-1"><Input type="number" value={club.startYear} onChange={e => handleClubHistoryChange(index, 'startYear', parseInt(e.target.value) || 0)} /><Input value={club.endYear} onChange={e => handleClubHistoryChange(index, 'endYear', e.target.value)} /></div> : `${club.startYear} - ${club.endYear}`}</td>
                                        <td className="p-2">{isEditing ? <Input type="number" step="0.1" value={club.transferFee || 0} onChange={e => handleClubHistoryChange(index, 'transferFee', parseFloat(e.target.value) || 0)} /> : club.transferFee ? `${currencySymbol}${club.transferFee}m` : '-'}</td>
                                        <td className="p-2 text-center">{isEditing ? <Checkbox checked={club.managedByUser} onChange={e => handleClubHistoryChange(index, 'managedByUser', e.target.checked)} /> : club.managedByUser ? '✔️' : '❌'}</td>
                                        <td className="p-2 text-center">{isEditing ? <Checkbox checked={club.wasCaptain} onChange={e => handleClubHistoryChange(index, 'wasCaptain', e.target.checked)} /> : club.wasCaptain ? '✔️' : '❌'}</td>
                                        <td className="p-2 text-center">{isEditing ? <Checkbox checked={!!club.isManagerTransfer} onChange={e => handleClubHistoryChange(index, 'isManagerTransfer', e.target.checked)} /> : club.isManagerTransfer ? '✔️' : '❌'}</td>
                                        <td className="p-2 text-center">{isEditing ? <Checkbox checked={!!club.isLoan} onChange={e => handleClubHistoryChange(index, 'isLoan', e.target.checked)} /> : club.isLoan ? '✔️' : '❌'}</td>
                                        {isEditing && <td className="p-2"><Button onClick={() => handleRemoveClubHistoryRow(club.id)} variant="danger" size="sm" icon={TrashIcon}></Button></td>}
                                    </tr>
                                )})
                                }
                            </tbody>
                        )}
                        <tfoot className="bg-gray-800/60 font-bold text-white border-t-2 border-purple-500/50">
                            <tr>
                                <td colSpan={isEditing ? 8 : 7} className="p-3">
                                    <div className="flex justify-around">
                                        <span>Clubs: <span className="text-green-400">{numClubs}</span></span>
                                        <span>Total Career Fees: <span className="text-yellow-400">{currencySymbol}{careerTotals.totalTransferFees.toFixed(1)}m</span></span>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
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
                    <table id="season-stats-table" className="w-full text-left text-sm">
                        <thead className="bg-gray-700/50 text-xs text-gray-300 uppercase tracking-wider">
                            <tr>
                                <th className="p-3">Season</th><th className="p-3">Club</th><th className="p-3">Apps</th><th className="p-3">G</th><th className="p-3">A</th>
                                {isGk && <><th className="p-3">CS</th><th className="p-3">GC</th></>}
                                <th className="p-3">PoM</th><th className="p-3">Av R</th><th className="p-3 text-center">Honours</th>
                                {isEditing && <th className="p-3"></th>}
                            </tr>
                        </thead>
                        {isStatsExpanded && (
                            <tbody className="text-white">
                                {[...editedPlayer.seasonStats].sort((a, b) => parseInt(b.season.split('/')[0], 10) - parseInt(a.season.split('/')[0], 10)).map(stat => {
                                    const index = editedPlayer.seasonStats.findIndex(s => s.id === stat.id);
                                    return (
                                        <tr key={stat.id} className="border-t border-gray-700/50">
                                            <td className="p-2">{isEditing ? <Input value={stat.season} onChange={e => handleStatChange(index, 'season', e.target.value)} /> : stat.season}</td>
                                            <td className="p-2">{isEditing ? <Input value={stat.club} onChange={e => handleStatChange(index, 'club', e.target.value)} /> : stat.club}</td>
                                            <td className="p-2">{isEditing ? <Input type="number" value={stat.apps} onChange={e => handleStatChange(index, 'apps', parseInt(e.target.value) || 0)} /> : stat.apps}</td>
                                            <td className="p-2">{isEditing ? <Input type="number" value={stat.goals} onChange={e => handleStatChange(index, 'goals', parseInt(e.target.value) || 0)} /> : stat.goals}</td>
                                            <td className="p-2">{isEditing ? <Input type="number" value={stat.assists} onChange={e => handleStatChange(index, 'assists', parseInt(e.target.value) || 0)} /> : stat.assists}</td>
                                            {isGk && <>
                                                <td className="p-2">{isEditing ? <Input type="number" value={stat.cleanSheets} onChange={e => handleStatChange(index, 'cleanSheets', parseInt(e.target.value) || 0)} /> : stat.cleanSheets}</td>
                                                <td className="p-2">{isEditing ? <Input type="number" value={stat.goalsConceded} onChange={e => handleStatChange(index, 'goalsConceded', parseInt(e.target.value) || 0)} /> : stat.goalsConceded}</td>
                                            </>}
                                            <td className="p-2">{isEditing ? <Input type="number" value={stat.pom} onChange={e => handleStatChange(index, 'pom', parseInt(e.target.value) || 0)} /> : stat.pom}</td>
                                            <td className="p-2">{isEditing ? <Input type="number" step="0.01" value={stat.avgRating} onChange={e => handleStatChange(index, 'avgRating', parseFloat(e.target.value) || 0)} /> : stat.avgRating.toFixed(2)}</td>
                                            <td className="p-2 text-center">{isEditing ? <Button onClick={() => handleOpenHonoursModal(stat.id)} size="sm" variant="secondary">Honours ({stat.honours.length})</Button> : stat.honours.length}</td>
                                            {isEditing && <td className="p-2"><Button onClick={() => handleRemoveStatRow(stat.id)} variant="danger" size="sm" icon={TrashIcon}></Button></td>}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        )}
                        <tfoot className="bg-gray-800/60 font-bold text-white border-t-2 border-purple-500/50">
                             <tr>
                                <td className="p-3" colSpan={2}>Career Totals</td>
                                <td className="p-3">{careerTotals.totalApps}</td>
                                <td className="p-3">{careerTotals.totalGoals}</td>
                                <td className="p-3">{careerTotals.totalAssists}</td>
                                {isGk && <>
                                    <td className="p-3">{careerTotals.totalCleanSheets}</td>
                                    <td className="p-3">{careerTotals.totalGoalsConceded}</td>
                                </>}
                                <td className="p-3">{careerTotals.totalPom}</td>
                                <td className="p-3">{careerTotals.avgRating.toFixed(2)}</td>
                                <td className="p-3 text-center">{careerTotals.totalHonours}</td>
                                {isEditing && <td className="p-3"></td>}
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Value History */}
            {player.hasKnownAttributes && (
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-semibold">Value History</h3>
                            <button onClick={() => setIsValueHistoryExpanded(prev => !prev)} className="text-gray-400 hover:text-white" aria-expanded={isValueHistoryExpanded} aria-controls="value-history-table">
                                <span className="sr-only">{isValueHistoryExpanded ? 'Collapse' : 'Expand'} value history</span>
                                <ChevronDownIcon className={`w-5 h-5 transition-transform ${isValueHistoryExpanded ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg overflow-hidden">
                        <table id="value-history-table" className="w-full text-left text-sm">
                            <thead className="bg-gray-700/50 text-xs text-gray-300 uppercase tracking-wider">
                                <tr>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Age</th>
                                    <th className="p-3">Value ({currencySymbol}m)</th>
                                    <th className="p-3">Change ({currencySymbol}m)</th>
                                </tr>
                            </thead>
                            {isValueHistoryExpanded && (
                                <tbody>
                                    {sortedSnapshots.map((snapshot, index) => {
                                        const ageAtSnapshot = calculateAge(player.dateOfBirth, snapshot.date);
                                        const prevValue = index < sortedSnapshots.length - 1 ? sortedSnapshots[index + 1].value : null;
                                        const valueChange = (snapshot.value !== undefined && prevValue !== null && prevValue !== undefined) ? snapshot.value - prevValue : null;

                                        return (
                                            <tr key={snapshot.id} className="border-t border-gray-700/50">
                                                <td className="p-2 text-white">{formatDate(snapshot.date, dateFormat)}</td>
                                                <td className="p-2 text-white">{ageAtSnapshot}</td>
                                                <td className="p-2 text-white">{currencySymbol}{snapshot.value?.toFixed(1) || '0.0'}m</td>
                                                <td className={`p-2 font-bold ${valueChange === null ? 'text-gray-500' : valueChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                    {valueChange !== null ? (
                                                        <div className="flex items-center gap-1">
                                                            {valueChange > 0 ? <UpArrowIcon className="w-3 h-3"/> : <DownArrowIcon className="w-3 h-3"/>}
                                                            {currencySymbol}{Math.abs(valueChange).toFixed(1)}m
                                                        </div>
                                                    ) : '-'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            )}
                            <tfoot className="bg-gray-800/60 font-bold text-white border-t-2 border-purple-500/50">
                                <tr>
                                    <td colSpan={4} className="p-3">
                                        <div className="flex justify-around">
                                            <span>Current Value: <span className="text-green-400">{currencySymbol}{player.currentValue || 0}m</span></span>
                                            <span>Average Value: <span className="text-yellow-400">{currencySymbol}{averageValue.toFixed(1)}m</span></span>
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}
            
            {/* Honours */}
             <div>
                <h3 className="text-xl font-semibold mb-2">Career Honours</h3>
                 <div className="p-4 bg-gray-900/50 rounded-lg flex items-center justify-between">
                     <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <GoldTrophyIcon className="w-6 h-6" />
                            <span className="text-xl font-bold">{teamTrophies}</span>
                            <span className="text-gray-400">Team Trophies</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <BootAwardIcon className="w-6 h-6" />
                            <span className="text-xl font-bold">{personalHonours}</span>
                            <span className="text-gray-400">Personal Awards</span>
                        </div>
                     </div>
                     <Button onClick={() => setIsTrophyCabinetOpen(true)} variant="secondary" size="sm" icon={CabinetIcon}>
                        View Cabinet
                     </Button>
                 </div>
            </div>
            
            {/* Attributes */}
            {player.hasKnownAttributes && (
                <div>
                    <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-xl font-semibold">Attributes</h3>
                        <Button onClick={() => setSnapshotModalOpen(true)} variant="secondary" size="sm">Compare History</Button>
                        <Button onClick={() => setUpdateModalOpen(true)} variant="secondary" size="sm">Update Attributes</Button>
                        <Button onClick={() => setManageHistoryModalOpen(true)} variant="secondary" size="sm">Manage History</Button>
                    </div>
                    <AttributeTable 
                        attributes={editedPlayer.attributes} 
                        isEditing={isEditing} 
                        onChange={handleAttributeChange}
                        primaryPosition={editedPlayer.primaryPosition}
                        snapshots={player.attributeSnapshots}
                    />
                </div>
            )}
        </div>
        {player.originalManager && (
            <p className="text-right text-xs text-gray-500 italic mt-auto pt-4">
                Original Manager - {player.originalManager}
            </p>
         )}
    </div>
  );
};

export default PlayerDetails;