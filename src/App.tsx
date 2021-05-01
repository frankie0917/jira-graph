import React, { useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  MiniMap,
  Node,
  Controls,
  ReactFlowProps,
} from 'react-flow-renderer';
import './App.css';
import { DataType } from './typings/DataType';
import { NodeItem } from './components/NodeItem';
import { observer } from 'mobx-react-lite';
import { rootStore } from './store/rootStore';
// import { data } from './mockData/simpleData';
import { toJS } from 'mobx';
import data from './mockData/result.json';
import { DOT_COLOR, GAP_SIZE } from './constant/Background';

const App = observer(() => {
  const [gapSize, setGapSize] = useState(GAP_SIZE);
  const [dotColor, setDotColor] = useState(DOT_COLOR);
  useEffect(() => {
    rootStore.init(data as any);
  }, []);
  const onElementClick: ReactFlowProps['onElementClick'] = (event, element) => {
    console.log('element', element);
  };
  return (
    <div className="App">
      <div className="SideBar"></div>
      <ReactFlow
        elements={toJS(rootStore.elements)}
        nodesConnectable={false}
        nodeTypes={{ special: NodeItem }}
        defaultZoom={0.5}
        defaultPosition={[200, 200]}
        snapToGrid
        snapGrid={[gapSize, gapSize]}
        nodesDraggable={false}
        onElementClick={onElementClick}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={gapSize}
          size={1}
          color={dotColor}
        />
        <MiniMap
          nodeColor={(node: Node<DataType>) => {
            switch (node.data?.issue_type) {
              case 'goal':
                return 'rgb(135, 119, 217)';
              case 'bug':
                return '#e5493a';
              case 'story':
                return '#63ba3c';
              case 'task':
              case 'subtask':
              default:
                return '#4bade8';
            }
          }}
          nodeStrokeWidth={3}
        />
        <Controls />
      </ReactFlow>
    </div>
  );
});

export default App;
