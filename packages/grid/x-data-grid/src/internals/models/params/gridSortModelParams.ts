import { GridColumns } from '../colDef/gridColDef';
import { GridSortModel } from '../gridSortModel';
import type { GridApiCommon } from '../api';
import type { GridApiCommunity } from '../api/gridApiCommunity';

/**
 * Object passed as parameter of the column sorted event.
 */
export interface GridSortModelParams<Api extends GridApiCommon = GridApiCommunity> {
  /**
   * The sort model used to sort the grid.
   */
  sortModel: GridSortModel;
  /**
   * The full set of columns.
   */
  columns: GridColumns;
  /**
   * Api that let you manipulate the grid.
   */
  api: Api;
}
