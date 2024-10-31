import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import { warnOnce } from '@mui/x-internals/warning';
import { TreeViewPlugin } from '../../models';
import { UseTreeViewLazyLoadingSignature } from './useTreeViewLazyLoading.types';
import { TreeViewDataSourceCache, TreeViewDataSourceCacheDefault } from './cache';
import { NestedDataManager, RequestStatus } from './utils';
import { TreeViewItemId } from '../../../models';

const noopCache: TreeViewDataSourceCache = {
  clear: () => {},
  get: () => undefined,
  set: () => {},
};

function getCache(cacheProp?: TreeViewDataSourceCache | null) {
  if (cacheProp === null) {
    return noopCache;
  }
  return cacheProp ?? new TreeViewDataSourceCacheDefault({});
}

export const useTreeViewLazyLoading: TreeViewPlugin<UseTreeViewLazyLoadingSignature> = ({
  instance,
  state,
  setState,
  params,
}) => {
  const nestedDataManager = useLazyRef<NestedDataManager, void>(
    () => new NestedDataManager(instance),
  ).current;
  const [cache, setCache] = React.useState<TreeViewDataSourceCache>(() =>
    getCache(params.treeViewDataSourceCache),
  );

  const fetchItems = React.useCallback(
    async (parentIds?: TreeViewItemId[]) => {
      const getChildrenCount = params.treeViewDataSource?.getChildrenCount || (() => 0);

      const getTreeItems = params.treeViewDataSource?.getTreeItems;
      if (!getTreeItems) {
        return;
      }

      if (parentIds) {
        nestedDataManager.queue([parentIds]);
        return;
      }
      // this should be the first
      nestedDataManager.clear();

      // handle caching here
      // handle loading here

      try {
        const getTreeItemsResponse = await getTreeItems();

        // set loading state

        // set caching

        // update the items in the state -> need to write a method for this in useTreeViewItems
        instance.addItems({ items: getTreeItemsResponse, depth: 0, getChildrenCount });
      } catch (error) {
        const childrenFetchError = error as Error;
        // handle errors here
      }
    },
    [nestedDataManager, params.treeViewDataSource, instance],
  );

  const fetchItemChildren = React.useCallback(
    async (id: TreeViewItemId) => {
      const getChildrenCount = params.treeViewDataSource?.getChildrenCount || (() => 0);

      const getTreeItems = params.treeViewDataSource?.getTreeItems;
      if (!getTreeItems) {
        nestedDataManager.clearPendingRequest(id);
        return;
      }

      const parent = instance.getItemMeta(id);
      if (!parent) {
        nestedDataManager.clearPendingRequest(id);
        return;
      }

      const depth = parent.depth ? parent.depth + 1 : 1;

      // handle caching here
      // error handling here

      try {
        const getTreeItemsResponse = await getTreeItems(id);

        // set loading state
        nestedDataManager.setRequestSettled(id);

        // set caching

        // update the items in the state -> need to write a method for this in useTreeViewItems
        instance.addItems({ items: getTreeItemsResponse, depth, parentId: id, getChildrenCount });
      } catch (error) {
        const childrenFetchError = error as Error;
        // handle errors here
      } finally {
        // unset loading
        nestedDataManager.setRequestSettled(id);
      }
    },
    [nestedDataManager, params.treeViewDataSource, instance],
  );

  React.useEffect(() => {
    fetchItems();
  }, []);

  return {
    instance: { fetchItemChildren, fetchItems },
    publicAPI: {},
    contextValue: { lazyLoading: params.treeViewDataSource !== undefined },
  };
};

// useTreeViewLazyLoading.itemPlugin = useTreeViewLabelItemPlugin;

useTreeViewLazyLoading.getDefaultizedParams = ({ params, experimentalFeatures }) => {
  const canUseFeature = experimentalFeatures?.lazyLoading;
  if (process.env.NODE_ENV !== 'production') {
    if (params.treeViewDataSource && !canUseFeature) {
      warnOnce([
        'MUI X: The label editing feature requires the `labelEditing` experimental feature to be enabled.',
        'You can do it by passing `experimentalFeatures={{ labelEditing: true}}` to the Rich Tree View Pro component.',
        'Check the documentation for more details: https://mui.com/x/react-tree-view/rich-tree-view/editing/',
      ]);
    }
  }
  const defaultDataSource = params?.treeViewDataSource || {
    getChildrenCount: () => 0,
    getTreeItems: () => Promise.resolve([]),
  };

  return {
    ...params,
    treeViewDataSource: canUseFeature ? defaultDataSource : {},
  };
};

useTreeViewLazyLoading.getInitialState = () => ({});

useTreeViewLazyLoading.params = {
  treeViewDataSource: true,
  treeViewDataSourceCache: true,
};
