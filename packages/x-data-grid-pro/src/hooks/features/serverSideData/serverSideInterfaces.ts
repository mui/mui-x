import { GridRowId } from '@mui/x-data-grid';
import { GridGetRowsParams, GridGetRowsResponse } from '../../../models';

/**
 * The dataSource API interface that is available in the grid [[apiRef]].
 */
export interface GridDataSourceApi {
  /**
   * Initiates the fetch of the children of a row.
   * @param {string} id The id of the rowNode belonging to the group to be fetched.
   */
  fetchRowChildren: (id: GridRowId) => void;
  /**
   * Set the loading state of a row.
   * @param {string} id The id of the rowNode.
   * @param {boolean} loading The loading state to set.
   */
  setRowLoading: (id: GridRowId, loading: boolean) => void;
  /**
   * Fetches the top level rows.
   */
  fetchTopLevelRows: () => void;
  /**
   * Enqueues the fetch of the children of a row.
   * @param {GridRowId} id The id of the rowNode belonging to the group to be fetched.
   */
  enqueueChildrenFetch: (id: GridRowId) => void;
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
