import { GridRowId, GridRowModel } from '../gridRows';

/**
 * Object passed as parameter in the column [[GridColDef]] cell renderer.
 */
export interface GridRowParams {
  /**
   * The grid row id.
   */
  id: GridRowId;
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: GridRowModel;
  /**
   * All grid columns.
   */
  columns: any;
  /**
   * GridApiRef that let you manipulate the grid.
   */
  api: any;
}
