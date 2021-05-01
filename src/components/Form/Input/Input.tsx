import React from 'react';

interface Props {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export const Input = ({ placeholder, label, onChange, value }: Props) => {
  return (
    <div className="flex flex-col lg:py-0 py-4">
      <label className="lg:pt-4 text-gray-400 text-sm font-bold leading-tight tracking-normal mb-2">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-gray-600 dark:text-gray-400 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-3 text-sm border-gray-300 rounded border shadow"
        placeholder={placeholder}
      />
    </div>
  );
};
