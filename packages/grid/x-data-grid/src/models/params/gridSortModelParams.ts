import { GridColumns } from '../colDef/gridColDef';
import { GridSortModel } from '../gridSortModel';

/**
 * Object passed as parameter of the column sorted event.
 */
export interface GridSortModelParams {
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
   * @deprecated Use the `apiRef` returned by `useGridApiContext` or `useGridApiRef` (only available in `@mui/x-data-grid-pro`)
   */
  api: any;
}
