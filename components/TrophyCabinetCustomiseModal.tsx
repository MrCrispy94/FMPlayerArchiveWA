
import React, { useState, useEffect } from 'react';
import { TrophyCabinetSettings } from '../types';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import { TROPHY_CABINET_TEXTURES } from '../constants';
import { PremierLeagueTrophyIcon } from './icons/trophies/PremierLeagueTrophyIcon';

interface TrophyCabinetCustomiseModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TrophyCabinetSettings;
  onSave: (settings: TrophyCabinetSettings) => void;
}

const LivePreview: React.FC<{ settings: TrophyCabinetSettings }> = ({ settings }) => {
  const backgroundStyle: React.CSSProperties = settings.backgroundType === 'texture'
    ? {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${settings.backgroundValue})`,
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat',
      }
    : {
        backgroundColor: settings.backgroundValue,
      };

  return (
    <div 
      className="w-full h-64 rounded-lg p-4 flex flex-col justify-center items-center border border-gray-700 transition-all duration-300"
      style={backgroundStyle}
    >
      <div className="relative w-full">
        <h3 
          className="text-center font-bold uppercase tracking-widest mb-2" 
          style={{ color: settings.shelfTitleColor, textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
        >
          Sample Shelf
        </h3>
        <div className="flex justify-center items-end gap-x-8 p-4 min-h-[100px]">
          <div className="flex flex-col items-center">
            <PremierLeagueTrophyIcon className="w-16 h-16 drop-shadow-lg" />
            <div className="mt-2 text-center" style={{ color: settings.textColor }}>
              <p className="font-bold text-sm">Best Trophy</p>
              <p className="text-xs opacity-80">2024/25</p>
            </div>
          </div>
        </div>
        <div 
          className="absolute bottom-0 left-0 w-full h-4 rounded-md shadow-inner" 
          style={{ 
            transform: 'perspective(50px) rotateX(10deg)', 
            backgroundColor: settings.shelfColor 
          }} 
        />
        <div className="absolute bottom-0 left-0 w-full h-2 bg-black/40" />
      </div>
    </div>
  );
};

const TrophyCabinetCustomiseModal: React.FC<TrophyCabinetCustomiseModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [currentSettings, setCurrentSettings] = useState<TrophyCabinetSettings>(settings);

  useEffect(() => {
    if (isOpen) {
      setCurrentSettings(settings);
    }
  }, [isOpen, settings]);

  const handleSettingChange = <K extends keyof TrophyCabinetSettings>(key: K, value: TrophyCabinetSettings[K]) => {
    setCurrentSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSave = () => {
    onSave(currentSettings);
    onClose();
  };

  const handleBackgroundTypeChange = (type: 'texture' | 'color') => {
    const isUrl = (val: string) => val.startsWith('http');
    const isHex = (val: string) => val.startsWith('#');

    if (type === 'texture' && !isUrl(currentSettings.backgroundValue)) {
      // Switching to texture, set a default texture if current value is a color
      handleSettingChange('backgroundValue', TROPHY_CABINET_TEXTURES['Dark Wood']);
    } else if (type === 'color' && !isHex(currentSettings.backgroundValue)) {
      // Switching to color, set a default color if current value is a texture URL
      handleSettingChange('backgroundValue', '#2d3748'); // gray-800
    }
    handleSettingChange('backgroundType', type);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Customise Trophy Cabinet" size="3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Preview */}
        <div className="space-y-2">
           <h3 className="text-lg font-semibold text-gray-200">Live Preview</h3>
           <LivePreview settings={currentSettings} />
        </div>

        {/* Right: Controls */}
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200">Settings</h3>
            <div>
                <label className="text-sm font-medium text-gray-300 block mb-1">Background Style</label>
                <div className="flex gap-4 p-2 bg-gray-700/50 rounded-md">
                    <label className="flex items-center gap-2 cursor-pointer flex-1 justify-center p-1 rounded-md transition-colors" style={{backgroundColor: currentSettings.backgroundType === 'texture' ? '#581c87' : 'transparent'}}>
                        <input type="radio" name="bg-type" value="texture" checked={currentSettings.backgroundType === 'texture'} onChange={() => handleBackgroundTypeChange('texture')} className="hidden" />
                        Texture
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer flex-1 justify-center p-1 rounded-md transition-colors" style={{backgroundColor: currentSettings.backgroundType === 'color' ? '#581c87' : 'transparent'}}>
                        <input type="radio" name="bg-type" value="color" checked={currentSettings.backgroundType === 'color'} onChange={() => handleBackgroundTypeChange('color')} className="hidden"/>
                        Matte Paint
                    </label>
                </div>
            </div>

            {currentSettings.backgroundType === 'texture' ? (
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-1">Texture</label>
                <Select
                  value={currentSettings.backgroundValue}
                  onChange={e => handleSettingChange('backgroundValue', e.target.value)}
                >
                  {Object.entries(TROPHY_CABINET_TEXTURES).map(([name, url]) => (
                    <option key={name} value={url}>{name}</option>
                  ))}
                </Select>
              </div>
            ) : (
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-1">Paint Color</label>
                <Input
                  type="color"
                  value={currentSettings.backgroundValue}
                  onChange={e => handleSettingChange('backgroundValue', e.target.value)}
                  className="w-full h-10 p-1"
                />
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-300 block mb-1">Shelf Color</label>
                    <Input 
                        type="color" 
                        value={currentSettings.shelfColor} 
                        onChange={e => handleSettingChange('shelfColor', e.target.value)}
                        className="w-full h-10 p-1"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-300 block mb-1">Title Color</label>
                    <Input 
                        type="color" 
                        value={currentSettings.shelfTitleColor} 
                        onChange={e => handleSettingChange('shelfTitleColor', e.target.value)}
                        className="w-full h-10 p-1"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-300 block mb-1">Text Color</label>
                    <Input 
                        type="color" 
                        value={currentSettings.textColor} 
                        onChange={e => handleSettingChange('textColor', e.target.value)}
                        className="w-full h-10 p-1"
                    />
                </div>
            </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" onClick={onClose} variant="secondary">Cancel</Button>
        <Button type="button" onClick={handleSave} variant="primary">Save Changes</Button>
      </div>
    </Modal>
  );
};

export default TrophyCabinetCustomiseModal;