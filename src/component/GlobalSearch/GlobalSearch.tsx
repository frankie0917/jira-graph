import React, { useCallback, useEffect, useState } from 'react';
import useKeyboardShortcut from 'use-keyboard-shortcut';
import { DebouncedInput } from '../Form/DebounceInput';
import styles from './GlobalSearch.module.scss';

export const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleKeybind = useCallback((keys) => {
    setIsOpen((prev) => !prev);
  }, []);

  useKeyboardShortcut(['q', 's'], handleKeybind, {
    overrideSystem: true,
  });

  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    console.log('key', keyword);
  }, [keyword]);

  if (!isOpen) return null;
  return (
    <div
      className={
        styles.searchWrapper + ' border border-indigo-500 rounded-md shadow-md'
      }
    >
      <DebouncedInput
        value={keyword}
        onChange={(val) => {
          setKeyword(val);
        }}
        delay={500}
        label="Global search"
      />
    </div>
  );
};
