
import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, ...props }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-200">
      <input
        type="checkbox"
        className="w-4 h-4 bg-gray-700 border-gray-600 rounded text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-800"
        {...props}
      />
      {label}
    </label>
  );
};

export default Checkbox;
