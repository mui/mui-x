import { GridRowId } from '@mui/x-data-grid';
import { GridDataSourceCache } from '../../../models';

export interface GridDataSourceInternalCache {
  groupKeys: any[];
}

export interface GridDataSourceState {
  loading: Record<GridRowId, boolean>;
  errors: Record<GridRowId, any>;
}

/**
 * The dataSource API interface that is available in the grid [[apiRef]].
 */
export interface GridDataSourceApi {
  /**
   * Set the loading state of a parent row.
   * @param {string} parentId The id of the parent node.
   * @param {boolean} loading The loading state to set.
   */
  setChildrenLoading: (parentId: GridRowId, loading: boolean) => void;
  /**
   * Set error occured while fetching the children of a row.
   * @param {string} parentId The id of the parent node.
   * @param {Error} error The error of type `Error` or `null`.
   */
  setChildrenFetchError: (parentId: GridRowId, error: Error | null) => void;
  /**
   * Fetch/refetch the top level rows.
   */
  fetchTopLevelRows: () => void;
  /**
   * Adds the fetch of the children of a row to queue.
   * @param {GridRowId} id The id of the rowNode belonging to the group to be fetched.
   */
  queueChildrenFetch: (id: GridRowId) => void;
}

export interface GridDataSourcePrivateApi {
  /**
   * Initiates the fetch of the children of a row.
   * @param {string} id The id of the rowNode belonging to the group to be fetched.
   */
  fetchRowChildren: (id: GridRowId) => void;
  /**
   * Resets the data source state.
   */
  resetDataSourceState: () => void;
}

/**
 * The data source cache API interface that is available in the grid [[apiRef]].
 */
export interface GridDataSourceCacheApi {
  /**
   * Data source cache object.
   */
  unstable_dataSourceCache: GridDataSourceCache | null;
}
