import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { TreeViewAnyPluginSignature, TreeViewUsedCacheValue, TreeViewUsedStore } from '../models';
import { StoreUpdater } from '../utils/Store';

// TODO: Rework
export function useUpdateSelectorsCache<TSignature extends TreeViewAnyPluginSignature>(
  store: TreeViewUsedStore<TSignature>,
  updater: StoreUpdater<TreeViewUsedCacheValue<TSignature>>,
) {
  useEnhancedEffect(() => {
    store.updateCache(updater);
  });
}
