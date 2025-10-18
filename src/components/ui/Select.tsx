'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: string;
  className?: string;
  containerClassName?: string;
}

export default function Select({
  label,
  placeholder = 'Selecione',
  options,
  value = '',
  onChange,
  error,
  required = false,
  disabled = false,
  icon,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange?.({ target: { value: optionValue } } as React.ChangeEvent<HTMLSelectElement>);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.({ target: { value: '' } } as React.ChangeEvent<HTMLSelectElement>);
  };

  return (
    <div className="w-full" ref={selectRef}>
      {label && (
        <label className="label-md text-orange-base mb-2 block">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={`w-full text-left bg-transparent border-0 border-b border-gray-100 focus:border-orange-base focus:outline-none py-2 px-0 font-body-md transition-colors duration-200 ${
            error ? 'border-danger' : ''
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${
            selectedOption ? 'text-gray-500' : 'text-gray-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon && (
                <span className={`text-sm ${isFocused || error ? 'text-orange-base' : 'text-gray-200'}`}>
                  {icon}
                </span>
              )}
              <span>
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {selectedOption && (
                <div
                  onClick={handleClear}
                  className={`w-4 h-4 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer ${
                    isFocused || error ? 'text-orange-base' : 'text-gray-200'
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleClear(e as any);
                    }
                  }}
                >
                  <X className="w-3 h-3" />
                </div>
              )}
              
              <ChevronDown 
                className={`w-4 h-4 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                } ${
                  isFocused || error ? 'text-orange-base' : 'text-gray-200'
                }`} 
              />
            </div>
          </div>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-card shadow-dropdown border border-gray-100 z-50 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full text-left px-4 py-3 hover:bg-orange-base hover:text-white transition-colors duration-200 flex items-center justify-between ${
                  option.value === value ? 'text-orange-base bg-orange-base bg-opacity-10' : 'text-gray-500'
                }`}
              >
                <span className="font-body-md">{option.label}</span>
                {option.value === value && (
                  <Check className="w-4 h-4 text-orange-base" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {error && (
        <div className="flex items-center gap-2 mt-2">
          <div className="w-4 h-4 bg-danger rounded-full flex items-center justify-center">
            <span className="text-white text-xs">!</span>
          </div>
          <span className="body-xs text-danger">{error}</span>
        </div>
      )}
    </div>
  );
}
