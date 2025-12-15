

import React, { useState, useRef, useEffect } from 'react';
import type { Player, AttributeSnapshot, Attributes, CurrencyOption } from '../types';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';
import { parseAttributesFromHTML } from '../services/parser';
import { v4 as uuidv4 } from 'uuid';
import AttributeTable from './AttributeTable';
import { getCurrencySymbol } from '../constants';

interface UpdateAttributesModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player;
  onSave: (player: Player) => void;
  currency: CurrencyOption;
}

export const UpdateAttributesModal: React.FC<UpdateAttributesModalProps> = ({ isOpen, onClose, player, onSave, currency }) => {
  const [snapshotDate, setSnapshotDate] = useState(new Date().toISOString().split('T')[0]);
  const [snapshotValue, setSnapshotValue] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // File upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  // Manual edit state
  const [isManualEdit, setIsManualEdit] = useState(false);
  const [editedAttributes, setEditedAttributes] = useState<Attributes | null>(null);

  const currencySymbol = getCurrencySymbol(currency);

  useEffect(() => {
    if (isOpen) {
      // Reset states when modal opens
      setIsManualEdit(false);
      setFile(null);
      setSnapshotDate(new Date().toISOString().split('T')[0]);
      setEditedAttributes({ ...player.attributes }); // Pre-fill with player's current attributes
      setSnapshotValue(player.currentValue || 0);
    }
  }, [isOpen, player]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };
  
  const handleFileUpload = () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const { attributes: parsedAttributes, isGoalkeeper } = parseAttributesFromHTML(content);
        if (Object.keys(parsedAttributes).length === 0) {
          alert('Could not find any valid attributes in the file.');
          setIsProcessing(false);
          return;
        }

        const newSnapshot: AttributeSnapshot = {
          id: uuidv4(),
          date: snapshotDate,
          attributes: { ...player.attributes, ...parsedAttributes },
          value: snapshotValue,
        };

        const updatedPlayer: Player = {
          ...player,
          attributes: newSnapshot.attributes,
          currentValue: snapshotValue,
          attributeSnapshots: [...(player.attributeSnapshots || []), newSnapshot]
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
          hasKnownAttributes: true,
        };
        
        if (isGoalkeeper) {
            updatedPlayer.primaryPosition = 'GK';
        }

        onSave(updatedPlayer);
        onClose();
        
      } catch (error) {
        console.error("Failed to parse snapshot file:", error);
        alert("An error occurred while parsing the attribute file.");
      } finally {
        setIsProcessing(false);
        setFile(null);
        if(fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleAttributeChange = (category: keyof Attributes, attribute: keyof Attributes, value: number) => {
    setEditedAttributes(prev => prev ? ({
      ...prev,
      [attribute]: value,
    }) : null);
  };
  
  const handleManualSave = () => {
    if (!editedAttributes) {
        alert('No attributes to save.');
        return;
    }
    const newSnapshot: AttributeSnapshot = {
      id: uuidv4(),
      date: snapshotDate,
      attributes: editedAttributes,
      value: snapshotValue,
    };
    
    const updatedPlayer: Player = {
      ...player,
      attributes: newSnapshot.attributes,
      currentValue: snapshotValue,
      attributeSnapshots: [...(player.attributeSnapshots || []), newSnapshot]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    };

    onSave(updatedPlayer);
    onClose();
  };
  
  const handleClose = () => {
      // Reset all states on close
      setFile(null);
      setIsProcessing(false);
      setIsManualEdit(false);
      setEditedAttributes(null);
      if(fileInputRef.current) fileInputRef.current.value = '';
      onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Update Attributes & Value" size="4xl">
      <div className="space-y-4">
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-1">Snapshot Date</label>
            <Input type="date" value={snapshotDate} onChange={e => setSnapshotDate(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-1">Market Value at this time ({currencySymbol}m)</label>
            <Input type="number" step="0.1" value={snapshotValue} onChange={e => setSnapshotValue(parseFloat(e.target.value) || 0)} />
          </div>
        </div>

        <div className="p-3 bg-gray-700/50 rounded-md">
            <div className="flex justify-center gap-4">
                <Button onClick={() => setIsManualEdit(false)} variant={!isManualEdit ? 'primary' : 'secondary'} size="sm">
                    Upload from HTML
                </Button>
                <Button onClick={() => setIsManualEdit(true)} variant={isManualEdit ? 'primary' : 'secondary'} size="sm">
                    Edit Manually
                </Button>
            </div>
        </div>
        
        {isManualEdit ? (
          <div className="space-y-4">
            <AttributeTable attributes={editedAttributes!} isEditing={true} onChange={handleAttributeChange} primaryPosition={player.primaryPosition} />
             <Button onClick={handleManualSave} variant="primary" className="w-full">
              Save Manual Changes
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
             <p className="text-sm text-gray-400">
              Upload an HTML file from Football Manager (Ctrl+P on player profile) to create a new attribute snapshot.
            </p>
            <div>
              <label htmlFor="snapshot-file" className="text-sm font-medium text-gray-300 block mb-1">
                Player Profile HTML File
              </label>
              <Input
                id="snapshot-file"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".html,.htm"
              />
            </div>
            <Button onClick={handleFileUpload} variant="primary" className="w-full" disabled={isProcessing || !file}>
              {isProcessing ? 'Processing...' : 'Upload & Save Snapshot'}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
