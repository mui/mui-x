import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import type { TreeViewPlugin } from '../../models';
import {
  UseTreeViewSelectorsCache,
  UseTreeViewSelectorsSignature,
} from './useTreeViewSelectors.types';
import { Store } from '../../utils/Store';

let globalId = 0;

export const useTreeViewSelectors: TreeViewPlugin<UseTreeViewSelectorsSignature> = ({ state }) => {
  const cacheRef = React.useRef<UseTreeViewSelectorsCache<any> | null>(null);
  if (cacheRef.current == null) {
    cacheRef.current = {
      state,
      store: Store.create(state),
      instanceId: globalId,
    };
    globalId += 1;
  }

  useEnhancedEffect(() => {
    cacheRef.current!.store.update(state);
  }, [state]);

  return {
    instance: {
      selectorsCache: cacheRef.current,
    },
  };
};

useTreeViewSelectors.params = {};
