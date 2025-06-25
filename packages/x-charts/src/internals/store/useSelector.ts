/* We need to import the shim because React 17 does not support the `useSyncExternalStore` API.
 * More info: https://github.com/mui/mui-x/issues/18303#issuecomment-2958392341 */
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';
import { ChartAnyPluginSignature, ChartState } from '../plugins/models';
import { ChartsSelector } from '../plugins/utils/selectors';
import { ChartStore } from '../plugins/utils/ChartStore';

const defaultCompare = Object.is;

export const useSelector = <
  TSignatures extends readonly ChartAnyPluginSignature[],
  TOptionalSignatures extends readonly ChartAnyPluginSignature[],
  TArgs extends readonly any[],
  TResult = unknown,
>(
  store: ChartStore<TSignatures, TOptionalSignatures>,
  selector: ChartsSelector<TSignatures, TOptionalSignatures, TResult, TArgs>,
  args = [] as [TArgs] extends [never] ? [] : TArgs,
  equals: (a: TResult, b: TResult) => boolean = defaultCompare,
): TResult => {
  const selectorWithArgs = (state: ChartState<TSignatures, TOptionalSignatures>) =>
    selector(state, ...args);

  return useSyncExternalStoreWithSelector(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
    selectorWithArgs,
    equals,
  );
};
