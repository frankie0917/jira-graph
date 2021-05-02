import React, { createContext, PropsWithChildren, useContext } from 'react';
import { FlowStore } from './FlowStore';
import { TreeStore } from './TreeStore';

export type RootStoreContextT = {
  TreeStore: TreeStore;
  FlowStore: FlowStore;
};

const defaultValue: RootStoreContextT = {
  TreeStore: new TreeStore(),
  FlowStore: new FlowStore(),
};

export const RootStoreContext = createContext<RootStoreContextT>(defaultValue);

export const RootStoreContextProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => (
  <RootStoreContext.Provider value={defaultValue}>
    {children}
  </RootStoreContext.Provider>
);

export const useStore = () => useContext(RootStoreContext);
export const useTreeStore = () => useContext(RootStoreContext).TreeStore;
export const useFlowStore = () => useContext(RootStoreContext).FlowStore;
