import { GridDataSourceCache, GridGetRowsParams } from '../../../models/gridDataSource';
import { GridRowId, GridRowModel } from '../../../models/gridRows';

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
}

export interface GridDataSourceApi {
  /**
   * The data source API.
   */
  dataSource: GridDataSourceApiBase;
}

export interface GridDataSourcePrivateApi {
  /**
   * Mutates a row in the cache.
   * @param {GridRowId} id The id of the row to be mutated.
   * @param {GridRowModel} row The row to be mutated.
   */
  mutateRowInCache: (id: GridRowId, row: GridRowModel) => void;
}
