

import React, { useState, useMemo } from 'react';
import { Player, CurrencyOption } from '../types';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { TrashIcon } from './icons/TrashIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { getCurrencySymbol } from '../constants';

interface ManageHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player;
  onSave: (player: Player) => void;
  currency: CurrencyOption;
}

const ManageHistoryModal: React.FC<ManageHistoryModalProps> = ({ isOpen, onClose, player, onSave, currency }) => {
  const [snapshotToDelete, setSnapshotToDelete] = useState<string | null>(null);
  const [snapshotToSetCurrent, setSnapshotToSetCurrent] = useState<string | null>(null);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const currencySymbol = getCurrencySymbol(currency);

  const currentSnapshot = useMemo(() => {
    if (!player.hasKnownAttributes || !player.attributeSnapshots) return null;
    const currentAttrsString = JSON.stringify(player.attributes);
    return player.attributeSnapshots.find(s => JSON.stringify(s.attributes) === currentAttrsString);
  }, [player]);
  
  const otherSnapshots = useMemo(() =>
    (player.attributeSnapshots || [])
      .filter(s => s.id !== currentSnapshot?.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [player.attributeSnapshots, currentSnapshot]
  );


  const handleDeleteSnapshot = (id: string) => {
    const remainingSnapshots = (player.attributeSnapshots || []).filter(s => s.id !== id);
    
    const updatedPlayer: Player = {
      ...player,
      attributeSnapshots: remainingSnapshots,
    };

    onSave(updatedPlayer);
    setSnapshotToDelete(null);
  };

  const handleSetCurrentSnapshot = (id: string) => {
      const snapshotToSet = player.attributeSnapshots?.find(s => s.id === id);
      if (!snapshotToSet) return;

      const updatedPlayer: Player = {
          ...player,
          attributes: snapshotToSet.attributes,
          currentValue: snapshotToSet.value ?? player.currentValue,
      };

      onSave(updatedPlayer);
      setSnapshotToSetCurrent(null);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Manage Attribute History for ${player.knownAs || player.firstName}`}>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        <p className="text-sm text-gray-400">
            Manage historical attribute snapshots. You can set a past snapshot as the player's current attributes, or delete old records.
        </p>
        
        <div>
          <h4 className="text-lg font-semibold text-purple-300 mb-2">Current Attributes</h4>
          {currentSnapshot ? (
            <div className="p-3 rounded-md bg-purple-900/40 border border-purple-500/50">
                <div className="flex items-center justify-between">
                <div>
                    <span className="font-semibold text-gray-200">{currentSnapshot.date}</span>
                    {currentSnapshot.value !== undefined && <span className="text-xs text-gray-400 ml-2">(Value: {currencySymbol}{currentSnapshot.value}m)</span>}
                </div>
                <span className="text-xs text-purple-300 font-bold py-0.5 px-2 bg-purple-600/30 rounded-full">CURRENT</span>
                </div>
            </div>
            ) : (
            <p className="text-sm text-gray-500 p-3 bg-gray-700/60 rounded-md">No current attribute snapshot identified. This can happen if attributes were changed manually without creating a snapshot.</p>
            )}
        </div>

        {otherSnapshots.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
                <h4 className="text-lg font-semibold text-purple-300">History ({otherSnapshots.length})</h4>
                 <button onClick={() => setIsHistoryExpanded(!isHistoryExpanded)} className="text-gray-400 hover:text-white">
                    <span className="sr-only">{isHistoryExpanded ? 'Collapse' : 'Expand'} history</span>
                    <ChevronDownIcon className={`w-5 h-5 transition-transform ${isHistoryExpanded ? 'rotate-180' : ''}`} />
                </button>
            </div>
            
            {isHistoryExpanded && (
                <ul className="space-y-2">
                {otherSnapshots.map(snapshot => {
                    const isDeleting = snapshotToDelete === snapshot.id;
                    const isSettingCurrent = snapshotToSetCurrent === snapshot.id;

                    return (
                    <li key={snapshot.id} className={`p-3 rounded-md transition-colors duration-200 ${isDeleting ? 'bg-red-900/40' : (isSettingCurrent ? 'bg-blue-900/40' : 'bg-gray-700/60')}`}>
                        <div className="flex items-center justify-between">
                        <div>
                            <span className="font-semibold text-gray-200">{snapshot.date}</span>
                            {snapshot.value !== undefined && <span className="text-xs text-gray-400 ml-2">(Value: {currencySymbol}{snapshot.value}m)</span>}
                        </div>
                        
                        {isDeleting ? (
                            <div className="flex items-center gap-4">
                                <p className="text-sm text-red-300">Are you sure?</p>
                                <Button onClick={() => handleDeleteSnapshot(snapshot.id)} variant="danger" size="sm">Confirm Delete</Button>
                                <Button onClick={() => setSnapshotToDelete(null)} variant="secondary" size="sm">Cancel</Button>
                            </div>
                        ) : isSettingCurrent ? (
                            <div className="flex items-center gap-4">
                                <p className="text-sm text-blue-300">Set as current attributes?</p>
                                <Button onClick={() => handleSetCurrentSnapshot(snapshot.id)} variant="primary" size="sm">Confirm</Button>
                                <Button onClick={() => setSnapshotToSetCurrent(null)} variant="secondary" size="sm">Cancel</Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button
                                onClick={() => setSnapshotToSetCurrent(snapshot.id)}
                                variant="secondary"
                                size="sm"
                                title="Set these attributes as current"
                                >
                                    Set Current
                                </Button>
                                <Button 
                                onClick={() => setSnapshotToDelete(snapshot.id)} 
                                variant="danger" 
                                size="sm" 
                                icon={TrashIcon}
                                title="Delete this snapshot"
                                />
                            </div>
                        )}
                        </div>
                    </li>
                    );
                })}
                </ul>
            )}
          </div>
        )}
      </div>
       <div className="mt-6 flex justify-end">
          <Button onClick={onClose} variant="primary">Close</Button>
      </div>
    </Modal>
  );
};

export default ManageHistoryModal;
