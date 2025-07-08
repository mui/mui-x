import type { TreeViewAnyPluginSignature, TreeViewState } from '../models';

type Listener<T> = (value: T) => void;

export type StoreUpdater<TSignatures extends readonly TreeViewAnyPluginSignature[]> = (
  prevState: TreeViewState<TSignatures>,
) => TreeViewState<TSignatures>;

export class TreeViewStore<TSignatures extends readonly TreeViewAnyPluginSignature[]> {
  public value: TreeViewState<TSignatures>;

  private listeners: Set<Listener<TreeViewState<TSignatures>>>;

  constructor(value: TreeViewState<TSignatures>) {
    this.value = value;
    this.listeners = new Set();
  }

  public subscribe = (fn: Listener<TreeViewState<TSignatures>>) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  public getSnapshot = () => {
    return this.value;
  };

  public update = (updater: StoreUpdater<TSignatures>) => {
    const newState = updater(this.value);
    if (newState !== this.value) {
      this.value = newState;
      this.listeners.forEach((l) => l(newState));
    }
  };
}
