import { DefaultizedProps } from '@mui/x-internals/types';
import { TreeViewPluginSignature } from '../../models';
import { DataSourceCache } from '../../../utils';
import { TreeViewItemId } from '../../../models';
import { UseTreeViewItemsSignature } from '../useTreeViewItems';
import { UseTreeViewExpansionSignature } from '../useTreeViewExpansion';
import { UseTreeViewSelectionSignature } from '../useTreeViewSelection';

type DataSource<R extends {}> = {
  /**
   * Used to determine the number of children the item has.
   * Only relevant for lazy-loaded trees.
   *
   * @template R
   * @param {R} item The item to check.
   * @returns {number} The number of children.
   */
  getChildrenCount: (item: R) => number;
  /**
   * Method used for fetching the items.
   * Only relevant for lazy-loaded tree views.
   *
   * @template R
   * @param {TreeViewItemId} parentId The id of the item the children belong to.
   * @returns { Promise<R[]>} The children of the item.
   */
  getTreeItems: (parentId?: TreeViewItemId) => Promise<R[]>;
};

export interface UseTreeViewLazyLoadingPublicAPI {}

export interface UseTreeViewLazyLoadingInstance extends UseTreeViewLazyLoadingPublicAPI {
  /**
   * Method used for fetching multiple items concurrently.
   * Only relevant for lazy-loaded tree views.
   *
   * @param {TreeViewItemId[]} parentIds The ids of the items to fetch the children of.
   * @returns { Promise<void>} The children of the items.
   */
  fetchItems: (parentIds?: TreeViewItemId[]) => Promise<void>;
  /**
   * Method used for fetching and item's children.
   * Only relevant for lazy-loaded tree views.
   *
   * @param {TreeViewItemId} itemId The The id of the item to fetch the children of.
   * @returns { Promise<void>} The children of the item.
   */
  fetchItemChildren: (itemId: TreeViewItemId) => Promise<void>;
  /**
   * Set the loading state of an item.
   * @param {TreeViewItemId} itemId The id of the item to set the loading state of.
   * @param {boolean} isLoading True if the item is loading.
   */
  setDataSourceLoading: (itemId: TreeViewItemId, isLoading: boolean) => void;
  /**
   * Set the error state of an item.
   * @param {TreeViewItemId} itemId The id of the item to set the error state of.
   * @param {Error | null} error The error caught on the item.
   */
  setDataSourceError: (itemId: TreeViewItemId, error: Error | null) => void;
}

export interface UseTreeViewLazyLoadingParameters<R extends {}> {
  dataSource?: DataSource<R>;
  dataSourceCache?: DataSourceCache;
}
export type UseTreeViewLazyLoadingParametersWithDefaults<R extends {}> = DefaultizedProps<
  UseTreeViewLazyLoadingParameters<R>,
  'dataSource'
>;

export interface UseTreeViewLazyLoadingState {
  lazyLoading: {
    enabled: boolean;
    dataSource: {
      loading: Record<TreeViewItemId, boolean>;
      errors: Record<TreeViewItemId, Error | null>;
    };
  };
}

export type UseTreeViewLazyLoadingSignature = TreeViewPluginSignature<{
  params: UseTreeViewLazyLoadingParameters<any>;
  paramsWithDefaults: UseTreeViewLazyLoadingParametersWithDefaults<any>;
  publicAPI: UseTreeViewLazyLoadingPublicAPI;
  instance: UseTreeViewLazyLoadingInstance;
  state: UseTreeViewLazyLoadingState;
  dependencies: [
    UseTreeViewItemsSignature,
    UseTreeViewExpansionSignature,
    UseTreeViewSelectionSignature,
  ];
}>;
