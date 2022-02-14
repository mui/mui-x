import { GridColumns } from '@mui/x-data-grid';
import { GridApiPro } from './gridApiPro';

/**
 * Object passed as parameter in the onRowsScrollEnd callback.
 */
export interface GridRowScrollEndParams {
  /**
   * The number of rows that fit in the viewport.
   */
  viewportPageSize: number;
  /**
   * The number of rows allocated for the rendered zone.
   */
  virtualRowsCount: number;
  /**
   * The grid visible columns.
   */
  visibleColumns: GridColumns<GridApiPro>;
}
