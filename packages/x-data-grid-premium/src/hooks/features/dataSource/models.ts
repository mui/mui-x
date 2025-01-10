import type {
  GridColDef,
  GridRowId,
  GridValidRowModel,
  GridDataSource,
  GridGetRowsResponse,
  GridGetRowsParams,
  GridDataSourceApiBase,
  GridDataSourcePrivateApi,
} from '@mui/x-data-grid-pro';

import type { GridAggregationModel } from '../aggregation/gridAggregationInterfaces';

export interface GridGetRowsResponsePremium extends GridGetRowsResponse {
  /**
   * Row to be used for aggregation footer row.
   * It must provide the values for the aggregated columns passed in
   * `GridGetRowsParams.aggregationModel`.
   */
  aggregateRow?: GridValidRowModel;
}

export interface GridGetRowsParamsPremium extends GridGetRowsParams {
  aggregationModel?: GridAggregationModel;
}

export interface GridDataSourcePremium extends Omit<GridDataSource, 'getRows'> {
  /**
   * This method will be called when the grid needs to fetch some rows.
   * @param {GridGetRowsParamsPremium} params The parameters required to fetch the rows.
   * @returns {Promise<GridGetRowsResponsePremium>} A promise that resolves to the data of type [GridGetRowsResponsePremium].
   */
  getRows(params: GridGetRowsParamsPremium): Promise<GridGetRowsResponsePremium>;
  /**
   * Used to get the aggregated value for a parent row.
   * @param {GridValidRowModel} row The row to extract the aggregated value from.
   * @param {GridColDef['field']} field The field to extract the aggregated value for.
   * @returns {string} The aggregated value for a specific aggregated column.
   */
  getAggregatedValue?: (row: GridValidRowModel, field: GridColDef['field']) => string;
}

export interface GridDataSourceApiBasePremium extends Omit<GridDataSourceApiBase, 'fetchRows'> {
  /**
   * Fetches the rows from the server.
   * If no `parentId` option is provided, it fetches the root rows.
   * Any missing parameter from `params` will be filled from the state (sorting, filtering, etc.).
   * @param {GridRowId} parentId The id of the parent node (default: `GRID_ROOT_GROUP_ID`).
   * @param {Partial<GridGetRowsParamsPremium>} params Request parameters override.
   */
  fetchRows: (parentId?: GridRowId, params?: Partial<GridGetRowsParamsPremium>) => void;
}

export interface GridDataSourceApiPremium {
  /**
   * The data source API.
   */
  unstable_dataSource: GridDataSourceApiBasePremium;
}

export interface GridDataSourcePremiumPrivateApi extends GridDataSourcePrivateApi {
  resolveGroupAggregation: (groupId: GridRowId, field: string) => any;
}
