import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';
import { TreeViewAnyPluginSignature } from '../models';
import { TreeViewStore } from '../utils/TreeViewStore';
import { TreeViewSelector } from '../utils/selectors';

const defaultCompare = Object.is;

export const useSelector = <TSignatures extends readonly TreeViewAnyPluginSignature[], TValue>(
  store: TreeViewStore<TSignatures>,
  selector: TreeViewSelector<TSignatures, TValue>,
  equals: (a: TValue, b: TValue) => boolean = defaultCompare,
): TValue => {
  return useSyncExternalStoreWithSelector(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
    selector,
    equals,
  );
};
