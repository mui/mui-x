import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';
import { ChartsState } from './plugins/models';
import { ChartsSelector } from './plugins/utils/selectors';
import { ChartsStore } from './plugins/utils/ChartsStore';

const defaultCompare = Object.is;

export const useSelector = <TArgs, TValue>(
  store: ChartsStore,
  selector: ChartsSelector<ChartsState, TArgs, TValue>,
  args: TArgs = undefined as TArgs,
  equals: (a: TValue, b: TValue) => boolean = defaultCompare,
): TValue => {
  const selectorWithArgs = (state: ChartsState) => selector(state, args);

  return useSyncExternalStoreWithSelector(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
    selectorWithArgs,
    equals,
  );
};
