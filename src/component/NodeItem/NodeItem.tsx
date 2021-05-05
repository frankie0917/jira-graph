import React, { useState } from 'react';
import { DataType, TICKET_STATUS } from '../../typing/DataType';
import { Handle, Node, Position, useZoomPanHelper } from 'react-flow-renderer';
import styles from './NodeItem.module.scss';
import { IssueIcon } from '../IssueIcon/IssueIcon';
import { EyeIcon as SolidEye } from '@heroicons/react/solid';
import { EyeIcon as OutlineEye } from '@heroicons/react/outline';
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

export const NodeItem = React.memo(
  (
    node: Node<DataType> & { listMode?: boolean; xPos?: number; yPos?: number },
  ) => {
    const TreeStore = useTreeStore();
    const { fitView, transform } = useZoomPanHelper();
    if (!node.data) return null;
    const isListMode = node.listMode;
    const { title, issue_type, key, status } = node.data;

    const renderIconButton = (
      tooltip: string,
      onClick: () => void,
      Icon: JSX.Element,
    ) => (
      <button data-tooltip-text={tooltip} onClick={onClick}>
        {Icon}
      </button>
    );
    return (
      <div>
        {!isListMode && <Handle type="target" position={Position.Left} />}
        <div
          className={styles.contentWrapper}
          data-list-mode={isListMode}
          data-issue-type={issue_type}
        >
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
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => {
                console.log('node', node);
                transform({
                  x: -(node.xPos ?? 0) + 50,
                  y: -(node.yPos ?? 0) + 50,
                  zoom: 1,
                });
              }}
              className={styles.title}
            >
              {title}
            </div>
          </div>
          <div
            className={styles.progress}
            style={{ background: parseProgress(status)[1] }}
          >
            {parseProgress(status)[0]}
          </div>
          {!isListMode && (
            <div className={styles.actionWrapper}>
              {renderIconButton(
                'Show only item related node',
                () => {
                  TreeStore.showOnlyItemRelatedNode(node.id);
                },
                <SolidEye className=" w-5 h-5 text-green-600" />,
              )}
              {renderIconButton(
                'Render only item related node',
                () => {
                  TreeStore.renderOnlyItemRelatedNode(node.id, () => {
                    // TODO: FIX ME: hacky way, find a better way!
                    setTimeout(() => {
                      fitView({ padding: 2, includeHiddenNodes: true });
                    });
                  });
                },
                <OutlineEye className=" w-5 h-5 text-indigo-600" />,
              )}
            </div>
          )}
        </div>
        {!isListMode && <Handle type="source" position={Position.Right} />}
      </div>
    );
  },
);
