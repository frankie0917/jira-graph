import { makeAutoObservable } from 'mobx';
import { DOT_COLOR, DOT_SIZE, GAP_SIZE } from '../constant/Background';

export class FlowStore {
  public dotColor: string = DOT_COLOR;
  public dotSize: number = DOT_SIZE;
  public gapSize: number = GAP_SIZE;
  constructor() {
    makeAutoObservable(this);
  }
  setDotColor(val: string) {
    this.dotColor = val;
  }
  setDotSize(val: number) {
    this.dotSize = val;
  }
  setGapSize(val: number) {
    this.gapSize = val;
  }
}
