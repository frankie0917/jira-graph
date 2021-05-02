import React, { useState } from 'react';
import { DataType, TICKET_STATUS } from '../../typings/DataType';
import { Handle, Node, Position } from 'react-flow-renderer';
import styles from './NodeItem.module.scss';
import { IssueIcon } from '../IssueIcon/IssueIcon';
import { EyeIcon } from '@heroicons/react/solid';
import { useTreeStore } from '../../store';

const parseProgress = (status: TICKET_STATUS) => {
  switch (status) {
    case 'open':
      return ['Todo', '#f85f73'];
    case 'in_progress':
      return ['In Progress', '#005691'];
    case 'ready_to_test':
      return ['To Test', '#00b8a9'];
    case 'readey_to_deploy':
      return ['To Deploy', '#00b8a9'];
    case 'closed':
      return ['Closed', '#00b8a9'];
  }
};

export const NodeItem = React.memo((node: Node<DataType>) => {
  const TreeStore = useTreeStore();
  if (!node.data) return null;
  const { title, issue_type, key, status } = node.data;

  return (
    <div>
      <Handle type="target" position={Position.Left} />
      <div className={styles.contentWrapper} data-issue-type={issue_type}>
        <div className={styles.heading}>
          <div className={styles.iconKey}>
            <div className={styles.icon}>
              <IssueIcon type={issue_type} />
            </div>
            <div className={styles.link}>
              <a
                href={`https://aftership.atlassian.net/browse/${key}`}
                target="_blank"
                rel="noreferrer"
              >
                {key}
              </a>
            </div>
          </div>
          <div className={styles.title}>{title}</div>
        </div>
        <div
          className={styles.progress}
          style={{ background: parseProgress(status)[1] }}
        >
          {parseProgress(status)[0]}
        </div>
        <div className={styles.actionWrapper}>
          <button
            onClick={() => {
              TreeStore.showOnlyItemRelatedNode(node.id);
            }}
          >
            <EyeIcon className=" w-5 h-5 text-green-600" />
          </button>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
});
