import React, { useState, useRef } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';
import { parseManagerSeasonResultsFromText } from '../services/parser';

interface ImportManagerSeasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (stats: { wins: number; losses: number; draws: number }) => void;
}

const ImportManagerSeasonModal: React.FC<ImportManagerSeasonModalProps> = ({ isOpen, onClose, onImport }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleImportClick = () => {
    if (!file) {
      alert('Please select a text file to import.');
      return;
    }
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const stats = parseManagerSeasonResultsFromText(content);
        
        if (stats.wins === 0 && stats.losses === 0 && stats.draws === 0) {
            alert('Could not find any match results in the file. Please check the file format.');
        } else {
            onImport(stats);
            onClose();
        }

      } catch (error) {
        console.error("Failed to parse season file:", error);
        alert("An error occurred while parsing the file.");
      } finally {
        setIsProcessing(false);
        setFile(null);
        if(fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };
  
  const handleClose = () => {
      setFile(null);
      if(fileInputRef.current) fileInputRef.current.value = '';
      onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Import Season Results">
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          Upload a text file (.txt) of a season's fixture list. This is obtained by using the 'Print' function (Ctrl+P) on the Fixtures view in Football Manager and saving it as text. The app will calculate the wins, losses, and draws and update the selected season.
        </p>
        <div>
          <label htmlFor="season-html-file" className="text-sm font-medium text-gray-300 block mb-1">
            Fixture List Text File
          </label>
          <Input
            id="season-html-file"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".txt"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button onClick={handleClose} variant="secondary" disabled={isProcessing}>Cancel</Button>
        <Button onClick={handleImportClick} variant="primary" disabled={isProcessing || !file}>
          {isProcessing ? 'Processing...' : 'Import Results'}
        </Button>
      </div>
    </Modal>
  );
};

export default ImportManagerSeasonModal;
