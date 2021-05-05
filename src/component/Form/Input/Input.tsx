import React, { forwardRef } from 'react';
import styles from './Input.module.scss';

interface Props {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ placeholder, label, onChange, value }, ref) => {
    return (
      <div className={styles.inputGroup + ' flex flex-col w-full'}>
        <label className="text-gray-600 text-sm font-bold leading-tight tracking-normal mb-2">
          {label}
        </label>
        <input
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-gray-600 dark:text-gray-400 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border shadow"
          placeholder={placeholder}
        />
      </div>
    );
  },
);
