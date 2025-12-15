
import React, { useState, useEffect, useMemo } from 'react';
import { Honour } from '../types';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Checkbox from './ui/Checkbox';
import Input from './ui/Input';

interface HonoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  allHonours: Honour[];
  selectedHonours: string[] | Record<string, number>;
  onSave: (selectedHonours: string[] | Record<string, number>) => void;
  awardType: 'player' | 'manager';
}

type TabKey = 'league' | 'domestic_cup' | 'continental_cup' | 'intercontinental_cup' | 'international_trophy' | 'personal';

const TABS: Record<TabKey, string> = {
    'league': 'Domestic Leagues',
    'domestic_cup': 'Domestic Cups',
    'continental_cup': 'Continental Cups',
    'intercontinental_cup': 'Intercontinental',
    'international_trophy': 'International',
    'personal': 'Personal Awards',
};

const HonoursModal: React.FC<HonoursModalProps> = ({ isOpen, onClose, allHonours, selectedHonours, onSave, awardType }) => {
  const [currentSelection, setCurrentSelection] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<TabKey>('league');

  useEffect(() => {
    if (isOpen) {
      // Normalize incoming honours to a Record<string, number> for internal state
      if (Array.isArray(selectedHonours)) { // Player's string[]
        const record = selectedHonours.reduce((acc, id) => {
          acc[id] = 1;
          return acc;
        }, {} as Record<string, number>);
        setCurrentSelection(record);
      } else { // Manager's Record<string, number>
        setCurrentSelection(selectedHonours || {});
      }
      setActiveTab('league');
    }
  }, [selectedHonours, isOpen]);

  const handleCountChange = (honourId: string, count: number) => {
    const newCount = Math.max(0, count);
    setCurrentSelection(prev => {
        const newSelection = {...prev};
        if(newCount === 0) {
            delete newSelection[honourId];
        } else {
            newSelection[honourId] = newCount;
        }
        return newSelection;
    });
  };

  const handleSave = () => {
    // Convert back to original format on save
    if (awardType === 'player') {
      const asArray = Object.keys(currentSelection).filter(id => currentSelection[id] > 0);
      onSave(asArray);
    } else {
      onSave(currentSelection);
    }
    onClose();
  };

  const availableHonours = useMemo(() => {
    if (awardType === 'player') {
        return allHonours.filter(h => !h.isManagerOnly);
    }
    // if awardType is 'manager', team awards are shared, personal awards are filtered
    return allHonours.filter(h => h.isManagerOnly || !h.type.startsWith('personal_'));
  }, [allHonours, awardType]);

  const honoursForTab = useMemo(() => {
    if (activeTab === 'personal') {
        return availableHonours.filter(h => h.type.startsWith('personal_'));
    }
    return availableHonours.filter(h => h.type === activeTab);
  }, [activeTab, availableHonours]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Honours">
        <div className="border-b border-gray-700/50 mb-4">
            <nav className="-mb-px flex gap-x-4 overflow-x-auto" aria-label="Tabs">
                {Object.entries(TABS).map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key as TabKey)}
                        className={`
                            ${activeTab === key
                                ? 'border-purple-500 text-purple-400'
                                : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                            }
                            shrink-0 py-3 px-2 border-b-2 font-medium text-sm transition-colors
                        `}
                        aria-current={activeTab === key ? 'page' : undefined}
                    >
                        {label}
                    </button>
                ))}
            </nav>
        </div>
        
        <div className="space-y-3 min-h-[200px]">
            {honoursForTab.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                    {honoursForTab.map(honour => {
                        const count = currentSelection[honour.id] || 0;
                        const isCountable = honour.isCountable && awardType === 'manager';
                        return (
                            <div key={honour.id} className="flex items-center gap-2">
                                <Checkbox
                                    label={honour.name}
                                    checked={count > 0}
                                    onChange={(e) => handleCountChange(honour.id, e.target.checked ? 1 : 0)}
                                    className="flex-grow"
                                />
                                {isCountable && (
                                    <Input
                                        type="number"
                                        value={count}
                                        onChange={(e) => handleCountChange(honour.id, parseInt(e.target.value, 10) || 0)}
                                        className="w-16 text-center"
                                        min="0"
                                        disabled={count === 0}
                                    />
                                )}
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="flex items-center justify-center h-full text-gray-500 pt-10">
                    No awards in this category.
                </div>
            )}
        </div>
      
        <div className="mt-6 flex justify-end gap-3">
            <Button onClick={onClose} variant="secondary">Cancel</Button>
            <Button onClick={handleSave} variant="primary">Save Honours</Button>
        </div>
    </Modal>
  );
};

export default HonoursModal;
