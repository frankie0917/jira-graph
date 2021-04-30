import { DataType } from './typings/DataType';
import {
  Elements,
  Position,
  ArrowHeadType,
  Node,
  Edge,
} from 'react-flow-renderer';
import { uniqBy } from 'lodash';

export const dataAdaptor = (data: DataType[]): Elements<DataType> => {
  const uniqData = uniqBy(data, 'key');
  const nodeList: Node<DataType>[] = [];
  const edgeList: Edge[] = [];
  uniqData.forEach((node, index) => {
    const { key, children } = node;
    nodeList.push({
      id: key,
      data: node,
      position: { x: index * 200, y: 0 },
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
      type: 'special',
    });
    children.forEach((childKey) => {
      edgeList.push({
        id: 'E-' + childKey,
        source: key,
        target: childKey,
        arrowHeadType: ArrowHeadType.Arrow,
      });
    });
  });
  const res = [...nodeList, ...edgeList];
  return res;
};
