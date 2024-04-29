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
   * Set the fetched children state of a row.
   * @param {string} id The id of the rowNode.
   * @param {boolean} childrenFetched The children to set.
   */
  setChildrenFetched: (id: GridRowId, childrenFetched: boolean) => void;
  /**
   * Fetches the top level rows.
   */
  fetchTopLevelRows: () => void;
}

/**
 * The server side cache API interface that is available in the grid [[apiRef]].
 */
export interface GridServerSideCacheApi {
  /**
   * Tries to search for some data in cache
   * @param {GridGetRowsParams} params The params of type [[GridGetRowsParams]].
   * @returns {GridGetRowsResponse | null} The data of type [[GridGetRowsResponse]] or `null` for cache miss.
   */
  getCacheData: (params: GridGetRowsParams) => unknown;
  /**
   * Tries to search for some data in cache
   * @param {GridGetRowsParams} params The params of type [[GridGetRowsParams]].
   * @param {GridGetRowsResponse} data The data of type [[GridGetRowsResponse]].
   */
  setCacheData: (params: GridGetRowsParams, data: GridGetRowsResponse) => void;
  /**
   * Clears the cache.
   */
  clearCache: () => void;
}
