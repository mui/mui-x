import type {
  GridDataSourceCache,
  GridGetRowsParams,
  GridUpdateRowParams,
  GridGetRowsOptions,
} from '../../../models/gridDataSource';
import type { GridRowId, GridRowModel } from '../../../models/gridRows';
import type { GridDataSourceCacheDefaultConfig } from './cache';

/**
 * The parameters for the `fetchRows` method.
 */
export type GridDataSourceFetchRowsParams<T> = Partial<T> & GridGetRowsOptions;

export interface GridDataSourceFetchRowChildrenOptions {
  showChildrenLoading?: boolean;
}

export interface GridDataSourceApi {
  /**
   * The data source API.
   */
  dataSource: {
    /**
     * Fetches the rows from the server.
     * If no `parentId` option is provided, it fetches the root rows.
     * Any missing parameter from `params` will be filled from the state (sorting, filtering, etc.).
     * @param {GridRowId} parentId The id of the parent node (default: `GRID_ROOT_GROUP_ID`).
     * @param {GridDataSourceFetchRowsParams<GridGetRowsParams>} params Request parameters override.
     * @returns {Promise<void>} A promise that resolves when the rows are fetched.
     */
    fetchRows: (
      parentId?: GridRowId,
      params?: GridDataSourceFetchRowsParams<GridGetRowsParams>,
    ) => Promise<void>;
    /**
     * The data source cache object.
     */
    cache: GridDataSourceCache;
    /**
     * Syncs the row with the server and updates in the grid.
     * @param {GridUpdateRowParams} params The parameters for the edit operation.
     * @returns {Promise<GridRowModel> | undefined} The updated row or `undefined` if `dataSource.updateRow` is not passed.
     */
    editRow: (params: GridUpdateRowParams) => Promise<GridRowModel> | undefined;
  };
}

export interface GridDataSourceApiBase {
  fetchRows: GridDataSourceApi['dataSource']['fetchRows'];
  cache: GridDataSourceApi['dataSource']['cache'];
  editRow: GridDataSourceApi['dataSource']['editRow'];
}

export interface GridDataSourceBaseOptions {
  cacheOptions?: GridDataSourceCacheDefaultConfig;
  fetchRowChildren?: (
    parents: GridRowId[],
    options?: GridDataSourceFetchRowChildrenOptions,
  ) => void;
  clearDataSourceState?: () => void;
  handleEditRow?: (params: GridUpdateRowParams, updatedRow: GridRowModel) => void;
}
