import { GridRowModel } from '@mui/x-data-grid';

/**
 * Object passed as parameter of the row order change event.
 */
export interface GridRowOrderChangeParams {
  /**
   * The row data.
   */
  row: GridRowModel | null;
  /**
   * The target row index.
   */
  targetIndex: number;
  /**
   * The old row index.
   */
  oldIndex: number;
}
