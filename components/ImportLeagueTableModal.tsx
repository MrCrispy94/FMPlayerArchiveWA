import React, { useState, useRef } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';
import { parseLeagueTableFromHTML } from '../services/parser';
import { LeagueTableRow } from '../types';

interface ImportLeagueTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (table: LeagueTableRow[]) => void;
}

const ImportLeagueTableModal: React.FC<ImportLeagueTableModalProps> = ({ isOpen, onClose, onImport }) => {
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
      alert('Please select an HTML file to import.');
      return;
    }
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const tableData = parseLeagueTableFromHTML(content);
        
        if (tableData.length === 0) {
            alert('Could not find a valid league table in the file. Please check the file format.');
        } else {
            onImport(tableData);
            onClose();
        }

      } catch (error) {
        console.error("Failed to parse league table file:", error);
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Import League Table">
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          Upload an HTML file of a league table from Football Manager. The app will parse the table and attach it to the selected season.
        </p>
        <div>
          <label htmlFor="league-html-file" className="text-sm font-medium text-gray-300 block mb-1">
            League Table HTML File
          </label>
          <Input
            id="league-html-file"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".html,.htm"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button onClick={handleClose} variant="secondary" disabled={isProcessing}>Cancel</Button>
        <Button onClick={handleImportClick} variant="primary" disabled={isProcessing || !file}>
          {isProcessing ? 'Processing...' : 'Import Table'}
        </Button>
      </div>
    </Modal>
  );
};

export default ImportLeagueTableModal;