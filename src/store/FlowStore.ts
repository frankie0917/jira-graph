import { makeAutoObservable } from 'mobx';
import { DOT_COLOR, GAP_SIZE } from '../constant/Background';

export class FlowStore {
  public dotColor: string = DOT_COLOR;
  public gapSize: number = GAP_SIZE;
  constructor() {
    makeAutoObservable(this);
  }
}
