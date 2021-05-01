import { isNull, uniqBy } from 'lodash';
import { makeAutoObservable, toJS } from 'mobx';
import { Edge, Node } from 'react-flow-renderer';
import { DEFAULT_EDGE } from '../constant/Edge';
import { DEFAULT_NODE } from '../constant/Node';
import { ROW_GAP, COLUMN_GAP } from '../constant/Gap';
import { DataType } from '../typings/DataType';
import { Tree } from './Tree';

export class TreeStore {
  elements: (Node | Edge)[] = [];
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

  pushEdge(tree: Tree, childId: string) {
    this.count.edge += 1;
    this.elements.push({
      ...DEFAULT_EDGE,
      id: 'E|' + tree.id + '-' + childId,
      source: tree.id,
      target: childId,
    });
  }

  makeElements() {
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
      Object.entries(tree.children).forEach(([childId, childTree]) => {
        if (tree.id !== 'root') {
          this.pushEdge(tree, childId);
        }
        traverse(childTree);
      });
      if (tree.id !== 'root') {
        findPosition();
        this.pushNode(tree);
      }
    };
    traverse(this.rootTree);
    console.log('this.rootTree', toJS(this.rootTree));
    console.log('this.treeMap', this.treeMap);
    console.log('this.elements', toJS(this.elements));
  }
  init(data: DataType[]) {
    this.makeTree(data);
    this.makeElements();
  }
}
