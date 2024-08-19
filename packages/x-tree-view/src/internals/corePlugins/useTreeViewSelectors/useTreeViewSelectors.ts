import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { TreeViewAnyPluginSignature, TreeViewCacheValue, TreeViewPlugin } from '../../models';
import { UseTreeViewSelectorsSignature } from './useTreeViewSelectors.types';
import { Store } from '../../utils/Store';

export const useTreeViewSelectors: TreeViewPlugin<UseTreeViewSelectorsSignature> = ({
  state,
  plugins,
}) => {
  const storeRef = React.useRef<Store<any, any> | null>(null);
  if (storeRef.current == null) {
    const initialCache = {} as TreeViewCacheValue<TreeViewAnyPluginSignature[]>;
    plugins.forEach((plugin) => {
      if (plugin.getInitialCache) {
        Object.assign(initialCache, plugin.getInitialCache());
      }
    });

    storeRef.current = new Store({ state, cache: initialCache });
  }

  useEnhancedEffect(() => {
    storeRef.current!.updateState(state);
  }, [state]);

  return {
    instance: {
      selectorsStore: storeRef.current,
    },
  };
};

useTreeViewSelectors.params = {};
