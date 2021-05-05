import { isUndefined } from 'lodash';
import { DataType } from '../typing/DataType';

export class Tree {
  public length = 0;
  public position: { x: number; y: number } = { x: 0, y: 0 };
  constructor(
    public id: string,
    public parentId: string | null,
    public children: Record<string, Tree>,
    public data?: DataType,
    position?: { x: number; y: number },
  ) {
    this.length = Object.keys(children).length;
    if (position) this.position = position;
  }
  addChild(tree: Tree) {
    this.children[tree.id] = tree;
    this.length += 1;
  }
  hasChild(key: string) {
    return !isUndefined(this.children[key]);
  }
  getChild(key: string) {
    return this.children[key] ?? null;
  }
  removeChild(key: string) {
    if (this.hasChild(key)) {
      delete this.children[key];
      this.length -= 1;
    }
  }
}
