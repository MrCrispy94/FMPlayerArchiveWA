
import React, { useRef } from 'react';
import Modal from './ui/Modal';
import { TROPHY_ICONS } from './icons/trophies';
import Button from './ui/Button';
import { UploadIcon } from './icons/UploadIcon';

interface TrophyIconSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIcon: (iconData: string) => void;
}

const TrophyIconSelectorModal: React.FC<TrophyIconSelectorModalProps> = ({ isOpen, onClose, onSelectIcon }) => {
  const uploadRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    uploadRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          onSelectIcon(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select a Trophy Icon" className="z-[60]">
        <div className="space-y-4">
            <div>
                <h4 className="text-lg font-semibold text-purple-300 mb-2">Pre-designed Icons</h4>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 p-2 bg-gray-900/50 rounded-md">
                    {Object.entries(TROPHY_ICONS).map(([name, Icon]) => (
                    <button
                        key={name}
                        onClick={() => onSelectIcon(name)}
                        className="p-2 bg-gray-700/50 rounded-lg flex items-center justify-center aspect-square transition-all duration-200 hover:bg-purple-600/50 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        title={name.replace(/([A-Z])/g, ' $1').trim()}
                    >
                        <Icon className="w-full h-full text-gray-200" />
                    </button>
                    ))}
                </div>
            </div>
             <div>
                <h4 className="text-lg font-semibold text-purple-300 mb-2">Custom Icon</h4>
                 <input
                    type="file"
                    ref={uploadRef}
                    className="hidden"
                    accept="image/svg+xml, image/png"
                    onChange={handleFileChange}
                />
                <Button onClick={handleUploadClick} variant="secondary" icon={UploadIcon} className="w-full">
                    Upload Custom Icon (SVG/PNG)
                </Button>
                <p className="text-xs text-gray-400 mt-1 text-center">For best results, use square images.</p>
             </div>
        </div>
    </Modal>
  );
};

export default TrophyIconSelectorModal;
