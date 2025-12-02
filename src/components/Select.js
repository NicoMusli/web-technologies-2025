import React, { useState, useRef, useEffect } from 'react';

const Select = ({ label, value, onChange, options, placeholder, disabled, error, className, required, name }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const selectRef = useRef(null);
    const searchInputRef = useRef(null);

    const selectedOption = options.find(opt => (opt.value || opt) === value);
    const displayValue = selectedOption ? (selectedOption.label || selectedOption.value || selectedOption) : (placeholder || 'Select option');

    const filteredOptions = options.filter(option => {
        const label = option.label || option.value || option;
        return String(label).toLowerCase().includes(searchTerm.toLowerCase());
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    const handleSelect = (optionValue) => {
        if (disabled) return;
        const event = {
            target: {
                name: name,
                value: optionValue
            }
        };
        onChange(event);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className={`relative ${className || ''}`} ref={selectRef}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`
          w-full px-4 py-3 rounded-xl border bg-white flex items-center justify-between cursor-pointer transition-all
          ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/10'}
          ${disabled ? 'bg-gray-50 opacity-60 cursor-not-allowed' : 'hover:border-blue-400'}
          ${isOpen ? 'ring-4 ring-blue-500/10 border-blue-500' : ''}
        `}
            >
                <span className={`font-medium ${!selectedOption && placeholder ? 'text-gray-400' : 'text-gray-700'}`}>
                    {displayValue}
                </span>
                <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-fade-in">
                    <div className="p-2 border-b border-gray-100 bg-gray-50">
                        <input
                            ref={searchInputRef}
                            type="text"
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none text-sm"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <div className="max-h-60 overflow-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => {
                                const optValue = option.value || option;
                                const optLabel = option.label || option.value || option;
                                const isSelected = optValue === value;

                                return (
                                    <div
                                        key={index}
                                        onClick={() => handleSelect(optValue)}
                                        className={`
                      px-4 py-3 cursor-pointer transition-colors flex items-center justify-between
                      ${isSelected ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}
                    `}
                                    >
                                        <span>{optLabel}</span>
                                        {isSelected && (
                                            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="px-4 py-3 text-gray-500 text-sm text-center">
                                No results found
                            </div>
                        )}
                    </div>
                </div>
            )}

            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};

export default Select;
