import { GridRowId } from '@mui/x-data-grid';
import { GridDataSourceCache, GridGetRowsParams } from '@mui/x-data-grid/internals';

export interface GridDataSourceState {
  loading: Record<GridRowId, boolean>;
  errors: Record<GridRowId, any>;
}

/**
 * The base data source API interface that is available in the grid [[apiRef]].
 */
export interface GridDataSourceApiBase {
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
   * Fetches the rows from the server.
   * If no `parentId` option is provided, it fetches the root rows.
   * Any missing parameter from `params` will be filled from the state (sorting, filtering, etc.).
   * @param {GridRowId} parentId The id of the parent node (default: `GRID_ROOT_GROUP_ID`).
   * @param {Partial<GridGetRowsParams>} params Request parameters override.
   */
  fetchRows: (parentId?: GridRowId, params?: Partial<GridGetRowsParams>) => void;
  /**
   * The data source cache object.
   */
  cache: GridDataSourceCache;
}

export interface GridDataSourceApi {
  /**
   * The data source API.
   */
  unstable_dataSource: GridDataSourceApiBase;
}
export interface GridDataSourcePrivateApi {
  /**
   * Initiates the fetch of the children of a row.
   * @param {string} id The id of the group to be fetched.
   */
  fetchRowChildren: (id: GridRowId) => void;
  /**
   * Resets the data source state.
   */
  resetDataSourceState: () => void;
}
