import React, { useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  MiniMap,
  Node,
  Controls,
} from 'react-flow-renderer';
import './App.css';
import { DataType } from './typings/DataType';
import { NodeItem } from './components/NodeItem';
import { observer } from 'mobx-react-lite';
import { rootStore } from './store/rootStore';
// import { data } from './mockData/simpleData';
import { toJS } from 'mobx';
import data from './mockData/result.json';

const App = observer(() => {
  const [gapSize, setGapSize] = useState(20);
  const [dotColor, setDotColor] = useState('#bbb');
  useEffect(() => {
    rootStore.init(data as any);
  }, []);
  return (
    <div className="App">
      <ReactFlow
        elements={toJS(rootStore.elements)}
        nodesConnectable={false}
        nodeTypes={{ special: NodeItem }}
        defaultZoom={0.5}
        defaultPosition={[200, 200]}
        snapToGrid
        snapGrid={[gapSize, gapSize]}
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
