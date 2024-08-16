import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';
import { warnOnce } from '../utils/warning';
import { TreeViewAnyPluginSignature, TreeViewInstance, TreeViewState } from '../models';

const defaultCompare = Object.is;

export const useSelector = <TSignature extends readonly TreeViewAnyPluginSignature[], T>(
  instance: TreeViewInstance<TSignature>,
  selector: (state: TreeViewState<TSignature>) => T,
  equals: (a: T, b: T) => boolean = defaultCompare,
) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!instance.selectorsCache.state) {
      warnOnce([
        'MUI X: `useSelector` has been called before the initialization of the state.',
        'This hook can only be used inside the context of the tree view.',
      ]);
    }
  }

  return useSyncExternalStoreWithSelector(
    instance.selectorsCache.store.subscribe,
    instance.selectorsCache.store.getSnapshot,
    instance.selectorsCache.store.getSnapshot,
    selector,
    equals,
  );
};
