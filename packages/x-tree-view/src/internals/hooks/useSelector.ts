import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';
import { TreeViewAnyPluginSignature, TreeViewInstance } from '../models';
import { Store } from '../utils/Store';

const defaultCompare = Object.is;

export const useSelector = <TSignatures extends readonly TreeViewAnyPluginSignature[], T>(
  store: Store<TSignatures>,
  selector: (instance: TreeViewInstance<TSignatures>) => T,
  equals: (a: T, b: T) => boolean = defaultCompare,
) => {
  return useSyncExternalStoreWithSelector(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
    selector,
    equals,
  );
};
