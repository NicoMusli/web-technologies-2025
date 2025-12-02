import React from 'react';
import Datepicker from "react-tailwindcss-datepicker";

const DateInput = ({ label, value, onChange, placeholder, disabled, error, className, required, name, min, max }) => {

    const dateValue = {
        startDate: value || null,
        endDate: value || null
    };

    const handleValueChange = (newValue) => {
        if (onChange) {
            onChange({
                target: {
                    name: name,
                    value: newValue ? newValue.startDate : ''
                }
            });
        }
    };

    return (
        <div className={`relative ${className || ''}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className={`relative ${disabled ? 'opacity-60 pointer-events-none' : ''}`}>
                <Datepicker
                    asSingle={true}
                    useRange={false}
                    value={dateValue}
                    onChange={handleValueChange}
                    placeholder={placeholder || "Select Date"}
                    disabled={disabled}
                    minDate={min ? new Date(min) : undefined}
                    maxDate={max ? new Date(max) : undefined}
                    inputClassName={`
                        w-full px-4 py-3 rounded-xl border bg-white text-gray-700 
                        placeholder-gray-400 outline-none transition-all
                        ${error
                            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                            : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-blue-400'
                        }
                        ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    toggleClassName="absolute right-0 h-full px-3 text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                    primaryColor={"blue"}
                />
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
};

export default DateInput;
