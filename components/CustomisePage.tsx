import React, { useState, useMemo, useEffect } from 'react';
import { League, Club, Competition, SaveGame, HonourType, Honour, TrophyCabinetSettings, NewgenTerm, DateFormatOption, CurrencyOption, CustomTag } from '../types';
import { CONTINENTS, HONOUR_TYPES, getHonourInfo, CURRENCIES } from '../constants';
import { v4 as uuidv4 } from 'uuid';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import CreateClubForm from './CreateClubForm';
import { TrashIcon } from './icons/TrashIcon';
import CompetitionModal from './CompetitionModal';
import { PencilIcon } from './icons/PencilIcon';
import Modal from './ui/Modal';
import CustomIconsModal from './CustomIconsModal';
import { TROPHY_ICONS } from './icons/trophies';
import TrophyCabinetCustomiseModal from './TrophyCabinetCustomiseModal';
import FacepackSetupModal from './FacepackSetupModal';

interface CustomisePageProps {
  username: string | null;
  onUpdateUsername: (name: string) => void;
  customLeagues: League[];
  customClubs: Club[];
  customCompetitions: Competition[];
  allHonours: Honour[];
  customIcons: Record<string, string>;
  trophyCabinetSettings: TrophyCabinetSettings;
  saveGames: SaveGame[];
  fmVersions: string[];
  newgenTerm: NewgenTerm;
  onUpdateNewgenTerm: (term: NewgenTerm) => void;
  dateFormat: DateFormatOption;
  onUpdateDateFormat: (format: DateFormatOption) => void;
  currency: CurrencyOption;
  onUpdateCurrency: (currency: CurrencyOption) => void;
  
  onAddLeague: (league: League) => void;
  onAddClub: (club: Club) => void;
  onAddCompetition: (competition: Competition) => void;
  onUpdateCompetition: (competition: Competition) => void;
  onUpdateCustomIcon: (honourId: string, iconData: string) => void;
  onUpdateTrophyCabinetSettings: (settings: TrophyCabinetSettings) => void;
  onAddSaveGame: (saveGame: SaveGame) => void;
  onAddFmVersion: (version: string) => void;
  
  onRemoveLeague: (id: string) => void;
  onRemoveClub: (id: string) => void;
  onRemoveCompetition: (id: string) => void;
  onRemoveSaveGame: (name: string) => void;
  onRemoveFmVersion: (version: string) => void;
  onUpdateSaveGame: (name: string, color: string) => void;
  
  allClubs: Record<string, Club>;
  onResetRequest: () => void;
  onExportAllData: () => void;
  onImportAllRequest: (file: File) => void;
  
  customTags: CustomTag[];
  onAddCustomTag: (tag: CustomTag) => void;
  onRemoveCustomTag: (id: string) => void;
  onUpdateCustomTag: (tag: CustomTag) => void;

  facesPath: string;
  onUpdateFacesPath: (path: string) => void;
  facepackConfig: Record<string, string>;
  onUpdateFacepackConfig: (config: Record<string, string>) => void;
}

const DataListSection: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="p-4 bg-gray-900/50 rounded-lg space-y-3 self-start">
        <h3 className="text-xl font-semibold text-purple-400">{title}</h3>
        {children}
    </div>
);


export const CustomisePage: React.FC<CustomisePageProps> = (props) => {
    const { 
        username, onUpdateUsername,
        customLeagues, customClubs, customCompetitions, allHonours, customIcons, trophyCabinetSettings, saveGames, fmVersions,
        newgenTerm, onUpdateNewgenTerm, dateFormat, onUpdateDateFormat, currency, onUpdateCurrency,
        onAddLeague, onAddClub, onAddCompetition, onUpdateCompetition, onUpdateCustomIcon, onUpdateTrophyCabinetSettings, onAddSaveGame, onAddFmVersion,
        onRemoveLeague, onRemoveClub, onRemoveCompetition, onRemoveSaveGame, onRemoveFmVersion, onUpdateSaveGame,
        allClubs, onResetRequest, onExportAllData, onImportAllRequest,
        customTags, onAddCustomTag, onRemoveCustomTag, onUpdateCustomTag,
        facesPath, onUpdateFacesPath, facepackConfig, onUpdateFacepackConfig
    } = props;

    const [managerName, setManagerName] = useState(username || '');
    const [leagueName, setLeagueName] = useState('');
    const [leagueNation, setLeagueNation] = useState('England');
    const [saveGameName, setSaveGameName] = useState('');
    const [saveGameColor, setSaveGameColor] = useState('#6366f1');
    const [newFmVersion, setNewFmVersion] = useState('');
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState('#a855f7');
    
    const [isCompetitionModalOpen, setIsCompetitionModalOpen] = useState(false);
    const [isCustomIconsModalOpen, setIsCustomIconsModalOpen] = useState(false);
    const [isCabinetModalOpen, setIsCabinetModalOpen] = useState(false);
    const [isFacepackModalOpen, setIsFacepackModalOpen] = useState(false);
    const [editingCompetition, setEditingCompetition] = useState<Competition | undefined>(undefined);
    const [itemToDelete, setItemToDelete] = useState<{ type: string; name: string; id: string; action: (id: string) => void; } | null>(null);

    const importAllRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        setManagerName(username || '');
    }, [username]);
    
    const handleOpenAddCompetitionModal = () => {
        setEditingCompetition(undefined);
        setIsCompetitionModalOpen(true);
    };
    
    const handleOpenEditCompetitionModal = (comp: Competition) => {
        setEditingCompetition(comp);
        setIsCompetitionModalOpen(true);
    };

    const handleSaveCompetition = (comp: Competition) => {
        if (customCompetitions.some(c => c.id === comp.id)) {
            onUpdateCompetition(comp);
        } else {
            onAddCompetition(comp);
        }
        setIsCompetitionModalOpen(false);
    };

    const handleAddLeague = (e: React.FormEvent) => {
        e.preventDefault();
        if(!leagueName) return;
        onAddLeague({ id: uuidv4(), name: leagueName, nation: leagueNation });
        setLeagueName('');
    }

    const handleAddSaveGame = (e: React.FormEvent) => {
        e.preventDefault();
        if(!saveGameName) return;
        onAddSaveGame({ name: saveGameName, color: saveGameColor });
        setSaveGameName('');
        setSaveGameColor('#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'));
    }

    const handleAddFmVersion = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFmVersion) return;
        onAddFmVersion(newFmVersion);
        setNewFmVersion('');
    }
    
    const handleAddCustomTag = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTagName) return;
        onAddCustomTag({ id: uuidv4(), name: newTagName, color: newTagColor });
        setNewTagName('');
        setNewTagColor('#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'));
    }

    const handleUpdateManagerName = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateUsername(managerName);
    };

    const handleDeleteClick = (type: string, name: string, id: string, action: (id: string) => void) => {
        setItemToDelete({ type, name, id, action });
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            itemToDelete.action(itemToDelete.id);
            setItemToDelete(null);
        }
    };

     const handleImportAllClick = () => {
        importAllRef.current?.click();
    };

    const handleImportAllFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImportAllRequest(e.target.files[0]);
            e.target.value = ''; // Reset
        }
    };

    const allNations = useMemo(() => Object.keys(CONTINENTS).flatMap(c => CONTINENTS[c]).sort(), []);
    
    const getTypeLabel = (type: HonourType) => {
        for (const group of HONOUR_TYPES) {
            const found = group.options.find(opt => opt.value === type);
            if (found) return found.label;
        }
        return type;
    }

    const CompetitionIcon = ({ iconName, customIconData }: { iconName?: string; customIconData?: string }) => {
        if (customIconData) {
            return <img src={customIconData} alt="Custom Icon" className="w-5 h-5 object-contain" />;
        }
        const Icon = iconName ? TROPHY_ICONS[iconName] : null;
        if (Icon) return <Icon className="w-5 h-5" />;
        return <div className="w-5 h-5 bg-gray-600 rounded-sm" />;
    };


    return (
        <>
            <CompetitionModal
                isOpen={isCompetitionModalOpen}
                onClose={() => setIsCompetitionModalOpen(false)}
                onSave={handleSaveCompetition}
                competitionToEdit={editingCompetition}
            />
            <CustomIconsModal
                isOpen={isCustomIconsModalOpen}
                onClose={() => setIsCustomIconsModalOpen(false)}
                allHonours={allHonours}
                customIcons={customIcons}
                onUpdateIcon={onUpdateCustomIcon}
            />
             <TrophyCabinetCustomiseModal
                isOpen={isCabinetModalOpen}
                onClose={() => setIsCabinetModalOpen(false)}
                settings={trophyCabinetSettings}
                onSave={onUpdateTrophyCabinetSettings}
            />
            <FacepackSetupModal
                isOpen={isFacepackModalOpen}
                onClose={() => setIsFacepackModalOpen(false)}
                facesPath={facesPath}
                onUpdateFacesPath={onUpdateFacesPath}
                facepackConfig={facepackConfig}
                onUpdateFacepackConfig={onUpdateFacepackConfig}
            />
            <Modal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                title={`Confirm Deletion`}
            >
                <div className="space-y-4">
                    <p className="text-gray-300 text-center text-lg">
                        Are you sure you want to permanently delete the {itemToDelete?.type} "{itemToDelete?.name}"?
                    </p>
                    <p className="text-red-400 text-sm font-semibold text-center">
                        This action cannot be undone.
                    </p>
                    <div className="flex justify-center gap-4 pt-6">
                        <Button onClick={() => setItemToDelete(null)} variant="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmDelete} variant="danger">
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
            <div className="p-4 bg-gray-800/60 rounded-lg border border-gray-700/50 text-gray-200 h-full overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-2">Customise Data</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Left Column: Forms */}
                    <div className="space-y-6 md:col-span-1">
                        <DataListSection title="Manager Profile">
                            <form onSubmit={handleUpdateManagerName} className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-300 block mb-1">Manager Name</label>
                                    <Input type="text" value={managerName} onChange={e => setManagerName(e.target.value)} placeholder="Your manager name" required/>
                                    <p className="text-xs text-gray-400 mt-1">This updates the name on all players you've created.</p>
                                </div>
                                <Button type="submit" variant="primary" className="w-full">Update Name</Button>
                            </form>
                        </DataListSection>
                        
                        <DataListSection title="Facepack Integration">
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-300 block mb-1">Current Graphics Path</label>
                                    <p className="text-xs text-gray-400 truncate">{facesPath || 'Not set'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-300 block mb-1">Loaded Mappings</label>
                                    <p className="text-lg font-bold text-green-400">{Object.keys(facepackConfig).length}</p>
                                </div>
                                <Button onClick={() => setIsFacepackModalOpen(true)} variant="secondary" className="w-full">
                                    Setup Facepack
                                </Button>
                            </div>
                        </DataListSection>

                        <DataListSection title="Add New Club">
                            <CreateClubForm onSave={onAddClub} allClubs={allClubs} />
                        </DataListSection>
                        
                        <DataListSection title="Miscellaneous Settings">
                             <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-300 block mb-1">Generated Player Term</label>
                                    <p className="text-xs text-gray-400 mt-1 mb-2">Choose your preferred term for AI-generated players. This will update tags and filters.</p>
                                    <Select value={newgenTerm} onChange={e => onUpdateNewgenTerm(e.target.value as NewgenTerm)}>
                                        <option value="NewGen">NewGen</option>
                                        <option value="Regen">Regen</option>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-300 block mb-1">Date Format</label>
                                    <p className="text-xs text-gray-400 mt-1 mb-2">Choose your preferred date display format.</p>
                                    <Select value={dateFormat} onChange={e => onUpdateDateFormat(e.target.value as DateFormatOption)}>
                                        <option value="dd/mm/yyyy">dd/mm/yyyy (e.g., 25/12/2024)</option>
                                        <option value="mm/dd/yyyy">mm/dd/yyyy (e.g., 12/25/2024)</option>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-300 block mb-1">Currency</label>
                                    <p className="text-xs text-gray-400 mt-1 mb-2">Choose your preferred currency for displaying player values.</p>
                                    <Select value={currency} onChange={e => onUpdateCurrency(e.target.value as CurrencyOption)}>
                                        {Object.entries(CURRENCIES).map(([code, { name, symbol }]) => (
                                            <option key={code} value={code}>{name} ({symbol})</option>
                                        ))}
                                    </Select>
                                </div>
                             </div>
                        </DataListSection>
                    </div>
                    
                    {/* Right Column: Lists */}
                    <div className="space-y-6 md:col-span-1 lg:col-span-2">
                         <DataListSection title="Trophy Cabinet Settings">
                           <div className="space-y-3">
                                <Button onClick={() => setIsCabinetModalOpen(true)} variant="secondary" className="w-full">
                                    Customise Cabinet Appearance
                                </Button>
                                <Button onClick={() => setIsCustomIconsModalOpen(true)} variant="secondary" className="w-full">
                                    Customise Trophy Icons
                                </Button>
                            </div>
                        </DataListSection>

                        <DataListSection title="Manage Save Games">
                            <form onSubmit={handleAddSaveGame} className="flex gap-2 items-end">
                                <div className="flex-grow">
                                    <label className="text-sm font-medium text-gray-300 block mb-1">Save Game Name</label>
                                    <Input type="text" value={saveGameName} onChange={e => setSaveGameName(e.target.value)} placeholder="New save game" required/>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-300 block mb-1">Color</label>
                                    <Input type="color" value={saveGameColor} onChange={e => setSaveGameColor(e.target.value)} className="w-12 h-10 p-1"/>
                                </div>
                                <Button type="submit" variant="primary">Add</Button>
                            </form>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {saveGames.map(save => (
                                    <div key={save.name} className="flex items-center gap-2 pl-2 pr-1 py-1 bg-gray-700/80 rounded-full">
                                        <input 
                                            type="color" 
                                            value={save.color} 
                                            onChange={(e) => onUpdateSaveGame(save.name, e.target.value)}
                                            className="w-5 h-5 p-0 border-none rounded-full cursor-pointer bg-transparent"
                                            title={`Change color for ${save.name}`}
                                        />
                                        <span className="text-sm text-gray-200">{save.name}</span>
                                        <button onClick={() => handleDeleteClick('save game', save.name, save.name, onRemoveSaveGame)} className="text-red-500 hover:text-red-400 transition-colors">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </DataListSection>

                        <DataListSection title="Manage Custom Tags">
                            <form onSubmit={handleAddCustomTag} className="flex gap-2 items-end">
                                <div className="flex-grow">
                                    <label className="text-sm font-medium text-gray-300 block mb-1">Tag Name</label>
                                    <Input type="text" value={newTagName} onChange={e => setNewTagName(e.target.value)} placeholder="e.g., 'Wonderkid', 'Loan Army'" required/>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-300 block mb-1">Color</label>
                                    <Input type="color" value={newTagColor} onChange={e => setNewTagColor(e.target.value)} className="w-12 h-10 p-1"/>
                                </div>
                                <Button type="submit" variant="primary">Add</Button>
                            </form>
                             <div className="flex flex-wrap gap-2 pt-2">
                                {customTags.map(tag => (
                                    <div key={tag.id} className="flex items-center gap-2 pl-2 pr-1 py-1 bg-gray-700/80 rounded-full">
                                        <input 
                                            type="color" 
                                            value={tag.color} 
                                            onChange={(e) => onUpdateCustomTag({ ...tag, color: e.target.value })}
                                            className="w-5 h-5 p-0 border-none rounded-full cursor-pointer bg-transparent"
                                            title={`Change color for ${tag.name}`}
                                        />
                                        <span className="text-sm text-gray-200">{tag.name}</span>
                                        <button onClick={() => handleDeleteClick('custom tag', tag.name, tag.id, onRemoveCustomTag)} className="text-red-500 hover:text-red-400 transition-colors">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </DataListSection>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <DataListSection title="Custom Awards & Trophies">
                                <Button onClick={handleOpenAddCompetitionModal} variant="primary" className="w-full">Add New Award/Trophy</Button>
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                    {customCompetitions.map(comp => {
                                        const customIconData = customIcons[comp.id];
                                        return (
                                            <div key={comp.id} className="flex justify-between items-center p-2 bg-gray-700/60 rounded-md">
                                                <div className="flex items-center gap-2">
                                                    <CompetitionIcon iconName={comp.icon} customIconData={customIconData} />
                                                    <div className="flex flex-col">
                                                        <span>{comp.name}</span>
                                                        <span className="text-gray-400 text-xs">
                                                            {getTypeLabel(comp.type)}
                                                            {comp.isManagerOnly && <span className="text-purple-400"> (Manager)</span>}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => handleOpenEditCompetitionModal(comp)} className="text-blue-400 hover:text-blue-300 transition-colors"><PencilIcon className="w-4 h-4" /></button>
                                                    <button onClick={() => handleDeleteClick('competition', comp.name, comp.id, onRemoveCompetition)} className="text-red-500 hover:text-red-400 transition-colors"><TrashIcon className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </DataListSection>
                             <DataListSection title="Custom Leagues">
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                    {customLeagues.map(league => (
                                        <div key={league.id} className="flex justify-between items-center p-2 bg-gray-700/60 rounded-md">
                                            <span>{league.name} <span className="text-gray-400 text-xs">({league.nation})</span></span>
                                            <button onClick={() => handleDeleteClick('league', league.name, league.id, onRemoveLeague)} className="text-red-500 hover:text-red-400 transition-colors"><TrashIcon className="w-4 h-4" /></button>
                                        </div>
                                    ))}
                                </div>
                            </DataListSection>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-700/50 space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-green-400">Backup & Restore</h3>
                        <div className="p-4 bg-green-900/40 rounded-lg border border-green-500/50 mt-2">
                            <p className="text-sm text-gray-300 mt-2 mb-4">
                                Export all your application data into a single file for backup, or restore from a backup file. Restoring will overwrite all current data.
                            </p>
                            <div className="flex gap-4">
                                <input ref={importAllRef} type="file" className="hidden" accept=".json" onChange={handleImportAllFileChange} />
                                <Button onClick={onExportAllData} variant="secondary" className="w-full bg-green-700/50 hover:bg-green-600/50 border border-green-500/50">Export All Data</Button>
                                <Button onClick={handleImportAllClick} variant="secondary" className="w-full bg-green-700/50 hover:bg-green-600/50 border border-green-500/50">Import All Data</Button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-red-400">Danger Zone</h3>
                        <div className="p-4 bg-red-900/40 rounded-lg border border-red-500/50 mt-2">
                            <p className="text-sm text-gray-300 mt-2 mb-4">
                                This action is irreversible and will permanently delete all your data, including players, managers, custom teams, and settings. Your application will be reset to its default state.
                            </p>
                            <Button
                                onClick={onResetRequest}
                                variant="danger"
                                className="w-full"
                            >
                                Reset All Data
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
