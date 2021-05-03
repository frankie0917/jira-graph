import React, { memo } from 'react';

interface Props {
  keys: string[];
  desc: string;
}

export const Keybind = memo(({ keys, desc }: Props) => {
  return (
    <div className="flex items-center">
      {keys.map((key, i) => (
        <>
          <div className="bg-indigo-100 align-text-top rounded-sm flex justify-center items-center h-5 w-5 mr-1">
            {key}
          </div>
          {i !== keys.length - 1 && <div className="mr-1">+</div>}
        </>
      ))}
      :<div className="ml-2">{desc}</div>
    </div>
  );
});
