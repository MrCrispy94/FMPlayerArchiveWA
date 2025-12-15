
import React, { useState, useMemo, useRef } from 'react';
import { Player, Club, NewgenTerm } from '../types';
import PlayerCard from './PlayerCard';
import Select from './ui/Select';
import Button from './ui/Button';
import { DownloadIcon } from './icons/DownloadIcon';
import html2canvas from 'html2canvas';

interface PlayerCardViewProps {
  allPlayers: Player[];
  allClubs: Record<string, Club>;
  newgenTerm: NewgenTerm;
}

const PlayerCardView: React.FC<PlayerCardViewProps> = ({ allPlayers, allClubs, newgenTerm }) => {
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(allPlayers.length > 0 ? allPlayers[0].id : null);
    const cardRef = useRef<HTMLDivElement>(null);

    const sortedPlayers = useMemo(() => 
        [...allPlayers].sort((a, b) => (a.knownAs || `${a.firstName} ${a.lastName}`).localeCompare(b.knownAs || `${b.firstName} ${b.lastName}`)),
        [allPlayers]
    );

    const selectedPlayer = useMemo(() => 
        allPlayers.find(p => p.id === selectedPlayerId), 
        [allPlayers, selectedPlayerId]
    );

    const handleExport = () => {
        if (cardRef.current && selectedPlayer) {
            html2canvas(cardRef.current, {
                backgroundColor: null, // Transparent background
                useCORS: true,
                scale: 2, // Higher resolution
            }).then(canvas => {
                const link = document.createElement('a');
                const playerName = selectedPlayer.knownAs || `${selectedPlayer.firstName}_${selectedPlayer.lastName}`;
                link.download = `fm_card_${playerName.replace(/\s+/g, '_')}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        }
    };
    
    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex-shrink-0 bg-gray-800/60 p-3 rounded-lg border border-gray-700/50 flex items-center justify-between gap-4">
                <div className="flex-grow max-w-md">
                    <Select 
                        value={selectedPlayerId || ''} 
                        onChange={e => setSelectedPlayerId(e.target.value)}
                        aria-label="Select Player"
                    >
                        {sortedPlayers.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.knownAs || `${p.firstName} ${p.lastName}`}
                            </option>
                        ))}
                    </Select>
                </div>
                <Button onClick={handleExport} disabled={!selectedPlayer} icon={DownloadIcon}>
                    Export Card
                </Button>
            </div>

            <div className="flex-1 flex items-center justify-center p-4 bg-gray-800/30 rounded-lg">
                {selectedPlayer ? (
                    <div ref={cardRef}>
                        <PlayerCard 
                            player={selectedPlayer} 
                            allClubs={allClubs}
                            newgenTerm={newgenTerm}
                        />
                    </div>
                ) : (
                    <div className="text-gray-500 text-2xl">
                        Select a player to view their card.
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlayerCardView;