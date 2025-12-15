
import React, { useState, useMemo, useEffect } from 'react';
import type { Player, AttributeSnapshot, Attributes } from '../types';
import Modal from './ui/Modal';
import Select from './ui/Select';
import { keyAttributesByRole, outfieldAttributeGroups, goalkeeperAttributeGroups } from '../constants';
import { UpArrowIcon } from './icons/UpArrowIcon';

interface AttributeSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player;
}

const getRoleBasedScore = (snapshot: AttributeSnapshot, primaryPosition: string): number => {
    const roleKey = Object.keys(keyAttributesByRole).find(key => primaryPosition.includes(key));
    const keyAttrs = keyAttributesByRole[roleKey || primaryPosition] || [];
    
    if (keyAttrs.length === 0) return 0;

    const keyAttrSum = keyAttrs.map(attr => Number(snapshot.attributes[attr]) || 0).reduce((sum, val) => sum + val, 0);
    const keyAttrAvg = keyAttrSum / keyAttrs.length;

    // Scale to 0-100
    const score = ((keyAttrAvg - 1) / 19) * 100;
    return Math.max(0, Math.min(100, score));
};

const AttributeSnapshotModal: React.FC<AttributeSnapshotModalProps> = ({ isOpen, onClose, player }) => {
  const snapshots = useMemo(() => {
    return [...(player.attributeSnapshots || [])].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [player.attributeSnapshots]);
  
  const [snapshotAId, setSnapshotAId] = useState<string>('');
  const [snapshotBId, setSnapshotBId] = useState<string>('');
  
  const currentSnapshot = useMemo(() => {
    if (!player.hasKnownAttributes || !player.attributeSnapshots) return null;
    const currentAttrsString = JSON.stringify(player.attributes);
    return player.attributeSnapshots.find(s => JSON.stringify(s.attributes) === currentAttrsString);
  }, [player]);

  useEffect(() => {
    if (isOpen && snapshots.length > 0) {
      setSnapshotAId(snapshots.length > 1 ? snapshots[snapshots.length - 2].id : '');
      setSnapshotBId(snapshots.length > 0 ? snapshots[snapshots.length - 1].id : '');
    }
  }, [isOpen, snapshots]);
  
  const snapshotA = useMemo(() => snapshots.find(s => s.id === snapshotAId), [snapshots, snapshotAId]);
  const snapshotB = useMemo(() => snapshots.find(s => s.id === snapshotBId), [snapshots, snapshotBId]);

  const comparisonResult = useMemo(() => {
    if (!snapshotA || !snapshotB) return null;

    const scoreA = getRoleBasedScore(snapshotA, player.primaryPosition);
    const scoreB = getRoleBasedScore(snapshotB, player.primaryPosition);

    const winner = scoreA > scoreB ? 'A' : (scoreB > scoreA ? 'B' : null);
    const scoreDiff = Math.abs(scoreA - scoreB);

    let verdict = '';
    if (winner === 'A') {
        verdict = `The player performed better on **${snapshotA.date}** with a role score **${scoreDiff.toFixed(1)}** points higher.`;
    } else if (winner === 'B') {
        verdict = `The player performed better on **${snapshotB.date}** with a role score **${scoreDiff.toFixed(1)}** points higher.`;
    } else if (scoreA === scoreB && scoreA > 0) {
        verdict = "The player's performance for their role was identical between these two dates.";
    } else {
        verdict = "Cannot determine a winner based on the provided data.";
    }

    return { scoreA: scoreA.toFixed(1), scoreB: scoreB.toFixed(1), winner, verdict };
  }, [snapshotA, snapshotB, player.primaryPosition]);


  const renderAttributeTable = (title: string, attributes: string[]) => {
    if (!snapshotA || !snapshotB) return null;
    return (
        <div className="bg-gray-900/50 rounded-lg overflow-hidden">
            <h4 className="text-lg font-bold p-3 bg-gray-700/50 text-purple-300">{title}</h4>
            <table className="w-full text-sm">
                <tbody>
                    {attributes.map(attr => {
                        const camelCaseAttr = attr.replace(/\s(.)/g, m => m.toUpperCase()).replace(/\s/g, '').replace(/^(.)/, m => m.toLowerCase()) as keyof Attributes;
                        const valA = snapshotA.attributes[camelCaseAttr] || 0;
                        const valB = snapshotB.attributes[camelCaseAttr] || 0;
                        const pAWins = valA > valB;
                        const pBWins = valB > valA;
                        const isLargeChange = Math.abs(valA - valB) >= 3;

                        return (
                             <tr key={attr} className="border-t border-gray-700/50">
                                <td className={`p-2 font-bold w-1/3 text-center ${pAWins ? 'text-green-400' : 'text-gray-300'}`}>
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-6 flex items-center justify-center">
                                            {pAWins && isLargeChange && (
                                                <div className="flex flex-col items-center">
                                                    <UpArrowIcon className="w-3 h-3" />
                                                    <UpArrowIcon className="w-3 h-3 -mt-1.5" />
                                                </div>
                                            )}
                                        </div>
                                        <span>{valA}</span>
                                    </div>
                                </td>
                                <td className="p-2 text-center text-gray-400 w-1/3">{attr}</td>
                                <td className={`p-2 font-bold w-1/3 text-center ${pBWins ? 'text-green-400' : 'text-gray-300'}`}>
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-6 flex items-center justify-center">
                                            {pBWins && isLargeChange && (
                                                <div className="flex flex-col items-center">
                                                    <UpArrowIcon className="w-3 h-3" />
                                                    <UpArrowIcon className="w-3 h-3 -mt-1.5" />
                                                </div>
                                            )}
                                        </div>
                                        <span>{valB}</span>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
  };

  const renderContent = () => {
    if (snapshots.length < 2) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-lg">Not enough snapshots to compare. Archive at least two sets of attributes.</p>
        </div>
      );
    }
    
    if (!snapshotA || !snapshotB) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-lg">Select two snapshots to begin comparison.</p>
        </div>
      );
    }

    const isGk = player.primaryPosition === 'GK';

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {renderAttributeTable('Technical', outfieldAttributeGroups.Technical)}
          {renderAttributeTable('Mental', outfieldAttributeGroups.Mental)}
          {renderAttributeTable('Physical', outfieldAttributeGroups.Physical)}
        </div>
        {isGk && renderAttributeTable('Goalkeeping', goalkeeperAttributeGroups.Goalkeeping)}
        
        <div className="p-4 bg-gray-900/50 rounded-lg text-center">
            <h4 className="text-xl font-bold text-purple-300">Verdict</h4>
            <div className="flex justify-around items-center my-4">
                <div className="text-center">
                    <p className="text-sm text-gray-400">Score ({snapshotA.date})</p>
                    <p className="text-3xl font-black">{comparisonResult?.scoreA}</p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-400">Score ({snapshotB.date})</p>
                    <p className="text-3xl font-black">{comparisonResult?.scoreB}</p>
                </div>
            </div>
            <p className="text-gray-300" dangerouslySetInnerHTML={{ __html: (comparisonResult?.verdict || '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-green-400">$1</strong>') }} />
        </div>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Attribute History: ${player.knownAs || player.firstName + ' ' + player.lastName}`} size="5xl">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-4 p-3 bg-gray-800/60 rounded-lg">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-gray-400 mb-1 block">Compare</label>
            <Select value={snapshotAId} onChange={e => setSnapshotAId(e.target.value)}>
              <option value="" disabled>Select Snapshot A</option>
              {snapshots.map(s => {
                  const label = s.id === currentSnapshot?.id ? `Current Stats (${s.date})` : s.date;
                  return <option key={s.id} value={s.id}>{label}</option>
              })}
            </Select>
          </div>
          <span className="text-purple-400 font-bold self-end pb-2">with</span>
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-gray-400 mb-1 block">To</label>
            <Select value={snapshotBId} onChange={e => setSnapshotBId(e.target.value)}>
              <option value="" disabled>Select Snapshot B</option>
              {snapshots.filter(s => s.id !== snapshotAId).map(s => {
                  const label = s.id === currentSnapshot?.id ? `Current Stats (${s.date})` : s.date;
                  return <option key={s.id} value={s.id}>{label}</option>
              })}
            </Select>
          </div>
        </div>
        <div className="max-h-[60vh] overflow-y-auto pr-2">
            {renderContent()}
        </div>
      </div>
    </Modal>
  );
};

export default AttributeSnapshotModal;
