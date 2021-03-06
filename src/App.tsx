import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { RootStoreContextProvider, useTreeStore } from './store/RootStore';
// import { data } from './mockData/simpleData';
import data from './mockData/result.json';
import { SideBar } from './component/SideBar';
import { ReactFlowContainer } from './component/ReactFlowContainer';
import { ReactFlowProvider } from 'react-flow-renderer';

const App = observer(() => {
  const TreeStore = useTreeStore();
  useEffect(() => {
    TreeStore.init(data as any);
  }, [TreeStore]);

  return (
    <ReactFlowProvider>
      <RootStoreContextProvider>
        <div className="App flex w-screen h-screen">
          <SideBar />
          <ReactFlowContainer />
        </div>
      </RootStoreContextProvider>
    </ReactFlowProvider>
  );
});

export default App;
