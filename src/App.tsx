import React, { useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Elements,
  BackgroundVariant,
  MiniMap,
  Node,
  Controls,
  ArrowHeadType,
} from 'react-flow-renderer';
import './App.css';
import { DataType } from './typings/DataType';
// import data from './mockData/result.json';
import { dataAdaptor } from './dataAdaptor';
import { NodeItem } from './components/NodeItem';
const data: DataType[] = [
  {
    assignees: ['gy.huang@aftership.com'],
    blocked_by: [],
    key: 'RTC-001',
    children: ['RTC-002'],
    status: 'in_progress',
    title: 'Parent story',
    issue_type: 'story',
  },
  {
    assignees: ['gy.huang@aftership.com'],
    blocked_by: [],
    key: 'RTC-002',
    children: [],
    status: 'in_progress',
    title: 'Child task',
    issue_type: 'task',
  },
];

function App() {
  const [elements, setElements] = useState<Elements<DataType>>([]);
  const [gapSize, setGapSize] = useState(20);
  const [dotColor, setDotColor] = useState('#bbb');
  useEffect(() => {
    setElements(dataAdaptor(data as any));
  }, []);
  return (
    <div className="App">
      <ReactFlow
        elements={elements}
        nodesConnectable={false}
        nodeTypes={{ special: NodeItem }}
        defaultZoom={1.5}
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
}

export default App;
