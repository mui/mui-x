import { TreeViewState } from './TreeViewStore.types';
import type { TreeViewStore } from './TreeViewStore';

export class TreeViewStoreEffectManager<
  State extends TreeViewState<any, any>,
  Store extends TreeViewStore<any, any, State, any>,
> {
  private store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  public registerEffect = <Value>(
    selector: (state: State) => Value,
    effect: (previous: Value, next: Value) => void,
  ) => {
    let previousValue = selector(this.store.state);

    this.store.subscribe((state) => {
      const nextValue = selector(state);
      effect(previousValue, nextValue);
      previousValue = nextValue;
    });
  };
}
