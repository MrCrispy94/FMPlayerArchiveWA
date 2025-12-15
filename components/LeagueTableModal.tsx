import React from 'react';
import type { ManagerSeasonStat, LeagueTableRow } from '../types';
import Modal from './ui/Modal';

interface LeagueTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  season?: ManagerSeasonStat;
}

const getTrStyle = (row: LeagueTableRow, managerClub: string): string => {
    const lowerInf = row.inf.toLowerCase();
    if (lowerInf === 'c') return 'bg-yellow-400 text-black font-bold';
    if (lowerInf.includes('ucl')) return 'bg-blue-600 text-gray-100 font-semibold';
    if (lowerInf.includes('uel')) return 'bg-orange-500 text-black font-semibold';
    if (lowerInf.includes('uecl')) return 'bg-green-600 text-black font-semibold';
    if (lowerInf === 'r') return 'bg-red-600 text-black font-semibold';
    
    // The user's team if it's not a special row
    if (row.team === managerClub) return 'bg-purple-600 text-white font-bold';
    
    // All other rows get the "FM purple" background as requested
    return 'bg-purple-800 text-white';
};

const LeagueTableModal: React.FC<LeagueTableModalProps> = ({ isOpen, onClose, season }) => {
    if (!season || !season.leagueTable) {
        return null;
    }
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`League Table for ${season.season}`} size="4xl">
            <div className="max-h-[70vh] overflow-y-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-700/50 text-xs text-gray-300 uppercase tracking-wider sticky top-0">
                        <tr>
                            <th className="p-2">Pos</th>
                            <th className="p-2">Inf</th>
                            <th className="p-2">Team</th>
                            <th className="p-2">Pld</th>
                            <th className="p-2">W</th>
                            <th className="p-2">D</th>
                            <th className="p-2">L</th>
                            <th className="p-2">F</th>
                            <th className="p-2">A</th>
                            <th className="p-2">GD</th>
                            <th className="p-2">Pts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {season.leagueTable.map((row, index) => (
                            <tr key={index} className={`border-t border-gray-700/50 ${getTrStyle(row, season.club)}`}>
                                <td className="p-2 text-center">{row.pos}</td>
                                <td className="p-2 text-center">{row.inf}</td>
                                <td className="p-2">{row.team}</td>
                                <td className="p-2 text-center">{row.pld}</td>
                                <td className="p-2 text-center">{row.won}</td>
                                <td className="p-2 text-center">{row.drn}</td>
                                <td className="p-2 text-center">{row.lst}</td>
                                <td className="p-2 text-center">{row.for}</td>
                                <td className="p-2 text-center">{row.ag}</td>
                                <td className="p-2 text-center">{row.gd}</td>
                                <td className="p-2 font-bold text-center">{row.pts}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Modal>
    );
};

export default LeagueTableModal;