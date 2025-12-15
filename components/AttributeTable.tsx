

import React, { useMemo } from 'react';
import type { Attributes, AttributeSnapshot } from '../types';
import { outfieldAttributeGroups, goalkeeperAttributeGroups } from '../constants';
import { UpArrowIcon } from './icons/UpArrowIcon';
import { DownArrowIcon } from './icons/DownArrowIcon';

interface AttributeTableProps {
  attributes: Attributes;
  snapshots?: AttributeSnapshot[];
  isEditing: boolean;
  onChange: (category: keyof Attributes, attribute: keyof Attributes, value: number) => void;
  primaryPosition: string;
}

const toCamelCase = (str: string): keyof Attributes => {
    return str
        .replace(/\s*\(.*\)\s*$/, '') // Remove trailing parenthetical
        .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
            if (+match === 0) return "";
            return index === 0 ? match.toLowerCase() : match.toUpperCase();
        }).replace(/\s+/g, '') as keyof Attributes;
};

const getAttributeColor = (value: number): string => {
    if (value >= 16) return 'bg-green-600/80 text-white';
    if (value >= 11) return 'bg-green-800/70 text-green-200';
    return 'bg-gray-700/60 text-gray-300';
};

const AttributeRow: React.FC<{
  label: string;
  value: number;
  previousValue?: number;
  isEditing: boolean;
  onChange: (value: number) => void;
}> = ({ label, value, previousValue, isEditing, onChange }) => {
  const diff = value - (previousValue ?? value);
  const hasIncreased = diff > 0;
  const hasDecreased = diff < 0;
  const isLargeIncrease = diff >= 3;
  const isLargeDecrease = diff <= -3;

  return (
    <div className="flex justify-between items-center p-2">
      <span className="text-sm text-gray-300">{label}</span>
      {isEditing ? (
        <input
          type="number"
          min="1"
          max="20"
          value={value || 1}
          onChange={(e) => onChange(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
          className="w-16 text-center bg-gray-900 border border-gray-600 rounded-md p-1 font-bold"
        />
      ) : (
        <div className="flex items-center gap-2">
           <div className="w-4 h-6 flex flex-col items-center justify-center">
                {hasIncreased && (
                    <div className="flex flex-col items-center" title={`Increased by ${diff}`}>
                        <UpArrowIcon className="w-3 h-3 text-green-400" />
                        {isLargeIncrease && <UpArrowIcon className="w-3 h-3 text-green-400 -mt-1.5" />}
                    </div>
                )}
                {hasDecreased && (
                    <div className="flex flex-col items-center" title={`Decreased by ${Math.abs(diff)}`}>
                        <DownArrowIcon className="w-3 h-3 text-red-400" />
                        {isLargeDecrease && <DownArrowIcon className="w-3 h-3 text-red-400 -mt-1.5" />}
                    </div>
                )}
            </div>
          <span className={`w-10 text-center font-bold text-sm rounded-md px-2 py-1 ${getAttributeColor(value || 1)}`}>
            {value || 1}
          </span>
        </div>
      )}
    </div>
  );
};

const AttributeTable: React.FC<AttributeTableProps> = ({ attributes, snapshots, isEditing, onChange, primaryPosition }) => {
  const isGk = primaryPosition === 'GK';
  const attributeGroups = isGk ? goalkeeperAttributeGroups : outfieldAttributeGroups;
  
  const sortedSnapshots = useMemo(() => {
    if (!snapshots) return [];
    return [...snapshots].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [snapshots]);
  
  const currentSnapshotIndex = useMemo(() => {
    if (!sortedSnapshots) return -1;
    const currentAttrsString = JSON.stringify(attributes);
    return sortedSnapshots.findIndex(s => JSON.stringify(s.attributes) === currentAttrsString);
  }, [sortedSnapshots, attributes]);

  const previousSnapshot = useMemo(() => {
    if (!sortedSnapshots || sortedSnapshots.length < 2) return null;
    
    // If current attributes don't match any snapshot (i.e. being edited), compare to the latest one.
    if (currentSnapshotIndex === -1 && sortedSnapshots.length > 0) {
        return sortedSnapshots[sortedSnapshots.length - 1];
    }
    // If current attributes are a snapshot, compare to the one before it.
    if (currentSnapshotIndex > 0) {
        return sortedSnapshots[currentSnapshotIndex - 1];
    }
    
    return null;
  }, [sortedSnapshots, currentSnapshotIndex]);

  const renderGroups = (groups: Record<string, string[]>) => {
    return Object.entries(groups).map(([groupName, attrList]) => (
        <div key={groupName} className="space-y-1">
          <h4 className="font-bold text-purple-400 p-2">{groupName}</h4>
          <div className="bg-gray-800/50 rounded-md">
            {attrList.map(attr => {
              const camelCaseAttr = toCamelCase(attr);
              const previousValue = previousSnapshot ? previousSnapshot.attributes[camelCaseAttr] : undefined;
              return (
                <AttributeRow
                  key={attr}
                  label={attr}
                  value={attributes[camelCaseAttr]}
                  previousValue={previousValue}
                  isEditing={isEditing}
                  onChange={(value) => onChange(camelCaseAttr, camelCaseAttr, value)}
                />
              );
            })}
          </div>
        </div>
      ))
  }

  if (isGk) {
    const { Goalkeeping, Mental, Physical } = goalkeeperAttributeGroups;
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-900/50 rounded-lg p-4">
            {renderGroups({ Goalkeeping })}
            <div className="space-y-4">
                {renderGroups({ Mental, Physical })}
            </div>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-900/50 rounded-lg p-4">
      {renderGroups(outfieldAttributeGroups)}
    </div>
  );
};

export default AttributeTable;
