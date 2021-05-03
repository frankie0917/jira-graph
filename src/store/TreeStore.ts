import { differenceBy, isNull, uniq, uniqBy } from 'lodash';
import { makeAutoObservable, toJS } from 'mobx';
import { Edge, Node } from 'react-flow-renderer';
import { DEFAULT_EDGE } from '../constant/Edge';
import { DEFAULT_NODE } from '../constant/Node';
import { ROW_GAP, COLUMN_GAP } from '../constant/Gap';
import { DataType } from '../typing/DataType';
import { Tree } from './Tree';

type Element = Partial<Edge & Node> & {
  id: string;
};

const defaultCalcPostionCount = {
  subtaskBugCount: 0,
  extra: -ROW_GAP,
};

export class TreeStore {
  elements: Element[] = [];
  data: DataType[] = [];
  count = {
    edge: 0,
    node: 0,
  };
  rootTree: Tree = new Tree('root', null, {});
  treeMap: Tree = new Tree('root', null, {});
  /** used by calc position */
  private calcPostionCount = defaultCalcPostionCount;

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
    this.rootTree = new Tree('root', null, {});
    this.treeMap = new Tree('root', null, {});
    const uniqData = uniqBy(data, 'key');

    uniqData.forEach((node) => {
      const child = new Tree(node.key, 'root', {}, node);
      this.rootTree.addChild(child);
      this.treeMap.addChild(child);
    });
    this.constructTree(this.rootTree);
  }

  pushNode(id: string, isHidden: boolean = false) {
    this.count.node += 1;
    const { data, position } = this.treeMap.children[id];
    this.elements.push({
      ...DEFAULT_NODE,
      id,
      data,
      position,
      isHidden,
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
  reset() {
    this.elements = [];
    this.makeTree(this.data);
  }

  calcPosition(id: string, includeIds?: string[]) {
    const tree = this.treeMap.children[id];
    const calcY = () => {
      const values = Object.values(tree.children).map(
        ({ id }) => this.treeMap.children[id],
      );
      if (values.length === 0 && tree.parentId === 'root') return null;
      let min = Infinity;
      let max = -Infinity;
      values.forEach(({ id, position: { y } }) => {
        if (includeIds && !includeIds?.includes(id)) return;
        min = y < min ? y : min;
        max = y > max ? y : max;
      });
      return (max - min) / 2 + min;
    };
    let y = calcY();

    if (isNull(y)) {
      y = this.calcPostionCount.extra;
      this.calcPostionCount.extra -= ROW_GAP;
    }
    if (isNaN(y) && tree.parentId) {
      let res = -Infinity;

      Object.values(this.treeMap.children[tree.parentId].children).forEach(
        (sibling) => {
          if (sibling.id === tree.id) return;

          res = res < sibling.position.y ? sibling.position.y : res;
        },
      );
      y = res + ROW_GAP;
    }
    let res = { x: 0, y: 0 };
    switch (tree.data?.issue_type) {
      case 'subtask':
      case 'bug':
        res = {
          x: 2 * COLUMN_GAP,
          y: this.calcPostionCount.subtaskBugCount * ROW_GAP,
        };
        this.calcPostionCount.subtaskBugCount += 1;
        break;
      case 'story':
      case 'task':
        res = { x: 1 * COLUMN_GAP, y };
        break;
      case 'goal':
        res = { x: 0, y };
        break;
    }
    this.treeMap.children[tree.id].position = res;
  }
  traverseTreeAndMakeGraph(targetTree: Tree, includeIds?: string[]) {
    this.reset();

    const traverse = (tree: Tree) => {
      if (tree.length === 0 && tree.id !== 'root') {
        this.calcPosition(tree.id, includeIds);
        this.pushNode(tree.id);
        return;
      }
      tree.data?.blocked_by.forEach((blockedById) => {
        if (includeIds && !includeIds.includes(blockedById)) return;
        this.pushEdge(blockedById, tree.id, 'B');
      });
      Object.entries(tree.children).forEach(([childId, childTree]) => {
        if (includeIds && !includeIds.includes(childId)) return;
        if (tree.id !== 'root') {
          this.pushEdge(tree.id, childId, 'E');
        }
        traverse(childTree);
      });
      if (tree.id !== 'root') {
        this.calcPosition(tree.id, includeIds);
        this.pushNode(tree.id);
      }
    };
    traverse(targetTree);
  }
  showAllTree() {
    this.traverseTreeAndMakeGraph(this.rootTree);
    this.elements.forEach((node) => {
      node.isHidden = false;
    });
    this.calcPostionCount = defaultCalcPostionCount;
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
  renderOnlyItemRelatedNode(id: string) {
    const greatestParentId = this.findGreatestParentId(id);
    if (greatestParentId === null) return;

    const relatedIds = this.findRelatedIds(id);
    this.traverseTreeAndMakeGraph(
      this.treeMap.children[greatestParentId],
      relatedIds,
    );
    const diff: string[] = [];
    // calculate extra related nodes
    relatedIds.forEach((relateId) => {
      if (!this.elements.find(({ id }) => id === relateId)) diff.push(relateId);
    });
    diff.forEach((diffId) => {
      this.calcPosition(diffId);
      this.pushNode(diffId, false);
    });
    this.calcPostionCount = defaultCalcPostionCount;
  }
  findRelatedIds(id: string) {
    const relatedIds: string[] = [];
    const targetTree = this.treeMap.children[id];
    relatedIds.push(...(targetTree.data?.blocked_by ?? []));
    const parentId = targetTree.parentId;
    if (parentId === null) return [];
    // include all siblings unless its parent is root
    if (parentId !== 'root') {
      relatedIds.push(...Object.keys(this.treeMap.children[parentId].children));
    }
    // adding all parent nodes
    this.findGreatestParentId(id, (tree) => {
      if (tree.id === null || tree.id === 'root') return;
      relatedIds.push(tree.id);
    });
    relatedIds.push(...this.findAllChildrenId(id));
    return uniq(relatedIds);
  }

  showOnlyItemRelatedNode(id: string) {
    // calculating relating id
    const relatedIds = this.findRelatedIds(id);
    this.elements.forEach((node) => {
      if (node.data !== undefined) {
        node.isHidden = !relatedIds.includes(node.id);
      } else {
        // its an edge
        if (
          relatedIds.includes(node.source!) &&
          relatedIds.includes(node.target!)
        ) {
          node.isHidden = false;
          return;
        }

        node.isHidden = true;
      }
    });
  }
  init(data: DataType[]) {
    this.data = uniqBy(data, 'key');
    this.makeTree(this.data);
    this.showAllTree();
  }
}
