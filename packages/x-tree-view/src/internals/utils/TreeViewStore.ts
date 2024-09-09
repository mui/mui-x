import type { TreeViewAnyPluginSignature, TreeViewState } from '../models';

type Listener<T> = (value: T) => void;

export type StoreUpdater<TValue> = (value: TValue) => TValue;

export class TreeViewStore<TSignatures extends readonly TreeViewAnyPluginSignature[]> {
  public value: TreeViewState<TSignatures>;

  private listeners: Set<Listener<typeof this.value>>;

  constructor(value: typeof this.value) {
    this.value = value;
    this.listeners = new Set();
  }

  public subscribe = (fn: Listener<typeof this.value>) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  public getSnapshot = () => {
    return this.value;
  };

  public update = (updater: StoreUpdater<TreeViewState<TSignatures>>) => {
    const newState = updater(this.value);
    if (newState !== this.value) {
      this.value = newState;
    }
    this.listeners.forEach((l) => l(newState));
  };
}
