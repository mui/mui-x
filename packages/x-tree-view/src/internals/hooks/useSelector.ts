/* We need to import the shim because React 17 does not support the `useSyncExternalStore` API.
 * More info: https://github.com/mui/mui-x/issues/18303#issuecomment-2958392341 */
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';
import { TreeViewAnyPluginSignature, TreeViewState } from '../models';
import { TreeViewStore } from '../utils/TreeViewStore';
import { TreeViewSelector } from '../utils/selectors';

const defaultCompare = Object.is;

export const useSelector = <
  TSignatures extends readonly TreeViewAnyPluginSignature[],
  TArgs,
  TValue,
>(
  store: TreeViewStore<TSignatures>,
  selector: TreeViewSelector<TreeViewState<TSignatures>, TArgs, TValue>,
  args: TArgs = undefined as TArgs,
  equals: (a: TValue, b: TValue) => boolean = defaultCompare,
): TValue => {
  const selectorWithArgs = (state: TreeViewState<TSignatures>) => selector(state, args);

  return useSyncExternalStoreWithSelector(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
    selectorWithArgs,
    equals,
  );
};
