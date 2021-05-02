import React, { PropsWithChildren } from 'react';

interface Props extends React.HTMLAttributes<HTMLButtonElement> {}

export const Button = ({ children, ...rest }: PropsWithChildren<Props>) => {
  return (
    <button
      className="text-xs mt-3 rounded px-3 py-2 text-indigo-700 bg-indigo-100 hover:bg-indigo-200 flex items-center focus:outline-none"
      {...rest}
    >
      {children}
    </button>
  );
};
