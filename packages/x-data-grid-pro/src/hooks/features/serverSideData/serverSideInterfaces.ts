import { GridRowId } from '@mui/x-data-grid';
import { GridGetRowsParams, GridGetRowsResponse } from '../../../models';

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
   * Enqueues the fetch of the children of a row.
   * @param {GridRowId} id The id of the rowNode belonging to the group to be fetched.
   */
  enqueueChildrenFetch: (id: GridRowId) => void;
}

export interface GridDataSourcePrivateApi {
  /**
   * Initiates the fetch of the children of a row.
   * @param {string} id The id of the rowNode belonging to the group to be fetched.
   */
  fetchRowChildren: (id: GridRowId) => void;
  /**
   * Resets the server side state.
   */
  resetServerSideState: () => void;
}

/**
 * The server side cache API interface that is available in the grid [[apiRef]].
 */
export interface GridServerSideCacheApi {
  /**
   * Get data from the cache
   * @param {GridGetRowsParams} params The params of type `GridGetRowsParams`.
   * @returns {GridGetRowsResponse | undefined} The data of type `GridGetRowsResponse` or `undefined` for cache miss.
   */
  getCacheData: (params: GridGetRowsParams) => GridGetRowsResponse | undefined;
  /**
   * Set data in the cache
   * @param {GridGetRowsParams} params The params of type [[GridGetRowsParams]].
   * @param {GridGetRowsResponse} data The data of type [[GridGetRowsResponse]].
   */
  setCacheData: (params: GridGetRowsParams, data: GridGetRowsResponse) => void;
  /**
   * Clear the cache
   */
  clearCache: () => void;
}
