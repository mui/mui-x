import type { TreeViewAnyPluginSignature, TreeViewState } from '../models';

type Listener<T> = (value: T) => void;

export type StoreUpdater<TValue> = (value: TValue) => TValue;

export class TreeViewStore<TSignatures extends readonly TreeViewAnyPluginSignature[]> {
  public value: TreeViewState<TSignatures>;

  private listeners: Set<Listener<TreeViewState<TSignatures>>>;

  private readonly forceUpdate: (state: TreeViewState<TSignatures>) => void;

  constructor({
    initialState,
    forceUpdate,
  }: {
    initialState: TreeViewState<TSignatures>;
    forceUpdate: (state: TreeViewState<TSignatures>) => void;
  }) {
    this.value = initialState;
    this.listeners = new Set();
    this.forceUpdate = forceUpdate;
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

  public update = (updater: StoreUpdater<TreeViewState<TSignatures>>) => {
    const newState = updater(this.value);
    if (newState !== this.value) {
      this.value = newState;
      this.listeners.forEach((l) => l(newState));
      this.forceUpdate(newState);
    }
  };
}
