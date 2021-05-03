import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { RootStoreContextProvider, useTreeStore } from './store/RootStore';
// import { data } from './mockData/simpleData';
import data from './mockData/result.json';
import { SideBar } from './component/SideBar';
import { ReactFlowContainer } from './component/ReactFlowContainer';

import useKeyboardShortcut from 'use-keyboard-shortcut';
const App = observer(() => {
  const TreeStore = useTreeStore();
  useEffect(() => {
    TreeStore.init(data as any);
  }, []);

  const handleSearch = () => {
    console.log('search');
  };
  const [showImage, setShowImage] = useState(false);
  const [switchColor, setSwitchColor] = useState(false);
  const keys = ['Shift', 'E'];
  const keysAlternate = ['Meta', 'C'];

  const handleKeyboardShortcut = useCallback(
    (keys) => {
      setShowImage((currentShowImage) => !currentShowImage);
    },
    [setShowImage],
  );

  const handleKeyboardShortcutColor = useCallback(
    (keys) => {
      setSwitchColor((currentSwitchColor) => !currentSwitchColor);
    },
    [setSwitchColor],
  );

  useKeyboardShortcut(['P'], handleKeyboardShortcut);
  useKeyboardShortcut(keys, handleKeyboardShortcut);
  useKeyboardShortcut(keysAlternate, handleKeyboardShortcutColor, {
    overrideSystem: true,
  });
  return (
    <RootStoreContextProvider>
      <div className="App flex w-screen h-screen">
        <SideBar />
        <ReactFlowContainer />
      </div>
    </RootStoreContextProvider>
  );
});

export default App;
