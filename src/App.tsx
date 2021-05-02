import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { RootStoreContextProvider, useTreeStore } from './store/RootStore';
// import { data } from './mockData/simpleData';
import data from './mockData/result.json';
import { SideBar } from './components/SideBar';
import { ReactFlowContainer } from './components/ReactFlowContainer';

const App = observer(() => {
  const TreeStore = useTreeStore();
  useEffect(() => {
    TreeStore.init(data as any);
  }, []);
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
