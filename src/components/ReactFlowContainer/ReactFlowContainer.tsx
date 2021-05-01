import React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import ReactFlow, {
  Background,
  BackgroundVariant,
  MiniMap,
  Controls,
  ReactFlowProps,
  Node,
} from 'react-flow-renderer';
import { DataType } from '../../typings/DataType';
import { NodeItem } from '../NodeItem';
import { useFlowStore, useTreeStore } from '../../store';

export const ReactFlowContainer = observer(() => {
  const onElementClick: ReactFlowProps['onElementClick'] = (event, element) => {
    console.log('element', element);
  };
  const { elements } = useTreeStore();
  const { gapSize, dotColor, dotSize } = useFlowStore();
  return (
    <ReactFlow
      elements={toJS(elements)}
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
        size={dotSize}
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
  );
});
