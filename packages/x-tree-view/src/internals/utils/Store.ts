import type { TreeViewAnyPluginSignature, TreeViewCacheValue, TreeViewState } from '../models';

type Listener<T> = (value: T) => void;

let globalId = 0;

export type StoreUpdater<TValue> = (value: TValue) => TValue;

export class Store<TSignatures extends readonly TreeViewAnyPluginSignature[]> {
  public value: { state: TreeViewState<TSignatures>; cache: TreeViewCacheValue<TSignatures> };

  public instanceId: number;

  listeners: Set<Listener<typeof this.value>>;

  constructor(value: typeof this.value) {
    this.value = value;
    this.listeners = new Set();
    this.instanceId = globalId;

    globalId += 1;
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

  private update = (value: typeof this.value) => {
    this.value = value;
    this.listeners.forEach((l) => l(value));
  };

  public updateState = (updater: StoreUpdater<TreeViewState<TSignatures>>) => {
    const newState = updater(this.value.state);
    if (newState !== this.value.state) {
      this.update({ ...this.value, state: newState });
    }
  };

  public updateCache = (updater: StoreUpdater<TreeViewCacheValue<TSignatures>>) => {
    const newCache = updater(this.value.cache);
    if (newCache !== this.value.cache) {
      this.update({ ...this.value, cache: newCache });
    }
  };
}
