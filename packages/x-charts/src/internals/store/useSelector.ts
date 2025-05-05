import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';
import { ChartAnyPluginSignature, ChartState } from '../plugins/models';
import { ChartsSelector } from '../plugins/utils/selectors';
import { ChartStore } from '../plugins/utils/ChartStore';

const defaultCompare = Object.is;

export const useSelector = <
  TSignatures extends readonly ChartAnyPluginSignature[],
  TOptionalSignatures extends readonly ChartAnyPluginSignature[],
  TArgs,
  TValue,
>(
  store: ChartStore<TSignatures, TOptionalSignatures>,
  selector: ChartsSelector<ChartState<TSignatures, TOptionalSignatures>, TArgs, TValue>,
  args: TArgs = undefined as TArgs,
  equals: (a: TValue, b: TValue) => boolean = defaultCompare,
): TValue => {
  const selectorWithArgs = (state: ChartState<TSignatures, TOptionalSignatures>) =>
    selector(state, args);

  return useSyncExternalStoreWithSelector(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
    selectorWithArgs,
    equals,
  );
};
