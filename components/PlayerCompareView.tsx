
import React, { useState, useMemo } from 'react';
import type { Player, Club, Attributes } from '../types';
import Select from './ui/Select';
import Kit from './Kit';
import { FlagIcon } from './icons/FlagIcon';
import { keyAttributesByRole, outfieldAttributeGroups, goalkeeperAttributeGroups } from '../constants';

interface PlayerCompareViewProps {
  allPlayers: Player[];
  allClubs: Record<string, Club>;
}

const PlayerSummaryCard: React.FC<{ player: Player, club?: Club }> = ({ player, club }) => {
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

    return (
        <div className="bg-gray-800/60 p-4 rounded-lg border border-gray-700/50 flex flex-col items-center text-center">
            <Kit player={player} club={club} allClubs={{}} size="lg" squadNumber={player.squadNumber} />
            <h3 className="text-xl font-bold mt-2 truncate max-w-full" title={player.knownAs || `${player.firstName} ${player.lastName}`}>
                {player.knownAs || `${player.firstName} ${player.lastName}`}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <FlagIcon nationality={player.nationality} className="w-5 h-4" />
                <span>{player.nationality}</span>
                {age > 0 && <span className="text-gray-500">•</span>}
                {age > 0 && <span>{age} yrs</span>}
            </div>
            <p className="text-sm">{player.currentClub}</p>
            <p className="text-xs text-gray-500 mt-2">{player.primaryPosition}</p>
        </div>
    );
};

const getRoleBasedScore = (player: Player): number => {
    if (!player.hasKnownAttributes) return 0;
    const roleKey = Object.keys(keyAttributesByRole).find(key => player.primaryPosition.includes(key));
    const keyAttrs = keyAttributesByRole[roleKey || player.primaryPosition] || [];
    
    if (keyAttrs.length === 0) return 0;

    const keyAttrSum = keyAttrs.map(attr => Number(player.attributes[attr]) || 0).reduce((sum, val) => sum + val, 0);
    const keyAttrAvg = keyAttrSum / keyAttrs.length;

    return ((keyAttrAvg - 1) / 19) * 100;
};

const PlayerCompareView: React.FC<PlayerCompareViewProps> = ({ allPlayers, allClubs }) => {
    const [player1Id, setPlayer1Id] = useState<string>('');
    const [player2Id, setPlayer2Id] = useState<string>('');

    const sortedPlayers = useMemo(() => 
        [...allPlayers].sort((a, b) => 
            (a.knownAs || `${a.firstName} ${a.lastName}`).localeCompare(b.knownAs || `${b.firstName} ${b.lastName}`)
        ), [allPlayers]);

    const player1 = useMemo(() => allPlayers.find(p => p.id === player1Id), [allPlayers, player1Id]);
    const player2 = useMemo(() => allPlayers.find(p => p.id === player2Id), [allPlayers, player2Id]);

    const comparisonResult = useMemo(() => {
        if (!player1 || !player2) return null;

        const p1Score = getRoleBasedScore(player1);
        const p2Score = getRoleBasedScore(player2);

        const winner = p1Score > p2Score ? player1 : (p2Score > p1Score ? player2 : null);
        
        const topDifferences = Object.keys(player1.attributes)
            .map(attrKey => {
                const key = attrKey as keyof Attributes;
                const diff = (player1.attributes[key] || 0) - (player2.attributes[key] || 0);
                return { name: attrKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), diff };
            })
            .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
            
        let verdict = '';
        if (winner) {
            const winnerName = winner.knownAs || `${winner.firstName} ${winner.lastName}`;
            const advantageAttrs = topDifferences.filter(d => winner.id === player1.id ? d.diff > 0 : d.diff < 0).slice(0, 3).map(d => d.name);
            verdict = `Based on their primary roles, **${winnerName}** appears to be the more effective player. Their notable advantages in **${advantageAttrs.join(', ')}** give them the edge.`;
        } else if (p1Score === p2Score && p1Score > 0) {
             verdict = "It's a dead heat! Both players are exceptionally well-matched for their respective roles, making it impossible to declare a clear winner.";
        } else {
            verdict = "Cannot determine a winner as one or both players lack attribute data for a fair comparison.";
        }

        return {
            p1Score: p1Score.toFixed(1),
            p2Score: p2Score.toFixed(1),
            winner,
            verdict
        };

    }, [player1, player2]);

    const renderAttributeTable = (title: string, attributes: string[]) => (
        <div className="bg-gray-900/50 rounded-lg overflow-hidden">
            <h4 className="text-lg font-bold p-3 bg-gray-700/50 text-purple-300">{title}</h4>
            <table className="w-full text-sm">
                <tbody>
                    {attributes.map(attr => {
                        const camelCaseAttr = attr.replace(/\s(.)/g, m => m.toUpperCase()).replace(/\s/g, '').replace(/^(.)/, m => m.toLowerCase()) as keyof Attributes;
                        const val1 = player1?.attributes[camelCaseAttr] || 0;
                        const val2 = player2?.attributes[camelCaseAttr] || 0;
                        const p1Wins = val1 > val2;
                        const p2Wins = val2 > val1;

                        return (
                             <tr key={attr} className="border-t border-gray-700/50">
                                <td className={`p-2 font-bold w-1/4 text-center ${p1Wins ? 'text-green-400' : 'text-gray-300'}`}>{val1}</td>
                                <td className="p-2 text-center text-gray-400 w-1/2">{attr}</td>
                                <td className={`p-2 font-bold w-1/4 text-center ${p2Wins ? 'text-green-400' : 'text-gray-300'}`}>{val2}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
    
    const renderContent = () => {
        if (!player1 || !player2) {
            return <div className="text-center text-gray-500 text-2xl h-full flex items-center justify-center">Select two players to compare</div>;
        }

        const isP1Gk = player1.primaryPosition === 'GK';
        const isP2Gk = player2.primaryPosition === 'GK';

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <PlayerSummaryCard player={player1} club={allClubs[player1.currentClub]} />
                     <PlayerSummaryCard player={player2} club={allClubs[player2.currentClub]} />
                </div>

                {player1.hasKnownAttributes && player2.hasKnownAttributes ? (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {renderAttributeTable('Technical', outfieldAttributeGroups.Technical)}
                            {renderAttributeTable('Mental', outfieldAttributeGroups.Mental)}
                            {renderAttributeTable('Physical', outfieldAttributeGroups.Physical)}
                        </div>
                        {(isP1Gk || isP2Gk) && (
                            <div>
                                {renderAttributeTable('Goalkeeping', goalkeeperAttributeGroups.Goalkeeping)}
                            </div>
                        )}

                        <div className="p-4 bg-gray-900/50 rounded-lg text-center">
                            <h4 className="text-xl font-bold text-purple-300">Verdict</h4>
                            <div className="flex justify-around items-center my-4">
                                <div className="text-center">
                                    <p className="text-sm text-gray-400">Role Score</p>
                                    <p className="text-3xl font-black">{comparisonResult?.p1Score}</p>
                                </div>
                                <div className="text-center">
                                     <p className="text-sm text-gray-400">Role Score</p>
                                    <p className="text-3xl font-black">{comparisonResult?.p2Score}</p>
                                </div>
                            </div>
                            <p className="text-gray-300" dangerouslySetInnerHTML={{ __html: (comparisonResult?.verdict || '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-green-400">$1</strong>') }} />
                        </div>
                    </>
                ) : (
                    <div className="text-center text-gray-500 text-xl p-8">One or both players do not have attribute data for comparison.</div>
                )}
                 <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 italic pt-4 border-t border-gray-700/50">
                    <div>
                        {player1.originalManager && <p>P1 Original Manager: {player1.originalManager}</p>}
                        {player1.isImported && <p className="text-teal-400">Player 1 was imported.</p>}
                    </div>
                     <div className="text-right">
                        {player2.originalManager && <p>P2 Original Manager: {player2.originalManager}</p>}
                        {player2.isImported && <p className="text-teal-400">Player 2 was imported.</p>}
                    </div>
                </div>
            </div>
        );
    }
    

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex-shrink-0 bg-gray-800/60 p-3 rounded-lg border border-gray-700/50 flex flex-wrap items-center justify-center gap-4">
                <div className="flex-1 min-w-[250px]">
                    <Select value={player1Id} onChange={e => setPlayer1Id(e.target.value)} aria-label="Select Player 1">
                        <option value="">Select Player 1...</option>
                        {sortedPlayers.map(p => <option key={p.id} value={p.id}>{p.knownAs || `${p.firstName} ${p.lastName}`}</option>)}
                    </Select>
                </div>
                <span className="text-purple-400 font-bold">vs</span>
                <div className="flex-1 min-w-[250px]">
                     <Select value={player2Id} onChange={e => setPlayer2Id(e.target.value)} aria-label="Select Player 2">
                        <option value="">Select Player 2...</option>
                        {sortedPlayers.filter(p => p.id !== player1Id).map(p => <option key={p.id} value={p.id}>{p.knownAs || `${p.firstName} ${p.lastName}`}</option>)}
                    </Select>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
                {renderContent()}
            </div>
        </div>
    );
};

export default PlayerCompareView;
