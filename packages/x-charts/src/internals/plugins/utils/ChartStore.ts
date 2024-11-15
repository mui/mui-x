import type { ChartState } from '../models'; // For now this is fixed. Will need to support generic if we add plugins

type Listener<T> = (value: T) => void;

export type StoreUpdater = (prevState: ChartState) => ChartState;

export class ChartStore {
  public value: ChartState;

  private listeners: Set<Listener<ChartState>>;

  constructor(value: ChartState) {
    this.value = value;
    this.listeners = new Set();
  }

  public subscribe = (fn: Listener<ChartState>) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  public getSnapshot = () => {
    return this.value;
  };

  public update = (updater: StoreUpdater) => {
    const newState = updater(this.value);
    if (newState !== this.value) {
      this.value = newState;
      this.listeners.forEach((l) => l(newState));
    }
  };
}
