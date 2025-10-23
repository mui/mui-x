import { MinimalTreeViewState } from './MinimalTreeViewStore.types';
import type { MinimalTreeViewStore } from './MinimalTreeViewStore';

export class TreeViewStoreEffectManager<
  State extends MinimalTreeViewState<any, any>,
  Store extends MinimalTreeViewStore<any, any, State, any>,
> {
  private store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  public registerStoreEffect = <Value>(
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
