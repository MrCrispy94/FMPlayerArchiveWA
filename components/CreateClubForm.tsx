import React, { useState, useMemo, useEffect } from 'react';
import { Club } from '../types';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import Kit from './Kit';
import { v4 as uuidv4 } from 'uuid';


interface CreateClubFormProps {
  onSave: (club: Club) => void;
  onCancel?: () => void;
  allClubs: Record<string, Club>;
  initialName?: string;
}

const CreateClubForm: React.FC<CreateClubFormProps> = ({ onSave, onCancel, allClubs, initialName = '' }) => {
    const [clubName, setClubName] = useState(initialName);
    const [primaryColor, setPrimaryColor] = useState('#ffffff');
    const [secondaryColor, setSecondaryColor] = useState('#000000');
    const [kitPattern, setKitPattern] = useState<Club['pattern']>('plain');

    useEffect(() => {
        setClubName(initialName);
    }, [initialName]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!clubName) return;
        if (allClubs[clubName] && clubName !== initialName) {
            alert(`A club named "${clubName}" already exists.`);
            return;
        }

        onSave({
            id: uuidv4(),
            name: clubName,
            kitColors: { primary: primaryColor, secondary: secondaryColor },
            pattern: kitPattern,
        });
        // Reset form
        setClubName('');
        setPrimaryColor('#ffffff');
        setSecondaryColor('#000000');
        setKitPattern('plain');
    }
    
    const previewClub: Club = useMemo(() => ({
        id: 'preview',
        name: clubName || 'Preview',
        kitColors: { primary: primaryColor, secondary: secondaryColor },
        pattern: kitPattern,
    }), [clubName, primaryColor, secondaryColor, kitPattern]);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-sm font-medium text-gray-300 block mb-1">Club Name</label>
                <Input type="text" value={clubName} onChange={e => setClubName(e.target.value)} placeholder="e.g. Wrexham AFC" required/>
            </div>
            
            <div className="p-4 border border-gray-700 rounded-md">
                <h4 className="text-lg font-semibold mb-3">Kit Designer</h4>
                <div className="flex justify-center my-4">
                     <Kit club={previewClub} size="lg" allClubs={allClubs} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                        <label className="text-sm font-medium text-gray-300 block mb-1">Primary</label>
                        <Input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-full h-10 p-1"/>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-300 block mb-1">Secondary</label>
                        <Input type="color" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} className="w-full h-10 p-1"/>
                    </div>
                </div>
                <div className="mt-4">
                     <label className="text-sm font-medium text-gray-300 block mb-1">Pattern</label>
                     <Select value={kitPattern} onChange={e => setKitPattern(e.target.value as Club['pattern'])}>
                        <option value="plain">Plain</option>
                        <option value="stripes">Stripes</option>
                        <option value="hoops">Hoops</option>
                     </Select>
                </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
                {onCancel && <Button type="button" onClick={onCancel} variant="secondary">Cancel</Button>}
                <Button type="submit" variant="primary" className="w-full">{initialName ? 'Save Club' : 'Add Club'}</Button>
            </div>
        </form>
    );
}

export default CreateClubForm;