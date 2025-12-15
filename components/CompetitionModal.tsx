import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Competition, HonourType } from '../types';
import { HONOUR_TYPES } from '../constants';
import { TROPHY_ICONS } from './icons/trophies';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import Checkbox from './ui/Checkbox';
import TrophyIconSelectorModal from './TrophyIconSelectorModal';

interface CompetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (competition: Competition) => void;
  competitionToEdit?: Competition;
}

const CompetitionModal: React.FC<CompetitionModalProps> = ({ isOpen, onClose, onSave, competitionToEdit }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<HonourType>('personal_domestic');
  const [icon, setIcon] = useState<string | undefined>(undefined);
  const [isManagerOnly, setIsManagerOnly] = useState(false);
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (competitionToEdit) {
        setName(competitionToEdit.name);
        setType(competitionToEdit.type);
        setIcon(competitionToEdit.icon);
        setIsManagerOnly(competitionToEdit.isManagerOnly || false);
      } else {
        // Reset for new competition
        setName('');
        setType('personal_domestic');
        setIcon(undefined);
        setIsManagerOnly(false);
      }
    }
  }, [isOpen, competitionToEdit]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    
    const competitionData: Competition = {
      id: competitionToEdit?.id || uuidv4(),
      name,
      type,
      icon,
      isManagerOnly,
    };
    onSave(competitionData);
  };

  const handleSelectIcon = (selectedIcon: string) => {
    setIcon(selectedIcon);
    setIsIconSelectorOpen(false);
  };

  const IconComponent = icon ? TROPHY_ICONS[icon] : null;

  return (
    <>
        <TrophyIconSelectorModal
            isOpen={isIconSelectorOpen}
            onClose={() => setIsIconSelectorOpen(false)}
            onSelectIcon={handleSelectIcon}
        />
        <Modal isOpen={isOpen} onClose={onClose} title={competitionToEdit ? 'Edit Award/Trophy' : 'Add New Award/Trophy'}>
        <form onSubmit={handleSave} className="space-y-4">
            <div>
            <label className="text-sm font-medium text-gray-300 block mb-1">Name</label>
            <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Premier League Player of the Year"
                required
            />
            </div>
            <div>
            <label className="text-sm font-medium text-gray-300 block mb-1">Type</label>
            <Select value={type} onChange={(e) => setType(e.target.value as HonourType)}>
                {HONOUR_TYPES.map(group => (
                <optgroup key={group.label} label={group.label}>
                    {group.options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </optgroup>
                ))}
            </Select>
            </div>
            <div>
                <label className="text-sm font-medium text-gray-300 block mb-1">Trophy Icon</label>
                <div className="flex items-center gap-4 p-2 bg-gray-700/50 rounded-md">
                    <div className="w-12 h-12 bg-gray-900/50 rounded-md flex items-center justify-center">
                        {IconComponent ? <IconComponent className="w-10 h-10" /> : <div className="text-gray-500 text-xs">None</div>}
                    </div>
                    <Button type="button" variant="secondary" onClick={() => setIsIconSelectorOpen(true)}>
                        {icon ? 'Change Icon' : 'Select Icon'}
                    </Button>
                </div>
            </div>
            <div>
                <Checkbox 
                    label="Manager Only Award"
                    checked={isManagerOnly}
                    onChange={(e) => setIsManagerOnly(e.target.checked)}
                />
                <p className="text-xs text-gray-400 mt-1">If checked, this award will only be available for managers.</p>
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" onClick={onClose} variant="secondary">Cancel</Button>
                <Button type="submit" variant="primary">Save</Button>
            </div>
        </form>
        </Modal>
    </>
  );
};

export default CompetitionModal;