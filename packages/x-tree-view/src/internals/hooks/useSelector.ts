// use-sync-external-store has no exports field defined
// See https://github.com/facebook/react/issues/30698
// eslint-disable-next-line import/extensions
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector.js';
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
