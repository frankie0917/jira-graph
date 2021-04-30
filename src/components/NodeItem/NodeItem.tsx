import React, { memo } from 'react';
import { DataType } from '../../typings/DataType';
import { Handle, Node, Position } from 'react-flow-renderer';

export const NodeItem = memo((node: Node<DataType>) => {
  console.log('node', node);
  if (!node.data) return null;
  const { title, issue_type } = node.data;
  return (
    <div>
      {issue_type !== 'goal' && (
        <Handle type="target" position={Position.Left} />
      )}
      <div>{title}</div>
      {issue_type !== 'bug' && issue_type !== 'subtask' && (
        <Handle type="source" position={Position.Right} />
      )}
    </div>
  );
});
