import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import {
  TreeViewAnyPluginSignature,
  TreeViewUsedCacheValue,
  TreeViewUsedInstance,
} from '../models';

export function useUpdateSelectorsCache<TSignature extends TreeViewAnyPluginSignature>(
  instance: TreeViewUsedInstance<TSignature>,
  callee: (cacheValue: TreeViewUsedCacheValue<TSignature>) => TreeViewUsedCacheValue<TSignature>,
) {
  const currentCache = instance.selectorsStore.value.cache;
  const newCache = callee(currentCache);

  useEnhancedEffect(() => {
    if (newCache !== currentCache) {
      instance.selectorsStore.updateCache(newCache);
    }
  }, [newCache, currentCache, instance]);

  return newCache;
}
