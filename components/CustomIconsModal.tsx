
import React, { useState } from 'react';
import { Honour } from '../types';
import Modal from './ui/Modal';
import Button from './ui/Button';
import TrophyIconSelectorModal from './TrophyIconSelectorModal';
import { TROPHY_ICONS } from './icons/trophies';
import { CupTrophyIcon } from './icons/trophies/CupTrophyIcon';

interface CustomIconsModalProps {
  isOpen: boolean;
  onClose: () => void;
  allHonours: Honour[];
  customIcons: Record<string, string>;
  onUpdateIcon: (honourId: string, iconData: string) => void;
}

const getHonourIcon = (honour: Honour, customIcons: Record<string, string>): React.FC<any> | string => {
    const customIconData = customIcons[honour.id];
    if (customIconData) return customIconData;
    if (honour.icon && TROPHY_ICONS[honour.icon]) return TROPHY_ICONS[honour.icon];
    if (honour.id in TROPHY_ICONS) return TROPHY_ICONS[honour.id];
    return CupTrophyIcon;
};

const CustomIconsModal: React.FC<CustomIconsModalProps> = ({ isOpen, onClose, allHonours, customIcons, onUpdateIcon }) => {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [editingHonourId, setEditingHonourId] = useState<string | null>(null);

  const handleOpenSelector = (honourId: string) => {
    setEditingHonourId(honourId);
    setIsSelectorOpen(true);
  };

  const handleIconSelected = (iconData: string) => {
    if (editingHonourId) {
      onUpdateIcon(editingHonourId, iconData);
    }
    setIsSelectorOpen(false);
    setEditingHonourId(null);
  };

  return (
    <>
        <TrophyIconSelectorModal
            isOpen={isSelectorOpen}
            onClose={() => setIsSelectorOpen(false)}
            onSelectIcon={handleIconSelected}
        />
        <Modal isOpen={isOpen} onClose={onClose} title="Customise Trophy Icons" size="3xl">
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <p className="text-sm text-gray-400">
                    Here you can override the default icon for any honour. Changes are saved automatically.
                </p>
                {allHonours.map(honour => {
                    const IconOrUrl = getHonourIcon(honour, customIcons);
                    return (
                        <div key={honour.id} className="flex items-center justify-between p-2 bg-gray-700/60 rounded-md">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 flex-shrink-0 bg-gray-900/50 rounded-md flex items-center justify-center">
                                    {typeof IconOrUrl === 'string' ? (
                                        <img src={IconOrUrl} alt={honour.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <IconOrUrl className="w-7 h-7 text-gray-200" />
                                    )}
                                </div>
                                <span className="font-semibold">{honour.name}</span>
                            </div>
                            <Button variant="secondary" size="sm" onClick={() => handleOpenSelector(honour.id)}>
                                Change
                            </Button>
                        </div>
                    );
                })}
            </div>
            <div className="mt-6 flex justify-end">
                <Button onClick={onClose} variant="primary">Close</Button>
            </div>
        </Modal>
    </>
  );
};

export default CustomIconsModal;
