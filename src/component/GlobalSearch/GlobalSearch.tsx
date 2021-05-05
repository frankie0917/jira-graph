import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useZoomPanHelper } from 'react-flow-renderer';
import useKeyboardShortcut from 'use-keyboard-shortcut';
import { useTreeStore } from '../../store';
import { findStringOverlap } from '../../utils/findStringOverLap';
import { DebouncedInput } from '../Form/DebounceInput';
import { NodeItem } from '../NodeItem';
import styles from './GlobalSearch.module.scss';

export const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const TreeStore = useTreeStore();
  const { transform } = useZoomPanHelper();

  const [results, setResults] = useState<string[]>([]);
  const onItemClick = (pos: { x: number; y: number }) => {
    transform({ x: -pos.x + 50, y: -pos.y + 50, zoom: 1 });
    setKeyword('');
    setIsOpen(false);
  };

  const handleKeybind = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useKeyboardShortcut(['Control', 'Shift', 's'], handleKeybind, {
    overrideSystem: true,
  });

  useEffect(() => {
    if (!isOpen) {
      setResults([]);
      setKeyword('');
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    if (keyword.length === 0) {
      setResults([]);
      return;
    }
    const res: { key: string; order: number }[] = [];
    Object.entries(TreeStore.treeMap.children).forEach(([key, tree]) => {
      const { assignees, title, status, issue_type } = tree.data!;
      const targetString = [key, assignees, title, status, issue_type].join();
      const overlapString = findStringOverlap(targetString, keyword);
      const overlapLength = overlapString.length;
      if (overlapLength > 0) {
        res.push({ key, order: overlapLength });
      }
    });

    setResults(res.sort((a, b) => b.order - a.order).map(({ key }) => key));
  }, [keyword, TreeStore.treeMap.children]);

  return (
    <div
      className={
        styles.searchWrapper + ' border border-indigo-500 rounded-md shadow-md'
      }
      data-is-open={isOpen}
    >
      <DebouncedInput
        ref={inputRef}
        value={keyword}
        onChange={setKeyword}
        delay={1000}
        label="Global search"
      />
      {results.length > 0 && (
        <div className={styles.listWrapper + ' bg-white p-2  mt-2'}>
          {results.map((key) => {
            const props = TreeStore.treeMap.getChild(key);
            return (
              <div
                key={key}
                onClick={() => onItemClick(props.position)}
                style={{ cursor: 'pointer' }}
              >
                <NodeItem {...props} listMode />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
