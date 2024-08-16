import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';
import {
  TreeViewAnyPluginSignature,
  TreeViewCacheValue,
  TreeViewInstance,
  TreeViewState,
} from '../models';

const defaultCompare = Object.is;

export const useSelector = <TSignature extends readonly TreeViewAnyPluginSignature[], T>(
  instance: TreeViewInstance<TSignature>,
  selector: (storeValue: {
    state: TreeViewState<TSignature>;
    cache: TreeViewCacheValue<TSignature>;
  }) => T,
  equals: (a: T, b: T) => boolean = defaultCompare,
) => {
  return useSyncExternalStoreWithSelector(
    instance.selectorsStore.subscribe,
    instance.selectorsStore.getSnapshot,
    instance.selectorsStore.getSnapshot,
    selector,
    equals,
  );
};
