
import React, { useState, useRef } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';

interface AddPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBlank: () => void;
  onCreateFromHTML: (file: File) => void;
}

const AddPlayerModal: React.FC<AddPlayerModalProps> = ({ isOpen, onClose, onCreateBlank, onCreateFromHTML }) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleCreate = () => {
    if (file) {
      onCreateFromHTML(file);
    }
  };
  
  // Reset file on close
  const handleClose = () => {
      setFile(null);
      if(fileInputRef.current) fileInputRef.current.value = '';
      onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Player">
      <div className="space-y-6">
        {/* Option 1: Create Blank */}
        <div>
          <h3 className="text-lg font-semibold text-gray-200">Start from Scratch</h3>
          <p className="text-sm text-gray-400 mt-1 mb-3">Create a new blank player profile and fill in the details manually.</p>
          <Button onClick={onCreateBlank} variant="primary" className="w-full">
            Create Blank Player
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <hr className="flex-grow border-gray-600" />
          <span className="text-gray-400 text-sm">OR</span>
          <hr className="flex-grow border-gray-600" />
        </div>

        {/* Option 2: Create from HTML */}
        <div>
          <h3 className="text-lg font-semibold text-gray-200">Create from FM Export</h3>
          <p className="text-sm text-gray-400 mt-1 mb-3">
            Upload an HTML file exported from a player's profile in Football Manager to automatically populate their name and attributes.
          </p>
          <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 space-y-3">
            <div>
              <label htmlFor="player-html-file" className="text-sm font-medium text-gray-300 block mb-1">
                Player HTML File
              </label>
              <Input
                id="player-html-file"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".html,.htm"
              />
            </div>
            <Button onClick={handleCreate} variant="secondary" className="w-full" disabled={!file}>
              Create Player from File
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddPlayerModal;
