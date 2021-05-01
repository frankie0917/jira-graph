import { observer } from 'mobx-react-lite';
import React from 'react';
import { GAP_SIZE, DOT_SIZE } from '../../constant/Background';
import { useFlowStore } from '../../store';
import { parseNumber } from '../../utils/parseNumber';
import { DebouncedInput as Input } from '../Form/DebounceInput';
import { Disclosure } from './Disclosure/Disclosure';

export const SideBar = observer(() => {
  const FlowStore = useFlowStore();

  return (
    <div className="SideBar bg-white p-2 shadow-lg max-w-xs w-80">
      <Disclosure title="Background">
        <Input
          label="Dot size"
          value={FlowStore.dotSize + ''}
          onChange={(val) => FlowStore.setDotSize(parseNumber(val, DOT_SIZE))}
        />
        <Input
          label="Dot color (HEX)"
          value={FlowStore.dotColor}
          onChange={(val) => FlowStore.setDotColor(val)}
        />
        <Input
          label="Gap size"
          value={FlowStore.gapSize + ''}
          onChange={(val) => FlowStore.setGapSize(parseNumber(val, GAP_SIZE))}
        />
      </Disclosure>
    </div>
  );
});
