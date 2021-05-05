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
  ReactFlowProps,
  useZoomPanHelper,
  isNode,
  Edge,
} from 'react-flow-renderer';
import { DataType } from '../../typing/DataType';
import { NodeItem } from '../NodeItem';
import { useFlowStore, useTreeStore } from '../../store';
import {
  DEFAULT_POSITION,
  DEFAULT_ZOOM,
} from '../../constant/reactFlowContainerDefaults';

export const ReactFlowContainer = observer(() => {
  const { elements } = useTreeStore();
  const { gapSize, dotColor, dotSize } = useFlowStore();
  const { transform } = useZoomPanHelper();
  const onElementClick: ReactFlowProps['onElementClick'] = (
    _,
    element: Node<DataType> | Edge<any>,
  ) => {
    if (isNode(element)) {
      const pos = element.position;
      transform({ x: -pos.x + 50, y: -pos.y + 50, zoom: 1 });
    }
  };
  return (
    <ReactFlow
      elements={toJS(elements) as Elements}
      nodesConnectable={false}
      nodeTypes={{ special: NodeItem }}
      defaultZoom={DEFAULT_ZOOM}
      defaultPosition={DEFAULT_POSITION}
      onElementClick={onElementClick}
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
  );
});
