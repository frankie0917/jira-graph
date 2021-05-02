import { isNull, uniqBy } from 'lodash';
import { makeAutoObservable } from 'mobx';
import { Edge, Node } from 'react-flow-renderer';
import { DEFAULT_EDGE } from '../constant/Edge';
import { DEFAULT_NODE } from '../constant/Node';
import { ROW_GAP, COLUMN_GAP } from '../constant/Gap';
import { DataType } from '../typings/DataType';
import { Tree } from './Tree';

type Element = Partial<Edge & Node> & {
  id: string;
};

export class TreeStore {
  elements: Element[] = [];
  count = {
    edge: 0,
    node: 0,
  };
  rootTree: Tree = new Tree('root', null, {});
  treeMap: Tree = new Tree('root', null, {});

  constructor() {
    makeAutoObservable(this);
  }
  constructTree(tree: Tree) {
    tree.data?.children.forEach((key) => {
      if (this.rootTree.hasChild(key)) {
        const child = this.rootTree.children[key];
        child.parentId = tree.id;
        tree.addChild(child);
        this.treeMap.addChild(child);
        this.rootTree.removeChild(key);
      }
    });
    Object.entries(tree.children).forEach(([key]) => {
      if (tree.hasChild(key)) {
        this.constructTree(tree.children[key]);
      }
    });
  }

  makeTree(data: DataType[]) {
    const uniqData = uniqBy(data, 'key');

    uniqData.forEach((node) => {
      const child = new Tree(node.key, 'root', {}, node);
      this.rootTree.addChild(child);
      this.treeMap.addChild(child);
    });
    this.constructTree(this.rootTree);
  }

  pushNode({ id, data, position }: Tree) {
    this.count.node += 1;
    this.elements.push({
      ...DEFAULT_NODE,
      id,
      data,
      position,
    });
  }

  pushEdge(parentId: string, childId: string, type: 'E' | 'B') {
    this.count.edge += 1;
    this.elements.push({
      ...DEFAULT_EDGE,
      id: `${type}|${parentId}-${childId}`,
      source: parentId,
      target: childId,
      style: {
        stroke: type === 'B' ? 'red' : undefined,
      },
    });
  }

  traverseTreeAndMakeGraph(targetTree: Tree) {
    this.elements = [];
    let subtaskBugCount = 0;
    let extra = -ROW_GAP;
    const traverse = (tree: Tree) => {
      const calcY = () => {
        const values = Object.values(tree.children);
        if (values.length === 0 && tree.parentId === 'root') return null;
        let min = Infinity;
        let max = -Infinity;
        values.forEach(({ position: { y } }) => {
          min = y < min ? y : min;
          max = y > max ? y : max;
        });
        return (max - min) / 2 + min;
      };
      const findPosition = () => {
        let y = calcY();
        if (isNull(y)) {
          y = extra;
          extra -= ROW_GAP;
        }
        switch (tree.data?.issue_type) {
          case 'subtask':
          case 'bug':
            tree.position = { x: 2 * COLUMN_GAP, y: subtaskBugCount * ROW_GAP };
            subtaskBugCount += 1;
            break;
          case 'story':
          case 'task':
            tree.position = { x: 1 * COLUMN_GAP, y };
            break;
          case 'goal':
            tree.position = { x: 0, y };
            break;
        }
      };
      if (tree.length === 0) {
        findPosition();
        this.pushNode(tree);
        return;
      }
      tree.data?.blocked_by.forEach((blockedById) => {
        this.pushEdge(blockedById, tree.id, 'B');
      });
      Object.entries(tree.children).forEach(([childId, childTree]) => {
        if (tree.id !== 'root') {
          this.pushEdge(tree.id, childId, 'E');
        }
        traverse(childTree);
      });
      if (tree.id !== 'root') {
        findPosition();
        this.pushNode(tree);
      }
    };
    traverse(targetTree);
  }
  showAllTree() {
    this.traverseTreeAndMakeGraph(this.rootTree);
    this.elements.forEach((node) => {
      node.isHidden = false;
    });
  }

  findGreatestParentId(
    id: string,
    callback?: (tree: Tree) => void,
  ): string | null {
    if (!this.treeMap.hasChild(id)) return null;
    const tree = this.treeMap.children[id];
    callback && callback(tree);
    if (tree.parentId === 'root' || tree.parentId === null) return id;
    return this.findGreatestParentId(tree.parentId, callback);
  }
  findAllChildrenId(id: string, ids: string[] = []) {
    if (this.treeMap.children[id].length === 0) {
      ids.push(id);
      return ids;
    }
    Object.entries(this.treeMap.children[id].children).forEach(
      ([key, child]) => {
        this.findAllChildrenId(key, ids);
      },
    );
    ids.push(id);
    return ids;
  }
  showOnlyItemRelatedNode(id: string) {
    // calculating relating id
    const includeIds: string[] = [];
    const targetTree = this.treeMap.children[id];
    includeIds.push(...(targetTree.data?.blocked_by ?? []));
    const parentId = targetTree.parentId;
    if (parentId === null) return;
    // include all siblings unless its parent is root
    if (parentId !== 'root') {
      includeIds.push(...Object.keys(this.treeMap.children[parentId].children));
    }
    // adding all parent nodes
    this.findGreatestParentId(id, (tree) => {
      if (tree.id === null || tree.id === 'root') return;
      includeIds.push(tree.id);
    });
    includeIds.push(...this.findAllChildrenId(id));
    this.elements.forEach((node) => {
      if (node.data !== undefined) {
        node.isHidden = !includeIds.includes(node.id);
      } else {
        // its an edge
        if (
          includeIds.includes(node.source!) &&
          includeIds.includes(node.target!)
        ) {
          node.isHidden = false;
          return;
        }

        node.isHidden = true;
      }
    });
    // this.traverseTreeAndMakeGraph(this.treeMap.children[greatestParentId]);
  }
  init(data: DataType[]) {
    this.makeTree(data);
    this.showAllTree();
  }
}
