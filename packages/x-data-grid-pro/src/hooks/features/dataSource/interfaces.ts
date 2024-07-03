import { GridRowId } from '@mui/x-data-grid';
import { GridDataSourceCache } from '../../../models';

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
   * Fetches the rows from the server for a given `parentId`.
   * If no `parentId` is provided, it fetches the root rows.
   * @param {string} parentId The id of the group to be fetched.
   */
  fetchRows: (parentId?: GridRowId) => void;
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
