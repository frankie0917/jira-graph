import { observer } from 'mobx-react-lite';
import { GAP_SIZE, DOT_SIZE } from '../../constant/Background';
import { useStore } from '../../store';
import { parseNumber } from '../../utils/parseNumber';
import { DebouncedInput as Input } from '../Form/DebounceInput';
import { Disclosure } from './Disclosure/Disclosure';
import { ReactComponent as Logo } from '../../static/Logo.svg';
import { Button } from '../Button';

export const SideBar = observer(() => {
  const { FlowStore, TreeStore } = useStore();
  return (
    <div className="SideBar bg-white p-2 shadow-lg max-w-xs w-80 transition-all">
      <div className="my-5 px-4">
        <Logo />
      </div>
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
      <Button onClick={() => TreeStore.showAllTree()}>Show All Tree</Button>
    </div>
  );
});
