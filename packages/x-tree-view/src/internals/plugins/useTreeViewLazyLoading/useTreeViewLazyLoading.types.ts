import { DefaultizedProps } from '@mui/x-internals/types';
import { TreeViewPluginSignature } from '../../models';
import { DataSourceCache } from '../../../utils';
import { TreeViewItemId } from '../../../models';
import { UseTreeViewItemsSignature } from '../useTreeViewItems';
import { UseTreeViewExpansionSignature } from '../useTreeViewExpansion';

type DataSource<R extends {}> = {
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
  /**
   * Method used for fetching the items.
   * Only relevant for lazy-loaded tree views.
   *
   * @template R
   * @param {TreeViewItemId} parentId The id of the item the children belong to.
   * @returns { Promise<R[]>} The children of the item.
   */
  getTreeItems?: (parentId?: TreeViewItemId) => Promise<R[]>;
};

export interface UseTreeViewLazyLoadingPublicAPI {}

export interface UseTreeViewLazyLoadingInstance extends UseTreeViewLazyLoadingPublicAPI {
  fetchItems: (parentIds?: TreeViewItemId[]) => Promise<void>;
  fetchItemChildren: (id: TreeViewItemId) => Promise<void>;
  isLazyLoadingEnabled: boolean;
  setDataSourceLoading: (itemId: TreeViewItemId, isLoading: boolean) => void;
  setDataSourceError: (itemId: TreeViewItemId, error: Error | null) => void;
}

export interface UseTreeViewLazyLoadingParameters<R extends {}> {
  dataSource?: DataSource<R>;
  dataSourceCache?: DataSourceCache;
}
export type UseTreeViewLazyLoadingDefaultizedParameters<R extends {}> = DefaultizedProps<
  UseTreeViewLazyLoadingParameters<R>,
  'dataSource'
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
  dependencies: [UseTreeViewItemsSignature, UseTreeViewExpansionSignature];
  contextValue: UseTreeViewLazyLoadingContextValue;
}>;
