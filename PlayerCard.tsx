

import React, { useMemo } from 'react';
import type { Player, Club, Attributes, NewgenTerm } from './types';
import Kit from './components/Kit';
import { FlagIcon } from './components/icons/FlagIcon';
import { SilhouetteIcon } from './components/icons/SilhouetteIcon';

interface PlayerCardProps {
  player: Player;
  allClubs: Record<string, Club>;
  newgenTerm: NewgenTerm;
}

type PlayerQuality = 'standard' | 'good' | 'excellent' | 'brilliant';

const keyAttributesByRole: Record<string, (keyof Attributes)[]> = {
    GK: ['aerialReach', 'commandOfArea', 'communication', 'eccentricity', 'handling', 'kicking', 'oneOnOnes', 'punching', 'reflexes', 'rushingOut', 'throwing', 'anticipation', 'decisions', 'positioning'],
    DC: ['heading', 'marking', 'tackling', 'positioning', 'strength', 'jumpingReach', 'anticipation', 'bravery', 'composure', 'concentration', 'decisions'],
    DL: ['crossing', 'marking', 'tackling', 'passing', 'workRate', 'stamina', 'pace', 'acceleration', 'positioning', 'anticipation', 'decisions'],
    DR: ['crossing', 'marking', 'tackling', 'passing', 'workRate', 'stamina', 'pace', 'acceleration', 'positioning', 'anticipation', 'decisions'],
    WBL: ['crossing', 'dribbling', 'passing', 'tackling', 'workRate', 'stamina', 'pace', 'acceleration', 'offTheBall', 'flair'],
    WBR: ['crossing', 'dribbling', 'passing', 'tackling', 'workRate', 'stamina', 'pace', 'acceleration', 'offTheBall', 'flair'],
    DM: ['tackling', 'passing', 'workRate', 'stamina', 'strength', 'positioning', 'teamwork', 'decisions', 'concentration', 'anticipation'],
    MC: ['firstTouch', 'passing', 'technique', 'vision', 'teamwork', 'workRate', 'decisions', 'offTheBall', 'composure'],
    ML: ['crossing', 'dribbling', 'passing', 'technique', 'workRate', 'pace', 'acceleration', 'offTheBall', 'flair'],
    MR: ['crossing', 'dribbling', 'passing', 'technique', 'workRate', 'pace', 'acceleration', 'offTheBall', 'flair'],
    AMC: ['dribbling', 'finishing', 'firstTouch', 'passing', 'technique', 'vision', 'flair', 'offTheBall', 'composure', 'acceleration'],
    AML: ['crossing', 'dribbling', 'finishing', 'firstTouch', 'technique', 'pace', 'acceleration', 'flair', 'offTheBall'],
    AMR: ['crossing', 'dribbling', 'finishing', 'firstTouch', 'technique', 'pace', 'acceleration', 'flair', 'offTheBall'],
    ST: ['finishing', 'dribbling', 'firstTouch', 'heading', 'technique', 'composure', 'offTheBall', 'pace', 'acceleration', 'strength'],
};

const abbreviationMap: Record<string, string> = {
    // Technical
    'Corners': 'COR', 'Crossing': 'CRO', 'Dribbling': 'DRI', 'Finishing': 'FIN', 'First Touch': 'FIR', 'Free Kick Taking': 'FRE', 'Heading': 'HEA', 'Long Shots': 'LON', 'Long Throws': 'THR', 'Marking': 'MAR', 'Passing': 'PAS', 'Penalty Taking': 'PEN', 'Tackling': 'TAC', 'Technique': 'TEC',
    // Mental
    'Aggression': 'AGG', 'Anticipation': 'ANT', 'Bravery': 'BRA', 'Composure': 'COM', 'Concentration': 'CON', 'Decisions': 'DEC', 'Determination': 'DET', 'Flair': 'FLA', 'Leadership': 'LEA', 'Off The Ball': 'OFF', 'Positioning': 'POS', 'Teamwork': 'TEA', 'Vision': 'VIS', 'Work Rate': 'WOR',
    // Physical
    'Acceleration': 'ACC', 'Agility': 'AGI', 'Balance': 'BAL', 'Jumping Reach': 'JUM', 'Natural Fitness': 'NAT', 'Pace': 'PAC', 'Stamina': 'STA', 'Strength': 'STR',
    // Goalkeeping
    'Aerial Reach': 'AER', 'Command Of Area': 'CMD', 'Communication': 'CMM', 'Eccentricity': 'ECC', 'Handling': 'HAN', 'Kicking': 'KIC', 'One On Ones': 'ONE', 'Punching': 'PUN', 'Reflexes': 'REF', 'Rushing Out': 'RUS', 'Throwing': 'THG'
};

const PlayerCard: React.FC<PlayerCardProps> = ({ player, allClubs, newgenTerm }) => {
    const { quality, topAttributes, abilityScore } = useMemo(() => {
        if (!player.hasKnownAttributes) {
            return { quality: 'standard' as PlayerQuality, topAttributes: [], abilityScore: 40 };
        }

        const relevantAttrs: (keyof Attributes)[] = (keyAttributesByRole[player.primaryPosition] || Object.keys(player.attributes)) as (keyof Attributes)[];
        if (relevantAttrs.length === 0) {
            return { quality: 'standard' as PlayerQuality, topAttributes: [], abilityScore: 40 };
        }
        const total = relevantAttrs.map(attr => Number(player.attributes[attr]) || 0).reduce((sum, val) => sum + val, 0);
        const avgAttr = total / relevantAttrs.length;
        const abilityScore = 30 + ((avgAttr - 1) / 19) * 70;

        let quality: PlayerQuality = 'standard';
        if (abilityScore >= 90) quality = 'brilliant';
        else if (abilityScore >= 80) quality = 'excellent';
        else if (abilityScore >= 70) quality = 'good';

        const topAttributes = Object.entries(player.attributes)
            .sort(([, a], [, b]) => Number(b) - Number(a))
            .slice(0, 6)
            .map(([name, value]) => {
                const fullName = name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                return {
                    name: abbreviationMap[fullName] || fullName.substring(0,3).toUpperCase(),
                    value
                };
            });

        return { quality, topAttributes, abilityScore };
    }, [player]);

    const age = useMemo(() => {
        if (!player.dateOfBirth) return 0;
        
        const dates = (player.attributeSnapshots || [])
            .map(s => new Date(s.date).getTime())
            .filter(t => !isNaN(t));
        
        const latestDate = dates.length > 0 ? new Date(Math.max(...dates)) : new Date();

        const birthDate = new Date(player.dateOfBirth);
        if (isNaN(birthDate.getTime())) return 0;

        let age = latestDate.getFullYear() - birthDate.getFullYear();
        const m = latestDate.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && latestDate.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }, [player.dateOfBirth, player.attributeSnapshots]);
    
    const club = allClubs[player.currentClub];

    const isHolographic = player.isFavourite;

    const qualityStyles: Record<PlayerQuality, { card: string, content: string }> = {
        standard: { card: 'bg-gray-800 border-gray-600', content: 'bg-gray-800/80' },
        good: { card: 'bg-blue-900 border-blue-600', content: 'bg-blue-900/80' },
        excellent: { card: 'bg-green-900 border-green-600', content: 'bg-green-900/80' },
        brilliant: { card: 'bg-yellow-800 border-yellow-600', content: 'bg-yellow-900/60' },
    };

    const cardBaseClasses = isHolographic 
        ? 'holographic-effect' 
        : `${qualityStyles[quality].card}`;
        
    const cardContentClasses = isHolographic 
        ? 'bg-gray-800/50 backdrop-blur-sm'
        : qualityStyles[quality].content;

    return (
        <div className={`w-[350px] h-[500px] rounded-2xl p-1 shadow-2xl transition-all duration-300 ${cardBaseClasses}`}>
            <div className={`relative w-full h-full rounded-xl p-3 flex flex-col text-white ${cardContentClasses} overflow-hidden`}>
                <div className="absolute top-0 left-0 right-0 bottom-0 rounded-xl pointer-events-none z-10"></div>
                {/* Z-index below is for holographic effect */}
                <header className="flex justify-between items-center relative z-10">
                    <div className="text-center w-20 p-1 bg-black/30 rounded">
                        <p className="text-xs font-bold opacity-70">RATING</p>
                        <p className="text-3xl font-black">{Math.round(abilityScore)}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <h2 className="text-2xl font-black uppercase tracking-tighter">{player.knownAs || player.lastName}</h2>
                         <div className="flex items-center gap-2 mt-1">
                            <FlagIcon nationality={player.nationality} className="h-4 w-6 rounded-sm" />
                            <p className="text-sm font-semibold">{age > 0 ? `${age} yrs` : ''}</p>
                        </div>
                    </div>
                    <div className="text-center w-20 p-1 bg-black/30 rounded">
                        <p className="text-xs font-bold opacity-70">POS.</p>
                        <p className="text-3xl font-black">{player.primaryPosition}</p>
                    </div>
                </header>

                <main className="flex-1 relative flex justify-center items-center my-2 z-10">
                    <div className="w-56 h-56 rounded-full bg-black/30 flex items-center justify-center overflow-hidden border-4 border-white/10 shadow-lg">
                        {player.imageUrl ? (
                            <img src={player.imageUrl} alt={player.lastName} className="w-full h-full object-cover" />
                        ) : (
                            <SilhouetteIcon className="w-32 h-32 text-gray-600" />
                        )}
                    </div>
                </main>

                <footer className="h-[140px] flex-shrink-0 bg-black/40 rounded-lg p-3 flex flex-col justify-between relative z-10">
                    <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 z-20">
                        <Kit player={player} club={club} allClubs={allClubs} size="lg" squadNumber={player.squadNumber} />
                    </div>
                    {player.hasKnownAttributes ? (
                        <div className="grid grid-cols-3 gap-x-6 gap-y-1 mt-6">
                            {topAttributes.map(attr => (
                                <div key={attr.name} className="flex items-center justify-between text-xs border-b border-white/10 pb-1">
                                    <span className="font-semibold uppercase opacity-80">{attr.name}</span>
                                    <span className="font-bold text-base">{attr.value}</span>
                                </div>
                            ))}
                        </div>
                    ) : <div className="flex-1"></div> }
                    <div className="flex justify-between items-center mt-auto">
                        <p className="font-bold text-lg">{player.currentClub}</p>
                        {player.isRegen && (
                            <div className="px-3 py-1 bg-purple-500 text-white font-bold rounded-full text-xs shadow-md">
                                {newgenTerm}
                            </div>
                        )}
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default PlayerCard;
