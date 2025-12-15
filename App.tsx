
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Player, Manager, League, Club, Honour, Competition, SaveGame, AllTimeXI, SavedSquad, ExportData, FullExportData, TrophyCabinetSettings, NewgenTerm, Attributes, DateFormatOption, CurrencyOption, CustomTag } from './types';
import { getPlayers, savePlayers, getInitialPlayers, getCustomData, saveCustomData, saveCustomObject, getCustomObject, getAllTimeXI, saveAllTimeXI, USERNAME_KEY, FM_VERSIONS_KEY, PLAYERS_KEY, ALL_TIME_XI_KEY, MANAGERS_KEY, getManagers, saveManagers, getInitialManagers, WELCOME_MODAL_SHOWN_KEY, getDefaultTrophyCabinetSettings, getLargeObject, saveLargeObject, removeLargeObject } from './services/db';
import { parsePlayerNameFromHTML, parseAttributesFromHTML } from './services/parser';
import PlayerList from './components/PlayerList';
import PlayerDetails from './components/PlayerDetails';
import ManagerList from './components/ManagerList';
import ManagerDetails from './components/ManagerDetails';
import { CustomisePage } from './components/CustomisePage';
import AllTimeXIView from './components/AllTimeXIView';
import MatchDayView from './components/MatchDayView';
import PlayerCompareView from './components/PlayerCompareView';
import PlayerCardView from './components/PlayerCardView';
import PlayerGrowthHistory from './components/PlayerGrowthHistory';
import AboutPage from './components/AboutPage';
import ExportModal from './components/ExportModal';
import { PitchIcon } from './components/icons/PitchIcon';
import { VersusIcon } from './components/icons/VersusIcon';
import { CompareIcon } from './components/icons/CompareIcon';
import { CardIcon } from './components/icons/CardIcon';
import { CogIcon } from './components/icons/CogIcon';
import { InfoIcon } from './components/icons/InfoIcon';
import { LineGraphIcon } from './components/icons/LineGraphIcon';
import Modal from './components/ui/Modal';
import Button from './components/ui/Button';
import Input from './components/ui/Input';
import { createNewPlayer, createNewManager, HONOURS as defaultHonours, LEAGUES as defaultLeagues, CLUBS as defaultClubs, DEFAULT_FM_VERSIONS } from './constants';
import { SAVE_GAMES_KEY, CUSTOM_ICONS_KEY, TROPHY_CABINET_SETTINGS_KEY, NEWGEN_TERM_KEY, DATE_FORMAT_KEY, CURRENCY_KEY, CUSTOM_TAGS_KEY, FACEPACK_PATH_KEY, FACEPACK_CONFIG_KEY } from './services/db';
import { v4 as uuidv4 } from 'uuid';
import Dashboard from './components/Dashboard';
import { HomeIcon } from './components/icons/HomeIcon';
import { DatabaseIcon } from './components/icons/DatabaseIcon';
import AddPlayerModal from './components/AddPlayerModal';

const CUSTOM_LEAGUES_KEY = 'fm_custom_leagues';
const CUSTOM_CLUBS_KEY = 'fm_custom_clubs';
const CUSTOM_COMPETITIONS_KEY = 'fm_custom_competitions';


const migratePlayer = (player: any): Player => {
  const newPlayer = {
    ...player,
    dateOfBirth: player.dateOfBirth ?? '2000-01-01',
    currentValue: player.currentValue ?? 0,
    clubHistory: (player.clubHistory || []).map((history: any) => ({
      ...history,
      wasCaptain: history.wasCaptain ?? false,
      transferFee: history.transferFee ?? 0,
      isManagerTransfer: history.isManagerTransfer ?? false,
      isLoan: history.isLoan ?? false,
    })),
    seasonStats: (player.seasonStats || []).map((stat: any) => ({
      ...stat,
      goals: stat.goals ?? 0,
      assists: stat.assists ?? 0,
      cleanSheets: stat.cleanSheets ?? 0,
      goalsConceded: stat.goalsConceded ?? 0,
      pom: stat.pom ?? 0,
    })),
    imageUrl: player.imageUrl || undefined,
    attributeSnapshots: (player.attributeSnapshots || []).map((s: any) => ({...s, id: s.id || uuidv4(), value: s.value ?? 0})),
    customTags: player.customTags ?? [],
  };

  if (newPlayer.hasKnownAttributes && (!newPlayer.attributeSnapshots || newPlayer.attributeSnapshots.length === 0)) {
    newPlayer.attributeSnapshots = [{
      id: uuidv4(),
      date: '2024-01-01', // A generic start date for migration
      attributes: newPlayer.attributes,
      value: 0,
    }];
  }

  return newPlayer as Player;
};

const migrateManager = (manager: any): Manager => {
  return {
    ...manager,
    isImported: manager.isImported ?? false,
    clubHistory: (manager.clubHistory || []).map((history: any) => ({
      ...history,
      isLoan: history.isLoan ?? false,
    })),
    seasonStats: (manager.seasonStats || []).map((stat: any) => ({
      ...stat,
      leagueTable: stat.leagueTable ?? [],
    })),
  };
};

const Sidebar: React.FC<{ activeTab: string; setActiveTab: (tab: any) => void }> = ({ activeTab, setActiveTab }) => {
  const getTabClass = (tabName: string) => {
    return `w-full text-left text-sm font-semibold px-3 py-2.5 rounded-md transition-colors flex items-center gap-3 ${activeTab === tabName ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50' : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'}`;
  };

  return (
    <nav className="w-56 flex-shrink-0 bg-gray-900/80 border-r border-gray-700/50 flex flex-col p-3">
      <div className="flex-shrink-0 mb-6 mt-1">
        <h1 className="text-2xl font-bold text-white tracking-wider text-center">
          FM <span className="text-purple-400">ARCHIVE</span>
        </h1>
      </div>
      
      <div className="flex-1 space-y-1.5">
        <button onClick={() => setActiveTab('dashboard')} className={getTabClass('dashboard')}>
          <HomeIcon className="w-5 h-5" /> Dashboard
        </button>
        <button onClick={() => setActiveTab('database')} className={getTabClass('database')}>
          <DatabaseIcon className="w-5 h-5" /> Database
        </button>
        <button onClick={() => setActiveTab('all-time-xi')} className={getTabClass('all-time-xi')}>
          <PitchIcon className="w-5 h-5" /> All-Time XI
        </button>
        <button onClick={() => setActiveTab('matchday')} className={getTabClass('matchday')}>
          <VersusIcon className="w-5 h-5" /> Match Day
        </button>
        <button onClick={() => setActiveTab('compare')} className={getTabClass('compare')}>
          <CompareIcon className="w-5 h-5" /> Compare
        </button>
        <button onClick={() => setActiveTab('player-cards')} className={getTabClass('player-cards')}>
          <CardIcon className="w-5 h-5" /> Player Cards
        </button>
        <button onClick={() => setActiveTab('growth-history')} className={getTabClass('growth-history')}>
          <LineGraphIcon className="w-5 h-5" /> Growth History
        </button>
      </div>

      <div className="flex-shrink-0 space-y-1.5 pt-4 border-t border-gray-700/50">
        <button onClick={() => setActiveTab('customise')} className={getTabClass('customise')}>
          <CogIcon className="w-5 h-5" /> Customise
        </button>
        <button onClick={() => setActiveTab('about')} className={getTabClass('about')}>
          <InfoIcon className="w-5 h-5" /> About
        </button>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  // Common states
  const [activeTab, setActiveTab] = useState<'dashboard' | 'database' | 'all-time-xi' | 'matchday' | 'compare' | 'player-cards' | 'growth-history' | 'customise' | 'about'>('dashboard');
  const [username, setUsername] = useState<string | null>(null);
  
  // Database view
  const [databaseView, setDatabaseView] = useState<'players' | 'managers'>('players');

  // Player states
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  
  // Manager states
  const [managers, setManagers] = useState<Manager[]>([]);
  const [selectedManagerId, setSelectedManagerId] = useState<string | null>(null);

  // Search and Filter states (currently only for players)
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [nationalityFilter, setNationalityFilter] = useState<string>('');
  const [positionFilter, setPositionFilter] = useState<string>('');

  const [kitDisplayIndices, setKitDisplayIndices] = useState<Record<string, number>>({});
  
  // Modals
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [exportModalConfig, setExportModalConfig] = useState<{ type: 'player' | 'manager' } | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: string, type: 'player' | 'manager' } | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [resetConfirmationText, setResetConfirmationText] = useState('');
  const [isFullImportConfirmOpen, setIsFullImportConfirmOpen] = useState(false);
  const [fullImportFile, setFullImportFile] = useState<File | null>(null);
  const [isReloadModalOpen, setIsReloadModalOpen] = useState(false);
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);

  // Custom data states
  const [customLeagues, setCustomLeagues] = useState<League[]>(() => getCustomData<League>(CUSTOM_LEAGUES_KEY));
  const [customClubs, setCustomClubs] = useState<Club[]>(() => getCustomData<Club>(CUSTOM_CLUBS_KEY));
  const [customCompetitions, setCustomCompetitions] = useState<Competition[]>(() => getCustomData<Competition>(CUSTOM_COMPETITIONS_KEY));
  const [customTags, setCustomTags] = useState<CustomTag[]>(() => getCustomData<CustomTag>(CUSTOM_TAGS_KEY));
  const [customIcons, setCustomIcons] = useState<Record<string, string>>(() => getCustomObject<Record<string, string>>(CUSTOM_ICONS_KEY, {}));
  const [trophyCabinetSettings, setTrophyCabinetSettings] = useState<TrophyCabinetSettings>(() => {
    const saved = getCustomObject<any>(TROPHY_CABINET_SETTINGS_KEY, null);
    if (saved) {
      if (saved.backgroundTextureUrl) {
        const migratedSettings: TrophyCabinetSettings = {
          backgroundType: 'texture',
          backgroundValue: saved.backgroundTextureUrl,
          shelfColor: saved.shelfColor,
          shelfTitleColor: saved.shelfTitleColor,
          textColor: saved.textColor,
        };
        saveCustomObject(TROPHY_CABINET_SETTINGS_KEY, migratedSettings);
        return migratedSettings;
      }
      return { ...getDefaultTrophyCabinetSettings(), ...saved };
    }
    return getDefaultTrophyCabinetSettings();
  });
  const [allTimeXI, setAllTimeXI] = useState<AllTimeXI>(() => getAllTimeXI());
  const [fmVersions, setFmVersions] = useState<string[]>(() => {
    const saved = getCustomData<string>(FM_VERSIONS_KEY);
    return saved.length > 0 ? saved : DEFAULT_FM_VERSIONS;
  });
  const [newgenTerm, setNewgenTerm] = useState<NewgenTerm>(() => (localStorage.getItem(NEWGEN_TERM_KEY) as NewgenTerm) || 'NewGen');
  const [dateFormat, setDateFormat] = useState<DateFormatOption>(() => (localStorage.getItem(DATE_FORMAT_KEY) as DateFormatOption) || 'dd/mm/yyyy');
  const [currency, setCurrency] = useState<CurrencyOption>(() => (localStorage.getItem(CURRENCY_KEY) as CurrencyOption) || 'GBP');
  const [facesPath, setFacesPath] = useState<string>(() => localStorage.getItem(FACEPACK_PATH_KEY) || '');
  const [facepackConfig, setFacepackConfig] = useState<Record<string, string>>({});

  // Match Day states
  const [homeTeam, setHomeTeam] = useState<SavedSquad | null>(null);
  const [awayTeam, setAwayTeam] = useState<SavedSquad | null>(null);

  const [saveGames, setSaveGames] = useState<SaveGame[]>(() => {
    const saved = getCustomData<SaveGame>(SAVE_GAMES_KEY);
    if (saved.length === 0) {
        const defaultSaves: SaveGame[] = [
            { name: 'My Career', color: '#8b5cf6' }, 
            { name: 'Journeyman', color: '#10b981' }, 
            { name: 'Road to Glory', color: '#f97316' },
            { name: 'Network Save', color: '#3b82f6' },
            { name: 'Mobile', color: '#ef4444' }
        ];
        saveCustomData(SAVE_GAMES_KEY, defaultSaves);
        return defaultSaves;
    }
    return saved;
  });

  useEffect(() => {
    const storedUsername = localStorage.getItem(USERNAME_KEY);
    if (storedUsername) {
        setUsername(storedUsername);
    } else {
        setIsUsernameModalOpen(true);
    }

    const loadedPlayers = getPlayers();
    if (loadedPlayers.length === 0) {
        const initialData = getInitialPlayers();
        setPlayers(initialData);
        savePlayers(initialData);
    } else {
        const originalString = JSON.stringify(loadedPlayers);
        const migratedPlayers = loadedPlayers.map(migratePlayer);
        if (originalString !== JSON.stringify(migratedPlayers)) {
          savePlayers(migratedPlayers);
        }
        setPlayers(migratedPlayers);
    }

    const loadedManagers = getManagers();
    if (loadedManagers.length === 0) {
        const initialData = getInitialManagers();
        setManagers(initialData);
        saveManagers(initialData);
    } else {
        const originalString = JSON.stringify(loadedManagers);
        const migratedManagers = loadedManagers.map(migrateManager);
        if (originalString !== JSON.stringify(migratedManagers)) {
            saveManagers(migratedManagers);
        }
        setManagers(migratedManagers);
    }
    
    getLargeObject<Record<string, string>>(FACEPACK_CONFIG_KEY).then(config => {
        if (config) {
            setFacepackConfig(config);
        }
    }).catch(err => console.error("Error loading facepack config from IndexedDB", err));

  }, []);
  
  const allHonours = useMemo(() => [...defaultHonours, ...customCompetitions.map(c => ({...c, category: 'Team' as const}))], [customCompetitions]);
  
  const allLeagues = useMemo(() => defaultLeagues, []);

  const allClubs = useMemo(() => {
    const clubs: Record<string, Club> = {};
    for (const name in defaultClubs) {
      clubs[name] = { ...defaultClubs[name], name, id: name };
    }
    for (const club of customClubs) {
      clubs[club.name] = club;
    }
    return clubs;
  }, [customClubs]);

  const handleSavePlayer = useCallback((updatedPlayer: Player) => {
    setPlayers(prevPlayers => {
      const newPlayers = prevPlayers.map(p => p.id === updatedPlayer.id ? updatedPlayer : p);
      savePlayers(newPlayers);
      return newPlayers;
    });
  }, []);

  const handleTogglePlayerFavourite = useCallback((playerId: string) => {
    setPlayers(prevPlayers => {
        const newPlayers = prevPlayers.map(p => 
            p.id === playerId ? { ...p, isFavourite: !p.isFavourite } : p
        );
        savePlayers(newPlayers);
        return newPlayers;
    });
  }, []);

  const handleAddPlayer = () => {
    if (!username) {
        alert("Please set a username first.");
        setIsUsernameModalOpen(true);
        return;
    }
    setIsAddPlayerModalOpen(true);
  };
  
  const handleCreateBlankPlayer = () => {
    const newPlayer = createNewPlayer(saveGames[0]?.name || 'My Career', username!);
    setPlayers(prev => {
        const newPlayers = [newPlayer, ...prev];
        savePlayers(newPlayers);
        return newPlayers;
    });
    setSelectedPlayerId(newPlayer.id);
    setIsAddPlayerModalOpen(false);
  };

  const handleCreatePlayerFromHTML = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const content = e.target?.result as string;
            const { attributes, isGoalkeeper } = parseAttributesFromHTML(content);

            const newPlayer = createNewPlayer(saveGames[0]?.name || 'My Career', username!);
            
            if (isGoalkeeper) {
                newPlayer.primaryPosition = 'GK';
            }

            if (Object.keys(attributes).length > 0) {
                newPlayer.attributes = { ...newPlayer.attributes, ...attributes };
                newPlayer.attributeSnapshots = [{
                    id: uuidv4(),
                    date: new Date().toISOString().split('T')[0],
                    attributes: newPlayer.attributes,
                    value: 0,
                }];
                newPlayer.hasKnownAttributes = true;
            } else {
                newPlayer.hasKnownAttributes = false;
                alert('Could not find any attributes in the uploaded file. A blank player has been created instead.');
            }

            const newPlayers = [newPlayer, ...players];
            setPlayers(newPlayers);
            savePlayers(newPlayers);
            setSelectedPlayerId(newPlayer.id);
            setIsAddPlayerModalOpen(false);
        } catch (error) {
            console.error("Failed to create player from HTML:", error);
            alert("An error occurred while parsing the file. Please ensure it's a valid player profile HTML from Football Manager.");
        }
    };
    reader.readAsText(file);
  };

  const handleSaveManager = useCallback((updatedManager: Manager) => {
    setManagers(prev => {
      const newManagers = prev.map(m => m.id === updatedManager.id ? updatedManager : m);
      saveManagers(newManagers);
      return newManagers;
    });
  }, []);

  const handleToggleManagerFavourite = useCallback((managerId: string) => {
    setManagers(prev => {
        const newManagers = prev.map(m => 
            m.id === managerId ? { ...m, isFavourite: !m.isFavourite } : m
        );
        saveManagers(newManagers);
        return newManagers;
    });
  }, []);

  const handleAddManager = () => {
    if (!username) {
        alert("Please set a username first.");
        setIsUsernameModalOpen(true);
        return;
    }
    const newManager = createNewManager(saveGames[0]?.name || 'My Career', username);
    setManagers(prev => {
        const newManagers = [newManager, ...prev];
        saveManagers(newManagers);
        return newManagers;
    });
    setSelectedManagerId(newManager.id);
  };

  const handleDeleteRequest = (id: string, type: 'player' | 'manager') => {
    setItemToDelete({ id, type });
  };
  
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'player') {
        setPlayers(prev => {
            const newPlayers = prev.filter(p => p.id !== itemToDelete.id);
            savePlayers(newPlayers);
            return newPlayers;
        });
        if (selectedPlayerId === itemToDelete.id) {
            setSelectedPlayerId(null);
        }
    } else if (itemToDelete.type === 'manager') {
        setManagers(prev => {
            const newManagers = prev.filter(m => m.id !== itemToDelete.id);
            saveManagers(newManagers);
            return newManagers;
        });
        if (selectedManagerId === itemToDelete.id) {
            setSelectedManagerId(null);
        }
    }
    
    setItemToDelete(null);
  };
  

  const handleKitDisplayChange = useCallback((id: string) => {
    const player = players.find(p => p.id === id);
    if (!player) return;

    const currentKitIndex = kitDisplayIndices[id] || 0;
    let nextIndex;

    if (player.primaryPosition === 'GK') {
        nextIndex = (currentKitIndex + 1) % 3; // GOALKEEPER_KITS has 3 kits
    } else {
        const clubsPlayedFor = Array.from(new Set([player.currentClub, ...player.clubHistory.map(h => h.clubName)])).filter(Boolean);
        const cycleLimit = clubsPlayedFor.length > 0 ? clubsPlayedFor.length : 1;
        nextIndex = (currentKitIndex + 1) % cycleLimit;
    }

    setKitDisplayIndices(prev => ({
        ...prev,
        [id]: nextIndex,
    }));
  }, [players, kitDisplayIndices]);
  

  const handleUpdateAllTimeXI = (newXI: AllTimeXI) => {
    setAllTimeXI(newXI);
    saveAllTimeXI(newXI);
  };

  const handlePlacePlayerInXI = (position: string, playerId: string) => {
      const newXI = { ...allTimeXI };
      const currentPosition = Object.keys(newXI).find(pos => newXI[pos] === playerId);
      if (currentPosition) {
          newXI[currentPosition] = null;
      }
      
      const existingPlayerIdInTargetPos = newXI[position];
      if (existingPlayerIdInTargetPos && currentPosition) {
        newXI[currentPosition] = existingPlayerIdInTargetPos;
      }
      
      newXI[position] = playerId;
      handleUpdateAllTimeXI(newXI);
  };
  
  const handleRemovePlayerFromXI = (position: string) => {
      const newXI = { ...allTimeXI, [position]: null };
      handleUpdateAllTimeXI(newXI);
  };

  const availableNationalities = useMemo(() => {
    const nationalities = new Set(players.map(p => p.nationality));
    return Array.from(nationalities).sort();
  }, [players]);

  const availablePositions = useMemo(() => {
    const positions = new Set(players.map(p => p.primaryPosition));
    return Array.from(positions).sort();
  }, [players]);
  
  const filteredPlayers = useMemo(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = players.filter(player => {
        const fullName = `${player.firstName} ${player.lastName}`;
        const nameMatch =
            fullName.toLowerCase().includes(lowerCaseQuery) ||
            player.knownAs.toLowerCase().includes(lowerCaseQuery);

        const tagMatch = activeFilters.length === 0 || activeFilters.every(filter => {
            const customTag = customTags.find(t => t.name === filter);
            if (customTag) {
                return player.customTags?.includes(customTag.id);
            }
            return player.fmVersion === filter ||
                player.saveGameName === filter ||
                (filter === newgenTerm && player.isRegen) ||
                (filter === 'Youth Intake' && player.isYouthIntake) ||
                (filter === 'Imported' && player.isImported) ||
                (filter === 'Favourite' && player.isFavourite);
        });
        const nationalityMatch = !nationalityFilter || player.nationality === nationalityFilter;
        const positionMatch = !positionFilter || player.primaryPosition === positionFilter;
        return nameMatch && tagMatch && nationalityMatch && positionMatch;
    });

    return filtered.sort((a, b) => {
        if (a.isFavourite && !b.isFavourite) return -1;
        if (!a.isFavourite && b.isFavourite) return 1;
        return 0;
    });
}, [players, searchQuery, activeFilters, nationalityFilter, positionFilter, newgenTerm, customTags]);


  const filteredManagers = useMemo(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return managers.filter(manager => {
        const fullName = `${manager.firstName} ${manager.lastName}`;
        const nameMatch =
            fullName.toLowerCase().includes(lowerCaseQuery) ||
            manager.knownAs.toLowerCase().includes(lowerCaseQuery);
        // Add tag filtering for managers later if needed
        return nameMatch;
    }).sort((a, b) => {
        if (a.isFavourite && !b.isFavourite) return -1;
        if (!a.isFavourite && b.isFavourite) return 1;
        return 0;
    });
  }, [managers, searchQuery]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    let hasFavourite = false;
    let hasImported = false;
    let hasRegen = false;

    players.forEach(p => {
      tags.add(p.fmVersion);
      if (p.saveGameName) tags.add(p.saveGameName);
      if (p.isRegen) hasRegen = true;
      if (p.isYouthIntake) tags.add('Youth Intake');
      if (p.isFavourite) hasFavourite = true;
      if (p.isImported) hasImported = true;
    });
    
    const tagArray = [];
    if (hasFavourite) tagArray.push('Favourite');
    if (hasImported) tagArray.push('Imported');
    if (hasRegen) tagArray.push(newgenTerm);
    
    tagArray.push(...Array.from(tags).filter(Boolean).sort());
    tagArray.push(...customTags.map(t => t.name).sort());
    return [...new Set(tagArray)];
  }, [players, newgenTerm, customTags]);

  const selectedPlayer = useMemo(() => players.find(p => p.id === selectedPlayerId), [players, selectedPlayerId]);
  const selectedManager = useMemo(() => managers.find(m => m.id === selectedManagerId), [managers, selectedManagerId]);

  const addData = <T,>(key: string, setter: React.Dispatch<React.SetStateAction<T[]>>, newData: T) => {
    const currentData = getCustomData<T>(key);
    const updatedData = [...currentData, newData];
    saveCustomData(key, updatedData);
    setter(updatedData);
  }

  const removeData = <T extends { id: string }>(key: string, setter: React.Dispatch<React.SetStateAction<T[]>>, id: string) => {
    setter(prev => {
        const updated = prev.filter(item => item.id !== id);
        saveCustomData(key, updated);
        return updated;
    });
  };
  
  const removeDataByName = (key: string, setter: React.Dispatch<React.SetStateAction<any[]>>, name: string) => {
    setter((prev: any[]) => {
        const updated = prev.filter(item => item.name !== name);
        saveCustomData(key, updated);
        return updated;
    });
};

  const updateData = <T extends { id: string }>(key: string, setter: React.Dispatch<React.SetStateAction<T[]>>, updatedItem: T) => {
    setter(prev => {
        const updated = prev.map(item => item.id === updatedItem.id ? updatedItem : item);
        saveCustomData(key, updated);
        return updated;
    });
  };

  const handleAddSaveGame = (saveGame: SaveGame) => {
    if (saveGame.name && !saveGames.find(s => s.name === saveGame.name)) {
        const updatedSaveGames = [...saveGames, saveGame];
        setSaveGames(updatedSaveGames);
        saveCustomData(SAVE_GAMES_KEY, updatedSaveGames);
    }
  };
  
  const handleRemoveSaveGame = (saveName: string) => {
    removeDataByName(SAVE_GAMES_KEY, setSaveGames, saveName);
  };
  
  const handleUpdateSaveGame = (name: string, color: string) => {
    setSaveGames(prev => {
        const updated = prev.map(s => s.name === name ? { ...s, color } : s);
        saveCustomData(SAVE_GAMES_KEY, updated);
        return updated;
    });
  };
  
  const handleAddCustomTag = (tag: CustomTag) => {
    if (tag.name && !customTags.find(t => t.name === tag.name)) {
        const updatedTags = [...customTags, tag];
        setCustomTags(updatedTags);
        saveCustomData(CUSTOM_TAGS_KEY, updatedTags);
    }
  };

  const handleRemoveCustomTag = (tagId: string) => {
      removeData(CUSTOM_TAGS_KEY, setCustomTags, tagId);
  };

  const handleUpdateCustomTag = (tag: CustomTag) => {
      updateData(CUSTOM_TAGS_KEY, setCustomTags, tag);
  };

  const handleSaveUsername = (name: string) => {
    if (name.trim()) {
        localStorage.setItem(USERNAME_KEY, name.trim());
        setUsername(name.trim());
        setIsUsernameModalOpen(false);

        const welcomeModalShown = localStorage.getItem(WELCOME_MODAL_SHOWN_KEY);
        if (!welcomeModalShown) {
            setIsWelcomeModalOpen(true);
        }
    }
  };

  const handleCloseWelcomeModal = () => {
    setIsWelcomeModalOpen(false);
    localStorage.setItem(WELCOME_MODAL_SHOWN_KEY, 'true');
  };
  
  const handleUpdateUsername = (newName: string) => {
      const oldName = username;
      if (!newName.trim() || newName.trim() === oldName) return;

      localStorage.setItem(USERNAME_KEY, newName.trim());
      setUsername(newName.trim());

      setPlayers(prevPlayers => {
          const updatedPlayers = prevPlayers.map(p => 
              p.originalManager === oldName ? { ...p, originalManager: newName.trim() } : p
          );
          savePlayers(updatedPlayers);
          return updatedPlayers;
      });
      setManagers(prevManagers => {
          const updatedManagers = prevManagers.map(m =>
                m.originalManager === oldName ? { ...m, originalManager: newName.trim() } : m
          );
          saveManagers(updatedManagers);
          return updatedManagers;
      });
      alert("Manager name updated successfully!");
  }

  const handleExport = (ids: string[], type: 'player' | 'manager') => {
    const requiredClubNames = new Set<string>();
    const requiredCompIds = new Set<string>();
    const requiredSaveGameNames = new Set<string>();
    let exportData: ExportData;
    let fileName = '';
    const date = new Date().toISOString().slice(0, 10);

    if (type === 'player') {
        const playersToExport = players.filter(p => ids.includes(p.id));
        playersToExport.forEach(p => {
            if (p.currentClub) requiredClubNames.add(p.currentClub);
            p.clubHistory.forEach(h => requiredClubNames.add(h.clubName));
            p.seasonStats.forEach(s => s.honours.forEach(hId => requiredCompIds.add(hId)));
            if (p.saveGameName) requiredSaveGameNames.add(p.saveGameName);
        });
        exportData = {
            players: playersToExport,
            customClubs: customClubs.filter(c => requiredClubNames.has(c.name)),
            customCompetitions: customCompetitions.filter(c => requiredCompIds.has(c.id)),
            saveGames: saveGames.filter(s => requiredSaveGameNames.has(s.name)),
        };

        if (ids.length === 1 && playersToExport.length === 1) {
            const playerName = (playersToExport[0].knownAs || `${playersToExport[0].firstName} ${playersToExport[0].lastName}`).replace(/\s+/g, '_');
            fileName = `FMPA_${playerName}_export_${date}.JSON`;
        } else {
            fileName = `FMPA_Player_Export_${date}.json`;
        }

    } else {
        const managersToExport = managers.filter(m => ids.includes(m.id));
        managersToExport.forEach(m => {
            if (m.currentClub) requiredClubNames.add(m.currentClub);
            m.clubHistory.forEach(h => requiredClubNames.add(h.clubName));
            m.seasonStats.forEach(s => Object.keys(s.honours).forEach(hId => requiredCompIds.add(hId)));
            if (m.saveGameName) requiredSaveGameNames.add(m.saveGameName);
        });
        exportData = {
            managers: managersToExport,
            customClubs: customClubs.filter(c => requiredClubNames.has(c.name)),
            customCompetitions: customCompetitions.filter(c => requiredCompIds.has(c.id)),
            saveGames: saveGames.filter(s => requiredSaveGameNames.has(s.name)),
        };

        if (ids.length === 1 && managersToExport.length === 1) {
            const managerName = (managersToExport[0].knownAs || `${managersToExport[0].firstName} ${managersToExport[0].lastName}`).replace(/\s+/g, '_');
            fileName = `FMPA_${managerName}_export_${date}.JSON`;
        } else {
            fileName = `FMPA_Manager_Export_${date}.json`;
        }
    }

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportData, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = fileName;
    link.click();
    setExportModalConfig(null);
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const text = e.target?.result as string;
            const data = JSON.parse(text) as ExportData;

            if (!data.customClubs || !data.customCompetitions || !data.saveGames) {
                throw new Error("Invalid export file structure.");
            }

            const newSaveGames = [...saveGames];
            data.saveGames.forEach(importedSave => {
                if (!newSaveGames.some(s => s.name === importedSave.name)) {
                    newSaveGames.push(importedSave);
                }
            });
            setSaveGames(newSaveGames);
            saveCustomData(SAVE_GAMES_KEY, newSaveGames);

            const newCompetitions = [...customCompetitions];
            data.customCompetitions.forEach(importedComp => {
                if (!newCompetitions.some(c => c.id === importedComp.id)) {
                    newCompetitions.push(importedComp);
                }
            });
            setCustomCompetitions(newCompetitions);
            saveCustomData(CUSTOM_COMPETITIONS_KEY, newCompetitions);

            const newClubs = [...customClubs];
            data.customClubs.forEach(importedClub => {
                if (!newClubs.some(c => c.id === importedClub.id || c.name === importedClub.name)) {
                    newClubs.push(importedClub);
                }
            });
            setCustomClubs(newClubs);
            saveCustomData(CUSTOM_CLUBS_KEY, newClubs);
            
            let totalImported = 0;
            if (data.players) {
                const newPlayers = [...players];
                let importedCount = 0;
                data.players.forEach(importedPlayer => {
                    if (!newPlayers.some(p => p.id === importedPlayer.id)) {
                        const playerWithImportFlag = { ...importedPlayer, isImported: importedPlayer.originalManager !== username };
                        const playerToAdd = migratePlayer(playerWithImportFlag);
                        newPlayers.push(playerToAdd);
                        importedCount++;
                    }
                });
                if (importedCount > 0) {
                    setPlayers(newPlayers);
                    savePlayers(newPlayers);
                    totalImported += importedCount;
                }
            }

            if (data.managers) {
                const newManagers = [...managers];
                let importedCount = 0;
                data.managers.forEach(importedManager => {
                    if (!newManagers.some(m => m.id === importedManager.id)) {
                        const managerWithImportFlag = { ...importedManager, isImported: importedManager.originalManager !== username };
                        const managerToAdd = migrateManager(managerWithImportFlag);
                        newManagers.push(managerToAdd);
                        importedCount++;
                    }
                });
                if (importedCount > 0) {
                    setManagers(newManagers);
                    saveManagers(newManagers);
                    totalImported += importedCount;
                }
            }

            if (totalImported > 0) {
                alert(`Successfully imported ${totalImported} new entry/entries!`);
            } else {
                alert("No new players or managers to import. They may already exist in your database.");
            }
        } catch (error) {
            console.error("Import failed:", error);
            alert("Failed to import file. It might be corrupted or in the wrong format.");
        }
    };
    reader.readAsText(file);
  };
  
  const handleExportAllData = () => {
    const fullExport: FullExportData = {
        username,
        players,
        managers,
        customLeagues,
        customClubs,
        customCompetitions,
        customTags,
        saveGames,
        fmVersions,
        allTimeXI,
        customIcons,
        trophyCabinetSettings,
        newgenTerm,
        dateFormat,
        currency,
        welcomeModalShown: !!localStorage.getItem(WELCOME_MODAL_SHOWN_KEY),
        facesPath,
        facepackConfig,
    };
    
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(fullExport, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `FMPA_Full_Export_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  };
  
  const handleRequestFullImport = (file: File) => {
    setFullImportFile(file);
    setIsFullImportConfirmOpen(true);
  };

  const handleConfirmFullImport = () => {
    if (!fullImportFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const text = e.target?.result as string;
            const data = JSON.parse(text) as FullExportData;
            
            if (!data.players || !data.managers || !data.customLeagues || !data.customClubs || !data.customCompetitions || !data.saveGames || !data.fmVersions || data.allTimeXI === undefined) {
                throw new Error("Invalid full export file structure.");
            }

            localStorage.setItem(USERNAME_KEY, data.username || '');
            
            const migratedPlayers = data.players.map(migratePlayer);
            savePlayers(migratedPlayers);

            const migratedManagers = data.managers.map(migrateManager);
            saveManagers(migratedManagers);

            saveCustomData(CUSTOM_LEAGUES_KEY, data.customLeagues);
            saveCustomData(CUSTOM_CLUBS_KEY, data.customClubs);
            saveCustomData(CUSTOM_COMPETITIONS_KEY, data.customCompetitions);
            saveCustomData(CUSTOM_TAGS_KEY, data.customTags || []);
            saveCustomData(SAVE_GAMES_KEY, data.saveGames);
            saveCustomData(FM_VERSIONS_KEY, data.fmVersions);
            saveAllTimeXI(data.allTimeXI);
            saveCustomObject(CUSTOM_ICONS_KEY, data.customIcons || {});
            saveCustomObject(TROPHY_CABINET_SETTINGS_KEY, data.trophyCabinetSettings || getDefaultTrophyCabinetSettings());
            localStorage.setItem(NEWGEN_TERM_KEY, data.newgenTerm || 'NewGen');
            localStorage.setItem(DATE_FORMAT_KEY, data.dateFormat || 'dd/mm/yyyy');
            localStorage.setItem(CURRENCY_KEY, data.currency || 'GBP');
            localStorage.setItem(WELCOME_MODAL_SHOWN_KEY, data.welcomeModalShown ? 'true' : 'false');
            localStorage.setItem(FACEPACK_PATH_KEY, data.facesPath || '');
            
            localStorage.removeItem(FACEPACK_CONFIG_KEY); // Clear any old localStorage entry
            saveLargeObject(FACEPACK_CONFIG_KEY, data.facepackConfig || {}).catch(err => console.error("Failed to import facepack config to IndexedDB", err));
            
            setIsFullImportConfirmOpen(false);
            setFullImportFile(null);
            setIsReloadModalOpen(true);

        } catch (error) {
            console.error("Full import failed:", error);
            alert("Failed to import file. It might be corrupted or in the wrong format.");
            setIsFullImportConfirmOpen(false);
            setFullImportFile(null);
        }
    };
    reader.readAsText(fullImportFile);
  };


  const handleAddFmVersion = (version: string) => {
    if (version && !fmVersions.includes(version)) {
        const updated = [version, ...fmVersions].sort((a, b) => b.localeCompare(a));
        setFmVersions(updated);
        saveCustomData(FM_VERSIONS_KEY, updated);
    }
  };

  const handleRemoveFmVersion = (version: string) => {
    removeDataByName(FM_VERSIONS_KEY, setFmVersions, version);
  };

  const handleUpdateCustomIcon = (honourId: string, iconData: string) => {
    setCustomIcons(prev => {
        const newIcons = { ...prev, [honourId]: iconData };
        saveCustomObject(CUSTOM_ICONS_KEY, newIcons);
        return newIcons;
    });
  };

  const handleUpdateTrophyCabinetSettings = (settings: TrophyCabinetSettings) => {
    setTrophyCabinetSettings(settings);
    saveCustomObject(TROPHY_CABINET_SETTINGS_KEY, settings);
  };

  const handleUpdateNewgenTerm = (term: NewgenTerm) => {
    setNewgenTerm(term);
    localStorage.setItem(NEWGEN_TERM_KEY, term);
  };

  const handleUpdateDateFormat = (format: DateFormatOption) => {
    setDateFormat(format);
    localStorage.setItem(DATE_FORMAT_KEY, format);
  };
  
  const handleUpdateCurrency = (newCurrency: CurrencyOption) => {
    setCurrency(newCurrency);
    localStorage.setItem(CURRENCY_KEY, newCurrency);
  };

  const handleUpdateFacesPath = (path: string) => {
    setFacesPath(path);
    localStorage.setItem(FACEPACK_PATH_KEY, path);
  };

  const handleUpdateFacepackConfig = (config: Record<string, string>) => {
    setFacepackConfig(config);
    saveLargeObject(FACEPACK_CONFIG_KEY, config).catch(err => {
      console.error("Failed to save facepack config to IndexedDB", err);
    });
  };

  const handleRequestReset = () => {
    setIsResetModalOpen(true);
    setResetStep(1);
    setResetConfirmationText('');
  };

  const handleConfirmReset = () => {
      localStorage.removeItem(PLAYERS_KEY);
      localStorage.removeItem(MANAGERS_KEY);
      localStorage.removeItem(CUSTOM_LEAGUES_KEY);
      localStorage.removeItem(CUSTOM_CLUBS_KEY);
      localStorage.removeItem(CUSTOM_COMPETITIONS_KEY);
      localStorage.removeItem(CUSTOM_ICONS_KEY);
      localStorage.removeItem(CUSTOM_TAGS_KEY);
      localStorage.removeItem(TROPHY_CABINET_SETTINGS_KEY);
      localStorage.removeItem(SAVE_GAMES_KEY);
      localStorage.removeItem(ALL_TIME_XI_KEY);
      localStorage.removeItem(USERNAME_KEY);
      localStorage.removeItem(FM_VERSIONS_KEY);
      localStorage.removeItem(WELCOME_MODAL_SHOWN_KEY);
      localStorage.removeItem(NEWGEN_TERM_KEY);
      localStorage.removeItem(DATE_FORMAT_KEY);
      localStorage.removeItem(CURRENCY_KEY);
      localStorage.removeItem(FACEPACK_PATH_KEY);
      localStorage.removeItem(FACEPACK_CONFIG_KEY);
      removeLargeObject(FACEPACK_CONFIG_KEY).catch(err => console.error("Failed to remove facepack config from IndexedDB", err));
      window.location.reload();
  };

  const handleCloseResetModal = () => {
      setIsResetModalOpen(false);
  };
  
  const handleViewChange = (view: 'players' | 'managers') => {
      setDatabaseView(view);
      setSearchQuery('');
      setActiveFilters([]);
      setSelectedPlayerId(null);
      setSelectedManagerId(null);
  }

  const handleNavigateToPlayer = (playerId: string) => {
    setActiveTab('database');
    setDatabaseView('players');
    setSelectedPlayerId(playerId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard players={players} managers={managers} username={username} onSelectPlayer={handleNavigateToPlayer} allClubs={allClubs} saveGames={saveGames} currency={currency} />;
      case 'database':
        return (
          <div className="flex h-full gap-4">
              <div className="w-1/3 max-w-md flex flex-col bg-gray-800/60 rounded-lg border border-gray-700/50">
                  {databaseView === 'players' ? (
                      <PlayerList
                          players={filteredPlayers}
                          playerCount={players.length}
                          managerCount={managers.length}
                          onViewChange={handleViewChange}
                          selectedPlayerId={selectedPlayerId}
                          onSelectPlayer={setSelectedPlayerId}
                          onToggleFavourite={handleTogglePlayerFavourite}
                          onAddPlayer={handleAddPlayer}
                          onOpenExportModal={() => setExportModalConfig({ type: 'player' })}
                          onImportFile={handleImport}
                          searchQuery={searchQuery}
                          onSearch={setSearchQuery}
                          activeFilters={activeFilters}
                          onFilterChange={setActiveFilters}
                          allTags={allTags}
                          allHonours={allHonours}
                          allClubs={allClubs}
                          nationalityFilter={nationalityFilter}
                          onNationalityFilterChange={setNationalityFilter}
                          availableNationalities={availableNationalities}
                          positionFilter={positionFilter}
                          onPositionFilterChange={setPositionFilter}
                          availablePositions={availablePositions}
                          kitDisplayIndices={kitDisplayIndices}
                          onKitClick={handleKitDisplayChange}
                          saveGames={saveGames}
                          customTags={customTags}
                          newgenTerm={newgenTerm}
                      />
                  ) : (
                      <ManagerList
                          managers={filteredManagers}
                          playerCount={players.length}
                          managerCount={managers.length}
                          onViewChange={handleViewChange}
                          selectedManagerId={selectedManagerId}
                          onSelectManager={setSelectedManagerId}
                          onToggleFavourite={handleToggleManagerFavourite}
                          onAddManager={handleAddManager}
                          onOpenExportModal={() => setExportModalConfig({ type: 'manager' })}
                          onImportFile={handleImport}
                          searchQuery={searchQuery}
                          onSearch={setSearchQuery}
                          allHonours={allHonours}
                          allClubs={allClubs}
                          saveGames={saveGames}
                      />
                  )}
              </div>
              
              <div className="w-2/3 flex-1 bg-gray-800/60 rounded-lg border border-gray-700/50 overflow-y-auto">
                  {databaseView === 'players' && selectedPlayer ? (
                      <PlayerDetails
                          key={selectedPlayer.id}
                          player={selectedPlayer}
                          onSave={handleSavePlayer}
                          onDelete={(id) => handleDeleteRequest(id, 'player')}
                          onToggleFavourite={handleTogglePlayerFavourite}
                          onAddClub={(club) => addData(CUSTOM_CLUBS_KEY, setCustomClubs, club)}
                          allHonours={allHonours}
                          allClubs={allClubs}
                          allLeagues={allLeagues}
                          saveGames={saveGames}
                          fmVersions={fmVersions}
                          customIcons={customIcons}
                          trophyCabinetSettings={trophyCabinetSettings}
                          kitDisplayIndex={kitDisplayIndices[selectedPlayer.id] || 0}
                          onKitClick={handleKitDisplayChange}
                          newgenTerm={newgenTerm}
                          dateFormat={dateFormat}
                          currency={currency}
                          customTags={customTags}
                          facesPath={facesPath}
                          facepackConfig={facepackConfig}
                      />
                  ) : databaseView === 'managers' && selectedManager ? (
                       <ManagerDetails
                          key={selectedManager.id}
                          manager={selectedManager}
                          onSave={handleSaveManager}
                          onDelete={(id) => handleDeleteRequest(id, 'manager')}
                          onToggleFavourite={handleToggleManagerFavourite}
                          onAddClub={(club) => addData(CUSTOM_CLUBS_KEY, setCustomClubs, club)}
                          allHonours={allHonours}
                          allClubs={allClubs}
                          saveGames={saveGames}
                          fmVersions={fmVersions}
                          customIcons={customIcons}
                          trophyCabinetSettings={trophyCabinetSettings}
                      />
                  ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500">
                          <p className="text-2xl font-semibold">No {databaseView === 'players' ? 'Player' : 'Manager'} Selected</p>
                          <p className="mt-2">Select an entry from the list or add a new one.</p>
                      </div>
                  )}
              </div>
          </div>
        );
      case 'all-time-xi':
        return <AllTimeXIView allPlayers={players} allClubs={allClubs} allTimeXI={allTimeXI} onPlacePlayer={handlePlacePlayerInXI} onRemovePlayer={handleRemovePlayerFromXI} onUpdateXI={handleUpdateAllTimeXI} onKitClick={handleKitDisplayChange} kitDisplayIndices={kitDisplayIndices} />;
      case 'matchday':
        return <MatchDayView allClubs={allClubs} homeTeam={homeTeam} awayTeam={awayTeam} setHomeTeam={setHomeTeam} setAwayTeam={setAwayTeam} />;
      case 'compare':
        return <PlayerCompareView allPlayers={players} allClubs={allClubs} />;
      case 'player-cards':
        return <PlayerCardView allPlayers={players} allClubs={allClubs} newgenTerm={newgenTerm} />;
      case 'growth-history':
        return <PlayerGrowthHistory allPlayers={players} />;
      case 'customise':
        return <CustomisePage username={username} onUpdateUsername={handleUpdateUsername} customLeagues={customLeagues} customClubs={customClubs} customCompetitions={customCompetitions} allHonours={allHonours} customIcons={customIcons} trophyCabinetSettings={trophyCabinetSettings} saveGames={saveGames} fmVersions={fmVersions} newgenTerm={newgenTerm} onUpdateNewgenTerm={handleUpdateNewgenTerm} dateFormat={dateFormat} onUpdateDateFormat={handleUpdateDateFormat} currency={currency} onUpdateCurrency={handleUpdateCurrency} onAddLeague={(league) => addData(CUSTOM_LEAGUES_KEY, setCustomLeagues, league)} onAddClub={(club) => addData(CUSTOM_CLUBS_KEY, setCustomClubs, club)} onAddCompetition={(comp) => addData(CUSTOM_COMPETITIONS_KEY, setCustomCompetitions, comp)} onUpdateCompetition={(comp) => updateData(CUSTOM_COMPETITIONS_KEY, setCustomCompetitions, comp)} onUpdateCustomIcon={handleUpdateCustomIcon} onUpdateTrophyCabinetSettings={handleUpdateTrophyCabinetSettings} onAddSaveGame={handleAddSaveGame} onAddFmVersion={handleAddFmVersion} onRemoveLeague={(id) => removeData(CUSTOM_LEAGUES_KEY, setCustomLeagues, id)} onRemoveClub={(id) => removeData(CUSTOM_CLUBS_KEY, setCustomClubs, id)} onRemoveCompetition={(id) => removeData(CUSTOM_COMPETITIONS_KEY, setCustomCompetitions, id)} onRemoveSaveGame={handleRemoveSaveGame} onRemoveFmVersion={handleRemoveFmVersion} onUpdateSaveGame={handleUpdateSaveGame} allClubs={allClubs} onResetRequest={handleRequestReset} onExportAllData={handleExportAllData} onImportAllRequest={handleRequestFullImport} customTags={customTags} onAddCustomTag={handleAddCustomTag} onRemoveCustomTag={handleRemoveCustomTag} onUpdateCustomTag={handleUpdateCustomTag} facesPath={facesPath} onUpdateFacesPath={handleUpdateFacesPath} facepackConfig={facepackConfig} onUpdateFacepackConfig={handleUpdateFacepackConfig} />;
      case 'about':
        return <AboutPage onOpenSupportModal={() => setIsSupportModalOpen(true)} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#1f2429] text-gray-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 p-4 overflow-y-auto">
        {renderContent()}
      </main>

      <Modal isOpen={isUsernameModalOpen} onClose={() => {}} title="Welcome! Please Set Your Manager Name">
            <form onSubmit={(e) => { e.preventDefault(); handleSaveUsername(tempUsername); }}>
                <div className="space-y-4">
                    <p className="text-gray-300">This name will be attached to any players you create.</p>
                    <Input 
                        value={tempUsername} 
                        onChange={e => setTempUsername(e.target.value)} 
                        placeholder="Enter your name..."
                        required 
                    />
                    <Button type="submit" variant="primary" className="w-full">Save Name</Button>
                </div>
            </form>
       </Modal>
       
        <AddPlayerModal
            isOpen={isAddPlayerModalOpen}
            onClose={() => setIsAddPlayerModalOpen(false)}
            onCreateBlank={handleCreateBlankPlayer}
            onCreateFromHTML={handleCreatePlayerFromHTML}
        />

        <Modal isOpen={isWelcomeModalOpen} onClose={handleCloseWelcomeModal} title="Welcome to FMPA v1.2!">
            <div className="space-y-4 text-gray-300">
                <p>I've added new features for managers, including league table imports!</p>
                <p>If you wish to see exactly how to use any of the new features, please head over to the <strong>About</strong> tab and click the <strong>"How to Use / Features"</strong> button.</p>
                <p>This app has been designed by a less than competent Dev (hello). It has been designed to work in full screen mode. If you use this in windowed view, you may experience some odd UI behaviour. The same with the zoom function.</p>
                <p>These can (usually) be fixed by maximising or resetting the zoom.</p>
                <p>Thank you,</p>
                <p> Chris, (The incompetent dev :) ) </p>
                <div className="flex justify-end pt-4">
                    <Button onClick={handleCloseWelcomeModal} variant="primary">Confirm</Button>
                </div>
            </div>
        </Modal>

        <ExportModal 
            isOpen={!!exportModalConfig}
            onClose={() => setExportModalConfig(null)}
            itemsToExport={
                exportModalConfig?.type === 'player'
                ? players.map(p => ({ id: p.id, name: p.knownAs || `${p.firstName} ${p.lastName}`}))
                : managers.map(m => ({ id: m.id, name: m.knownAs || `${m.firstName} ${m.lastName}`}))
            }
            itemType={exportModalConfig?.type || 'player'}
            onExport={handleExport}
        />

        <Modal 
            isOpen={!!itemToDelete} 
            onClose={() => setItemToDelete(null)} 
            title={`Confirm ${itemToDelete?.type === 'player' ? 'Player' : 'Manager'} Deletion`}
        >
            <div className="space-y-4">
                <p className="text-gray-300 text-center text-lg">
                    Are you sure you want to permanently delete this {itemToDelete?.type}?
                </p>
                <p className="text-red-400 text-sm font-semibold text-center">
                    This action cannot be undone.
                </p>
                <div className="flex justify-center gap-4 pt-6">
                    <Button onClick={() => setItemToDelete(null)} variant="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} variant="danger">
                        Delete {itemToDelete?.type === 'player' ? 'Player' : 'Manager'}
                    </Button>
                </div>
            </div>
        </Modal>

        <Modal
            isOpen={isResetModalOpen}
            onClose={handleCloseResetModal}
            title="Confirm Full Data Reset"
        >
            {resetStep === 1 ? (
                <div className="space-y-4">
                    <p className="text-gray-300 text-center text-lg">
                        Are you sure you want to reset all application data?
                    </p>
                    <p className="text-red-400 text-center font-semibold">
                        This will delete ALL players, managers, custom clubs, save games, and settings. This action is irreversible.
                    </p>
                    <div className="flex justify-center gap-4 pt-6">
                        <Button onClick={handleCloseResetModal} variant="secondary">
                            Cancel
                        </Button>
                        <Button onClick={() => setResetStep(2)} variant="danger">
                            Yes, I Understand
                        </Button>
                    </div>
                </div>
            ) : (
                <form onSubmit={(e) => { e.preventDefault(); if (resetConfirmationText === 'RESET') { handleConfirmReset(); }}}>
                    <div className="space-y-4">
                        <p className="text-red-400 text-center font-bold text-lg">
                            FINAL CONFIRMATION
                        </p>
                        <p className="text-gray-300 text-center">
                            To proceed, please type "RESET" into the box below.
                        </p>
                        <Input
                            type="text"
                            value={resetConfirmationText}
                            onChange={(e) => setResetConfirmationText(e.target.value)}
                            placeholder='Type "RESET" to confirm'
                            className="text-center"
                            autoFocus
                        />
                        <div className="flex justify-center gap-4 pt-6">
                            <Button onClick={handleCloseResetModal} variant="secondary" type="button">
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirmReset}
                                variant="danger"
                                type="submit"
                                disabled={resetConfirmationText !== 'RESET'}
                            >
                                Reset All Data
                            </Button>
                        </div>
                    </div>
                </form>
            )}
        </Modal>

        <Modal
            isOpen={isFullImportConfirmOpen}
            onClose={() => setIsFullImportConfirmOpen(false)}
            title="Confirm Full Data Import"
        >
            <div className="space-y-4">
                <p className="text-gray-300 text-center text-lg">
                    Are you sure you want to import this file?
                </p>
                <p className="text-red-400 text-center font-semibold">
                    This will overwrite ALL current application data. This action is irreversible.
                </p>
                <div className="flex justify-center gap-4 pt-6">
                    <Button onClick={() => setIsFullImportConfirmOpen(false)} variant="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmFullImport} variant="danger">
                        Yes, Overwrite All Data
                    </Button>
                </div>
            </div>
        </Modal>

       <Modal isOpen={isSupportModalOpen} onClose={() => setIsSupportModalOpen(false)} title="Support FM Player Archive">
            <div className="space-y-6 text-center">
                <p className="text-gray-300 text-lg leading-relaxed">
                    All the work on this app was done with no funding and just for a love of the game. I don't need anything, but any donations towards implementing fan ideas would be greatly appreciated! If the link below doesn't work you can also find it in the 'help' menu at the top of the app.
                </p>
                <a 
                    href="https://paypal.me/MrCrispy94?country.x=GB&locale.x=en_GB"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button variant="primary">
                        Donate via PayPal.Me
                    </Button>
                </a>
            </div>
        </Modal>

        <Modal
            isOpen={isReloadModalOpen}
            onClose={() => {}}
            title="Import Successful"
        >
            <div className="space-y-4">
                <p className="text-gray-300 text-center text-lg">
                    Your data has been imported successfully.
                </p>
                <p className="text-gray-300 text-center">
                    The application must be reloaded to apply all changes.
                </p>
                <div className="flex justify-center pt-6">
                    <Button onClick={() => window.location.reload()} variant="primary">
                        Reload Application
                    </Button>
                </div>
            </div>
        </Modal>
    </div>
  );
};

export default App;