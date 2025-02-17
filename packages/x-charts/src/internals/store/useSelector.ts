// use-sync-external-store has no exports field defined
// See https://github.com/facebook/react/issues/30698
// eslint-disable-next-line import/extensions
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector.js';
import { ChartAnyPluginSignature, ChartState } from '../plugins/models';
import { ChartsSelector } from '../plugins/utils/selectors';
import { ChartStore } from '../plugins/utils/ChartStore';

const defaultCompare = Object.is;

export const useSelector = <TSignatures extends readonly ChartAnyPluginSignature[], TArgs, TValue>(
  store: ChartStore<TSignatures>,
  selector: ChartsSelector<ChartState<TSignatures>, TArgs, TValue>,
  args: TArgs = undefined as TArgs,
  equals: (a: TValue, b: TValue) => boolean = defaultCompare,
): TValue => {
  const selectorWithArgs = (state: ChartState<TSignatures>) => selector(state, args);

  return useSyncExternalStoreWithSelector(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
    selectorWithArgs,
    equals,
  );
};
