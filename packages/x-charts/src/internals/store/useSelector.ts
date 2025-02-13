import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';
import { ChartAnyPluginSignature, ChartState } from '../plugins/models';
import { ChartsSelector } from '../plugins/utils/selectors';
import { ChartStore } from '../plugins/utils/ChartStore';
import { fastShallowCompare } from '@mui/x-internals/fastShallowCompare';

const defaultCompare = Object.is;

const complainIfNoMemoize = (a: any, b: any): boolean => {
  const is = Object.is(a, b);
  const shallow = fastShallowCompare(a, b);
  if (is !== shallow) {
    console.warn(`useSelector returned inconsistent results. Is: ${is} Shallow: ${shallow}`, a, b);
  }
  return is;
};

export const useSelector = <TSignatures extends readonly ChartAnyPluginSignature[], TArgs, TValue>(
  store: ChartStore<TSignatures>,
  selector: ChartsSelector<ChartState<TSignatures>, TArgs, TValue>,
  args: TArgs = undefined as TArgs,
  equals: (a: TValue, b: TValue) => boolean = complainIfNoMemoize,
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
