
import React from 'react';
import type { ManagerAttributes } from '../types';
import { managerAttributeGroups } from '../constants';

interface ManagerAttributeTableProps {
  attributes: ManagerAttributes;
  isEditing: boolean;
  onChange: (category: keyof ManagerAttributes, attribute: keyof ManagerAttributes, value: number) => void;
}

const toCamelCase = (str: string): keyof ManagerAttributes => {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
        if (+match === 0) return "";
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
    }).replace(/\s+/g, '') as keyof ManagerAttributes;
};

const getAttributeColor = (value: number): string => {
    if (value >= 16) return 'bg-green-600/80 text-white';
    if (value >= 11) return 'bg-green-800/70 text-green-200';
    return 'bg-gray-700/60 text-gray-300';
};

const AttributeRow: React.FC<{
  label: string;
  value: number;
  isEditing: boolean;
  onChange: (value: number) => void;
}> = ({ label, value, isEditing, onChange }) => {
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
        <span className={`w-10 text-center font-bold text-sm rounded-md px-2 py-1 ${getAttributeColor(value || 1)}`}>
          {value || 1}
        </span>
      )}
    </div>
  );
};

const ManagerAttributeTable: React.FC<ManagerAttributeTableProps> = ({ attributes, isEditing, onChange }) => {

  const renderGroups = (groups: Record<string, string[]>) => {
    return Object.entries(groups).map(([groupName, attrList]) => (
        <div key={groupName} className="space-y-1">
          <h4 className="font-bold text-purple-400 p-2">{groupName}</h4>
          <div className="bg-gray-800/50 rounded-md">
            {attrList.map(attr => {
              const camelCaseAttr = toCamelCase(attr);
              return (
                <AttributeRow
                  key={attr}
                  label={attr}
                  value={attributes[camelCaseAttr]}
                  isEditing={isEditing}
                  onChange={(value) => onChange(camelCaseAttr, camelCaseAttr, value)}
                />
              );
            })}
          </div>
        </div>
      ))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-900/50 rounded-lg p-4">
      {renderGroups(managerAttributeGroups)}
    </div>
  );
};

export default ManagerAttributeTable;
