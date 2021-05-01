import React, { PropsWithChildren } from 'react';
import { Disclosure as DisclosureUI } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';

interface Props {
  title: string;
}

export const Disclosure = ({ title, children }: PropsWithChildren<Props>) => {
  return (
    <div className="w-full max-w-md rounded-2xl mt-2">
      <DisclosureUI>
        {({ open }) => (
          <>
            <DisclosureUI.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-purple-900 bg-purple-100 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
              <span>{title}</span>
              <ChevronUpIcon
                className={`${
                  open ? 'transform rotate-180' : ''
                } w-5 h-5 text-purple-500`}
              />
            </DisclosureUI.Button>
            <DisclosureUI.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
              {children}
            </DisclosureUI.Panel>
          </>
        )}
      </DisclosureUI>
    </div>
  );
};
