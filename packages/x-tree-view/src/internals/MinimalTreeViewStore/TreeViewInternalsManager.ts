import { EventManager } from '@mui/x-internals/EventManager';
import { MinimalTreeViewState } from './MinimalTreeViewStore.types';
import type { MinimalTreeViewStore } from './MinimalTreeViewStore';
import { TreeViewEventListener } from '../models/events';

export class TreeViewInternalsManager<
  State extends MinimalTreeViewState<any, any>,
  Store extends MinimalTreeViewStore<any, any, State, any>,
> {
  private store: Store;

  private eventManager = new EventManager();

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

  public publishEvent = (...args: any[]) => {
    const [name, params, event = {}] = args;
    event.defaultMuiPrevented = false;

    if (isSyntheticEvent(event) && event.isPropagationStopped()) {
      return;
    }

    this.eventManager.emit(name, params, event);
  };

  public subscribeEvent = (event: string, handler: TreeViewEventListener<any>) => {
    this.eventManager.on(event, handler);
    return () => {
      this.eventManager.removeListener(event, handler);
    };
  };
}

function isSyntheticEvent(event: any): event is React.SyntheticEvent {
  return event.isPropagationStopped !== undefined;
}
