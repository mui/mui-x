import type {
  GridDataSourceCache,
  GridGetRowsParams,
  GridUpdateRowParams,
} from '../../../models/gridDataSource';
import type { GridRowId, GridRowModel } from '../../../models/gridRows';
import type { GridDataSourceCacheDefaultConfig } from './cache';

export interface GridDataSourceApiBase {
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
  /**
   * Syncs the row with the server and updates in the grid.
   * @param {GridUpdateRowParams} params The parameters for the edit operation.
   * @returns {Promise<GridRowModel> | undefined} The updated row or `undefined` if `dataSource.updateRow` is not passed.
   */
  editRow: (params: GridUpdateRowParams) => Promise<GridRowModel> | undefined;
}

export interface GridDataSourceApi {
  /**
   * The data source API.
   */
  dataSource: GridDataSourceApiBase;
}

export interface GridDataSourceBaseOptions {
  cacheOptions?: GridDataSourceCacheDefaultConfig;
  fetchRowChildren?: (parents: GridRowId[]) => void;
  clearDataSourceState?: () => void;
  handleEditRow?: (params: GridUpdateRowParams, updatedRow: GridRowModel) => void;
}
