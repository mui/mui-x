import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';
import { ChartState } from './plugins/models';
import { ChartsSelector } from './plugins/utils/selectors';
import { ChartStore } from './plugins/utils/ChartStore';

const defaultCompare = Object.is;

export const useSelector = <TArgs, TValue>(
  store: ChartStore,
  selector: ChartsSelector<ChartState, TArgs, TValue>,
  args: TArgs = undefined as TArgs,
  equals: (a: TValue, b: TValue) => boolean = defaultCompare,
): TValue => {
  const selectorWithArgs = (state: ChartState) => selector(state, args);

  return useSyncExternalStoreWithSelector(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
    selectorWithArgs,
    equals,
  );
};
