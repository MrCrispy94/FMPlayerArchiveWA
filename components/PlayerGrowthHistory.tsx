
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Player, Attributes, AttributeSnapshot } from '../types';
import Select from './ui/Select';
import { outfieldAttributeGroups, goalkeeperAttributeGroups, keyAttributesByRole } from '../constants';

const toCamelCase = (str: string) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
        if (+match === 0) return "";
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
    }).replace(/\s+/g, '');
};

const attributeOptions = [
    {
        label: 'Overall Summary',
        options: [
            { value: 'overall', label: 'Overall Ability' },
            { value: 'value', label: 'Market Value (£m)' },
        ]
    },
    ...Object.entries({
      'Technical': outfieldAttributeGroups.Technical,
      'Mental': outfieldAttributeGroups.Mental,
      'Physical': outfieldAttributeGroups.Physical,
      'Goalkeeping': goalkeeperAttributeGroups.Goalkeeping
    }).map(([groupName, attrs]) => ({
      label: groupName,
      options: attrs.map(attr => ({
        value: toCamelCase(attr),
        label: attr
      }))
    }))
];

const getOverallAbility = (snapshot: AttributeSnapshot, primaryPosition: string): number => {
    const roleKey = Object.keys(keyAttributesByRole).find(key => primaryPosition.includes(key));
    const keyAttrs = keyAttributesByRole[roleKey || primaryPosition] || [];
    
    if (keyAttrs.length === 0) return 0;

    const keyAttrSum = keyAttrs.map(attr => Number(snapshot.attributes[attr]) || 0).reduce((sum, val) => sum + val, 0);
    const keyAttrAvg = keyAttrSum / keyAttrs.length;

    // Scale to 0-100
    const score = ((keyAttrAvg - 1) / 19) * 100;
    return Math.max(0, Math.min(100, score));
};


const PlayerGrowthHistory: React.FC<{ allPlayers: Player[] }> = ({ allPlayers }) => {
    const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
    const [selectedAttribute, setSelectedAttribute] = useState<keyof Attributes | 'overall' | 'value'>('overall');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const eligiblePlayers = useMemo(() => 
        allPlayers.filter(p => p.hasKnownAttributes && p.attributeSnapshots && p.attributeSnapshots.length >= 2)
            .sort((a, b) => (a.knownAs || `${a.firstName} ${a.lastName}`).localeCompare(b.knownAs || `${b.firstName} ${b.lastName}`))
    , [allPlayers]);

    const selectedPlayer = useMemo(() => allPlayers.find(p => p.id === selectedPlayerId), [allPlayers, selectedPlayerId]);
    
    const snapshots = useMemo(() => {
        if (!selectedPlayer) return [];
        return [...(selectedPlayer.attributeSnapshots || [])].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [selectedPlayer]);

    useEffect(() => {
        if (!selectedPlayerId && eligiblePlayers.length > 0) {
            setSelectedPlayerId(eligiblePlayers[0].id);
        }
    }, [eligiblePlayers, selectedPlayerId]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !selectedPlayer || snapshots.length < 2) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const padding = 60;
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        const { width, height } = rect;

        // Background
        ctx.fillStyle = '#1e1b4b'; // dark purple (indigo-900)
        ctx.fillRect(0, 0, width, height);

        const graphWidth = width - padding * 2;
        const graphHeight = height - padding * 2;
        const numSnapshots = snapshots.length;
        
        const isOverallView = selectedAttribute === 'overall';
        const isValueView = selectedAttribute === 'value';
        
        const yAxisMax = (() => {
            if (isOverallView) return 100;
            if (isValueView) {
                if (!snapshots || snapshots.length === 0) return 100;
                const maxValue = Math.max(...snapshots.map(s => s.value || 0));
                return Math.ceil((maxValue + 5) / 10) * 10 || 10; // Round up to nearest 10, add buffer
            }
            return 20; // For attributes
        })();
        
        const yAxisStep = isOverallView ? 10 : (isValueView ? Math.max(1, Math.ceil(yAxisMax / 5)) : 5);


        // Draw grid lines and Y-axis labels
        ctx.lineWidth = 1;
        ctx.font = '12px Inter, sans-serif';
        for (let i = 0; i <= yAxisMax; i += yAxisStep) {
            const y = padding + graphHeight - (i / yAxisMax) * graphHeight;
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();

            ctx.fillStyle = 'white';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(i.toString(), padding - 10, y);
        }
        
        // Draw X-axis labels (dates)
        snapshots.forEach((snapshot, i) => {
            const x = padding + (i / (numSnapshots - 1)) * graphWidth;
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.moveTo(x, padding);
            ctx.lineTo(x, height - padding);
            ctx.stroke();

            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.save();
            ctx.translate(x, height - padding + 10);
            ctx.rotate(-Math.PI / 4);
            ctx.fillText(snapshot.date, 0, 0);
            ctx.restore();
        });

        // Plot data
        const getValue = (snapshot: AttributeSnapshot): number => {
            if (isOverallView) {
                return getOverallAbility(snapshot, selectedPlayer.primaryPosition);
            }
            if (isValueView) {
                return snapshot.value || 0;
            }
            return snapshot.attributes[selectedAttribute as keyof Attributes] || 0;
        };
        
        ctx.lineWidth = 2.5;
        for (let i = 1; i < numSnapshots; i++) {
            const prevSnap = snapshots[i - 1];
            const currentSnap = snapshots[i];
            const prevVal = getValue(prevSnap);
            const currentVal = getValue(currentSnap);

            const startX = padding + ((i - 1) / (numSnapshots - 1)) * graphWidth;
            const startY = padding + graphHeight - (prevVal / yAxisMax) * graphHeight;
            const endX = padding + (i / (numSnapshots - 1)) * graphWidth;
            const endY = padding + graphHeight - (currentVal / yAxisMax) * graphHeight;
            
            ctx.beginPath();
            if (currentVal > prevVal) ctx.strokeStyle = '#22c55e'; // green-500
            else if (currentVal < prevVal) ctx.strokeStyle = '#ef4444'; // red-500
            else ctx.strokeStyle = '#ffffff'; // white
            
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }

        // Draw data points
        snapshots.forEach((snapshot, i) => {
            const val = getValue(snapshot);
            const x = padding + (i / (numSnapshots - 1)) * graphWidth;
            const y = padding + graphHeight - (val / yAxisMax) * graphHeight;

            ctx.beginPath();
            ctx.fillStyle = '#1e1b4b';
            ctx.strokeStyle = '#a78bfa'; // violet-400
            ctx.lineWidth = 2;
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });

    }, [selectedPlayer, snapshots, selectedAttribute]);

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex-shrink-0 bg-gray-800/60 p-3 rounded-lg border border-gray-700/50 flex flex-wrap items-center justify-center gap-4 relative z-10">
                <div className="flex-1 min-w-[250px]">
                    <label className="text-sm text-gray-400 block mb-1">Select Player</label>
                    <Select value={selectedPlayerId} onChange={e => setSelectedPlayerId(e.target.value)}>
                        {eligiblePlayers.map(p => (
                            <option key={p.id} value={p.id}>{p.knownAs || `${p.firstName} ${p.lastName}`}</option>
                        ))}
                    </Select>
                </div>
                <div className="flex-1 min-w-[250px]">
                    <label className="text-sm text-gray-400 block mb-1">Select Attribute</label>
                    <Select value={selectedAttribute} onChange={e => setSelectedAttribute(e.target.value as keyof Attributes | 'overall' | 'value')}>
                        {attributeOptions.map(group => (
                            <optgroup key={group.label} label={group.label}>
                                {group.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </optgroup>
                        ))}
                    </Select>
                </div>
            </div>
            
            <div className="flex-1 bg-gray-900/50 rounded-lg p-4 border border-gray-700/50 flex items-center justify-center">
                {selectedPlayer && snapshots.length >= 2 ? (
                    <canvas ref={canvasRef} className="w-full h-full" />
                ) : (
                    <div className="text-center text-gray-500 text-xl">
                        {eligiblePlayers.length > 0 ? 'Select a player to see their growth history.' : 'No players with sufficient attribute history found.'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlayerGrowthHistory;
