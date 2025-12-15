import React, { useState, useRef, useEffect } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';
import { parseConfigXml } from '../services/parser';

interface FacepackSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  facesPath: string;
  onUpdateFacesPath: (path: string) => void;
  facepackConfig: Record<string, string>;
  onUpdateFacepackConfig: (config: Record<string, string>) => void;
}

const FacepackSetupModal: React.FC<FacepackSetupModalProps> = ({
  isOpen,
  onClose,
  facesPath,
  onUpdateFacesPath,
  facepackConfig,
  onUpdateFacepackConfig,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tempPath, setTempPath] = useState(facesPath);
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setTempPath(facesPath);
      setFeedback('');
    }
  }, [isOpen, facesPath]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const filePath = (file as any).path;

    if (filePath && typeof filePath === 'string') {
      const separator = filePath.includes('\\') ? '\\' : '/';
      const dirPath = filePath.substring(0, filePath.lastIndexOf(separator));
      const normalizedPath = dirPath.replace(/\\/g, '/');
      const finalPath = `file:///${normalizedPath}`;
      setTempPath(finalPath);
      onUpdateFacesPath(finalPath); // Update immediately for better UX
    } else {
      setFeedback("Could not auto-detect directory path. Please set it manually.");
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const xmlString = event.target?.result as string;
        const config = parseConfigXml(xmlString);
        onUpdateFacepackConfig(config);
        const mappingCount = Object.keys(config).length;
        
        let successMessage = `Successfully parsed ${mappingCount} mappings.`;
        if (filePath && typeof filePath === 'string') {
            successMessage += ` Directory path has been auto-detected.`;
        }
        setFeedback(successMessage);

      } catch (error) {
        console.error("Failed to parse config.xml", error);
        setFeedback("Error: Could not parse the config.xml file. Please ensure it is a valid XML file.");
      }
    };
    reader.readAsText(file);

    if (e.target) e.target.value = '';
  };
  
  const handleSavePath = () => {
      onUpdateFacesPath(tempPath);
      setFeedback('Path updated manually.');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Setup Facepack Integration">
      <div className="space-y-4">
        <div className="prose-like text-gray-300 text-sm space-y-2">
            <p>This process links the app to your Football Manager facepack graphics folder.</p>
            <ol className="list-decimal list-inside space-y-1">
                <li>Click the button below and select the <kbd>config.xml</kbd> file from inside your facepack folder.</li>
                <li>The app will attempt to auto-detect the folder path and parse all the player ID mappings from the file.</li>
                <li>Verify the path is correct. If not, you can edit it manually.</li>
            </ol>
            <p>This works best when running the app on your desktop. Web browsers have limited access to local file paths.</p>
        </div>

        <div className="p-4 bg-gray-900/50 rounded-lg space-y-4">
            <Button onClick={() => fileInputRef.current?.click()} variant="primary" className="w-full">
                Select config.xml File
            </Button>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".xml"
                onChange={handleFileSelect}
            />

            <div>
                <label className="text-sm font-medium text-gray-300 block mb-1">Graphics Data Pathway</label>
                <div className="flex items-center gap-2">
                    <Input
                        type="text"
                        value={tempPath}
                        onChange={e => setTempPath(e.target.value)}
                        placeholder="e.g. file:///C:/Users/.../graphics/faces"
                    />
                    <Button onClick={handleSavePath} variant="secondary" size="sm">Save Path</Button>
                </div>
            </div>
             <div>
                <p className="text-sm text-gray-300">
                    Loaded Mappings: <span className="font-bold text-green-400">{Object.keys(facepackConfig).length}</span>
                </p>
            </div>
            {feedback && (
                <p className="text-sm text-purple-300 text-center p-2 bg-purple-900/30 rounded-md">{feedback}</p>
            )}
        </div>

        <div className="mt-6 flex justify-end">
            <Button onClick={onClose} variant="primary">Close</Button>
        </div>
      </div>
    </Modal>
  );
};

export default FacepackSetupModal;
