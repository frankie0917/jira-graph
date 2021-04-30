import { uniqBy } from 'lodash';
import { makeAutoObservable, toJS } from 'mobx';
import { ArrowHeadType, Edge, Node, Position } from 'react-flow-renderer';
import { COLUMN_GAP, ROW_GAP, X_POS } from '../constant/Xpos';
import { DataType } from '../typings/DataType';
import { Tree } from './Tree';

const constructTree = (tree: Tree, root: Tree) => {
  tree.data?.children.forEach((key) => {
    if (root.hasChild(key)) {
      tree.addChild(root.children[key]);
      root.removeChild(key);
    }
  });
  Object.entries(tree.children).forEach(([key]) => {
    if (tree.hasChild(key)) {
      constructTree(tree.children[key], root);
    }
  });
};

class RootStore {
  elements: (Node | Edge)[] = [];
  rootTree: Tree = new Tree('root', {});
  numbers = { story_task: 0, subtask_bug: 0, goal: 0, extra: 0 };

  constructor() {
    makeAutoObservable(this);
  }

  makeTree(data: DataType[]) {
    const uniqData = uniqBy(data, 'key');

    uniqData.forEach((node) => {
      this.rootTree.addChild(new Tree(node.key, {}, node));
    });
    constructTree(this.rootTree, this.rootTree);
  }
  makeElements() {
    const traverse = (tree: Tree, parentId: string) => {
      let isExtra = false;
      const calcY = () => {
        const type = tree.data!.issue_type;

        switch (type) {
          case 'subtask':
          case 'bug':
            this.numbers.subtask_bug += ROW_GAP;
            return this.numbers.subtask_bug;
          case 'story':
          case 'task':
            let res = this.numbers.subtask_bug - (tree.length * ROW_GAP) / 2;
            this.numbers.story_task = Math.max(res, ROW_GAP);
            return this.numbers.story_task;
          default:
            let num = this.numbers.story_task - (tree.length * ROW_GAP) / 2;
            this.numbers.goal = Math.max(num, ROW_GAP);
            return this.numbers.goal;
        }
      };
      const pushElement = () => {
        if (tree.data) {
          const x = isExtra
            ? (this.numbers.extra += COLUMN_GAP)
            : X_POS[tree.data.issue_type];
          const y = isExtra ? 0 : calcY();
          this.elements.push({
            id: tree.id,
            data: tree.data,
            position: { x, y },
            targetPosition: Position.Left,
            sourcePosition: Position.Right,
            type: 'special',
          });
        }
      };
      if (tree.length === 0) {
        if (parentId === 'root') {
          isExtra = true;
        }
        pushElement();
        return;
      }
      Object.entries(tree.children).forEach(([key, childTree]) => {
        if (tree.id !== 'root') {
          this.elements.push({
            id: 'E|' + tree.id + '-' + key,
            source: tree.id,
            target: key,
            arrowHeadType: ArrowHeadType.ArrowClosed,
            style: {
              strokeWidth: '3px',
            },
          });
        }
        traverse(childTree, tree.id);
      });
      if (tree.id !== 'root') {
        pushElement();
      }
    };
    traverse(this.rootTree, 'root');
    console.log('this.rootTree', toJS(this.rootTree));
    console.log('this.elements', toJS(this.elements));
  }
  init(data: DataType[]) {
    this.makeTree(data);
    this.makeElements();
  }
}

export const rootStore = new RootStore();
