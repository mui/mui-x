import { EventManager } from '@mui/x-internals/EventManager';
import { MinimalTreeViewState } from './MinimalTreeViewStore.types';
import { TreeViewEventListener, TreeViewEventLookup, TreeViewEvents } from '../models/events';
import { TreeViewStore } from '../models';

export class TreeViewInternalsManager<
  State extends MinimalTreeViewState<any, any>,
  Store extends TreeViewStore<any, any, any>,
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

  public publishEvent = <E extends TreeViewEvents>(
    name: E,
    params: TreeViewEventLookup[E] extends { params: any }
      ? TreeViewEventLookup[E]['params']
      : undefined,
    event: TreeViewEventLookup[E] extends { event: any } ? TreeViewEventLookup[E]['event'] : null,
  ) => {
    event.defaultMuiPrevented = false;

    if (isSyntheticEvent(event) && event.isPropagationStopped()) {
      return;
    }

    this.eventManager.emit(name, params, event);
  };

  public subscribeEvent = <E extends TreeViewEvents>(
    eventName: E,
    handler: TreeViewEventListener<E>,
  ) => {
    const enhancedHandler: TreeViewEventListener<E> = (params, event) => {
      if (!event.defaultMuiPrevented) {
        handler(params, event);
      }
    };

    this.eventManager.on(eventName, enhancedHandler);
    return () => {
      this.eventManager.removeListener(eventName, enhancedHandler);
    };
  };
}

function isSyntheticEvent(event: any): event is React.SyntheticEvent {
  return event.isPropagationStopped !== undefined;
}
