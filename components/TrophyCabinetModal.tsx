
import React, { useMemo, useState } from 'react';
import { Player, Honour, HonourType, TrophyCabinetSettings } from '../types';
import Modal from './ui/Modal';
import { getHonourInfo } from '../constants';
import { TROPHY_ICONS } from './icons/trophies';
import { CupTrophyIcon } from './icons/trophies/CupTrophyIcon';
import { ShieldTrophyIcon } from './icons/trophies/ShieldTrophyIcon';
import { MedalIcon } from './icons/trophies/MedalIcon';
import Button from './ui/Button';
import { PomAwardIcon } from './icons/trophies/PomAwardIcon';

interface TrophyCabinetModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player;
  allHonours: Honour[];
  customIcons: Record<string, string>;
  trophyCabinetSettings: TrophyCabinetSettings;
}

interface ProcessedHonour {
  id: string;
  name: string;
  type: HonourType;
  icon?: string;
  seasons: string[];
  leagues: (string | undefined)[];
  count: number;
  seasonCounts?: Record<string, number>;
}

const getTrophyIcon = (honourId: string, allHonours: Honour[], customIcons: Record<string, string>): React.FC<any> | string => {
    const customIconData = customIcons[honourId];
    if (customIconData) {
        return customIconData;
    }
    const honourInfo = getHonourInfo(honourId, allHonours);
    if (honourInfo?.icon && TROPHY_ICONS[honourInfo.icon]) {
        return TROPHY_ICONS[honourInfo.icon];
    }
    if (honourId in TROPHY_ICONS) {
      return TROPHY_ICONS[honourId];
    }
    if (honourInfo) {
      if (honourInfo.type.startsWith('personal_')) return MedalIcon;
      if (honourInfo.type === 'league' || (honourInfo.type === 'domestic_cup' && honourInfo.name.toLowerCase().includes('shield'))) return ShieldTrophyIcon;
      if (honourInfo.type.includes('_cup')) return CupTrophyIcon;
    }
    return CupTrophyIcon; // Default fallback
};


const Shelf: React.FC<{ title: string; honours: ProcessedHonour[]; allHonours: Honour[]; customIcons: Record<string, string>, settings: TrophyCabinetSettings }> = ({ title, honours, allHonours, customIcons, settings }) => {
    if (honours.length === 0) return null;

    const trophySize = Math.max(60, 140 - honours.length * 8);
    const fontSize = Math.max(10, 16 - honours.length * 0.6);
    
    const getYear = (season: string) => parseInt(season.split('/')[0], 10);

    return (
        <div className="relative pt-4">
            <h3 className="text-center font-bold uppercase tracking-widest mb-2" style={{ color: settings.shelfTitleColor }}>{title}</h3>
            <div className="flex flex-wrap justify-center items-end gap-x-8 gap-y-12 p-4 min-h-[150px]">
                {honours.map((honour, index) => {
                    let honourName = honour.name;

                    const uniqueLeagues = [...new Set(honour.leagues.filter(Boolean))];
                    if (['poty', 'ppoty', 'ypoty'].includes(honour.id) && uniqueLeagues.length === 1 && uniqueLeagues[0]) {
                        honourName = `${uniqueLeagues[0]} ${honour.name}`;
                    }

                    const sortedSeasons = [...honour.seasons].sort((a, b) => getYear(b) - getYear(a));

                    return (
                        <div key={`${honour.id}-${index}`} className="flex flex-col items-center group relative" style={{ width: `${trophySize}px` }}>
                             <div className="relative">
                                {honour.id.startsWith('pom_') ? (
                                    <PomAwardIcon 
                                        className="w-full h-auto drop-shadow-lg transition-transform duration-200 group-hover:-translate-y-2"
                                    />
                                ) : (() => {
                                    const IconOrUrl = getTrophyIcon(honour.id, allHonours, customIcons);
                                    if (typeof IconOrUrl === 'string') {
                                        return <img src={IconOrUrl} alt={honourName} className="w-full h-auto drop-shadow-lg transition-transform duration-200 group-hover:-translate-y-2" />;
                                    } else {
                                        const IconComponent = IconOrUrl;
                                        return <IconComponent className="w-full h-auto drop-shadow-lg transition-transform duration-200 group-hover:-translate-y-2" />;
                                    }
                                })()}
                                {honour.count > 1 && (
                                    <span className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded-full z-10">
                                        x{honour.count}
                                    </span>
                                )}
                            </div>
                            <div className="mt-2 text-center transition-colors" style={{ fontSize: `${fontSize}px`, lineHeight: 1.3, color: settings.textColor }}>
                                <p className="font-bold" title={honourName}>{honourName}</p>
                                <div className="relative group/seasons">
                                    <p className="cursor-pointer" style={{ color: settings.textColor, opacity: 0.8 }}>
                                        {sortedSeasons[0]} {honour.count > 1 ? '+' : ''}
                                    </p>
                                     {honour.count > 1 && (
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max p-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover/seasons:opacity-100 group-hover/seasons:visible transition-all pointer-events-none z-20">
                                            {honour.seasonCounts ? (
                                                <ul className="text-left text-xs space-y-1">
                                                    {Object.entries(honour.seasonCounts)
                                                        .sort((a, b) => getYear(b[0]) - getYear(a[0]))
                                                        .map(([season, count]) => <li key={season}>{season} - {count}</li>)
                                                    }
                                                </ul>
                                            ) : (
                                                <ul className="text-left text-xs space-y-1">
                                                    {sortedSeasons.map(s => <li key={s}>{s}</li>)}
                                                </ul>
                                            )}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-700"></div>
                                        </div>
                                     )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* The shelf itself */}
            <div className="absolute bottom-0 left-0 w-full h-4 rounded-md shadow-inner" style={{ transform: 'perspective(50px) rotateX(10deg)', backgroundColor: settings.shelfColor }} />
            <div className="absolute bottom-0 left-0 w-full h-2 bg-black/40" />
        </div>
    );
};

const prestigeOrder: Record<string, number> = {
    'personal_global': 1,
    'personal_national': 1,
    'personal_domestic': 1,
    'domestic_cup': 2,
    'friendly_cup': 2,
    'league': 3,
    'continental_cup': 4,
    'intercontinental_cup': 4,
    'international_trophy': 5
};

const TrophyCabinetModal: React.FC<TrophyCabinetModalProps> = ({ isOpen, onClose, player, allHonours, customIcons, trophyCabinetSettings }) => {
  const [view, setView] = useState<'trophy' | 'list'>('trophy');
  const displayName = player.knownAs || `${player.firstName} ${player.lastName}`;

  const shelves = useMemo(() => {
    const honoursMap: Record<string, ProcessedHonour> = {};

    player.seasonStats.forEach(stat => {
        stat.honours.forEach(honourId => {
            if (!honoursMap[honourId]) {
                const info = getHonourInfo(honourId, allHonours);
                if (!info) return;
                honoursMap[honourId] = {
                    id: honourId,
                    name: info.name,
                    type: info.type,
                    icon: info.icon,
                    seasons: [],
                    leagues: [],
                    count: 0,
                };
            }
            honoursMap[honourId].seasons.push(stat.season);
            honoursMap[honourId].leagues.push(stat.league);
            honoursMap[honourId].count++;
        });
    });

    const totalPom = player.seasonStats.reduce((sum, stat) => sum + (stat.pom || 0), 0);
    if (totalPom > 0) {
        const pomSeasonCounts: Record<string, number> = {};
        player.seasonStats.forEach(stat => {
            if (stat.pom && stat.pom > 0) {
                pomSeasonCounts[stat.season] = (pomSeasonCounts[stat.season] || 0) + stat.pom;
            }
        });
        
        honoursMap['pom_total'] = {
            id: 'pom_total',
            name: 'Player of the Match',
            type: 'personal_domestic',
            seasons: Object.keys(pomSeasonCounts),
            leagues: [],
            count: totalPom,
            seasonCounts: pomSeasonCounts,
        };
    }

    const getYear = (season: string) => parseInt(season.split('/')[0], 10);

    const processedHonours = Object.values(honoursMap).sort((a, b) => {
        const firstSeasonA = a.seasons[0];
        const firstSeasonB = b.seasons[0];
        if (!firstSeasonA || !firstSeasonB) return 0;

        const yearA = getYear(firstSeasonA);
        const yearB = getYear(firstSeasonB);

        if (yearA !== yearB) {
            return yearA - yearB;
        }

        const prestigeA = prestigeOrder[a.type as keyof typeof prestigeOrder] || 99;
        const prestigeB = prestigeOrder[b.type as keyof typeof prestigeOrder] || 99;

        if (prestigeA !== prestigeB) {
            return prestigeA - prestigeB;
        }

        return a.name.localeCompare(b.name);
    });

    const shelfMap: Record<string, ProcessedHonour[]> = {
        'International': [],
        'Continental': [],
        'Domestic League': [],
        'Domestic Cups': [],
        'Personal Awards': [],
    };

    processedHonours.forEach(honour => {
        if (honour.type === 'international_trophy') shelfMap['International'].push(honour);
        else if (honour.type === 'continental_cup' || honour.type === 'intercontinental_cup') shelfMap['Continental'].push(honour);
        else if (honour.type === 'league') shelfMap['Domestic League'].push(honour);
        else if (honour.type === 'domestic_cup' || honour.type === 'friendly_cup') shelfMap['Domestic Cups'].push(honour);
        else if (honour.type.startsWith('personal_')) shelfMap['Personal Awards'].push(honour);
    });
    
    Object.keys(shelfMap).forEach(key => {
        if (shelfMap[key].length === 0) {
            delete shelfMap[key];
        }
    });

    return shelfMap;
  }, [player, allHonours]);
  
  const chronologicalHonours = useMemo(() => {
    if (view !== 'list') return [];
    
    const allAwards: { season: string; league: string | undefined; honour: Honour }[] = [];
    player.seasonStats.forEach(stat => {
        stat.honours.forEach(honourId => {
            const honourInfo = getHonourInfo(honourId, allHonours);
            if (honourInfo) {
                allAwards.push({ season: stat.season, league: stat.league, honour: honourInfo });
            }
        });
    });
    
    const getYear = (season: string) => parseInt(season.split('/')[0], 10);

    const groupedBySeason = allAwards.reduce((acc, award) => {
        const seasonKey = award.season;
        if (!acc[seasonKey]) {
            acc[seasonKey] = [];
        }
        acc[seasonKey].push(award);
        return acc;
    }, {} as Record<string, typeof allAwards>);
    
    return Object.keys(groupedBySeason)
        .sort((a, b) => getYear(b) - getYear(a)) // Sort seasons descending (newest first)
        .map(season => {
            const awardsForSeason = groupedBySeason[season];
            awardsForSeason.sort((a, b) => {
                 const prestigeA = prestigeOrder[a.honour.type as keyof typeof prestigeOrder] || 99;
                 const prestigeB = prestigeOrder[b.honour.type as keyof typeof prestigeOrder] || 99;
                 if (prestigeA !== prestigeB) {
                    return prestigeA - prestigeB;
                 }
                 return a.honour.name.localeCompare(b.honour.name);
            });
            return { season, honours: awardsForSeason };
        });
  }, [view, player, allHonours]);

  const backgroundStyle: React.CSSProperties = trophyCabinetSettings.backgroundType === 'texture'
    ? {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${trophyCabinetSettings.backgroundValue})`,
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat',
      }
    : {
        backgroundColor: trophyCabinetSettings.backgroundValue,
      };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${displayName}'s Trophy Cabinet`} size="5xl">
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50" style={backgroundStyle}>
            <div className="flex justify-end mb-4">
                <Button variant="secondary" size="sm" onClick={() => setView(v => v === 'trophy' ? 'list' : 'trophy')}>
                    {view === 'trophy' ? 'List View' : 'Trophy View'}
                </Button>
            </div>

            {view === 'trophy' && (
                <div className="space-y-8 py-4">
                    {Object.keys(shelves).length > 0 ? (
                        Object.entries(shelves).map(([category, honours]) => (
                            <Shelf key={category} title={category} honours={honours} allHonours={allHonours} customIcons={customIcons} settings={trophyCabinetSettings} />
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-48 text-gray-500">
                            This player hasn't won any trophies yet.
                        </div>
                    )}
                </div>
            )}
            
            {view === 'list' && (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {chronologicalHonours.length > 0 ? chronologicalHonours.map(({ season, honours }) => (
                        <div key={season}>
                            <div className="flex items-center gap-4 my-2">
                                <hr className="flex-grow border-gray-600/50" />
                                <h4 className="text-xl font-bold text-purple-300 shrink-0">{season}</h4>
                                <hr className="flex-grow border-gray-600/50" />
                            </div>
                            <ul className="mt-2 space-y-2 pl-4">
                                {honours.map((item, index) => {
                                    const IconOrUrl = getTrophyIcon(item.honour.id, allHonours, customIcons);
                                    let honourName = item.honour.name;
                                    if (['poty', 'ppoty', 'ypoty'].includes(item.honour.id) && item.league) {
                                        honourName = `${item.league} ${item.honour.name}`;
                                    }
                                    return (
                                        <li key={`${item.honour.id}-${index}`} className="flex items-center gap-3 text-gray-300 bg-black/20 p-2 rounded-md">
                                            {typeof IconOrUrl === 'string' ? (
                                                <img src={IconOrUrl} alt={honourName} className="w-6 h-6 flex-shrink-0" />
                                            ) : (
                                                <IconOrUrl className="w-6 h-6 flex-shrink-0 text-yellow-300" />
                                            )}
                                            <span className="font-semibold">{honourName}</span>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )) : (
                         <div className="flex items-center justify-center h-48 text-gray-500">
                            This player hasn't won any trophies yet.
                        </div>
                    )}
                </div>
            )}
        </div>
    </Modal>
  );
};

export default TrophyCabinetModal;
