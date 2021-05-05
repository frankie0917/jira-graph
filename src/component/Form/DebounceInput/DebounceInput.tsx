import { isUndefined } from 'lodash';
import React, { forwardRef, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from '../Input';

interface Props {
  label?: string;
  placeholder?: string;
  value: string;
  defaultValue?: string;
  delay?: number;
  onChange: (value: string) => void;
}

export const DebouncedInput = forwardRef<HTMLInputElement, Props>(
  ({ value, onChange, defaultValue, delay = 1000, ...rest }, ref) => {
    const [val, setVal] = useState(defaultValue ?? '');
    const debouncedOnChange = useDebouncedCallback(onChange, delay);

    useEffect(() => {
      if (val !== defaultValue && !isUndefined(defaultValue)) {
        setVal(defaultValue);
      }
    }, [defaultValue]);
    return (
      <Input
        ref={ref}
        value={val}
        onChange={(val) => {
          debouncedOnChange(val);
          setVal(val);
        }}
        {...rest}
      />
    );
  },
);
