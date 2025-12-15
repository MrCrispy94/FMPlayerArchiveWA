
import React, { useState, useEffect } from 'react';
import { Player } from '../types';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Checkbox from './ui/Checkbox';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemsToExport: { id: string, name: string }[];
  itemType: 'player' | 'manager';
  onExport: (itemIds: string[], type: 'player' | 'manager') => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, itemsToExport, itemType, onExport }) => {
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedItemIds([]);
    }
  }, [isOpen]);

  const handleToggleItem = (itemId: string) => {
    setSelectedItemIds(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleToggleAll = () => {
    if (selectedItemIds.length === itemsToExport.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(itemsToExport.map(p => p.id));
    }
  };
  
  const handleExportClick = () => {
      if (selectedItemIds.length === 0) {
          alert(`Please select at least one ${itemType} to export.`);
          return;
      }
      onExport(selectedItemIds, itemType);
  }

  const title = itemType === 'player' ? 'Export Players' : 'Export Managers';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
        <div className="space-y-4">
            <p className="text-gray-300">Select the {itemType}s you want to export. This will create a JSON file containing all selected data and any associated custom clubs or competitions.</p>
            
            <div className="p-3 bg-gray-900/50 rounded-md border border-gray-700">
                <Checkbox
                    label="Select All / Deselect All"
                    checked={selectedItemIds.length === itemsToExport.length && itemsToExport.length > 0}
                    onChange={handleToggleAll}
                />
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2 p-2 border border-gray-700/50 rounded-md">
                {itemsToExport.map(item => (
                    <div key={item.id} className="p-2 bg-gray-700/50 rounded-md">
                        <Checkbox
                            label={item.name}
                            checked={selectedItemIds.includes(item.id)}
                            onChange={() => handleToggleItem(item.id)}
                        />
                    </div>
                ))}
            </div>
        </div>
      
        <div className="mt-6 flex justify-end gap-3">
            <Button onClick={onClose} variant="secondary">Cancel</Button>
            <Button onClick={handleExportClick} variant="primary" disabled={selectedItemIds.length === 0}>
                Export ({selectedItemIds.length}) {itemType === 'player' ? 'Player(s)' : 'Manager(s)'}
            </Button>
        </div>
    </Modal>
  );
};

export default ExportModal;
