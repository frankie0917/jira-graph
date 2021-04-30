import React from 'react';
import { DataType } from '../../typings/DataType';
import { Handle, Node, Position } from 'react-flow-renderer';
import styles from './NodeItem.module.scss';
import { IssueIcon } from '../IssueIcon/IssueIcon';

export const NodeItem = React.memo((node: Node<DataType>) => {
  if (!node.data) return null;
  const { title, issue_type, key } = node.data;
  return (
    <div>
      {issue_type !== 'goal' && (
        <Handle type="target" position={Position.Left} />
      )}
      <div className={styles.contentWrapper} data-issue-type={issue_type}>
        <div className={styles.issueType}>
          <IssueIcon type={issue_type} />
        </div>
        <div className={styles.heading}>
          <div className={styles.key}>{key}</div>
          <div className={styles.title}>{title}</div>
        </div>
        <div></div>
      </div>
      {issue_type !== 'bug' && issue_type !== 'subtask' && (
        <Handle type="source" position={Position.Right} />
      )}
    </div>
  );
});
