import React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import ReactFlow, {
  Background,
  BackgroundVariant,
  MiniMap,
  Controls,
  Node,
  Elements,
} from 'react-flow-renderer';
import { DataType } from '../../typing/DataType';
import { NodeItem } from '../NodeItem';
import { useFlowStore, useTreeStore } from '../../store';
import { GlobalSearch } from '../GlobalSearch';
import {
  DEFAULT_POSITION,
  DEFAULT_ZOOM,
} from '../../constant/reactFlowContainerDefaults';

export const ReactFlowContainer = observer(() => {
  const { elements } = useTreeStore();
  const { gapSize, dotColor, dotSize } = useFlowStore();
  return (
    <div className="relative w-screen h-screen">
      <ReactFlow
        elements={toJS(elements) as Elements}
        nodesConnectable={false}
        nodeTypes={{ special: NodeItem }}
        defaultZoom={DEFAULT_ZOOM}
        defaultPosition={DEFAULT_POSITION}
        snapToGrid
        snapGrid={[gapSize, gapSize]}
        nodesDraggable={true}
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
      <GlobalSearch />
    </div>
  );
});
