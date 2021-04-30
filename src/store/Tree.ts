import { isUndefined } from 'lodash';
import { DataType } from '../typings/DataType';

export class Tree {
  public length = 0;
  constructor(
    public id: string,
    public children: Record<string, Tree>,
    public data?: DataType,
  ) {
    this.length = Object.keys(children).length;
  }
  addChild(tree: Tree) {
    this.children[tree.id] = tree;
    this.length += 1;
  }
  hasChild(key: string) {
    return !isUndefined(this.children[key]);
  }
  removeChild(key: string) {
    if (this.hasChild(key)) {
      delete this.children[key];
      this.length -= 1;
    }
  }
}
