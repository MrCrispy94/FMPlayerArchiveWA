
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import Input from './Input';

interface ComboboxProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  onAddNew: (value: string) => void;
  placeholder?: string;
}

const Combobox: React.FC<ComboboxProps> = ({ options, value, onChange, onAddNew, placeholder }) => {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const calculatePosition = useCallback(() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom,
        left: rect.left,
        width: rect.width,
      });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      calculatePosition();
      const handleClose = () => setIsOpen(false);
      window.addEventListener('resize', handleClose);
      document.addEventListener('scroll', handleClose, true);
      return () => {
        window.removeEventListener('resize', handleClose);
        document.removeEventListener('scroll', handleClose, true);
      };
    }
  }, [isOpen, calculatePosition]);

  const filteredOptions = useMemo(() => {
    if (!inputValue) return options;
    return options.filter(option =>
      option.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue, options]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (!isOpen) setIsOpen(true);
  };
  
  const handleBlur = () => {
    // A small delay allows click on dropdown to register before the input blurs and closes it.
    setTimeout(() => {
      setIsOpen(false);
      // When blurring, if the text is not a valid option, trigger 'add new'
      if (inputValue && !options.some(opt => opt.toLowerCase() === inputValue.toLowerCase())) {
        onAddNew(inputValue);
      }
    }, 150);
  };

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setInputValue(optionValue);
    setIsOpen(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredOptions.length === 1) {
        handleOptionClick(filteredOptions[0]);
      } else if (inputValue && !options.some(opt => opt.toLowerCase() === inputValue.toLowerCase())) {
        onAddNew(inputValue);
      }
      setIsOpen(false);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const DropdownList = () => (
    <ul
      className="absolute z-[100] mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto"
      style={{
        position: 'fixed',
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        width: `${dropdownPosition.width}px`,
      }}
    >
      {filteredOptions.length > 0 ? (
        filteredOptions.map(option => (
          <li
            key={option}
            onClick={() => handleOptionClick(option)}
            className="px-3 py-2 text-sm text-gray-200 cursor-pointer hover:bg-purple-600/50"
          >
            {option}
          </li>
        ))
      ) : (
        <li className="px-3 py-2 text-sm text-gray-400">No clubs found.</li>
      )}
    </ul>
  );

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
      />
      {isOpen && ReactDOM.createPortal(<DropdownList />, document.body)}
    </div>
  );
};

export default Combobox;
