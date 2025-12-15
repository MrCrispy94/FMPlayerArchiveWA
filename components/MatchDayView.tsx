import React, { useState, useMemo, useRef } from 'react';
import { SavedSquad, Player, Club, TeamRatings, MatchResult, Goal } from '../types';
import { FORMATIONS } from '../constants';
import Pitch from './Pitch';
import Button from './ui/Button';
import { UploadIcon } from './icons/UploadIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import StarRating from './StarRating';
import Modal from './ui/Modal';
import html2canvas from 'html2canvas';

interface MatchDayViewProps {
  allClubs: Record<string, Club>;
  homeTeam: SavedSquad | null;
  awayTeam: SavedSquad | null;
  setHomeTeam: (squad: SavedSquad | null) => void;
  setAwayTeam: (squad: SavedSquad | null) => void;
}

const attributeGroups = {
  gk: ['aerialReach', 'commandOfArea', 'communication', 'eccentricity', 'handling', 'kicking', 'oneOnOnes', 'punching', 'reflexes', 'rushingOut', 'throwing', 'anticipation', 'decisions', 'positioning'],
  def: ['heading', 'marking', 'tackling', 'anticipation', 'bravery', 'composure', 'concentration', 'decisions', 'positioning', 'strength', 'workRate'],
  mid: ['dribbling', 'firstTouch', 'passing', 'technique', 'composure', 'decisions', 'flair', 'offTheBall', 'teamwork', 'vision', 'workRate', 'stamina'],
  att: ['dribbling', 'finishing', 'firstTouch', 'heading', 'longShots', 'technique', 'anticipation', 'composure', 'flair', 'offTheBall', 'acceleration', 'pace'],
};

const positionGroups: Record<string, ('def' | 'mid' | 'att')[]> = {
    DR: ['def'], DL: ['def'], DC: ['def'], DCR: ['def'], DCL: ['def'],
    WBR: ['def', 'mid'], WBL: ['def', 'mid'],
    DM: ['def', 'mid'], DMCR: ['def', 'mid'], DMCL: ['def', 'mid'],
    MR: ['mid'], ML: ['mid'], MC: ['mid'], MCR: ['mid'], MCL: ['mid'],
    AMR: ['mid', 'att'], AML: ['mid', 'att'], AMC: ['mid', 'att'],
    ST: ['att'], STCR: ['att'], STCL: ['att']
};


const calculatePlayerAbility = (player: Player): number => {
    if (!player.hasKnownAttributes) return 50;

    let total = 0;
    let count = 0;

    if(player.primaryPosition === 'GK') {
        attributeGroups.gk.forEach(attr => { total += Number(player.attributes[attr as keyof typeof player.attributes] || 0); count++; });
    } else {
        const relevantGroups = positionGroups[player.primaryPosition] || ['def', 'mid', 'att'];
        const uniqueAttrs = new Set<string>();
        relevantGroups.forEach(group => {
            attributeGroups[group].forEach(attr => uniqueAttrs.add(attr));
        });
        uniqueAttrs.forEach(attr => { total += Number(player.attributes[attr as keyof typeof player.attributes] || 0); count++; });
    }
    
    const avgAttr = count > 0 ? total / count : 10;
    return 30 + ((avgAttr - 1) / 19) * 70; // Scale from 30 to 100
};

const getPlayerPositionalRating = (player: Player, positionGroup: 'gk' | 'def' | 'mid' | 'att'): number => {
    if (!player.hasKnownAttributes) return 30; // Return a base value for players without attrs
    const attrsToUse = attributeGroups[positionGroup];
    if (!attrsToUse || attrsToUse.length === 0) return 30;

    const total = attrsToUse.reduce((sum, attr) => sum + (player.attributes[attr as keyof Player['attributes']] || 0), 0);
    const avgAttr = total / attrsToUse.length;

    // Scale to 30-100 range
    return 30 + ((avgAttr - 1) / 19) * 70;
};

const calculateTeamRatings = (squad: SavedSquad | null): TeamRatings => {
    if (!squad) return { gk: 0, def: 0, mid: 0, att: 0, overall: 0 };

    const formationPositionsList = FORMATIONS[squad.formation];
    if (!formationPositionsList) return { gk: 0, def: 0, mid: 0, att: 0, overall: 0 };
    
    const playersInXI = Object.values(squad.xi).map(id => squad.players.find(p => p.id === id)).filter(Boolean) as Player[];
    if (playersInXI.length === 0) return { gk: 0, def: 0, mid: 0, att: 0, overall: 0 };
    
    const expectedCounts = { def: 0, mid: 0, att: 0 };
    const ratingSums = { gk: 0, def: 0, mid: 0, att: 0 };

    // 1. Count expected players per category from the formation
    formationPositionsList.forEach(posDetails => {
        if (posDetails.position === 'GK') return;
        const groups = positionGroups[posDetails.position];
        if (groups) {
            if(groups.includes('def')) expectedCounts.def++;
            if(groups.includes('mid')) expectedCounts.mid++;
            if(groups.includes('att')) expectedCounts.att++;
        }
    });

    // 2. Sum the final scaled ratings for players present in the XI
    for (const posAbbr in squad.xi) {
        const playerId = squad.xi[posAbbr];
        if (!playerId) continue;

        const player = squad.players.find(p => p.id === playerId);
        if (!player) continue;

        if (posAbbr === 'GK') {
            ratingSums.gk += getPlayerPositionalRating(player, 'gk');
        } else {
            const groups = positionGroups[posAbbr];
            if (groups?.includes('def')) {
                ratingSums.def += getPlayerPositionalRating(player, 'def');
            }
            if (groups?.includes('mid')) {
                ratingSums.mid += getPlayerPositionalRating(player, 'mid');
            }
            if (groups?.includes('att')) {
                ratingSums.att += getPlayerPositionalRating(player, 'att');
            }
        }
    }
    
    const gkRating = Math.round(ratingSums.gk);
    const defRating = Math.round(expectedCounts.def > 0 ? ratingSums.def / expectedCounts.def : 0);
    const midRating = Math.round(expectedCounts.mid > 0 ? ratingSums.mid / expectedCounts.mid : 0);
    const attRating = Math.round(expectedCounts.att > 0 ? ratingSums.att / expectedCounts.att : 0);
    
    const overall = Math.round((gkRating + defRating + midRating + attRating) / 4);

    return {
        gk: gkRating,
        def: defRating,
        mid: midRating,
        att: attRating,
        overall: overall,
    };
};


const MatchDayView: React.FC<MatchDayViewProps> = ({ allClubs, homeTeam, awayTeam, setHomeTeam, setAwayTeam }) => {
    const [isSimulating, setIsSimulating] = useState(false);
    const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
    const resultRef = useRef<HTMLDivElement>(null);
    
    const homeRatings = useMemo(() => calculateTeamRatings(homeTeam), [homeTeam]);
    const awayRatings = useMemo(() => calculateTeamRatings(awayTeam), [awayTeam]);
    
    const runSimulation = () => {
        if (!homeTeam || !awayTeam) return;

        setIsSimulating(true);
        setMatchResult(null);

        setTimeout(() => {
            const homeStrength = homeRatings.overall;
            const awayStrength = awayRatings.overall;
            const totalStrength = homeStrength + awayStrength;
            const homeWinProb = homeStrength / totalStrength;
            
            const totalGoals = Math.floor(Math.pow(Math.random(), 2) * 8);
            let homeScore = 0;
            let awayScore = 0;
            const goals: Goal[] = [];

            const getPlayerNames = (squad: SavedSquad, positions: ('att' | 'mid' | 'def' | 'gk')[] | null = null): string[] => {
                const allPlayers = Object.values(squad.xi)
                    .map(id => squad.players.find(p => p.id === id))
                    .filter(Boolean) as Player[];

                let filteredPlayers = allPlayers;
                if (positions) {
                    filteredPlayers = allPlayers.filter(p => 
                        positionGroups[p.primaryPosition]?.some(group => positions.includes(group as any))
                    );
                }

                const names = filteredPlayers.map(p => p.knownAs || p.lastName || 'Player');
                
                if (names.length === 0 && allPlayers.length > 0) {
                    return allPlayers.map(p => p.knownAs || p.lastName || 'Player');
                }
                return names;
            };

            const homePlayerNames = getPlayerNames(homeTeam);
            const awayPlayerNames = getPlayerNames(awayTeam);
            const homeScorers = getPlayerNames(homeTeam, ['att', 'mid']);
            const awayScorers = getPlayerNames(awayTeam, ['att', 'mid']);

            const OWN_GOAL_PROBABILITY = 0.05;

            for (let i = 0; i < totalGoals; i++) {
                const isOwnGoal = Math.random() < OWN_GOAL_PROBABILITY;

                if (Math.random() < homeWinProb) { // Home team scores
                    homeScore++;
                    let scorerName: string;
                    if (isOwnGoal && awayPlayerNames.length > 0) {
                        const ogScorer = awayPlayerNames[Math.floor(Math.random() * awayPlayerNames.length)];
                        scorerName = `${ogScorer} (OG)`;
                    } else {
                        scorerName = homeScorers[Math.floor(Math.random() * homeScorers.length)] || 'Goal';
                    }
                    goals.push({ team: 'home', scorerName, minute: 0 });
                } else { // Away team scores
                    awayScore++;
                    let scorerName: string;
                    if (isOwnGoal && homePlayerNames.length > 0) {
                        const ogScorer = homePlayerNames[Math.floor(Math.random() * homePlayerNames.length)];
                        scorerName = `${ogScorer} (OG)`;
                    } else {
                        scorerName = awayScorers[Math.floor(Math.random() * awayScorers.length)] || 'Goal';
                    }
                    goals.push({ team: 'away', scorerName, minute: 0 });
                }
            }
            
            const sortedGoals = goals
                .map(g => ({ ...g, minute: Math.floor(Math.random() * 90) + 1 }))
                .sort((a, b) => a.minute - b.minute);

            setMatchResult({ homeScore, awayScore, goals: sortedGoals });
            setIsSimulating(false);
        }, 2000);
    };
    
    const handleDownloadImage = () => {
        if (resultRef.current) {
            const element = resultRef.current;
            const rect = element.getBoundingClientRect();

            html2canvas(element, {
                backgroundColor: '#1f2429', // bg-gray-900
                useCORS: true,
                width: rect.width,
                height: rect.height,
                windowWidth: rect.width,
                windowHeight: rect.height,
                scale: window.devicePixelRatio,
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = `${homeTeam?.squadName || 'Home'}_vs_${awayTeam?.squadName || 'Away'}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        }
    };
    
    const handleImport = (event: React.ChangeEvent<HTMLInputElement>, side: 'home' | 'away') => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const parsedSquad = JSON.parse(e.target?.result as string) as SavedSquad;
                    if (parsedSquad.squadName && parsedSquad.formation && parsedSquad.xi) {
                        if (side === 'home') setHomeTeam(parsedSquad);
                        else setAwayTeam(parsedSquad);
                    } else {
                        alert('Invalid squad file.');
                    }
                } catch (error) {
                    alert('Failed to load squad file.');
                }
            };
            reader.readAsText(file);
        }
    };

    const triggerImport = (side: 'home' | 'away') => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => handleImport(e as any, side);
        input.click();
    };


    const RatingRow: React.FC<{ label: string, home: number, away: number }> = ({ label, home, away }) => (
        <div className="flex justify-between items-center text-sm py-2">
            <div className="flex items-center gap-2">
                <span className="font-bold text-white">{home}</span>
                <StarRating rating={home / 20} size="sm" />
            </div>
            <span className="text-gray-400 font-semibold">{label}</span>
            <div className="flex items-center gap-2">
                <StarRating rating={away / 20} size="sm" />
                <span className="font-bold text-white">{away}</span>
            </div>
        </div>
    );

    return (
        <div className="flex h-full gap-4">
            <Modal isOpen={isSimulating} onClose={() => {}} title="Simulating Match">
                <div className="text-center p-8">
                    <p className="text-2xl font-bold animate-pulse">Simulating...</p>
                </div>
            </Modal>

            {/* Home Team */}
            <div className="flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-center bg-gray-800/60 p-3 rounded-lg border border-gray-700/50">
                    <h3 className="text-xl font-bold truncate">{homeTeam?.squadName || 'Home Team'}</h3>
                    <div className="flex gap-2">
                        <Button onClick={() => triggerImport('home')} variant="secondary" size="sm" icon={DownloadIcon}>Import</Button>
                        <Button onClick={() => setHomeTeam(null)} variant="danger" size="sm">Clear</Button>
                    </div>
                </div>
                <div className="flex-1 bg-gray-800/60 rounded-lg border border-gray-700/50 p-4 relative overflow-hidden flex items-center justify-center">
                    {homeTeam ? (
                        <Pitch
                            formation={FORMATIONS[homeTeam.formation] || []}
                            placedPlayers={homeTeam.xi}
                            allPlayers={homeTeam.players}
                            allClubs={allClubs}
                            isStatic={true}
                        />
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500">Import a squad to begin.</div>
                    )}
                </div>
            </div>

            {/* Middle Panel */}
            <div className="w-96 flex-shrink-0 flex flex-col gap-4">
                <div ref={resultRef} className="flex-1 bg-gray-800/60 p-4 rounded-lg border border-gray-700/50 flex flex-col justify-between">
                   <div>
                        <div className="text-center border-b border-gray-700 pb-2 mb-2">
                            <h2 className="text-lg font-bold truncate" title={homeTeam?.squadName || 'Home'}>{homeTeam?.squadName || 'Home Team'}</h2>
                            <p className="text-purple-400 font-bold">vs</p>
                            <h2 className="text-lg font-bold truncate" title={awayTeam?.squadName || 'Away'}>{awayTeam?.squadName || 'Away Team'}</h2>
                        </div>
                        <div className="space-y-1">
                            <RatingRow label="Overall" home={homeRatings.overall} away={awayRatings.overall} />
                            <RatingRow label="Goalkeeping" home={homeRatings.gk} away={awayRatings.gk} />
                            <RatingRow label="Defence" home={homeRatings.def} away={awayRatings.def} />
                            <RatingRow label="Midfield" home={homeRatings.mid} away={awayRatings.mid} />
                            <RatingRow label="Attack" home={homeRatings.att} away={awayRatings.att} />
                        </div>

                        {matchResult && (
                             <div className="mt-4 pt-4 border-t border-gray-700 text-center">
                                <p className="text-gray-400 text-sm">Full Time</p>
                                <p className="text-4xl font-bold my-2">{matchResult.homeScore} - {matchResult.awayScore}</p>
                                <div className="grid grid-cols-2 gap-x-2 text-xs max-h-32 overflow-y-auto">
                                    {/* Home Scorers */}
                                    <div className="space-y-1 text-left">
                                        {matchResult.goals
                                            .filter(g => g.team === 'home')
                                            .map((goal, i) => (
                                                <div key={`home-goal-${i}`}>
                                                    <span className="bg-black/20 px-1.5 py-0.5 rounded">{goal.scorerName} {goal.minute}'</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    {/* Away Scorers */}
                                    <div className="space-y-1 text-right">
                                        {matchResult.goals
                                            .filter(g => g.team === 'away')
                                            .map((goal, i) => (
                                                <div key={`away-goal-${i}`}>
                                                    <span className="bg-black/20 px-1.5 py-0.5 rounded">{goal.scorerName} {goal.minute}'</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                             </div>
                        )}
                   </div>
                   <div className="flex flex-col gap-2">
                        {matchResult && <Button onClick={handleDownloadImage} variant="secondary" icon={UploadIcon}>Save as Image</Button>}
                        <Button onClick={runSimulation} disabled={!homeTeam || !awayTeam || isSimulating}>
                           {isSimulating ? 'Simulating...' : 'Simulate Game'}
                        </Button>
                    </div>
                </div>
            </div>
            
            {/* Away Team */}
            <div className="flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-center bg-gray-800/60 p-3 rounded-lg border border-gray-700/50">
                    <h3 className="text-xl font-bold truncate">{awayTeam?.squadName || 'Away Team'}</h3>
                    <div className="flex gap-2">
                        <Button onClick={() => triggerImport('away')} variant="secondary" size="sm" icon={DownloadIcon}>Import</Button>
                        <Button onClick={() => setAwayTeam(null)} variant="danger" size="sm">Clear</Button>
                    </div>
                </div>
                <div className="flex-1 bg-gray-800/60 rounded-lg border border-gray-700/50 p-4 relative overflow-hidden flex items-center justify-center">
                    {awayTeam ? (
                        <Pitch
                            formation={FORMATIONS[awayTeam.formation] || []}
                            placedPlayers={awayTeam.xi}
                            allPlayers={awayTeam.players}
                            allClubs={allClubs}
                            isStatic={true}
                        />
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500">Import a squad to begin.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MatchDayView;