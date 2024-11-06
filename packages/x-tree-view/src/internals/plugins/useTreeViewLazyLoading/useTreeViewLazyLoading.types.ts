import { DefaultizedProps, TreeViewPluginSignature } from '../../models';
import { UseTreeViewItemsSignature } from '../useTreeViewItems';
import { TreeViewDataSourceCache } from './cache';
import { TreeViewItemId } from '../../../models';

type TreeViewDataSource<R extends {}> = {
  /**
   * Used to determine the number of children the item has.
   * Only relevant for lazy-loaded trees.
   *
   * @template R
   * @param {R} item The item to check.
   * @returns {number} The number of children.
   * @default (item) => number
   */
  getChildrenCount?: (item: R) => number;
  getTreeItems?: (parentId?: TreeViewItemId) => Promise<R[]>;
};

export interface UseTreeViewLazyLoadingPublicAPI {}

export interface UseTreeViewLazyLoadingInstance extends UseTreeViewLazyLoadingPublicAPI {
  fetchItems: (parentIds?: TreeViewItemId[]) => void;
  fetchItemChildren: (id: TreeViewItemId) => void;
  isLazyLoadingEnabled: boolean;
  isTreeItemLoading: (itemId: TreeViewItemId) => boolean;
  setDataSourceLoading: (itemId: TreeViewItemId, isLoading: boolean) => void;
  setDataSourceError: (itemId: TreeViewItemId, error: Error | null) => void;
  getTreeItemError: (itemId: TreeViewItemId) => Error | null;
}

export interface UseTreeViewLazyLoadingParameters<R extends {}> {
  treeViewDataSource: TreeViewDataSource<R>;
  treeViewDataSourceCache?: TreeViewDataSourceCache;
}
export type UseTreeViewLazyLoadingDefaultizedParameters<R extends {}> = DefaultizedProps<
  UseTreeViewLazyLoadingParameters<R>,
  'treeViewDataSource'
>;

interface UseTreeViewLazyLoadingContextValue {
  lazyLoading: boolean;
}

export interface UseTreeViewLazyLoadingState {
  dataSource: {
    loading: Record<TreeViewItemId, boolean>;
    errors: Record<TreeViewItemId, any>;
  };
}
export type UseTreeViewLazyLoadingSignature = TreeViewPluginSignature<{
  params: UseTreeViewLazyLoadingParameters<any>;
  defaultizedParams: UseTreeViewLazyLoadingDefaultizedParameters<any>;
  publicAPI: UseTreeViewLazyLoadingPublicAPI;
  instance: UseTreeViewLazyLoadingInstance;
  state: UseTreeViewLazyLoadingState;
  experimentalFeatures: 'lazyLoading';
  dependencies: [UseTreeViewItemsSignature];
  contextValue: UseTreeViewLazyLoadingContextValue;
}>;
