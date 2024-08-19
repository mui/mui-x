import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';
import { TreeViewAnyPluginSignature, TreeViewInstance } from '../models';

const defaultCompare = Object.is;

export const useSelector = <TSignatures extends readonly TreeViewAnyPluginSignature[], T>(
  instance: TreeViewInstance<TSignatures>,
  selector: (instance: TreeViewInstance<TSignatures>) => T,
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
