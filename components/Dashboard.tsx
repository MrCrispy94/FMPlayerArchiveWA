

import React, { useMemo } from 'react';
import type { Player, Manager, Club, SaveGame, CurrencyOption } from '../types';
import PlayerCard from './PlayerCard';
import { GoldTrophyIcon } from './icons/GoldTrophyIcon';
import { BootAwardIcon } from './icons/BootAwardIcon';
import { FlagIcon } from './icons/FlagIcon';
import { getCurrencySymbol } from '../constants';

interface DashboardProps {
  players: Player[];
  managers: Manager[];
  username: string | null;
  onSelectPlayer: (playerId: string) => void;
  allClubs: Record<string, Club>;
  saveGames: SaveGame[];
  currency: CurrencyOption;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
  <div className="bg-gray-800/70 p-4 rounded-lg flex items-center gap-4 border border-gray-700/50">
    <div className="p-3 bg-purple-600/30 rounded-full">
      <Icon className="w-6 h-6 text-purple-300" />
    </div>
    <div>
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const Leaderboard: React.FC<{ title: string; items: any[]; renderItem: (item: any) => React.ReactNode }> = ({ title, items, renderItem }) => (
    <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700/50">
        <h3 className="text-lg font-bold text-purple-300 mb-3">{title}</h3>
        <ul className="space-y-2">
            {items.slice(0, 5).map((item, index) => (
                <li key={index} className="p-2 bg-gray-900/50 rounded-md hover:bg-gray-700/50 transition-colors">
                    {renderItem(item)}
                </li>
            ))}
        </ul>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ players, managers, username, onSelectPlayer, allClubs, saveGames, currency }) => {
    
    const currencySymbol = getCurrencySymbol(currency);
    
    const stats = useMemo(() => {
        let totalTrophies = 0;
        players.forEach(p => {
            totalTrophies += p.seasonStats.reduce((sum, s) => sum + s.honours.length, 0);
        });
        managers.forEach(m => {
            totalTrophies += m.seasonStats.reduce((sum, s) => sum + Object.values(s.honours).reduce((a: number, b: number) => a + b, 0), 0);
        });
        return {
            totalPlayers: players.length,
            totalManagers: managers.length,
            totalTrophies,
        };
    }, [players, managers]);

    const leaderboards = useMemo(() => {
        const topScorers = [...players].sort((a, b) => {
            const goalsA = a.seasonStats.reduce((sum, s) => sum + (s.goals || 0), 0);
            const goalsB = b.seasonStats.reduce((sum, s) => sum + (s.goals || 0), 0);
            return goalsB - goalsA;
        });

        const topAssists = [...players].sort((a, b) => {
            const assistsA = a.seasonStats.reduce((sum, s) => sum + (s.assists || 0), 0);
            const assistsB = b.seasonStats.reduce((sum, s) => sum + (s.assists || 0), 0);
            return assistsB - assistsA;
        });
        
        const topRated = [...players].filter(p => p.seasonStats.reduce((sum, s) => sum + s.apps, 0) >= 30)
            .map(p => {
                const totalApps = p.seasonStats.reduce((sum, s) => sum + s.apps, 0);
                const weightedRating = p.seasonStats.reduce((sum, s) => sum + s.avgRating * s.apps, 0);
                return { ...p, careerAvgRating: totalApps > 0 ? weightedRating / totalApps : 0 };
            })
            .sort((a, b) => b.careerAvgRating - a.careerAvgRating);

        const topValued = [...players].sort((a,b) => (b.currentValue || 0) - (a.currentValue || 0));

        const topPlayerFees = [...players].map(p => ({
            ...p,
            totalFees: p.clubHistory.reduce((sum, h) => sum + (h.transferFee || 0), 0)
        })).filter(p => p.totalFees > 0).sort((a, b) => b.totalFees - a.totalFees);

        const saveGameSpend: Record<string, { total: number, color: string }> = {};
        saveGames.forEach(sg => {
            saveGameSpend[sg.name] = { total: 0, color: sg.color };
        });
        players.forEach(p => {
            p.clubHistory.forEach(h => {
                if (h.isManagerTransfer && h.transferFee && h.transferFee > 0 && p.saveGameName && saveGameSpend[p.saveGameName]) {
                    saveGameSpend[p.saveGameName].total += h.transferFee;
                }
            });
        });

        const topSaveGameSpend = Object.entries(saveGameSpend)
            .map(([name, data]) => ({ name, ...data }))
            .filter(sg => sg.total > 0)
            .sort((a, b) => b.total - a.total);


        return { topScorers, topAssists, topRated, topValued, topPlayerFees, topSaveGameSpend };
    }, [players, saveGames]);

    const playerSpotlight = useMemo(() => {
        const favouritePlayers = players.filter(p => p.isFavourite);
        if (favouritePlayers.length === 0) return null;
        return favouritePlayers[Math.floor(Math.random() * favouritePlayers.length)];
    }, [players]);


    return (
        <div className="h-full overflow-y-auto pr-2 space-y-6">
            <h2 className="text-3xl font-bold text-white">Welcome back, <span className="text-purple-400">{username || 'Manager'}</span>!</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Players" value={stats.totalPlayers} icon={BootAwardIcon} />
                <StatCard title="Total Managers" value={stats.totalManagers} icon={BootAwardIcon} />
                <StatCard title="Total Trophies Won" value={stats.totalTrophies} icon={GoldTrophyIcon} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Leaderboard title="Top Goalscorers" items={leaderboards.topScorers} renderItem={(p) => (
                        <div className="flex items-center justify-between text-sm cursor-pointer" onClick={() => onSelectPlayer(p.id)}>
                            <p className="font-semibold text-white">{p.knownAs || `${p.firstName} ${p.lastName}`}</p>
                            <p className="text-gray-300 font-bold">{p.seasonStats.reduce((sum, s) => sum + (s.goals || 0), 0)} goals</p>
                        </div>
                    )} />
                     <Leaderboard title="Top Assists" items={leaderboards.topAssists} renderItem={(p) => (
                        <div className="flex items-center justify-between text-sm cursor-pointer" onClick={() => onSelectPlayer(p.id)}>
                            <p className="font-semibold text-white">{p.knownAs || `${p.firstName} ${p.lastName}`}</p>
                            <p className="text-gray-300 font-bold">{p.seasonStats.reduce((sum, s) => sum + (s.assists || 0), 0)} assists</p>
                        </div>
                    )} />
                     <Leaderboard title="Top Average Rating" items={leaderboards.topRated} renderItem={(p) => (
                        <div className="flex items-center justify-between text-sm cursor-pointer" onClick={() => onSelectPlayer(p.id)}>
                             <p className="font-semibold text-white">{p.knownAs || `${p.firstName} ${p.lastName}`}</p>
                            <p className="text-gray-300 font-bold">{p.careerAvgRating.toFixed(2)}</p>
                        </div>
                    )} />
                     <Leaderboard title="Most Valuable Players" items={leaderboards.topValued} renderItem={(p) => (
                        <div className="flex items-center justify-between text-sm cursor-pointer" onClick={() => onSelectPlayer(p.id)}>
                            <p className="font-semibold text-white">{p.knownAs || `${p.firstName} ${p.lastName}`}</p>
                            <p className="text-gray-300 font-bold">{currencySymbol}{p.currentValue || 0}m</p>
                        </div>
                    )} />
                    <Leaderboard title="Top Player Transfer Fees" items={leaderboards.topPlayerFees} renderItem={(p) => (
                        <div className="flex items-center justify-between text-sm cursor-pointer" onClick={() => onSelectPlayer(p.id)}>
                            <p className="font-semibold text-white">{p.knownAs || `${p.firstName} ${p.lastName}`}</p>
                            <p className="text-gray-300 font-bold">{currencySymbol}{p.totalFees}m</p>
                        </div>
                    )} />
                    <Leaderboard title="Top Save Game Spend" items={leaderboards.topSaveGameSpend} renderItem={(sg) => (
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: sg.color }}></span>
                                <p className="font-semibold text-white">{sg.name}</p>
                            </div>
                            <p className="text-gray-300 font-bold">{currencySymbol}{sg.total.toFixed(1)}m</p>
                        </div>
                    )} />
                </div>

                <div className="lg:col-span-2 xl:col-span-1">
                    <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700/50 h-full flex flex-col items-center justify-center">
                        <h3 className="text-lg font-bold text-purple-300 mb-3">Player Spotlight</h3>
                        {playerSpotlight ? (
                            <PlayerCard player={playerSpotlight} allClubs={allClubs} newgenTerm="NewGen" />
                        ) : (
                            <div className="text-center text-gray-500">
                                <p>Mark a player as a favourite to feature them here!</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
